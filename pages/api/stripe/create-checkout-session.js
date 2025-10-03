
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).json({ error: 'Method Not Allowed' }); }
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

  const { email, mode = 'subscription', price = process.env.STRIPE_PRICE_PRO_MONTH, success_url, cancel_url } = req.body || {};
  if (!price) return res.status(400).json({ error: 'Missing price' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: success_url || `${process.env.NEXTAUTH_URL || ''}/admin?checkout=success`,
      cancel_url: cancel_url || `${process.env.NEXTAUTH_URL || ''}/pricing?checkout=cancelled`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      metadata: { app: 'adshield-ai' }
    });
    return res.status(200).json({ id: session.id, url: session.url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
