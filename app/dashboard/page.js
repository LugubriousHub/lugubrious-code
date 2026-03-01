'use client';

import Link from 'next/link';
import { useLanguage } from '../../components/LanguageProvider';

const modules = {
  it: [
    {
      title: 'Area Agenzia',
      description: 'Gestione operativa completa: pratiche, logistica, preventivi, ordini e necrologi.',
      href: '/b2b/dashboard',
      cta: 'Apri modulo B2B'
    },
    {
      title: 'Area Famiglia',
      description: 'Aggiornamenti rassicuranti, avanzamento pratica e prossimi passaggi in trasparenza.',
      href: '/consumer/dashboard',
      cta: 'Apri dashboard famiglia'
    }
  ],
  en: [
    {
      title: 'Agency Area',
      description: 'Full operations management: cases, logistics, quotes, suppliers and obituaries.',
      href: '/b2b/dashboard',
      cta: 'Open B2B module'
    },
    {
      title: 'Family Area',
      description: 'Reassuring updates, case progress and clear next steps for relatives.',
      href: '/consumer/dashboard',
      cta: 'Open family dashboard'
    }
  ]
};

const stats = {
  it: ['Pratiche attive', 'Eventi in calendario', 'Famiglie monitorate'],
  en: ['Active cases', 'Scheduled events', 'Tracked families']
};

export default function DashboardHubPage() {
  const { language } = useLanguage();

  return (
    <section>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {language === 'it' ? 'Centro di controllo' : 'Control center'}
      </p>
      <h2 className="mt-2 text-4xl font-semibold">
        {language === 'it' ? 'Dashboard Unificata' : 'Unified Dashboard'}
      </h2>
      <p className="mt-3 max-w-3xl text-slate-300">
        {language === 'it'
          ? 'Un unico ambiente per navigare tutte le funzioni di Lugubrious Hub con interfaccia coerente.'
          : 'A single environment to navigate all Lugubrious Hub functions with a consistent interface.'}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {modules[language].map((module) => (
          <article key={module.title} className="surface-soft p-6">
            <h3 className="text-2xl font-semibold">{module.title}</h3>
            <p className="mt-3 text-slate-300">{module.description}</p>
            <Link href={module.href} className="btn-primary mt-5">
              {module.cta}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[31, 12, 18].map((value, i) => (
          <article key={i} className="surface-soft p-4">
            <p className="text-sm text-slate-400">{stats[language][i]}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
