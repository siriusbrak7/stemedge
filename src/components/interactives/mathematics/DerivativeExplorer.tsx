import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

interface FuncDef {
  name: string; expr: string; derivExpr: string;
  f: (x: number) => number; df: (x: number) => number;
}

const FUNCTIONS: FuncDef[] = [
  { name: 'x³', expr: 'f(x) = x³', derivExpr: "f'(x) = 3x²", f: x => x ** 3, df: x => 3 * x ** 2 },
  { name: 'x² − 4x + 3', expr: 'f(x) = x²−4x+3', derivExpr: "f'(x) = 2x−4", f: x => x ** 2 - 4 * x + 3, df: x => 2 * x - 4 },
  { name: 'sin(x)', expr: 'f(x) = sin(x)', derivExpr: "f'(x) = cos(x)", f: x => Math.sin(x), df: x => Math.cos(x) },
  { name: 'eˣ', expr: 'f(x) = eˣ', derivExpr: "f'(x) = eˣ", f: x => Math.exp(x), df: x => Math.exp(x) },
  { name: '−x²+2x+3', expr: 'f(x) = −x²+2x+3', derivExpr: "f'(x) = −2x+2", f: x => -(x ** 2) + 2 * x + 3, df: x => -2 * x + 2 },
];

const QUIZ: QuizQuestion[] = [
  { id: 'dx1', question: "The derivative of x⁴ is:", type: 'multiple-choice', options: ['x³', '4x³', '4x⁴', 'x⁵/5'], correctAnswer: '4x³', explanation: 'Power Rule: d/dx[xⁿ] = nxⁿ⁻¹. So d/dx[x⁴] = 4x³.' },
  { id: 'dx2', question: 'The derivative of sin(x) is:', type: 'multiple-choice', options: ['-sin(x)', 'cos(x)', 'tan(x)', '-cos(x)'], correctAnswer: 'cos(x)', explanation: 'Standard result: d/dx[sin(x)] = cos(x).' },
  { id: 'dx3', question: "At a local maximum, f'(x) equals:", type: 'multiple-choice', options: ['Infinity', '1', '0', 'Undefined'], correctAnswer: '0', explanation: 'At turning points (maxima and minima), the gradient is zero — the tangent line is horizontal.' },
  { id: 'dx4', question: "If f'(x) > 0, the function is:", type: 'multiple-choice', options: ['Decreasing', 'Increasing', 'At a maximum', 'Constant'], correctAnswer: 'Increasing', explanation: 'A positive derivative means the function has a positive gradient — it slopes upward.' },
  { id: 'dx5', question: 'The derivative of eˣ is:', type: 'multiple-choice', options: ['xeˣ⁻¹', 'eˣ', 'eˣ/x', 'ln(x)'], correctAnswer: 'eˣ', explanation: 'The exponential function is its own derivative: d/dx[eˣ] = eˣ.' },
];

