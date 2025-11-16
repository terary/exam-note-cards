# Exam Note Cards

We will be creating a 'flash card' application. Each quiz presents one question at a time with a button labeled **"See answer"**. When the end-user clicks the button we reveal the answer, let them record how well they did, then continue to the next question until they choose to stop.

We will store our databases in the directory named 'databases' which will be a simple json file
`databases/ai-managed-services.json' as example.

The UI will allow the end user to select which database to use.
Questions will be randomly presented to the end user and tracked per quiz session.

The database json file will have the shape

```
{
  "databaseName": "database other",
  "questionsWithAnswers": [
    {
      "questionId": "THE_QUESTION_ID",
      "questionText": "Some Question One",
      "answerText": "The Answer to Question One",
      "tags": ["tag1", "tag2", "tag3"],
      "domains": ["domain1", "domain2", "domain3"]
    },
    {
      "questionId": "THE_QUESTION_ID",
      "questionText": "Some Question Two",
      "answerText": "The Answer to Question Two",
      "tags": ["tag1", "tag2", "tag3"],
      "domains": ["domain1", "domain2", "domain3"]
    }
  ]
}

```

## Routing

We will build a full-stack experience:

- Backend delivered with NestJS (REST API).
- Frontend delivered with React + Redux (no Next.js). The React app is bundled and served by the NestJS app for simplicity.
- No authentication.

The endpoint to server the questions

question-and-answers/questions/databases/ <-- returns a full list of all databases
question-and-answers/questions/databases/{databaseId} <-- returns a full list of questions for a given database
question-and-answers/questions/{questionId} <-- displays question as described above
question-and-answers/questions <-- list all question (not answers)

We have a little flexibility here however, the main app entry point should be questions-and-answers/, this will allow us to add more root functionalities (functionality groups/domains) at a later date.

## Frontend Experience

We will ship a minimal React + Redux UI that consumes the NestJS API:

- Landing view shows available databases (quizzes). Selecting one starts a quiz session for that database.
- Quiz view layout:
  - Question text.
  - `See answer` button; once clicked, the answer text appears inline.
  - After revealing the answer, show an input (slider or buttons) for **"Did you get it correct?"** capturing a percentage from 0% to 100%.
  - **Next question** button becomes enabled after recording the correctness.
- Running totals for the active quiz visible at all times:
  - Questions asked: `###`
  - Questions answered: `###`
  - Questions correct: `###` (derived as the sum of recorded percentages / count or rounded as needed).
- When the quiz reaches the end of the question pool the user can restart or return to the database list. Initial scope can simply cycle questions continuously once the correctness is recorded.

Redux state will manage:

- Current quiz metadata (selected database ID/name).
- Question queue and current question index.
- Whether the answer is revealed.
- Per-question correctness scores and aggregate totals.

## Quiz Flow

1. User selects a database (quiz) from the list.
2. The app fetches question data for that database and initializes quiz state.
3. Each iteration:
   - Display question text.
   - On `See answer`, reveal answer text.
   - Prompt for correctness percentage (0–100). Store the value.
   - Update running totals before moving to the next random question.
4. Repeat until user stops or questions exhausted. For now, we allow repeated random questions without tracking history.
5. Provide an option to reset the quiz, clearing all totals and re-selecting the database if desired.

There will be no authentication

We will use 'env' module
Use UUID for all ID

- All database files should be imported (not read using fs).

- Backend code stays at the project root inside `src/`.
- Frontend code will live in `client/` (React app) and be built into static assets served by Nest.

- We will use Nest's native logger
- WE NEVER USE EMOJI in logging <-- VERY IMPORTANT
- WE ATTEMPT TO USE FEWER LOGGING STATEMENTS <-- VERY IMPORTANT
  Log messages that require multiple lines/statements should be a multi-line string and logged out that way instead of creating several log statements.

- At this time we don't really care too much for testing.

### Question Follow-up

> 1.  How will you handle the "random" selection? True random or weighted based on difficulty?

I think you can figure out how to present a question out of a list, randomly

> 2.  Will you track which questions have been shown recently to avoid repetition?

Not at this time

> 3.  Do you want any form of progress tracking (questions answered, correct/incorrect)?

Yes — track counts for questions asked, answered, and aggregate correctness percentage for the active quiz session.

> 4.  How will you handle database updates while the application is running?

###

I have address some/most of your questions/concerns.

I don't recall if we can `import \* as x from 'some/json/file.json' from resources outside of src? If we can not, then we move the database into the src directory, import from is most important

## Header 2

Bullet List:

- Item One
- Item Two
