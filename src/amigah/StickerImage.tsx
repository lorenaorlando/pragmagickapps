import React, { useState } from 'react';
import { STICKER_ORACLE_ITEMS } from './stickers';

export const stickerSrc = (id: string) => `/amigah/${id.toLowerCase()}.webp`;

// Until every sticker is in public/amigah, fall back to where they used to be hosted
const legacySrc = (id: string) => {
  const batch = STICKER_ORACLE_ITEMS.find((s) => s.id === id)?.batch ?? 1;
  return `https://sandboxlandia.online/wp-content/uploads/2026/${batch === 1 ? '09' : '10'}/${id}.png`;
};

interface StickerImageProps {
  id: string;
  rotate?: number;
  className?: string;
  alt?: string;
}

export const StickerImage: React.FC<StickerImageProps> = ({ id, rotate = 0, className = '', alt = '' }) => {
  const [src, setSrc] = useState(stickerSrc(id));
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setSrc((current) => (current === legacySrc(id) ? current : legacySrc(id)))}
      className={`select-none pointer-events-none object-contain ${className}`}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    />
  );
};
