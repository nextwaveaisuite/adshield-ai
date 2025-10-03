
import Link from 'next/link';
export default function Home(){
  return (<main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:840, margin:'0 auto'}}>
    <h1>AdShield AI — Onboarding & Seed Data Pack ✅</h1>
    <p>New: /api/seed to generate demo traffic, /admin/usage page, dashboard filters, improved credit banners.</p>
    <h2>Links</h2>
    <ul>
      <li><a href="/api/health">GET /api/health</a></li>
      <li><a href="/api/metrics">GET /api/metrics</a></li>
      <li><a href="#" onClick={(e)=>{e.preventDefault(); fetch('/api/seed',{method:'POST'}).then(r=>r.json()).then(()=>alert('Seeded! Now open /admin.'));}}>/api/seed</a> (POST)</li>
      <li><Link href="/pricing">/pricing</Link></li>
      <li><Link href="/login">/login</Link> → then go to <Link href="/admin">/admin</Link> or <Link href="/admin/compliance">/admin/compliance</Link> or <Link href="/admin/usage">/admin/usage</Link></li>
    </ul>
    <p style={{marginTop:16,color:'#666'}}>Run the SQL schema to create tables and functions.</p>
  </main>);
}
