/**
 * QuadraticExplorer.tsx
 * Math interactive: Quadratic Functions and Equations
 * Curriculum: GES Core/Elective Math, Cambridge IGCSE 0580/A-Level 9709, IB DP Topic 2
 */

import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, BookOpen, Target, Play, Globe, GraduationCap,
  RotateCcw, ChevronRight, CheckCircle2, XCircle, Shuffle, Trophy
} from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'explore' | 'forms' | 'roots' | 'solve' | 'applications' | 'quiz';
type RootsMethod = 'factorisation' | 'completing' | 'formula';

// ─── Math helpers ─────────────────────────────────────────────────────────────

function discriminant(a: number, b: number, c: number) { return b * b - 4 * a * c; }

function quadraticRoots(a: number, b: number, c: number): [number, number] | [number] | null {
  const d = discriminant(a, b, c);
  if (d < 0) return null;
  if (Math.abs(d) < 1e-9) return [-b / (2 * a)];
  return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
}

function vertexX(a: number, b: number) { return -b / (2 * a); }
function vertexY(a: number, b: number, c: number) {
  const x = vertexX(a, b);
  return a * x * x + b * x + c;
}

// ─── Quiz questions ───────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'qq1',
    question: 'The vertex of f(x) = 2x² − 8x + 3 has x-coordinate:',
    type: 'multiple-choice',
    options: ['4', '2', '−4', '−2'],
    correctAnswer: '2',
    explanation: 'x = −b/(2a) = −(−8)/(2×2) = 8/4 = 2'
  },
  {
    id: 'qq2',
    question: 'Discriminant = 0 means the quadratic has:',
    type: 'multiple-choice',
    options: ['No real roots', 'Two distinct real roots', 'One repeated real root', 'Imaginary roots'],
    correctAnswer: 'One repeated real root',
    explanation: 'When b²−4ac = 0, the quadratic touches the x-axis at exactly one point (a repeated root).'
  },
  {
    id: 'qq3',
    question: 'The y-intercept of f(x) = 3x² − 2x + 7 is:',
    type: 'multiple-choice',
    options: ['3', '−2', '7', '−7'],
    correctAnswer: '7',
    explanation: 'The y-intercept is always the value of c (when x = 0): f(0) = 7.'
  },
  {
    id: 'qq4',
    question: 'Which are the roots of x² − 5x + 6 = 0?',
    type: 'multiple-choice',
    options: ['x = 2 and x = 3', 'x = −2 and x = −3', 'x = 1 and x = 6', 'x = 5 and x = 1'],
    correctAnswer: 'x = 2 and x = 3',
    explanation: 'x² − 5x + 6 = (x−2)(x−3) = 0, so x = 2 or x = 3.'
  },
  {
    id: 'qq5',
    question: 'For a parabola with a < 0, the parabola:',
    type: 'multiple-choice',
    options: ['Opens upward', 'Opens downward', 'Is a straight line', 'Has no vertex'],
    correctAnswer: 'Opens downward',
    explanation: 'When a < 0, the parabola is ∩-shaped (opens downward) and has a maximum point.'
  },
];

// ─── Application scenarios ─────────────────────────────────────────────────────

