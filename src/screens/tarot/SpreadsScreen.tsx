import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { SPREADS } from '../../data/spreads';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Sticker } from '../../components/Sticker';
import { GoalModal } from '../../components/modals';

const ThreeCardsIcon = () => (
  <svg viewBox="0 0 40 40" fill="#ffff00" stroke="#111" strokeWidth="2" className="w-8 h-8" aria-hidden="true">
    <rect x="3" y="10" width="11" height="19" rx="1.5" transform="rotate(-12 8 19)" />
    <rect x="25" y="10" width="11" height="19" rx="1.5" transform="rotate(12 31 19)" />
    <rect x="14.5" y="8" width="11" height="19" rx="1.5" />
  </svg>
);

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
            className="flex-1 min-h-[68px]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/tarot/${spread.id}`}
              className={`${spread.color === 'yellow' ? 'bg-yellow' : 'bg-sky'} h-full grid grid-cols-[48px_1fr_auto] items-center gap-2.5 rounded-[8px] border-2 border-ink shadow-hard px-2.5 py-2 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[transform,box-shadow]`}
            >
              <span className="w-12 h-12 rounded-full border-2 border-ink bg-white overflow-hidden flex items-center justify-center">
                {spread.suit ? (
                  <img src={`/suits/${spread.suit}.webp`} alt="" className="w-[88%] h-[88%] object-contain" />
                ) : (
                  <ThreeCardsIcon />
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[16px] uppercase leading-[1.02]">{spread.title[language]}</span>
                <span className="block text-[11.5px] leading-tight mt-0.5 text-black/80">{spread.description[language]}</span>
              </span>
              <span className="font-mono text-[9.5px] uppercase border-[1.5px] border-ink rounded-full bg-white px-1.5 py-0.5 whitespace-nowrap">
                {spread.format[language]}
              </span>
            </Link>
          </motion.div>
        ))}

        <button
          type="button"
          onClick={() => setGoalOpen(true)}
          className="relative shrink-0 mt-1.5 text-left rounded-[8px] border-2 border-ink bg-ink text-white pl-3 pr-[78px] py-2.5 shadow-hard active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[transform,box-shadow]"
        >
          <span className="block font-display text-[16px] leading-[1.05] text-yellow">{t.spreads.goalTitle}</span>
          <span className="block font-mono text-[10px] uppercase mt-1 text-white/80">{t.spreads.goalDesc} →</span>
          <Sticker slug="07-el-carro" rotate={10} className="absolute right-1 -top-4 w-[70px]" />
        </button>
      </div>
      <GoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
    </div>
  );
};
