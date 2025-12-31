import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, basename, extname } from "path";
import { Logger } from "@nestjs/common";
import { v4 as uuid } from "uuid";

interface Question {
  questionId: string;
  questionText: string;
  answerText: string;
  tags: string[];
  domains: string[];
}

interface ValidationError {
  questionNumber: number;
  lineNumber: number;
  error: string;
}

interface ParsedQuestion {
  questionText: string;
  answerText: string;
  startLine: number;
  endLine: number;
}

function extractSectionInfo(filename: string): {
  sectionNumber: string;
  sectionName: string;
  databaseName: string;
  databaseId: string;
} {
  // Examples:
  // x100009-section-9-mlops-with-aws-0197-0232-questions-todo.md -> Section 9 - MLOps
  // 100008-section-8-building-gen-ai-apps-with-bedrock-0181-0196-questions-todo.md -> Section 8 - Building Gen AI Apps with Bedrock
  
  const withoutExtension = basename(filename, ".md");
  const withoutSuffix = withoutExtension.replace(/-questions-todo$/, "");
  
  // Extract section number (e.g., "section-9" -> "9")
  const sectionMatch = withoutSuffix.match(/section-(\d+)/i);
  const sectionNumber = sectionMatch ? sectionMatch[1] : "unknown";
  
  // Extract section name (everything after "section-X-")
  const sectionNameMatch = withoutSuffix.match(/section-\d+-(.+?)(?:-\d+)*$/i);
  let sectionName = sectionNameMatch ? sectionNameMatch[1] : "Unknown";
  
  // Convert kebab-case to Title Case
  sectionName = sectionName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  // Generate database name
  const databaseName = `Section ${sectionNumber} - ${sectionName}`;
  
  // Generate database ID (e.g., "database-section-9-MLOps")
  const databaseId = `database-section-${sectionNumber}-${sectionName.replace(/\s+/g, "")}`;
  
  return { sectionNumber, sectionName, databaseName, databaseId };
}

function parseQuestions(content: string, filename: string): {
  questions: ParsedQuestion[];
  errors: ValidationError[];
} {
  const lines = content.split("\n");
  const questions: ParsedQuestion[] = [];
  const errors: ValidationError[] = [];
  
  let currentQuestion: Partial<ParsedQuestion> | null = null;
  let questionNumber = 0;
  let inQuestion = false;
  let inAnswer = false;
  let questionStartLine = -1;
  let answerStartLine = -1;
  let questionTextLines: string[] = [];
  let answerTextLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    // Check for QUESTION X or QUESTION N marker (supports both formats)
    const questionMatch = line.trim().match(/^#### QUESTION (X|\d+)$/);
    if (questionMatch) {
      // If we were in a previous question, finalize it
      if (currentQuestion !== null) {
        const questionText = questionTextLines.join("\n").trim();
        const answerText = answerTextLines.join("\n").trim();
        
        questions.push({
          questionText,
          answerText,
          startLine: questionStartLine,
          endLine: i,
        });
        
        // Reset for next question
        currentQuestion = null;
        questionTextLines = [];
        answerTextLines = [];
      }
      
      questionNumber++;
      questionStartLine = lineNumber;
      inQuestion = true;
      inAnswer = false;
      currentQuestion = { startLine: questionStartLine };
      continue;
    }
    
    // Check for ANSWER X or ANSWER N marker (supports both formats)
    const answerMatch = line.trim().match(/^#### ANSWER (X|\d+)$/);
    if (answerMatch) {
      if (!inQuestion) {
        errors.push({
          questionNumber,
          lineNumber,
          error: "Found ANSWER without preceding QUESTION",
        });
        continue;
      }
      
      answerStartLine = lineNumber;
      inQuestion = false;
      inAnswer = true;
      continue;
    }
    
    // Check for END QUESTION marker
    if (line.trim() === "#### END QUESTION") {
      if (!inAnswer && !inQuestion) {
        errors.push({
          questionNumber,
          lineNumber,
          error: "Found END QUESTION without preceding QUESTION and ANSWER",
        });
        continue;
      }
      
      if (inQuestion && !inAnswer) {
        errors.push({
          questionNumber,
          lineNumber,
          error: "Found END QUESTION without ANSWER (missing answer section)",
        });
        continue;
      }
      
      // Finalize current question
      if (currentQuestion !== null) {
        const questionText = questionTextLines.join("\n").trim();
        const answerText = answerTextLines.join("\n").trim();
        
        questions.push({
          questionText,
          answerText,
          startLine: questionStartLine,
          endLine: lineNumber,
        });
        
        // Reset for next question
        currentQuestion = null;
        questionTextLines = [];
        answerTextLines = [];
        inQuestion = false;
        inAnswer = false;
      }
      continue;
    }
    
    // Collect question or answer text
    if (inQuestion && !inAnswer) {
      questionTextLines.push(line);
    } else if (inAnswer) {
      answerTextLines.push(line);
    }
  }
  
  // Check for any incomplete questions at the end
  if (currentQuestion !== null) {
    if (inQuestion && !inAnswer) {
      errors.push({
        questionNumber,
        lineNumber: lines.length,
        error: "Question missing ANSWER section",
      });
    } else if (inAnswer) {
      errors.push({
        questionNumber,
        lineNumber: lines.length,
        error: "Question missing END QUESTION marker",
      });
    }
  }
  
  // Check if last question is empty and remove it (ignore empty last question)
  if (questions.length > 0) {
    const lastQuestion = questions[questions.length - 1];
    if (!lastQuestion.questionText.trim() && !lastQuestion.answerText.trim()) {
      questions.pop();
    }
  }
  
  // Validate all questions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    
    // Validate question text
    if (!q.questionText || q.questionText.trim().length === 0) {
      errors.push({
        questionNumber: i + 1,
        lineNumber: q.startLine,
        error: "Question text is missing or empty",
      });
    }
    
    // Validate answer text
    if (!q.answerText || q.answerText.trim().length === 0) {
      errors.push({
        questionNumber: i + 1,
        lineNumber: q.startLine,
        error: "Answer text is missing or empty",
      });
    }
  }
  
  return { questions, errors };
}

