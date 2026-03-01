'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LanguageSwitch from '../../../components/LanguageSwitch';
import { useLanguage } from '../../../components/LanguageProvider';
import { isValidEmail, isValidPassword } from '../../lib/auth-validation';
import { copy } from '../../lib/translations';

export default function B2BLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language].loginForm;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validationText =
    language === 'it'
      ? {
          email: 'Inserisci un indirizzo email valido.',
          password: 'Minimo 8 caratteri, almeno 1 maiuscola, 1 minuscola e 1 numero.'
        }
      : {
          email: 'Enter a valid email address.',
          password: 'At least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.'
        };

  const validateForm = () => {
    const nextErrors = { email: '', password: '' };
    if (!isValidEmail(formData.email)) nextErrors.email = validationText.email;
    if (!isValidPassword(formData.password)) nextErrors.password = validationText.password;
    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push('/b2b/dashboard');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-slate-100 md:px-10 md:py-14">
      <div className="mx-auto flex min-h-[82vh] w-full max-w-xl flex-col justify-center">
        <div className="mb-3 flex justify-end">
          <LanguageSwitch />
        </div>

        <section className="surface p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t.b2bTag}</p>
          <h1 className="mt-3 text-4xl font-semibold">{t.b2bTitle}</h1>
          <p className="mt-3 text-slate-300">{t.b2bSubtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm text-slate-200">
              {t.email}
              <input
                type="email"
                className="field"
                placeholder="agency@lugubrioushub.it"
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                onBlur={validateForm}
                required
              />
              {errors.email ? <span className="text-xs text-rose-300">{errors.email}</span> : null}
            </label>
            <label className="grid gap-1 text-sm text-slate-200">
              {t.password}
              <input
                type="password"
                className="field"
                placeholder="••••••••"
                minLength={8}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                onBlur={validateForm}
                required
              />
              {errors.password ? <span className="text-xs text-rose-300">{errors.password}</span> : null}
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? t.entering : t.enter}
            </button>
          </form>

          <div className="mt-6 text-sm">
            <Link href="/" className="text-slate-300 underline-offset-2 hover:underline">
              {t.backHome}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
