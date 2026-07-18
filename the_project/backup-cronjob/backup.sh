#!/bin/sh

set -e

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
FILE="backup-$TIMESTAMP.sql"

export PGPASSWORD="$POSTGRES_PASSWORD"

echo "Creating backup..."

pg_dump \
  -h "$POSTGRES_HOST" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  > "$FILE"

echo "Authenticating..."

gcloud auth activate-service-account \
  --key-file="$GOOGLE_APPLICATION_CREDENTIALS"

gcloud auth list

echo "Uploading..."

gcloud storage cp \
  "$FILE" \
  "gs://$BUCKET_NAME/"

echo "Done."