#!/usr/bin/env python3
"""
Extract Q/A blocks from concatenated section-3 lecture notes, and optionally
emit the same document with all well-formed question blocks removed (lecture
notes only).

Supports delimiters:
  __QUESTION__ / __ANSWER__ / __QUESTION_END__
  _QUESTION_ / _ANSWER_ / _END_QUESTION
  **QUESTION** / **ANSWER** / **QUESTION_END**

Skips blocks where both question and answer are empty (after strip).
Uses "missing question" / "missing answer" when a section is absent.
"""

from __future__ import annotations

import argparse
import json
import re
import uuid
from pathlib import Path

# `_QUESTION_` must not match inside `__QUESTION__` (same for _ANSWER_, _END_QUESTION).
_RE_Q_SINGLE = re.compile(r"(?<!_)_QUESTION_(?!_)")
_RE_A_SINGLE = re.compile(r"(?<!_)_ANSWER_(?!_)")
_RE_END_SINGLE = re.compile(r"_END_QUESTION")


def _find_single(pattern: re.Pattern[str], text: str, pos: int) -> int:
    m = pattern.search(text, pos)
    return m.start() if m else -1


def find_next_question_start(text: str, pos: int) -> tuple[int, tuple[str, str, str]] | None:
    candidates: list[tuple[int, tuple[str, str, str]]] = []

    i = text.find("__QUESTION__", pos)
    if i != -1:
        candidates.append((i, ("__QUESTION__", "__ANSWER__", "__QUESTION_END__")))

    j = _find_single(_RE_Q_SINGLE, text, pos)
    if j != -1:
        candidates.append((j, ("_QUESTION_", "_ANSWER_", "_END_QUESTION")))

    k = text.find("**QUESTION**", pos)
    if k != -1:
        candidates.append((k, ("**QUESTION**", "**ANSWER**", "**QUESTION_END**")))

    if not candidates:
        return None
    return min(candidates, key=lambda x: x[0])


def _find_answer_pos(text: str, after_q: int, q_mark: str) -> int:
    if q_mark == "_QUESTION_":
        m = _RE_A_SINGLE.search(text, after_q)
        return m.start() if m else -1
    a_mark = "__ANSWER__" if q_mark == "__QUESTION__" else "**ANSWER**"
    return text.find(a_mark, after_q)


def _find_end_pos(text: str, after_a: int, q_mark: str) -> int:
    if q_mark == "_QUESTION_":
        m = _RE_END_SINGLE.search(text, after_a)
        return m.start() if m else -1
    e_mark = "__QUESTION_END__" if q_mark == "__QUESTION__" else "**QUESTION_END**"
    return text.find(e_mark, after_a)


def extract_blocks(text: str) -> list[tuple[str, str]]:
    blocks: list[tuple[str, str]] = []
    pos = 0
    n = len(text)

    while pos < n:
        found = find_next_question_start(text, pos)
        if found is None:
            break
        start_q, (q_mark, a_mark, e_mark) = found
        after_q = start_q + len(q_mark)

        a_pos = _find_answer_pos(text, after_q, q_mark)
        if a_pos == -1:
            q = text[after_q:].strip()
            a = "missing answer"
            if q or a != "missing answer":
                blocks.append((q if q else "missing question", a))
            break

        question = text[after_q:a_pos].strip()
        after_a = a_pos + len(a_mark)

        e_pos = _find_end_pos(text, after_a, q_mark)
        if e_pos == -1:
            answer = text[after_a:].strip()
            blocks.append(
                (
                    question if question else "missing question",
                    answer if answer else "missing answer",
                )
            )
            break

        answer = text[after_a:e_pos].strip()
        pos = e_pos + len(e_mark)

        q_final = question if question else "missing question"
        a_final = answer if answer else "missing answer"
        if not question and not answer:
            continue
        blocks.append((q_final, a_final))

    return blocks


def strip_question_blocks(text: str) -> str:
    """Remove every complete Q/A block; keep the rest (same boundaries as extract_blocks)."""
    out: list[str] = []
    pos = 0
    n = len(text)

    while pos < n:
        found = find_next_question_start(text, pos)
        if found is None:
            out.append(text[pos:])
            break
        start_q, (q_mark, a_mark, e_mark) = found
        out.append(text[pos:start_q])
        after_q = start_q + len(q_mark)

        a_pos = _find_answer_pos(text, after_q, q_mark)
        if a_pos == -1:
            out.append(text[start_q:])
            break
        after_a = a_pos + len(a_mark)

        e_pos = _find_end_pos(text, after_a, q_mark)
        if e_pos == -1:
            out.append(text[start_q:])
            break

        pos = e_pos + len(e_mark)

    return "".join(out)


def write_todo_md(path: Path, blocks: list[tuple[str, str]]) -> None:
    lines: list[str] = [
        "# Section 3: Identity & Federation — extracted questions",
        "",
    ]
    for i, (q, a) in enumerate(blocks, start=1):
        lines.extend(
            [
                f"## Question {i:03d}",
                "",
                "__QUESTION__",
                "",
                q,
                "",
                "__ANSWER__",
                "",
                a,
                "",
                "__QUESTION_END__",
                "",
            ]
        )
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_database_json(
    path: Path,
    blocks: list[tuple[str, str]],
    *,
    database_name: str,
    database_id: str,
    tags: list[str],
    domains: list[str],
) -> None:
    items = []
    for q, a in blocks:
        items.append(
            {
                "questionId": str(uuid.uuid4()),
                "questionText": q,
                "answerText": a,
                "tags": list(tags),
                "domains": list(domains),
            }
        )
    payload = {
        "databaseName": database_name,
        "databaseId": database_id,
        "questionsWithAnswers": items,
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("writeup-and-notes/100003-section-3-ident-and-fed.all.md"),
    )
    parser.add_argument(
        "--todo-out",
        type=Path,
        default=Path("writeup-and-notes/100003-section-3-ident-and-fed-questions-tod.md"),
    )
    parser.add_argument(
        "--json-out",
        type=Path,
        default=Path("databases/database-section-3-ident-fed.json"),
    )
    parser.add_argument(
        "--lecture-out",
        type=Path,
        default=Path("writeup-and-notes/100003-section-3-ident-and-fed.md"),
        help="Write lecture notes with all question blocks removed.",
    )
    parser.add_argument(
        "--database-name",
        default="Section 3 - Identity and Federation",
    )
    parser.add_argument(
        "--database-id",
        default="database-section-3-ident-fed",
    )
    args = parser.parse_args()

    text = args.input.read_text(encoding="utf-8")
    blocks = extract_blocks(text)

    args.todo_out.parent.mkdir(parents=True, exist_ok=True)
    args.json_out.parent.mkdir(parents=True, exist_ok=True)

    write_todo_md(args.todo_out, blocks)
    write_database_json(
        args.json_out,
        blocks,
        database_name=args.database_name,
        database_id=args.database_id,
        tags=["section-3"],
        domains=["general"],
    )

    args.lecture_out.parent.mkdir(parents=True, exist_ok=True)
    args.lecture_out.write_text(strip_question_blocks(text), encoding="utf-8")

    print(f"Extracted {len(blocks)} Q/A pairs")
    print(f"Wrote {args.todo_out}")
    print(f"Wrote {args.json_out}")
    print(f"Wrote {args.lecture_out}")


if __name__ == "__main__":
    main()
