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

Script: `scripts/extract-section3-ident-fed-qa.py` (invoked via npm — do not run Python directly).

**Preferred command** after finishing a section:

```bash
npm run section:build -- 4 5 6
```

This concatenates lecture files, extracts all four outputs (lecture write-up, questions, research, todo), writes JSON under `databases/`, and runs `migrate:mongodb`.

Outputs per section under `writeup-and-notes/section-N/`:

| Output | File | Format |
|--------|------|--------|
| Combined source | `section-N.all.md` | raw (hidden from app) |
| Full write-up | `section-N.md` | readable prose |
| Research | `section-N-research.md` | readable list (not Q/A) |
| Todo | `section-N-todo.md` | readable list (not Q/A) |
| Questions | `section-N-questions-tod.md` | `__QUESTION__` / `__ANSWER__` blocks + `databases/database-section-N.json` |

Only `__QUESTION__` blocks become quiz questions. Research and todo are write-ups to read, not quizzes.

Advanced: pass explicit paths to the Python script only when customizing defaults:

```bash
python3 scripts/extract-section3-ident-fed-qa.py \
  --input writeup-and-notes/<section>.all.md \
  ...
```

## Agent checklist when the user finishes a section

1. Run `npm run section:build -- <section-number>` (e.g. `7` or `07`).
2. Quick sanity check: write-ups include lecture, research, and todo; questions file uses `__QUESTION__` blocks; quizzes only for the main questions database.

## Extending for many sections

Prefer **CLI arguments** over copying the script for each chapter. If defaults become wrong for “the” section, rename or generalize the script (e.g. `extract-section-qa.py`) but keep behavior identical unless the user asks otherwise.
