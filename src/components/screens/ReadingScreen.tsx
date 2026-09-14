import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toBlob, toPng } from 'html-to-image';
import { TarotCardFront } from '../TarotCardFront';
import { TarotCard, Language, QuestionOption } from '../../types';
import {
  MAJOR_ARCANA,
  CURRENT_MOMENT_READINGS,
  DONT_KNOW_WHAT_TO_DO_READINGS,
  THINKING_ABOUT_SOMEONE_READINGS,
} from '../../data/tarotCards';
import { TRANSLATIONS } from '../../data/translations';
import { tarotAudio } from '../../utils/audio';
import { KofiModal } from '../modals/KofiModal';

interface ReadingScreenProps {
  language: Language;
  card?: TarotCard;
  question?: QuestionOption;
  onRestart: () => void;
  onLogReading?: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({
  language,
  card: providedCard,
  question,
  onRestart,
}) => {
  const t = TRANSLATIONS[language];
  const card: TarotCard = providedCard || MAJOR_ARCANA[0];

  const cardTitle = language === 'es' ? (card.spanishName || card.frenchName) : (card.name || card.frenchName);
  const keyWords = language === 'es' ? (card.spanishKeywords || card.keywords) : card.keywords;

  // Custom response based on selected question:
  let answerText = '';
  if (question?.id === 'q1') {
    answerText = DONT_KNOW_WHAT_TO_DO_READINGS[card.id]?.[language] ||
      (language === 'es' ? (card.spanishReadingSummary || card.readingSummary) : card.readingSummary);
  } else if (question?.id === 'q2') {
    answerText = THINKING_ABOUT_SOMEONE_READINGS[card.id]?.[language] ||
      (language === 'es' ? (card.spanishReadingSummary || card.readingSummary) : card.readingSummary);
  } else {
    const customCurrentMomentText = CURRENT_MOMENT_READINGS[card.id]?.[language];
    answerText = customCurrentMomentText ||
      (language === 'es' ? (card.spanishReadingSummary || card.readingSummary) : card.readingSummary);
  }

  const readingCardRef = useRef<HTMLDivElement>(null);
  const [showTagBanner, setShowTagBanner] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const bannerTimerRef = useRef<number | null>(null);

  const triggerTagBanner = () => {
    setShowTagBanner(true);
    if (bannerTimerRef.current) {
      window.clearTimeout(bannerTimerRef.current);
    }
    bannerTimerRef.current = window.setTimeout(() => {
      setShowTagBanner(false);
    }, 6000);
  };

  // Detect user screenshot shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 's', 'S'].includes(e.key))
      ) {
        triggerTagBanner();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        triggerTagBanner();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
    };
  }, []);

  // Instagram navigation handler for Pragmagicka logo/text
  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    tarotAudio.playClick();
    window.open('https://www.instagram.com/pragmagicka/', '_blank', 'noopener,noreferrer');
  };

  // Menu action: Opción 1 - Profundizar lectura (Agendar lectura personalizada en Ko-fi Shop)
  const handleScheduleReading = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    window.open('https://ko-fi.com/pragmagicka/shop', '_blank', 'noopener,noreferrer');
  };

  // Menu action: Opción 2 - Apoyar el proyecto (Modal Ko-fi)
  const handleOpenSupport = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    setIsKofiModalOpen(true);
  };

  // Menu action: Compartir lectura (HTML-to-image + Canvas Watermark + Web Share API / Download Fallback)
  const handleShareReading = async () => {
    if (isSharing || !readingCardRef.current) return;
    setIsSharing(true);
    tarotAudio.playClick();
    setIsMenuOpen(false);
    triggerTagBanner();

    try {
      // 1. Wait briefly for menu animation and font rendering to settle
      if (document.fonts) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 120));

      const node = readingCardRef.current;
      if (!node) throw new Error('Reading card element not found');

      const width = node.offsetWidth || 360;
      const height = node.offsetHeight || 580;
      const scale = 2; // High-resolution export for Stories

      // 2. Capture the exact reading card container with html-to-image
      const rawDataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: scale,
        cacheBust: true,
        backgroundColor: '#ffffff',
        width,
        height,
        canvasWidth: width * scale,
        canvasHeight: height * scale,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: `${width}px`,
          maxHeight: `${height}px`,
          transform: 'none',
          margin: '0',
        },
      });

      // 3. Composite aesthetic post-generation watermark onto a 2D Canvas
      const cardImg = new Image();
      cardImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        cardImg.onload = () => resolve();
        cardImg.onerror = (e) => reject(e);
        cardImg.src = rawDataUrl;
      });

      const watermarkHeight = 38 * scale;
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = cardImg.width;
      finalCanvas.height = cardImg.height + watermarkHeight;

      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas 2d context');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw captured reading card
      ctx.drawImage(cardImg, 0, 0);

      // Draw solid black divider line above the watermark banner
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, cardImg.height, finalCanvas.width, 2 * scale);

      // Draw watermark text in Serif typography
      const textCenterY = cardImg.height + (watermarkHeight / 2) + (1 * scale);
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `400 ${12 * scale}px 'Viaoda Libre', Georgia, serif`;
      ctx.fillText('@pragmagicka | pragmagick.app', finalCanvas.width / 2, textCenterY);

      // 4. Convert final canvas to Blob and File
      const blob = await new Promise<Blob | null>((resolve) => {
        finalCanvas.toBlob((b) => resolve(b), 'image/png', 1.0);
      });

      if (!blob) throw new Error('Failed to generate final image blob');

      const fileName = `pragmagick-lectura-${card.id ?? 'card'}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // 5. Try native Web Share API with files if supported (iOS / Android)
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: isEs ? 'Mi lectura en Pragmagicka' : 'My Pragmagicka Reading',
          text: '@pragmagicka | pragmagick.app',
        });
      } else {
        // 6. Fallback: Automatic PNG download
        const finalDataUrl = finalCanvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = finalDataUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err: unknown) {
      const errorObj = err as { name?: string; message?: string };
      // User dismissed native share sheet: normal mobile flow
      if (errorObj?.name === 'AbortError') {
        return;
      }
      console.warn('Share operation fell back to direct download:', err);
      try {
        if (readingCardRef.current) {
          const fallbackDataUrl = await toPng(readingCardRef.current, {
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: '#ffffff',
          });
          const downloadLink = document.createElement('a');
          downloadLink.href = fallbackDataUrl;
          downloadLink.download = `pragmagick-lectura-${card.id ?? 'card'}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      } catch (fallbackErr) {
        console.error('Direct fallback export failed:', fallbackErr);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Menu action: Opción 4 - Nueva lectura
  const handleNewReading = () => {
    tarotAudio.playClick();
    setIsMenuOpen(false);
    onRestart();
  };

  const isEs = language === 'es';

  return (
    <div className="relative w-full h-full flex flex-col bg-white text-black select-none overflow-hidden justify-between">
      {/* Floating Instagram Tag Banner / Toast */}
      <AnimatePresence>
        {showTagBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            className="absolute top-0 left-0 right-0 z-50 bg-white border-b-[2px] border-black px-4 py-2.5 flex items-center justify-between shadow-lg"
          >
            <div className="font-playfair text-xs sm:text-[13px] tracking-normal text-black text-center flex-1 leading-snug">
              <span>{isEs ? '¿Vas a compartir instagram? ' : 'Sharing on Instagram? '}</span>
              <span className="font-medium">
                {isEs ? 'Etiquéta a ' : 'Tag '}
                <a
                  href="https://www.instagram.com/pragmagicka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="underline font-bold text-black hover:opacity-75 transition-opacity px-0.5"
                >
                  @pragmagicka
                </a>
              </span>
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

      {/* Main Printable / Capture Reading Area */}
      <div ref={readingCardRef} className="flex-1 w-full flex flex-col min-h-0 bg-white">
        {/* Top Header Banner: YOUR READING / TU LECTURA + pragmagick.app */}
        <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2 px-4 flex items-center justify-between shrink-0">
          <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left">
            {t.reading.banner}
          </h2>
          <a
            href="https://www.instagram.com/pragmagicka/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-viaoda text-[13px] sm:text-[14.5px] tracking-wider text-black lowercase font-normal hover:opacity-75 transition-opacity shrink-0 ml-2"
          >
            pragmagick.app
          </a>
        </div>

        {/* Card & Reading Content */}
        <div className="flex-1 w-full flex flex-col min-h-0 bg-white">
          {/* Top Half: Card on left + Title & Keywords on right */}
          <div className="flex-1 w-full flex items-center justify-center px-4 py-2 bg-white min-h-0">
            <div className="flex items-center justify-center w-full max-w-[340px] gap-3.5 sm:gap-5">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="shrink-0 drop-shadow-md"
              >
                <TarotCardFront
                  card={card}
                  size="md"
                  className="w-[84px] sm:w-[96px] h-auto border-[1.5px] border-black"
                />
              </motion.div>

              <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                <h3 className="font-viaoda text-xl sm:text-[24px] font-normal tracking-tight text-black uppercase leading-tight mb-2">
                  {cardTitle}
                </h3>

                <div className="flex flex-col space-y-1.5">
                  {keyWords.slice(0, 3).map((word, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-1" />
                      <span className="font-viaoda text-[11px] sm:text-[13px] leading-tight font-normal tracking-tight text-black uppercase">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Separator Banner: YOUR ANSWER / TU RESPUESTA */}
          <div className="w-full bg-white border-t-[2px] border-b-[2px] border-black py-1.5 px-4 text-center shrink-0">
            <h3 className="font-viaoda text-lg sm:text-xl font-normal tracking-tight text-black uppercase">
              {t.reading.answerBanner}
            </h3>
          </div>

          {/* Bottom Half: Interpretation text */}
          <div className="flex-1 w-full flex flex-col justify-center items-center py-3 px-6 bg-white overflow-y-auto min-h-0">
            <p className="font-playfair text-[12px] sm:text-[12.5px] leading-[1.65] text-black tracking-normal text-center max-w-[260px] mx-auto whitespace-pre-line">
              {answerText}
            </p>
          </div>
        </div>
      </div>

      {/* Single "MÁS" Button & Expandable Menu Container */}
      <div className="w-full relative shrink-0 z-30">
        {/* Animated Drop-up / Expandable Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Subtle backdrop dismissal */}
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
                {/* Option 1: Profundizar lectura */}
                <button
                  type="button"
                  onClick={handleScheduleReading}
                  className="w-full bg-white hover:bg-neutral-50 p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-normal tracking-tight text-black uppercase">
                    {isEs ? 'Profundizar lectura' : 'Deepen reading'}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/75 font-normal mt-0.5">
                    {isEs
                      ? 'Agenda una lectura personalizada'
                      : 'Schedule a personalized reading'}
                  </span>
                </button>

                {/* Option 2: Compartir lectura */}
                <button
                  type="button"
                  onClick={handleShareReading}
                  disabled={isSharing}
                  className="w-full bg-white hover:bg-neutral-50 p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer disabled:opacity-60"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-normal tracking-tight text-black uppercase">
                    {isSharing
                      ? (isEs ? 'Generando imagen...' : 'Generating image...')
                      : (isEs ? 'Compartir lectura' : 'Share reading')}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/75 font-normal mt-0.5">
                    {isEs
                      ? 'Genera la imagen para tus Stories'
                      : 'Generate image for your Stories'}
                  </span>
                </button>

                {/* Option 3: Apoyar el proyecto */}
                <button
                  type="button"
                  onClick={handleOpenSupport}
                  className="w-full bg-white hover:bg-neutral-50 p-3.5 text-left transition-colors flex flex-col justify-center cursor-pointer"
                >
                  <span className="font-viaoda text-base sm:text-[17px] font-normal tracking-tight text-black uppercase">
                    {isEs ? 'Apoyar el proyecto' : 'Support the project'}
                  </span>
                  <span className="font-playfair text-[11px] sm:text-[12px] text-black/75 font-normal mt-0.5">
                    {isEs
                      ? 'Invítame un café / Ko-fi'
                      : 'Buy me a coffee / Ko-fi'}
                  </span>
                </button>

                {/* Option 4: Nueva lectura */}
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

        {/* Yellow (#ffff00) "MÁS" Button */}
        <div className="w-full border-t-[2px] border-black bg-[#ffff00]">
          <motion.button
            id="btn-reading-more"
            type="button"
            onClick={() => {
              tarotAudio.playClick();
              setIsMenuOpen((prev) => !prev);
            }}
            whileHover={{ filter: 'brightness(0.96)' }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-[#ffff00] py-3 px-4 text-center font-viaoda text-lg sm:text-xl font-normal tracking-wide text-black flex items-center justify-center gap-2 cursor-pointer uppercase transition-all"
          >
            <span>{isEs ? 'MÁS' : 'MORE'}</span>
            {isMenuOpen ? (
              <ChevronDown className="w-4 h-4 stroke-[2]" />
            ) : (
              <ChevronUp className="w-4 h-4 stroke-[2]" />
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
