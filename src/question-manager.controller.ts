import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { QuestionManagerService } from "./question-manager.service";
import { QuestionStatsService } from "./question-stats.service";
import { QuestionsService } from "./questions.service";
import { Question, DatabaseInfo } from "./interfaces";

interface CreateQuestionDto {
  questionText: string;
  answerText: string;
  tags?: string[];
  domains: string[];
}

interface UpdateQuestionDto {
  questionText?: string;
  answerText?: string;
  tags?: string[];
  domains?: string[];
  timesAsked?: number;
  averageScore?: number | null;
  lastScore?: number | null;
}

@Controller("question-manager")
export class QuestionManagerController {
  private readonly logger = new Logger(QuestionManagerController.name);

  constructor(
    private readonly questionManagerService: QuestionManagerService,
    private readonly questionStatsService: QuestionStatsService,
    private readonly questionsService: QuestionsService
  ) {}

  @Get("databases")
  async getAllDatabases(): Promise<DatabaseInfo[]> {
    this.logger.log("GET /question-manager/databases - Listing all databases");
    return this.questionsService.getAllDatabases();
  }

  @Get("databases/:databaseId/questions")
  async listQuestionsInDatabase(
    @Param("databaseId") databaseId: string
  ): Promise<Question[]> {
    this.logger.log(
      `GET /question-manager/databases/${databaseId}/questions - Listing questions in database`
    );
    return this.questionManagerService.listQuestionsInDatabase(databaseId);
  }

  @Get("questions/:questionId")
  async getQuestion(@Param("questionId") questionId: string): Promise<Question> {
    this.logger.log(
      `GET /question-manager/questions/${questionId} - Retrieving question`
    );
    return this.questionManagerService.getQuestion(questionId);
  }

  @Post("databases/:databaseId/questions")
  async createQuestion(
    @Param("databaseId") databaseId: string,
    @Body() body: CreateQuestionDto
  ): Promise<Question> {
    this.logger.log(
      `POST /question-manager/databases/${databaseId}/questions - Creating new question`
    );
    return this.questionManagerService.createQuestion(databaseId, body);
  }

  @Put("questions/:questionId")
  async updateQuestion(
    @Param("questionId") questionId: string,
    @Body() body: UpdateQuestionDto
  ): Promise<Question> {
    this.logger.log(
      `PUT /question-manager/questions/${questionId} - Updating question`
    );
    try {
      return await this.questionManagerService.updateQuestion(questionId, body);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        `Failed to update question '${questionId}': ${message}`
      );
      throw error;
    }
  }

  @Delete("questions/:questionId")
  async deleteQuestion(@Param("questionId") questionId: string): Promise<{
    status: "deleted";
    questionId: string;
  }> {
    this.logger.log(
      `DELETE /question-manager/questions/${questionId} - Deleting question`
    );
    await this.questionManagerService.deleteQuestion(questionId);
    return { status: "deleted", questionId };
  }

  @Get("questions/:questionId/stats")
  async getQuestionStats(@Param("questionId") questionId: string): Promise<{
    questionId: string;
    score: number;
    stats: {
      timesAsked: number;
      averageScore: number | null;
      lastScore: number | null;
    };
  }> {
    this.logger.log(
      `GET /question-manager/questions/${questionId}/stats - Retrieving question statistics`
    );
    const question = await this.questionManagerService.getQuestion(questionId);
    const stats = await this.questionStatsService.aggregateQuestionStats(
      questionId
    );
    const score = this.questionStatsService.computeQuestionScore(question);
    return {
      questionId,
      score,
      stats,
    };
  }

  @Get("prioritized")
  async getPrioritizedQuestions(
    @Query("limit") limit?: string
  ): Promise<Question[]> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    this.logger.log(
      `GET /question-manager/prioritized${limitNum ? `?limit=${limitNum}` : ""} - Retrieving prioritized questions`
    );
    return this.questionStatsService.getPrioritizedQuestions(limitNum);
  }

  @Get("search")
  async searchQuestions(
    @Query("q") query: string,
    @Query("databaseId") databaseId?: string
  ): Promise<Question[]> {
    this.logger.log(
      `GET /question-manager/search?q=${encodeURIComponent(query)}${databaseId ? `&databaseId=${databaseId}` : ""} - Searching questions`
    );
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.questionManagerService.searchQuestions(query.trim(), databaseId);
  }
}

