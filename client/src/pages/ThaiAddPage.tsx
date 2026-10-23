import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createThaiPhrase,
  createThaiSoundbite,
  fetchThaiSoundbites,
  replaceThaiSoundbiteAudio,
} from "../api/examApi";
import type { Question } from "../types";
import "../App.css";

function isM4aFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".m4a") ||
    file.type === "audio/mp4" ||
    file.type === "audio/x-m4a" ||
    file.type === "audio/m4a" ||
    file.type === "audio/aac"
  );
}

function thaiPreview(answerText: string): string {
  const line = answerText.split("\n").find((part) => part.trim());
  return line?.trim() || answerText;
}

function ThaiAddPage() {
  const navigate = useNavigate();

  const [english, setEnglish] = useState("");
  const [thai, setThai] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [romanization, setRomanization] = useState("");
  const [phraseSaving, setPhraseSaving] = useState(false);
  const [phraseMessage, setPhraseMessage] = useState("");
  const [phraseError, setPhraseError] = useState("");

  const [biteThai, setBiteThai] = useState("");
  const [gloss, setGloss] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioInputKey, setAudioInputKey] = useState(0);
  const [biteSaving, setBiteSaving] = useState(false);
  const [biteMessage, setBiteMessage] = useState("");
  const [biteError, setBiteError] = useState("");

  const [soundbites, setSoundbites] = useState<Question[]>([]);
  const [listError, setListError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchThaiSoundbites()
      .then((items) => {
        if (!cancelled) {
          setSoundbites(items);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load sound bites";
          setListError(message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePhraseSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPhraseMessage("");
    setPhraseError("");
    if (!english.trim() || !thai.trim()) {
      setPhraseError("English and Thai script are required");
      return;
    }
    setPhraseSaving(true);
    try {
      await createThaiPhrase({
        english,
        thai,
        phonetic,
        romanization,
      });
      setEnglish("");
      setThai("");
      setPhonetic("");
      setRomanization("");
      setPhraseMessage("Added a card to Thai Phrases.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add the phrase";
      setPhraseError(message);
    } finally {
      setPhraseSaving(false);
    }
  };

  const handleSoundbiteSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBiteMessage("");
    setBiteError("");
    if (!biteThai.trim()) {
      setBiteError("Thai script is required");
      return;
    }
    if (!audioFile) {
      setBiteError("Choose an M4A file");
      return;
    }
    if (!isM4aFile(audioFile)) {
      setBiteError("File must be an M4A");
      return;
    }
    setBiteSaving(true);
    try {
      const created = await createThaiSoundbite({
        thai: biteThai,
        englishGloss: gloss,
        audio: audioFile,
      });
      setSoundbites((current) => [created, ...current]);
      setBiteThai("");
      setGloss("");
      setAudioFile(null);
      setAudioInputKey((key) => key + 1);
      setBiteMessage("Added a sound bite.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add the sound bite";
      setBiteError(message);
    } finally {
      setBiteSaving(false);
    }
  };

  const handleReplaced = (updated: Question) => {
    setSoundbites((current) =>
      current.map((item) =>
        item.questionId === updated.questionId ? updated : item
      )
    );
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Add Thai cards</h1>
          <p>Each save is ready in the next quiz. Scores you already recorded stay put.</p>
        </div>
        <button className="link-button" onClick={() => navigate("/")}>
          &larr; Back
        </button>
      </header>

      <div className="thai-stack">
        <form className="question-card" onSubmit={handlePhraseSubmit}>
          <h2>Phrase</h2>
          <p className="hint">
            One card. The question shows the English phrase and the phonetic spelling. The answer is the Thai script, then the romanization.
          </p>
          {phraseMessage && <p className="success-message">{phraseMessage}</p>}
          {phraseError && <p className="error-message">{phraseError}</p>}
          <label className="field">
            <span className="label">English</span>
            <input
              className="line-input"
              value={english}
              onChange={(event) => setEnglish(event.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="field">
            <span className="label">Thai script</span>
            <input
              className="line-input"
              value={thai}
              onChange={(event) => setThai(event.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="field">
            <span className="label">Phonetic spelling</span>
            <input
              className="line-input"
              value={phonetic}
              onChange={(event) => setPhonetic(event.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="field">
            <span className="label">Romanization</span>
            <input
              className="line-input"
              value={romanization}
              onChange={(event) => setRomanization(event.target.value)}
              autoComplete="off"
            />
          </label>
          <button className="primary-button" type="submit" disabled={phraseSaving}>
            {phraseSaving ? "Saving..." : "Add phrase"}
          </button>
        </form>

        <section className="question-card">
          <h2>Sound bite</h2>
          <p className="hint">
            Upload an M4A. The question plays the clip. The answer is the Thai script of what was said.
          </p>
          <form className="thai-form" onSubmit={handleSoundbiteSubmit}>
            {biteMessage && <p className="success-message">{biteMessage}</p>}
            {biteError && <p className="error-message">{biteError}</p>}
            <label className="field">
              <span className="label">M4A</span>
              <input
                key={audioInputKey}
                type="file"
                accept="audio/mp4,audio/x-m4a,.m4a"
                onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <label className="field">
              <span className="label">Thai script</span>
              <input
                className="line-input"
                value={biteThai}
                onChange={(event) => setBiteThai(event.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="field">
              <span className="label">English gloss</span>
              <input
                className="line-input"
                value={gloss}
                onChange={(event) => setGloss(event.target.value)}
                autoComplete="off"
              />
            </label>
            <button className="primary-button" type="submit" disabled={biteSaving}>
              {biteSaving ? "Saving..." : "Add sound bite"}
            </button>
          </form>

          <h3>Saved sound bites</h3>
          {listError && <p className="error-message">{listError}</p>}
          {soundbites.length === 0 && !listError && (
            <p className="hint">No sound bites yet.</p>
          )}
          <div className="soundbite-list">
            {soundbites.map((question) => (
              <SoundbiteRow
                key={`${question.questionId}-${question.questionAudio ?? ""}`}
                question={question}
                onReplaced={handleReplaced}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SoundbiteRow({
  question,
  onReplaced,
}: {
  question: Question;
  onReplaced: (question: Question) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const handleReplace = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!file) {
      setError("Choose an M4A file");
      return;
    }
    if (!isM4aFile(file)) {
      setError("File must be an M4A");
      return;
    }
    setSaving(true);
    try {
      const updated = await replaceThaiSoundbiteAudio(question.questionId, file);
      onReplaced(updated);
      setFile(null);
      setInputKey((key) => key + 1);
    } catch (replaceError) {
      const message =
        replaceError instanceof Error
          ? replaceError.message
          : "Failed to replace the audio";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="soundbite-row" onSubmit={handleReplace}>
      <strong>{thaiPreview(question.answerText)}</strong>
      {question.questionAudio && (
        <audio
          className="question-audio"
          controls
          preload="none"
          src={question.questionAudio}
        />
      )}
      <label className="field">
        <span className="label">Replace M4A</span>
        <input
          key={inputKey}
          type="file"
          accept="audio/mp4,audio/x-m4a,.m4a"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>
      {error && <p className="error-message">{error}</p>}
      <button className="table-button" type="submit" disabled={saving || !file}>
        {saving ? "Replacing..." : "Replace audio"}
      </button>
    </form>
  );
}

export default ThaiAddPage;
