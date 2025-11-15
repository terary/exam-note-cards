import { Controller, Get, Param, Res, Logger, NotFoundException } from "@nestjs/common";
import { Response } from "express";
import { AnswerSessionsService } from "./answer-sessions.service";

@Controller("answers")
export class AnswersController {
  private readonly logger = new Logger(AnswersController.name);

  constructor(private readonly answerSessionsService: AnswerSessionsService) {}

  @Get("answer-files")
  async listAnswerFiles(@Res() res: Response): Promise<void> {
    this.logger.log("GET /answers/answer-files - Listing all answer files");
    const sessions = await this.answerSessionsService.listAllSessions();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Answer Files</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f5f5f5;
        }
        h1 {
            color: #333;
            margin-bottom: 1.5rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        thead {
            background-color: #2563eb;
            color: white;
        }
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            font-weight: 600;
        }
        tbody tr:hover {
            background-color: #f9fafb;
        }
        a {
            color: #2563eb;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .endpoints {
            margin-top: 2rem;
            padding: 1rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .endpoints h2 {
            margin-top: 0;
            color: #333;
        }
        .endpoints code {
            background-color: #f3f4f6;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <h1>Answer Files</h1>
    <table>
        <thead>
            <tr>
                <th>Filename</th>
                <th>Database Name</th>
                <th>Last Modified</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${sessions.length === 0 
              ? '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #6b7280;">No answer files found</td></tr>'
              : sessions.map(session => `
                <tr>
                    <td><code>${session.filename}</code></td>
                    <td>${session.databaseName}</td>
                    <td>${session.lastModified.toISOString()}</td>
                    <td><a href="/answers/answer-files/${session.fileId}">View JSON</a></td>
                </tr>
              `).join('')
            }
        </tbody>
    </table>
    <div class="endpoints">
        <h2>API Endpoints</h2>
        <p>
            <strong>JSON List:</strong> <a href="/answers/answer-files/list-all"><code>/answers/answer-files/list-all</code></a>
        </p>
        <p>
            <strong>Individual File:</strong> <code>/answers/answer-files/{fileId}</code>
        </p>
    </div>
</body>
</html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }

  @Get("answer-files/list-all")
  async listAllAnswerFiles(): Promise<
    Array<{
      fileId: string;
      filename: string;
      databaseName: string;
      lastModified: string;
    }>
  > {
    this.logger.log("GET /answers/answer-files/list-all - Listing all answer files (JSON)");
    const sessions = await this.answerSessionsService.listAllSessions();

    return sessions.map((session) => ({
      fileId: session.fileId,
      filename: session.filename,
      databaseName: session.databaseName,
      lastModified: session.lastModified.toISOString(),
    }));
  }

  @Get("answer-files/:fileId")
  async getAnswerFile(@Param("fileId") fileId: string): Promise<any> {
    this.logger.log(`GET /answers/answer-files/${fileId} - Retrieving answer file`);
    try {
      const session = await this.answerSessionsService.getSession(fileId);
      return session;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Answer file '${fileId}' not found`);
    }
  }
}
