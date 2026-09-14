import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TarotCardFan } from '../TarotCardFan';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { tarotAudio } from '../../utils/audio';

interface ShuffleScreenProps {
  language: Language;
  onShuffled: () => void;
}

export const ShuffleScreen: React.FC<ShuffleScreenProps> = ({ language, onShuffled }) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const t = TRANSLATIONS[language];

  const handleShuffleAndContinue = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    tarotAudio.playShuffle();
    setTimeout(() => {
      setIsShuffling(false);
      onShuffled();
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white text-black select-none overflow-hidden">
      {/* Top Banner: SHUFFLE CARDS - Light Blue Banner with 2px border bottom */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {t.shuffle.banner}
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

      {/* Center Fan of Cards with White Background */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-4 bg-white">
        <div
          onClick={() => {
            if (!isShuffling) {
              setIsShuffling(true);
              tarotAudio.playShuffle();
              setTimeout(() => setIsShuffling(false), 900);
            }
          }}
          className="cursor-pointer"
          title="Tap cards to shuffle"
        >
          <TarotCardFan
            cardCount={5}
            isShuffling={isShuffling}
            className="scale-100 sm:scale-105"
          />
        </div>

        <p className="font-playfair text-[11px] sm:text-xs text-stone-500 mt-4 text-center">
          {isShuffling ? t.shuffle.shufflingHint : t.shuffle.tapHint}
        </p>
      </div>

      {/* Bottom Yellow Banner: CONTINUE Button */}
      <div className="w-full border-t-[2px] border-black bg-[#ffff00] shrink-0">
        <motion.button
          id="btn-shuffle-cards"
          onClick={handleShuffleAndContinue}
          whileHover={{ filter: 'brightness(0.95)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-[#ffff00] py-2.5 sm:py-3 px-3 text-center font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black cursor-pointer uppercase transition-all flex items-center justify-center"
        >
          {t.shuffle.continueBtn}
        </motion.button>
      </div>
    </div>
  );
};
