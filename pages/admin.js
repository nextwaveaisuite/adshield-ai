
import { getServerSession } from 'next-auth/next'; import { authOptions } from '../lib/auth';
import dynamic from 'next/dynamic'; import Link from 'next/link'; import { getPlanByEmail } from '../lib/billing'; import { getCredits } from '../lib/credits';
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr:false });
export default function Admin({ user, sub, credits }){
  const low = credits.remaining >= 0 && credits.remaining <= 10;
  return (<main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:1080, margin:'0 auto'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
      <h1>Admin Dashboard</h1>
      <nav style={{display:'flex',gap:16}}><Link href="/">Home</Link><Link href="/pricing">Pricing</Link><Link href="/admin/compliance">Compliance</Link></nav>
    </header>
    <section style={{marginBottom:16,color:'#444'}}>Signed in as <b>{user?.email}</b> — Plan: <b>{sub?.plan || 'free'}</b> ({sub?.status || 'inactive'}) • Credits: <b>{credits.remaining < 0 ? '∞' : credits.remaining}</b>{low && <span style={{marginLeft:12, color:'#b45309'}}>Low credits — consider <Link href="/pricing">upgrading</Link>.</span>}</section>
    <Dashboard />
  </main>);
}
export async function getServerSideProps(context){
  const session=await getServerSession(context.req, context.res, authOptions); if(!session) return { redirect:{ destination:'/login', permanent:false }};
  const sub=await getPlanByEmail(session.user.email); const credits=await getCredits(session.user.email);
  return { props: { user: session.user || null, sub, credits } };
}
