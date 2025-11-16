import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownView from "../components/MarkdownView";
import { fetchWriteupById, type WriteupPayload } from "../api/examApi";
import "../App.css";

function WriteUpPage() {
  const { writeUpId } = useParams<{ writeUpId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [error, setError] = useState<string>();
  const [data, setData] = useState<WriteupPayload>();

  useEffect(() => {
    const load = async () => {
      if (!writeUpId) return;
      try {
        setStatus("loading");
        const payload = await fetchWriteupById(writeUpId);
        setData(payload);
        setStatus("ready");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load write-up";
        setError(message);
        setStatus("error");
      }
    };
    load();
  }, [writeUpId]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Write-up</h1>
        <button className="link-button" onClick={() => navigate("/")}>
          &larr; Back to home
        </button>
      </header>

      {status === "loading" && <p>Loading...</p>}
      {status === "error" && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      {status === "ready" && data && (
        <>
          <h2 style={{ marginTop: 0 }}>{data.id}</h2>
          <p style={{ color: "#64748b" }}>
            Last updated: {new Date(data.lastModified).toLocaleString()}
          </p>
          <MarkdownView markdown={data.content} />
        </>
      )}
    </div>
  );
}

export default WriteUpPage;


