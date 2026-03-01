'use client';

import { useLanguage } from './LanguageProvider';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const active = 'text-white underline underline-offset-4';
  const inactive = 'text-slate-400 hover:text-slate-200';

  return (
    <div className="inline-flex items-center gap-2 text-sm tracking-wide">
      <button
        type="button"
        className={language === 'it' ? active : inactive}
        onClick={() => setLanguage('it')}
      >
        IT
      </button>
      <span className="text-slate-500">|</span>
      <button
        type="button"
        className={language === 'en' ? active : inactive}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
