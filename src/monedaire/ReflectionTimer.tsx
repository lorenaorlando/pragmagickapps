import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MonedaireStrings } from './i18n';

const DURATION = 60;

/** One minute of guided reflection; the question changes every 15 seconds */
export const ReflectionTimer: React.FC<{ t: MonedaireStrings }> = ({ t }) => {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const questions = t.reflection.questions;

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      setActive(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  const index = Math.min(Math.floor((DURATION - timeLeft) / (DURATION / questions.length)), questions.length - 1);

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => {
          setTimeLeft(DURATION);
          setActive(true);
        }}
        className="w-full border-t-2 border-ink bg-sky py-2.5 font-display text-[17px] lowercase"
      >
        {t.reflection.start}
      </button>
    );
  }

  return (
    <div className="w-full border-t-2 border-ink bg-sky dots px-5 py-5 flex flex-col items-center text-center gap-3">
      <span className="font-mono text-3xl tabular-nums flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-ink animate-pulse" />
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </span>
      <div className="w-full max-w-[240px] h-2 rounded-full border-2 border-ink bg-white overflow-hidden">
        <motion.div
          className="h-full bg-ink"
          animate={{ width: `${(timeLeft / DURATION) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>
      <div className="min-h-[3.5rem] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-[18px] italic leading-snug"
          >
            {questions[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button type="button" onClick={() => setActive(false)} className="font-mono text-[11px] uppercase underline underline-offset-2">
        {t.reflection.close}
      </button>
    </div>
  );
};
