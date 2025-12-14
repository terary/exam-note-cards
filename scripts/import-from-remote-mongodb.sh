#!/bin/bash

# Script to import databases from remote MongoDB instance to local MongoDB
# Usage: ./scripts/import-from-remote-mongodb.sh [remote-mongo-uri] [local-mongo-uri]

set -e

REMOTE_URI="${1:-mongodb://user:password@remote-host:27017/exam_note_cards}"
LOCAL_URI="${2:-mongodb://localhost:37017/exam_note_cards}"

echo "Exporting from remote MongoDB: $REMOTE_URI"
echo "Importing to local MongoDB: $LOCAL_URI"
echo ""

# Create temporary directory for dump
TMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TMP_DIR"

# Export from remote
echo "Step 1: Exporting from remote MongoDB..."
mongodump --uri="$REMOTE_URI" --out="$TMP_DIR"

if [ ! -d "$TMP_DIR/exam_note_cards" ]; then
    echo "Error: Expected dump directory 'exam_note_cards' not found"
    echo "The database name on remote might be different. Check the dump directory: $TMP_DIR"
    exit 1
fi

# Import to local
echo ""
echo "Step 2: Importing to local MongoDB..."
mongorestore --uri="$LOCAL_URI" --drop "$TMP_DIR/exam_note_cards"

# Cleanup
echo ""
echo "Step 3: Cleaning up temporary files..."
rm -rf "$TMP_DIR"

echo ""
echo "Migration completed successfully!"
echo "You can verify by connecting to MongoDB:"
echo "  mongosh $LOCAL_URI"
echo "  db.databases.countDocuments()"
echo "  db.answer_sessions.countDocuments()"

