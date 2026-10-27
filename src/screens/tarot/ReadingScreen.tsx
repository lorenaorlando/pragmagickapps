import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { cardImage, cardKeywords, cardName } from '../../lib/cards';
import { Spread } from '../../data/spreads';
import { TarotCard } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CardFace } from '../../components/cards';
import { ReadingActions } from '../../components/ReadingActions';

const CHIP_COLORS = ['bg-sky', 'bg-white', 'bg-green'];

interface ReadingScreenProps {
  spread: Spread;
  card: TarotCard;
  onAgain: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({ spread, card, onAgain }) => {
  const { t, language } = useLanguage();
  const name = cardName(card, language);
  const topic = spread.title[language];
  const answer = spread.readings?.[card.id]?.[language] ?? '';

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.reading.banner} back="/tarot" />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="relative rays border-b-2 border-ink flex justify-center pt-4 pb-5 [@media(max-height:720px)]:pt-2.5 [@media(max-height:720px)]:pb-3">
          <span className="absolute left-3 top-2 font-display text-[30px] leading-none">{card.number}</span>
          <motion.div initial={{ rotate: 0, scale: 0.92 }} animate={{ rotate: -3, scale: 1 }} transition={{ duration: 0.4 }}>
            <CardFace card={card} alt={name} className="w-[118px] [@media(max-height:720px)]:w-[78px] shadow-hard-lg" />
          </motion.div>
        </div>

        <p className="text-center pt-3">
          <span className="font-mono text-[9.5px] uppercase border-[1.5px] border-ink rounded-full bg-yellow px-2 py-0.5">{topic}</span>
        </p>
        <h2 className="font-display text-[28px] uppercase text-center leading-none pt-2">{name}</h2>
        <div className="flex flex-wrap justify-center gap-1.5 px-4 pt-2">
          {cardKeywords(card, language).map((kw, i) => (
            <span key={kw} className={`${CHIP_COLORS[i % 3]} font-mono text-[10px] uppercase border-[1.5px] border-ink rounded-full px-2 py-0.5`}>
              {kw}
            </span>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-5 mt-4 mb-1 border-l-[3px] border-ink pl-3.5 italic font-semibold text-[17px] leading-snug"
        >
          {answer}
        </motion.blockquote>
      </div>
      <ReadingActions
        whatsappText={t.reading.whatsappText(name, topic)}
        story={{ label: `${t.reading.shareLabel} · ${topic}`, cardUrls: [cardImage(card)], title: name, message: answer }}
        onAgain={onAgain}
      />
    </div>
  );
};
