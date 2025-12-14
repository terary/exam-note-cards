import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { Model } from "mongoose";
import { Database, DatabaseDocument } from "../src/schemas/database.schema";
import {
  AnswerSession,
  AnswerSessionDocument,
} from "../src/schemas/answer-session.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Logger } from "@nestjs/common";

async function recalculateAllQuestionStats(
  databaseModel: Model<DatabaseDocument>,
  answerSessionModel: Model<AnswerSessionDocument>,
  logger: Logger
) {
  logger.log("Starting statistics recalculation...");

  // Get all answer sessions
  const sessions = await answerSessionModel.find().exec();
  logger.log(`Found ${sessions.length} answer sessions`);

  // Build a map of questionId -> all answers
  const questionAnswersMap = new Map<string, Array<{
    score: number;
    timestamp: string;
  }>>();

  for (const session of sessions) {
    for (const answer of session.answers || []) {
      if (!answer.questionId) continue;

      if (!questionAnswersMap.has(answer.questionId)) {
        questionAnswersMap.set(answer.questionId, []);
      }

      questionAnswersMap.get(answer.questionId)!.push({
        score: answer.userCorrectnessPercentage,
        timestamp: answer.recordedAt || "",
      });
    }
  }

  logger.log(`Found answers for ${questionAnswersMap.size} unique questions`);

  // Get all databases and update questions
  const databases = await databaseModel.find().exec();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const database of databases) {
    if (!database.questionsWithAnswers) continue;

    let databaseUpdated = false;

    for (let i = 0; i < database.questionsWithAnswers.length; i++) {
      const question = database.questionsWithAnswers[i];
      const answers = questionAnswersMap.get(question.questionId);

      if (!answers || answers.length === 0) {
        // No answers for this question, ensure stats are reset
        if (question.timesAsked !== 0 || question.averageScore !== null || question.lastScore !== null) {
          question.timesAsked = 0;
          question.averageScore = null;
          question.lastScore = null;
          databaseUpdated = true;
        }
        continue;
      }

      // Calculate statistics
      const timesAsked = answers.length;
      const averageScore = answers.reduce((sum, a) => sum + a.score, 0) / timesAsked;
      
      // Find last score (most recent timestamp)
      let lastScore: number | null = null;
      let lastTimestamp = "";
      for (const answer of answers) {
        if (answer.timestamp > lastTimestamp) {
          lastTimestamp = answer.timestamp;
          lastScore = answer.score;
        }
      }

      // Update question if stats have changed
      const roundedAvg = Math.round(averageScore * 100) / 100;
      if (
        question.timesAsked !== timesAsked ||
        question.averageScore !== roundedAvg ||
        question.lastScore !== lastScore
      ) {
        question.timesAsked = timesAsked;
        question.averageScore = roundedAvg;
        question.lastScore = lastScore;
        databaseUpdated = true;
        updatedCount++;
      } else {
        skippedCount++;
      }
    }

    if (databaseUpdated) {
      await database.save({ validateBeforeSave: false });
      logger.log(
        `Updated statistics for questions in database '${database.databaseId}'`
      );
    }
  }

  logger.log(
    `Recalculation complete: ${updatedCount} questions updated, ${skippedCount} questions unchanged`
  );
}

async function bootstrap() {
  const logger = new Logger("RecalculateStats");
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const databaseModel = app.get<Model<DatabaseDocument>>(
      getModelToken(Database.name)
    );
    const answerSessionModel = app.get<Model<AnswerSessionDocument>>(
      getModelToken(AnswerSession.name)
    );

    await recalculateAllQuestionStats(
      databaseModel,
      answerSessionModel,
      logger
    );

    logger.log("Statistics recalculation completed successfully!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Recalculation failed: ${message}`);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();

