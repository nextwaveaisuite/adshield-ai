/**
 * GET /api/metrics
 * Returns rows like: { country, state, zip, offer_type, posts, clicks, leads, sales, weekday?, hour? }
 * Toggle backend via METRICS_BACKEND = "supabase" | "vercel"
 */

import { rateLimit } from '../../../lib/rate';
import { addAudit } from '../../../lib/audit';
import { isBlocked } from '../../../lib/abuse';

async function getAppSettings(backend) {
  try {
    return {
      backend: backend || process.env.METRICS_BACKEND || 'vercel',
      enabled: true
    };
  } catch (e) {
    return { backend: backend || 'vercel', enabled: true };
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    if (typeof rateLimit === 'function') {
      await rateLimit(req, res);
    }

    if (typeof isBlocked === 'function' && isBlocked(req)) {
      return res.status(429).json({ ok: false, error: 'Blocked' });
    }

    const settings = await getAppSettings(process.env.METRICS_BACKEND);

    // TODO: fetch metrics from your chosen backend. Replace [] with your real query results.
    const rows = [];

    if (typeof addAudit === 'function') {
      try {
        await addAudit('metrics_fetch', { count: rows.length, backend: settings.backend });
      } catch {
        // non-blocking
      }
    }

    return res.status(200).json({
      ok: true,
      backend: settings.backend,
      rows
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
