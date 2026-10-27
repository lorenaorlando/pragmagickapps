import React from 'react';
import { useLanguage } from '../lib/language';
import { Language } from '../types';

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
];

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex border-2 border-ink rounded-full bg-white p-0.5 shrink-0" role="group" aria-label="Language">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLanguage(o.value)}
          aria-pressed={language === o.value}
          className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] ${language === o.value ? 'bg-ink text-white' : ''}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};
