export default async function handler(req, res){
  const topics=(req.query.topics||'').split(',').map(s=>s.trim()).filter(Boolean);
  const out = topics.map(t=>({ topic:t, views: Math.floor(10000 + Math.random()*900000) }));
  res.json(out);
}