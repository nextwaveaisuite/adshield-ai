// Rate limiter with Upstash Redis fallback to in-memory.
let redis = null;
async function getRedis(){
  if (redis) return redis;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN){
    const { Redis } = await import('@upstash/redis');
    redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  }
  return redis;
}

const buckets = new Map();

export async function rateLimit({ key, windowMs=60000, max=120 }){
  const r = await getRedis();
  if (r){
    const nowKey = `rl:${key}`;
    const cur = await r.incr(nowKey);
    if (cur === 1){ await r.pexpire(nowKey, windowMs); }
    const ttl = await r.pttl(nowKey);
    return { allowed: cur <= max, remaining: Math.max(0, max - cur), reset: Date.now() + Math.max(0, ttl) };
  }
  // In-memory fallback (single instance only)
  const now = Date.now();
  const b = buckets.get(key) || { reset: now + windowMs, count: 0 };
  if (now > b.reset){ b.reset = now + windowMs; b.count = 0; }
  b.count += 1;
  buckets.set(key, b);
  return { allowed: b.count <= max, remaining: Math.max(0, max - b.count), reset: b.reset };
}