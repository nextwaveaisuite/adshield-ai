
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>AdShield AI — Dashboard Pack ✅</h1>
      <p>Now with charts and a metrics table on /admin.</p>
      <h2>Links</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/metrics">GET /api/metrics</a></li>
        <li><Link href="/login">/login</Link> → then go to <Link href="/admin">/admin</Link></li>
      </ul>
      <p style={{marginTop:16, color:'#666'}}>To generate data, POST to /api/collect with events like post/click/lead/sale.</p>
    </main>
  );
}
