/**
 * ChemicalBondingLab.tsx
 * "Bond Forge" — Connect atoms to form correct molecules.
 * Gamified: octet rule validation, molecule stability score, progressive challenges.
 */

import React, { useState, useRef, useEffect } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Zap, ChevronRight, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

type BondStep = 'intro' | 'ionic' | 'covalent' | 'compare' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',    label: 'Theory',   description: 'Bonding fundamentals.' },
        { id: 'ionic',    label: 'Ionic',     description: 'Forge ionic bonds.' },
        { id: 'covalent', label: 'Covalent',  description: 'Forge covalent bonds.' },
        { id: 'compare',  label: 'Compare',   description: 'Properties comparison.' },
        { id: 'conclude', label: 'Conclude',  description: 'Assessment.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Bond Data ────────────────────────────────────────────────────────────────

interface AtomConfig {
    symbol: string; name: string; color: string;
    valence: number; electronegativity: number;
    charge?: number; // for ions
}

interface BondChallenge {
    id: string; formula: string; name: string;
    type: 'ionic' | 'covalent' | 'polar covalent';
    atoms: AtomConfig[]; bondOrder: number;
    explanation: string; points: number;
}

const IONIC_CHALLENGES: BondChallenge[] = [
    {
        id: 'nacl', formula: 'NaCl', name: 'Sodium Chloride',
        type: 'ionic', bondOrder: 1,
        atoms: [
            { symbol: 'Na', name: 'Sodium', color: '#fb923c', valence: 1, electronegativity: 0.93, charge: +1 },
            { symbol: 'Cl', name: 'Chlorine', color: '#86efac', valence: 7, electronegativity: 3.16, charge: -1 },
        ],
        explanation: 'Na donates 1 electron to Cl. Na becomes Na⁺ (full outer shell), Cl becomes Cl⁻ (full outer shell). Electrostatic attraction forms the ionic bond.',
        points: 150,
    },
    {
        id: 'mgcl2', formula: 'MgCl₂', name: 'Magnesium Chloride',
        type: 'ionic', bondOrder: 2,
        atoms: [
            { symbol: 'Mg', name: 'Magnesium', color: '#4ade80', valence: 2, electronegativity: 1.31, charge: +2 },
            { symbol: 'Cl', name: 'Chlorine', color: '#86efac', valence: 7, electronegativity: 3.16, charge: -1 },
        ],
        explanation: 'Mg donates 2 electrons — one to each Cl. Mg²⁺ and 2×Cl⁻ ions attract each other in a lattice structure.',
        points: 200,
    },
    {
        id: 'cao', formula: 'CaO', name: 'Calcium Oxide',
        type: 'ionic', bondOrder: 2,
        atoms: [
            { symbol: 'Ca', name: 'Calcium', color: '#f59e0b', valence: 2, electronegativity: 1.00, charge: +2 },
            { symbol: 'O', name: 'Oxygen', color: '#f87171', valence: 6, electronegativity: 3.44, charge: -2 },
        ],
        explanation: 'Ca donates 2 electrons to O. Ca²⁺ and O²⁻ form a strongly attracted ionic pair with high melting point.',
        points: 220,
    },
];

const COVALENT_CHALLENGES: BondChallenge[] = [
    {
        id: 'h2', formula: 'H₂', name: 'Hydrogen Gas',
        type: 'covalent', bondOrder: 1,
        atoms: [
            { symbol: 'H', name: 'Hydrogen', color: '#38bdf8', valence: 1, electronegativity: 2.20 },
            { symbol: 'H', name: 'Hydrogen', color: '#38bdf8', valence: 1, electronegativity: 2.20 },
        ],
        explanation: 'Two H atoms share 1 electron each — a single covalent bond. Both achieve a full shell of 2 (duet rule).',
        points: 100,
    },
    {
        id: 'h2o', formula: 'H₂O', name: 'Water',
        type: 'polar covalent', bondOrder: 1,
        atoms: [
            { symbol: 'O', name: 'Oxygen', color: '#f87171', valence: 6, electronegativity: 3.44 },
            { symbol: 'H', name: 'Hydrogen', color: '#38bdf8', valence: 1, electronegativity: 2.20 },
        ],
        explanation: 'O forms 2 bonds with H atoms. O is more electronegative — electron density shifts toward O, creating a polar molecule with δ⁻ on O and δ⁺ on each H.',
        points: 180,
    },
    {
        id: 'o2', formula: 'O₂', name: 'Oxygen Gas',
        type: 'covalent', bondOrder: 2,
        atoms: [
            { symbol: 'O', name: 'Oxygen', color: '#f87171', valence: 6, electronegativity: 3.44 },
            { symbol: 'O', name: 'Oxygen', color: '#f87171', valence: 6, electronegativity: 3.44 },
        ],
        explanation: 'Each O needs 2 more electrons → they share 4 electrons (2 pairs) forming a double bond (O=O). Both achieve a full outer shell of 8.',
        points: 200,
    },
    {
        id: 'n2', formula: 'N₂', name: 'Nitrogen Gas',
        type: 'covalent', bondOrder: 3,
        atoms: [
            { symbol: 'N', name: 'Nitrogen', color: '#60a5fa', valence: 5, electronegativity: 3.04 },
            { symbol: 'N', name: 'Nitrogen', color: '#60a5fa', valence: 5, electronegativity: 3.04 },
        ],
        explanation: 'Each N needs 3 more electrons → triple bond (N≡N), sharing 6 electrons. Extremely strong bond — explains N₂ inertness.',
        points: 300,
    },
];

// ─── Ionic Bond Game ──────────────────────────────────────────────────────────

const IonicGame: React.FC<{
    onComplete: (score: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ onComplete, addNote, onNext }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [transferring, setTransferring] = useState(false);
    const [transferred, setTransferred] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const challenge = IONIC_CHALLENGES[currentIdx];
    const [donor, acceptor] = challenge.atoms;
    const allDone = completed.size === IONIC_CHALLENGES.length;

    const handleTransfer = () => {
        setTransferring(true);
        setTimeout(() => {
            setTransferring(false);
            setTransferred(true);
            setScore(s => s + challenge.points);
            setCompleted(prev => new Set([...prev, challenge.id]));
            addNote(
                `${challenge.name}: ${donor.symbol} donates ${challenge.bondOrder} electron(s) to ${acceptor.symbol}. ${challenge.explanation}`,
                `Bond Forge — Ionic`
            );
        }, 1200);
    };

    const next = () => {
        if (currentIdx < IONIC_CHALLENGES.length - 1) {
            setCurrentIdx(i => i + 1);
            setTransferred(false);
        } else {
            onComplete(score);
            onNext();
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Ionic Bond Forge</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{currentIdx + 1}/{IONIC_CHALLENGES.length}</span>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-mono font-bold">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Challenge header */}
                <div className="text-center mb-8">
                    <div className="text-3xl font-black text-white">{challenge.formula}</div>
                    <div className="text-slate-500 text-sm">{challenge.name} · +{challenge.points} pts</div>
                </div>

                {/* Atom visualisation */}
                <div className="flex items-center justify-center gap-12 mb-8">
                    {/* Donor atom */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-xs text-slate-500 uppercase font-bold">Donor</div>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
                                style={{ borderColor: donor.color, backgroundColor: donor.color + '20' }}>
                                <span className="text-2xl font-black" style={{ color: donor.color }}>{donor.symbol}</span>
                            </div>
                            {/* Valence electrons */}
                            {Array.from({ length: donor.valence }).map((_, i) => {
                                const angle = (2 * Math.PI * i / donor.valence) - Math.PI / 2;
                                const r = 48;
                                return (
                                    <div key={i} className={`absolute w-4 h-4 rounded-full border flex items-center justify-center text-xs transition-all duration-700 ${transferring && i < challenge.bondOrder ? 'opacity-0 translate-x-8' : ''}`}
                                        style={{
                                            left: `${50 + r * Math.cos(angle)}%`,
                                            top: `${50 + r * Math.sin(angle)}%`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: donor.color + '40',
                                            borderColor: donor.color,
                                            color: donor.color,
                                        }}>
                                        {i < challenge.bondOrder && !transferred ? '●' : '·'}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-xs text-slate-400">{donor.name}</div>
                        {transferred && (
                            <div className="text-sm font-bold" style={{ color: donor.color }}>
                                {donor.symbol}{donor.charge !== undefined ? (donor.charge > 0 ? `${donor.charge}+` : `${Math.abs(donor.charge)}−`) : ''}
                            </div>
                        )}
                    </div>

                    {/* Arrow / bond indicator */}
                    <div className="flex flex-col items-center gap-2">
                        {transferred ? (
                            <div className="text-green-400 text-2xl font-black">⚡</div>
                        ) : (
                            <div className="text-slate-600 text-2xl">→</div>
                        )}
                        <div className="text-xs text-slate-600">
                            {transferred ? 'Ionic bond' : `Transfer ${challenge.bondOrder}e⁻`}
                        </div>
                    </div>

                    {/* Acceptor atom */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-xs text-slate-500 uppercase font-bold">Acceptor</div>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
                                style={{ borderColor: acceptor.color, backgroundColor: acceptor.color + '20' }}>
                                <span className="text-2xl font-black" style={{ color: acceptor.color }}>{acceptor.symbol}</span>
                            </div>
                            {/* Acceptor valence electrons + incoming */}
                            {Array.from({ length: acceptor.valence + (transferred ? challenge.bondOrder : 0) }).map((_, i) => {
                                const total = acceptor.valence + (transferred ? challenge.bondOrder : 0);
                                const angle = (2 * Math.PI * i / total) - Math.PI / 2;
                                const r = 48;
                                const isNew = i >= acceptor.valence;
                                return (
                                    <div key={i}
                                        className={`absolute w-4 h-4 rounded-full border flex items-center justify-center text-xs transition-all duration-700 ${isNew ? 'scale-125' : ''}`}
                                        style={{
                                            left: `${50 + r * Math.cos(angle)}%`,
                                            top: `${50 + r * Math.sin(angle)}%`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: isNew ? donor.color + '60' : acceptor.color + '40',
                                            borderColor: isNew ? donor.color : acceptor.color,
                                            color: isNew ? donor.color : acceptor.color,
                                        }}>
                                        ●
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-xs text-slate-400">{acceptor.name}</div>
                        {transferred && (
                            <div className="text-sm font-bold" style={{ color: acceptor.color }}>
                                {acceptor.symbol}{acceptor.charge !== undefined ? (acceptor.charge < 0 ? `${Math.abs(acceptor.charge)}−` : `${acceptor.charge}+`) : ''}
                            </div>
                        )}
                    </div>
                </div>

                {transferred && (
                    <div className="mb-6 p-4 bg-green-900/10 border border-green-500/30 rounded-xl">
                        <p className="text-green-400 text-sm leading-relaxed">{challenge.explanation}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    {!transferred ? (
                        <button onClick={handleTransfer} disabled={transferring}
                            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                            <Zap className="w-4 h-4" /> Transfer Electron{challenge.bondOrder > 1 ? 's' : ''}
                        </button>
                    ) : (
                        <button onClick={next}
                            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            {currentIdx < IONIC_CHALLENGES.length - 1 ? 'Next Molecule →' : 'Go to Covalent Bonds →'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Covalent Bond Game ───────────────────────────────────────────────────────

const CovalentGame: React.FC<{
    onComplete: (score: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ onComplete, addNote, onNext }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [bondsPlaced, setBondsPlaced] = useState(0);
    const [forming, setForming] = useState(false);
    const [formed, setFormed] = useState(false);
    const [score, setScore] = useState(0);

    const challenge = COVALENT_CHALLENGES[currentIdx];
    const [atomA, atomB] = challenge.atoms;

    const handleAddBond = () => {
        if (bondsPlaced < challenge.bondOrder) {
            setForming(true);
            setTimeout(() => {
                setForming(false);
                setBondsPlaced(b => b + 1);
            }, 400);
        }
    };

    const handleComplete = () => {
        if (bondsPlaced === challenge.bondOrder) {
            setFormed(true);
            setScore(s => s + challenge.points);
            addNote(
                `${challenge.name} (${challenge.formula}): ${challenge.bondOrder === 1 ? 'Single' : challenge.bondOrder === 2 ? 'Double' : 'Triple'} ${challenge.type} bond. ${challenge.explanation}`,
                `Bond Forge — Covalent`
            );
        }
    };

    const reset = () => { setBondsPlaced(0); setFormed(false); };

    const next = () => {
        if (currentIdx < COVALENT_CHALLENGES.length - 1) {
            setCurrentIdx(i => i + 1);
            reset();
        } else {
            onComplete(score);
            onNext();
        }
    };

    const bondLines = Array.from({ length: challenge.bondOrder });
    const bondTypeLabel = ['Single', 'Double', 'Triple'][challenge.bondOrder - 1];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Covalent Bond Forge</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{currentIdx + 1}/{COVALENT_CHALLENGES.length}</span>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-mono font-bold">{score}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <div className="text-3xl font-black text-white">{challenge.formula}</div>
                    <div className="text-slate-500 text-sm">{challenge.name} · {bondTypeLabel} bond · +{challenge.points} pts</div>
                    <div className="text-xs text-slate-600 mt-1">Add {challenge.bondOrder} bond pair{challenge.bondOrder > 1 ? 's' : ''}</div>
                </div>

                {/* Covalent visualisation */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {/* Atom A */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: atomA.color, backgroundColor: atomA.color + '20' }}>
                            <span className="text-2xl font-black" style={{ color: atomA.color }}>{atomA.symbol}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{atomA.valence} valence e⁻</div>
                    </div>

                    {/* Bond zone */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-32 flex flex-col items-center gap-1">
                            {bondLines.map((_, i) => (
                                <div key={i}
                                    className={`w-full h-2 rounded-full transition-all duration-500 ${
                                        i < bondsPlaced
                                            ? 'opacity-100 scale-100'
                                            : 'opacity-20 scale-95'
                                    }`}
                                    style={{ backgroundColor: i < bondsPlaced ? '#38bdf8' : '#475569' }}>
                                    {i < bondsPlaced && (
                                        <div className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, ${atomA.color}, ${atomB.color})` }} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs font-mono text-cyan-400">
                            {bondsPlaced}/{challenge.bondOrder} pairs
                        </div>
                    </div>

                    {/* Atom B */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: atomB.color, backgroundColor: atomB.color + '20' }}>
                            <span className="text-2xl font-black" style={{ color: atomB.color }}>{atomB.symbol}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{atomB.valence} valence e⁻</div>
                    </div>
                </div>

                {/* Octet check */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[atomA, atomB].map((atom, idx) => {
                        const sharedPairs = bondsPlaced;
                        const lonePairs = Math.floor((atom.valence - sharedPairs) / 2);
                        const total = atom.valence === 1 ? sharedPairs * 2 : sharedPairs * 2 + lonePairs * 2;
                        const needsOctet = atom.valence !== 1;
                        const satisfied = needsOctet ? total >= 8 : total >= 2;
                        return (
                            <div key={idx} className={`p-3 rounded-xl border text-sm ${satisfied && bondsPlaced === challenge.bondOrder ? 'border-green-500/30 bg-green-900/10' : 'border-slate-700 bg-slate-800/50'}`}>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: atom.color }} className="font-bold">{atom.symbol}</span>
                                    {satisfied && bondsPlaced === challenge.bondOrder && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {needsOctet ? 'Needs 8e⁻ (octet)' : 'Needs 2e⁻ (duet)'}
                                </div>
                                <div className="text-xs font-mono text-slate-400 mt-0.5">
                                    Bonding pairs: {sharedPairs}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {formed && (
                    <div className="mb-4 p-4 bg-cyan-900/10 border border-cyan-500/30 rounded-xl">
                        <p className="text-cyan-300 text-sm leading-relaxed">{challenge.explanation}</p>
                        {challenge.type === 'polar covalent' && (
                            <div className="mt-2 p-2 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                                <p className="text-purple-300 text-xs">⚡ Polar covalent: ΔEN = {Math.abs(atomA.electronegativity - atomB.electronegativity).toFixed(2)} — electron density skewed toward {[atomA, atomB].sort((a,b) => b.electronegativity - a.electronegativity)[0].symbol}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    <button onClick={reset}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-sm font-bold transition-colors flex items-center gap-1">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                    {!formed ? (
                        <>
                            <button onClick={handleAddBond} disabled={bondsPlaced >= challenge.bondOrder || forming}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
                                Share Electron Pair ({bondsPlaced}/{challenge.bondOrder})
                            </button>
                            <button onClick={handleComplete} disabled={bondsPlaced < challenge.bondOrder}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors">
                                Forge!
                            </button>
                        </>
                    ) : (
                        <button onClick={next}
                            className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                            {currentIdx < COVALENT_CHALLENGES.length - 1 ? 'Next Molecule →' : 'Compare Bonds →'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Compare Step ─────────────────────────────────────────────────────────────

const CompareStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const properties = [
        { property: 'Formed between', ionic: 'Metal + Non-metal', covalent: 'Non-metal + Non-metal' },
        { property: 'Electron behaviour', ionic: 'Transferred', covalent: 'Shared' },
        { property: 'Melting point', ionic: 'High (strong lattice)', covalent: 'Low (weak intermolecular)' },
        { property: 'Electrical conductivity', ionic: 'Yes (when molten/dissolved)', covalent: 'No (no free ions)' },
        { property: 'Solubility in water', ionic: 'Often soluble', covalent: 'Variable' },
        { property: 'State at room temp', ionic: 'Solid', covalent: 'Gas, liquid, or solid' },
        { property: 'Electronegativity diff', ionic: '> 1.7 (IB guideline)', covalent: '< 1.7' },
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Ionic vs Covalent — Property Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-500 pb-3 font-bold uppercase text-xs w-40">Property</th>
                                <th className="text-center text-amber-400 pb-3 font-bold">Ionic ⚡</th>
                                <th className="text-center text-cyan-400 pb-3 font-bold">Covalent 🔗</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {properties.map(row => (
                                <tr key={row.property}>
                                    <td className="py-3 pr-4 text-slate-400 text-xs">{row.property}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-amber-300 text-xs bg-amber-900/20 border border-amber-500/20 px-2 py-1 rounded-lg">{row.ionic}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-cyan-300 text-xs bg-cyan-900/20 border border-cyan-500/20 px-2 py-1 rounded-lg">{row.covalent}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 p-3 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                    <p className="text-purple-300 text-xs">🔬 <strong>Polar covalent</strong> sits between ionic and non-polar covalent — electrons are shared unequally due to electronegativity differences. This creates partial charges (δ+ and δ−) responsible for properties like water's high boiling point.</p>
                </div>
                <button onClick={onNext} className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Assessment <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ─── Quiz ────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
    {
        id: 'bq1',
        question: 'Which type of bonding involves the complete transfer of electrons from one atom to another?',
        options: ['Covalent', 'Metallic', 'Ionic', 'Polar covalent'],
        answer: 'Ionic',
    },
    {
        id: 'bq2',
        question: 'A molecule of N₂ contains a triple bond. How many electrons are shared in this bond?',
        options: ['2', '4', '6', '3'],
        answer: '6',
    },
    {
        id: 'bq3',
        question: 'Which of these compounds has an ionic bond?',
        options: ['CO₂', 'H₂O', 'CH₄', 'MgCl₂'],
        answer: 'MgCl₂',
    },
    {
        id: 'bq4',
        question: 'What does the octet rule state?',
        options: [
            'Atoms form 8 bonds',
            'Atoms are stable with 8 neutrons',
            'Atoms tend to gain/lose/share electrons to achieve 8 valence electrons',
            'Eight atoms bond together',
        ],
        answer: 'Atoms tend to gain/lose/share electrons to achieve 8 valence electrons',
    },
    {
        id: 'bq5',
        question: 'Water (H₂O) is a polar molecule because:',
        options: [
            'Oxygen has more protons than hydrogen',
            'Oxygen is more electronegative and pulls electron density toward itself',
            'The hydrogen atoms are positively charged ions',
            'Water contains an ionic bond',
        ],
        answer: 'Oxygen is more electronegative and pulls electron density toward itself',
    },
];

const ConcludeStep: React.FC<{
    answers: Record<string, string>;
    onAnswer: (id: string, val: string) => void;
    submitted: boolean; onSubmit: () => void; score: number;
}> = ({ answers, onAnswer, submitted, onSubmit, score }) => (
    <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {submitted ? (
                <div className="text-center space-y-4">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-2 ${score >= 70 ? 'border-green-500 bg-green-900/30' : 'border-amber-500 bg-amber-900/30'}`}>
                        <span className="text-4xl font-black text-white">{score}%</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{score >= 70 ? '⚗️ Lab Complete!' : 'Review & Retry'}</h2>
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
                                <div className="space-y-2">
                                    {q.options.map(opt => (
                                        <button key={opt} onClick={() => onAnswer(q.id, opt)}
                                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${answers[q.id] === opt ? 'border-cyan-500 bg-cyan-900/20 text-cyan-300' : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500'}`}>
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

const ChemicalBondingLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [ionicScore, setIonicScore] = useState(0);
    const [covalentScore, setCovalentScore] = useState(0);
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
        <VirtualLabEngine<BondStep> config={ENGINE_CONFIG} lab={lab} studentId={studentId} onExit={onExit}>
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-900/20 rounded-xl border border-indigo-500/20">
                                        <Zap className="w-7 h-7 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Bond Forge</h2>
                                        <p className="text-slate-500 text-sm">Master ionic and covalent bonding through gameplay</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Chemical bonds form when atoms interact to achieve a more stable electron configuration. Ionic bonds involve electron <em>transfer</em>; covalent bonds involve electron <em>sharing</em>. The electronegativity difference determines which occurs.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl">
                                        <h3 className="text-amber-400 font-bold text-sm mb-2">⚡ Ionic</h3>
                                        <ul className="text-xs text-slate-400 space-y-1">
                                            <li>• Metal + non-metal</li>
                                            <li>• Electrons transferred</li>
                                            <li>• Forms ions (Na⁺, Cl⁻)</li>
                                            <li>• High melting points</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl">
                                        <h3 className="text-cyan-400 font-bold text-sm mb-2">🔗 Covalent</h3>
                                        <ul className="text-xs text-slate-400 space-y-1">
                                            <li>• Non-metal + non-metal</li>
                                            <li>• Electrons shared</li>
                                            <li>• Forms molecules</li>
                                            <li>• Low melting points</li>
                                        </ul>
                                    </div>
                                </div>
                                <button onClick={() => setStep('ionic')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Start Forging Bonds <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 'ionic' && (
                        <IonicGame
                            onComplete={setIonicScore}
                            addNote={addNote}
                            onNext={() => setStep('covalent')}
                        />
                    )}
                    {step === 'covalent' && (
                        <CovalentGame
                            onComplete={setCovalentScore}
                            addNote={addNote}
                            onNext={() => setStep('compare')}
                        />
                    )}
                    {step === 'compare' && <CompareStep onNext={() => setStep('conclude')} />}
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

export default ChemicalBondingLab;