function generateDatabase(
  questions: ParsedQuestion[],
  sectionInfo: ReturnType<typeof extractSectionInfo>
): { databaseName: string; databaseId: string; questionsWithAnswers: Question[] } {
  const { sectionNumber, databaseName, databaseId } = sectionInfo;
  
  const questionsWithAnswers: Question[] = questions.map((q) => ({
    questionId: uuid(),
    questionText: q.questionText.trim(),
    answerText: q.answerText.trim(),
    tags: [`section-${sectionNumber}`],
    domains: ["general"], // Default domain, can be enhanced later
  }));
  
  return { databaseName, databaseId, questionsWithAnswers };
}

async function processMarkdownFile(
  filePath: string,
  filename: string,
  logger: Logger,
  force: boolean = false
): Promise<boolean> {
  try {
    logger.log(`Processing: ${filename}`);
    
    const content = readFileSync(filePath, "utf8");
    const sectionInfo = extractSectionInfo(filename);
    
    logger.log(`  Section: ${sectionInfo.databaseName}`);
    
    // Check if database already exists
    const outputPath = join(process.cwd(), "databases", `${sectionInfo.databaseId}.json`);
    if (existsSync(outputPath) && !force) {
      logger.warn(`  Database file already exists: ${sectionInfo.databaseId}.json`);
      logger.warn(`  Skipping. Use --force to overwrite.\n`);
      return false;
    }
    
    // Parse and validate questions
    const { questions, errors } = parseQuestions(content, filename);
    
    // Report all validation errors
    if (errors.length > 0) {
      logger.error(`\n  Validation failed with ${errors.length} error(s):`);
      for (const error of errors) {
        logger.error(
          `    Question ${error.questionNumber} (line ${error.lineNumber}): ${error.error}`
        );
      }
      logger.error(`\n  Please fix the errors in ${filename} before generating the database.\n`);
      return false;
    }
    
    if (questions.length === 0) {
      logger.warn(`  No valid questions found in ${filename}`);
      return false;
    }
    
    logger.log(`  Found ${questions.length} valid question(s)`);
    
    // Generate database
    const database = generateDatabase(questions, sectionInfo);
    
    // Write JSON file
    writeFileSync(outputPath, JSON.stringify(database, null, 2), "utf8");
    
    logger.log(`  Generated: ${outputPath}`);
    logger.log(`  Database name: ${database.databaseName}`);
    logger.log(`  Questions: ${database.questionsWithAnswers.length}\n`);
    
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to process ${filename}: ${message}`);
    return false;
  }
}

async function main() {
  const logger = new Logger("GenerateDatabase");
  const writeupsDir = join(process.cwd(), "writeup-and-notes");
  const databasesDir = join(process.cwd(), "databases");
  
  if (!existsSync(writeupsDir)) {
    logger.error(`Directory '${writeupsDir}' does not exist`);
    process.exit(1);
  }
  
  if (!existsSync(databasesDir)) {
    logger.log(`Creating databases directory: ${databasesDir}`);
    mkdirSync(databasesDir, { recursive: true });
  }
  
  // Get filename from command line arguments
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");
  const filenameArg = args.find(arg => !arg.startsWith("--") && !arg.startsWith("-"));
  
  let targetFilename: string | null = null;
  
  if (filenameArg) {
    // Use provided filename
    targetFilename = filenameArg.endsWith(".md") ? filenameArg : `${filenameArg}.md`;
    
    // Ensure it ends with -questions-todo.md
    if (!targetFilename.endsWith("-questions-todo.md")) {
      if (targetFilename.endsWith(".md")) {
        targetFilename = targetFilename.replace(/\.md$/, "-questions-todo.md");
      } else {
        targetFilename = `${targetFilename}-questions-todo.md`;
      }
    }
  } else {
    // Find all -questions-todo.md files and show unprocessed ones
    const allFiles = readdirSync(writeupsDir, { withFileTypes: true }).filter(
      (entry) =>
        entry.isFile() &&
        extname(entry.name).toLowerCase() === ".md" &&
        entry.name.endsWith("-questions-todo.md")
    );
    
    if (allFiles.length === 0) {
      logger.warn(`No -questions-todo.md files found in ${writeupsDir}`);
      return;
    }
    
    // Find unprocessed files (those without corresponding database files)
    const unprocessedFiles: string[] = [];
    for (const fileEntry of allFiles) {
      const sectionInfo = extractSectionInfo(fileEntry.name);
      const databasePath = join(databasesDir, `${sectionInfo.databaseId}.json`);
      if (!existsSync(databasePath)) {
        unprocessedFiles.push(fileEntry.name);
      }
    }
    
    if (unprocessedFiles.length === 0) {
      logger.log(`All -questions-todo.md files have been processed.`);
      logger.log(`Use: npm run generate:database <filename> to process a specific file.`);
      logger.log(`Use: npm run generate:database <filename> --force to overwrite an existing database.\n`);
      return;
    }
    
    logger.log(`Found ${unprocessedFiles.length} unprocessed file(s):\n`);
    unprocessedFiles.forEach((file, index) => {
      logger.log(`  ${index + 1}. ${file}`);
    });
    logger.log(`\nPlease specify a filename to process:`);
    logger.log(`  npm run generate:database <filename>\n`);
    logger.log(`Example:`);
    logger.log(`  npm run generate:database ${unprocessedFiles[0]}\n`);
    process.exit(1);
  }
  
  // Process the specified file
  const filePath = join(writeupsDir, targetFilename);
  
  if (!existsSync(filePath)) {
    logger.error(`File not found: ${targetFilename}`);
    logger.error(`Expected path: ${filePath}`);
    process.exit(1);
  }
  
  if (!targetFilename.endsWith("-questions-todo.md")) {
    logger.error(`File must end with '-questions-todo.md'`);
    logger.error(`Provided: ${targetFilename}`);
    process.exit(1);
  }
  
  const success = await processMarkdownFile(filePath, targetFilename, logger, force);
  
  if (!success) {
    process.exit(1);
  }
}

main();

