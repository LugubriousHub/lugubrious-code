'use client';

import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Building2, Check, FileCheck2, HeartHandshake, Instagram, Linkedin, Plus, Quote, Route, Sparkles, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ScrollRevealText from '../components/ScrollRevealText';
import LanguageSwitch from '../components/LanguageSwitch';
import { useLanguage } from '../components/LanguageProvider';
import { copy } from './lib/translations';

const logos = [
  '/logos/giubileo_logo.svg',
  '/logos/logo-exequia.webp',
  '/logos/logo_Bona_2019-1.svg',
  '/logos/logo-full-white.webp',
  '/logos/logo_ofroman_white.png',
  '/logos/logo-astra-cooperativa-torino-onoranze-funebri-col-1.png',
  '/logos/logo_serviziBarbiero_white.png',
  '/logos/taffo-new-logo-tanuba_orizzontale_colorato-5.webp'
];

const featureContent = {
  it: [
    {
      title: 'Logistica Avanzata',
      description:
        'Gestione flotta, turni e disponibilita operative in tempo reale per garantire puntualita e coordinamento.',
      icon: Route
    },
    {
      title: 'Burocrazia Smart',
      description:
        'Autocompilazione guidata di certificati e permessi cimiteriali con controlli rapidi e tracciabilita completa.',
      icon: FileCheck2
    },
    {
      title: 'Memoria Digitale',
      description:
        'Necrologi assistiti da intelligenza artificiale e spazi commemorativi curati con sensibilita e decoro.',
      icon: Sparkles
    },
    {
      title: 'Trasparenza Totale',
      description:
        'Le famiglie monitorano lo stato pratica con aggiornamenti chiari e comunicazioni sempre disponibili.',
      icon: Users
    }
  ],
  en: [
    {
      title: 'Advanced Logistics',
      description:
        'Real-time management of fleet, shifts and staff availability to keep every service aligned and punctual.',
      icon: Route
    },
    {
      title: 'Smart Compliance',
      description:
        'Guided auto-fill for certificates and cemetery permits with faster controls and full traceability.',
      icon: FileCheck2
    },
    {
      title: 'Digital Memory',
      description:
        'AI-assisted obituaries and memorial spaces created with care, dignity and editorial quality.',
      icon: Sparkles
    },
    {
      title: 'Total Transparency',
      description:
        'Families can track case progress with clear updates and respectful communication at every stage.',
      icon: Users
    }
  ]
};

