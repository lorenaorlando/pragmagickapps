import React from 'react';
import { stickerImage } from '../lib/cards';

interface StickerProps {
  slug: string;
  rotate?: number;
  className?: string;
}

/** Die-cut major arcana sticker used as a graphic accent */
export const Sticker: React.FC<StickerProps> = ({ slug, rotate = 0, className = '' }) => (
  <img
    src={stickerImage(slug)}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`drop-sticker select-none pointer-events-none ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  />
);
