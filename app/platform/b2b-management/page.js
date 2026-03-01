'use client';

import Link from 'next/link';
import LanguageSwitch from '../../../components/LanguageSwitch';
import { useLanguage } from '../../../components/LanguageProvider';

export default function PlatformB2BPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">Lugubrious Hub</Link>
          <LanguageSwitch />
        </div>
        <article className="surface p-6 md:p-8">
          <h1 className="text-4xl font-semibold">{language === 'it' ? 'Gestione B2B' : 'B2B Management'}</h1>
          <p className="mt-3 text-slate-300">
            {language === 'it'
              ? 'Cruscotto operativo completo per pratiche, documenti, logistica e fornitori.'
              : 'Complete operational dashboard for cases, documents, logistics and suppliers.'}
          </p>
        </article>
      </div>
    </main>
  );
}
