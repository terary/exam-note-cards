import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Database as DatabaseSchema, DatabaseDocument } from "./schemas/database.schema";
import { Database, DatabaseInfo, Question } from "./interfaces";

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    @InjectModel(DatabaseSchema.name) private databaseModel: Model<DatabaseDocument>
  ) {}

  async getAllDatabases(): Promise<DatabaseInfo[]> {
    const databases = await this.databaseModel.find().exec();
    const databaseInfos: DatabaseInfo[] = databases.map((db) => {
      const questions = db.questionsWithAnswers || [];
      const questionCount = questions.length;
      
      // Count unanswered questions (timesAsked === 0 or undefined)
      const unansweredCount = questions.filter(
        (q) => (q.timesAsked ?? 0) === 0
      ).length;
      
      // Count bad questions (score < 0)
      const badCount = questions.filter((q) => {
        const score = q.lastScore ?? q.averageScore ?? null;
        return score !== null && score < 0;
      }).length;
      
      return {
        databaseId: db.databaseId,
        databaseName: db.databaseName,
        questionCount,
        unansweredCount,
        badCount,
      };
    });

    // Sort databases alphabetically by databaseName
    databaseInfos.sort((a, b) => a.databaseName.localeCompare(b.databaseName, undefined, { numeric: false, sensitivity: 'base' }));

    this.logger.log(
      `Retrieved ${databaseInfos.length} databases (${databaseInfos.reduce((sum, db) => sum + db.questionCount, 0)} total questions)`
    );

    return databaseInfos;
  }

  async getDatabaseById(databaseId: string): Promise<Database> {
    const database = await this.databaseModel
      .findOne({ databaseId })
      .exec();

    if (!database) {
      this.logger.warn(`Database with ID '${databaseId}' not found`);
      throw new NotFoundException(`Database with ID '${databaseId}' not found`);
    }

    this.logger.log(
      `Retrieved database '${database.databaseName}' with ${database.questionsWithAnswers?.length ?? 0} questions`
    );

    // Convert to interface format (Database interface doesn't require databaseId)
    return {
      databaseName: database.databaseName,
      questionsWithAnswers: (database.questionsWithAnswers || []).map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        answerText: q.answerText,
        tags: q.tags,
        domains: q.domains,
        timesAsked: q.timesAsked,
        averageScore: q.averageScore,
        lastScore: q.lastScore,
        bad: q.bad,
      })),
    };
  }

  async getAllQuestions(): Promise<Question[]> {
    const databases = await this.databaseModel.find().exec();
    const allQuestions: Question[] = [];

    databases.forEach((database) => {
      if (database.questionsWithAnswers) {
      allQuestions.push(...database.questionsWithAnswers);
      }
    });

    return allQuestions;
  }

  async getQuestionById(questionId: string): Promise<Question> {
    const database = await this.databaseModel
      .findOne({
        "questionsWithAnswers.questionId": questionId,
      })
      .exec();

    if (!database || !database.questionsWithAnswers) {
      this.logger.warn(`Question with ID '${questionId}' not found`);
      throw new NotFoundException(`Question with ID '${questionId}' not found`);
    }

      const question = database.questionsWithAnswers.find(
        (q) => q.questionId === questionId
      );

    if (!question) {
      this.logger.warn(`Question with ID '${questionId}' not found`);
      throw new NotFoundException(`Question with ID '${questionId}' not found`);
    }

        this.logger.log(
          `Found question '${questionId}' in database '${database.databaseName}'`
        );
        return question;
      }

  async getRandomQuestionFromDatabase(databaseId: string): Promise<Question> {
    const database = await this.getDatabaseById(databaseId);

    if (!database.questionsWithAnswers || database.questionsWithAnswers.length === 0) {
      this.logger.warn(`Database '${databaseId}' has no questions`);
      throw new NotFoundException(`Database '${databaseId}' has no questions`);
    }

    const randomIndex = Math.floor(
      Math.random() * database.questionsWithAnswers.length
    );
    const randomQuestion = database.questionsWithAnswers[randomIndex];

    this.logger.log(
      `Selected random question '${randomQuestion.questionId}' from database '${databaseId}'`
    );
    return randomQuestion;
  }

  async getRandomQuestionFromAllDatabases(): Promise<Question> {
    const allQuestions = await this.getAllQuestions();

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

  // Helper method for other services to update database
  async updateDatabase(databaseId: string, updates: Partial<Database>): Promise<DatabaseDocument> {
    const database = await this.databaseModel
      .findOneAndUpdate({ databaseId }, updates, { new: true })
      .exec();

    if (!database) {
      throw new NotFoundException(`Database with ID '${databaseId}' not found`);
    }

    return database;
  }

  // Refresh cache method kept for compatibility but does nothing with MongoDB
  refreshCache(): void {
    // No-op with MongoDB
  }
}
