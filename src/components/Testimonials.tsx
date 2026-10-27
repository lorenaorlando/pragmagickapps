import React from 'react';
import { useLanguage } from '../lib/language';
import { TESTIMONIALS } from '../data/testimonials';

// Every other quote is tilted like a note stuck on the page (brand manual: −1° to −2°)
const TILTS = ['', '-rotate-[1.5deg]', '', 'rotate-[1deg]'];

/** "Whisper and shout" heading followed by the testimonials in aquamarine boxes */
export const TestimonialList: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      <h3 className="leading-none">
        <span className="block text-[13px] lowercase">{t.testimonials.whisper}</span>
        <span className="block font-display text-[36px] leading-[0.92]">{t.testimonials.shout}</span>
      </h3>
      {t.testimonials.note && <p className="text-[12px] text-graphite">{t.testimonials.note}</p>}
      {TESTIMONIALS.map((quote, i) => (
        <blockquote
          key={quote.slice(0, 24)}
          className={`bg-sky border-[1.5px] border-ink rounded-[12px] px-4 py-3 text-[14px] leading-snug ${TILTS[i % TILTS.length]}`}
        >
          “{quote}”
        </blockquote>
      ))}
    </div>
  );
};
