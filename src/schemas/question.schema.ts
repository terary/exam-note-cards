import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type QuestionDocument = Question & Document;

@Schema({ _id: false })
export class Question {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: false, default: "" })
  answerText: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: [String], required: true })
  domains: string[];

  @Prop({ type: Number, default: 0 })
  timesAsked?: number;

  @Prop({ type: Number, default: null })
  averageScore?: number | null;

  @Prop({ type: Number, default: null })
  lastScore?: number | null;

  @Prop({ type: Boolean, default: false })
  bad?: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);


