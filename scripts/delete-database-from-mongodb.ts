import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { Model } from "mongoose";
import { Database, DatabaseDocument } from "../src/schemas/database.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Logger } from "@nestjs/common";

async function deleteDatabase(databaseId: string, databaseModel: Model<DatabaseDocument>, logger: Logger): Promise<boolean> {
  const database = await databaseModel.findOne({ databaseId }).exec();
  
  if (!database) {
    logger.warn(`Database '${databaseId}' not found in MongoDB`);
    return false;
  }

  logger.log(`Found database: ${database.databaseName} (${database.questionsWithAnswers?.length ?? 0} questions)`);
  
  await databaseModel.deleteOne({ databaseId }).exec();
  
  logger.log(`Successfully deleted database '${databaseId}' from MongoDB`);
  return true;
}

async function listAllDatabases() {
  const logger = new Logger("ListDatabases");
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const databaseModel = app.get<Model<DatabaseDocument>>(
      getModelToken(Database.name)
    );

    const databases = await databaseModel.find().exec();
    
    if (databases.length === 0) {
      logger.log("No databases found in MongoDB");
      return;
    }

    logger.log(`\nFound ${databases.length} database(s) in MongoDB:\n`);
    databases.forEach((db) => {
      logger.log(`  - ${db.databaseId}`);
      logger.log(`    Name: ${db.databaseName}`);
      logger.log(`    Questions: ${db.questionsWithAnswers?.length ?? 0}\n`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to list databases: ${message}`);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function deleteDatabases(databaseIds: string[]) {
  const logger = new Logger("DeleteDatabase");
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const databaseModel = app.get<Model<DatabaseDocument>>(
      getModelToken(Database.name)
    );

    let deletedCount = 0;
    for (const databaseId of databaseIds) {
      const deleted = await deleteDatabase(databaseId, databaseModel, logger);
      if (deleted) {
        deletedCount++;
      }
    }

    logger.log(`\nDeleted ${deletedCount} of ${databaseIds.length} database(s)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to delete databases: ${message}`);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function main() {
  // Filter out '--' separator that npm passes
  const args = process.argv.slice(2).filter(arg => arg !== "--");
  
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log("Usage:");
    console.log("  List all databases:");
    console.log("    npm run list:databases");
    console.log("    npm run delete:database -- --list");
    console.log("");
    console.log("  Delete one or more databases:");
    console.log("    npm run delete:database <databaseId1> [databaseId2] ...");
    console.log("");
    console.log("  Examples:");
    console.log("    npm run list:databases");
    console.log("    npm run delete:database tmp tmp.md database-one database-other");
    console.log("");
    console.log("  For production (set MONGODB_URI):");
    console.log("    MONGODB_URI=mongodb://192.168.0.198:37017/exam_note_cards npm run list:databases");
    console.log("    MONGODB_URI=mongodb://192.168.0.198:37017/exam_note_cards npm run delete:database tmp database-one");
    process.exit(1);
  }
  
  if (args[0] === "--list" || args[0] === "-l") {
    await listAllDatabases();
  } else {
    await deleteDatabases(args);
  }
}

main();

