/**
 * AcidsBasesLab.tsx
 * "pH Defender" — Neutralise incoming acid/base waves by dropping the right reagent.
 * Gamified: pH meter, lives, waves, precision scoring.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Droplets, ChevronRight, Trophy, Heart, Shield } from 'lucide-react';

type AcidStep = 'intro' | 'theory' | 'defend' | 'indicators' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',      label: 'Theory',     description: 'pH scale and acids/bases.' },
        { id: 'theory',     label: 'pH Scale',   description: 'Explore the pH scale.' },
        { id: 'defend',     label: 'Defend!',    description: 'pH Defender — the game.' },
        { id: 'indicators', label: 'Indicators', description: 'Indicator colours.' },
        { id: 'conclude',   label: 'Conclude',   description: 'Assessment.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── pH Scale data ────────────────────────────────────────────────────────────

interface PHSolution {
    name: string; pH: number; color: string; type: 'strong acid' | 'weak acid' | 'neutral' | 'weak base' | 'strong base';
    concentration?: string;
}

const PH_SCALE: PHSolution[] = [
    { name: 'Hydrochloric Acid (conc.)', pH: 0,  color: '#dc2626', type: 'strong acid', concentration: '1 mol/L' },
    { name: 'Stomach Acid', pH: 1.5, color: '#ef4444', type: 'strong acid' },
    { name: 'Lemon Juice',  pH: 2.5, color: '#f97316', type: 'weak acid' },
    { name: 'Vinegar',      pH: 3.0, color: '#fb923c', type: 'weak acid' },
    { name: 'Coffee',       pH: 5.0, color: '#f59e0b', type: 'weak acid' },
    { name: 'Pure Water',   pH: 7.0, color: '#22c55e', type: 'neutral' },
    { name: 'Blood',        pH: 7.4, color: '#86efac', type: 'weak base' },
    { name: 'Baking Soda',  pH: 8.5, color: '#60a5fa', type: 'weak base' },
    { name: 'Soap',         pH: 9.5, color: '#818cf8', type: 'weak base' },
    { name: 'Ammonia',      pH: 11,  color: '#a78bfa', type: 'strong base' },
    { name: 'Bleach',       pH: 12.5,color: '#c084fc', type: 'strong base' },
    { name: 'Sodium Hydroxide (conc.)', pH: 14, color: '#7c3aed', type: 'strong base', concentration: '1 mol/L' },
];

function getPHColor(pH: number): string {
    if (pH < 2) return '#dc2626';
    if (pH < 4) return '#f97316';
    if (pH < 6) return '#f59e0b';
    if (pH < 7) return '#84cc16';
    if (pH === 7) return '#22c55e';
    if (pH <= 8) return '#34d399';
    if (pH <= 10) return '#60a5fa';
    if (pH <= 12) return '#818cf8';
    return '#7c3aed';
}

// ─── pH Scale Explorer ────────────────────────────────────────────────────────

const PHScaleStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const [selected, setSelected] = useState<PHSolution>(PH_SCALE[5]);

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">pH Scale Explorer</h2>
                <div className="space-y-1">
                    {PH_SCALE.map(sol => (
                        <button key={sol.name} onClick={() => setSelected(sol)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${selected.name === sol.name ? 'border-white/20 bg-slate-800' : 'border-slate-800 hover:border-slate-700'}`}>
                            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: sol.color }} />
                            <span className="flex-1 text-slate-300 text-sm">{sol.name}</span>
                            <span className="font-mono font-bold text-sm" style={{ color: sol.color }}>pH {sol.pH}</span>
                        </button>
                    ))}
                </div>
                <button onClick={onNext} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Play pH Defender <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Selected solution card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
                            style={{ backgroundColor: selected.color + '30', border: `2px solid ${selected.color}`, color: selected.color }}>
                            {selected.pH}
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{selected.name}</h3>
                            <p className="text-sm font-bold capitalize" style={{ color: selected.color }}>{selected.type}</p>
                        </div>
                    </div>

                    {/* pH bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Acid (0)</span><span>Neutral (7)</span><span>Base (14)</span>
                        </div>
                        <div className="h-4 rounded-full overflow-hidden" style={{
                            background: 'linear-gradient(to right, #dc2626, #f97316, #f59e0b, #22c55e, #60a5fa, #7c3aed)'
                        }}>
                            <div className="h-full flex items-center" style={{ marginLeft: `${(selected.pH / 14) * 100}%` }}>
                                <div className="w-3 h-3 bg-white rounded-full -translate-x-1.5 shadow-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-500">H⁺ concentration</span>
                            <span className="text-white font-mono">10⁻{selected.pH} mol/L</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-500">Dominant ion</span>
                            <span className="font-bold" style={{ color: selected.color }}>
                                {selected.pH < 7 ? 'H₃O⁺ (excess)' : selected.pH === 7 ? 'H⁺ = OH⁻' : 'OH⁻ (excess)'}
                            </span>
                        </div>
                        {selected.concentration && (
                            <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-500">Concentration</span>
                                <span className="text-white font-mono">{selected.concentration}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Key equations */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-3">Key Equations</p>
                    <div className="space-y-2 text-xs font-mono">
                        <div className="p-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-300">
                            pH = −log₁₀[H⁺]
                        </div>
                        <div className="p-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-300">
                            pH + pOH = 14
                        </div>
                        <div className="p-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-300">
                            Kw = [H⁺][OH⁻] = 10⁻¹⁴
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── pH Defender Game ─────────────────────────────────────────────────────────

