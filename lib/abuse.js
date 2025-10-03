
/**
 * Basic abuse scoring with configurable thresholds.
 * Factors:
 *  - Missing/empty User-Agent (+30)
 *  - Non-browser UA patterns (+20)
 *  - Suspicious path hammering (same route bursts) (+10)
 *  - Query parameters flood (>=10 params) (+10)
 *  - JSON parse errors (+10) — to be applied by caller if needed
 *  - Very large bodies (>200kb) (+30)
 *
 * Block when score >= THRESHOLD.
 */
const THRESHOLD = 40;

export function getClientInfo(req) {
  const ip = getIp(req);
  const ua = String(req.headers['user-agent'] || '');
  const route = (req.url || '').split('?')[0] || '/';
  return { ip, ua, route };
}

export function abuseScore(req) {
  const { ua, route } = getClientInfo(req);
  let score = 0;

  if (!ua || ua.trim().length === 0) score += 30;
  if (/python-requests|curl|wget|bot|scraper|postman|insomnia/i.test(ua)) score += 20;

  // route hammering signal (very naive; combine with rateLimit for real guard)
  if (/\/api\//.test(route)) score += 10;

  // query param flood
  try {
    const q = new URL(req.url, 'https://x').searchParams;
    if ([...q.keys()].length >= 10) score += 10;
  } catch {}

  const cl = Number(req.headers['content-length'] || 0);
  if (cl > 200 * 1024) score += 30;

  return score;
}

export function isBlocked(req) {
  return abuseScore(req) >= THRESHOLD;
}

function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    null
  );
}
