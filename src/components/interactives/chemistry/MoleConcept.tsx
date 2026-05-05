/**
 * MoleConcept.tsx
 * Chemistry interactive: The Mole Concept and Stoichiometry
 * Curriculum: GES Elective Chemistry, Cambridge IGCSE/A-Level, IB DP Topic 1, NGSS HS-PS1-7
 */

import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, Calculator, Beaker, Globe, Target, GraduationCap,
  ChevronRight, RotateCcw, CheckCircle2, XCircle, ArrowRight, Play
} from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'visualiser' | 'calculator' | 'stoichiometry' | 'ghana-context' | 'quiz';

// ─── Element data ────────────────────────────────────────────────────────────

interface ElementData {
  symbol: string;
  name: string;
  ar: number;
  state: 'solid' | 'liquid' | 'gas';
  color: string;
}

const ELEMENTS: Record<string, ElementData> = {
  H: { symbol: 'H', name: 'Hydrogen', ar: 1, state: 'gas', color: '#60a5fa' },
  He: { symbol: 'He', name: 'Helium', ar: 4, state: 'gas', color: '#a78bfa' },
  C: { symbol: 'C', name: 'Carbon', ar: 12, state: 'solid', color: '#9ca3af' },
  N: { symbol: 'N', name: 'Nitrogen', ar: 14, state: 'gas', color: '#34d399' },
  O: { symbol: 'O', name: 'Oxygen', ar: 16, state: 'gas', color: '#f87171' },
  Na: { symbol: 'Na', name: 'Sodium', ar: 23, state: 'solid', color: '#fbbf24' },
  Mg: { symbol: 'Mg', name: 'Magnesium', ar: 24, state: 'solid', color: '#6ee7b7' },
  Al: { symbol: 'Al', name: 'Aluminium', ar: 27, state: 'solid', color: '#d1d5db' },
  S: { symbol: 'S', name: 'Sulfur', ar: 32, state: 'solid', color: '#fde68a' },
  Cl: { symbol: 'Cl', name: 'Chlorine', ar: 35.5, state: 'gas', color: '#86efac' },
  K: { symbol: 'K', name: 'Potassium', ar: 39, state: 'solid', color: '#c084fc' },
  Ca: { symbol: 'Ca', name: 'Calcium', ar: 40, state: 'solid', color: '#67e8f9' },
  Fe: { symbol: 'Fe', name: 'Iron', ar: 56, state: 'solid', color: '#fb923c' },
  Cu: { symbol: 'Cu', name: 'Copper', ar: 63.5, state: 'solid', color: '#f97316' },
  Zn: { symbol: 'Zn', name: 'Zinc', ar: 65, state: 'solid', color: '#94a3b8' },
  Au: { symbol: 'Au', name: 'Gold', ar: 197, state: 'solid', color: '#fcd34d' },
};

// Parse a chemical formula and return { symbol: count } map
function parseFormula(formula: string): Record<string, number> {
  const result: Record<string, number> = {};
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  while ((match = regex.exec(formula)) !== null) {
    const sym = match[1];
    const count = parseInt(match[2] || '1', 10);
    result[sym] = (result[sym] || 0) + count;
  }
  return result;
}

function calcMolarMass(formula: string): number {
  const parts = parseFormula(formula);
  return Object.entries(parts).reduce((sum, [sym, count]) => {
    return sum + (ELEMENTS[sym]?.ar ?? 0) * count;
  }, 0);
}

// ─── Preset problems ─────────────────────────────────────────────────────────

interface Problem {
  id: string;
  label: string;
  given: { n?: number; m?: number; M?: number };
  solve: 'n' | 'm' | 'M';
  formula?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  context?: string;
}

