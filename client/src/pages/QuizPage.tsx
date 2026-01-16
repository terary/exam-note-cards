import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuizStats from "../components/QuizStats";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  revealAnswer,
  resetQuiz,
  startQuiz,
  submitAnswer,
} from "../store/quizSlice";
import { fetchQuestion } from "../api/examApi";
import type { Question } from "../types";
import "../App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

function QuizPage() {
  const { databaseId, questionId } = useParams<{
    databaseId: string;
    questionId?: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const quizState = useAppSelector((state) => state.quiz);

  const [correctnessInput, setCorrectnessInput] = useState<number>(0);
  const [hasAdjustedSlider, setHasAdjustedSlider] = useState<boolean>(false);
  const [userAnswerInput, setUserAnswerInput] = useState<string>("");
  const [answerNotes, setAnswerNotes] = useState<string>("");
  const [specificQuestion, setSpecificQuestion] = useState<Question | null>(
    null
  );
  const [loadingSpecificQuestion, setLoadingSpecificQuestion] =
    useState<boolean>(false);
  const [specificQuestionError, setSpecificQuestionError] = useState<
    string | null
  >(null);

  // Handle loading a specific question by ID
  useEffect(() => {
    if (!databaseId || !questionId) {
      // Clear specific question state when questionId is removed
      setSpecificQuestion(null);
      setSpecificQuestionError(null);
      return;
    }

    // TypeScript narrowing - we know both are defined at this point
    const dbId = databaseId;
    const qId = questionId;

    // If we already have this question loaded and it matches, don't reload
    if (specificQuestion?.questionId === questionId) return;

    async function loadSpecificQuestion() {
      setLoadingSpecificQuestion(true);
      setSpecificQuestionError(null);
      try {
        // Ensure we have database info and session for stats/recording
        // Initialize quiz state if not already initialized for this database
        if (
          !quizState.databaseId ||
          quizState.databaseId !== dbId ||
          quizState.status === "idle"
        ) {
          dispatch(startQuiz({ databaseId: dbId }));
        }

        // Fetch the specific question
        const question = await fetchQuestion(qId);
        setSpecificQuestion(question);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load question";
        setSpecificQuestionError(message);
      } finally {
        setLoadingSpecificQuestion(false);
      }
    }

    loadSpecificQuestion();
  }, [
    databaseId,
    questionId,
    specificQuestion?.questionId,
    quizState.databaseId,
    quizState.status,
    dispatch,
  ]);

  // Handle normal quiz flow (no specific questionId)
  useEffect(() => {
    if (!databaseId || questionId) return; // Skip if questionId is provided

    if (quizState.status === "idle" || quizState.databaseId !== databaseId) {
      dispatch(startQuiz({ databaseId }));
    }
  }, [
    databaseId,
    questionId,
    quizState.status,
    quizState.databaseId,
    dispatch,
  ]);

  // Clear all input state whenever question changes
  // Don't restore previous answers - each question should start fresh
  useEffect(() => {
    // Reset all inputs when question changes
    setUserAnswerInput("");
    setAnswerNotes("");
    setCorrectnessInput(0);
    setHasAdjustedSlider(false);
  }, [quizState.currentQuestion?.questionId]);

  useEffect(() => {
    if (quizState.status === "error") {
      navigate("/");
    }
  }, [quizState.status, navigate]);

  if (!databaseId) {
    return (
      <div className="page-container">
        <p>Missing database ID. Returning to list.</p>
        <button onClick={() => navigate("/")}>Back to databases</button>
      </div>
    );
  }

  // Use specific question if provided, otherwise use quiz state question
  const currentQuestion = questionId
    ? specificQuestion
    : quizState.currentQuestion;
  const answerRevealed = quizState.answerRevealed;
  const correctnessAverage =
    quizState.questionsAnswered > 0
      ? Math.round(
          (quizState.correctnessSum / quizState.questionsAnswered) * 100
        ) / 100
      : 0;

  const handleRevealAnswer = () => {
    dispatch(revealAnswer());
  };

  const handleSubmitAnswer = () => {
    dispatch(
      submitAnswer({
        correctnessPercentage: correctnessInput,
        userAnswerText: userAnswerInput,
        answerNotes: answerNotes,
      })
    );
  };

  const handleBackToDatabases = () => {
    dispatch(resetQuiz());
    navigate("/");
  };

  const isLoading = questionId
    ? loadingSpecificQuestion
    : quizState.status === "loading";

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Quiz Session</h1>
        <button className="link-button" onClick={handleBackToDatabases}>
          &larr; Back to databases
        </button>
      </header>

      {quizState.error && quizState.status === "ready" && (
        <div className="error-message">
          <p>{quizState.error}</p>
        </div>
      )}

      <QuizStats
        databaseName={quizState.databaseName}
        questionsAsked={quizState.questionsAsked}
        questionsAnswered={quizState.questionsAnswered}
        correctnessAverage={correctnessAverage}
      />

      {isLoading && <p>Loading quiz...</p>}

      {specificQuestionError && (
        <div className="error-message">
          <p>{specificQuestionError}</p>
          <button onClick={handleBackToDatabases}>Back to databases</button>
        </div>
      )}

      {!isLoading && !currentQuestion && !specificQuestionError && (
        <div className="info-message">
          <p>No questions available in this quiz.</p>
          <button onClick={handleBackToDatabases}>Choose another quiz</button>
        </div>
      )}

      {!isLoading && currentQuestion && (
        <section className="question-card">
          <h2>
            Question
            {currentQuestion.questionId
              ? ` (questionId: ${currentQuestion.questionId})`
              : " (questionId: missing)"}
          </h2>
          <div className="question-text markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {currentQuestion.questionText}
            </ReactMarkdown>
          </div>

          <div className="correctness-section">
            <label htmlFor="user-answer-input" className="label">
              Your answer
            </label>
            <textarea
              id="user-answer-input"
              className="text-input"
              rows={4}
              value={userAnswerInput}
              onChange={(event) => setUserAnswerInput(event.target.value)}
              placeholder="Write your answer before revealing the official solution"
            />
          </div>

          {!answerRevealed && (
            <button className="primary-button" onClick={handleRevealAnswer}>
              See answer
            </button>
          )}

          {answerRevealed && (
            <>
              <div className="answer-section">
                <h3>Answer</h3>
                <div className="answer-text markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {currentQuestion.answerText}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="correctness-section">
                <label htmlFor="correctness-input" className="label">
                  How close were you? ({correctnessInput}%)
                </label>
                <input
                  id="correctness-input"
                  type="range"
                  min={-1}
                  max={100}
                  value={correctnessInput}
                  onChange={(event) => {
                    setCorrectnessInput(Number(event.target.value));
                    setHasAdjustedSlider(true);
                  }}
                />
                <div className="slider-values">
                  <span>-1%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="correctness-section">
                <label htmlFor="answer-notes-input" className="label">
                  Answer Notes
                </label>
                <textarea
                  id="answer-notes-input"
                  className="text-input"
                  rows={4}
                  value={answerNotes}
                  onChange={(event) => setAnswerNotes(event.target.value)}
                  placeholder="Add notes about your answer or the solution"
                />
              </div>

              <button
                className="primary-button"
                onClick={handleSubmitAnswer}
                disabled={!hasAdjustedSlider}
              >
                Record &amp; Next
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default QuizPage;
