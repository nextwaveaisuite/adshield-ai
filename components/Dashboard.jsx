
import dynamic from 'next/dynamic'; import { useEffect, useMemo, useState } from 'react';
const Bar = dynamic(() => import('react-chartjs-2').then(m=>m.Bar), { ssr:false });
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
function groupLabel(r){ return `${r.country}-${r.state}-${r.zip}-${r.offer_type}`; }
export default function Dashboard(){
  const [rows,setRows]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(null); const [sortKey,setSortKey]=useState('clicks');
  const [country,setCountry]=useState(''); const [state,setState]=useState(''); const [offer,setOffer]=useState('');
  useEffect(()=>{(async()=>{try{const res=await fetch('/api/metrics',{cache:'no-store'}); const json=await res.json(); setRows(json.rows||[]);}catch(e){setError('Failed to load metrics');}finally{setLoading(false);}})();},[]);
  const filtered = useMemo(()=> rows.filter(r => (!country || r.country===country) && (!state || r.state===state) && (!offer || r.offer_type===offer)), [rows,country,state,offer]);
  const labels=useMemo(()=>filtered.map(groupLabel),[filtered]);
  const chartData=useMemo(()=>({ labels, datasets:[ {label:'Posts', data: filtered.map(r=>r.posts||0)}, {label:'Clicks', data: filtered.map(r=>r.clicks||0)}, {label:'Leads', data: filtered.map(r=>r.leads||0)}, {label:'Sales', data: filtered.map(r=>r.sales||0)} ] }),[filtered,labels]);
  const sorted=useMemo(()=>[...filtered].sort((a,b)=>(b[sortKey]||0)-(a[sortKey]||0)),[filtered,sortKey]);
  const countries=[...new Set(rows.map(r=>r.country))]; const states=[...new Set(rows.map(r=>r.state))]; const offers=[...new Set(rows.map(r=>r.offer_type))];
  if(loading) return <p>Loading metrics…</p>; if(error) return <p style={{color:'crimson'}}>{error}</p>; if(!rows.length) return <p>No data yet. POST /api/collect or call /api/seed to create demo events.</p>;
  return (<div style={{display:'grid',gap:24}}>
    <div style={{display:'flex',gap:12,alignItems:'center'}}>
      <label>Country:&nbsp;<select value={country} onChange={e=>setCountry(e.target.value)}><option value="">All</option>{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></label>
      <label>State:&nbsp;<select value={state} onChange={e=>setState(e.target.value)}><option value="">All</option>{states.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
      <label>Offer:&nbsp;<select value={offer} onChange={e=>setOffer(e.target.value)}><option value="">All</option>{offers.map(o=><option key={o} value={o}>{o}</option>)}</select></label>
      <label>Sort by:&nbsp;<select value={sortKey} onChange={e=>setSortKey(e.target.value)}><option value="clicks">Clicks</option><option value="posts">Posts</option><option value="leads">Leads</option><option value="sales">Sales</option></select></label>
    </div>
    <div style={{background:'#fff',padding:16,borderRadius:12,boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}><h3 style={{marginBottom:12}}>Performance by Region/Offer</h3><Bar data={chartData} options={{responsive:true,maintainAspectRatio:false}} height={280}/></div>
    <div style={{background:'#fff',padding:16,borderRadius:12,boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><h3>Aggregated Metrics</h3></div>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Country</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>State</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>ZIP</th><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>Offer</th><th style={{textAlign:'right',padding:8,borderBottom:'1px solid #eee'}}>Posts</th><th style={{textAlign:'right',padding:8,borderBottom:'1px solid #eee'}}>Clicks</th><th style={{textAlign:'right',padding:8,borderBottom:'1px solid #eee'}}>Leads</th><th style={{textAlign:'right',padding:8,borderBottom:'1px solid #eee'}}>Sales</th></tr></thead><tbody>{sorted.map((r,i)=>(<tr key={i}><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.country}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.state}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.zip}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5'}}>{r.offer_type}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5',textAlign:'right'}}>{r.posts}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5',textAlign:'right'}}>{r.clicks}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5',textAlign:'right'}}>{r.leads}</td><td style={{padding:8,borderBottom:'1px solid #f5f5f5',textAlign:'right'}}>{r.sales}</td></tr>))}</tbody></table></div>
    </div>
  </div>);
}
