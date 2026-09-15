import React, { useState } from 'react';
import { TarotCard } from '../types';

interface TarotCardFrontProps {
  card?: TarotCard;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  onClick?: () => void;
  selected?: boolean;
}

export const TarotCardFront: React.FC<TarotCardFrontProps> = ({
  card,
  className = '',
  size = 'md',
  onClick,
  selected = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const sizeClasses = {
    mini: 'w-10 h-[69px]',
    sm: 'w-14 h-[97px]',
    md: 'w-20 h-[139px]',
    lg: 'w-24 h-[167px]',
  };

  const imageUrl = card?.imageUrl || '/cards/El_Carro.png';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-sm border-[1.5px] border-black bg-[#faf7ee] overflow-hidden shadow-xs cursor-pointer select-none transition-all flex items-center justify-center ${
        sizeClasses[size]
      } ${selected ? 'ring-2 ring-black scale-105' : ''} ${className}`}
      style={{
        aspectRatio: '546 / 948',
      }}
    >
      <img
        src={imageUrl}
        alt={card?.name || 'Tarot Card'}
        crossOrigin="anonymous"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        onLoad={() => setImageLoaded(true)}
        loading="eager"
      />
    </div>
  );
};
