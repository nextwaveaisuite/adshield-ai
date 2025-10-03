/**
 * POST /api/bootstrap  (optional)
 * Creates 'events' table when using Vercel Postgres. Guarded by ADMIN_KEY.
 */
export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    const backend = (process.env.COLLECT_BACKEND || 'supabase').toLowerCase();
    if (backend === 'vercel') {
      const { sql } = await import('@vercel/postgres');
      await sql`create table if not exists events(
        id bigserial primary key,
        event text,
        country text,
        state text,
        zip text,
        offer_type text,
        city text,
        ts bigint not null,
        utm_source text,
        utm_medium text,
        utm_campaign text,
        utm_term text,
        cid text
      )`;
      await sql`create index if not exists idx_events_ts on events(ts)`;
      await sql`create index if not exists idx_events_geo on events(country, state, zip)`;
      await sql`create index if not exists idx_events_offer on events(offer_type)`;
      await sql`create index if not exists idx_events_event on events(event)`;
      return res.status(200).json({ ok:true, created:true });
    } else {
      return res.status(200).json({ ok:true, note:'Use sql/events_supabase.sql in Supabase SQL editor.' });
    }
  } catch (e) {
    console.error('bootstrap error', e);
    return res.status(500).json({ ok:false, error:'bootstrap_failed' });
  }
}