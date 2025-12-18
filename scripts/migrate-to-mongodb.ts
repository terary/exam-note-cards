import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { Model } from "mongoose";
import { Database, DatabaseDocument } from "../src/schemas/database.schema";
import {
  AnswerSession,
  AnswerSessionDocument,
} from "../src/schemas/answer-session.schema";
import { getModelToken } from "@nestjs/mongoose";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, basename, extname } from "path";
import { Logger } from "@nestjs/common";
import { v4 as uuid } from "uuid";

async function migrateDatabases(
  databaseModel: Model<DatabaseDocument>,
  logger: Logger
) {
  const directories = [
    join(process.cwd(), "databases"),
    join(__dirname, "..", "src", "databases"),
  ];

  for (const directory of directories) {
    if (!existsSync(directory)) {
      logger.warn(`Directory '${directory}' does not exist, skipping`);
      continue;
    }

    const files = readdirSync(directory, { withFileTypes: true }).filter(
      (entry) => entry.isFile() && extname(entry.name).toLowerCase() === ".json"
    );

    for (const fileEntry of files) {
      const databaseId = basename(fileEntry.name, ".json");
      const filePath = join(directory, fileEntry.name);

      try {
        // Check if database already exists
        const existing = await databaseModel.findOne({ databaseId }).exec();
        if (existing) {
          logger.log(
            `Database '${databaseId}' already exists in MongoDB, skipping`
          );
          continue;
        }

        const json = readFileSync(filePath, "utf8");
        const parsed = JSON.parse(json) as {
          databaseName: string;
          questionsWithAnswers: any[];
        };

        const database = new databaseModel({
          databaseId,
          databaseName: parsed.databaseName ?? databaseId,
          questionsWithAnswers: parsed.questionsWithAnswers.map((q) => ({
            ...q,
            questionId: q.questionId || uuid(), // Generate UUID if missing
            timesAsked: q.timesAsked ?? 0,
            averageScore: q.averageScore ?? null,
            lastScore: q.lastScore ?? null,
            bad: q.bad ?? false,
          })),
        });

        await database.save();
        logger.log(
          `Migrated database '${databaseId}' with ${parsed.questionsWithAnswers.length} questions`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        logger.error(
          `Failed to migrate database file '${filePath}': ${message}`
        );
      }
    }
  }
}

async function migrateSessions(
  answerSessionModel: Model<AnswerSessionDocument>,
  logger: Logger
) {
  const sessionsDirectory = join(process.cwd(), "sessions");

  if (!existsSync(sessionsDirectory)) {
    logger.log(`Sessions directory '${sessionsDirectory}' does not exist, skipping`);
    return;
  }

  const files = readdirSync(sessionsDirectory).filter((file) =>
    file.endsWith(".json")
  );

  for (const filename of files) {
    const sessionId = filename.replace(".json", "");
    const filePath = join(sessionsDirectory, filename);

    try {
      // Check if session already exists
      const existing = await answerSessionModel.findOne({ sessionId }).exec();
      if (existing) {
        logger.log(`Session '${sessionId}' already exists in MongoDB, skipping`);
        continue;
      }

      const json = readFileSync(filePath, "utf8");
      const parsed = JSON.parse(json) as {
        sessionId: string;
        databaseId: string;
        databaseName: string;
        startedAt: string;
        answers: any[];
      };

      // Normalize answers to handle missing fields in old session files
      // Skip answers that are missing critical required fields
      const normalizedAnswers = parsed.answers
        .filter((answer: any) => {
          // Only include answers that have at least questionId and userCorrectnessPercentage
          return answer.questionId && answer.userCorrectnessPercentage !== undefined;
        })
        .map((answer: any) => {
          // Ensure all required fields are present and not null/undefined
          const normalized: any = {
            questionId: answer.questionId ?? "",
            questionText: answer.questionText ?? "",
            actualAnswerText: answer.actualAnswerText ?? "",
            userAnswerText: answer.userAnswerText ?? "", // Default to empty string if missing/null/undefined
            userCorrectnessPercentage: answer.userCorrectnessPercentage ?? 0,
            recordedAt: answer.recordedAt ?? new Date().toISOString(),
          };
          
          // Only add answerNotes if it exists (it's optional)
          if (answer.answerNotes !== undefined && answer.answerNotes !== null) {
            normalized.answerNotes = answer.answerNotes;
          }
          
          return normalized;
        });

      const session = new answerSessionModel({
        sessionId: parsed.sessionId,
        databaseId: parsed.databaseId,
        databaseName: parsed.databaseName,
        startedAt: parsed.startedAt,
        answers: normalizedAnswers,
      });

      // Disable validation during migration to handle legacy data
      await session.save({ validateBeforeSave: false });
      const skippedCount = parsed.answers.length - normalizedAnswers.length;
      if (skippedCount > 0) {
        logger.warn(
          `Migrated session '${sessionId}' with ${normalizedAnswers.length} answers (skipped ${skippedCount} invalid answers)`
        );
      } else {
        logger.log(
          `Migrated session '${sessionId}' with ${normalizedAnswers.length} answers`
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Failed to migrate session file '${filePath}': ${message}`);
    }
  }
}

async function bootstrap() {
  const logger = new Logger("Migration");
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const databaseModel = app.get<Model<DatabaseDocument>>(
      getModelToken(Database.name)
    );
    const answerSessionModel = app.get<Model<AnswerSessionDocument>>(
      getModelToken(AnswerSession.name)
    );

    logger.log("Starting migration to MongoDB...");

    await migrateDatabases(databaseModel, logger);
    await migrateSessions(answerSessionModel, logger);

    logger.log("Migration completed successfully!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Migration failed: ${message}`);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();


