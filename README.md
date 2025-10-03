# AdShield AI — Clean Full Source (Pages Router)

This is a **clean, compiling Next.js 14** project ready for Vercel.

- No duplicate imports
- Minimal API routes (`/api/health`, `/api/collect`, `/api/metrics`)
- Safe `/admin` page **without** next-auth (build will not prerender-fail)
- Node 20

## Quick Deploy (GitHub → Vercel)
1. Delete existing files in your repo (keep the repo).
2. Upload the **contents** of this folder (preserve structure).
3. Commit to `main`.
4. In Vercel: Project Settings → **Node.js Version: `20.x`**.
5. Deploy. Confirm the commit hash matches your latest.

## Notes
- `/admin` is implemented without next-auth and guarded via **SSR** (no prerender issues).
- When you're ready to add auth, we can integrate NextAuth later.