const PRESET_PROBLEMS: Problem[] = [
  { id: 'p1', label: 'Find mass of 2 mol NaOH', given: { n: 2, M: 40 }, solve: 'm', formula: 'NaOH', difficulty: 'easy', context: 'WAEC style' },
  { id: 'p2', label: 'Find moles in 44 g CO₂', given: { m: 44, M: 44 }, solve: 'n', formula: 'CO2', difficulty: 'easy' },
  { id: 'p3', label: 'Find molar mass (0.5 mol = 20 g)', given: { n: 0.5, m: 20 }, solve: 'M', difficulty: 'medium' },
  { id: 'p4', label: 'Mass of 0.25 mol CaCO₃', given: { n: 0.25, M: 100 }, solve: 'm', formula: 'CaCO3', difficulty: 'medium', context: 'Ghana cement' },
  { id: 'p5', label: 'Moles in 5.4 g Al', given: { m: 5.4, M: 27 }, solve: 'n', formula: 'Al', difficulty: 'hard', context: 'A-Level' },
  { id: 'p6', label: 'Molecules in 18 g H₂O', given: { m: 18, M: 18 }, solve: 'n', formula: 'H2O', difficulty: 'hard', context: 'IB extension' },
];

// ─── Equations ───────────────────────────────────────────────────────────────

interface Equation {
  id: string;
  name: string;
  balanced: string;
  reactants: { formula: string; coeff: number }[];
  products: { formula: string; coeff: number }[];
  context: string;
}

const EQUATIONS: Equation[] = [
  {
    id: 'haber', name: 'Haber Process',
    balanced: 'N₂ + 3H₂ → 2NH₃',
    reactants: [{ formula: 'N2', coeff: 1 }, { formula: 'H2', coeff: 3 }],
    products: [{ formula: 'NH3', coeff: 2 }],
    context: 'Industrial production of ammonia for fertilisers'
  },
  {
    id: 'neutralisation', name: 'Neutralisation',
    balanced: 'NaOH + HCl → NaCl + H₂O',
    reactants: [{ formula: 'NaOH', coeff: 1 }, { formula: 'HCl', coeff: 1 }],
    products: [{ formula: 'NaCl', coeff: 1 }, { formula: 'H2O', coeff: 1 }],
    context: 'Acid-base reaction producing salt and water'
  },
  {
    id: 'methane', name: 'Combustion of Methane',
    balanced: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactants: [{ formula: 'CH4', coeff: 1 }, { formula: 'O2', coeff: 2 }],
    products: [{ formula: 'CO2', coeff: 1 }, { formula: 'H2O', coeff: 2 }],
    context: 'Burning natural gas (LPG cylinders in Ghana)'
  },
  {
    id: 'alumina', name: 'Electrolysis of Al₂O₃',
    balanced: '2Al₂O₃ → 4Al + 3O₂',
    reactants: [{ formula: 'Al2O3', coeff: 2 }],
    products: [{ formula: 'Al', coeff: 4 }, { formula: 'O2', coeff: 3 }],
    context: 'Aluminium smelting (Valco, Tema)'
  },
];

// ─── Ghana context cards ──────────────────────────────────────────────────────

const GHANA_CARDS = [
  {
    id: 'cement',
    title: 'Cement Production — Tema',
    icon: '🏭',
    color: '#94a3b8',
    equation: 'CaCO₃ → CaO + CO₂',
    context: 'Diamond Cement and CIMAF Ghana decompose limestone (CaCO₃) in kilns to produce quicklime (CaO) for cement. Every mole of CaCO₃ (100 g) releases 1 mole of CO₂ (44 g).',
    problem: 'If 500 g of CaCO₃ is heated, how many moles of CO₂ are produced?',
    solution: 'n(CaCO₃) = 500/100 = 5 mol. By 1:1 ratio, n(CO₂) = 5 mol.',
    answer: '5 mol CO₂'
  },
  {
    id: 'gold',
    title: 'Gold Mining — Obuasi',
    icon: '⛏️',
    color: '#fcd34d',
    equation: 'Au³⁺ + 3e⁻ → Au',
    context: 'AngloGold Ashanti at Obuasi uses electrochemistry to refine gold. The mole concept helps calculate yields. Gold (Au) has Ar = 197 g/mol.',
    problem: 'Calculate the mass of 0.05 mol of gold.',
    solution: 'm = n × M = 0.05 × 197 = 9.85 g',
    answer: '9.85 g'
  },
  {
    id: 'fertiliser',
    title: 'Fertiliser Production',
    icon: '🌾',
    color: '#86efac',
    equation: 'NH₃ + HNO₃ → NH₄NO₃',
    context: 'Ghana imports ammonium nitrate (NH₄NO₃, M = 80 g/mol) for fertilising cocoa and maize farms. Understanding moles helps farmers calculate the correct dosage per hectare.',
    problem: 'How many moles are in 200 g of NH₄NO₃?',
    solution: 'n = m/M = 200/80 = 2.5 mol',
    answer: '2.5 mol'
  },
  {
    id: 'soap',
    title: 'Soap Making — Palm Oil',
    icon: '🧼',
    color: '#fde68a',
    equation: 'Fat + NaOH → Soap + Glycerol',
    context: 'Ghana\'s palm oil industry uses saponification to make soap. NaOH (caustic soda, M = 40 g/mol) is a key reagent. Knowing moles ensures the correct ratio of fat to NaOH.',
    problem: 'What mass of NaOH is needed for 2.5 mol?',
    solution: 'm = n × M = 2.5 × 40 = 100 g',
    answer: '100 g NaOH'
  },
];

