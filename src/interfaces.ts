export interface Question {
  questionId: string;
  questionText: string;
  answerText: string;
  tags?: string[];
  domains: string[];
  // Statistics fields (optional for backward compatibility)
  timesAsked?: number;
  averageScore?: number | null;
  lastScore?: number | null;
  bad?: boolean; // Mark question as bad (score = -1)
}

export interface QuestionStats {
  timesAsked: number;
  averageScore: number | null;
  lastScore: number | null;
}

export interface Database {
  databaseName: string;
  questionsWithAnswers: Question[];
}

export interface DatabaseInfo {
  databaseId: string;
  databaseName: string;
  questionCount: number;
  unansweredCount: number;
  badCount: number;
}
