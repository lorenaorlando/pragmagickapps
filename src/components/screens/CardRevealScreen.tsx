import React from 'react';
import { motion } from 'motion/react';
import { TarotCard, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface CardRevealScreenProps {
  language: Language;
  card: TarotCard;
  onReadAnswer: () => void;
}

export const CardRevealScreen: React.FC<CardRevealScreenProps> = ({
  language,
  card,
  onReadAnswer,
}) => {
  const t = TRANSLATIONS[language];
  const cardTitle =
    language === 'es'
      ? card.spanishName || card.frenchName || card.name
      : card.name || card.frenchName;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white text-black select-none overflow-hidden">
      {/* Top Banner: [NOMBRE DEL ARCANO] */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-[12px] font-normal tracking-tight text-black uppercase leading-tight text-left truncate mr-2">
          {cardTitle}
        </h2>
        <a
          href="https://www.instagram.com/pragmagicka/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-viaoda text-[12px] tracking-wider text-black lowercase font-normal hover:opacity-75 transition-opacity shrink-0"
        >
          pragmagick.app
        </a>
      </div>

      {/* Center Canvas: 90% sized card, prominent and framed */}
      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-3 bg-white min-h-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center h-[90%] max-h-[90%] w-auto max-w-[94%]"
        >
          <div
            className="relative h-full w-auto border-[2px] border-black rounded-[4px] bg-[#faf7ee] overflow-hidden shadow-2xl flex items-center justify-center"
            style={{ aspectRatio: '546 / 948' }}
          >
            <img
              src={card.imageUrl}
              alt={cardTitle}
              className="w-full h-full object-contain select-none pointer-events-none"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Yellow Banner: LEE TU RESPUESTA / READ YOUR ANSWER */}
      <div className="w-full border-t-[2px] border-black bg-[#ffff00] shrink-0">
        <motion.button
          id="btn-read-answer"
          onClick={onReadAnswer}
          whileHover={{ filter: 'brightness(0.95)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-[#ffff00] py-2.5 sm:py-3 px-3 text-center font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black cursor-pointer uppercase transition-all flex items-center justify-center"
        >
          {t.cardReveal.readAnswerBtn}
        </motion.button>
      </div>
    </div>
  );
};
