import React, { useState } from 'react';
import {
  ElectromagnetismExamQuestion,
  ElectromagnetismState,
  isWithinTolerance,
  format3SF,
} from './physics';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

interface ElectromagnetismExamModeProps {
  questions: ElectromagnetismExamQuestion[];
  snapshot: ElectromagnetismState;
  onReturnToExplore: () => void;
}

type AnswerState = 'idle' | 'correct' | 'partial' | 'wrong';

/** Evaluate a numeric answer against the question's correctAnswer + tolerancePct */
function evaluateNumericAnswer(
  raw: string,
  question: ElectromagnetismExamQuestion
): { state: AnswerState; studentVal: number } {
  const studentVal = parseFloat(raw.trim());
  if (isNaN(studentVal)) return { state: 'wrong', studentVal: NaN };

  if (isWithinTolerance(studentVal, question.correctAnswer, question.tolerancePct)) {
    return { state: 'correct', studentVal };
  }
  // Within 10× tolerance → partial (close but check rounding)
  if (isWithinTolerance(studentVal, question.correctAnswer, question.tolerancePct * 10)) {
    return { state: 'partial', studentVal };
  }
  return { state: 'wrong', studentVal };
}

/**
 * Evaluate a typed text answer.
 * Accepts any string in question.acceptedTextAnswers (case-insensitive, trimmed).
 * Also accepts the numeric value as a string if correctAnswer > 0 (for Q6 "4" style).
 */
function evaluateTextAnswer(
  raw: string,
  question: ElectromagnetismExamQuestion
): AnswerState {
  const normalised = raw.trim().toLowerCase().replace(/[^a-z0-9.×x]/g, '');
  const accepted = (question.acceptedTextAnswers ?? []).map((s) =>
    s.toLowerCase().replace(/[^a-z0-9.×x]/g, '')
  );
  if (accepted.some((a) => normalised === a || normalised.includes(a))) {
    return 'correct';
  }
  return 'wrong';
}

export const ElectromagnetismExamMode: React.FC<ElectromagnetismExamModeProps> = ({
  questions,
  snapshot,
  onReturnToExplore,
}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [scores, setScores] = useState<AnswerState[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  if (!questions.length) return null;
  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  function handleSubmit() {
    if (answerState !== 'idle') return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    let result: AnswerState;
    if (q.type === 'text') {
      result = evaluateTextAnswer(trimmed, q);
    } else {
      result = evaluateNumericAnswer(trimmed, q).state;
    }

    setAnswerState(result);
    setScores((prev) => {
      const next = [...prev];
      next[currentQ] = result;
      return next;
    });
  }

  function handleNext() {
    if (isLast) {
      setShowSummary(true);
    } else {
      setCurrentQ((i) => i + 1);
      setInputValue('');
      setAnswerState('idle');
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setInputValue('');
    setAnswerState('idle');
    setScores([]);
    setShowSummary(false);
  }

  const correctCount = scores.filter((s) => s === 'correct').length;

  // ── Summary screen ────────────────────────────────────────────────────────
  if (showSummary) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2 text-center">
          <GraduationCap className="w-12 h-12 text-amber-400" />
          <h2 className="text-2xl font-extrabold text-slate-100">Exam Complete</h2>
          <p className="text-sm text-slate-400">
            Cambridge IGCSE Physics (0625) — Electromagnetism &amp; Motor Effect
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-extrabold font-mono text-amber-300">
            {correctCount} / {questions.length}
          </span>
          <span className="text-sm font-mono text-slate-500">correct answers</span>
        </div>

        {/* Per-question result dots */}
        <div className="flex gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                scores[i] === 'correct'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : scores[i] === 'partial'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              Q{i + 1}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141722] border border-[#232938] text-sm font-semibold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Exam
          </button>
          <button
            type="button"
            onClick={onReturnToExplore}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  const isTextQ = q.type === 'text';

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-[#1A2030] overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-slate-400 shrink-0">
          Q{currentQ + 1} of {questions.length}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-[#141722] border border-[#232938] rounded-2xl p-5 flex flex-col gap-4">
        {/* Q header */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm">
            Q{q.id}
          </div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            {q.questionText}
          </p>
        </div>

        {/* Context lines (given values) */}
        {q.contextLines.length > 0 && (
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#0E1017] border border-[#1A2030]">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Given
            </span>
            {q.contextLines.map((line, i) => (
              <span key={i} className="text-xs font-mono text-slate-300">
                {line}
              </span>
            ))}
          </div>
        )}

        {/* Answer input — unified typed input for both 'numeric' and 'text' questions */}
        <div className="flex items-center gap-2">
          <input
            type={isTextQ ? 'text' : 'number'}
            step={isTextQ ? undefined : 'any'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && answerState === 'idle') handleSubmit();
              if (e.key === 'Enter' && answerState !== 'idle') handleNext();
            }}
            disabled={answerState !== 'idle'}
            placeholder={
              isTextQ
                ? 'Type "upwards" or "downwards"…'
                : 'Enter your answer…'
            }
            className="flex-1 bg-[#0E1017] border border-[#232938] rounded-xl px-3 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 disabled:opacity-60"
          />
          {!isTextQ && q.unit && (
            <span className="px-3 py-2.5 rounded-xl bg-[#0E1017] border border-[#232938] text-xs font-mono font-bold text-amber-300 shrink-0">
              {q.unit}
            </span>
          )}
        </div>

        {/* Submit button */}
        {answerState === 'idle' && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="self-start flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HelpCircle className="w-4 h-4" />
            Check Answer
          </button>
        )}

        {/* Feedback panel */}
        {answerState !== 'idle' && (
          <div
            className={`flex flex-col gap-3 p-4 rounded-xl border ${
              answerState === 'correct'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : answerState === 'partial'
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            {/* Result header */}
            <div className="flex items-center gap-2">
              {answerState === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span
                className={`text-sm font-bold ${
                  answerState === 'correct'
                    ? 'text-emerald-400'
                    : answerState === 'partial'
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {answerState === 'correct'
                  ? 'Correct ✓'
                  : answerState === 'partial'
                  ? 'Close — check rounding'
                  : 'Incorrect'}
              </span>
              {/* Show correct answer on wrong/partial for numeric and text questions */}
              {answerState !== 'correct' && (
                <span className="text-xs font-mono text-slate-400 ml-auto">
                  {isTextQ
                    ? `Expected: "${q.acceptedTextAnswers?.[0] ?? 'downwards'}"`
                    : `Correct: ${format3SF(q.correctAnswer)} ${q.unit}`}
                </span>
              )}
            </div>

            {/* Mark scheme steps */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Mark Scheme
              </span>
              {q.markSchemeSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-slate-600 shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <span className="text-xs font-mono text-slate-300">{step}</span>
                </div>
              ))}
            </div>

            {/* Misconception hint if wrong/partial */}
            {answerState !== 'correct' && q.misconceptions.length > 0 && (
              <div className="flex flex-col gap-1 pt-1 border-t border-current/20">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Common Misconception
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  {q.misconceptions[0].hint}
                </p>
              </div>
            )}

            {/* Next / Finish button */}
            <button
              type="button"
              onClick={handleNext}
              className="self-start flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
            >
              {isLast ? (
                <>
                  <GraduationCap className="w-4 h-4" />
                  View Results
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Next Question
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Back to explore */}
      <button
        type="button"
        onClick={onReturnToExplore}
        className="self-start flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Explore Mode
      </button>
    </div>
  );
};
