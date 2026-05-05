import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'qf1', question: 'The quadratic formula solves for:', type: 'multiple-choice', options: ['The vertex', 'The y-intercept', 'The x-intercepts (roots)', 'The derivative'], correctAnswer: 'The x-intercepts (roots)', explanation: 'It solves ax² + bx + c = 0, giving the roots (x-intercepts).' },
  { id: 'qf2', question: 'The discriminant is:', type: 'multiple-choice', options: ['b² - 4ac', '-b', '2a', 'ax² + bx + c'], correctAnswer: 'b² - 4ac', explanation: 'The discriminant Δ = b²−4ac determines the number and type of roots.' },
  { id: 'qf3', question: 'If Δ < 0, the equation has:', type: 'multiple-choice', options: ['2 real roots', '1 repeated root', 'No real roots (complex)', 'Infinite roots'], correctAnswer: 'No real roots (complex)', explanation: 'A negative discriminant means √Δ is imaginary, so roots are complex numbers.' },
  { id: 'qf4', question: 'The quadratic formula is derived by:', type: 'multiple-choice', options: ['Factoring', 'Completing the square on ax²+bx+c=0', 'Guessing', 'Integration'], correctAnswer: 'Completing the square on ax²+bx+c=0', explanation: 'Completing the square on the general form gives the quadratic formula.' },
  { id: 'qf5', question: 'If roots are r₁ and r₂, the factored form is:', type: 'multiple-choice', options: ['a(x+r₁)(x+r₂)', 'a(x−r₁)(x−r₂)', '(x−r₁)+(x−r₂)', 'a×r₁×r₂'], correctAnswer: 'a(x−r₁)(x−r₂)', explanation: 'Factored form: f(x) = a(x−r₁)(x−r₂), where r₁ and r₂ are the roots.' },
];

