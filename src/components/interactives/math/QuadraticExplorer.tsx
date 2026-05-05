import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, BookOpen, Target, Play, Globe, GraduationCap,
  RotateCcw, ChevronRight, CheckCircle2, XCircle, Shuffle, Trophy, Crosshair, ArrowRight
} from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'explore' | 'forms' | 'target-practice' | 'applications' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'qq1', question: 'The vertex of f(x) = 2x² − 8x + 3 has x-coordinate:', type: 'multiple-choice', options: ['4', '2', '−4', '−2'], correctAnswer: '2', explanation: 'x = −b/(2a) = −(−8)/(2×2) = 8/4 = 2' },
  { id: 'qq2', question: 'Discriminant = 0 means the quadratic has:', type: 'multiple-choice', options: ['No real roots', 'Two distinct real roots', 'One repeated real root', 'Imaginary roots'], correctAnswer: 'One repeated real root', explanation: 'When b²−4ac = 0, the quadratic touches the x-axis at exactly one point.' },
  { id: 'qq3', question: 'The y-intercept of f(x) = 3x² − 2x + 7 is:', type: 'multiple-choice', options: ['3', '−2', '7', '−7'], correctAnswer: '7', explanation: 'The y-intercept is always the value of c (when x = 0): f(0) = 7.' },
  { id: 'qq4', question: 'Which are the roots of x² − 5x + 6 = 0?', type: 'multiple-choice', options: ['x = 2 and x = 3', 'x = −2 and x = −3', 'x = 1 and x = 6', 'x = 5 and x = 1'], correctAnswer: 'x = 2 and x = 3', explanation: 'x² − 5x + 6 = (x−2)(x−3) = 0, so x = 2 or x = 3.' },
  { id: 'qq5', question: 'For a parabola with a < 0, the parabola:', type: 'multiple-choice', options: ['Opens upward', 'Opens downward', 'Is a straight line', 'Has no vertex'], correctAnswer: 'Opens downward', explanation: 'When a < 0, the parabola opens downward and has a maximum point.' },
];

interface TargetChallenge {
  id: string;
  description: string;
  targetY: number;
  point1: { x: number; y: number };
  point2: { x: number; y: number };
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
}

const TARGET_CHALLENGES: TargetChallenge[] = [
  {
    id: 'tc1',
    description: 'Create a parabola that passes through both green points',
    targetY: 0,
    point1: { x: -2, y: 0 },
    point2: { x: 3, y: 0 },
    difficulty: 'easy',
    hint: 'These are the roots. Try a = 1 and work backward from (x+2)(x-3)',
  },
  {
    id: 'tc2',
    description: 'Make a parabola with vertex exactly at the yellow target',
    targetY: 4,
    point1: { x: 1, y: 4 },
    point2: { x: 1, y: 4 },
    difficulty: 'medium',
    hint: 'Use vertex form: a(x-1)² + 4. Pick a = -1 to open downward.',
  },
  {
    id: 'tc3',
    description: 'Pass through (−3, 0) and have y-intercept at (0, 6)',
    targetY: 6,
    point1: { x: -3, y: 0 },
    point2: { x: 0, y: 6 },
    difficulty: 'hard',
    hint: 'One root is x=-3, and c=6. Write (x+3)(x−r), expand to get c=6, solve for r.',
  },
  {
    id: 'tc4',
    description: 'Create a parabola with roots at x=−4 and x=2',
    targetY: 0,
    point1: { x: -4, y: 0 },
    point2: { x: 2, y: 0 },
    difficulty: 'easy',
    hint: 'Start with (x+4)(x-2) = x² + 2x - 8',
  },
  {
    id: 'tc5',
    description: 'Vertex at (2, −3) and passes through (4, 5)',
    targetY: -3,
    point1: { x: 2, y: -3 },
    point2: { x: 4, y: 5 },
    difficulty: 'hard',
    hint: 'Use y = a(x-2)² − 3, plug in (4,5) to find a.',
  },
];

function quadraticRoots(a: number, b: number, c: number): [number, number] | [number] | null {
  const d = b * b - 4 * a * c;
  if (d < 0) return null;
  if (Math.abs(d) < 1e-9) return [-b / (2 * a)];
  return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
}

