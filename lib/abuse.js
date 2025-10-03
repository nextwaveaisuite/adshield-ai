
const THRESHOLD = 40;
export function abuseScore(req) {
  const ua = String(req.headers['user-agent'] || '');
  const route = (req.url || '').split('?')[0] || '/';
  let score = 0;
  if (!ua || ua.trim().length === 0) score += 30;
  if (/python-requests|curl|wget|bot|scraper|postman|insomnia/i.test(ua)) score += 20;
  if (/\/api\//.test(route)) score += 10;
  try { const q = new URL(req.url, 'https://x').searchParams; if ([...q.keys()].length >= 10) score += 10; } catch {}
  const cl = Number(req.headers['content-length'] || 0); if (cl > 200 * 1024) score += 30;
  return score;
}
export function isBlocked(req) { return abuseScore(req) >= THRESHOLD; }
