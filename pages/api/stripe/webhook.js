
import Stripe from 'stripe'; import { setPlanByEmail } from '../../../lib/billing'; import { syncPlanFromSubscriptions } from '../../../lib/credits';
export const config = { api: { bodyParser: false } };
async function buffer(readable){ const chunks=[]; for await (const c of readable) chunks.push(typeof c==='string'?Buffer.from(c):c); return Buffer.concat(chunks); }
export default async function handler(req,res){
  if(req.method!=='POST'){ res.setHeader('Allow',['POST']); return res.status(405).end('Method Not Allowed'); }
  const stripeKey=process.env.STRIPE_SECRET_KEY, webhookSecret=process.env.STRIPE_WEBHOOK_SECRET; if(!stripeKey||!webhookSecret) return res.status(500).end('Missing Stripe keys');
  const stripe=new Stripe(stripeKey,{ apiVersion:'2024-06-20' }); const buf=await buffer(req); const sig=req.headers['stripe-signature'];
  let event; try{ event=stripe.webhooks.constructEvent(buf, sig, webhookSecret); }catch(err){ return res.status(400).send(`Webhook Error: ${err.message}`); }
  try{
    switch(event.type){
      case 'checkout.session.completed': {
        const s=event.data.object; const email=s.customer_details?.email || s.customer_email; const subId=s.subscription; const customerId=s.customer;
        if(email){ await setPlanByEmail(email,{ plan:'pro', status:'active', current_period_end:null, stripe_customer_id:customerId, stripe_subscription_id:subId }); await syncPlanFromSubscriptions(email); }
        break;
      }
      default: break;
    }
  }catch(e){ return res.status(500).send(`Handler Error: ${e.message}`); }
  res.json({ received:true });
}
