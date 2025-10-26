// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js';

let _client = null;

/**
 * Returns a Supabase admin client or null if env vars are not set.
 */
export function getSupabaseAdminOrNull() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
