
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>AdShield AI — Billing Pack ✅</h1>
      <p>Stripe-powered plans with server-side gating.</p>
      <h2>Links</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/metrics">GET /api/metrics</a></li>
        <li><Link href="/pricing">/pricing</Link></li>
        <li><Link href="/login">/login</Link> → then go to <Link href="/admin">/admin</Link> or <Link href="/admin/compliance">/admin/compliance</Link></li>
      </ul>
      <p style={{marginTop:16, color:'#666'}}>Set Stripe env vars and webhook for full functionality.</p>
    </main>
  );
}
