import { Language } from '../types';

export interface AppTranslations {
  languageName: string;
  home: {
    title: string;
    introBanner: string;
    startBtn: string;
    appsTitle: string;
    monedaireTitle: string;
    monedaireSubtitle: string;
    monedaireDesc: string;
    oneCardTitle: string;
    oneCardSubtitle: string;
    oneCardDesc: string;
    infoTitle: string;
    infoSubtitle: string;
  };
  chooseQuestion: {
    banner: string;
    questions: {
      id: string;
      title: string;
      description: string;
    }[];
    continueBtn: string;
  };
  shuffle: {
    banner: string;
    tapHint: string;
    shufflingHint: string;
    continueBtn: string;
  };
  shuffleAndDraw: {
    banner: string;
    breathePrompt: string;
    tapToShufflePrompt: string;
    shufflingPrompt: string;
    tapToChoosePrompt: string;
    shuffleBtn: string;
    shufflingBtn: string;
    chooseCardBottom: string;
    revealReadingBtn: string;
  };
  draw: {
    banner: string;
    slotPlaceholder: string;
    tapHint: string;
    drawnHint: string;
    continueBtn: string;
  };
  loading: {
    banner: string;
    loadingTitle: string;
    tipTitle: string;
    tipText: string;
    bottomBanner: string;
  };
  cardReveal: {
    banner: string;
    readAnswerBtn: string;
  };
  reading: {
    banner: string;
    cardName: string;
    keywords: string[];
    answerBanner: string;
    answerText: string;
    logReadingBtn: string;
    newReadingBtn: string;
    captureBtn: string;
    specializedTitle: string;
    specializedSubtitle: string;
    feedbackBtn: string;
    feedbackSubtitle: string;
    tagBannerPre: string;
    tagBannerAccount: string;
    tagBannerPost: string;
  };
  languageScreen: {
    continueBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, AppTranslations> = {
  en: {
    languageName: 'English',
    languageScreen: {
      continueBtn: 'START',
    },
    home: {
      title: 'PRAGMAGICK\nAPP',
      introBanner: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.",
      startBtn: 'START',
      appsTitle: 'APPS',
      monedaireTitle: 'monedaire:',
      monedaireSubtitle: 'flip a coin',
      monedaireDesc: 'yes or no answers',
      oneCardTitle: 'one card:',
      oneCardSubtitle: 'for specific topics',
      oneCardDesc: 'one Arcana, one question, one answer',
      infoTitle: 'about pragmagicka',
      infoSubtitle: 'learn more about this project',
    },
    chooseQuestion: {
      banner: "WHAT BRINGS YOU\nHERE TODAY?",
      questions: [
        {
          id: 'q1',
          title: "I DON'T KNOW WHAT\nTO DO ABOUT...",
          description: 'Understand the best way to take action',
        },
        {
          id: 'q2',
          title: "I'M THINKING\nABOUT SOMEONE",
          description: 'Understand the current state of your relationship with that person',
        },
        {
          id: 'q3',
          title: 'CURRENT MOMENT',
          description: 'Understand where you are in life and how to move forward',
        },
      ],
      continueBtn: 'CONTINUE',
    },
    shuffle: {
      banner: 'SHUFFLE CARDS',
      tapHint: 'Tap cards to shuffle the deck',
      shufflingHint: 'Shuffling the deck...',
      continueBtn: 'CONTINUE',
    },
    shuffleAndDraw: {
      banner: 'SHUFFLE & CHOOSE',
      breathePrompt: 'Take a deep breath, think intensely about your question',
      tapToShufflePrompt: 'Tap below to shuffle the cards ↓',
      shufflingPrompt: 'Shuffling the cards...',
      tapToChoosePrompt: 'Now tap below to choose a card ↓',
      shuffleBtn: 'SHUFFLE',
      shufflingBtn: 'SHUFFLING...',
      chooseCardBottom: 'CHOOSE A CARD',
      revealReadingBtn: 'REVEAL YOUR READING',
    },
    draw: {
      banner: 'DRAW YOUR CARD',
      slotPlaceholder: 'PLACE CARD',
      tapHint: 'Tap a card to draw from the deck',
      drawnHint: 'Card drawn! Tap Continue to reveal your reading.',
      continueBtn: 'CONTINUE',
    },
    loading: {
      banner: 'CONSULTING THE CARDS',
      loadingTitle: 'LOADING...',
      tipTitle: 'TIP',
      tipText: 'Take a deep breath and clear your mind as the arcana reveal their guidance.',
      bottomBanner: 'PREPARING YOUR ANSWER...',
    },
    cardReveal: {
      banner: 'YOUR CARD',
      readAnswerBtn: 'READ YOUR ANSWER',
    },
    reading: {
      banner: 'YOUR READING',
      cardName: 'LE CHARIOT',
      keywords: ['VICTORY', 'WILLPOWER', 'DIRECTION'],
      answerBanner: 'YOUR ANSWER',
      answerText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.",
      logReadingBtn: 'LOG READING',
      newReadingBtn: 'NEW READING',
      captureBtn: 'CAPTURE YOUR ANSWER',
      specializedTitle: 'Need a specialized answer?',
      specializedSubtitle: 'Schedule a reading with me.',
      feedbackBtn: 'Did this app help you?',
      feedbackSubtitle: 'support this project',
      tagBannerPre: 'Tag ',
      tagBannerAccount: '@pragmagicka',
      tagBannerPost: ' in your post!',
    },
  },
  es: {
    languageName: 'Español',
    languageScreen: {
      continueBtn: 'COMENZAR',
    },
    home: {
      title: 'PRAGMAGICK\nAPP',
      introBanner: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since 1966, when designers at Letraset and James Mosley.',
      startBtn: 'COMENZAR',
      appsTitle: 'APPS',
      monedaireTitle: 'monedaire:',
      monedaireSubtitle: 'lanza una moneda',
      monedaireDesc: 'respuestas de sí o no',
      oneCardTitle: 'una carta:',
      oneCardSubtitle: 'para temas específicos',
      oneCardDesc: 'un Arcano, una pregunta, una respuesta',
      infoTitle: 'info sobre pragmagicka',
      infoSubtitle: 'conoce más de esta propuesta',
    },
    chooseQuestion: {
      banner: '¿QUÉ TE TRAE\nPOR ACÁ?',
      questions: [
        {
          id: 'q1',
          title: 'NO SÉ QUÉ HACER\nRESPECTO A...',
          description: 'Para tomar decisiones y entender la mejor forma de actuar',
        },
        {
          id: 'q2',
          title: 'ESTOY PENSANDO\nEN ALGUIEN',
          description: 'Para entender el estado actual de tu relación con esa persona',
        },
        {
          id: 'q3',
          title: 'MOMENTO PRESENTE',
          description: 'Para entender tu presente y saber cómo afrontarlo',
        },
      ],
      continueBtn: 'CONTINUAR',
    },
    shuffle: {
      banner: 'BARAJAR CARTAS',
      tapHint: 'Toca las cartas para barajar el mazo',
      shufflingHint: 'Barajando el mazo...',
      continueBtn: 'CONTINUAR',
    },
    shuffleAndDraw: {
      banner: 'BARAJEA Y ELIGE',
      breathePrompt: 'Respira profundo, piensa en tu pregunta intensamente',
      tapToShufflePrompt: 'Barajea las cartas ↓',
      shufflingPrompt: 'Barajando las cartas...',
      tapToChoosePrompt: 'Ahora elige una carta ↓',
      shuffleBtn: 'BARAJEAR',
      shufflingBtn: 'BARAJANDO...',
      chooseCardBottom: 'ELIGE UNA CARTA',
      revealReadingBtn: 'REVELA TU LECTURA',
    },
    draw: {
      banner: 'ELIGE TU CARTA',
      slotPlaceholder: 'COLOCAR CARTA',
      tapHint: 'Toca una carta para sacarla del mazo',
      drawnHint: '¡Carta elegida! Toca Continuar para ver tu lectura.',
      continueBtn: 'CONTINUAR',
    },
    loading: {
      banner: 'CONSULTANDO LAS CARTAS',
      loadingTitle: 'CARGANDO...',
      tipTitle: 'CONSEJO',
      tipText: 'Respira hondo y despeja tu mente mientras los arcanos revelan su guía.',
      bottomBanner: 'PREPARANDO TU RESPUESTA...',
    },
    cardReveal: {
      banner: 'TU CARTA',
      readAnswerBtn: 'LEE TU RESPUESTA',
    },
    reading: {
      banner: 'TU LECTURA',
      cardName: 'LE CHARIOT',
      keywords: ['VICTORIA', 'VOLUNTAD', 'DIRECCIÓN'],
      answerBanner: 'TU RESPUESTA',
      answerText: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since 1966, when designers at Letraset and James Mosley.',
      logReadingBtn: 'REGISTRAR LECTURA',
      newReadingBtn: 'NUEVA LECTURA',
      captureBtn: 'CAPTURA TU RESPUESTA',
      specializedTitle: '¿Necesitas una respuesta especializada?',
      specializedSubtitle: 'Agenda una lectura conmigo.',
      feedbackBtn: '¿Te ayudó esta app?',
      feedbackSubtitle: 'apoya este proyecto',
      tagBannerPre: '¡Etiqueta a ',
      tagBannerAccount: '@pragmagicka',
      tagBannerPost: ' en tu post!',
    },
  },
};
