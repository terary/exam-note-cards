#!/usr/bin/env python3
"""
Extract Q/A blocks from lecture notes and emit section artifacts.

Supports delimiters:
  __QUESTION__ / __ANSWER__ / __QUESTION_END__
  _QUESTION_ / _ANSWER_ / _END_QUESTION
  **QUESTION** / **ANSWER** / **QUESTION_END**

Optional research markers (placed right before a question block):
  __RESEARCH__
  _RESEARCH_
  **RESEARCH**

Skips blocks where both question and answer are empty (after strip).
Uses "missing question" / "missing answer" when a section is absent.
"""

from __future__ import annotations

import argparse
import json
import re
import uuid
from dataclasses import dataclass
from pathlib import Path

# `_QUESTION_` must not match inside `__QUESTION__` (same for _ANSWER_, _END_QUESTION).
_RE_Q_SINGLE = re.compile(r"(?<!_)_QUESTION_(?!_)")
_RE_A_SINGLE = re.compile(r"(?<!_)_ANSWER_(?!_)")
_RE_END_SINGLE = re.compile(r"_END_QUESTION")


@dataclass
class QuestionBlock:
    question: str
    answer: str
    is_research: bool


@dataclass
class ResearchPrompt:
    question: str


def _find_single(pattern: re.Pattern[str], text: str, pos: int) -> int:
    m = pattern.search(text, pos)
    return m.start() if m else -1


def _is_bounded_single_marker(text: str, marker_start: int, marker: str) -> bool:
    before = text[marker_start - 1] if marker_start > 0 else ""
    after_i = marker_start + len(marker)
    after = text[after_i] if after_i < len(text) else ""
    return before != "_" and after != "_"


def _research_prefix_start(text: str, question_start: int) -> int | None:
    """Return research marker start if marker appears immediately before question marker."""
    i = question_start
    while i > 0 and text[i - 1].isspace():
        i -= 1

    for marker in ("__RESEARCH__", "_RESEARCH_", "**RESEARCH**"):
        marker_start = i - len(marker)
        if marker_start < 0:
            continue
        if text[marker_start:i] != marker:
            continue
        if marker == "_RESEARCH_" and not _is_bounded_single_marker(text, marker_start, marker):
            continue
        return marker_start
    return None


def find_next_question_start(
    text: str, pos: int
) -> tuple[int, int, tuple[str, str, str], bool] | None:
    candidates: list[tuple[int, int, tuple[str, str, str], bool]] = []

    i = text.find("__QUESTION__", pos)
    if i != -1:
        research_start = _research_prefix_start(text, i)
        candidates.append(
            (
                i,
                research_start if research_start is not None else i,
                ("__QUESTION__", "__ANSWER__", "__QUESTION_END__"),
                research_start is not None,
            )
        )

    j = _find_single(_RE_Q_SINGLE, text, pos)
    if j != -1:
        research_start = _research_prefix_start(text, j)
        candidates.append(
            (
                j,
                research_start if research_start is not None else j,
                ("_QUESTION_", "_ANSWER_", "_END_QUESTION"),
                research_start is not None,
            )
        )

    k = text.find("**QUESTION**", pos)
    if k != -1:
        research_start = _research_prefix_start(text, k)
        candidates.append(
            (
                k,
                research_start if research_start is not None else k,
                ("**QUESTION**", "**ANSWER**", "**QUESTION_END**"),
                research_start is not None,
            )
        )

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


_RE_RESEARCH_MARKER = re.compile(
    r"\*\*research\*\*|__research__|(?<!_)_research_(?!_)",
    re.IGNORECASE,
)


def _next_non_empty_line(text: str, pos: int) -> str:
    remainder = text[pos:]
    for line in remainder.splitlines():
        stripped = line.strip()
        if stripped:
            return stripped
    return ""


def _clean_research_candidate(line: str) -> str:
    cleaned = line.strip()
    cleaned = re.sub(r"^[-*]\s+", "", cleaned)
    cleaned = re.sub(r"^>\s*", "", cleaned)
    return cleaned.strip()


