export async function addAudit({ backend, ip, action, meta }){
  const ts = Date.now();
  if (backend === 'supabase') {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    await supabase.from('audit_logs').insert({ ts, ip, action, meta });
  } else if (backend === 'vercel') {
    const { sql } = await import('@vercel/postgres');
    await sql`insert into audit_logs(ts, ip, action, meta) values (${ts}, ${ip}, ${action}, ${JSON.stringify(meta||{})})`;
  } else {
    console.log('[audit]', ts, ip, action, meta);
  }
}