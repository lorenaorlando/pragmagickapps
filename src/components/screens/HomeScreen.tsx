import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { tarotAudio } from '../../utils/audio';
import { AboutModal } from '../modals/AboutModal';

interface HomeScreenProps {
  language: Language;
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ language, onStart }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const t = TRANSLATIONS[language].home;

  const handleMonedaireClick = () => {
    tarotAudio.playClick();
    window.open('https://monedaire.pragmagick.app', '_blank', 'noopener,noreferrer');
  };

  const handleOneCardClick = () => {
    tarotAudio.playClick();
    onStart();
  };

  const handleInfoClick = () => {
    tarotAudio.playClick();
    setIsAboutModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-black select-none justify-between overflow-hidden">
      {/* Top Header Section: Logo + "APPS" */}
      <div className="w-full flex-1 flex flex-col items-center justify-center pt-6 pb-3 px-4 text-center">
        {/* Pragmagicka Logo above "APPS" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-2 sm:mb-2.5"
        >
          <img
            src="https://sandboxlandia.online/wp-content/uploads/2026/09/PRAGMAGICKA_LOGO-1.png"
            alt="Pragmagicka Logo"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="font-viaoda text-4xl sm:text-[46px] font-normal tracking-wide text-black text-center leading-none"
        >
          {t.appsTitle}
        </motion.h1>
      </div>

      {/* Middle Section: 3 Equal-height App Option Blocks with requested colors */}
      <div className="w-full flex flex-col shrink-0 border-t-[2px] border-b-[2px] border-black">
        {/* 1. Una Carta (Advances to card reading in this app) - Amarillo (#ffff00) */}
        <motion.button
          type="button"
          onClick={handleOneCardClick}
          whileHover={{ filter: 'brightness(0.96)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full h-[94px] sm:h-[102px] bg-[#ffff00] px-4 text-center flex flex-col items-center justify-center cursor-pointer transition-all border-b-[2px] border-black"
        >
          <span className="font-playfair text-[15px] sm:text-[16px] leading-tight text-black font-medium tracking-tight">
            {t.oneCardTitle}
            <br />
            {t.oneCardSubtitle}
          </span>
          <span className="font-playfair text-[11px] sm:text-[12px] leading-snug text-black/80 mt-1 font-normal">
            {t.oneCardDesc}
          </span>
        </motion.button>

        {/* 2. Monedaire (Link to external app) - Celeste (#b8e2ec) */}
        <motion.button
          type="button"
          onClick={handleMonedaireClick}
          whileHover={{ filter: 'brightness(0.96)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full h-[94px] sm:h-[102px] bg-[#b8e2ec] px-4 text-center flex flex-col items-center justify-center cursor-pointer transition-all border-b-[2px] border-black"
        >
          <span className="font-playfair text-[15px] sm:text-[16px] leading-tight text-black font-medium tracking-tight">
            {t.monedaireTitle}
            <br />
            {t.monedaireSubtitle}
          </span>
          <span className="font-playfair text-[11px] sm:text-[12px] leading-snug text-black/80 mt-1 font-normal">
            {t.monedaireDesc}
          </span>
        </motion.button>

        {/* 3. Info sobre pragmagicka - Verde (#33b43c) */}
        <motion.button
          type="button"
          onClick={handleInfoClick}
          whileHover={{ filter: 'brightness(0.96)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full h-[94px] sm:h-[102px] bg-[#33b43c] px-4 text-center flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <span className="font-playfair text-[15px] sm:text-[16px] leading-tight text-black font-medium tracking-tight">
            {t.infoTitle}
          </span>
          <span className="font-playfair text-[11px] sm:text-[12px] leading-snug text-black/80 mt-1 font-normal">
            {t.infoSubtitle}
          </span>
        </motion.button>
      </div>

      {/* Bottom whitespace balancing the screen composition cleanly */}
      <div className="w-full flex-1 bg-white min-h-[40px] sm:min-h-[50px]" />

      {/* About Pragmagicka Modal with Manifesto and Contact Links */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        language={language}
      />
    </div>
  );
};
