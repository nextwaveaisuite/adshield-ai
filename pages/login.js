import { signIn } from 'next-auth/react';
import { useState } from 'react';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main style={{padding:'24px'}}>
      <h1>Login</h1>
      <form onSubmit={(e)=>{e.preventDefault(); signIn('credentials', { email, password, callbackUrl: '/admin' });}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
