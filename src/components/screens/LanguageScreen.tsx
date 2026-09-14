import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { tarotAudio } from '../../utils/audio';

interface LanguageScreenProps {
  language: Language | null;
  onSelectLanguage: (lang: Language) => void;
  onContinue: () => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  language,
  onSelectLanguage,
  onContinue,
}) => {
  const activeT = language ? TRANSLATIONS[language] : null;

  const handleSelect = (lang: Language) => {
    tarotAudio.playClick();
    onSelectLanguage(lang);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-black select-none justify-between overflow-hidden">
      {/* Upper Main Container:
          flex-1 flex flex-col justify-center items-center with uniform spacing (gap-6 sm:gap-7)
          so logo, title, and descriptions stay perfectly centered vertically without crowding the top */}
      <div className="flex-1 w-full flex flex-col justify-center items-center px-5 py-4 gap-6 sm:gap-7 text-center min-h-0">
        {/* Brand Header: Logo + Title */}
        <div className="flex flex-col items-center justify-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src="https://sandboxlandia.online/wp-content/uploads/2026/09/PRAGMAGICKA_LOGO-1.png"
            alt="PRAGMAGICK APP Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2 sm:mb-2.5 mx-auto"
            referrerPolicy="no-referrer"
          />

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="font-viaoda text-[30px] sm:text-[36px] font-normal tracking-tight text-black text-center leading-[1.08] max-w-[260px] mx-auto"
          >
            PRAGMAGICK
            <br />
            APP
          </motion.h1>
        </div>

        {/* Tagline Paragraphs: English first, Spanish second with balanced line heights */}
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 max-w-[280px]">
          {/* English Tagline */}
          <div className="text-center">
            <p className="font-playfair text-[14px] sm:text-[15.5px] leading-snug text-black font-medium tracking-tight">
              esoteric tools
              <br />
              for our digital present
            </p>
            <p className="font-playfair text-[10.5px] sm:text-[11.5px] leading-snug text-neutral-700 mt-1 tracking-normal font-normal">
              (all card meanings are written by me, a human)
            </p>
          </div>

          {/* Spanish Tagline */}
          <div className="text-center">
            <p className="font-playfair text-[14px] sm:text-[15.5px] leading-snug text-black font-medium tracking-tight">
              herramientas esotéricas
              <br />
              para nuestro presente digital
            </p>
            <p className="font-playfair text-[10.5px] sm:text-[11.5px] leading-snug text-neutral-700 mt-1 tracking-normal font-normal">
              (todos los significados de las cartas fueron escritos por mí,
              <br className="sm:hidden" /> una humana)
            </p>
          </div>
        </div>
      </div>

      {/* Lower Section:
          Language Selector & Bottom Action Bar cleanly anchored at bottom */}
      <div className="w-full flex flex-col shrink-0">
        {/* Language Switcher Grid - Full width, 2 equal columns divided by a vertical black line */}
        <div className="w-full border-t-[2px] border-b-[2px] border-black bg-white">
          <div className="w-full grid grid-cols-2">
            {/* ENGLISH Option */}
            <button
              type="button"
              onClick={() => handleSelect('en')}
              className={`w-full py-4 sm:py-5 text-center font-viaoda text-lg sm:text-xl font-normal tracking-tight uppercase border-r-[2px] border-black transition-colors cursor-pointer flex items-center justify-center ${
                language === 'en'
                  ? 'bg-[#ffff00] text-black'
                  : 'bg-white text-black hover:bg-stone-100'
              }`}
            >
              ENGLISH
            </button>

            {/* ESPAÑOL Option */}
            <button
              type="button"
              onClick={() => handleSelect('es')}
              className={`w-full py-4 sm:py-5 text-center font-viaoda text-lg sm:text-xl font-normal tracking-tight uppercase transition-colors cursor-pointer flex items-center justify-center ${
                language === 'es'
                  ? 'bg-[#ffff00] text-black'
                  : 'bg-white text-black hover:bg-stone-100'
              }`}
            >
              ESPAÑOL
            </button>
          </div>
        </div>

        {/* Bottom Yellow Bar:
            - Permanently yellow (#ffff00) with a 2px black top border
            - When empty: displays an elegant star icon (★)
            - Once an option is chosen: displays the action text (START / COMENZAR) */}
        <div className="w-full min-h-[54px] sm:min-h-[60px] border-black bg-[#ffff00] overflow-hidden flex items-center justify-center">
          {language && activeT ? (
            <motion.button
              key={language}
              id="btn-language-continue"
              onClick={onContinue}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ filter: 'brightness(0.95)' }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-full py-3 sm:py-3.5 px-4 text-center font-viaoda text-2xl sm:text-[28px] font-normal tracking-tight text-black flex items-center justify-center cursor-pointer uppercase transition-all"
            >
              {activeT.languageScreen.continueBtn}
            </motion.button>
          ) : (
            <div className="w-full h-full min-h-[54px] sm:min-h-[60px] flex items-center justify-center text-black">
              <Star className="w-5 h-5 fill-black stroke-black opacity-90 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