function vertexX(a: number, b: number) { return -b / (2 * a); }
function vertexY(a: number, b: number, c: number) {
  const x = vertexX(a, b);
  return a * x * x + b * x + c;
}

export default function QuadraticExplorer() {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'explore', label: 'Explore', icon: <Eye size={14} /> },
    { key: 'forms', label: 'Forms', icon: <BookOpen size={14} /> },
    { key: 'target-practice', label: 'Target Practice', icon: <Crosshair size={14} /> },
    { key: 'applications', label: 'Apply', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
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
            {viewMode === 'target-practice' && <TargetPracticeMode />}
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
        Always check your answer by substituting roots back. State the formula, show full working, and give both roots when they exist.
      </div>
    </div>
  );
}

function TargetPracticeMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const challenge = TARGET_CHALLENGES[challengeIdx];

  const W = 340, H = 340;
  const cx = W / 2, cy = H / 2;
  const scale = 25;

  const vx = vertexX(a, b);
  const vy = vertexY(a, b, c);
  const disc = b * b - 4 * a * c;
  const roots = quadraticRoots(a, b, c);

  const yInt = c;

  const checkTarget = useCallback(() => {
    if (!challenge) return;

    let pointsMatch = true;
    let vertexMatch = true;
    let yIntMatch = true;

    const p1Actual = a * challenge.point1.x * challenge.point1.x + b * challenge.point1.x + c;
    const p2Actual = a * challenge.point2.x * challenge.point2.x + b * challenge.point2.x + c;

    pointsMatch = Math.abs(p1Actual - challenge.point1.y) < (challenge.difficulty === 'hard' ? 1.0 : 0.5) &&
                  Math.abs(p2Actual - challenge.point2.y) < (challenge.difficulty === 'hard' ? 1.0 : 0.5);

    if (challenge.targetY !== 0) {
      vertexMatch = Math.abs(vy - challenge.targetY) < (challenge.difficulty === 'hard' ? 1.5 : 0.8);
    }

    if (challenge.point2.x === 0) {
      yIntMatch = Math.abs(yInt - challenge.point2.y) < 1.0;
    }

    return (pointsMatch && vertexMatch && yIntMatch);
  }, [a, b, c, challenge, vy, yInt]);

  const hitSuccess = checkTarget();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

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

    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

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

    const p1sx = cx + challenge.point1.x * scale;
    const p1sy = cy - challenge.point1.y * scale;
    const p2sx = cx + challenge.point2.x * scale;
    const p2sy = cy - challenge.point2.y * scale;

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(p1sx, p1sy, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(p1sx - 7, p1sy);
    ctx.lineTo(p1sx + 7, p1sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p1sx, p1sy - 7);
    ctx.lineTo(p1sx, p1sy + 7);
    ctx.stroke();

    if (challenge.point2.x !== challenge.point1.x || challenge.point2.y !== challenge.point1.y) {
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(p2sx, p2sy, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(p2sx - 7, p2sy);
      ctx.lineTo(p2sx + 7, p2sy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p2sx, p2sy - 7);
      ctx.lineTo(p2sx, p2sy + 7);
      ctx.stroke();
    }

    if (challenge.targetY !== 0) {
      const vtx = cx + challenge.point1.x * scale;
      const vty = cy - challenge.targetY * scale;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(vtx - 6, vty);
      ctx.lineTo(vtx + 6, vty);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Vertex', vtx, vty - 14);
    }

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

    const vpx = cx + vx * scale;
    const vpy = cy - vy * scale;
    ctx.beginPath();
    ctx.arc(vpx, vpy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    const yIntSX = cx;
    const yIntSY = cy - yInt * scale;
    ctx.beginPath();
    ctx.arc(yIntSX, yIntSY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
  }, [a, b, c, challenge, vx, vy, disc, roots, yInt, W, H, cx, cy, scale]);

  useEffect(() => { draw(); }, [draw]);

  const checkAnswer = () => {
    if (hitSuccess) {
      setFeedbackMsg(`🎯 Bullseye! The parabola passes through the targets!`);
      setScore(s => s + 10);
      setStreak(s => {
        const ns = s + 1;
        if (ns > bestStreak) setBestStreak(ns);
        return ns;
      });
      setCompletedChallenges(prev => ({ ...prev, [challenge.id]: true }));
    } else {
      setFeedbackMsg(`❌ The curve doesn't hit the targets yet. Keep adjusting!`);
      setStreak(0);
    }
  };

  const nextChallenge = () => {
    setChallengeIdx(i => (i + 1) % TARGET_CHALLENGES.length);
    setA(1);
    setB(0);
    setC(0);
    setShowHint(false);
    setFeedbackMsg(null);
  };

  const completedCount = Object.keys(completedChallenges).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <div>
          <h3 className="text-lg font-bold text-white">🎯 Target Practice</h3>
          <p className="text-xs text-slate-500">Adjust a, b, c until your parabola hits both green targets</p>
        </div>
        <div className="flex items-center gap-4">
          {streak >= 2 && <span className="text-orange-400 text-sm font-bold">🔥 {streak}</span>}
          <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <span className="text-yellow-400 font-mono font-bold">{score} pts</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{completedCount}/{TARGET_CHALLENGES.length} done</span>
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <div className="flex items-center gap-3 mb-3">
          <Crosshair size={16} className="text-green-400" />
          <p className="text-white text-sm font-medium">{challenge.description}</p>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
          }`}>{challenge.difficulty}</span>
        </div>

        {showHint && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-300 text-xs">
            💡 {challenge.hint}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col items-center">
            <div className="bg-black/60 rounded-2xl border border-brand-border p-2">
              <canvas ref={canvasRef} width={W} height={H} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/50 rounded-2xl border border-brand-border p-4 text-center mb-4">
              <div className="text-2xl font-mono font-black text-white">
                f(x) = {a}x² {b >= 0 ? '+' : '−'} {Math.abs(b)}x {c >= 0 ? '+' : '−'} {Math.abs(c)}
              </div>
            </div>

            {[
              { label: 'a (opens up/down)', val: a, set: setA, min: -3, max: 3, step: 0.1, color: 'text-yellow-400' },
              { label: 'b (tilt)', val: b, set: setB, min: -6, max: 6, step: 0.5, color: 'text-pink-400' },
              { label: 'c (y-intercept)', val: c, set: setC, min: -8, max: 8, step: 0.5, color: 'text-purple-400' },
            ].map(({ label, val, set, min, max, step, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">{label}</span>
                  <span className={`font-mono font-bold ${color}`}>{val.toFixed(1)}</span>
                </div>
                <input
                  type="range" min={min} max={max} step={step} value={val}
                  onChange={e => { set(Number(e.target.value)); setFeedbackMsg(null); }}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
              </div>
            ))}

            <div className="flex gap-3 mt-4">
              <button
                onClick={checkAnswer}
                className="flex-1 px-4 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all"
              >
                Check Target
              </button>
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl font-bold uppercase tracking-widest text-sm border border-yellow-500/30 hover:bg-yellow-500/30 transition-all"
                >
                  💡 Hint
                </button>
              )}
            </div>

            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-sm font-bold text-center ${
                  hitSuccess ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                }`}
              >
                {feedbackMsg}
                {hitSuccess && (
                  <button
                    onClick={nextChallenge}
                    className="block mx-auto mt-3 px-6 py-2 bg-brand-accent text-black rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white transition-all"
                  >
                    Next Challenge <ArrowRight size={14} className="inline" />
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {TARGET_CHALLENGES.map((tc, i) => (
          <button
            key={tc.id}
            onClick={() => { setChallengeIdx(i); setA(1); setB(0); setC(0); setFeedbackMsg(null); setShowHint(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              challengeIdx === i
                ? 'bg-brand-accent text-black'
                : completedChallenges[tc.id]
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {completedChallenges[tc.id] && '✓ '}Target {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function ExploreMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  const W = 340, H = 340;
  const cx = W / 2, cy = H / 2;
  const scale = 25;

  const disc = b * b - 4 * a * c;
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

    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

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

    const axX = cx + vx * scale;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(34,211,238,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(axX, 0); ctx.lineTo(axX, H); ctx.stroke();
    ctx.setLineDash([]);

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

    const vpx = cx + vx * scale;
    const vpy = cy - vy * scale;
    ctx.beginPath();
    ctx.arc(vpx, vpy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(cx, cy - c * scale, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();

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
        <div className="flex flex-col items-center">
          <div className="bg-black/60 rounded-2xl border border-brand-border p-2">
            <canvas ref={canvasRef} width={W} height={H} className="rounded-xl" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/50 rounded-2xl border border-brand-border p-4 text-center">
            <div className="text-2xl font-mono font-black text-white">{eqStr}</div>
          </div>

          {[
            { label: 'a', val: a, set: setA, min: -3, max: 3, step: 0.5, color: 'text-yellow-400' },
            { label: 'b', val: b, set: setB, min: -8, max: 8, step: 1, color: 'text-pink-400' },
            { label: 'c', val: c, set: setC, min: -8, max: 8, step: 1, color: 'text-purple-400' },
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
              />
            </div>
          ))}

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

function FormsMode() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [showDerivation, setShowDerivation] = useState(true);

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
    `${a}[x² ${(b / a) >= 0 ? `+ ${(b / a).toFixed(2)}` : `− ${Math.abs(b / a).toFixed(2)}`}x] ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}`,
    `${a}[(x + ${(b / (2 * a)).toFixed(2)})² − ${((b / (2 * a)) ** 2).toFixed(2)}] ${c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}`,
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
              className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
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
          { title: 'Factored Form', formula: factoredStr, color: 'border-green-500/40 bg-green-500/5', badge: 'a(x−r₁)(x−r₂)' },
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

function ApplicationsMode() {
  const APP_SCENARIOS = [
    {
      id: 'projectile', title: 'Projectile Motion', icon: '🚀',
      equation: 'h(t) = −4.9t² + 20t + 2',
      questions: [
        { q: 'What is the initial height?', a: 'h(0) = 2 m' },
        { q: 'What is the maximum height?', a: 'Vertex at t = −20/(2×−4.9) ≈ 2.04s, h ≈ 22.4 m' },
        { q: 'When does it hit the ground?', a: 'Solve −4.9t² + 20t + 2 = 0: t ≈ 4.18 s' },
      ],
    },
    {
      id: 'revenue', title: 'Revenue Maximisation', icon: '💰',
      equation: 'R(x) = −2x² + 80x',
      questions: [
        { q: 'How many units maximise revenue?', a: 'x = −80/(2×−2) = 20 units' },
        { q: 'What is the maximum revenue?', a: 'R(20) = −2(400) + 80(20) = 800 GHS' },
      ],
    },
    {
      id: 'bridge', title: 'Bridge Arch – Ghana', icon: '🌉',
      equation: 'f(x) = −(1/25)x² + 4',
      questions: [
        { q: 'Height at centre (x = 0)?', a: 'f(0) = 4 m' },
        { q: 'Where does the arch meet ground?', a: 'f = 0 → x² = 100 → x = ±10 m (span = 20 m)' },
      ],
    },
  ];

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
        <h3 className="text-xl font-bold text-white mb-2">{selected.title}</h3>
        <div className="bg-black/50 rounded-xl p-4 text-center mb-5">
          <div className="text-2xl font-mono font-bold text-brand-accent">{selected.equation}</div>
        </div>

        <div className="space-y-4">
          {selected.questions.map((q, i) => (
            <div key={i} className="bg-black/30 rounded-xl border border-slate-800 overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => setShowSolution(prev => ({ ...prev, [`${i}`]: !prev[`${i}`] }))}
              >
                <span className="text-white text-sm">Q{i + 1}: {q.q}</span>
                <ChevronRight size={16} className={`text-slate-500 transition-transform ${showSolution[`${i}`] ? 'rotate-90' : ''}`} />
              </div>
              <AnimatePresence>
                {showSolution[`${i}`] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-slate-800 bg-green-500/5">
                      <span className="text-green-400 font-mono text-sm">{q.a}</span>
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