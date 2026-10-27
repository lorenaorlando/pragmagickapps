import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getSpread } from '../../data/spreads';
import { TarotCard } from '../../types';
import { ShuffleStage } from './ShuffleStage';
import { WeeklyChoose } from './WeeklyChoose';
import { RevealStage } from './RevealStage';
import { ReadingScreen } from './ReadingScreen';
import { ThreeCardsReading } from './ThreeCardsReading';
import { ThreeCardModeChoice } from './ThreeCardModeChoice';
import { ThreeCardMode } from '../../data/threeCardModes';
import { track } from '../../lib/analytics';

type Stage = 'draw' | 'reveal' | 'reading';

/** One route per spread (/tarot/:spreadId) so each one can be shared directly */
export const SpreadFlow: React.FC = () => {
  const { spreadId } = useParams();
  const spread = getSpread(spreadId);
  const [stage, setStage] = useState<Stage>('draw');
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [round, setRound] = useState(0);
  const [mode, setMode] = useState<ThreeCardMode | null>(null);

  useEffect(() => {
    if (spread) track('spread_start', { spread: spread.id });
  }, [spread]);

  useEffect(() => {
    if (spread && stage === 'reading' && cards.length) {
      track('reading_complete', { spread: spread.id, mode: mode?.id, cards: cards.map((c) => c.slug).join(',') });
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseMode = (m: ThreeCardMode) => {
    track('three_card_mode', { mode: m.id });
    setMode(m);
  };

  if (!spread) return <Navigate to="/tarot" replace />;

  const restart = () => {
    setCards([]);
    setStage('draw');
    setMode(null);
    setRound((r) => r + 1);
  };

  if (spread.id === 'tres-cartas') {
    if (!mode) return <ThreeCardModeChoice onChoose={chooseMode} />;
    return stage === 'reading' ? (
      <ThreeCardsReading cards={cards} mode={mode} onAgain={restart} />
    ) : (
      <ShuffleStage key={round} count={3} onDone={(c) => { setCards(c); setStage('reading'); }} />
    );
  }

  if (stage === 'draw') {
    return spread.id === 'semana' ? (
      <WeeklyChoose key={round} onDone={(c) => { setCards([c]); setStage('reveal'); }} />
    ) : (
      <ShuffleStage key={round} count={1} onDone={(c) => { setCards(c); setStage('reveal'); }} />
    );
  }
  if (stage === 'reveal') return <RevealStage card={cards[0]} onNext={() => setStage('reading')} />;
  return <ReadingScreen spread={spread} card={cards[0]} onAgain={restart} />;
};
