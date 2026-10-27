import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { THREE_CARD_MODES, ThreeCardMode } from '../../data/threeCardModes';
import { ScreenHeader } from '../../components/ScreenHeader';

const BG = { yellow: 'bg-yellow', sky: 'bg-sky', white: 'bg-white' };

/** Before shuffling: choose what each of the three positions will mean */
export const ThreeCardModeChoice: React.FC<{ onChoose: (mode: ThreeCardMode) => void }> = ({ onChoose }) => {
  const { t, language } = useLanguage();
  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.threeModes.banner} back="/tarot" />
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 p-3.5 dots-soft">
        <p className="text-[14px] leading-snug px-1">{t.threeModes.prompt}</p>
        {THREE_CARD_MODES.map((mode, i) => (
          <motion.button
            key={mode.id}
            type="button"
            onClick={() => onChoose(mode)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${BG[mode.color]} flex-[1_0_auto] min-h-[96px] text-left rounded-[10px] border-2 border-ink shadow-hard px-3.5 py-3 flex flex-col justify-center gap-2 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[transform,box-shadow]`}
          >
            <span className="font-display text-[17px] uppercase leading-[1]">{mode.title[language]}</span>
            <span className="grid grid-cols-3 gap-1.5">
              {mode.positions.map((p, n) => (
                <span
                  key={p.es}
                  className="flex items-center gap-1 font-display text-[13px] uppercase leading-[1] border-[1.5px] border-ink rounded-[6px] bg-white px-1.5 max-[359px]:px-1 max-[359px]:text-[11px] py-1"
                >
                  <span className="shrink-0 font-mono text-[11px] max-[359px]:hidden">{n + 1}</span>
                  <span className="min-w-0">{p[language]}</span>
                </span>
              ))}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