// ─── Quiz questions ───────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'mq1',
    question: "What is Avogadro's constant?",
    type: 'multiple-choice',
    options: ['6.02 × 10²¹', '6.02 × 10²³', '6.02 × 10²⁵', '3.01 × 10²³'],
    correctAnswer: '6.02 × 10²³',
    explanation: "Avogadro's constant (Nₐ = 6.02 × 10²³) is the number of particles in one mole of any substance."
  },
  {
    id: 'mq2',
    question: '0.5 mol of CaCO₃ (M = 100 g/mol) has mass:',
    type: 'multiple-choice',
    options: ['50 g', '100 g', '25 g', '200 g'],
    correctAnswer: '50 g',
    explanation: 'm = n × M = 0.5 × 100 = 50 g'
  },
  {
    id: 'mq3',
    question: 'In 2H₂ + O₂ → 2H₂O, the mole ratio of H₂ to H₂O is:',
    type: 'multiple-choice',
    options: ['1:2', '2:1', '1:1', '2:3'],
    correctAnswer: '1:1',
    explanation: '2 mol H₂ produces 2 mol H₂O — ratio 2:2 simplifies to 1:1.'
  },
  {
    id: 'mq4',
    question: 'What is the molar mass of CO₂?',
    type: 'multiple-choice',
    options: ['28 g/mol', '44 g/mol', '32 g/mol', '22 g/mol'],
    correctAnswer: '44 g/mol',
    explanation: 'C (12) + 2 × O (16) = 12 + 32 = 44 g/mol'
  },
  {
    id: 'mq5',
    question: 'The molar volume of any gas at RTP is:',
    type: 'multiple-choice',
    options: ['22.4 dm³', '24 dm³', '12 dm³', '48 dm³'],
    correctAnswer: '24 dm³',
    explanation: 'At Room Temperature and Pressure (RTP, 25°C, 1 atm), 1 mole of any gas occupies 24 dm³ (24,000 cm³).'
  },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function MoleConcept() {
  const [viewMode, setViewMode] = useState<ViewMode>('visualiser');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'visualiser', label: 'Visualiser', icon: <Eye size={14} /> },
    { key: 'calculator', label: 'Calculator', icon: <Calculator size={14} /> },
    { key: 'stoichiometry', label: 'Stoichiometry', icon: <Beaker size={14} /> },
    { key: 'ghana-context', label: 'Ghana', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <Target size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      {/* Mode tabs */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            aria-label={`Switch to ${label} mode`}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'visualiser' && <VisualiserMode />}
            {viewMode === 'calculator' && <CalculatorMode />}
            {viewMode === 'stoichiometry' && <StoichiometryMode />}
            {viewMode === 'ghana-context' && <GhanaContextMode />}
            {viewMode === 'quiz' && (
              <div className="max-w-xl mx-auto">
                <QuizMode questions={QUIZ_QUESTIONS} title="Mole Concept Quiz" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* WAEC exam note */}
      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · Cambridge · IB · </span>
        WAEC commonly asks: (1) calculate moles from mass, (2) use molar ratios in balanced equations, (3) identify the limiting reagent.
        Always show working: state formula → substitute values → give answer with units.
      </div>
    </div>
  );
}

