import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { TarotCardFan } from '../TarotCardFan';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface LoadingScreenProps {
  language: Language;
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ language, onComplete }) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white text-black select-none overflow-hidden">
      {/* Top Banner: CONSULTING THE CARDS / CONSULTANDO LAS CARTAS */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {t.loading.banner}
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

      {/* Center Fan Animation & Title on White Background */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-4 bg-white">
        <motion.h3
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-viaoda text-3xl sm:text-4xl font-normal tracking-tight text-black mb-4"
        >
          {t.loading.loadingTitle}
        </motion.h3>

        <TarotCardFan
          cardCount={5}
          isShuffling={true}
          className="scale-100 sm:scale-105"
        />
      </div>

      {/* Tip Section above bottom banner */}
      <div className="pb-3 px-5 flex flex-col items-center text-center bg-white">
        <span className="font-viaoda text-base sm:text-lg font-normal tracking-tight text-black mb-0.5 uppercase">
          {t.loading.tipTitle}
        </span>
        <p className="font-playfair text-xs sm:text-[13px] leading-relaxed text-black max-w-[270px]">
          {t.loading.tipText}
        </p>
      </div>

      {/* Bottom Yellow Banner: Indicator Bar */}
      <div className="w-full border-t-[2px] border-black bg-[#ffff00] py-2.5 sm:py-3 px-4 text-center shrink-0">
        <span className="font-viaoda text-lg sm:text-xl font-normal tracking-tight text-black uppercase animate-pulse">
          {t.loading.bottomBanner}
        </span>
      </div>
    </div>
  );
};
