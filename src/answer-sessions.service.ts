import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { promises as fs } from "fs";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";

interface AnswerRecord {
  questionId: string;
  questionText: string;
  actualAnswerText: string;
  userAnswerText: string;
  userCorrectnessPercentage: number;
  recordedAt: string;
}

interface AnswerSession {
  sessionId: string;
  databaseId: string;
  databaseName: string;
  startedAt: string;
  answers: AnswerRecord[];
}

@Injectable()
export class AnswerSessionsService {
  private readonly logger = new Logger(AnswerSessionsService.name);
  private readonly sessionsDirectory = join(process.cwd(), "sessions");

  constructor() {
    this.ensureDirectory();
  }

  private ensureDirectory(): void {
    if (!existsSync(this.sessionsDirectory)) {
      mkdirSync(this.sessionsDirectory, { recursive: true });
      this.logger.log(
        `Created sessions directory at ${this.sessionsDirectory}`
      );
    }
  }

  private getSessionFilePath(sessionId: string): string {
    return join(this.sessionsDirectory, `${sessionId}.json`);
  }

  async createSession(
    databaseId: string,
    databaseName: string
  ): Promise<string> {
    const sessionId = uuid();
    const session: AnswerSession = {
      sessionId,
      databaseId,
      databaseName,
      startedAt: new Date().toISOString(),
      answers: [],
    };

    const filePath = this.getSessionFilePath(sessionId);
    await fs.writeFile(filePath, JSON.stringify(session, null, 2), "utf8");
    return sessionId;
  }

  async getSession(sessionId: string): Promise<AnswerSession> {
    const filePath = this.getSessionFilePath(sessionId);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      return JSON.parse(raw) as AnswerSession;
    } catch (error) {
      throw new NotFoundException(`Answer session '${sessionId}' not found`);
    }
  }

  private async loadSession(sessionId: string): Promise<AnswerSession> {
    return this.getSession(sessionId);
  }

  async listAllSessions(): Promise<
    Array<{
      fileId: string;
      filename: string;
      databaseName: string;
      lastModified: Date;
    }>
  > {
    const files = await fs.readdir(this.sessionsDirectory);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const sessions = await Promise.all(
      jsonFiles.map(async (filename) => {
        const fileId = filename.replace(".json", "");
        const filePath = join(this.sessionsDirectory, filename);
        const stats = await fs.stat(filePath);
        const session = await this.getSession(fileId);

        return {
          fileId,
          filename,
          databaseName: session.databaseName,
          lastModified: stats.mtime,
        };
      })
    );

    // Sort by last modified, newest first
    return sessions.sort(
      (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
    );
  }

  async recordAnswer(params: {
    sessionId: string;
    databaseId: string;
    questionId: string;
    questionText: string;
    actualAnswerText: string;
    userAnswerText: string;
    userCorrectnessPercentage: number;
  }): Promise<void> {
    const {
      sessionId,
      databaseId,
      questionId,
      questionText,
      actualAnswerText,
      userAnswerText,
      userCorrectnessPercentage,
    } = params;

    const session = await this.loadSession(sessionId);
    if (session.databaseId !== databaseId) {
      throw new NotFoundException(
        `Session '${sessionId}' is not associated with database '${databaseId}'`
      );
    }

    const record: AnswerRecord = {
      questionId,
      questionText,
      actualAnswerText,
      userAnswerText,
      userCorrectnessPercentage,
      recordedAt: new Date().toISOString(),
    };

    session.answers.push(record);

    const filePath = this.getSessionFilePath(sessionId);
    await fs.writeFile(filePath, JSON.stringify(session, null, 2), "utf8");
  }
}
