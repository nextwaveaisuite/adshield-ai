# AdShield AI — Feature Pack E (Abuse Detection + Rate Limiting)

This pack replaces the stubbed protection with real guardrails:
- **Rate limiting** (token bucket) per IP+route with in-memory fallback and optional Upstash Redis.
- **Abuse scoring** (IP/UA/frequency heuristics) with threshold-based blocking.
- Works on Vercel Serverless; enables durable limits if you set Upstash env vars.

## Env Vars (optional for durable limits)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

If these are omitted, the limiter uses an **in-memory TTL store** (good enough for small scale / single region).

## Deploy
1) Upload this pack to GitHub (replace existing files).
2) (Optional) Add Upstash env vars in Vercel for durable/global limits.
3) Deploy and test:
   - `curl -X POST /api/collect` repeatedly to see 429 after the limit.
   - Send requests without a User-Agent to increase the abuse score.

## Notes
- No changes needed to client. APIs import the enhanced `lib/rate` and `lib/abuse` automatically.
- You can tune thresholds in `lib/abuse.js` and limiter settings in `lib/rate.js`.
