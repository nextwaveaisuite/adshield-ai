export default async function handler(req, res){
  if (req.method !== 'GET') return res.status(405).end();
  const topics=(req.query.topics||'').split(',').map(s=>s.trim()).filter(Boolean);
  const regions=(req.query.regions||'US').split(',').map(s=>s.trim()).filter(Boolean);
  const out=[];
  for(const t of topics){ for(const r of regions){ const base=Math.floor(40+Math.random()*50); const slope=Math.round((Math.random()*20-10)); out.push({topic:t, region:r, score:base, slope}); } }
  res.json(out);
}