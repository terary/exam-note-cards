import { Injectable, Logger, NotFoundException, Optional } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";
import {
  AnswerSession,
  AnswerSessionDocument,
} from "./schemas/answer-session.schema";
import { QuestionStatsService } from "./question-stats.service";

@Injectable()
export class AnswerSessionsService {
  private readonly logger = new Logger(AnswerSessionsService.name);

  constructor(
    @InjectModel(AnswerSession.name)
    private answerSessionModel: Model<AnswerSessionDocument>,
    @Optional() private readonly questionStatsService?: QuestionStatsService
  ) {}

  async createSession(
    databaseId: string,
    databaseName: string
  ): Promise<string> {
    const sessionId = uuid();
    const session = new this.answerSessionModel({
      sessionId,
      databaseId,
      databaseName,
      startedAt: new Date().toISOString(),
      answers: [],
    });

    await session.save();
    this.logger.log(
      `Created answer session '${sessionId}' for database '${databaseId}'`
    );
    return sessionId;
  }

  async getSession(sessionId: string): Promise<AnswerSession> {
    const session = await this.answerSessionModel
      .findOne({ sessionId })
      .exec();

    if (!session) {
      throw new NotFoundException(`Answer session '${sessionId}' not found`);
  }

    return session.toObject();
  }

  async listAllSessions(): Promise<
    Array<{
      fileId: string;
      filename: string;
      databaseName: string;
      lastModified: Date;
    }>
  > {
    const sessions = await this.answerSessionModel.find().exec();

    return sessions
      .map((session) => {
        const sessionObj = session.toObject();
        return {
          fileId: session.sessionId,
          filename: `${session.sessionId}.json`,
          databaseName: session.databaseName,
          lastModified: (sessionObj as any).updatedAt 
            ? new Date((sessionObj as any).updatedAt)
            : new Date(session.startedAt),
        };
      })
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  async recordAnswer(params: {
    sessionId: string;
    databaseId: string;
    questionId: string;
    questionText: string;
    actualAnswerText: string;
    userAnswerText: string;
    userCorrectnessPercentage: number;
    answerNotes?: string;
  }): Promise<void> {
    const {
      sessionId,
      databaseId,
      questionId,
      questionText,
      actualAnswerText,
      userAnswerText,
      userCorrectnessPercentage,
      answerNotes,
    } = params;

    const session = await this.answerSessionModel
      .findOne({ sessionId })
      .exec();

    if (!session) {
      throw new NotFoundException(`Answer session '${sessionId}' not found`);
    }

    if (session.databaseId !== databaseId) {
      throw new NotFoundException(
        `Session '${sessionId}' is not associated with database '${databaseId}'`
      );
    }

    const record = {
      questionId,
      questionText,
      actualAnswerText,
      userAnswerText,
      userCorrectnessPercentage,
      answerNotes,
      recordedAt: new Date().toISOString(),
    };

    session.answers.push(record);
    await session.save();
    this.logger.log(
      `Saved answer for question '${questionId}' in session '${sessionId}' (score: ${userCorrectnessPercentage}%)`
    );

    // Update question statistics if QuestionStatsService is available
    if (this.questionStatsService) {
      this.logger.log(
        `QuestionStatsService is available, updating stats for question '${questionId}'`
      );
      try {
        await this.questionStatsService.recordAnswerAndUpdateStats(questionId);
        this.logger.log(
          `Successfully updated stats for question '${questionId}'`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        const stack = error instanceof Error ? error.stack : undefined;
        this.logger.error(
          `Failed to update question statistics for '${questionId}': ${message}`,
          stack
        );
      }
    } else {
      this.logger.warn(
        `QuestionStatsService is not available - stats will not be updated for question '${questionId}'`
      );
    }
  }

  async deleteAnswerRecord(
    sessionId: string,
    questionId: string,
    recordedAt: string
  ): Promise<void> {
    const session = await this.answerSessionModel
      .findOne({ sessionId })
      .exec();

    if (!session) {
      throw new NotFoundException(`Answer session '${sessionId}' not found`);
    }

    const initialLength = session.answers.length;
    session.answers = session.answers.filter(
      (answer) =>
        !(
          answer.questionId === questionId &&
          answer.recordedAt === recordedAt
        )
    );

    if (session.answers.length === initialLength) {
      throw new NotFoundException(
        `Answer record not found in session '${sessionId}' for question '${questionId}' at '${recordedAt}'`
      );
    }

    await session.save();
    this.logger.log(
      `Deleted answer record for question '${questionId}' from session '${sessionId}' (recordedAt: '${recordedAt}')`
    );
  }
}
