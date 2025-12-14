import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Question, QuestionStats } from "./interfaces";
import { QuestionsService } from "./questions.service";
import {
  AnswerSession,
  AnswerSessionDocument,
} from "./schemas/answer-session.schema";
import { Database, DatabaseDocument } from "./schemas/database.schema";

@Injectable()
export class QuestionStatsService {
  private readonly logger = new Logger(QuestionStatsService.name);

  constructor(
    private readonly questionsService: QuestionsService,
    @InjectModel(AnswerSession.name)
    private answerSessionModel: Model<AnswerSessionDocument>,
    @InjectModel(Database.name) private databaseModel: Model<DatabaseDocument>
  ) {}

  /**
   * Compute question score based on statistics
   * -1 = bad question, 0 = never answered, 0-90 = needs practice, 91+ = mastered
   */
  computeQuestionScore(question: Question): number {
    if (question.bad === true) {
      return -1;
    }

    const timesAsked = question.timesAsked ?? 0;
    if (timesAsked === 0) {
      return 0;
    }

    const score = question.lastScore ?? question.averageScore ?? 0;
    return Math.round(score);
  }

  /**
   * Aggregate question statistics from all answer sessions
   */
  async aggregateQuestionStats(questionId: string): Promise<QuestionStats> {
    const sessions = await this.answerSessionModel.find().exec();

    const allAnswers: number[] = [];
    let lastScore: number | null = null;
    let lastTimestamp = "";

    for (const session of sessions) {
      for (const answer of session.answers || []) {
        if (answer.questionId === questionId) {
          allAnswers.push(answer.userCorrectnessPercentage);
          const answerTime = answer.recordedAt || "";
          if (answerTime > lastTimestamp) {
            lastTimestamp = answerTime;
            lastScore = answer.userCorrectnessPercentage;
          }
        }
      }
    }

    const timesAsked = allAnswers.length;
    const averageScore =
      timesAsked > 0
        ? allAnswers.reduce((sum, score) => sum + score, 0) / timesAsked
        : null;

    return {
      timesAsked,
      averageScore: averageScore !== null ? Math.round(averageScore * 100) / 100 : null,
      lastScore,
    };
  }

  /**
   * Update question statistics in the database
   */
  async updateQuestionStats(
    questionId: string,
    stats: QuestionStats
  ): Promise<void> {
    const database = await this.databaseModel
      .findOne({
        "questionsWithAnswers.questionId": questionId,
      })
      .exec();

    if (!database || !database.questionsWithAnswers) {
      this.logger.warn(`Question '${questionId}' not found in any database`);
      return;
    }

    const questionIndex = database.questionsWithAnswers.findIndex(
      (q) => q.questionId === questionId
    );

    if (questionIndex === -1) {
      this.logger.warn(`Question '${questionId}' not found in database`);
      return;
    }

    // Update the question statistics
    const question = database.questionsWithAnswers[questionIndex];
    question.timesAsked = stats.timesAsked;
    question.averageScore = stats.averageScore;
    question.lastScore = stats.lastScore;

    database.questionsWithAnswers[questionIndex] = question;
    await database.save();

    this.logger.log(
      `Updated question '${questionId}' in database '${database.databaseId}': timesAsked=${stats.timesAsked}, avgScore=${stats.averageScore ?? "null"}, lastScore=${stats.lastScore ?? "null"}`
    );
  }

  /**
   * Get prioritized list of questions needing practice (score 0-90)
   */
  async getPrioritizedQuestions(limit?: number): Promise<Question[]> {
    const allQuestions = await this.questionsService.getAllQuestions();
    const questionsWithScores = allQuestions
      .map((q) => ({
        question: q,
        score: this.computeQuestionScore(q),
      }))
      .filter((item) => item.score >= 0 && item.score <= 90)
      .sort((a, b) => {
        // Priority: 0 (never answered) first, then 1-60, then 61-90
        if (a.score === 0 && b.score > 0) return -1;
        if (a.score > 0 && b.score === 0) return 1;
        if (a.score <= 60 && b.score > 60) return -1;
        if (a.score > 60 && b.score <= 60) return 1;
        return a.score - b.score; // Lower scores first within same tier
      })
      .map((item) => item.question);

    return limit ? questionsWithScores.slice(0, limit) : questionsWithScores;
  }

  /**
   * Record answer and update question statistics
   */
  async recordAnswerAndUpdateStats(questionId: string): Promise<void> {
    const stats = await this.aggregateQuestionStats(questionId);
    await this.updateQuestionStats(questionId, stats);
  }
}
