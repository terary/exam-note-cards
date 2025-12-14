# Migrating Databases from Remote MongoDB Instance

This guide explains how to move your databases from a deployed/remote MongoDB instance to your local MongoDB.

## Verify Persistent Storage

Your local MongoDB is using persistent storage. The data is stored in a Docker volume:

```bash
# Check volume exists
docker volume ls | grep mongodb

# Volume location (for reference)
docker volume inspect exam-note-cards_mongodb_data
```

The volume persists data even when the container is stopped or removed (unless you use `docker compose down -v`).

## Prerequisites

1. MongoDB tools installed locally:
   - `mongodump` - for exporting from remote
   - `mongorestore` - for importing to local

   Install on Ubuntu/Debian:
   ```bash
   sudo apt-get install mongodb-database-tools
   ```

   Or download from: https://www.mongodb.com/try/download/database-tools

2. Access to your remote MongoDB instance:
   - Connection URI (e.g., `mongodb://user:password@remote-host:27017/exam_note_cards`)
   - Network access from your local machine

## Method 1: Using the Import Script

1. Make the script executable:
   ```bash
   chmod +x scripts/import-from-remote-mongodb.sh
   ```

2. Run the import script:
   ```bash
   # With default local URI (localhost:37017)
   ./scripts/import-from-remote-mongodb.sh "mongodb://user:password@remote-host:27017/exam_note_cards"

   # Or specify both URIs
   ./scripts/import-from-remote-mongodb.sh \
     "mongodb://user:password@remote-host:27017/exam_note_cards" \
     "mongodb://localhost:37017/exam_note_cards"
   ```

## Method 2: Manual Export/Import

### Step 1: Export from Remote MongoDB

```bash
mongodump --uri="mongodb://user:password@remote-host:27017/exam_note_cards" --out=./mongodb-export
```

This creates a `mongodb-export/exam_note_cards` directory with all collections.

### Step 2: Import to Local MongoDB

```bash
# Make sure local MongoDB is running
docker compose up -d

# Import (--drop will replace existing data)
mongorestore --uri="mongodb://localhost:37017/exam_note_cards" --drop ./mongodb-export/exam_note_cards
```

### Step 3: Verify Import

```bash
# Connect to local MongoDB
mongosh mongodb://localhost:37017/exam_note_cards

# Check collections
show collections

# Count documents
db.databases.countDocuments()
db.answer_sessions.countDocuments()

# View a sample database
db.databases.findOne()
```

## Method 3: Export from Remote as JSON and Use Migration Script

If you prefer to export as JSON and use the existing migration script:

1. Export from remote MongoDB:
   ```bash
   mongoexport --uri="mongodb://user:password@remote-host:27017/exam_note_cards" \
     --collection=databases --out=databases-export.json
   
   mongoexport --uri="mongodb://user:password@remote-host:27017/exam_note_cards" \
     --collection=answer_sessions --out=answer_sessions-export.json
   ```

2. Convert and import using your application's migration script (you may need to modify it to handle JSON exports).

## Troubleshooting

### Connection Issues

If you can't connect to remote MongoDB:
- Check network connectivity
- Verify firewall rules
- Confirm MongoDB allows remote connections (bind_ip setting)
- Test connection: `mongosh "mongodb://user:password@remote-host:27017/exam_note_cards"`

### Authentication Issues

- Ensure username/password are correct
- Check if authentication database is different (use `--authenticationDatabase=admin`)

### Port Issues

- Local MongoDB is on port **37017** (not 27017)
- Remote MongoDB might be on a different port

### Data Conflicts

The `--drop` flag in mongorestore will replace existing data. If you want to merge instead:
- Remove `--drop` flag
- Be aware of potential conflicts with existing document IDs

## Verify Persistent Storage is Working

1. Stop the container:
   ```bash
   docker compose down
   ```

2. Start it again:
   ```bash
   docker compose up -d
   ```

3. Check data is still there:
   ```bash
   mongosh mongodb://localhost:37017/exam_note_cards
   db.databases.countDocuments()
   ```

If the count is the same, persistent storage is working correctly.

