import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function Metrics(){
  const [data, setData] = useState([]);
  const refCountry = useRef(null), refOffer = useRef(null);

  useEffect(()=>{ (async()=>{
    try{ const r = await fetch('/api/metrics'); const j = await r.json(); setData(j||[]); }catch(e){}
  })(); }, []);

  useEffect(()=>{
    if(!data.length) return;
    const topBy = (key) => {
      const map = new Map();
      data.forEach(r=>{ const k=r[key]||'(unknown)'; const v=map.get(k)||{clicks:0,leads:0,sales:0}; v.clicks+=r.clicks||0; v.leads+=r.leads||0; v.sales+=r.sales||0; map.set(k,v); });
      return Array.from(map.entries()).sort((a,b)=> (b[1].leads||0)-(a[1].leads||0)).slice(0,7);
    };
    const destroy = (c)=>{ if(c?.chart){ c.chart.destroy(); c.chart=null; } };
    destroy(refCountry.current); destroy(refOffer.current);

    const cc = document.getElementById('chartCountry').getContext('2d');
    const tc = topBy('country');
    refCountry.current = { chart: new Chart(cc, {
      type:'bar',
      data:{ labels: tc.map(x=>x[0]), datasets:[{label:'Leads', data: tc.map(x=>x[1].leads||0)}, {label:'Clicks', data: tc.map(x=>x[1].clicks||0)}] },
      options:{ responsive:true, plugins:{ legend:{ position:'top' }}, scales:{ y:{ beginAtZero:true } } }
    })};

    const co = document.getElementById('chartOffer').getContext('2d');
    const to = topBy('offer_type');
    refOffer.current = { chart: new Chart(co, {
      type:'bar',
      data:{ labels: to.map(x=>x[0]), datasets:[{label:'Leads', data: to.map(x=>x[1].leads||0)}, {label:'Sales', data: to.map(x=>x[1].sales||0)}] },
      options:{ responsive:true, plugins:{ legend:{ position:'top' }}, scales:{ y:{ beginAtZero:true } } }
    })};
  }, [data]);

  return (<div style={{maxWidth:1000, margin:'30px auto', fontFamily:'ui-sans-serif'}}>
    <h2>Metrics Dashboard</h2>
    <p>Quick glance at top countries and offer types (from /api/metrics).</p>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div><canvas id="chartCountry" height="260"/></div>
      <div><canvas id="chartOffer" height="260"/></div>
    </div>
  </div>);
}