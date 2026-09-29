import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TarotCardBack } from '../TarotCardBack';
import { TarotCardFront } from '../TarotCardFront';
import { Language, TarotCard } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { MAJOR_ARCANA, WEEKLY_TAROT_READINGS } from '../../data/tarotCards';
import { tarotAudio } from '../../utils/audio';
import { KofiModal } from '../modals/KofiModal';

interface WeeklyTarotChoiceScreenProps {
  language: Language;
  onRestart: () => void;
}

export const WeeklyTarotChoiceScreen: React.FC<WeeklyTarotChoiceScreenProps> = ({
  language,
  onRestart,
}) => {
  const [chosenCard, setChosenCard] = useState<TarotCard | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTagBanner, setShowTagBanner] = useState(false);
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);
  const bannerTimerRef = useRef<number | null>(null);

  const t = TRANSLATIONS[language];
  const isEs = language === 'es';

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

  const handleSelectCard = (index: number) => {
    if (isRevealed) return;
    tarotAudio.playClick();
    setSelectedIndex(index);

    // Pick random card from 22 Major Arcana cards
    const randomIndex = Math.floor(Math.random() * MAJOR_ARCANA.length);
    const card = MAJOR_ARCANA[randomIndex];
    setChosenCard(card);

    // Trigger reveal sequence
    setTimeout(() => {
      tarotAudio.playChime();
      setIsRevealed(true);
    }, 150);
  };

  // Menu action: Opción 1 destacada - WhatsApp
  const handleWhatsAppAction = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    window.open(
      'https://wa.me/573138642943?text=Hola!%20vengo%20de%20Pragmagick.app%20y%20quiero%20profundizar%20mi%20lectura',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Menu action: Opción 2 destacada (Fondo celeste) - Instagram
  const handleInstagramShareOption = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    triggerTagBanner();
    window.open('https://instagram.com/pragmagicka/', '_blank', 'noopener,noreferrer');
  };

  // Menu action: Opción 3 - Apoyar el proyecto
  const handleOpenSupport = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    setIsKofiModalOpen(true);
  };

  // Menu action: Opción 4 - Nueva lectura
  const handleNewReading = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    onRestart();
  };

  const cardTitle = chosenCard
    ? isEs
      ? chosenCard.spanishName || chosenCard.frenchName
      : chosenCard.name || chosenCard.frenchName
    : '';

  const answerText = chosenCard
    ? WEEKLY_TAROT_READINGS[chosenCard.id]?.[language] ||
      (isEs ? chosenCard.spanishReadingSummary : chosenCard.readingSummary)
    : '';

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

      {/* Top Header Banner: ELIGE UNA CARTA / ESTA SEMANA... */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2.5 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
          {isRevealed
            ? t.weeklyTarot?.revealedBanner || (isEs ? 'ESTA SEMANA...' : 'THIS WEEK...')
            : t.weeklyTarot?.banner || (isEs ? 'ELIGE UNA CARTA' : 'CHOOSE A CARD')}
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

      {/* Main Center Stage */}
      <div className="flex-1 w-full flex flex-col justify-between items-center py-3 sm:py-4 px-4 bg-white min-h-0 overflow-hidden">
        {/* Upper Area: Slotted / Revealed Card */}
        <div className="w-full flex flex-col items-center justify-center pt-1 shrink-0">
          <div className="relative w-24 sm:w-[104px] h-40 sm:h-[172px] rounded-sm border-[2px] border-black bg-white flex items-center justify-center overflow-hidden shadow-xs">
            <AnimatePresence mode="wait">
              {isRevealed && chosenCard ? (
                <motion.div
                  key={`revealed-${chosenCard.id}`}
                  initial={{ opacity: 0, rotateY: 90, scale: 0.88 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full flex items-center justify-center bg-[#faf7ee]"
                >
                  <img
                    src={chosenCard.imageUrl}
                    alt={cardTitle}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    loading="eager"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Lower / Middle Section: Either 3 Cards OR the Revealed Message */}
        <div className="flex-1 w-full flex flex-col justify-center items-center relative min-h-0 my-auto">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="choice-stage"
                initial={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 180,
                  transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
                }}
                className="w-full flex flex-col items-center justify-center"
              >
                {/* Central Text: "Elige una carta" */}
                <h3 className="font-playfair text-[16px] sm:text-[18px] text-black text-center font-normal tracking-tight mb-5 sm:mb-6">
                  {t.weeklyTarot?.prompt || (isEs ? 'Elige una carta' : 'Choose a card')}
                </h3>

                {/* 3 Face-Down Cards with Numbers 1, 2, 3 */}
                <div className="w-full flex items-center justify-center gap-3 sm:gap-4 px-2">
                  {[1, 2, 3].map((num, idx) => {
                    const isThisSelected = selectedIndex === idx;

                    return (
                      <motion.div
                        key={num}
                        onClick={() => handleSelectCard(idx)}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{
                          y: isThisSelected ? -8 : 0,
                          scale: isThisSelected ? 1.06 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`relative cursor-pointer rounded-sm transition-shadow ${
                          isThisSelected ? 'ring-2 ring-black shadow-lg' : 'shadow-xs hover:shadow-md'
                        }`}
                      >
                        <TarotCardBack
                          size="md"
                          className="w-[78px] sm:w-[88px] h-[134px] sm:h-[150px] border-[2px] border-black"
                          selected={isThisSelected}
                        />

                        {/* High-contrast centered badge with number (1, 2, 3) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-[2px] border-black text-black flex items-center justify-center font-viaoda text-[15px] sm:text-[17px] font-bold shadow-sm">
                            {num}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="meaning-stage"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
                className="w-full flex flex-col items-center justify-center text-center px-4 py-2"
              >
                {/* Arcana Title */}
                <h3 className="font-viaoda text-xl sm:text-[23px] font-normal tracking-tight text-black uppercase leading-tight mb-2">
                  {cardTitle}
                </h3>

                {/* Subtle Divider Line */}
                <div className="w-12 h-[1.5px] bg-black/40 my-1.5" />

                {/* Pragmatic Weekly Interpretation Text */}
                <div className="mt-2 max-w-[270px] sm:max-w-[285px] mx-auto overflow-y-auto max-h-[140px] px-1">
                  <p className="font-playfair text-[13px] sm:text-[14px] leading-[1.6] text-black font-normal whitespace-pre-line text-center">
                    {answerText}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Area: Either simple brand bar OR the full "Y AHORA...¿QUÉ HAGO CON ESTO?" menu */}
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

                      {/* 4. Nueva lectura */}
                      <button
                        type="button"
                        onClick={handleNewReading}
                        className="w-full bg-white hover:bg-neutral-50 p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                      >
                        <span className="font-viaoda text-base sm:text-[17px] font-normal tracking-tight text-black uppercase">
                          {isEs ? 'Nueva lectura' : 'New reading'}
                        </span>
                        <span className="font-playfair text-[11px] sm:text-[12px] text-black/75 font-normal mt-0.5">
                          {isEs ? 'Reiniciar la tirada' : 'Restart the spread'}
                        </span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Main Button with Floating DM Sticker on the right */}
              <div className="w-full relative border-t-[2px] border-black bg-[#ffff00]">
                {/* Floating DM sticker badge on the right, above the chevron arrow */}
                {!isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 8, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.35, duration: 0.4, type: 'spring', stiffness: 260 }}
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInstagramShareOption();
                    }}
                    title="Envíame un DM con la captura de tu resultado"
                    className="absolute -top-[70px] sm:-top-[82px] right-2 sm:right-3 z-30 cursor-pointer select-none drop-shadow-md"
                  >
                    <img
                      src="/dm_semana.svg"
                      alt="Envíame un DM con la captura de tu resultado"
                      className="w-[72px] sm:w-[84px] h-auto object-contain pointer-events-none"
                    />
                  </motion.div>
                )}

                <motion.button
                  id="btn-weekly-more"
                  type="button"
                  onClick={() => {
                    tarotAudio.playClick();
                    setIsMenuOpen((prev) => !prev);
                  }}
                  whileHover={{ filter: 'brightness(0.96)' }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#ffff00] py-3 px-4 text-center font-viaoda text-base sm:text-lg font-bold tracking-tight text-black flex items-center justify-center gap-2 cursor-pointer uppercase transition-all relative"
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
