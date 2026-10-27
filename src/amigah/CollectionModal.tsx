import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Modal } from '../components/modals';
import { STICKER_SHOP_URL } from '../config/links';
import { DRAWABLE, LATEST_BATCH } from './collection';
import { StickerImage } from './StickerImage';

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
  collected: string[];
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ open, onClose, collected }) => (
  <Modal open={open} onClose={onClose} title="Tu colección">
    <div className="p-4 flex flex-col gap-3">
      <p className="text-[14px]">
        Llevas <b>{collected.length}</b> de <b>{DRAWABLE.length}</b> stickers. Cada vez que sale una tanda nueva, aparecen aquí.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {DRAWABLE.map((s, i) => {
          const has = collected.includes(s.id);
          return (
            <div
              key={s.id}
              className={`relative aspect-square rounded-[10px] border-2 flex items-center justify-center p-1 ${
                has ? 'border-ink bg-white' : 'border-dashed border-ink/40 bg-neutral-50'
              }`}
              title={has ? s.message : undefined}
            >
              {has ? (
                <StickerImage id={s.id} alt={s.id} className="w-full h-full" />
              ) : (
                <span className="font-display text-xl text-black/25">?</span>
              )}
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[8px] bg-white border-[1.5px] border-ink rounded-full px-1">
                {i + 1}
              </span>
              {s.batch === LATEST_BATCH && !has && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[7.5px] uppercase bg-yellow border-[1.5px] border-ink rounded-full px-1">
                  nuevo
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
    <a
      href={STICKER_SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1.5 border-t-2 border-ink bg-yellow py-2.5 font-mono text-[11px] uppercase"
    >
      Consigue los stickers en Ko-fi <ExternalLink className="w-3.5 h-3.5" />
    </a>
  </Modal>
);
