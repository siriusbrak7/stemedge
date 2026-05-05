import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'calculate' | 'quiz';

const BOND_TABLE: Record<string, number> = {
  'H-H': 436, 'Cl-Cl': 242, 'H-Cl': 431, 'N≡N': 945, 'N-H': 391,
  'O=O': 498, 'O-H': 463, 'C-H': 413, 'C=O': 805, 'C-O': 358,
  'C-C': 347, 'C=C': 614, 'C≡C': 839, 'H-F': 568, 'H-Br': 366,
  'Br-Br': 193, 'F-F': 158, 'H-I': 298, 'I-I': 151,
};

interface Reaction {
  name: string;
  equation: string;
  broken: { bond: string; count: number }[];
  formed: { bond: string; count: number }[];
}

const REACTIONS: Reaction[] = [
  {
    name: 'Hydrogen + Chlorine',
    equation: 'H₂ + Cl₂ → 2HCl',
    broken: [{ bond: 'H-H', count: 1 }, { bond: 'Cl-Cl', count: 1 }],
    formed: [{ bond: 'H-Cl', count: 2 }],
  },
  {
    name: 'Haber Process (Ammonia)',
    equation: 'N₂ + 3H₂ → 2NH₃',
    broken: [{ bond: 'N≡N', count: 1 }, { bond: 'H-H', count: 3 }],
    formed: [{ bond: 'N-H', count: 6 }],
  },
  {
    name: 'Combustion of Methane',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    broken: [{ bond: 'C-H', count: 4 }, { bond: 'O=O', count: 2 }],
    formed: [{ bond: 'C=O', count: 2 }, { bond: 'O-H', count: 4 }],
  },
];

const QUIZ: QuizQuestion[] = [
  { id: 'eb1', question: 'Breaking chemical bonds is:', type: 'multiple-choice', options: ['Endothermic', 'Exothermic', 'Isothermal', 'Impossible'], correctAnswer: 'Endothermic', explanation: 'Breaking bonds always requires energy input (endothermic).' },
  { id: 'eb2', question: 'Forming chemical bonds is:', type: 'multiple-choice', options: ['Endothermic', 'Exothermic', 'Isothermal', 'Explosive'], correctAnswer: 'Exothermic', explanation: 'Forming bonds always releases energy (exothermic).' },
  { id: 'eb3', question: 'A reaction is exothermic overall if:', type: 'multiple-choice', options: ['More energy absorbed than released', 'More energy released than absorbed', 'ΔH is positive', 'No bonds are broken'], correctAnswer: 'More energy released than absorbed', explanation: 'Energy released forming products > energy absorbed breaking reactants → ΔH negative (exothermic).' },
  { id: 'eb4', question: 'The bond enthalpy of N≡N is 945 kJ/mol. This means:', type: 'multiple-choice', options: ['N₂ is very reactive', 'N≡N is very hard to break', 'N₂ has low energy', 'Nitrogen is toxic'], correctAnswer: 'N≡N is very hard to break', explanation: 'A high bond enthalpy means lots of energy is needed to break the bond. The triple bond in N₂ makes it extremely stable and unreactive.' },
  { id: 'eb5', question: 'In CH₄ + 2O₂ → CO₂ + 2H₂O, how many C-H bonds are broken?', type: 'multiple-choice', options: ['1', '2', '4', '8'], correctAnswer: '4', explanation: 'Methane (CH₄) has 4 C-H bonds, all of which must be broken in combustion.' },
];

