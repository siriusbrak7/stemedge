import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Droplets, Flame, Trophy, RotateCcw, CheckCircle2, HelpCircle, ChevronDown, FlaskConical, ArrowRight, Lightbulb } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { FOOD_TESTS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

type TestType = 'iodine' | 'biuret' | 'benedict';
type Phase = 'brief' | 'plan' | 'test' | 'diagnose' | 'results';

interface Sample {
  id: string; name: string; starch: boolean; protein: boolean; sugar: boolean;
  clue: string;
}

const SAMPLES: Sample[] = [
  { id: 'yam', name: 'Yam Paste', starch: true, protein: false, sugar: false, clue: 'A starchy staple food common in Ghanaian markets.' },
  { id: 'egg', name: 'Egg White', starch: false, protein: true, sugar: false, clue: 'A clear, viscous liquid from a common breakfast food.' },
  { id: 'juice', name: 'Fruit Juice', starch: false, protein: false, sugar: true, clue: 'A sweet, brightly coloured drink popular at Ghanaian street stalls.' },
  { id: 'milk', name: 'Milk Mix', starch: false, protein: true, sugar: true, clue: 'A white, opaque liquid that tastes slightly sweet.' },
  { id: 'gruel', name: 'Corn Gruel', starch: true, protein: false, sugar: true, clue: 'A thick, slightly sweet porridge served at breakfast in Northern Ghana.' },
];

const TESTS: Record<TestType, {
  label: string; reagent: string; positive: string; negative: string;
  posColor: string; negColor: string; procedure: string[]; requiresHeat: boolean;
  detects: string;
}> = {
  iodine: {
    label: 'Iodine Test', reagent: 'Iodine Solution',
    positive: 'Blue-black', negative: 'Amber/brown',
    posColor: '#1e293b', negColor: '#d97706',
    procedure: ['Add 2 cm³ of sample to test tube', 'Add 3–5 drops of Iodine solution', 'Observe colour change immediately'],
    requiresHeat: false,
    detects: 'Starch',
  },
  biuret: {
    label: 'Biuret Test', reagent: 'NaOH + CuSO₄',
    positive: 'Violet/purple', negative: 'Blue (unchanged)',
    posColor: '#7c3aed', negColor: '#3b82f6',
    procedure: ['Add 2 cm³ of sample to test tube', 'Add 2 cm³ of dilute NaOH', 'Add 3 drops of CuSO₄, mix gently', 'Observe colour — do NOT heat'],
    requiresHeat: false,
    detects: 'Protein',
  },
  benedict: {
    label: "Benedict's Test", reagent: "Benedict's Reagent",
    positive: 'Brick-red/orange', negative: 'Blue (unchanged)',
    posColor: '#b91c1c', negColor: '#3b82f6',
    procedure: ['Add 2 cm³ of sample to test tube', "Add 2 cm³ of Benedict's reagent", 'Heat in water bath at 80°C for 2 min', 'Observe colour change'],
    requiresHeat: true,
    detects: 'Reducing Sugar',
  },
};

function evaluate(s: Sample, t: TestType): { color: string; result: string; positive: boolean } {
  if (t === 'iodine') return s.starch
    ? { color: TESTS.iodine.posColor, result: 'Blue-black', positive: true }
    : { color: TESTS.iodine.negColor, result: 'Amber', positive: false };
  if (t === 'biuret') return s.protein
    ? { color: TESTS.biuret.posColor, result: 'Violet', positive: true }
    : { color: TESTS.biuret.negColor, result: 'Blue', positive: false };
  return s.sugar
    ? { color: TESTS.benedict.posColor, result: 'Brick-red', positive: true }
    : { color: TESTS.benedict.negColor, result: 'Blue', positive: false };
}

interface FoodTestsSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function FoodTestsSimulation({ variables, isRunning, onRecordData }: FoodTestsSimProps) {
  const [sampleIdx, setSampleIdx] = useState(() => Math.min(variables['food-sample'] ?? 0, SAMPLES.length - 1));
  const [phase, setPhase] = useState<Phase>('brief');
  const [activeTest, setActiveTest] = useState<TestType>('iodine');
  const [completedTests, setCompletedTests] = useState<Partial<Record<TestType, { color: string; result: string; positive: boolean }>>>({});
  const [heated, setHeated] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Record<'starch' | 'protein' | 'sugar', boolean>>({ starch: false, protein: false, sugar: false });
  const [diagResult, setDiagResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [dataLog, setDataLog] = useState<{ sample: string; test: string; observed: string; positive: boolean }[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const [plannedTests, setPlannedTests] = useState<TestType[]>([]);
  const [planReasoning, setPlanReasoning] = useState('');

  const sample = SAMPLES[sampleIdx];
  const testInfo = TESTS[activeTest];
  const allThreeDone = !!completedTests.iodine && !!completedTests.biuret && !!completedTests.benedict;

  const runTest = () => {
    if (animating) return;
    if (activeTest === 'benedict' && !heated) return;
    setAnimating(true);
    setTimeout(() => {
      const result = evaluate(sample, activeTest);
      setCompletedTests(prev => ({ ...prev, [activeTest]: result }));
      setDataLog(prev => [...prev, {
        sample: sample.name, test: testInfo.label,
        observed: result.result, positive: result.positive,
      }]);
      setAnimating(false);
    }, 1400);
  };

  const submitDiagnosis = () => {
    const correct = diagnosis.starch === sample.starch && diagnosis.protein === sample.protein && diagnosis.sugar === sample.sugar;
    setDiagResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 8);
  };

  const submitPlan = () => {
    if (planReasoning.trim().length > 0) {
      setScore(s => s + 2);
      setPhase('test');
    }
  };

  const nextSample = () => {
    setSampleIdx(i => (i + 1) % SAMPLES.length);
    setCompletedTests({}); setHeated(false);
    setDiagnosis({ starch: false, protein: false, sugar: false });
    setDiagResult(null); setPhase('plan'); setActiveTest('iodine');
    setPlannedTests([]); setPlanReasoning('');
  };

  const resetAll = () => {
    setSampleIdx(0); setPhase('brief'); setCompletedTests({});
    setHeated(false); setAnimating(false);
    setDiagnosis({ starch: false, protein: false, sugar: false });
    setDiagResult(null); setScore(0); setDataLog([]); setActiveTest('iodine');
    setPlannedTests([]); setPlanReasoning('');
  };

  const knownResults = useMemo(() => {
    const results: string[] = [];
    if (completedTests.iodine) results.push(`Iodine: ${completedTests.iodine.result} → Starch ${completedTests.iodine.positive ? 'PRESENT' : 'ABSENT'}`);
    if (completedTests.biuret) results.push(`Biuret: ${completedTests.biuret.result} → Protein ${completedTests.biuret.positive ? 'PRESENT' : 'ABSENT'}`);
    if (completedTests.benedict) results.push(`Benedict's: ${completedTests.benedict.result} → Sugar ${completedTests.benedict.positive ? 'PRESENT' : 'ABSENT'}`);
    return results;
  }, [completedTests]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">🧪 Food Tests Lab</h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology Practical — Use clinical reasoning to identify unknown nutrients.</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Sample</div>
            <div className="font-semibold text-white">{sample.name}</div>
          </div>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400">
            <div className="text-[10px] uppercase tracking-widest">Score</div>
            <div className="font-mono text-xl font-bold">{score}</div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowInstructions(!showInstructions)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <HelpCircle size={14} />
        <span className="uppercase tracking-widest font-bold">How to Play</span>
        <ChevronDown size={14} className={`transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 space-y-1">
            <p>You are a lab scientist. A patient's sample has arrived with a <strong className="text-white">brief clue</strong>.</p>
            <p><strong className="text-yellow-400">1. Plan:</strong> Read the clue. Which tests will you run, and in what order? Justify your plan.</p>
            <p><strong className="text-cyan-400">2. Test:</strong> Run your planned tests. Follow correct procedure.</p>
            <p><strong className="text-green-400">3. Diagnose:</strong> Based on evidence, which nutrients are present?</p>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'brief' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-8 text-center space-y-6">
          <FlaskConical size={48} className="text-cyan-400 mx-auto" />
          <h3 className="text-xl text-white font-medium">New Case: {sample.name}</h3>
          <div className="bg-black/40 border border-slate-800 rounded-xl p-4 max-w-lg mx-auto">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Patient Clue</p>
            <p className="text-slate-300 text-sm italic">"{sample.clue}"</p>
          </div>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Based on this clue, which nutrients do you <strong className="text-white">suspect</strong> might be present?
            Plan your diagnostic strategy before running any tests.
          </p>
          <button onClick={() => setPhase('plan')} className="bg-brand-accent text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center gap-2 mx-auto">
            Plan Investigation <ArrowRight size={16} />
          </button>
        </motion.div>
      )}

      {phase === 'plan' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-5 lg:grid-cols-[1fr,0.9fr]">
          <div className="rounded-[2rem] border border-yellow-500/20 bg-yellow-500/5 p-6">
            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lightbulb size={14} /> Step 1: Plan Your Investigation
            </h3>
            <div className="bg-black/40 border border-slate-800 rounded-xl p-4 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Sample Clue</p>
              <p className="text-slate-300 text-sm italic">"{sample.clue}"</p>
            </div>
            <div className="mb-4">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">
                Which tests will you run, and why? What do you suspect based on the clue?
              </label>
              <textarea
                value={planReasoning}
                onChange={e => setPlanReasoning(e.target.value)}
                placeholder="e.g. Based on the clue, I suspect starch because... I will test for starch first using iodine because..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-yellow-400 outline-none"
              />
            </div>
            <button
              onClick={submitPlan}
              disabled={planReasoning.trim().length === 0}
              className="w-full px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
            >
              Begin Testing <ArrowRight size={16} />
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Available Tests</h4>
            {(['iodine', 'biuret', 'benedict'] as TestType[]).map(t => (
              <div key={t} className="bg-black/30 border border-slate-800 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">{TESTS[t].label}</span>
                  <span className="text-[10px] text-slate-500">detects: <strong className="text-cyan-400">{TESTS[t].detects}</strong></span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 text-center">
                    <span className="text-green-400 font-bold">+ve:</span> <span className="text-slate-400">{TESTS[t].positive}</span>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-center">
                    <span className="text-red-400 font-bold">−ve:</span> <span className="text-slate-400">{TESTS[t].negative}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'test' && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Beaker size={16} className="text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Lab Bench — {sample.name}</span>
              </div>
              <svg viewBox="0 0 520 260" className="w-full rounded-2xl bg-[#08101b]">
                <rect x="20" y="200" width="480" height="40" fill="#3f3f46" rx="4" />
                <rect x="40" y="110" width="50" height="70" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <rect x="50" y="100" width="30" height="15" rx="4" fill="#334155" />
                <text x="65" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">{testInfo.reagent.split(' ')[0]}</text>

                {animating && (
                  <motion.circle initial={{ cy: 130, opacity: 1 }} animate={{ cy: 160, opacity: 0 }}
                    transition={{ duration: 0.6, repeat: 2 }} cx="180" r="4"
                    fill={activeTest === 'iodine' ? '#d97706' : activeTest === 'biuret' ? '#7c3aed' : '#3b82f6'} />
                )}

                <rect x="160" y="100" width="40" height="90" rx="14"
                  fill={completedTests[activeTest] ? completedTests[activeTest]!.color : 'rgba(148,163,184,0.15)'}
                  stroke="#cbd5e1" strokeWidth="2" />
                <text x="180" y="88" fill="#cbd5e1" fontSize="10" textAnchor="middle">Sample + Reagent</text>

                {activeTest === 'benedict' && (
                  <g>
                    <rect x="165" y="195" width="30" height="10" rx="3" fill="#64748b" />
                    <rect x="175" y="170" width="10" height="25" rx="2" fill="#475569" />
                    {heated && (
                      <motion.path d="M175 168 C170 150, 183 145, 180 130" fill="none" stroke="#f97316" strokeWidth="3"
                        animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                    )}
                  </g>
                )}

                <rect x="300" y="100" width="180" height="90" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <text x="390" y="124" fill="#94a3b8" fontSize="10" textAnchor="middle">Observation</text>
                {completedTests[activeTest] ? (
                  <>
                    <circle cx="390" cy="152" r="14" fill={completedTests[activeTest]!.color} />
                    <text x="390" y="180" fill="#e2e8f0" fontSize="12" textAnchor="middle" fontWeight="bold">{completedTests[activeTest]!.result}</text>
                  </>
                ) : (
                  <text x="390" y="155" fill="#475569" fontSize="11" textAnchor="middle">Run test to observe</text>
                )}
              </svg>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Procedure — {testInfo.label}</div>
              <ol className="space-y-2 text-sm text-slate-300 list-decimal pl-5">
                {testInfo.procedure.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Select Test</div>
              <div className="flex flex-wrap gap-2">
                {(['iodine', 'biuret', 'benedict'] as TestType[]).map(t => (
                  <button key={t} onClick={() => { setActiveTest(t); setHeated(false); }}
                    className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${
                      activeTest === t ? 'bg-cyan-400 text-black' : completedTests[t] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-900 text-slate-300'
                    }`}>
                    {completedTests[t] && <CheckCircle2 size={12} />}
                    {TESTS[t].label.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {activeTest === 'benedict' && !completedTests.benedict && (
                  <button onClick={() => setHeated(true)}
                    className={`rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${heated ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}`}>
                    <Flame size={14} /> {heated ? 'Heated ✓' : 'Heat'}
                  </button>
                )}
                <button onClick={runTest} disabled={animating || !!completedTests[activeTest] || (activeTest === 'benedict' && !heated)}
                  className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30 flex items-center justify-center gap-2">
                  <Droplets size={14} /> {animating ? 'Testing...' : 'Add Reagent & Observe'}
                </button>
              </div>
            </div>

            {knownResults.length > 0 && (
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Test Results So Far</div>
                {knownResults.map((r, i) => (
                  <div key={i} className="text-xs text-slate-300 mb-2 p-2 bg-black/30 rounded-lg">{r}</div>
                ))}
              </div>
            )}

            {allThreeDone && (
              <button onClick={() => setPhase('diagnose')}
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-white transition-all flex items-center justify-center gap-2">
                Make Diagnosis <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'diagnose' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-4">
          <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-6">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Step 3: Diagnose</h3>
            <p className="text-slate-300 text-sm mb-4">
              Based on your test results, which nutrients are present in <strong className="text-white">{sample.name}</strong>?
            </p>

            <div className="bg-black/40 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Evidence Summary</div>
              {knownResults.map((r, i) => <div key={i} className="text-xs text-slate-300 mb-1">{r}</div>)}
            </div>

            {(['starch', 'protein', 'sugar'] as const).map(n => (
              <button key={n} onClick={() => setDiagnosis(p => ({ ...p, [n]: !p[n] }))}
                className={`mb-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                  diagnosis[n] ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-slate-800 bg-black/30 text-slate-300'
                }`}>
                <span className="capitalize">{n === 'sugar' ? 'Reducing Sugar' : n}</span>
                {diagnosis[n] && <CheckCircle2 size={16} />}
              </button>
            ))}

            <button onClick={submitDiagnosis} disabled={!!diagResult}
              className="mt-2 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30">
              Submit Diagnosis
            </button>

            {diagResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-3 rounded-xl border p-4 text-sm ${diagResult === 'correct' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                {diagResult === 'correct'
                  ? '✅ Excellent! Your diagnosis matches the evidence perfectly.'
                  : `The evidence shows: ${sample.starch ? '✓ Starch' : '✗ Starch'}, ${sample.protein ? '✓ Protein' : '✗ Protein'}, ${sample.sugar ? '✓ Sugar' : '✗ Sugar'}. Review your test results.`}
              </motion.div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={nextSample}
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-black">
              Next Case →
            </button>
            <button onClick={() => setPhase('results')}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300">
              View Log
            </button>
            <button onClick={resetAll} className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300">
              <RotateCcw size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {phase === 'results' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Case History</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-3">Sample</th><th className="py-2 px-3">Test</th><th className="py-2 px-3">Result</th><th className="py-2 px-3">Diagnosis</th></tr>
                </thead>
                <tbody>
                  {dataLog.map((row, i) => (
                    <tr key={i} className="border-b border-slate-800/50 text-slate-300">
                      <td className="py-2 px-3">{row.sample}</td>
                      <td className="py-2 px-3">{row.test}</td>
                      <td className="py-2 px-3 font-mono">{row.observed}</td>
                      <td className="py-2 px-3">{row.positive ? <CheckCircle2 size={14} className="text-green-400" /> : '−'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={() => setPhase('plan')} className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold uppercase tracking-widest text-black">
            ← Back to Lab
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function FoodTestsLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <FoodTestsSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You diagnosed {trials.length} sample{trials.length !== 1 ? 's' : ''} using clinical reasoning.
        </p>
        <button onClick={() => setCompletedSession(null)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={FOOD_TESTS_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}