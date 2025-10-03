
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });

export default function Admin({ user }) {
  return (
    <main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:1080, margin:'0 auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h1>Admin Dashboard</h1>
        <nav><Link href="/">Home</Link></nav>
      </header>
      <section style={{marginBottom:16, color:'#444'}}>Signed in as <b>{user?.email}</b></section>
      <Dashboard />
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: { user: session.user || null } };
}