export default function DerivativeExplorer() {
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
            {viewMode === 'simulation' && <DerivSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Derivative Explorer Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is a Derivative?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          The <strong className="text-white">derivative</strong> of a function at a point gives the <strong className="text-brand-accent">rate of change</strong> — the slope of the tangent line at that point. It tells you how fast y is changing relative to x.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">f'(x) = lim<sub>h→0</sub> [f(x+h) − f(x)] / h</p>
          <p className="text-slate-400 text-xs mt-1">The derivative from first principles</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Differentiation Rules</h3>
        <div className="space-y-3">
          {[
            { rule: 'Power Rule', formula: 'd/dx[xⁿ] = nxⁿ⁻¹', example: 'd/dx[x⁵] = 5x⁴' },
            { rule: 'Constant Multiple', formula: 'd/dx[cf(x)] = c·f\'(x)', example: 'd/dx[3x²] = 6x' },
            { rule: 'Sum Rule', formula: 'd/dx[f+g] = f\'+g\'', example: 'd/dx[x²+x] = 2x+1' },
            { rule: 'Chain Rule', formula: 'd/dx[f(g(x))] = f\'(g(x))·g\'(x)', example: 'd/dx[sin(2x)] = 2cos(2x)' },
            { rule: 'Product Rule', formula: 'd/dx[fg] = f\'g + fg\'', example: 'd/dx[x·eˣ] = eˣ + xeˣ' },
          ].map(r => (
            <div key={r.rule} className="bg-[#0a0a1a] border border-slate-800 rounded-xl p-3 flex items-start gap-3">
              <div className="min-w-[100px]"><p className="text-brand-accent text-xs font-bold">{r.rule}</p></div>
              <div className="flex-1">
                <p className="text-white font-mono text-sm">{r.formula}</p>
                <p className="text-slate-500 text-xs mt-0.5">e.g. {r.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Critical Points</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          When <strong className="text-white">f'(x) = 0</strong>, the tangent is horizontal — this is a <strong className="text-brand-accent">stationary point</strong>. Use the <strong className="text-white">second derivative test</strong> to classify it:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl text-center">
            <p className="text-green-400 text-xs font-bold">f''(x) &gt; 0</p>
            <p className="text-slate-300 text-xs">Local Minimum ∪</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl text-center">
            <p className="text-red-400 text-xs font-bold">f''(x) &lt; 0</p>
            <p className="text-slate-300 text-xs">Local Maximum ∩</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DerivSim() {
  const [funcIdx, setFuncIdx] = useState(0);
  const [xVal, setXVal] = useState(1);
  const fn = FUNCTIONS[funcIdx];

  const yVal = fn.f(xVal);
  const slope = fn.df(xVal);
  const isCritical = Math.abs(slope) < 0.05;

  // Graph scaling
  const W = 440, H = 280;
  const xMin = -4, xMax = 4, yMin = -5, yMax = 8;
  const toSX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const toSY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

  // Build f(x) path and f'(x) path
  const fPath = useMemo(() => {
    const pts: string[] = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = fn.f(x);
      if (Math.abs(y) < 50) pts.push(`${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [funcIdx]);

  const dfPath = useMemo(() => {
    const pts: string[] = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = fn.df(x);
      if (Math.abs(y) < 50) pts.push(`${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [funcIdx]);

  // Tangent line at current x
  const tx1 = xVal - 1.5, tx2 = xVal + 1.5;
  const ty1 = yVal + slope * (tx1 - xVal), ty2 = yVal + slope * (tx2 - xVal);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {FUNCTIONS.map((f, i) => (
            <button key={i} onClick={() => { setFuncIdx(i); setXVal(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${funcIdx === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {f.name}
            </button>
          ))}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width={W} height={H} fill="#0a0a1a" rx="12" />

          {/* Grid */}
          <line x1={toSX(0)} y1="0" x2={toSX(0)} y2={H} stroke="#334155" strokeWidth="1" />
          <line x1="0" y1={toSY(0)} x2={W} y2={toSY(0)} stroke="#334155" strokeWidth="1" />
          {[-3, -2, -1, 1, 2, 3].map(v => (
            <g key={v}>
              <line x1={toSX(v)} y1={toSY(0) - 3} x2={toSX(v)} y2={toSY(0) + 3} stroke="#475569" strokeWidth="0.5" />
              <text x={toSX(v)} y={toSY(0) + 12} fill="#64748b" fontSize="7" textAnchor="middle">{v}</text>
            </g>
          ))}

          {/* f(x) curve */}
          <polyline points={fPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          {/* f'(x) curve */}
          <polyline points={dfPath} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Tangent line */}
          <line x1={toSX(tx1)} y1={toSY(ty1)} x2={toSX(tx2)} y2={toSY(ty2)} stroke="#ef4444" strokeWidth="2" opacity="0.8" />

          {/* Current point */}
          <circle cx={toSX(xVal)} cy={toSY(yVal)} r={isCritical ? 7 : 5} fill={isCritical ? '#fbbf24' : '#ef4444'} stroke="white" strokeWidth="1.5" />
          {isCritical && (
            <motion.circle cx={toSX(xVal)} cy={toSY(yVal)} r="12" fill="none" stroke="#fbbf24" strokeWidth="1"
              animate={{ r: [10, 16, 10], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }} />
          )}

          {/* Legend */}
          <g transform="translate(10, 15)">
            <line x1="0" y1="0" x2="16" y2="0" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="20" y="4" fill="#3b82f6" fontSize="8">f(x)</text>
            <line x1="0" y1="14" x2="16" y2="14" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="20" y="18" fill="#22c55e" fontSize="8">f'(x)</text>
            <line x1="0" y1="28" x2="16" y2="28" stroke="#ef4444" strokeWidth="2" />
            <text x="20" y="32" fill="#ef4444" fontSize="8">Tangent</text>
          </g>
        </svg>

        <div className="flex items-center gap-3 w-full max-w-[460px]">
          <span className="text-[10px] text-slate-500 uppercase">x = {xVal.toFixed(1)}</span>
          <input type="range" min="-3.5" max="3.5" step="0.1" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="flex-1 accent-brand-accent" />
        </div>
      </div>

      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Live Values</h3>
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-700 text-center mb-3">
            <p className="text-blue-400 font-mono text-sm">{fn.expr}</p>
            <p className="text-green-400 font-mono text-sm">{fn.derivExpr}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 uppercase">f({xVal.toFixed(1)})</p>
              <p className="text-blue-400 font-mono text-lg">{yVal.toFixed(2)}</p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 uppercase">f'({xVal.toFixed(1)})</p>
              <p className="text-green-400 font-mono text-lg">{slope.toFixed(2)}</p>
            </div>
          </div>
          {isCritical && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="mt-3 p-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-center">
              <p className="text-amber-400 text-xs font-bold uppercase">⚡ Critical Point!</p>
              <p className="text-slate-300 text-xs mt-1">f'(x) ≈ 0 — tangent is horizontal</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{slope >= 0 ? 'Local Minimum ∪' : 'Local Maximum ∩'}</p>
            </motion.div>
          )}
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Show Working</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {fn.expr}<br />
            → Differentiate:<br />
            {fn.derivExpr}<br />
            → At x = {xVal.toFixed(1)}:<br />
            Slope = {slope.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  );
}
