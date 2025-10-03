// lib/credits.js
import { supabaseAdmin } from './supabaseAdmin';

export async function decrementCredits(email, delta = 1, action = 'use') {
  const { data: user } = await supabaseAdmin.from('users_quota').select('*').eq('email', email).single();
  if (!user) {
    await supabaseAdmin.from('users_quota').insert({ email });
  }
  await supabaseAdmin.from('usage_logs').insert({ email, action, delta: -Math.abs(delta), meta: {} });
  return { ok: true };
}
