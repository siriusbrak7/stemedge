/**
 * FoodTestsLab.tsx
 * 
 * Virtual Lab: Food Tests (Biochemical Tests for Nutrients)
 * Style: Step-by-step procedure → animated colour-change simulation → results table → conclusions
 * 
 * Tests covered:
 *   Benedict's  — reducing sugars (blue → brick red)
 *   Iodine      — starch (orange-brown → blue-black)
 *   Biuret      — proteins (blue → purple/violet)
 *   Ethanol     — lipids (clear → milky white emulsion)
 * 
 * Steps: intro → setup → test → results → conclude
 */

import React, { useState, useEffect, useRef } from 'react';
import VirtualLabEngine, { LabEngineConfig } from './VirtualLabEngine';
import { VirtualLab } from '../../types';
import { FlaskConical, ChevronRight, Thermometer, Droplets, CheckCircle } from 'lucide-react';

type FoodStep = 'intro' | 'setup' | 'test' | 'results' | 'conclude';

const ENGINE_CONFIG: LabEngineConfig = {
    steps: [
        { id: 'intro',    label: 'Introduction', description: 'Learn about biochemical food tests.' },
        { id: 'setup',    label: 'Setup',         description: 'Prepare your test solutions and reagents.' },
        { id: 'test',     label: 'Test',          description: 'Carry out each food test.' },
        { id: 'results',  label: 'Results',       description: 'Record your results table.' },
        { id: 'conclude', label: 'Conclude',      description: 'Answer conclusion questions.' },
    ],
    passingScore: 70,
    showTimer: true,
};

// ─── Data ───────────────────────────────────────────────────────────────────────

interface FoodTest {
    id: string;
    name: string;
    reagent: string;
    tests: string;    // nutrient being tested
    negativeColor: string;
    positiveColor: string;
    negativeLabel: string;
    positiveLabel: string;
    procedure: string[];
    needsHeat: boolean;
}

const FOOD_TESTS: FoodTest[] = [
    {
        id: 'benedicts',
        name: "Benedict's Test",
        reagent: "Benedict's Reagent",
        tests: 'Reducing Sugars (e.g. glucose, maltose)',
        negativeColor: '#1d4ed8',
        positiveColor: '#b45309',
        negativeLabel: 'Blue (negative)',
        positiveLabel: 'Brick Red (positive)',
        procedure: [
            'Add 2cm³ of food sample to a test tube',
            "Add 2cm³ of Benedict's reagent (blue)",
            'Place test tube in a boiling water bath for 5 minutes',
            'Observe colour change',
        ],
        needsHeat: true,
    },
    {
        id: 'iodine',
        name: 'Iodine Test',
        reagent: 'Iodine Solution',
        tests: 'Starch',
        negativeColor: '#92400e',
        positiveColor: '#1e1b4b',
        negativeLabel: 'Orange-brown (negative)',
        positiveLabel: 'Blue-black (positive)',
        procedure: [
            'Place a few drops of food sample on a white tile',
            'Add 2-3 drops of iodine solution',
            'Observe colour change immediately',
        ],
        needsHeat: false,
    },
    {
        id: 'biuret',
        name: 'Biuret Test',
        reagent: 'NaOH + CuSO₄',
        tests: 'Proteins (peptide bonds)',
        negativeColor: '#1d4ed8',
        positiveColor: '#6b21a8',
        negativeLabel: 'Blue (negative)',
        positiveLabel: 'Purple/Violet (positive)',
        procedure: [
            'Add 2cm³ of food sample to a test tube',
            'Add 2cm³ of sodium hydroxide (NaOH) solution',
            'Add 5 drops of copper sulfate (CuSO₄) solution',
            'Mix gently and observe colour change',
        ],
        needsHeat: false,
    },
    {
        id: 'ethanol',
        name: 'Ethanol Emulsion Test',
        reagent: 'Ethanol + Water',
        tests: 'Lipids (fats and oils)',
        negativeColor: '#e2e8f0',
        positiveColor: '#f8fafc',
        negativeLabel: 'Remains clear (negative)',
        positiveLabel: 'Milky white emulsion (positive)',
        procedure: [
            'Add food sample to 2cm³ of absolute ethanol in a test tube',
            'Shake vigorously to dissolve any lipids',
            'Pour the ethanol layer into a tube of cold water',
            'Observe — milky white emulsion = lipids present',
        ],
        needsHeat: false,
    },
];

