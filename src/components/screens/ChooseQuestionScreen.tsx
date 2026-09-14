import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QuestionOption, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { tarotAudio } from '../../utils/audio';

interface ChooseQuestionScreenProps {
  language: Language;
  selectedQuestion?: QuestionOption;
  onSelectQuestion: (question: QuestionOption) => void;
  onContinue: () => void;
}

export const ChooseQuestionScreen: React.FC<ChooseQuestionScreenProps> = ({
  language,
  selectedQuestion,
  onSelectQuestion,
  onContinue,
}) => {
  const [tappedId, setTappedId] = useState<string | null>(null);
  const t = TRANSLATIONS[language];
  const questionsList = t.chooseQuestion.questions;

  const handleTap = (question: QuestionOption) => {
    if (tappedId) return; // prevent double tap
    tarotAudio.playClick();
    setTappedId(question.id);
    onSelectQuestion(question);
    setTimeout(() => {
      onContinue();
    }, 280);
  };

  // Color mapping based on user request:
  // - "no sé qué hacer": fondo amarillo (#ffff00)
  // - "estoy pensando en alguien": fondo celeste (#b8e2ec)
  // - "momento actual": fondo amarillo (#ffff00)
  const getQuestionBgColor = (id: string) => {
    if (id === 'q1') return 'bg-[#ffff00]'; // "no sé qué hacer" -> amarillo
    if (id === 'q2') return 'bg-[#b8e2ec]'; // "estoy pensando" -> celeste
    if (id === 'q3') return 'bg-[#ffff00]'; // "momento" -> amarillo
    return 'bg-[#ffff00]';
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-black select-none overflow-hidden justify-between">
      {/* Top Banner: WHAT BRINGS YOU HERE TODAY? / ¿QUÉ TE TRAE POR ACÁ? */}
      <div className="w-full bg-[#b8e2ec] border-b-[2px] border-black py-2.5 px-4 flex items-center justify-between shrink-0">
        <h2 className="font-viaoda text-xl sm:text-2xl font-normal tracking-tight text-black uppercase leading-tight text-left whitespace-pre-line">
          {t.chooseQuestion.banner}
        </h2>
        <a
          href="https://www.instagram.com/pragmagicka/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-viaoda text-[13px] sm:text-[14.5px] tracking-wider text-black lowercase font-normal hover:opacity-75 transition-opacity shrink-0 ml-2"
        >
          pragmagick.app
        </a>
      </div>

      {/* 3 Option Boxes filling the whole screen with requested custom colors */}
      <div className="flex-1 w-full flex flex-col min-h-0">
        {questionsList.map((question, index) => {
          const isSelected = tappedId === question.id;
          const isLast = index === questionsList.length - 1;
          const bgColorClass = getQuestionBgColor(question.id);

          return (
            <motion.div
              key={`${question.id}-${index}`}
              onClick={() => handleTap(question)}
              whileHover={{ filter: 'brightness(0.96)' }}
              whileTap={{ scale: 0.995 }}
              className={`flex-1 w-full flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 px-5 py-3 ${bgColorClass} ${
                !isLast ? 'border-b-[2px] border-black' : ''
              } ${isSelected ? 'ring-2 ring-inset ring-black' : ''}`}
            >
              {/* Centered Question Title - Regular font weight (no negrita) */}
              <h3 className="font-viaoda text-[15.5px] sm:text-[17.5px] font-normal tracking-tight leading-tight uppercase whitespace-pre-line text-center text-black">
                {question.title}
              </h3>

              {/* Description below */}
              <p className="font-playfair text-[11px] sm:text-[12px] leading-snug text-black/80 text-center max-w-[260px] mt-2 font-normal">
                {question.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
