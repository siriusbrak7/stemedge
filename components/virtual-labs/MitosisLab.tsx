/**
 * MitosisLab.tsx
 * 
 * Virtual Lab: Mitosis Stage Identification
 * Style: Microscope view of SVG cells at each phase → student identifies stage → feedback + explanation
 * 
 * Steps: intro → setup → identify → order → conclude
 */

import React, { useState } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { ChevronRight, Microscope, RotateCcw } from 'lucide-react';

type MitosisStep = 'intro' | 'setup' | 'identify' | 'order' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',    label: 'Introduction', description: 'Learn about the cell cycle and mitosis.' },
        { id: 'setup',    label: 'Setup',         description: 'Prepare your onion root tip slide.' },
        { id: 'identify', label: 'Identify',      description: 'Identify each stage of mitosis.' },
        { id: 'order',    label: 'Sequence',      description: 'Arrange the stages in the correct order.' },
        { id: 'conclude', label: 'Conclude',      description: 'Answer conclusion questions.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Stage Data ─────────────────────────────────────────────────────────────────

interface MitosisStage {
    id: string;
    name: string;
    color: string;
    description: string;
    keyFeatures: string[];
    order: number;
}

const STAGES: MitosisStage[] = [
    {
        id: 'interphase',
        name: 'Interphase',
        color: '#6366f1',
        order: 0,
        description: 'The cell prepares for division. DNA replication occurs. The nucleus is clearly visible with chromatin (loose DNA threads).',
        keyFeatures: ['Visible nucleus', 'Chromatin (loose threads)', 'Cell growing', 'DNA replicating'],
    },
    {
        id: 'prophase',
        name: 'Prophase',
        color: '#8b5cf6',
        order: 1,
        description: 'Chromosomes condense and become visible. The nuclear envelope breaks down. Spindle fibres begin to form.',
        keyFeatures: ['Chromosomes visible', 'Nuclear envelope dissolving', 'Spindle fibres forming', 'Centrioles moving to poles'],
    },
    {
        id: 'metaphase',
        name: 'Metaphase',
        color: '#06b6d4',
        order: 2,
        description: 'Chromosomes line up along the cell equator (metaphase plate). Spindle fibres attach to centromeres.',
        keyFeatures: ['Chromosomes at cell equator', 'Maximum chromosome condensation', 'Spindle fibres attached to centromeres'],
    },
    {
        id: 'anaphase',
        name: 'Anaphase',
        color: '#f59e0b',
        order: 3,
        description: 'Sister chromatids are pulled to opposite poles of the cell by shortening spindle fibres. Cell elongates.',
        keyFeatures: ['Chromatids pulled to poles', 'Cell elongating', 'Spindle fibres shortening', 'V-shaped chromosome movement'],
    },
    {
        id: 'telophase',
        name: 'Telophase',
        color: '#22c55e',
        order: 4,
        description: 'Two new nuclear envelopes form around each set of chromosomes. Chromosomes decondense. Cytokinesis begins.',
        keyFeatures: ['Two new nuclei forming', 'Chromosomes decondensing', 'Nuclear envelope re-forming', 'Cytokinesis (cell plate)'],
    },
];

// ─── SVG Cell Diagrams for each stage ──────────────────────────────────────────

const StageDiagram: React.FC<{ stageId: string; size?: number }> = ({ stageId, size = 160 }) => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.42;

    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return null;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
                <filter id={`glow-${stageId}`}>
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Cell membrane */}
            <ellipse
                cx={cx} cy={cy}
                rx={stageId === 'anaphase' ? r * 0.8 : r}
                ry={stageId === 'anaphase' ? r * 1.3 : r}
                fill="#0f172a" stroke={stage.color} strokeWidth="2.5"
            />

            {/* Stage-specific internals */}
            {stageId === 'interphase' && (
                <>
                    {/* Clear nucleus */}
                    <circle cx={cx} cy={cy} r={r * 0.45} fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
                    {/* Chromatin threads */}
                    {[0,1,2,3].map(i => (
                        <path key={i}
                            d={`M${cx - 10 + i * 6},${cy - 8} Q${cx - 5 + i * 6},${cy} ${cx - 10 + i * 6},${cy + 8}`}
                            stroke="#a5b4fc" strokeWidth="1" fill="none" opacity="0.7" />
                    ))}
                    {/* Nucleolus */}
                    <circle cx={cx + 5} cy={cy - 4} r={r * 0.1} fill="#6366f1" opacity="0.8" />
                </>
            )}

            {stageId === 'prophase' && (
                <>
                    {/* Dissolving nuclear envelope */}
                    <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke="#4338ca" strokeWidth="1"
                        strokeDasharray="4,4" opacity="0.5" />
                    {/* Condensed chromosomes (X shapes) */}
                    {[[-15,-10],[10,-12],[-8,10],[12,8]].map(([dx, dy], i) => (
                        <g key={i} transform={`translate(${cx + dx}, ${cy + dy})`}>
                            <line x1="-6" y1="-6" x2="6" y2="6" stroke={stage.color} strokeWidth="3" strokeLinecap="round" />
                            <line x1="6" y1="-6" x2="-6" y2="6" stroke={stage.color} strokeWidth="3" strokeLinecap="round" />
                        </g>
                    ))}
                    {/* Spindle fibres starting */}
                    <line x1={cx - r} y1={cy} x2={cx - r * 0.3} y2={cy} stroke="#64748b" strokeWidth="1" opacity="0.5" />
                    <line x1={cx + r} y1={cy} x2={cx + r * 0.3} y2={cy} stroke="#64748b" strokeWidth="1" opacity="0.5" />
                </>
            )}

            {stageId === 'metaphase' && (
                <>
                    {/* Spindle fibres across full cell */}
                    {[-20,-10,0,10,20].map(offset => (
                        <line key={offset}
                            x1={cx - r + 4} y1={cy + offset}
                            x2={cx + r - 4} y2={cy + offset}
                            stroke="#334155" strokeWidth="1" opacity="0.6" />
                    ))}
                    {/* Chromosomes aligned at equator (vertical line) */}
                    {[[-8,0],[0,0],[8,0]].map(([dx, dy], i) => (
                        <g key={i} transform={`translate(${cx + dx}, ${cy + dy})`}>
                            <rect x="-4" y="-10" width="8" height="8" rx="2" fill={stage.color} opacity="0.9" />
                            <rect x="-4" y="2" width="8" height="8" rx="2" fill={stage.color} opacity="0.9" />
                            <circle cx="0" cy="0" r="2" fill="white" />
                        </g>
                    ))}
                </>
            )}

            {stageId === 'anaphase' && (
                <>
                    {/* Cell elongated - already in ellipse above */}
                    {/* Chromosomes moving to poles - top group */}
                    {[[-10,0],[0,0],[10,0]].map(([dx], i) => (
                        <g key={`t${i}`} transform={`translate(${cx + dx}, ${cy - r * 0.45})`}>
                            <line x1="0" y1="-6" x2="-5" y2="2" stroke={stage.color} strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="0" y1="-6" x2="5" y2="2" stroke={stage.color} strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                    ))}
                    {/* Chromosomes moving to poles - bottom group */}
                    {[[-10,0],[0,0],[10,0]].map(([dx], i) => (
                        <g key={`b${i}`} transform={`translate(${cx + dx}, ${cy + r * 0.45})`}>
                            <line x1="-5" y1="-2" x2="0" y2="6" stroke={stage.color} strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="5" y1="-2" x2="0" y2="6" stroke={stage.color} strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                    ))}
                    {/* Spindle fibres */}
                    {[[-8,0,8]].map((_, i) => (
                        <line key={i} x1={cx} y1={cy - r * 0.3} x2={cx} y2={cy + r * 0.3}
                            stroke="#475569" strokeWidth="1" opacity="0.4" />
                    ))}
                </>
            )}

            {stageId === 'telophase' && (
                <>
                    {/* Two new nuclei forming */}
                    <ellipse cx={cx} cy={cy - r * 0.38} rx={r * 0.4} ry={r * 0.25}
                        fill="#14532d" stroke={stage.color} strokeWidth="1.5" />
                    <ellipse cx={cx} cy={cy + r * 0.38} rx={r * 0.4} ry={r * 0.25}
                        fill="#14532d" stroke={stage.color} strokeWidth="1.5" />
                    {/* Decondensing chromosomes (fuzzy) */}
                    {[[-8,-2],[4,-4],[-5,4]].map(([dx, dy], i) => (
                        <circle key={`t${i}`} cx={cx + dx} cy={cy - r * 0.38 + dy} r="3"
                            fill={stage.color} opacity="0.5" />
                    ))}
                    {[[-8,-2],[4,-4],[-5,4]].map(([dx, dy], i) => (
                        <circle key={`b${i}`} cx={cx + dx} cy={cy + r * 0.38 + dy} r="3"
                            fill={stage.color} opacity="0.5" />
                    ))}
                    {/* Cell plate */}
                    <line x1={cx - r * 0.6} y1={cy} x2={cx + r * 0.6} y2={cy}
                        stroke="#22c55e" strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
                </>
            )}
        </svg>
    );
};

