# AdShield AI — Full Pack (JS) — Packs I + I-1

**Date:** 2025-10-03

This is a clean, consolidated JS project matching your routes **and** including the **Invite Acceptance Flow**.

## What’s included
- Teams & Roles (RBAC) via Supabase
- Invite Flow: `/api/invite` + `/join`
- Admin pages: `/admin`, `/admin/compliance`, `/admin/usage`, `/admin/team`
- Legal/website pages: `/privacy`, `/terms`, `/disclaimer`, `/contact`, `/about`, `/website`
- Core endpoints: `/api/health`, `/api/metrics`
- NextAuth (Credentials demo mode) — swap later for email magic links
- SQL schema under `sql/schema.sql` (safe to re-run)

## Environment Variables (Vercel → Project Settings)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `NEXTAUTH_URL` (e.g., `https://signals.nextwaveaisuite.com`)
- `NEXTAUTH_SECRET` (generate a random string)

## Setup
1. Upload this repo to GitHub (root of repo).
2. In Supabase, open SQL editor and run `sql/schema.sql`.
3. In Vercel, set env vars above; redeploy.
4. Visit `/login` (demo credentials: any email + any password). Make your email admin:
```sql
insert into team_members(email, role)
values ('YOUR_EMAIL@domain.com','admin')
on conflict (email) do update set role='admin';
```

## Invite test
```bash
curl -s -X POST https://<your-host>/api/invite   -H "Content-Type: application/json"   -d '{"email":"teammate@example.com","role":"analyst"}'
# copy joinUrl → open in a browser → login → role applied
```

---

**Note:** This is a minimal, clean baseline. You can drop it in as a full replacement if your current repo is messy.
