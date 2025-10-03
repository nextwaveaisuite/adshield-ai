import cookie from 'cookie';

export function getRoleFromCookie(req){
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['admintoken'];
  // prototype roles: 'admin', 'analyst'
  if (token === 'ok_admin') return 'admin';
  if (token === 'ok_analyst') return 'analyst';
  return null;
}
export function requireRole(req, roles){
  const role = getRoleFromCookie(req);
  if (!role || !roles.includes(role)) {
    const err = new Error('forbidden');
    err.code = 403;
    throw err;
  }
  return role;
}
export function emailHasRole(email){
  const admins = (process.env.ADMIN_USERS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  const analysts = (process.env.ANALYST_USERS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  const e = (email||'').toLowerCase();
  if (admins.includes(e)) return 'admin';
  if (analysts.includes(e)) return 'analyst';
  return null;
}