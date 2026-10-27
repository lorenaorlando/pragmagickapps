import { Language } from '../types';

const es = {
  menu: {
    banner: '¿QUÉ NECESITAS\nHOY?',
    tarotTitle: 'Tiradas de tarot',
    tarotDesc: 'Una pregunta, una carta, una respuesta',
    stickersTitle: 'Oráculo de stickers: AMIGAAAAH',
    stickersDesc: 'La señora de los stickers te aconseja',
    coinTitle: 'Lanzar una moneda',
    coinDesc: 'Sí, no… o la tercera cara',
    about: 'sobre pragmagicka',
  },
  spreads: {
    banner: '¿QUÉ TE TRAE\nPOR ACÁ?',
    goalTitle: '¡Ayuda a pragmagick.app a llegar a las tiendas de apps!',
    goalDesc: 'Toca para ver la campaña',
  },
  shuffle: {
    banner: 'BARAJEA Y ELIGE',
    breatheOne: 'Respira profundo, piensa en tu pregunta intensamente',
    breatheThree: 'Respira profundo, piensa en la complejidad de tu situación',
    tapToShuffle: 'Toca las cartas para barajar ↓',
    shuffling: 'Barajando las cartas…',
    chooseOne: 'Ahora elige una carta ↓',
    chooseThree: (n: number) => `Elige 3 cartas (${n}/3) ↓`,
    readyOne: 'Carta elegida',
    readyThree: '3 cartas elegidas',
    reveal: 'REVELA TU LECTURA',
  },
  threeModes: {
    banner: 'TIRADA DE\n3 CARTAS',
    prompt: 'Elige qué va a significar cada carta. Las cartas describen; el lugar donde caen les da sentido.',
  },
  weekly: {
    banner: 'TU SEMANA',
    prompt: 'Elige la carta de tu semana',
  },
  reveal: {
    readAnswer: 'LEE TU RESPUESTA',
  },
  reading: {
    banner: 'TU LECTURA',
    deeperTitle: '¿Lo vemos en detalle?',
    deeperDesc: 'Lectura 1:1 por nota de voz',
    priceFrom: (usd: number) => `desde US$${usd}`,
    book: 'Agendar',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    share: 'Compartir',
    again: 'Otra lectura',
    whatsappText: (card: string, topic: string) =>
      `¡Hola! En pragmagick.app me salió ${card} en "${topic}" y quiero profundizar mi lectura 🌙`,
    whatsappTextThree: (mode: string, cards: string) =>
      `¡Hola! En pragmagick.app hice una tirada de 3 cartas "${mode}" (${cards}) y quiero profundizar mi lectura 🌙`,
    threeLabel: 'tirada de 3 cartas',
    testimonialsLink: 'lo que dicen ★',
  },
  testimonials: {
    whisper: 'lo que dicen de las',
    shout: 'LECTURAS 1:1',
    note: '',
  },
  goal: {
    title: 'Pragmagick a las tiendas',
    fallback: 'Si no se ve la campaña, ábrela en Ko-fi',
  },
  about: {
    title: 'Sobre Pragmagicka',
    paragraphs: [
      'PRAGMAGICKA es la evolución directa de mi práctica espiritual, una donde lo fundamental es la fuerza de voluntad orientada a la acción a través de símbolos, rituales y herramientas esotéricas.',
      'Creo que no hay destino predeterminado ni cartas que adivinen el futuro. Hay decisiones que tomar y conflictos que destrabar. Muchas veces la mente estrictamente racional no basta para procesar dilemas internos que no siguen una lógica lineal. Es en ese espacio donde el esoterismo actúa como una tecnología pragmática: herramientas concretas para enfocar la mente, recuperar la agencia y accionar.',
      'Este proyecto condensa un recorrido de investigación y práctica continuada iniciado en 2008. No surge desde una torre de marfil ni desde el optimismo tóxico de la espiritualidad privilegiada. Entendemos que vivimos en un mundo cruzado por crisis económicas, desastres y precariedades. Es precisamente cuando el entorno es más hostil cuando la voluntad deja de ser un concepto abstracto y se convierte en una herramienta de supervivencia.',
    ],
    contact: 'Contacto',
    storyLink: 'Lee la historia completa',
    testimonials: 'Testimonios',
  },
  close: 'Cerrar',
  back: 'Volver',
};

