import type { ThaiPhraseBreakdown, ThaiWordBreakdown } from "../types";

function joinParts(parts: string[] | null | undefined): string {
  return (parts ?? []).filter((part) => part.length > 0).join(" | ");
}

function WordFields({ word }: { word: ThaiWordBreakdown }) {
  if (word.error) {
    return <p className="breakdown-error">{word.error}</p>;
  }

  const rows: Array<[string, string]> = [
    ["syllables (ssg)", joinParts(word.syllables?.ssg)],
    ["syllables (tltk)", joinParts(word.syllables?.tltk)],
    ["ipa", word.ipa ?? ""],
    ["ipa syllables", joinParts(word.ipaSyllables)],
    ["ipa skipped", word.ipaSkipped ?? ""],
    ["pronunciate", joinParts(word.pronunciate)],
    ["pronunciate skipped", word.pronunciateSkipped ?? ""],
    ["romanize (royin)", word.romanize?.royin ?? ""],
    ["romanize (ssg)", joinParts(word.romanize?.ssg)],
    ["romanize (w2p)", joinParts(word.romanize?.w2p)],
    ["romanize skipped", word.romanizeSkipped ?? ""],
    ["romanize (w2p) skipped", word.romanizeW2pSkipped ?? ""],
    ["soundex (udom83)", word.soundex?.udom83 ?? ""],
    ["soundex (lk82)", word.soundex?.lk82 ?? ""],
    ["soundex (metasound)", word.soundex?.metasound ?? ""],
  ];

  return (
    <dl className="breakdown-fields">
      {rows
        .filter(([, value]) => value.length > 0)
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}

const TONES = [
  { id: "mid", label: "mid", contour: "˧" },
  { id: "low", label: "low", contour: "˨˩" },
  { id: "falling", label: "falling", contour: "˥˩" },
  { id: "high", label: "high", contour: "˦˥" },
  { id: "rising", label: "rising", contour: "˩˩˦" },
] as const;

type ToneId = (typeof TONES)[number]["id"];

const TONE_BY_CONTOUR = new Map(TONES.map((tone) => [tone.contour, tone.id]));

function markedTone(tone: ToneId | null): ToneId | null {
  return tone === "mid" ? null : tone;
}

function toneOf(ipaSyllable: string): ToneId | null {
  const contour = ipaSyllable.trim().match(/[˩˨˧˦˥]+$/)?.[0];
  if (!contour) {
    return null;
  }
  return TONE_BY_CONTOUR.get(contour as (typeof TONES)[number]["contour"]) ?? null;
}

function tonedWords(breakdown: ThaiPhraseBreakdown): Array<Array<{ text: string; tone: ToneId | null }>> {
  return breakdown.words.flatMap((word) => {
    const parts = (word.romanize?.w2p ?? []).filter((part) => part.length > 0);
    if (parts.length === 0) {
      return [];
    }
    const ipa = word.ipaSyllables ?? [];
    const aligned = parts.length === ipa.length;
    return [
      parts.map((text, index) => ({
        text,
        tone: aligned ? markedTone(toneOf(ipa[index] ?? "")) : null,
      })),
    ];
  });
}

function ToneKey() {
  return (
    <aside className="tone-key">
      <div className="tone-key-label">tone indicators</div>
      {TONES.map((tone) => (
        <div key={tone.id} className={tone.id === "mid" ? undefined : `tone tone-${tone.id}`}>
          {tone.id === "mid" ? "mid [no marker]" : tone.label}
        </div>
      ))}
    </aside>
  );
}

function RomanizedLine({ breakdown }: { breakdown: ThaiPhraseBreakdown }) {
  const words = tonedWords(breakdown);
  if (words.length === 0) {
    return null;
  }
  return (
    <p className="breakdown-source breakdown-romanized">
      <span>
        {words.map((syllables, wordIndex) => (
          <span key={wordIndex}>
            {wordIndex > 0 && ", "}
            {syllables.map((syllable, syllableIndex) => (
              <span key={syllableIndex}>
                {syllableIndex > 0 && " | "}
                <span className={syllable.tone ? `tone tone-${syllable.tone}` : undefined}>
                  {syllable.text}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
      <ToneKey />
    </p>
  );
}

function PracticeNote({ breakdown }: { breakdown: ThaiPhraseBreakdown }) {
  const practice = breakdown.practice;
  if (!practice) {
    return null;
  }
  const glossLabel = practice.kind === "particle" ? "closes" : "meaning";
  return (
    <div className="breakdown-gloss">
      <p className="breakdown-answer">{breakdown.text}</p>
      {practice.kind === "particle" && (
        <p className="breakdown-note">sentence-final particle</p>
      )}
      {practice.gloss && (
        <p className="breakdown-note">
          <span className="breakdown-label">{glossLabel}:</span> {practice.gloss}
        </p>
      )}
      {practice.examples.length > 0 && (
        <p className="breakdown-note">
          <span className="breakdown-label">example of:</span> {practice.examples.join(", ")}
        </p>
      )}
    </div>
  );
}

function WordSections({ breakdown }: { breakdown: ThaiPhraseBreakdown }) {
  return (
    <>
      {breakdown.words.map((word, index) => (
        <section key={`${word.word}-${index}`} className="breakdown-word">
          <h4>{word.word}</h4>
          <WordFields word={word} />
        </section>
      ))}
    </>
  );
}

function WordBreakdown({
  breakdown,
  answerText,
}: {
  breakdown: ThaiPhraseBreakdown;
  answerText?: string;
}) {
  const syllables = (
    <>
      <p className="breakdown-source">
        {breakdown.segmenter} · {breakdown.text}
      </p>
      <RomanizedLine breakdown={breakdown} />
      {breakdown.practice ? (
        <PracticeNote breakdown={breakdown} />
      ) : (
        answerText && <div className="breakdown-answer">{answerText}</div>
      )}
    </>
  );

  if (answerText) {
    return (
      <div className="pronunciation-prompt">
        {syllables}
        <details className="more-info">
          <summary>More info</summary>
          <WordSections breakdown={breakdown} />
        </details>
      </div>
    );
  }

  return (
    <details className="more-info">
      <summary>More info</summary>
      {syllables}
      <WordSections breakdown={breakdown} />
    </details>
  );
}

export default WordBreakdown;
