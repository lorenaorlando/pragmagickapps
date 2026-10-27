import { Language } from '../types';

const es = {
  title: 'MONEDAIRE',
  info: 'info',
  steps: [
    'respira profundo',
    'piensa en tu pregunta',
    'presiona lanzar (y cierra los ojos)',
    'reflexiona sobre tu resultado',
  ],
  questionOutcome: '¿qué resultado esperabas?',
  flip: 'LANZAR',
  flipping: 'LANZANDO…',
  reflection: {
    start: 'quiero reflexionar sobre mi resultado',
    close: 'cerrar reflexión',
    questions: [
      '¿me satisface el resultado que obtuve?',
      '¿volvería a lanzar la moneda?',
      '¿cómo me hace sentir este resultado?',
      '¿creo que es lo mejor para mí hacer esto?',
    ],
  },
  logs: {
    header: 'toma nota de tus preguntas',
    placeholder: 'tu pregunta',
    empty: 'aún no hay tiradas registradas. presiona lanzar para comenzar.',
  },
  about: {
    title: 'sobre monedaire',
    paragraphs: [
      'monedaire se me ocurrió en un momento en el que necesitaba una moneda virtual, a falta de una real, para lanzar y resolver mis eternas indecisiones.',
      'esta moneda tiene una tercera cara, que es la verdadera.',
      'responder a la pregunta de esa tercera cara, en los momentos que te salga, va a resolver tus dudas y tus deseos más claramente que un sí o un no.',
      'espero que esta herramienta te sea útil.',
    ],
    withLove: 'con amor',
  },
};

const en: typeof es = {
  title: 'MONEDAIRE',
  info: 'info',
  steps: [
    'take a deep breath',
    'think of your question',
    'press flip (and close your eyes)',
    'reflect on your result',
  ],
  questionOutcome: 'what result were you hoping for?',
  flip: 'FLIP',
  flipping: 'FLIPPING…',
  reflection: {
    start: 'i want to reflect on my result',
    close: 'close reflection',
    questions: [
      'am i satisfied with the result i got?',
      'would i flip the coin again?',
      'how does this result make me feel?',
      'do i believe doing this is best for me?',
    ],
  },
  logs: {
    header: 'log your questions',
    placeholder: 'your question',
    empty: 'no flips recorded yet. press flip to begin.',
  },
  about: {
    title: 'about monedaire',
    paragraphs: [
      'monedaire came to me at a moment when i needed a virtual coin, for lack of a real one, to flip and resolve my endless indecisions.',
      'this coin has a third side, which is the true one.',
      'answering the question of that third side, whenever it comes up, will resolve your doubts and desires much more clearly than a yes or a no.',
      'i hope this tool is helpful to you.',
    ],
    withLove: 'with love',
  },
};

export type MonedaireStrings = typeof es;
export const MONEDAIRE_TEXT: Record<Language, MonedaireStrings> = { es, en };
