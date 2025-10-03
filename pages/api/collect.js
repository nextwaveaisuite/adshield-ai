/**
 * POST /api/collect
 * Saves events into your DB.
 * Toggle backend via COLLECT_BACKEND = "supabase" | "vercel"
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
  if (req.method !== 'POST') return res.status(405).end();
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
  const rl = await rateLimit({ key:'collect:'+ip, windowMs: +(process.env.RATE_LIMIT_WINDOW_MS||60000), max: +(process.env.RATE_LIMIT_MAX||120) });
  const settings = await getAppSettings((process.env.COLLECT_BACKEND||'supabase').toLowerCase());
  if(isBlocked({ ip, key: req.headers['x-api-key'], settings })) return res.status(403).json({ error:'blocked' });
  if(!rl.allowed) return res.status(429).json({ error:'rate_limited', reset: rl.reset });
  if (process.env.COLLECT_KEY && req.headers['x-api-key'] !== process.env.COLLECT_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    const { event, country, state, zip, offer_type, city,
            utm_source, utm_medium, utm_campaign, utm_term, cid, ts } = req.body || {};
    const row = { event, country, state, zip, offer_type, city,
                  utm_source, utm_medium, utm_campaign, utm_term, cid,
                  ts: ts || Date.now() };
    const backend = (process.env.COLLECT_BACKEND || 'supabase').toLowerCase();
    if (backend === 'supabase') {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { error } = await supabase.from('events').insert(row);
      if (error) throw error;
    } else if (backend === 'vercel') {
      const { sql } = await import('@vercel/postgres');
      await sql`
        insert into events(event, country, state, zip, offer_type, city, ts, utm_source, utm_medium, utm_campaign, utm_term, cid)
        values (${row.event}, ${row.country}, ${row.state}, ${row.zip}, ${row.offer_type}, ${row.city},
                ${row.ts}, ${row.utm_source}, ${row.utm_medium}, ${row.utm_campaign}, ${row.utm_term}, ${row.cid})
      `;
    }
    await addAudit({ backend: (process.env.COLLECT_BACKEND||'supabase').toLowerCase(), ip, action:'collect', meta: row });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('collect error', e);
    return res.status(500).json({ ok: false, error: 'collect_failed' });
  }
}