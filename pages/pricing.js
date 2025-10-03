
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function Pricing({ email }) {
  const [loading, setLoading] = useState(false);
  async function checkout() {
    setLoading(true);
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    setLoading(false);
    if (json.url) window.location.href = json.url;
    else alert(json.error || 'Checkout failed');
  }

  return (
    <main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:900, margin:'0 auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h1>Pricing</h1>
        <nav><Link href="/">Home</Link></nav>
      </header>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16}}>
        <div style={{border:'1px solid #eee', borderRadius:12, padding:16, background:'#fff'}}>
          <h3>Free</h3>
          <p>Basics: metrics & compliance</p>
          <p><b>$0</b>/mo</p>
          <Link href="/login">Get Started</Link>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:12, padding:16, background:'#fff'}}>
          <h3>Pro</h3>
          <p>Higher limits, advanced features</p>
          <p><b>$29</b>/mo · 5000 credits</p>
          <button disabled={loading} onClick={checkout} style={{padding:'10px 14px'}}>Buy Pro</button>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:12, padding:16, background:'#fff'}}>
          <h3>Enterprise</h3>
          <p>Custom limits, SSO, priority support</p>
          <p><b>Unlimited credits</b></p>
          <a href="mailto:sales@example.com">Contact Sales</a>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  return { props: { email: session?.user?.email || '' } };
}
