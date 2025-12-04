import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadDatabases } from "../store/databasesSlice";
import { fetchWriteups, fetchExternalIp, type CategorizedWriteups } from "../api/examApi";
import { startQuiz } from "../store/quizSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import "../App.css";

function DatabaseListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pendingDatabaseId, setPendingDatabaseId] = useState<string>();
  const [categorizedWriteups, setCategorizedWriteups] = useState<CategorizedWriteups>({
    writeups: [],
    vocabulary: [],
    todo: [],
  });
  const [writeupsStatus, setWriteupsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [writeupsError, setWriteupsError] = useState<string>();
  const [externalIp, setExternalIp] = useState<string>("");
  const [ipStatus, setIpStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

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
    const load = async () => {
      try {
        setWriteupsStatus("loading");
        const categorized = await fetchWriteups();
        // Ensure we have the expected structure
        if (categorized && typeof categorized === "object") {
          setCategorizedWriteups({
            writeups: Array.isArray(categorized.writeups) ? categorized.writeups : [],
            vocabulary: Array.isArray(categorized.vocabulary) ? categorized.vocabulary : [],
            todo: Array.isArray(categorized.todo) ? categorized.todo : [],
          });
        } else {
          // Fallback for unexpected format
          setCategorizedWriteups({ writeups: [], vocabulary: [], todo: [] });
        }
        setWriteupsStatus("ready");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load write-ups";
        setWriteupsError(message);
        setWriteupsStatus("error");
        console.error("Error loading write-ups:", error);
      }
    };
    if (writeupsStatus === "idle") {
      load();
    }
  }, [writeupsStatus]);

  useEffect(() => {
    const loadIp = async () => {
      try {
        setIpStatus("loading");
        const data = await fetchExternalIp();
        setExternalIp(data.ip);
        setIpStatus("ready");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load IP";
        console.error("Failed to fetch external IP:", message);
        setIpStatus("error");
      }
    };
    if (ipStatus === "idle") {
      loadIp();
    }
  }, [ipStatus]);

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
        {ipStatus === "ready" && externalIp && (
          <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.5rem" }}>
            External IP: <strong>{externalIp}</strong>
          </p>
        )}
        {ipStatus === "loading" && (
          <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.5rem" }}>
            Loading IP...
          </p>
        )}
        {ipStatus === "error" && (
          <p style={{ fontSize: "0.9rem", color: "#ef4444", marginTop: "0.5rem" }}>
            Unable to fetch external IP
          </p>
        )}
      </header>

      {databasesStatus === "loading" && <p>Loading databases...</p>}
      {writeupsStatus === "loading" && <p>Loading write-ups...</p>}

      {databasesStatus === "failed" && (
        <div className="error-message">
          <p>Failed to load databases: {databasesError}</p>
          <button onClick={() => dispatch(loadDatabases())}>Try again</button>
        </div>
      )}
      {writeupsStatus === "error" && (
        <div className="error-message">
          <p>Failed to load write-ups: {writeupsError}</p>
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

      {writeupsStatus === "ready" && (
        <>
          {categorizedWriteups.writeups.length > 0 && (
            <>
              <h2 style={{ marginTop: "2rem" }}>Write-ups & Notes</h2>
              <div className="database-grid">
                {categorizedWriteups.writeups.map((w) => (
                  <div className="database-card" key={w.id}>
                    <h2>{w.id}</h2>
                    <p>Last updated: {new Date(w.lastModified).toLocaleString()}</p>
                    <button onClick={() => navigate(`/write-up-notes/${w.id}`)}>
                      Open Write-up
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {categorizedWriteups.vocabulary.length > 0 && (
            <>
              <h2 style={{ marginTop: "2rem" }}>Vocabulary</h2>
              <div className="database-grid">
                {categorizedWriteups.vocabulary.map((w) => (
                  <div className="database-card" key={w.id}>
                    <h2>{w.id}</h2>
                    <p>Last updated: {new Date(w.lastModified).toLocaleString()}</p>
                    <button onClick={() => navigate(`/write-up-notes/${w.id}`)}>
                      Open Write-up
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {categorizedWriteups.todo.length > 0 && (
            <>
              <h2 style={{ marginTop: "2rem" }}>To Do and Followup</h2>
              <div className="database-grid">
                {categorizedWriteups.todo.map((w) => (
                  <div className="database-card" key={w.id}>
                    <h2>{w.id}</h2>
                    <p>Last updated: {new Date(w.lastModified).toLocaleString()}</p>
                    <button onClick={() => navigate(`/write-up-notes/${w.id}`)}>
                      Open Write-up
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {categorizedWriteups.writeups.length === 0 &&
            categorizedWriteups.vocabulary.length === 0 &&
            categorizedWriteups.todo.length === 0 && (
              <p style={{ marginTop: "2rem" }}>No write-ups found.</p>
            )}
        </>
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

