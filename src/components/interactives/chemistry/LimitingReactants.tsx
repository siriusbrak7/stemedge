import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'lr1', question: 'The limiting reagent is:', type: 'multiple-choice', options: ['The one in excess', 'The one fully consumed first', 'The catalyst', 'The product'], correctAnswer: 'The one fully consumed first', explanation: 'The limiting reagent runs out first and determines the maximum amount of product formed.' },
  { id: 'lr2', question: '2H₂ + O₂ → 2H₂O. With 3 mol H₂ and 2 mol O₂, the limiting reagent is:', type: 'multiple-choice', options: ['H₂', 'O₂', 'H₂O', 'Both run out together'], correctAnswer: 'H₂', explanation: '3 mol H₂ needs 1.5 mol O₂. We have 2 mol O₂ (more than enough). H₂ limits the reaction.' },
  { id: 'lr3', question: 'Percentage yield = ', type: 'multiple-choice', options: ['(theoretical/actual) × 100', '(actual/theoretical) × 100', 'actual − theoretical', 'theoretical × 100'], correctAnswer: '(actual/theoretical) × 100', explanation: '% yield = (actual yield ÷ theoretical yield) × 100%' },
  { id: 'lr4', question: 'If theoretical yield is 50g but only 40g is obtained, % yield is:', type: 'multiple-choice', options: ['80%', '125%', '90%', '50%'], correctAnswer: '80%', explanation: '(40/50) × 100 = 80%.' },
  { id: 'lr5', question: 'An excess reagent is one that:', type: 'multiple-choice', options: ['Is fully consumed', 'Has leftover moles after reaction', 'Is the catalyst', 'Is always a gas'], correctAnswer: 'Has leftover moles after reaction', explanation: 'The excess reagent is not fully used up — some remains unreacted.' },
];

export default function LimitingReactants() {
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
            {viewMode === 'simulation' && <LimitingSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Limiting Reactants Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is the Limiting Reagent?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          In most reactions, reactants are <strong className="text-white">not</strong> present in the exact stoichiometric ratio. One reactant runs out before the others — this is the <strong className="text-brand-accent">limiting reagent</strong>. It determines the maximum amount of product that can be formed.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          The other reactant(s) are in <strong className="text-amber-400">excess</strong> — some will be left unreacted.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4">
          <p className="text-white font-mono text-center text-lg mb-2">2H₂ + O₂ → 2H₂O</p>
          <p className="text-slate-300 text-sm text-center">Stoichiometric ratio: <strong>2 mol H₂ : 1 mol O₂ : 2 mol H₂O</strong></p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">How to Find the Limiting Reagent</h3>
        <ol className="text-sm text-slate-300 space-y-3 list-decimal pl-4">
          <li>Write the balanced equation and note the molar ratio</li>
          <li>Divide each reactant's moles by its coefficient in the equation</li>
          <li>The reactant with the <strong className="text-white">smallest value</strong> is the limiting reagent</li>
          <li>Use the limiting reagent's moles to calculate the theoretical product yield</li>
        </ol>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Percentage Yield</h3>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">% Yield = (Actual Yield ÷ Theoretical Yield) × 100</p>
        </div>
        <p className="text-slate-300 text-sm">In practice, yields are often less than 100% due to incomplete reactions, side reactions, or loss during purification.</p>
      </div>
    </div>
  );
}

