import type { DatabaseInfo, DatabasePayload } from "../types";

const BASE_PATH = "/questions-and-answers";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function fetchDatabases(): Promise<DatabaseInfo[]> {
  const response = await fetch(`${BASE_PATH}/questions/databases`);
  return handleResponse<DatabaseInfo[]>(response);
}

export async function fetchDatabase(
  databaseId: string
): Promise<DatabasePayload> {
  const response = await fetch(
    `${BASE_PATH}/questions/databases/${databaseId}`
  );
  return handleResponse<DatabasePayload>(response);
}

export async function createAnswerSession(
  databaseId: string
): Promise<{ sessionId: string }> {
  const response = await fetch(`${BASE_PATH}/answer-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ databaseId }),
  });
  return handleResponse<{ sessionId: string }>(response);
}

export async function recordAnswer(params: {
  sessionId: string;
  databaseId: string;
  questionId: string;
  questionText: string;
  actualAnswerText: string;
  userAnswerText: string;
  userCorrectnessPercentage: number;
}): Promise<void> {
  const { sessionId, ...rest } = params;
  const response = await fetch(
    `${BASE_PATH}/answer-sessions/${sessionId}/answers`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    }
  );
  await handleResponse(response);
}

// Write-up APIs
export interface WriteupListItem {
  id: string;
  filename: string;
  lastModified: string;
}

export interface WriteupPayload {
  id: string;
  filename: string;
  content: string;
  lastModified: string;
}

export async function fetchWriteups(): Promise<WriteupListItem[]> {
  const response = await fetch(`/write-up-notes`);
  return handleResponse<WriteupListItem[]>(response);
}

export async function fetchWriteupById(id: string): Promise<WriteupPayload> {
  const response = await fetch(`/write-up-notes/${id}`);
  return handleResponse<WriteupPayload>(response);
}

export async function fetchExternalIp(): Promise<{ ip: string }> {
  const response = await fetch(`${BASE_PATH}/external-ip`);
  return handleResponse<{ ip: string }>(response);
}
