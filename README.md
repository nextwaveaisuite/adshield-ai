# AdShield AI — CLEAN WORKING (JS)

Built: 2025-10-03T08:35:43

This is a clean, working Next.js (JS) project with:
- Login (`/login`) via NextAuth (Credentials demo)
- Admin routes: `/admin`, `/admin/compliance`, `/admin/usage`, `/admin/team`
- Teams & Roles (RBAC) using Supabase
- Invite flow: `POST /api/invite` + `/join?token=...`
- Website & policy pages
- Health & metrics endpoints

## 1) Environment Variables (Vercel → Project Settings)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `NEXTAUTH_URL` (e.g., `https://your-domain`)
- `NEXTAUTH_SECRET` (random string, e.g., `69a0c13e151db3da0c3091d223d0c6ac21808ecd3d981295`)

## 2) Database (Supabase → SQL editor)
Run `sql/schema.sql` included in this repo.

Then make yourself admin:
```sql
insert into team_members(email, role)
values ('YOUR_EMAIL@domain.com','admin')
on conflict (email) do update set role='admin';
```

## 3) Deploy
- Push repo to GitHub
- Connect to Vercel
- Deploy

## 4) Test
- Visit `/login` → sign in (any credentials accepted in demo)
- `/admin` should load (role shows in header)
- `/admin/team` → create invite → open `joinUrl` in a new browser → login → role applied
- `/privacy`, `/terms`, `/disclaimer`, `/contact`, `/about`, `/website` all live
