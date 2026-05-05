import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'labeling' | 'ordering' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  image?: string;
  labels?: { id: string; text: string; x: number; y: number }[];
}

interface QuizModeProps {
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number, answers: Record<string, string | string[]>) => void;
  onRetry?: () => void;
  showFeedback?: boolean;
  shuffleQuestions?: boolean;
}

export default function QuizMode({
  questions,
  title = 'Knowledge Check',
  onComplete,
  onRetry,
  showFeedback = true,
  shuffleQuestions = false,
}: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const orderedQuestions = shuffleQuestions 
    ? [...questions].sort(() => Math.random() - 0.5) 
    : questions;

  const currentQuestion = orderedQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer || 
    (Array.isArray(currentQuestion?.correctAnswer) && 
     Array.isArray(selectedAnswer) && 
     JSON.stringify(selectedAnswer) === JSON.stringify(currentQuestion.correctAnswer));

  const correctCount = Object.entries(answers).filter(([qId, ans]) => {
    const q = questions.find(q => q.id === qId);
    if (!q) return false;
    if (Array.isArray(q.correctAnswer)) {
      return JSON.stringify(ans) === JSON.stringify(q.correctAnswer);
    }
    return ans === q.correctAnswer;
  }).length;

  const handleSelect = useCallback((answer: string) => {
    if (showFeedback && selectedAnswer !== null) return;
    setSelectedAnswer(answer);
  }, [selectedAnswer, showFeedback]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer,
    }));

    if (showFeedback) {
      setShowResult(true);
    } else {
      goToNext();
    }
  }, [selectedAnswer, currentQuestion, showFeedback]);

  const goToNext = useCallback(() => {
    if (currentIndex < orderedQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
      const score = showFeedback ? correctCount : 0;
      onComplete?.(score, orderedQuestions.length, answers);
    }
  }, [currentIndex, orderedQuestions.length, correctCount, answers, onComplete, showFeedback]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResult(false);
    setIsComplete(false);
    onRetry?.();
  }, [onRetry]);

  if (isComplete) {
    const percentage = Math.round((correctCount / orderedQuestions.length) * 100);
    const passed = percentage >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          passed ? 'bg-green-500/20' : 'bg-orange-500/20'
        }`}>
          <Trophy size={48} className={passed ? 'text-green-400' : 'text-orange-400'} />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {passed ? 'Great Job!' : 'Keep Practicing!'}
        </h2>

        <p className="text-slate-400 mb-6">
          You scored {correctCount} out of {orderedQuestions.length}
        </p>

        <div className="text-6xl font-mono font-black mb-8">
          <span className={passed ? 'text-green-400' : 'text-orange-400'}>
            {percentage}%
          </span>
        </div>

        <div className="flex gap-4">
          {onRetry && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          )}
          <button
            onClick={() => onComplete?.(correctCount, orderedQuestions.length, answers)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-slate-400">
            {currentIndex + 1} / {orderedQuestions.length}
          </span>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-accent"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / orderedQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6"
        >
          <p className="text-xl text-white mb-6">{currentQuestion.question}</p>

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  disabled={showFeedback && showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    selectedAnswer === option
                      ? showResult
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-brand-accent/20 border-brand-accent text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && selectedAnswer === option && (
                      isCorrect 
                        ? <CheckCircle2 size={20} className="text-green-400" /> 
                        : <XCircle size={20} className="text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl border ${
                isCorrect 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <p className="text-sm text-slate-300">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
              >
                {currentIndex < orderedQuestions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-6 justify-center">
        {orderedQuestions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!showFeedback || idx <= currentIndex) {
                setCurrentIndex(idx);
                setSelectedAnswer(null);
                setShowResult(false);
              }
            }}
            disabled={showFeedback && idx > currentIndex}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? 'bg-brand-accent w-6' 
                : idx < currentIndex 
                  ? answers[orderedQuestions[idx].id]
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-slate-700'
            } ${showFeedback && idx > currentIndex ? 'opacity-30 cursor-not-allowed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
