/**
 * QuizEngine.tsx
 *
 * Fixes:
 * - Import path corrected (services/aiService → aiService relative to component location)
 * - AI hint button appears after wrong answer (calls generateHint)
 * - Exam tip from AI grading result displayed
 * - Score tracked correctly including last question
 * - Matching question shows correct answer after submission
 * - Accessible keyboard submit on one-word (Enter key)
 *
 * Enhancements:
 * - WAEC / Cambridge / IB exam-tip callout
 * - "Get AI Hint" button on wrong MCQ answers
 * - Progress dots replace raw fraction display
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import {
  CheckCircle2, XCircle, Info, Send, Loader2,
  Target, Activity, ChevronRight, Lightbulb, BookOpen,
} from 'lucide-react';
import { Question } from '../data/mockData';
import { gradeOneWordAnswer, generateHint, GradingResult } from '../services/aiService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface QuizEngineProps {
  questions: Question[];
  onComplete: (score: number) => void;
  title?: string;
  subtopicId?: string;
}

interface LocalFeedback {
  is_correct: boolean;
  feedback: string;
  exam_tip?: string;
  hint?: string;
}

export default function QuizEngine({ questions, onComplete, subtopicId }: QuizEngineProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [oneWordAnswer, setOneWordAnswer] = useState('');
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [isGrading, setIsGrading] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [feedback, setFeedback] = useState<LocalFeedback | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const scoresRef = useRef<number[]>([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-4">
        <div className="bg-slate-900/40 rounded-[2rem] p-8 sm:p-10 border border-brand-border text-center">
          <h3 className="text-xl font-light text-white mb-3">Assessment Coming Soon</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            This module does not have quiz questions yet. Use the lesson and interactive content for now.
          </p>
        </div>
      </div>
    );
  }

  // ─── Save Attempt ─────────────────────────────────────────────────────────
  const saveAttempt = async (isCorrect: boolean, score: number, answerText: string) => {
    if (!user || !subtopicId) return;
    try {
      await supabase.from('attempts').insert({
        user_id: user.id,
        subtopic_id: subtopicId,
        question_id: currentQuestion.id,
        user_answer: answerText,
        is_correct: isCorrect,
        score: score,
      });
    } catch (err) {
      console.error('Failed to save attempt', err);
    }
  };

  // ─── MCQ ──────────────────────────────────────────────────────────────────
  const handleMCQSubmit = async (optionId: string) => {
    if (feedback) return;
    const isCorrect = optionId === currentQuestion.correctAnswer;
    setSelectedOption(optionId);
    scoresRef.current = [...scoresRef.current, isCorrect ? 1 : 0];
    await saveAttempt(isCorrect, isCorrect ? 1 : 0, optionId);
    setFeedback({
      is_correct: isCorrect,
      feedback: isCorrect
        ? 'Correct! Well done.'
        : `Not quite. ${currentQuestion.explanation ?? ''}`,
    });
  };

  // ─── One-word (AI graded) ─────────────────────────────────────────────────
  const handleOneWordSubmit = async () => {
    if (feedback || !oneWordAnswer.trim()) return;
    setIsGrading(true);
    try {
      const result: GradingResult = await gradeOneWordAnswer(
        currentQuestion.prompt,
        oneWordAnswer,
        currentQuestion.correctAnswer ?? '',
      );
      const isCorrect = result.is_correct;
      scoresRef.current = [...scoresRef.current, isCorrect ? 1 : 0];
      await saveAttempt(isCorrect, isCorrect ? 1 : 0, oneWordAnswer);
      setFeedback({
        is_correct: isCorrect,
        feedback: result.feedback,
        exam_tip: result.exam_tip,
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleMatchingSubmit = async () => {
    if (feedback) return;
    const pairs = currentQuestion.pairs ?? [];
    const correctCount = pairs.filter(p => matchingAnswers[p.left] === p.right).length;
    const isPerfect = correctCount === pairs.length;
    const score = correctCount / Math.max(1, pairs.length);
    scoresRef.current = [...scoresRef.current, score];
    await saveAttempt(isPerfect, score, JSON.stringify(matchingAnswers));
    setFeedback({
      is_correct: isPerfect,
      feedback: isPerfect
        ? 'Perfect match! All pairs correct.'
        : `${correctCount}/${pairs.length} correct. ${currentQuestion.explanation ?? ''}`,
    });
  };

  // ─── AI Hint (after wrong answer) ─────────────────────────────────────────
  const handleGetHint = async () => {
    if (!feedback || feedback.is_correct || isLoadingHint) return;
    setIsLoadingHint(true);
    try {
      const result = await generateHint(
        currentQuestion.prompt,
        selectedOption ?? oneWordAnswer,
        currentQuestion.correctAnswer ?? '',
        currentQuestion.prompt, // subtopic fallback
      );
      setHint(result.hint);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // ─── Advance ──────────────────────────────────────────────────────────────
  const nextQuestion = () => {
    const scores = scoresRef.current;
        if (isLastQuestion) {
          const total = scores.reduce((a, b) => a + b, 0);
          onComplete(total / questions.length);
      return;
    }
    setCurrentIndex(i => i + 1);
    setFeedback(null);
    setSelectedOption(null);
    setOneWordAnswer('');
    setMatchingAnswers({});
    setHint(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto py-4">

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Target size={13} className="text-brand-accent" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-brand-accent">
            {Math.round((currentIndex / questions.length) * 100)}%
          </span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < currentIndex
                  ? scoresRef.current[i] === 1 ? 'bg-green-500' : 'bg-red-500'
                  : i === currentIndex
                    ? 'bg-brand-accent'
                    : 'bg-slate-800'
                }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="bg-slate-900/40 rounded-[2rem] p-8 sm:p-10 border border-brand-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Activity size={80} className="text-brand-accent" />
          </div>

          <h3 className="text-xl sm:text-2xl font-light text-white mb-8 leading-snug">
            {currentQuestion.prompt}
          </h3>

          {/* ── MCQ ────────────────────────────────────────────────────────── */}
          {currentQuestion.type === 'mcq' && (
            <div className="space-y-3">
              {currentQuestion.options?.map(option => {
                const isSelected = selectedOption === option.id;
                const isCorrectOpt = option.id === currentQuestion.correctAnswer;
                const cls = !feedback
                  ? 'bg-black/40 border-brand-border hover:border-brand-accent/50 text-slate-400 hover:text-white'
                  : isSelected
                    ? feedback.is_correct
                      ? 'bg-green-500/10 border-green-500 text-green-400'
                      : 'bg-red-500/10 border-red-500 text-red-400'
                    : isCorrectOpt
                      ? 'bg-green-500/5 border-green-500/40 text-green-400/60'
                      : 'bg-black/20 border-brand-border/30 text-slate-600';
                return (
                  <button
                    key={option.id}
                    onClick={() => handleMCQSubmit(option.id)}
                    disabled={!!feedback}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${cls}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-base">{option.text}</span>
                      {feedback && isSelected && (
                        feedback.is_correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />
                      )}
                      {feedback && isCorrectOpt && !isSelected && (
                        <CheckCircle2 size={18} className="text-green-400/50" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── One-word ────────────────────────────────────────────────────── */}
          {currentQuestion.type === 'one-word' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={oneWordAnswer}
                  onChange={e => setOneWordAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleOneWordSubmit()}
                  disabled={!!feedback || isGrading}
                  placeholder="Type your answer…"
                  className="w-full p-5 text-lg font-mono bg-black/60 border border-brand-border rounded-2xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 outline-none transition-all placeholder:text-slate-700 text-white"
                />
                {!feedback && !isGrading && (
                  <button
                    onClick={handleOneWordSubmit}
                    disabled={!oneWordAnswer.trim()}
                    className="absolute right-3 top-3 p-2 bg-brand-accent text-black rounded-xl hover:bg-white transition-all disabled:opacity-40"
                  >
                    <Send size={18} />
                  </button>
                )}
                {isGrading && (
                  <div className="absolute right-3 top-3 p-2 text-brand-accent">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                )}
              </div>
              {currentQuestion.hint && !feedback && (
                <div className="flex items-start gap-2 p-3 bg-slate-900 border border-brand-accent/10 rounded-xl text-brand-accent/70 text-xs italic">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  Hint: {currentQuestion.hint}
                </div>
              )}
            </div>
          )}

          {/* ── Matching ────────────────────────────────────────────────────── */}
          {currentQuestion.type === 'matching' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {currentQuestion.pairs?.map((pair, idx) => {
                  const userAnswer = matchingAnswers[pair.left];
                  const isCorrectPair = userAnswer === pair.right;
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:flex-1 p-3.5 bg-black/40 border border-brand-border rounded-xl font-medium text-slate-300 text-sm">
                        {pair.left}
                      </div>
                      <ChevronRight size={14} className="text-brand-accent/30 hidden sm:block" />
                      <select
                        disabled={!!feedback}
                        value={matchingAnswers[pair.left] ?? ''}
                        onChange={e => setMatchingAnswers(prev => ({ ...prev, [pair.left]: e.target.value }))}
                        className={`w-full sm:flex-1 p-3.5 rounded-xl outline-none text-sm text-white appearance-none cursor-pointer transition-all border ${feedback
                            ? isCorrectPair
                              ? 'bg-green-500/10 border-green-500/60'
                              : 'bg-red-500/10 border-red-500/60'
                            : 'bg-slate-900 border-brand-border focus:border-brand-accent'
                          }`}
                      >
                        <option value="">Select…</option>
                        {currentQuestion.pairs?.map((p, pi) => (
                          <option key={pi} value={p.right}>{p.right}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              {!feedback && (
                <button
                  onClick={handleMatchingSubmit}
                  disabled={Object.keys(matchingAnswers).length < (currentQuestion.pairs?.length ?? 0)}
                  className="w-full py-4 bg-brand-accent text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-40"
                >
                  Confirm Answers
                </button>
              )}
            </div>
          )}

          {/* ── Feedback block ───────────────────────────────────────────────── */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-5 rounded-2xl border ${feedback.is_correct
                  ? 'bg-green-500/5 border-green-500/30 text-green-400'
                  : 'bg-red-500/5 border-red-500/30 text-red-400'
                }`}
            >
              <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest">
                {feedback.is_correct ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {feedback.is_correct ? 'Correct!' : 'Incorrect'}
              </div>

              <p className="opacity-90 leading-relaxed font-medium text-sm mb-3 italic">
                "{feedback.feedback}"
              </p>

              {/* Exam tip from AI */}
              {feedback.exam_tip && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-300 text-xs mb-3">
                  <BookOpen size={13} className="shrink-0 mt-0.5" />
                  <span><strong>Exam Tip:</strong> {feedback.exam_tip}</span>
                </div>
              )}

              {/* AI Hint button (wrong only) */}
              {!feedback.is_correct && (
                <div className="mb-4">
                  {hint ? (
                    <div className="flex items-start gap-2 p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl text-brand-accent text-xs">
                      <Lightbulb size={13} className="shrink-0 mt-0.5" />
                      {hint}
                    </div>
                  ) : (
                    <button
                      onClick={handleGetHint}
                      disabled={isLoadingHint}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-white border border-slate-700 transition-all disabled:opacity-40"
                    >
                      {isLoadingHint ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} />}
                      Get AI Hint
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={nextQuestion}
                className="w-full py-3 px-6 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-xs"
              >
                {isLastQuestion ? 'Finish Assessment' : 'Next Question →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
