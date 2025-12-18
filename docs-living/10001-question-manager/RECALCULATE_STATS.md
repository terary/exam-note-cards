# Recalculating Question Statistics

If questions show no answers (timesAsked: 0, avgScore: null, lastScore: null) but you know there are answer sessions, you need to recalculate the statistics.

## Quick Fix

Run the recalculation script:

```bash
npm run recalculate:stats
```

This script:
1. Reads all answer sessions from MongoDB
2. Aggregates statistics for each question
3. Updates the question documents with the correct statistics

## Production Usage

If your MongoDB is on a different host (e.g., 192.168.0.198), set the `MONGODB_URI` environment variable:

```bash
MONGODB_URI=mongodb://192.168.0.198:37017/exam_note_cards npm run recalculate:stats
```

Or if MongoDB is on the default port 27017:

```bash
MONGODB_URI=mongodb://192.168.0.198:27017/exam_note_cards npm run recalculate:stats
```

## What It Does

- Finds all answer sessions in the `answer_sessions` collection
- For each question, calculates:
  - `timesAsked`: Total number of times the question was answered
  - `averageScore`: Average of all correctness percentages
  - `lastScore`: Most recent correctness percentage
- Updates the question documents in the `databases` collection

## Expected Output

```
[Nest] LOG [RecalculateStats] Starting statistics recalculation...
[Nest] LOG [RecalculateStats] Found X answer sessions
[Nest] LOG [RecalculateStats] Found answers for Y unique questions
[Nest] LOG [RecalculateStats] Updated statistics for questions in database 'database-name'
...
[Nest] LOG [RecalculateStats] Recalculation complete: X questions updated, Y questions unchanged
[Nest] LOG [RecalculateStats] Statistics recalculation completed successfully!
```

## When to Run This

- After migrating data from JSON files
- After importing data from another MongoDB instance
- If statistics appear incorrect or missing
- After bulk operations that might have missed statistic updates

