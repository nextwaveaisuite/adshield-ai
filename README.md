# AdShield AI — Feature Pack F (Billing & Plans – Stripe)

This pack adds **paid plans** with Stripe Checkout and server-side gating.

## What’s included
- `/pricing` page with plan cards (Free, Pro, Enterprise)
- `POST /api/stripe/create-checkout-session` to start checkout
- `POST /api/stripe/webhook` to receive Stripe events
- `lib/billing.js` helpers to read/write plan state in Supabase
- Gating example on `/admin` and `/admin/compliance` (require at least Free; Pro-only areas are easy to extend)

## Environment Variables (Vercel → Settings → Environment Variables)
- `STRIPE_SECRET_KEY` (required)
- `STRIPE_WEBHOOK_SECRET` (required for webhooks)
- `STRIPE_PRICE_PRO_MONTH` (Stripe Price ID for Pro monthly)
- `STRIPE_PRICE_PRO_YEAR` (optional, Stripe Price ID for Pro yearly)
- `NEXTAUTH_URL` (existing)
- `NEXTAUTH_SECRET` (existing)
- `SUPABASE_URL` (existing)
- `SUPABASE_SERVICE_ROLE` (existing)

> Tip: In Stripe, create a **Product** (e.g. “AdShield AI Pro”) with one or more **Prices**. Copy the price IDs into the env vars above.

## Database
We store subscription status in a Supabase table:
```sql
create table if not exists public.subscriptions (
  id bigserial primary key,
  email text not null,
  plan text not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);
create index if not exists subs_email_idx on public.subscriptions (email);
```
The schema is included at `sql/schema.sql` (safe to run multiple times).

## Deploy
1) Set env vars (Stripe + existing ones).
2) In Supabase SQL Editor, run `sql/schema.sql`.
3) Upload this pack (replace repo) → commit to `main` → Vercel deploys.
4) In Stripe Dashboard → Developers → Webhooks, add an endpoint pointing to:
   `https://YOUR_APP.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - Paste the signing secret into `STRIPE_WEBHOOK_SECRET`.
5) Open `/pricing` and purchase Pro to test. Then visit `/admin` to see gating.
