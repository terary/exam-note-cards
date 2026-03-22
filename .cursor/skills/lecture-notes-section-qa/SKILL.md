---
name: lecture-notes-section-qa
description: Converts finished lecture-note sections into extracted questions (markdown + JSON database) and a lecture-only markdown file without Q/A blocks. Use when the user finishes a section or chapter, wants to turn notes into flashcard-style questions, split questions from prose, or mentions writeup-and-notes, databases/*.json, or the section Q/A extraction script.
---

# Lecture notes → questions (per section)

## Goal

After each section or chapter, the user’s notes should yield:

1. **Questions file** — all Q/A pairs in one markdown file for review.
2. **Database JSON** — same pairs with UUIDs for the app (`databases/`).
3. **Lecture-only file** — same content as the combined notes **minus** every well-formed question block (prose/transcripts only).

## Marking questions in source notes

Use one of these **complete** triplets (match opening style to closing style). Put the question body between the first and second marker, the answer between the second and third.

| Style | Open | Middle | Close |
|-------|------|--------|--------|
| Double underscore | `__QUESTION__` | `__ANSWER__` | `__QUESTION_END__` |
| Single underscore | `_QUESTION_` | `_ANSWER_` | `_END_QUESTION` |
| Bold asterisks | `**QUESTION**` | `**ANSWER**` | `**QUESTION_END**` |

Rules the pipeline follows:

- **Empty blocks** (question and answer both blank after trimming) are **dropped** from the questions/database outputs and still **removed** from the lecture-only file when the block is structurally complete.
- **Missing text** inside an otherwise valid block: use placeholder strings `missing question` or `missing answer` in extracted output.
- `_QUESTION_` must not be parsed inside `__QUESTION__`; extraction logic uses boundary-aware matching for single-underscore markers.

## Source assembly (optional)

If a section is split across multiple lecture files, concatenate them in a sensible order (e.g. numeric prefix `sort -V`) into one `*.all.md` under `writeup-and-notes/` before extraction.

## Extraction tool (this repo)

Script: `scripts/extract-section3-ident-fed-qa.py`

It implements parsing, stripping, and writes three artifacts. For **new sections**, pass explicit paths (defaults are section-3–specific):

```bash
python3 scripts/extract-section3-ident-fed-qa.py \
  --input writeup-and-notes/<section>.all.md \
  --todo-out writeup-and-notes/<section>-questions-tod.md \
  --json-out databases/<database-name>.json \
  --lecture-out writeup-and-notes/<section>.md
```

Optional: `--database-name` and `--database-id` for the JSON metadata.

JSON shape matches existing databases: `databaseName`, `databaseId`, `questionsWithAnswers[]` with `questionId` (UUID v4), `questionText`, `answerText`, `tags`, `domains`.

**Note:** Re-running regenerates new UUIDs unless the script is later changed to use stable IDs.

## Agent checklist when the user finishes a section

1. Confirm or create the combined input `*.all.md` (if notes are split across files).
2. Choose output filenames (`questions-tod`, `database-*.json`, lecture-only `.md`) consistent with the section/chapter.
3. Run the script with `--input` / `--todo-out` / `--json-out` / `--lecture-out` (and DB metadata if needed).
4. Quick sanity check: questions file has expected count; lecture file has no remaining `__QUESTION__` / `**QUESTION**` / `_QUESTION_` markers (unless a malformed tail was left intentionally).

## Extending for many sections

Prefer **CLI arguments** over copying the script for each chapter. If defaults become wrong for “the” section, rename or generalize the script (e.g. `extract-section-qa.py`) but keep behavior identical unless the user asks otherwise.
