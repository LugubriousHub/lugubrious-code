'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Building2, HeartHandshake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLanguage } from '../../components/LanguageProvider';
import { copy } from '../lib/translations';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language].login;
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerData, setRegisterData] = useState({
    agencyName: '',
    vat: '',
    email: '',
    password: ''
  });

  const handleRegisterField = (field) => (event) => {
    setRegisterData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/b2b/dashboard');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto flex min-h-[82vh] w-full max-w-6xl flex-col justify-center">
        <section className="surface p-8 md:p-12">
          <div className="mb-6 flex justify-end">
            <LanguageSwitch />
          </div>
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{t.tag}</p>
            <h1 className="mt-4 text-5xl md:text-6xl">{t.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {t.subtitle}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {isRegistering ? (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="mx-auto mt-10 w-full max-w-3xl"
              >
                <div className="surface-soft p-7 md:p-8">
                  <h2 className="text-center text-4xl md:text-5xl">{t.registerTitle}</h2>
                  <p className="mx-auto mt-3 max-w-2xl text-center text-slate-300">{t.registerSubtitle}</p>

                  <form onSubmit={handleRegister} className="mt-8 grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-200">
                      {t.registerFields.agencyName}
                      <input
                        value={registerData.agencyName}
                        onChange={handleRegisterField('agencyName')}
                        placeholder={t.registerPlaceholders.agencyName}
                        required
                        className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-200">
                      {t.registerFields.vat}
                      <input
                        value={registerData.vat}
                        onChange={handleRegisterField('vat')}
                        placeholder={t.registerPlaceholders.vat}
                        required
                        className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-200">
                      {t.registerFields.email}
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterField('email')}
                        placeholder={t.registerPlaceholders.email}
                        required
                        className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-200">
                      {t.registerFields.password}
                      <input
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterField('password')}
                        placeholder={t.registerPlaceholders.password}
                        required
                        className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </label>

                    <div className="mt-2 md:col-span-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                          isSubmitting ? 'animate-pulse' : ''
                        }`}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? t.registerSubmitting : t.registerSubmit}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      {t.backToLogin}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="mx-auto mt-10 w-full max-w-5xl"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <article className="surface-soft flex flex-col p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <Building2 className="h-5 w-5 text-sky-300" />
                    </span>
                    <h2 className="mt-4 text-3xl">{t.agency}</h2>
                    <p className="mt-3 flex-1 text-slate-300">{t.agencyText}</p>
                    <Link href="/login/b2b" className="btn-primary mt-6">
                      {t.agencyCta}
                    </Link>
                  </article>

                  <article className="surface-soft flex flex-col p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <HeartHandshake className="h-5 w-5 text-violet-300" />
                    </span>
                    <h2 className="mt-4 text-3xl">{t.family}</h2>
                    <p className="mt-3 flex-1 text-slate-300">{t.familyText}</p>
                    <Link href="/login/consumer" className="btn-secondary mt-6">
                      {t.familyCta}
                    </Link>
                  </article>
                </div>

                <div className="mt-10 border-t border-white/5 pt-6 text-center">
                  <span className="text-slate-300">{`${t.footerInvite} `}</span>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    {t.footerCta}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
