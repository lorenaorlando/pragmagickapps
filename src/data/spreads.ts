import { Language, SpreadId } from '../types';
import {
  CURRENT_MOMENT_READINGS,
  DONT_KNOW_WHAT_TO_DO_READINGS,
  THINKING_ABOUT_SOMEONE_READINGS,
  WEEKLY_TAROT_READINGS,
} from './tarotCards';

type Text = Record<Language, string>;

export interface Spread {
  id: SpreadId;
  title: Text;
  description: Text;
  /** Short format label shown as a pill */
  format: Text;
  color: 'yellow' | 'sky';
  readings?: Record<number, Text>;
}

export const SPREADS: Spread[] = [
  {
    id: 'no-se-que-hacer',
    title: { es: 'No sé qué hacer respecto a…', en: "I don't know what to do about…" },
    description: { es: 'Para decidir y entender cómo actuar', en: 'Understand the best way to take action' },
    format: { es: '1 carta', en: '1 card' },
    color: 'yellow',
    readings: DONT_KNOW_WHAT_TO_DO_READINGS,
  },
  {
    id: 'pienso-en-alguien',
    title: { es: 'Estoy pensando en alguien', en: "I'm thinking about someone" },
    description: { es: 'El estado actual de ese vínculo', en: 'The current state of that bond' },
    format: { es: '1 carta', en: '1 card' },
    color: 'sky',
    readings: THINKING_ABOUT_SOMEONE_READINGS,
  },
  {
    id: 'momento-presente',
    title: { es: 'Momento presente', en: 'Current moment' },
    description: { es: 'Dónde estás y cómo afrontarlo', en: 'Where you are and how to move forward' },
    format: { es: '1 carta', en: '1 card' },
    color: 'yellow',
    readings: CURRENT_MOMENT_READINGS,
  },
  {
    id: 'semana',
    title: { es: 'Tarot de la semana', en: 'Tarot of the week' },
    description: { es: 'Tu mensaje y guía para estos 7 días', en: 'Your message for the next 7 days' },
    format: { es: 'semanal', en: 'weekly' },
    color: 'sky',
    readings: WEEKLY_TAROT_READINGS,
  },
  {
    id: 'tres-cartas',
    title: { es: 'Tirada de 3 cartas', en: '3-card spread' },
    description: { es: 'La complejidad de una situación en palabras clave', en: 'The complexity of a situation in keywords' },
    format: { es: '3 cartas', en: '3 cards' },
    color: 'yellow',
  },
];

export const getSpread = (id: string | undefined) => SPREADS.find((s) => s.id === id);
