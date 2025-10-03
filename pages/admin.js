
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import Link from 'next/link';

export default function Admin({ user }) {
  return (
    <main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:840, margin:'0 auto'}}>
      <h1>Admin</h1>
      <p>Signed in as <b>{user?.email}</b></p>
      <p><Link href="/">Go home</Link></p>
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
