
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div style={{borderBottom:'1px solid #eee',padding:'8px 12px',display:'flex',gap:12}}>
        <Link href="/">Home</Link>
        <Link href="/pricing">Pricing</Link>
        <a href="/api/metrics">/api/metrics</a>
        <a href="/api/health">/api/health</a>
        <a href="/api/seed" onClick={e=>{e.preventDefault(); fetch('/api/seed',{method:'POST'}).then(r=>r.json()).then(()=>window.location.reload());}}>Seed</a>
      </div>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
