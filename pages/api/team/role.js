import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, role } = req.body || {};
  if (!email || !['member','analyst','admin'].includes(role)) return res.status(400).json({ error: 'invalid input' });
  const { error } = await supabaseAdmin.from('team_members').upsert({ email, role }, { onConflict: 'email' });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ ok: true });
}
