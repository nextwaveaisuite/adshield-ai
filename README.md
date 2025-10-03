# AdShield AI — Feature Pack G (Credits & Quotas)

This pack adds **per-plan credits** with server-side enforcement and usage logging.

## What’s included
- Credits per plan (defaults): free=200/mo, pro=5000/mo, enterprise=unlimited
- Auto-provision credits when a user first appears or plan changes
- Server-side enforcement in APIs (`/api/collect` and `/api/validate-ad` cost 1 credit)
- Admin shows remaining credits; upsell when low/out
- Usage logs table for visibility

## Environment (same as Pack F + earlier)
- Stripe keys (if using Billing): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_*`
- Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`
- NextAuth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Optional limits: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## Database (Supabase → SQL Editor)
Run the included schema:
```
-- see sql/schema.sql in this repo
```

## Behavior
- On API calls, we look up the caller’s email (if authenticated) or `meta.user_id` (anonymous fallback) and decrement credits.
- If out of credits, request fails with 402-like response and a link to `/pricing`.
- Webhook upgrade to Pro auto-bumps allowance on next usage.

## Deploy
1) Run `sql/schema.sql` in Supabase.
2) Upload this pack (replace repo) → commit → Vercel deploys.
3) If using Stripe, set env vars and webhook (same as Pack F).
