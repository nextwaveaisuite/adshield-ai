import { useSession, signIn, signOut } from "next-auth/react";

export default function Admin() {
  const { data: session } = useSession();

  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Panel</h1>
      {!session ? (
        <>
          <p>You must sign in to view this page.</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      ) : (
        <>
          <p>Welcome {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </main>
  );
}