// ─── Identify Step ──────────────────────────────────────────────────────────────

const IDENTIFY_SEQUENCE = ['prophase', 'metaphase', 'interphase', 'anaphase', 'telophase'];

const IdentifyStep: React.FC<{
    completed: Record<string, boolean>;
    onComplete: (id: string, correct: boolean) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ completed, onComplete, addNote, onNext }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [wrongCount, setWrongCount] = useState(0);

    const currentId = IDENTIFY_SEQUENCE[currentIdx];
    const currentStage = STAGES.find(s => s.id === currentId)!;
    const options = [...STAGES].sort(() => Math.random() - 0.5).map(s => s.name);
    const [shuffledOptions] = useState(() => [...STAGES].sort(() => Math.random() - 0.5).map(s => s.name));

    const handleSelect = (name: string) => {
        if (feedback) return;
        setSelected(name);
        const correct = name === currentStage.name;
        if (!correct) setWrongCount(w => w + 1);
        setFeedback({
            correct,
            message: correct
                ? `✓ Correct! ${currentStage.description}`
                : `✗ That is ${name}. This is ${currentStage.name}. ${currentStage.description}`,
        });
        onComplete(currentId, correct);
        addNote(
            `Identified ${currentStage.name}: ${correct ? 'Correct' : 'Incorrect — reviewed and corrected'}. Key feature: ${currentStage.keyFeatures[0]}.`,
            `Mitosis Lab — Stage ${currentIdx + 1}`
        );
    };

    const handleNext = () => {
        if (currentIdx < IDENTIFY_SEQUENCE.length - 1) {
            setCurrentIdx(i => i + 1);
            setSelected(null);
            setFeedback(null);
        }
    };

    const allDone = currentIdx === IDENTIFY_SEQUENCE.length - 1 && feedback !== null;

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Microscope view */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 self-start">
                    <Microscope className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-white font-bold">Onion Root Tip — High Power</h3>
                </div>

                {/* "Microscope" circular viewport */}
                <div className="relative">
                    <div className="w-56 h-56 rounded-full bg-slate-950 border-4 border-slate-700 flex items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
                        <div className="relative">
                            <StageDiagram stageId={currentId} size={160} />
                        </div>
                    </div>
                    {/* Crosshair overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-px bg-slate-700/30 absolute top-1/2" />
                        <div className="h-full w-px bg-slate-700/30 absolute left-1/2" />
                    </div>
                </div>

                <p className="text-xs text-slate-600 font-mono">400× magnification • Aceto-orcein stain</p>

                {/* Key features hint */}
                <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Observe</p>
                    <ul className="text-xs text-slate-400 space-y-1">
                        <li>→ Is the nuclear envelope intact?</li>
                        <li>→ Where are the chromosomes located?</li>
                        <li>→ Are chromatids separated or joined?</li>
                        <li>→ Is the cell elongated?</li>
                    </ul>
                </div>

                {/* Progress dots */}
                <div className="flex gap-2">
                    {IDENTIFY_SEQUENCE.map((id, i) => (
                        <div key={id} className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i < currentIdx ? 'bg-green-500'
                                : i === currentIdx ? 'bg-cyan-400 scale-125'
                                : 'bg-slate-700'
                        }`} />
                    ))}
                </div>
            </div>

            {/* Right: Answer + feedback */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">
                        Stage {currentIdx + 1}/{IDENTIFY_SEQUENCE.length} — Which stage is this?
                    </h3>
                    <div className="space-y-2">
                        {STAGES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => handleSelect(s.name)}
                                disabled={!!feedback}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                    selected === s.name
                                        ? feedback?.correct
                                            ? 'border-green-500 bg-green-900/20 text-green-300'
                                            : 'border-red-500 bg-red-900/20 text-red-300'
                                        : s.name === currentStage.name && feedback && !feedback.correct
                                            ? 'border-green-500/50 bg-green-900/10 text-green-400'
                                            : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                                } disabled:cursor-not-allowed`}
                            >
                                <StageDiagram stageId={s.id} size={36} />
                                <span className="font-medium">{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {feedback && (
                    <div className={`p-4 rounded-xl border ${feedback.correct ? 'border-green-500/30 bg-green-900/10' : 'border-amber-500/30 bg-amber-900/10'}`}>
                        <p className={`text-sm leading-relaxed ${feedback.correct ? 'text-green-300' : 'text-amber-300'}`}>
                            {feedback.message}
                        </p>
                        {!allDone ? (
                            <button onClick={handleNext} className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                Next Stage <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button onClick={onNext} className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                Sequence the Stages <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Order/Sequence Step ────────────────────────────────────────────────────────

const OrderStep: React.FC<{
    onComplete: (correct: boolean) => void;
    onNext: () => void;
}> = ({ onComplete, onNext }) => {
    const [slots, setSlots] = useState<(MitosisStage | null)[]>([null, null, null, null, null]);
    const [bank, setBank] = useState<MitosisStage[]>([...STAGES].sort(() => Math.random() - 0.5));
    const [checked, setChecked] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);

    const handleDrop = (stageId: string, slotIdx: number) => {
        const stage = bank.find(s => s.id === stageId) || slots.find(s => s?.id === stageId);
        if (!stage) return;

        // Remove from bank
        setBank(prev => prev.filter(s => s.id !== stageId));
        // Remove from other slot if placed
        setSlots(prev => {
            const updated = [...prev];
            const existingSlot = updated.findIndex(s => s?.id === stageId);
            if (existingSlot !== -1) updated[existingSlot] = null;
            // Return displaced to bank
            if (updated[slotIdx]) setBank(pb => [...pb, updated[slotIdx]!]);
            updated[slotIdx] = stage;
            return updated;
        });
    };

    const handleCheck = () => {
        const res = slots.map((s, i) => s?.order === i);
        setResults(res);
        setChecked(true);
        const allCorrect = res.every(Boolean);
        onComplete(allCorrect);
    };

    const handleReset = () => {
        setSlots([null, null, null, null, null]);
        setBank([...STAGES].sort(() => Math.random() - 0.5));
        setChecked(false);
        setResults([]);
    };

    const allFilled = slots.every(s => s !== null);
    const correctCount = results.filter(Boolean).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Arrange the Stages</h2>
                <p className="text-slate-500 text-sm mb-6">Drag or click stages into the correct order (0 = earliest).</p>

                {/* Stage bank */}
                <div className="flex flex-wrap gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl mb-6 min-h-[80px]">
                    <p className="w-full text-xs text-slate-600 uppercase font-bold mb-1">Available Stages</p>
                    {bank.map(stage => (
                        <button
                            key={stage.id}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-sm text-white font-medium transition-all"
                            onClick={() => {
                                const emptyIdx = slots.findIndex(s => s === null);
                                if (emptyIdx !== -1) handleDrop(stage.id, emptyIdx);
                            }}
                        >
                            <StageDiagram stageId={stage.id} size={24} />
                            {stage.name}
                        </button>
                    ))}
                    {bank.length === 0 && <p className="text-slate-600 text-sm">All stages placed</p>}
                </div>

                {/* Slots */}
                <div className="grid grid-cols-5 gap-2">
                    {slots.map((slot, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <span className="text-xs text-slate-600 font-mono">{i === 0 ? 'First' : i === 4 ? 'Last' : `Step ${i}`}</span>
                            <div
                                onClick={() => { if (slot) { setBank(prev => [...prev, slot]); setSlots(prev => { const u = [...prev]; u[i] = null; return u; }); setChecked(false); setResults([]); } }}
                                className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                                    checked
                                        ? results[i]
                                            ? 'border-green-500 bg-green-900/20'
                                            : 'border-red-500 bg-red-900/20'
                                        : slot
                                            ? 'border-slate-600 bg-slate-800'
                                            : 'border-dashed border-slate-700 bg-slate-900/50'
                                }`}
                            >
                                {slot ? (
                                    <div className="flex flex-col items-center gap-1 p-1">
                                        <StageDiagram stageId={slot.id} size={50} />
                                        <span className="text-xs text-white font-medium text-center leading-tight">{slot.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-slate-700 text-2xl">+</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {checked && (
                    <div className={`mt-4 p-4 rounded-xl border ${correctCount === 5 ? 'border-green-500/30 bg-green-900/10' : 'border-amber-500/30 bg-amber-900/10'}`}>
                        <p className={`font-bold ${correctCount === 5 ? 'text-green-400' : 'text-amber-400'}`}>
                            {correctCount}/5 stages in correct order
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            Correct order: Interphase → Prophase → Metaphase → Anaphase → Telophase
                        </p>
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button onClick={handleReset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                    {!checked ? (
                        <button onClick={handleCheck} disabled={!allFilled} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm">
                            Check Order
                        </button>
                    ) : (
                        <button onClick={onNext} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm">
                            Conclusion Questions →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Conclude Step ──────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
    {
        id: 'mq1',
        question: 'During which stage of mitosis do chromosomes line up along the cell equator?',
        options: ['Prophase', 'Interphase', 'Metaphase', 'Telophase'],
        answer: 'Metaphase',
    },
    {
        id: 'mq2',
        question: 'What happens to the nuclear envelope during prophase?',
        options: ['It replicates', 'It breaks down', 'It moves to the cell equator', 'It divides into two'],
        answer: 'It breaks down',
    },
    {
        id: 'mq3',
        question: 'Mitosis produces:',
        options: ['4 haploid daughter cells', '2 diploid daughter cells', '2 haploid daughter cells', '4 diploid daughter cells'],
        answer: '2 diploid daughter cells',
    },
    {
        id: 'mq4',
        question: 'Why is mitosis important for growth and repair?',
        options: [
            'It produces genetically different cells for variation',
            'It produces genetically identical cells to replace or add to body cells',
            'It halves the chromosome number',
            'It only occurs in sex cells'
        ],
        answer: 'It produces genetically identical cells to replace or add to body cells',
    },
];

const ConcludeStep: React.FC<{
    answers: Record<string, string>;
    onAnswer: (id: string, val: string) => void;
    submitted: boolean;
    onSubmit: () => void;
    score: number;
}> = ({ answers, onAnswer, submitted, onSubmit, score }) => (
    <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {submitted ? (
                <div className="text-center">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 border-2 ${score >= 70 ? 'border-green-500 bg-green-900/30' : 'border-amber-500 bg-amber-900/30'}`}>
                        <span className="text-3xl font-bold text-white">{score}%</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6">{score >= 70 ? 'Lab Complete!' : 'Good Attempt'}</h2>
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
                <>
                    <h2 className="text-xl font-bold text-white mb-6">Conclusion Questions</h2>
                    <div className="space-y-6">
                        {QUIZ_QUESTIONS.map((q, i) => (
                            <div key={q.id}>
                                <p className="text-white text-sm font-medium mb-3"><span className="text-slate-600 mr-2">{i + 1}.</span>{q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map(opt => (
                                        <button key={opt} onClick={() => onAnswer(q.id, opt)}
                                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                                                answers[q.id] === opt
                                                    ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                                                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500'
                                            }`}>{opt}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onSubmit}
                        disabled={!QUIZ_QUESTIONS.every(q => answers[q.id])}
                        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-xl"
                    >
                        Submit Lab Report
                    </button>
                </>
            )}
        </div>
    </div>
);

// ─── Main ───────────────────────────────────────────────────────────────────────

interface Props { lab: VirtualLab; studentId: string; onExit: () => void; }

const MitosisLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [identifyCompleted, setIdentifyCompleted] = useState<Record<string, boolean>>({});
    const [orderCorrect, setOrderCorrect] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const setupItems = [
        { id: 'rootTip', label: 'Obtain a prepared onion root tip slide (Allium cepa)' },
        { id: 'stain', label: 'Note the aceto-orcein stain used to highlight chromosomes' },
        { id: 'lowPower', label: 'Focus under low power (×40) to find the zone of cell division' },
        { id: 'highPower', label: 'Switch to high power (×400) — locate actively dividing cells' },
    ];

    const handleSubmit = (completeLab: (score: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (quizAnswers[q.id] === q.answer) correct++; });
        // Bonus: if order was correct, add points
        const baseScore = Math.round((correct / QUIZ_QUESTIONS.length) * 80);
        const bonus = orderCorrect ? 20 : 0;
        const score = Math.min(100, baseScore + bonus);
        setQuizScore(score);
        setQuizSubmitted(true);
        completeLab(score);
    };

    return (
        <VirtualLabEngine<MitosisStep>
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
                                    <div className="p-3 bg-purple-900/20 rounded-xl border border-purple-500/20">
                                        <Microscope className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Mitosis Identification Lab</h2>
                                        <p className="text-slate-500 text-sm">Onion Root Tip — Stages of Cell Division</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Mitosis is cell division that produces two genetically identical daughter cells from one parent cell. You will examine prepared slides of onion root tip cells and identify the five stages of the cell cycle.
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                    {STAGES.map(s => (
                                        <div key={s.id} className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                                            <StageDiagram stageId={s.id} size={48} />
                                            <span className="text-xs text-white font-medium text-center">{s.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                                    <p className="text-sm font-bold text-white mb-2">🎯 Learning Objectives</p>
                                    <ul className="text-sm text-slate-400 space-y-1">
                                        <li>• Identify the 5 stages of mitosis from microscope images</li>
                                        <li>• Describe the key events at each stage</li>
                                        <li>• Explain the significance of mitosis in growth and repair</li>
                                        <li>• Sequence the stages in the correct order</li>
                                    </ul>
                                </div>
                                <button onClick={() => setStep('setup')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                    Begin Lab <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'setup' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Microscope Setup</h2>
                                <div className="space-y-3">
                                    {setupItems.map((item, i) => (
                                        <button key={item.id} onClick={() => setCheckedItems(prev => new Set([...prev, item.id]))}
                                            className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${checkedItems.has(item.id) ? 'bg-green-900/20 border-green-500/40 text-green-300' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                                            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${checkedItems.has(item.id) ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                                                {checkedItems.has(item.id) && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <span className="text-sm"><span className="text-slate-600 font-mono mr-2">{String(i + 1).padStart(2, '0')}.</span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setStep('identify')} disabled={checkedItems.size < setupItems.length}
                                    className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                    {checkedItems.size === setupItems.length ? 'Identify Stages →' : `${setupItems.length - checkedItems.size} steps remaining`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'identify' && (
                        <IdentifyStep
                            completed={identifyCompleted}
                            onComplete={(id, correct) => setIdentifyCompleted(prev => ({ ...prev, [id]: correct }))}
                            addNote={addNote}
                            onNext={() => setStep('order')}
                        />
                    )}

                    {step === 'order' && (
                        <OrderStep
                            onComplete={setOrderCorrect}
                            onNext={() => setStep('conclude')}
                        />
                    )}

                    {step === 'conclude' && (
                        <ConcludeStep
                            answers={quizAnswers}
                            onAnswer={(id, val) => setQuizAnswers(prev => ({ ...prev, [id]: val }))}
                            submitted={quizSubmitted}
                            onSubmit={() => handleSubmit(completeLab)}
                            score={quizScore}
                        />
                    )}
                </>
            )}
        </VirtualLabEngine>
    );
};

export default MitosisLab;
