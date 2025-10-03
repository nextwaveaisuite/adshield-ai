/**
 * POST /api/collect — Saves events (stubbed).
 */
import { rateLimit } from '../../lib/rate';
import { addAudit } from '../../lib/audit';
import { isBlocked } from '../../lib/abuse';

async function getAppSettings(backend) {
  return { backend: backend || process.env.COLLECT_BACKEND || 'vercel', enabled: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  await rateLimit(req, res);
  if (isBlocked(req)) return res.status(429).json({ ok: false, error: 'Blocked' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { event = 'unknown', payload = {}, meta = {} } = body;

  const settings = await getAppSettings(process.env.COLLECT_BACKEND);

  await addAudit('collect_event', { event, meta, backend: settings.backend });

  return res.status(200).json({ ok: true, backend: settings.backend, accepted: true });
}
