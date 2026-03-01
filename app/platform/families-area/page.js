'use client';

import Link from 'next/link';
import LanguageSwitch from '../../../components/LanguageSwitch';
import { useLanguage } from '../../../components/LanguageProvider';

export default function PlatformFamiliesPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">Lugubrious Hub</Link>
          <LanguageSwitch />
        </div>
        <article className="surface p-6 md:p-8">
          <h1 className="text-4xl font-semibold">{language === 'it' ? 'Area Famiglie' : 'Families Area'}</h1>
          <p className="mt-3 text-slate-300">
            {language === 'it'
              ? 'Timeline pratica, Legacy Vault e supporto guidato con approccio umano e discreto.'
              : 'Case timeline, Legacy Vault and guided support with a respectful human approach.'}
          </p>
        </article>
      </div>
    </main>
  );
}
