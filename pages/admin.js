// SSR-only admin page (no next-auth), so build won't try to prerender it.
export default function Admin() {
  return (
    <main style={{fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 840, margin: '0 auto'}}>
      <h1>Admin</h1>
      <p>This page is rendered on the server at request time to avoid build-time rendering issues.</p>
    </main>
  );
}

// Force SSR so Next doesn't pre-render at build time.
export async function getServerSideProps() {
  return { props: {} };
}