interface Wave {
    id: number; type: 'acid' | 'base'; strength: 'weak' | 'strong';
    name: string; pH: number; position: number; // 0-100% across screen
    speed: number; color: string;
}

interface Reagent {
    id: string; name: string; formula: string;
    targets: 'acid' | 'base'; strength: 'weak' | 'strong';
    color: string;
}

const REAGENTS: Reagent[] = [
    { id: 'naoh',    name: 'NaOH (strong)',   formula: 'NaOH',    targets: 'acid', strength: 'strong', color: '#7c3aed' },
    { id: 'nahco3',  name: 'NaHCO₃ (weak)',  formula: 'NaHCO₃',  targets: 'acid', strength: 'weak',   color: '#60a5fa' },
    { id: 'hcl',     name: 'HCl (strong)',    formula: 'HCl',     targets: 'base', strength: 'strong', color: '#dc2626' },
    { id: 'ch3cooh', name: 'CH₃COOH (weak)', formula: 'CH₃COOH', targets: 'base', strength: 'weak',   color: '#f97316' },
];

const WAVE_TEMPLATES = [
    { type: 'acid' as const,  strength: 'strong' as const, name: 'HCl (pH 1)',   pH: 1,  color: '#ef4444' },
    { type: 'acid' as const,  strength: 'weak' as const,   name: 'H₂CO₃ (pH 4)', pH: 4,  color: '#f97316' },
    { type: 'base' as const,  strength: 'strong' as const, name: 'NaOH (pH 13)', pH: 13, color: '#7c3aed' },
    { type: 'base' as const,  strength: 'weak' as const,   name: 'NH₃ (pH 10)',  pH: 10, color: '#818cf8' },
];

