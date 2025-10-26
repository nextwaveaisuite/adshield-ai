// pages/api/seed.js
import { getSupabaseAdminOrNull } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) {
    return res.status(200).json({ ok: true, inserted: 0, note: 'No DB configured. Set SUPABASE_URL/SUPABASE_SERVICE_ROLE to enable seeding.' });
  }
  const countries = ['US','CA','AU'];
  const states = { US: ['CA','NY','TX'], CA: ['ON','BC','QC'], AU: ['NSW','VIC','QLD'] };
  const offers = ['sofa','mattress','tv','cardigan'];
  const users = ['seed-1','seed-2','seed-3'];
  const events = ['post','click','lead','sale'];

  const rows = [];
  for (let i = 0; i < 500; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const state = states[country][Math.floor(Math.random() * states[country].length)];
    const offer = offers[Math.floor(Math.random() * offers.length)];
    const user_id = users[Math.floor(Math.random() * users.length)];
    const ev = events[Math.floor(Math.random() * events.length)];
    rows.push({ event: ev, payload: { id: i + 1 }, meta: { country, state, offer, user_id } });
  }
  const { error } = await supabase.from('events').insert(rows);
  if (error) return res.status(400).json({ error: error.message });

  const { data: uq } = await supabase.from('users_quota').select('user_id').eq('user_id', 'seed-1').maybeSingle?.() || { data: null };
  if (!uq) {
    await supabase.from('users_quota').insert({ user_id: 'seed-1', monthly_credits: 10000, credits_left: 2400 });
  }
  return res.status(200).json({ ok: true, inserted: rows.length });
}
