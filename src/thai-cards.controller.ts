import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { Question } from "./interfaces";
import { AudioUpload, ThaiCardsService } from "./thai-cards.service";

const audioUpload = FileInterceptor("audio", {
  limits: { fileSize: 25 * 1024 * 1024 },
});

@Controller()
export class ThaiCardsController {
  private readonly logger = new Logger(ThaiCardsController.name);

  constructor(private readonly thaiCardsService: ThaiCardsService) {}

  @Post("thai/phrases")
  createPhrase(
    @Body()
    body: {
      english?: string;
      thai?: string;
      phonetic?: string;
      romanization?: string;
    }
  ): Promise<Question[]> {
    this.logger.log("POST /thai/phrases - Creating a phrase pair");
    return this.thaiCardsService.createPhrase({
      english: body?.english ?? "",
      thai: body?.thai ?? "",
      phonetic: body?.phonetic,
      romanization: body?.romanization,
    });
  }

  @Get("thai/soundbites")
  listSoundbites(): Promise<Question[]> {
    return this.thaiCardsService.listSoundbites();
  }

  @Post("thai/soundbites")
  @UseInterceptors(audioUpload)
  createSoundbite(
    @UploadedFile() file: AudioUpload,
    @Body() body: { thai?: string; englishGloss?: string }
  ): Promise<Question> {
    this.logger.log("POST /thai/soundbites - Creating a sound bite");
    return this.thaiCardsService.createSoundbite(file, {
      thai: body?.thai ?? "",
      englishGloss: body?.englishGloss,
    });
  }

  @Put("thai/soundbites/:questionId/audio")
  @UseInterceptors(audioUpload)
  replaceSoundbiteAudio(
    @Param("questionId") questionId: string,
    @UploadedFile() file: AudioUpload
  ): Promise<Question> {
    this.logger.log(
      `PUT /thai/soundbites/${questionId}/audio - Replacing sound bite audio`
    );
    return this.thaiCardsService.replaceSoundbiteAudio(questionId, file);
  }

  @Get("thai-audio/:filename")
  serveAudio(@Param("filename") filename: string, @Res() res: Response): void {
    const fullPath = this.thaiCardsService.resolveAudioFile(filename);
    if (!fullPath) {
      res.status(404).type("text/plain").send("Audio file not found");
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Type", "audio/mp4");
    res.sendFile(fullPath, (error) => {
      if (error && !res.headersSent) {
        res.status(404).type("text/plain").send("Audio file not found");
      }
    });
  }
}
