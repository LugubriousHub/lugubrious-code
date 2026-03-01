'use client';

import { Bell, Link as LinkIcon, Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';
import InternalHeader from '../../../components/InternalHeader';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

function ToggleRow({ label, checked, onChange, onText, offText }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="pr-3 text-sm text-slate-100">{label}</div>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${checked ? 'text-emerald-300' : 'text-slate-400'}`}>{checked ? onText : offText}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={onChange}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            checked ? 'bg-purple-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </label>
  );
}

export default function B2BSettingsPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bSettingsPage;

  const [operationalToggles, setOperationalToggles] = useState([true, true, false]);
  const [automationToggles, setAutomationToggles] = useState([true, false]);

  useEffect(() => {
    const context =
      language === 'it'
        ? 'Pagina corrente: Impostazioni Agenzia. Sezioni: Notifiche Operative, Automazioni Burocratiche, Integrazioni Esterne.'
        : 'Current page: Agency Settings. Sections: Operational Notifications, Bureaucratic Automations, External Integrations.';

    window.localStorage.setItem('lugubrious-page-context', context);
  }, [language]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <InternalHeader />
      <main className="mx-auto w-[95%] max-w-5xl pb-10 pt-24">
        <section className="rounded-2xl border border-white/5 bg-[#0B0F19]/80 p-6 backdrop-blur-xl">
          <h1 className="text-4xl font-semibold text-white">{t.title}</h1>
          <p className="mt-2 text-slate-300">{t.subtitle}</p>

          <div className="mt-6 space-y-4">
            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Bell className="h-4 w-4 text-sky-300" />
                </span>
                <h2 className="text-lg font-semibold text-white">{t.operations.title}</h2>
              </div>

              <div className="mt-4 space-y-3">
                {t.operations.items.map((label, index) => (
                  <ToggleRow
                    key={label}
                    label={label}
                    checked={operationalToggles[index]}
                    onText={t.states.on}
                    offText={t.states.off}
                    onChange={() =>
                      setOperationalToggles((prev) => prev.map((item, i) => (i === index ? !item : item)))
                    }
                  />
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Workflow className="h-4 w-4 text-violet-300" />
                </span>
                <h2 className="text-lg font-semibold text-white">{t.automations.title}</h2>
              </div>

              <div className="mt-4 space-y-3">
                {t.automations.items.map((label, index) => (
                  <ToggleRow
                    key={label}
                    label={label}
                    checked={automationToggles[index]}
                    onText={t.states.on}
                    offText={t.states.off}
                    onChange={() =>
                      setAutomationToggles((prev) => prev.map((item, i) => (i === index ? !item : item)))
                    }
                  />
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <LinkIcon className="h-4 w-4 text-emerald-300" />
                </span>
                <h2 className="text-lg font-semibold text-white">{t.integrations.title}</h2>
              </div>
              <p className="mt-2 text-sm text-slate-300">{t.integrations.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-100 transition hover:bg-white/[0.1]"
                >
                  {t.integrations.stripe}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-100 transition hover:bg-white/[0.1]"
                >
                  {t.integrations.sdi}
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
