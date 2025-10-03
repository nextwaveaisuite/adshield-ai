/**
 * GET /api/metrics — Returns stubbed rows.
 */
import { rateLimit } from '../../lib/rate';
import { addAudit } from '../../lib/audit';
import { isBlocked } from '../../lib/abuse';

async function getAppSettings(backend) {
  return { backend: backend || process.env.METRICS_BACKEND || 'vercel', enabled: true };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  await rateLimit(req, res);
  if (isBlocked(req)) return res.status(429).json({ ok: false, error: 'Blocked' });

  const settings = await getAppSettings(process.env.METRICS_BACKEND);
  const rows = [];

  await addAudit('metrics_fetch', { count: rows.length, backend: settings.backend });

  return res.status(200).json({ ok: true, backend: settings.backend, rows });
}