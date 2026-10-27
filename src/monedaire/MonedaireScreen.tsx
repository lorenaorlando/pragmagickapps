import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/language';
import { ScreenHeader } from '../components/ScreenHeader';
import { Modal } from '../components/modals';
import { Coin, CoinResult } from './Coin';
import { LogList, LogEntry } from './LogList';
import { ReflectionTimer } from './ReflectionTimer';
import { MONEDAIRE_TEXT } from './i18n';
import { playCoinFlipSound, playCoinLandSound } from './audio';
import { track } from '../lib/analytics';

const STORAGE_KEY = 'moneda_app_logs_v1';
const OUTCOMES: LogEntry['result'][] = ['up', 'down', 'question'];
const MAX_LOGS = 10;

const loadLogs = (): LogEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const MonedaireScreen: React.FC = () => {
  const { language } = useLanguage();
  const t = MONEDAIRE_TEXT[language];
  const [result, setResult] = useState<CoinResult>('empty');
  const [flipping, setFlipping] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>(loadLogs);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, [logs]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    playCoinFlipSound();
    const final = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];

    // Flicker through faces mid-air, then land
    for (let i = 1; i <= 7; i++) {
      timers.current.push(window.setTimeout(() => setResult(OUTCOMES[i % 3]), i * 120));
    }
    timers.current.push(
      window.setTimeout(() => {
        setResult(final);
        setFlipping(false);
        playCoinLandSound();
        track('coin_flip', { result: final });
        setLogs((prev) => [{ id: Date.now().toString(), result: final, topic: '', timestamp: Date.now() }, ...prev].slice(0, MAX_LOGS));
      }, 1350),
    );
  };

  const landed = !flipping && result !== 'empty';

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader
        title={t.title}
        back="/menu"
        right={
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="shrink-0 rounded-full border-2 border-ink bg-yellow px-3 py-1 font-display text-[15px] lowercase shadow-hard"
          >
            {t.info}
          </button>
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="dots-soft flex flex-col items-center px-5 pt-4 pb-5">
          <ol className="flex flex-col gap-0.5 text-[13.5px] text-center lowercase">
            {t.steps.map((step, i) => (
              <li key={step}>
                <span className="font-mono text-[11px] mr-1.5">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="perspective mt-3">
            <motion.div
              animate={
                flipping
                  ? { y: [0, -90, -120, -70, -8, 0], rotateY: [0, 720, 1440, 1800, 2160], rotateX: [0, 45, -30, 15, 0], scale: [1, 1.12, 1.18, 1.08, 0.96, 1] }
                  : { y: 0, rotateY: 0, rotateX: 0, scale: 1 }
              }
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-44 preserve-3d"
            >
              <Coin type={result} className="w-full h-full" />
            </motion.div>
          </div>
          <AnimatePresence>
            {!flipping && result === 'question' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-yellow border-2 border-ink px-3 py-1 font-display text-[17px] lowercase"
              >
                {t.questionOutcome}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {landed && <ReflectionTimer t={t} />}
        <LogList logs={logs} onUpdateTopic={(id, topic) => setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, topic } : l)))} t={t} />
      </div>

      <button
        type="button"
        onClick={flip}
        disabled={flipping}
        className="shrink-0 border-t-2 border-ink bg-yellow py-3.5 font-display text-[22px] tracking-widest disabled:opacity-80"
      >
        {flipping ? t.flipping : t.flip}
      </button>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title={t.about.title}>
        <div className="p-5 flex flex-col gap-3.5 text-[15px] leading-relaxed lowercase">
          {t.about.paragraphs.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <p className="italic pt-2">{t.about.withLove}</p>
          <a href="https://lorenaorlando.com" target="_blank" rel="noopener noreferrer" className="font-display text-[17px] self-start">
            -Lorena
          </a>
        </div>
      </Modal>
    </div>
  );
};
