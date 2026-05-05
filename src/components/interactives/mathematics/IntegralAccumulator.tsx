import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';
type Method = 'left' | 'right' | 'midpoint' | 'trapezoid';

const f = (x: number) => 0.5 * x * x + 1;
const F = (x: number) => (x ** 3) / 6 + x; // antiderivative

const QUIZ: QuizQuestion[] = [
  { id: 'ia1', question: 'The definite integral ∫f(x)dx from a to b represents:', type: 'multiple-choice', options: ['The slope at a point', 'The area under the curve', 'The maximum value', 'The derivative'], correctAnswer: 'The area under the curve', explanation: 'A definite integral calculates the signed area between the curve and the x-axis.' },
  { id: 'ia2', question: 'The Fundamental Theorem of Calculus states:', type: 'multiple-choice', options: ['∫f(x)dx = F(b) − F(a)', '∫f(x)dx = f(b) − f(a)', '∫f(x)dx = F(b) + F(a)', 'None of these'], correctAnswer: '∫f(x)dx = F(b) − F(a)', explanation: 'Where F is the antiderivative of f. Evaluate F at the bounds and subtract.' },
  { id: 'ia3', question: 'Left Riemann sums tend to:', type: 'multiple-choice', options: ['Always overestimate', 'Always underestimate', 'Underestimate for increasing functions', 'Equal the exact area'], correctAnswer: 'Underestimate for increasing functions', explanation: 'For increasing functions, left rectangles miss the "extra" area at the top right of each strip.' },
  { id: 'ia4', question: 'Which method uses trapezoids instead of rectangles?', type: 'multiple-choice', options: ['Left Riemann', 'Right Riemann', 'Midpoint', 'Trapezoidal'], correctAnswer: 'Trapezoidal', explanation: 'The trapezoidal rule connects f(xᵢ) and f(xᵢ₊₁) with a straight line, forming trapezoids.' },
  { id: 'ia5', question: 'The antiderivative of 2x is:', type: 'multiple-choice', options: ['2', 'x²', 'x² + C', '2x²'], correctAnswer: 'x² + C', explanation: 'd/dx[x²] = 2x, so ∫2x dx = x² + C (don\'t forget the constant!).' },
];

export default function IntegralAccumulator() {
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
            {viewMode === 'simulation' && <IntegralSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Integral Accumulator Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is Integration?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Integration is the <strong className="text-white">reverse of differentiation</strong>. While a derivative gives the rate of change, an integral <strong className="text-brand-accent">accumulates</strong> the total quantity — the area under a curve.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)</p>
          <p className="text-slate-400 text-xs mt-1">Fundamental Theorem of Calculus</p>
        </div>
        <p className="text-slate-300 text-sm">Where F(x) is the <strong className="text-white">antiderivative</strong> — a function whose derivative is f(x).</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Numerical Methods</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          When we can't find an antiderivative, we approximate the area using rectangles or trapezoids:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Left Riemann', desc: 'Height from left edge of each strip', color: '#3b82f6' },
            { name: 'Right Riemann', desc: 'Height from right edge of each strip', color: '#22c55e' },
            { name: 'Midpoint', desc: 'Height from middle of each strip', color: '#f59e0b' },
            { name: 'Trapezoidal', desc: 'Trapezoid connecting both edges', color: '#a855f7' },
          ].map(m => (
            <div key={m.name} className="bg-[#0a0a1a] border border-slate-800 p-3 rounded-xl">
              <p className="font-bold text-xs" style={{ color: m.color }}>{m.name}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-3">More rectangles (larger n) → better approximation → approaches the exact integral.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Real-World: Velocity → Displacement</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          If you have a velocity-time graph, the <strong className="text-white">area under the curve</strong> equals the total <strong className="text-brand-accent">displacement</strong>. This is integration in action — accumulating tiny distance increments (v × dt) over time.
        </p>
      </div>
    </div>
  );
}