// Food samples to test — each has known nutrient content
interface FoodSample {
    id: string;
    name: string;
    color: string;
    positiveTests: string[];  // test ids that should be positive
}

const FOOD_SAMPLES: FoodSample[] = [
    {
        id: 'glucose_solution',
        name: 'Glucose Solution',
        color: '#fef3c7',
        positiveTests: ['benedicts'],
    },
    {
        id: 'starch_solution',
        name: 'Starch Solution',
        color: '#f5f5f4',
        positiveTests: ['iodine'],
    },
    {
        id: 'egg_white',
        name: 'Egg White Solution',
        color: '#fefce8',
        positiveTests: ['biuret'],
    },
    {
        id: 'olive_oil',
        name: 'Olive Oil + Ethanol',
        color: '#fef08a',
        positiveTests: ['ethanol'],
    },
    {
        id: 'milk',
        name: 'Full-Fat Milk',
        color: '#f8fafc',
        positiveTests: ['benedicts', 'biuret', 'ethanol'],
    },
];

const QUIZ_QUESTIONS = [
    {
        id: 'fq1',
        question: "Benedict's test uses a blue reagent. A positive result for reducing sugars gives which colour?",
        options: ['Purple', 'Yellow', 'Brick red / orange', 'Blue-black'],
        answer: 'Brick red / orange',
    },
    {
        id: 'fq2',
        question: 'Which reagent is used to test for starch?',
        options: ["Benedict's solution", 'Iodine solution', 'Biuret reagent', 'Ethanol'],
        answer: 'Iodine solution',
    },
    {
        id: 'fq3',
        question: 'A food sample turns purple when tested with Biuret reagent. What does this indicate?',
        options: ['Starch is present', 'Lipids are present', 'Reducing sugars are present', 'Protein is present'],
        answer: 'Protein is present',
    },
    {
        id: 'fq4',
        question: "Why must Benedict's test be heated in a water bath?",
        options: [
            'To dissolve the food sample',
            'To denature any proteins that would interfere',
            'Heat is required to drive the redox reaction between glucose and the reagent',
            'To sterilise the solution'
        ],
        answer: 'Heat is required to drive the redox reaction between glucose and the reagent',
    },
    {
        id: 'fq5',
        question: 'In the ethanol emulsion test, what observation confirms lipids are present?',
        options: ['Blue-black colour', 'Brick red precipitate', 'Milky white emulsion forms in cold water', 'Purple colouration'],
        answer: 'Milky white emulsion forms in cold water',
    },
];

// ─── Test Tube Visualizer ───────────────────────────────────────────────────────

