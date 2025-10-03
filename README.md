# AdShield AI — Clean Core + Auth (Merged Feature Pack A)

This is your working clean base + NextAuth integration + protected Admin page.
It compiles on Vercel and preserves your original product purpose, while adding proper auth plumbing.

## What's included
- Next.js 14 (Pages Router)
- NextAuth with Credentials provider (simple demo)
- SessionProvider in `_app.js`
- `/admin` protected with SSR (redirects to `/login` if not authenticated)
- Minimal APIs: `/api/collect`, `/api/metrics`, `/api/health`
- Stubs for `lib/rate`, `lib/audit`, `lib/abuse`

## Environment
Create `.env` from `.env.example`:
- `NEXTAUTH_SECRET` — use any strong secret (generated for you below as a placeholder).
- `NEXTAUTH_URL` — Vercel URL (e.g., https://your-project.vercel.app)

## Deploy Steps
1. Upload these files to your GitHub repo (replace existing).
2. Set env vars in Vercel: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
3. Deploy. Visit `/login` to sign in with the credentials form (demo only).
