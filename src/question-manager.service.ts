import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";
import { Database, DatabaseDocument } from "./schemas/database.schema";
import { Question } from "./interfaces";
import { QuestionsService } from "./questions.service";

@Injectable()
export class QuestionManagerService {
  private readonly logger = new Logger(QuestionManagerService.name);

  constructor(
    @InjectModel(Database.name) private databaseModel: Model<DatabaseDocument>,
    private readonly questionsService: QuestionsService
  ) {}

  async listQuestionsInDatabase(databaseId: string): Promise<Question[]> {
    const database = await this.questionsService.getDatabaseById(databaseId);
    return database.questionsWithAnswers;
  }

  async getQuestion(questionId: string): Promise<Question> {
    return this.questionsService.getQuestionById(questionId);
  }

  async createQuestion(
    databaseId: string,
    questionData: {
      questionText: string;
      answerText: string;
      tags?: string[];
      domains: string[];
    }
  ): Promise<Question> {
    const questionId = uuid();

    const newQuestion: Question = {
      questionId,
      questionText: questionData.questionText,
      answerText: questionData.answerText,
      tags: questionData.tags,
      domains: questionData.domains,
      timesAsked: 0,
      averageScore: null,
      lastScore: null,
    };

    const database = await this.databaseModel
      .findOne({ databaseId })
      .exec();

    if (!database) {
      throw new NotFoundException(`Database with ID '${databaseId}' not found`);
    }

    database.questionsWithAnswers.push(newQuestion);
    await database.save();

    this.logger.log(
      `Created question '${questionId}' in database '${databaseId}': questionText="${questionData.questionText.substring(0, 50)}${questionData.questionText.length > 50 ? "..." : ""}"`
    );

    return newQuestion;
  }

