/**
 * AtomicStructureLab.tsx
 * "Particle Architect" — Build atoms by placing protons, neutrons, electrons.
 * Gamified: score, timer, progressive element unlocks, stability feedback.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Atom, ChevronRight, Star, Zap, Trophy } from 'lucide-react';

type AtomStep = 'intro' | 'build' | 'explore' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',    label: 'Theory',   description: 'Atomic structure fundamentals.' },
        { id: 'build',    label: 'Architect', description: 'Build atoms — earn points.' },
        { id: 'explore',  label: 'Explore',   description: 'Investigate periodic trends.' },
        { id: 'conclude', label: 'Conclude',  description: 'Assessment questions.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Element Data ─────────────────────────────────────────────────────────────

interface ElementData {
    symbol: string;
    name: string;
    Z: number;          // protons
    N: number;          // neutrons (most common isotope)
    shells: number[];   // electrons per shell
    group: string;
    color: string;
    points: number;
    fact: string;
}

const ELEMENTS: ElementData[] = [
    { symbol: 'H',  name: 'Hydrogen',   Z: 1,  N: 0,  shells: [1],       group: 'nonmetal',       color: '#38bdf8', points: 100, fact: 'Lightest element; makes up ~75% of all ordinary matter.' },
    { symbol: 'He', name: 'Helium',     Z: 2,  N: 2,  shells: [2],       group: 'noble gas',      color: '#a78bfa', points: 120, fact: 'Noble gas with full outer shell — completely unreactive.' },
    { symbol: 'Li', name: 'Lithium',    Z: 3,  N: 4,  shells: [2,1],     group: 'alkali metal',   color: '#fb923c', points: 150, fact: 'Lightest metal; used in rechargeable batteries.' },
    { symbol: 'Be', name: 'Beryllium',  Z: 4,  N: 5,  shells: [2,2],     group: 'alkaline earth', color: '#34d399', points: 160, fact: 'Used in aerospace alloys; its X-ray transparency makes it valuable in detectors.' },
    { symbol: 'C',  name: 'Carbon',     Z: 6,  N: 6,  shells: [2,4],     group: 'nonmetal',       color: '#94a3b8', points: 200, fact: 'Basis of all known life; forms more compounds than any other element.' },
    { symbol: 'N',  name: 'Nitrogen',   Z: 7,  N: 7,  shells: [2,5],     group: 'nonmetal',       color: '#60a5fa', points: 210, fact: 'Makes up 78% of Earth\'s atmosphere.' },
    { symbol: 'O',  name: 'Oxygen',     Z: 8,  N: 8,  shells: [2,6],     group: 'nonmetal',       color: '#f87171', points: 220, fact: 'Electronegativity of 3.44 — second most electronegative element.' },
    { symbol: 'Na', name: 'Sodium',     Z: 11, N: 12, shells: [2,8,1],   group: 'alkali metal',   color: '#fbbf24', points: 300, fact: 'One valence electron makes it highly reactive with water.' },
    { symbol: 'Mg', name: 'Magnesium',  Z: 12, N: 12, shells: [2,8,2],   group: 'alkaline earth', color: '#4ade80', points: 320, fact: 'Central atom in chlorophyll — essential for photosynthesis.' },
    { symbol: 'Cl', name: 'Chlorine',   Z: 17, N: 18, shells: [2,8,7],   group: 'halogen',        color: '#86efac', points: 400, fact: 'One electron short of a full outer shell — highly electronegative.' },
    { symbol: 'Ar', name: 'Argon',      Z: 18, N: 22, shells: [2,8,8],   group: 'noble gas',      color: '#c4b5fd', points: 420, fact: 'Third most abundant gas in Earth\'s atmosphere at ~1%.' },
    { symbol: 'Fe', name: 'Iron',       Z: 26, N: 30, shells: [2,8,14,2],group: 'transition',     color: '#f97316', points: 600, fact: 'Most common element on Earth by mass; core of Earth is molten iron.' },
];

const GROUP_COLORS: Record<string, string> = {
    'nonmetal':       'text-sky-400',
    'noble gas':      'text-violet-400',
    'alkali metal':   'text-orange-400',
    'alkaline earth': 'text-emerald-400',
    'halogen':        'text-green-400',
    'transition':     'text-amber-400',
};

// ─── Atom SVG Visualizer ──────────────────────────────────────────────────────

const AtomVisualizer: React.FC<{
    protons: number; neutrons: number; electrons: number[];
    targetElement?: ElementData; shaking?: boolean;
}> = ({ protons, neutrons, electrons, targetElement, shaking }) => {
    const SHELL_RADII = [40, 68, 96, 124];
    const cx = 120; const cy = 120;

    const totalElectrons = electrons.reduce((a, b) => a + b, 0);
    const isComplete = targetElement &&
        protons === targetElement.Z &&
        neutrons === targetElement.N &&
        JSON.stringify(electrons) === JSON.stringify(targetElement.shells);

    return (
        <svg
            width="240" height="240" viewBox="0 0 240 240"
            className={shaking ? 'animate-bounce' : ''}
            style={{ filter: isComplete ? 'drop-shadow(0 0 12px ' + (targetElement?.color || '#38bdf8') + ')' : 'none' }}
        >
            <defs>
                <radialGradient id="nucleus-grad">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
                </radialGradient>
                {SHELL_RADII.map((r, i) => (
                    <radialGradient key={i} id={`shell-glow-${i}`}>
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                    </radialGradient>
                ))}
            </defs>

            {/* Shell orbits */}
            {SHELL_RADII.map((r, i) => (
                electrons[i] !== undefined ? (
                    <circle key={i} cx={cx} cy={cy} r={r}
                        fill="none" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3,3" />
                ) : null
            ))}

            {/* Electrons on shells */}
            {electrons.map((count, shellIdx) => {
                const r = SHELL_RADII[shellIdx];
                return Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (2 * Math.PI * eIdx) / Math.max(count, 1) - Math.PI / 2;
                    const ex = cx + r * Math.cos(angle);
                    const ey = cy + r * Math.sin(angle);
                    return (
                        <g key={`${shellIdx}-${eIdx}`}>
                            <circle cx={ex} cy={ey} r="5" fill="#38bdf8" opacity="0.9" />
                            <circle cx={ex} cy={ey} r="8" fill="#38bdf8" opacity="0.15" />
                            <text x={ex} y={ey + 1} textAnchor="middle" dominantBaseline="middle"
                                fontSize="7" fill="white" fontWeight="bold">e⁻</text>
                        </g>
                    );
                });
            })}

            {/* Nucleus */}
            <circle cx={cx} cy={cy} r={Math.max(12, 8 + protons * 0.8 + neutrons * 0.5)}
                fill="url(#nucleus-grad)" />

            {/* Nucleus labels */}
            {protons > 0 && (
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                    {protons}p⁺
                </text>
            )}
            {neutrons > 0 && (
                <text x={cx} y={cy + 7} textAnchor="middle" fontSize="10" fill="#fcd34d" fontWeight="bold">
                    {neutrons}n
                </text>
            )}

            {/* Completion flash */}
            {isComplete && (
                <circle cx={cx} cy={cy} r={SHELL_RADII[electrons.length - 1] + 15}
                    fill="none" stroke={targetElement.color} strokeWidth="2" opacity="0.5">
                    <animate attributeName="r" values={`${SHELL_RADII[electrons.length - 1] + 10};${SHELL_RADII[electrons.length - 1] + 25};${SHELL_RADII[electrons.length - 1] + 10}`}
                        dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
                </circle>
            )}
        </svg>
    );
};

