/**
 * OsmosisLab.tsx
 * 
 * Virtual Lab: Osmosis & Diffusion
 * Style: Step-by-step procedure + visual SVG cell simulation + data collection table
 * 
 * Steps: introduction → setup → observe → record → conclude
 */

import React, { useState, useEffect, useRef } from 'react';
import VirtualLabEngine, { LabEngineConfig, LabEngineChildProps } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { Droplets, ChevronRight, CheckCircle, FlaskConical, BarChart2 } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type OsmosisStep = 'intro' | 'setup' | 'observe' | 'record' | 'conclude';

type SolutionType = 'hypotonic' | 'isotonic' | 'hypertonic';

interface ObservationRow {
    solution: SolutionType;
    label: string;
    color: string;
    initialSize: number; // relative px for display
    finalSize: number;
    waterMovement: 'in' | 'none' | 'out';
    cellAppearance: 'turgid' | 'normal' | 'plasmolysed';
    studentAnswer?: string;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',    label: 'Introduction', description: 'Learn about osmosis and diffusion.' },
        { id: 'setup',    label: 'Setup',         description: 'Prepare your onion cell slides.' },
        { id: 'observe',  label: 'Observe',       description: 'Watch osmosis in action.' },
        { id: 'record',   label: 'Record',        description: 'Record your data.' },
        { id: 'conclude', label: 'Conclude',      description: 'Draw conclusions from your data.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Data ───────────────────────────────────────────────────────────────────────

const OBSERVATIONS: ObservationRow[] = [
    {
        solution: 'hypotonic',
        label: 'Distilled Water (Hypotonic)',
        color: '#38bdf8',
        initialSize: 50,
        finalSize: 70,
        waterMovement: 'in',
        cellAppearance: 'turgid',
    },
    {
        solution: 'isotonic',
        label: '0.9% NaCl (Isotonic)',
        color: '#a3e635',
        initialSize: 50,
        finalSize: 50,
        waterMovement: 'none',
        cellAppearance: 'normal',
    },
    {
        solution: 'hypertonic',
        label: '10% NaCl (Hypertonic)',
        color: '#f59e0b',
        initialSize: 50,
        finalSize: 30,
        waterMovement: 'out',
        cellAppearance: 'plasmolysed',
    },
];

const QUIZ_QUESTIONS = [
    {
        id: 'q1',
        question: 'What happens to an onion cell placed in distilled water?',
        options: ['It shrinks (plasmolysis)', 'It stays the same', 'It swells (becomes turgid)', 'It explodes'],
        answer: 'It swells (becomes turgid)',
    },
    {
        id: 'q2',
        question: 'In which direction does water move during osmosis in a hypertonic solution?',
        options: ['Into the cell', 'No movement', 'Out of the cell', 'Both directions equally'],
        answer: 'Out of the cell',
    },
    {
        id: 'q3',
        question: 'What term describes a cell membrane that allows only certain molecules to pass?',
        options: ['Impermeable', 'Selectively permeable', 'Fully permeable', 'Osmotic'],
        answer: 'Selectively permeable',
    },
];

// ─── SVG Cell Visualizer ────────────────────────────────────────────────────────

const CellVisualizer: React.FC<{
    solution: SolutionType;
    animated: boolean;
}> = ({ solution, animated }) => {
    const data = OBSERVATIONS.find(o => o.solution === solution)!;
    const cellRadius = animated ? data.finalSize : data.initialSize;
    const vacuoleRadius = animated ? (data.finalSize * 0.55) : 27;

    const arrowCount = 6;
    const containerR = 85;

    return (
        <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-2xl">
            <defs>
                <radialGradient id={`cellGrad-${solution}`} cx="40%" cy="35%">
                    <stop offset="0%" stopColor={data.color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={data.color} stopOpacity="0.15" />
                </radialGradient>
                <marker id={`arrow-in-${solution}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
                </marker>
                <marker id={`arrow-out-${solution}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M6,0 L0,3 L6,6 Z" fill="#f59e0b" />
                </marker>
            </defs>

            {/* Solution background */}
            <circle cx="110" cy="110" r={containerR} fill="#1e293b" stroke="#334155" strokeWidth="2" />

            {/* Water movement arrows */}
            {data.waterMovement !== 'none' && Array.from({ length: arrowCount }).map((_, i) => {
                const angle = (i / arrowCount) * Math.PI * 2;
                const isIn = data.waterMovement === 'in';
                const startR = isIn ? containerR - 8 : cellRadius + 4;
                const endR = isIn ? cellRadius + 4 : containerR - 8;
                const sx = 110 + Math.cos(angle) * startR;
                const sy = 110 + Math.sin(angle) * startR;
                const ex = 110 + Math.cos(angle) * endR;
                const ey = 110 + Math.sin(angle) * endR;
                return (
                    <line
                        key={i}
                        x1={sx} y1={sy} x2={ex} y2={ey}
                        stroke={isIn ? '#38bdf8' : '#f59e0b'}
                        strokeWidth="1.5"
                        strokeDasharray="4,2"
                        markerEnd={isIn ? `url(#arrow-in-${solution})` : `url(#arrow-out-${solution})`}
                        opacity="0.7"
                    >
                        {animated && (
                            <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
                        )}
                    </line>
                );
            })}

            {/* Cell wall (onion/plant cell) */}
            <circle
                cx="110" cy="110" r={cellRadius + 5}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                style={{ transition: 'r 1.5s ease' }}
            />

            {/* Cell membrane */}
            <circle
                cx="110" cy="110" r={cellRadius}
                fill={`url(#cellGrad-${solution})`}
                stroke={data.color}
                strokeWidth="2"
                style={{ transition: 'r 1.5s ease' }}
            />

            {/* Vacuole */}
            <circle
                cx="110" cy="110" r={vacuoleRadius}
                fill={data.color}
                fillOpacity={animated ? 0.6 : 0.3}
                style={{ transition: 'r 1.5s ease, fill-opacity 1.5s ease' }}
            />

            {/* Nucleus */}
            <circle cx="125" cy="95" r="8" fill="#9333ea" fillOpacity="0.8" />

            {/* Label */}
            <text x="110" y="205" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                {data.cellAppearance}
            </text>
        </svg>
    );
};

// ─── Intro Step ─────────────────────────────────────────────────────────────────

const IntroStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                    <Droplets className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Osmosis & Diffusion</h2>
                    <p className="text-slate-500 text-sm">Estimated time: 25 minutes</p>
                </div>
            </div>

            <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                    <span className="text-cyan-400 font-semibold">Osmosis</span> is the movement of water molecules from a region of higher water potential to lower water potential, across a partially permeable membrane.
                </p>
                <p>
                    In this lab, you will place red onion cells into three different solutions and observe how water movement changes the appearance of the cells.
                </p>

                <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                        { title: 'Hypotonic', sub: 'More water outside', color: 'border-sky-500/40 bg-sky-900/10', tc: 'text-sky-400' },
                        { title: 'Isotonic', sub: 'Equal concentrations', color: 'border-green-500/40 bg-green-900/10', tc: 'text-green-400' },
                        { title: 'Hypertonic', sub: 'Less water outside', color: 'border-amber-500/40 bg-amber-900/10', tc: 'text-amber-400' },
                    ].map(s => (
                        <div key={s.title} className={`border rounded-xl p-4 ${s.color}`}>
                            <p className={`font-bold text-sm ${s.tc}`}>{s.title}</p>
                            <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mt-4">
                    <p className="text-sm font-bold text-white mb-2">🎯 Learning Objectives</p>
                    <ul className="text-sm text-slate-400 space-y-1">
                        <li>• Define osmosis and identify the direction of water movement</li>
                        <li>• Distinguish between hypotonic, isotonic, and hypertonic solutions</li>
                        <li>• Describe the appearance of cells in each solution</li>
                        <li>• Explain the role of the selectively permeable membrane</li>
                    </ul>
                </div>
            </div>

            <button
                onClick={onNext}
                className="mt-8 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                Begin Lab <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    </div>
);

// ─── Setup Step ─────────────────────────────────────────────────────────────────

const SetupStep: React.FC<{
    checkedItems: Set<string>;
    onCheck: (id: string) => void;
    onNext: () => void;
}> = ({ checkedItems, onCheck, onNext }) => {
    const items = [
        { id: 'slides', label: 'Prepare 3 glass slides with red onion epidermal cells' },
        { id: 'solutions', label: 'Label beakers: Distilled Water, 0.9% NaCl, 10% NaCl' },
        { id: 'drops', label: 'Add 2 drops of each solution to respective slides' },
        { id: 'coverslip', label: 'Place coverslips and blot excess liquid' },
        { id: 'ready', label: 'Place slides on microscope stage — ready to observe' },
    ];
    const allChecked = checkedItems.size === items.length;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-2">Equipment Setup</h2>
                <p className="text-slate-500 text-sm mb-6">Tick each step as you complete it.</p>

                <div className="space-y-3">
                    {items.map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => onCheck(item.id)}
                            className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                                checkedItems.has(item.id)
                                    ? 'bg-green-900/20 border-green-500/40 text-green-300'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                checkedItems.has(item.id) ? 'bg-green-500 border-green-500' : 'border-slate-600'
                            }`}>
                                {checkedItems.has(item.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-sm">
                                <span className="text-slate-600 font-mono mr-2">{String(i + 1).padStart(2, '0')}.</span>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={!allChecked}
                    className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {allChecked ? 'Observe Cells →' : `Complete all ${items.length - checkedItems.size} remaining steps`}
                </button>
            </div>
        </div>
    );
};

// ─── Observe Step ───────────────────────────────────────────────────────────────

const ObserveStep: React.FC<{
    activeSolution: SolutionType;
    onSelectSolution: (s: SolutionType) => void;
    animated: boolean;
    onToggleAnimation: () => void;
    onNext: () => void;
    addNote: (text: string, context?: string) => void;
}> = ({ activeSolution, onSelectSolution, animated, onToggleAnimation, onNext, addNote }) => {
    const activeData = OBSERVATIONS.find(o => o.solution === activeSolution)!;

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                <h3 className="text-white font-bold self-start">Cell Observation View</h3>

                <CellVisualizer solution={activeSolution} animated={animated} />

                <button
                    onClick={onToggleAnimation}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                        animated
                            ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                >
                    {animated ? '⏸ Pause Simulation' : '▶ Run Simulation'}
                </button>

                {/* Info strip */}
                <div className="w-full grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-slate-800 rounded-lg p-2">
                        <p className="text-slate-500">Water Movement</p>
                        <p className={`font-bold mt-1 ${activeData.waterMovement === 'in' ? 'text-sky-400' : activeData.waterMovement === 'out' ? 'text-amber-400' : 'text-green-400'}`}>
                            {activeData.waterMovement === 'in' ? '↑ Into Cell' : activeData.waterMovement === 'out' ? '↓ Out of Cell' : '↔ Equilibrium'}
                        </p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                        <p className="text-slate-500">Cell State</p>
                        <p className="font-bold mt-1 text-white capitalize">{activeData.cellAppearance}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                        <p className="text-slate-500">Vacuole</p>
                        <p className={`font-bold mt-1 ${animated ? (activeData.finalSize > 50 ? 'text-sky-400' : activeData.finalSize < 50 ? 'text-amber-400' : 'text-green-400') : 'text-slate-400'}`}>
                            {animated ? (activeData.finalSize > 50 ? 'Expanded' : activeData.finalSize < 50 ? 'Shrunk' : 'Normal') : 'Initial'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls + Instructions */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Select Solution</h3>
                    <div className="space-y-2">
                        {OBSERVATIONS.map(obs => (
                            <button
                                key={obs.solution}
                                onClick={() => onSelectSolution(obs.solution)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                    activeSolution === obs.solution
                                        ? 'border-cyan-500/60 bg-cyan-900/10'
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: obs.color }} />
                                <span className="text-sm text-white">{obs.label}</span>
                                {activeSolution === obs.solution && <span className="ml-auto text-xs text-cyan-400 font-bold">ACTIVE</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-2">🔬 Observation Tips</h3>
                    <ul className="text-sm text-slate-400 space-y-2 leading-relaxed">
                        <li>• Note the size of the central vacuole relative to the cell</li>
                        <li>• Observe whether the cell membrane has pulled away from the cell wall</li>
                        <li>• Compare how quickly changes occur in each solution</li>
                        <li>• Use the notebook to record qualitative observations</li>
                    </ul>
                    <button
                        onClick={() => addNote(`Observed ${activeSolution} solution: cell appears ${activeData.cellAppearance}`, `Osmosis - ${activeData.label}`)}
                        className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                        📝 Log Current Observation
                    </button>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    Record Data <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// ─── Record Step (Data Table) ────────────────────────────────────────────────────

const APPEARANCE_OPTIONS = ['Turgid / Swollen', 'Normal / Unchanged', 'Plasmolysed / Shrunken'];
const MOVEMENT_OPTIONS = ['Into the cell', 'No net movement', 'Out of the cell'];

const RecordStep: React.FC<{
    tableAnswers: Record<string, { appearance: string; movement: string }>;
    onAnswer: (solution: string, field: 'appearance' | 'movement', val: string) => void;
    onNext: () => void;
}> = ({ tableAnswers, onAnswer, onNext }) => {
    const allFilled = OBSERVATIONS.every(o =>
        tableAnswers[o.solution]?.appearance && tableAnswers[o.solution]?.movement
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Results Table</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-500 font-bold uppercase text-xs pb-3 pr-4">Solution</th>
                                <th className="text-left text-slate-500 font-bold uppercase text-xs pb-3 pr-4">Cell Appearance</th>
                                <th className="text-left text-slate-500 font-bold uppercase text-xs pb-3">Water Movement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {OBSERVATIONS.map(obs => (
                                <tr key={obs.solution} className="py-3">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: obs.color }} />
                                            <span className="text-white font-medium text-xs">{obs.label}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <select
                                            value={tableAnswers[obs.solution]?.appearance || ''}
                                            onChange={e => onAnswer(obs.solution, 'appearance', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                                        >
                                            <option value="">— Select —</option>
                                            {APPEARANCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </td>
                                    <td className="py-4">
                                        <select
                                            value={tableAnswers[obs.solution]?.movement || ''}
                                            onChange={e => onAnswer(obs.solution, 'movement', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                                        >
                                            <option value="">— Select —</option>
                                            {MOVEMENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={onNext}
                    disabled={!allFilled}
                    className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    Submit & Answer Questions <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// ─── Conclude Step (Mini-Quiz) ───────────────────────────────────────────────────

const ConcludeStep: React.FC<{
    quizAnswers: Record<string, string>;
    onAnswer: (id: string, val: string) => void;
    submitted: boolean;
    onSubmit: () => void;
    score: number;
}> = ({ quizAnswers, onAnswer, submitted, onSubmit, score }) => {
    const allAnswered = QUIZ_QUESTIONS.every(q => quizAnswers[q.id]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {submitted ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${score >= 70 ? 'bg-green-900/30 border-2 border-green-500' : 'bg-amber-900/30 border-2 border-amber-500'}`}>
                        <span className="text-3xl font-bold text-white">{score}%</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{score >= 70 ? 'Lab Complete!' : 'Review Needed'}</h2>
                    <p className="text-slate-400 mb-6">
                        {score >= 70
                            ? 'Excellent! You understand the principles of osmosis.'
                            : 'Review your observations and try again.'}
                    </p>
                    <div className="space-y-4 text-left mt-6">
                        {QUIZ_QUESTIONS.map(q => {
                            const correct = quizAnswers[q.id] === q.answer;
                            return (
                                <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                    <p className="text-sm text-white font-medium mb-2">{q.question}</p>
                                    <p className="text-xs text-slate-400">Your answer: <span className={correct ? 'text-green-400' : 'text-red-400'}>{quizAnswers[q.id]}</span></p>
                                    {!correct && <p className="text-xs text-slate-400 mt-1">Correct: <span className="text-green-400">{q.answer}</span></p>}
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
                                                quizAnswers[q.id] === opt
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

const OsmosisLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [activeSolution, setActiveSolution] = useState<SolutionType>('hypotonic');
    const [animated, setAnimated] = useState(false);
    const [tableAnswers, setTableAnswers] = useState<Record<string, { appearance: string; movement: string }>>({});
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const handleTableAnswer = (solution: string, field: 'appearance' | 'movement', val: string) => {
        setTableAnswers(prev => ({
            ...prev,
            [solution]: { ...prev[solution], [field]: val }
        }));
    };

    const handleQuizSubmit = (completeLab: (score: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => {
            if (quizAnswers[q.id] === q.answer) correct++;
        });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score);
        setQuizSubmitted(true);
        completeLab(score);
    };

    return (
        <VirtualLabEngine<OsmosisStep>
            config={ENGINE_CONFIG}
            lab={lab}
            studentId={studentId}
            onExit={onExit}
        >
            {({ step, setStep, addNote, completeLab }) => (
                <>
                    {step === 'intro' && (
                        <IntroStep onNext={() => setStep('setup')} />
                    )}

                    {step === 'setup' && (
                        <SetupStep
                            checkedItems={checkedItems}
                            onCheck={id => setCheckedItems(prev => new Set([...prev, id]))}
                            onNext={() => setStep('observe')}
                        />
                    )}

                    {step === 'observe' && (
                        <ObserveStep
                            activeSolution={activeSolution}
                            onSelectSolution={setActiveSolution}
                            animated={animated}
                            onToggleAnimation={() => setAnimated(a => !a)}
                            onNext={() => setStep('record')}
                            addNote={addNote}
                        />
                    )}

                    {step === 'record' && (
                        <RecordStep
                            tableAnswers={tableAnswers}
                            onAnswer={handleTableAnswer}
                            onNext={() => setStep('conclude')}
                        />
                    )}

                    {step === 'conclude' && (
                        <ConcludeStep
                            quizAnswers={quizAnswers}
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

export default OsmosisLab;