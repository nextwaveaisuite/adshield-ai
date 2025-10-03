import { getSession } from 'next-auth/react';
import Dashboard from '../components/Dashboard';

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  return { props: { user: session.user } };
}

export default function Admin({ user }) {
  return (
    <Dashboard title="Admin Overview">
      <p>Welcome, {user?.email} (role: {user?.role})</p>
      <p>Use the nav above to explore.</p>
    </Dashboard>
  );
}
