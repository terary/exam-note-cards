import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from ".";
import {
  fetchDatabase,
  createAnswerSession,
  recordAnswer,
} from "../api/examApi";
import type { Question } from "../types";

interface StartQuizPayload {
  databaseId: string;
}

type ActiveQuestionGroup = "A" | "B" | "C"; // Groups that can be current (D is excluded)

interface QuizState {
  status: "idle" | "loading" | "ready" | "error";
  error?: string;
  databaseId?: string;
  databaseName?: string;
  sessionId?: string;
  questions: Question[];
  questionGroups: {
    A: Question[]; // Never asked before
    B: Question[]; // Score 0-80
    C: Question[]; // Score > 80
    D: Question[]; // Score < 0 (excluded)
  };
  currentGroup: ActiveQuestionGroup;
  groupIndices: {
    A: number;
    B: number;
    C: number;
  };
  askedInSession: string[]; // Questions asked in current session (questionIds)
  currentQuestion?: Question;
  answerRevealed: boolean;
  correctnessByQuestion: Record<string, number>;
  userAnswerByQuestion: Record<string, string>;
  questionsAsked: number;
  questionsAnswered: number;
  correctnessSum: number;
}

export type { QuizState };

const createInitialState = (): QuizState => ({
  status: "idle",
  questions: [],
  questionGroups: {
    A: [],
    B: [],
    C: [],
    D: [],
  },
  currentGroup: "A",
  groupIndices: {
    A: 0,
    B: 0,
    C: 0,
  },
  askedInSession: [],
  answerRevealed: false,
  correctnessByQuestion: {},
  userAnswerByQuestion: {},
  questionsAsked: 0,
  questionsAnswered: 0,
  correctnessSum: 0,
});

const initialState: QuizState = createInitialState();

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Categorize questions into groups based on their stats
function categorizeQuestions(questions: Question[]): {
  A: Question[];
  B: Question[];
  C: Question[];
  D: Question[];
} {
  const groups: {
    A: Question[];
    B: Question[];
    C: Question[];
    D: Question[];
  } = {
    A: [],
    B: [],
    C: [],
    D: [],
  };

  for (const question of questions) {
    const timesAsked = question.timesAsked ?? 0;
    const score = question.lastScore ?? question.averageScore ?? null;

    // Group D: Score < 0 (excluded)
    if (score !== null && score < 0) {
      groups.D.push(question);
      continue;
    }

    // Group A: Never asked before
    if (timesAsked === 0) {
      groups.A.push(question);
    }
    // Group B: Score 0-80
    else if (score !== null && score >= 0 && score <= 80) {
      groups.B.push(question);
    }
    // Group C: Score > 80
    else if (score !== null && score > 80) {
      groups.C.push(question);
    }
    // Fallback: If no score but has been asked, put in Group B
    else {
      groups.B.push(question);
    }
  }

  // Shuffle each group
  groups.A = shuffleArray(groups.A);
  groups.B = shuffleArray(groups.B);
  groups.C = shuffleArray(groups.C);

  return groups;
}

function getNextQuestion(state: QuizState): void {
  // Helper to get next available question from a group (not yet asked in this session)
  const getNextFromGroup = (group: Question[], startIndex: number): { question: Question | null; nextIndex: number } => {
    for (let i = startIndex; i < group.length; i++) {
      const question = group[i];
      if (!state.askedInSession.includes(question.questionId)) {
        return { question, nextIndex: i + 1 };
      }
    }
    return { question: null, nextIndex: group.length };
  };

  // Try to get question from current group
  let question: Question | null = null;
  let nextIndex = state.groupIndices[state.currentGroup];

  if (state.currentGroup === "A") {
    const result = getNextFromGroup(state.questionGroups.A, nextIndex);
    question = result.question;
    state.groupIndices.A = result.nextIndex;
    
    // If no more in Group A, move to Group B
    if (!question) {
      state.currentGroup = "B";
      const resultB = getNextFromGroup(state.questionGroups.B, 0);
      question = resultB.question;
      state.groupIndices.B = resultB.nextIndex;
    }
  } else if (state.currentGroup === "B") {
    const result = getNextFromGroup(state.questionGroups.B, nextIndex);
    question = result.question;
    state.groupIndices.B = result.nextIndex;
    
    // If no more in Group B, move to Group C
    if (!question) {
      state.currentGroup = "C";
      const resultC = getNextFromGroup(state.questionGroups.C, 0);
      question = resultC.question;
      state.groupIndices.C = resultC.nextIndex;
    }
  } else if (state.currentGroup === "C") {
    const result = getNextFromGroup(state.questionGroups.C, nextIndex);
    question = result.question;
    state.groupIndices.C = result.nextIndex;
  }

  if (!question) {
    // All questions exhausted
    state.currentQuestion = undefined;
    return;
  }

  // Mark as asked in session
  if (!state.askedInSession.includes(question.questionId)) {
    state.askedInSession.push(question.questionId);
  }

  state.currentQuestion = question;
  state.answerRevealed = false;
  state.questionsAsked += 1;
}

