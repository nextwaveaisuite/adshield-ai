
import { getServerSession } from 'next-auth/next'; import { authOptions } from '../../lib/auth';
import { getServerSupabase } from '../../lib/db'; import Link from 'next/link';

export default function Usage({ rows, quotas }){
  return (<main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:1080, margin:'0 auto'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
      <h1>Usage Logs</h1>
      <nav style={{display:'flex',gap:16}}><Link href="/admin">Dashboard</Link><Link href="/admin/compliance">Compliance</Link></nav>
    </header>
    <section style={{margin:'12px 0'}}>
      <h3>Credits</h3>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>ID</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Plan</th><th style={{textAlign:'right',padding:8,borderBottom:'1px solid #eee'}}>Remaining</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Month</th></tr></thead>
          <tbody>{quotas.map((q,i)=>(<tr key={i}><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{q.id}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{q.plan}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5',textAlign:'right'}}>{q.credits_remaining}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{q.month_key}</td></tr>))}</tbody>
        </table>
      </div>
    </section>
    <section style={{margin:'12px 0'}}>
      <h3>Usage Logs (latest 200)</h3>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>ID</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Action</th><th style={{textAlign:'right',padding:8,borderBottom:'1px solid #eee'}}>Cost</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Allowed</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Month</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Time</th></tr></thead>
          <tbody>{rows.map((r,i)=>(<tr key={i}><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.id}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.action}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5',textAlign:'right'}}>{r.cost}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.allowed ? 'yes' : 'no'}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.month_key}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{new Date(r.created_at).toLocaleString()}</td></tr>))}</tbody>
        </table>
      </div>
    </section>
  </main>);
}

export async function getServerSideProps(context){
  const session=await getServerSession(context.req, context.res, authOptions); if(!session) return { redirect:{ destination:'/login', permanent:false }};
  const supabase=getServerSupabase(); if(!supabase) return { props:{ rows:[], quotas:[] } };
  const { data: rows } = await supabase.from('usage_logs').select('*').order('created_at',{ascending:false}).limit(200);
  const { data: quotas } = await supabase.from('users_quota').select('*').order('last_updated',{ascending:false}).limit(200);
  return { props: { rows: rows||[], quotas: quotas||[] } };
}
