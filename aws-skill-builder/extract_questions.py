#!/usr/bin/env python3
"""
Extract Question/Solution pairs from aws-skill-builder/*.md and output JSON for database.
"""
import re
import json
import uuid
from pathlib import Path

SKILL_BUILDER_DIR = Path(__file__).resolve().parent
MD_PATTERN = "*.md"
EXCLUDE = {"10000-1-additional-resources.md"}


def normalize_line(line: str) -> str:
    """Remove list prefix and extra spaces."""
    s = line.strip()
    if s.startswith("- "):
        s = s[2:].strip()
    if s.startswith(">"):
        s = s[1:].strip()
    return s


def extract_pairs(content: str) -> list[tuple[str, str]]:
    """Extract (question_text, solution_text) pairs from markdown content."""
    pairs = []
    lines = content.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        # Match "Question:" or "- Question:" (optional space after colon)
        if re.match(r"^[\s]*[- ]*Question\s*:?\s*$", line, re.IGNORECASE) or re.match(
            r"^[\s]*[- ]*Question\s*:\s*", line, re.IGNORECASE
        ):
            # Collect question lines (next line(s) until Solution)
            q_lines = []
            i += 1
            while i < len(lines):
                next_line = lines[i]
                if re.match(r"^[\s]*[- ]*Solution\s*", next_line, re.IGNORECASE) or re.match(
                    r"^Solution\s*:\s*", next_line, re.IGNORECASE
                ):
                    break
                if re.match(r"^[\s]*[- ]*Question\s*", next_line, re.IGNORECASE):
                    break
                if next_line.strip():
                    q_lines.append(normalize_line(next_line))
                i += 1
            question_text = " ".join(q_lines).strip() if q_lines else ""

            # Now find Solution (any variant: Solution:, - Solution:, Solution (I):, etc.)
            solution_lines = []
            while i < len(lines):
                sol_line = lines[i]
                if re.match(r"^[\s]*[- ]*Solution\s*", sol_line, re.IGNORECASE) or re.match(
                    r"^Solution\s*:\s*", sol_line, re.IGNORECASE
                ):
                    i += 1
                    # Collect solution lines until next Question or end
                    while i < len(lines):
                        n = lines[i]
                        if re.match(r"^[\s]*[- ]*Question\s*", n, re.IGNORECASE):
                            break
                        if re.match(r"^[\s]*[- ]*Solution\s*", n, re.IGNORECASE) and solution_lines:
                            # Another Solution (II) etc. - append to same answer
                            i += 1
                            continue
                        if n.strip() and not re.match(r"^Solution\s*:\s*", n, re.IGNORECASE):
                            solution_lines.append(normalize_line(n))
                        i += 1
                    break
                i += 1

            solution_text = " ".join(solution_lines).strip() if solution_lines else ""
            if question_text or solution_text:
                pairs.append((question_text or "(No question text)", solution_text or "(No solution text)"))
            continue
        i += 1
    return pairs


def main():
    all_entries = []
    for md_path in sorted(SKILL_BUILDER_DIR.glob(MD_PATTERN)):
        if md_path.name in EXCLUDE:
            continue
        content = md_path.read_text(encoding="utf-8")
        pairs = extract_pairs(content)
        source = md_path.stem
        for q, a in pairs:
            if not q.strip() or q == "(No question text)":
                continue
            all_entries.append({
                "questionId": str(uuid.uuid4()),
                "questionText": q,
                "answerText": a,
                "tags": ["skills-builder", source],
                "domains": ["skills-builder"],
            })
    db = {
        "databaseName": "Skills Builder (AWS Skill Builder questions)",
        "questionsWithAnswers": all_entries,
    }
    out_path = Path(__file__).resolve().parent.parent / "databases" / "database-skills-builder.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(all_entries)} questions to {out_path}")


if __name__ == "__main__":
    main()
