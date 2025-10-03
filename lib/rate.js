
import { getKV } from './kv';

export async function rateLimit(req, res, { windowSec = 60, max = 60 } = {}) {
  const kv = getKV();
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || '0.0.0.0';
  const route = (req.url || '').split('?')[0] || 'unknown';
  const key = `rl:${route}:${ip}`;
  try {
    const count = await kv.incr(key);
    let ttl = await kv.pttl(key);
    if (ttl < 0) { await kv.expire(key, windowSec); ttl = windowSec*1000; }
    const remaining = Math.max(0, max - count);
    try {
      res.setHeader('X-RateLimit-Remaining', String(remaining));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(ttl/1000)));
    } catch {}
    if (count > max) { res.status(429).json({ ok:false, error:'Too Many Requests' }); return false; }
    return true;
  } catch { return true; }
}
