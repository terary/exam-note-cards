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

interface VocabEntry {
  term: string;
  definition: string;
  lineNumber: number;
}

function extractSectionInfo(filename: string): {
  sectionNumber: string;
  sectionName: string;
  databaseName: string;
  databaseId: string;
} {
  // Examples:
  // x100009-section-9-mlops-with-aws-0197-0232-vocab.md -> Section 9 - MLOps Vocabulary
  // 100008-section-8-building-gen-ai-apps-with-bedrock-0181-0196-vocab.md -> Section 8 - Building Gen AI Apps with Bedrock Vocabulary
  
  const withoutExtension = basename(filename, ".md");
  const withoutSuffix = withoutExtension.replace(/-vocab$/, "");
  
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
  const databaseName = `Section ${sectionNumber} - ${sectionName} Vocabulary`;
  
  // Generate database ID (e.g., "database-section-9-MLOps-vocabulary")
  const databaseId = `database-section-${sectionNumber}-${sectionName.replace(/\s+/g, "")}-vocabulary`;
  
  return { sectionNumber, sectionName, databaseName, databaseId };
}

function parseVocabFile(content: string, filename: string): {
  entries: VocabEntry[];
  errors: string[];
} {
  const lines = content.split("\n");
  const entries: VocabEntry[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    // Skip empty lines and headers
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    
    // Match bullet point format: - `Term` - Definition
    // Also handle: - aws `Term` - Definition or - `Term` or `Term` - Definition
    // Also handle: - `Term` (notes) - Definition or - `Term` or `Term2` - Definition
    // Also handle: - `Term` (score) 0206/3:40 - Definition (with reference numbers)
    // Match pattern: - [optional prefix] `Term` [optional (notes) or `Term2`] [optional reference] - Definition
    const bulletMatch = trimmed.match(/^-\s*(?:[^\s`]+\s+)?`([^`]+)`(?:\s+or\s+(?:maybe\s+)?`[^`]+`)?(?:\s+\([^)]+\))?(?:\s+\d+\/\d+:\d+)?\s*-\s*(.+)$/);
    const altMatch = trimmed.match(/^`([^`]+)`(?:\s+or\s+(?:maybe\s+)?`[^`]+`)?(?:\s+\([^)]+\))?(?:\s+\d+\/\d+:\d+)?\s*-\s*(.+)$/);
    
    if (bulletMatch) {
      const term = bulletMatch[1].trim();
      const definition = bulletMatch[2].trim();
      
      if (!term) {
        errors.push(`Line ${lineNumber}: Term is empty`);
        continue;
      }
      
      if (!definition) {
        errors.push(`Line ${lineNumber}: Definition is empty for term "${term}"`);
        continue;
      }
      
      entries.push({ term, definition, lineNumber });
    } else if (altMatch) {
      const term = altMatch[1].trim();
      const definition = altMatch[2].trim();
      
      if (!term) {
        errors.push(`Line ${lineNumber}: Term is empty`);
        continue;
      }
      
      if (!definition) {
        errors.push(`Line ${lineNumber}: Definition is empty for term "${term}"`);
        continue;
      }
      
      entries.push({ term, definition, lineNumber });
    } else if (trimmed.startsWith("-")) {
      // Bullet point but doesn't match expected format
      errors.push(`Line ${lineNumber}: Invalid format - expected "- \`Term\` - Definition" or "- prefix \`Term\` - Definition"`);
    }
  }
  
  return { entries, errors };
}

function generateQuestionsFromVocab(
  entries: VocabEntry[],
  sectionNumber: string
): Question[] {
  const questions: Question[] = [];
  
  for (const entry of entries) {
    // Question 1: "What is \"Term\"?"
    questions.push({
      questionId: uuid(),
      questionText: `What is "${entry.term}"?`,
      answerText: `${entry.term} - ${entry.definition}`,
      tags: ["vocabulary", `section-${sectionNumber}`],
      domains: ["vocabulary"],
    });
    
    // Question 2: Fill in the blank format
    // Try to create a fill-in-the-blank question from the definition
    let fillInBlank: string;
    
    // Remove backticks and clean up the term for matching
    const cleanTerm = entry.term.replace(/`/g, "").trim();
    const definitionLower = entry.definition.toLowerCase();
    const termLower = cleanTerm.toLowerCase();
    
    // Check if definition starts with the term (case-insensitive)
    if (definitionLower.startsWith(termLower)) {
      // Definition starts with term, remove it and use "_____" prefix
      const remaining = entry.definition.substring(cleanTerm.length).trim();
      // Remove leading articles and verbs if present
      let cleaned = remaining.replace(/^\s*(is|are|was|were|a|an|the)\s+/i, "").trim();
      // If nothing left after removing articles, just use the remaining text as-is
      if (!cleaned) {
        cleaned = remaining;
      }
      fillInBlank = `_____ ${cleaned}`;
    } else if (definitionLower.includes(termLower)) {
      // Term appears in definition, replace all instances with "_____"
      // Escape special regex characters in the term
      const escapedTerm = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedTerm, "gi");
      fillInBlank = entry.definition.replace(regex, "_____");
    } else {
      // Term not in definition, use standard format
      fillInBlank = `_____ is ${entry.definition}`;
    }
    
    questions.push({
      questionId: uuid(),
      questionText: `Fill in the blank: ${fillInBlank}`,
      answerText: cleanTerm,
      tags: ["vocabulary", `section-${sectionNumber}`],
      domains: ["vocabulary"],
    });
  }
  
  return questions;
}

async function processVocabFile(
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
    
    // Parse vocab entries
    const { entries, errors } = parseVocabFile(content, filename);
    
    // Report parsing errors
    if (errors.length > 0) {
      logger.error(`\n  Parsing failed with ${errors.length} error(s):`);
      for (const error of errors) {
        logger.error(`    ${error}`);
      }
      logger.error(`\n  Please fix the errors in ${filename} before generating the database.\n`);
      return false;
    }
    
    if (entries.length === 0) {
      logger.warn(`  No valid vocab entries found in ${filename}`);
      return false;
    }
    
    logger.log(`  Found ${entries.length} vocab entry/entries`);
    
    // Check if database already exists
    const outputPath = join(process.cwd(), "databases", `${sectionInfo.databaseId}.json`);
    if (existsSync(outputPath) && !force) {
      logger.warn(`  Database file already exists: ${sectionInfo.databaseId}.json`);
      logger.warn(`  Skipping. Use --force to overwrite.\n`);
      return false;
    }
    
    // Generate questions from vocab entries
    const questions = generateQuestionsFromVocab(entries, sectionInfo.sectionNumber);
    
    // Create database structure
    const database = {
      databaseName: sectionInfo.databaseName,
      databaseId: sectionInfo.databaseId,
      questionsWithAnswers: questions,
    };
    
    // Write JSON file
    writeFileSync(outputPath, JSON.stringify(database, null, 2), "utf8");
    
    logger.log(`  Generated: ${outputPath}`);
    logger.log(`  Database name: ${database.databaseName}`);
    logger.log(`  Questions: ${database.questionsWithAnswers.length} (${entries.length} terms × 2 question types)\n`);
    
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to process ${filename}: ${message}`);
    return false;
  }
}

async function main() {
  const logger = new Logger("GenerateVocabDatabase");
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
    
    // Ensure it ends with -vocab.md
    if (!targetFilename.endsWith("-vocab.md")) {
      if (targetFilename.endsWith(".md")) {
        targetFilename = targetFilename.replace(/\.md$/, "-vocab.md");
      } else {
        targetFilename = `${targetFilename}-vocab.md`;
      }
    }
  } else {
    // Find all -vocab.md files and show unprocessed ones
    const allFiles = readdirSync(writeupsDir, { withFileTypes: true }).filter(
      (entry) =>
        entry.isFile() &&
        extname(entry.name).toLowerCase() === ".md" &&
        entry.name.endsWith("-vocab.md")
    );
    
    if (allFiles.length === 0) {
      logger.warn(`No -vocab.md files found in ${writeupsDir}`);
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
      logger.log(`All -vocab.md files have been processed.`);
      logger.log(`Use: npm run generate:vocab <filename> to process a specific file.`);
      logger.log(`Use: npm run generate:vocab <filename> -- --force to overwrite an existing database.\n`);
      return;
    }
    
    logger.log(`Found ${unprocessedFiles.length} unprocessed file(s):\n`);
    unprocessedFiles.forEach((file, index) => {
      logger.log(`  ${index + 1}. ${file}`);
    });
    logger.log(`\nPlease specify a filename to process:`);
    logger.log(`  npm run generate:vocab <filename>\n`);
    logger.log(`Example:`);
    logger.log(`  npm run generate:vocab ${unprocessedFiles[0]}\n`);
    process.exit(1);
  }
  
  // Process the specified file
  const filePath = join(writeupsDir, targetFilename);
  
  if (!existsSync(filePath)) {
    logger.error(`File not found: ${targetFilename}`);
    logger.error(`Expected path: ${filePath}`);
    process.exit(1);
  }
  
  if (!targetFilename.endsWith("-vocab.md")) {
    logger.error(`File must end with '-vocab.md'`);
    logger.error(`Provided: ${targetFilename}`);
    process.exit(1);
  }
  
  const success = await processVocabFile(filePath, targetFilename, logger, force);
  
  if (!success) {
    process.exit(1);
  }
}

main();

