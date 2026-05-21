import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

const envPath = join(process.cwd(), ".env");
import { QuestionsAndAnswersController } from "./questions-and-answers.controller";
import { AnswersController } from "./answers.controller";
import { QuestionsService } from "./questions.service";
import { AnswerSessionsService } from "./answer-sessions.service";
import { WriteupsController } from "./writeups.controller";
import { QuestionStatsService } from "./question-stats.service";
import { QuestionManagerService } from "./question-manager.service";
import { QuestionManagerController } from "./question-manager.controller";
import { ReadProgressController } from "./read-progress.controller";
import {
  Database,
  DatabaseSchema,
} from "./schemas/database.schema";
import {
  AnswerSession,
  AnswerSessionSchema,
} from "./schemas/answer-session.schema";
import {
  ReadProgress,
  ReadProgressSchema,
} from "./schemas/read-progress.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>("MONGODB_URI") ||
          "mongodb://localhost:37017/exam_note_cards",
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Database.name, schema: DatabaseSchema },
      { name: AnswerSession.name, schema: AnswerSessionSchema },
      { name: ReadProgress.name, schema: ReadProgressSchema },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client", "dist"),
    }),
  ],
  controllers: [
    QuestionsAndAnswersController,
    AnswersController,
    WriteupsController,
    QuestionManagerController,
    ReadProgressController,
  ],
  providers: [
    QuestionsService,
    QuestionStatsService,
    AnswerSessionsService,
    QuestionManagerService,
  ],
})
export class AppModule {}
