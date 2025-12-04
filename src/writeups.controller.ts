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
  vocabulary: WriteupListItem[];
  todo: WriteupListItem[];
}

@Controller("write-up-notes")
export class WriteupsController {
  private getDir(): string {
    return join(process.cwd(), "writeup-and-notes");
  }

  @Get()
  async listWriteups(): Promise<CategorizedWriteups> {
    const dir = this.getDir();
    if (!existsSync(dir)) {
      return { writeups: [], vocabulary: [], todo: [] };
    }
    const files = await fs.readdir(dir);
    const mdFiles = files.filter(
      (f) => extname(f).toLowerCase() === ".md" && !f.startsWith("x")
    );
    const items = await Promise.all(
      mdFiles.map(async (filename) => {
        const id = basename(filename, ".md");
        const stats = await fs.stat(join(dir, filename));
        return {
          id,
          filename,
          lastModified: stats.mtime.toISOString(),
        } as WriteupListItem;
      })
    );
    
    const sortedItems = items.sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    const vocabulary: WriteupListItem[] = [];
    const todo: WriteupListItem[] = [];
    const writeups: WriteupListItem[] = [];

    for (const item of sortedItems) {
      if (item.filename.endsWith("-vocab.md")) {
        vocabulary.push(item);
      } else if (item.filename.endsWith("-questions-todo.md")) {
        todo.push(item);
      } else {
        writeups.push(item);
      }
    }

    return { writeups, vocabulary, todo };
  }

  @Get(":id")
  async getWriteup(@Param("id") id: string): Promise<WriteupPayload> {
    const dir = this.getDir();
    const filename = `${id}.md`;
    const filePath = join(dir, filename);
    try {
      const content = await fs.readFile(filePath, "utf8");
      const stats = await fs.stat(filePath);
      return {
        id,
        filename,
        content,
        lastModified: stats.mtime.toISOString(),
      };
    } catch {
      throw new NotFoundException(`Write-up '${id}' not found`);
    }
  }
}