export default function QuadraticFormula() {
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
            {viewMode === 'simulation' && <FormulaSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Quadratic Formula Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">The Quadratic Formula</h3>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-5 text-center mb-4">
          <p className="text-white font-mono text-xl">x = (−b ± √(b²−4ac)) / 2a</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This formula finds the roots of <strong className="text-white">any</strong> quadratic equation ax² + bx + c = 0, whether it can be factored or not.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Derivation (via Completing the Square)</h3>
        <div className="text-sm font-mono text-slate-300 space-y-2 bg-[#0a0a1a] p-4 rounded-xl border border-slate-800">
          <p>ax² + bx + c = 0</p>
          <p className="text-slate-500">→ Divide by a:</p>
          <p>x² + (b/a)x + c/a = 0</p>
          <p className="text-slate-500">→ Complete the square:</p>
          <p>(x + b/2a)² − b²/4a² + c/a = 0</p>
          <p className="text-slate-500">→ Rearrange:</p>
          <p>(x + b/2a)² = (b²−4ac) / 4a²</p>
          <p className="text-slate-500">→ Take square root:</p>
          <p>x + b/2a = ±√(b²−4ac) / 2a</p>
          <p className="text-slate-500">→ Solve for x:</p>
          <p className="text-brand-accent font-bold">x = (−b ± √(b²−4ac)) / 2a</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">The Discriminant (Δ = b²−4ac)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl text-center">
            <p className="text-green-400 text-xs font-bold">Δ &gt; 0</p>
            <p className="text-slate-300 text-xs mt-1">2 distinct real roots</p>
            <p className="text-slate-500 text-[10px]">Crosses x-axis twice</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl text-center">
            <p className="text-blue-400 text-xs font-bold">Δ = 0</p>
            <p className="text-slate-300 text-xs mt-1">1 repeated root</p>
            <p className="text-slate-500 text-[10px]">Touches x-axis</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl text-center">
            <p className="text-red-400 text-xs font-bold">Δ &lt; 0</p>
            <p className="text-slate-300 text-xs mt-1">Complex roots</p>
            <p className="text-slate-500 text-[10px]">Never crosses x-axis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormulaSim() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-4);

  const disc = b * b - 4 * a * c;
  const hasReal = disc >= 0;
  const root1 = hasReal ? (-b + Math.sqrt(disc)) / (2 * a) : null;
  const root2 = hasReal ? (-b - Math.sqrt(disc)) / (2 * a) : null;

  // Complex roots
  const realPart = -b / (2 * a);
  const imagPart = !hasReal ? Math.sqrt(-disc) / (2 * Math.abs(a)) : 0;

  const f = (x: number) => a * x * x + b * x + c;
  const vx = -b / (2 * a);
  const vy = f(vx);

  // Graph
  const W = 440, H = 280;
  const scaleX = 20, scaleY = 15;
  const oX = W / 2, oY = H / 2;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i - 50) * 0.3;
      const y = f(x);
      const sx = oX + x * scaleX;
      const sy = oY - y * scaleY;
      if (sy > -50 && sy < H + 50) pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [a, b, c]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width={W} height={H} fill="#0a0a1a" rx="12" />

          {/* Grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={i}>
              <line x1={0} y1={oY + (i - 10) * scaleY} x2={W} y2={oY + (i - 10) * scaleY} stroke="#1e293b" strokeWidth="0.5" />
              <line x1={oX + (i - 10) * scaleX} y1={0} x2={oX + (i - 10) * scaleX} y2={H} stroke="#1e293b" strokeWidth="0.5" />
            </g>
          ))}
          <line x1="0" y1={oY} x2={W} y2={oY} stroke="#475569" strokeWidth="1.5" />
          <line x1={oX} y1="0" x2={oX} y2={H} stroke="#475569" strokeWidth="1.5" />

          {/* Parabola */}
          <polyline points={curvePath} fill="none" stroke="#22c55e" strokeWidth="2.5" />

          {/* Vertex */}
          <circle cx={oX + vx * scaleX} cy={oY - vy * scaleY} r="4" fill="#3b82f6" />

          {/* Roots */}
          {root1 !== null && (
            <>
              <circle cx={oX + root1 * scaleX} cy={oY} r="5" fill="#fbbf24" stroke="#0a0a1a" strokeWidth="2" />
              <text x={oX + root1 * scaleX} y={oY - 10} fill="#fbbf24" fontSize="9" textAnchor="middle">{root1.toFixed(2)}</text>
            </>
          )}
          {root2 !== null && root1 !== root2 && (
            <>
              <circle cx={oX + root2 * scaleX} cy={oY} r="5" fill="#fbbf24" stroke="#0a0a1a" strokeWidth="2" />
              <text x={oX + root2 * scaleX} y={oY - 10} fill="#fbbf24" fontSize="9" textAnchor="middle">{root2.toFixed(2)}</text>
            </>
          )}
        </svg>

        <div className="flex gap-4 w-full max-w-[460px] bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest text-center">a = {a}</label>
            <input type="range" min="-5" max="5" step="0.5" value={a} onChange={e => setA(Number(e.target.value) || 0.5)} className="w-full accent-green-500" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest text-center">b = {b}</label>
            <input type="range" min="-10" max="10" step="1" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest text-center">c = {c}</label>
            <input type="range" min="-10" max="10" step="1" value={c} onChange={e => setC(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
        </div>
      </div>

      <div className="lg:w-[340px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Quadratic Formula</h3>
          <div className="bg-black/50 p-3 rounded-lg border border-slate-700 mb-4 text-center">
            <p className="text-white font-mono">x = (−b ± √Δ) / 2a</p>
          </div>

          {/* Discriminant */}
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800 mb-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Discriminant (Δ)</p>
            <p className="text-xs text-slate-400 font-mono mb-1">= {b}² − 4({a})({c}) = {b * b} − {4 * a * c}</p>
            <p className={`text-xl font-mono ${disc > 0 ? 'text-green-400' : disc === 0 ? 'text-blue-400' : 'text-red-400'}`}>= {disc.toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {disc > 0 ? '2 distinct real roots' : disc === 0 ? '1 repeated real root' : 'No real roots — complex pair'}
            </p>
          </div>

          {/* Roots */}
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800 mb-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Roots</p>
            {hasReal ? (
              <div className="flex gap-4">
                <p className="text-amber-400 font-mono text-lg">x₁ = {root1!.toFixed(3)}</p>
                {root1 !== root2 && <p className="text-amber-400 font-mono text-lg">x₂ = {root2!.toFixed(3)}</p>}
              </div>
            ) : (
              <div className="text-sm font-mono">
                <p className="text-purple-400">x = {realPart.toFixed(2)} ± {imagPart.toFixed(2)}i</p>
                <p className="text-slate-500 text-xs mt-1">Complex conjugate pair</p>
              </div>
            )}
          </div>

          {/* Factored Form */}
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Factored Form</p>
            {hasReal && root1 !== null && root2 !== null ? (
              <p className="text-green-400 font-mono text-sm">
                {a !== 1 ? `${a}` : ''}(x {root1 >= 0 ? `− ${root1.toFixed(2)}` : `+ ${Math.abs(root1).toFixed(2)}`})(x {root2 >= 0 ? `− ${root2.toFixed(2)}` : `+ ${Math.abs(root2).toFixed(2)}`})
              </p>
            ) : (
              <p className="text-slate-500 text-xs">Cannot factor over the reals</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
