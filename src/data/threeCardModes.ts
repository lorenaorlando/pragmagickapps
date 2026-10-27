import { Language } from '../types';

type Text = Record<Language, string>;

export interface ThreeCardMode {
  id: string;
  title: Text;
  /** What each card stands for, in the order the cards are drawn */
  positions: [Text, Text, Text];
  color: 'yellow' | 'sky' | 'white';
}

// The three cards only describe; the mode gives each position its meaning.
export const THREE_CARD_MODES: ThreeCardMode[] = [
  {
    id: 'tiempo',
    title: { es: 'Pasado, presente, proyección de futuro', en: 'Past, present, future projection' },
    positions: [
      { es: 'Pasado', en: 'Past' },
      { es: 'Presente', en: 'Present' },
      { es: 'Proyección de futuro', en: 'Future projection' },
    ],
    color: 'yellow',
  },
  {
    id: 'problema',
    title: { es: 'El problema, tú, la solución', en: 'The problem, you, the solution' },
    positions: [
      { es: 'El problema', en: 'The problem' },
      { es: 'Tú', en: 'You' },
      { es: 'La solución', en: 'The solution' },
    ],
    color: 'sky',
  },
  {
    id: 'vinculo',
    title: { es: 'La emoción del otro/a, punto de encuentro, la emoción tuya', en: "Their emotion, meeting point, your emotion" },
    positions: [
      { es: 'La emoción del otro/a', en: 'Their emotion' },
      { es: 'Punto de encuentro', en: 'Meeting point' },
      { es: 'La emoción tuya', en: 'Your emotion' },
    ],
    color: 'yellow',
  },
  {
    id: 'actitudes',
    title: { es: 'Actitudes frente a una situación', en: 'Attitudes towards a situation' },
    positions: [
      { es: 'Mantener', en: 'Keep' },
      { es: 'Reflexionar sobre', en: 'Reflect on' },
      { es: 'Soltar', en: 'Let go' },
    ],
    color: 'sky',
  },
];
