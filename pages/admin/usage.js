import { getSession } from 'next-auth/react';
import Dashboard from '../../components/Dashboard';
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  if (session.user.role !== 'admin') return { notFound: true };
  return { props: {} };
}
export default function UsagePage() {
  return (
    <Dashboard title="Usage">
      <p>Latest usage logs (wire up as needed).</p>
    </Dashboard>
  );
}
