import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, GraduationCap, ArrowRight, Trash2, Variable, Shuffle, CheckCircle2, XCircle, Minus, Plus } from 'lucide-react';
import { MisconceptionAlert } from '../../shared';
import { ALGEBRA_EXPRESSION_MISCONCEPTIONS } from '../../../data/misconceptions/math';

type ViewMode = 'explore' | 'build' | 'learn';

interface Term {
  id: number;
  val: string;
  type: 'x' | 'y' | 'num';
  coeff: number;
}

const PRESET_EXPRESSIONS: { name: string; terms: Omit<Term, 'id'>[] }[] = [
  {
    name: 'Simple Like Terms',
    terms: [
      { val: '3x', type: 'x', coeff: 3 },
      { val: '2x', type: 'x', coeff: 2 },
      { val: '5', type: 'num', coeff: 5 },
    ],
  },
  {
    name: 'Two Variables',
    terms: [
      { val: '3x', type: 'x', coeff: 3 },
      { val: '2y', type: 'y', coeff: 2 },
      { val: '5', type: 'num', coeff: 5 },
      { val: '2x', type: 'x', coeff: 2 },
      { val: '-y', type: 'y', coeff: -1 },
    ],
  },
  {
    name: 'Negatives',
    terms: [
      { val: '5x', type: 'x', coeff: 5 },
      { val: '-3x', type: 'x', coeff: -3 },
      { val: '-2', type: 'num', coeff: -2 },
      { val: '7', type: 'num', coeff: 7 },
    ],
  },
  {
    name: 'Many Terms',
    terms: [
      { val: '4x', type: 'x', coeff: 4 },
      { val: '-x', type: 'x', coeff: -1 },
      { val: '3y', type: 'y', coeff: 3 },
      { val: '-2y', type: 'y', coeff: -2 },
      { val: '6', type: 'num', coeff: 6 },
      { val: '-1', type: 'num', coeff: -1 },
    ],
  },
];

const SUBSTITUTION_PROBLEMS: { expression: string; xVal: number; yVal: number; answer: number }[] = [
  { expression: '3x + 2y', xVal: 2, yVal: 3, answer: 12 },
  { expression: '5x - y + 4', xVal: 1, yVal: 2, answer: 7 },
  { expression: '2x + y - 3', xVal: 4, yVal: 1, answer: 6 },
  { expression: '-x + 4y', xVal: 3, yVal: 2, answer: 5 },
  { expression: '2x + 3', xVal: 5, yVal: 0, answer: 13 },
  { expression: '4x - 2y + 1', xVal: 2, yVal: 3, answer: 3 },
];

const TRAP_QUESTIONS: { question: string; options: string[]; correct: string; misconceptionId: string }[] = [
  {
    question: 'What is 3x + 5 simplified?',
    options: ['8x', '3x + 5', '8', '3x5'],
    correct: '3x + 5',
    misconceptionId: 'combine-unlike',
  },
  {
    question: 'What is -(2x + 3)?',
    options: ['-2x + 3', '-2x - 3', '2x - 3', '-2x + -3'],
    correct: '-2x - 3',
    misconceptionId: 'distribute-sign',
  },
  {
    question: 'What is 3x - x?',
    options: ['3', '2x', '2', '3x'],
    correct: '2x',
    misconceptionId: 'coefficient-one',
  },
  {
    question: 'What is (x + 2)²?',
    options: ['x² + 4', 'x² + 2x + 4', 'x² + 4x + 4', '2x + 4'],
    correct: 'x² + 4x + 4',
    misconceptionId: 'exponent-distribute',
  },
];

let nextId = 100;

