![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
# Craigslist-Compliant Ad Assistant (Deployable)

Zero-touch, **Craigslist-compliant** workflow. No scraping, no rule evasion.

## Features
- AI Idea → Compliant Ad generator (no affiliate links in ad body)
- UTM builder
- Insights from first-party data (clicks/leads/sales)
- Auto-pull `/api/metrics` → Heatmap & Best Posting Windows
- Trends (indirect, legal signals) → Creative Hints
- Auto Posting Plan + Variant Evolution
- Export Posting Plan to **CSV** and **ICS** (AEST timezone, weekly RRULE for 4 weeks)

## Deploy (Vercel)
1. Create a new Vercel project from this folder/repo.
2. Copy `.env.local.example` → **Environment Variables**.
3. Choose your DB backend (Supabase or Vercel Postgres).
4. Create the `events` table:
   - **Supabase**: run [`sql/events_supabase.sql`](sql/events_supabase.sql).
   - **Vercel Postgres**: run [`sql/events_vercel.sql`](sql/events_vercel.sql) or call `POST /api/bootstrap` with `x-admin-key`.

## Local
```bash
npm install
npm run dev
```

## Endpoints
- `POST /api/collect` — store events (`click|lead|sale`).
- `GET  /api/metrics` — aggregates last 30 days → `{ country, state, zip, offer_type, posts, clicks, leads, sales, weekday?, hour? }`.
- `GET  /api/trends`  — proxy for public trend signals (mock/demo).
- `GET  /api/news`    — proxy for news counts (mock/demo).
- `GET  /api/youtube` — proxy for public YouTube stats (mock/demo).
- `POST /api/bootstrap` — (optional) create table/indexes in Vercel Postgres; requires `ADMIN_KEY`.

## Legal
This project is designed to be **compliant**. It does not automate access to Craigslist
or copy competitors’ content. It uses your first‑party data + public APIs only.

## Local Postgres (Docker)
```bash
# start Postgres + Adminer (http://localhost:8080)
docker compose up -d

# set a local DATABASE_URL
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/adsdb

# create table + seed sample data
npm run db:seed:local
```

## Supabase seed
```bash
# make sure you've created the table (run sql/events_supabase.sql in Supabase)
export SUPABASE_URL=...    # your project url
export SUPABASE_KEY=...    # service role or insert-capable key
npm run db:seed:supabase
```

## Manual SQL seed (any Postgres)
```bash
psql "$DATABASE_URL" -f sql/events_vercel.sql
psql "$DATABASE_URL" -f sql/seed_events.sql
```


## New: Abuse safeguards & Admin
- **Admin Console** `/admin` with role-based access (prototype). Set `ADMIN_USERS`, `ANALYST_USERS`, or use `ADMIN_USER/ADMIN_PASS`.
- **Moderation in UI**: ad text is scanned via `/api/admin/moderate` before display/use.
- **Rate limiting**: uses **Upstash Redis** if `UPSTASH_REDIS_*` are set, else falls back to in-memory.
- **Audit logs**: `/api/collect` and `/api/metrics` are logged to `audit_logs`.
- **Health check**: `/api/health` validates DB connectivity and settings table.

### Upstash setup
1. Create an Upstash Redis database.
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your env.
3. That’s it — rate limiting becomes multi-instance safe.

### RBAC
- `ADMIN_USERS=alice@example.com,bob@example.com`
- `ANALYST_USERS=analyst@example.com`
- Prototype cookie tokens are issued at login; replace with SSO for production.


## OAuth (NextAuth) – optional
- Set `NEXTAUTH_URL`, `NEXTAUTH_SECRET` and at least one provider (Google or Azure AD).
- Deploy; visit `/admin`. If NextAuth is configured, you’ll be redirected to sign in.
- RBAC still uses `ADMIN_USERS` / `ANALYST_USERS` to assign roles by email.

## Metrics Dashboard
- Visit `/metrics` for quick charts (Chart.js) based on `/api/metrics`.

## OpenTelemetry → Datadog (optional)
- Provide `DD_API_KEY` and `OTEL_EXPORTER_OTLP_ENDPOINT=https://api.datadoghq.com`.
- The app auto-registers OTEL via `otel-register.cjs` in dev/start scripts.
- You can view traces/spans in Datadog if your Vercel project allows outbound HTTPS.


## CI Status Badge
Replace `OWNER/REPO` in the badge URL with your GitHub org/repo.

## Monitor
- Visit `/monitor` to see the live status from `/api/health` (refreshes every minute).

## Optional: CI → Vercel deploys
Add these GitHub repository **Secrets** to enable automatic deploys from CI:

- `VERCEL_TOKEN` — Vercel personal token
- `VERCEL_ORG_ID` — Vercel org ID
- `VERCEL_PROJECT_ID` — Vercel project ID

**Behavior**
- Pull Requests → **Preview** deployment
- Push to `main`/`master` → **Production** deployment

> If the secrets are not set, CI will skip the deploy steps automatically.


## Vercel env linking
```bash
# one-time: link this repo to a Vercel project
npm run vercel:link

# pull project env vars into .env.local
npm run env:pull

# (assisted) push .env.local vars to Vercel
npm run env:push:prod   # or :preview
```
See `.github/branch-protection.md` for recommended branch protection, and `.github/CODEOWNERS` to set owners.


## Conventional Commits
This repo enforces [Conventional Commits](https://www.conventionalcommits.org/):
Examples: `feat: add admin audit`, `fix: rate limiter edge case`, `docs: update README`.
