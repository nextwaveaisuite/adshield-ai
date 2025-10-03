
import { getServerSupabase } from './db';

export async function setPlanByEmail(email, { plan, status, current_period_end, stripe_customer_id, stripe_subscription_id }) {
  const supabase = getServerSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const up = await supabase
    .from('subscriptions')
    .upsert({
      email: email.toLowerCase(),
      plan,
      status,
      current_period_end: current_period_end ? new Date(current_period_end) : null,
      stripe_customer_id: stripe_customer_id || null,
      stripe_subscription_id: stripe_subscription_id || null
    }, { onConflict: 'email' })
    .select()
    .single();
  return up;
}

export async function getPlanByEmail(email) {
  const supabase = getServerSupabase();
  if (!supabase) return { plan: 'free', status: 'inactive' };
  const { data } = await supabase.from('subscriptions').select('*').eq('email', email.toLowerCase()).maybeSingle();
  return data || { plan: 'free', status: 'inactive' };
}

export async function requirePlan({ email, minPlan = 'free' }) {
  const levels = { free: 0, pro: 1, enterprise: 2 };
  const sub = await getPlanByEmail(email);
  const ok = (levels[sub.plan || 'free'] >= levels[minPlan]);
  return { ok, sub };
}
