'use client';

import InternalHeader from '../../components/InternalHeader';
import { useLanguage } from '../../components/LanguageProvider';
import { copy } from '../lib/translations';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { language } = useLanguage();
  const t = copy[language].profilePage;

  useEffect(() => {
    const context =
      language === 'it'
        ? 'Pagina corrente: Profilo famiglia. Campi principali: Referente Pratica, Relazione con il defunto, Codice Pratica Attivo. Supporta aggiornamento contatti di emergenza.'
        : 'Current page: Family profile. Main fields: Case Contact, Relation to the deceased, Active Case Code. Supports emergency contact updates.';
    window.localStorage.setItem('lugubrious-page-context', context);
  }, [language]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <InternalHeader />
      <main className="mx-auto w-[95%] max-w-4xl pb-10 pt-24">
        <section className="surface p-6">
          <h1 className="text-4xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-slate-300">{t.subtitle}</p>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-xl font-semibold">{t.sectionTitle}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.roleLabel}</p>
                <p className="mt-1 text-sm text-white">{t.roleValue}</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.relationLabel}</p>
                <p className="mt-1 text-sm text-white">{t.relationValue}</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.caseCodeLabel}</p>
                <p className="mt-1 text-sm text-white">{t.caseCodeValue}</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.emailLabel}</p>
                <p className="mt-1 text-sm text-white">martina.colombo@lugubrioushub.it</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.languageLabel}</p>
                <p className="mt-1 text-sm text-white">{language === 'it' ? 'Italiano' : 'English'}</p>
              </article>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-xl font-semibold">{t.emergencyTitle}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.emergencyPrimary}</p>
                <p className="mt-1 text-sm text-white">Giulia Casadei - +39 333 1200456</p>
              </article>
              <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{t.emergencySecondary}</p>
                <p className="mt-1 text-sm text-white">Andrea Casadei - +39 333 9988741</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
