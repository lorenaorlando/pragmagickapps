import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { drawCards } from '../../lib/cards';
import { TarotCard } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CardBack } from '../../components/cards';
import { Sticker } from '../../components/Sticker';

const TILTS = [-6, 0, 6];

export const WeeklyChoose: React.FC<{ onDone: (card: TarotCard) => void }> = ({ onDone }) => {
  const { t } = useLanguage();
  const [cards] = useState(() => drawCards(3));
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => onDone(cards[i]), 450);
  };

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.weekly.banner} back="/tarot" />
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-8 px-4 dots-soft">
        <div className="relative">
          <Sticker slug="17-la-estrella" rotate={-5} className="w-[92px]" />
        </div>
        <p className="text-[17px] font-medium text-center">{t.weekly.prompt}</p>
        <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
          {cards.map((card, i) => (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => pick(i)}
              aria-label={`${i + 1}`}
              initial={{ rotate: TILTS[i] }}
              animate={
                picked === null
                  ? { rotate: TILTS[i], y: 0, opacity: 1 }
                  : picked === i
                    ? { rotate: 0, y: -18, scale: 1.08, opacity: 1 }
                    : { opacity: 0.25, y: 8 }
              }
              whileHover={picked === null ? { y: -8 } : undefined}
              className="relative"
            >
              <CardBack className="w-full shadow-hard" />
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-ink font-display text-sm flex items-center justify-center">
                {i + 1}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
