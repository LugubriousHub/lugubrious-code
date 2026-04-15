'use client';

import Link from 'next/link';
import { Compass, HeartHandshake, Infinity } from 'lucide-react';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLanguage } from '../../components/LanguageProvider';
import { copy } from '../lib/translations';

export default function AboutPage() {
  const { language } = useLanguage();
  const t = copy[language].aboutPage;

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            Lugubrious Hub
          </Link>
          <LanguageSwitch />
        </div>

        <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl shadow-black/30 backdrop-blur md:p-12">
          <h1 className="bg-gradient-to-r from-sky-300 via-violet-300 to-sky-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {t.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-200">{t.body}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <Compass className="mx-auto h-5 w-5 text-sky-300" />
              <p className="mt-2 text-sm text-slate-200">{t.icons.precision}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <HeartHandshake className="mx-auto h-5 w-5 text-violet-300" />
              <p className="mt-2 text-sm text-slate-200">{t.icons.empathy}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <Infinity className="mx-auto h-5 w-5 text-emerald-300" />
              <p className="mt-2 text-sm text-slate-200">{t.icons.eternity}</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