const reviewColumns = {
  it: {
    col1: [
      {
        quote:
          '“Con Lugubrious Hub la gestione dei permessi comunali passa da ore a pochi minuti, con un controllo impeccabile su ogni passaggio.”',
        name: 'Riccardo Brambilla',
        role: 'Titolare',
        agency: 'Onoranze Funebri Brambilla & Co.',
        initials: 'RB'
      },
      {
        quote:
          '“Lo Split Payment ha tolto tensione nelle conversazioni economiche con i familiari e ci permette di restare concentrati sul supporto umano.”',
        name: 'Elena Moretti',
        role: 'Direttrice Operativa',
        agency: 'Moretti Memorie Digitali',
        initials: 'EM'
      },
      {
        quote:
          '“Il Legacy Vault è il nostro fiore all’occhiello: i ricordi arrivano ordinati, pronti per necrologi davvero personali e rispettosi.”',
        name: 'Paolo Silvestri',
        role: 'Responsabile Servizi',
        agency: 'Silvestri Assistenza Funeraria',
        initials: 'PS'
      },
      {
        quote:
          '“Fornitori, fioristi e marmisti finalmente in un unico flusso. Tutto integrato, visibile e tracciato senza chiamate continue.”',
        name: 'Laura Neri',
        role: 'Coordinatrice',
        agency: 'Neri Servizi Funebri',
        initials: 'LN'
      }
    ],
    col2: [
      {
        quote:
          '“Le famiglie sono più serene: vedono lo stato pratica in tempo reale e ci chiamano meno, ma con domande molto più chiare.”',
        name: 'Francesca Loria',
        role: 'Case Manager',
        agency: 'Loria Funeral Care',
        initials: 'FL'
      },
      {
        quote:
          '“È raro trovare una piattaforma che unisca efficienza operativa e solennità comunicativa. Lugubrious Hub ci è riuscita.”',
        name: 'Giovanni Valenti',
        role: 'Fondatore',
        agency: 'Valenti Hub Funerario',
        initials: 'GV'
      },
      {
        quote:
          '“La logistica della flotta è impeccabile: turni e disponibilità aggiornati in un colpo d’occhio, anche nei giorni più intensi.”',
        name: 'Marco Ferrari',
        role: 'Responsabile Logistica',
        agency: 'Ferrari Funeral Network',
        initials: 'MF'
      },
      {
        quote:
          '“L’IA per i necrologi è delicata e precisa. Riduce i tempi di scrittura senza perdere tono, cura e umanità.”',
        name: 'Giulia Costa',
        role: 'Direttrice Editoriale',
        agency: 'Costa Servizi Commemorativi',
        initials: 'GC'
      }
    ],
    col3: [
      {
        quote:
          '“Il passaggio al digitale è stato facilissimo: il team ha adottato il sistema in pochi giorni senza bloccare l’operatività.”',
        name: 'Andrea Donati',
        role: 'Amministratore',
        agency: 'Donati Onoranze',
        initials: 'AD'
      },
      {
        quote:
          '“Con il nuovo flusso risparmiamo circa tre ore al giorno di lavoro amministrativo. È un guadagno concreto e quotidiano.”',
        name: 'Sara Rinaldi',
        role: 'Operations Lead',
        agency: 'Rinaldi Funeral Management',
        initials: 'SR'
      },
      {
        quote:
          '“Trasparenza totale sui costi: il preventivo è chiaro per tutti e le famiglie percepiscono subito ordine e correttezza.”',
        name: 'Alberto Marini',
        role: 'Responsabile Clienti',
        agency: 'Marini Assistenza Funebre',
        initials: 'AM'
      },
      {
        quote:
          '“L’assistenza è eccezionale: risposte rapide, concrete e sempre orientate a soluzioni pratiche per il nostro lavoro.”',
        name: 'Elisa Conte',
        role: 'Direttrice Agenzia',
        agency: 'Conte Servizi Memoriali',
        initials: 'EC'
      }
    ]
  },
  en: {
    col1: [
      {
        quote:
          '“With Lugubrious Hub, municipal permits move from hours to minutes, with full control across every step.”',
        name: 'Riccardo Brambilla',
        role: 'Owner',
        agency: 'Brambilla & Co. Funeral Services',
        initials: 'RB'
      },
      {
        quote:
          '“Split Payment removed tension from financial conversations with families and lets us focus on human support.”',
        name: 'Elena Moretti',
        role: 'Operations Director',
        agency: 'Moretti Digital Memories',
        initials: 'EM'
      },
      {
        quote:
          '“Legacy Vault is our standout feature: memories arrive structured and ready for deeply personal, respectful obituaries.”',
        name: 'Paolo Silvestri',
        role: 'Service Manager',
        agency: 'Silvestri Funeral Assistance',
        initials: 'PS'
      },
      {
        quote:
          '“Suppliers, florists and stone partners are finally in one flow. Fully integrated, visible and traceable.”',
        name: 'Laura Neri',
        role: 'Coordinator',
        agency: 'Neri Funeral Services',
        initials: 'LN'
      }
    ],
    col2: [
      {
        quote:
          '“Families are calmer now: they can see real-time case status and contact us with clearer, more focused requests.”',
        name: 'Francesca Loria',
        role: 'Case Manager',
        agency: 'Loria Funeral Care',
        initials: 'FL'
      },
      {
        quote:
          '“It is rare to find a platform that combines operational efficiency with solemn communication. Lugubrious Hub does both.”',
        name: 'Giovanni Valenti',
        role: 'Founder',
        agency: 'Valenti Funeral Hub',
        initials: 'GV'
      },
      {
        quote:
          '“Fleet logistics are impeccable: shifts and availability are always visible, even on the busiest days.”',
        name: 'Marco Ferrari',
        role: 'Logistics Manager',
        agency: 'Ferrari Funeral Network',
        initials: 'MF'
      },
      {
        quote:
          '“The obituary AI is delicate and precise. It cuts writing time while preserving tone, care and dignity.”',
        name: 'Giulia Costa',
        role: 'Editorial Director',
        agency: 'Costa Memorial Services',
        initials: 'GC'
      }
    ],
    col3: [
      {
        quote:
          '“Going digital was effortless: our team adopted the platform in days without disrupting operations.”',
        name: 'Andrea Donati',
        role: 'Managing Director',
        agency: 'Donati Funeral Agency',
        initials: 'AD'
      },
      {
        quote:
          '“We save around three hours per day in administrative work. The operational impact is immediate and measurable.”',
        name: 'Sara Rinaldi',
        role: 'Operations Lead',
        agency: 'Rinaldi Funeral Management',
        initials: 'SR'
      },
      {
        quote:
          '“Complete cost transparency: quotes are clear for everyone and families instantly perceive order and fairness.”',
        name: 'Alberto Marini',
        role: 'Client Services Lead',
        agency: 'Marini Funeral Assistance',
        initials: 'AM'
      },
      {
        quote:
          '“Support is exceptional: quick, concrete answers always focused on practical solutions for our team.”',
        name: 'Elisa Conte',
        role: 'Agency Director',
        agency: 'Conte Memorial Services',
        initials: 'EC'
      }
    ]
  }
};

