import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/language';
import { Language } from '../types';
import { Sticker } from '../components/Sticker';

const LANGS: { value: Language; label: string; start: string }[] = [
  { value: 'en', label: 'ENGLISH', start: 'START' },
  { value: 'es', label: 'ESPAÑOL', start: 'COMENZAR' },
];

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const [chosen, setChosen] = useState<Language | null>(null);

  const choose = (lang: Language) => {
    setChosen(lang);
    setLanguage(lang);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-6 py-6 dots-soft overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[132px] h-[132px] shrink-0"
      >
        <img
          src="/brand/logo-circle.webp"
          alt="Pragmagicka"
          className="w-full h-full rounded-full border-2 border-ink"
        />
        <motion.div
          initial={{ x: 30, opacity: 0, rotate: 30 }}
          animate={{ x: 0, opacity: 1, rotate: 6 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 14 }}
          className="absolute -right-[74px] -bottom-3 w-[86px]"
        >
          <Sticker slug="00-el-loco" className="w-full" />
        </motion.div>
      </motion.div>

      <h1 className="font-display text-[38px] leading-[0.95] text-center tracking-tight">
        PRAGMAGICK
        <br />
        APP
      </h1>

      <div className="flex flex-col gap-3.5 text-center max-w-[290px]">
        <div>
          <p className="text-[15px] leading-snug font-medium">esoteric tools<br />for our digital present</p>
          <p className="text-[11.5px] leading-snug text-black/70 mt-1">(all card meanings are written by me, a human)</p>
        </div>
        <span className="mx-auto w-10 border-t-2 border-ink" aria-hidden="true" />
        <div>
          <p className="text-[15px] leading-snug font-medium">herramientas esotéricas<br />para nuestro presente digital</p>
          <p className="text-[11.5px] leading-snug text-black/70 mt-1">(todos los significados de las cartas fueron escritos por mí, una humana)</p>
        </div>
      </div>

      <div className="w-full max-w-[290px] flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {LANGS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => choose(l.value)}
              aria-pressed={chosen === l.value}
              className={`rounded-full border-2 border-ink py-2.5 font-display text-[17px] tracking-tight transition-all ${
                chosen === l.value ? 'bg-yellow shadow-none translate-x-[3px] translate-y-[3px]' : 'bg-white shadow-hard'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="h-[54px]">
          <AnimatePresence mode="wait">
            {chosen && (
              <motion.button
                key={chosen}
                type="button"
                onClick={() => navigate('/menu')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full h-full rounded-full border-2 border-ink bg-yellow font-display text-[24px] tracking-tight shadow-hard"
              >
                {LANGS.find((l) => l.value === chosen)!.start} ✦
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
