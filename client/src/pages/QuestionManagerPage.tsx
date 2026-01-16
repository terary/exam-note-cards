import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchQuestionManagerDatabases,
  fetchQuestionsInDatabase,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  type CreateQuestionDto,
  type UpdateQuestionDto,
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
  const [databaseStats, setDatabaseStats] = useState<Map<string, {
    total: number;
    bad: number;
    unanswered: number;
    answered: number;
    poorScore: number;
    goodScore: number;
  }>>(new Map());
  const [loadingStats, setLoadingStats] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [error, setError] = useState<string>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortColumn, setSortColumn] = useState<"timesAsked" | "avgScore" | "lastScore" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Edit form state
  const [editData, setEditData] = useState<UpdateQuestionDto>({});
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editDomainsInput, setEditDomainsInput] = useState("");

  // Create form state
  const [createData, setCreateData] = useState<CreateQuestionDto>({
    questionText: "",
    answerText: "",
    tags: [],
    domains: [],
  });
  const [createTagsInput, setCreateTagsInput] = useState("");
  const [createDomainsInput, setCreateDomainsInput] = useState("");

  useEffect(() => {
    const loadDatabases = async () => {
      try {
        setStatus("loading");
        const dbList = await fetchQuestionManagerDatabases();
        // Filter out unused databases
        const filteredDbList = dbList.filter(
          (db) => !["tmp", "tmp.md", "database", "database-one"].includes(db.databaseId)
        );
        setDatabases(filteredDbList);
        if (urlDatabaseId) {
          setSelectedDatabaseId(urlDatabaseId);
        }
        setStatus("ready");
        
        // Load stats for all databases
        setLoadingStats(true);
        const statsMap = new Map<string, {
          total: number;
          bad: number;
          unanswered: number;
          answered: number;
          poorScore: number;
          goodScore: number;
        }>();
        
        for (const db of filteredDbList) {
          try {
            const qs = await fetchQuestionsInDatabase(db.databaseId);
            const stats = {
              total: qs.length,
              bad: qs.filter(q => {
                const score = q.lastScore ?? q.averageScore ?? null;
                return score !== null && score < 0;
              }).length,
              unanswered: qs.filter(q => (q.timesAsked ?? 0) === 0).length,
              answered: qs.filter(q => (q.timesAsked ?? 0) > 0).length,
              poorScore: qs.filter(q => {
                const score = q.lastScore ?? q.averageScore ?? null;
                return score !== null && score >= 1 && score <= 80;
              }).length,
              goodScore: qs.filter(q => {
                const score = q.lastScore ?? q.averageScore ?? null;
                return score !== null && score > 80;
              }).length,
            };
            statsMap.set(db.databaseId, stats);
          } catch (err) {
            // If we can't load questions for a database, set default stats
            statsMap.set(db.databaseId, {
              total: db.questionCount,
              bad: 0,
              unanswered: 0,
              answered: 0,
              poorScore: 0,
              goodScore: 0,
            });
          }
        }
        
        setDatabaseStats(statsMap);
        setLoadingStats(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load databases";
        setError(message);
        setStatus("error");
        setLoadingStats(false);
      }
    };
    loadDatabases();
  }, [urlDatabaseId]);

  useEffect(() => {
    if (selectedDatabaseId && !isSearching) {
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
  }, [selectedDatabaseId, isSearching]);

  const handleDatabaseSelect = (dbId: string) => {
    setSelectedDatabaseId(dbId);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    navigate(`/question-manager/${dbId}/questions`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchQuestions(
        searchQuery.trim(),
        selectedDatabaseId || undefined
      );
      setSearchResults(results);
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

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setEditData({
      questionText: question.questionText,
      answerText: question.answerText,
      tags: question.tags,
      domains: question.domains,
      timesAsked: question.timesAsked,
      averageScore: question.averageScore,
      lastScore: question.lastScore,
    });
    setEditTagsInput(question.tags?.join(", ") || "");
    setEditDomainsInput(question.domains.join(", "));
    setShowEditModal(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    const tags = editTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const domains = editDomainsInput
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (domains.length === 0) {
      alert("Please provide at least one domain");
      return;
    }

    try {
      await updateQuestion(editingQuestion.questionId, {
        ...editData,
        tags: tags.length > 0 ? tags : undefined,
        domains,
      });
      setShowEditModal(false);
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

  const handleCreateQuestion = async () => {
    if (!selectedDatabaseId) {
      alert("Please select a database first");
      return;
    }

    const tags = createTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const domains = createDomainsInput
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (!createData.questionText || !createData.answerText || domains.length === 0) {
      alert("Please fill in question text, answer text, and at least one domain");
      return;
    }

    try {
      await createQuestion(selectedDatabaseId, {
        ...createData,
        tags: tags.length > 0 ? tags : undefined,
        domains,
      });
      setShowCreateModal(false);
      setCreateData({ questionText: "", answerText: "", tags: [], domains: [] });
      setCreateTagsInput("");
      setCreateDomainsInput("");
      // Reload questions
      const qs = await fetchQuestionsInDatabase(selectedDatabaseId);
      setQuestions(qs);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create question";
      alert(message);
    }
  };

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleSort = (column: "timesAsked" | "avgScore" | "lastScore") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: "timesAsked" | "avgScore" | "lastScore") => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const sortedQuestions = (() => {
    const questionsToSort = isSearching || searchResults.length > 0
      ? [...searchResults]
      : [...questions];

    if (!sortColumn) return questionsToSort;

    return questionsToSort.sort((a, b) => {
      let aValue: number | null;
      let bValue: number | null;

      switch (sortColumn) {
        case "timesAsked":
          aValue = a.timesAsked ?? 0;
          bValue = b.timesAsked ?? 0;
          break;
        case "avgScore":
          aValue = a.averageScore ?? null;
          bValue = b.averageScore ?? null;
          break;
        case "lastScore":
          aValue = a.lastScore ?? null;
          bValue = b.lastScore ?? null;
          break;
      }

      // Handle null values - put them at the end
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue - bValue;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  })();

  const displayQuestions = sortedQuestions;

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
      </header>

      {status === "loading" && <p>Loading...</p>}
      {status === "error" && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => setStatus("idle")}>Retry</button>
        </div>
      )}

      {/* Database Selection Table */}
      {status === "ready" && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Select Database</h2>
          {loadingStats && <p style={{ color: "#64748b" }}>Loading statistics...</p>}
          <table className="data-table" style={{ marginBottom: "2rem" }}>
            <thead>
              <tr>
                <th>Database Name</th>
                <th>Total Questions</th>
                <th>Bad Questions</th>
                <th>Unanswered</th>
                <th>Questions Answered</th>
                <th>Poor Score (1-80)</th>
                <th>Good Score (&gt;80)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {databases.map((db) => {
                const stats = databaseStats.get(db.databaseId) || {
                  total: db.questionCount,
                  bad: 0,
                  unanswered: 0,
                  answered: 0,
                  poorScore: 0,
                  goodScore: 0,
                };
                const isSelected = selectedDatabaseId === db.databaseId;
                return (
                  <tr
                    key={db.databaseId}
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : undefined,
                      cursor: "pointer",
                    }}
                    onClick={() => handleDatabaseSelect(db.databaseId)}
                  >
                    <td>
                      <strong>{db.databaseName}</strong>
                    </td>
                    <td>{stats.total}</td>
                    <td>{stats.bad}</td>
                    <td>{stats.unanswered}</td>
                    <td>{stats.answered}</td>
                    <td>{stats.poorScore}</td>
                    <td>{stats.goodScore}</td>
                    <td>
                      <button
                        className="table-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDatabaseSelect(db.databaseId);
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Search and Actions */}
      {status === "ready" && (
        <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          className="text-input"
          style={{
            minHeight: "auto",
            padding: "0.75rem 1rem",
            flex: 1,
            fontSize: "1rem",
            minWidth: "200px",
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
        {selectedDatabaseId && (
          <button onClick={() => setShowCreateModal(true)}>
            Create Question
          </button>
        )}
        </div>
      )}

      {searchResults.length > 0 && (
        <div style={{ marginBottom: "1rem", color: "#64748b" }}>
          Found {searchResults.length} question{searchResults.length !== 1 ? "s" : ""} matching "{searchQuery}"
        </div>
      )}

      {status === "ready" && !selectedDatabaseId && !isSearching && (
        <p>Please select a database to view questions.</p>
      )}

      {status === "ready" && selectedDatabaseId && displayQuestions.length === 0 && !isSearching && (
        <p>Click "Select" to view questions for this database.</p>
      )}

      {status === "ready" && displayQuestions.length > 0 && isSearching && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "#0f172a" }}>
                  Question
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#0f172a",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("timesAsked")}
                >
                  Times Asked {getSortIcon("timesAsked")}
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#0f172a",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("avgScore")}
                >
                  Avg Score {getSortIcon("avgScore")}
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#0f172a",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("lastScore")}
                >
                  Last Score {getSortIcon("lastScore")}
                </th>
                <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "#0f172a" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayQuestions.map((question, index) => {
                const timesAsked = question.timesAsked ?? 0;
                const avgScore = question.averageScore;
                const lastScore = question.lastScore;
                const isBad = question.bad === true;

                return (
                  <tr
                    key={question.questionId}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td style={{ padding: "1rem", maxWidth: "400px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        {isBad && (
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px",
                              backgroundColor: "#ef4444",
                              color: "#ffffff",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            BAD
                          </span>
                        )}
                        <span style={{ color: "#1f2933" }}>
                          {truncateText(question.questionText, 150)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#64748b" }}>
                      {timesAsked}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#64748b" }}>
                      {avgScore !== null && avgScore !== undefined
                        ? `${avgScore.toFixed(1)}%`
                        : "—"}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#64748b" }}>
                      {lastScore !== null && lastScore !== undefined
                        ? `${lastScore.toFixed(1)}%`
                        : "—"}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        <button
                          onClick={() => handleEditClick(question)}
                          style={{
                            backgroundColor: "#3b82f6",
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.questionId)}
                          style={{
                            backgroundColor: "#ef4444",
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQuestion && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={() => {
            setShowEditModal(false);
            setEditingQuestion(null);
            setEditData({});
          }}
        >
          <div
            className="question-card"
            style={{
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2>Edit Question</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingQuestion(null);
                  setEditData({});
                }}
                style={{ backgroundColor: "#64748b", padding: "0.5rem 1rem" }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Question Text *
              </label>
              <textarea
                className="text-input"
                value={editData.questionText ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, questionText: e.target.value })
                }
                placeholder="Enter the question..."
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Answer Text *
              </label>
              <textarea
                className="text-input"
                value={editData.answerText ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, answerText: e.target.value })
                }
                placeholder="Enter the answer..."
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                className="text-input"
                style={{ minHeight: "auto", padding: "0.5rem" }}
                value={editTagsInput}
                onChange={(e) => setEditTagsInput(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Domains (comma-separated) *
              </label>
              <input
                type="text"
                className="text-input"
                style={{ minHeight: "auto", padding: "0.5rem" }}
                value={editDomainsInput}
                onChange={(e) => setEditDomainsInput(e.target.value)}
                placeholder="domain1, domain2"
              />
            </div>

            <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>Statistics</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>
                    Times Asked
                  </label>
                  <input
                    type="number"
                    className="text-input"
                    style={{ minHeight: "auto", padding: "0.5rem" }}
                    value={editData.timesAsked ?? 0}
                    onChange={(e) =>
                      setEditData({ ...editData, timesAsked: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>
                    Average Score (%)
                  </label>
                  <input
                    type="number"
                    className="text-input"
                    style={{ minHeight: "auto", padding: "0.5rem" }}
                    value={editData.averageScore ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditData({
                        ...editData,
                        averageScore: val === "" ? null : parseFloat(val),
                      });
                    }}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="—"
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>
                    Last Score (%)
                  </label>
                  <input
                    type="number"
                    className="text-input"
                    style={{ minHeight: "auto", padding: "0.5rem" }}
                    value={editData.lastScore ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditData({
                        ...editData,
                        lastScore: val === "" ? null : parseFloat(val),
                      });
                    }}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="—"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={handleUpdateQuestion}>Save Changes</button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingQuestion(null);
                  setEditData({});
                }}
                style={{ backgroundColor: "#64748b" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={() => {
            setShowCreateModal(false);
            setCreateData({ questionText: "", answerText: "", tags: [], domains: [] });
            setCreateTagsInput("");
            setCreateDomainsInput("");
          }}
        >
          <div
            className="question-card"
            style={{
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2>Create New Question</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateData({ questionText: "", answerText: "", tags: [], domains: [] });
                  setCreateTagsInput("");
                  setCreateDomainsInput("");
                }}
                style={{ backgroundColor: "#64748b", padding: "0.5rem 1rem" }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Question Text *
              </label>
              <textarea
                className="text-input"
                value={createData.questionText}
                onChange={(e) =>
                  setCreateData({ ...createData, questionText: e.target.value })
                }
                placeholder="Enter the question..."
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Answer Text *
              </label>
              <textarea
                className="text-input"
                value={createData.answerText}
                onChange={(e) =>
                  setCreateData({ ...createData, answerText: e.target.value })
                }
                placeholder="Enter the answer..."
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                className="text-input"
                style={{ minHeight: "auto", padding: "0.5rem" }}
                value={createTagsInput}
                onChange={(e) => setCreateTagsInput(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Domains (comma-separated) *
              </label>
              <input
                type="text"
                className="text-input"
                style={{ minHeight: "auto", padding: "0.5rem" }}
                value={createDomainsInput}
                onChange={(e) => setCreateDomainsInput(e.target.value)}
                placeholder="domain1, domain2"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={handleCreateQuestion}>Create Question</button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateData({ questionText: "", answerText: "", tags: [], domains: [] });
                  setCreateTagsInput("");
                  setCreateDomainsInput("");
                }}
                style={{ backgroundColor: "#64748b" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionManagerPage;
