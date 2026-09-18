#!/usr/bin/env bash
# Dumps the Postgres database to a timestamped, gzipped file and deletes
# backups older than 14 days. Intended to run daily via cron (see
# deploy/SETUP.md for the crontab line) — only needed if Postgres is
# self-hosted on the VPS; a managed Postgres service usually handles this
# for you already.
set -euo pipefail

DB_NAME="livora"
DB_USER="livora"
BACKUP_DIR="/var/backups/livora-db"
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
FILE="$BACKUP_DIR/livora_${TIMESTAMP}.sql.gz"

pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$FILE"
echo "Backed up to $FILE"

find "$BACKUP_DIR" -name 'livora_*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete
