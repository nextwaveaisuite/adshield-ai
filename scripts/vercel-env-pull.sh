#!/usr/bin/env bash
set -euo pipefail
# Pull Vercel env vars into .env.local
# Requires: Vercel CLI logged in, VERCEL_ORG_ID and VERCEL_PROJECT_ID configured or `vercel link` run.
: "${VERCEL_ORG_ID:?Set VERCEL_ORG_ID}"
: "${VERCEL_PROJECT_ID:?Set VERCEL_PROJECT_ID}"
vercel env pull .env.local
echo "Pulled env to .env.local"
