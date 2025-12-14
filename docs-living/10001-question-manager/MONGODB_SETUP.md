# MongoDB Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- Node.js and npm installed

## Starting MongoDB

**Prerequisite:** Make sure Docker Desktop is running on your system.

1. Start MongoDB using Docker Compose:
```bash
docker compose up -d
```

Note: Use `docker compose` (with space) not `docker-compose` (with hyphen). Docker Compose v2 is included with modern Docker installations.

This will start MongoDB on port 37017 (mapped from container port 27017) with:
- Database name: `exam_note_cards`
- Data persisted in Docker volume: `mongodb_data`

2. Verify MongoDB is running:
```bash
docker ps
```

You should see a container named `exam-note-cards-mongodb` running.

## Migrating Existing Data

If you have existing JSON files in the `databases/` and `sessions/` directories, you can migrate them to MongoDB:

```bash
npm run migrate:mongodb
```

This script will:
- Read all JSON files from `databases/` and `src/databases/` directories
- Read all session files from `sessions/` directory
- Import them into MongoDB
- Skip any databases/sessions that already exist in MongoDB

## Configuration

The application uses the MongoDB connection string from environment variable `MONGODB_URI` or defaults to:
```
mongodb://localhost:37017/exam_note_cards
```

Note: Port 37017 is used to avoid conflicts with any existing MongoDB instance on the default port 27017.

You can override this by creating a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/exam_note_cards
```

## Stopping MongoDB

To stop MongoDB:
```bash
docker compose down
```

To stop and remove all data (WARNING: This will delete all data):
```bash
docker compose down -v
```

## Database Collections

- `databases` - Contains all question databases with embedded questions
- `answer_sessions` - Contains all answer sessions with embedded answer records

## Accessing MongoDB Directly

To access MongoDB shell:
```bash
docker exec -it exam-note-cards-mongodb mongosh exam_note_cards
```

Or connect from your host machine:
```bash
mongosh mongodb://localhost:37017/exam_note_cards
```

