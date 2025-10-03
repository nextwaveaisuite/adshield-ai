/**
 * GET /api/health
 * Verifies DB connectivity (based on METRICS_BACKEND) + loads settings row count.
 * Returns { ok, backend, db_ok, settings_ok }
 */
export default async function handler(req, res){
  const backend = (process.env.METRICS_BACKEND||'supabase').toLowerCase();
  try{
    let db_ok=false, settings_ok=false;
    if (backend === 'supabase'){
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { data: rows, error } = await supabase.from('events').select('id').limit(1);
      if (!error) db_ok = true;
      const { data: s } = await supabase.from('app_settings').select('id').limit(1);
      settings_ok = Array.isArray(s);
    } else {
      const { sql } = await import('@vercel/postgres');
      const r = await sql`select 1`;
      db_ok = !!r;
      try{ const s = await sql`select count(*) from app_settings`; settings_ok = true; }catch(e){ settings_ok=false; }
    }
    return res.json({ ok:true, backend, db_ok, settings_ok });
  }catch(e){
    return res.status(500).json({ ok:false, backend, error:'health_failed' });
  }
}