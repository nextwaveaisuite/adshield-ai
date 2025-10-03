import { useEffect, useState } from 'react';

export default function Monitor(){
  const [status, setStatus] = useState({ ok:false });
  useEffect(()=>{
    let mounted=true;
    async function tick(){
      try{
        const r = await fetch('/api/health');
        const j = await r.json();
        if(mounted) setStatus(j);
      }catch(e){
        if(mounted) setStatus({ ok:false, error:'fetch_failed' });
      }
    }
    tick();
    const id=setInterval(tick, 60000);
    return ()=>{ mounted=false; clearInterval(id); };
  },[]);

  return (<div style={{maxWidth:800, margin:'30px auto', fontFamily:'ui-sans-serif'}}>
    <h2>Service Monitor</h2>
    <p>Live health from <code>/api/health</code>. Auto-refreshes every minute.</p>
    <div style={{padding:12,border:'1px solid #ddd',borderRadius:8, background: status.ok?'#e8fff3':'#ffefef'}}>
      <div><strong>Status:</strong> {status.ok ? 'OK' : 'DOWN'}</div>
      {'backend' in status && <div><strong>Backend:</strong> {status.backend}</div>}
      {'db_ok' in status && <div><strong>DB:</strong> {String(status.db_ok)}</div>}
      {'settings_ok' in status && <div><strong>Settings:</strong> {String(status.settings_ok)}</div>}
      {'error' in status && <div><strong>Error:</strong> {String(status.error)}</div>}
    </div>
    <pre style={{marginTop:12, background:'#111', color:'#eee', padding:8, borderRadius:8}}>{JSON.stringify(status,null,2)}</pre>
  </div>);
}