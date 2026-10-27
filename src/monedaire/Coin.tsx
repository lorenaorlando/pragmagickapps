import React from 'react';

export type CoinResult = 'up' | 'down' | 'question' | 'empty';

const COIN_IMAGES: Record<CoinResult, string> = {
  empty: 'https://sandboxlandia.online/wp-content/uploads/2026/09/QUESTION.png',
  up: 'https://sandboxlandia.online/wp-content/uploads/2026/09/YES.png',
  down: 'https://sandboxlandia.online/wp-content/uploads/2026/09/NO.png',
  question: 'https://sandboxlandia.online/wp-content/uploads/2026/09/QUESTION.png',
};

export const Coin: React.FC<{ type: CoinResult; className?: string }> = ({ type, className = '' }) => (
  <img
    src={COIN_IMAGES[type]}
    alt=""
    referrerPolicy="no-referrer"
    draggable={false}
    className={`select-none object-contain pointer-events-none ${className}`}
  />
);
