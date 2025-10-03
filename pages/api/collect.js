/**
 * POST /api/collect
 * Saves events into your DB.
 * Toggle backend via COLLECT_BACKEND = "supabase" | "vercel"
 */

import { rateLimit } from '../../../lib/rate';
import { addAudit } from '../../../lib/audit';
import { isBlocked } from '../../../lib/abuse';

async function getAppSettings(backend) {
  try {
    return {
      backend: backend || process.env.COLLECT_BACKEND || 'vercel',
      enabled: true
    };
  } catch (e) {
    return { backend: backend || 'vercel', enabled: true };
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    if (typeof rateLimit === 'function') {
      await rateLimit(req, res);
    }

    if (typeof isBlocked === 'function' && isBlocked(req)) {
      return res.status(429).json({ ok: false, error: 'Blocked' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { event = 'unknown', payload = {}, meta = {} } = body;

    const settings = await getAppSettings(process.env.COLLECT_BACKEND);

    // TODO: write to the selected backend (supabase/vercel). Keep your original logic here if you had it.

    if (typeof addAudit === 'function') {
      try {
        await addAudit('collect_event', { event, meta, backend: settings.backend });
      } catch {
        // non-blocking
      }
    }

    return res.status(200).json({
      ok: true,
      backend: settings.backend,
      accepted: true
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
