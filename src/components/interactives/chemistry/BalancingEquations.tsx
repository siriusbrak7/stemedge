import { useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Atom, Tag, Globe, GraduationCap } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'balance' | 'conservation' | 'type-id' | 'ghana' | 'quiz';

interface Equation {
  id: string;
  display: string;
  reactants: { formula: string; atoms: Record<string, number> }[];
  products: { formula: string; atoms: Record<string, number> }[];
  coeffs: number[];
  type: string;
}

const EQUATIONS: Equation[] = [
  { id: 'e1', display: '_H₂ + _O₂ → _H₂O', reactants: [{ formula: 'H₂', atoms: { H: 2 } }, { formula: 'O₂', atoms: { O: 2 } }], products: [{ formula: 'H₂O', atoms: { H: 2, O: 1 } }], coeffs: [2, 1, 2], type: 'synthesis' },
  { id: 'e2', display: '_Fe + _O₂ → _Fe₂O₃', reactants: [{ formula: 'Fe', atoms: { Fe: 1 } }, { formula: 'O₂', atoms: { O: 2 } }], products: [{ formula: 'Fe₂O₃', atoms: { Fe: 2, O: 3 } }], coeffs: [4, 3, 2], type: 'synthesis' },
  { id: 'e3', display: '_Mg + _HCl → _MgCl₂ + _H₂', reactants: [{ formula: 'Mg', atoms: { Mg: 1 } }, { formula: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ formula: 'MgCl₂', atoms: { Mg: 1, Cl: 2 } }, { formula: 'H₂', atoms: { H: 2 } }], coeffs: [1, 2, 1, 1], type: 'single-replacement' },
  { id: 'e4', display: '_CH₄ + _O₂ → _CO₂ + _H₂O', reactants: [{ formula: 'CH₄', atoms: { C: 1, H: 4 } }, { formula: 'O₂', atoms: { O: 2 } }], products: [{ formula: 'CO₂', atoms: { C: 1, O: 2 } }, { formula: 'H₂O', atoms: { H: 2, O: 1 } }], coeffs: [1, 2, 1, 2], type: 'combustion' },
  { id: 'e5', display: '_CaCO₃ → _CaO + _CO₂', reactants: [{ formula: 'CaCO₃', atoms: { Ca: 1, C: 1, O: 3 } }], products: [{ formula: 'CaO', atoms: { Ca: 1, O: 1 } }, { formula: 'CO₂', atoms: { C: 1, O: 2 } }], coeffs: [1, 1, 1], type: 'decomposition' },
  { id: 'e6', display: '_Na + _Cl₂ → _NaCl', reactants: [{ formula: 'Na', atoms: { Na: 1 } }, { formula: 'Cl₂', atoms: { Cl: 2 } }], products: [{ formula: 'NaCl', atoms: { Na: 1, Cl: 1 } }], coeffs: [2, 1, 2], type: 'synthesis' },
  { id: 'e7', display: '_Al + _O₂ → _Al₂O₃', reactants: [{ formula: 'Al', atoms: { Al: 1 } }, { formula: 'O₂', atoms: { O: 2 } }], products: [{ formula: 'Al₂O₃', atoms: { Al: 2, O: 3 } }], coeffs: [4, 3, 2], type: 'synthesis' },
  { id: 'e8', display: '_Cu + _AgNO₃ → _Cu(NO₃)₂ + _Ag', reactants: [{ formula: 'Cu', atoms: { Cu: 1 } }, { formula: 'AgNO₃', atoms: { Ag: 1, N: 1, O: 3 } }], products: [{ formula: 'Cu(NO₃)₂', atoms: { Cu: 1, N: 2, O: 6 } }, { formula: 'Ag', atoms: { Ag: 1 } }], coeffs: [1, 2, 1, 2], type: 'single-replacement' },
  { id: 'e9', display: '_C₂H₆ + _O₂ → _CO₂ + _H₂O', reactants: [{ formula: 'C₂H₆', atoms: { C: 2, H: 6 } }, { formula: 'O₂', atoms: { O: 2 } }], products: [{ formula: 'CO₂', atoms: { C: 1, O: 2 } }, { formula: 'H₂O', atoms: { H: 2, O: 1 } }], coeffs: [2, 7, 4, 6], type: 'combustion' },
  { id: 'e10', display: '_KClO₃ → _KCl + _O₂', reactants: [{ formula: 'KClO₃', atoms: { K: 1, Cl: 1, O: 3 } }], products: [{ formula: 'KCl', atoms: { K: 1, Cl: 1 } }, { formula: 'O₂', atoms: { O: 2 } }], coeffs: [2, 2, 3], type: 'decomposition' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'be1', question: 'When balancing equations, we can only change:', type: 'multiple-choice', options: ['Subscripts', 'Coefficients', 'Elements', 'Products'], correctAnswer: 'Coefficients', explanation: 'We can only change coefficients (the numbers in front of formulas). Changing subscripts alters the chemical substance itself.' },
  { id: 'be2', question: 'The balanced equation for H₂ + O₂ → H₂O is:', type: 'multiple-choice', options: ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → 2H₂O', '2H₂ + 2O₂ → 2H₂O'], correctAnswer: '2H₂ + O₂ → 2H₂O', explanation: 'Left: 4H, 2O. Right: 4H, 2O. Balanced by placing coefficient 2 before H₂ and H₂O.' },
  { id: 'be3', question: 'Which type of reaction is: A + BC → AC + B?', type: 'multiple-choice', options: ['Synthesis', 'Decomposition', 'Single replacement', 'Combustion'], correctAnswer: 'Single replacement', explanation: 'One element (A) replaces another (B) in a compound. This is a single displacement/replacement reaction.' },
  { id: 'be4', question: 'The law of conservation of mass means:', type: 'multiple-choice', options: ['Mass can be created', 'Mass can be destroyed', 'Atoms on both sides must be equal', 'Volume is conserved'], correctAnswer: 'Atoms on both sides must be equal', explanation: 'In a balanced equation, the number of each type of atom on the reactant side equals the product side — mass is conserved.' },
  { id: 'be5', question: 'Decomposition of CaCO₃ produces:', type: 'multiple-choice', options: ['Ca and CO₂', 'CaO and C', 'CaO and CO₂', 'Ca and O₂'], correctAnswer: 'CaO and CO₂', explanation: 'Thermal decomposition: CaCO₃ → CaO + CO₂. This is used in cement production in Ghana.' },
  { id: 'be6', question: 'Combustion reactions always produce:', type: 'multiple-choice', options: ['Hydrogen and oxygen', 'Carbon dioxide and water', 'Metal oxide and hydrogen', 'Acid and base'], correctAnswer: 'Carbon dioxide and water', explanation: 'Complete combustion of hydrocarbons always produces CO₂ and H₂O. Incomplete combustion may produce CO or C (soot).' },
  { id: 'be7', question: 'In the equation 2Mg + O₂ → 2MgO, the coefficient of MgO is:', type: 'multiple-choice', options: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'The coefficient 2 before MgO means 2 formula units of magnesium oxide are produced from 2 Mg atoms and 1 O₂ molecule.' },
  { id: 'be8', question: 'Cocoa fermentation involves which type of reaction?', type: 'multiple-choice', options: ['Synthesis', 'Decomposition', 'Combustion', 'Single replacement'], correctAnswer: 'Decomposition', explanation: 'Cocoa fermentation involves decomposition of sugars by microorganisms into ethanol, lactic acid, and acetic acid.' },
];

function BalanceIt() {
  const [eqIndex, setEqIndex] = useState(0);
  const eq = EQUATIONS[eqIndex];
  const [userCoeffs, setUserCoeffs] = useState<number[]>(new Array(eq.coeffs.length).fill(1));
  const [solved, setSolved] = useState(false);

  const checkBalance = useCallback(() => {
    const isCorrect = userCoeffs.every((c, i) => c === eq.coeffs[i]);
    setSolved(isCorrect);
    return isCorrect;
  }, [userCoeffs, eq]);

  const nextEquation = () => {
    const next = (eqIndex + 1) % EQUATIONS.length;
    setEqIndex(next);
    setUserCoeffs(new Array(EQUATIONS[next].coeffs.length).fill(1));
    setSolved(false);
  };

  const getAtomCounts = () => {
    const counts: Record<string, { left: number; right: number }> = {};
    const allSpecies = [...eq.reactants, ...eq.products];
    const mid = eq.reactants.length;
    allSpecies.forEach((species, i) => {
      const coeff = userCoeffs[i] || 1;
      const side = i < mid ? 'left' : 'right';
      Object.entries(species.atoms).forEach(([atom, count]) => {
        if (!counts[atom]) counts[atom] = { left: 0, right: 0 };
        counts[atom][side] += coeff * count;
      });
    });
    return counts;
  };

  const atomCounts = getAtomCounts();

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Equation {eqIndex + 1}/{EQUATIONS.length}</span>
        <button onClick={nextEquation} className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:text-white transition-all">Next →</button>
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          {eq.display.split('→').map((side, sideIdx) => (
            <div key={sideIdx} className="flex items-center gap-2 flex-wrap">
              {sideIdx === 1 && <span className="text-brand-accent text-2xl font-bold mx-2">→</span>}
              {side.trim().split('+').map((term, termIdx) => {
                const globalIdx = sideIdx === 0 ? termIdx : eq.reactants.length + termIdx;
                return (
                  <div key={termIdx} className="flex items-center gap-1">
                    <button onClick={() => {
                      const newCoeffs = [...userCoeffs];
                      newCoeffs[globalIdx] = Math.max(1, newCoeffs[globalIdx] - 1);
                      setUserCoeffs(newCoeffs);
                      setSolved(false);
                    }}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-400 text-xs font-bold hover:text-white flex items-center justify-center"
                    >−</button>
                    <span className={`w-6 text-center font-mono font-bold ${userCoeffs[globalIdx] === eq.coeffs[globalIdx] ? 'text-green-400' : 'text-yellow-400'}`}>
                      {userCoeffs[globalIdx]}
                    </span>
                    <button onClick={() => {
                      const newCoeffs = [...userCoeffs];
                      newCoeffs[globalIdx] = Math.min(9, newCoeffs[globalIdx] + 1);
                      setUserCoeffs(newCoeffs);
                      setSolved(false);
                    }}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-400 text-xs font-bold hover:text-white flex items-center justify-center"
                    >+</button>
                    <span className="text-white text-sm font-mono">{term.trim().substring(1)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(atomCounts).map(([atom, counts]) => (
            <div key={atom} className="flex justify-between items-center px-3 py-1 bg-black/40 rounded-lg border border-slate-800">
              <span className="font-mono text-xs text-white">{atom}</span>
              <span className="font-mono text-xs">
                <span className={counts.left === counts.right ? 'text-green-400' : 'text-red-400'}>{counts.left}</span>
                <span className="text-slate-500 mx-1">|</span>
                <span className={counts.left === counts.right ? 'text-green-400' : 'text-red-400'}>{counts.right}</span>
              </span>
            </div>
          ))}
        </div>
        <button onClick={checkBalance} className="w-full py-2 bg-brand-accent text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all">Check Balance</button>
      </div>
      {solved && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-green-400 font-bold">
          ✓ Balanced! {eq.display.replace(/_/g, '').replace(/\s+/g, ' ')}
        </motion.div>
      )}
    </div>
  );
}

function ConservationOfMass() {
  const [selectedEq, setSelectedEq] = useState(EQUATIONS[0]);
  const eq = selectedEq;
  const totalLeft: Record<string, number> = {};
  const totalRight: Record<string, number> = {};
  eq.reactants.forEach((s, speciesIndex) => Object.entries(s.atoms).forEach(([a, c]) => { totalLeft[a] = (totalLeft[a] || 0) + Number(c) * (eq.coeffs[speciesIndex] ?? 1); }));
  eq.products.forEach((s, speciesIndex) => Object.entries(s.atoms).forEach(([a, c]) => { totalRight[a] = (totalRight[a] || 0) + Number(c) * (eq.coeffs[eq.reactants.length + speciesIndex] ?? 1); }));
  const allAtoms = new Set([...Object.keys(totalLeft), ...Object.keys(totalRight)]);
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {EQUATIONS.slice(0, 5).map(eq => (
          <button key={eq.id} onClick={() => setSelectedEq(eq)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedEq.id === eq.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >{eq.display.replace(/_/g, '')}</button>
        ))}
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Atom Count Checker (Balanced)</h3>
        <div className="grid grid-cols-3 gap-0 text-xs font-bold uppercase tracking-widest p-3 border-b border-slate-800 text-slate-500">
          <div>Atom</div>
          <div className="text-center">Reactants</div>
          <div className="text-center">Products</div>
        </div>
        {Array.from(allAtoms).sort().map(atom => (
          <div key={atom} className="grid grid-cols-3 gap-0 p-3 text-sm border-b border-slate-800/50">
            <div className="text-white font-mono font-bold">{atom}</div>
            <div className="text-center text-cyan-400 font-mono">{totalLeft[atom] || 0}</div>
            <div className="text-center text-green-400 font-mono">{totalRight[atom] || 0}</div>
          </div>
        ))}
        <div className="p-3 text-center text-xs text-green-400 font-bold mt-2">✓ Mass is conserved — atoms are neither created nor destroyed</div>
      </div>
    </div>
  );
}

function TypeIdentifier() {
  const [selected, setSelected] = useState<string | null>(null);
  const types = [
    { id: 'synthesis', name: 'Synthesis', pattern: 'A + B → AB', desc: 'Two or more substances combine to form one product.', examples: ['2Na + Cl₂ → 2NaCl', '4Fe + 3O₂ → 2Fe₂O₃'] },
    { id: 'decomposition', name: 'Decomposition', pattern: 'AB → A + B', desc: 'One compound breaks down into two or more simpler substances.', examples: ['2H₂O → 2H₂ + O₂', 'CaCO₃ → CaO + CO₂'] },
    { id: 'single-replacement', name: 'Single Replacement', pattern: 'A + BC → AC + B', desc: 'One element replaces another in a compound.', examples: ['Zn + CuSO₄ → ZnSO₄ + Cu', 'Mg + 2HCl → MgCl₂ + H₂'] },
    { id: 'combustion', name: 'Combustion', pattern: 'CₓHᵧ + O₂ → CO₂ + H₂O', desc: 'A hydrocarbon reacts with oxygen producing CO₂ and water.', examples: ['CH₄ + 2O₂ → CO₂ + 2H₂O', '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O'] },
  ];
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {types.map(t => (
          <button key={t.id} onClick={() => setSelected(selected === t.id ? null : t.id)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selected === t.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >{t.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map(t => (
          <motion.div key={t.id} animate={{ scale: selected === t.id ? 1.02 : 1 }} className={`bg-slate-900/60 rounded-2xl border p-5 transition-all ${selected === t.id ? 'border-brand-accent/50' : 'border-brand-border'}`}>
            <h3 className="text-sm font-bold text-white mb-1">{t.name}</h3>
            <div className="font-mono text-xs text-brand-accent mb-2">{t.pattern}</div>
            <p className="text-slate-400 text-xs mb-3">{t.desc}</p>
            {t.examples.map((ex, i) => (
              <div key={i} className="bg-black/40 rounded-lg p-2 mb-1 text-xs font-mono text-slate-300">{ex}</div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GhanaContext() {
  const cards = [
    { id: 'cocoa', title: 'Cocoa Fermentation Chemistry', icon: '🍫', context: 'During cocoa fermentation in Ghana (6-7 days), microorganisms decompose sugars through anaerobic respiration: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. Acetic acid bacteria then convert ethanol to acetic acid. These reactions develop chocolate flavour precursors.' },
    { id: 'gold', title: 'Gold Extraction with Cyanide', icon: '⛏️', context: 'At Obuasi and Tarkwa mines, gold is extracted using cyanide leaching: 4Au + 8NaCN + O₂ + 2H₂O → 4Na[Au(CN)₂] + 4NaOH. This is a complex redox reaction where gold is oxidised. Carbon-in-pulp then recovers the gold from solution.' },
  ];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-light text-white">Balancing Equations in <span className="text-brand-accent font-medium">Ghana</span></h2>
      </div>
      {cards.map(card => (
        <div key={card.id} className="bg-slate-900/60 rounded-2xl border border-brand-border overflow-hidden">
          <div className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors" onClick={() => setExpanded(expanded === card.id ? null : card.id)}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-white font-bold">{card.title}</h3>
            </div>
          </div>
          <AnimatePresence>
            {expanded === card.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-800">
                <div className="p-5"><p className="text-slate-300 text-sm leading-relaxed">{card.context}</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function BalancingEquations() {
  const [viewMode, setViewMode] = useState<ViewMode>('balance');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'balance', label: 'Balance It', icon: <Scale size={14} /> },
    { key: 'conservation', label: 'Conservation', icon: <Atom size={14} /> },
    { key: 'type-id', label: 'Types', icon: <Tag size={14} /> },
    { key: 'ghana', label: 'Ghana', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{icon} {label}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'balance' && <BalanceIt />}
            {viewMode === 'conservation' && <ConservationOfMass />}
            {viewMode === 'type-id' && <TypeIdentifier />}
            {viewMode === 'ghana' && <GhanaContext />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Balancing Equations Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · </span>
Only change coefficients, never subscripts. Count all atoms on each side. Know the 4 reaction types. WASSCE frequently requires balancing and type identification.
      </div>
    </div>
  );
}
