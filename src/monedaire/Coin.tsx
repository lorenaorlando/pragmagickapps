import React from 'react';

export type CoinResult = 'up' | 'down' | 'question' | 'empty';

const COIN_IMAGES: Record<CoinResult, string> = {
  empty: '/monedaire/question.webp',
  up: '/monedaire/yes.webp',
  down: '/monedaire/no.webp',
  question: '/monedaire/question.webp',
};

export const Coin: React.FC<{ type: CoinResult; className?: string }> = ({ type, className = '' }) => (
  <img
    src={COIN_IMAGES[type]}
    alt=""
    draggable={false}
    className={`select-none object-contain pointer-events-none ${className}`}
  />
);
