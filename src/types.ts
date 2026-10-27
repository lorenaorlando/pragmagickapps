export type Language = 'es' | 'en';

export interface TarotCard {
  id: number;
  number: string;
  /** File name (without extension) shared by public/deck and public/stickers */
  slug: string;
  name: string;
  spanishName: string;
  keywords: string[];
  spanishKeywords: string[];
}

export type SpreadId = 'no-se-que-hacer' | 'pienso-en-alguien' | 'momento-presente' | 'semana' | 'tres-cartas';
