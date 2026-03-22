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

function redactMongoUri(uri: string): string {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@");
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  if (!args.includes("--yes")) {
    console.log("Deletes ALL documents in MongoDB collections: databases, answer_sessions.");
    console.log("");
    console.log("Uses MONGODB_URI from the environment (or .env) — same as the app.");
    console.log("");
    console.log("  Dev (default in app):  npm run database:delete-all-records -- --yes");
    console.log("  Prod / remote:         MONGODB_URI='mongodb://192.168.0.198:37017/exam_note_cards' npm run database:delete-all-records -- --yes");
    console.log("");
    console.log("You must pass --yes to confirm.");
    process.exit(1);
  }

  const logger = new Logger("DeleteAllRecords");
  const defaultUri = "mongodb://localhost:37017/exam_note_cards";
  const uri = process.env.MONGODB_URI || defaultUri;
  logger.log(`Target MongoDB: ${redactMongoUri(uri)}`);

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const databaseModel = app.get<Model<DatabaseDocument>>(
      getModelToken(Database.name)
    );
    const answerSessionModel = app.get<Model<AnswerSessionDocument>>(
      getModelToken(AnswerSession.name)
    );

    const sessionsResult = await answerSessionModel.deleteMany({}).exec();
    const databasesResult = await databaseModel.deleteMany({}).exec();

    logger.log(
      `Removed answer_sessions: ${sessionsResult.deletedCount ?? 0} document(s)`
    );
    logger.log(
      `Removed databases: ${databasesResult.deletedCount ?? 0} document(s)`
    );
    logger.log("Done. Run npm run migrate:mongodb to reload from JSON if needed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed: ${message}`);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
