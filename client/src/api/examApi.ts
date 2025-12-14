import type {
  DatabaseInfo,
  DatabasePayload,
  Question,
  QuestionStats,
} from "../types";

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
  answerNotes?: string;
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

export interface CategorizedWriteups {
  writeups: WriteupListItem[];
  vocabulary: WriteupListItem[];
  todo: WriteupListItem[];
}

export async function fetchWriteups(): Promise<CategorizedWriteups> {
  const response = await fetch(`/write-up-notes`);
  return handleResponse<CategorizedWriteups>(response);
}

export async function fetchWriteupById(id: string): Promise<WriteupPayload> {
  const response = await fetch(`/write-up-notes/${id}`);
  return handleResponse<WriteupPayload>(response);
}

export async function fetchExternalIp(): Promise<{ ip: string }> {
  const response = await fetch(`${BASE_PATH}/external-ip`);
  return handleResponse<{ ip: string }>(response);
}

// Question Manager APIs
const QUESTION_MANAGER_BASE = "/question-manager";

export async function fetchQuestionManagerDatabases(): Promise<DatabaseInfo[]> {
  const response = await fetch(`${QUESTION_MANAGER_BASE}/databases`);
  return handleResponse<DatabaseInfo[]>(response);
}

export async function fetchQuestionsInDatabase(
  databaseId: string
): Promise<Question[]> {
  const response = await fetch(
    `${QUESTION_MANAGER_BASE}/databases/${databaseId}/questions`
  );
  return handleResponse<Question[]>(response);
}

export async function fetchQuestion(questionId: string): Promise<Question> {
  const response = await fetch(`${QUESTION_MANAGER_BASE}/questions/${questionId}`);
  return handleResponse<Question>(response);
}

export interface CreateQuestionDto {
  questionText: string;
  answerText: string;
  tags?: string[];
  domains: string[];
}

export async function createQuestion(
  databaseId: string,
  question: CreateQuestionDto
): Promise<Question> {
  const response = await fetch(
    `${QUESTION_MANAGER_BASE}/databases/${databaseId}/questions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    }
  );
  return handleResponse<Question>(response);
}

export interface UpdateQuestionDto {
  questionText?: string;
  answerText?: string;
  tags?: string[];
  domains?: string[];
  bad?: boolean;
}

export async function updateQuestion(
  questionId: string,
  updates: UpdateQuestionDto
): Promise<Question> {
  const response = await fetch(
    `${QUESTION_MANAGER_BASE}/questions/${questionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );
  return handleResponse<Question>(response);
}

export async function deleteQuestion(questionId: string): Promise<void> {
  const response = await fetch(
    `${QUESTION_MANAGER_BASE}/questions/${questionId}`,
    {
      method: "DELETE",
    }
  );
  await handleResponse(response);
}

export interface QuestionStatsResponse {
  questionId: string;
  score: number;
  stats: QuestionStats;
}

export async function fetchQuestionStats(
  questionId: string
): Promise<QuestionStatsResponse> {
  const response = await fetch(
    `${QUESTION_MANAGER_BASE}/questions/${questionId}/stats`
  );
  return handleResponse<QuestionStatsResponse>(response);
}

export async function fetchPrioritizedQuestions(
  limit?: number
): Promise<Question[]> {
  const url = limit
    ? `${QUESTION_MANAGER_BASE}/prioritized?limit=${limit}`
    : `${QUESTION_MANAGER_BASE}/prioritized`;
  const response = await fetch(url);
  return handleResponse<Question[]>(response);
}

export async function searchQuestions(
  query: string,
  databaseId?: string
): Promise<Question[]> {
  const params = new URLSearchParams({ q: query });
  if (databaseId) {
    params.append("databaseId", databaseId);
  }
  const response = await fetch(
    `${QUESTION_MANAGER_BASE}/search?${params.toString()}`
  );
  return handleResponse<Question[]>(response);
}
