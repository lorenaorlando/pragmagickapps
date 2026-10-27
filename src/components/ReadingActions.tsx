import React, { useState } from 'react';
import { CalendarHeart, Instagram, MessageCircle, Share2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { shareStory } from '../lib/shareImage';
import { INSTAGRAM_DM_URL, KOFI_BOOKING_URL, READING_PRICE_USD, whatsappUrl } from '../config/links';
import { TestimonialsModal } from './modals';
import { track } from '../lib/analytics';

interface ReadingActionsProps {
  whatsappText: string;
  story: Parameters<typeof shareStory>[0];
  onAgain: () => void;
}

const pill = 'flex items-center justify-center gap-1 min-w-0 rounded-full border-2 border-ink px-1.5 py-1.5 font-mono text-[11px] uppercase whitespace-nowrap shadow-hard active:translate-x-px active:translate-y-px active:shadow-none';

const BookingButtons: React.FC<{ whatsappText: string }> = ({ whatsappText }) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <a href={KOFI_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('booking_click', { channel: 'kofi' })} className={`${pill} bg-yellow`}>
        <CalendarHeart className="w-3.5 h-3.5 shrink-0 max-[359px]:hidden" /> {t.reading.book}
      </a>
      <a href={whatsappUrl(whatsappText)} target="_blank" rel="noopener noreferrer" onClick={() => track('booking_click', { channel: 'whatsapp' })} className={`${pill} bg-white`}>
        <MessageCircle className="w-3.5 h-3.5 shrink-0 max-[359px]:hidden" /> {t.reading.whatsapp}
      </a>
      <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('booking_click', { channel: 'instagram' })} className={`${pill} bg-sky`}>
        <Instagram className="w-3.5 h-3.5 shrink-0 max-[359px]:hidden" /> {t.reading.instagram}
      </a>
    </div>
  );
};

/** 1:1 booking card, shown under every reading. The ace of swords marks the 1:1 readings (brand manual) */
export const OneOnOneCard: React.FC<{ whatsappText: string }> = ({ whatsappText }) => {
  const { t } = useLanguage();
  const [testimonialsOpen, setTestimonialsOpen] = useState(false);
  return (
    <div className="relative mx-3 mb-3 mt-5 border-2 border-ink rounded-[12px] bg-white shadow-hard px-3 pt-2.5 pb-3">
      <img
        src="/suits/intelectual.webp"
        alt=""
        aria-hidden="true"
        className="absolute right-2 -top-5 w-[40px] rounded-[6px] border-[3px] border-white drop-sticker rotate-[5deg]"
      />
      <p className="font-display text-[17px] uppercase leading-none pr-12">{t.reading.deeperTitle}</p>
      <p className="text-[12px] mt-1 leading-tight pr-12">
        {t.reading.deeperDesc}
        {READING_PRICE_USD !== null && <> · <b>{t.reading.priceFrom(READING_PRICE_USD)}</b></>}
        {' · '}
        <button type="button" onClick={() => {
            track('testimonials_open');
            setTestimonialsOpen(true);
          }} className="underline underline-offset-2">
          {t.reading.testimonialsLink}
        </button>
      </p>
      <div className="mt-2.5">
        <BookingButtons whatsappText={whatsappText} />
      </div>
      <TestimonialsModal
        open={testimonialsOpen}
        onClose={() => setTestimonialsOpen(false)}
        footer={
          <div className="border-t-2 border-ink bg-white p-3">
            <BookingButtons whatsappText={whatsappText} />
          </div>
        }
      />
    </div>
  );
};

export const ReadingActions: React.FC<ReadingActionsProps> = ({ whatsappText, story, onAgain }) => {
  const { t } = useLanguage();
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    track('share', { method: 'story', content_type: 'tarot' });
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
