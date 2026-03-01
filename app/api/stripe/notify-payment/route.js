import Stripe from 'stripe';
import { NextResponse } from 'next/server';

function normalizeStripeKey() {
  const rawSecret = process.env.STRIPE_SECRET_KEY;
  const rawPrivate = process.env.STRIPE_PRIVATE_KEY;
  return (rawSecret || rawPrivate || '').toString().trim().replace(/^['"]|['"]$/g, '');
}

function normalizeResendKey() {
  const raw = process.env.RESEND_API_KEY || '';
  return raw.toString().trim().replace(/^['"]|['"]$/g, '');
}

function buildEmailHtml({ planId, billing, amount, sessionId }) {
  const billingLabel = billing === 'annual' ? 'Annuale' : 'Mensile';
  const plan = (planId || 'pro').toUpperCase();
  const formattedAmount = typeof amount === 'number' ? `€${amount.toFixed(2)}` : 'N/D';

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <h2 style="margin:0 0 12px;">Pagamento ricevuto - Lugubrious Hub</h2>
      <p style="margin:0 0 8px;">Un nuovo pagamento e stato confermato su Stripe.</p>
      <p style="margin:0 0 4px;"><strong>Piano:</strong> ${plan}</p>
      <p style="margin:0 0 4px;"><strong>Ciclo:</strong> ${billingLabel}</p>
      <p style="margin:0 0 4px;"><strong>Importo:</strong> ${formattedAmount}</p>
      <p style="margin:0 0 4px;"><strong>Sessione:</strong> ${sessionId}</p>
    </div>
  `;
}

export async function POST(request) {
  try {
    const stripeSecretKey = normalizeStripeKey();
    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
      return NextResponse.json({ error: 'Stripe secret key missing or invalid.' }, { status: 500 });
    }

    const resendApiKey = normalizeResendKey();
    if (!resendApiKey || !resendApiKey.startsWith('re_')) {
      return NextResponse.json({ error: 'Resend API key missing or invalid.' }, { status: 500 });
    }

    const body = await request.json();
    const sessionId = (body?.sessionId || '').toString().trim();
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed yet.' }, { status: 409 });
    }

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent?.metadata?.resend_notified === 'true') {
        return NextResponse.json({ ok: true, skipped: true, reason: 'already_notified' });
      }
    }

    const toEmail = process.env.RESEND_TO_EMAIL || 'eduardo.acquaviva@student.h-farm.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const planId = session.metadata?.planId || 'pro';
    const billing = session.metadata?.billing || 'monthly';
    const amount = (session.amount_total || 0) / 100;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `Pagamento confermato - Piano ${planId.toUpperCase()}`,
        html: buildEmailHtml({ planId, billing, amount, sessionId })
      })
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      return NextResponse.json({ error: `Resend error: ${resendError}` }, { status: 502 });
    }

    if (paymentIntentId) {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: { resend_notified: 'true' }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('notify payment error:', error);
    return NextResponse.json({ error: 'Unable to notify payment via email.' }, { status: 500 });
  }
}

