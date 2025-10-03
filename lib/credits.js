
import { getServerSupabase } from './db';

export const PLAN_CREDITS = { free:200, pro:5000, enterprise:-1 };
function monthKey(d=new Date()){ return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`; }

export async function getOrCreateIdentity({ email, anonId }){
  const supabase=getServerSupabase(); if(!supabase) throw new Error('Supabase not configured');
  const id=(email||'').toLowerCase() || `anon:${anonId||'unknown'}`;
  const { data } = await supabase.from('users_quota').select('*').eq('id', id).maybeSingle();
  if (data) return data;
  const plan=email?'free':'free'; const credits=PLAN_CREDITS[plan]; const mk=monthKey();
  const ins=await supabase.from('users_quota').insert({ id, email: email||null, plan, month_key: mk, credits_remaining: credits, last_updated: new Date().toISOString() }).select().single();
  if (ins.error) throw ins.error; return ins.data;
}

export async function syncPlanFromSubscriptions(email){
  const supabase=getServerSupabase();
  const { data: sub } = await supabase.from('subscriptions').select('*').eq('email', email.toLowerCase()).maybeSingle();
  const plan=(sub?.plan||'free').toLowerCase(); const credits=PLAN_CREDITS[plan]; const mk=monthKey();
  const { data: uq } = await supabase.from('users_quota').select('*').eq('id', email.toLowerCase()).maybeSingle();
  if(!uq){ await supabase.from('users_quota').insert({ id: email.toLowerCase(), email: email.toLowerCase(), plan, month_key: mk, credits_remaining: credits, last_updated: new Date().toISOString() }); return { plan, credits_remaining: credits, month_key: mk }; }
  const newRow={ plan }; if(uq.month_key!==mk){ newRow.month_key=mk; newRow.credits_remaining=credits; }
  await supabase.from('users_quota').update(newRow).eq('id', email.toLowerCase());
  return { plan, credits_remaining: newRow.credits_remaining ?? uq.credits_remaining, month_key: newRow.month_key ?? uq.month_key };
}

export async function requireCredits({ email, anonId, cost=1, action='generic' }){
  const supabase=getServerSupabase(); if(!supabase) throw new Error('Supabase not configured');
  const id=(email||'').toLowerCase() || `anon:${anonId||'unknown'}`; const mk=monthKey();
  await getOrCreateIdentity({ email, anonId });
  if(email) await syncPlanFromSubscriptions(email);
  const { data: row } = await supabase.from('users_quota').select('*').eq('id', id).maybeSingle();
  if(!row) return { ok:false, reason:'quota-read-failed' };
  const unlimited = row.plan==='enterprise' || row.credits_remaining < 0;
  if(!unlimited){
    if(row.month_key!==mk){
      const allowance=PLAN_CREDITS[row.plan] ?? PLAN_CREDITS['free'];
      const upd=await supabase.from('users_quota').update({ month_key: mk, credits_remaining: allowance }).eq('id', id).select().single();
      if(upd.error) return { ok:false, reason:'rotate-failed' };
      row.credits_remaining = upd.data.credits_remaining;
    }
    if((row.credits_remaining||0) < cost){
      await supabase.from('usage_logs').insert({ id, action, cost, allowed:false, month_key: mk });
      return { ok:false, reason:'out-of-credits', remaining: row.credits_remaining || 0 };
    }
  }
  if(!unlimited){
    const upd = await supabase.rpc('decrement_credits', { p_id: id, p_cost: cost });
    if (upd.error) return { ok:false, reason:'decrement-failed' };
  }
  await supabase.from('usage_logs').insert({ id, action, cost, allowed:true, month_key: mk });
  return { ok:true };
}

export async function getCredits(id){
  const supabase=getServerSupabase(); if(!supabase) return { remaining: 0, plan: 'free' };
  const { data } = await supabase.from('users_quota').select('*').eq('id', id.toLowerCase()).maybeSingle();
  if(!data) return { remaining: 0, plan: 'free' };
  return { remaining: data.credits_remaining, plan: data.plan, month_key: data.month_key };
}