def _is_structural_line(line: str) -> bool:
    upper = line.upper()
    if not line:
        return True
    if line.startswith("#"):
        return True
    if line.startswith("!["):
        return True
    if upper in {"---", "# ---"}:
        return True
    structural_markers = (
        "**QUESTION**",
        "**ANSWER**",
        "**QUESTION_END**",
        "__QUESTION__",
        "__ANSWER__",
        "__QUESTION_END__",
        "_QUESTION_",
        "_ANSWER_",
        "_END_QUESTION",
        "**TOPIC:**",
        "**DURATION:**",
        "**SECTION:**",
    )
    return any(upper.startswith(marker) for marker in structural_markers)


def extract_research_prompts(text: str) -> list[ResearchPrompt]:
    prompts: list[ResearchPrompt] = []
    for m in _RE_RESEARCH_MARKER.finditer(text):
        marker_end = m.end()

        line_end = text.find("\n", marker_end)
        if line_end == -1:
            line_end = len(text)
        inline = _clean_research_candidate(text[marker_end:line_end])

        candidate = inline
        if not candidate:
            candidate = _clean_research_candidate(_next_non_empty_line(text, marker_end))
        if not candidate:
            continue
        if _is_structural_line(candidate):
            continue

        prompts.append(ResearchPrompt(question=candidate))
    return prompts


def _parse_csv_values(raw: str | None, fallback: list[str]) -> list[str]:
    if raw is None:
        return list(fallback)
    values = [v.strip() for v in raw.split(",") if v.strip()]
    return values if values else list(fallback)


def _section_int(section_raw: str) -> int:
    return int(section_raw.lstrip("0") or "0")


def _section_label(section_num: int) -> str:
    return f"section-{section_num}"


def discover_section_lecture_files(lectures_dir: Path, section_raw: str) -> list[Path]:
    section_num = _section_int(section_raw)
    lecture_pattern = re.compile(r"^(\d+)-section-(\d+)-.+\.md$", re.IGNORECASE)
    matches: list[tuple[int, Path]] = []

    for path in lectures_dir.iterdir():
        if not path.is_file() or path.suffix.lower() != ".md":
            continue
        m = lecture_pattern.match(path.name)
        if not m:
            continue
        if int(m.group(2)) != section_num:
            continue
        matches.append((int(m.group(1)), path))

    matches.sort(key=lambda pair: pair[0])
    return [path for _, path in matches]


def assemble_lecture_files(paths: list[Path]) -> str:
    chunks = [path.read_text(encoding="utf-8").rstrip() for path in paths]
    return "\n\n".join(chunks).rstrip() + "\n"


def extract_blocks(text: str) -> list[QuestionBlock]:
    blocks: list[QuestionBlock] = []
    pos = 0
    n = len(text)

    while pos < n:
        found = find_next_question_start(text, pos)
        if found is None:
            break
        start_q, _, (q_mark, a_mark, e_mark), is_research = found
        after_q = start_q + len(q_mark)

        a_pos = _find_answer_pos(text, after_q, q_mark)
        if a_pos == -1:
            q = text[after_q:].strip()
            a = "missing answer"
            if q or a != "missing answer":
                blocks.append(QuestionBlock(q if q else "missing question", a, is_research))
            break

        question = text[after_q:a_pos].strip()
        after_a = a_pos + len(a_mark)

        e_pos = _find_end_pos(text, after_a, q_mark)
        if e_pos == -1:
            answer = text[after_a:].strip()
            blocks.append(
                QuestionBlock(
                    question if question else "missing question",
                    answer if answer else "missing answer",
                    is_research,
                )
            )
            break

        answer = text[after_a:e_pos].strip()
        pos = e_pos + len(e_mark)

        q_final = question if question else "missing question"
        a_final = answer if answer else "missing answer"
        if not question and not answer:
            continue
        blocks.append(QuestionBlock(q_final, a_final, is_research))

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
        start_q, block_start, (q_mark, a_mark, e_mark), _ = found
        out.append(text[pos:block_start])
        after_q = start_q + len(q_mark)

        a_pos = _find_answer_pos(text, after_q, q_mark)
        if a_pos == -1:
            out.append(text[block_start:])
            break
        after_a = a_pos + len(a_mark)

        e_pos = _find_end_pos(text, after_a, q_mark)
        if e_pos == -1:
            out.append(text[block_start:])
            break

        pos = e_pos + len(e_mark)

    return "".join(out)


