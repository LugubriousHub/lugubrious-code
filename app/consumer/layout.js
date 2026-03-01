'use client';

import SmartChatbot from '../../components/SmartChatbot';
import InternalHeader from '../../components/InternalHeader';
import { useLanguage } from '../../components/LanguageProvider';
import { copy } from '../lib/translations';

export default function ConsumerLayout({ children }) {
  const { language } = useLanguage();
  const t = copy[language].consumerLayout;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <InternalHeader />
      <div className="mx-auto w-[95%] max-w-5xl pb-8 pt-24">
        <header className="surface mb-4 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-200">{t.area}</p>
          <h1 className="mt-2 text-3xl">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{t.subtitle}</p>
        </header>
        <main className="surface p-5 md:p-7">{children}</main>
      </div>
      <SmartChatbot mode="family" />
    </div>
  );
}
