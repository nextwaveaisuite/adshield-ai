import { supabaseAdmin } from '../../../lib/supabaseAdmin';
export default async function handler(req,res){
  const { data, error } = await supabaseAdmin.from('team_members').select('email, role').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ members:data||[] });
}
