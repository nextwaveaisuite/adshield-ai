
import { getKV } from './kv';

const DEFAULTS = {
  windowSec: 60,
  max: 60,      // 60 requests / 60s
  refillRate: 60 // tokens per window
};

/**
 * Token bucket limiter. Keyed by ip+route.
 * If Upstash is configured, limits are durable across regions.
 */
export async function rateLimit(req, res, opts = {}) {
  const { windowSec, max } = { ...DEFAULTS, ...opts };
  const kv = getKV();

  const ip = getIp(req) || '0.0.0.0';
  const route = (req.url || '').split('?')[0] || 'unknown';
  const key = `rl:${route}:${ip}`;

  try {
    // In-memory: simple counter in window
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      const count = (await kv.incr(key)) || 0;
      let ttl = await kv.pttl(key);
      if (ttl < 0) { // first hit
        await kv.expire(key, windowSec);
        ttl = windowSec * 1000;
      }
      const remaining = Math.max(0, max - count);
      setHeaders(res, remaining, Math.ceil(ttl/1000));
      if (count > max) {
        res.status(429).json({ ok:false, error:'Too Many Requests' });
        return false;
      }
      return true;
    }

    // Durable path (Upstash): use atomic INCR + TTL
    const count = await kv.incr(key);
    const ttlMs = await kv.pttl(key);
    if (ttlMs < 0) { await kv.expire(key, windowSec); }
    const ttl = Math.ceil((await kv.pttl(key)) / 1000);
    const remaining = Math.max(0, max - count);
    setHeaders(res, remaining, ttl);
    if (count > max) {
      res.status(429).json({ ok:false, error:'Too Many Requests' });
      return false;
    }
    return true;
  } catch (e) {
    // Fails open to avoid taking down the API
    return true;
  }
}

function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    null
  );
}

function setHeaders(res, remaining, resetSec) {
  try {
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(resetSec));
  } catch {}
}
