import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneFrame } from './components/PhoneFrame';
import { LanguageScreen } from './components/screens/LanguageScreen';
import { ChooseQuestionScreen } from './components/screens/ChooseQuestionScreen';
import { ShuffleAndDrawScreen } from './components/screens/ShuffleAndDrawScreen';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { CardRevealScreen } from './components/screens/CardRevealScreen';
import { ReadingScreen } from './components/screens/ReadingScreen';
import { ScreenStep, QuestionOption, Language, TarotCard } from './types';
import { QUESTIONS, MAJOR_ARCANA } from './data/tarotCards';
import { tarotAudio } from './utils/audio';

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [currentStep, setCurrentStep] = useState<ScreenStep>('language');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionOption>(QUESTIONS[0]);
  const [drawnCard, setDrawnCard] = useState<TarotCard>(MAJOR_ARCANA[0]);

  const handleLanguageChosen = () => {
    tarotAudio.playClick();
    setCurrentStep('choose-question');
  };

  const handleQuestionChosen = (question?: QuestionOption) => {
    if (question) setSelectedQuestion(question);
    tarotAudio.playClick();
    setCurrentStep('shuffle-draw');
  };

  const handleCardsDrawn = (card: TarotCard) => {
    setDrawnCard(card);
    tarotAudio.playChime();
    setCurrentStep('card-reveal');
  };

  const handleLoadingComplete = () => {
    tarotAudio.playChime();
    setCurrentStep('card-reveal');
  };

  const handleReadAnswer = () => {
    tarotAudio.playClick();
    setCurrentStep('reading');
  };

  const handleRestart = () => {
    tarotAudio.playClick();
    setCurrentStep('choose-question');
  };

  const activeLanguage: Language = language || 'es';

  return (
    <div className="min-h-[100dvh] w-full bg-white text-black flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-amber-300 selection:text-black p-3 sm:p-4">
      <main className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex justify-center items-center"
            >
              <PhoneFrame id={`phone-step-${currentStep}`}>
                {currentStep === 'language' && (
                  <LanguageScreen
                    language={language}
                    onSelectLanguage={setLanguage}
                    onContinue={handleLanguageChosen}
                  />
                )}
                {currentStep === 'choose-question' && (
                  <ChooseQuestionScreen
                    language={activeLanguage}
                    selectedQuestion={selectedQuestion}
                    onSelectQuestion={setSelectedQuestion}
                    onContinue={() => handleQuestionChosen()}
                  />
                )}
                {currentStep === 'shuffle-draw' && (
                  <ShuffleAndDrawScreen
                    language={activeLanguage}
                    onCardDrawn={handleCardsDrawn}
                  />
                )}
                {currentStep === 'loading' && (
                  <LoadingScreen
                    language={activeLanguage}
                    onComplete={handleLoadingComplete}
                  />
                )}
                {currentStep === 'card-reveal' && (
                  <CardRevealScreen
                    language={activeLanguage}
                    card={drawnCard}
                    onReadAnswer={handleReadAnswer}
                  />
                )}
                {currentStep === 'reading' && (
                  <ReadingScreen
                    language={activeLanguage}
                    card={drawnCard}
                    question={selectedQuestion}
                    onRestart={handleRestart}
                  />
                )}
              </PhoneFrame>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
