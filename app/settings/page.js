'use client';

import { Bell, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import InternalHeader from '../../components/InternalHeader';
import { useLanguage } from '../../components/LanguageProvider';
import { copy } from '../lib/translations';

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

export default function SettingsPage() {
  const { language } = useLanguage();
  const t = copy[language].settingsPage;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);
  const [vaultEnabled, setVaultEnabled] = useState(true);

  useEffect(() => {
    const context =
      language === 'it'
        ? 'Pagina corrente: Impostazioni famiglia. Sezioni: Notifiche e Aggiornamenti, Privacy e Memoria Digitale con toggle interattivi.'
        : 'Current page: Family settings. Sections: Notifications and Updates, Privacy and Digital Memory with interactive toggles.';
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
                <h2 className="font-serif text-xl text-white">{t.sections.notifications}</h2>
              </div>

              <div className="mt-4 space-y-3">
                <ToggleRow
                  label={t.notifications}
                  checked={notificationsEnabled}
                  onText={t.states.on}
                  offText={t.states.off}
                  onChange={() => setNotificationsEnabled((prev) => !prev)}
                />
              </div>
            </article>

            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Shield className="h-4 w-4 text-violet-300" />
                </span>
                <h2 className="font-serif text-xl text-white">{t.sections.privacy}</h2>
              </div>

              <div className="mt-4 space-y-3">
                <ToggleRow
                  label={t.dataSharing}
                  checked={dataSharingEnabled}
                  onText={t.states.on}
                  offText={t.states.off}
                  onChange={() => setDataSharingEnabled((prev) => !prev)}
                />
                <ToggleRow
                  label={t.twoFactor}
                  checked={vaultEnabled}
                  onText={t.states.on}
                  offText={t.states.off}
                  onChange={() => setVaultEnabled((prev) => !prev)}
                />
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
