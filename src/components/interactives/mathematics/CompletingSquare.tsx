import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'cs1', question: 'Completing the square converts f(x) = x²+bx+c into:', type: 'multiple-choice', options: ['(x+b)²+c', '(x+b/2)²+(c−b²/4)', 'x(x+b)+c', '(x+c)²+b'], correctAnswer: '(x+b/2)²+(c−b²/4)', explanation: 'Take half of b, square it, add and subtract: x²+bx = (x+b/2)² − (b/2)².' },
  { id: 'cs2', question: 'The vertex of y = (x−3)²+5 is at:', type: 'multiple-choice', options: ['(3, 5)', '(−3, 5)', '(3, −5)', '(5, 3)'], correctAnswer: '(3, 5)', explanation: 'Vertex form y = (x−h)²+k gives vertex at (h, k) = (3, 5).' },
  { id: 'cs3', question: 'Why complete the square?', type: 'multiple-choice', options: ['To find the vertex', 'To solve for roots', 'To derive the quadratic formula', 'All of the above'], correctAnswer: 'All of the above', explanation: 'Completing the square reveals the vertex, helps solve equations, and is how the quadratic formula is derived!' },
  { id: 'cs4', question: 'x²+6x+5 in completed form is:', type: 'multiple-choice', options: ['(x+3)²−4', '(x+6)²−31', '(x+3)²+5', '(x+5)²+1'], correctAnswer: '(x+3)²−4', explanation: 'Half of 6 = 3. (x+3)² = x²+6x+9. So x²+6x+5 = (x+3)²−9+5 = (x+3)²−4.' },
  { id: 'cs5', question: 'If (x+2)²−7 = 0, then x =', type: 'multiple-choice', options: ['2±√7', '−2±√7', '±√7', '−2±7'], correctAnswer: '−2±√7', explanation: '(x+2)² = 7 → x+2 = ±√7 → x = −2±√7.' },
];

