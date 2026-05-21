import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ReadProgress,
  ReadProgressDocument,
} from "./schemas/read-progress.schema";

interface ProgressResponse {
  writeUpId: string;
  scrollPercent: number;
  updatedAt: string;
}

interface SaveProgressDto {
  scrollPercent: number;
}

@Controller("read-progress")
export class ReadProgressController {
  constructor(
    @InjectModel(ReadProgress.name)
    private readonly progressModel: Model<ReadProgressDocument>
  ) {}

  @Get(":writeUpId")
  async getProgress(
    @Param("writeUpId") writeUpId: string
  ): Promise<ProgressResponse> {
    const record = await this.progressModel.findOne({ writeUpId }).lean();
    if (!record) {
      throw new NotFoundException(`No progress found for '${writeUpId}'`);
    }
    return {
      writeUpId: record.writeUpId,
      scrollPercent: record.scrollPercent,
      updatedAt: record.updatedAt,
    };
  }

  @Put(":writeUpId")
  @HttpCode(200)
  async saveProgress(
    @Param("writeUpId") writeUpId: string,
    @Body() body: SaveProgressDto
  ): Promise<ProgressResponse> {
    const updatedAt = new Date().toISOString();
    const record = await this.progressModel
      .findOneAndUpdate(
        { writeUpId },
        { writeUpId, scrollPercent: body.scrollPercent, updatedAt },
        { upsert: true, new: true }
      )
      .lean();
    return {
      writeUpId: record.writeUpId,
      scrollPercent: record.scrollPercent,
      updatedAt: record.updatedAt,
    };
  }
}
