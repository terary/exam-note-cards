import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { QuestionsAndAnswersController } from "./questions-and-answers.controller";
import { AnswersController } from "./answers.controller";
import { QuestionsService } from "./questions.service";
import { AnswerSessionsService } from "./answer-sessions.service";
import { WriteupsController } from "./writeups.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client", "dist"),
    }),
  ],
  controllers: [QuestionsAndAnswersController, AnswersController, WriteupsController],
  providers: [QuestionsService, AnswerSessionsService],
})
export class AppModule {}
