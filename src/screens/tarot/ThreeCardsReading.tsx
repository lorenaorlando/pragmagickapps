import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { cardImage, cardKeywords, cardName } from '../../lib/cards';
import { TarotCard } from '../../types';
import { ThreeCardMode } from '../../data/threeCardModes';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CardFace } from '../../components/cards';
import { ReadingActions } from '../../components/ReadingActions';

const TILTS = [-4, 0, 4];

interface ThreeCardsReadingProps {
  cards: TarotCard[];
  mode: ThreeCardMode;
  onAgain: () => void;
}

export const ThreeCardsReading: React.FC<ThreeCardsReadingProps> = ({ cards, mode, onAgain }) => {
  const { t, language } = useLanguage();
  const names = cards.map((c) => cardName(c, language));
  const positions = mode.positions.map((p) => p[language]);

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.reading.banner} back="/tarot" />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="rays border-b-2 border-ink px-4 pt-3 pb-5 flex flex-col gap-2.5">
          <p className="text-center">
            <span className="font-mono text-[9.5px] uppercase border-[1.5px] border-ink rounded-full bg-white px-2 py-0.5">
              {mode.title[language]}
            </span>
          </p>
          <div className="grid grid-cols-3 gap-2.5 items-end">
            {cards.map((card, i) => (
              <div key={card.id} className="flex flex-col items-center gap-2 min-w-0">
                <span className="w-full min-h-[30px] flex items-center justify-center text-center font-display text-[13px] uppercase leading-[0.95] bg-white border-[1.5px] border-ink rounded-[8px] px-1 py-1">
                  {positions[i]}
                </span>
                <motion.div
                  className="w-full"
                  initial={{ y: 20, opacity: 0, rotate: 0 }}
                  animate={{ y: 0, opacity: 1, rotate: TILTS[i] }}
                  transition={{ delay: i * 0.12 }}
                >
                  <CardFace card={card} alt={`${positions[i]}: ${names[i]}`} className="w-full shadow-hard" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 px-3 py-3">
          {cards.map((card, i) => (
            <div key={card.id} className="flex flex-col items-center text-center gap-1.5 min-w-0">
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
        whatsappText={t.reading.whatsappTextThree(mode.title[language], names.map((n, i) => `${positions[i]}: ${n}`).join(', '))}
        story={{
          header: t.reading.banner,
          label: mode.title[language],
          positions,
          cardUrls: cards.map(cardImage),
          title: names.join(' · '),
          message: cards.map((c) => cardKeywords(c, language)[0]).join(' · '),
        }}
        onAgain={onAgain}
      />
    </div>
  );
};
