/**
 * Seed script for Supabase.
 * Usage:
 *   SUPABASE_URL=... SUPABASE_KEY=... node scripts/seed_supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if(!SUPABASE_URL || !SUPABASE_KEY){
  console.error('Set SUPABASE_URL and SUPABASE_KEY'); process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ensureTable(){
  // Ask user to run SQL file manually; skip programmatic DDL for safety.
  console.log('Ensure table exists by running sql/events_supabase.sql in the SQL editor.');
}

async function seed(){
  const now = Date.now();
  const rows = [
    { event:'click', country:'US', state:'Texas', zip:'77002', offer_type:'Pest Guide', city:'Houston', ts:now, utm_source:'craigslist', utm_medium:'classified', utm_campaign:'pest-guide-q4', utm_term:'houston-pest', cid:'seed-supa-1' },
    { event:'lead', country:'US', state:'Texas', zip:'77002', offer_type:'Pest Guide', city:'Houston', ts:now, utm_source:'craigslist', utm_medium:'classified', utm_campaign:'pest-guide-q4', utm_term:'houston-pest', cid:'seed-supa-1' },
    { event:'click', country:'AU', state:'QLD', zip:'4000', offer_type:'Home Solar Info', city:'Brisbane', ts:now, utm_source:'craigslist', utm_medium:'classified', utm_campaign:'solar-info-q4', utm_term:'brisbane-solar', cid:'seed-supa-2' },
  ];
  const { error } = await supabase.from('events').insert(rows);
  if(error){ console.error('Insert failed:', error.message); process.exit(1); }
  console.log('Seed inserted into Supabase.');
}

await ensureTable();
await seed();