import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../lib/language';
import { drawCards } from '../../lib/cards';
import { playShuffle } from '../../lib/audio';
import { TarotCard } from '../../types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CardBack, CardFan, CARD_RATIO } from '../../components/cards';

type Phase = 'breathe' | 'idle' | 'shuffling' | 'choose' | 'ready';

interface ShuffleStageProps {
  count: 1 | 3;
  onDone: (cards: TarotCard[]) => void;
}

export const ShuffleStage: React.FC<ShuffleStageProps> = ({ count, onDone }) => {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('breathe');
  const [picked, setPicked] = useState<number[]>([]);
  const [cards] = useState(() => drawCards(count));

  useEffect(() => {
    const timer = setTimeout(() => setPhase('idle'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const shuffle = () => {
    if (phase !== 'idle') return;
    setPhase('shuffling');
    playShuffle();
    setTimeout(() => setPhase('choose'), 1300);
  };

  const pick = (index: number) => {
    if (phase !== 'choose' || picked.includes(index)) return;
    const next = [...picked, index];
    setPicked(next);
    if (next.length === count) setPhase('ready');
  };

  const prompt = {
    breathe: count === 1 ? t.shuffle.breatheOne : t.shuffle.breatheThree,
    idle: t.shuffle.tapToShuffle,
    shuffling: t.shuffle.shuffling,
    choose: count === 1 ? t.shuffle.chooseOne : t.shuffle.chooseThree(picked.length),
    ready: count === 1 ? t.shuffle.readyOne : t.shuffle.readyThree,
  }[phase];

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.shuffle.banner} back="/tarot" />
      <div className="flex-1 min-h-0 flex flex-col items-center justify-between py-5 px-4 dots-soft">
        <div className="flex gap-3 justify-center">
          {Array.from({ length: count }, (_, slot) => (
            <div
              key={slot}
              className={`${count === 1 ? 'w-[110px]' : 'w-[84px]'} rounded-[6px] border-2 border-dashed border-ink/50 bg-white flex items-center justify-center`}
              style={{ aspectRatio: CARD_RATIO }}
            >
              <AnimatePresence>
                {picked.length > slot ? (
                  <motion.div
                    className="w-full h-full"
                    initial={{ y: 160, opacity: 0, scale: 0.85 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  >
                    <CardBack className="w-full h-full shadow-hard" />
                  </motion.div>
                ) : (
                  <span className="font-display text-2xl text-black/30">{slot + 1}</span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="relative min-h-[64px] flex items-center justify-center text-center px-4">
          {phase === 'breathe' && (
            <motion.span
              aria-hidden="true"
              className="absolute w-[150px] h-[150px] rounded-full bg-yellow border-2 border-ink -z-0"
              animate={{ scale: [0.55, 1, 0.55], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          )}
          <AnimatePresence mode="wait">
            <motion.p
              key={prompt}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`relative text-[16px] leading-snug max-w-[270px] ${phase === 'breathe' ? 'italic' : 'font-medium'}`}
            >
              {prompt}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className={phase === 'idle' ? 'cursor-pointer w-full' : 'w-full'} onClick={shuffle}>
          <CardFan
            count={count === 1 ? 5 : 7}
            shuffling={phase === 'shuffling'}
            interactive={phase === 'choose'}
            picked={picked}
            onPick={pick}
          />
        </div>
      </div>
      <button
        type="button"
        disabled={phase !== 'ready'}
        onClick={() => onDone(cards)}
        className="shrink-0 border-t-2 border-ink bg-yellow py-3.5 font-display text-[21px] uppercase disabled:bg-neutral-200 disabled:text-black/40 transition-colors"
      >
        {t.shuffle.reveal}
      </button>
    </div>
  );
};
