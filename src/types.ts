export type Language = 'en' | 'es';

export type ScreenStep =
  | 'language'
  | 'home'
  | 'choose-question'
  | 'weekly-tarot-choose'
  | 'shuffle-draw'
  | 'loading'
  | 'card-reveal'
  | 'reading'
  | 'shuffle'
  | 'draw';

export interface DeckOption {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  coverImage?: string;
}

export interface QuestionOption {
  id: string;
  title: string;
  description?: string;
}

export interface TarotCard {
  id: number;
  number: string;
  name: string;
  frenchName: string;
  spanishName: string;
  imageUrl: string;
  arcana: 'major' | 'minor';
  archetype: string;
  keywords: string[];
  spanishKeywords: string[];
  uprightMeaning: string;
  readingSummary: string;
  spanishReadingSummary: string;
  primaryColor: string;
}
