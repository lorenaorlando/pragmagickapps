import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

const STORAGE_KEY = 'pragmagick_lang';

const initialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // storage blocked: fall through to the browser language
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)[Language];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
