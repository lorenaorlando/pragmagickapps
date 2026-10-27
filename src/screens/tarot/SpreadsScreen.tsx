import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { SPREADS } from '../../data/spreads';
import { SpreadId } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Sticker } from '../../components/Sticker';
import { GoalModal } from '../../components/modals';
import { track } from '../../lib/analytics';

// Ink line icons, one per question
const ICONS: Record<SpreadId, React.ReactNode> = {
  'no-se-que-hacer': (
    <>
      <path d="M20 34V18M20 18l-9-9M20 18l9-9" />
      <path d="M7 13V7h6M33 13V7h-6" />
    </>
  ),
  'pienso-en-alguien': (
    <>
      <circle cx="15" cy="20" r="9" />
      <circle cx="25" cy="20" r="9" />
    </>
  ),
  'momento-presente': (
    <>
      <circle cx="20" cy="20" r="7" />
      <path d="M20 4v6M20 30v6M4 20h6M30 20h6M9 9l4 4M27 27l4 4M31 9l-4 4M13 27l-4 4" />
    </>
  ),
  semana: (
    <>
      <rect x="6" y="9" width="28" height="25" rx="2" />
      <path d="M6 16h28M13 5v7M27 5v7" />
      <path d="M20 20c.4 2.6 1.4 3.6 4 4-2.6.4-3.6 1.4-4 4-.4-2.6-1.4-3.6-4-4 2.6-.4 3.6-1.4 4-4z" fill="#111" stroke="none" />
    </>
  ),
  'tres-cartas': (
    <>
      <rect x="3" y="11" width="10" height="18" rx="1.5" transform="rotate(-10 8 20)" />
      <rect x="15" y="9" width="10" height="18" rx="1.5" />
      <rect x="27" y="11" width="10" height="18" rx="1.5" transform="rotate(10 32 20)" />
    </>
  ),
};

export const SpreadsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [goalOpen, setGoalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.spreads.banner} back="/menu" />
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5 p-3 dots-soft">
        {SPREADS.map((spread, i) => (
          <motion.div
            key={spread.id}
            className="flex-[1_0_auto] min-h-[68px]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/tarot/${spread.id}`}
              className={`${spread.color === 'yellow' ? 'bg-yellow' : 'bg-sky'} h-full grid grid-cols-[48px_1fr_auto] items-center gap-2.5 rounded-[8px] border-2 border-ink shadow-hard px-2.5 py-2 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[transform,box-shadow]`}
            >
              <span className="w-12 h-12 rounded-full border-2 border-ink bg-white overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 40 40" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" className="w-7 h-7" aria-hidden="true">
                  {ICONS[spread.id]}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[16px] uppercase leading-[1.02]">{spread.title[language]}</span>
                <span className="block text-[11.5px] leading-tight mt-0.5 text-black/80">{spread.description[language]}</span>
              </span>
              <span className="font-mono text-[11px] uppercase border-[1.5px] border-ink rounded-full bg-white px-1.5 py-0.5 whitespace-nowrap">
                {spread.format[language]}
              </span>
            </Link>
          </motion.div>
        ))}

        <button
          type="button"
          onClick={() => {
            track('goal_open');
            setGoalOpen(true);
          }}
          className="relative shrink-0 mt-1.5 text-left rounded-[8px] border-2 border-ink bg-sky pl-3 pr-[78px] py-2.5 shadow-hard active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[transform,box-shadow]"
        >
          <span className="block font-display text-[16px] leading-[1.05] uppercase">{t.spreads.goalTitle}</span>
          <span className="block font-mono text-[11px] uppercase mt-1">{t.spreads.goalDesc} →</span>
          <Sticker slug="07-el-carro" rotate={6} className="absolute right-1 -top-4 w-[70px]" />
        </button>
      </div>
      <GoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
    </div>
  );
};
