import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchQuestionsInDatabase,
  fetchQuestionAnswerHistory,
  deleteQuestion,
  deleteAnswerHistoryRecord,
  type AnswerHistoryRecord,
} from "../api/examApi";
import type { Question } from "../types";
import "../App.css";

function QuestionListPage() {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerHistory, setAnswerHistory] = useState<
    Map<string, AnswerHistoryRecord[]>
  >(new Map());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [error, setError] = useState<string>();
  const [sortColumn, setSortColumn] = useState<
    "timesAsked" | "avgScore" | "lastScore" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!databaseId) {
      navigate("/question-manager");
      return;
    }

    const loadQuestions = async () => {
      try {
        setStatus("loading");
        const qs = await fetchQuestionsInDatabase(databaseId);
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
  }, [databaseId, navigate]);

  const handleToggleExpand = async (questionId: string) => {
    if (expandedQuestions.has(questionId)) {
      // Collapse
      setExpandedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    } else {
      // Expand - load answer history if not already loaded
      if (!answerHistory.has(questionId)) {
        try {
          const history = await fetchQuestionAnswerHistory(questionId);
          console.log("Answer history loaded:", history);
          setAnswerHistory((prev) => {
            const newMap = new Map(prev);
            newMap.set(questionId, history);
            return newMap;
          });
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load answer history";
          alert(message);
          return;
        }
      }
      setExpandedQuestions((prev) => new Set(prev).add(questionId));
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
      // Clear answer history for deleted question
      setAnswerHistory((prev) => {
        const newMap = new Map(prev);
        newMap.delete(questionId);
        return newMap;
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete question";
      alert(message);
    }
  };

  const handleDeleteHistoryRecord = async (
    questionId: string,
    sessionId: string,
    recordedAt: string
  ) => {
    if (!confirm("Are you sure you want to delete this answer history record?")) return;

    try {
      await deleteAnswerHistoryRecord(questionId, sessionId, recordedAt);
      // Reload the answer history for this question
      const history = await fetchQuestionAnswerHistory(questionId);
      setAnswerHistory((prev) => {
        const newMap = new Map(prev);
        newMap.set(questionId, history);
        return newMap;
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete answer history record";
      alert(message);
    }
  };

  const handleSort = (
    column: "timesAsked" | "avgScore" | "lastScore"
  ) => {
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
    const questionsToSort = [...questions];

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

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Questions: {databaseId}</h1>
          <button
            className="link-button"
            onClick={() => navigate("/question-manager")}
            style={{ marginTop: "0.5rem" }}
          >
            &larr; Back to Question Manager
          </button>
        </div>
      </header>

      {status === "loading" && <p>Loading questions...</p>}
      {status === "error" && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => setStatus("idle")}>Retry</button>
        </div>
      )}

      {status === "ready" && questions.length === 0 && (
        <p>No questions found in this database.</p>
      )}

      {status === "ready" && questions.length > 0 && (
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
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
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
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuestions.map((question, index) => {
                const timesAsked = question.timesAsked ?? 0;
                const avgScore = question.averageScore;
                const lastScore = question.lastScore;
                const isBad = question.bad === true;
                const isExpanded = expandedQuestions.has(question.questionId);
                const history = answerHistory.get(question.questionId) || [];

                return (
                  <React.Fragment key={question.questionId}>
                    <tr
                      style={{
                        borderBottom: isExpanded ? "none" : "1px solid #e2e8f0",
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f8fafc",
                        cursor: "pointer",
                      }}
                      onClick={() => handleToggleExpand(question.questionId)}
                    >
                      <td style={{ padding: "1rem", maxWidth: "400px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                          }}
                        >
                          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
                            {isExpanded ? "▼" : "▶"}
                          </span>
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
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        {timesAsked}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        {avgScore !== null && avgScore !== undefined
                          ? `${avgScore.toFixed(1)}%`
                          : "—"}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        {lastScore !== null && lastScore !== undefined
                          ? `${lastScore.toFixed(1)}%`
                          : "—"}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
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
                    {isExpanded && (
                      <tr
                        style={{
                          backgroundColor: "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <td colSpan={5} style={{ padding: "1rem" }}>
                          <div
                            style={{
                              marginLeft: "2rem",
                              padding: "1rem",
                              backgroundColor: "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div
                              style={{
                                marginBottom: "1.5rem",
                                padding: "1rem",
                                backgroundColor: "#f8fafc",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <h4
                                style={{
                                  marginTop: 0,
                                  marginBottom: "0.5rem",
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                Answer
                              </h4>
                              <p
                                style={{
                                  margin: 0,
                                  color: "#1f2933",
                                  fontSize: "1rem",
                                  lineHeight: "1.6",
                                }}
                              >
                                {question.answerText}
                              </p>
                            </div>
                            <h4
                              style={{
                                marginTop: 0,
                                marginBottom: "1rem",
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#0f172a",
                              }}
                            >
                              Answer History ({history.length})
                            </h4>
                            {history.length === 0 ? (
                              <p style={{ color: "#64748b", margin: 0 }}>
                                No answer history available for this question.
                              </p>
                            ) : (
                              <div style={{ overflowX: "auto" }}>
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "0.875rem",
                                    minWidth: "600px",
                                  }}
                                >
                                <thead>
                                  <tr
                                    style={{
                                      backgroundColor: "#f1f5f9",
                                      borderBottom: "1px solid #e2e8f0",
                                    }}
                                  >
                                    <th
                                      style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: "#0f172a",
                                      }}
                                    >
                                      Date
                                    </th>
                                    <th
                                      style={{
                                        padding: "0.75rem",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: "#0f172a",
                                      }}
                                    >
                                      Score
                                    </th>
                                    <th
                                      style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: "#0f172a",
                                      }}
                                    >
                                      Your Answer
                                    </th>
                                    <th
                                      style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: "#0f172a",
                                      }}
                                    >
                                      Actual Answer
                                    </th>
                                    <th
                                      style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: "#0f172a",
                                      }}
                                    >
                                      Answer Notes
                                    </th>
                                    <th
                                      style={{
                                        padding: "0.75rem",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: "#0f172a",
                                      }}
                                    >
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {history.map((record, idx) => (
                                    <tr
                                      key={`${record.sessionId}-${idx}`}
                                      style={{
                                        borderBottom:
                                          idx < history.length - 1
                                            ? "1px solid #e2e8f0"
                                            : "none",
                                        backgroundColor:
                                          idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                                      }}
                                    >
                                      <td
                                        style={{
                                          padding: "0.75rem",
                                          color: "#64748b",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {record.recordedAt ? formatDate(record.recordedAt) : "—"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "0.75rem",
                                          textAlign: "center",
                                          color: "#64748b",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {record.userCorrectnessPercentage != null
                                          ? `${record.userCorrectnessPercentage.toFixed(1)}%`
                                          : "—"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "0.75rem",
                                          color: "#1f2933",
                                        }}
                                      >
                                        {record.userAnswerText
                                          ? truncateText(record.userAnswerText, 100)
                                          : "—"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "0.75rem",
                                          color: "#1f2933",
                                        }}
                                      >
                                        {question.answerText
                                          ? truncateText(question.answerText, 100)
                                          : "—"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "0.75rem",
                                          color: "#1f2933",
                                        }}
                                      >
                                        {record.answerNotes
                                          ? truncateText(record.answerNotes, 100)
                                          : "—"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "0.75rem",
                                          textAlign: "center",
                                        }}
                                      >
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteHistoryRecord(
                                              question.questionId,
                                              record.sessionId,
                                              record.recordedAt
                                            );
                                          }}
                                          style={{
                                            backgroundColor: "#ef4444",
                                            padding: "0.375rem 0.75rem",
                                            fontSize: "0.75rem",
                                            color: "#ffffff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default QuestionListPage;

