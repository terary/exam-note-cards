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
  timesAsked?: number;
  averageScore?: number | null;
  lastScore?: number | null;
  bad?: boolean;
}

export interface QuestionStats {
  timesAsked: number;
  averageScore: number | null;
  lastScore: number | null;
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

