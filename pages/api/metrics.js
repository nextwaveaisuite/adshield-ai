import { supabaseAdmin } from '../../lib/supabaseAdmin';
export default async function handler(req, res) {
  const { data, error } = await supabaseAdmin.from('events').select('event, created_at').order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true, rows: data || [] });
}
