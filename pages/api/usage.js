// pages/api/usage.js
import { getSupabaseAdminOrNull } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const supabase = getSupabaseAdminOrNull();
  const user_id = (req.query.user_id || 'seed-1');

  if (!supabase) {
    return res.status(200).json({
      quota: { user_id, monthly_credits: 10000, credits_left: 10000 },
      logs: []
    });
  }

  const { data: quota } = await supabase.from('users_quota').select('*').eq('user_id', user_id).single();
  const { data: logs } = await supabase.from('usage_logs').select('*').eq('user_id', user_id).order('created_at', { ascending: false }).limit(200);
  return res.status(200).json({ quota: quota || null, logs: logs || [] });
}
