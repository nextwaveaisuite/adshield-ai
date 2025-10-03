
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>AdShield AI — Clean Core + Auth ✅</h1>
      <p>Deployment-ready scaffold with NextAuth and protected Admin. APIs are stubbed and compile cleanly on Vercel.</p>

      <h2>Links</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/metrics">GET /api/metrics</a></li>
        <li><Link href="/login">/login</Link> → then go to <Link href="/admin">/admin</Link></li>
      </ul>
    </main>
  );
}
