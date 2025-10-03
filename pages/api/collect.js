
import { rateLimit } from '../../lib/rate';
import { addAudit } from '../../lib/audit';
import { isBlocked } from '../../lib/abuse';
import { getServerSupabase } from '../../lib/db';
import { requireCredits } from '../../lib/credits';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

const ALLOWED_EVENTS = new Set(['post','click','lead','sale']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  if (!(await rateLimit(req, res, { windowSec: 60, max: 100 }))) return;
  if (isBlocked(req)) return res.status(429).json({ ok: false, error: 'Blocked by abuse guard' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ ok:false, error:'Invalid JSON' }); }
  }
  const { event, payload = {}, meta = {} } = body;

  if (!event || !ALLOWED_EVENTS.has(String(event))) {
    return res.status(400).json({ ok: false, error: 'Invalid event. Use one of post|click|lead|sale' });
  }

  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const quota = await requireCredits({ email, anonId: meta.user_id, cost: 1, action: 'collect' });
  if (!quota.ok) {
    return res.status(402).json({ ok: false, error: 'Out of credits', reason: quota.reason, upgrade: '/pricing' });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ ok: false, error: 'Server misconfigured: missing SUPABASE_URL / SUPABASE_SERVICE_ROLE' });

  const country = meta.country ?? null;
  const state = meta.state ?? null;
  const zip = meta.zip ?? null;
  const offer_type = meta.offer_type ?? null;
  const user_id = meta.user_id ?? null;

  const { error } = await supabase.from('events').insert({
    event, payload, country, state, zip, offer_type, user_id
  });

  if (error) {
    await addAudit('collect_error', { error: error.message });
    return res.status(500).json({ ok: false, error: 'DB insert failed' });
  }

  await addAudit('collect_event', { event, country, state, zip, offer_type });
  return res.status(200).json({ ok: true, accepted: true });
}
