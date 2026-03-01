import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const PLAN_DETAILS = {
  basic: { monthly: 49, annual: 588 },
  pro: { monthly: 129, annual: 1290 },
  enterprise: { monthly: 299, annual: 2990 }
};

function normalizeBilling(value) {
  if (value === 'annuale' || value === 'annual' || value === 'yearly') return 'annual';
  return 'monthly';
}

function paymentMethodTypes(selected) {
  if (selected === 'paypal') return ['paypal'];
  if (selected === 'bank') return ['sepa_debit'];
  return ['card'];
}

export async function POST(request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY missing.' }, { status: 500 });
    }

    const body = await request.json();
    const planId = (body?.planId ?? 'pro').toString().toLowerCase();
    const locale = (body?.locale ?? 'it').toString().toLowerCase() === 'en' ? 'en' : 'it';
    const billingRaw = (body?.billing ?? 'mensile').toString().toLowerCase();
    const selectedMethod = (body?.paymentMethod ?? 'card').toString().toLowerCase();
    const billing = normalizeBilling(billingRaw);
    const plan = PLAN_DETAILS[planId] ?? PLAN_DETAILS.pro;

    const amount = billing === 'annual' ? plan.annual : plan.monthly;
    const unitAmount = Math.round(amount * 100);
    const planName = planId.charAt(0).toUpperCase() + planId.slice(1);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin =
      process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith('http')
        ? process.env.NEXT_PUBLIC_APP_URL
        : new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: paymentMethodTypes(selectedMethod),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: unitAmount,
            product_data: {
              name: `Lugubrious Hub ${planName} - ${billing === 'annual' ? 'Annual' : 'Monthly'}`
            }
          }
        }
      ],
      metadata: {
        planId,
        billing,
        locale,
        paymentMethod: selectedMethod
      },
      success_url: `${origin}/checkout?plan=${planId}&billing=${billingRaw}&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?plan=${planId}&billing=${billingRaw}&checkout=cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('stripe checkout session error:', error);
    return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 });
  }
}

