/**
 * GET /api/metrics
 * Returns rows: { country, state, zip, offer_type, posts, clicks, leads, sales, weekday?, hour? }
 */
import { rateLimit } from '../../../lib/rate';
import { addAudit } from '../../../lib/audit';
import { isBlocked } from '../../../lib/abuse';

import { rateLimit } from '../../../lib/rate';
import { addAudit } from '../../../lib/audit';
import { isBlocked } from '../../../lib/abuse';

async function getAppSettings(backend){
  try{
    if (backend === 'supabase'){
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { data } = await supabase.from('app_settings').select('v').eq('k','app').maybeSingle();
      return data?.v||{};
    } else {
      const { sql } = await import('@vercel/postgres');
      const { rows } = await sql`select v from app_settings where k='app' limit 1`;
      return (rows[0]?.v)||{};
    }
  }catch(e){ return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
  const rl = await rateLimit({ key:'metrics:'+ip, windowMs: +(process.env.RATE_LIMIT_WINDOW_MS||60000), max: +(process.env.RATE_LIMIT_MAX||120) });
  const settings = await getAppSettings((process.env.METRICS_BACKEND||'supabase').toLowerCase());
  if(isBlocked({ ip, key: req.headers['x-api-key'], settings })) return res.status(403).json({ error:'blocked' });
  if(!rl.allowed) return res.status(429).json({ error:'rate_limited', reset: rl.reset });
  if (process.env.METRICS_KEY && req.headers['x-api-key'] !== process.env.METRICS_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    const backend = (process.env.METRICS_BACKEND || 'supabase').toLowerCase();
    let events = [];
    const sinceTs = Date.now() - 1000*60*60*24*30;
    if (backend === 'supabase') {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { data, error } = await supabase.from('events').select('country,state,zip,offer_type,event,ts').gte('ts', sinceTs);
      if (error) throw error; events = data || [];
    } else if (backend === 'vercel') {
      const { sql } = await import('@vercel/postgres');
      const { rows } = await sql`SELECT country,state,zip,offer_type,event,ts FROM events WHERE ts > ${sinceTs}`;
      events = rows || [];
    }
    return res.json(aggregateRows(events));
  } catch (e) {
    console.error('metrics error', e);
    return res.json([]);
  }
}
function aggregateRows(ev){
  const map = new Map();
  for (const r of ev){
    const k = [r.country||'', r.state||'', r.zip||'', r.offer_type||''].join('|');
    const cur = map.get(k) || { country:r.country||'', state:r.state||'', zip:r.zip||'', offer_type:r.offer_type||'', posts:0, clicks:0, leads:0, sales:0, weekday:undefined, hour:undefined };
    if (r.event==='click') cur.clicks++;
    if (r.event==='lead')  cur.leads++;
    if (r.event==='sale')  cur.sales++;
    const d = r.ts ? new Date(Number(r.ts)) : null;
    if (d) { cur.weekday = d.getUTCDay(); cur.hour = d.getUTCHours(); }
    map.set(k, cur);
  }
  return Array.from(map.values());
}