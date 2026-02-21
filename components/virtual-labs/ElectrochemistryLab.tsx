/**
 * ElectrochemistryLab.tsx
 * "Voltage Architect" — Build galvanic cells, predict EMF, identify electrode roles.
 * Gamified: prediction before reveal, EMF token currency, escalating half-cell challenges.
 */

import React, { useState, useRef, useEffect } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Zap, ChevronRight, Trophy, RotateCcw, Battery } from 'lucide-react';

type ElecStep = 'intro' | 'halfcells' | 'build' | 'electrolysis' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',        label: 'Theory',        description: 'Redox and electrochemistry.' },
        { id: 'halfcells',    label: 'Half-Cells',    description: 'Explore standard potentials.' },
        { id: 'build',        label: 'Build Cell',    description: 'Voltage Architect — the game.' },
        { id: 'electrolysis', label: 'Electrolysis',  description: 'Electrolytic cells.' },
        { id: 'conclude',     label: 'Conclude',      description: 'Assessment.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Half-Cell Data ───────────────────────────────────────────────────────────

interface HalfCell {
    id: string;
    oxidised: string;    // e.g. "Zn²⁺"
    reduced: string;     // e.g. "Zn"
    equation: string;    // e.g. "Zn²⁺ + 2e⁻ → Zn"
    E0: number;          // standard reduction potential in V
    color: string;
    metalColor: string;
    solnColor: string;
    description: string;
    locked: boolean;
}

const HALF_CELLS: HalfCell[] = [
    {
        id: 'zn', oxidised: 'Zn²⁺', reduced: 'Zn', equation: 'Zn²⁺ + 2e⁻ → Zn',
        E0: -0.76, color: '#94a3b8', metalColor: '#78716c', solnColor: 'rgba(120,113,108,0.2)',
        description: 'Zinc is a strong reducing agent — readily loses electrons. Low reduction potential.',
        locked: false,
    },
    {
        id: 'cu', oxidised: 'Cu²⁺', reduced: 'Cu', equation: 'Cu²⁺ + 2e⁻ → Cu',
        E0: +0.34, color: '#f97316', metalColor: '#b45309', solnColor: 'rgba(14,165,233,0.3)',
        description: 'Copper has a positive reduction potential — it prefers to be reduced (gain electrons).',
        locked: false,
    },
    {
        id: 'fe', oxidised: 'Fe²⁺', reduced: 'Fe', equation: 'Fe²⁺ + 2e⁻ → Fe',
        E0: -0.44, color: '#f59e0b', metalColor: '#92400e', solnColor: 'rgba(234,179,8,0.2)',
        description: 'Iron lies between zinc and copper in the reactivity series.',
        locked: false,
    },
    {
        id: 'ag', oxidised: 'Ag⁺', reduced: 'Ag', equation: 'Ag⁺ + e⁻ → Ag',
        E0: +0.80, color: '#e2e8f0', metalColor: '#94a3b8', solnColor: 'rgba(226,232,240,0.15)',
        description: 'Silver has a high reduction potential — a strong oxidising agent in solution.',
        locked: true,
    },
    {
        id: 'h2', oxidised: 'H⁺', reduced: 'H₂', equation: '2H⁺ + 2e⁻ → H₂',
        E0: 0.00, color: '#38bdf8', metalColor: '#0284c7', solnColor: 'rgba(56,189,248,0.1)',
        description: 'The standard hydrogen electrode (SHE) — the reference with E° = 0.00 V by definition.',
        locked: false,
    },
    {
        id: 'cl2', oxidised: 'Cl₂', reduced: 'Cl⁻', equation: 'Cl₂ + 2e⁻ → 2Cl⁻',
        E0: +1.36, color: '#86efac', metalColor: '#16a34a', solnColor: 'rgba(134,239,172,0.2)',
        description: 'Chlorine is a powerful oxidising agent — used in water purification and industry.',
        locked: true,
    },
];

// ─── Half-Cells Explorer ──────────────────────────────────────────────────────

const HalfCellsStep: React.FC<{ onNext: () => void; unlockedIds: Set<string> }> = ({ onNext, unlockedIds }) => {
    const [selected, setSelected] = useState<HalfCell>(HALF_CELLS[0]);
    const sorted = [...HALF_CELLS].sort((a, b) => a.E0 - b.E0);

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Standard Reduction Potentials</h2>
                <p className="text-slate-500 text-sm mb-4">The electrochemical series — higher E° = stronger oxidising agent</p>

                <div className="space-y-1">
                    {sorted.map(hc => {
                        const isLocked = hc.locked && !unlockedIds.has(hc.id);
                        return (
                            <button key={hc.id}
                                onClick={() => !isLocked && setSelected(hc)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                    selected.id === hc.id ? 'border-cyan-500/60 bg-cyan-900/10'
                                        : isLocked ? 'border-slate-800 bg-slate-900/50 opacity-40 cursor-not-allowed'
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm border"
                                    style={{ borderColor: hc.color + '60', backgroundColor: hc.color + '15', color: hc.color }}>
                                    {hc.reduced}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-mono">{hc.equation}</p>
                                    <p className="text-xs text-slate-500">E° = {hc.E0 >= 0 ? '+' : ''}{hc.E0.toFixed(2)} V</p>
                                </div>
                                <div className={`text-sm font-bold font-mono ${hc.E0 > 0 ? 'text-green-400' : hc.E0 < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                    {hc.E0 >= 0 ? '+' : ''}{hc.E0.toFixed(2)}V
                                </div>
                                {isLocked && <span className="text-slate-600 text-xs">🔒</span>}
                            </button>
                        );
                    })}
                </div>

                <button onClick={onNext} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Build a Galvanic Cell <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black border"
                            style={{ borderColor: selected.color + '60', backgroundColor: selected.color + '15', color: selected.color }}>
                            {selected.reduced}
                        </div>
                        <div>
                            <p className="text-white font-black font-mono">{selected.equation}</p>
                            <p className="text-slate-500 text-xs mt-0.5">Standard reduction half-reaction</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        {[
                            ['E° (reduction)', `${selected.E0 >= 0 ? '+' : ''}${selected.E0.toFixed(2)} V`, selected.E0 > 0 ? 'text-green-400' : 'text-red-400'],
                            ['Role tendency', selected.E0 < 0 ? 'Anode (oxidised)' : 'Cathode (reduced)', selected.E0 < 0 ? 'text-red-400' : 'text-green-400'],
                            ['Oxidised form', selected.oxidised, 'text-amber-400'],
                            ['Reduced form', selected.reduced, 'text-cyan-400'],
                        ].map(([label, value, color]) => (
                            <div key={label as string} className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-500">{label}</span>
                                <span className={`font-bold font-mono ${color}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic leading-relaxed">{selected.description}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Cell EMF Formula</p>
                    <div className="font-mono text-sm text-center p-3 bg-slate-950 rounded-xl space-y-1">
                        <p className="text-white">E°cell = E°cathode − E°anode</p>
                        <p className="text-slate-600 text-xs">cathode = higher E° = reduction</p>
                        <p className="text-slate-600 text-xs">anode = lower E° = oxidation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Voltage Architect Game ───────────────────────────────────────────────────

interface CellChallenge {
    id: string; name: string;
    anodeId: string; cathodeId: string;
    hints: string; points: number;
}

const CHALLENGES: CellChallenge[] = [
    { id: 'c1', name: 'Zinc-Copper Cell (Daniell Cell)', anodeId: 'zn', cathodeId: 'cu', hints: 'Zn has lower E° → anode. Cu has higher E° → cathode.', points: 200 },
    { id: 'c2', name: 'Iron-Copper Cell', anodeId: 'fe', cathodeId: 'cu', hints: 'Fe (E° = −0.44V) is oxidised; Cu (E° = +0.34V) is reduced.', points: 250 },
    { id: 'c3', name: 'Zinc-Hydrogen Cell', anodeId: 'zn', cathodeId: 'h2', hints: 'Zn (E° = −0.76V) is more negative → anode. H₂ electrode = cathode.', points: 280 },
    { id: 'c4', name: 'Iron-Silver Cell', anodeId: 'fe', cathodeId: 'ag', hints: 'Silver has the highest E° here → cathode. Iron → anode.', points: 350 },
];

const BuildStep: React.FC<{
    onComplete: (score: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
    onUnlock: (id: string) => void;
}> = ({ onComplete, addNote, onNext, onUnlock }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [anodeGuess, setAnodeGuess] = useState<string | null>(null);
    const [cathodeGuess, setCathodeGuess] = useState<string | null>(null);
    const [emfGuess, setEmfGuess] = useState<string>('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [tokens, setTokens] = useState(0); // EMF tokens
    const [animating, setAnimating] = useState(false);

    const challenge = CHALLENGES[currentIdx];
    const anodeCell = HALF_CELLS.find(h => h.id === challenge.anodeId)!;
    const cathodeCell = HALF_CELLS.find(h => h.id === challenge.cathodeId)!;
    const correctEMF = (cathodeCell.E0 - anodeCell.E0).toFixed(2);
    const availableCells = HALF_CELLS.filter(h => !h.locked || tokens >= 5);

    const handleCheck = () => {
        const anodeOk = anodeGuess === challenge.anodeId;
        const cathodeOk = cathodeGuess === challenge.cathodeId;
        const emfOk = Math.abs(parseFloat(emfGuess) - parseFloat(correctEMF)) < 0.05;
        const allOk = anodeOk && cathodeOk && emfOk;

        setChecked(true);
        setAnimating(true);

        if (allOk) {
            setScore(s => s + challenge.points);
            setTokens(t => t + 3);
            addNote(
                `Built ${challenge.name}: E°cell = ${correctEMF}V. Anode: ${anodeCell.equation} (oxidation). Cathode: ${cathodeCell.equation} (reduction).`,
                `Voltage Architect — ${challenge.name}`
            );
        } else {
            setTokens(t => Math.max(0, t - 1));
        }
        setTimeout(() => setAnimating(false), 1000);
    };

    const next = () => {
        if (currentIdx < CHALLENGES.length - 1) {
            setCurrentIdx(i => i + 1);
            setAnodeGuess(null); setCathodeGuess(null); setEmfGuess('');
            setChecked(false);
        } else {
            if (tokens >= 5) onUnlock('ag');
            if (tokens >= 8) onUnlock('cl2');
            onComplete(score);
            onNext();
        }
    };

    const anodeOk = anodeGuess === challenge.anodeId;
    const cathodeOk = cathodeGuess === challenge.cathodeId;
    const emfOk = checked && Math.abs(parseFloat(emfGuess) - parseFloat(correctEMF)) < 0.05;

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* HUD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                    <p className="text-white font-bold">{challenge.name}</p>
                    <p className="text-slate-500 text-xs">{currentIdx + 1}/{CHALLENGES.length} challenges</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-bold font-mono">{tokens}</span>
                        <span className="text-amber-600 text-xs">tokens</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold font-mono">{score}</span>
                    </div>
                </div>
            </div>

            {/* Cell diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="grid grid-cols-7 gap-2 items-center">
                    {/* Anode half-cell */}
                    <div className="col-span-3 flex flex-col items-center gap-3">
                        <p className="text-xs text-slate-500 uppercase font-bold">Anode (−) · Oxidation</p>
                        <div className={`w-full h-36 rounded-xl border-2 flex flex-col items-end justify-end pb-4 pr-4 transition-all ${
                            checked ? anodeOk ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'
                                : anodeGuess ? 'border-slate-500 bg-slate-800/50' : 'border-dashed border-slate-700 bg-slate-900/30'
                        }`}>
                            {anodeGuess ? (() => {
                                const cell = HALF_CELLS.find(h => h.id === anodeGuess)!;
                                return (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <div className="w-6 h-20 rounded" style={{ backgroundColor: cell.metalColor }} />
                                        <div className="absolute bottom-4 text-xs text-center">
                                            <p className="font-mono font-bold" style={{ color: cell.color }}>{cell.reduced}</p>
                                            <p className="text-slate-500 text-xs">{cell.equation}</p>
                                        </div>
                                    </div>
                                );
                            })() : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 text-sm">
                                    Select anode below
                                </div>
                            )}
                        </div>
                        {checked && !anodeOk && (
                            <p className="text-xs text-red-400">Correct anode: {anodeCell.reduced}</p>
                        )}
                    </div>

                    {/* Salt bridge + wire */}
                    <div className="col-span-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-center gap-1">
                            <div className="flex-1 h-0.5 bg-slate-600" />
                            <Battery className="w-5 h-5 text-cyan-400" />
                            <div className="flex-1 h-0.5 bg-slate-600" />
                        </div>
                        <div className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-400 text-center font-mono">
                            Salt<br/>Bridge
                        </div>
                        {checked && (
                            <div className="text-center">
                                <p className="text-xs text-slate-500">E°cell</p>
                                <p className={`text-lg font-black font-mono ${emfOk ? 'text-green-400' : 'text-red-400'}`}>
                                    {correctEMF}V
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Cathode half-cell */}
                    <div className="col-span-3 flex flex-col items-center gap-3">
                        <p className="text-xs text-slate-500 uppercase font-bold">Cathode (+) · Reduction</p>
                        <div className={`w-full h-36 rounded-xl border-2 flex flex-col items-end justify-end pb-4 pr-4 transition-all ${
                            checked ? cathodeOk ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'
                                : cathodeGuess ? 'border-slate-500 bg-slate-800/50' : 'border-dashed border-slate-700 bg-slate-900/30'
                        }`}>
                            {cathodeGuess ? (() => {
                                const cell = HALF_CELLS.find(h => h.id === cathodeGuess)!;
                                return (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <div className="w-6 h-20 rounded" style={{ backgroundColor: cell.metalColor }} />
                                    </div>
                                );
                            })() : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 text-sm">
                                    Select cathode below
                                </div>
                            )}
                        </div>
                        {checked && !cathodeOk && (
                            <p className="text-xs text-red-400">Correct cathode: {cathodeCell.reduced}</p>
                        )}
                    </div>
                </div>

                {/* EMF prediction */}
                <div className="mt-4 flex items-center gap-3">
                    <label className="text-slate-400 text-sm flex-shrink-0">Predicted E°cell (V):</label>
                    <input
                        type="number" step="0.01" value={emfGuess}
                        onChange={e => setEmfGuess(e.target.value)}
                        disabled={checked}
                        placeholder="e.g. 1.10"
                        className={`flex-1 bg-slate-800 border rounded-xl px-4 py-2 font-mono text-white text-sm focus:outline-none ${
                            checked ? emfOk ? 'border-green-500' : 'border-red-500' : 'border-slate-600 focus:border-cyan-500'
                        }`}
                    />
                    <div className="text-xs text-slate-600 font-mono">E° = E°cat − E°an</div>
                </div>
            </div>

            {/* Half-cell selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <p className="text-xs text-slate-500 uppercase font-bold mb-3">
                    Select Electrodes — click twice: first = anode (−), second = cathode (+)
                </p>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                    {availableCells.map(hc => (
                        <button key={hc.id}
                            onClick={() => {
                                if (checked) return;
                                if (!anodeGuess) setAnodeGuess(hc.id);
                                else if (!cathodeGuess && hc.id !== anodeGuess) setCathodeGuess(hc.id);
                            }}
                            disabled={checked}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                                anodeGuess === hc.id ? 'border-red-500 bg-red-900/20'
                                    : cathodeGuess === hc.id ? 'border-green-500 bg-green-900/20'
                                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}>
                            <div className="font-black font-mono text-sm" style={{ color: hc.color }}>{hc.reduced}</div>
                            <div className={`text-xs font-mono ${hc.E0 > 0 ? 'text-green-400' : hc.E0 < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                {hc.E0 >= 0 ? '+' : ''}{hc.E0.toFixed(2)}V
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {checked && (
                <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
                    anodeOk && cathodeOk && emfOk ? 'border-green-500/30 bg-green-900/10 text-green-400'
                        : 'border-amber-500/30 bg-amber-900/10 text-amber-300'
                }`}>
                    {anodeOk && cathodeOk && emfOk ? (
                        <p>✓ Perfect! {challenge.hints} E°cell = {cathodeCell.E0.toFixed(2)} − ({anodeCell.E0.toFixed(2)}) = <strong>{correctEMF}V</strong>. +{challenge.points} pts + 3 tokens!</p>
                    ) : (
                        <p>💡 {challenge.hints} E°cell = {cathodeCell.E0.toFixed(2)} − ({anodeCell.E0.toFixed(2)}) = {correctEMF}V</p>
                    )}
                </div>
            )}

            <div className="flex gap-3">
                {!checked ? (
                    <>
                        <button onClick={() => { setAnodeGuess(null); setCathodeGuess(null); setEmfGuess(''); }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-sm font-bold transition-colors flex items-center gap-1">
                            <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                        <button onClick={handleCheck}
                            disabled={!anodeGuess || !cathodeGuess || !emfGuess}
                            className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all">
                            ⚡ Reveal Cell EMF
                        </button>
                    </>
                ) : (
                    <button onClick={next} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                        {currentIdx < CHALLENGES.length - 1 ? 'Next Challenge →' : 'Electrolysis →'}
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Electrolysis Step ────────────────────────────────────────────────────────

const ElectrolysisStep: React.FC<{ onNext: () => void; addNote: (t: string, c?: string) => void }> = ({ onNext, addNote }) => {
    const [running, setRunning] = useState(false);
    const [selected, setSelected] = useState<'water' | 'nacl'>('water');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const bubblesRef = useRef<{ x: number; y: number; r: number; side: 'anode' | 'cathode'; vy: number }[]>([]);

    const configs = {
        water: {
            electrolyte: 'Dilute H₂SO₄ (acidified water)',
            anode: 'Oxygen (O₂)', cathodeP: 'Hydrogen (H₂)',
            anodeEq: '2H₂O → O₂ + 4H⁺ + 4e⁻',
            cathodeEq: '4H⁺ + 4e⁻ → 2H₂',
            ratio: '1:2', note: 'Twice as much H₂ at cathode as O₂ at anode — ratio 2:1',
            anodeColor: '#f87171', cathodeColor: '#38bdf8',
        },
        nacl: {
            electrolyte: 'Molten NaCl',
            anode: 'Chlorine (Cl₂)', cathodeP: 'Sodium (Na)',
            anodeEq: '2Cl⁻ → Cl₂ + 2e⁻',
            cathodeEq: 'Na⁺ + e⁻ → Na',
            ratio: '1:2', note: 'Industrial production of Cl₂ and Na metal (chlor-alkali process)',
            anodeColor: '#86efac', cathodeColor: '#fbbf24',
        },
    };
    const cfg = configs[selected];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        const animate = () => {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Electrolyte
            ctx.fillStyle = 'rgba(56,189,248,0.06)';
            ctx.fillRect(60, 40, canvas.width - 120, canvas.height - 80);

            // Electrodes
            ctx.fillStyle = '#475569';
            ctx.fillRect(80, 30, 12, canvas.height - 60);  // anode left
            ctx.fillRect(canvas.width - 92, 30, 12, canvas.height - 60); // cathode right

            // Labels
            ctx.fillStyle = cfg.anodeColor;
            ctx.font = 'bold 11px monospace';
            ctx.fillText('ANODE (+)', 74, 22);
            ctx.fillStyle = cfg.cathodeColor;
            ctx.fillText('CATHODE (−)', canvas.width - 110, 22);

            // Power supply wire
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(92, 30); ctx.lineTo(92, 10);
            ctx.lineTo(canvas.width - 86, 10); ctx.lineTo(canvas.width - 86, 30);
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('⚡ DC', canvas.width / 2 - 12, 8);

            // Spawn bubbles
            if (running && Math.random() < 0.15) {
                bubblesRef.current.push({
                    x: 95 + Math.random() * 5,
                    y: canvas.height - 50 + Math.random() * 10,
                    r: 3 + Math.random() * 3,
                    side: 'anode',
                    vy: -(0.5 + Math.random()),
                });
            }
            if (running && Math.random() < 0.25) {
                bubblesRef.current.push({
                    x: canvas.width - 90 + Math.random() * 5,
                    y: canvas.height - 50 + Math.random() * 10,
                    r: 3 + Math.random() * 3,
                    side: 'cathode',
                    vy: -(0.5 + Math.random()),
                });
            }

            bubblesRef.current = bubblesRef.current.filter(b => b.y > 0);
            bubblesRef.current.forEach(b => {
                b.y += b.vy;
                const col = b.side === 'anode' ? cfg.anodeColor : cfg.cathodeColor;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = col + '80';
                ctx.fill();
                ctx.strokeStyle = col;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Ion arrows (when running)
            if (running) {
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                // Cations move to cathode
                for (let x = 120; x < canvas.width - 120; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(x, canvas.height / 2);
                    ctx.lineTo(x + 30, canvas.height / 2);
                    ctx.stroke();
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillText('→', x + 25, canvas.height / 2 + 4);
                }
                ctx.setLineDash([]);
            }

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [running, selected]);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Electrolysis</h2>
                    <div className="flex gap-2">
                        {(['water', 'nacl'] as const).map(s => (
                            <button key={s} onClick={() => { setSelected(s); bubblesRef.current = []; }}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${selected === s ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                                {s === 'water' ? 'Acidified Water' : 'Molten NaCl'}
                            </button>
                        ))}
                    </div>
                </div>

                <canvas ref={canvasRef} width={520} height={200}
                    className="w-full rounded-xl border border-slate-800" />

                <div className="flex justify-center">
                    <button onClick={() => setRunning(r => !r)}
                        className={`px-8 py-2.5 font-bold rounded-xl border transition-all ${running ? 'bg-red-900/20 border-red-500 text-red-400 hover:bg-red-900/30' : 'bg-green-900/20 border-green-500 text-green-400 hover:bg-green-900/30'}`}>
                        {running ? '■ Stop Current' : '▶ Apply DC Current'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-xl border" style={{ borderColor: cfg.anodeColor + '40', backgroundColor: cfg.anodeColor + '10' }}>
                        <p className="font-bold mb-1" style={{ color: cfg.anodeColor }}>Anode (+) — Oxidation</p>
                        <p className="text-slate-400 text-xs mb-2 font-mono">{cfg.anodeEq}</p>
                        <p className="text-xs text-slate-500">Product: <strong className="text-white">{cfg.anode}</strong></p>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ borderColor: cfg.cathodeColor + '40', backgroundColor: cfg.cathodeColor + '10' }}>
                        <p className="font-bold mb-1" style={{ color: cfg.cathodeColor }}>Cathode (−) — Reduction</p>
                        <p className="text-slate-400 text-xs mb-2 font-mono">{cfg.cathodeEq}</p>
                        <p className="text-xs text-slate-500">Product: <strong className="text-white">{cfg.cathodeP}</strong></p>
                    </div>
                </div>

                <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-400">
                    🔬 {cfg.note}
                </div>

                <button onClick={() => { addNote(`Electrolysis of ${cfg.electrolyte}: anode → ${cfg.anode}, cathode → ${cfg.cathodeP}.`, 'Electrochemistry — Electrolysis'); onNext(); }}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Assessment <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ─── Quiz ─────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
    {
        id: 'eq1',
        question: 'In a galvanic cell, oxidation occurs at the:',
        options: ['Cathode', 'Anode', 'Salt bridge', 'Voltmeter'],
        answer: 'Anode',
    },
    {
        id: 'eq2',
        question: 'The Daniell cell uses Zn (E° = −0.76V) and Cu (E° = +0.34V). What is the cell EMF?',
        options: ['−0.42 V', '0.42 V', '1.10 V', '−1.10 V'],
        answer: '1.10 V',
    },
    {
        id: 'eq3',
        question: 'What is the role of the salt bridge in a galvanic cell?',
        options: [
            'To allow electrons to flow',
            'To maintain electrical neutrality by allowing ion movement',
            'To increase the cell voltage',
            'To prevent the reaction from occurring'
        ],
        answer: 'To maintain electrical neutrality by allowing ion movement',
    },
    {
        id: 'eq4',
        question: 'In the electrolysis of acidified water, which gas is produced at the cathode?',
        options: ['Oxygen', 'Chlorine', 'Hydrogen', 'Water vapour'],
        answer: 'Hydrogen',
    },
    {
        id: 'eq5',
        question: 'A species with a more positive standard reduction potential is:',
        options: [
            'A stronger reducing agent',
            'More likely to be oxidised',
            'A stronger oxidising agent',
            'Less stable when reduced'
        ],
        answer: 'A stronger oxidising agent',
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
                    <h2 className="text-2xl font-bold text-white">{score >= 70 ? '⚡ Lab Complete!' : 'Review & Retry'}</h2>
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

const ElectrochemistryLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const handleUnlock = (id: string) => setUnlockedIds(prev => new Set([...prev, id]));

    const handleSubmit = (completeLab: (s: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (answers[q.id] === q.answer) correct++; });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score); setSubmitted(true); completeLab(score);
    };

    return (
        <VirtualLabEngine<ElecStep> config={ENGINE_CONFIG} lab={lab} studentId={studentId} onExit={onExit}>
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-500/20">
                                        <Zap className="w-7 h-7 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Voltage Architect</h2>
                                        <p className="text-slate-500 text-sm">Build galvanic cells · Predict EMF · Earn tokens</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Electrochemistry links chemistry and electricity. Redox reactions (electron transfer) can generate electrical energy in galvanic cells, or be driven by electricity in electrolytic cells.
                                </p>
                                <div className="space-y-2 font-mono text-sm">
                                    {[
                                        ['Oxidation', 'Loss of electrons (OIL)', '#f97316'],
                                        ['Reduction', 'Gain of electrons (RIG)', '#38bdf8'],
                                        ['E°cell', 'E°cathode − E°anode', '#fbbf24'],
                                    ].map(([term, def, color]) => (
                                        <div key={term as string} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                                            <span className="w-24 font-bold text-xs" style={{ color: color as string }}>{term}</span>
                                            <span className="text-slate-400 text-xs">{def}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">🎮 Earn EMF Tokens</p>
                                    <ul className="text-sm text-slate-400 space-y-1">
                                        <li>• Predict anode, cathode, and cell voltage before each reveal</li>
                                        <li>• Earn 3 tokens per correct cell — lose 1 per wrong prediction</li>
                                        <li>• Spend tokens to unlock exotic half-cells (Ag⁺/Ag, Cl₂/Cl⁻)</li>
                                    </ul>
                                </div>
                                <button onClick={() => setStep('halfcells')} className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Explore Half-Cells <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 'halfcells' && <HalfCellsStep onNext={() => setStep('build')} unlockedIds={unlockedIds} />}
                    {step === 'build' && (
                        <BuildStep
                            onComplete={() => {}}
                            addNote={addNote}
                            onNext={() => setStep('electrolysis')}
                            onUnlock={handleUnlock}
                        />
                    )}
                    {step === 'electrolysis' && <ElectrolysisStep onNext={() => setStep('conclude')} addNote={addNote} />}
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

export default ElectrochemistryLab;
