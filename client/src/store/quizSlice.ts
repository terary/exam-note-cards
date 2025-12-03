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

interface QuizState {
  status: "idle" | "loading" | "ready" | "error";
  error?: string;
  databaseId?: string;
  databaseName?: string;
  sessionId?: string;
  questions: Question[];
  shuffledQuestions: Question[]; // Shuffled copy for randomization
  currentQuestionIndex: number; // Index in shuffled array
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
  shuffledQuestions: [],
  currentQuestionIndex: 0,
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

function getNextQuestion(state: QuizState): void {
  if (state.shuffledQuestions.length === 0) {
    state.currentQuestion = undefined;
    return;
  }

  // If we've gone through all questions, reshuffle
  if (state.currentQuestionIndex >= state.shuffledQuestions.length) {
    state.shuffledQuestions = shuffleArray(state.questions);
    state.currentQuestionIndex = 0;
  }

  // Get next question from shuffled array
  state.currentQuestion = state.shuffledQuestions[state.currentQuestionIndex];
  state.currentQuestionIndex += 1;
  state.answerRevealed = false; // Reset answer revealed state
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
        state.shuffledQuestions = shuffleArray(questions); // Create shuffled copy
        state.currentQuestionIndex = 0;
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
        if (state.correctnessByQuestion[questionId] === undefined) {
          state.questionsAnswered += 1;
          state.correctnessSum += correctnessPercentage;
        } else {
          state.correctnessSum -= state.correctnessByQuestion[questionId];
          state.correctnessSum += correctnessPercentage;
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
