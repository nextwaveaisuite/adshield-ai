# AdShield AI — Feature Pack B (Database + Metrics Engine, Supabase)

This pack builds on the clean core + auth and adds **real data storage**:
- `/api/collect` writes events into Supabase
- `/api/metrics` returns aggregated metrics

## One-time setup
1) Create a Supabase project.
2) In Supabase SQL Editor, run `sql/schema.sql` (from this repo) to create the `events` table and indexes.
3) In Vercel → Project → Environment Variables, set:
   - `SUPABASE_URL` — from Supabase settings
   - `SUPABASE_SERVICE_ROLE` — **Service Role key** (server-only; never exposed to client)
   - `NEXTAUTH_SECRET` — keep your existing value (from Feature Pack A)
   - `NEXTAUTH_URL` — optional; Vercel sets automatically

## Deploy
1) Upload these files to GitHub (replace existing contents).
2) Commit to `main` → Vercel will deploy.
3) Test:
   - POST `/api/collect` with a JSON body (see examples below)
   - GET `/api/metrics` to see grouped aggregates

## POST /api/collect sample payloads
```bash
curl -X POST https://YOUR-APP.vercel.app/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "event": "post",
    "payload": { "title": "Sofa - great condition" },
    "meta": {
      "country": "US", "state": "CA", "zip": "94107",
      "offer_type": "furniture", "user_id": "u_123"
    }
  }'
```

```bash
curl -X POST https://YOUR-APP.vercel.app/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "event": "click",
    "payload": { "ad_id": "ad_42" },
    "meta": {
      "country": "US", "state": "CA", "zip": "94107",
      "offer_type": "furniture", "user_id": "u_123"
    }
  }'
```

## GET /api/metrics
```bash
curl https://YOUR-APP.vercel.app/api/metrics
```
Returns rows like:
```json
[
  {
    "country": "US",
    "state": "CA",
    "zip": "94107",
    "offer_type": "furniture",
    "posts": 12,
    "clicks": 35,
    "leads": 7,
    "sales": 2
  }
]
```

## Notes
- Server code uses the **Service Role** key only on the server; no client usage.
- If env vars are missing, endpoints fail gracefully with `500` and a helpful message.
- You can extend the schema with additional dimensions (weekday/hour/device/ip) later.
