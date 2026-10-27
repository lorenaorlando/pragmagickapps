import { Language, TarotCard } from '../types';
import { MAJOR_ARCANA } from '../data/tarotCards';

export const cardImage = (card: TarotCard) => `/deck/${card.slug}.webp`;
export const stickerImage = (slug: string) => `/stickers/${slug}.webp`;

export const cardName = (card: TarotCard, lang: Language) =>
  lang === 'es' ? card.spanishName : card.name.toUpperCase();

export const cardKeywords = (card: TarotCard, lang: Language) =>
  lang === 'es' ? card.spanishKeywords : card.keywords;

/** Draw `count` distinct random cards */
export const drawCards = (count: number): TarotCard[] => {
  const pool = [...MAJOR_ARCANA];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
};
