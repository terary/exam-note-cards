import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AnswerSessionDocument = AnswerSession & Document;

@Schema({ _id: false })
export class AnswerRecord {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  actualAnswerText: string;

  @Prop({ required: true })
  userAnswerText: string;

  @Prop({ required: true, type: Number })
  userCorrectnessPercentage: number;

  @Prop({ type: String })
  answerNotes?: string;

  @Prop({ required: true })
  recordedAt: string;
}

const AnswerRecordSchema = SchemaFactory.createForClass(AnswerRecord);

@Schema({ collection: "answer_sessions" })
export class AnswerSession {
  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ required: true })
  databaseId: string;

  @Prop({ required: true })
  databaseName: string;

  @Prop({ required: true })
  startedAt: string;

  @Prop({ type: [AnswerRecordSchema], default: [] })
  answers: AnswerRecord[];
}

export const AnswerSessionSchema = SchemaFactory.createForClass(AnswerSession);


