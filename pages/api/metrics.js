// pages/api/metrics.js
import { getSupabaseAdminOrNull } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const supabase = getSupabaseAdminOrNull();
  const { country = '', state = '', offer = '', sort = 'recent' } = req.query;

  if (!supabase) {
    return res.status(200).json({ rows: [] });
  }

  let query = supabase.from('events').select('event, meta->>country, meta->>state, meta->>offer');
  if (country) query = query.eq('meta->>country', country);
  if (state) query = query.eq('meta->>state', state);
  if (offer) query = query.eq('meta->>offer', offer);

  const { data, error } = await query.limit(5000);
  if (error) return res.status(400).json({ error: error.message });

  const map = new Map();
  for (const row of data || []) {
    const c = row['meta->>country'] || '';
    const s = row['meta->>state'] || '';
    const o = row['meta->>offer'] || '';
    const key = `${c}|${s}|${o}`;
    if (!map.has(key)) map.set(key, { country: c, state: s, offer: o, posts: 0, clicks: 0, leads: 0, sales: 0 });
    const obj = map.get(key);
    if (row.event === 'post') obj.posts++;
    else if (row.event === 'click') obj.clicks++;
    else if (row.event === 'lead') obj.leads++;
    else if (row.event === 'sale') obj.sales++;
  }

  let rows = [...map.values()];
  const sorters = { recent:(a,b)=>0, posts:(a,b)=>b.posts-a.posts, clicks:(a,b)=>b.clicks-a.clicks, leads:(a,b)=>b.leads-a.leads, sales:(a,b)=>b.sales-a.sales };
  rows.sort(sorters[sort] || sorters.recent);
  return res.status(200).json({ rows });
}
