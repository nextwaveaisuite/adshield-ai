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
    // Restore your original settings fetch here if you had one.
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

    // Rate limit (keep your original signature if different)
    if (typeof rateLimit === 'function') {
      await rateLimit(req, res);
    }

    if (typeof isBlocked === 'function' && isBlocked(req)) {
      return res.status(429).json({ ok: false, error: 'Blocked' });
    }

    const settings = await getAppSettings(process.env.METRICS_BACKEND);

    // TODO: fetch metrics from your chosen backend.
    // Replace this stub with your real query logic (Supabase or Vercel Postgres).
    const rows = []; // <- keep your real result structure here

    // Audit (non-blocking)
    if (typeof addAudit === 'function') {
      try {
        await addAudit('metrics_fetch', { count: rows.length, backend: settings.backend });
      } catch {
        // ignore audit errors
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