export default function EnergyBonds() {
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20 flex-wrap">
        {(['learn', 'simulation', 'calculate', 'quiz'] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === m ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>{m}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'learn' && <LearnPanel />}
            {viewMode === 'simulation' && <BondSim />}
            {viewMode === 'calculate' && <CalcMode />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Bond Energy Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── LEARN PANEL ── */
function LearnPanel() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is Bond Enthalpy?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          <strong className="text-white">Bond enthalpy</strong> (or bond energy) is the amount of energy required to break <strong className="text-red-400">one mole</strong> of a particular covalent bond in the gaseous state. It is always a positive value because breaking bonds is an <strong className="text-red-400">endothermic</strong> process (energy must be absorbed).
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Conversely, <strong className="text-green-400">forming</strong> bonds is always <strong className="text-green-400">exothermic</strong> — energy is released when atoms come together to form a new bond.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center">
            <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Breaking Bonds</p>
            <p className="text-2xl">💥</p>
            <p className="text-red-300 text-xs mt-1">Endothermic (+ΔH)</p>
            <p className="text-slate-400 text-xs mt-1">Energy absorbed from surroundings</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-center">
            <p className="text-green-400 text-xs uppercase tracking-widest font-bold mb-2">Forming Bonds</p>
            <p className="text-2xl">🤝</p>
            <p className="text-green-300 text-xs mt-1">Exothermic (-ΔH)</p>
            <p className="text-slate-400 text-xs mt-1">Energy released to surroundings</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Calculating Overall ΔH</h3>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">ΔH = Σ(bonds broken) − Σ(bonds formed)</p>
        </div>
        <ul className="text-sm text-slate-300 space-y-2 pl-4 list-disc marker:text-brand-accent">
          <li>If <strong className="text-red-400">energy in &gt; energy out</strong> → ΔH is <strong className="text-red-400">positive</strong> → <strong>Endothermic</strong></li>
          <li>If <strong className="text-green-400">energy out &gt; energy in</strong> → ΔH is <strong className="text-green-400">negative</strong> → <strong>Exothermic</strong></li>
          <li>Bond enthalpies are <em>averages</em> because the exact energy depends on the molecular environment</li>
        </ul>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Bond Enthalpy Data Table</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {Object.entries(BOND_TABLE).map(([bond, energy]) => (
            <div key={bond} className="bg-[#0a0a1a] border border-slate-800 rounded-lg p-2 text-center">
              <p className="text-white font-mono text-sm">{bond}</p>
              <p className="text-brand-accent text-xs">{energy} kJ</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SIMULATION (3 reactions, step-through) ── */
function BondSim() {
  const [rxnIdx, setRxnIdx] = useState(0);
  const [step, setStep] = useState(0);
  const rxn = REACTIONS[rxnIdx];

  const energyIn = rxn.broken.reduce((s, b) => s + BOND_TABLE[b.bond] * b.count, 0);
  const energyOut = rxn.formed.reduce((s, b) => s + BOND_TABLE[b.bond] * b.count, 0);
  const deltaH = energyIn - energyOut;
  const isExothermic = deltaH > 0;

  const nextStep = () => setStep(s => (s + 1) % 4);
  const selectRxn = (i: number) => { setRxnIdx(i); setStep(0); };

  // SVG layout
  const reactantY = 200;
  const transitionY = 80;
  const productY = isExothermic ? 280 : 140;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        {/* Reaction Selector */}
        <div className="flex gap-2 flex-wrap justify-center">
          {REACTIONS.map((r, i) => (
            <button key={i} onClick={() => selectRxn(i)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${rxnIdx === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {r.name}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 500 400" className="w-full max-w-[480px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="400" fill="#0a0a1a" rx="16" />
          <text x="250" y="28" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{rxn.equation}</text>

          {/* Axes */}
          <line x1="50" y1="350" x2="450" y2="350" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="350" x2="50" y2="50" stroke="#475569" strokeWidth="2" />
          <text x="25" y="200" fill="#64748b" fontSize="10" transform="rotate(-90 25 200)" textAnchor="middle">Enthalpy</text>
          <text x="250" y="370" fill="#64748b" fontSize="10" textAnchor="middle">Reaction Progress</text>

          {/* Enthalpy Levels */}
          <line x1="70" y1={reactantY} x2="170" y2={reactantY} stroke="#3b82f6" strokeWidth="3" />
          <text x="120" y={reactantY + 15} fill="#3b82f6" fontSize="9" textAnchor="middle">Reactants</text>

          <line x1="195" y1={transitionY} x2="305" y2={transitionY} stroke="#fbbf24" strokeWidth="3" strokeDasharray="4 4" />
          <text x="250" y={transitionY - 8} fill="#fbbf24" fontSize="9" textAnchor="middle">Separated Atoms</text>

          <line x1="330" y1={productY} x2="430" y2={productY} stroke="#22c55e" strokeWidth="3" />
          <text x="380" y={productY + 15} fill="#22c55e" fontSize="9" textAnchor="middle">Products</text>

          {/* Curved path */}
          <path d={`M 120 ${reactantY} Q 200 ${transitionY - 20} 250 ${transitionY} Q 300 ${transitionY - 20} 380 ${productY}`}
            fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

          {/* Breaking arrow */}
          {step >= 1 && (
            <g>
              <motion.line x1="140" y1={reactantY} x2="140" y2={transitionY}
                stroke="#ef4444" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
              <polygon points={`135,${transitionY + 6} 140,${transitionY} 145,${transitionY + 6}`} fill="#ef4444" />
              <text x="100" y={(reactantY + transitionY) / 2} fill="#ef4444" fontSize="9" textAnchor="middle">+{energyIn}</text>
              <text x="100" y={(reactantY + transitionY) / 2 + 12} fill="#ef4444" fontSize="7" textAnchor="middle">kJ/mol</text>
            </g>
          )}

          {/* Forming arrow */}
          {step >= 2 && (
            <g>
              <motion.line x1="380" y1={transitionY} x2="380" y2={productY}
                stroke="#22c55e" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
              <polygon points={`375,${productY - 6} 380,${productY} 385,${productY - 6}`} fill="#22c55e" />
              <text x="420" y={(transitionY + productY) / 2} fill="#22c55e" fontSize="9" textAnchor="middle">-{energyOut}</text>
              <text x="420" y={(transitionY + productY) / 2 + 12} fill="#22c55e" fontSize="7" textAnchor="middle">kJ/mol</text>
            </g>
          )}

          {/* Net ΔH */}
          {step === 3 && (
            <g>
              <line x1="170" y1={reactantY} x2="430" y2={reactantY} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="410" y1={reactantY} x2="410" y2={productY} stroke="#3b82f6" strokeWidth="2" />
              <polygon points={isExothermic ? `405,${productY - 6} 410,${productY} 415,${productY - 6}` : `405,${productY + 6} 410,${productY} 415,${productY + 6}`} fill="#3b82f6" />
              <rect x="350" y={(reactantY + productY) / 2 - 12} width="120" height="24" fill="#0a0a1a" rx="4" />
              <text x="410" y={(reactantY + productY) / 2 + 4} fill={isExothermic ? '#22c55e' : '#ef4444'} fontSize="12" fontWeight="bold" textAnchor="middle">
                ΔH = {isExothermic ? '-' : '+'}{Math.abs(deltaH)} kJ/mol
              </text>
            </g>
          )}
        </svg>

        <button onClick={nextStep} className="px-6 py-3 bg-brand-accent text-black rounded-xl text-sm font-bold uppercase hover:bg-brand-accent/80 transition-all shadow-lg shadow-brand-accent/20">
          {step === 0 ? '① Break Bonds' : step === 1 ? '② Form Bonds' : step === 2 ? '③ Calculate ΔH' : 'Reset'}
        </button>
      </div>

      {/* Info Panel */}
      <div className="lg:w-[340px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Step-by-Step</h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg border transition-all ${step >= 1 ? 'border-red-500/50 bg-red-500/10' : 'border-slate-800 bg-slate-800/20'}`}>
              <h4 className="text-xs font-bold text-red-400 mb-1">1. Break Reactant Bonds</h4>
              <div className="text-xs text-slate-400 space-y-0.5">
                {rxn.broken.map((b, i) => (
                  <p key={i}>{b.count} × {b.bond} = {b.count} × {BOND_TABLE[b.bond]} = <b>{b.count * BOND_TABLE[b.bond]}</b> kJ</p>
                ))}
                <p className="text-red-300 font-bold mt-1">Total In = +{energyIn} kJ</p>
              </div>
            </div>
            <div className={`p-3 rounded-lg border transition-all ${step >= 2 ? 'border-green-500/50 bg-green-500/10' : 'border-slate-800 bg-slate-800/20'}`}>
              <h4 className="text-xs font-bold text-green-400 mb-1">2. Form Product Bonds</h4>
              <div className="text-xs text-slate-400 space-y-0.5">
                {rxn.formed.map((b, i) => (
                  <p key={i}>{b.count} × {b.bond} = {b.count} × {BOND_TABLE[b.bond]} = <b>{b.count * BOND_TABLE[b.bond]}</b> kJ</p>
                ))}
                <p className="text-green-300 font-bold mt-1">Total Out = -{energyOut} kJ</p>
              </div>
            </div>
          </div>
          {step === 3 && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`mt-4 p-4 rounded-xl border text-center ${isExothermic ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
              <p className="text-xs text-slate-300 uppercase tracking-widest mb-1">Net Enthalpy Change</p>
              <p className="text-2xl font-mono text-white">{isExothermic ? '-' : '+'}{Math.abs(deltaH)} <span className="text-sm">kJ/mol</span></p>
              <p className={`text-xs mt-1 ${isExothermic ? 'text-green-300' : 'text-red-300'}`}>
                This reaction is <b>{isExothermic ? 'EXOTHERMIC' : 'ENDOTHERMIC'}</b>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── CALCULATE MODE ── */
function CalcMode() {
  const [rxnIdx, setRxnIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const rxn = REACTIONS[rxnIdx];

  const energyIn = rxn.broken.reduce((s, b) => s + BOND_TABLE[b.bond] * b.count, 0);
  const energyOut = rxn.formed.reduce((s, b) => s + BOND_TABLE[b.bond] * b.count, 0);
  const correctDeltaH = energyIn - energyOut;
  const correctStr = (correctDeltaH > 0 ? '-' : '+') + Math.abs(correctDeltaH);

  const userNum = parseInt(userAnswer.replace(/[^0-9\-+]/g, ''));
  const isCorrect = submitted && (Math.abs(userNum - (-correctDeltaH)) < 5 || Math.abs(userNum + correctDeltaH) < 5);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex gap-2 flex-wrap justify-center">
        {REACTIONS.map((r, i) => (
          <button key={i} onClick={() => { setRxnIdx(i); setSubmitted(false); setUserAnswer(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${rxnIdx === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-2">Calculate ΔH for: <span className="text-brand-accent font-mono">{rxn.equation}</span></h3>
        <p className="text-slate-400 text-sm mb-4">Use the bond enthalpy values below. Identify which bonds break and form, then calculate the overall enthalpy change.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Bonds Broken (Reactants)</h4>
            {rxn.broken.map((b, i) => (
              <p key={i} className="text-sm text-slate-300">{b.count} × {b.bond} <span className="text-slate-500">({BOND_TABLE[b.bond]} kJ each)</span></p>
            ))}
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h4 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Bonds Formed (Products)</h4>
            {rxn.formed.map((b, i) => (
              <p key={i} className="text-sm text-slate-300">{b.count} × {b.bond} <span className="text-slate-500">({BOND_TABLE[b.bond]} kJ each)</span></p>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-300">Your ΔH =</label>
          <input type="text" value={userAnswer} onChange={e => { setUserAnswer(e.target.value); setSubmitted(false); }}
            placeholder="e.g. -185" className="bg-[#0a0a1a] border border-slate-700 rounded-lg px-4 py-2 text-white font-mono w-40 focus:border-brand-accent outline-none" />
          <span className="text-slate-500 text-sm">kJ/mol</span>
          <button onClick={() => setSubmitted(true)}
            className="px-4 py-2 bg-brand-accent text-black rounded-lg text-sm font-bold uppercase hover:bg-brand-accent/80">Check</button>
        </div>

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border ${isCorrect ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            {isCorrect ? (
              <p className="text-green-400 text-sm">✅ <b>Correct!</b> ΔH = {correctStr} kJ/mol. This reaction is <b>{correctDeltaH > 0 ? 'exothermic' : 'endothermic'}</b>.</p>
            ) : (
              <div className="text-red-300 text-sm space-y-1">
                <p>❌ Not quite. Let's work it out:</p>
                <p>Bonds broken: {rxn.broken.map(b => `${b.count}×${BOND_TABLE[b.bond]}`).join(' + ')} = <b>+{energyIn}</b> kJ</p>
                <p>Bonds formed: {rxn.formed.map(b => `${b.count}×${BOND_TABLE[b.bond]}`).join(' + ')} = <b>-{energyOut}</b> kJ</p>
                <p>ΔH = {energyIn} − {energyOut} = <b className="text-white">{correctStr} kJ/mol</b></p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
