import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppModule } from "../src/app.module";
import { ThaiPhraseBreakdown } from "../src/interfaces";
import { THAI_SOUNDBITES_ID } from "../src/thai-cards.service";
import { Database, DatabaseDocument } from "../src/schemas/database.schema";

const PARSER_URL = "http://localhost:3000/POC/thai-parser/phrase";

function thaiLine(answerText: string): string {
  const line = answerText
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .find((part) => part.length > 0);
  return line ?? "";
}

async function parsePhrase(text: string): Promise<ThaiPhraseBreakdown> {
  const response = await fetch(PARSER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`parser ${response.status}: ${body.slice(0, 300)}`);
  }
  const payload = JSON.parse(body) as ThaiPhraseBreakdown;
  if (!payload || !Array.isArray(payload.words)) {
    throw new Error("parser response has no words");
  }
  return payload;
}

async function main(): Promise<void> {
  const logger = new Logger("FillWordBreakdowns");
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });
  try {
    const databases = app.get<Model<DatabaseDocument>>(
      getModelToken(Database.name)
    );
    const deck = await databases.findOne({ databaseId: THAI_SOUNDBITES_ID }).exec();
    if (!deck) {
      logger.error(`Database ${THAI_SOUNDBITES_ID} was not found`);
      process.exitCode = 1;
      return;
    }

    let updated = 0;
    let skipped = 0;
    const failures: string[] = [];
    for (const question of deck.questionsWithAnswers ?? []) {
      if (!question.questionAudio) {
        skipped += 1;
        continue;
      }
      const text = thaiLine(question.answerText || "");
      if (!text) {
        failures.push(`${question.questionId}: no Thai line`);
        continue;
      }
      try {
        const wordBreakdown = await parsePhrase(text);
        await databases.updateOne(
          { databaseId: THAI_SOUNDBITES_ID },
          { $set: { "questionsWithAnswers.$[q].wordBreakdown": wordBreakdown } },
          { arrayFilters: [{ "q.questionId": question.questionId }] }
        );
        updated += 1;
        logger.log(`${question.questionId}: ${wordBreakdown.words.length} word(s)`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        failures.push(`${question.questionId}: ${message}`);
      }
    }

    logger.log(`Updated ${updated}. Skipped ${skipped} without audio.`);
    if (failures.length > 0) {
      for (const failure of failures) {
        logger.error(failure);
      }
      process.exitCode = 1;
    }
  } finally {
    await app.close();
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
