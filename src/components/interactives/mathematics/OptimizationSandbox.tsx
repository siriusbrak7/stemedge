import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

interface Scenario {
  name: string; description: string;
  expr: string; derivExpr: string; secondDerivExpr: string;
  xLabel: string; yLabel: string; xUnit: string;
  f: (x: number) => number; df: (x: number) => number; ddf: (x: number) => number;
  xMin: number; xMax: number; optX: number; optType: 'max' | 'min';
}

const SCENARIOS: Scenario[] = [
  {
    name: 'Fence Area', description: 'A farmer has 40m of fencing to enclose a rectangular field against a wall. Maximize the area.',
    expr: 'A(x) = x(40−2x) = 40x−2x²', derivExpr: "A'(x) = 40−4x", secondDerivExpr: "A''(x) = −4",
    xLabel: 'Width (x)', yLabel: 'Area', xUnit: 'm',
    f: x => x * (40 - 2 * x), df: x => 40 - 4 * x, ddf: () => -4,
    xMin: 0, xMax: 20, optX: 10, optType: 'max',
  },
  {
    name: 'Revenue', description: 'Revenue R = −2p² + 80p, where p is the price in £. Find the price that maximizes revenue.',
    expr: 'R(p) = −2p²+80p', derivExpr: "R'(p) = −4p+80", secondDerivExpr: "R''(p) = −4",
    xLabel: 'Price (£)', yLabel: 'Revenue (£)', xUnit: '£',
    f: p => -2 * p * p + 80 * p, df: p => -4 * p + 80, ddf: () => -4,
    xMin: 0, xMax: 40, optX: 20, optType: 'max',
  },
  {
    name: 'Can Volume', description: 'A can has surface area 600 cm². Minimize surface area for a volume of 500cm³ by finding optimal radius.',
    expr: 'S(r) = 2πr² + 1000/r', derivExpr: "S'(r) = 4πr − 1000/r²", secondDerivExpr: "S''(r) = 4π + 2000/r³",
    xLabel: 'Radius (cm)', yLabel: 'Surface Area (cm²)', xUnit: 'cm',
    f: r => 2 * Math.PI * r * r + 1000 / Math.max(0.1, r), df: r => 4 * Math.PI * r - 1000 / (r * r), ddf: r => 4 * Math.PI + 2000 / (r * r * r),
    xMin: 1, xMax: 12, optX: 4.3, optType: 'min',
  },
];

const QUIZ: QuizQuestion[] = [
  { id: 'op1', question: "At an optimal point, f'(x) equals:", type: 'multiple-choice', options: ['1', '0', 'Infinity', 'Undefined'], correctAnswer: '0', explanation: "At a maximum or minimum, the derivative is zero (horizontal tangent)." },
  { id: 'op2', question: "If f''(x) < 0 at a critical point, it's a:", type: 'multiple-choice', options: ['Minimum', 'Maximum', 'Inflection', 'Saddle point'], correctAnswer: 'Maximum', explanation: 'Negative second derivative = concave down = local maximum.' },
  { id: 'op3', question: 'The optimization method step order is:', type: 'multiple-choice', options: ['Differentiate, set to 0, verify', 'Integrate, set to 0, verify', 'Set to 0, differentiate, guess', 'Graph, guess, submit'], correctAnswer: 'Differentiate, set to 0, verify', explanation: "1. Differentiate → 2. Set f'(x) = 0 → 3. Verify with f''(x)." },
  { id: 'op4', question: "A farmer with 40m fencing (one wall side) has max area at x =", type: 'multiple-choice', options: ['5m', '10m', '15m', '20m'], correctAnswer: '10m', explanation: "A'(x) = 40 − 4x = 0 → x = 10m." },
  { id: 'op5', question: "If f''(x) > 0 at a critical point, it's a:", type: 'multiple-choice', options: ['Maximum', 'Minimum', 'Neither', 'Both'], correctAnswer: 'Minimum', explanation: 'Positive second derivative = concave up = local minimum (like a valley).' },
];

