'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('it');

  useEffect(() => {
    const saved = window.localStorage.getItem('lugubrious-lang');
    if (saved === 'it' || saved === 'en') {
      setLanguage(saved);
    }
  }, []);

  const updateLanguage = (next) => {
    setLanguage(next);
    window.localStorage.setItem('lugubrious-lang', next);
  };

  const value = useMemo(
    () => ({ language, setLanguage: updateLanguage }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
