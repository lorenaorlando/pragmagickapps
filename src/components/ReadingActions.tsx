import React, { useState } from 'react';
import { CalendarHeart, Instagram, MessageCircle, Share2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { shareStory } from '../lib/shareImage';
import { INSTAGRAM_DM_URL, KOFI_BOOKING_URL, READING_PRICE_USD, whatsappUrl } from '../config/links';
import { Sticker } from './Sticker';

interface ReadingActionsProps {
  whatsappText: string;
  story: Parameters<typeof shareStory>[0];
  onAgain: () => void;
}

const pill = 'flex items-center justify-center gap-1 rounded-full border-2 border-ink px-2.5 py-1.5 font-mono text-[11px] uppercase shadow-hard active:translate-x-px active:translate-y-px active:shadow-none';

/** 1:1 booking card plus share / new reading bar, shown under every reading */
export const OneOnOneCard: React.FC<{ whatsappText: string }> = ({ whatsappText }) => {
  const { t } = useLanguage();
  return (
    <div className="relative mx-3 mb-3 mt-5 border-2 border-ink rounded-[10px] bg-white shadow-hard px-3 pt-2.5 pb-3">
      <Sticker slug="09-el-ermitano" rotate={8} className="absolute right-1 -top-6 w-[50px]" />
      <p className="font-display text-[17px] uppercase leading-none pr-12">{t.reading.deeperTitle}</p>
      <p className="text-[12px] mt-1 leading-tight pr-12">
        {t.reading.deeperDesc}
        {READING_PRICE_USD !== null && <> · <b>{t.reading.priceFrom(READING_PRICE_USD)}</b></>}
      </p>
      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        <a href={KOFI_BOOKING_URL} target="_blank" rel="noopener noreferrer" className={`${pill} bg-green flex-1`}>
          <CalendarHeart className="w-3.5 h-3.5" /> {t.reading.book}
        </a>
        <a href={whatsappUrl(whatsappText)} target="_blank" rel="noopener noreferrer" className={`${pill} bg-white`}>
          <MessageCircle className="w-3.5 h-3.5" /> {t.reading.whatsapp}
        </a>
        <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className={`${pill} bg-sky`}>
          <Instagram className="w-3.5 h-3.5" /> {t.reading.instagram}
        </a>
      </div>
    </div>
  );
};

export const ReadingActions: React.FC<ReadingActionsProps> = ({ whatsappText, story, onAgain }) => {
  const { t } = useLanguage();
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareStory(story);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="shrink-0">
      <OneOnOneCard whatsappText={whatsappText} />
      <div className="grid grid-cols-2 border-t-2 border-ink font-display text-[17px] uppercase">
        <button type="button" onClick={handleShare} disabled={sharing} className="bg-yellow py-3 flex items-center justify-center gap-2 border-r-2 border-ink disabled:opacity-60">
          <Share2 className="w-4 h-4" /> {t.reading.share}
        </button>
        <button type="button" onClick={onAgain} className="bg-sky py-3 flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t.reading.again}
        </button>
      </div>
    </div>
  );
};
