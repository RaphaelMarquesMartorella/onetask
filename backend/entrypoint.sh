#!/bin/bash
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Seeding database..."
PGPASSWORD=postgres psql -h db -U postgres -d onetask -f /app/init.sql 2>/dev/null || echo "Seed already applied or skipped"

echo "Starting application..."
exec "$@"
