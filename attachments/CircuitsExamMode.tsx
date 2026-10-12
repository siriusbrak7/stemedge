import React, { useState } from 'react';
import { CircuitsExamQuestion } from './physics';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

interface CircuitsExamModeProps {
  questions: CircuitsExamQuestion[];
  onReturnToLab: () => void;
}

export const CircuitsExamMode: React.FC<CircuitsExamModeProps> = ({
  questions,
  onReturnToLab,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<{ [qId: string]: string }>({});
  const [userUnits, setUserUnits] = useState<{ [qId: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [qId: string]: boolean }>({});

  const currentQ = questions[activeQuestionIndex];
  if (!currentQ) return null;

  const currentInput = userInputs[currentQ.id] || '';
  const currentUnit = userUnits[currentQ.id] || currentQ.acceptedUnits[0] || '';
  const isSubmitted = submitted[currentQ.id] || false;

  // Validation function with ±2% tolerance or text matching
  const evaluateAnswer = (q: CircuitsExamQuestion): { isCorrect: boolean; feedbackMsg: string | null } => {
    const inputVal = userInputs[q.id]?.trim() || '';

    if (q.isTextAnswer) {
      const lower = inputVal.toLowerCase();
      const isCorrect = lower.includes('series') && !lower.includes('parallel');
      return {
        isCorrect,
        feedbackMsg: isCorrect
          ? 'Correct! An ammeter has 0 Ω resistance and must be in series so the entire current passes through it.'
          : 'Incorrect. Remember that ammeters have 0 Ω resistance and must be connected in series, not parallel.',
      };
    }

    const numVal = parseFloat(inputVal);
    if (isNaN(numVal)) {
      return { isCorrect: false, feedbackMsg: 'Please enter a valid numeric value.' };
    }

    const expectedNum = typeof q.expectedValue === 'number' ? q.expectedValue : parseFloat(q.expectedValue);
    const tolerance = Math.abs(expectedNum * 0.025); // 2.5% tolerance
    const isWithinTolerance = Math.abs(numVal - expectedNum) <= tolerance;

    return {
      isCorrect: isWithinTolerance,
      feedbackMsg: null,
    };
  };

  const { isCorrect } = evaluateAnswer(currentQ);

  // Check for misconceptions
  let activeMisconception: string | null = null;
  if (isSubmitted && !isCorrect) {
    for (const misc of currentQ.misconceptions) {
      const msg = misc.check(currentInput, currentUnit);
      if (msg) {
        activeMisconception = msg;
        break;
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput) return;
    setSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleRetry = () => {
    setSubmitted((prev) => ({ ...prev, [currentQ.id]: false }));
  };

  // Compute total score
  const totalScore = questions.reduce((acc, q) => {
    if (submitted[q.id]) {
      const evalRes = evaluateAnswer(q);
      return acc + (evalRes.isCorrect ? q.marks : 0);
    }
    return acc;
  }, 0);

  const maxScore = questions.reduce((acc, q) => acc + q.marks, 0);

  return (
    <div id="circuits-exam-mode-container" className="flex flex-col gap-4 w-full">
      {/* Exam Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#141722] border border-[#232938]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReturnToLab}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181D2A] hover:bg-[#202738] border border-[#232938] text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Lab</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Cambridge Paper 4 Theory
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Structured Calculations</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span>Electrical Circuits &amp; Ohm's Law Assessment</span>
            </h2>
          </div>
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-3 bg-[#181D2A] px-3.5 py-1.5 rounded-xl border border-[#232938] self-start sm:self-auto">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400">Candidate Score</span>
            <span className="text-sm font-mono font-bold text-amber-400">
              {totalScore} / {maxScore} Marks
            </span>
          </div>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isDone = submitted[q.id];
          const correct = isDone ? evaluateAnswer(q).isCorrect : false;
          const isActive = idx === activeQuestionIndex;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setActiveQuestionIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-[#141722] border border-[#232938] text-slate-300 hover:bg-[#1A1F2C]'
              }`}
            >
              {isDone ? (
                correct ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                ) : (
                  <XCircle className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-rose-400'}`} />
                )
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              )}
              <span>
                Q{q.questionNumber} ({q.marks}m)
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-[#141722] border border-[#232938]">
        {/* Paper Reference Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2333]">
          <span className="text-xs font-mono text-slate-400">{currentQ.paperReference}</span>
          <span className="text-xs font-mono font-bold text-amber-400">
            [{currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}]
          </span>
        </div>

        {/* Prompt */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Question {currentQ.questionNumber}
          </span>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            {currentQ.prompt}
          </p>
          {currentQ.contextNote && (
            <p className="text-xs text-amber-300 font-mono mt-0.5">{currentQ.contextNote}</p>
          )}
        </div>

        {/* Answer Submission Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) =>
                setUserInputs((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
              }
              disabled={isSubmitted}
              placeholder={currentQ.isTextAnswer ? 'Type answer here...' : 'Enter calculated value (3 s.f.)'}
              className="flex-1 px-3 py-2 rounded-lg bg-[#0E111A] border border-[#2B3347] focus:border-amber-400 focus:outline-none text-slate-100 font-mono text-sm disabled:opacity-80"
            />

            {!currentQ.isTextAnswer && (
              <select
                value={currentUnit}
                onChange={(e) =>
                  setUserUnits((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                }
                disabled={isSubmitted}
                className="px-2.5 py-2 rounded-lg bg-[#0E111A] border border-[#2B3347] focus:border-amber-400 focus:outline-none text-slate-200 font-mono text-xs disabled:opacity-80"
              >
                {currentQ.acceptedUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={!currentInput.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                className="px-3 py-2 rounded-lg bg-[#1E2333] hover:bg-[#283047] text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Question</span>
              </button>
            )}
          </div>
        </form>

        {/* Mark Scheme & Misconception Feedback Panel */}
        {isSubmitted && (
          <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-[#1E2333]">
            {/* Status Banner */}
            <div
              className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-semibold ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Full Marks [{currentQ.marks}/{currentQ.marks}] — Correct method and answer.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Review Required [0/{currentQ.marks}] — See official Cambridge mark scheme below.
                  </span>
                </>
              )}
            </div>

            {/* Diagnostic Misconception Alert */}
            {activeMisconception && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Cambridge Examiner Note: </span>
                  <span>{activeMisconception}</span>
                </div>
              </div>
            )}

            {/* Cambridge Mark Scheme Breakdown */}
            <div className="p-3 rounded-lg bg-[#0E111A] border border-[#202738] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Official Cambridge Mark Scheme (IGCSE 0625)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-[#141722] border border-[#1E2333]">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">
                    1. Formula / Rule (C1)
                  </span>
                  <span className="text-slate-200 font-semibold">{currentQ.working.equation}</span>
                </div>
                <div className="p-2 rounded bg-[#141722] border border-[#1E2333]">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">
                    2. Substitution (C1)
                  </span>
                  <span className="text-slate-200">{currentQ.working.substitution}</span>
                </div>
                <div className="p-2 rounded bg-[#141722] border border-[#1E2333]">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">
                    3. Final Answer (A1)
                  </span>
                  <span className="text-emerald-400 font-bold">{currentQ.working.answer}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
