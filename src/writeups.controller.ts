import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import { join, basename, extname } from "path";

interface WriteupListItem {
  id: string;
  filename: string;
  lastModified: string;
}

interface WriteupPayload {
  id: string;
  filename: string;
  content: string;
  lastModified: string;
}

interface CategorizedWriteups {
  writeups: WriteupListItem[];
  questions: WriteupListItem[];
  vocabulary: WriteupListItem[];
}

type WriteupCategory = "writeups" | "questions" | "vocabulary" | "skip";

interface DiscoveredFile {
  id: string;
  filename: string;
  filePath: string;
  category: WriteupCategory;
}

@Controller("write-up-notes")
export class WriteupsController {
  private getDir(): string {
    return join(process.cwd(), "writeup-and-notes");
  }

  private categorize(filename: string): WriteupCategory {
    if (filename.endsWith("-vocab.md")) {
      return "vocabulary";
    }
    if (filename.endsWith(".all.md")) {
      return "skip";
    }
    if (
      filename.endsWith("-research-questions-tod.md") ||
      filename.endsWith("-todo-questions-tod.md")
    ) {
      return "skip";
    }
    if (
      filename.endsWith("-questions-tod.md") ||
      filename.endsWith("-questions-todo.md")
    ) {
      return "questions";
    }
    return "writeups";
  }

  private async walkMarkdownFiles(dir: string): Promise<DiscoveredFile[]> {
    const discovered: DiscoveredFile[] = [];

    const walk = async (currentDir: string): Promise<void> => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
          continue;
        }
        if (entry.isFile() && extname(entry.name).toLowerCase() === ".md") {
          if (entry.name.startsWith("x")) {
            continue;
          }
          const category = this.categorize(entry.name);
          if (category === "skip") {
            continue;
          }
          discovered.push({
            id: basename(entry.name, ".md"),
            filename: entry.name,
            filePath: fullPath,
            category,
          });
        }
      }
    };

    if (existsSync(dir)) {
      await walk(dir);
    }
    return discovered;
  }

  private pathPriority(filePath: string): number {
    return /\/section-\d+\//.test(filePath) ? 2 : 1;
  }

  private dedupeById(files: DiscoveredFile[]): DiscoveredFile[] {
    const byId = new Map<string, DiscoveredFile>();
    for (const file of files) {
      const existing = byId.get(file.id);
      if (!existing) {
        byId.set(file.id, file);
        continue;
      }
      if (this.pathPriority(file.filePath) > this.pathPriority(existing.filePath)) {
        byId.set(file.id, file);
      }
    }
    return Array.from(byId.values());
  }

  private sortItems(items: WriteupListItem[]): WriteupListItem[] {
    return items.sort((a, b) =>
      a.id.localeCompare(b.id, undefined, {
        numeric: false,
        sensitivity: "base",
      })
    );
  }

  @Get()
  async listWriteups(): Promise<CategorizedWriteups> {
    const dir = this.getDir();
    const files = this.dedupeById(await this.walkMarkdownFiles(dir));

    const result: CategorizedWriteups = {
      writeups: [],
      questions: [],
      vocabulary: [],
    };

    await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(file.filePath);
        const item: WriteupListItem = {
          id: file.id,
          filename: file.filename,
          lastModified: stats.mtime.toISOString(),
        };
        result[file.category].push(item);
      })
    );

    result.writeups = this.sortItems(result.writeups);
    result.questions = this.sortItems(result.questions);
    result.vocabulary = this.sortItems(result.vocabulary);

    return result;
  }

  @Get(":id")
  async getWriteup(@Param("id") id: string): Promise<WriteupPayload> {
    const dir = this.getDir();
    const files = this.dedupeById(await this.walkMarkdownFiles(dir));
    const match = files.find((file) => file.id === id);

    if (!match) {
      throw new NotFoundException(`Write-up '${id}' not found`);
    }

    const content = await fs.readFile(match.filePath, "utf8");
    const stats = await fs.stat(match.filePath);
    return {
      id,
      filename: match.filename,
      content,
      lastModified: stats.mtime.toISOString(),
    };
  }
}
