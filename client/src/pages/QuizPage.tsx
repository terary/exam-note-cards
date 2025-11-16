import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuizStats from "../components/QuizStats";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  revealAnswer,
  resetQuiz,
  startQuiz,
  submitAnswer,
} from "../store/quizSlice";
import "../App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

function QuizPage() {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const quizState = useAppSelector((state) => state.quiz);

  const [correctnessInput, setCorrectnessInput] = useState<number>(0);
  const [hasAdjustedSlider, setHasAdjustedSlider] = useState<boolean>(false);
  const [userAnswerInput, setUserAnswerInput] = useState<string>("");

  const currentCorrectness = useMemo(() => {
    if (!quizState.currentQuestion) return undefined;
    return quizState.correctnessByQuestion[
      quizState.currentQuestion.questionId
    ];
  }, [quizState.currentQuestion, quizState.correctnessByQuestion]);

  const currentUserAnswer = useMemo(() => {
    if (!quizState.currentQuestion) return undefined;
    return quizState.userAnswerByQuestion[quizState.currentQuestion.questionId];
  }, [quizState.currentQuestion, quizState.userAnswerByQuestion]);

  useEffect(() => {
    if (!databaseId) return;

    if (quizState.status === "idle" || quizState.databaseId !== databaseId) {
      dispatch(startQuiz({ databaseId }));
    }
  }, [databaseId, quizState.status, quizState.databaseId, dispatch]);

  useEffect(() => {
    if (currentCorrectness !== undefined) {
      setCorrectnessInput(currentCorrectness);
      setHasAdjustedSlider(true);
    } else {
      setCorrectnessInput(0);
      setHasAdjustedSlider(false);
    }
  }, [currentCorrectness, quizState.currentQuestion?.questionId]);

  useEffect(() => {
    if (currentUserAnswer !== undefined) {
      setUserAnswerInput(currentUserAnswer);
    } else {
      setUserAnswerInput("");
    }
  }, [currentUserAnswer, quizState.currentQuestion?.questionId]);

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

  const { currentQuestion, answerRevealed } = quizState;
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
      })
    );
  };

  const handleBackToDatabases = () => {
    dispatch(resetQuiz());
    navigate("/");
  };

  const isLoading = quizState.status === "loading";

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

      {!isLoading && !currentQuestion && (
        <div className="info-message">
          <p>No questions available in this quiz.</p>
          <button onClick={handleBackToDatabases}>Choose another quiz</button>
        </div>
      )}

      {!isLoading && currentQuestion && (
        <section className="question-card">
          <h2>Question</h2>
          <div className="question-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
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
                <div className="answer-text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
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
