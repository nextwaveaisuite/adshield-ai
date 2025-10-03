
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Compliance = dynamic(() => import('../../components/Compliance'), { ssr: false });

export default function CompliancePage({ user }) {
  return (
    <main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:960, margin:'0 auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h1>Ad Compliance Checker</h1>
        <nav style={{display:'flex', gap:16}}>
          <Link href="/">Home</Link>
          <Link href="/admin">Dashboard</Link>
        </nav>
      </header>
      <section style={{marginBottom:16, color:'#444'}}>Signed in as <b>{user?.email}</b></section>
      <Compliance />
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
