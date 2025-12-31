import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { Logger } from "@nestjs/common";

interface Question {
  questionId: string | null;
  questionText: string;
  answerText: string;
  tags?: string[];
  domains: string[];
}

interface Database {
  databaseName: string;
  questionsWithAnswers: Question[];
}

async function fixNullQuestionIds(filePath: string): Promise<void> {
  const logger = new Logger("FixNullQuestionIds");
  
  try {
    logger.log(`Reading file: ${filePath}`);
    const content = readFileSync(filePath, "utf8");
    const database: Database = JSON.parse(content);
    
    let fixedCount = 0;
    const fixedQuestions = database.questionsWithAnswers.map((q) => {
      if (q.questionId === null || q.questionId === undefined || q.questionId === "") {
        fixedCount++;
        return {
          ...q,
          questionId: uuid(),
        };
      }
      return q;
    });
    
    if (fixedCount === 0) {
      logger.log(`No null questionIds found in ${filePath}`);
      return;
    }
    
    logger.log(`Found ${fixedCount} questions with null questionIds`);
    
    const fixedDatabase = {
      ...database,
      questionsWithAnswers: fixedQuestions,
    };
    
    // Write back to file
    writeFileSync(filePath, JSON.stringify(fixedDatabase, null, 2), "utf8");
    logger.log(`Fixed ${fixedCount} questionIds in ${filePath}`);
    
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to fix ${filePath}: ${message}`);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Usage: ts-node scripts/fix-null-question-ids.ts <database-file>");
    console.log("Example: ts-node scripts/fix-null-question-ids.ts databases/database-section-6-deep-learning-intro.json");
    process.exit(1);
  }
  
  const filePath = args[0];
  await fixNullQuestionIds(filePath);
}

main();