type Strings = typeof es;

const en: Strings = {
  menu: {
    banner: 'WHAT DO YOU\nNEED TODAY?',
    tarotTitle: 'Tarot spreads',
    tarotDesc: 'One question, one card, one answer',
    stickersTitle: 'Sticker oracle',
    stickersDesc: 'only in español miamor',
    coinTitle: 'Flip a coin',
    coinDesc: 'Yes, no… or the third side',
    about: 'about pragmagicka',
  },
  spreads: {
    banner: 'WHAT BRINGS YOU\nHERE TODAY?',
    goalTitle: 'Help pragmagick.app reach the app stores!',
    goalDesc: 'Tap to see the campaign',
  },
  shuffle: {
    banner: 'SHUFFLE & CHOOSE',
    breatheOne: 'Take a deep breath, think intensely about your question',
    breatheThree: 'Take a deep breath, think about the complexity of your situation',
    tapToShuffle: 'Tap the cards to shuffle ↓',
    shuffling: 'Shuffling the cards…',
    chooseOne: 'Now choose a card ↓',
    chooseThree: (n: number) => `Choose 3 cards (${n}/3) ↓`,
    readyOne: 'Card chosen',
    readyThree: '3 cards chosen',
    reveal: 'REVEAL YOUR READING',
  },
  threeModes: {
    banner: '3-CARD\nSPREAD',
    prompt: 'Choose what each card will stand for. The cards describe; where they land gives them meaning.',
  },
  weekly: {
    banner: 'YOUR WEEK',
    prompt: 'Choose the card for your week',
  },
  reveal: {
    readAnswer: 'READ YOUR ANSWER',
  },
  reading: {
    banner: 'YOUR READING',
    deeperTitle: 'Shall we look closer?',
    deeperDesc: '1:1 reading by voice note',
    priceFrom: (usd: number) => `from US$${usd}`,
    book: 'Book',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    share: 'Share',
    again: 'New reading',
    whatsappText: (card: string, topic: string) =>
      `Hi! I got ${card} on "${topic}" at pragmagick.app and I'd like to go deeper 🌙`,
    whatsappTextThree: (mode: string, cards: string) =>
      `Hi! I did a "${mode}" 3-card spread at pragmagick.app (${cards}) and I'd like to go deeper 🌙`,
    threeLabel: '3-card spread',
    testimonialsLink: 'what people say ★',
  },
  testimonials: {
    whisper: 'what people say about',
    shout: '1:1 READINGS',
    note: 'Testimonials kept in Spanish, as they were written.',
  },
  goal: {
    title: 'Pragmagick to the stores',
    fallback: "If the campaign doesn't load, open it on Ko-fi",
  },
  about: {
    title: 'About Pragmagicka',
    paragraphs: [
      'PRAGMAGICKA is the direct evolution of my spiritual practice, where the foundation is willpower oriented toward action through symbols, rituals, and esoteric tools.',
      'I believe there is no predetermined destiny and no cards that predict the future. There are decisions to be made and conflicts to be unblocked. Often, the strictly rational mind is insufficient to process inner dilemmas that follow a non-linear logic. It is in that space where esotericism acts as a pragmatic technology: concrete tools to focus the mind, reclaim agency, and take action.',
      'This project condenses a continuous path of research and practice begun in 2008. It does not emerge from an ivory tower or the toxic optimism of privileged spirituality. We understand that we live in a world crossed by economic crises, disasters, and precarity. It is precisely when the environment is most hostile that willpower ceases to be an abstract concept and becomes a survival tool.',
    ],
    contact: 'Contact',
    storyLink: 'Read the full story (in Spanish)',
    testimonials: 'Testimonials',
  },
  close: 'Close',
  back: 'Back',
};

export const TRANSLATIONS: Record<Language, Strings> = { es, en };
