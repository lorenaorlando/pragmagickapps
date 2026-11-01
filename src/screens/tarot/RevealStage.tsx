import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { cardName } from '../../lib/cards';
import { TarotCard } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CardFace } from '../../components/cards';

export const RevealStage: React.FC<{ card: TarotCard; onNext: () => void }> = ({ card, onNext }) => {
  const { t, language } = useLanguage();
  const name = cardName(card, language);

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={name} back="/tarot" />
      <div className="flex-1 min-h-0 rays flex items-center justify-center p-6">
        {/* The card shows face up straight away: the 3D flip left a blank sliver on iPhone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="h-[88%] max-w-full flex items-center justify-center -rotate-2 drop-shadow-[6px_6px_0_#111]"
        >
          <CardFace card={card} alt={name} className="h-full w-auto max-w-full object-contain" />
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
