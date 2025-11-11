import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadDatabases } from "../store/databasesSlice";
import { startQuiz } from "../store/quizSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import "../App.css";

function DatabaseListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pendingDatabaseId, setPendingDatabaseId] = useState<string>();

  const databases = useAppSelector((state) => state.databases.items);
  const databasesStatus = useAppSelector((state) => state.databases.status);
  const databasesError = useAppSelector((state) => state.databases.error);
  const quizState = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (databasesStatus === "idle") {
      dispatch(loadDatabases());
    }
  }, [databasesStatus, dispatch]);

  useEffect(() => {
    if (
      pendingDatabaseId &&
      quizState.status === "ready" &&
      quizState.databaseId === pendingDatabaseId
    ) {
      navigate(`/quiz/${pendingDatabaseId}`);
      setPendingDatabaseId(undefined);
    }

    if (pendingDatabaseId && quizState.status === "error") {
      setPendingDatabaseId(undefined);
    }
  }, [pendingDatabaseId, quizState, navigate]);

  const handleStartQuiz = (databaseId: string) => {
    setPendingDatabaseId(databaseId);
    dispatch(startQuiz({ databaseId }));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Exam Note Cards</h1>
        <p>Select a quiz to start practicing.</p>
      </header>

      {databasesStatus === "loading" && <p>Loading databases...</p>}

      {databasesStatus === "failed" && (
        <div className="error-message">
          <p>Failed to load databases: {databasesError}</p>
          <button onClick={() => dispatch(loadDatabases())}>Try again</button>
        </div>
      )}

      {databasesStatus === "succeeded" && databases.length === 0 && (
        <p>No databases available.</p>
      )}

      {databasesStatus === "succeeded" && databases.length > 0 && (
        <div className="database-grid">
          {databases.map((database) => {
            const isLoading =
              pendingDatabaseId === database.databaseId &&
              quizState.status === "loading";
            return (
              <div className="database-card" key={database.databaseId}>
                <h2>{database.databaseName}</h2>
                <p>{database.questionCount} Questions</p>
                <button
                  onClick={() => handleStartQuiz(database.databaseId)}
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Quiz"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {quizState.status === "error" && (
        <div className="error-message">
          <p>Unable to start quiz: {quizState.error}</p>
        </div>
      )}
    </div>
  );
}

export default DatabaseListPage;

