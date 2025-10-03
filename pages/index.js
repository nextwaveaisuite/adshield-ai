
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>AdShield AI — Compliance Pack ✅</h1>
      <p>Now includes a server-side compliance engine and a UI at <code>/admin/compliance</code>.</p>
      <h2>Links</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/metrics">GET /api/metrics</a></li>
        <li><Link href="/login">/login</Link> → then go to <Link href="/admin">/admin</Link> or <Link href="/admin/compliance">/admin/compliance</Link></li>
      </ul>
    </main>
  );
}
