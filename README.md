# AdShield AI — FULL MIRROR (JS) with Invite Flow
**Built:** 2025-10-03T08:20:17

This zip mirrors your structure exactly and bakes in:
- Teams & Roles (RBAC)
- Invite creation: `POST /api/invite`
- Invite acceptance: `/join?token=...` (new page)
- Admin pages: `/admin`, `/admin/compliance`, `/admin/usage`, `/admin/team`
- Legal & website pages

## Environment Variables (Vercel → Project Settings)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `NEXTAUTH_URL` (e.g., `https://your-domain`)
- `NEXTAUTH_SECRET` (random string)

## Setup
1. Upload to GitHub (repo root).
2. Run SQL in `sql/schema.sql` on Supabase.
3. Add env vars above and deploy.
4. Make yourself admin:
```sql
insert into team_members(email, role)
values ('YOUR_EMAIL@domain.com','admin')
on conflict (email) do update set role='admin';
```

## Test
- Create invite:
```bash
curl -s -X POST https://<host>/api/invite   -H "Content-Type: application/json"   -d '{"email":"teammate@example.com","role":"analyst"}'
```
- Open `joinUrl` → login → user role applied.
