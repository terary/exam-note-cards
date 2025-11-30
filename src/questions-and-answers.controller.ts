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
  actualAnswerText: string;
  userAnswerText: string;
  userCorrectnessPercentage: number;
  answerNotes?: string;
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
      actualAnswerText: body.actualAnswerText,
      userAnswerText: body.userAnswerText,
      userCorrectnessPercentage: body.userCorrectnessPercentage,
      answerNotes: body.answerNotes,
    });
    return { status: "recorded" };
  }

  @Get("external-ip")
  async getExternalIp(): Promise<{ ip: string }> {
    this.logger.log("GET /questions-and-answers/external-ip - Retrieving external IP");
    try {
      // Try multiple services for reliability
      const services = [
        "https://api.ipify.org?format=json",
        "https://api64.ipify.org?format=json",
        "https://ifconfig.me/ip",
      ];

      for (const service of services) {
        try {
          const response = await fetch(service, {
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });
          
          if (service.includes("ipify")) {
            const data = await response.json();
            return { ip: data.ip };
          } else {
            const text = await response.text();
            const ip = text.trim();
            if (ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
              return { ip };
            }
          }
        } catch (error) {
          this.logger.warn(`Failed to fetch IP from ${service}: ${error.message}`);
          continue;
        }
      }
      
      throw new Error("All IP services failed");
    } catch (error) {
      this.logger.error(`Failed to retrieve external IP: ${error.message}`);
      throw error;
    }
  }
}
