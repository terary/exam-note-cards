# Phrase processing batch

One input file is one batch. The script translates each English line on this Mac, records an `.m4a`, writes a table, and packs a zip. Translation uses Apple’s on-device Translation framework. It does not call Google, and it does not use `phrase-processing`.

If a translation fails, the script stops immediately. It does not write a zip and it does not ask to push.

## What you need

- macOS, with `say`, `afconvert`, and `swiftc`
- The Kanya voice (`say -v '?' | grep Kanya`)
- Thai downloaded under System Settings > General > Language & Region > Translation Languages…
- SSH access to `192.168.0.198` when you choose to push the zip

## Input

Create a new file under `input/` with one English phrase per line:

```text
Help
Can you help me
```

Blank lines and lines starting with `#` are ignored. A later batch is a new file. A line may include Thai after `|` (`Help | ช่วยด้วย`) when you already have the wording; that line is not translated again.

## Run

From the repository root:

```bash
python3 docs-living/phrase-processing-batch/src/build_batch.py \
  docs-living/phrase-processing-batch/input/your-list.md
```

That writes:

- `output/your-list/table.md`
- `output/your-list/audio/*.m4a`
- `output/your-list.zip`

When the zip is ready, the script asks whether to copy it to:

`192.168.0.198:/home/terary/exam-note-cards/docs-living/phrase-processing-batch/output/`

Answer `y` to push. Anything else leaves the zip on this machine.

## Import on the server

Log in and, from `~/exam-note-cards`, run:

```bash
npm run import-batch-phrases -- docs-living/phrase-processing-batch/output/your-list.zip
```

A phrase whose Thai script or English line is already on a sound-bite card is skipped.
