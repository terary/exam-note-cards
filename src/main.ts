import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  let configService: ConfigService | undefined;

  try {
    const app = await NestFactory.create(AppModule);
    configService = app.get(ConfigService);

    const port = configService.get<number>("PORT", 3000);

    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(
      `Questions and Answers API available at: http://localhost:${port}/questions-and-answers`
    );
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      const port = configService?.get("PORT", 3000) || 3000;
      logger.error(
        `Port ${port} is already in use. Please stop the existing application or use a different port.`
      );
    } else {
      logger.error(`Failed to start application: ${error.message}`);
    }
    process.exit(1);
  }
}

bootstrap();
