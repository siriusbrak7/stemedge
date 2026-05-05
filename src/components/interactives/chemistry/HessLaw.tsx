import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

interface HessPuzzle {
  name: string;
  target: string;
  targetDH: number;
  equations: { text: string; flippedText: string; dh: number; needsFlip: boolean; needsMult: number }[];
}

const PUZZLES: HessPuzzle[] = [
  {
    name: 'Formation of CH₄',
    target: 'C(s) + 2H₂(g) → CH₄(g)',
    targetDH: -74.8,
    equations: [
      { text: 'C(s) + O₂(g) → CO₂(g)', flippedText: 'CO₂(g) → C(s) + O₂(g)', dh: -393.5, needsFlip: false, needsMult: 1 },
      { text: 'H₂(g) + ½O₂(g) → H₂O(l)', flippedText: 'H₂O(l) → H₂(g) + ½O₂(g)', dh: -285.8, needsFlip: false, needsMult: 2 },
      { text: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)', flippedText: 'CO₂(g) + 2H₂O(l) → CH₄(g) + 2O₂(g)', dh: -890.3, needsFlip: true, needsMult: 1 },
    ],
  },
  {
    name: 'Formation of CO',
    target: 'C(s) + ½O₂(g) → CO(g)',
    targetDH: -110.5,
    equations: [
      { text: 'C(s) + O₂(g) → CO₂(g)', flippedText: 'CO₂(g) → C(s) + O₂(g)', dh: -393.5, needsFlip: false, needsMult: 1 },
      { text: 'CO(g) + ½O₂(g) → CO₂(g)', flippedText: 'CO₂(g) → CO(g) + ½O₂(g)', dh: -283.0, needsFlip: true, needsMult: 1 },
    ],
  },
  {
    name: 'Ethanol Combustion',
    target: 'C₂H₅OH(l) + 3O₂(g) → 2CO₂(g) + 3H₂O(l)',
    targetDH: -1367.0,
    equations: [
      { text: 'C(s) + O₂(g) → CO₂(g)', flippedText: 'CO₂(g) → C(s) + O₂(g)', dh: -393.5, needsFlip: false, needsMult: 2 },
      { text: 'H₂(g) + ½O₂(g) → H₂O(l)', flippedText: 'H₂O(l) → H₂(g) + ½O₂(g)', dh: -285.8, needsFlip: false, needsMult: 3 },
      { text: '2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l)', flippedText: 'C₂H₅OH(l) → 2C(s) + 3H₂(g) + ½O₂(g)', dh: -277.6, needsFlip: true, needsMult: 1 },
    ],
  },
];

const QUIZ: QuizQuestion[] = [
  { id: 'hl1', question: "Hess's Law states:", type: 'multiple-choice', options: ['Enthalpy depends on path', 'Total ΔH is independent of route', 'Energy is always lost', 'All reactions are exothermic'], correctAnswer: 'Total ΔH is independent of route', explanation: 'Enthalpy is a state function. ΔH depends only on initial and final states, not the route taken.' },
  { id: 'hl2', question: 'Reversing a reaction changes ΔH by:', type: 'multiple-choice', options: ['Doubling it', 'Making it zero', 'Changing its sign', 'No change'], correctAnswer: 'Changing its sign', explanation: 'If forward ΔH = -100 kJ, then reverse ΔH = +100 kJ.' },
  { id: 'hl3', question: 'Multiplying an equation by 3 means ΔH is:', type: 'multiple-choice', options: ['Unchanged', 'Halved', 'Tripled', 'Squared'], correctAnswer: 'Tripled', explanation: 'Enthalpy is extensive — it scales with the amount of substance.' },
  { id: 'hl4', question: 'Standard enthalpy of formation (ΔHf°) is measured at:', type: 'multiple-choice', options: ['0°C, 1 atm', '25°C, 1 atm', '100°C, 1 atm', '25°C, 2 atm'], correctAnswer: '25°C, 1 atm', explanation: 'Standard conditions: 298 K (25°C) and 100 kPa (≈1 atm).' },
  { id: 'hl5', question: 'In a Hess cycle, intermediates on opposite sides:', type: 'multiple-choice', options: ['Add up', 'Cancel out', 'Multiply', 'Stay unchanged'], correctAnswer: 'Cancel out', explanation: 'Like algebra — identical species on left and right of the sum cancel, leaving only the target equation.' },
];

