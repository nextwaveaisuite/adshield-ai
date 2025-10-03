#!/usr/bin/env bash
set -euo pipefail
# Assist pushing .env.local vars to Vercel via CLI.
# NOTE: Vercel CLI `env add` is interactive. This helper prints one-liners you can copy/paste.
# Usage: ./scripts/vercel-env-push.sh .env.local production
FILE="${1:-.env.local}"
TARGET="${2:-production}" # 'preview' or 'development' also valid
if [[ ! -f "$FILE" ]]; then
  echo "File not found: $FILE" >&2; exit 1;
fi
echo "# Copy each line to add vars to Vercel ($TARGET):"
while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  KEY="${line%%=*}"
  VAL="${line#*=}"
  # Strip surrounding quotes if any
  VAL="${VAL%"}"; VAL="${VAL#"}"; VAL="${VAL%'}"; VAL="${VAL#'}"
  echo "echo -n "$VAL" | vercel env add $KEY $TARGET"
done < "$FILE"
