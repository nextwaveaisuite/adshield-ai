
import { getServerSupabase } from '../../lib/db';
import { addAudit } from '../../lib/audit';
import { rateLimit } from '../../lib/rate';
import { isBlocked } from '../../lib/abuse';

const COUNTRIES = ['US','CA'];
const STATES = { US: ['CA','NY','TX','FL'], CA: ['ON','BC','QC'] };
const OFFERS = ['sofa','laptop','car','service','appliance'];
const ZIPS_US = ['94107','11201','73301','33101'];
const ZIPS_CA = ['M5V','V6B','H2Y'];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

export default async function handler(req,res){
  if(req.method!=='POST'){ res.setHeader('Allow',['POST']); return res.status(405).json({ ok:false, error:'Method Not Allowed' }); }
  if(!(await rateLimit(req,res,{ windowSec:30, max:5 }))) return;
  if(isBlocked(req)) return res.status(429).json({ ok:false, error:'Blocked' });

  const supabase=getServerSupabase(); if(!supabase) return res.status(500).json({ ok:false, error:'Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE' });
  const { count=200 } = typeof req.body==='string' ? JSON.parse(req.body) : (req.body||{});
  const rows = [];
  for(let i=0;i<count;i++){
    const country = pick(COUNTRIES);
    const state = pick(STATES[country]);
    const zip = country==='US' ? pick(ZIPS_US) : pick(ZIPS_CA);
    const offer_type = pick(OFFERS);
    const event = pick(['post','click','lead','sale','post','post','click']); // weight towards post/click
    rows.push({ event, payload:{ v:1 }, country, state, zip, offer_type, user_id:'seed' });
  }
  const { error } = await supabase.from('events').insert(rows);
  if(error) return res.status(500).json({ ok:false, error: error.message });
  await addAudit('seed_events',{ inserted: rows.length });
  return res.status(200).json({ ok:true, inserted: rows.length });
}