// ─── Build Step (main game) ───────────────────────────────────────────────────

const SHELL_MAX = [2, 8, 18, 8];

const BuildStep: React.FC<{
    onComplete: (score: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ onComplete, addNote, onNext }) => {
    const [currentElementIdx, setCurrentElementIdx] = useState(0);
    const [unlockedUpTo, setUnlockedUpTo] = useState(0);
    const [protons, setProtons] = useState(0);
    const [neutrons, setNeutrons] = useState(0);
    const [electrons, setElectrons] = useState<number[]>([0]);
    const [shaking, setShaking] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [points, setPoints] = useState(0);
    const [completed, setCompleted] = useState<Set<number>>(new Set());
    const [streak, setStreak] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const target = ELEMENTS[currentElementIdx];

    const totalElectrons = electrons.reduce((a, b) => a + b, 0);
    const currentShell = electrons.length - 1;

    const addParticle = (type: 'proton' | 'neutron') => {
        if (type === 'proton') setProtons(p => p + 1);
        else setNeutrons(n => n + 1);
        setFeedback(null);
    };

    const addElectron = () => {
        setElectrons(prev => {
            const updated = [...prev];
            const shell = updated.length - 1;
            if (updated[shell] < SHELL_MAX[shell]) {
                updated[shell]++;
            } else if (shell < 3) {
                updated.push(1);
            }
            return updated;
        });
        setFeedback(null);
    };

    const removeElectron = () => {
        setElectrons(prev => {
            const updated = [...prev];
            const shell = updated.length - 1;
            if (updated[shell] > 0) {
                updated[shell]--;
                if (updated[shell] === 0 && updated.length > 1) updated.pop();
            }
            return updated;
        });
    };

    const reset = () => {
        setProtons(0); setNeutrons(0); setElectrons([0]);
        setShaking(false); setFeedback(null); setShowSuccess(false);
    };

    const checkAtom = () => {
        const pOk = protons === target.Z;
        const nOk = neutrons === target.N;
        const eOk = JSON.stringify(electrons.filter(x => x > 0)) === JSON.stringify(target.shells);

        if (pOk && nOk && eOk) {
            const streakBonus = streak >= 2 ? Math.floor(target.points * 0.5) : 0;
            const earned = target.points + streakBonus;
            setPoints(p => p + earned);
            setStreak(s => s + 1);
            setCompleted(prev => new Set([...prev, currentElementIdx]));
            setUnlockedUpTo(u => Math.max(u, currentElementIdx + 1));
            setShowSuccess(true);
            setFeedback(`+${earned} pts${streakBonus ? ` (×${streak + 1} streak bonus!)` : ''}`);
            addNote(
                `Built ${target.name} (Z=${target.Z}): ${target.shells.join(',') } electron configuration. ${target.fact}`,
                `Particle Architect — ${target.name}`
            );
        } else {
            setShaking(true);
            setTimeout(() => setShaking(false), 600);
            const hints = [];
            if (!pOk) hints.push(`protons: need ${target.Z}, have ${protons}`);
            if (!nOk) hints.push(`neutrons: need ${target.N}, have ${neutrons}`);
            if (!eOk) hints.push(`electron shells: need [${target.shells.join(',')}], have [${electrons.filter(x=>x>0).join(',')}]`);
            setFeedback(`✗ Check: ${hints.join(' · ')}`);
            setStreak(0);
        }
    };

    const nextElement = () => {
        if (currentElementIdx < ELEMENTS.length - 1) {
            setCurrentElementIdx(i => i + 1);
            reset();
        } else {
            onComplete(points);
            onNext();
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Element selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-sm">Elements</h3>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold font-mono">{points}</span>
                    </div>
                </div>

                {streak >= 2 && (
                    <div className="mb-3 p-2 bg-amber-900/30 border border-amber-500/30 rounded-xl flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold">{streak}× streak! Bonus active</span>
                    </div>
                )}

                <div className="space-y-1.5 max-h-96 overflow-y-auto">
                    {ELEMENTS.map((el, i) => {
                        const isUnlocked = i <= unlockedUpTo;
                        const isDone = completed.has(i);
                        const isCurrent = i === currentElementIdx;
                        return (
                            <button key={el.symbol}
                                onClick={() => { if (isUnlocked) { setCurrentElementIdx(i); reset(); } }}
                                disabled={!isUnlocked}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
                                    isCurrent ? 'border-cyan-500/60 bg-cyan-900/10'
                                        : isDone ? 'border-green-500/30 bg-green-900/10'
                                        : isUnlocked ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                        : 'border-slate-800 bg-slate-900/50 opacity-40 cursor-not-allowed'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border"
                                    style={{ borderColor: el.color + '60', backgroundColor: el.color + '20', color: el.color }}>
                                    {el.symbol}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs font-medium">{el.name}</p>
                                    <p className={`text-xs ${GROUP_COLORS[el.group] || 'text-slate-500'}`}>{el.group}</p>
                                </div>
                                <div className="text-right">
                                    {isDone ? (
                                        <span className="text-green-400 text-xs">✓</span>
                                    ) : (
                                        <span className="text-slate-600 text-xs font-mono">{el.points}pt</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Atom builder */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                {/* Target card */}
                <div className="w-full p-3 rounded-xl border text-center"
                    style={{ borderColor: target.color + '40', backgroundColor: target.color + '10' }}>
                    <div className="text-3xl font-black" style={{ color: target.color }}>{target.symbol}</div>
                    <div className="text-white font-bold text-sm">{target.name}</div>
                    <div className="text-slate-500 text-xs mt-1">Z = {target.Z} · Build this atom</div>
                </div>

                <AtomVisualizer
                    protons={protons} neutrons={neutrons} electrons={electrons}
                    targetElement={target} shaking={shaking}
                />

                {/* Controls */}
                <div className="w-full grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase font-bold text-center">Protons</p>
                        <div className="flex gap-1">
                            <button onClick={() => setProtons(p => Math.max(0, p - 1))}
                                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold">−</button>
                            <span className="flex-1 flex items-center justify-center text-red-400 font-bold font-mono text-sm">{protons}</span>
                            <button onClick={() => addParticle('proton')}
                                className="flex-1 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg text-sm font-bold">+</button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase font-bold text-center">Neutrons</p>
                        <div className="flex gap-1">
                            <button onClick={() => setNeutrons(n => Math.max(0, n - 1))}
                                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold">−</button>
                            <span className="flex-1 flex items-center justify-center text-yellow-400 font-bold font-mono text-sm">{neutrons}</span>
                            <button onClick={() => addParticle('neutron')}
                                className="flex-1 py-1.5 bg-yellow-900/40 hover:bg-yellow-900/60 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm font-bold">+</button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase font-bold text-center">Electrons</p>
                        <div className="flex gap-1">
                            <button onClick={removeElectron}
                                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold">−</button>
                            <span className="flex-1 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">{totalElectrons}</span>
                            <button onClick={addElectron}
                                className="flex-1 py-1.5 bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-bold">+</button>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-600 font-mono">
                    Shell config: [{electrons.filter(x => x > 0).join(', ')}]
                </div>

                {feedback && (
                    <div className={`w-full p-3 rounded-xl border text-sm text-center font-medium ${
                        feedback.startsWith('+') ? 'border-green-500/30 bg-green-900/10 text-green-400'
                            : 'border-red-500/30 bg-red-900/10 text-red-400'
                    }`}>
                        {feedback}
                    </div>
                )}

                <div className="w-full flex gap-2">
                    <button onClick={reset}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-sm font-bold transition-colors">
                        Reset
                    </button>
                    {showSuccess ? (
                        <button onClick={nextElement}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                            {currentElementIdx < ELEMENTS.length - 1 ? 'Next Element →' : 'Finish →'}
                        </button>
                    ) : (
                        <button onClick={checkAtom}
                            className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors">
                            Check Atom
                        </button>
                    )}
                </div>
            </div>

            {/* Info panel */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm mb-3">Shell Rules</h3>
                    <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                            <span>Shell 1 (n=1)</span><span className="text-cyan-400 font-mono">max 2e⁻</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                            <span>Shell 2 (n=2)</span><span className="text-cyan-400 font-mono">max 8e⁻</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                            <span>Shell 3 (n=3)</span><span className="text-cyan-400 font-mono">max 18e⁻</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                            <span>Shell 4 (n=4)</span><span className="text-cyan-400 font-mono">max 8e⁻ (here)</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-3">Neutral atom: protons = electrons</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm mb-3">Current Target</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Proton number (Z)</span>
                            <span className="text-red-400 font-mono font-bold">{target.Z}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Neutrons</span>
                            <span className="text-yellow-400 font-mono font-bold">{target.N}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Mass number (A)</span>
                            <span className="text-white font-mono font-bold">{target.Z + target.N}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Electron config</span>
                            <span className="text-cyan-400 font-mono font-bold">[{target.shells.join(',')}]</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Group</span>
                            <span className={`font-bold ${GROUP_COLORS[target.group] || ''}`}>{target.group}</span>
                        </div>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800/60 rounded-lg">
                        <p className="text-xs text-slate-400 italic">💡 {target.fact}</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm mb-2">Score</h3>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-2xl font-black text-yellow-400 font-mono">{points}</span>
                        <span className="text-slate-600 text-sm">pts</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">{completed.size}/{ELEMENTS.length} elements built</div>
                    <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${(completed.size / ELEMENTS.length) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Explore Step ─────────────────────────────────────────────────────────────

const ExploreStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const [selected, setSelected] = useState<ElementData>(ELEMENTS[0]);

    const valenceElectrons = selected.shells[selected.shells.length - 1];
    const period = selected.shells.length;

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Periodic Trends Explorer</h2>
                <div className="grid grid-cols-4 gap-2">
                    {ELEMENTS.map(el => (
                        <button key={el.symbol} onClick={() => setSelected(el)}
                            className={`p-2 rounded-xl border transition-all text-center ${
                                selected.symbol === el.symbol
                                    ? 'border-cyan-400 bg-cyan-900/20'
                                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }`}
                            style={{ borderColor: selected.symbol === el.symbol ? el.color : undefined }}>
                            <div className="text-lg font-black" style={{ color: el.color }}>{el.symbol}</div>
                            <div className="text-xs text-slate-500">{el.Z}</div>
                        </button>
                    ))}
                </div>
                <button onClick={onNext} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Answer Questions <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black border-2"
                            style={{ borderColor: selected.color, backgroundColor: selected.color + '20', color: selected.color }}>
                            {selected.symbol}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white">{selected.name}</h3>
                            <p className={`text-sm font-bold ${GROUP_COLORS[selected.group] || ''}`}>{selected.group}</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        {[
                            ['Atomic number', selected.Z, 'text-red-400'],
                            ['Mass number', selected.Z + selected.N, 'text-white'],
                            ['Protons', selected.Z, 'text-red-400'],
                            ['Neutrons', selected.N, 'text-yellow-400'],
                            ['Electrons', selected.Z, 'text-cyan-400'],
                            ['Period (row)', period, 'text-purple-400'],
                            ['Valence electrons', valenceElectrons, 'text-green-400'],
                            ['Electron shells', `[${selected.shells.join(', ')}]`, 'text-cyan-400'],
                        ].map(([label, value, color]) => (
                            <div key={label as string} className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-400">{label}</span>
                                <span className={`font-bold font-mono ${color}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Element Fact</p>
                    <p className="text-slate-300 text-sm italic">{selected.fact}</p>
                </div>
            </div>
        </div>
    );
};

// ─── Conclude ────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
    {
        id: 'aq1',
        question: 'An atom of carbon-12 has 6 protons. How many neutrons does it have?',
        options: ['6', '12', '18', '0'],
        answer: '6',
    },
    {
        id: 'aq2',
        question: 'Which subatomic particles are found in the nucleus?',
        options: ['Protons and electrons', 'Protons and neutrons', 'Electrons and neutrons', 'Only protons'],
        answer: 'Protons and neutrons',
    },
    {
        id: 'aq3',
        question: 'Sodium (Na) has the electron configuration [2,8,1]. How many valence electrons does it have?',
        options: ['2', '8', '1', '11'],
        answer: '1',
    },
    {
        id: 'aq4',
        question: 'Two atoms of the same element with different numbers of neutrons are called:',
        options: ['Ions', 'Isotopes', 'Allotropes', 'Isomers'],
        answer: 'Isotopes',
    },
    {
        id: 'aq5',
        question: 'The atomic number of an element is defined as the number of:',
        options: ['Neutrons', 'Electrons in outer shell', 'Protons in the nucleus', 'Nucleons'],
        answer: 'Protons in the nucleus',
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
                    <h2 className="text-2xl font-bold text-white">{score >= 70 ? '🧪 Lab Complete!' : 'Keep Practicing!'}</h2>
                    <div className="space-y-3 text-left mt-4">
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
                                <p className="text-white text-sm font-medium mb-2"><span className="text-slate-600 mr-2">{i + 1}.</span>{q.question}</p>
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

const AtomicStructureLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [gameScore, setGameScore] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const handleSubmit = (completeLab: (s: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (answers[q.id] === q.answer) correct++; });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score);
        setSubmitted(true);
        completeLab(score);
    };

    return (
        <VirtualLabEngine<AtomStep> config={ENGINE_CONFIG} lab={lab} studentId={studentId} onExit={onExit}>
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                                        <Atom className="w-7 h-7 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Particle Architect</h2>
                                        <p className="text-slate-500 text-sm">Build atoms — earn points — unlock elements</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Every atom has a nucleus containing protons (positive) and neutrons (neutral), surrounded by electrons (negative) arranged in shells. The number of protons defines the element. Neutral atoms have equal protons and electrons.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { name: 'Proton', charge: '+1', location: 'Nucleus', color: '#f87171' },
                                        { name: 'Neutron', charge: '0', location: 'Nucleus', color: '#fbbf24' },
                                        { name: 'Electron', charge: '−1', location: 'Shells', color: '#38bdf8' },
                                    ].map(p => (
                                        <div key={p.name} className="p-3 rounded-xl border border-slate-700 bg-slate-800/50 text-center">
                                            <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: p.color + '40', border: `2px solid ${p.color}` }} />
                                            <p className="text-white font-bold text-sm">{p.name}</p>
                                            <p className="text-xs text-slate-500">Charge: <span style={{ color: p.color }}>{p.charge}</span></p>
                                            <p className="text-xs text-slate-600">{p.location}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">🎮 Game Rules</p>
                                    <ul className="text-sm text-slate-400 space-y-1">
                                        <li>• Build each element by setting the correct protons, neutrons & electron shells</li>
                                        <li>• Score points for each correct atom — bonus for streaks</li>
                                        <li>• Complete elements to unlock heavier ones</li>
                                        <li>• Wrong attempts break your streak but give hints</li>
                                    </ul>
                                </div>
                                <button onClick={() => setStep('build')}
                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Start Building <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 'build' && (
                        <BuildStep
                            onComplete={setGameScore}
                            addNote={addNote}
                            onNext={() => setStep('explore')}
                        />
                    )}
                    {step === 'explore' && <ExploreStep onNext={() => setStep('conclude')} />}
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

export default AtomicStructureLab;
