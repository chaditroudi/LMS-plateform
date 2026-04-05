#!/bin/sh
# =============================================================================
# n8n Init Script — LMS Platform
#
# Runs before n8n starts to:
#   1. Wait for the PostgreSQL database to be ready.
#   2. Import all workflow JSON files from /workflows into n8n.
#      (Existing workflows with the same ID are skipped.)
#   3. Hand off to the n8n server process.
# =============================================================================

set -e

echo "[n8n-init] Waiting for PostgreSQL at ${DB_POSTGRESDB_HOST}:${DB_POSTGRESDB_PORT}..."

# Poll until postgres accepts connections (max 60 s)
RETRIES=30
until nc -z "${DB_POSTGRESDB_HOST:-postgres}" "${DB_POSTGRESDB_PORT:-5432}" 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "[n8n-init] ERROR: PostgreSQL not reachable after 60 s. Continuing anyway..."
    break
  fi
  echo "[n8n-init] PostgreSQL not ready yet — retrying in 2 s ($RETRIES attempts left)..."
  sleep 2
done

echo "[n8n-init] PostgreSQL is up."

WORKFLOW_HASH_FILE="/home/node/.n8n/.lms-workflows-sha256"

# Re-import workflows whenever the JSON bundle changes.
# n8n preserves the workflow IDs, so importing the same files updates the
# stored definitions without requiring manual edits in the UI.
if [ -d "/workflows" ] && ls /workflows/*.json >/dev/null 2>&1; then
  WORKFLOW_HASH="$(cat /workflows/*.json | sha256sum | awk '{print $1}')"
  PREVIOUS_HASH=""

  if [ -f "$WORKFLOW_HASH_FILE" ]; then
    PREVIOUS_HASH="$(cat "$WORKFLOW_HASH_FILE")"
  fi

  if [ "$WORKFLOW_HASH" = "$PREVIOUS_HASH" ]; then
    echo "[n8n-init] Workflow bundle unchanged — skipping import."
  else
    echo "[n8n-init] Importing LMS workflows from /workflows/ ..."
    if n8n import:workflow --separate --input=/workflows/; then
      echo "[n8n-init] Publishing imported workflows ..."
      for workflow in /workflows/*.json; do
        WORKFLOW_ID="$(sed -n 's/^[[:space:]]*"id":[[:space:]]*"\([^"]*\)".*/\1/p' "$workflow" | head -n 1)"
        if [ -n "$WORKFLOW_ID" ]; then
          n8n publish:workflow --id="$WORKFLOW_ID"
        fi
      done
      echo "$WORKFLOW_HASH" > "$WORKFLOW_HASH_FILE"
      echo "[n8n-init] Workflows imported successfully."
    else
      echo "[n8n-init] WARNING: Workflow import encountered issues."
    fi
  fi
else
  echo "[n8n-init] No workflows directory found — skipping import."
fi

echo "[n8n-init] Starting n8n..."
exec n8n start
