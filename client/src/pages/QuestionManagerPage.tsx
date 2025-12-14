import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchQuestionManagerDatabases,
  fetchQuestionsInDatabase,
  fetchQuestionStats,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchPrioritizedQuestions,
  searchQuestions,
  type CreateQuestionDto,
  type UpdateQuestionDto,
  type QuestionStatsResponse,
} from "../api/examApi";
import type { DatabaseInfo, Question } from "../types";
import "../App.css";

function QuestionManagerPage() {
  const { databaseId: urlDatabaseId } = useParams<{ databaseId?: string }>();
  const navigate = useNavigate();

  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(
    urlDatabaseId || null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prioritizedQuestions, setPrioritizedQuestions] = useState<Question[]>(
    []
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [error, setError] = useState<string>();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(
    null
  );
  const [viewingStats, setViewingStats] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<QuestionStatsResponse | null>(
    null
  );
  const [showPrioritized, setShowPrioritized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateQuestionDto>({
    questionText: "",
    answerText: "",
    tags: [],
    domains: [],
  });
  const [editData, setEditData] = useState<UpdateQuestionDto>({});
  const [tagsInput, setTagsInput] = useState("");
  const [domainsInput, setDomainsInput] = useState("");

  useEffect(() => {
    const loadDatabases = async () => {
      try {
        setStatus("loading");
        const dbList = await fetchQuestionManagerDatabases();
        setDatabases(dbList);
        setStatus("ready");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load databases";
        setError(message);
        setStatus("error");
      }
    };
    loadDatabases();
  }, []);

  useEffect(() => {
    if (selectedDatabaseId) {
      const loadQuestions = async () => {
        try {
          setStatus("loading");
          const qs = await fetchQuestionsInDatabase(selectedDatabaseId);
          setQuestions(qs);
          setStatus("ready");
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to load questions";
          setError(message);
          setStatus("error");
        }
      };
      loadQuestions();
    }
  }, [selectedDatabaseId]);

  useEffect(() => {
    if (showPrioritized) {
      const loadPrioritized = async () => {
        try {
          setStatus("loading");
          const qs = await fetchPrioritizedQuestions();
          setPrioritizedQuestions(qs);
          setStatus("ready");
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load prioritized questions";
          setError(message);
          setStatus("error");
        }
      };
      loadPrioritized();
    }
  }, [showPrioritized]);

  const handleDatabaseSelect = (dbId: string) => {
    setSelectedDatabaseId(dbId);
    setShowPrioritized(false);
    navigate(`/question-manager/${dbId}`);
  };

  const handleCreateQuestion = async () => {
    if (!selectedDatabaseId) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const domains = domainsInput
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (!formData.questionText || !formData.answerText || domains.length === 0) {
      alert("Please fill in question text, answer text, and at least one domain");
      return;
    }

    try {
      await createQuestion(selectedDatabaseId, {
        ...formData,
        tags: tags.length > 0 ? tags : undefined,
        domains,
      });
      setShowCreateForm(false);
      setFormData({ questionText: "", answerText: "", tags: [], domains: [] });
      setTagsInput("");
      setDomainsInput("");
      // Reload questions
      const qs = await fetchQuestionsInDatabase(selectedDatabaseId);
      setQuestions(qs);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create question";
      alert(message);
    }
  };

  const handleUpdateQuestion = async (questionId: string) => {
    try {
      await updateQuestion(questionId, editData);
      setEditingQuestion(null);
      setEditData({});
      // Reload questions
      if (selectedDatabaseId) {
        const qs = await fetchQuestionsInDatabase(selectedDatabaseId);
        setQuestions(qs);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update question";
      alert(message);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(questionId);
      // Reload questions
      if (selectedDatabaseId) {
        const qs = await fetchQuestionsInDatabase(selectedDatabaseId);
        setQuestions(qs);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete question";
      alert(message);
    }
  };

  const handleViewStats = async (questionId: string) => {
    try {
      const stats = await fetchQuestionStats(questionId);
      setStatsData(stats);
      setViewingStats(questionId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load statistics";
      alert(message);
    }
  };

  const computeScore = (question: Question): number => {
    if (question.bad === true) return -1;
    const timesAsked = question.timesAsked ?? 0;
    if (timesAsked === 0) return 0;
    const score = question.lastScore ?? question.averageScore ?? 0;
    return Math.round(score);
  };

  const getScoreLabel = (score: number): string => {
    if (score === -1) return "Bad Question";
    if (score === 0) return "Never Answered";
    if (score >= 91) return "Mastered";
    return "Needs Practice";
  };

  const getScoreColor = (score: number): string => {
    if (score === -1) return "#ef4444";
    if (score === 0) return "#64748b";
    if (score >= 91) return "#10b981";
    if (score <= 60) return "#f59e0b";
    return "#3b82f6";
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchQuestions(searchQuery.trim(), selectedDatabaseId || undefined);
      setSearchResults(results);
      setShowPrioritized(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      alert(message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const displayQuestions = isSearching || searchResults.length > 0
    ? searchResults
    : showPrioritized
    ? prioritizedQuestions
    : questions;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Question Manager</h1>
          <button
            className="link-button"
            onClick={() => navigate("/")}
            style={{ marginTop: "0.5rem" }}
          >
            &larr; Back to databases
          </button>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => {
              setShowPrioritized(!showPrioritized);
              setSelectedDatabaseId(null);
              setSearchQuery("");
              setSearchResults([]);
            }}
            style={{
              backgroundColor: showPrioritized ? "#10b981" : "#64748b",
            }}
          >
            {showPrioritized ? "Show All" : "Show Prioritized"}
          </button>
        </div>
      </header>

      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          className="text-input"
          style={{
            minHeight: "auto",
            padding: "0.75rem 1rem",
            flex: 1,
            fontSize: "1rem",
          }}
          placeholder='Search questions (use quotes for phrases, e.g., "machine learning")'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.trim()) {
              setSearchResults([]);
              setIsSearching(false);
            }
          }}
          onKeyPress={handleSearchKeyPress}
        />
        <button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </button>
        {searchResults.length > 0 && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              setIsSearching(false);
            }}
            style={{ backgroundColor: "#64748b" }}
          >
            Clear
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div style={{ marginBottom: "1rem", color: "#64748b" }}>
          Found {searchResults.length} question{searchResults.length !== 1 ? "s" : ""} matching "{searchQuery}"
        </div>
      )}

      {status === "loading" && <p>Loading...</p>}
      {status === "error" && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => setStatus("idle")}>Retry</button>
        </div>
      )}

      {!showPrioritized && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Select Database</h2>
          <div className="database-grid">
            {databases.map((db) => (
              <div
                className="database-card"
                key={db.databaseId}
                style={{
                  borderColor:
                    selectedDatabaseId === db.databaseId
                      ? "#2563eb"
                      : "#d9e2ec",
                  borderWidth:
                    selectedDatabaseId === db.databaseId ? "2px" : "1px",
                }}
              >
                <h2>{db.databaseName}</h2>
                <p>{db.questionCount} Questions</p>
                <button onClick={() => handleDatabaseSelect(db.databaseId)}>
                  {selectedDatabaseId === db.databaseId
                    ? "Selected"
                    : "Select"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPrioritized && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>
            Prioritized Questions ({prioritizedQuestions.length} questions
            needing practice)
          </h2>
        </div>
      )}

      {selectedDatabaseId && !showPrioritized && (
        <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingQuestion(null);
            }}
          >
            {showCreateForm ? "Cancel" : "Create New Question"}
          </button>
        </div>
      )}

      {showCreateForm && selectedDatabaseId && (
        <div className="question-card" style={{ marginBottom: "2rem" }}>
          <h2>Create New Question</h2>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Question Text *
            </label>
            <textarea
              className="text-input"
              value={formData.questionText}
              onChange={(e) =>
                setFormData({ ...formData, questionText: e.target.value })
              }
              placeholder="Enter the question..."
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Answer Text *
            </label>
            <textarea
              className="text-input"
              value={formData.answerText}
              onChange={(e) =>
                setFormData({ ...formData, answerText: e.target.value })
              }
              placeholder="Enter the answer..."
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              className="text-input"
              style={{ minHeight: "auto", padding: "0.5rem" }}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Domains (comma-separated) *
            </label>
            <input
              type="text"
              className="text-input"
              style={{ minHeight: "auto", padding: "0.5rem" }}
              value={domainsInput}
              onChange={(e) => setDomainsInput(e.target.value)}
              placeholder="domain1, domain2"
            />
          </div>
          <button onClick={handleCreateQuestion}>Create Question</button>
        </div>
      )}

      {status === "ready" && displayQuestions.length === 0 && (
        <p>No questions found.</p>
      )}

      {status === "ready" &&
        displayQuestions.map((question) => {
          const score = computeScore(question);
          const isEditing = editingQuestion?.questionId === question.questionId;
          const isViewingStats = viewingStats === question.questionId;

          return (
            <div key={question.questionId} className="question-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        backgroundColor: getScoreColor(score) + "20",
                        color: getScoreColor(score),
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {getScoreLabel(score)} ({score === -1 ? "N/A" : score}%)
                    </span>
                    {(question.timesAsked ?? 0) > 0 && (
                      <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
                        Asked {question.timesAsked} time
                        {(question.timesAsked ?? 0) !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <div>
                      <textarea
                        className="text-input"
                        defaultValue={question.questionText}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            questionText: e.target.value,
                          })
                        }
                      />
                      <div style={{ marginTop: "1rem" }}>
                        <label>Answer:</label>
                        <textarea
                          className="text-input"
                          defaultValue={question.answerText}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              answerText: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                        <button
                          onClick={() => handleUpdateQuestion(question.questionId)}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingQuestion(null);
                            setEditData({});
                          }}
                          style={{ backgroundColor: "#64748b" }}
                        >
                          Cancel
                        </button>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <input
                            type="checkbox"
                            checked={editData.bad ?? question.bad ?? false}
                            onChange={(e) =>
                              setEditData({ ...editData, bad: e.target.checked })
                            }
                          />
                          Mark as bad question
                        </label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="question-text">{question.questionText}</p>
                      <div className="answer-section">
                        <h3>Answer</h3>
                        <p className="answer-text">{question.answerText}</p>
                      </div>
                      {(question.tags?.length ?? 0) > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                          <strong>Tags:</strong> {question.tags?.join(", ")}
                        </div>
                      )}
                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Domains:</strong> {question.domains.join(", ")}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {isViewingStats && statsData && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3>Statistics</h3>
                  <p>
                    <strong>Score:</strong> {statsData.score}% (
                    {getScoreLabel(statsData.score)})
                  </p>
                  <p>
                    <strong>Times Asked:</strong> {statsData.stats.timesAsked}
                  </p>
                  <p>
                    <strong>Average Score:</strong>{" "}
                    {statsData.stats.averageScore?.toFixed(2) ?? "N/A"}%
                  </p>
                  <p>
                    <strong>Last Score:</strong>{" "}
                    {statsData.stats.lastScore?.toFixed(2) ?? "N/A"}%
                  </p>
                  <button
                    onClick={() => {
                      setViewingStats(null);
                      setStatsData(null);
                    }}
                    style={{ marginTop: "0.5rem" }}
                  >
                    Close Stats
                  </button>
                </div>
              )}

              {!isEditing && (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditingQuestion(question);
                      setEditData({});
                      setShowCreateForm(false);
                    }}
                    style={{ backgroundColor: "#3b82f6" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewStats(question.questionId)}
                    style={{ backgroundColor: "#8b5cf6" }}
                  >
                    View Stats
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.questionId)}
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default QuestionManagerPage;


