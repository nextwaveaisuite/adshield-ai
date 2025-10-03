import { getSession } from 'next-auth/react';
import Dashboard from '../../components/Dashboard';
import Compliance from '../../components/Compliance';
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  if (!['analyst','admin'].includes(session.user.role)) return { notFound: true };
  return { props: {} };
}
export default function CompliancePage() {
  return (
    <Dashboard title="Compliance">
      <Compliance />
    </Dashboard>
  );
}
