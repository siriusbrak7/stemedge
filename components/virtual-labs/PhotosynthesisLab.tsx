/**
 * PhotosynthesisLab.tsx
 * 
 * Virtual Lab: Photosynthesis Rate — Effect of Light Intensity on Elodea
 * Style: Step-by-step setup + bubble counting simulation + data table + SVG line graph + conclusions
 * 
 * Steps: intro → setup → experiment → graph → conclude
 */

import React, { useState, useEffect, useRef } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Sun, ChevronRight } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type PhotoStep = 'intro' | 'setup' | 'experiment' | 'graph' | 'conclude';

interface LightLevel {
    distance: number;    // cm from light source
    label: string;
    intensity: number;   // arbitrary units (inverse sq law relative)
    bubblesPerMin: number;
    color: string;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',      label: 'Introduction', description: 'Learn how light affects photosynthesis.' },
        { id: 'setup',      label: 'Setup',         description: 'Prepare Elodea and apparatus.' },
        { id: 'experiment', label: 'Experiment',    description: 'Count oxygen bubbles at each light distance.' },
        { id: 'graph',      label: 'Graph',         description: 'Plot your results as a line graph.' },
        { id: 'conclude',   label: 'Conclude',      description: 'Interpret your results.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Data ───────────────────────────────────────────────────────────────────────

const LIGHT_LEVELS: LightLevel[] = [
    { distance: 5,   label: '5 cm',   intensity: 400, bubblesPerMin: 48, color: '#fde68a' },
    { distance: 10,  label: '10 cm',  intensity: 100, bubblesPerMin: 31, color: '#fcd34d' },
    { distance: 20,  label: '20 cm',  intensity: 25,  bubblesPerMin: 18, color: '#f59e0b' },
    { distance: 30,  label: '30 cm',  intensity: 11,  bubblesPerMin: 9,  color: '#d97706' },
    { distance: 40,  label: '40 cm',  intensity: 6,   bubblesPerMin: 4,  color: '#92400e' },
];

const QUIZ_QUESTIONS = [
    {
        id: 'pq1',
        question: 'What is the independent variable in this investigation?',
        options: ['Rate of photosynthesis', 'Light intensity / distance from source', 'Amount of CO₂', 'Temperature of water'],
        answer: 'Light intensity / distance from source',
    },
    {
        id: 'pq2',
        question: 'As light intensity increases, the rate of photosynthesis:',
        options: ['Decreases', 'Stays the same', 'Increases, then plateaus at limiting factors', 'Always increases linearly'],
        answer: 'Increases, then plateaus at limiting factors',
    },
    {
        id: 'pq3',
        question: 'Why are oxygen bubbles used to measure the rate of photosynthesis in this experiment?',
        options: [
            'Oxygen is absorbed during photosynthesis',
            'Oxygen is a product of photosynthesis and easy to count',
            'Oxygen changes the colour of the water',
            'Oxygen dissolves in sodium hydrogen carbonate'
        ],
        answer: 'Oxygen is a product of photosynthesis and easy to count',
    },
    {
        id: 'pq4',
        question: 'What is added to the water to ensure carbon dioxide is not a limiting factor?',
        options: ['Iodine solution', 'Sodium hydrogen carbonate', 'Methylene blue', 'Universal indicator'],
        answer: 'Sodium hydrogen carbonate',
    },
];

// ─── Elodea Animation ──────────────────────────────────────────────────────────

const ElodeaSimulation: React.FC<{
    running: boolean;
    bubblesPerMin: number;
    lightColor: string;
    distance: number;
}> = ({ running, bubblesPerMin, lightColor, distance }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bubblesRef = useRef<Array<{ x: number; y: number; r: number; vy: number; opacity: number }>>([]);
    const frameRef = useRef<number>(0);
    const tickRef = useRef(0);
    // Bubble spawn rate: bubblesPerMin / 60 per second, canvas runs ~30fps so per frame = rate/30
    const spawnChance = (bubblesPerMin / 60) / 30;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.width;
        const H = canvas.height;

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Water background
            const waterGrad = ctx.createLinearGradient(0, 0, 0, H);
            waterGrad.addColorStop(0, '#0c4a6e');
            waterGrad.addColorStop(1, '#164e63');
            ctx.fillStyle = waterGrad;
            ctx.fillRect(0, 0, W, H);

            // Light rays from top
            const rayAlpha = Math.max(0, 0.15 - distance / 300);
            if (rayAlpha > 0) {
                for (let i = 0; i < 4; i++) {
                    const x = W * (0.2 + i * 0.2);
                    const grad = ctx.createLinearGradient(x, 0, x + 10, H * 0.7);
                    grad.addColorStop(0, `rgba(253,230,138,${rayAlpha})`);
                    grad.addColorStop(1, `rgba(253,230,138,0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(x - 5, 0);
                    ctx.lineTo(x + 5, 0);
                    ctx.lineTo(x + 20, H * 0.7);
                    ctx.lineTo(x + 10, H * 0.7);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            // Elodea stems (SVG-like shapes)
            const stemCount = 3;
            for (let s = 0; s < stemCount; s++) {
                const baseX = W * (0.25 + s * 0.25);
                // Stem
                ctx.strokeStyle = '#166534';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(baseX, H * 0.95);
                ctx.bezierCurveTo(baseX - 10, H * 0.7, baseX + 10, H * 0.5, baseX, H * 0.2);
                ctx.stroke();

                // Leaves (pairs)
                for (let l = 0; l < 5; l++) {
                    const t = l / 4;
                    const lx = baseX + Math.sin(t * Math.PI) * 8;
                    const ly = H * 0.2 + t * H * 0.75;
                    const leafLen = 14 - l * 1.5;
                    // Left leaf
                    ctx.fillStyle = '#16a34a';
                    ctx.beginPath();
                    ctx.ellipse(lx - leafLen / 2, ly, leafLen / 2, 4, -Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    // Right leaf
                    ctx.beginPath();
                    ctx.ellipse(lx + leafLen / 2, ly, leafLen / 2, 4, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Spawn bubbles near tips of stems
            if (running && Math.random() < spawnChance) {
                const stemX = W * (0.25 + Math.floor(Math.random() * 3) * 0.25);
                bubblesRef.current.push({
                    x: stemX + (Math.random() - 0.5) * 20,
                    y: H * 0.2 + Math.random() * 0.1 * H,
                    r: 2 + Math.random() * 3,
                    vy: -(0.5 + Math.random() * 0.7),
                    opacity: 0.85,
                });
            }

            // Update + draw bubbles
            bubblesRef.current = bubblesRef.current.filter(b => b.opacity > 0.05 && b.y > 0);
            bubblesRef.current.forEach(b => {
                b.y += b.vy;
                b.x += Math.sin(b.y * 0.05) * 0.3;
                b.opacity -= 0.006;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(186,230,253,${b.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = `rgba(186,230,253,${b.opacity * 0.15})`;
                ctx.fill();
            });

            frameRef.current = requestAnimationFrame(draw);
        };

        frameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameRef.current);
    }, [running, spawnChance, distance]);

    return (
        <div className="relative">
            <canvas ref={canvasRef} width={220} height={280} className="rounded-xl border border-slate-700" />
            {/* Light source indicator */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div style={{ backgroundColor: lightColor, boxShadow: `0 0 ${Math.max(5, 40 - distance)}px ${lightColor}` }}
                    className="w-10 h-10 rounded-full flex items-center justify-center">
                    <Sun className="w-5 h-5 text-slate-900" />
                </div>
                <div className="w-px bg-gradient-to-b from-yellow-300/50 to-transparent h-8 mt-1" />
            </div>
        </div>
    );
};

// ─── SVG Line Graph ─────────────────────────────────────────────────────────────

const LineGraph: React.FC<{
    completedDistances: Set<number>;
}> = ({ completedDistances }) => {
    const W = 340;
    const H = 200;
    const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const maxBubbles = 50;
    const distances = LIGHT_LEVELS.map(l => l.distance);
    const maxDist = 40;

    const toX = (dist: number) => PAD.left + (dist / maxDist) * innerW;
    const toY = (bubbles: number) => PAD.top + innerH - (bubbles / maxBubbles) * innerH;

    const completedPoints = LIGHT_LEVELS
        .filter(l => completedDistances.has(l.distance))
        .sort((a, b) => a.distance - b.distance);

    const pathD = completedPoints.length > 1
        ? completedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.distance)} ${toY(p.bubblesPerMin)}`).join(' ')
        : '';

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Rate of Photosynthesis vs Light Distance</h3>
            <svg width={W} height={H} className="overflow-visible">
                {/* Grid lines */}
                {[0, 10, 20, 30, 40, 50].map(v => (
                    <line key={v} x1={PAD.left} y1={toY(v)} x2={W - PAD.right} y2={toY(v)}
                        stroke="#1e293b" strokeWidth="1" />
                ))}

                {/* Axes */}
                <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#475569" strokeWidth="1.5" />
                <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#475569" strokeWidth="1.5" />

                {/* Y axis labels */}
                {[0, 10, 20, 30, 40, 50].map(v => (
                    <text key={v} x={PAD.left - 8} y={toY(v) + 4} textAnchor="end" fill="#64748b" fontSize="10">{v}</text>
                ))}

                {/* X axis labels */}
                {LIGHT_LEVELS.map(l => (
                    <text key={l.distance} x={toX(l.distance)} y={H - PAD.bottom + 16} textAnchor="middle" fill="#64748b" fontSize="10">{l.distance}</text>
                ))}

                {/* Axis labels */}
                <text x={PAD.left - 35} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize="10"
                    transform={`rotate(-90, ${PAD.left - 35}, ${H / 2})`}>Bubbles / min</text>
                <text x={W / 2} y={H - 2} textAnchor="middle" fill="#94a3b8" fontSize="10">Distance (cm)</text>

                {/* Line */}
                {pathD && (
                    <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" />
                )}

                {/* Points */}
                {completedPoints.map(p => (
                    <g key={p.distance}>
                        <circle cx={toX(p.distance)} cy={toY(p.bubblesPerMin)} r="5"
                            fill="#22d3ee" stroke="#0e7490" strokeWidth="2" />
                        <text x={toX(p.distance)} y={toY(p.bubblesPerMin) - 10}
                            textAnchor="middle" fill="#22d3ee" fontSize="9">{p.bubblesPerMin}</text>
                    </g>
                ))}

                {/* Empty point placeholders */}
                {LIGHT_LEVELS.filter(l => !completedDistances.has(l.distance)).map(l => (
                    <circle key={l.distance} cx={toX(l.distance)} cy={toY(0) - 2} r="4"
                        fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,2" />
                ))}
            </svg>
            <p className="text-xs text-slate-600 text-center mt-2">
                {completedPoints.length}/{LIGHT_LEVELS.length} data points collected
            </p>
        </div>
    );
};

// ─── Experiment Step ────────────────────────────────────────────────────────────

const ExperimentStep: React.FC<{
    completedDistances: Set<number>;
    onComplete: (d: number) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ completedDistances, onComplete, addNote, onNext }) => {
    const [selected, setSelected] = useState<LightLevel>(LIGHT_LEVELS[0]);
    const [running, setRunning] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const TRIAL_DURATION = 6; // seconds (simulated 1 minute)

    const handleStart = () => {
        setRunning(true);
        setCountdown(TRIAL_DURATION);
        timerRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(timerRef.current!);
                    setRunning(false);
                    onComplete(selected.distance);
                    addNote(
                        `Light at ${selected.distance}cm: ${selected.bubblesPerMin} bubbles/min recorded.`,
                        `Photosynthesis — ${selected.label}`
                    );
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const allDone = LIGHT_LEVELS.every(l => completedDistances.has(l.distance));

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Simulation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4 pt-14">
                <ElodeaSimulation
                    running={running}
                    bubblesPerMin={running ? selected.bubblesPerMin : 0}
                    lightColor={selected.color}
                    distance={selected.distance}
                />

                {/* Count display */}
                <div className="w-full grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-slate-500">Distance</p>
                        <p className="text-white font-bold text-lg mt-0.5">{selected.distance} cm</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-slate-500">Bubbles / min</p>
                        <p className="font-bold text-lg mt-0.5 text-cyan-400">
                            {completedDistances.has(selected.distance) ? selected.bubblesPerMin : '—'}
                        </p>
                    </div>
                </div>

                {running ? (
                    <div className="w-full">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Counting oxygen bubbles...</span>
                            <span>{countdown}s</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 transition-all duration-1000 rounded-full"
                                style={{ width: `${((TRIAL_DURATION - countdown) / TRIAL_DURATION) * 100}%` }} />
                        </div>
                    </div>
                ) : completedDistances.has(selected.distance) ? (
                    <div className="w-full p-3 bg-green-900/20 border border-green-500/30 rounded-xl text-center">
                        <p className="text-green-400 font-bold text-sm">✓ {selected.bubblesPerMin} bubbles/min recorded</p>
                    </div>
                ) : (
                    <button
                        onClick={handleStart}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Sun className="w-4 h-4" /> Count Bubbles at {selected.distance}cm
                    </button>
                )}
            </div>

            {/* Right: Controls + mini table */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Select Light Distance</h3>
                    <div className="space-y-2">
                        {LIGHT_LEVELS.map(ll => (
                            <button
                                key={ll.distance}
                                onClick={() => { setSelected(ll); setRunning(false); setCountdown(0); }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                    selected.distance === ll.distance
                                        ? 'border-yellow-500/60 bg-yellow-900/10'
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ll.color }} />
                                <span className="text-sm text-white flex-1">{ll.label}</span>
                                {completedDistances.has(ll.distance) && (
                                    <span className="text-xs text-green-400 font-bold">✓ {ll.bubblesPerMin} bpm</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Progress</p>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-yellow-400 transition-all rounded-full"
                            style={{ width: `${(completedDistances.size / LIGHT_LEVELS.length) * 100}%` }} />
                    </div>
                    <p className="text-slate-500 text-xs">{completedDistances.size}/{LIGHT_LEVELS.length} trials done</p>
                </div>

                <button
                    onClick={onNext}
                    disabled={!allDone}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {allDone ? 'Plot Graph →' : `${LIGHT_LEVELS.length - completedDistances.size} trials remaining`}
                </button>
            </div>
        </div>
    );
};

// ─── Main Lab Component ─────────────────────────────────────────────────────────

interface Props {
    lab: VirtualLab;
    studentId: string;
    onExit: () => void;
}

const PhotosynthesisLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [completedDistances, setCompletedDistances] = useState<Set<number>>(new Set());
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const setupItems = [
        { id: 'elodea', label: 'Cut a 10cm piece of Elodea pondweed and trim the stem at an angle' },
        { id: 'beaker', label: 'Fill a 400ml beaker with sodium hydrogen carbonate solution' },
        { id: 'place', label: 'Place Elodea upside-down in the beaker (cut end up)' },
        { id: 'lamp', label: 'Position a 100W lamp as the light source' },
        { id: 'ruler', label: 'Set up a metre ruler to measure lamp distance accurately' },
    ];

    const handleSubmit = (completeLab: (score: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (quizAnswers[q.id] === q.answer) correct++; });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score);
        setQuizSubmitted(true);
        completeLab(score);
    };

    return (
        <VirtualLabEngine<PhotoStep>
            config={ENGINE_CONFIG}
            lab={lab}
            studentId={studentId}
            onExit={onExit}
        >
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-yellow-900/20 rounded-xl border border-yellow-500/20">
                                        <Sun className="w-7 h-7 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Photosynthesis Rate Lab</h2>
                                        <p className="text-slate-500 text-sm">Effect of Light Intensity on Elodea</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    You will investigate how the distance of a light source from Elodea (water weed) affects the rate of photosynthesis. Oxygen bubbles from the cut stem are counted as a measure of photosynthetic rate.
                                </p>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 font-mono text-sm text-center text-green-300">
                                    6CO₂ + 6H₂O <span className="text-yellow-400 mx-2">+ light energy →</span> C₆H₁₂O₆ + 6O₂
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                        <p className="text-slate-500 text-xs uppercase font-bold mb-2">Dependent Variable</p>
                                        <p className="text-white">Bubbles of O₂ per minute</p>
                                    </div>
                                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                        <p className="text-slate-500 text-xs uppercase font-bold mb-2">Independent Variable</p>
                                        <p className="text-white">Distance from light (cm)</p>
                                    </div>
                                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 col-span-2">
                                        <p className="text-slate-500 text-xs uppercase font-bold mb-2">Control Variables</p>
                                        <p className="text-white text-xs">Temperature, CO₂ concentration (NaHCO₃), Elodea length, light wavelength</p>
                                    </div>
                                </div>
                                <button onClick={() => setStep('setup')} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Begin Lab <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'setup' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Apparatus Setup</h2>
                                <div className="space-y-3">
                                    {setupItems.map((item, i) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setCheckedItems(prev => new Set([...prev, item.id]))}
                                            className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                                                checkedItems.has(item.id)
                                                    ? 'bg-green-900/20 border-green-500/40 text-green-300'
                                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                                            }`}
                                        >
                                            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${checkedItems.has(item.id) ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                                                {checkedItems.has(item.id) && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <span className="text-sm">
                                                <span className="text-slate-600 font-mono mr-2">{String(i + 1).padStart(2, '0')}.</span>{item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep('experiment')}
                                    disabled={checkedItems.size < setupItems.length}
                                    className="mt-6 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 disabled:opacity-40 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {checkedItems.size === setupItems.length ? 'Start Counting →' : `${setupItems.length - checkedItems.size} steps remaining`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'experiment' && (
                        <ExperimentStep
                            completedDistances={completedDistances}
                            onComplete={d => setCompletedDistances(prev => new Set([...prev, d]))}
                            addNote={addNote}
                            onNext={() => setStep('graph')}
                        />
                    )}

                    {step === 'graph' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <LineGraph completedDistances={completedDistances} />
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-white font-bold mb-3">Interpretation</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Your graph shows a negative correlation — as distance increases (light intensity decreases), the rate of photosynthesis decreases. This demonstrates that light is a limiting factor. At very close distances, other factors (CO₂ concentration, temperature) may become limiting.
                                </p>
                                <button
                                    onClick={() => setStep('conclude')}
                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    Conclusion Questions <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'conclude' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                {quizSubmitted ? (
                                    <div className="text-center">
                                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 border-2 ${quizScore >= 70 ? 'border-green-500 bg-green-900/30' : 'border-amber-500 bg-amber-900/30'}`}>
                                            <span className="text-3xl font-bold text-white">{quizScore}%</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-6">{quizScore >= 70 ? 'Lab Complete!' : 'Good Attempt'}</h2>
                                        <div className="space-y-3 text-left">
                                            {QUIZ_QUESTIONS.map(q => {
                                                const correct = quizAnswers[q.id] === q.answer;
                                                return (
                                                    <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                                        <p className="text-sm text-white font-medium mb-1">{q.question}</p>
                                                        <p className="text-xs text-slate-400">Your: <span className={correct ? 'text-green-400' : 'text-red-400'}>{quizAnswers[q.id]}</span></p>
                                                        {!correct && <p className="text-xs text-slate-400 mt-0.5">Correct: <span className="text-green-400">{q.answer}</span></p>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-white mb-6">Conclusion Questions</h2>
                                        <div className="space-y-6">
                                            {QUIZ_QUESTIONS.map((q, i) => (
                                                <div key={q.id}>
                                                    <p className="text-white text-sm font-medium mb-3">
                                                        <span className="text-slate-600 mr-2">{i + 1}.</span>{q.question}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {q.options.map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                                                                    quizAnswers[q.id] === opt
                                                                        ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
                                                                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500'
                                                                }`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleSubmit(completeLab)}
                                            disabled={!QUIZ_QUESTIONS.every(q => quizAnswers[q.id])}
                                            className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all"
                                        >
                                            Submit Lab Report
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </VirtualLabEngine>
    );
};

export default PhotosynthesisLab;