// ─── Visualiser Mode ──────────────────────────────────────────────────────────

function VisualiserMode() {
  const [elementSym, setElementSym] = useState('Ca');
  const [formula, setFormula] = useState('H2O');
  const [formulaError, setFormulaError] = useState('');
  const [showAvogadro, setShowAvogadro] = useState(false);

  const element = ELEMENTS[elementSym];
  const formulaParts = parseFormula(formula);
  const totalMM = Object.entries(formulaParts).reduce((sum, [sym, count]) => {
    return sum + (ELEMENTS[sym]?.ar ?? 0) * count;
  }, 0);

  const handleFormulaChange = (val: string) => {
    setFormula(val);
    const parts = parseFormula(val);
    const unknown = Object.keys(parts).find(s => !ELEMENTS[s]);
    setFormulaError(unknown ? `Unknown element: ${unknown}` : '');
  };

  const presetFormulas = ['H2O', 'NaCl', 'CaCO3', 'C6H12O6', 'NH4NO3', 'NaOH'];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Element selector */}
        <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
          <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-4">Element Explorer</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(ELEMENTS).map(sym => (
              <button
                key={sym}
                onClick={() => setElementSym(sym)}
                style={{ borderColor: elementSym === sym ? ELEMENTS[sym].color : undefined }}
                className={`w-10 h-10 rounded-lg text-xs font-bold font-mono border-2 transition-all ${
                  elementSym === sym ? 'text-white scale-110' : 'border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
          {element && (
            <motion.div
              key={elementSym}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/40 rounded-xl p-4 border border-slate-800"
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-black text-black shadow-lg"
                  style={{ backgroundColor: element.color }}
                >
                  {element.symbol}
                </div>
                <div>
                  <div className="text-white font-bold">{element.name}</div>
                  <div className="text-slate-400 text-sm">Ar = {element.ar}</div>
                  <div className="text-slate-500 text-xs capitalize">{element.state}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                1 mole = <span className="text-brand-accent font-mono font-bold">{element.ar} g</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Molar mass calculator */}
        <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
          <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Compound Molar Mass</h3>
          <div className="flex gap-2 mb-3">
            <input
              value={formula}
              onChange={e => handleFormulaChange(e.target.value)}
              placeholder="e.g. H2O"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-accent focus:outline-none"
              aria-label="Chemical formula input"
            />
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {presetFormulas.map(f => (
              <button
                key={f}
                onClick={() => handleFormulaChange(f)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  formula === f ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {formulaError ? (
            <div className="text-red-400 text-xs">{formulaError}</div>
          ) : totalMM > 0 ? (
            <motion.div key={formula} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {Object.entries(formulaParts).map(([sym, count]) => {
                const el = ELEMENTS[sym];
                if (!el) return null;
                return (
                  <div key={sym} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-black"
                      style={{ backgroundColor: el.color }}
                    >
                      {sym}
                    </div>
                    <span className="text-slate-400 font-mono">{count} × {el.ar}</span>
                    <span className="text-white font-mono ml-auto">{count * el.ar} g/mol</span>
                  </div>
                );
              })}
              <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                <span className="text-slate-400 text-xs uppercase tracking-widest">Molar Mass</span>
                <span className="text-2xl font-mono font-black text-brand-accent">{totalMM.toFixed(1)} g/mol</span>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Avogadro visualiser */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Avogadro's Number in Context</h3>
          <button
            onClick={() => setShowAvogadro(!showAvogadro)}
            className="text-xs text-brand-accent hover:text-white transition-colors"
          >
            {showAvogadro ? 'Hide' : 'Show'} examples
          </button>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl font-mono font-black text-yellow-400">6.02 × 10²³</div>
          <div className="text-slate-400 text-sm">particles per mole</div>
        </div>
        <AnimatePresence>
          {showAvogadro && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {[
                  { icon: '🌾', text: '1 mole of rice grains would cover Ghana\'s surface 10,000 m deep' },
                  { icon: '⏱️', text: 'If you counted 1 per second, it would take 19 million times the age of the universe' },
                  { icon: '💧', text: '18 g of water contains 6.02×10²³ H₂O molecules' },
                  { icon: '🇬🇭', text: 'Ghana\'s entire population (32M) × Avogadro = still much less than 1 mole' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-slate-800">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Calculator Mode ──────────────────────────────────────────────────────────

function CalculatorMode() {
  type Solve = 'n' | 'm' | 'M';
  const [solve, setSolve] = useState<Solve>('m');
  const [inputs, setInputs] = useState<Record<string, string>>({ n: '', m: '', M: '' });
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const TRIANGLE = [
    { key: 'n' as Solve, label: 'n (moles)', unit: 'mol', color: '#22d3ee' },
    { key: 'm' as Solve, label: 'm (mass)', unit: 'g', color: '#f87171' },
    { key: 'M' as Solve, label: 'M (molar mass)', unit: 'g/mol', color: '#4ade80' },
  ];

  const calculate = () => {
    const n = parseFloat(inputs.n);
    const m = parseFloat(inputs.m);
    const M = parseFloat(inputs.M);
    const newSteps: string[] = [];

    if (solve === 'n' && !isNaN(m) && !isNaN(M) && M !== 0) {
      const val = m / M;
      newSteps.push('Formula: n = m ÷ M');
      newSteps.push(`Substituting: n = ${m} ÷ ${M}`);
      newSteps.push(`n = ${val.toFixed(4)} mol`);
      setResult(val);
    } else if (solve === 'm' && !isNaN(n) && !isNaN(M)) {
      const val = n * M;
      newSteps.push('Formula: m = n × M');
      newSteps.push(`Substituting: m = ${n} × ${M}`);
      newSteps.push(`m = ${val.toFixed(2)} g`);
      setResult(val);
    } else if (solve === 'M' && !isNaN(m) && !isNaN(n) && n !== 0) {
      const val = m / n;
      newSteps.push('Formula: M = m ÷ n');
      newSteps.push(`Substituting: M = ${m} ÷ ${n}`);
      newSteps.push(`M = ${val.toFixed(2)} g/mol`);
      setResult(val);
    } else {
      setResult(null);
      setSteps(['Please fill in the two known values.']);
      return;
    }
    setSteps(newSteps);
  };

  const loadProblem = (prob: Problem) => {
    setSelectedProblem(prob);
    setSolve(prob.solve);
    const newInputs: Record<string, string> = { n: '', m: '', M: '' };
    if (prob.given.n !== undefined) newInputs.n = String(prob.given.n);
    if (prob.given.m !== undefined) newInputs.m = String(prob.given.m);
    if (prob.given.M !== undefined) newInputs.M = String(prob.given.M);
    setInputs(newInputs);
    setResult(null);
    setSteps([]);
    setShowSolution(false);
  };

  const solveInfo = TRIANGLE.find(t => t.key === solve);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Triangle selector */}
        <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
          <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-4">Mole Triangle — Select What to Find</h3>
          <div className="space-y-3">
            {TRIANGLE.map(({ key, label, unit, color }) => (
              <div key={key} className="flex items-center gap-3">
                <button
                  onClick={() => { setSolve(key); setResult(null); setSteps([]); }}
                  style={{ borderColor: solve === key ? color : undefined }}
                  className={`flex-none w-12 h-12 rounded-xl font-mono font-bold text-sm border-2 transition-all ${
                    solve === key ? 'text-white scale-105' : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  aria-label={`Solve for ${label}`}
                >
                  {key}
                </button>
                <div className="flex-1">
                  {solve === key ? (
                    <div className="text-xs text-slate-500 italic">← Solving for this</div>
                  ) : (
                    <input
                      type="number"
                      value={inputs[key]}
                      onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`Enter ${label} (${unit})`}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-accent focus:outline-none"
                      aria-label={`Input for ${label}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={calculate}
            className="w-full mt-4 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all"
          >
            Calculate {solve === 'n' ? 'Moles' : solve === 'm' ? 'Mass' : 'Molar Mass'}
          </button>
        </div>

        {/* Steps & result */}
        <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
          <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Step-by-Step Working</h3>
          {steps.length > 0 ? (
            <div className="space-y-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`p-3 rounded-xl border font-mono text-sm ${
                    i === steps.length - 1 && result !== null
                      ? 'bg-green-500/10 border-green-500/30 text-green-400 font-bold'
                      : 'bg-black/40 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 mr-2">{i + 1}.</span> {step}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm text-center py-8">
              Fill in two values and click Calculate to see step-by-step working.
            </div>
          )}
        </div>
      </div>

      {/* Preset problems */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Practice Problems</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_PROBLEMS.map(prob => (
            <button
              key={prob.id}
              onClick={() => loadProblem(prob)}
              className={`p-3 rounded-xl border text-left transition-all hover:border-brand-accent/50 ${
                selectedProblem?.id === prob.id ? 'border-brand-accent bg-brand-accent/10' : 'border-slate-700 bg-black/30'
              }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                prob.difficulty === 'easy' ? 'text-green-400' : prob.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{prob.difficulty}{prob.context ? ` · ${prob.context}` : ''}</div>
              <div className="text-white text-xs font-medium">{prob.label}</div>
              {prob.formula && <div className="text-slate-500 text-[10px] font-mono mt-1">{prob.formula}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stoichiometry Mode ───────────────────────────────────────────────────────

function StoichiometryMode() {
  const [selectedEq, setSelectedEq] = useState<Equation>(EQUATIONS[0]);
  const [molInput, setMolInput] = useState('');
  const [inputReactant, setInputReactant] = useState('');
  const [results, setResults] = useState<{ species: string; moles: number; mass: number }[]>([]);
  const [limiting, setLimiting] = useState('');
  const [r1, setR1] = useState('');
  const [r2, setR2] = useState('');

  const allSpecies = [...selectedEq.reactants, ...selectedEq.products];

  const calculate = () => {
    const moles = parseFloat(molInput);
    const ref = allSpecies.find(s => s.formula === inputReactant);
    if (!ref || isNaN(moles)) return;
    const refMoles = moles / ref.coeff;
    const res = allSpecies.map(s => ({
      species: s.formula,
      moles: refMoles * s.coeff,
      mass: refMoles * s.coeff * calcMolarMass(s.formula),
    }));
    setResults(res);
  };

  const calcLimiting = () => {
    const mol1 = parseFloat(r1);
    const mol2 = parseFloat(r2);
    if (selectedEq.reactants.length < 2 || isNaN(mol1) || isNaN(mol2)) return;
    const r1Spec = selectedEq.reactants[0];
    const r2Spec = selectedEq.reactants[1];
    const ratio = r1Spec.coeff / r2Spec.coeff;
    const needed2 = mol1 / ratio;
    setLimiting(mol2 < needed2 ? r2Spec.formula : r1Spec.formula);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Equation selector */}
      <div className="flex flex-wrap gap-2">
        {EQUATIONS.map(eq => (
          <button
            key={eq.id}
            onClick={() => { setSelectedEq(eq); setResults([]); setLimiting(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              selectedEq.id === eq.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {eq.name}
          </button>
        ))}
      </div>

      {/* Equation display */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <div className="text-center text-2xl font-mono font-bold text-white mb-2">{selectedEq.balanced}</div>
        <div className="text-center text-slate-400 text-sm">{selectedEq.context}</div>
        
        {/* Particle visualiser */}
        <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
          {selectedEq.reactants.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-500 text-xl">+</span>}
              <div className="text-center">
                <div className="flex gap-1 justify-center mb-1">
                  {Array.from({ length: s.coeff }).map((_, j) => (
                    <motion.div
                      key={j}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 }}
                      className="w-8 h-8 rounded-full bg-red-500/30 border-2 border-red-500 flex items-center justify-center text-[9px] font-bold text-red-300"
                    >
                      {s.formula.substring(0, 2)}
                    </motion.div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">{s.coeff} mol</div>
              </div>
            </div>
          ))}
          <span className="text-brand-accent text-2xl">→</span>
          {selectedEq.products.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-500 text-xl">+</span>}
              <div className="text-center">
                <div className="flex gap-1 justify-center mb-1">
                  {Array.from({ length: s.coeff }).map((_, j) => (
                    <motion.div
                      key={j}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 + 0.5 }}
                      className="w-8 h-8 rounded-full bg-green-500/30 border-2 border-green-500 flex items-center justify-center text-[9px] font-bold text-green-300"
                    >
                      {s.formula.substring(0, 2)}
                    </motion.div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">{s.coeff} mol</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mole ratio calculator */}
        <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
          <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-4">Mole Ratio Calculator</h3>
          <div className="space-y-3">
            <select
              value={inputReactant}
              onChange={e => setInputReactant(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-accent focus:outline-none"
              aria-label="Select known species"
            >
              <option value="">Select known species</option>
              {allSpecies.map(s => (
                <option key={s.formula} value={s.formula}>{s.formula} (coeff: {s.coeff})</option>
              ))}
            </select>
            <input
              type="number"
              value={molInput}
              onChange={e => setMolInput(e.target.value)}
              placeholder="Enter moles"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-accent focus:outline-none"
              aria-label="Moles input"
            />
            <button onClick={calculate} className="w-full py-2 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all">
              Calculate Ratios
            </button>
          </div>
          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              {results.map(r => (
                <div key={r.species} className="flex justify-between items-center p-2 bg-black/40 rounded-lg border border-slate-800">
                  <span className="font-mono text-sm text-white">{r.species}</span>
                  <span className="font-mono text-xs text-brand-accent">{r.moles.toFixed(3)} mol ({r.mass.toFixed(1)} g)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Limiting reagent */}
        {selectedEq.reactants.length >= 2 && (
          <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Limiting Reagent</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-500 mb-1">{selectedEq.reactants[0].formula} (mol)</div>
                <input type="number" value={r1} onChange={e => setR1(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-accent focus:outline-none"
                  aria-label="Reactant 1 moles" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 mb-1">{selectedEq.reactants[1].formula} (mol)</div>
                <input type="number" value={r2} onChange={e => setR2(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-accent focus:outline-none"
                  aria-label="Reactant 2 moles" />
              </div>
              <button onClick={calcLimiting} className="w-full py-2 bg-orange-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-400 transition-all">
                Find Limiting Reagent
              </button>
            </div>
            {limiting && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Limiting Reagent</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{limiting}</div>
                <div className="text-xs text-slate-400 mt-1">This reagent is completely consumed first</div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Ghana Context Mode ───────────────────────────────────────────────────────

function GhanaContextMode() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-light text-white">Mole Concept in <span className="text-brand-accent font-medium">Ghana</span></h2>
        <p className="text-slate-500 text-sm mt-1">Real-world applications across Ghanaian industries</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GHANA_CARDS.map(card => (
          <motion.div
            key={card.id}
            className="bg-slate-900/60 rounded-2xl border border-brand-border overflow-hidden"
          >
            <div
              className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
              onClick={() => setExpanded(expanded === card.id ? null : card.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{card.icon}</span>
                <div>
                  <h3 className="text-white font-bold">{card.title}</h3>
                  <div className="font-mono text-xs" style={{ color: card.color }}>{card.equation}</div>
                </div>
                <ChevronRight
                  size={18}
                  className={`ml-auto text-slate-500 transition-transform ${expanded === card.id ? 'rotate-90' : ''}`}
                />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{card.context}</p>
            </div>
            <AnimatePresence>
              {expanded === card.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-slate-800"
                >
                  <div className="p-5 space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-2">Problem</div>
                      <p className="text-white text-sm">{card.problem}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-2">Solution</div>
                      <p className="text-slate-300 text-sm font-mono">{card.solution}</p>
                      <div className="mt-2 text-green-400 font-bold text-sm">Answer: {card.answer}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
