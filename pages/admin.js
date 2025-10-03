import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Admin(){
  const { data: session } = useSession();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState('');
  const [health, setHealth] = useState(null);
  const [settings, setSettings] = useState({ moderation:{ enabled:true }, limits:{ perMin:120 }, allow_ips:[], deny_ips:[], allow_keys:[], deny_keys:[] });
  const [logs, setLogs] = useState([]);
  const [text, setText] = useState('');
  const [check, setCheck] = useState(null);

  async function login(){
    const res = await fetch('/api/admin/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({user, pass}) });
    setAuth(res.ok); setRole(res.ok ? 'admin' : '');
  }
  async function logout(){
    await fetch('/api/admin/logout',{ method:'POST' }); setAuth(false);
  }
  async function load(){
    const r = await fetch('/api/admin/settings'); if(r.ok){ const j=await r.json(); setSettings(j.settings || settings); }
    const a = await fetch('/api/admin/audit'); if(a.ok){ const j=await a.json(); setLogs(j.logs||[]); }
  }
  async function save(){
    const r = await fetch('/api/admin/settings',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ settings }) });
    if(r.ok) alert('Saved');
  }
  async function moderate(){
    const r = await fetch('/api/admin/moderate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text })});
    const j = await r.json(); setCheck(j);
  }

  useEffect(()=>{ if(auth) load(); }, [auth]);

  if(!auth && !session){
    return (<div style={{maxWidth:480, margin:'60px auto', fontFamily:'ui-sans-serif'}}>
      <div style={{marginBottom:10}}><button onClick={()=>signIn()}>Sign in with OAuth</button></div>
      <h2>Admin Console {role && (<span style={{fontSize:14,opacity:.7}}>({role})</span>)}</h2>
      <p>Prototype login (use env ADMIN_USER / ADMIN_PASS)</p>
      <input placeholder="user" value={user} onChange={e=>setUser(e.target.value)} style={{width:'100%',padding:10,margin:'8px 0'}}/>
      <input placeholder="pass" type="password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:10,margin:'8px 0'}}/>
      <button onClick={login}>Login</button>
    </div>);
  }

  return (<div style={{maxWidth:1000, margin:'30px auto', fontFamily:'ui-sans-serif'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h2>Admin Console {role && (<span style={{fontSize:14,opacity:.7}}>({role})</span>)}</h2>
      <div style={{display:'flex',gap:8}}><button onClick={logout}>Logout (cookie)</button><button onClick={()=>signOut()}>Sign out (OAuth)</button></div>
    </div>

    <section style={{border:'1px solid #ddd', padding:12, borderRadius:8, marginTop:12}}>
      <h3>Settings</h3>
      <label><input type="checkbox" checked={settings?.moderation?.enabled||false} onChange={e=>setSettings(s=>({...s, moderation:{enabled:e.target.checked}}))}/> Enable moderation</label>
      <div style={{marginTop:8}}>
        <label>Rate limit per minute: <input type="number" value={settings?.limits?.perMin||120} onChange={e=>setSettings(s=>({...s, limits:{ perMin:+e.target.value || 60 }}))}/></label>
      </div>
      <div style={{marginTop:8}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div>
            <div className='small'>Allow IPs (comma-separated)</div>
            <input value={(settings.allow_ips||[]).join(', ')} onChange={e=>setSettings(s=>({...s, allow_ips: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} />
            <div className='small'>Deny IPs (comma-separated)</div>
            <input value={(settings.deny_ips||[]).join(', ')} onChange={e=>setSettings(s=>({...s, deny_ips: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} />
          </div>
          <div>
            <div className='small'>Allow API Keys (comma-separated)</div>
            <input value={(settings.allow_keys||[]).join(', ')} onChange={e=>setSettings(s=>({...s, allow_keys: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} />
            <div className='small'>Deny API Keys (comma-separated)</div>
            <input value={(settings.deny_keys||[]).join(', ')} onChange={e=>setSettings(s=>({...s, deny_keys: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} />
          </div>
        </div>
      </div>
      <button onClick={save} style={{marginTop:12}}>Save</button>
    
    <div style={{marginTop:12}}>
      <button onClick={async()=>{ const r=await fetch('/api/health'); setHealth(await r.json()); }}>Run Health Check</button>
      {health && <pre style={{background:'#111',color:'#eee',padding:8,borderRadius:8, marginTop:8}}>{JSON.stringify(health,null,2)}</pre>}
    </div>
    </section>

    <section style={{border:'1px solid #ddd', padding:12, borderRadius:8, marginTop:12}}>
      <h3>Moderation test</h3>
      <textarea value={text} onChange={e=>setText(e.target.value)} style={{width:'100%',minHeight:120}} placeholder="Paste ad text to scan" />
      <button onClick={moderate} style={{marginTop:8}}>Scan</button>
      {check && <pre style={{background:'#111',color:'#eee',padding:8,borderRadius:8, marginTop:8}}>{JSON.stringify(check,null,2)}</pre>}
    
    <div style={{marginTop:12}}>
      <button onClick={async()=>{ const r=await fetch('/api/health'); setHealth(await r.json()); }}>Run Health Check</button>
      {health && <pre style={{background:'#111',color:'#eee',padding:8,borderRadius:8, marginTop:8}}>{JSON.stringify(health,null,2)}</pre>}
    </div>
    </section>

    <section style={{border:'1px solid #ddd', padding:12, borderRadius:8, marginTop:12}}>
      <h3>Recent Activity (Audit Logs)</h3>
      <div style={{maxHeight:300, overflow:'auto', fontFamily:'ui-monospace'}}>
        {logs.map((l)=>(<div key={l.id} style={{borderBottom:'1px solid #eee', padding:'6px 0'}}>
          <div><strong>{new Date(+l.ts).toLocaleString()}</strong> — {l.action} {l.ip?`(${l.ip})`:''}</div>
          <div style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(l.meta)}</div>
        </div>))}
      </div>
    </section>
  </div>);
}