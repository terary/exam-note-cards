# Phrase processing

Turn a list of English phrases into Thai text and an audio clip for each line.

The script sends each phrase to the public Google Translate endpoint (English to Thai, no API key). It then speaks the Thai with the macOS **Kanya** voice and saves an AAC `.m4a` file. Chrome and the flashcard app can play that format.

This folder is separate from the flashcard database. It does not import cards on its own.

## What you need

- macOS, with the `say` and `afconvert` commands (both ship with the system)
- The Kanya voice. Check with:

```bash
say -v '?' | grep Kanya
```

- A network connection for translation

No Python packages to install. The script uses the Python 3 standard library.

## Layout

| Path | Purpose |
| --- | --- |
| `input/` | Phrase lists you write |
| `src/process_phrases.py` | The script |
| `output/` | Markdown results: English, Thai, audio filename |
| `audio-output/` | The `.m4a` clips |

## Input

Create a markdown file with one English phrase per line.

- Blank lines are skipped.
- Lines starting with `#` are comments.
- A leading list marker (`-`, `*`, or `1.`) is removed, so a markdown list works.
- A repeated phrase is skipped.
- Keep each phrase on one line, under 500 characters.

`input/example.md` is a short sample.

## Run

From the repository root:

```bash
python3 docs-living/phrase-processing/src/process_phrases.py \
  docs-living/phrase-processing/input/example.md
```

Or from this directory:

```bash
python3 src/process_phrases.py input/example.md
```

That writes:

- `output/example.md`
- `audio-output/hello.m4a`, `audio-output/thank-you.m4a`, and so on

The output name follows the input file name. To choose a different result file:

```bash
python3 src/process_phrases.py input/example.md --output output/my-phrases.md
```

Another macOS voice, if you install one:

```bash
python3 src/process_phrases.py input/example.md --voice Kanya
```

## Output

`output/example.md` is a markdown table:

| English | Thai | Audio |
| --- | --- | --- |
| Hello | สวัสดี | hello.m4a |
| Thank you | ขอบคุณ | thank-you.m4a |
| Where is the bathroom? | ห้องน้ำอยู่ที่ไหน? | where-is-the-bathroom.m4a |

`Audio` is the file name inside `audio-output/`. Filenames come from the English phrase. If two phrases would share a name, the later file gets a numeric suffix (`hello-2.m4a`).

## Run it again

Phrases that already have a row and an audio file are left as they are. New lines are translated and recorded. Removing a line from the input drops it from the next output file; the old `.m4a` stays on disk until you delete it.

To correct a translation by hand, edit the Thai cell in the output file, delete that phrase's `.m4a`, and run the script again. It speaks the Thai you wrote and does not call the translator for that line.

To translate and record every line again:

```bash
python3 src/process_phrases.py input/example.md --refresh
```

`--refresh` overwrites the existing clip for each phrase still listed in the output. Clips whose phrases you removed are left in `audio-output/`.

`audio-output/` is shared by every list you process. A filename already used by another phrase is not overwritten; the new clip gets a suffix.
