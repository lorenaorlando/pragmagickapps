import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCardFan } from '../TarotCardFan';
import { TarotCardBack } from '../TarotCardBack';
import { Language, TarotCard } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { MAJOR_ARCANA } from '../../data/tarotCards';
import { tarotAudio } from '../../utils/audio';

interface ThreeCardsShuffleScreenProps {
  language: Language;
  onCardsDrawn: (cards: TarotCard[]) => void;
}

export const ThreeCardsShuffleScreen: React.FC<ThreeCardsShuffleScreenProps> = ({
  language,
  onCardsDrawn,
}) => {
  // Phase 1: Breathing prompt for 3 seconds
  const [isBreathingPhase, setIsBreathingPhase] = useState(true);
  // Phase 2: Shuffling state
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  // Phase 3: Chosen cards (up to 3)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [chosenCards, setChosenCards] = useState<TarotCard[]>([]);

  const t = TRANSLATIONS[language];
  const isEs = language === 'es';

  // 3-second breathing countdown at entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBreathingPhase(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Shuffling action
  const handleStartShuffle = () => {
    if (isBreathingPhase || isShuffling || hasShuffled) return;
    setIsShuffling(true);
    tarotAudio.playShuffle();

    setTimeout(() => {
      setIsShuffling(false);
      setHasShuffled(true);
    }, 1200);
  };

  // Card selection from bottom fan: selects up to 3 cards
  const handleCardClick = (index: number) => {
    if (isBreathingPhase || isShuffling || !hasShuffled) return;
    if (selectedIndices.includes(index) || chosenCards.length >= 3) return;

    tarotAudio.playClick();
    const newSelectedIndices = [...selectedIndices, index];
    setSelectedIndices(newSelectedIndices);

    // Pick a random unique Major Arcana card not yet in chosenCards
    const availableCards = MAJOR_ARCANA.filter(
      (c) => !chosenCards.some((chosen) => chosen.id === c.id)
    );
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const pickedCard = availableCards[randomIndex] || MAJOR_ARCANA[0];
    const newChosenCards = [...chosenCards, pickedCard];
    setChosenCards(newChosenCards);

    if (newChosenCards.length === 3) {
      setTimeout(() => {
        tarotAudio.playChime();
      }, 250);
    }
  };

  const handleRevealReading = () => {
    if (!hasShuffled || chosenCards.length < 3) return;
    tarotAudio.playClick();
    onCardsDrawn(chosenCards);
  };

  const isReadyToReveal = hasShuffled && chosenCards.length === 3;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-white text-black select-none overflow-hidden">
      {/* Top Header Banner: BARAJEA Y ELIGE / SHUFFLE & CHOOSE */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2.5 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {t.threeCardsSpread?.banner || t.shuffleAndDraw.banner}
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

      {/* Main Center Stage with 3 Upper Slots and Fan */}
      <div className="flex-1 w-full flex flex-col justify-between items-center py-3.5 sm:py-4 px-3 bg-white min-h-0">
        {/* Upper Slots: 3 slots side by side */}
        <div className="w-full flex items-center justify-center gap-2 sm:gap-3 pt-1">
          {[0, 1, 2].map((slotIdx) => {
            const hasCard = chosenCards.length > slotIdx;

            return (
              <div
                key={slotIdx}
                className="relative w-[76px] sm:w-[86px] h-[122px] sm:h-[138px] rounded-sm border-[2px] border-black bg-[#faf8f5] flex items-center justify-center overflow-hidden shadow-xs"
              >
                {/* Empty slot placeholder number */}
                {!hasCard && (
                  <span className="font-viaoda text-lg text-black/35 font-bold select-none">
                    {slotIdx + 1}
                  </span>
                )}

                <AnimatePresence>
                  {hasCard && (
                    <motion.div
                      key={`slotted-3card-${slotIdx}`}
                      initial={{ opacity: 0, y: 120, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 20,
                        mass: 0.8,
                      }}
                      className="w-full h-full"
                    >
                      <TarotCardBack size="sm" className="w-full h-full border-0" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Dynamic Instructional Title: Center prompt with fixed height for fluid transition */}
        <div className="w-full text-center px-2 py-1 flex items-center justify-center min-h-[46px] my-auto">
          <AnimatePresence mode="wait">
            {isBreathingPhase ? (
              <motion.p
                key="breathing-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="font-playfair text-[14px] sm:text-[15px] text-black italic font-normal tracking-normal text-center max-w-[290px] leading-snug"
              >
                {t.threeCardsSpread?.breathePrompt || t.shuffleAndDraw.breathePrompt}
              </motion.p>
            ) : isShuffling ? (
              <motion.p
                key="shuffling-3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="font-playfair text-[15px] sm:text-[16px] text-black font-normal tracking-normal text-center max-w-[280px] leading-snug"
              >
                {t.threeCardsSpread?.shufflingPrompt || t.shuffleAndDraw.shufflingPrompt}
              </motion.p>
            ) : !hasShuffled ? (
              <motion.p
                key="tap-shuffle-3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="font-playfair text-[15px] sm:text-[16px] text-black font-medium tracking-normal text-center max-w-[280px] leading-snug cursor-pointer"
                onClick={handleStartShuffle}
              >
                {t.threeCardsSpread?.tapToShufflePrompt || t.shuffleAndDraw.tapToShufflePrompt}
              </motion.p>
            ) : chosenCards.length < 3 ? (
              <motion.p
                key={`tap-choose-3-${chosenCards.length}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="font-playfair text-[15px] sm:text-[16px] text-black font-medium tracking-normal text-center max-w-[280px] leading-snug"
              >
                {isEs
                  ? `Elige 3 cartas (${chosenCards.length}/3) ↓`
                  : `Choose 3 cards (${chosenCards.length}/3) ↓`}
              </motion.p>
            ) : (
              <motion.p
                key="chosen-all-3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="font-playfair text-[14px] sm:text-[15px] text-black font-normal tracking-normal text-center max-w-[290px] leading-snug"
              >
                {isEs
                  ? '3 cartas elegidas. Toca abajo para revelar.'
                  : '3 cards chosen. Tap below to reveal.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Lower Fan of Cards */}
        <div
          onClick={!hasShuffled && !isShuffling && !isBreathingPhase ? handleStartShuffle : undefined}
          className={`w-full flex items-center justify-center pb-1 ${
            !hasShuffled && !isShuffling && !isBreathingPhase ? 'cursor-pointer' : ''
          }`}
        >
          <TarotCardFan
            cardCount={5}
            isShuffling={isShuffling}
            interactive={hasShuffled && chosenCards.length < 3}
            selectedIndices={selectedIndices}
            onCardClick={handleCardClick}
            className="scale-90 sm:scale-95"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className={`w-full border-t-[2px] border-black shrink-0 transition-colors duration-300 ${
          isReadyToReveal ? 'bg-[#ffff00]' : 'bg-[#d1d5db]'
        }`}
      >
        <motion.button
          id="btn-reveal-3cards"
          onClick={isReadyToReveal ? handleRevealReading : undefined}
          disabled={!isReadyToReveal}
          whileHover={isReadyToReveal ? { filter: 'brightness(0.95)' } : undefined}
          whileTap={isReadyToReveal ? { scale: 0.99 } : undefined}
          className={`w-full py-3.5 px-3 text-center font-viaoda text-xl sm:text-2xl font-normal tracking-tight uppercase transition-all flex items-center justify-center ${
            isReadyToReveal
              ? 'text-black cursor-pointer bg-[#ffff00]'
              : 'text-stone-500 cursor-not-allowed bg-[#d1d5db]'
          }`}
        >
          {t.threeCardsSpread?.revealReadingBtn || t.shuffleAndDraw.revealReadingBtn}
        </motion.button>
      </div>
    </div>
  );
};