export default function VarsExpressions() {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [terms, setTerms] = useState<Term[]>(
    PRESET_EXPRESSIONS[1].terms.map(t => ({ ...t, id: nextId++ }))
  );
  const [combined, setCombined] = useState<{ x: number; y: number; num: number } | null>(null);
  const [showCombination, setShowCombination] = useState(false);
  const [activeMisconception, setActiveMisconception] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState(1);

  const [subIndex, setSubIndex] = useState(0);
  const [subAnswer, setSubAnswer] = useState('');
  const [subFeedback, setSubFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [trapIndex, setTrapIndex] = useState(0);
  const [trapAnswer, setTrapAnswer] = useState<string | null>(null);
  const [trapFeedback, setTrapFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [trapScore, setTrapScore] = useState(0);

  const [newCoeff, setNewCoeff] = useState(1);
  const [newVar, setNewVar] = useState<'x' | 'y' | 'num'>('x');

  const combineTerms = useCallback(() => {
    let xSum = 0;
    let ySum = 0;
    let numSum = 0;
    terms.forEach(t => {
      if (t.type === 'x') xSum += t.coeff;
      else if (t.type === 'y') ySum += t.coeff;
      else numSum += t.coeff;
    });
    setCombined({ x: xSum, y: ySum, num: numSum });
    setShowCombination(true);
  }, [terms]);

  const resetCombination = () => {
    setCombined(null);
    setShowCombination(false);
  };

  const loadPreset = (idx: number) => {
    setActivePreset(idx);
    setTerms(PRESET_EXPRESSIONS[idx].terms.map(t => ({ ...t, id: nextId++ })));
    resetCombination();
  };

  const addTerm = () => {
    const val = newVar === 'num' ? String(newCoeff) : newCoeff === 1 ? newVar : newCoeff === -1 ? `-${newVar}` : `${newCoeff}${newVar}`;
    setTerms(prev => [...prev, { id: nextId++, val, type: newVar, coeff: newCoeff }]);
    resetCombination();
  };

  const removeTerm = (id: number) => {
    setTerms(prev => prev.filter(t => t.id !== id));
    resetCombination();
  };

  const shuffleTerms = () => {
    setTerms(prev => [...prev].sort(() => Math.random() - 0.5));
    resetCombination();
  };

  const formatCombined = (c: { x: number; y: number; num: number }) => {
    const parts: string[] = [];
    if (c.x !== 0) parts.push(c.x === 1 ? 'x' : c.x === -1 ? '-x' : `${c.x}x`);
    if (c.y !== 0) {
      const prefix = parts.length > 0 && c.y > 0 ? ' + ' : c.y < 0 && parts.length > 0 ? ' - ' : '';
      const absY = Math.abs(c.y);
      const yStr = absY === 1 ? 'y' : `${absY}y`;
      parts.push(`${prefix}${c.y < 0 && parts.length === 0 ? '-' : ''}${yStr}`);
    }
    if (c.num !== 0) {
      const prefix = parts.length > 0 && c.num > 0 ? ' + ' : c.num < 0 && parts.length > 0 ? ' - ' : '';
      parts.push(`${prefix}${c.num < 0 && parts.length === 0 ? '-' : ''}${Math.abs(c.num)}`);
    }
    return parts.join('') || '0';
  };

  const checkSubstitution = () => {
    const prob = SUBSTITUTION_PROBLEMS[subIndex];
    const userNum = parseFloat(subAnswer);
    if (isNaN(userNum)) return;
    if (Math.abs(userNum - prob.answer) < 0.01) {
      setSubFeedback('correct');
    } else {
      setSubFeedback('wrong');
    }
  };

  const nextSubstitution = () => {
    setSubIndex(prev => (prev + 1) % SUBSTITUTION_PROBLEMS.length);
    setSubAnswer('');
    setSubFeedback(null);
  };

  const handleTrapAnswer = (answer: string) => {
    if (trapFeedback) return;
    setTrapAnswer(answer);
    const q = TRAP_QUESTIONS[trapIndex];
    if (answer === q.correct) {
      setTrapFeedback('correct');
      setTrapScore(prev => prev + 1);
    } else {
      setTrapFeedback('wrong');
      const mis = ALGEBRA_EXPRESSION_MISCONCEPTIONS.find(m => m.id === q.misconceptionId);
      if (mis) setActiveMisconception(mis.id);
    }
  };

  const nextTrap = () => {
    setTrapIndex(prev => (prev + 1) % TRAP_QUESTIONS.length);
    setTrapAnswer(null);
    setTrapFeedback(null);
    setActiveMisconception(null);
  };

  const renderExplore = () => (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto mt-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESET_EXPRESSIONS.map((p, i) => (
          <button
            key={i}
            onClick={() => loadPreset(i)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activePreset === i
                ? 'bg-brand-accent text-black'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="w-full flex flex-col items-center">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Unsimplified Expression</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 bg-slate-900/50 p-8 rounded-[2.5rem] border border-brand-border min-h-[160px] w-full">
          <AnimatePresence>
            {terms.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`px-5 py-3 rounded-xl font-mono text-2xl font-bold shadow-lg border relative group ${
                  t.type === 'x'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : t.type === 'y'
                    ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                }`}
              >
                {t.val}
                {i < terms.length - 1 && (
                  <span className="absolute -right-5 top-1/2 -translate-y-1/2 text-slate-500 font-sans text-xl">
                    {terms[i + 1]?.coeff >= 0 ? '+' : ''}
                  </span>
                )}
                <button
                  onClick={() => removeTerm(t.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={shuffleTerms}
          className="flex items-center gap-2 px-4 py-3 bg-slate-800 text-slate-300 font-bold uppercase tracking-widest rounded-xl border border-slate-600 hover:text-white transition-colors"
        >
          <Shuffle size={16} /> Shuffle
        </button>
        {!showCombination ? (
          <button
            onClick={combineTerms}
            className="flex items-center gap-2 px-8 py-3 bg-brand-accent text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            Combine Like Terms <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={resetCombination}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-bold uppercase tracking-widest rounded-xl border border-slate-600 hover:text-white transition-colors"
          >
            <Trash2 size={16} /> Reset
          </button>
        )}
      </div>

      {showCombination && combined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-slate-900/60 rounded-2xl border border-brand-accent/30 p-6"
        >
          <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-4">Simplified Expression</h3>
          <div className="flex items-center gap-4 justify-center">
            <div className="text-4xl font-mono font-black text-white">{formatCombined(combined)}</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-1">x terms</div>
              <div className="text-xl font-mono font-bold text-cyan-400">{combined.x}x</div>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 text-center">
              <div className="text-[10px] text-pink-400 uppercase tracking-widest mb-1">y terms</div>
              <div className="text-xl font-mono font-bold text-pink-400">{combined.y === 1 ? '' : combined.y === -1 ? '-' : combined.y}y</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
              <div className="text-[10px] text-orange-400 uppercase tracking-widest mb-1">constants</div>
              <div className="text-xl font-mono font-bold text-orange-400">{combined.num}</div>
            </div>
          </div>
        </motion.div>
      )}

      {activeMisconception && (() => {
        const mis = ALGEBRA_EXPRESSION_MISCONCEPTIONS.find(m => m.id === activeMisconception);
        if (!mis) return null;
        return (
          <div className="w-full max-w-lg">
            <MisconceptionAlert
              misconception={mis}
              onClose={() => setActiveMisconception(null)}
              onLearnMore={() => setViewMode('learn')}
            />
          </div>
        );
      })()}
    </div>
  );

  const renderBuild = () => {
    const prob = SUBSTITUTION_PROBLEMS[subIndex];
    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto mt-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Build an Expression</h3>
              <div className="flex flex-wrap gap-3 mb-4 min-h-[60px] bg-black/30 rounded-xl p-4 border border-slate-800">
                <AnimatePresence>
                  {terms.map((t) => (
                    <motion.span
                      key={t.id}
                      layout
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`px-3 py-1 rounded-lg font-mono text-lg font-bold ${
                        t.type === 'x' ? 'bg-cyan-500/20 text-cyan-400' : t.type === 'y' ? 'bg-pink-500/20 text-pink-400' : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {t.val}
                    </motion.span>
                  ))}
                  {terms.length === 0 && <span className="text-slate-600 text-sm italic">Add terms below...</span>}
                </AnimatePresence>
              </div>
              {combined && showCombination && (
                <div className="text-sm text-slate-400 mb-4">
                  Simplified: <span className="text-white font-mono font-bold">{formatCombined(combined)}</span>
                </div>
              )}
              <div className="flex gap-2 mb-3">
                <button onClick={addTerm} className="px-4 py-2 bg-brand-accent text-black rounded-lg text-sm font-bold hover:bg-white transition-all">
                  <Plus size={14} className="inline mr-1" /> Add
                </button>
                <button onClick={combineTerms} disabled={showCombination} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-bold hover:bg-cyan-500/30 disabled:opacity-30 transition-all">
                  Combine
                </button>
                <button onClick={resetCombination} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-600 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => setNewCoeff(prev => prev - 1)} className="w-8 h-8 bg-slate-800 border border-slate-700 rounded flex items-center justify-center text-slate-400 hover:text-white"><Minus size={14} /></button>
                  <span className="w-10 text-center font-mono font-bold text-white">{newCoeff}</span>
                  <button onClick={() => setNewCoeff(prev => prev + 1)} className="w-8 h-8 bg-slate-800 border border-slate-700 rounded flex items-center justify-center text-slate-400 hover:text-white"><Plus size={14} /></button>
                </div>
                <div className="flex gap-1">
                  {(['x', 'y', 'num'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setNewVar(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        newVar === v
                          ? v === 'x' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50' : v === 'y' ? 'bg-pink-500/30 text-pink-400 border border-pink-500/50' : 'bg-orange-500/30 text-orange-400 border border-orange-500/50'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {v === 'num' ? 'const' : v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-2xl border border-orange-500/20 p-6">
              <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4">Error Detector</h3>
              <p className="text-slate-400 text-sm mb-4">
                Can you spot the common mistake? Choose the correct simplification.
              </p>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800 mb-4">
                <p className="text-white font-mono text-lg">{TRAP_QUESTIONS[trapIndex].question}</p>
              </div>
              <div className="space-y-2">
                {TRAP_QUESTIONS[trapIndex].options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleTrapAnswer(opt)}
                    disabled={trapFeedback !== null}
                    className={`w-full p-3 rounded-lg text-left transition-all border font-mono ${
                      trapAnswer === opt
                        ? trapFeedback === 'correct'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {trapAnswer === opt && trapFeedback && (
                        trapFeedback === 'correct' ? <CheckCircle2 size={18} className="text-green-400" /> : <XCircle size={18} className="text-red-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {trapFeedback && (
                <button onClick={nextTrap} className="mt-4 px-4 py-2 bg-brand-accent text-black rounded-lg text-sm font-bold hover:bg-white transition-all">
                  Next Trap <ArrowRight size={14} className="inline" />
                </button>
              )}
              <div className="mt-3 text-xs text-slate-500">
                Score: {trapScore} / {TRAP_QUESTIONS.length}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/60 rounded-2xl border border-green-500/20 p-6">
              <h3 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-4">Substitution Practice</h3>
              <p className="text-slate-400 text-sm mb-4">Evaluate the expression with the given values.</p>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800 mb-4">
                <div className="text-white font-mono text-2xl mb-3">{prob.expression}</div>
                <div className="flex gap-4 text-sm">
                  <span className="text-cyan-400 font-mono">x = {prob.xVal}</span>
                  <span className="text-pink-400 font-mono">y = {prob.yVal}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={subAnswer}
                  onChange={e => setSubAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkSubstitution()}
                  placeholder="Your answer"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono focus:border-brand-accent focus:outline-none"
                />
                <button onClick={checkSubstitution} disabled={subFeedback !== null} className="px-4 py-2 bg-brand-accent text-black rounded-lg text-sm font-bold hover:bg-white disabled:opacity-30 transition-all">
                  Check
                </button>
              </div>
              {subFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg border ${
                    subFeedback === 'correct'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      {subFeedback === 'correct' ? 'Correct!' : `Incorrect — the answer is ${prob.answer}`}
                    </span>
                    <button onClick={nextSubstitution} className="text-sm text-brand-accent hover:text-white transition-colors">
                      Next →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {activeMisconception && (() => {
              const mis = ALGEBRA_EXPRESSION_MISCONCEPTIONS.find(m => m.id === activeMisconception);
              if (!mis) return null;
              return (
                <MisconceptionAlert
                  misconception={mis}
                  onClose={() => setActiveMisconception(null)}
                  onLearnMore={() => setViewMode('learn')}
                  position="bottom"
                />
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  const renderLearn = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto mt-8">
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">Like Terms</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Like terms have the <strong className="text-white">same variable raised to the same power</strong>. You can combine them by adding their coefficients. 3x and 5x are like terms (3x + 5x = 8x), but 3x and 5 are NOT like terms.
        </p>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-pink-400 uppercase tracking-widest mb-3">Coefficients &amp; Constants</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          A <strong className="text-white">coefficient</strong> is the number multiplying a variable. In 5x, the coefficient is 5. When you see just "x", the coefficient is 1 (x = 1x). A <strong className="text-white">constant</strong> is a number without a variable, like 7 or -3.
        </p>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3">The Invisible -1</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          When you see <strong className="text-white">-x</strong>, it means <strong className="text-white">-1x</strong>. This trips up many students when combining: 3x - x = 3x - 1x = 2x, NOT 3.
        </p>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3">Distribution Warning</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          A negative sign before parentheses must be distributed to <strong className="text-white">every</strong> term inside: -(3x + 2) = -3x - 2, NOT -3x + 2. Think of the negative as multiplying by -1.
        </p>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3">Substitution</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          To evaluate 3x + 2y when x = 2 and y = 3: replace each variable with its value, then compute: 3(2) + 2(3) = 6 + 6 = 12. Always substitute <strong className="text-white">before</strong> simplifying.
        </p>
      </div>
      <button
        onClick={() => setViewMode('build')}
        className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
      >
        Practice Building Expressions →
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-6">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button onClick={() => setViewMode('explore')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Eye size={14} /> Explore
        </button>
        <button onClick={() => setViewMode('build')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'build' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Variable size={14} /> Build
        </button>
        <button onClick={() => setViewMode('learn')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <GraduationCap size={14} /> Learn
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          {viewMode === 'explore' && renderExplore()}
          {viewMode === 'build' && renderBuild()}
          {viewMode === 'learn' && renderLearn()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
