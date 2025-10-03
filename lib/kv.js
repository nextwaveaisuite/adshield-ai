
import { Redis } from '@upstash/redis';

let mem = new Map(); // key -> { value, exp }
function now() { return Math.floor(Date.now() / 1000); }
function gc() {
  const t = now();
  for (const [k, v] of mem.entries()) {
    if (v.exp && v.exp <= t) mem.delete(k);
  }
}

export function getKV() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) { return new Redis({ url, token }); }
  return {
    async incr(key) { gc(); const item = mem.get(key) || { value: 0, exp: 0 }; item.value += 1; mem.set(key, item); return item.value; },
    async pttl(key) { gc(); const item = mem.get(key); if (!item || !item.exp) return -2; const ms = (item.exp - now())*1000; return ms>0?ms:-2; },
    async expire(key, seconds) { gc(); const item = mem.get(key) || { value: 0, exp: 0 }; item.exp = now() + seconds; mem.set(key, item); return 1; },
  };
}
