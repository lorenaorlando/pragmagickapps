import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { cardName } from '../../lib/cards';
import { TarotCard } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { FlipCard } from '../../components/cards';

export const RevealStage: React.FC<{ card: TarotCard; onNext: () => void }> = ({ card, onNext }) => {
  const { t, language } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  const name = cardName(card, language);

  useEffect(() => {
    const timer = setTimeout(() => setFlipped(true), 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={flipped ? name : '✦ ✦ ✦'} back="/tarot" />
      <div className="flex-1 min-h-0 rays flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, rotate: -4 }}
          animate={{ scale: 1, rotate: flipped ? -2 : -4 }}
          transition={{ duration: 0.6 }}
          className="h-[88%] max-w-full drop-shadow-[6px_6px_0_#111]"
        >
          <FlipCard card={card} flipped={flipped} alt={name} className="h-full max-w-full" />
        </motion.div>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="shrink-0 border-t-2 border-ink bg-yellow py-3.5 font-display text-[21px] uppercase"
      >
        {t.reveal.readAnswer}
      </button>
    </div>
  );
};
