import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCardFan } from '../TarotCardFan';
import { TarotCardBack } from '../TarotCardBack';
import { Language, TarotCard } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { MAJOR_ARCANA } from '../../data/tarotCards';
import { tarotAudio } from '../../utils/audio';

interface ShuffleAndDrawScreenProps {
  language: Language;
  onCardDrawn: (card: TarotCard) => void;
}

export const ShuffleAndDrawScreen: React.FC<ShuffleAndDrawScreenProps> = ({
  language,
  onCardDrawn,
}) => {
  // Phase 1: Breathing prompt for 3 seconds
  const [isBreathingPhase, setIsBreathingPhase] = useState(true);
  // Phase 2: Shuffling state
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  // Phase 3: Chosen card
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [chosenCard, setChosenCard] = useState<TarotCard | null>(null);

  const t = TRANSLATIONS[language];

  // 3-second breathing countdown at entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBreathingPhase(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Shuffling action: triggered by tapping cards at the bottom
  const handleStartShuffle = () => {
    if (isBreathingPhase || isShuffling || hasShuffled) return;
    setIsShuffling(true);
    tarotAudio.playShuffle();

    setTimeout(() => {
      setIsShuffling(false);
      setHasShuffled(true);
    }, 1200);
  };

  // Card selection from bottom fan: moves card to upper slot
  const handleCardClick = (index: number) => {
    if (isBreathingPhase || isShuffling || !hasShuffled || selectedIndex !== null) return;

    setSelectedIndex(index);
    tarotAudio.playClick();

    const randomIndex = Math.floor(Math.random() * MAJOR_ARCANA.length);
    const chosen = MAJOR_ARCANA[randomIndex];
    setChosenCard(chosen);
  };

  const handleRevealReading = () => {
    if (!hasShuffled || selectedIndex === null || !chosenCard) return;
    tarotAudio.playClick();
    onCardDrawn(chosenCard);
  };

  const isReadyToReveal = hasShuffled && selectedIndex !== null;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-white text-black select-none overflow-hidden">
      {/* Top Header Banner: BARAJEA Y ELIGE / SHUFFLE & CHOOSE */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2.5 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {t.shuffleAndDraw.banner}
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

      {/* Main Center Stage:
          Structured with symmetrical padding, flex-1 and justify-between items-center
          to give balanced optical breathing room between header, upper slot, prompt, fan, and button */}
      <div className="flex-1 w-full flex flex-col justify-between items-center py-4 sm:py-5 px-4 bg-white min-h-0">
        {/* Upper Slot: Perfectly centered card frame */}
        <div className="w-full flex items-center justify-center pt-1">
          <div className="relative w-24 h-40 rounded-sm border-[2px] border-black bg-white flex items-center justify-center overflow-hidden shadow-xs">
            <AnimatePresence>
              {selectedIndex !== null && (
                <motion.div
                  key="slotted-card"
                  initial={{ opacity: 0, y: 140, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                    mass: 0.8,
                  }}
                  className="w-full h-full"
                >
                  <TarotCardBack size="lg" className="w-full h-full border-0" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Instructional Title: Center prompt with fixed height for fluid transition */}
        <div className="w-full text-center px-3 py-1 flex items-center justify-center min-h-[50px] my-auto">
          <AnimatePresence mode="wait">
            {isBreathingPhase ? (
              <motion.p
                key="breathing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="font-playfair text-[15px] sm:text-[16px] text-black italic font-normal tracking-normal text-center max-w-[280px] leading-snug"
              >
                {t.shuffleAndDraw.breathePrompt}
              </motion.p>
            ) : isShuffling ? (
              <motion.p
                key="shuffling"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="font-playfair text-[16px] sm:text-[17px] text-black font-normal tracking-normal text-center max-w-[280px] leading-snug"
              >
                {t.shuffleAndDraw.shufflingPrompt}
              </motion.p>
            ) : !hasShuffled ? (
              <motion.p
                key="tap-shuffle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="font-playfair text-[16px] sm:text-[17px] text-black font-medium tracking-normal text-center max-w-[280px] leading-snug cursor-pointer"
                onClick={handleStartShuffle}
              >
                {t.shuffleAndDraw.tapToShufflePrompt}
              </motion.p>
            ) : selectedIndex === null ? (
              <motion.p
                key="tap-choose"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="font-playfair text-[16px] sm:text-[17px] text-black font-medium tracking-normal text-center max-w-[280px] leading-snug"
              >
                {t.shuffleAndDraw.tapToChoosePrompt}
              </motion.p>
            ) : (
              <motion.p
                key="chosen"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="font-playfair text-[15px] sm:text-[16px] text-black font-normal tracking-normal text-center max-w-[280px] leading-snug"
              >
                {language === 'es'
                  ? 'Carta elegida. Toca abajo para revelar.'
                  : 'Card chosen. Tap below to reveal.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Lower Fan of Cards: Perfectly centered and cushioned with symmetrical bottom padding */}
        <div
          onClick={!hasShuffled && !isShuffling && !isBreathingPhase ? handleStartShuffle : undefined}
          className={`w-full flex items-center justify-center pb-1 ${
            !hasShuffled && !isShuffling && !isBreathingPhase ? 'cursor-pointer' : ''
          }`}
        >
          <TarotCardFan
            cardCount={5}
            isShuffling={isShuffling}
            interactive={hasShuffled && selectedIndex === null}
            selectedIndices={selectedIndex !== null ? [selectedIndex] : []}
            onCardClick={handleCardClick}
            className="scale-95 sm:scale-100"
          />
        </div>
      </div>

      {/* Bottom Action Bar:
          Symmetrical bottom button aligned with the frame */}
      <div
        className={`w-full border-t-[2px] border-black shrink-0 transition-colors duration-300 ${
          isReadyToReveal ? 'bg-[#ffff00]' : 'bg-[#d1d5db]'
        }`}
      >
        <motion.button
          id="btn-reveal-reading"
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
          {t.shuffleAndDraw.revealReadingBtn}
        </motion.button>
      </div>
    </div>
  );
};
