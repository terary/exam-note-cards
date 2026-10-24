#!/usr/bin/env python3
"""Turn one English phrase list into Thai clips and a zip, then offer to copy it to the server.

Translation uses the macOS Translation framework on this machine. The script does not
call Google. It speaks the Thai with the Kanya voice. It does not use phrase-processing.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
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
TRANSLATOR_SWIFT = Path(__file__).with_name("translate_thai.swift")
TRANSLATOR_BIN = OUTPUT_DIR / ".cache" / "translate-thai"


@dataclass
class PhraseRow:
    english: str
    thai: str
    audio: str


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Translate a phrase list on this Mac, record .m4a clips, and write a zip."
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
    taken = reserved_filenames(audio_dir, existing, [english for english, _thai in phrases])
    needs_translation = any(
        not supplied_thai and (args.refresh or english not in existing)
        for english, supplied_thai in phrases
    )
    if needs_translation:
        try:
            prepare_translator()
        except (OSError, RuntimeError, subprocess.CalledProcessError) as exc:
            return stop(f"Translation is unavailable: {exc}")

    print(f"{len(phrases)} phrase(s) from {input_path.name}")
    for index, (english, supplied_thai) in enumerate(phrases, start=1):
        prefix = f"[{index}/{len(phrases)}]"
        prior = existing.get(english)
        try:
            audio_ready = prior and (audio_dir / prior.audio).is_file()
            if (
                prior
                and audio_ready
                and not args.refresh
                and (not supplied_thai or supplied_thai == prior.thai)
            ):
                print(f"{prefix} kept {prior.audio}")
                rows.append(prior)
                continue

            if supplied_thai:
                thai = supplied_thai
            elif prior and not args.refresh:
                thai = prior.thai
            else:
                print(f"{prefix} translating {english}")
                thai = translate_to_thai(english)

            audio_name = prior.audio if prior else allocate_name(english, taken)
            taken.add(audio_name)
            print(f"{prefix} {english}")
            print(f"    {thai} -> {audio_name}")
            synthesize(thai, audio_dir / audio_name, args.voice)
            rows.append(PhraseRow(english, thai, audio_name))
        except (OSError, RuntimeError, subprocess.CalledProcessError) as exc:
            return stop(f"{prefix} failed: {exc}")

    write_table(table_path, input_path, rows)
    write_zip(zip_path, input_path, rows, audio_dir)
    print(f"Wrote {table_path}")
    print(f"Wrote {zip_path}")
    offer_push(zip_path)
    return 0


def stop(message: str) -> int:
    print(message, file=sys.stderr)
    print("Stopped. No zip was written.", file=sys.stderr)
    return 1


def prepare_translator() -> None:
    if shutil.which("swiftc") is None:
        raise RuntimeError("swiftc is not installed. Install the Xcode Command Line Tools.")
    binary = translator_binary()
    result = subprocess.run([str(binary), "--check"], capture_output=True, text=True, check=False)
    if result.returncode != 0:
        detail = (result.stderr or result.stdout).strip() or "translation check failed"
        raise RuntimeError(detail)


def translator_binary() -> Path:
    TRANSLATOR_BIN.parent.mkdir(parents=True, exist_ok=True)
    swift_mtime = TRANSLATOR_SWIFT.stat().st_mtime
    if TRANSLATOR_BIN.is_file() and TRANSLATOR_BIN.stat().st_mtime >= swift_mtime:
        return TRANSLATOR_BIN
    print("Compiling the local translator…")
    subprocess.run(
        [
            "swiftc",
            "-O",
            "-parse-as-library",
            "-o",
            str(TRANSLATOR_BIN),
            str(TRANSLATOR_SWIFT),
        ],
        check=True,
    )
    return TRANSLATOR_BIN


def translate_to_thai(text: str) -> str:
    if len(text) > 500:
        raise RuntimeError(f"phrase is longer than 500 characters: {text!r}")
    result = subprocess.run(
        [str(translator_binary())],
        input=text + "\n",
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        detail = (result.stderr or result.stdout).strip() or "translation failed"
        raise RuntimeError(detail)
    thai = result.stdout.strip()
    if not thai:
        raise RuntimeError(f"empty translation for {text!r}")
    return thai


def read_phrases(path: Path) -> list[tuple[str, str]]:
    phrases: list[tuple[str, str]] = []
    seen: set[str] = set()
    text = path.read_text(encoding="utf-8-sig")
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        line = LIST_MARKER.sub("", line, count=1).strip()
        english, thai = split_phrase(line)
        if not english or english in seen:
            if english in seen:
                print(f"Skipping duplicate: {english}")
            continue
        seen.add(english)
        phrases.append((english, thai))
    return phrases


def split_phrase(line: str) -> tuple[str, str]:
    if "|" not in line:
        return line.strip(), ""
    english, thai = line.split("|", 1)
    return english.strip(), thai.strip()


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
