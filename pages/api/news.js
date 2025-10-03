export default async function handler(req, res){
  const topics=(req.query.topics||'').split(',').map(s=>s.trim()).filter(Boolean);
  const regions=(req.query.regions||'US').split(',').map(s=>s.trim()).filter(Boolean);
  const out=[]; for(const t of topics){ for(const r of regions){ out.push({ topic:t, region:r, articles: Math.floor(5+Math.random()*40) }); } }
  res.json(out);
}