import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Question, QuestionSchema } from "./question.schema";

export type DatabaseDocument = Database & Document;

@Schema({ collection: "databases" })
export class Database {
  @Prop({ required: true, unique: true })
  databaseId: string;

  @Prop({ required: true })
  databaseName: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questionsWithAnswers: Question[];
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);


