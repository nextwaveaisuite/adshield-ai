import cookie from 'cookie';

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Set-Cookie', cookie.serialize('admintoken','', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 }));
  return res.json({ ok:true });
}