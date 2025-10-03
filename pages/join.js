import Head from 'next/head';
import { supabaseAdmin } from '../lib/supabaseAdmin';
export async function getServerSideProps(ctx) {
  const token = ctx.query.token || '';
  if (!token) return { redirect: { destination: '/login', permanent: false } };
  const { data: invite, error } = await supabaseAdmin.from('invites').select('*').eq('token', token).single();
  if (error || !invite) return { redirect: { destination: '/login?err=invalid_invite', permanent: false } };
  const email = invite.email; const role = invite.role;
  const { error: upsertErr } = await supabaseAdmin.from('team_members').upsert({ email, role }, { onConflict: 'email' });
  if (upsertErr) return { redirect: { destination: '/login?err=upsert_failed', permanent: false } };
  await supabaseAdmin.from('invites').delete().eq('token', token);
  return { redirect: { destination: '/login?joined=1&email=' + encodeURIComponent(email), permanent: false } };
}
export default function JoinPage(){return(<><Head><title>Joining…</title></Head><main style={{display:'flex',minHeight:'60vh',alignItems:'center',justifyContent:'center'}}><p>Completing your invite…</p></main></>);}
