
import { rateLimit } from '../../lib/rate';
import { addAudit } from '../../lib/audit';
import { isBlocked } from '../../lib/abuse';
import { getServerSupabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  await rateLimit(req, res);
  if (isBlocked(req)) return res.status(429).json({ ok: false, error: 'Blocked' });

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ ok: false, error: 'Server misconfigured: missing SUPABASE_URL / SUPABASE_SERVICE_ROLE' });

  // Prefer metrics_view if present
  let { data, error } = await supabase.from('metrics_view').select('*').limit(1000);
  if (error && error.code === 'PGRST116') {
    const { data: evts, error: e2 } = await supabase.from('events').select('event,country,state,zip,offer_type').limit(5000);
    if (e2) return res.status(500).json({ ok: false, error: 'DB query failed' });

    const key = (r) => [r.country||'NA', r.state||'NA', r.zip||'NA', r.offer_type||'NA'].join('|');
    const map = new Map();
    for (const r of evts) {
      const k = key(r);
      if (!map.has(k)) map.set(k, { country:r.country||'NA', state:r.state||'NA', zip:r.zip||'NA', offer_type:r.offer_type||'NA', posts:0, clicks:0, leads:0, sales:0 });
      const row = map.get(k);
      if (r.event === 'post') row.posts++;
      else if (r.event === 'click') row.clicks++;
      else if (r.event === 'lead') row.leads++;
      else if (r.event === 'sale') row.sales++;
    }
    data = Array.from(map.values());
  }

  await addAudit('metrics_fetch', { count: data?.length || 0 });
  return res.status(200).json({ ok: true, rows: data || [] });
}