export const startQuiz = createAsyncThunk(
  "quiz/start",
  async ({ databaseId }: StartQuizPayload, { rejectWithValue }) => {
    try {
      const database = await fetchDatabase(databaseId);
      const session = await createAnswerSession(databaseId);
      return {
        databaseId,
        databaseName: database.databaseName,
        questions: database.questionsWithAnswers,
        sessionId: session.sessionId,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start quiz";
      return rejectWithValue(message);
    }
  }
);

export const submitAnswer = createAsyncThunk<
  {
    questionId: string;
    correctnessPercentage: number;
    userAnswerText: string;
  },
  { correctnessPercentage: number; userAnswerText: string; answerNotes: string },
  { state: RootState; rejectValue: string }
>(
  "quiz/submitAnswer",
  async (
    { correctnessPercentage, userAnswerText, answerNotes },
    { getState, rejectWithValue }
  ) => {
    const state = getState().quiz;
    if (
      state.status !== "ready" ||
      !state.sessionId ||
      !state.currentQuestion ||
      !state.databaseId
    ) {
      return rejectWithValue("Quiz session is not ready");
    }

    const percentage = Math.min(Math.max(correctnessPercentage, -1), 100);

    if (!state.currentQuestion.questionId) {
      return rejectWithValue("Question ID is required");
    }

    try {
      await recordAnswer({
        sessionId: state.sessionId,
        databaseId: state.databaseId,
        questionId: state.currentQuestion.questionId,
        questionText: state.currentQuestion.questionText,
        actualAnswerText: state.currentQuestion.answerText,
        userAnswerText,
        userCorrectnessPercentage: percentage,
        answerNotes,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to record answer";
      return rejectWithValue(message);
    }

    return {
      questionId: state.currentQuestion.questionId,
      correctnessPercentage: percentage,
      userAnswerText,
    };
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    revealAnswer(state) {
      if (state.status !== "ready") return;
      state.answerRevealed = true;
    },
    resetQuiz() {
      return createInitialState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startQuiz.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        const { databaseId, databaseName, questions, sessionId } =
          action.payload;
        state.status = "ready";
        state.databaseId = databaseId;
        state.databaseName = databaseName;
        state.sessionId = sessionId;
        state.questions = questions; // Store in original order
        
        // Categorize and shuffle questions into priority groups
        state.questionGroups = categorizeQuestions(questions);
        state.currentGroup = "A";
        state.groupIndices = { A: 0, B: 0, C: 0 };
        state.askedInSession = [];
        
        state.correctnessByQuestion = {};
        state.userAnswerByQuestion = {};
        state.questionsAnswered = 0;
        state.correctnessSum = 0;
        state.questionsAsked = 0;
        state.answerRevealed = false;
        getNextQuestion(state);
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.status = "error";
        state.error =
          (action.payload as string | undefined) ||
          action.error.message ||
          "Failed to start quiz";
      })
      .addCase(submitAnswer.pending, (state) => {
        state.error = undefined;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        if (state.status !== "ready" || !state.currentQuestion) {
          return;
        }
        const { questionId, correctnessPercentage, userAnswerText } =
          action.payload;
        const isNewQuestion = state.correctnessByQuestion[questionId] === undefined;
        console.log(
          `[Quiz] Answer submitted for question '${questionId}': isNewQuestion=${isNewQuestion}, correctness=${correctnessPercentage}%, current questionsAnswered=${state.questionsAnswered}`
        );
        if (isNewQuestion) {
          state.questionsAnswered += 1;
          state.correctnessSum += correctnessPercentage;
          console.log(
            `[Quiz] Incremented questionsAnswered to ${state.questionsAnswered} (new question)`
          );
        } else {
          state.correctnessSum -= state.correctnessByQuestion[questionId];
          state.correctnessSum += correctnessPercentage;
          console.log(
            `[Quiz] Updated correctness for previously answered question (questionsAnswered stays at ${state.questionsAnswered})`
          );
        }
        state.correctnessByQuestion[questionId] = correctnessPercentage;
        state.userAnswerByQuestion[questionId] = userAnswerText;
        getNextQuestion(state);
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.error =
          (action.payload as string | undefined) ||
          action.error.message ||
          "Failed to record answer";
      });
  },
});

export const { revealAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
