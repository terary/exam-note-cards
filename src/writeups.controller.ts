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

@Controller("write-up-notes")
export class WriteupsController {
  private getDir(): string {
    return join(process.cwd(), "writeup-and-notes");
  }

  @Get()
  async listWriteups(): Promise<WriteupListItem[]> {
    const dir = this.getDir();
    if (!existsSync(dir)) {
      return [];
    }
    const files = await fs.readdir(dir);
    const mdFiles = files.filter((f) => extname(f).toLowerCase() === ".md");
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
    return items.sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
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


