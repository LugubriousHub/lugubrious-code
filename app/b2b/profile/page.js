'use client';

import { Building2, Palette, ShieldCheck, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import InternalHeader from '../../../components/InternalHeader';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

const presetColors = ['#0ea5e9', '#8b5cf6', '#2563eb', '#14b8a6', '#f59e0b'];

export default function B2BProfilePage() {
  const { language } = useLanguage();
  const t = copy[language].b2bProfilePage;
  const [logoName, setLogoName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const context =
      language === 'it'
        ? 'Pagina corrente: Profilo Agenzia. Sezioni: Informazioni Legali e Fiscali, Account Amministratore, Personalizzazione Brand (White-label).'
        : 'Current page: Agency Profile. Sections: Legal and Fiscal Information, Administrator Account, Brand Personalization (White-label).';

    window.localStorage.setItem('lugubrious-page-context', context);
  }, [language]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setLogoName(file ? file.name : '');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <InternalHeader />
      <main className="mx-auto w-[95%] max-w-6xl pb-10 pt-24">
        <section className="rounded-2xl border border-white/5 bg-[#0B0F19]/80 p-6 backdrop-blur-xl">
          <h1 className="text-4xl font-semibold text-white">{t.title}</h1>
          <p className="mt-2 text-slate-300">{t.subtitle}</p>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Building2 className="h-4 w-4 text-sky-300" />
                </span>
                <h2 className="text-lg font-semibold text-white">{t.legalCard.title}</h2>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  [t.legalCard.companyName, t.legalCard.companyValue],
                  [t.legalCard.vat, t.legalCard.vatValue],
                  [t.legalCard.office, t.legalCard.officeValue],
                  [t.legalCard.sdi, t.legalCard.sdiValue]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm text-white">{value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <ShieldCheck className="h-4 w-4 text-violet-300" />
                </span>
                <h2 className="text-lg font-semibold text-white">{t.adminCard.title}</h2>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  [t.adminCard.fullName, t.adminCard.fullNameValue],
                  [t.adminCard.role, t.adminCard.roleValue],
                  [t.adminCard.accessEmail, t.adminCard.accessEmailValue]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm text-white">{value}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 transition hover:bg-white/[0.1]"
              >
                {t.adminCard.changePassword}
              </button>
            </article>

            <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Palette className="h-4 w-4 text-emerald-300" />
                </span>
                <h2 className="text-lg font-semibold text-white">{t.brandCard.title}</h2>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{t.brandCard.uploadLabel}</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 transition hover:bg-white/[0.1]"
                  >
                    <Upload className="h-4 w-4" />
                    {t.brandCard.uploadCta}
                  </button>
                  <p className="mt-2 text-xs text-slate-300">
                    {logoName ? `${t.brandCard.selectedFile}: ${logoName}` : t.brandCard.noFile}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{t.brandCard.primaryColor}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPrimaryColor(color)}
                        className={`h-7 w-7 rounded-full border transition ${
                          primaryColor === color ? 'scale-110 border-white/80' : 'border-white/20'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      />
                    ))}
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(event) => setPrimaryColor(event.target.value)}
                      className="h-7 w-10 cursor-pointer rounded border border-white/20 bg-transparent"
                      aria-label={t.brandCard.primaryColor}
                    />
                  </div>
                </div>

                <p className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-slate-300">{t.brandCard.helper}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
