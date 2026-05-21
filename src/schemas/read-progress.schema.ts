import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReadProgressDocument = ReadProgress & Document;

@Schema({ collection: "read_progress" })
export class ReadProgress {
  @Prop({ required: true, unique: true })
  writeUpId: string;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  scrollPercent: number;

  @Prop({ required: true })
  updatedAt: string;
}

export const ReadProgressSchema = SchemaFactory.createForClass(ReadProgress);
