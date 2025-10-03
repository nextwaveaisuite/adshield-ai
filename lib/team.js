// lib/team.js
import { supabaseAdmin } from './supabaseAdmin';
export async function listMembers() {
  const { data, error } = await supabaseAdmin.from('team_members').select('email, role, created_at').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
export async function setRole(email, role) {
  if (!['member','analyst','admin'].includes(role)) throw new Error('invalid role');
  const { error } = await supabaseAdmin.from('team_members').upsert({ email, role }, { onConflict: 'email' });
  if (error) throw new Error(error.message);
  return { ok: true };
}
