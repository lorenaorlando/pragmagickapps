import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCardBack } from '../TarotCardBack';
import { Language, TarotCard } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { MAJOR_ARCANA } from '../../data/tarotCards';

interface DrawScreenProps {
  language: Language;
  onCardsDrawn: (card: TarotCard) => void;
}

export const DrawScreen: React.FC<DrawScreenProps> = ({ language, onCardsDrawn }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [drawnCard, setDrawnCard] = useState<TarotCard>(MAJOR_ARCANA[0]);

  const t = TRANSLATIONS[language];
  const cardCount = 5;
  const cards = Array.from({ length: cardCount });

  // Pure harmonious geometric fan curve (radial arc with bottom pivot)
  const getFanTransform = (index: number) => {
    const mid = (cardCount - 1) / 2; // 2
    const offset = index - mid; // -2, -1, 0, 1, 2
    const rotate = offset * 11; // -22, -11, 0, 11, 22 deg
    const translateX = offset * 24; // -48, -24, 0, 24, 48 px
    const translateY = Math.abs(offset) * 5; // 10, 5, 0, 5, 10 px
    return { rotate, translateX, translateY };
  };

  const handleCardSelect = (index: number) => {
    if (isFlying || hasLanded) return;
    setSelectedCardIndex(index);
    setIsFlying(true);

    // Pick a card from the 22 Major Arcana
    const randomIndex = Math.floor(Math.random() * MAJOR_ARCANA.length);
    const chosen = MAJOR_ARCANA[randomIndex];
    setDrawnCard(chosen);

    setTimeout(() => {
      setHasLanded(true);
      setIsFlying(false);
    }, 650);
  };

  const handleContinue = () => {
    if (selectedCardIndex === null) {
      const randomIndex = Math.floor(Math.random() * MAJOR_ARCANA.length);
      const chosen = MAJOR_ARCANA[randomIndex];
      setDrawnCard(chosen);
      handleCardSelect(2);
      setTimeout(() => onCardsDrawn(chosen), 850);
    } else {
      onCardsDrawn(drawnCard);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white text-black select-none overflow-hidden">
      {/* Top Banner: DRAW YOUR CARD / ELIGE TU CARTA */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {t.draw.banner}
        </h2>
        <a
          href="https://www.instagram.com/pragmagicka/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-viaoda text-[13px] sm:text-[14.5px] tracking-wider text-black lowercase font-normal hover:opacity-75 transition-opacity shrink-0 ml-2"
        >
          pragmagick.app
        </a>
      </div>

      {/* Main interactive stage - Centered elements, generous padding from edges, 50px gap */}
      <div className="flex-1 flex flex-col items-center justify-center gap-[50px] px-4 py-4 relative min-h-0">
        {/* Top Slot: Target Placement Frame */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <div className="w-[88px] h-[146px] sm:w-[94px] sm:h-[156px] border-[2px] border-dashed border-stone-400 bg-stone-50/80 rounded-[3px] flex flex-col items-center justify-center relative shadow-xs">
            <span className="font-viaoda text-[11px] tracking-tight text-stone-400 uppercase">
              {hasLanded ? '' : t.draw.slotPlaceholder}
            </span>

            {/* When card lands in the slot */}
            <AnimatePresence>
              {hasLanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <TarotCardBack size="md" className="w-full h-full shadow-md border-[1.5px] border-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Flying Card Overlay during flight transition */}
        <AnimatePresence>
          {isFlying && selectedCardIndex !== null && (
            <motion.div
              initial={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                x: `calc(-50% + ${getFanTransform(selectedCardIndex).translateX}px)`,
                y: `${getFanTransform(selectedCardIndex).translateY}px`,
                rotate: getFanTransform(selectedCardIndex).rotate,
                scale: 0.95,
                zIndex: 60,
              }}
              animate={{
                bottom: 'calc(50% + 25px - 73px)',
                left: '50%',
                x: '-50%',
                y: '0px',
                rotate: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-none"
            >
              <TarotCardBack size="md" className="w-[88px] h-[146px] sm:w-[94px] sm:h-[156px] shadow-2xl border-[1.5px] border-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Harmonious fan of cards below */}
        <div className="w-full flex flex-col items-center justify-center shrink-0">
          <p className="font-playfair text-[11px] sm:text-xs text-stone-500 mb-2 text-center">
            {hasLanded ? t.draw.drawnHint : t.draw.tapHint}
          </p>

          <div className="relative flex items-center justify-center w-full max-w-[270px] h-[126px]">
            {cards.map((_, i) => {
              const { rotate, translateX, translateY } = getFanTransform(i);
              const isChosen = selectedCardIndex === i;

              // If this card is currently flying or has landed at top, hide it from the fan
              if (isChosen && (isFlying || hasLanded)) {
                return (
                  <div
                    key={i}
                    className="absolute opacity-0 pointer-events-none"
                    style={{
                      transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
                    }}
                  />
                );
              }

              return (
                <motion.div
                  key={i}
                  onClick={() => handleCardSelect(i)}
                  initial={false}
                  animate={{
                    x: translateX,
                    y: translateY,
                    rotate: rotate,
                  }}
                  whileHover={
                    !hasLanded && !isFlying
                      ? {
                          scale: 1.06,
                          y: translateY - 12,
                          zIndex: 40,
                          transition: { duration: 0.15 },
                        }
                      : undefined
                  }
                  whileTap={!hasLanded && !isFlying ? { scale: 0.96 } : undefined}
                  className="absolute cursor-pointer drop-shadow-sm hover:drop-shadow-md"
                  style={{
                    transformOrigin: '50% 115%',
                    zIndex: i + 1,
                  }}
                >
                  <TarotCardBack
                    size="sm"
                    className="w-[74px] h-[124px] sm:w-[78px] sm:h-[130px] border-[1.5px] border-black transition-transform"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Yellow Banner: CONTINUE Button */}
      <div className="w-full border-t-[2px] border-black bg-[#ffff00] shrink-0">
        <motion.button
          id="btn-draw-cards"
          onClick={handleContinue}
          whileHover={{ filter: 'brightness(0.95)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-[#ffff00] py-2.5 sm:py-3 px-3 text-center font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black cursor-pointer uppercase transition-all flex items-center justify-center"
        >
          {t.draw.continueBtn}
        </motion.button>
      </div>
    </div>
  );
};
