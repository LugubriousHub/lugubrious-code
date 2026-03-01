'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Copy, CreditCard, Landmark, ShieldCheck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../components/LanguageProvider';

const planDetails = {
  basic: {
    name: { it: 'Basic', en: 'Basic' },
    priceMensile: '49',
    priceAnnuale: '588',
    features: {
      it: ['Gestione Pratiche', 'Timeline Familiare', 'Landing Page Base'],
      en: ['Case Management', 'Family Timeline', 'Basic Landing Page']
    }
  },
  pro: {
    name: { it: 'Pro', en: 'Pro' },
    priceMensile: '129',
    priceAnnuale: '1290',
    features: {
      it: ['Tutto il Basic', 'Necrologi IA', 'Legacy Vault', 'Analytics Avanzati'],
      en: ['Everything in Basic', 'AI Obituaries', 'Legacy Vault', 'Advanced Analytics']
    }
  },
  enterprise: {
    name: { it: 'Enterprise', en: 'Enterprise' },
    priceMensile: '299',
    priceAnnuale: '2990',
    features: {
      it: ['Tutto il Pro', 'Gestione Flotta', 'Split Payment', 'API Custom', 'Multi-sede'],
      en: ['Everything in Pro', 'Fleet Management', 'Split Payment', 'Custom API', 'Multi-site']
    }
  }
};

const t = {
  it: {
    loading: 'Caricamento...',
    back: 'Torna indietro',
    activating: 'Stai attivando il piano',
    quote:
      '“Checkout rapido e trasparente: in meno di 2 minuti abbiamo attivato tutta la piattaforma.”',
    s1Title: 'Crea il tuo account agenzia',
    s1Subtitle: 'Inserisci i dati legali per la fatturazione.',
    fields: {
      name: 'Nome',
      surname: 'Cognome',
      workEmail: 'Email Lavorativa',
      company: 'Ragione Sociale',
      vat: 'Partita IVA'
    },
    continue: 'Continua al pagamento',
    validating: 'Verifica dati in corso...',
    s2Title: 'Metodo di pagamento',
    s2Subtitle: 'Transazione crittografata e sicura.',
    expressTitle: 'Express Checkout',
    applePay: 'Paga con Apple Pay',
    googlePay: 'Paga con Google Pay',
    methods: {
      card: 'Carta di Credito',
      paypal: 'PayPal',
      bank: 'Bonifico Istantaneo'
    },
    hostedTitle: 'Checkout ospitato da Stripe',
    hostedText:
      'Per il test non serve inserire i dati qui. Clicca il pulsante di pagamento: i dati carta verranno richiesti direttamente su Stripe.',
    hostedHint: 'Credenziali test Stripe',
    testCard: 'Carta test: 4242 4242 4242 4242',
    testExpiry: 'Scadenza: 12/34',
    testCvc: 'CVC: 123',
    copyTestData: 'Copia dati test',
    copied: 'Copiato',
    cardholder: 'Titolare Carta',
    cardNumber: 'Numero Carta',
    expiry: 'Scadenza (MM/AA)',
    cvc: 'CVC',
    payWithPayPal: 'Paga con PayPal',
    activateBank: 'Attiva Bonifico Istantaneo',
    goBack: 'Indietro',
    payAndActivate: (price) => `Paga €${price} e Attiva`,
    processing: 'Elaborazione...',
    redirecting: 'Reindirizzamento a Stripe...',
    checkoutError: 'Errore durante la creazione del pagamento Stripe.',
    cancelled: 'Pagamento annullato. Puoi riprovare quando vuoi.',
    trustSignals: ['Crittografia AES-256', 'Attivazione istantanea', 'Fatturazione automatica via SDI/Email'],
    poweredByStripe: 'Powered by Stripe',
    poweredByPayPal: 'PayPal',
    cycle: { monthly: '/mese', yearly: '/anno' },
    successTitle: 'La tua agenzia è ora attiva su Lugubrious Hub',
    successText: 'Il tuo hub operativo è pronto. Abbiamo inviato la fattura alla tua email.',
    successCta: 'Vai alla Dashboard Gestionale'
  },
  en: {
    loading: 'Loading...',
    back: 'Go back',
    activating: 'You are activating the',
    quote:
      '“Fast and transparent checkout: our agency was fully activated in less than 2 minutes.”',
    s1Title: 'Create your agency account',
    s1Subtitle: 'Enter your legal details for billing.',
    fields: {
      name: 'Name',
      surname: 'Surname',
      workEmail: 'Work Email',
      company: 'Company Name',
      vat: 'VAT Number'
    },
    continue: 'Continue to payment',
    validating: 'Validating details...',
    s2Title: 'Payment method',
    s2Subtitle: 'Encrypted and secure transaction.',
    expressTitle: 'Express Checkout',
    applePay: 'Pay with Apple Pay',
    googlePay: 'Pay with Google Pay',
    methods: {
      card: 'Credit Card',
      paypal: 'PayPal',
      bank: 'Instant Bank Transfer'
    },
    hostedTitle: 'Stripe hosted checkout',
    hostedText:
      'No need to enter card details here for testing. Click pay and Stripe will collect payment data on the hosted page.',
    hostedHint: 'Stripe test credentials',
    testCard: 'Test card: 4242 4242 4242 4242',
    testExpiry: 'Expiry: 12/34',
    testCvc: 'CVC: 123',
    copyTestData: 'Copy test data',
    copied: 'Copied',
    cardholder: 'Cardholder Name',
    cardNumber: 'Card Number',
    expiry: 'Expiry (MM/YY)',
    cvc: 'CVC',
    payWithPayPal: 'Pay with PayPal',
    activateBank: 'Enable Instant Bank Transfer',
    goBack: 'Back',
    payAndActivate: (price) => `Pay €${price} and Activate`,
    processing: 'Processing...',
    redirecting: 'Redirecting to Stripe...',
    checkoutError: 'Error creating Stripe checkout session.',
    cancelled: 'Payment canceled. You can try again anytime.',
    trustSignals: ['Secure AES-256 Encryption', 'Instant activation', 'Automatic invoicing via SDI/Email'],
    poweredByStripe: 'Powered by Stripe',
    poweredByPayPal: 'PayPal',
    cycle: { monthly: '/month', yearly: '/year' },
    successTitle: 'Your agency is now active on Lugubrious Hub',
    successText: 'Your operational hub is ready. We have sent the invoice to your email.',
    successCta: 'Go to Management Dashboard'
  }
};