const APP_SCENARIOS = [
  {
    id: 'projectile',
    title: 'Projectile Motion',
    icon: '🚀',
    equation: 'h(t) = −4.9t² + 20t + 2',
    a: -4.9, b: 20, c: 2,
    variable: 't (seconds)',
    output: 'h (metres)',
    questions: [
      { q: 'What is the initial height?', a: 'h(0) = 2 m' },
      { q: 'What is the maximum height?', a: 'h = 2 + 20²/(4×4.9) ≈ 22.4 m at t ≈ 2.04 s' },
      { q: 'When does the ball hit the ground?', a: 'Solve h = 0 using quadratic formula: t ≈ 4.18 s' },
    ],
    context: 'Used in physics to model projectile trajectories (WAEC & IB DP Physics link)'
  },
  {
    id: 'revenue',
    title: 'Revenue Maximisation',
    icon: '💰',
    equation: 'R(x) = −2x² + 80x',
    a: -2, b: 80, c: 0,
    variable: 'x (units sold)',
    output: 'R (revenue, GHS)',
    questions: [
      { q: 'How many units maximise revenue?', a: 'x = −b/(2a) = −80/(−4) = 20 units' },
      { q: 'What is the maximum revenue?', a: 'R(20) = −2(400) + 80(20) = 800 GHS' },
      { q: 'At what price is revenue zero?', a: 'R = 0 → x(−2x + 80) = 0 → x = 0 or x = 40' },
    ],
    context: 'Used in business mathematics — relevant to GES Elective Math and IB Applications'
  },
  {
    id: 'bridge',
    title: 'Bridge Arch — Ghana',
    icon: '🌉',
    equation: 'f(x) = −(1/25)x² + 4',
    a: -0.04, b: 0, c: 4,
    variable: 'x (metres from centre)',
    output: 'f (height, metres)',
    questions: [
      { q: 'Height at centre (x = 0)?', a: 'f(0) = 4 m' },
      { q: 'Height at x = 5?', a: 'f(5) = −0.04(25) + 4 = 3 m' },
      { q: 'Where does the arch meet the ground?', a: 'f = 0 → x² = 100 → x = ±10 m (span = 20 m)' },
    ],
    context: 'Bridge arches, satellite dishes and parabolic reflectors follow quadratic curves'
  },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function QuadraticExplorer() {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'explore', label: 'Explore', icon: <Eye size={14} /> },
    { key: 'forms', label: 'Forms', icon: <BookOpen size={14} /> },
    { key: 'roots', label: 'Roots', icon: <Target size={14} /> },
    { key: 'solve', label: 'Solve', icon: <Play size={14} /> },
    { key: 'applications', label: 'Apply', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      {/* Mode tabs */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            aria-label={`${label} mode`}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'explore' && <ExploreMode />}
            {viewMode === 'forms' && <FormsMode />}
            {viewMode === 'roots' && <RootsMode />}
            {viewMode === 'solve' && <SolveMode />}
            {viewMode === 'applications' && <ApplicationsMode />}
            {viewMode === 'quiz' && (
              <div className="max-w-xl mx-auto">
                <QuizMode questions={QUIZ_QUESTIONS} title="Quadratic Functions Quiz" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · Cambridge · IB · </span>
        Always check your answer by substituting roots back into the original equation.
        State the formula used, show full working, and give both roots when they exist.
        WASSCE commonly tests: finding the vertex, solving by formula, and sketching the parabola.
      </div>
    </div>
  );
}

// ─── Explore Mode (Graph + Sliders) ──────────────────────────────────────────

function ExploreMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  const W = 340, H = 340;
  const cx = W / 2, cy = H / 2;
  const scale = 25;

  const disc = discriminant(a, b, c);
  const roots = quadraticRoots(a, b, c);
  const vx = vertexX(a, b);
  const vy = vertexY(a, b, c);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = -7; x <= 7; x++) {
      const px = cx + x * scale;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
    for (let y = -7; y <= 7; y++) {
      const py = cy + y * scale;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let x = -6; x <= 6; x += 2) {
      if (x !== 0) ctx.fillText(String(x), cx + x * scale, cy + 14);
    }
    ctx.textAlign = 'right';
    for (let y = -6; y <= 6; y += 2) {
      if (y !== 0) ctx.fillText(String(-y), cx - 6, cy + y * scale + 4);
    }

    // Axis of symmetry
    const axX = cx + vx * scale;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(34,211,238,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(axX, 0); ctx.lineTo(axX, H); ctx.stroke();
    ctx.setLineDash([]);

    // Parabola
    const discColor = disc > 0 ? '#4ade80' : disc === 0 ? '#fbbf24' : '#f87171';
    ctx.strokeStyle = discColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = discColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= W; px++) {
      const x = (px - cx) / scale;
      const y = a * x * x + b * x + c;
      const py = cy - y * scale;
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Roots
    if (roots) {
      roots.forEach(r => {
        const rpx = cx + r * scale;
        ctx.beginPath();
        ctx.arc(rpx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f87171';
        ctx.shadowColor = '#f87171';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // Vertex
    const vpx = cx + vx * scale;
    const vpy = cy - vy * scale;
    ctx.beginPath();
    ctx.arc(vpx, vpy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Y-intercept
    ctx.beginPath();
    ctx.arc(cx, cy - c * scale, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    const labelY = vpy > H / 2 ? vpy - 15 : vpy + 20;
    ctx.fillText(`V(${vx.toFixed(1)}, ${vy.toFixed(1)})`, vpx + 8, labelY);
  }, [a, b, c, vx, vy, disc, roots]);

  useEffect(() => { draw(); }, [draw]);

  const eqStr = `f(x) = ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`;
  const discStatus = disc > 0 ? '2 real roots' : disc === 0 ? '1 repeated root' : 'no real roots';
  const discColor = disc > 0 ? 'text-green-400' : disc === 0 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Graph */}
        <div className="flex flex-col items-center">
          <div className="bg-black/60 rounded-2xl border border-brand-border p-2">
            <canvas ref={canvasRef} width={W} height={H} className="rounded-xl" />
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#4ade80] inline-block" />Roots</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#22d3ee] inline-block" />Vertex</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#c084fc] inline-block" />y-int</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-black/50 rounded-2xl border border-brand-border p-4 text-center">
            <div className="text-2xl font-mono font-black text-white">{eqStr}</div>
          </div>

          {[
            { label: 'a (opens up/down)', val: a, set: setA, min: -3, max: 3, step: 0.5, color: 'text-yellow-400' },
            { label: 'b (vertex position)', val: b, set: setB, min: -8, max: 8, step: 1, color: 'text-pink-400' },
            { label: 'c (y-intercept)', val: c, set: setC, min: -8, max: 8, step: 1, color: 'text-purple-400' },
          ].map(({ label, val, set, min, max, step, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold uppercase tracking-widest">{label}</span>
                <span className={`font-mono font-bold ${color}`}>{val}</span>
              </div>
              <input
                type="range" min={min} max={max} step={step} value={val}
                onChange={e => set(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                aria-label={label}
              />
            </div>
          ))}

          {/* Info panel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Vertex</div>
              <div className="font-mono text-sm text-brand-accent font-bold">({vx.toFixed(2)}, {vy.toFixed(2)})</div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Discriminant</div>
              <div className={`font-mono text-sm font-bold ${discColor}`}>{disc.toFixed(2)}</div>
            </div>
            <div className="col-span-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Nature of Roots</div>
              <div className={`font-mono text-sm font-bold ${discColor}`}>{discStatus}</div>
              {roots && <div className="text-xs text-slate-400 mt-1">
                {roots.length === 1 ? `x = ${roots[0].toFixed(3)}` : `x₁ = ${roots[0].toFixed(3)}, x₂ = ${roots[1].toFixed(3)}`}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Forms Converter Mode ──────────────────────────────────────────────────────

function FormsMode() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [showDerivation, setShowDerivation] = useState(true);

  const disc = discriminant(a, b, c);
  const vx = vertexX(a, b);
  const vy = vertexY(a, b, c);
  const roots = quadraticRoots(a, b, c);

  const standardStr = `${a}x² ${b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}`;
  const vertexStr = `${a}(x ${vx < 0 ? `+ ${Math.abs(vx).toFixed(2)}` : `− ${vx.toFixed(2)}`})² ${vy >= 0 ? `+ ${vy.toFixed(2)}` : `− ${Math.abs(vy).toFixed(2)}`}`;
  const factoredStr = roots
    ? roots.length === 1
      ? `${a}(x − ${roots[0].toFixed(2)})²`
      : `${a}(x − ${roots[0].toFixed(2)})(x − ${roots[1].toFixed(2)})`
    : 'No real factors';

  const ctsSteps = [
    `${a}x² ${b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}`,
    `${a}[x² ${b / a >= 0 ? `+ ${b / a}` : `− ${Math.abs(b / a)}`}x] ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}`,
    `${a}[(x + ${b / (2 * a)})² − ${(b / (2 * a)) ** 2}] ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}`,
    vertexStr,
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex gap-4 items-center flex-wrap">
        {[
          { label: 'a', val: a, set: setA, min: -3, max: 3, step: 0.5 },
          { label: 'b', val: b, set: setB, min: -8, max: 8, step: 1 },
          { label: 'c', val: c, set: setC, min: -8, max: 8, step: 1 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label} className="flex-1 min-w-[80px]">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1"><span>{label}</span><span className="text-brand-accent font-mono">{val}</span></div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" aria-label={`Coefficient ${label}`} />
          </div>
        ))}
        <button
          onClick={() => setShowDerivation(!showDerivation)}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showDerivation ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400'}`}
        >
          Derivation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Standard Form', formula: standardStr, color: 'border-cyan-500/40 bg-cyan-500/5', badge: 'ax² + bx + c' },
          { title: 'Vertex Form', formula: vertexStr, color: 'border-purple-500/40 bg-purple-500/5', badge: 'a(x−h)² + k' },
          { title: 'Factored Form', formula: factoredStr, color: 'border-green-500/40 bg-green-500/5', badge: disc >= 0 ? 'a(x−r₁)(x−r₂)' : 'No real factors' },
        ].map(({ title, formula, color, badge }) => (
          <div key={title} className={`rounded-2xl border p-4 ${color}`}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{title}</div>
            <div className="font-mono text-sm text-white break-all leading-relaxed">{formula}</div>
            <div className="text-[9px] text-slate-600 mt-2 font-mono">{badge}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showDerivation && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
              <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Standard → Vertex (Completing the Square)</h3>
              <div className="space-y-2">
                {ctsSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs w-4">{i + 1}</span>
                    <div className={`flex-1 font-mono text-sm p-2 rounded-lg border ${
                      i === ctsSteps.length - 1 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-bold' : 'bg-black/30 border-slate-800 text-slate-300'
                    }`}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Roots Finder Mode ────────────────────────────────────────────────────────

function RootsMode() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [method, setMethod] = useState<RootsMethod>('formula');
  const [revealedStep, setRevealedStep] = useState(0);

  const disc = discriminant(a, b, c);
  const roots = quadraticRoots(a, b, c);

  type Step = { label: string; value: string };

  const formulaSteps: Step[] = [
    { label: 'Write quadratic formula', value: 'x = (−b ± √(b²−4ac)) / 2a' },
    { label: 'Identify coefficients', value: `a = ${a}, b = ${b}, c = ${c}` },
    { label: 'Calculate discriminant', value: `b²−4ac = ${b}²−4(${a})(${c}) = ${b * b}−${4 * a * c} = ${disc}` },
    { label: 'Substitute', value: `x = (−(${b}) ± √${disc}) / (2×${a})` },
    { label: 'Simplify', value: roots
      ? roots.length === 1
        ? `x = ${roots[0].toFixed(4)}`
        : `x₁ = (${-b}+${Math.sqrt(Math.max(disc, 0)).toFixed(3)}) / ${2 * a} = ${roots[0].toFixed(4)}, x₂ = ${roots[1].toFixed(4)}`
      : 'No real roots (discriminant < 0)' },
  ];

  const factorisationSteps: Step[] = [
    { label: 'Standard form', value: `${a}x² ${b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`} = 0` },
    { label: 'Find two numbers that multiply to a×c and add to b', value: `a×c = ${a * c}, sum = ${b}` },
    { label: 'Check', value: roots ? (roots.length === 2 ? `(${a})(${c}) = ${a * c}, roots are x = ${roots[0].toFixed(2)} and x = ${roots[1].toFixed(2)}` : 'Only one root (perfect square)') : 'Cannot factorise over reals' },
  ];

  const ctsSteps: Step[] = [
    { label: 'Move constant to right side', value: `${a}x² ${b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x = ${-c}` },
    { label: 'Divide by a', value: `x² ${(b / a) >= 0 ? `+ ${b / a}` : `− ${Math.abs(b / a)}`}x = ${-c / a}` },
    { label: 'Add (b/2a)² to both sides', value: `(x + ${(b / (2 * a)).toFixed(2)})² = ${(disc / (4 * a * a)).toFixed(4)}` },
    { label: 'Take square root', value: disc >= 0 ? `x + ${(b / (2 * a)).toFixed(2)} = ±${Math.sqrt(disc / (4 * a * a)).toFixed(4)}` : 'No real solution' },
    { label: 'Solve for x', value: roots ? (roots.length === 1 ? `x = ${roots[0].toFixed(4)}` : `x = ${roots[0].toFixed(4)} or x = ${roots[1].toFixed(4)}`) : 'No real roots' },
  ];

  const activeSteps = method === 'formula' ? formulaSteps : method === 'factorisation' ? factorisationSteps : ctsSteps;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-3 items-end">
        {[
          { label: 'a', val: a, set: setA, min: -4, max: 4, step: 1 },
          { label: 'b', val: b, set: setB, min: -10, max: 10, step: 1 },
          { label: 'c', val: c, set: setC, min: -10, max: 10, step: 1 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label} className="flex-1 min-w-[80px]">
            <div className="flex justify-between text-[10px] mb-1 text-slate-400">
              <span>{label}</span><span className="text-brand-accent font-mono">{val}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => { set(Number(e.target.value)); setRevealedStep(0); }}
              className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" aria-label={`a=${a} b=${b} c=${c}`} />
          </div>
        ))}
      </div>

      <div className="bg-black/50 rounded-xl p-4 text-center">
        <span className="text-2xl font-mono font-bold text-white">
          {a}x² {b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`} = 0
        </span>
      </div>

      {/* Method selector */}
      <div className="flex gap-2 flex-wrap">
        {(['formula', 'factorisation', 'completing'] as RootsMethod[]).map(m => (
          <button key={m} onClick={() => { setMethod(m); setRevealedStep(0); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${method === m ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {m === 'completing' ? 'Complete Square' : m === 'formula' ? 'Quadratic Formula' : 'Factorisation'}
          </button>
        ))}
      </div>

      {/* Step-by-step reveal */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <div className="space-y-3 mb-4">
          {activeSteps.slice(0, revealedStep + 1).map((step, i) => (
            <motion.div key={`${method}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
              <span className="text-slate-600 text-xs mt-1 w-4">{i + 1}</span>
              <div className={`flex-1 p-3 rounded-xl border ${i === revealedStep ? 'bg-brand-accent/10 border-brand-accent/30' : 'bg-black/40 border-slate-800'}`}>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{step.label}</div>
                <div className="font-mono text-sm text-white">{step.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-3">
          {revealedStep < activeSteps.length - 1 && (
            <button onClick={() => setRevealedStep(s => s + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-black rounded-xl font-bold text-xs uppercase hover:bg-white transition-all">
              Next Step <ChevronRight size={14} />
            </button>
          )}
          {revealedStep > 0 && (
            <button onClick={() => setRevealedStep(0)}
              className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase hover:text-white transition-all">
              Reset
            </button>
          )}
          {revealedStep === activeSteps.length - 1 && roots && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <CheckCircle2 size={16} /> Solution verified!
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-xs text-yellow-300">
        <span className="font-bold uppercase tracking-widest text-[9px]">WAEC Exam Tip · </span>
        Always verify your roots by substituting back. Write: "Check: ({roots?.[0]?.toFixed(1)})² + b({roots?.[0]?.toFixed(1)}) + c = ?" to show full working.
      </div>
    </div>
  );
}

// ─── Solve Mode (Gamified) ────────────────────────────────────────────────────

function SolveMode() {
  type Difficulty = 'easy' | 'medium' | 'hard';
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [userR1, setUserR1] = useState('');
  const [userR2, setUserR2] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const genEquation = useCallback(() => {
    if (difficulty === 'easy') {
      const r1 = Math.floor(Math.random() * 6) - 3;
      const r2 = Math.floor(Math.random() * 6) - 3;
      return { a: 1, b: -(r1 + r2), c: r1 * r2, roots: [r1, r2].sort((x, y) => x - y) };
    } else if (difficulty === 'medium') {
      const a = [1, 2][Math.floor(Math.random() * 2)];
      const r1 = Math.floor(Math.random() * 8) - 4;
      const r2 = Math.floor(Math.random() * 8) - 4;
      return { a, b: -a * (r1 + r2), c: a * r1 * r2, roots: [r1, r2].sort((x, y) => x - y) };
    } else {
      const a = [1, 2, 3][Math.floor(Math.random() * 3)];
      const b = Math.floor(Math.random() * 10) - 5;
      const c = Math.floor(Math.random() * 8) - 4;
      const d = discriminant(a, b, c);
      if (d < 0) return { a: 1, b: -3, c: 2, roots: [1, 2] };
      const r1 = (-b + Math.sqrt(d)) / (2 * a);
      const r2 = (-b - Math.sqrt(d)) / (2 * a);
      return { a, b, c, roots: [r1, r2].sort((x, y) => x - y) };
    }
  }, [difficulty]);

  const [eq, setEq] = useState(() => genEquation());

  const newEquation = () => {
    setEq(genEquation());
    setUserR1(''); setUserR2('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const u1 = parseFloat(userR1);
    const u2 = parseFloat(userR2);
    const [r1, r2] = eq.roots;
    const tol = 0.05;
    const correct = (Math.abs(u1 - r1) < tol && Math.abs(u2 - r2) < tol) ||
                    (Math.abs(u1 - r2) < tol && Math.abs(u2 - r1) < tol);
    if (correct) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setScore(s => s + (streak >= 2 ? 3 : 1));
    } else {
      setFeedback('wrong');
      setLives(l => l - 1);
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-2xl ${i < lives ? 'opacity-100' : 'opacity-20'}`}>❤️</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {streak >= 2 && <span className="text-orange-400 text-sm font-bold">🔥 {streak}</span>}
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button key={d} onClick={() => { setDifficulty(d); newEquation(); setLives(3); setScore(0); setStreak(0); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              difficulty === d ? (d === 'easy' ? 'bg-green-500 text-black' : d === 'medium' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white') : 'bg-slate-800 text-slate-400'
            }`}
          >{d}</button>
        ))}
        <button onClick={newEquation} className="ml-auto px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors">
          <Shuffle size={16} />
        </button>
      </div>

      {/* Equation */}
      <div className="bg-black/60 rounded-2xl border border-brand-border p-6 text-center">
        <div className="text-3xl font-mono font-bold text-white">
          {eq.a !== 1 && eq.a !== -1 ? eq.a : eq.a === -1 ? '−' : ''}x²
          {eq.b !== 0 && ` ${eq.b > 0 ? '+' : '−'} ${eq.a !== 1 ? '' : ''}${Math.abs(eq.b)}x`}
          {eq.c !== 0 && ` ${eq.c > 0 ? '+' : '−'} ${Math.abs(eq.c)}`}
          {` = 0`}
        </div>
        <div className="text-slate-500 text-sm mt-2">Find both roots (x₁ and x₂)</div>
      </div>

      {/* Input */}
      {lives > 0 && !feedback && (
        <div className="flex gap-3">
          <input type="number" value={userR1} onChange={e => setUserR1(e.target.value)} placeholder="x₁"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-brand-accent focus:outline-none"
            aria-label="First root" />
          <input type="number" value={userR2} onChange={e => setUserR2(e.target.value)} placeholder="x₂"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-brand-accent focus:outline-none"
            aria-label="Second root" />
          <button onClick={checkAnswer} className="px-5 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all">✓</button>
        </div>
      )}

      {feedback && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-center ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
        >
          {feedback === 'correct'
            ? <span className="text-green-400 font-bold">✓ Correct! {streak >= 2 ? '+3 pts' : '+1 pt'}</span>
            : <span className="text-red-400 font-bold">✗ Roots were: x = {eq.roots[0].toFixed(2)} and x = {eq.roots[1].toFixed(2)}</span>
          }
          <button onClick={newEquation} className="block mt-3 mx-auto px-6 py-2 bg-brand-accent text-black rounded-xl font-bold text-sm hover:bg-white transition-all">
            Next Equation
          </button>
        </motion.div>
      )}

      {lives === 0 && (
        <div className="text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="text-3xl mb-3">💔</div>
          <div className="text-white font-bold mb-2">Game Over — Score: {score}</div>
          <button onClick={() => { setLives(3); setScore(0); setStreak(0); newEquation(); }}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Applications Mode ────────────────────────────────────────────────────────

function ApplicationsMode() {
  const [selected, setSelected] = useState(APP_SCENARIOS[0]);
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div className="flex gap-3 flex-wrap">
        {APP_SCENARIOS.map(s => (
          <button key={s.id} onClick={() => { setSelected(s); setShowSolution({}); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selected.id === s.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{s.icon}</span> {s.title}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{selected.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{selected.title}</h3>
            <p className="text-slate-400 text-sm">{selected.context}</p>
          </div>
        </div>
        <div className="bg-black/50 rounded-xl p-4 text-center mb-5">
          <div className="text-2xl font-mono font-bold text-brand-accent">{selected.equation}</div>
          <div className="text-slate-500 text-xs mt-1">{selected.variable} → {selected.output}</div>
        </div>

        <div className="space-y-4">
          {selected.questions.map((q, i) => (
            <div key={i} className="bg-black/30 rounded-xl border border-slate-800 overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => setShowSolution(prev => ({ ...prev, [`${selected.id}-${i}`]: !prev[`${selected.id}-${i}`] }))}
              >
                <div>
                  <span className="text-brand-accent font-bold text-xs mr-2">Q{i + 1}</span>
                  <span className="text-white text-sm">{q.q}</span>
                </div>
                <ChevronRight size={16} className={`text-slate-500 transition-transform ${showSolution[`${selected.id}-${i}`] ? 'rotate-90' : ''}`} />
              </div>
              <AnimatePresence>
                {showSolution[`${selected.id}-${i}`] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-slate-800 bg-green-500/5">
                      <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">Solution</div>
                      <div className="text-slate-300 text-sm font-mono">{q.a}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
