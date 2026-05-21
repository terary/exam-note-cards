import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownView from "../components/MarkdownView";
import {
  fetchWriteupById,
  fetchReadProgress,
  saveReadProgress,
  type WriteupPayload,
} from "../api/examApi";
import "../App.css";

const SCROLL_SAVE_INTERVAL_MS = 1000;
const MIN_SCROLL_PERCENT_TO_SAVE = 0.01;

function getScrollPercent(): number {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function WriteUpPage() {
  const { writeUpId } = useParams<{ writeUpId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [error, setError] = useState<string>();
  const [data, setData] = useState<WriteupPayload>();
  const savedScrollPercent = useRef<number | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!writeUpId) return;
      try {
        setStatus("loading");
        const [payload, progress] = await Promise.all([
          fetchWriteupById(writeUpId),
          fetchReadProgress(writeUpId),
        ]);
        setData(payload);
        savedScrollPercent.current = progress ? progress.scrollPercent : null;
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

  // Restore scroll position after content paints
  useLayoutEffect(() => {
    if (status !== "ready" || savedScrollPercent.current === null) return;
    const percent = savedScrollPercent.current;
    // Two rAFs: first lets React flush DOM, second lets the browser calculate layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0) {
          window.scrollTo({ top: percent * scrollable, behavior: "instant" });
        }
      });
    });
  }, [status]);

  // Save scroll position (throttled)
  useEffect(() => {
    if (status !== "ready" || !writeUpId) return;

    const handleScroll = () => {
      if (scrollTimerRef.current) return;
      scrollTimerRef.current = setTimeout(() => {
        scrollTimerRef.current = null;
        const percent = getScrollPercent();
        if (percent >= MIN_SCROLL_PERCENT_TO_SAVE) {
          saveReadProgress(writeUpId, percent);
        }
      }, SCROLL_SAVE_INTERVAL_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, [status, writeUpId]);

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
