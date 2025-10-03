# AdShield AI — Feature Pack C (Admin Dashboard UI)

This pack builds on Pack B (DB + Metrics) and adds a **visual dashboard** to `/admin`:
- Chart of posts/clicks/leads/sales by region bucket
- Sortable table of aggregated metrics
- Client-side fetch from `/api/metrics`

## Deploy
1) Upload these files to GitHub (replace existing contents).
2) Commit to `main` → Vercel will deploy.
3) Visit `/login` → sign in (demo credentials) → go to `/admin` to see charts & table.

## Notes
- Uses `react-chartjs-2` + `chart.js` with dynamic import to avoid SSR issues.
- Admin remains protected via NextAuth SSR redirect.
