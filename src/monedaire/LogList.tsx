import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coin } from './Coin';
import { MonedaireStrings } from './i18n';

export interface LogEntry {
  id: string;
  result: 'up' | 'down' | 'question';
  topic: string;
  timestamp: number;
}

const formatDate = (timestamp: number) => {
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

interface LogListProps {
  logs: LogEntry[];
  onUpdateTopic: (id: string, topic: string) => void;
  t: MonedaireStrings;
}

export const LogList: React.FC<LogListProps> = ({ logs, onUpdateTopic, t }) => (
  <section>
    <h2 className="border-y-2 border-ink bg-sky py-2 text-center font-display text-[17px] lowercase">{t.logs.header}</h2>
    {logs.length === 0 ? (
      <p className="px-6 py-6 text-center italic text-black/50 text-[14px]">{t.logs.empty}</p>
    ) : (
      <ul className="divide-y-2 divide-ink border-b-2 border-ink">
        <AnimatePresence initial={false}>
          {logs.map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <span className="font-mono text-[11px] text-black/60 tabular-nums">{formatDate(entry.timestamp)}</span>
              <input
                id={`log-${entry.id}`}
                type="text"
                value={entry.topic}
                onChange={(e) => onUpdateTopic(entry.id, e.target.value)}
                placeholder={t.logs.placeholder}
                aria-label={t.logs.placeholder}
                className="flex-1 min-w-0 bg-transparent text-[15px] outline-none focus:border-b focus:border-ink/40"
              />
              <Coin type={entry.result} className="w-10 h-10 shrink-0" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    )}
  </section>
);
