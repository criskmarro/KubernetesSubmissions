#!/bin/sh

set -e

export GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/google/key.json

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

FILE="backup-$TIMESTAMP.sql"

echo "Creating backup..."

pg_dump \
    -h $DB_HOST \
    -U $DB_USER \
    -d $DB_NAME \
    > $FILE

echo "Uploading..."

gcloud storage cp \
    $FILE \
    gs://dwk-gke-502323-backups/

echo "Done."