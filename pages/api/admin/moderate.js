/**
 * POST /api/admin/moderate
 * Body: { text }
 * Returns: { ok, flags: [ {rule, snippet} ], blocked }
 */
const RULES = [
  { rule: 'get_rich_quick', rx: /(get\s*rich\s*quick|overnight\s*success|no\s*work\s*required)/i },
  { rule: 'guarantee_claims', rx: /(guarantee(d)?\s*\$?\d+|100%\s*(guarantee|success))/i },
  { rule: 'affiliate_link', rx: /(ref=|hop=|clickbank|shareasale|impact\.com|cj\.com)/i },
  { rule: 'misleading_income', rx: /(make\s*\$?\d+\s*(per\s*(day|hour)|daily))/i },
  { rule: 'banned_terms', rx: /(loophole|secret\s*hack|undetectable)/i }
];

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end();
  const text = String((req.body?.text)||'').slice(0, 5000);
  const flags = [];
  RULES.forEach(({rule, rx})=>{
    const m = text.match(rx);
    if(m) flags.push({ rule, snippet: m[0] });
  });
  return res.json({ ok:true, flags, blocked: flags.length>0 });
}