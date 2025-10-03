
import { useState } from 'react';

export default function Compliance() {
  const [text, setText] = useState('Selling a like-new sofa. Pickup in 94107. Cashless payments only.');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function validate() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/validate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const json = await res.json();
      setResult(json);
    } catch (e) { setError('Validation failed.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <textarea
        value={text}
        onChange={e=>setText(e.target.value)}
        rows={10}
        style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}}
        placeholder="Paste your ad copy here…"
      />
      <div style={{display:'flex', gap:8}}>
        <button onClick={validate} disabled={loading} style={{padding:'10px 14px'}}>
          {loading ? 'Validating…' : 'Validate'}
        </button>
      </div>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      {result && (
        <div style={{display:'grid', gap:8, marginTop:8}}>
          <div style={{padding:12, borderRadius:8, background: result.ok ? '#e9f9ef' : '#fff4e5', border: '1px solid #eee'}}>
            <b>Status:</b> {result.ok ? 'Compliant ✅' : 'Needs changes ⚠️'}
          </div>
          {!!(result.issues||[]).length && (
            <div style={{padding:12, borderRadius:8, background:'#fff', border:'1px solid #eee'}}>
              <b>Issues</b>
              <ul>{result.issues.map((i,idx)=>(<li key={idx}>{i}</li>))}</ul>
            </div>
          )}
          {!!(result.suggestions||[]).length && (
            <div style={{padding:12, borderRadius:8, background:'#fff', border:'1px solid #eee'}}>
              <b>Suggestions</b>
              <ul>{result.suggestions.map((i,idx)=>(<li key={idx}>{i}</li>))}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
