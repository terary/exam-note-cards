# Question Manager Implementation Plan

## Overview

Build a question management system to track question performance, enable CRUD operations, and prioritize questions for practice based on answer scores.

**Important Notes:**

- This is throw-away code for personal use - no production quality requirements
- Keep it simple: one component/feature = one design
- **NEVER USE EMOJI IN LOGS**
- Use one log statement with string concatenation instead of multiple log statements

## Current State

- Questions stored as JSON files in `databases/` directory
- Answer sessions stored separately in `sessions/` directory
- Question/quiz interface already exists
- Questions interface currently has: questionId, questionText, answerText, tags, domains
- Answers are tracked per session with correctness percentage

## Requirements

### 1. Question Scoring System

Score interpretation:

- `-1` = bad question (mark for review/removal)
- `0` or `null` = never answered
- `0-90` = answered but still need practice
- `91+` = mastered, no reason to ask again

### 2. Question Statistics Tracking

Each question needs to track:

- `timesAsked`: number of times question has been answered
- `averageScore`: average correctness percentage across all attempts
- `lastScore`: most recent correctness percentage (null if never answered)
- `score`: computed field for prioritization (-1, 0-100+)

### 3. CRUD Operations for Questions

For each database:

- List all questions within a database
- Get single question by ID
- Edit/Update question (questionText, answerText, tags, domains)
- Delete question
- Create new question

### 4. Question Prioritization Engine

- Analyze all questions and identify those needing practice (score 0-90)
- Prioritize by: never answered (0) > low scores (1-60) > moderate scores (61-90)
- Exclude bad questions (-1) and mastered questions (91+)

### 5. Answer Recording Integration

When recording an answer:

- Update question's `timesAsked` (increment)
- Update question's `averageScore` (recalculate from all session answers)
- Update question's `lastScore` (set to current answer)
- Recompute question's `score` field

## Implementation Plan

### Phase 1: Extend Question Interface and Database Structure

**File: `src/interfaces.ts`**

- Add optional stats fields to Question interface:
  - `timesAsked?: number` (default 0)
  - `averageScore?: number` (default null)
  - `lastScore?: number | null` (default null)
- Note: `score` is computed, not stored

**Migration Strategy:**

- Existing questions will have these fields as undefined/null
- Treat undefined/null as 0 for timesAsked, null for scores
- Backward compatible - existing JSON files will continue to work

### Phase 2: Create Question Statistics Service

**File: `src/question-stats.service.ts`**

Service to:

- Compute question score from statistics
- Aggregate answer history from all sessions
- Update question statistics after answer recording

Methods:

- `computeQuestionScore(question: Question): number`
  - Returns -1 if marked bad, otherwise calculates from lastScore/averageScore
- `aggregateQuestionStats(questionId: string, allSessions: AnswerSession[]): QuestionStats`
  - Reads through all session files, aggregates stats for a question
- `updateQuestionStats(questionId: string, newScore: number): void`
  - Updates the question in database JSON file with new stats

### Phase 3: Question Manager Controller & Service

**Files:**

- `src/question-manager.controller.ts`
- `src/question-manager.service.ts`

**Endpoints:**

- `GET /question-manager/databases` - List all databases
- `GET /question-manager/databases/{databaseId}/questions` - List all questions in database
- `GET /question-manager/questions/{questionId}` - Get single question
- `POST /question-manager/databases/{databaseId}/questions` - Create new question
- `PUT /question-manager/questions/{questionId}` - Update existing question
- `DELETE /question-manager/questions/{questionId}` - Delete question
- `GET /question-manager/questions/{questionId}/stats` - Get question statistics
- `GET /question-manager/prioritized` - Get prioritized list of questions needing practice

**Service Methods:**

- `listQuestionsInDatabase(databaseId: string): Question[]`
- `getQuestion(questionId: string): Question`
- `createQuestion(databaseId: string, questionData: CreateQuestionDto): Question`
- `updateQuestion(questionId: string, updates: UpdateQuestionDto): Question`
- `deleteQuestion(questionId: string): void`
- `getPrioritizedQuestions(limit?: number): Question[]`

**Note:** All operations should refresh and write back to JSON files synchronously.

### Phase 4: Integrate Statistics Updates into Answer Recording

**File: `src/answer-sessions.service.ts`**

Modify `recordAnswer()` method:

- After saving answer to session
- Call QuestionStatsService to update question statistics
- Update the question in the database JSON file

**File: `src/question-stats.service.ts`**

Add method:

- `recordAnswerAndUpdateStats(params): void`
  - Records answer (delegates to AnswerSessionsService)
  - Aggregates all sessions for the question
  - Updates question with new stats
  - Writes updated database back to JSON

### Phase 5: Prioritization Engine

**File: `src/question-stats.service.ts`**

Method:

- `getPrioritizedQuestions(limit?: number): Question[]`
  - Load all databases
  - For each question, compute score
  - Filter: score >= 0 && score <= 90 (exclude -1 and 91+)
  - Sort: 0 (never answered) first, then 1-60, then 61-90
  - Return top N questions

### Phase 6: Frontend Question Manager UI (Optional)

If time permits, create a simple React component:

- List questions with their scores
- Edit/delete buttons
- Form to create new questions
- Filter by score range

## Technical Details

### Score Calculation Logic

```typescript
function computeScore(question: Question, stats: QuestionStats): number {
  // If marked as bad, return -1
  if (question.bad === true) return -1;

  // Never answered
  if (stats.timesAsked === 0) return 0;

  // Use lastScore if available, otherwise averageScore
  const score = question.lastScore ?? question.averageScore ?? 0;
  return Math.round(score);
}
```

### Question Update Workflow

1. Load database JSON file
2. Find question by questionId
3. Update question object
4. Write entire database back to JSON file
5. Refresh QuestionsService cache

### Answer Recording Workflow

1. Record answer in session (existing flow)
2. Load all sessions
3. Find all answers for this questionId
4. Calculate: timesAsked, averageScore, lastScore
5. Load database JSON
6. Update question stats
7. Write database JSON back
8. Refresh cache

### Logging Guidelines

- **NO EMOJIS** in any log messages
- Use single log statement with string concatenation:

  ```typescript
  // Good
  this.logger.log(
    `Updated question '${questionId}' in database '${databaseId}': timesAsked=${stats.timesAsked}, avgScore=${stats.averageScore}, lastScore=${stats.lastScore}`
  );

  // Bad
  this.logger.log(`Updated question ${questionId}`);
  this.logger.log(`Times asked: ${stats.timesAsked}`);
  ```

- Keep logs informative but concise

## File Structure Changes

```
src/
  interfaces.ts                    (extend Question interface)
  question-stats.service.ts        (new - statistics computation)
  question-manager.service.ts      (new - CRUD operations)
  question-manager.controller.ts   (new - REST endpoints)
  answer-sessions.service.ts       (modify - integrate stats updates)
  questions.service.ts             (may need refresh method)
  app.module.ts                    (register new services/controllers)
```

## Testing Strategy

- Manual testing only (no unit tests needed for throw-away code)
- Test with existing databases
- Verify backward compatibility with questions missing stats fields
- Test CRUD operations
- Verify statistics aggregation from sessions
- Test prioritization logic

## Future Considerations (Not in Scope)

- MongoDB migration (mentioned but not required now)
- Advanced filtering/sorting
- Question tagging for organization
- Export/import functionality
