
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });
// Chart.js register (tree-shaken in client)
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function groupLabel(r) {
  return `${r.country}-${r.state}-${r.zip}-${r.offer_type}`;
}

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState('clicks');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/metrics', { cache: 'no-store' });
        const json = await res.json();
        setRows(json.rows || []);
      } catch (e) {
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const labels = useMemo(() => rows.map(groupLabel), [rows]);
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      { label: 'Posts', data: rows.map(r => r.posts || 0) },
      { label: 'Clicks', data: rows.map(r => r.clicks || 0) },
      { label: 'Leads', data: rows.map(r => r.leads || 0) },
      { label: 'Sales', data: rows.map(r => r.sales || 0) }
    ]
  }), [rows, labels]);

  const sorted = useMemo(() => {
    return [...rows].sort((a,b) => (b[sortKey]||0) - (a[sortKey]||0));
  }, [rows, sortKey]);

  if (loading) return <p>Loading metrics…</p>;
  if (error) return <p style={{color:'crimson'}}>{error}</p>;
  if (!rows.length) return <p>No data yet. POST /api/collect to create some events.</p>;

  return (
    <div style={{display:'grid', gap:24}}>
      <div style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
        <h3 style={{marginBottom:12}}>Performance by Region/Offer</h3>
        <Bar data={chartData} options={{ responsive:true, maintainAspectRatio:false }} height={280} />
      </div>

      <div style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h3>Aggregated Metrics</h3>
          <label>Sort by:&nbsp;
            <select value={sortKey} onChange={e=>setSortKey(e.target.value)}>
              <option value="clicks">Clicks</option>
              <option value="posts">Posts</option>
              <option value="leads">Leads</option>
              <option value="sales">Sales</option>
            </select>
          </label>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left', padding:8, borderBottom:'1px solid #eee'}}>Country</th>
                <th style={{textAlign:'left', padding:8, borderBottom:'1px solid #eee'}}>State</th>
                <th style={{textAlign:'left', padding:8, borderBottom:'1px solid #eee'}}>ZIP</th>
                <th style={{textAlign:'left', padding:8, borderBottom:'1px solid #eee'}}>Offer</th>
                <th style={{textAlign:'right', padding:8, borderBottom:'1px solid #eee'}}>Posts</th>
                <th style={{textAlign:'right', padding:8, borderBottom:'1px solid #eee'}}>Clicks</th>
                <th style={{textAlign:'right', padding:8, borderBottom:'1px solid #eee'}}>Leads</th>
                <th style={{textAlign:'right', padding:8, borderBottom:'1px solid #eee'}}>Sales</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={i}>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5'}}>{r.country}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5'}}>{r.state}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5'}}>{r.zip}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5'}}>{r.offer_type}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5', textAlign:'right'}}>{r.posts}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5', textAlign:'right'}}>{r.clicks}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5', textAlign:'right'}}>{r.leads}</td>
                  <td style={{padding:8, borderBottom:'1px solid #f5f5f5', textAlign:'right'}}>{r.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
