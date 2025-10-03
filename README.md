# AdShield AI — Fully Loaded (JS)
Built: 2025-10-03T08:47:36

Includes:
- RBAC (team_members) + invites
- Invite creation `/api/invite` and acceptance `/join?token=...`
- Admin routes: /admin, /admin/compliance, /admin/usage, /admin/team
- Website & policy pages
- Health & metrics endpoints

## Env vars (Vercel → Project Settings)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE
- NEXTAUTH_URL
- NEXTAUTH_SECRET (e.g., 1bad0cbab082716713a12fe8082774c1d8a1d911020d2d5c)

## DB (Supabase → SQL)
Run sql/schema.sql, then make yourself admin:
```sql
insert into team_members(email, role)
values ('YOUR_EMAIL@domain.com','admin')
on conflict (email) do update set role='admin';
```