export default function HessLaw() {
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {(['learn', 'simulation', 'quiz'] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === m ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>{m}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'learn' && <LearnPanel />}
            {viewMode === 'simulation' && <HessSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Hess's Law Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LearnPanel() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is Hess's Law?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          <strong className="text-white">Hess's Law</strong> states that the total enthalpy change of a reaction is <strong className="text-brand-accent">independent of the route taken</strong>, provided the initial and final conditions are the same. This is because enthalpy is a <em>state function</em> — it depends only on the current state of the system, not how it got there.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          This is extremely useful because some reactions are impossible to measure directly. Instead, we can combine measurable reactions to calculate the unknown ΔH.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">The Hess Cycle</h3>
        <svg viewBox="0 0 400 200" className="w-full max-w-[400px] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="200" fill="#0a0a1a" rx="12" />
          {/* Route 1: Direct */}
          <line x1="60" y1="60" x2="340" y2="60" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrB)" />
          <text x="200" y="48" fill="#3b82f6" fontSize="11" textAnchor="middle" fontWeight="bold">Route 1 (ΔH = ?)</text>
          <text x="40" y="64" fill="#f8fafc" fontSize="10" textAnchor="middle">A</text>
          <text x="360" y="64" fill="#f8fafc" fontSize="10" textAnchor="middle">B</text>
          {/* Route 2: Via C */}
          <line x1="60" y1="70" x2="200" y2="160" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrR)" />
          <text x="110" y="130" fill="#ef4444" fontSize="10" textAnchor="middle">ΔH₁</text>
          <line x1="200" y1="160" x2="340" y2="70" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrG)" />
          <text x="290" y="130" fill="#22c55e" fontSize="10" textAnchor="middle">ΔH₂</text>
          <text x="200" y="178" fill="#fbbf24" fontSize="10" textAnchor="middle">C (intermediate)</text>
          <text x="200" y="195" fill="#64748b" fontSize="9" textAnchor="middle">ΔH = ΔH₁ + ΔH₂</text>
          <defs>
            <marker id="arrB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker>
            <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" /></marker>
            <marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" /></marker>
          </defs>
        </svg>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4">
          <h4 className="text-white text-sm font-bold mb-2">Key Rules for Manipulating Equations</h4>
          <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
            <li><strong className="text-white">Flip</strong> an equation → change the <strong>sign</strong> of ΔH</li>
            <li><strong className="text-white">Multiply</strong> by a factor → multiply ΔH by the <strong>same factor</strong></li>
            <li><strong className="text-white">Add</strong> equations together → intermediates on opposite sides <strong>cancel out</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function HessSim() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];

  const [flipped, setFlipped] = useState<boolean[]>(puzzle.equations.map(() => false));
  const [mults, setMults] = useState<number[]>(puzzle.equations.map(() => 1));

  const selectPuzzle = (i: number) => {
    setPuzzleIdx(i);
    setFlipped(PUZZLES[i].equations.map(() => false));
    setMults(PUZZLES[i].equations.map(() => 1));
  };

  const toggleFlip = (i: number) => setFlipped(f => f.map((v, j) => j === i ? !v : v));
  const cycleMult = (i: number) => setMults(m => m.map((v, j) => j === i ? (v >= 3 ? 1 : v + 1) : v));

  const computedDHs = puzzle.equations.map((eq, i) => eq.dh * mults[i] * (flipped[i] ? -1 : 1));
  const totalH = computedDHs.reduce((a, b) => a + b, 0);

  const isSolved = puzzle.equations.every((eq, i) => flipped[i] === eq.needsFlip && mults[i] === eq.needsMult);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 space-y-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {PUZZLES.map((p, i) => (
            <button key={i} onClick={() => selectPuzzle(i)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${puzzleIdx === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Target */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-2">Target Equation</h3>
          <p className="text-white text-lg font-mono text-center py-3 bg-black/50 rounded-xl border border-slate-700">
            {puzzle.target} <span className="text-blue-400 ml-4">ΔH = ?</span>
          </p>
          <p className="text-slate-400 text-sm mt-3 text-center">Flip and multiply the equations below so they add up to the target.</p>
        </div>

        {/* Equations */}
        <div className="space-y-3">
          {puzzle.equations.map((eq, i) => {
            const displayDH = computedDHs[i];
            return (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 font-mono text-sm text-slate-300">
                    <span className="text-white">{mults[i] > 1 ? `${mults[i]}[` : ''}{flipped[i] ? eq.flippedText : eq.text}{mults[i] > 1 ? ']' : ''}</span>
                    <span className={`ml-3 ${displayDH > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      ΔH = {displayDH > 0 ? '+' : ''}{displayDH.toFixed(1)} kJ
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => cycleMult(i)}
                      className={`px-3 py-1 rounded text-xs font-bold ${mults[i] > 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                      ×{mults[i]}
                    </button>
                    <button onClick={() => toggleFlip(i)}
                      className={`px-3 py-1 rounded text-xs font-bold ${flipped[i] ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                      {flipped[i] ? 'Flipped' : 'Flip'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isSolved && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl text-center">
            <h4 className="text-green-400 font-bold uppercase tracking-widest mb-2">🎉 Solved!</h4>
            <p className="text-slate-300 text-sm mb-3">All intermediates cancel perfectly, leaving the target equation.</p>
            <p className="text-3xl font-mono text-white">ΔH = {totalH.toFixed(1)} kJ/mol</p>
          </motion.div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:w-[300px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Running Total ΔH</p>
          <p className={`text-2xl font-mono ${isSolved ? 'text-green-400' : 'text-slate-300'}`}>{totalH.toFixed(1)} kJ</p>
          <p className="text-xs text-slate-500 mt-1">Target ≈ {puzzle.targetDH} kJ</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Hints</h4>
          <ul className="text-xs text-slate-400 space-y-1 list-disc pl-3">
            <li>Check which products/reactants need to cancel</li>
            <li>If a species appears as a product but should be a reactant, flip that equation</li>
            <li>Match coefficients to the target by multiplying</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
