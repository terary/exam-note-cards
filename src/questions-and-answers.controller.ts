import { Body, Controller, Get, Param, Post, Logger } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { Database, DatabaseInfo, Question } from "./interfaces";
import { AnswerSessionsService } from "./answer-sessions.service";

interface CreateSessionDto {
  databaseId: string;
}

interface RecordAnswerDto {
  databaseId: string;
  questionId: string;
  questionText: string;
  answerText: string;
  correctnessPercentage: number;
}

@Controller("questions-and-answers")
export class QuestionsAndAnswersController {
  private readonly logger = new Logger(QuestionsAndAnswersController.name);

  constructor(
    private readonly questionsService: QuestionsService,
    private readonly answerSessionsService: AnswerSessionsService
  ) {}

  @Get("questions/databases")
  getAllDatabases(): DatabaseInfo[] {
    this.logger.log(
      "GET /questions-and-answers/questions/databases - Retrieving all databases"
    );
    return this.questionsService.getAllDatabases();
  }

  @Get("questions/databases/:databaseId")
  getDatabaseById(@Param("databaseId") databaseId: string): Database {
    this.logger.log(
      `GET /questions-and-answers/questions/databases/${databaseId} - Retrieving database`
    );
    return this.questionsService.getDatabaseById(databaseId);
  }

  @Get("questions/:questionId")
  getQuestionById(@Param("questionId") questionId: string): Question {
    this.logger.log(
      `GET /questions-and-answers/questions/${questionId} - Retrieving question`
    );
    return this.questionsService.getQuestionById(questionId);
  }

  @Get("questions")
  getAllQuestions(): Question[] {
    this.logger.log(
      "GET /questions-and-answers/questions - Retrieving all questions"
    );
    return this.questionsService.getAllQuestions();
  }

  @Post("answer-sessions")
  async createAnswerSession(
    @Body() body: CreateSessionDto
  ): Promise<{ sessionId: string }> {
    this.logger.log(
      `POST /questions-and-answers/answer-sessions - Creating session for database '${body.databaseId}'`
    );
    const database = this.questionsService.getDatabaseById(body.databaseId);
    const sessionId = await this.answerSessionsService.createSession(
      body.databaseId,
      database.databaseName
    );
    return { sessionId };
  }

  @Post("answer-sessions/:sessionId/answers")
  async recordAnswer(
    @Param("sessionId") sessionId: string,
    @Body() body: RecordAnswerDto
  ): Promise<{ status: "recorded" }> {
    this.logger.log(
      `POST /questions-and-answers/answer-sessions/${sessionId}/answers - Recording answer for question '${body.questionId}'`
    );
    await this.answerSessionsService.recordAnswer({
      sessionId,
      databaseId: body.databaseId,
      questionId: body.questionId,
      questionText: body.questionText,
      answerText: body.answerText,
      correctnessPercentage: body.correctnessPercentage,
    });
    return { status: "recorded" };
  }
}
