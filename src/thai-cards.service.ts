import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createHash } from "crypto";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { Database, DatabaseDocument } from "./schemas/database.schema";
import { Question } from "./interfaces";

export const THAI_PHRASES_ID = "database-thai-phrases";
export const THAI_SOUNDBITES_ID = "database-thai-soundbites";
export const THAI_PRONUNCIATION_ID = "database-thai-pronunciation";

const AUDIO_DIR = join(process.cwd(), "media", "thai");
const AUDIO_NAME = /^[a-f0-9]{64}\.m4a$/;
const M4A_BRANDS = new Set(["M4A ", "M4B ", "mp42", "mp41", "isom"]);

export interface AudioUpload {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
}

@Injectable()
export class ThaiCardsService {
  private readonly logger = new Logger(ThaiCardsService.name);

  constructor(
    @InjectModel(Database.name) private databaseModel: Model<DatabaseDocument>
  ) {}

  async createPhrase(input: {
    english: string;
    thai: string;
    phonetic?: string;
    romanization?: string;
  }): Promise<Question[]> {
    const english = cleanLine(input.english);
    const thai = cleanLine(input.thai);
    const phonetic = cleanLine(input.phonetic);
    const romanization = cleanLine(input.romanization);

    if (!english) {
      throw new BadRequestException("English is required");
    }
    if (!thai) {
      throw new BadRequestException("Thai script is required");
    }

    const questionText = phonetic
      ? `How to say in Thai "${english}"\n\n(${phonetic})`
      : `How to say in Thai "${english}"`;
    const answerLines = [thai];
    if (romanization) answerLines.push(romanization);

    const phrase: Question = {
      questionId: uuid(),
      questionText,
      answerText: answerLines.join("\n\n"),
      tags: ["thai", "en-to-th"],
      domains: ["thai"],
      timesAsked: 0,
      averageScore: null,
      lastScore: null,
      bad: false,
    };

    await this.addQuestions(THAI_PHRASES_ID, "Thai Phrases", [phrase]);
    this.logger.log(
      `Added phrase '${phrase.questionId}' to '${THAI_PHRASES_ID}' for "${english}"`
    );
    return [phrase];
  }

  async createSoundbite(
    file: AudioUpload | undefined,
    input: { thai: string; englishGloss?: string }
  ): Promise<Question> {
    const thai = cleanLine(input.thai);
    const englishGloss = cleanLine(input.englishGloss);
    if (!thai) {
      throw new BadRequestException("Thai script is required");
    }

    const questionAudio = await this.saveAudio(file);
    const question: Question = {
      questionId: uuid(),
      questionText: "What was said?",
      answerText: englishGloss ? `${thai}\n\n${englishGloss}` : thai,
      questionAudio,
      tags: ["thai", "soundbite"],
      domains: ["thai"],
      timesAsked: 0,
      averageScore: null,
      lastScore: null,
      bad: false,
    };

    await this.addQuestions(THAI_SOUNDBITES_ID, "Thai Sound Bites", [question]);
    this.logger.log(
      `Added sound bite '${question.questionId}' at ${questionAudio}`
    );
    return question;
  }

  async importSoundbiteBundle(bundleDir: string): Promise<{
    inserted: number;
    skipped: number;
  }> {
    const manifestPath = join(bundleDir, "manifest.json");
    if (!existsSync(manifestPath)) {
      throw new BadRequestException(`Bundle manifest not found: ${manifestPath}`);
    }
    const parsed = JSON.parse(await readFile(manifestPath, "utf8")) as {
      version?: number;
      items?: Array<{ english?: string; thai?: string; audio?: string }>;
    };
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) {
      throw new BadRequestException("Bundle manifest must be version 1 with an items list");
    }

