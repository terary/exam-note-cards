export interface DatabaseInfo {
  databaseId: string;
  databaseName: string;
  questionCount: number;
}

export interface Question {
  questionId: string;
  questionText: string;
  answerText: string;
  tags?: string[];
  domains: string[];
}

export interface DatabasePayload {
  databaseName: string;
  questionsWithAnswers: Question[];
}

export interface QuizMetrics {
  questionsAsked: number;
  questionsAnswered: number;
  averageCorrectPercentage: number;
}

