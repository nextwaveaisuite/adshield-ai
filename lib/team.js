import { getServerSupabase } from './db';
export async function getRoleByEmail(email){const s=getServerSupabase(); if(!s||!email) return 'member'; const {data}=await s.from('team_members').select('role').eq('email',email.toLowerCase()).maybeSingle(); return data?.role||'member';}
export async function listMembers(){const s=getServerSupabase(); if(!s) return []; const {data}=await s.from('team_members').select('*').order('created_at',{ascending:false}); return data||[];}
export async function upsertMember(email,role){const s=getServerSupabase(); if(!s) throw new Error('Supabase not configured'); const {data,error}=await s.from('team_members').upsert({email:email.toLowerCase(),role}).select().single(); if(error) throw error; return data;}
