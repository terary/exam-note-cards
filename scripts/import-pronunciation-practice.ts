import { execFile } from "child_process";
import { createHash } from "crypto";
import { mkdtemp, readFile, rm, writeFile, mkdir } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";
import { AppModule } from "../src/app.module";
import { ThaiPhraseBreakdown, ThaiPracticeNote, ThaiWordBreakdown } from "../src/interfaces";
import { THAI_PRONUNCIATION_ID } from "../src/thai-cards.service";
import { Database, DatabaseDocument } from "../src/schemas/database.schema";

const execFileAsync = promisify(execFile);
const SHEET = join(process.cwd(), "client/public/pronunciation-cheat-sheet/sheet.json");
const AUDIO_SRC = join(process.cwd(), "client/public/pronunciation-cheat-sheet/cheat-sheet-audio");
const AUDIO_DIR = join(process.cwd(), "media/thai");
const M4A_BRANDS = new Set(["M4A ", "M4B ", "mp42", "mp41", "isom"]);

type SheetItem = {
  thai?: string;
  meaning?: string;
  closes?: string;
  analysis?: ThaiWordBreakdown;
  audio?: { url?: string };
};

type InventoryHit = { sound?: string; label?: string; word?: string | null; tone?: string };

type Sheet = {
  words?: SheetItem[];
  particles?: SheetItem[];
  initials?: InventoryHit[];
  finals?: InventoryHit[];
  vowels?: InventoryHit[];
  tones?: InventoryHit[];
};

function namedSound(label?: string, sound?: string): string {
  const name = (label ?? "").trim();
  const ipa = (sound ?? "").trim();
  if (name && ipa) {
    return `${name} (${ipa})`;
  }
  return name || ipa;
}

function practiceFor(sheet: Sheet, item: SheetItem, kind: ThaiPracticeNote["kind"]): ThaiPracticeNote {
  const thai = (item.thai ?? "").trim();
  const examples: string[] = [];
  if (kind === "word") {
    for (const hit of sheet.initials ?? []) {
      if (hit.word === thai) {
        examples.push(namedSound(hit.label, hit.sound));
      }
    }
    for (const hit of sheet.vowels ?? []) {
      if (hit.word === thai) {
        examples.push(namedSound(hit.label, hit.sound));
      }
    }
    for (const hit of sheet.finals ?? []) {
      if (hit.word === thai) {
        examples.push(namedSound(hit.label, hit.sound));
      }
    }
    for (const hit of sheet.tones ?? []) {
      if (hit.word === thai && hit.tone) {
        examples.push(`${hit.tone} tone`);
      }
    }
  }
  return {
    kind,
    gloss: (kind === "particle" ? item.closes : item.meaning)?.trim() ?? "",
    examples,
  };
}

function thaiLine(answerText: string): string {
  return answerText.split(/\n\s*\n/)[0]?.trim() ?? "";
}

async function toM4a(mp3Path: string): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "pronunciation-"));
  const m4aPath = join(dir, "clip.m4a");
  try {
    await execFileAsync("afconvert", [mp3Path, m4aPath, "-f", "m4af", "-d", "aac"]);
    const buffer = await readFile(m4aPath);
    const brand = buffer.length >= 12 ? buffer.toString("ascii", 8, 12) : "";
    if (buffer.toString("ascii", 4, 8) !== "ftyp" || !M4A_BRANDS.has(brand)) {
      throw new Error(`converted file is not M4A (${brand || "no brand"})`);
    }
    return buffer;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  const logger = new Logger("PronunciationPractice");
  const sheet = JSON.parse(await readFile(SHEET, "utf8")) as Sheet;
  const items = [
    ...(sheet.words ?? []).map((item) => ({ item, kind: "word" as const })),
    ...(sheet.particles ?? []).map((item) => ({ item, kind: "particle" as const })),
  ];
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });
  try {
    const databases = app.get<Model<DatabaseDocument>>(getModelToken(Database.name));
    let deck = await databases.findOne({ databaseId: THAI_PRONUNCIATION_ID }).exec();
    if (!deck) {
      deck = await databases.create({
        databaseId: THAI_PRONUNCIATION_ID,
        databaseName: "Pronunciation Practice",
        questionsWithAnswers: [],
      });
    }
    const present = new Set(
      (deck.questionsWithAnswers ?? []).map((question) => thaiLine(question.answerText || ""))
    );
    await mkdir(AUDIO_DIR, { recursive: true });
    let inserted = 0;
    let retitled = 0;
    for (const { item, kind } of items) {
      const thai = (item.thai ?? "").trim();
      const gloss = (item.meaning ?? item.closes ?? "").trim();
      const practice = practiceFor(sheet, item, kind);
      if (!thai || !item.analysis || !item.audio?.url) {
        throw new Error(`sheet item is missing thai, analysis, or audio: ${thai || "(blank)"}`);
      }
      if (present.has(thai)) {
        const card = deck.questionsWithAnswers.find(
          (question) => thaiLine(question.answerText || "") === thai
        );
        if (card) {
          if (card.questionText !== "Pronounce this") {
            card.questionText = "Pronounce this";
            retitled += 1;
          }
          const current = card.wordBreakdown;
          card.wordBreakdown = {
            text: current?.text ?? thai,
            segmenter: current?.segmenter ?? "newmm",
            words: current?.words?.length ? current.words : [item.analysis],
            practice,
          };
        }
        continue;
      }
      const filename = decodeURIComponent(item.audio.url.split("/").pop() || "");
      const mp3Path = join(AUDIO_SRC, filename);
      const buffer = await toM4a(mp3Path);
      const hash = createHash("sha256").update(buffer).digest("hex");
      await writeFile(join(AUDIO_DIR, `${hash}.m4a`), buffer);
      const wordBreakdown: ThaiPhraseBreakdown = {
        text: thai,
        segmenter: "newmm",
        words: [item.analysis],
        practice,
      };
      deck.questionsWithAnswers.push({
        questionId: uuid(),
        questionText: "Pronounce this",
        answerText: gloss ? `${thai}\n\n${gloss}` : thai,
        questionAudio: `/thai-audio/${hash}.m4a`,
        wordBreakdown,
        tags: ["thai", "soundbite", "pronunciation"],
        domains: ["thai"],
        timesAsked: 0,
        averageScore: null,
        lastScore: null,
        bad: false,
      } as never);
      present.add(thai);
      inserted += 1;
      logger.log(`added ${thai}`);
    }
    deck.markModified("questionsWithAnswers");
    await deck.save();
    logger.log(
      `Inserted ${inserted}, retitled ${retitled}. Deck has ${deck.questionsWithAnswers.length} cards.`
    );
  } finally {
    await app.close();
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