export default function OptimizationSandbox() {
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {(['learn', 'simulation', 'quiz'] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === m ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>{m}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'learn' && <LearnPanel />}
            {viewMode === 'simulation' && <OptSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Optimization Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LearnPanel() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is Optimization?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Optimization uses calculus to find the <strong className="text-white">maximum or minimum</strong> value of a quantity. It's used in engineering, economics, physics, and everyday problem-solving.
        </p>
      </div>
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Step-by-Step Method</h3>
        <ol className="text-sm text-slate-300 space-y-3 list-decimal pl-5">
          <li><strong className="text-white">Write the equation</strong> to optimize in terms of one variable</li>
          <li><strong className="text-white">Differentiate</strong> to find f'(x)</li>
          <li><strong className="text-white">Set f'(x) = 0</strong> and solve for x (critical points)</li>
          <li><strong className="text-white">Verify with f''(x)</strong>: negative = maximum, positive = minimum</li>
          <li><strong className="text-white">Substitute back</strong> to find the optimal value</li>
        </ol>
      </div>
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Second Derivative Test</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl text-center">
            <p className="text-red-400 font-bold text-sm">f''(x) &lt; 0</p>
            <p className="text-slate-300 text-xs mt-1">Concave down ∩</p>
            <p className="text-white text-xs font-bold">LOCAL MAXIMUM</p>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl text-center">
            <p className="text-green-400 font-bold text-sm">f''(x) &gt; 0</p>
            <p className="text-slate-300 text-xs mt-1">Concave up ∪</p>
            <p className="text-white text-xs font-bold">LOCAL MINIMUM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptSim() {
  const [scnIdx, setScnIdx] = useState(0);
  const scn = SCENARIOS[scnIdx];
  const [xVal, setXVal] = useState(scn.optX);

  const yVal = scn.f(xVal);
  const slope = scn.df(xVal);
  const curvature = scn.ddf(xVal);
  const isCritical = Math.abs(slope) < 0.5;
  const optY = scn.f(scn.optX);

  const W = 440, H = 260;
  const pad = 0.1 * (scn.xMax - scn.xMin);

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    const yVals: number[] = [];
    for (let x = scn.xMin; x <= scn.xMax; x += (scn.xMax - scn.xMin) / 200) yVals.push(scn.f(x));
    const yMin2 = Math.min(...yVals) - 10;
    const yMax2 = Math.max(...yVals) + 10;
    for (let x = scn.xMin; x <= scn.xMax; x += (scn.xMax - scn.xMin) / 200) {
      const sx = ((x - scn.xMin + pad) / (scn.xMax - scn.xMin + 2 * pad)) * W;
      const sy = H - ((scn.f(x) - yMin2) / (yMax2 - yMin2)) * H;
      pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
    }
    return { pts: pts.join(' '), yMin: yMin2, yMax: yMax2 };
  }, [scnIdx]);

  const toSX = (x: number) => ((x - scn.xMin + pad) / (scn.xMax - scn.xMin + 2 * pad)) * W;
  const toSY = (y: number) => H - ((y - curvePath.yMin) / (curvePath.yMax - curvePath.yMin)) * H;

  const selectScn = (i: number) => { setScnIdx(i); setXVal(SCENARIOS[i].optX); };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {SCENARIOS.map((s, i) => (
            <button key={i} onClick={() => selectScn(i)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${scnIdx === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {s.name}
            </button>
          ))}
        </div>

        <p className="text-slate-300 text-sm text-center max-w-md">{scn.description}</p>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width={W} height={H} fill="#0a0a1a" rx="12" />
          <polyline points={curvePath.pts} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

          {/* Current point */}
          <circle cx={toSX(xVal)} cy={toSY(yVal)} r={isCritical ? 7 : 5} fill={isCritical ? '#fbbf24' : '#ef4444'} stroke="white" strokeWidth="1.5" />
          {isCritical && (
            <motion.circle cx={toSX(xVal)} cy={toSY(yVal)} r="12" fill="none" stroke="#fbbf24" strokeWidth="1"
              animate={{ r: [10, 18, 10], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
          )}

          {/* Optimal point marker */}
          <line x1={toSX(scn.optX)} y1={toSY(optY)} x2={toSX(scn.optX)} y2={toSY(curvePath.yMin)} stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" />
          <text x={toSX(scn.optX)} y={H - 5} fill="#22c55e" fontSize="7" textAnchor="middle">x={scn.optX}</text>
        </svg>

        <div className="flex items-center gap-3 w-full max-w-[460px]">
          <span className="text-[10px] text-slate-500 uppercase">{scn.xLabel}: {xVal.toFixed(1)}{scn.xUnit}</span>
          <input type="range" min={scn.xMin + 0.1} max={scn.xMax - 0.1} step="0.1" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="flex-1 accent-brand-accent" />
        </div>
      </div>

      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Live Values</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">{scn.yLabel}</p>
              <p className="text-blue-400 font-mono text-lg">{yVal.toFixed(2)}</p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">f'(x) — slope</p>
              <p className="text-green-400 font-mono">{slope.toFixed(3)}</p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase">f''(x) — curvature</p>
              <p className={`font-mono ${curvature < 0 ? 'text-red-400' : 'text-green-400'}`}>{curvature.toFixed(3)}</p>
              <p className="text-slate-500 text-[10px]">{curvature < 0 ? '∩ Concave down → Maximum' : '∪ Concave up → Minimum'}</p>
            </div>
          </div>
        </div>

        {isCritical && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-2xl">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">⚡ Optimal Point Found!</p>
            <p className="text-white text-sm">f'(x) ≈ 0 at x = {xVal.toFixed(1)}</p>
            <p className="text-slate-300 text-xs mt-1">f''(x) = {curvature.toFixed(2)} → {scn.optType === 'max' ? 'MAXIMUM' : 'MINIMUM'}</p>
            <p className="text-brand-accent font-mono text-lg mt-1">{scn.yLabel} = {yVal.toFixed(2)}</p>
          </motion.div>
        )}

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Working</h4>
          <div className="text-xs text-slate-300 font-mono space-y-1">
            <p>{scn.expr}</p>
            <p>{scn.derivExpr}</p>
            <p>Set = 0 → x = {scn.optX}</p>
            <p>{scn.secondDerivExpr} = {scn.ddf(scn.optX).toFixed(1)}</p>
            <p className="text-white">∴ {scn.optType === 'max' ? 'Maximum' : 'Minimum'} at x = {scn.optX}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
