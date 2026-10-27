import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { cardImage, cardKeywords, cardName } from '../../lib/cards';
import { TarotCard } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CardFace } from '../../components/cards';
import { ReadingActions } from '../../components/ReadingActions';

const TILTS = [-4, 0, 4];

export const ThreeCardsReading: React.FC<{ cards: TarotCard[]; onAgain: () => void }> = ({ cards, onAgain }) => {
  const { t, language } = useLanguage();
  const names = cards.map((c) => cardName(c, language));

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.reading.banner} back="/tarot" />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="rays border-b-2 border-ink grid grid-cols-3 gap-2.5 px-4 pt-4 pb-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ y: 20, opacity: 0, rotate: 0 }}
              animate={{ y: i === 1 ? -4 : 4, opacity: 1, rotate: TILTS[i] }}
              transition={{ delay: i * 0.12 }}
            >
              <CardFace card={card} alt={names[i]} className="w-full shadow-hard" />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2.5 px-3 py-3">
          {cards.map((card, i) => (
            <div key={card.id} className="flex flex-col items-center text-center gap-1.5 min-w-0">
              <span className="font-mono text-[9px] border-[1.5px] border-ink rounded-full px-1.5 bg-yellow">{i + 1}</span>
              <h2 className="font-display text-[15px] uppercase leading-none">{names[i]}</h2>
              <ul className="flex flex-col gap-1 text-[11px] leading-tight">
                {cardKeywords(card, language).map((kw) => (
                  <li key={kw}>✦ {kw}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <ReadingActions
        whatsappText={t.reading.whatsappTextThree(names.join(', '))}
        story={{
          label: `${t.reading.shareLabel} · 3`,
          cardUrls: cards.map(cardImage),
          title: names.join(' · '),
          message: cards.map((c) => cardKeywords(c, language)[0]).join(' · '),
        }}
        onAgain={onAgain}
      />
    </div>
  );
};