  async updateQuestion(
    questionId: string,
    updates: {
      questionText?: string;
      answerText?: string;
      tags?: string[];
      domains?: string[];
      timesAsked?: number;
      averageScore?: number | null;
      lastScore?: number | null;
    }
  ): Promise<Question> {
    const database = await this.databaseModel
      .findOne({
        "questionsWithAnswers.questionId": questionId,
      })
      .exec();

    if (!database || !database.questionsWithAnswers) {
      throw new NotFoundException(`Question with ID '${questionId}' not found`);
    }

    const questionIndex = database.questionsWithAnswers.findIndex(
      (q) => q.questionId === questionId
    );

    if (questionIndex === -1) {
      throw new NotFoundException(`Question with ID '${questionId}' not found`);
    }

    const existingQuestion = database.questionsWithAnswers[questionIndex];
    
    // Ensure all required fields are preserved
    const updatedQuestion: Question = {
      questionId: existingQuestion.questionId,
      questionText: updates.questionText ?? existingQuestion.questionText,
      answerText: updates.answerText ?? existingQuestion.answerText,
      domains: updates.domains ?? existingQuestion.domains,
      tags: updates.tags !== undefined ? updates.tags : existingQuestion.tags,
      timesAsked: updates.timesAsked !== undefined ? updates.timesAsked : (existingQuestion.timesAsked ?? 0),
      averageScore: updates.averageScore !== undefined ? updates.averageScore : existingQuestion.averageScore,
      lastScore: updates.lastScore !== undefined ? updates.lastScore : existingQuestion.lastScore,
      bad: existingQuestion.bad ?? false,
    };

    // Validate required fields
    if (!updatedQuestion.questionId || !updatedQuestion.questionText || !updatedQuestion.answerText) {
      throw new Error("Missing required fields: questionId, questionText, or answerText");
    }
    if (!updatedQuestion.domains || updatedQuestion.domains.length === 0) {
      throw new Error("At least one domain is required");
    }

    try {
      database.questionsWithAnswers[questionIndex] = updatedQuestion as any;
      await database.save({ validateBeforeSave: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        `Failed to save updated question '${questionId}': ${message}. Question data: ${JSON.stringify({ questionId: updatedQuestion.questionId, questionText: updatedQuestion.questionText.substring(0, 50), domains: updatedQuestion.domains, timesAsked: updatedQuestion.timesAsked, averageScore: updatedQuestion.averageScore, lastScore: updatedQuestion.lastScore })}`
      );
      throw error;
    }

    const updateParts: string[] = [];
    if (updates.questionText !== undefined)
      updateParts.push(
        `questionText="${updates.questionText.substring(0, 50)}${updates.questionText.length > 50 ? "..." : ""}"`
      );
    if (updates.answerText !== undefined) updateParts.push(`answerText updated`);
    if (updates.tags !== undefined)
      updateParts.push(`tags=[${updates.tags.join(", ")}]`);
    if (updates.domains !== undefined)
      updateParts.push(`domains=[${updates.domains.join(", ")}]`);
    if (updates.timesAsked !== undefined) updateParts.push(`timesAsked=${updates.timesAsked}`);
    if (updates.averageScore !== undefined) updateParts.push(`averageScore=${updates.averageScore ?? "null"}`);
    if (updates.lastScore !== undefined) updateParts.push(`lastScore=${updates.lastScore ?? "null"}`);

    this.logger.log(
      `Updated question '${questionId}' in database '${database.databaseId}': ${updateParts.join(", ")}`
    );

    return updatedQuestion;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    const database = await this.databaseModel
      .findOne({
        "questionsWithAnswers.questionId": questionId,
      })
      .exec();

    if (!database || !database.questionsWithAnswers) {
      throw new NotFoundException(`Question with ID '${questionId}' not found`);
    }

    const questionIndex = database.questionsWithAnswers.findIndex(
      (q) => q.questionId === questionId
    );

    if (questionIndex === -1) {
      throw new NotFoundException(`Question with ID '${questionId}' not found`);
    }

    const deletedQuestion = database.questionsWithAnswers[questionIndex];
    database.questionsWithAnswers.splice(questionIndex, 1);
    await database.save();

    this.logger.log(
      `Deleted question '${questionId}' from database '${database.databaseId}': questionText="${deletedQuestion.questionText.substring(0, 50)}${deletedQuestion.questionText.length > 50 ? "..." : ""}"`
    );
  }

  async searchQuestions(
    searchText: string,
    databaseId?: string
  ): Promise<Question[]> {
    // Handle quoted phrases - extract phrases and individual words
    const phraseRegex = /"([^"]+)"/g;
    const phrases: string[] = [];
    let processedText = searchText;

    // Extract quoted phrases
    let match;
    while ((match = phraseRegex.exec(searchText)) !== null) {
      phrases.push(match[1].toLowerCase());
      processedText = processedText.replace(match[0], ""); // Remove phrase from text
    }

    // Extract individual words (non-quoted)
    const words = processedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word.toLowerCase());

    // Build MongoDB query
    const allDatabases = databaseId
      ? [await this.databaseModel.findOne({ databaseId }).exec()]
      : await this.databaseModel.find().exec();

    const matchingQuestions: Question[] = [];

    for (const database of allDatabases) {
      if (!database || !database.questionsWithAnswers) continue;

      for (const question of database.questionsWithAnswers) {
        const questionTextLower = question.questionText.toLowerCase();
        const answerTextLower = question.answerText.toLowerCase();
        const combinedText = `${questionTextLower} ${answerTextLower}`;

        let matches = true;

        // Check if all phrases are present
        for (const phrase of phrases) {
          if (!combinedText.includes(phrase)) {
            matches = false;
            break;
          }
        }

        // If phrases matched, check individual words
        if (matches && words.length > 0) {
          for (const word of words) {
            if (!combinedText.includes(word)) {
              matches = false;
              break;
            }
          }
        }

        if (matches) {
          matchingQuestions.push(question as Question);
        }
      }
    }

    this.logger.log(
      `Search for "${searchText}"${databaseId ? ` in database '${databaseId}'` : ""} found ${matchingQuestions.length} questions`
    );

    return matchingQuestions;
  }
}