function IntegralSim() {
  const [n, setN] = useState(8);
  const [upperBound, setUpperBound] = useState(3);
  const [method, setMethod] = useState<Method>('left');

  const lowerBound = 0;
  const dx = (upperBound - lowerBound) / n;
  const exactArea = F(upperBound) - F(lowerBound);

  // Calculate approximate area
  const approxArea = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const xL = lowerBound + i * dx;
      const xR = xL + dx;
      const xM = xL + dx / 2;
      switch (method) {
        case 'left': sum += f(xL) * dx; break;
        case 'right': sum += f(xR) * dx; break;
        case 'midpoint': sum += f(xM) * dx; break;
        case 'trapezoid': sum += (f(xL) + f(xR)) / 2 * dx; break;
      }
    }
    return sum;
  }, [n, upperBound, method, dx]);

  const error = Math.abs(approxArea - exactArea);
  const errorPct = exactArea !== 0 ? (error / exactArea) * 100 : 0;

  const W = 440, H = 260;
  const xMin = -0.5, xMax = 4.5, yMin = -0.5, yMax = 10;
  const toSX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const toSY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

  // f(x) curve
  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      pts.push(`${toSX(x).toFixed(1)},${toSY(f(x)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const methodColors: Record<Method, string> = { left: '#3b82f6', right: '#22c55e', midpoint: '#f59e0b', trapezoid: '#a855f7' };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        {/* Method selector */}
        <div className="flex gap-2 flex-wrap justify-center">
          {(['left', 'right', 'midpoint', 'trapezoid'] as Method[]).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${method === m ? 'text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              style={method === m ? { backgroundColor: methodColors[m] } : undefined}>
              {m}
            </button>
          ))}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width={W} height={H} fill="#0a0a1a" rx="12" />

          {/* Axes */}
          <line x1={toSX(0)} y1="0" x2={toSX(0)} y2={H} stroke="#334155" strokeWidth="1" />
          <line x1="0" y1={toSY(0)} x2={W} y2={toSY(0)} stroke="#334155" strokeWidth="1" />

          {/* Rectangles / Trapezoids */}
          {Array.from({ length: n }).map((_, i) => {
            const xL = lowerBound + i * dx;
            const xR = xL + dx;
            const xM = xL + dx / 2;
            const color = methodColors[method];

            if (method === 'trapezoid') {
              const points = `${toSX(xL)},${toSY(0)} ${toSX(xL)},${toSY(f(xL))} ${toSX(xR)},${toSY(f(xR))} ${toSX(xR)},${toSY(0)}`;
              return <polygon key={i} points={points} fill={color} opacity="0.2" stroke={color} strokeWidth="0.5" />;
            }

            const height = method === 'left' ? f(xL) : method === 'right' ? f(xR) : f(xM);
            return (
              <rect key={i} x={toSX(xL)} y={toSY(height)} width={toSX(xR) - toSX(xL)} height={toSY(0) - toSY(height)}
                fill={color} opacity="0.2" stroke={color} strokeWidth="0.5" />
            );
          })}

          {/* f(x) curve */}
          <polyline points={curvePath} fill="none" stroke="#ef4444" strokeWidth="2.5" />

          {/* Labels */}
          <text x={toSX(2)} y="15" fill="#64748b" fontSize="9" textAnchor="middle">f(x) = 0.5x² + 1</text>
        </svg>

        {/* Controls */}
        <div className="flex gap-6 flex-wrap justify-center">
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Rectangles (n)</label>
            <input type="range" min="2" max="50" value={n} onChange={e => setN(Number(e.target.value))} className="w-28 accent-brand-accent" />
            <span className="text-xs text-brand-accent font-mono">{n}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Upper bound (b)</label>
            <input type="range" min="1" max="4" step="0.5" value={upperBound} onChange={e => setUpperBound(Number(e.target.value))} className="w-28 accent-brand-accent" />
            <span className="text-xs text-brand-accent font-mono">{upperBound}</span>
          </div>
        </div>
      </div>

      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Results</h3>
          <div className="space-y-3">
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase">Approximation ({method})</p>
              <p className="font-mono text-lg" style={{ color: methodColors[method] }}>{approxArea.toFixed(4)}</p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase">Exact (F(b)−F(a))</p>
              <p className="text-white font-mono text-lg">{exactArea.toFixed(4)}</p>
            </div>
            <div className={`p-3 rounded-lg border ${errorPct < 1 ? 'border-green-500/50 bg-green-500/10' : 'border-amber-500/50 bg-amber-500/10'}`}>
              <p className="text-[10px] text-slate-500 uppercase">Error</p>
              <p className={`font-mono text-lg ${errorPct < 1 ? 'text-green-400' : 'text-amber-400'}`}>{errorPct.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Antiderivative</h4>
          <div className="text-xs text-slate-300 font-mono space-y-1">
            <p>f(x) = 0.5x² + 1</p>
            <p>F(x) = x³/6 + x + C</p>
            <p>∫₀<sup>{upperBound}</sup> = F({upperBound}) − F(0)</p>
            <p>= {F(upperBound).toFixed(3)} − {F(0).toFixed(3)}</p>
            <p className="text-white font-bold">= {exactArea.toFixed(4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
