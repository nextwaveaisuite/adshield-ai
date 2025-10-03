
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>AdShield AI — DB + Metrics ✅</h1>
      <p>Now storing real events in Supabase and returning aggregated metrics.</p>

      <h2>Quick Links</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/metrics">GET /api/metrics</a></li>
        <li><Link href="/login">/login</Link> → then go to <Link href="/admin">/admin</Link></li>
      </ul>

      <h2>Collect Example</h2>
      <pre style={{background:'#f5f5f5', padding:12, borderRadius:8, overflow:'auto'}}>
{`curl -X POST /api/collect \\n  -H "Content-Type: application/json" \\n  -d '{\"event\":\"post\",\"payload\":{\"msg\":\"hello\"},\"meta\":{\"country\":\"US\",\"state\":\"CA\",\"zip\":\"94107\",\"offer_type\":\"furniture\"}}'`}
      </pre>
    </main>
  );
}