function LimitingSim() {
  const [h2Moles, setH2Moles] = useState(4);
  const [o2Moles, setO2Moles] = useState(1);

  const calc = useMemo(() => {
    // 2H₂ + O₂ → 2H₂O
    const h2Ratio = h2Moles / 2;
    const o2Ratio = o2Moles / 1;
    const limitingIsH2 = h2Ratio < o2Ratio;
    const limitingMoles = Math.min(h2Ratio, o2Ratio);
    const h2oProduced = limitingMoles * 2;
    const h2Used = limitingMoles * 2;
    const o2Used = limitingMoles * 1;
    const h2Leftover = h2Moles - h2Used;
    const o2Leftover = o2Moles - o2Used;
    return { limitingIsH2, h2oProduced, h2Used, o2Used, h2Leftover, o2Leftover };
  }, [h2Moles, o2Moles]);

  const maxMol = 8;
  const drawMolecules = (count: number, color: string, symbol: string, cx: number, cy: number, spacing: number) => {
    const elems = [];
    for (let i = 0; i < Math.min(count, maxMol); i++) {
      const x = cx + (i % 4) * spacing;
      const y = cy + Math.floor(i / 4) * spacing;
      elems.push(
        <g key={`${symbol}-${i}`}>
          <circle cx={x} cy={y} r="10" fill={color} opacity="0.9" />
          <text x={x} y={y + 4} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">{symbol}</text>
        </g>
      );
    }
    return elems;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-white font-mono text-center text-lg mb-4">2H₂ + O₂ → 2H₂O</p>

          <svg viewBox="0 0 460 200" className="w-full max-w-[460px] mx-auto" xmlns="http://www.w3.org/2000/svg">
            <rect width="460" height="200" fill="#0a0a1a" rx="12" />

            {/* Reactants */}
            <text x="80" y="20" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">H₂ ({h2Moles} mol)</text>
            {drawMolecules(h2Moles, '#3b82f6', 'H₂', 45, 40, 25)}

            <text x="200" y="20" fill="#22c55e" fontSize="10" textAnchor="middle" fontWeight="bold">O₂ ({o2Moles} mol)</text>
            {drawMolecules(o2Moles, '#22c55e', 'O₂', 170, 40, 25)}

            {/* Arrow */}
            <line x1="250" y1="80" x2="290" y2="80" stroke="#f8fafc" strokeWidth="2" markerEnd="url(#arrW)" />
            <defs><marker id="arrW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f8fafc" /></marker></defs>

            {/* Products */}
            <text x="370" y="20" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">H₂O ({calc.h2oProduced.toFixed(1)} mol)</text>
            {drawMolecules(Math.round(calc.h2oProduced), '#fbbf24', 'H₂O', 335, 40, 25)}

            {/* Leftover */}
            {calc.h2Leftover > 0.01 && (
              <g>
                <text x="80" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">Excess H₂: {calc.h2Leftover.toFixed(1)} mol</text>
                {drawMolecules(Math.round(calc.h2Leftover), '#475569', 'H₂', 55, 160, 20)}
              </g>
            )}
            {calc.o2Leftover > 0.01 && (
              <g>
                <text x="200" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">Excess O₂: {calc.o2Leftover.toFixed(1)} mol</text>
                {drawMolecules(Math.round(calc.o2Leftover), '#475569', 'O₂', 175, 160, 20)}
              </g>
            )}
          </svg>
        </div>

        {/* Sliders */}
        <div className="flex gap-6 justify-center">
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">H₂ (mol)</label>
            <input type="range" min="1" max="8" value={h2Moles} onChange={e => setH2Moles(Number(e.target.value))} className="w-28 accent-blue-500" />
            <span className="text-xs text-blue-400 font-mono">{h2Moles}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-green-400 uppercase tracking-widest font-bold">O₂ (mol)</label>
            <input type="range" min="1" max="8" value={o2Moles} onChange={e => setO2Moles(Number(e.target.value))} className="w-28 accent-green-500" />
            <span className="text-xs text-green-400 font-mono">{o2Moles}</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-[340px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Stoichiometric Analysis</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-400">Molar ratio: <span className="text-white font-mono">2H₂ : 1O₂</span></p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-400">H₂ ÷ 2 = <span className="text-blue-400 font-mono">{(h2Moles / 2).toFixed(1)}</span></p>
              <p className="text-slate-400">O₂ ÷ 1 = <span className="text-green-400 font-mono">{(o2Moles / 1).toFixed(1)}</span></p>
            </div>
            <div className={`p-3 rounded-lg border ${calc.limitingIsH2 ? 'border-blue-500/50 bg-blue-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
              <p className="text-white text-xs font-bold uppercase">Limiting reagent: {calc.limitingIsH2 ? 'H₂' : 'O₂'}</p>
              <p className="text-slate-400 text-xs mt-1">Smallest ratio = {Math.min(h2Moles / 2, o2Moles / 1).toFixed(1)}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
              <p className="text-amber-400 text-xs font-bold uppercase">Theoretical Yield</p>
              <p className="text-white text-lg font-mono">{calc.h2oProduced.toFixed(1)} mol H₂O</p>
              <p className="text-slate-400 text-xs mt-1">= {(calc.h2oProduced * 18).toFixed(1)} g <span className="text-slate-500">(M = 18 g/mol)</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
