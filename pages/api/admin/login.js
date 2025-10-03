import cookie from 'cookie';
import { emailHasRole } from '../../../lib/auth';

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end();
  const { user, pass } = req.body || {};
  const role = emailHasRole(user);
  if ((user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) || role){
    res.setHeader('Set-Cookie', cookie.serialize('admintoken', role==='admin'?'ok_admin':'ok_analyst', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60*60*8 }));
    return res.json({ ok:true });
  }
  return res.status(401).json({ ok:false, error:'invalid_credentials' });
}