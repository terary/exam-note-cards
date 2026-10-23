import { execFile } from "child_process";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { resolve } from "path";
import { promisify } from "util";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ThaiCardsService } from "../src/thai-cards.service";

const execFileAsync = promisify(execFile);

async function extractZip(zipPath: string, dest: string): Promise<void> {
  await execFileAsync("python3", [
    "-c",
    `
import sys
import zipfile
from pathlib import Path
zip_path, dest = sys.argv[1], Path(sys.argv[2])
with zipfile.ZipFile(zip_path) as archive:
    for info in archive.infolist():
        parts = Path(info.filename).parts
        if Path(info.filename).is_absolute() or ".." in parts:
            raise SystemExit("Unsafe path in zip: " + info.filename)
    archive.extractall(dest)
`,
    zipPath,
    dest,
  ]);
}

async function bootstrap() {
  const logger = new Logger("ImportBatchPhrases");
  const zipArg = process.argv.slice(2).find((arg) => !arg.startsWith("-"));
  if (!zipArg) {
    logger.error(
      "Usage: npm run import-batch-phrases -- docs-living/phrase-processing-batch/output/<name>.zip"
    );
    process.exit(1);
  }

  const zipPath = resolve(process.cwd(), zipArg);
  const extracted = await mkdtemp(resolve(tmpdir(), "phrase-batch-"));
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    await extractZip(zipPath, extracted);
    const thaiCards = app.get(ThaiCardsService);
    const counts = await thaiCards.importSoundbiteBundle(extracted);
    logger.log(
      `Imported ${zipPath}: ${counts.inserted} inserted, ${counts.skipped} already in the deck`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Import failed: ${message}`);
    process.exitCode = 1;
  } finally {
    await app.close();
    await rm(extracted, { recursive: true, force: true });
  }
}

bootstrap();
