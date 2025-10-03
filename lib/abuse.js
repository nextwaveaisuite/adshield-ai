export function isBlocked({ ip, key, settings }){
  const s = settings || {};
  const denyIPs = new Set((s.deny_ips||[]).map(x=>String(x).trim()));
  const allowIPs = new Set((s.allow_ips||[]).map(x=>String(x).trim()));
  const denyKeys = new Set((s.deny_keys||[]).map(x=>String(x).trim()));
  const allowKeys = new Set((s.allow_keys||[]).map(x=>String(x).trim()));
  // allowlists take precedence when present
  if (allowIPs.size && !allowIPs.has(ip)) return true;
  if (allowKeys.size && key && !allowKeys.has(key)) return true;
  if (denyIPs.has(ip)) return true;
  if (key && denyKeys.has(key)) return true;
  return false;
}