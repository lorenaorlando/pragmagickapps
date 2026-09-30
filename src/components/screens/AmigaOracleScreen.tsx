import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Send, RotateCcw } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { STICKER_ORACLE_ITEMS, StickerOracleItem } from '../../data/stickers';
import { tarotAudio } from '../../utils/audio';
import { KofiModal } from '../modals/KofiModal';

interface AmigaOracleScreenProps {
  language: Language;
  onRestart: () => void;
}

export const AmigaOracleScreen: React.FC<AmigaOracleScreenProps> = ({
  language,
  onRestart,
}) => {
  const isEs = language === 'es';
  const defaultPrompt = isEs
    ? 'señora de los stickers, me puede ayudar?'
    : 'sticker lady, can you help me?';

  const [inputText, setInputText] = useState(defaultPrompt);
  const [isRevealed, setIsRevealed] = useState(false);
  const [chosenSticker, setChosenSticker] = useState<StickerOracleItem | null>(null);
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

  const handleSend = () => {
    tarotAudio.playClick();
    const randomIndex = Math.floor(Math.random() * STICKER_ORACLE_ITEMS.length);
    const sticker = STICKER_ORACLE_ITEMS[randomIndex];
    setChosenSticker(sticker);

    setTimeout(() => {
      tarotAudio.playChime();
      setIsRevealed(true);
    }, 150);
  };

  const handleAnotherSticker = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    setIsRevealed(false);
    setInputText(defaultPrompt);
  };

  // Menu action: WhatsApp
  const handleWhatsAppAction = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    window.open(
      'https://wa.me/573138642943?text=Hola!%20vengo%20de%20Pragmagick.app%20y%20quiero%20profundizar%20mi%20lectura',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Menu action: Instagram
  const handleInstagramShareOption = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    triggerTagBanner();
    window.open('https://instagram.com/pragmagicka/', '_blank', 'noopener,noreferrer');
  };

  // Menu action: Ko-fi
  const handleOpenSupport = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    setIsKofiModalOpen(true);
  };

  // Menu action: New reading / Change topic
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
                ? 'Toma captura de pantalla a tu sticker y etiqueta a @pragmagicka 📸'
                : 'Take a screenshot of your sticker and tag @pragmagicka 📸'}
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
          AMIGAAAAAAAH
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

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col justify-center items-center py-4 px-4 bg-white min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* Stage 1: Chat-like input */
            <motion.div
              key="chat-input-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center max-w-[320px] px-2"
            >
              {/* Sticker Illustration */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-3 flex items-center justify-center drop-shadow-sm">
                <img
                  src="https://sandboxlandia.online/wp-content/uploads/2026/09/AMIGAH.png"
                  alt="Amigah"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  loading="eager"
                />
              </div>

              {/* Title / Prompt */}
              <p className="font-viaoda text-lg sm:text-xl text-black text-center uppercase tracking-tight mb-5 font-normal">
                {isEs ? 'ORÁCULO DE STICKERS' : 'STICKER ORACLE'}
              </p>

              {/* Chat Input Bubble */}
              <div className="w-full bg-neutral-100 rounded-full border-[2px] border-black py-1.5 pl-4 pr-1.5 flex items-center justify-between shadow-sm focus-within:ring-2 focus-within:ring-black">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="flex-1 bg-transparent text-[10px] text-black font-playfair outline-none placeholder:text-neutral-500 pr-2 font-normal"
                  placeholder={defaultPrompt}
                />

                {/* Send Button with continuous pulsing effect */}
                <motion.button
                  type="button"
                  onClick={handleSend}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  aria-label="Enviar mensaje"
                  className="w-10 h-10 rounded-full bg-[#3ee04e] hover:bg-[#34c742] border-[1.5px] border-black text-black flex items-center justify-center cursor-pointer shadow-sm shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4 text-black translate-x-0.5" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Stage 2: Revealed Sticker and Message */
            <motion.div
              key="sticker-revealed-stage"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center justify-center text-center px-3"
            >
              {/* Sticker Image */}
              {chosenSticker && (
                <div className="relative flex items-center justify-center max-w-[210px] sm:max-w-[230px] max-h-[210px] sm:max-h-[230px] mb-4 drop-shadow-md">
                  <img
                    src={chosenSticker.imageUrl}
                    alt={chosenSticker.name}
                    className="w-full h-full object-contain pointer-events-none select-none max-h-[210px] sm:max-h-[230px]"
                    loading="eager"
                  />
                </div>
              )}

              {/* Message text right below sticker */}
              {chosenSticker && (
                <div className="w-full max-w-[280px] sm:max-w-[300px] mx-auto px-2">
                  <p className="font-viaoda text-[15px] sm:text-[16.5px] leading-[1.5] text-black tracking-tight uppercase whitespace-pre-line text-center font-normal">
                    {chosenSticker.message}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full relative shrink-0 z-30">
        <AnimatePresence>
          {isRevealed ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Animated Drop-up Menu */}
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
                      {/* 1. Pedir otro sticker / Volver a consultar */}
                      <button
                        type="button"
                        onClick={handleAnotherSticker}
                        className="w-full bg-[#ffff00] hover:bg-[#f2db00] p-3.5 text-left transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-viaoda text-base sm:text-[17px] font-bold tracking-tight text-black uppercase leading-tight">
                            {isEs ? 'PEDIR OTRO STICKER' : 'ASK FOR ANOTHER STICKER'}
                          </span>
                          <span className="font-playfair text-[11px] sm:text-[12px] text-black/85 font-normal mt-0.5">
                            {isEs ? 'Volver a consultar al oráculo' : 'Consult the oracle again'}
                          </span>
                        </div>
                        <RotateCcw className="w-5 h-5 text-black shrink-0 ml-2" />
                      </button>

                      {/* 2. Instagram */}
                      <button
                        type="button"
                        onClick={handleInstagramShareOption}
                        className="w-full bg-[#b8e2ec] hover:bg-[#a6d8e4] active:bg-[#94cee0] p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                      >
                        <span className="font-viaoda text-base sm:text-[17px] font-bold tracking-tight text-black uppercase leading-tight">
                          {isEs
                            ? '¿COMPARTIENDO TU STICKER? ETIQUETA A @PRAGMAGICKA'
                            : 'SHARING YOUR STICKER? TAG @PRAGMAGICKA'}
                        </span>
                        <span className="font-playfair text-[11px] sm:text-[12px] text-black/80 font-normal mt-0.5">
                          {isEs
                            ? 'Toca aquí para abrir Instagram'
                            : 'Tap here to open Instagram'}
                        </span>
                      </button>

                      {/* 4. Apoyar proyecto */}
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

                      {/* 5. Cambiar tema */}
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

              {/* Main Button */}
              <div className="w-full border-t-[2px] border-black bg-[#ffff00]">
                <motion.button
                  id="btn-amiga-more"
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
            </motion.div>
          ) : (
            <div className="w-full border-t-[2px] border-black bg-white py-2.5 px-4 text-center shrink-0">
              <span className="font-viaoda text-[12px] tracking-wider text-black lowercase font-normal">
                @pragmagicka · pragmagick.app
              </span>
            </div>
          )}
        </AnimatePresence>
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
