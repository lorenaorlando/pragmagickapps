import React from 'react';

export const stickerSrc = (id: string) => `/amigah/${id.toLowerCase()}.webp`;

interface StickerImageProps {
  id: string;
  rotate?: number;
  className?: string;
  alt?: string;
}

export const StickerImage: React.FC<StickerImageProps> = ({ id, rotate = 0, className = '', alt = '' }) => (
  <img
    src={stickerSrc(id)}
    alt={alt}
    draggable={false}
    className={`select-none pointer-events-none object-contain ${className}`}
    style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
  />
);
