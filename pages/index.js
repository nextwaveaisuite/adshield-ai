export default function Home() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>AdShield AI — Clean Full Source ✅</h1>
      <p>Deployment-ready scaffold. APIs are stubbed and compile cleanly on Vercel.</p>

      <h2>Links</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/metrics">GET /api/metrics</a></li>
        <li><a href="/admin">/admin</a> (SSR, no next-auth)</li>
      </ul>

      <h2>Collect Example</h2>
      <pre style={{background:'#f5f5f5', padding:12, borderRadius:8, overflow:'auto'}}>
{`curl -X POST /api/collect \\n  -H "Content-Type: application/json" \\n  -d '{"event":"test","payload":{"msg":"hello"},"meta":{}}'`}
      </pre>
    </main>
  );
}