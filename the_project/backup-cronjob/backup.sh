#!/bin/sh

set -e

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

FILE="backup-$TIMESTAMP.sql"

echo "Creating backup..."

export PGPASSWORD=$POSTGRES_PASSWORD

pg_dump \
    -h "$POSTGRES_HOST" \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    > "$FILE"

echo "Uploading..."

gcloud storage cp \
    "$FILE" \
    "gs://$BUCKET_NAME/"

echo "Done."