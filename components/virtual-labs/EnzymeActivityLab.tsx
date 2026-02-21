/**
 * EnzymeActivityLab.tsx
 * 
 * Virtual Lab: Enzyme Activity — Effect of Temperature on Catalase
 * Style: Canvas simulation (bubble rate) + data collection + bar graph + MCQ conclusions
 * 
 * Steps: intro → setup → experiment → graph → conclude
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Thermometer, ChevronRight, Play, Square, FlaskConical } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type EnzymeStep = 'intro' | 'setup' | 'experiment' | 'graph' | 'conclude';

interface TemperatureRun {
    temp: number;
    label: string;
    color: string;
    bubbleRate: number;   // bubbles per second at ideal conditions
    activity: number;     // 0-100 enzyme activity %
    denatureLevel: number; // 0 = none, 1 = partial, 2 = full
    note: string;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',      label: 'Introduction', description: 'Understand enzymes and temperature.' },
        { id: 'setup',      label: 'Setup',         description: 'Prepare catalase and H₂O₂ solutions.' },
        { id: 'experiment', label: 'Experiment',    description: 'Run trials at each temperature.' },
        { id: 'graph',      label: 'Graph',         description: 'Plot your results.' },
        { id: 'conclude',   label: 'Conclude',      description: 'Interpret your data.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Experiment Data ────────────────────────────────────────────────────────────

const TEMPERATURE_RUNS: TemperatureRun[] = [
    { temp: 10,  label: '10°C (Ice Bath)',    color: '#38bdf8', bubbleRate: 1,   activity: 15,  denatureLevel: 0, note: 'Reaction very slow. Low kinetic energy reduces substrate-enzyme collisions.' },
    { temp: 25,  label: '25°C (Room Temp)',   color: '#a3e635', bubbleRate: 3,   activity: 55,  denatureLevel: 0, note: 'Moderate activity. Enzyme shape maintained, collision frequency increasing.' },
    { temp: 37,  label: '37°C (Body Temp)',   color: '#22d3ee', bubbleRate: 6,   activity: 100, denatureLevel: 0, note: 'Optimum temperature! Maximum activity — active site perfectly shaped.' },
    { temp: 55,  label: '55°C (Warm)',        color: '#f59e0b', bubbleRate: 2,   activity: 30,  denatureLevel: 1, note: 'Partially denatured. Active site shape distorted by excess heat energy.' },
    { temp: 80,  label: '80°C (Hot)',         color: '#ef4444', bubbleRate: 0,   activity: 0,   denatureLevel: 2, note: 'Fully denatured. Permanent change to tertiary structure. No activity.' },
];

const QUIZ_QUESTIONS = [
    {
        id: 'eq1',
        question: 'At 37°C, catalase shows maximum activity. What term describes this temperature?',
        options: ['Denaturation point', 'Optimum temperature', 'Activation energy', 'Saturation point'],
        answer: 'Optimum temperature',
    },
    {
        id: 'eq2',
        question: 'Why does enzyme activity drop to zero at 80°C?',
        options: ['The substrate runs out', 'The enzyme has denatured', 'The pH is too high', 'There is no oxygen'],
        answer: 'The enzyme has denatured',
    },
    {
        id: 'eq3',
        question: 'Which word describes the permanent change to an enzyme\'s shape at high temperatures?',
        options: ['Inhibition', 'Saturation', 'Denaturation', 'Activation'],
        answer: 'Denaturation',
    },
    {
        id: 'eq4',
        question: 'Why is catalase activity lower at 10°C than at 37°C?',
        options: [
            'The enzyme has denatured',
            'There are fewer enzyme-substrate collisions due to low kinetic energy',
            'The substrate concentration is too high',
            'The pH is too acidic'
        ],
        answer: 'There are fewer enzyme-substrate collisions due to low kinetic energy',
    },
];

// ─── Bubble Canvas Simulation ───────────────────────────────────────────────────

interface Bubble {
    x: number;
    y: number;
    r: number;
    vy: number;
    vx: number;
    opacity: number;
}

const BubbleSimulation: React.FC<{
    running: boolean;
    bubbleRate: number; // 0-6
    denatureLevel: number;
}> = ({ running, bubbleRate, denatureLevel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bubblesRef = useRef<Bubble[]>([]);
    const frameRef = useRef<number>(0);
    const tickRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;

        const spawn = () => {
            if (bubbleRate === 0) return;
            const count = Math.random() < (bubbleRate / 6) ? 1 : 0;
            for (let i = 0; i < count; i++) {
                bubblesRef.current.push({
                    x: W * 0.3 + Math.random() * W * 0.4,
                    y: H * 0.85,
                    r: 3 + Math.random() * 5,
                    vy: -(0.6 + Math.random() * 0.8),
                    vx: (Math.random() - 0.5) * 0.4,
                    opacity: 0.9,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Beaker body
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(W * 0.1, H * 0.15, W * 0.8, H * 0.75, [0, 0, 12, 12]);
            ctx.fill();

            // Liquid
            const liquidColor = denatureLevel === 2 ? '#7f1d1d' : denatureLevel === 1 ? '#713f12' : '#164e63';
            ctx.fillStyle = liquidColor;
            ctx.beginPath();
            ctx.roundRect(W * 0.12, H * 0.2, W * 0.76, H * 0.66, [0, 0, 10, 10]);
            ctx.fill();

            // Beaker outline
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(W * 0.1, H * 0.15, W * 0.8, H * 0.75, [0, 0, 12, 12]);
            ctx.stroke();

            // Graduated marks
            for (let i = 1; i <= 4; i++) {
                const y = H * 0.2 + (H * 0.66 / 5) * i;
                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(W * 0.12, y);
                ctx.lineTo(W * 0.22, y);
                ctx.stroke();
            }

            // Denatured protein strands
            if (denatureLevel > 0) {
                ctx.strokeStyle = `rgba(239,68,68,${denatureLevel === 2 ? 0.6 : 0.3})`;
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 4 * denatureLevel; i++) {
                    const sx = W * 0.2 + Math.random() * W * 0.6;
                    const sy = H * 0.3 + Math.random() * H * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    for (let j = 0; j < 4; j++) {
                        ctx.lineTo(sx + (Math.random() - 0.5) * 20, sy + (Math.random() - 0.5) * 20);
                    }
                    ctx.stroke();
                }
            }

            // Bubbles
            if (running) {
                tickRef.current++;
                if (tickRef.current % Math.max(1, Math.round(12 / Math.max(0.1, bubbleRate))) === 0) {
                    spawn();
                }
            }

            bubblesRef.current = bubblesRef.current.filter(b => b.y > H * 0.1 && b.opacity > 0.05);
            bubblesRef.current.forEach(b => {
                b.y += b.vy;
                b.x += b.vx;
                b.opacity -= 0.008;

                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(186,230,253,${b.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.fillStyle = `rgba(186,230,253,${b.opacity * 0.2})`;
                ctx.fill();
            });

            frameRef.current = requestAnimationFrame(draw);
        };

        frameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameRef.current);
    }, [running, bubbleRate, denatureLevel]);

    return <canvas ref={canvasRef} width={200} height={260} className="rounded-xl" />;
};

// ─── Bar Graph ─────────────────────────────────────────────────────────────────

const ActivityBarGraph: React.FC<{
    completedTemps: Set<number>;
    hoveredTemp: number | null;
    onHover: (t: number | null) => void;
}> = ({ completedTemps, hoveredTemp, onHover }) => {
    const maxActivity = 100;
    const graphH = 180;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Activity vs Temperature Graph</h3>
            <div className="flex items-end gap-3 h-[180px] relative border-b border-l border-slate-700 pb-2 pl-8 mb-6">
                {/* Y axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-600 pr-1">
                    {[100, 75, 50, 25, 0].map(v => <span key={v}>{v}</span>)}
                </div>

                {TEMPERATURE_RUNS.map(run => {
                    const isCompleted = completedTemps.has(run.temp);
                    const barH = isCompleted ? (run.activity / maxActivity) * graphH : 0;
                    const isHovered = hoveredTemp === run.temp;

                    return (
                        <div
                            key={run.temp}
                            className="flex-1 flex flex-col items-center"
                            onMouseEnter={() => onHover(run.temp)}
                            onMouseLeave={() => onHover(null)}
                        >
                            <div className="relative w-full flex justify-center">
                                {isHovered && isCompleted && (
                                    <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                        {run.activity}%
                                    </div>
                                )}
                                <div
                                    className="w-full max-w-[32px] rounded-t-md transition-all duration-500"
                                    style={{
                                        height: barH,
                                        backgroundColor: isCompleted ? run.color : '#1e293b',
                                        border: isCompleted ? 'none' : '2px dashed #334155',
                                        minHeight: isCompleted ? 4 : graphH,
                                        opacity: isHovered ? 0.8 : 1,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-slate-500 mt-2 text-center">{run.temp}°C</span>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-slate-500 text-center">Temperature (°C) vs Relative Enzyme Activity (%)</p>
        </div>
    );
};

// ─── Experiment Step ────────────────────────────────────────────────────────────

const ExperimentStep: React.FC<{
    completedTemps: Set<number>;
    onCompleteTemp: (temp: number) => void;
    addNote: (text: string, context?: string) => void;
    onNext: () => void;
}> = ({ completedTemps, onCompleteTemp, addNote, onNext }) => {
    const [selectedRun, setSelectedRun] = useState<TemperatureRun>(TEMPERATURE_RUNS[0]);
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleStart = () => {
        setRunning(true);
        setElapsed(0);
        timerRef.current = setInterval(() => {
            setElapsed(e => {
                if (e >= 5) {
                    setRunning(false);
                    clearInterval(timerRef.current!);
                    onCompleteTemp(selectedRun.temp);
                    addNote(
                        `Trial at ${selectedRun.temp}°C: Activity = ${selectedRun.activity}%. ${selectedRun.note}`,
                        `Enzyme Lab — ${selectedRun.label}`
                    );
                    return 5;
                }
                return e + 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const allDone = TEMPERATURE_RUNS.every(r => completedTemps.has(r.temp));

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Simulation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                <h3 className="text-white font-bold self-start">Reaction Chamber</h3>

                <BubbleSimulation
                    running={running}
                    bubbleRate={running ? selectedRun.bubbleRate : 0}
                    denatureLevel={selectedRun.denatureLevel}
                />

                {/* Status */}
                <div className="w-full grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800 rounded-lg p-2 text-center">
                        <p className="text-slate-500">Temperature</p>
                        <p className="text-white font-bold text-lg mt-0.5">{selectedRun.temp}°C</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2 text-center">
                        <p className="text-slate-500">Activity</p>
                        <p className="font-bold text-lg mt-0.5" style={{ color: selectedRun.color }}>
                            {completedTemps.has(selectedRun.temp) ? `${selectedRun.activity}%` : '—'}
                        </p>
                    </div>
                </div>

                {running ? (
                    <div className="w-full">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Running trial...</span><span>{elapsed}s / 5s</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-1000 rounded-full" style={{ width: `${(elapsed / 5) * 100}%` }} />
                        </div>
                    </div>
                ) : completedTemps.has(selectedRun.temp) ? (
                    <div className="w-full p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
                        <p className="text-green-400 text-sm font-bold text-center">✓ Trial Complete</p>
                        <p className="text-slate-400 text-xs mt-1 text-center leading-relaxed">{selectedRun.note}</p>
                    </div>
                ) : (
                    <button
                        onClick={handleStart}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Play className="w-4 h-4" /> Run Trial at {selectedRun.temp}°C
                    </button>
                )}
            </div>

            {/* Right: Temperature selector + progress */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Select Temperature</h3>
                    <div className="space-y-2">
                        {TEMPERATURE_RUNS.map(run => (
                            <button
                                key={run.temp}
                                onClick={() => { setSelectedRun(run); setRunning(false); setElapsed(0); }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                    selectedRun.temp === run.temp
                                        ? 'border-cyan-500/60 bg-cyan-900/10'
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: run.color }} />
                                <span className="text-sm text-white flex-1">{run.label}</span>
                                {completedTemps.has(run.temp) && (
                                    <span className="text-xs text-green-400 font-bold">✓ {run.activity}%</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm mb-1">Progress</p>
                    <p className="text-slate-400 text-xs mb-2">{completedTemps.size}/{TEMPERATURE_RUNS.length} trials completed</p>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${(completedTemps.size / TEMPERATURE_RUNS.length) * 100}%` }} />
                    </div>
                </div>

                <button
                    onClick={onNext}
                    disabled={!allDone}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {allDone ? 'Plot Graph →' : `Complete ${TEMPERATURE_RUNS.length - completedTemps.size} more trials`}
                </button>
            </div>
        </div>
    );
};

// ─── Conclude Step ──────────────────────────────────────────────────────────────

const ConcludeStep: React.FC<{
    answers: Record<string, string>;
    onAnswer: (id: string, val: string) => void;
    submitted: boolean;
    onSubmit: () => void;
    score: number;
}> = ({ answers, onAnswer, submitted, onSubmit, score }) => {
    const allAnswered = QUIZ_QUESTIONS.every(q => answers[q.id]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {submitted ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 border-2 ${score >= 70 ? 'border-green-500 bg-green-900/30' : 'border-amber-500 bg-amber-900/30'}`}>
                        <span className="text-3xl font-bold text-white">{score}%</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">{score >= 70 ? 'Lab Complete!' : 'Good Attempt'}</h2>
                    <div className="space-y-3 text-left">
                        {QUIZ_QUESTIONS.map(q => {
                            const correct = answers[q.id] === q.answer;
                            return (
                                <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                    <p className="text-sm text-white font-medium mb-1">{q.question}</p>
                                    <p className="text-xs text-slate-400">Your: <span className={correct ? 'text-green-400' : 'text-red-400'}>{answers[q.id]}</span></p>
                                    {!correct && <p className="text-xs text-slate-400 mt-0.5">Correct: <span className="text-green-400">{q.answer}</span></p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
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
                                            onClick={() => onAnswer(q.id, opt)}
                                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                                                answers[q.id] === opt
                                                    ? 'border-cyan-500 bg-cyan-900/20 text-cyan-300'
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
                        onClick={onSubmit}
                        disabled={!allAnswered}
                        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all"
                    >
                        Submit Lab Report
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Main Lab Component ─────────────────────────────────────────────────────────

interface Props {
    lab: VirtualLab;
    studentId: string;
    onExit: () => void;
}

const EnzymeActivityLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [completedTemps, setCompletedTemps] = useState<Set<number>>(new Set());
    const [hoveredTemp, setHoveredTemp] = useState<number | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const setupItems = [
        { id: 'catalase', label: 'Prepare fresh 1% catalase extract from potato' },
        { id: 'h2o2', label: 'Prepare 5 test tubes with 5ml of 2% H₂O₂ each' },
        { id: 'water_baths', label: 'Set up water baths at 10°C, 25°C, 37°C, 55°C, 80°C' },
        { id: 'pipettes', label: 'Collect graduated pipettes and measuring cylinders' },
        { id: 'label', label: 'Label test tubes with temperatures' },
    ];

    const handleQuizSubmit = (completeLab: (score: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (quizAnswers[q.id] === q.answer) correct++; });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score);
        setQuizSubmitted(true);
        completeLab(score);
    };

    return (
        <VirtualLabEngine<EnzymeStep>
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
                                    <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-500/20">
                                        <Thermometer className="w-7 h-7 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Enzyme Activity Lab</h2>
                                        <p className="text-slate-500 text-sm">Effect of Temperature on Catalase</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Catalase is an enzyme found in potato and liver tissue that breaks down hydrogen peroxide (H₂O₂) into water and oxygen gas. You will measure how temperature affects this reaction rate by counting oxygen bubbles produced.
                                </p>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 font-mono text-sm text-center text-cyan-300">
                                    2H₂O₂ <span className="text-amber-400 mx-2">→(catalase)</span> 2H₂O + O₂↑
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                    <p className="text-sm font-bold text-white mb-2">🎯 Learning Objectives</p>
                                    <ul className="text-sm text-slate-400 space-y-1">
                                        <li>• Define enzyme optimum temperature</li>
                                        <li>• Explain how high temperatures cause denaturation</li>
                                        <li>• Interpret a rate vs. temperature graph</li>
                                        <li>• Distinguish between enzyme inhibition and denaturation</li>
                                    </ul>
                                </div>
                                <button onClick={() => setStep('setup')} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    Begin Lab <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'setup' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Equipment & Setup</h2>
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
                                            <span className="text-sm"><span className="text-slate-600 font-mono mr-2">{String(i + 1).padStart(2, '0')}.</span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep('experiment')}
                                    disabled={checkedItems.size < setupItems.length}
                                    className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {checkedItems.size === setupItems.length ? 'Start Experiments →' : `${setupItems.length - checkedItems.size} steps remaining`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'experiment' && (
                        <ExperimentStep
                            completedTemps={completedTemps}
                            onCompleteTemp={temp => setCompletedTemps(prev => new Set([...prev, temp]))}
                            addNote={addNote}
                            onNext={() => setStep('graph')}
                        />
                    )}

                    {step === 'graph' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <ActivityBarGraph
                                completedTemps={completedTemps}
                                hoveredTemp={hoveredTemp}
                                onHover={setHoveredTemp}
                            />
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-white font-bold mb-3">Interpret Your Graph</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Your graph shows a bell-curve shape. Activity rises as temperature increases toward the optimum (37°C), then drops sharply as the enzyme denatures at higher temperatures. This irreversible loss of activity distinguishes high-temperature denaturation from the reversible slowdown at low temperatures.
                                </p>
                                <button
                                    onClick={() => setStep('conclude')}
                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    Answer Conclusion Questions <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'conclude' && (
                        <ConcludeStep
                            answers={quizAnswers}
                            onAnswer={(id, val) => setQuizAnswers(prev => ({ ...prev, [id]: val }))}
                            submitted={quizSubmitted}
                            onSubmit={() => handleQuizSubmit(completeLab)}
                            score={quizScore}
                        />
                    )}
                </>
            )}
        </VirtualLabEngine>
    );
};

export default EnzymeActivityLab;