const transition = { duration: 0.3, ease: 'easeOut' };

function CheckoutContent() {
  const { language: globalLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const locale = langParam === 'it' || langParam === 'en' ? langParam : globalLanguage;
  const copy = t[locale];

  const planId = searchParams.get('plan') || 'pro';
  const billing = searchParams.get('billing') || 'mensile';
  const checkoutStatus = searchParams.get('checkout');
  const checkoutSessionId = searchParams.get('session_id');
  const isAnnual = billing === 'annuale' || billing === 'yearly' || billing === 'annual';

  const currentPlan = planDetails[planId] || planDetails.pro;
  const currentPriceRaw = isAnnual ? currentPlan.priceAnnuale : currentPlan.priceMensile;
  const currentPriceValue = Number(currentPriceRaw);
  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-US', {
        maximumFractionDigits: 0
      }).format(currentPriceValue),
    [currentPriceValue, locale]
  );

  const currentPlanName = currentPlan.name[locale];
  const currentPlanFeatures = currentPlan.features[locale];
  const cycleLabel = isAnnual ? copy.cycle.yearly : copy.cycle.monthly;

  const [step, setStep] = useState(checkoutStatus === 'success' ? 3 : 1);
  const [isValidatingStep1, setIsValidatingStep1] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(checkoutStatus === 'cancel' ? copy.cancelled : '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [copied, setCopied] = useState(false);
  const [emailNotificationSent, setEmailNotificationSent] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function notifyPayment() {
      if (checkoutStatus !== 'success' || !checkoutSessionId || emailNotificationSent) return;
      try {
        const response = await fetch('/api/stripe/notify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: checkoutSessionId })
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'Payment notification failed.');
        }

        if (!ignore) setEmailNotificationSent(true);
      } catch (error) {
        console.error('Checkout email notification error:', error);
      }
    }

    notifyPayment();
    return () => {
      ignore = true;
    };
  }, [checkoutStatus, checkoutSessionId, emailNotificationSent]);

  const handlePay = async () => {
    setIsProcessing(true);
    setCheckoutError('');
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billing,
          paymentMethod,
          locale
        })
      });
      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || copy.checkoutError);
      }

      window.location.href = data.url;
    } catch (error) {
      setIsProcessing(false);
      setCheckoutError(error instanceof Error ? error.message : copy.checkoutError);
    }
  };

  const handleContinueToPayment = () => {
    setIsValidatingStep1(true);
    setTimeout(() => {
      setIsValidatingStep1(false);
      setStep(2);
    }, 900);
  };

  const handleCopyTestData = async () => {
    const payload = `${copy.testCard}\n${copy.testExpiry}\n${copy.testCvc}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500';

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
      <aside className="relative hidden h-full w-1/3 flex-col justify-between overflow-hidden border-r border-white/5 bg-[#0B0F19] p-10 lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-purple-600/25 blur-[120px]" />
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Lugubrious Hub</p>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" /> {copy.back}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm text-slate-300">
            {copy.activating} {currentPlanName}
          </p>
          <p className="mt-2 text-5xl font-semibold text-white">
            €{formattedPrice}
            <span className="ml-1 text-base font-normal text-slate-400">{cycleLabel}</span>
          </p>
          <div className="mt-6 space-y-3">
            {currentPlanFeatures.map((item) => (
              <p key={item} className="inline-flex items-center gap-2 text-sm text-slate-200">
                <Check className="h-4 w-4 text-emerald-300" /> {item}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-300">{copy.quote}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1">
              {copy.poweredByStripe}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1">
              {copy.poweredByPayPal}
            </span>
          </div>
        </div>
      </aside>

      <section className="relative flex h-full w-full items-center justify-center p-6 lg:w-2/3 lg:p-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={transition}
                className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 p-7 backdrop-blur-2xl"
              >
                <h2 className="text-4xl font-semibold">{copy.s1Title}</h2>
                <p className="mt-2 text-slate-300">{copy.s1Subtitle}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} placeholder={copy.fields.name} />
                  <input className={fieldClass} placeholder={copy.fields.surname} />
                  <input className={`${fieldClass} sm:col-span-2`} placeholder={copy.fields.workEmail} type="email" />
                  <input className={fieldClass} placeholder={copy.fields.company} />
                  <input className={fieldClass} placeholder={copy.fields.vat} />
                </div>

                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={isValidatingStep1}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                    isValidatingStep1 ? 'animate-pulse' : ''
                  }`}
                >
                  {isValidatingStep1 ? copy.validating : copy.continue}
                </button>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={transition}
                className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 p-7 backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-4xl font-semibold">{copy.s2Title}</h2>
                    <p className="mt-2 text-slate-300">{copy.s2Subtitle}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> {copy.poweredByStripe}
                  </span>
                </div>

                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-slate-400">{copy.expressTitle}</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    {copy.applePay}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    {copy.googlePay}
                  </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      paymentMethod === 'card'
                        ? 'border-violet-400/60 bg-violet-500/10 text-violet-200'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {copy.methods.card}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      paymentMethod === 'paypal'
                        ? 'border-violet-400/60 bg-violet-500/10 text-violet-200'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {copy.methods.paypal}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      paymentMethod === 'bank'
                        ? 'border-violet-400/60 bg-violet-500/10 text-violet-200'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {copy.methods.bank}
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  {paymentMethod === 'card' ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{copy.hostedTitle}</p>
                          <p className="mt-1 text-sm text-slate-300">{copy.hostedText}</p>
                        </div>
                        <CreditCard className="h-5 w-5 text-sky-300" />
                      </div>

                      <div className="mt-4 rounded-xl border border-white/10 bg-[#050812] p-3 text-sm text-slate-200">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{copy.hostedHint}</p>
                        <p className="mt-2">{copy.testCard}</p>
                        <div className="mt-1 flex flex-wrap gap-3 text-slate-300">
                          <span>{copy.testExpiry}</span>
                          <span>{copy.testCvc}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyTestData}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.08]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copied ? copy.copied : copy.copyTestData}
                      </button>
                    </div>
                  ) : null}

                  {paymentMethod === 'paypal' ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl border border-sky-300/40 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-200 hover:bg-sky-500/20"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        {copy.payWithPayPal}
                      </button>
                      <p className="text-xs text-slate-400">{copy.hostedText}</p>
                    </>
                  ) : null}

                  {paymentMethod === 'bank' ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20"
                      >
                        <Landmark className="mr-2 h-4 w-4" />
                        {copy.activateBank}
                      </button>
                      <p className="text-xs text-slate-400">{copy.hostedText}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-slate-400 transition hover:text-slate-200"
                  >
                    {copy.goBack}
                  </button>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isProcessing}
                    className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                      isProcessing ? 'animate-pulse' : ''
                    }`}
                  >
                    {isProcessing ? copy.redirecting : copy.payAndActivate(formattedPrice)}
                  </button>
                </div>
                {checkoutError ? (
                  <p className="mt-3 rounded-xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                    {checkoutError}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {copy.trustSignals.map((signal) => (
                    <span key={signal} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1">
                      {signal}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={transition}
                className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 p-10 text-center backdrop-blur-2xl"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-500/50 bg-green-500/20"
                >
                  <Check className="h-10 w-10 text-green-400" />
                </motion.div>
                <h2 className="mt-6 text-4xl font-semibold">{copy.successTitle}</h2>
                <p className="mx-auto mt-3 max-w-xl text-slate-300">{copy.successText}</p>
                <Link
                  href="/b2b/dashboard"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-4 text-base font-semibold text-white transition hover:from-sky-400 hover:to-violet-400"
                >
                  {copy.successCta}
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="grid h-screen place-items-center bg-[#050505] text-white">{t.it.loading}</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
