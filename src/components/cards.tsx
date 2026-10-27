import React from 'react';
import { motion } from 'motion/react';
import { TarotCard } from '../types';
import { cardImage } from '../lib/cards';

/** Deck images are about 526×810 */
export const CARD_RATIO = '526 / 810';

export const CardBack: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative bg-yellow border-2 border-ink rounded-[5px] overflow-hidden ${className}`}
    style={{ aspectRatio: CARD_RATIO }}
  >
    <div className="absolute inset-[4px] border-[1.5px] border-ink rounded-[3px] star-pattern opacity-30" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square rounded-full bg-white border-2 border-ink flex items-center justify-center">
      <img src="/brand/logo.webp" alt="" className="w-[80%] h-[80%] object-contain" draggable={false} />
    </div>
  </div>
);

export const CardFace: React.FC<{ card: TarotCard; className?: string; alt?: string }> = ({ card, className = '', alt = '' }) => (
  <img
    src={cardImage(card)}
    alt={alt}
    draggable={false}
    className={`block border-2 border-ink rounded-[5px] bg-white object-cover select-none ${className}`}
    style={{ aspectRatio: CARD_RATIO }}
  />
);

/** A card that turns from its back to its face */
export const FlipCard: React.FC<{ card: TarotCard; flipped: boolean; className?: string; alt?: string }> = ({
  card,
  flipped,
  className = '',
  alt,
}) => (
  <div className={`perspective ${className}`} style={{ aspectRatio: CARD_RATIO }}>
    <motion.div
      className="relative w-full h-full preserve-3d"
      initial={false}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 backface-hidden">
        <CardBack className="w-full h-full" />
      </div>
      <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
        <CardFace card={card} alt={alt} className="w-full h-full" />
      </div>
    </motion.div>
  </div>
);

interface CardFanProps {
  count?: number;
  shuffling?: boolean;
  interactive?: boolean;
  picked?: number[];
  onPick?: (index: number) => void;
}

export const CardFan: React.FC<CardFanProps> = ({ count = 5, shuffling = false, interactive = false, picked = [], onPick }) => {
  const mid = (count - 1) / 2;
  return (
    <div className="relative w-full h-[150px] flex items-center justify-center select-none">
      {Array.from({ length: count }, (_, i) => {
        const offset = i - mid;
        const rotate = offset * 9;
        const x = offset * 30;
        const y = Math.abs(offset) * 5;
        const isPicked = picked.includes(i);
        return (
          <motion.button
            type="button"
            key={i}
            // Not `disabled`: a disabled button swallows the tap that shuffles the deck
            aria-disabled={!interactive || isPicked}
            onClick={() => interactive && !isPicked && onPick?.(i)}
            aria-label={`${i + 1}`}
            initial={false}
            animate={
              shuffling
                ? {
                    x: [x, i % 2 ? 34 : -34, 0, x],
                    y: [y, -12, 8, y],
                    rotate: [rotate, i % 2 ? 18 : -18, 0, rotate],
                    transition: { duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 },
                  }
                : { x, y: isPicked ? y - 34 : y, rotate: isPicked ? 0 : rotate, opacity: isPicked ? 0 : 1 }
            }
            whileHover={interactive && !isPicked ? { y: y - 14, transition: { duration: 0.15 } } : undefined}
            className={`absolute w-[74px] origin-bottom ${interactive && !isPicked ? "cursor-pointer" : "cursor-default"}`}
            style={{ zIndex: i + 1 }}
          >
            <CardBack className="w-full shadow-hard" />
          </motion.button>
        );
      })}
    </div>
  );
};
