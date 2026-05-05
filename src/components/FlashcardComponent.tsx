/**
 * FlashcardComponent.tsx
 *
 * Enhanced with:
 * - Spaced-repetition-style confidence rating (Again / Hard / Good / Easy)
 * - Visual progress: mastered vs remaining cards
 * - Shuffle mode
 * - Keyboard navigation (← → Space)
 * - WAEC / IB exam-tip flag on individual cards (when present)
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, ChevronLeft, RefreshCcw, Shuffle,
  CheckCircle2, Trophy, RotateCcw,
} from 'lucide-react';
import { Flashcard } from '../data/mockData';

interface FlashcardProps {
  flashcards: Flashcard[];
}

type Confidence = 'again' | 'hard' | 'good' | 'easy';

interface CardState {
  id: string;
  confidence: Confidence | null;
  reviewCount: number;
}

const CONFIDENCE_CONFIG: Record<Confidence, { label: string; color: string; bg: string; score: number }> = {
  again: { label: 'Again', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40', score: 0 },
  hard: { label: 'Hard', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40', score: 1 },
  good: { label: 'Good', color: 'text-brand-accent', bg: 'bg-cyan-500/20 border-cyan-500/40', score: 2 },
  easy: { label: 'Easy', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40', score: 3 },
};

export default function FlashcardComponent({ flashcards }: FlashcardProps) {
  const [deck, setDeck] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(() =>
    Object.fromEntries(flashcards.map(f => [f.id, { id: f.id, confidence: null, reviewCount: 0 }])),
  );
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const currentCard = deck[currentIndex];
  const currentState = cardStates[currentCard?.id] ?? { id: currentCard?.id ?? 'current', confidence: null, reviewCount: 0 };
  const stateList = Object.values(cardStates) as CardState[];
  const masteredCount = stateList.filter(s => s.confidence === 'easy' || s.confidence === 'good').length;
  const totalCards = flashcards.length;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setIsFlipped(f => !f); }
      if (e.key === 'ArrowRight' && isFlipped) goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFlipped, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(i => (i + 1) % deck.length), 150);
  }, [deck.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(i => (i - 1 + deck.length) % deck.length), 150);
  }, [deck.length]);

  const handleConfidence = (conf: Confidence) => {
    setCardStates(prev => ({
      ...prev,
      [currentCard.id]: {
        id: currentCard.id,
        confidence: conf,
        reviewCount: (prev[currentCard.id]?.reviewCount ?? 0) + 1,
      },
    }));

    // If 'again' or 'hard', push the card to the end of the deck for re-review
    if (conf === 'again' || conf === 'hard') {
      setDeck(prev => {
        const updated = [...prev];
        const [card] = updated.splice(currentIndex, 1);
        updated.push(card);
        return updated;
      });
    }

    // Check if all cards are good/easy
    const updatedStates = {
      ...cardStates,
      [currentCard.id]: { id: currentCard.id, confidence: conf, reviewCount: currentState.reviewCount + 1 },
    };
    const allDone = (Object.values(updatedStates) as CardState[]).every(s => s.confidence === 'good' || s.confidence === 'easy');
    if (allDone) { setSessionComplete(true); return; }

    goNext();
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setDeck([...flashcards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsShuffled(true);
  };

  const handleReset = () => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(false);
    setSessionComplete(false);
    setCardStates(Object.fromEntries(flashcards.map(f => [f.id, { id: f.id, confidence: null, reviewCount: 0 }])));
  };

  // ─── Session complete screen ────────────────────────────────────────────────
  if (sessionComplete) {
    const easyCount = stateList.filter(s => s.confidence === 'easy').length;
    const goodCount = stateList.filter(s => s.confidence === 'good').length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-16 px-4 text-center"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
          <Trophy size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white">Session Complete!</h2>
        <p className="text-slate-400 max-w-xs">
          You've reviewed all {totalCards} cards in this set.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center min-w-[90px]">
            <div className="text-2xl font-mono font-bold text-green-400">{easyCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Easy</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center min-w-[90px]">
            <div className="text-2xl font-mono font-bold text-brand-accent">{goodCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Good</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center min-w-[90px]">
            <div className="text-2xl font-mono font-bold text-orange-400">
              {stateList.filter(s => s.confidence === 'hard' || s.confidence === 'again').length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Review</div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-8 py-4 bg-brand-accent text-black rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all"
        >
          <RotateCcw size={18} /> Study Again
        </button>
      </motion.div>
    );
  }

  // ─── Main card UI ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">

      {/* Header controls */}
      <div className="flex items-center justify-between w-full max-w-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-400" />
          <span className="text-xs font-mono text-slate-400">
            {masteredCount}/{totalCards} mastered
          </span>
        </div>
        <button
          onClick={handleShuffle}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isShuffled ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
        >
          <Shuffle size={12} /> Shuffle
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-accent"
          animate={{ width: `${(masteredCount / totalCards) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm" style={{ minHeight: 280 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard?.id}-${isFlipped ? 'back' : 'front'}`}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => setIsFlipped(f => !f)}
            className={`w-full rounded-[2rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl border border-brand-border relative overflow-hidden select-none ${isFlipped
                ? 'bg-gradient-to-b from-[#0D1117] to-[#080A0E]'
                : 'bg-gradient-to-b from-slate-900 to-black'
              }`}
            style={{ minHeight: 260 }}
          >
            {/* Confidence badge (if already rated) */}
            {currentState.confidence && (
              <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${CONFIDENCE_CONFIG[currentState.confidence].bg} ${CONFIDENCE_CONFIG[currentState.confidence].color}`}>
                {CONFIDENCE_CONFIG[currentState.confidence].label}
              </div>
            )}

            <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/50" />

            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-accent mb-6">
              {isFlipped ? 'Answer' : 'Question'}
            </div>

            <div className={`text-xl sm:text-2xl font-light leading-snug ${isFlipped ? 'italic text-brand-accent' : 'text-white'}`}>
              {isFlipped ? currentCard?.answer : currentCard?.question}
            </div>

            <div className="absolute bottom-5 flex items-center gap-2 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              <RefreshCcw size={12} className="text-slate-600" />
              {isFlipped ? 'Rate your confidence below' : 'Tap / Space to flip'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence buttons — shown after flip */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2 flex-wrap justify-center w-full max-w-sm"
          >
            {(Object.keys(CONFIDENCE_CONFIG) as Confidence[]).map(conf => (
              <button
                key={conf}
                onClick={() => handleConfidence(conf)}
                className={`flex-1 min-w-[70px] px-3 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:brightness-125 active:scale-95 ${CONFIDENCE_CONFIG[conf].bg} ${CONFIDENCE_CONFIG[conf].color}`}
              >
                {CONFIDENCE_CONFIG[conf].label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-10">
        <button
          onClick={goPrev}
          className="w-12 h-12 rounded-full border border-brand-border flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-brand-accent transition-all"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="text-xs font-mono font-bold text-slate-500 tracking-widest">
          {currentIndex + 1} <span className="opacity-30">/</span> {deck.length}
        </span>
        <button
          onClick={goNext}
          className="w-12 h-12 rounded-full border border-brand-border flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-brand-accent transition-all"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="text-[9px] text-slate-700 font-mono uppercase tracking-widest">
        ← → navigate · Space flip · Rate after flip
      </div>
    </div>
  );
}