export default function HomePage() {
  const { language } = useLanguage();
  const t = copy[language];
  const landing = t.landing;
  const mockup = landing.heroMockup;
  const features = featureContent[language];
  const reviews = reviewColumns[language];
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(0);
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);
  const col1Controls = useAnimation();
  const col2Controls = useAnimation();
  const col3Controls = useAnimation();

  useEffect(() => {
    if (isReviewsPaused) {
      col1Controls.stop();
      col2Controls.stop();
      col3Controls.stop();
      return;
    }

    col1Controls.start({
      y: ['0%', '-50%'],
      transition: { duration: 35, repeat: Infinity, ease: 'linear' }
    });
    col2Controls.start({
      y: ['-50%', '0%'],
      transition: { duration: 45, repeat: Infinity, ease: 'linear' }
    });
    col3Controls.start({
      y: ['0%', '-50%'],
      transition: { duration: 40, repeat: Infinity, ease: 'linear' }
    });
  }, [col1Controls, col2Controls, col3Controls, isReviewsPaused, language]);

  return (
    <main className="min-h-screen bg-[#020617] px-6 pb-12 pt-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="surface flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
              <HeartHandshake className="h-4 w-4 text-sky-300" />
            </span>
            {landing.brandName}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-300">
              <a href="#funzionalita" className="rounded-full px-3 py-1.5 hover:bg-white/10">
                {t.nav.features}
              </a>
              <a href="#agenzie" className="rounded-full px-3 py-1.5 hover:bg-white/10">
                {t.nav.agencies}
              </a>
              <a href="#famiglie" className="rounded-full px-3 py-1.5 hover:bg-white/10">
                {t.nav.families}
              </a>
            </nav>
            <LanguageSwitch />
          </div>

          <Link href="/login" className="btn-primary !rounded-full !px-4 !py-2">
            {t.nav.accessHub} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </header>

        <section id="agenzie" className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center pt-32 pb-16 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs tracking-[0.16em] text-sky-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.65)]" />
              {landing.heroTag}
            </span>

            <h1 className="mb-8 w-full text-5xl font-serif font-medium leading-[1.1] tracking-normal md:text-7xl lg:text-[5.5rem]">
              <span className="text-white">{`${landing.heroTitleLead} `}</span>
              <span className="whitespace-nowrap bg-gradient-to-r from-blue-400 via-purple-400 to-white bg-clip-text text-transparent">
                {landing.heroTitleAccent}
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-400">
              {landing.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/login" className="btn-primary">
                {t.nav.accessHub}
              </Link>
              <a href="#funzionalita" className="btn-secondary">
                {t.landing.exploreModules}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 10 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="relative mx-auto mt-24 w-full max-w-5xl [perspective:2000px]"
          >
            <div className="flex h-[500px] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0B0F19]/95 shadow-[0_-20px_80px_rgba(139,92,246,0.15)] backdrop-blur-3xl [transform:rotateX(12deg)_translateY(40px)]">
              <div className="flex h-12 items-center border-b border-white/5 bg-white/[0.02] px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <p className="mx-auto text-[10px] uppercase tracking-widest text-gray-500">{landing.brandName}</p>
                <div className="hidden items-center gap-4 text-xs text-gray-400 md:flex">
                  <span>{mockup.topMenu.overview}</span>
                  <span>{mockup.topMenu.practices}</span>
                  <span>{mockup.topMenu.billing}</span>
                </div>
              </div>

              <div className="flex h-full gap-6 p-6">
                <aside className="w-48 flex-col gap-2 border-r border-white/5 pr-6 hidden md:flex">
                  <div className="rounded-lg bg-purple-500/10 px-3 py-2 font-medium text-purple-400">{mockup.sidebar.dashboard}</div>
                  <div className="rounded-lg px-3 py-2 text-slate-300">{mockup.sidebar.logistics}</div>
                  <div className="rounded-lg px-3 py-2 text-slate-300">{mockup.sidebar.familyCrm}</div>
                  <div className="rounded-lg px-3 py-2 text-slate-300">{mockup.sidebar.settings}</div>
                </aside>

                <div className="flex flex-1 flex-col">
                  <h3 className="mb-4 text-xl font-semibold text-white">{mockup.welcomeBack}</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{mockup.stats.revenueLabel}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{mockup.stats.revenueValue}</p>
                      <p className="mt-1 text-xs text-emerald-300">{mockup.stats.revenueTrend}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{mockup.stats.activeLabel}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{mockup.stats.activeValue}</p>
                      <p className="mt-1 text-xs text-amber-300">{mockup.stats.activeTrend}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{mockup.stats.fleetLabel}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{mockup.stats.fleetValue}</p>
                      <p className="mt-1 text-xs text-sky-300">{mockup.stats.fleetTrend}</p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-white">{mockup.chartTitle}</p>
                    <div className="absolute inset-x-4 top-14 h-px bg-white/10" />
                    <div className="absolute inset-x-4 top-24 h-px bg-white/10" />
                    <div className="absolute inset-x-4 top-[8.5rem] h-px bg-white/10" />
                    <svg viewBox="0 0 700 220" className="absolute inset-x-4 bottom-10 h-[180px] w-[calc(100%-2rem)]">
                      <defs>
                        <linearGradient id="heroOpsLine" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 12 170 C 80 155, 130 170, 205 136 C 275 104, 330 118, 405 80 C 470 48, 540 58, 688 20"
                        fill="none"
                        stroke="url(#heroOpsLine)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-purple-500/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-2">
          <ScrollRevealText text={t.landing.manifestoText} highlightWord={t.landing.manifestoHighlight} />
        </section>

        <section id="funzionalita" className="mt-0">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-transparent bg-transparent p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:bg-white/[0.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                    <Icon className="h-5 w-5 text-sky-300" />
                  </span>
                  <h3 className="mt-5 text-2xl">{feature.title}</h3>
                  <p className="mt-4 text-slate-300">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="famiglie" className="mt-16 border-t border-white/10 pt-14">
          <div className="text-center">
            <Quote className="mx-auto h-10 w-10 text-white/20" />
            <h2 className="mt-4 text-5xl">{t.landing.featuresTitle}</h2>
          </div>

          <div
            className="relative mt-8 h-[700px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
            onMouseEnter={() => setIsReviewsPaused(true)}
            onMouseLeave={() => setIsReviewsPaused(false)}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <motion.div animate={col1Controls} className="space-y-6">
                {[...reviews.col1, ...reviews.col1].map((review, index) => (
                  <article key={`col1-${review.name}-${index}`} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <p className="mb-6 text-[15px] leading-relaxed text-gray-300">{review.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{review.name}</p>
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{`${review.role} · ${review.agency}`}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>

              <motion.div animate={col2Controls} className="space-y-6">
                {[...reviews.col2, ...reviews.col2].map((review, index) => (
                  <article key={`col2-${review.name}-${index}`} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <p className="mb-6 text-[15px] leading-relaxed text-gray-300">{review.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{review.name}</p>
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{`${review.role} · ${review.agency}`}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>

              <motion.div animate={col3Controls} className="space-y-6">
                {[...reviews.col3, ...reviews.col3].map((review, index) => (
                  <article key={`col3-${review.name}-${index}`} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <p className="mb-6 text-[15px] leading-relaxed text-gray-300">{review.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white">
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{review.name}</p>
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{`${review.role} · ${review.agency}`}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-12">
          <p className="text-center text-xs tracking-[0.2em] text-slate-500">{t.landing.logosTitle}</p>
          <div className="ghost-mask mt-6 overflow-hidden py-4">
            <div className="animate-infinite-scroll-slow flex min-w-max items-center gap-20 px-8">
              {[...logos, ...logos].map((logo, index) => (
                <img
                  key={`${logo}-${index}`}
                  src={logo}
                  alt={landing.partnerAlt}
                  className="h-9 w-auto opacity-30 transition duration-300 hover:opacity-100"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mt-16 border-t border-white/10 pt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-4xl">{t.landing.pricingTitle}</h2>
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-3 py-1 text-xs ${
                  billingCycle === 'monthly' ? 'bg-white/15 text-white' : 'text-slate-300'
                }`}
              >
                {t.landing.billingMonthly}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-3 py-1 text-xs ${
                  billingCycle === 'yearly' ? 'bg-white/15 text-white' : 'text-slate-300'
                }`}
              >
                {t.landing.billingYearly}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {t.landing.pricing.map((plan) => {
              const isPro = plan.name === 'Pro';
              const planKey = plan.name.toLowerCase();
              const billingParam = billingCycle === 'yearly' ? 'annuale' : 'mensile';
              const hasAnnualPromo = plan.name === 'Pro' || plan.name === 'Enterprise';
              const monthlyPrice = plan.monthly;
              const yearlyBefore = monthlyPrice * 12;
              const yearlyAfter = hasAnnualPromo ? monthlyPrice * 10 : yearlyBefore;
              const yearlyMonthlyEq = Math.round((yearlyAfter / 12) * 100) / 100;
              const saveAmount = yearlyBefore - yearlyAfter;
              const showingYearly = billingCycle === 'yearly';

              return (
                <Link
                  key={plan.name}
                  href={`/checkout?plan=${planKey}&billing=${billingParam}`}
                  className={`rounded-2xl p-[1px] ${
                    isPro
                      ? 'bg-gradient-to-r from-sky-500/70 via-violet-500/70 to-sky-500/70'
                      : 'border border-white/10 bg-white/[0.04]'
                  } block transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isPro ? 'hover:shadow-violet-500/25' : 'hover:shadow-sky-500/20'
                  }`}
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-[#020617] p-6 transition group-hover:border-sky-300/40">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-2xl">{plan.name}</h3>
                      {isPro ? (
                        <span className="rounded-full border border-sky-300/40 bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-sky-200">
                          {t.landing.recommended}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-slate-300">{plan.description}</p>

                    {showingYearly ? (
                      <div className="mt-4">
                        <div className="flex items-end gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              {t.landing.annualTotalLabel}
                            </p>
                            <p className="text-4xl font-semibold text-white">
                              €{yearlyAfter.toLocaleString(language === 'it' ? 'it-IT' : 'en-IE')}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 line-through">
                            €{monthlyPrice}/{landing.monthShort}
                          </p>
                        </div>
                        {hasAnnualPromo ? (
                          <>
                            <p className="mt-2 inline-flex rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                              {t.landing.saveLabel} €{saveAmount.toLocaleString(language === 'it' ? 'it-IT' : 'en-IE')} - {t.landing.twoMonthsIncluded}
                            </p>
                            <p className="mt-2 text-xs text-slate-300">
                              {t.landing.compareMonthlyPrefix} €{yearlyMonthlyEq.toLocaleString(language === 'it' ? 'it-IT' : 'en-IE')} {t.landing.compareMonthlyMiddle} €{monthlyPrice}
                            </p>
                          </>
                        ) : (
                          <p className="mt-2 text-xs text-slate-400">
                            {landing.yearlyNoPromo}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 text-4xl font-semibold text-white">
                        €{monthlyPrice}
                        <span className="ml-1 text-sm font-normal text-slate-400">
                          /{landing.monthShort}
                        </span>
                      </p>
                    )}

                    <ul className="mt-4 space-y-2 text-sm text-slate-200">
                      {plan.features.map((feature) => (
                        <li key={feature} className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-300" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <span className="btn-primary mt-5 w-full transition duration-300 hover:from-violet-500 hover:to-sky-400">
                      {t.landing.planCta}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="faq" className="mt-16 border-t border-white/10 pt-12">
          <h2 className="text-4xl">{t.landing.faqTitle}</h2>
          <div className="mt-6 grid gap-3">
            {t.landing.faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article key={item.q} className="rounded-xl border border-white/10 bg-white/[0.03]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{item.q}</span>
                    <Plus
                      className={`h-4 w-4 text-slate-300 transition duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden px-4 transition-all duration-300 ${
                      isOpen ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] pb-0 opacity-0'
                    }`}
                  >
                    <p className="min-h-0 text-sm text-slate-300">{item.a}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-2xl bg-gradient-to-r from-sky-500/40 via-violet-500/40 to-sky-500/40 p-[1px]">
          <div className="rounded-2xl bg-[#020617] px-7 py-10 text-center md:px-12 md:py-14">
            <p className="text-sm uppercase tracking-[0.18em] text-violet-200">{t.landing.ctaTag}</p>
            <h2 className="mt-4 text-5xl">{t.landing.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">{t.landing.ctaText}</p>
            <Link href="/login" className="btn-primary mt-7">
              {t.nav.accessHub} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>

        <footer className="mt-16 surface p-8">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2 text-2xl text-white">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
                  <Building2 className="h-4 w-4 text-sky-300" />
                </span>
                {landing.brandName}
              </div>
              <p className="mt-4 max-w-xs text-slate-300">{t.landing.footerTagline}</p>
              <p className="mt-4 text-slate-400">{t.landing.location}</p>
              <div className="mt-5 flex gap-2">
                <a
                  href="https://x.com/lugubrioushub"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                >
                  <X className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/company/lugubrioushub"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/lugubrioushub"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-white">
                <a href="#pricing" className="hover:text-slate-200">
                  {t.landing.platform}
                </a>
              </h3>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>
                  <Link href="/login" className="hover:text-white">
                    {landing.platformLinks.b2b}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    {landing.platformLinks.families}
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    {landing.platformLinks.obituaries}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl text-white">{t.landing.company}</h3>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>
                  <Link href="/about" className="hover:text-white">
                    {landing.companyLinks.about}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    {t.landing.contacts}
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    {landing.companyLinks.support}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl text-white">{t.landing.legal}</h3>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    {landing.legalLinks.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    {landing.legalLinks.terms}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl text-white">{t.landing.contacts}</h3>
              <a href="tel:+39021234567" className="mt-4 block text-slate-300 hover:text-white">
                +39 02 1234567
              </a>
              <a href="mailto:info@lugubrioushub.it" className="mt-2 block text-slate-300 hover:text-white">
                info@lugubrioushub.it
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 text-sm text-slate-400 md:flex md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} {landing.brandName}. {landing.rights}</p>
            <p className="mt-2 inline-flex items-center gap-2 md:mt-0">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              {landing.allSystems}
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
