'use client';

import Link from 'next/link';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLanguage } from '../../components/LanguageProvider';

export default function ContactPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">Lugubrious Hub</Link>
          <LanguageSwitch />
        </div>
        <article className="surface p-6 md:p-8">
          <h1 className="text-4xl font-semibold">{language === 'it' ? 'Contatti' : 'Contact'}</h1>
          <p className="mt-3 text-slate-300">+39 02 1234567</p>
          <p className="mt-2 text-slate-300">info@lugubrioushub.it</p>
          <p className="mt-2 text-slate-300">
            {language === 'it' ? 'Via Trieste 45, 30022 Portegrandi (VE)' : 'Via Trieste 45, 30022 Portegrandi (VE)'}
          </p>
        </article>
      </div>
    </main>
  );
}
