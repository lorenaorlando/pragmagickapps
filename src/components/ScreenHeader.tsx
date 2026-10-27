import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../lib/language';

interface ScreenHeaderProps {
  title: string;
  /** Where the back arrow goes; omit to hide it */
  back?: string;
  bg?: 'sky' | 'yellow' | 'green';
  right?: React.ReactNode;
}

const BG = { sky: 'bg-sky', yellow: 'bg-yellow', green: 'bg-green' };

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, back, bg = 'sky', right }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className={`${BG[bg]} dots w-full border-b-2 border-ink px-3 py-2.5 flex items-center gap-2 shrink-0 min-h-[58px]`}>
      {back && (
        <button
          type="button"
          onClick={() => navigate(back)}
          aria-label={t.back}
          className="w-8 h-8 -ml-1 rounded-full border-2 border-ink bg-white flex items-center justify-center shrink-0 active:translate-y-px"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}
      <h1 className="font-display text-[21px] leading-[1.02] uppercase whitespace-pre-line flex-1 min-w-0">{title}</h1>
      {right ?? (
        <Link to="/menu" aria-label="pragmagick.app" className="shrink-0">
          <img src="/brand/logo-circle.webp" alt="" className="w-9 h-9 rounded-full border-2 border-ink bg-yellow" />
        </Link>
      )}
    </header>
  );
};
