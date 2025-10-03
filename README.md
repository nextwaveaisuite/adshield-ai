# AdShield AI — Feature Pack D (Compliance Engine)

This pack adds a **compliance validator** for ad copy.
- `/api/validate-ad` — server endpoint that checks content against rules
- `/admin/compliance` — UI to paste ad text, validate, and see issues/suggestions
- Integrates alongside existing Admin dashboard & Supabase metrics

## Deploy
1) Upload these files to GitHub (replace existing contents).
2) Commit to `main` → Vercel deploys.
3) Go to `/login` → `/admin/compliance`, paste ad text, and click **Validate**.

## Notes
- The validator is heuristic-based and easily extendable.
- No external dependencies added; fully server-side.
