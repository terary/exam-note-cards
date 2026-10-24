export interface DatabaseInfo {
  databaseId: string;
  databaseName: string;
  questionCount: number;
  unansweredCount: number;
  badCount: number;
}

export interface ThaiWordBreakdown {
  word: string;
  error?: string;
  syllables?: { ssg?: string[]; tltk?: string[] };
  ipa?: string | null;
  ipaSyllables?: string[] | null;
  ipaSkipped?: string;
  pronunciate?: string[] | null;
  pronunciateSkipped?: string;
  romanize?: {
    royin?: string | null;
    ssg?: string[] | null;
    w2p?: string[] | null;
  };
  romanizeSkipped?: string;
  romanizeW2pSkipped?: string;
  soundexSource?: string;
  soundex?: {
    udom83?: string | null;
    lk82?: string | null;
    metasound?: string | null;
  };
}

export interface ThaiPracticeNote {
  kind: "word" | "particle";
  gloss: string;
  examples: string[];
}

export interface ThaiPhraseBreakdown {
  text: string;
  segmenter: string;
  words: ThaiWordBreakdown[];
  practice?: ThaiPracticeNote;
}

export interface Question {
  questionId: string;
  questionText: string;
  answerText: string;
  questionAudio?: string;
  wordBreakdown?: ThaiPhraseBreakdown;
  groupId?: string;
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

