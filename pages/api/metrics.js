
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

  // Aggregate counts by dimensions
  const sql = `
    select
      coalesce(country, 'NA') as country,
      coalesce(state, 'NA') as state,
      coalesce(zip, 'NA') as zip,
      coalesce(offer_type, 'NA') as offer_type,
      sum(case when event = 'post' then 1 else 0 end) as posts,
      sum(case when event = 'click' then 1 else 0 end) as clicks,
      sum(case when event = 'lead' then 1 else 0 end) as leads,
      sum(case when event = 'sale' then 1 else 0 end) as sales
    from events
    group by 1,2,3,4
    order by 1,2,3,4
    limit 1000;
  `;

  // Use PostgREST RPC via SQL if enabled, or fall back to JS filter if not.
  // Here we call Supabase SQL with a dedicated endpoint (requires pg_net or postgrest rpc).
  // Simpler: perform client-side aggregation with filters; but to keep it efficient, we create a view in schema.sql.
  // We'll just select from a view if it exists; otherwise fallback to raw aggregation above.

  // Try querying a view first
  let { data, error } = await supabase.from('metrics_view').select('*').limit(1000);
  if (error && error.code === 'PGRST116') {
    // view not found; run a raw query by selecting from events and aggregating client-side (slower for big data)
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
