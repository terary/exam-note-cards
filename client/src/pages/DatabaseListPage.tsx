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
        <div>
        <h1>Exam Note Cards</h1>
        <p>Select a quiz to start practicing.</p>
          <button
            className="link-button"
            onClick={() => navigate("/question-manager")}
            style={{ marginTop: "0.5rem" }}
          >
            Manage Questions →
          </button>
        </div>
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

      {/* Quizzes Table */}
      {databasesStatus === "succeeded" && databases.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Quizzes</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Quiz Name</th>
                <th>Questions</th>
                <th>Unanswered</th>
                <th>Bad</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {databases.map((database) => {
                const isLoading =
                  pendingDatabaseId === database.databaseId &&
                  quizState.status === "loading";
                return (
                  <tr key={database.databaseId}>
                    <td>{database.databaseName}</td>
                    <td>{database.questionCount}</td>
                    <td>{database.unansweredCount ?? 0}</td>
                    <td>{database.badCount ?? 0}</td>
                    <td>
                      <button
                        onClick={() => handleStartQuiz(database.databaseId)}
                        disabled={isLoading}
                        className="table-button"
                      >
                        {isLoading ? "Starting..." : "Start Quiz"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {databasesStatus === "succeeded" && databases.length === 0 && (
        <p style={{ marginTop: "2rem" }}>No quizzes available.</p>
      )}

      {/* Write-ups Table */}
      {writeupsStatus === "ready" && categorizedWriteups.writeups.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Write-ups & Notes</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Write-up Name</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categorizedWriteups.writeups.map((w) => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td>{new Date(w.lastModified).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/write-up-notes/${w.id}`)}
                      className="table-button"
                    >
                      Open Write-up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Vocab Files Table */}
      {writeupsStatus === "ready" && categorizedWriteups.vocabulary.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Vocabulary Files</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Vocab File Name</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categorizedWriteups.vocabulary.map((w) => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td>{new Date(w.lastModified).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/write-up-notes/${w.id}`)}
                      className="table-button"
                    >
                      Open File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {writeupsStatus === "ready" &&
        categorizedWriteups.writeups.length === 0 &&
        categorizedWriteups.vocabulary.length === 0 && (
          <p style={{ marginTop: "2rem" }}>No write-ups or vocab files found.</p>
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