const TestTubeVisualization: React.FC<{
    test: FoodTest;
    sample: FoodSample;
    phase: 'before' | 'mixing' | 'heating' | 'done';
    isPositive: boolean;
}> = ({ test, sample, phase, isPositive }) => {
    const liquidColor = phase === 'before'
        ? test.negativeColor
        : phase === 'done'
            ? (isPositive ? test.positiveColor : test.negativeColor)
            : test.negativeColor;

    const opacity = phase === 'mixing' ? 0.7 : 1;

    // Special rendering for ethanol emulsion (milky = dots)
    const isMilky = test.id === 'ethanol' && phase === 'done' && isPositive;

    return (
        <svg width="80" height="180" viewBox="0 0 80 180">
            <defs>
                <linearGradient id={`tube-${test.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={liquidColor} stopOpacity={opacity * 0.7} />
                    <stop offset="50%" stopColor={liquidColor} stopOpacity={opacity} />
                    <stop offset="100%" stopColor={liquidColor} stopOpacity={opacity * 0.8} />
                </linearGradient>
                <clipPath id={`tube-clip-${test.id}`}>
                    <path d="M 20,20 L 20,140 Q 20,165 40,165 Q 60,165 60,140 L 60,20 Z" />
                </clipPath>
            </defs>

            {/* Test tube glass */}
            <path d="M 20,10 L 20,140 Q 20,165 40,165 Q 60,165 60,140 L 60,10"
                fill="rgba(186,230,253,0.08)" stroke="#94a3b8" strokeWidth="2" />

            {/* Liquid */}
            <rect x="22" y="60" width="36" height="100"
                fill={`url(#tube-${test.id})`}
                clipPath={`url(#tube-clip-${test.id})`}
                opacity={opacity}
            />

            {/* Milky emulsion effect */}
            {isMilky && (
                <>
                    {[...Array(12)].map((_, i) => (
                        <circle key={i}
                            cx={28 + (i % 4) * 9}
                            cy={80 + Math.floor(i / 4) * 25}
                            r={3 + Math.random() * 2}
                            fill="white" opacity="0.6"
                        />
                    ))}
                </>
            )}

            {/* Bubbles during heating */}
            {phase === 'heating' && (
                <>
                    {[35, 42, 50].map((x, i) => (
                        <circle key={i} cx={x} cy={100 + i * 15}
                            r="3" fill="white" opacity="0.4">
                            <animate attributeName="cy" values={`${100 + i * 15};60;${100 + i * 15}`}
                                dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.4;0;0.4"
                                dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
                        </circle>
                    ))}
                </>
            )}

            {/* Rim */}
            <rect x="18" y="8" width="44" height="6" rx="3" fill="#64748b" />

            {/* Colour label */}
            <text x="40" y="178" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {phase === 'done'
                    ? (isPositive ? test.positiveLabel.split(' ')[0] : test.negativeLabel.split(' ')[0])
                    : '...'}
            </text>
        </svg>
    );
};

// ─── Test Step ──────────────────────────────────────────────────────────────────

type TestPhase = 'before' | 'mixing' | 'heating' | 'done';

const TestStep: React.FC<{
    completedTests: Record<string, Record<string, boolean>>; // sampleId → testId → result
    onComplete: (sampleId: string, testId: string, isPositive: boolean) => void;
    addNote: (text: string, ctx?: string) => void;
    onNext: () => void;
}> = ({ completedTests, onComplete, addNote, onNext }) => {
    const [selectedSample, setSelectedSample] = useState<FoodSample>(FOOD_SAMPLES[0]);
    const [selectedTest, setSelectedTest] = useState<FoodTest>(FOOD_TESTS[0]);
    const [phase, setPhase] = useState<TestPhase>('before');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isPositive = selectedSample.positiveTests.includes(selectedTest.id);
    const isDone = completedTests[selectedSample.id]?.[selectedTest.id] !== undefined;

    const totalRequired = FOOD_SAMPLES.length * FOOD_TESTS.length;
    const totalDone = Object.values(completedTests).reduce(
        (acc, tests) => acc + Object.keys(tests).length, 0
    );
    // Actually require only one test per sample for simplicity (4 core tests)
    const coreComplete = FOOD_TESTS.every(t =>
        FOOD_SAMPLES.some(s => completedTests[s.id]?.[t.id] !== undefined)
    );

    const handleRun = () => {
        setPhase('mixing');
        const afterMix = setTimeout(() => {
            if (selectedTest.needsHeat) {
                setPhase('heating');
                const afterHeat = setTimeout(() => {
                    setPhase('done');
                    onComplete(selectedSample.id, selectedTest.id, isPositive);
                    addNote(
                        `${selectedTest.name} on ${selectedSample.name}: ${isPositive ? selectedTest.positiveLabel : selectedTest.negativeLabel}.`,
                        `Food Tests — ${selectedTest.tests}`
                    );
                }, 2500);
                timerRef.current = afterHeat;
            } else {
                const afterWait = setTimeout(() => {
                    setPhase('done');
                    onComplete(selectedSample.id, selectedTest.id, isPositive);
                    addNote(
                        `${selectedTest.name} on ${selectedSample.name}: ${isPositive ? selectedTest.positiveLabel : selectedTest.negativeLabel}.`,
                        `Food Tests — ${selectedTest.tests}`
                    );
                }, 1500);
                timerRef.current = afterWait;
            }
        }, 1000);
        timerRef.current = afterMix;
    };

    const handleReset = () => {
        setPhase('before');
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    useEffect(() => {
        setPhase(isDone ? 'done' : 'before');
    }, [selectedSample.id, selectedTest.id]);

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Selectors */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm mb-3">Food Sample</h3>
                    <div className="space-y-1">
                        {FOOD_SAMPLES.map(s => (
                            <button key={s.id}
                                onClick={() => { setSelectedSample(s); handleReset(); }}
                                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-all ${selectedSample.id === s.id ? 'border-cyan-500/60 bg-cyan-900/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                                <div className="w-3 h-3 rounded-full flex-shrink-0 border border-slate-500" style={{ backgroundColor: s.color }} />
                                <span className="text-white">{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm mb-3">Test Reagent</h3>
                    <div className="space-y-1">
                        {FOOD_TESTS.map(t => {
                            const done = completedTests[selectedSample.id]?.[t.id] !== undefined;
                            return (
                                <button key={t.id}
                                    onClick={() => { setSelectedTest(t); handleReset(); }}
                                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-all ${selectedTest.id === t.id ? 'border-purple-500/60 bg-purple-900/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                                    <span className="flex-1 text-white">{t.name}</span>
                                    {done && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Visualisation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                <h3 className="text-white font-bold self-start text-sm">Reaction Chamber</h3>

                <div className="flex items-end gap-6 mb-2">
                    {/* Sample tube */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-xl border border-slate-700 flex items-center justify-center"
                            style={{ backgroundColor: selectedSample.color + '40' }}>
                            <Droplets className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="text-xs text-slate-500 text-center">Sample</span>
                    </div>

                    <span className="text-slate-600 text-2xl mb-8">+</span>

                    {/* Reagent */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-xl border border-slate-700 flex items-center justify-center"
                            style={{ backgroundColor: selectedTest.negativeColor + '60' }}>
                            <FlaskConical className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="text-xs text-slate-500 text-center">{selectedTest.reagent}</span>
                    </div>

                    <span className="text-slate-600 text-2xl mb-8">=</span>

                    {/* Result tube */}
                    <div className="flex flex-col items-center gap-1">
                        <TestTubeVisualization
                            test={selectedTest}
                            sample={selectedSample}
                            phase={phase}
                            isPositive={isPositive}
                        />
                    </div>
                </div>

                {/* Phase indicator */}
                <div className="w-full text-center">
                    {phase === 'before' && <p className="text-slate-600 text-sm">Ready to run test</p>}
                    {phase === 'mixing' && <p className="text-cyan-400 text-sm animate-pulse">Mixing reagents...</p>}
                    {phase === 'heating' && (
                        <div className="flex items-center justify-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-400 animate-bounce" />
                            <p className="text-amber-400 text-sm">Heating in water bath...</p>
                        </div>
                    )}
                    {phase === 'done' && (
                        <p className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-slate-400'}`}>
                            {isPositive ? `✓ POSITIVE — ${selectedTest.positiveLabel}` : `— NEGATIVE — ${selectedTest.negativeLabel}`}
                        </p>
                    )}
                </div>

                {phase !== 'done' && phase !== 'mixing' && phase !== 'heating' && (
                    <button onClick={handleRun}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                        <FlaskConical className="w-4 h-4" /> Run {selectedTest.name}
                    </button>
                )}
            </div>

            {/* Procedure + progress */}
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm mb-3">Procedure</h3>
                    <ol className="space-y-2">
                        {selectedTest.procedure.map((step, i) => (
                            <li key={i} className="flex gap-2 text-xs text-slate-400">
                                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">{i + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ol>
                    {selectedTest.needsHeat && (
                        <div className="mt-3 flex items-center gap-2 p-2 bg-amber-900/20 border border-amber-500/20 rounded-lg">
                            <Thermometer className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <p className="text-xs text-amber-400">Requires heating in water bath at 80°C</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Progress</p>
                    <p className="text-slate-400 text-sm">{totalDone} tests completed</p>
                    <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${(totalDone / totalRequired) * 100}%` }} />
                    </div>
                </div>

                <button onClick={onNext} disabled={!coreComplete}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                    {coreComplete ? 'Record Results →' : 'Complete more tests to continue'}
                </button>
            </div>
        </div>
    );
};

// ─── Results Table Step ─────────────────────────────────────────────────────────

const ResultsStep: React.FC<{
    completedTests: Record<string, Record<string, boolean>>;
    tableAnswers: Record<string, Record<string, string>>;
    onAnswer: (sampleId: string, testId: string, val: string) => void;
    onNext: () => void;
}> = ({ completedTests, tableAnswers, onAnswer, onNext }) => {
    const allFilled = FOOD_SAMPLES.every(s =>
        FOOD_TESTS.every(t => tableAnswers[s.id]?.[t.id])
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Results Table</h2>
                <p className="text-slate-500 text-sm mb-6">Select the colour/observation for each test.</p>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-500 font-bold uppercase pb-3 pr-4 w-36">Food Sample</th>
                                {FOOD_TESTS.map(t => (
                                    <th key={t.id} className="text-center text-slate-500 font-bold uppercase pb-3 px-2">{t.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {FOOD_SAMPLES.map(sample => (
                                <tr key={sample.id}>
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sample.color }} />
                                            <span className="text-white font-medium">{sample.name}</span>
                                        </div>
                                    </td>
                                    {FOOD_TESTS.map(test => {
                                        const isDone = completedTests[sample.id]?.[test.id] !== undefined;
                                        const isPositive = sample.positiveTests.includes(test.id);
                                        return (
                                            <td key={test.id} className="py-3 px-2 text-center">
                                                <select
                                                    value={tableAnswers[sample.id]?.[test.id] || ''}
                                                    onChange={e => onAnswer(sample.id, test.id, e.target.value)}
                                                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-1.5 focus:outline-none focus:border-purple-500"
                                                >
                                                    <option value="">—</option>
                                                    <option value="positive">{test.positiveLabel}</option>
                                                    <option value="negative">{test.negativeLabel}</option>
                                                </select>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button onClick={onNext} disabled={!allFilled}
                    className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                    {allFilled ? 'Answer Conclusion Questions →' : 'Complete all cells to continue'}
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
                    <button onClick={onSubmit} disabled={!QUIZ_QUESTIONS.every(q => answers[q.id])}
                        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-xl">
                        Submit Lab Report
                    </button>
                </>
            )}
        </div>
    </div>
);

// ─── Main ───────────────────────────────────────────────────────────────────────

interface Props { lab: VirtualLab; studentId: string; onExit: () => void; }

const FoodTestsLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [completedTests, setCompletedTests] = useState<Record<string, Record<string, boolean>>>({});
    const [tableAnswers, setTableAnswers] = useState<Record<string, Record<string, string>>>({});
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const setupItems = [
        { id: 'samples', label: 'Collect and label 5 food sample solutions in beakers' },
        { id: 'reagents', label: "Prepare reagent bottles: Benedict's, Iodine, NaOH, CuSO₄, Ethanol" },
        { id: 'tubes', label: 'Collect 20 clean test tubes and a test tube rack' },
        { id: 'waterbath', label: 'Set up water bath at 80°C for Benedict\'s test' },
        { id: 'tile', label: 'Obtain a white tile for iodine test colour observation' },
    ];

    const handleTestComplete = (sampleId: string, testId: string, isPositive: boolean) => {
        setCompletedTests(prev => ({
            ...prev,
            [sampleId]: { ...prev[sampleId], [testId]: isPositive }
        }));
    };

    const handleTableAnswer = (sampleId: string, testId: string, val: string) => {
        setTableAnswers(prev => ({
            ...prev,
            [sampleId]: { ...prev[sampleId], [testId]: val }
        }));
    };

    const handleSubmit = (completeLab: (score: number) => void) => {
        let correct = 0;
        QUIZ_QUESTIONS.forEach(q => { if (quizAnswers[q.id] === q.answer) correct++; });
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(score);
        setQuizSubmitted(true);
        completeLab(score);
    };

    return (
        <VirtualLabEngine<FoodStep>
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
                                        <FlaskConical className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Food Tests Lab</h2>
                                        <p className="text-slate-500 text-sm">Biochemical Identification of Nutrients</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    Biochemical tests allow us to identify which nutrients are present in food samples. Each test uses a specific reagent that produces a characteristic colour change when a target molecule is present.
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {FOOD_TESTS.map(t => (
                                        <div key={t.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                                            <p className="text-white font-bold text-sm">{t.name}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">Tests: {t.tests}</p>
                                            <div className="flex gap-2 mt-2">
                                                <div className="flex-1 h-5 rounded" style={{ backgroundColor: t.negativeColor + 'cc' }} />
                                                <span className="text-slate-600 text-xs">→</span>
                                                <div className="flex-1 h-5 rounded" style={{ backgroundColor: t.positiveColor + 'cc' }} />
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-600 mt-1">
                                                <span>−</span><span>+</span>
                                            </div>
                                        </div>
                                    ))}
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
                                <h2 className="text-xl font-bold text-white mb-6">Equipment Setup</h2>
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
                                <button onClick={() => setStep('test')} disabled={checkedItems.size < setupItems.length}
                                    className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                                    {checkedItems.size === setupItems.length ? 'Start Testing →' : `${setupItems.length - checkedItems.size} steps remaining`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'test' && (
                        <TestStep
                            completedTests={completedTests}
                            onComplete={handleTestComplete}
                            addNote={addNote}
                            onNext={() => setStep('results')}
                        />
                    )}

                    {step === 'results' && (
                        <ResultsStep
                            completedTests={completedTests}
                            tableAnswers={tableAnswers}
                            onAnswer={handleTableAnswer}
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

export default FoodTestsLab;