    const counts = { inserted: 0, skipped: 0 };
    for (const item of parsed.items) {
      const english = cleanLine(item.english);
      const thai = cleanLine(item.thai);
      const audioName = typeof item.audio === "string" ? item.audio : "";
      if (!english || !thai || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.m4a$/.test(audioName)) {
        throw new BadRequestException(
          "Each bundle item needs english, thai, and an .m4a file name"
        );
      }
      const audioPath = join(bundleDir, "audio", audioName);
      const result = await this.insertBundledSoundbite({
        english,
        thai,
        audioPath,
        audioName,
      });
      counts[result] += 1;
      this.logger.log(`Batch sound bite ${result}: ${english}`);
    }
    return counts;
  }

  async listSoundbites(): Promise<Question[]> {
    const database = await this.databaseModel
      .findOne({ databaseId: THAI_SOUNDBITES_ID })
      .exec();
    if (!database?.questionsWithAnswers) {
      return [];
    }
    return [...database.questionsWithAnswers].reverse().map((q) => toQuestion(q));
  }

  async replaceSoundbiteAudio(
    questionId: string,
    file: AudioUpload | undefined
  ): Promise<Question> {
    const database = await this.databaseModel
      .findOne({ databaseId: THAI_SOUNDBITES_ID })
      .exec();
    const question = database?.questionsWithAnswers?.find(
      (q) => q.questionId === questionId
    );
    if (!database || !question) {
      throw new NotFoundException("Sound bite not found");
    }

    const questionAudio = await this.saveAudio(file);
    question.questionAudio = questionAudio;
    await database.save();

    this.logger.log(
      `Replaced audio for sound bite '${questionId}' with ${questionAudio}`
    );
    return toQuestion(question);
  }

  resolveAudioFile(filename: string): string | null {
    if (!AUDIO_NAME.test(filename)) {
      return null;
    }
    const fullPath = join(AUDIO_DIR, filename);
    return existsSync(fullPath) ? fullPath : null;
  }

  private async insertBundledSoundbite(input: {
    english: string;
    thai: string;
    audioPath: string;
    audioName: string;
  }): Promise<"inserted" | "skipped"> {
    const database = await this.databaseModel
      .findOne({ databaseId: THAI_SOUNDBITES_ID })
      .exec();
    const questions = database?.questionsWithAnswers ?? [];
    if (soundbiteAlreadyPresent(questions, input.english, input.thai)) {
      return "skipped";
    }
    if (!existsSync(input.audioPath)) {
      throw new BadRequestException(`Audio file not found: ${input.audioName}`);
    }

    const buffer = await readFile(input.audioPath);
    const questionAudio = await this.saveAudio({
      buffer,
      originalname: input.audioName,
      mimetype: "audio/mp4",
    });
    await this.addQuestions(THAI_SOUNDBITES_ID, "Thai Sound Bites", [
      {
        questionId: uuid(),
        questionText: "What was said?",
        answerText: `${input.thai}\n\n${input.english}`,
        questionAudio,
        tags: ["thai", "soundbite", `bundle-en:${input.english}`],
        domains: ["thai"],
        timesAsked: 0,
        averageScore: null,
        lastScore: null,
        bad: false,
      },
    ]);
    return "inserted";
  }

  private async saveAudio(file: AudioUpload | undefined): Promise<string> {
    if (!file?.buffer?.length) {
      throw new BadRequestException("Choose an M4A file");
    }
    const buffer = assertM4a(file);
    const hash = createHash("sha256").update(buffer).digest("hex");
    const filename = `${hash}.m4a`;
    await mkdir(AUDIO_DIR, { recursive: true });
    await writeFile(join(AUDIO_DIR, filename), buffer);
    return `/thai-audio/${filename}`;
  }

  private async addQuestions(
    databaseId: string,
    databaseName: string,
    questions: Question[]
  ): Promise<void> {
    const existing = await this.databaseModel.findOne({ databaseId }).exec();
    if (existing) {
      if (!existing.questionsWithAnswers) {
        existing.questionsWithAnswers = [];
      }
      existing.questionsWithAnswers.push(...(questions as never[]));
      await existing.save();
      return;
    }

    try {
      await this.databaseModel.create({
        databaseId,
        databaseName,
        questionsWithAnswers: questions,
      });
    } catch (error) {
      if (!isDuplicateKey(error)) {
        throw error;
      }
      const raced = await this.databaseModel.findOne({ databaseId }).exec();
      if (!raced) {
        throw error;
      }
      raced.questionsWithAnswers.push(...(questions as never[]));
      await raced.save();
    }
  }
}

function soundbiteAlreadyPresent(
  questions: Question[],
  english: string,
  thai: string
): boolean {
  const tag = `bundle-en:${english}`;
  return questions.some((question) => {
    if (question.tags?.includes(tag)) {
      return true;
    }
    const lines = (question.answerText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.includes(thai) || lines.includes(english);
  });
}

function cleanLine(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim();
}

function assertM4a(file: AudioUpload): Buffer {
  const name = (file.originalname || "").toLowerCase();
  const type = (file.mimetype || "").toLowerCase();
  const namedM4a = name.endsWith(".m4a");
  const typedM4a =
    type === "audio/mp4" ||
    type === "audio/x-m4a" ||
    type === "audio/m4a" ||
    type === "audio/aac";
  const buffer = file.buffer;
  const brand =
    buffer && buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp"
      ? buffer.toString("ascii", 8, 12)
      : "";

  if ((!namedM4a && !typedM4a) || !buffer?.length || !M4A_BRANDS.has(brand)) {
    throw new BadRequestException("File must be an M4A");
  }
  return buffer;
}

function toQuestion(q: Question): Question {
  return {
    questionId: q.questionId,
    questionText: q.questionText,
    answerText: q.answerText,
    questionAudio: q.questionAudio,
    groupId: q.groupId,
    tags: q.tags,
    domains: q.domains,
    timesAsked: q.timesAsked,
    averageScore: q.averageScore,
    lastScore: q.lastScore,
    bad: q.bad,
  };
}

function isDuplicateKey(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}
