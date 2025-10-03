import { requireRole } from '../../../lib/auth';
function requireAdmin(req){
  requireRole(req, ['admin']); return true;
  if(!token) throw Object.assign(new Error('unauthorized'), { code:401 });
}

async function getKV(backend, key){
  if (backend === 'supabase'){
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { data } = await supabase.from('app_settings').select('*').eq('k', key).maybeSingle();
    return data?.v || {};
  } else if (backend === 'vercel'){
    const { sql } = await import('@vercel/postgres');
    const { rows } = await sql`select v from app_settings where k=${key} limit 1`;
    return (rows[0]?.v)||{};
  }
  return {};
}

async function setKV(backend, key, val){
  if (backend === 'supabase'){
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    await supabase.from('app_settings').upsert({ k:key, v: val });
  } else if (backend === 'vercel'){
    const { sql } = await import('@vercel/postgres');
    await sql`insert into app_settings(k, v) values(${key}, ${JSON.stringify(val)}) on conflict (k) do update set v=excluded.v`;
  }
}

export default async function handler(req, res){
  try{
    requireAdmin(req);
    const backend = (process.env.METRICS_BACKEND||'supabase').toLowerCase();
    if (req.method === 'GET'){
      const settings = await getKV(backend, 'app');
      return res.json({ ok:true, settings });
    } else if (req.method === 'POST'){
      const settings = req.body?.settings || {};
      await setKV(backend, 'app', settings);
      return res.json({ ok:true });
    } else {
      return res.status(405).end();
    }
  }catch(e){
    return res.status(e.code||500).json({ ok:false, error: e.message||'error' });
  }
}