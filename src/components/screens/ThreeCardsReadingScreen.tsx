import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TarotCardFront } from '../TarotCardFront';
import { TarotCard, Language } from '../../types';
import { tarotAudio } from '../../utils/audio';
import { KofiModal } from '../modals/KofiModal';

interface ThreeCardsReadingScreenProps {
  language: Language;
  cards: TarotCard[];
  onRestart: () => void;
}

export const ThreeCardsReadingScreen: React.FC<ThreeCardsReadingScreenProps> = ({
  language,
  cards,
  onRestart,
}) => {
  const isEs = language === 'es';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTagBanner, setShowTagBanner] = useState(false);
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);
  const bannerTimerRef = useRef<number | null>(null);

  // Trigger floating toast notification for 4 seconds
  const triggerTagBanner = () => {
    setShowTagBanner(true);
    if (bannerTimerRef.current) {
      window.clearTimeout(bannerTimerRef.current);
    }
    bannerTimerRef.current = window.setTimeout(() => {
      setShowTagBanner(false);
    }, 4000);
  };

  // Detect screenshot shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 's', 'S'].includes(e.key))
      ) {
        triggerTagBanner();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
    };
  }, []);

  const handleWhatsAppAction = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    window.open(
      'https://wa.me/573138642943?text=Hola!%20vengo%20de%20Pragmagick.app%20y%20quiero%20profundizar%20mi%20lectura',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleInstagramShareOption = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    triggerTagBanner();
    window.open('https://instagram.com/pragmagicka/', '_blank', 'noopener,noreferrer');
  };

  const handleOpenSupport = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    setIsKofiModalOpen(true);
  };

  const handleNewReading = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    onRestart();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center bg-white text-black select-none overflow-hidden">
      {/* Floating Instagram Tag Toast Banner */}
      <AnimatePresence>
        {showTagBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            className="absolute top-0 left-0 right-0 z-50 bg-[#b8e2ec] border-b-[2px] border-black px-4 py-2.5 flex items-center justify-between shadow-lg"
          >
            <div className="font-viaoda text-[13px] sm:text-[14px] font-normal tracking-tight text-black text-center flex-1 leading-snug">
              {isEs
                ? 'Toma captura de pantalla a tu lectura y etiqueta a @pragmagicka 📸'
                : 'Take a screenshot of your reading and tag @pragmagicka 📸'}
            </div>
            <button
              type="button"
              onClick={() => setShowTagBanner(false)}
              aria-label="Cerrar"
              className="ml-2 p-1 text-black font-bold text-xs hover:opacity-70 cursor-pointer shrink-0 transition-opacity"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Banner */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2.5 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {isEs ? 'TIRADA DE 3 CARTAS' : '3-CARD SPREAD'}
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

      {/* Main Content Area: 3 Cards with Images and Keywords */}
      <div className="flex-1 w-full flex flex-col justify-center items-center py-2.5 px-2 bg-white min-h-0 overflow-hidden">
        {/* 3 Cards Grid Container */}
        <div className="w-full flex justify-center items-start gap-2 sm:gap-2.5 max-w-[340px] mx-auto">
          {cards.slice(0, 3).map((card, idx) => {
            const cardName = isEs
              ? card.spanishName || card.frenchName
              : card.name || card.frenchName;
            const keywords = isEs
              ? card.spanishKeywords || card.keywords
              : card.keywords;

            return (
              <motion.div
                key={card.id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="flex-1 flex flex-col items-center text-center min-w-0"
              >
                {/* Card Frame & Image */}
                <div
                  className="w-full relative border-[1.5px] border-black rounded-[3px] bg-[#faf7ee] overflow-hidden shadow-sm flex items-center justify-center mb-1.5"
                  style={{ aspectRatio: '546 / 948' }}
                >
                  <img
                    src={card.imageUrl}
                    alt={cardName}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    loading="eager"
                  />
                </div>

                {/* Card Title */}
                <h3 className="font-viaoda text-[11px] sm:text-[12px] font-bold text-black uppercase tracking-tight leading-tight line-clamp-1 mb-1">
                  {cardName}
                </h3>

                {/* Keywords List */}
                <div className="w-full flex flex-col gap-0.5">
                  {keywords.map((kw, kwIdx) => (
                    <span
                      key={kwIdx}
                      className="font-playfair text-[9.5px] sm:text-[10px] text-black/85 leading-tight font-normal"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Menu Area: "Y AHORA...¿QUÉ HAGO CON ESTO?" */}
      <div className="w-full relative shrink-0 z-30">
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-30 bg-black/20"
              />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-0 right-0 z-40 bg-white border-t-[2px] border-b-[2px] border-black shadow-xl flex flex-col divide-y divide-black"
              >
                {/* 1. WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppAction}
                  className="w-full bg-[#FFE600] hover:bg-[#f2db00] active:bg-[#e2cb00] p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-bold tracking-tight text-black uppercase leading-tight">
                    {isEs ? 'REVISÉMOSLA DE CERCA' : "LET'S LOOK AT IT CLOSER"}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/85 font-normal mt-0.5">
                    {isEs ? '¡Estoy para ayudarte! :)' : "I'm here to help! :)"}
                  </span>
                </button>

                {/* 2. Instagram */}
                <button
                  type="button"
                  onClick={handleInstagramShareOption}
                  className="w-full bg-[#b8e2ec] hover:bg-[#a6d8e4] active:bg-[#94cee0] p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-bold tracking-tight text-black uppercase leading-tight">
                    {isEs
                      ? '¿COMPARTIENDO TU LECTURA? ETIQUETA A @PRAGMAGICKA'
                      : 'SHARING YOUR READING? TAG @PRAGMAGICKA'}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/80 font-normal mt-0.5">
                    {isEs
                      ? 'Toca aquí para abrir Instagram'
                      : 'Tap here to open Instagram'}
                  </span>
                </button>

                {/* 3. Apoyar proyecto */}
                <button
                  type="button"
                  onClick={handleOpenSupport}
                  className="w-full bg-white hover:bg-neutral-50 p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-normal tracking-tight text-black uppercase">
                    {isEs ? 'Apoyar el proyecto' : 'Support the project'}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/75 font-normal mt-0.5">
                    {isEs ? 'Invítame un café / Ko-fi' : 'Buy me a coffee / Ko-fi'}
                  </span>
                </button>

                {/* 4. Cambiar tema */}
                <button
                  type="button"
                  onClick={handleNewReading}
                  className="w-full bg-white hover:bg-neutral-50 p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-normal tracking-tight text-black uppercase">
                    {isEs ? 'Cambiar de consulta' : 'Change question'}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/75 font-normal mt-0.5">
                    {isEs ? 'Volver al menú inicial' : 'Return to main menu'}
                  </span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Yellow Button */}
        <div className="w-full border-t-[2px] border-black bg-[#ffff00]">
          <motion.button
            id="btn-three-cards-more"
            type="button"
            onClick={() => {
              tarotAudio.playClick();
              setIsMenuOpen((prev) => !prev);
            }}
            whileHover={{ filter: 'brightness(0.96)' }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-[#ffff00] py-3 px-4 text-center font-viaoda text-base sm:text-lg font-bold tracking-tight text-black flex items-center justify-center gap-2 cursor-pointer uppercase transition-all"
          >
            <span className="truncate">
              {isEs ? 'Y AHORA...¿QUÉ HAGO CON ESTO?' : 'AND NOW...WHAT DO I DO WITH THIS?'}
            </span>
            {isMenuOpen ? (
              <ChevronDown className="w-4 h-4 stroke-[2] shrink-0" />
            ) : (
              <ChevronUp className="w-4 h-4 stroke-[2] shrink-0" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Support / Ko-fi Modal */}
      <KofiModal
        isOpen={isKofiModalOpen}
        onClose={() => setIsKofiModalOpen(false)}
        language={language}
      />
    </div>
  );
};