export default function CompletingSquare() {
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
            {viewMode === 'simulation' && <CSSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Completing the Square Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is Completing the Square?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          It's a technique to rewrite <strong className="text-white">x² + bx + c</strong> in the form <strong className="text-brand-accent">(x + p)² + q</strong>, which instantly reveals the vertex of the parabola and allows us to solve the equation.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">x² + bx + c = (x + b/2)² − (b/2)² + c</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Step-by-Step Process</h3>
        <ol className="text-sm text-slate-300 space-y-3 list-decimal pl-5">
          <li>Start with <strong className="text-white">x² + bx + c</strong></li>
          <li>Take <strong className="text-white">half of b</strong> → that's your p = b/2</li>
          <li>Write <strong className="text-white">(x + p)²</strong> — this expands to x² + 2px + p²</li>
          <li><strong className="text-white">Subtract p²</strong> (you added extra) and keep c</li>
          <li>Result: <strong className="text-brand-accent">(x + b/2)² + (c − b²/4)</strong></li>
        </ol>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Vertex Form Connection</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          <strong className="text-white">y = (x − h)² + k</strong> is vertex form. The vertex is at <strong className="text-brand-accent">(h, k)</strong>.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Completing the square transforms standard form into vertex form, instantly giving you the turning point of the parabola without needing to use <strong className="text-white">-b/2a</strong>.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Worked Examples</h3>
        <div className="space-y-4">
          {[
            { orig: 'x² + 6x + 2', steps: ['p = 6/2 = 3', '(x+3)² = x²+6x+9', 'x²+6x+2 = (x+3)²−9+2', '= (x+3)² − 7'], vertex: '(−3, −7)' },
            { orig: 'x² − 4x + 7', steps: ['p = −4/2 = −2', '(x−2)² = x²−4x+4', 'x²−4x+7 = (x−2)²−4+7', '= (x−2)² + 3'], vertex: '(2, 3)' },
            { orig: 'x² + 5x + 1', steps: ['p = 5/2 = 2.5', '(x+2.5)² = x²+5x+6.25', 'x²+5x+1 = (x+2.5)²−6.25+1', '= (x+2.5)² − 5.25'], vertex: '(−2.5, −5.25)' },
          ].map((ex, i) => (
            <div key={i} className="bg-[#0a0a1a] border border-slate-800 rounded-xl p-4">
              <p className="text-white font-mono text-sm mb-2">{ex.orig}</p>
              {ex.steps.map((s, j) => <p key={j} className="text-slate-400 font-mono text-xs">→ {s}</p>)}
              <p className="text-brand-accent text-xs font-bold mt-1">Vertex: {ex.vertex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CSSim() {
  const [b, setB] = useState(6);
  const [c, setC] = useState(2);

  const halfB = b / 2;
  const halfBSq = halfB * halfB;
  const q = c - halfBSq;
  const vertexX = -halfB;
  const vertexY = q;

  // Roots: (x + halfB)² = -q → x = -halfB ± √(-q)
  const discriminant = -q;
  const hasRealRoots = discriminant >= 0;
  const root1 = hasRealRoots ? -halfB + Math.sqrt(discriminant) : null;
  const root2 = hasRealRoots ? -halfB - Math.sqrt(discriminant) : null;

  // Graph
  const W = 400, H = 260;
  const xMin = vertexX - 5, xMax = vertexX + 5;
  const fAt = (x: number) => x * x + b * x + c;
  const yMin = vertexY - 2, yMax = vertexY + 20;
  const toSX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const toSY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

  const curvePts: string[] = [];
  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = fAt(x);
    if (y >= yMin && y <= yMax) curvePts.push(`${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]" xmlns="http://www.w3.org/2000/svg">
          <rect width={W} height={H} fill="#0a0a1a" rx="12" />

          {/* Axes */}
          {toSX(0) > 0 && toSX(0) < W && <line x1={toSX(0)} y1="0" x2={toSX(0)} y2={H} stroke="#334155" strokeWidth="1" />}
          {toSY(0) > 0 && toSY(0) < H && <line x1="0" y1={toSY(0)} x2={W} y2={toSY(0)} stroke="#334155" strokeWidth="1" />}

          {/* Parabola */}
          <polyline points={curvePts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

          {/* Vertex */}
          <circle cx={toSX(vertexX)} cy={toSY(vertexY)} r="6" fill="#fbbf24" stroke="white" strokeWidth="1.5" />
          <text x={toSX(vertexX)} y={toSY(vertexY) - 12} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">
            ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
          </text>

          {/* Roots */}
          {root1 !== null && <circle cx={toSX(root1)} cy={toSY(0)} r="4" fill="#22c55e" />}
          {root2 !== null && <circle cx={toSX(root2)} cy={toSY(0)} r="4" fill="#22c55e" />}
          {root1 !== null && <text x={toSX(root1)} y={toSY(0) + 14} fill="#22c55e" fontSize="7" textAnchor="middle">{root1.toFixed(2)}</text>}
          {root2 !== null && root2 !== root1 && <text x={toSX(root2)} y={toSY(0) + 14} fill="#22c55e" fontSize="7" textAnchor="middle">{root2.toFixed(2)}</text>}

          {/* Axis of symmetry */}
          <line x1={toSX(vertexX)} y1="0" x2={toSX(vertexX)} y2={H} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>

        {/* Sliders */}
        <div className="flex gap-6 justify-center">
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest">b (coefficient of x)</label>
            <input type="range" min="-10" max="10" value={b} onChange={e => setB(Number(e.target.value))} className="w-28 accent-brand-accent" />
            <span className="text-xs text-brand-accent font-mono">{b}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest">c (constant)</label>
            <input type="range" min="-10" max="10" value={c} onChange={e => setC(Number(e.target.value))} className="w-28 accent-brand-accent" />
            <span className="text-xs text-brand-accent font-mono">{c}</span>
          </div>
        </div>
      </div>

      <div className="lg:w-[340px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Step-by-Step</h3>
          <div className="text-sm font-mono space-y-2">
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-blue-400">x² + {b}x + {c}</p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-400 text-xs mb-1">Half of {b} = {halfB}</p>
              <p className="text-slate-400 text-xs">({halfB})² = {halfBSq}</p>
            </div>
            <div className="bg-brand-accent/10 border border-brand-accent/50 p-3 rounded-lg">
              <p className="text-brand-accent font-bold">(x + {halfB})² + ({c} − {halfBSq})</p>
              <p className="text-brand-accent font-bold">= (x {halfB >= 0 ? `+ ${halfB}` : `− ${Math.abs(halfB)}`})² {q >= 0 ? `+ ${q}` : `− ${Math.abs(q)}`}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-2">Vertex</h3>
          <p className="text-white font-mono text-lg">({vertexX.toFixed(1)}, {vertexY.toFixed(1)})</p>
          <p className="text-slate-400 text-xs mt-1">Axis of symmetry: x = {vertexX.toFixed(1)}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest mb-2">Roots (Solving)</h3>
          {hasRealRoots ? (
            <div className="text-sm font-mono space-y-1">
              <p className="text-slate-300">(x {halfB >= 0 ? `+ ${halfB}` : `− ${Math.abs(halfB)}`})² = {Math.abs(q).toFixed(2)}</p>
              <p className="text-slate-300">x = {(-halfB).toFixed(1)} ± √{Math.abs(q).toFixed(2)}</p>
              <p className="text-green-400 font-bold">x = {root1!.toFixed(3)} or x = {root2!.toFixed(3)}</p>
            </div>
          ) : (
            <p className="text-red-400 text-sm">No real roots — parabola doesn't cross x-axis (vertex above x-axis)</p>
          )}
        </div>
      </div>
    </div>
  );
}
