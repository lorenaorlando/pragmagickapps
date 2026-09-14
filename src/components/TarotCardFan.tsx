import React from 'react';
import { motion } from 'motion/react';
import { TarotCardBack } from './TarotCardBack';

interface TarotCardFanProps {
  cardCount?: number;
  isShuffling?: boolean;
  onCardClick?: (index: number) => void;
  selectedIndices?: number[];
  interactive?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const TarotCardFan: React.FC<TarotCardFanProps> = ({
  cardCount = 5,
  isShuffling = false,
  onCardClick,
  selectedIndices = [],
  interactive = false,
  className = '',
  size = 'md',
}) => {
  const cards = Array.from({ length: cardCount });

  // Clean, symmetrical and geometric fan calculation
  const getCardTransform = (index: number, total: number) => {
    const mid = (total - 1) / 2;
    const offset = index - mid;
    // Rotation spread in clean intervals
    const rotate = offset * 9;
    // Parabolic Y offset
    const translateY = Math.abs(offset) * 4.5;
    // Equidistant X spread
    const translateX = offset * 26;

    return { rotate, translateY, translateX };
  };

  return (
    <div className={`relative flex items-center justify-center h-44 w-full select-none ${className}`}>
      <div className="relative flex items-center justify-center w-full max-w-[280px] h-36">
        {cards.map((_, i) => {
          const { rotate, translateY, translateX } = getCardTransform(i, cardCount);
          const isSelected = selectedIndices.includes(i);

          return (
            <motion.div
              key={i}
              onClick={() => interactive && onCardClick && onCardClick(i)}
              initial={false}
              animate={
                isShuffling
                  ? {
                      x: [translateX, (i % 2 === 0 ? -30 : 30), 0, translateX],
                      y: [translateY, -10, 10, translateY],
                      rotate: [rotate, (i % 2 === 0 ? -18 : 18), 0, rotate],
                      scale: [1, 1.05, 0.98, 1],
                      transition: {
                        duration: 0.7,
                        repeat: isShuffling ? Infinity : 0,
                        repeatType: 'reverse',
                        delay: i * 0.05,
                      },
                    }
                  : {
                      x: translateX,
                      y: isSelected ? translateY - 30 : translateY,
                      rotate: isSelected ? 0 : rotate,
                      scale: isSelected ? 0.95 : 1,
                      opacity: isSelected ? 0.2 : 1,
                      zIndex: isSelected ? 30 : i + 1,
                    }
              }
              whileHover={
                interactive && !isShuffling
                  ? {
                      scale: 1.08,
                      y: translateY - 12,
                      zIndex: 40,
                      transition: { duration: 0.15 },
                    }
                  : undefined
              }
              className="absolute origin-bottom cursor-pointer"
              style={{
                zIndex: i + 1,
              }}
            >
              <TarotCardBack
                size={size === 'sm' ? 'sm' : 'md'}
                selected={isSelected}
                className={`shadow-md hover:shadow-lg transition-shadow border-[1.5px] border-black ${
                  interactive ? 'cursor-pointer' : ''
                }`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
