// pages/api/credits.js
import { getSupabaseAdminOrNull } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const supabase = getSupabaseAdminOrNull();
  const user_id = (req.query.user_id || 'seed-1');

  if (!supabase) {
    return res.status(200).json({ user_id, monthly_credits: 10000, credits_left: 10000 });
  }

  const { data, error } = await supabase.from('users_quota').select('*').eq('user_id', user_id).single();
  if (error && error.code !== 'PGRST116') {
    return res.status(400).json({ error: error.message });
  }
  if (!data) {
    return res.status(200).json({ user_id, monthly_credits: 10000, credits_left: 10000 });
  }
  return res.status(200).json(data);
}
