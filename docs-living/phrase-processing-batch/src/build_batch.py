#!/usr/bin/env python3
"""Turn one English phrase list into Thai clips and a zip, then offer to copy it to the server.

This script does not use phrase-processing. Each input file is its own batch.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output"
DEFAULT_VOICE = "Kanya"
REMOTE = "192.168.0.198"
REMOTE_DIR = "/home/terary/exam-note-cards/docs-living/phrase-processing-batch/output"
AUDIO_NAME = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.m4a$")
LIST_MARKER = re.compile(r"^(?:[-*]|\d+\.)\s+")
TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"


@dataclass
class PhraseRow:
    english: str
    thai: str
    audio: str


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Translate a phrase list, record .m4a clips, and write a zip."
    )
    parser.add_argument(
        "input",
        type=Path,
        help="Markdown file with one English phrase per line",
    )
    parser.add_argument(
        "--voice",
        default=DEFAULT_VOICE,
        help=f"macOS voice name (default: {DEFAULT_VOICE})",
    )
    parser.add_argument(
        "--refresh",
        action="store_true",
        help="Retranslate and overwrite clips for this input file",
    )
    args = parser.parse_args()

    input_path = args.input.expanduser().resolve()
    if not input_path.is_file():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    missing = [tool for tool in ("say", "afconvert") if shutil.which(tool) is None]
    if missing:
        print(
            f"Missing macOS tool: {', '.join(missing)}. This script runs on macOS.",
            file=sys.stderr,
        )
        return 1
    if not voice_installed(args.voice):
        print(
            f"Voice {args.voice!r} is not installed. Run: say -v '?'",
            file=sys.stderr,
        )
        return 1

    phrases = read_phrases(input_path)
    if not phrases:
        print(f"No phrases in {input_path}", file=sys.stderr)
        return 1

    work_dir = OUTPUT_DIR / input_path.stem
    audio_dir = work_dir / "audio"
    table_path = work_dir / "table.md"
    zip_path = OUTPUT_DIR / f"{input_path.stem}.zip"
    audio_dir.mkdir(parents=True, exist_ok=True)

    existing = read_table(table_path)
    rows: list[PhraseRow] = []
    taken = reserved_filenames(audio_dir, existing, phrases)
    failures: list[str] = []

    print(f"{len(phrases)} phrase(s) from {input_path.name}")
    for index, english in enumerate(phrases, start=1):
        prefix = f"[{index}/{len(phrases)}]"
        prior = existing.get(english)
        try:
            if prior and (audio_dir / prior.audio).is_file() and not args.refresh:
                print(f"{prefix} kept {prior.audio}")
                rows.append(prior)
                continue

            if prior and not args.refresh:
                thai = prior.thai
                audio_name = prior.audio
                print(f"{prefix} recording existing translation -> {audio_name}")
            else:
                thai = translate_to_thai(english)
                audio_name = prior.audio if prior else allocate_name(english, taken)
                taken.add(audio_name)
                print(f"{prefix} {english}")
                print(f"    {thai} -> {audio_name}")

            synthesize(thai, audio_dir / audio_name, args.voice)
            rows.append(PhraseRow(english, thai, audio_name))
        except (OSError, RuntimeError, subprocess.CalledProcessError) as exc:
            print(f"{prefix} failed: {exc}", file=sys.stderr)
            failures.append(english)

    write_table(table_path, input_path, rows)
    write_zip(zip_path, input_path, rows, audio_dir)
    print(f"Wrote {table_path}")
    print(f"Wrote {zip_path}")
    if failures:
        print(f"Failed: {len(failures)}. Zip was not pushed.", file=sys.stderr)
        return 1

    offer_push(zip_path)
    return 0


def read_phrases(path: Path) -> list[str]:
    phrases: list[str] = []
    seen: set[str] = set()
    text = path.read_text(encoding="utf-8-sig")
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        line = LIST_MARKER.sub("", line, count=1).strip()
        if not line or line in seen:
            if line in seen:
                print(f"Skipping duplicate: {line}")
            continue
        seen.add(line)
        phrases.append(line)
    return phrases


def read_table(path: Path) -> dict[str, PhraseRow]:
    rows: dict[str, PhraseRow] = {}
    if not path.is_file():
        return rows
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line.startswith("|"):
            continue
        cells = split_row(line)
        if len(cells) != 3:
            continue
        english, thai, audio = cells
        if english in {"English", "---"} or not thai or not AUDIO_NAME.fullmatch(audio):
            continue
        rows[english] = PhraseRow(english, thai, audio)
    return rows


def split_row(line: str) -> list[str]:
    inner = line.strip()
    if inner.startswith("|"):
        inner = inner[1:]
    if inner.endswith("|"):
        inner = inner[:-1]
    parts = re.split(r"(?<!\\)\|", inner)
    return [part.strip().replace("\\|", "|") for part in parts]


def write_table(path: Path, source: Path, rows: list[PhraseRow]) -> None:
    try:
        source_label = source.relative_to(ROOT).as_posix()
    except ValueError:
        source_label = str(source)
    lines = [
        "# Batch phrases",
        "",
        f"Source: `{source_label}`",
        "",
        "| English | Thai | Audio |",
        "| --- | --- | --- |",
    ]
    for row in rows:
        lines.append(
            f"| {escape_cell(row.english)} | {escape_cell(row.thai)} | {row.audio} |"
        )
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def write_zip(
    zip_path: Path,
    source: Path,
    rows: list[PhraseRow],
    audio_dir: Path,
) -> None:
    try:
        source_label = source.relative_to(ROOT).as_posix()
    except ValueError:
        source_label = str(source)
    manifest = {
        "version": 1,
        "source": source_label,
        "items": [
            {"english": row.english, "thai": row.thai, "audio": row.audio}
            for row in rows
        ],
    }
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "manifest.json",
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        )
        for row in rows:
            archive.write(audio_dir / row.audio, f"audio/{row.audio}")


def offer_push(zip_path: Path) -> None:
    destination = f"{REMOTE}:{REMOTE_DIR}/"
    print()
    print(f"Zip is ready: {zip_path}")
    if not sys.stdin.isatty():
        print(f"Push it yourself with: scp {zip_path} {destination}")
        return
    answer = input(f"Push {zip_path.name} to {destination}? [y/N] ").strip().lower()
    if answer not in {"y", "yes"}:
        print("Not pushed.")
        return
    subprocess.run(["ssh", REMOTE, "mkdir", "-p", REMOTE_DIR], check=True)
    subprocess.run(["scp", str(zip_path), destination], check=True)
    print("Pushed.")
    print(
        "On the server, run: "
        f"npm run import-batch-phrases -- docs-living/phrase-processing-batch/output/{zip_path.name}"
    )


def escape_cell(value: str) -> str:
    return value.replace("|", "\\|")


def reserved_filenames(
    audio_dir: Path,
    existing: dict[str, PhraseRow],
    phrases: list[str],
) -> set[str]:
    names = {path.name for path in audio_dir.glob("*.m4a")}
    for english in phrases:
        prior = existing.get(english)
        if prior:
            names.add(prior.audio)
    return names


def allocate_name(english: str, taken: set[str]) -> str:
    base = slugify(english)
    candidate = f"{base}.m4a"
    number = 2
    while candidate in taken:
        candidate = f"{base}-{number}.m4a"
        number += 1
    return candidate


def slugify(text: str) -> str:
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")
    ascii_text = ascii_text[:48].rstrip("-")
    return ascii_text or "phrase"


def voice_installed(voice: str) -> bool:
    result = subprocess.run(
        ["say", "-v", "?"],
        capture_output=True,
        text=True,
        check=False,
    )
    listing = f"{result.stdout}\n{result.stderr}"
    return re.search(rf"^{re.escape(voice)}(?:\s|\()", listing, re.MULTILINE) is not None


def translate_to_thai(text: str) -> str:
    last_error: Exception | None = None
    for attempt in range(2):
        try:
            return request_translation(text)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as exc:
            last_error = exc
            if attempt == 0:
                time.sleep(1)
    raise RuntimeError(f"translation failed for {text!r}: {last_error}") from last_error


def request_translation(text: str) -> str:
    if len(text) > 500:
        raise RuntimeError(f"phrase is longer than 500 characters: {text!r}")
    query = urllib.parse.urlencode(
        {"client": "gtx", "sl": "en", "tl": "th", "dt": "t", "q": text}
    )
    request = urllib.request.Request(
        f"{TRANSLATE_URL}?{query}",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))
    segments = payload[0] if isinstance(payload, list) and payload else None
    if not isinstance(segments, list):
        raise RuntimeError(f"unexpected translation response for {text!r}")
    thai = "".join(
        segment[0] for segment in segments if segment and isinstance(segment[0], str)
    ).strip()
    if not thai:
        raise RuntimeError(f"empty translation for {text!r}")
    return thai


def synthesize(thai: str, destination: Path, voice: str) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        suffix=".aiff",
        dir=destination.parent,
        delete=False,
    ) as handle:
        aiff_path = Path(handle.name)
    text_path = aiff_path.with_suffix(".txt")
    try:
        text_path.write_text(thai + "\n", encoding="utf-8")
        subprocess.run(
            ["say", "-v", voice, "-o", str(aiff_path), "-f", str(text_path)],
            check=True,
        )
        subprocess.run(
            [
                "afconvert",
                str(aiff_path),
                str(destination),
                "-f",
                "m4af",
                "-d",
                "aac",
            ],
            check=True,
        )
    finally:
        aiff_path.unlink(missing_ok=True)
        text_path.unlink(missing_ok=True)
    if not destination.is_file() or destination.stat().st_size == 0:
        raise RuntimeError(f"audio file was not written: {destination.name}")


if __name__ == "__main__":
    sys.exit(main())
