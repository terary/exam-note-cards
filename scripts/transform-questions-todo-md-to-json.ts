/**
 * Transforms a -questions-todo.md file into a JSON question database.
 * Output is written to the same directory with .json extension.
 * Format matches databases/database-section-*.json (questionId, questionText, answerText, tags, domains).
 *
 * Usage: npm run transform:questions-todo <path-to-questions-todo.md>
 * Example: npm run transform:questions-todo writeup-and-notes/100003-section-3-transform-integrity-feature-0054-0089-questions-todo.md
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";

interface QuestionEntry {
  questionId: string;
  questionText: string;
  answerText: string;
  tags: string[];
  domains: string[];
}

interface ParsedQuestion {
  questionText: string;
  answerText: string;
  startLine: number;
  endLine: number;
}

interface ValidationError {
  questionNumber: number;
  lineNumber: number;
  error: string;
}

const DEFAULT_TAGS = ["chap2"];
const DEFAULT_DOMAINS = ["chap2"];

function parseQuestions(content: string): {
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
  let questionTextLines: string[] = [];
  let answerTextLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    const questionMatch = line.trim().match(/^#### QUESTION (X|\d+)$/);
    if (questionMatch) {
      if (currentQuestion !== null) {
        questions.push({
          questionText: questionTextLines.join("\n").trim(),
          answerText: answerTextLines.join("\n").trim(),
          startLine: questionStartLine,
          endLine: i,
        });
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
      inQuestion = false;
      inAnswer = true;
      continue;
    }

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

      if (currentQuestion !== null) {
        questions.push({
          questionText: questionTextLines.join("\n").trim(),
          answerText: answerTextLines.join("\n").trim(),
          startLine: questionStartLine,
          endLine: lineNumber,
        });
        currentQuestion = null;
        questionTextLines = [];
        answerTextLines = [];
        inQuestion = false;
        inAnswer = false;
      }
      continue;
    }

    if (inQuestion && !inAnswer) {
      questionTextLines.push(line);
    } else if (inAnswer) {
      answerTextLines.push(line);
    }
  }

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

  // Drop empty last question (e.g. #### QUESTION X / #### ANSWER X / #### END QUESTION with no content)
  if (questions.length > 0) {
    const last = questions[questions.length - 1];
    if (!last.questionText.trim() && !last.answerText.trim()) {
      questions.pop();
    }
  }

  return { questions, errors };
}

function databaseNameFromFilename(filename: string): string {
  // e.g. 100003-section-3-transform-integrity-feature-0054-0089-questions-todo.md
  const base = filename.replace(/\.md$/, "").replace(/-questions-todo$/, "");
  const sectionMatch = base.match(/section-(\d+)/i);
  const sectionNum = sectionMatch ? sectionMatch[1] : "?";
  const namePart = base.replace(/^\d+-section-\d+-/, "").replace(/-\d{4}-\d{4}$/, "");
  const title = namePart
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `Section ${sectionNum} - ${title}`;
}

function main(): void {
  const args = process.argv.slice(2);
  const mdPathArg = args.find((a) => !a.startsWith("--"));

  const defaultMdPath = "writeup-and-notes/100003-section-3-transform-integrity-feature-0054-0089-questions-todo.md";
  const mdPath = mdPathArg
    ? mdPathArg.endsWith(".md")
      ? mdPathArg
      : `${mdPathArg}.md`
    : defaultMdPath;

  const cwd = process.cwd();
  const absoluteMdPath = join(cwd, mdPath);
  let content: string;
  try {
    content = readFileSync(absoluteMdPath, "utf8");
  } catch (e) {
    console.error(`Error: Could not read ${mdPath}`);
    process.exit(1);
  }

  const filename = mdPath.split("/").pop() ?? mdPath;
  const { questions, errors } = parseQuestions(content);

  if (errors.length > 0) {
    console.error(`Validation failed (${errors.length} error(s)):`);
    errors.forEach((e) =>
      console.error(`  Question ${e.questionNumber} (line ${e.lineNumber}): ${e.error}`)
    );
    process.exit(1);
  }

  // Warn about empty question/answer text (still included in output)
  questions.forEach((q, i) => {
    if (!q.questionText?.trim()) {
      console.warn(`  Question ${i + 1} (line ${q.startLine}): question text is empty`);
    }
    if (!q.answerText?.trim()) {
      console.warn(`  Question ${i + 1} (line ${q.startLine}): answer text is empty`);
    }
  });

  if (questions.length === 0) {
    console.error("No valid questions found.");
    process.exit(1);
  }

  const databaseName = databaseNameFromFilename(filename);
  const questionsWithAnswers: QuestionEntry[] = questions.map((q) => ({
    questionId: uuid().replace(/-/g, ""),
    questionText: q.questionText.trim(),
    answerText: q.answerText.trim(),
    tags: [...DEFAULT_TAGS],
    domains: [...DEFAULT_DOMAINS],
  }));

  const output = {
    databaseName,
    questionsWithAnswers,
  };

  const outPath = absoluteMdPath.replace(/\.md$/, ".json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote ${questionsWithAnswers.length} questions to ${outPath}`);
}

main();
