import { createClient } from '@supabase/supabase-js';
export function getServerSupabase(){const u=process.env.SUPABASE_URL,k=process.env.SUPABASE_SERVICE_ROLE; if(!u||!k) return null; return createClient(u,k,{auth:{persistSession:false,autoRefreshToken:false}});}