const DefendStep: React.FC<{
    onComplete: (score: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ onComplete, addNote, onNext }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over' | 'won'>('idle');
    const [pH, setPH] = useState(7.0);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(0);
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
    const [selectedReagent, setSelectedReagent] = useState<Reagent>(REAGENTS[0]);
    const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const waveIdRef = useRef(0);

    const TOTAL_WAVES = 8;

    const spawnWave = useCallback((waveNum: number) => {
        const template = WAVE_TEMPLATES[waveNum % WAVE_TEMPLATES.length];
        const w: Wave = {
            ...template,
            id: ++waveIdRef.current,
            position: 0,
            speed: 0.4 + waveNum * 0.08,
        };
        setCurrentWave(w);
    }, []);

    useEffect(() => {
        if (gameState !== 'playing' || !currentWave) return;

        frameRef.current = setInterval(() => {
            setCurrentWave(prev => {
                if (!prev) return null;
                const newPos = prev.position + prev.speed;
                if (newPos >= 100) {
                    // Reached the solution — damage pH
                    if (prev.type === 'acid') setPH(p => Math.max(0, p - (prev.strength === 'strong' ? 2 : 0.8)));
                    else setPH(p => Math.min(14, p + (prev.strength === 'strong' ? 2 : 0.8)));
                    setLives(l => l - 1);
                    setFeedback({ text: `${prev.name} hit! pH shifted!`, color: '#ef4444' });
                    setTimeout(() => setFeedback(null), 1500);
                    return null;
                }
                return { ...prev, position: newPos };
            });
        }, 50);

        return () => { if (frameRef.current) clearInterval(frameRef.current); };
    }, [gameState, currentWave?.id]);

    useEffect(() => {
        if (lives <= 0) { setGameState('over'); onComplete(score); }
    }, [lives]);

    useEffect(() => {
        if (!currentWave && gameState === 'playing') {
            const nextWave = wave;
            if (nextWave >= TOTAL_WAVES) {
                setGameState('won');
                onComplete(score);
            } else {
                setTimeout(() => {
                    setWave(w => w + 1);
                    spawnWave(nextWave);
                }, 1000);
            }
        }
    }, [currentWave, gameState]);

    const handleIntercept = () => {
        if (!currentWave || gameState !== 'playing') return;
        const reagent = selectedReagent;
        const correct = reagent.targets === currentWave.type &&
            (currentWave.strength === 'strong' ? reagent.strength === 'strong' : true);

        if (correct) {
            const pts = currentWave.strength === 'strong' ? 200 : 100;
            const precision = Math.max(0, Math.floor((1 - currentWave.position / 100) * pts));
            setScore(s => s + pts + precision);
            setPH(p => {
                const target = 7;
                return p + (target - p) * 0.4;
            });
            setFeedback({ text: `✓ Neutralised! +${pts + precision} pts`, color: '#22c55e' });
            addNote(`Neutralised ${currentWave.name} with ${reagent.name}. pH corrected toward 7.`, 'pH Defender');
        } else {
            setPH(p => {
                if (currentWave.type === 'acid') return Math.max(0, p - 0.5);
                return Math.min(14, p + 0.5);
            });
            setFeedback({ text: `✗ Wrong reagent! Use ${currentWave.type === 'acid' ? 'a base' : 'an acid'}`, color: '#f97316' });
        }
        setTimeout(() => setFeedback(null), 1500);
        setCurrentWave(null);
    };

    const pHColor = getPHColor(pH);
    const pHStatus = pH < 6 ? 'Too Acidic!' : pH > 8 ? 'Too Basic!' : pH >= 6.5 && pH <= 7.5 ? 'Neutral ✓' : 'Slight shift';

    return (
        <div className="max-w-3xl mx-auto">
            {gameState === 'idle' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
                    <Shield className="w-16 h-16 text-cyan-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-white">pH Defender</h2>
                    <p className="text-slate-400">Acid and base "particles" will attack your neutral solution (pH 7). Drop the correct neutralising agent to intercept them before they hit. Maintaining pH between 6.5–7.5 earns precision bonuses.</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 font-bold">Acid incoming?</p>
                            <p className="text-slate-500 text-xs mt-1">Drop a BASE to neutralise</p>
                        </div>
                        <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                            <p className="text-purple-400 font-bold">Base incoming?</p>
                            <p className="text-slate-500 text-xs mt-1">Drop an ACID to neutralise</p>
                        </div>
                    </div>
                    <button onClick={() => { setGameState('playing'); spawnWave(0); }}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                        Start Defending!
                    </button>
                </div>
            )}

            {(gameState === 'playing') && (
                <div className="space-y-4">
                    {/* HUD */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-400 fill-red-400' : 'text-slate-700'}`} />
                            ))}
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-600">pH</div>
                            <div className="text-2xl font-black font-mono" style={{ color: pHColor }}>{pH.toFixed(1)}</div>
                            <div className="text-xs" style={{ color: pHColor }}>{pHStatus}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-bold font-mono">{score}</span>
                        </div>
                    </div>

                    {/* pH bar */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                        <div className="h-6 rounded-full overflow-hidden relative" style={{
                            background: 'linear-gradient(to right, #dc2626, #f97316, #f59e0b, #22c55e, #60a5fa, #7c3aed)'
                        }}>
                            {/* Danger zones */}
                            <div className="absolute left-0 top-0 h-full w-[43%] bg-red-900/20" />
                            <div className="absolute right-0 top-0 h-full w-[43%] bg-purple-900/20" />
                            {/* Safe zone marker */}
                            <div className="absolute top-0 h-full"
                                style={{ left: '43%', width: '14%', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '999px' }} />
                            {/* pH cursor */}
                            <div className="absolute top-0 h-full flex items-center transition-all duration-300"
                                style={{ left: `${(pH / 14) * 100}%` }}>
                                <div className="w-4 h-4 bg-white rounded-full -translate-x-2 shadow-xl" />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 mt-1">
                            <span>0 (acid)</span><span>7 (neutral)</span><span>14 (base)</span>
                        </div>
                    </div>

                    {/* Wave track */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-slate-500 uppercase font-bold">Incoming: Wave {wave}/{TOTAL_WAVES}</p>
                            {currentWave && <p className="text-sm font-bold" style={{ color: currentWave.color }}>{currentWave.name}</p>}
                        </div>

                        {/* Track */}
                        <div className="relative h-16 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 text-xs">YOUR SOLUTION</div>
                            {currentWave && (
                                <div className="absolute top-1/2 -translate-y-1/2 transition-none"
                                    style={{ left: `${currentWave.position}%` }}>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 animate-pulse"
                                            style={{ backgroundColor: currentWave.color + '40', borderColor: currentWave.color, color: currentWave.color }}>
                                            {currentWave.type === 'acid' ? 'H⁺' : 'OH⁻'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!currentWave && gameState === 'playing' && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-sm">
                                    Next wave incoming...
                                </div>
                            )}
                        </div>

                        {feedback && (
                            <div className="mt-2 text-center text-sm font-bold transition-all" style={{ color: feedback.color }}>
                                {feedback.text}
                            </div>
                        )}
                    </div>

                    {/* Reagent selector + intercept */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-3">Select Reagent</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {REAGENTS.map(r => (
                                <button key={r.id} onClick={() => setSelectedReagent(r)}
                                    className={`p-3 rounded-xl border text-left transition-all ${selectedReagent.id === r.id ? 'border-white/30 bg-slate-800' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                                    <div className="font-black font-mono text-sm" style={{ color: r.color }}>{r.formula}</div>
                                    <div className="text-xs text-slate-500">{r.targets === 'acid' ? 'Neutralises acid' : 'Neutralises base'} · {r.strength}</div>
                                </button>
                            ))}
                        </div>
                        <button onClick={handleIntercept} disabled={!currentWave}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:opacity-40 text-white font-black rounded-xl transition-all text-lg">
                            ⚡ INTERCEPT!
                        </button>
                    </div>
                </div>
            )}

            {(gameState === 'won' || gameState === 'over') && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
                    <div className="text-5xl">{gameState === 'won' ? '🛡️' : '💧'}</div>
                    <h2 className="text-2xl font-bold text-white">{gameState === 'won' ? 'Solution Defended!' : 'pH Breached!'}</h2>
                    <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <span className="text-4xl font-black text-yellow-400 font-mono">{score}</span>
                        <span className="text-slate-500">points</span>
                    </div>
                    <div className="p-3 rounded-xl border font-mono text-xl font-black" style={{ color: getPHColor(pH), borderColor: getPHColor(pH) + '40' }}>
                        Final pH: {pH.toFixed(1)}
                    </div>
                    <button onClick={onNext} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors">
                        Indicators →
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Indicators Step ──────────────────────────────────────────────────────────

const INDICATORS = [
    { name: 'Litmus', acid: { color: '#ef4444', label: 'Red' }, alkali: { color: '#818cf8', label: 'Blue' }, neutral: { color: '#a855f7', label: 'Purple' }, range: '6–8' },
    { name: 'Universal Indicator', acid: { color: '#ef4444', label: 'Red/Orange' }, alkali: { color: '#7c3aed', label: 'Blue/Violet' }, neutral: { color: '#22c55e', label: 'Green' }, range: '1–14' },
    { name: "Methyl Orange", acid: { color: '#ef4444', label: 'Red' }, alkali: { color: '#f59e0b', label: 'Yellow' }, neutral: { color: '#f97316', label: 'Orange' }, range: '3.1–4.4' },
    { name: 'Phenolphthalein', acid: { color: 'transparent', label: 'Colourless' }, alkali: { color: '#f9a8d4', label: 'Pink/Red' }, neutral: { color: 'transparent', label: 'Colourless' }, range: '8.2–10' },
];

const IndicatorsStep: React.FC<{ onNext: () => void; addNote: (t: string, c?: string) => void }> = ({ onNext, addNote }) => {
    const [testPH, setTestPH] = useState(7);

    const getIndicatorColor = (ind: typeof INDICATORS[0]) => {
        if (testPH < 6) return ind.acid;
        if (testPH > 8) return ind.alkali;
        return ind.neutral;
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Acid-Base Indicators</h2>

                {/* pH slider */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-400 text-sm">Test pH</p>
                        <span className="text-2xl font-black font-mono" style={{ color: getPHColor(testPH) }}>{testPH}</span>
                    </div>
                    <input type="range" min="0" max="14" step="0.5" value={testPH}
                        onChange={e => setTestPH(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400" />
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>0 — Strong acid</span><span>7 — Neutral</span><span>14 — Strong base</span>
                    </div>
                </div>

                {/* Indicator test tubes */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {INDICATORS.map(ind => {
                        const result = getIndicatorColor(ind);
                        const transparent = result.color === 'transparent';
                        return (
                            <div key={ind.name} className="flex flex-col items-center gap-3">
                                {/* Test tube */}
                                <div className="flex flex-col items-center gap-1">
                                    <svg width="50" height="100" viewBox="0 0 50 100">
                                        <path d="M 15,10 L 15,70 Q 15,90 25,90 Q 35,90 35,70 L 35,10"
                                            fill={transparent ? 'rgba(226,232,240,0.05)' : result.color + 'cc'}
                                            stroke="#475569" strokeWidth="1.5" />
                                        <rect x="13" y="6" width="24" height="5" rx="2" fill="#64748b" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-xs font-bold">{ind.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: transparent ? '#64748b' : result.color }}>
                                        {result.label}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1">Range: {ind.range}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 p-3 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-400">
                    💡 Indicators are weak acids/bases that have different colours in their protonated and deprotonated forms. The pH determines which form dominates.
                </div>

                <button onClick={() => { addNote('Explored indicator colours across pH range.', 'Acids & Bases — Indicators'); onNext(); }}
                    className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    Assessment <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ─── Quiz ─────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
    {
        id: 'phq1',
        question: 'A solution with pH 3 is:',
        options: ['Neutral', 'Weakly basic', 'Strongly acidic', 'Weakly acidic'],
        answer: 'Strongly acidic',
    },
    {
        id: 'phq2',
        question: 'What is the H⁺ ion concentration at pH 4?',
        options: ['10⁻² mol/L', '4 mol/L', '10⁻⁴ mol/L', '10⁴ mol/L'],
        answer: '10⁻⁴ mol/L',
    },
    {
        id: 'phq3',
        question: 'Which indicator is best for detecting the exact endpoint of a titration between a strong acid and strong base?',
        options: ['Litmus', 'Universal indicator', 'Phenolphthalein', 'Methyl orange'],
        answer: 'Phenolphthalein',
    },
    {
        id: 'phq4',
        question: 'Neutralisation of HCl with NaOH produces:',
        options: ['H₂O only', 'NaCl + H₂O', 'Na₂O + HCl', 'NaOH only'],
        answer: 'NaCl + H₂O',
    },
    {
        id: 'phq5',
        question: 'A buffer solution resists pH changes because:',
        options: [
            'It has no H⁺ ions',
            'It contains a weak acid/base pair that can absorb added H⁺ or OH⁻',
            'It is always at pH 7',
            'It removes all strong acids'
        ],
        answer: 'It contains a weak acid/base pair that can absorb added H⁺ or OH⁻',
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
                    <h2 className="text-2xl font-bold text-white">{score >= 70 ? '🛡️ Lab Complete!' : 'Review & Retry'}</h2>
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

const AcidsBasesLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
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
        <VirtualLabEngine<AcidStep> config={ENGINE_CONFIG} lab={lab} studentId={studentId} onExit={onExit}>
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-900/20 rounded-xl border border-red-500/20">
                                        <Droplets className="w-7 h-7 text-red-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">pH Defender</h2>
                                        <p className="text-slate-500 text-sm">Master acids, bases, and the pH scale</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Acids donate protons (H⁺) in solution. Bases accept protons or donate hydroxide (OH⁻). The pH scale (0–14) measures H⁺ concentration logarithmically — each unit represents a 10× change.
                                </p>
                                <div className="font-mono text-center p-4 bg-slate-950 rounded-xl space-y-1">
                                    <p className="text-white">pH = −log₁₀[H⁺]</p>
                                    <p className="text-slate-600 text-xs">Acid + Base → Salt + Water</p>
                                </div>
                                <button onClick={() => setStep('theory')} className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Explore pH Scale <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 'theory' && <PHScaleStep onNext={() => setStep('defend')} />}
                    {step === 'defend' && <DefendStep onComplete={() => {}} addNote={addNote} onNext={() => setStep('indicators')} />}
                    {step === 'indicators' && <IndicatorsStep onNext={() => setStep('conclude')} addNote={addNote} />}
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

export default AcidsBasesLab;
