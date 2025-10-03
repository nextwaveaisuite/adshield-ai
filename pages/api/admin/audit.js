import { requireRole } from '../../../lib/auth';
export default async function handler(req, res){
  if (req.method !== 'GET') return res.status(405).end();
  try{ requireRole(req, ['admin','analyst']); }catch(e){ return res.status(e.code||403).json({ok:false,error:'forbidden'});}
  const backend = (process.env.METRICS_BACKEND||'supabase').toLowerCase();
  try{
    if (backend === 'supabase'){
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { data } = await supabase.from('audit_logs').select('*').order('ts', { ascending:false }).limit(100);
      return res.json({ ok:true, logs:data||[] });
    } else {
      const { sql } = await import('@vercel/postgres');
      const { rows } = await sql`select * from audit_logs order by ts desc limit 100`;
      return res.json({ ok:true, logs:rows||[] });
    }
  }catch(e){
    console.error('audit fetch error', e);
    return res.status(500).json({ ok:false, error:'audit_fetch_failed' });
  }
}