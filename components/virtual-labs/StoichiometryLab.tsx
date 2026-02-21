/**
 * StoichiometryLab.tsx
 * "Reaction Balancer" — Balance equations by placing coefficients.
 * Gamified: atom counter validation, limiting reagent visual, mole calculations.
 */

import React, { useState, useEffect, useRef } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { FlaskConical, ChevronRight, Trophy, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

type StoichStep = 'intro' | 'balance' | 'moles' | 'limiting' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',    label: 'Theory',    description: 'Conservation of mass.' },
        { id: 'balance',  label: 'Balance',   description: 'Balance equations — earn points.' },
        { id: 'moles',    label: 'Moles',     description: 'Mole calculations.' },
        { id: 'limiting', label: 'Limiting',  description: 'Identify limiting reagent.' },
        { id: 'conclude', label: 'Conclude',  description: 'Assessment.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Equation Data ────────────────────────────────────────────────────────────

interface Molecule {
    formula: string; display: string; color: string;
    atoms: Record<string, number>; // element → count (per molecule)
}

interface EquationChallenge {
    id: string; name: string; description: string;
    reactants: { molecule: Molecule; coeff: number }[];
    products:  { molecule: Molecule; coeff: number }[];
    points: number; difficulty: 1 | 2 | 3;
    hint: string;
}

const EQUATIONS: EquationChallenge[] = [
    {
        id: 'h2_o2',
        name: 'Synthesis of Water',
        description: 'Hydrogen + Oxygen → Water',
        reactants: [
            { molecule: { formula: 'H₂', display: 'H₂', color: '#38bdf8', atoms: { H: 2 } }, coeff: 2 },
            { molecule: { formula: 'O₂', display: 'O₂', color: '#f87171', atoms: { O: 2 } }, coeff: 1 },
        ],
        products: [
            { molecule: { formula: 'H₂O', display: 'H₂O', color: '#60a5fa', atoms: { H: 2, O: 1 } }, coeff: 2 },
        ],
        points: 150, difficulty: 1,
        hint: 'You need 4 H atoms on each side. Try 2H₂ + O₂ → 2H₂O.',
    },
    {
        id: 'combustion_methane',
        name: 'Combustion of Methane',
        description: 'Methane + Oxygen → Carbon dioxide + Water',
        reactants: [
            { molecule: { formula: 'CH₄', display: 'CH₄', color: '#a78bfa', atoms: { C: 1, H: 4 } }, coeff: 1 },
            { molecule: { formula: 'O₂', display: 'O₂', color: '#f87171', atoms: { O: 2 } }, coeff: 2 },
        ],
        products: [
            { molecule: { formula: 'CO₂', display: 'CO₂', color: '#94a3b8', atoms: { C: 1, O: 2 } }, coeff: 1 },
            { molecule: { formula: 'H₂O', display: 'H₂O', color: '#60a5fa', atoms: { H: 2, O: 1 } }, coeff: 2 },
        ],
        points: 250, difficulty: 2,
        hint: 'Balance C first (1), then H (4→2H₂O), then count O on right (4) → need 2O₂.',
    },
    {
        id: 'iron_oxide',
        name: 'Formation of Iron Oxide',
        description: 'Iron + Oxygen → Iron(III) oxide',
        reactants: [
            { molecule: { formula: 'Fe', display: 'Fe', color: '#f97316', atoms: { Fe: 1 } }, coeff: 4 },
            { molecule: { formula: 'O₂', display: 'O₂', color: '#f87171', atoms: { O: 2 } }, coeff: 3 },
        ],
        products: [
            { molecule: { formula: 'Fe₂O₃', display: 'Fe₂O₃', color: '#b45309', atoms: { Fe: 2, O: 3 } }, coeff: 2 },
        ],
        points: 350, difficulty: 3,
        hint: 'Need even Fe: 4Fe. Product has 3 O per molecule. 2Fe₂O₃ = 6 O → 3O₂.',
    },
    {
        id: 'aluminium_oxygen',
        name: 'Combustion of Aluminium',
        description: 'Aluminium + Oxygen → Aluminium oxide',
        reactants: [
            { molecule: { formula: 'Al', display: 'Al', color: '#94a3b8', atoms: { Al: 1 } }, coeff: 4 },
            { molecule: { formula: 'O₂', display: 'O₂', color: '#f87171', atoms: { O: 2 } }, coeff: 3 },
        ],
        products: [
            { molecule: { formula: 'Al₂O₃', display: 'Al₂O₃', color: '#64748b', atoms: { Al: 2, O: 3 } }, coeff: 2 },
        ],
        points: 350, difficulty: 3,
        hint: 'Al₂O₃ needs 2 Al per molecule. 2×Al₂O₃ = 4Al, 6O → 3O₂.',
    },
    {
        id: 'hcl_naoh',
        name: 'Neutralisation',
        description: 'Hydrochloric acid + Sodium hydroxide → Salt + Water',
        reactants: [
            { molecule: { formula: 'HCl', display: 'HCl', color: '#86efac', atoms: { H: 1, Cl: 1 } }, coeff: 1 },
            { molecule: { formula: 'NaOH', display: 'NaOH', color: '#fbbf24', atoms: { Na: 1, O: 1, H: 1 } }, coeff: 1 },
        ],
        products: [
            { molecule: { formula: 'NaCl', display: 'NaCl', color: '#e2e8f0', atoms: { Na: 1, Cl: 1 } }, coeff: 1 },
            { molecule: { formula: 'H₂O', display: 'H₂O', color: '#60a5fa', atoms: { H: 2, O: 1 } }, coeff: 1 },
        ],
        points: 200, difficulty: 2,
        hint: 'All coefficients are 1! A classic 1:1 neutralisation reaction.',
    },
];

// ─── Balance Game ─────────────────────────────────────────────────────────────

function countAtoms(side: { molecule: Molecule; coeff: number }[], userCoeffs: number[]) {
    const counts: Record<string, number> = {};
    side.forEach(({ molecule, coeff }, i) => {
        const c = userCoeffs[i] || 0;
        Object.entries(molecule.atoms).forEach(([el, n]) => {
            counts[el] = (counts[el] || 0) + c * n;
        });
    });
    return counts;
}

function isBalanced(
    reactants: { molecule: Molecule; coeff: number }[], products: { molecule: Molecule; coeff: number }[],
    rCoeffs: number[], pCoeffs: number[]
) {
    const rCounts = countAtoms(reactants, rCoeffs);
    const pCounts = countAtoms(products, pCoeffs);
    const allElements = new Set([...Object.keys(rCounts), ...Object.keys(pCounts)]);
    return [...allElements].every(el => (rCounts[el] || 0) === (pCounts[el] || 0));
}

const BalanceGame: React.FC<{
    onComplete: (score: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ onComplete, addNote, onNext }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [rCoeffs, setRCoeffs] = useState<number[]>([]);
    const [pCoeffs, setPCoeffs] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [balanced, setBalanced] = useState(false);
    const [score, setScore] = useState(0);
    const [hintShown, setHintShown] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const eq = EQUATIONS[currentIdx];

    useEffect(() => {
        setRCoeffs(eq.reactants.map(() => 1));
        setPCoeffs(eq.products.map(() => 1));
        setChecked(false); setBalanced(false); setHintShown(false); setAttempts(0);
    }, [currentIdx]);

    const rCounts = countAtoms(eq.reactants, rCoeffs);
    const pCounts = countAtoms(eq.products, pCoeffs);
    const allElements = Array.from(new Set([...Object.keys(rCounts), ...Object.keys(pCounts)]));

    const handleCheck = () => {
        const ok = isBalanced(eq.reactants, eq.products, rCoeffs, pCoeffs);
        setChecked(true);
        setBalanced(ok);
        setAttempts(a => a + 1);
        if (ok) {
            const bonus = hintShown ? 0 : attempts === 0 ? Math.floor(eq.points * 0.5) : 0;
            const earned = eq.points + bonus;
            setScore(s => s + earned);
            addNote(
                `Balanced: ${eq.name}. Coefficients: reactants [${rCoeffs.join(',')}], products [${pCoeffs.join(',')}].`,
                `Reaction Balancer — ${eq.name}`
            );
        }
    };

    const handleReset = () => {
        setRCoeffs(eq.reactants.map(() => 1));
        setPCoeffs(eq.products.map(() => 1));
        setChecked(false); setBalanced(false);
    };

    const next = () => {
        if (currentIdx < EQUATIONS.length - 1) setCurrentIdx(i => i + 1);
        else { onComplete(score); onNext(); }
    };

    const CoeffControl = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
        <div className="flex items-center gap-1">
            <button onClick={() => onChange(Math.max(1, value - 1))}
                className="w-6 h-6 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold transition-colors">−</button>
            <span className="w-6 text-center text-cyan-400 font-black font-mono text-sm">{value}</span>
            <button onClick={() => onChange(Math.min(8, value + 1))}
                className="w-6 h-6 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold transition-colors">+</button>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">{eq.name}</h2>
                        <p className="text-slate-500 text-sm">{eq.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-600">{currentIdx + 1}/{EQUATIONS.length}</span>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-mono font-bold">{score}</span>
                        </div>
                        {'★'.repeat(eq.difficulty) + '☆'.repeat(3 - eq.difficulty)}
                    </div>
                </div>

                {/* Equation display */}
                <div className="flex items-center justify-center gap-3 flex-wrap my-6 p-4 bg-slate-950 rounded-xl">
                    {eq.reactants.map((r, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span className="text-slate-500 text-xl font-bold">+</span>}
                            <div className="flex flex-col items-center gap-2">
                                <CoeffControl value={rCoeffs[i] || 1} onChange={v => {
                                    const updated = [...rCoeffs]; updated[i] = v;
                                    setRCoeffs(updated); setChecked(false);
                                }} />
                                <div className="px-4 py-2 rounded-xl border text-lg font-black"
                                    style={{ borderColor: r.molecule.color + '60', backgroundColor: r.molecule.color + '15', color: r.molecule.color }}>
                                    {r.molecule.display}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                    <span className="text-slate-400 text-2xl font-bold mx-2">→</span>
                    {eq.products.map((p, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span className="text-slate-500 text-xl font-bold">+</span>}
                            <div className="flex flex-col items-center gap-2">
                                <CoeffControl value={pCoeffs[i] || 1} onChange={v => {
                                    const updated = [...pCoeffs]; updated[i] = v;
                                    setPCoeffs(updated); setChecked(false);
                                }} />
                                <div className="px-4 py-2 rounded-xl border text-lg font-black"
                                    style={{ borderColor: p.molecule.color + '60', backgroundColor: p.molecule.color + '15', color: p.molecule.color }}>
                                    {p.molecule.display}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* Atom count checker */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-slate-500 pb-2 text-left">Element</th>
                                <th className="text-slate-400 pb-2">Reactants</th>
                                <th className="text-slate-400 pb-2">Products</th>
                                <th className="text-slate-400 pb-2">Balanced?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allElements.map(el => {
                                const r = rCounts[el] || 0;
                                const p = pCounts[el] || 0;
                                const ok = r === p;
                                return (
                                    <tr key={el} className="border-b border-slate-800/50">
                                        <td className="py-2 text-left font-bold text-white">{el}</td>
                                        <td className="py-2 font-mono text-cyan-400">{r}</td>
                                        <td className="py-2 font-mono text-cyan-400">{p}</td>
                                        <td className="py-2">
                                            {ok ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗ ({r}≠{p})</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {checked && (
                    <div className={`mt-4 p-3 rounded-xl border text-sm ${balanced ? 'border-green-500/30 bg-green-900/10 text-green-400' : 'border-red-500/30 bg-red-900/10 text-red-400'}`}>
                        {balanced ? `✓ Perfectly balanced! +${eq.points} pts${!hintShown && attempts === 1 ? ' (+first try bonus!)' : ''}` : '✗ Not balanced yet — adjust your coefficients.'}
                    </div>
                )}

                {!balanced && !hintShown && (
                    <button onClick={() => setHintShown(true)} className="mt-3 text-xs text-slate-600 hover:text-slate-400 underline transition-colors">
                        Show hint (no bonus points)
                    </button>
                )}
                {hintShown && !balanced && (
                    <div className="mt-3 p-3 bg-amber-900/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                        💡 {eq.hint}
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button onClick={handleReset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-sm font-bold transition-colors flex items-center gap-1">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                    {!balanced ? (
                        <button onClick={handleCheck} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                            Check Balance
                        </button>
                    ) : (
                        <button onClick={next} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                            {currentIdx < EQUATIONS.length - 1 ? 'Next Equation →' : 'Mole Calculations →'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Moles Step ───────────────────────────────────────────────────────────────

const MOLE_PROBLEMS = [
    {
        id: 'mp1',
        question: 'How many moles of H₂O are produced from 3 moles of O₂ in the reaction: 2H₂ + O₂ → 2H₂O?',
        working: 'Mole ratio O₂ : H₂O = 1 : 2 → 3 mol O₂ × 2 = 6 mol H₂O',
        options: ['3', '6', '1.5', '2'],
        answer: '6',
    },
    {
        id: 'mp2',
        question: 'What mass of CO₂ is produced from 1 mole of CH₄ burning? (Mr CO₂ = 44 g/mol)',
        working: 'CH₄ + 2O₂ → CO₂ + 2H₂O. 1 mol CH₄ → 1 mol CO₂ → 44 g',
        options: ['22 g', '88 g', '44 g', '12 g'],
        answer: '44 g',
    },
    {
        id: 'mp3',
        question: 'How many moles of O₂ are needed to burn 4 moles of Fe? (4Fe + 3O₂ → 2Fe₂O₃)',
        working: 'Ratio Fe : O₂ = 4 : 3 → 4 mol Fe × (3/4) = 3 mol O₂',
        options: ['4', '2', '3', '6'],
        answer: '3',
    },
];

const MolesStep: React.FC<{ onNext: () => void; addNote: (t: string, c?: string) => void }> = ({ onNext, addNote }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [workingShown, setWorkingShown] = useState<Set<string>>(new Set());
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setChecked(true);
        MOLE_PROBLEMS.forEach(p => {
            if (answers[p.id] === p.answer) {
                addNote(`Mole calc: ${p.question} → ${p.answer}`, 'Stoichiometry — Moles');
            }
        });
    };

    const score = MOLE_PROBLEMS.filter(p => answers[p.id] === p.answer).length;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Mole Calculations</h2>
                <div className="space-y-6">
                    {MOLE_PROBLEMS.map((p, i) => {
                        const userAnswer = answers[p.id];
                        const correct = userAnswer === p.answer;
                        return (
                            <div key={p.id} className={`p-4 rounded-xl border ${checked ? (correct ? 'border-green-500/30 bg-green-900/5' : 'border-red-500/30 bg-red-900/5') : 'border-slate-700 bg-slate-800/30'}`}>
                                <p className="text-white text-sm font-medium mb-3"><span className="text-slate-600 mr-2">{i+1}.</span>{p.question}</p>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {p.options.map(opt => (
                                        <button key={opt} onClick={() => !checked && setAnswers(prev => ({ ...prev, [p.id]: opt }))}
                                            className={`p-2.5 rounded-xl border text-sm font-bold text-center transition-all ${
                                                checked && opt === p.answer ? 'border-green-500 bg-green-900/20 text-green-400'
                                                    : checked && opt === userAnswer && !correct ? 'border-red-500 bg-red-900/20 text-red-400'
                                                    : userAnswer === opt ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                                                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                                            }`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {!workingShown.has(p.id) ? (
                                    <button onClick={() => setWorkingShown(prev => new Set([...prev, p.id]))}
                                        className="text-xs text-slate-600 hover:text-slate-400 underline transition-colors">
                                        Show working
                                    </button>
                                ) : (
                                    <div className="p-2 bg-slate-800/60 border border-slate-700 rounded-lg text-xs text-slate-400 font-mono">
                                        {p.working}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {checked ? (
                    <div className="mt-4 space-y-3">
                        <div className={`p-3 rounded-xl border text-sm ${score === 3 ? 'border-green-500/30 bg-green-900/10 text-green-400' : 'border-amber-500/30 bg-amber-900/10 text-amber-400'}`}>
                            {score}/3 correct
                        </div>
                        <button onClick={onNext} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                            Limiting Reagent →
                        </button>
                    </div>
                ) : (
                    <button onClick={handleCheck} disabled={Object.keys(answers).length < MOLE_PROBLEMS.length}
                        className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
                        Check Answers
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Limiting Reagent Step ────────────────────────────────────────────────────

const LimitingStep: React.FC<{ onNext: () => void; addNote: (t: string, c?: string) => void }> = ({ onNext, addNote }) => {
    // Scenario: 2H₂ + O₂ → 2H₂O. Available: 3 mol H₂, 2 mol O₂. Which limits?
    const [answer, setAnswer] = useState('');
    const [checked, setChecked] = useState(false);
    const [excessCalc, setExcessCalc] = useState('');
    const correct = 'H₂';

    // H₂ needs O₂ in 2:1 ratio. 3 mol H₂ needs 1.5 mol O₂. We have 2 mol O₂ — more than enough.
    // So H₂ is limiting (runs out first).

    const handleCheck = () => {
        setChecked(true);
        addNote(
            `Limiting reagent: 3 mol H₂ + 2 mol O₂ → H₂ is limiting (needs 1.5 mol O₂, have 2 mol). 0.5 mol O₂ in excess.`,
            'Stoichiometry — Limiting Reagent'
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-bold text-white">Limiting Reagent</h2>

                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <p className="text-white font-mono text-center text-lg mb-3">2H₂ + O₂ → 2H₂O</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-xl text-center">
                            <div className="text-2xl font-black text-cyan-400">3 mol</div>
                            <div className="text-slate-400 text-sm mt-1">H₂ available</div>
                        </div>
                        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                            <div className="text-2xl font-black text-red-400">2 mol</div>
                            <div className="text-slate-400 text-sm mt-1">O₂ available</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-white font-medium text-sm">Step 1: Calculate how much O₂ is needed to react with all 3 mol H₂.</p>
                    <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl font-mono text-sm text-slate-400">
                        Ratio H₂ : O₂ = 2 : 1 → 3 mol H₂ needs {'"'}3 ÷ 2 = 1.5 mol O₂{'"'}
                    </div>
                    <p className="text-white font-medium text-sm mt-4">Step 2: We have 2 mol O₂ but only need 1.5 mol. Which reagent runs out first?</p>
                </div>

                <div>
                    <p className="text-white text-sm font-medium mb-3">Which is the <span className="text-amber-400 font-bold">limiting reagent</span>?</p>
                    <div className="grid grid-cols-2 gap-3">
                        {['H₂', 'O₂'].map(opt => (
                            <button key={opt} onClick={() => !checked && setAnswer(opt)}
                                className={`p-4 rounded-xl border text-xl font-black text-center transition-all ${
                                    checked && opt === correct ? 'border-green-500 bg-green-900/20 text-green-400'
                                        : checked && opt === answer && opt !== correct ? 'border-red-500 bg-red-900/20 text-red-400'
                                        : answer === opt ? 'border-amber-500 bg-amber-900/20 text-amber-400'
                                        : 'border-slate-700 bg-slate-800/50 text-white hover:border-slate-500'
                                }`}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {checked && (
                    <div className={`p-4 rounded-xl border ${answer === correct ? 'border-green-500/30 bg-green-900/10' : 'border-amber-500/30 bg-amber-900/10'}`}>
                        <p className={`font-bold text-sm ${answer === correct ? 'text-green-400' : 'text-amber-400'}`}>
                            {answer === correct ? '✓ Correct!' : `✗ The limiting reagent is H₂.`}
                        </p>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            H₂ is the limiting reagent — it runs out first. We only needed 1.5 mol O₂ but had 2 mol, so 0.5 mol O₂ is in <strong className="text-white">excess</strong>. The amount of H₂O produced is determined by the limiting reagent: 3 mol H₂ → 3 mol H₂O.
                        </p>
                    </div>
                )}

                {!checked ? (
                    <button onClick={handleCheck} disabled={!answer}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
                        Check Answer
                    </button>
                ) : (
                    <button onClick={onNext} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                        Assessment →
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Quiz ─────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
    {
        id: 'sq1',
        question: 'What principle is the basis for balancing chemical equations?',
        options: ['Conservation of energy', 'Conservation of mass', 'Conservation of charge only', 'Avogadro\'s Law'],
        answer: 'Conservation of mass',
    },
    {
        id: 'sq2',
        question: 'Balance: _H₂ + _O₂ → _H₂O. What are the coefficients?',
        options: ['1, 1, 1', '2, 1, 2', '1, 2, 2', '2, 2, 2'],
        answer: '2, 1, 2',
    },
    {
        id: 'sq3',
        question: 'One mole of any substance contains approximately:',
        options: ['6.02 × 10²³ particles', '3.01 × 10²³ particles', '6.02 × 10²¹ particles', '1 × 10²³ particles'],
        answer: '6.02 × 10²³ particles',
    },
    {
        id: 'sq4',
        question: 'In the reaction 2H₂ + O₂ → 2H₂O, if 4 mol H₂ react with 1 mol O₂, which is the limiting reagent?',
        options: ['H₂', 'O₂', 'H₂O', 'Neither — both are in stoichiometric amounts'],
        answer: 'O₂',
    },
    {
        id: 'sq5',
        question: 'What is the molar mass of CO₂? (C=12, O=16)',
        options: ['28 g/mol', '44 g/mol', '32 g/mol', '40 g/mol'],
        answer: '44 g/mol',
    },
];

const ConcludeStep: React.FC<{
    answers: Record<string, string>; onAnswer: (id: string, val: string) => void;
    submitted: boolean; onSubmit: () => void; score: number;
}> = ({ answers, onAnswer, submitted, onSubmit, score }) => (
    <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {submitted ? (
                <div className="text-center space-y-4">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-2 ${score >= 70 ? 'border-green-500 bg-green-900/30' : 'border-amber-500 bg-amber-900/30'}`}>
                        <span className="text-4xl font-black text-white">{score}%</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{score >= 70 ? '⚖️ Balanced!' : 'Review & Retry'}</h2>
                    <div className="space-y-3 text-left">
                        {QUIZ_QUESTIONS.map(q => {
                            const correct = answers[q.id] === q.answer;
                            return (
                                <div key={q.id} className={`p-3 rounded-xl border text-sm ${correct ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                    <p className="text-white font-medium mb-1">{q.question}</p>
                                    <p className="text-xs text-slate-400">Your: <span className={correct ? 'text-green-400' : 'text-red-400'}>{answers[q.id]}</span></p>
                                    {!correct && <p className="text-xs mt-0.5 text-slate-400">Correct: <span className="text-green-400">{q.answer}</span></p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold text-white mb-6">Assessment</h2>
                    <div className="space-y-5">
                        {QUIZ_QUESTIONS.map((q, i) => (
                            <div key={q.id}>
                                <p className="text-white text-sm font-medium mb-2"><span className="text-slate-600 mr-2">{i+1}.</span>{q.question}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {q.options.map(opt => (
                                        <button key={opt} onClick={() => onAnswer(q.id, opt)}
                                            className={`p-3 rounded-xl border text-sm text-left transition-all ${answers[q.id] === opt ? 'border-cyan-500 bg-cyan-900/20 text-cyan-300' : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={onSubmit} disabled={!QUIZ_QUESTIONS.every(q => answers[q.id])}
                        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
                        Submit Assessment
                    </button>
                </>
            )}
        </div>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { lab: VirtualLab; studentId: string; onExit: () => void; }

const StoichiometryLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const handleSubmit = (completeLab: (s: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (answers[q.id] === q.answer) correct++; });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score); setSubmitted(true); completeLab(score);
    };

    return (
        <VirtualLabEngine<StoichStep> config={ENGINE_CONFIG} lab={lab} studentId={studentId} onExit={onExit}>
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-900/20 rounded-xl border border-purple-500/20">
                                        <FlaskConical className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Reaction Balancer</h2>
                                        <p className="text-slate-500 text-sm">Balance equations. Master moles. Identify limiting reagents.</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Stoichiometry is the language of chemistry. Balanced equations tell us exactly how many particles react and form — because matter is never created or destroyed (Law of Conservation of Mass).
                                </p>
                                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl font-mono text-center">
                                    <p className="text-slate-500 text-xs mb-1">Example</p>
                                    <p className="text-white text-lg">2H₂ + O₂ → 2H₂O</p>
                                    <p className="text-slate-500 text-xs mt-1">4H + 2O = 4H + 2O ✓</p>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">🎮 Game Mechanics</p>
                                    <ul className="text-sm text-slate-400 space-y-1">
                                        <li>• Adjust coefficients until atom counts balance on both sides</li>
                                        <li>• Earn bonus points for first-try correct answers</li>
                                        <li>• Hints available — but cost you the bonus</li>
                                        <li>• 5 equations increasing in difficulty (★ to ★★★)</li>
                                    </ul>
                                </div>
                                <button onClick={() => setStep('balance')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Start Balancing <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 'balance' && <BalanceGame onComplete={() => {}} addNote={addNote} onNext={() => setStep('moles')} />}
                    {step === 'moles' && <MolesStep onNext={() => setStep('limiting')} addNote={addNote} />}
                    {step === 'limiting' && <LimitingStep onNext={() => setStep('conclude')} addNote={addNote} />}
                    {step === 'conclude' && (
                        <ConcludeStep
                            answers={answers}
                            onAnswer={(id, val) => setAnswers(prev => ({ ...prev, [id]: val }))}
                            submitted={submitted}
                            onSubmit={() => handleSubmit(completeLab)}
                            score={quizScore}
                        />
                    )}
                </>
            )}
        </VirtualLabEngine>
    );
};

export default StoichiometryLab;
