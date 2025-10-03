
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  async function handleSubmit(e) {
    e.preventDefault();
    await signIn('credentials', { email, password, callbackUrl: '/admin' });
  }
  return (
    <main style={{fontFamily:'system-ui, Arial, sans-serif', padding:24, maxWidth:480, margin:'0 auto'}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{display:'grid', gap:12}}>
        <label>Email<br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:8}} />
        </label>
        <label>Password<br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8}} />
        </label>
        <button type="submit" style={{padding:'10px 14px'}}>Sign In</button>
      </form>
      <p style={{marginTop:16}}><Link href="/">Back home</Link></p>
    </main>
  );
}