def write_todo_md(path: Path, blocks: list[QuestionBlock], *, title: str) -> None:
    lines: list[str] = [
        f"# {title}",
        "",
    ]
    for i, block in enumerate(blocks, start=1):
        lines.extend(
            [
                f"## Question {i:03d}",
                "",
                "__QUESTION__",
                "",
                block.question,
                "",
                "__ANSWER__",
                "",
                block.answer,
                "",
                "__QUESTION_END__",
                "",
            ]
        )
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_research_todo_md(path: Path, prompts: list[ResearchPrompt], *, title: str) -> None:
    lines: list[str] = [
        f"# {title}",
        "",
    ]
    for i, prompt in enumerate(prompts, start=1):
        lines.extend(
            [
                f"## Question {i:03d}",
                "",
                "__QUESTION__",
                "",
                prompt.question,
                "",
                "__ANSWER__",
                "",
                "",
                "__QUESTION_END__",
                "",
            ]
        )
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_database_json(
    path: Path,
    blocks: list[QuestionBlock],
    *,
    database_name: str,
    database_id: str,
    tags: list[str],
    domains: list[str],
) -> None:
    def _with_research(values: list[str], is_research: bool) -> list[str]:
        result = list(values)
        if is_research and "research" not in result:
            result.append("research")
        return result

    items = []
    for block in blocks:
        items.append(
            {
                "questionId": str(uuid.uuid4()),
                "questionText": block.question,
                "answerText": block.answer,
                "tags": _with_research(tags, block.is_research),
                "domains": _with_research(domains, block.is_research),
            }
        )
    payload = {
        "databaseName": database_name,
        "databaseId": database_id,
        "questionsWithAnswers": items,
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_research_database_json(
    path: Path,
    prompts: list[ResearchPrompt],
    *,
    database_name: str,
    database_id: str,
    tags: list[str],
    domains: list[str],
) -> None:
    items = []
    for prompt in prompts:
        items.append(
            {
                "questionId": str(uuid.uuid4()),
                "questionText": prompt.question,
                "answerText": "",
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
        default=None,
        help="Combined markdown file containing note text and Q/A blocks.",
    )
    parser.add_argument(
        "--lectures-dir",
        type=Path,
        default=None,
        help="Directory with lecture files named nnnnn-section-nn-description.md.",
    )
    parser.add_argument(
        "--section",
        default=None,
        help="Section number (supports leading zeros, e.g. 05). Used with --lectures-dir.",
    )
    parser.add_argument(
        "--all-out",
        type=Path,
        default=None,
        help="Write concatenated raw lecture notes for the section.",
    )
    parser.add_argument(
        "--todo-out",
        type=Path,
        default=None,
    )
    parser.add_argument(
        "--json-out",
        type=Path,
        default=None,
    )
    parser.add_argument(
        "--lecture-out",
        type=Path,
        default=None,
        help="Write lecture notes with all question blocks removed.",
    )
    parser.add_argument(
        "--research-out",
        type=Path,
        default=None,
        help="Write research-only extracted questions markdown.",
    )
    parser.add_argument(
        "--research-json-out",
        type=Path,
        default=None,
        help="Write research-only database JSON.",
    )
    parser.add_argument(
        "--database-name",
        default=None,
    )
    parser.add_argument(
        "--database-id",
        default=None,
    )
    parser.add_argument(
        "--tags",
        default=None,
        help="Comma-separated base tags for all questions (research is auto-appended).",
    )
    parser.add_argument(
        "--domains",
        default=None,
        help="Comma-separated base domains for all questions (research is auto-appended).",
    )
    parser.add_argument(
        "--todo-title",
        default=None,
        help="Markdown title for the extracted questions file.",
    )
    parser.add_argument(
        "--research-title",
        default=None,
        help="Markdown title for the research-only extracted questions file.",
    )
    args = parser.parse_args()

    section_num: int | None = None

    if args.section is not None:
        section_num = _section_int(args.section)
        if section_num <= 0:
            raise SystemExit("--section must be a positive number")

    if args.lectures_dir and section_num is None:
        raise SystemExit("--section is required when using --lectures-dir")

    if args.lectures_dir:
        lecture_files = discover_section_lecture_files(args.lectures_dir, args.section)
        if not lecture_files:
            raise SystemExit(
                f"No lecture files found for section {section_num} in {args.lectures_dir}"
            )
        text = assemble_lecture_files(lecture_files)
    elif args.input:
        text = args.input.read_text(encoding="utf-8")
    else:
        raise SystemExit("Provide either --input or (--lectures-dir and --section)")

    if section_num is None:
        section_num = 3

    section_label = _section_label(section_num)
    default_out_dir = Path(f"writeup-and-notes/{section_label}")

    all_out = args.all_out or default_out_dir / f"{section_label}.all.md"
    todo_out = args.todo_out or default_out_dir / f"{section_label}-questions-tod.md"
    research_out = args.research_out or default_out_dir / f"{section_label}-research-questions-tod.md"
    research_json_out = args.research_json_out or Path(f"databases/database-{section_label}-research.json")
    lecture_out = args.lecture_out or default_out_dir / f"{section_label}.md"
    json_out = args.json_out or Path(f"databases/database-{section_label}.json")

    database_name = args.database_name or f"Section {section_num}"
    database_id = args.database_id or f"database-{section_label}"
    tags = _parse_csv_values(args.tags, [section_label])
    domains = _parse_csv_values(args.domains, ["general"])
    research_tags = [section_label, "research"]
    research_domains = ["research"]
    todo_title = args.todo_title or f"Section {section_num} — extracted questions"
    research_title = args.research_title or f"Section {section_num} — research questions"

    blocks = extract_blocks(text)
    research_prompts = extract_research_prompts(text)

    all_out.parent.mkdir(parents=True, exist_ok=True)
    todo_out.parent.mkdir(parents=True, exist_ok=True)
    research_out.parent.mkdir(parents=True, exist_ok=True)
    research_json_out.parent.mkdir(parents=True, exist_ok=True)
    lecture_out.parent.mkdir(parents=True, exist_ok=True)
    json_out.parent.mkdir(parents=True, exist_ok=True)

    all_out.write_text(text, encoding="utf-8")
    write_todo_md(todo_out, blocks, title=todo_title)
    write_research_todo_md(research_out, research_prompts, title=research_title)
    write_database_json(
        json_out,
        blocks,
        database_name=database_name,
        database_id=database_id,
        tags=tags,
        domains=domains,
    )
    write_research_database_json(
        research_json_out,
        research_prompts,
        database_name=f"Section {section_num} - Research",
        database_id=f"database-{section_label}-research",
        tags=research_tags,
        domains=research_domains,
    )
    lecture_out.write_text(strip_question_blocks(text), encoding="utf-8")

    tagged_block_research_count = sum(1 for block in blocks if block.is_research)
    print(
        f"Extracted {len(blocks)} Q/A pairs "
        f"({tagged_block_research_count} tagged research blocks)"
    )
    print(f"Extracted {len(research_prompts)} standalone research prompts")
    print(f"Wrote {all_out}")
    print(f"Wrote {todo_out}")
    print(f"Wrote {research_out}")
    print(f"Wrote {research_json_out}")
    print(f"Wrote {json_out}")
    print(f"Wrote {lecture_out}")


if __name__ == "__main__":
    main()
