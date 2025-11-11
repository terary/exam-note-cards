import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync } from "fs";
import { basename, extname, join } from "path";
import { Database, DatabaseInfo, Question } from "./interfaces";

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  private databases: Map<string, Database> = new Map();
  private loadedSignature = "";

  constructor() {
    this.refreshDatabases(true);
  }

  private getCandidateDirectories(): string[] {
    const directories = [
      join(process.cwd(), "databases"),
      join(__dirname, "databases"),
    ];

    const seen = new Set<string>();
    return directories.filter((directory) => {
      if (seen.has(directory)) {
        return false;
      }
      seen.add(directory);
      return existsSync(directory);
    });
  }

  private refreshDatabases(forceLog = false): void {
    const directories = this.getCandidateDirectories();
    const nextDatabases = new Map<string, Database>();
    const summaryParts: string[] = [];
    let totalQuestions = 0;

    directories.forEach((directory) => {
      const files = readdirSync(directory, { withFileTypes: true }).filter(
        (entry) => entry.isFile() && extname(entry.name).toLowerCase() === ".json"
      );

      files.forEach((fileEntry) => {
        const databaseId = basename(fileEntry.name, ".json");
        const filePath = join(directory, fileEntry.name);

        try {
          const json = readFileSync(filePath, "utf8");
          const parsed = JSON.parse(json) as Database;
          const database: Database = {
            ...parsed,
            databaseName: parsed.databaseName ?? databaseId,
          };
          nextDatabases.set(databaseId, database);
          totalQuestions += database.questionsWithAnswers.length;
          summaryParts.push(`${databaseId}:${database.questionsWithAnswers.length}`);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error parsing database file";
          this.logger.error(
            `Failed to load database file '${filePath}': ${message}`
          );
        }
      });
    });

    const summary = summaryParts.sort().join("|");
    const changed = forceLog || summary !== this.loadedSignature;

    this.databases = nextDatabases;
    this.loadedSignature = summary;

    if (changed) {
      this.logger.log(
        `Loaded ${this.databases.size} databases (${totalQuestions} total questions)`
      );
    }
  }

  private ensureDatabasesLoaded(): void {
    this.refreshDatabases();

    if (this.databases.size === 0) {
      this.logger.warn("No databases available");
    }
  }

  getAllDatabases(): DatabaseInfo[] {
    this.ensureDatabasesLoaded();

    const databaseInfos: DatabaseInfo[] = [];

    this.databases.forEach((database, id) => {
      databaseInfos.push({
        databaseId: id,
        databaseName: database.databaseName,
        questionCount: database.questionsWithAnswers.length,
      });
    });

    return databaseInfos;
  }

  getDatabaseById(databaseId: string): Database {
    this.ensureDatabasesLoaded();

    const database = this.databases.get(databaseId);
    if (!database) {
      this.logger.warn(`Database with ID '${databaseId}' not found`);
      throw new NotFoundException(`Database with ID '${databaseId}' not found`);
    }

    this.logger.log(
      `Retrieved database '${database.databaseName}' with ${database.questionsWithAnswers.length} questions`
    );
    return database;
  }

  getAllQuestions(): Question[] {
    this.ensureDatabasesLoaded();

    const allQuestions: Question[] = [];

    this.databases.forEach((database) => {
      allQuestions.push(...database.questionsWithAnswers);
    });

    return allQuestions;
  }

  getQuestionById(questionId: string): Question {
    this.ensureDatabasesLoaded();

    for (const database of this.databases.values()) {
      const question = database.questionsWithAnswers.find(
        (q) => q.questionId === questionId
      );
      if (question) {
        this.logger.log(
          `Found question '${questionId}' in database '${database.databaseName}'`
        );
        return question;
      }
    }

    this.logger.warn(`Question with ID '${questionId}' not found`);
    throw new NotFoundException(`Question with ID '${questionId}' not found`);
  }

  getRandomQuestionFromDatabase(databaseId: string): Question {
    const database = this.getDatabaseById(databaseId);

    if (database.questionsWithAnswers.length === 0) {
      this.logger.warn(`Database '${database.databaseName}' has no questions`);
      throw new NotFoundException(
        `Database '${database.databaseName}' has no questions`
      );
    }

    const randomIndex = Math.floor(
      Math.random() * database.questionsWithAnswers.length
    );
    const randomQuestion = database.questionsWithAnswers[randomIndex];

    this.logger.log(
      `Selected random question '${randomQuestion.questionId}' from database '${database.databaseName}'`
    );
    return randomQuestion;
  }

  getRandomQuestionFromAllDatabases(): Question {
    const allQuestions = this.getAllQuestions();

    if (allQuestions.length === 0) {
      this.logger.warn("No questions available in any database");
      throw new NotFoundException("No questions available in any database");
    }

    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const randomQuestion = allQuestions[randomIndex];

    this.logger.log(
      `Selected random question '${randomQuestion.questionId}' from all databases`
    );
    return randomQuestion;
  }
}
