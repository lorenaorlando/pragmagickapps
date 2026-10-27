import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { onStoryNudge } from '../lib/storyNudge';
import { track } from '../lib/analytics';
import { Sticker } from './Sticker';

const DELAY_MS = 6000; // let the reading, sticker or coin sink in first
const VISIBLE_MS = 14000;

/** El Loco peeks in from the edge, a few times only, to invite people to read the story */
export const StoryNudge: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    const off = onStoryNudge(() => {
      timers.push(
        setTimeout(() => {
          setOpen(true);
          track('story_nudge_show');
          timers.push(setTimeout(() => setOpen(false), VISIBLE_MS));
        }, DELAY_MS),
      );
    });
    return () => {
      off();
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute right-0 top-[72px] z-40 flex items-center"
          initial={{ x: '110%' }}
          animate={{ x: 0 }}
          exit={{ x: '110%' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <div className="relative bg-white border-2 border-ink rounded-[12px] shadow-hard px-3 py-2 max-w-[200px] mr-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full border-2 border-ink bg-white flex items-center justify-center"
            >
              <X className="w-3 h-3" strokeWidth={3} />
            </button>
            <Link
              to="/story"
              onClick={() => track('story_nudge_click')}
              className="flex flex-col gap-0.5"
            >
              <span className="text-[13px] leading-tight">{t.storyNudge.text}</span>
              <span className="font-mono text-[11px] uppercase underline underline-offset-2">{t.storyNudge.cta}</span>
            </Link>
          </div>
          <Link to="/story" onClick={() => track('story_nudge_click')} aria-hidden="true" tabIndex={-1} className="w-[54px] -mr-3">
            <Sticker slug="00-el-loco" rotate={-6} className="w-full" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
