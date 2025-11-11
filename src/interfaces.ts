export interface Question {
  questionId: string;
  questionText: string;
  answerText: string;
  tags?: string[];
  domains: string[];
}

export interface Database {
  databaseName: string;
  questionsWithAnswers: Question[];
}

export interface DatabaseInfo {
  databaseId: string;
  databaseName: string;
  questionCount: number;
}
