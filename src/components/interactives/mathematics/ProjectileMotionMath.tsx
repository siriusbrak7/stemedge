import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import { Play, RotateCcw, Target, Crosshair, ArrowRight, CheckCircle2, XCircle, Trophy, ChevronDown } from 'lucide-react';

type ViewMode = 'challenge' | 'free-play' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'pm1', question: 'The path of a projectile is mathematically modeled by a:', type: 'multiple-choice', options: ['Linear function', 'Quadratic function (Parabola)', 'Cubic function', 'Sine wave'], correctAnswer: 'Quadratic function (Parabola)', explanation: 'Projectile motion under gravity follows a parabolic path.' },
  { id: 'pm2', question: 'To find the maximum height, you find the parabola\'s:', type: 'multiple-choice', options: ['x-intercepts', 'y-intercept', 'Vertex', 'Slope'], correctAnswer: 'Vertex', explanation: 'The vertex of a downward-opening parabola represents the maximum value.' },
  { id: 'pm3', question: 'The x-intercepts (roots) represent:', type: 'multiple-choice', options: ['The launch angle', 'The maximum height', 'When the projectile is on the ground', 'The initial speed'], correctAnswer: 'When the projectile is on the ground', explanation: 'The x-intercepts occur where y = 0 — the projectile at ground level.' },
  { id: 'pm4', question: 'A launch angle of 45° usually provides:', type: 'multiple-choice', options: ['Max height', 'Max range', 'Shortest flight time', 'Max speed'], correctAnswer: 'Max range', explanation: 'Ignoring air resistance, 45° balances horizontal velocity and flight time for maximum distance.' },
  { id: 'pm5', question: 'The term −½gt² represents the effect of:', type: 'multiple-choice', options: ['Initial velocity', 'Air resistance', 'Gravity', 'Launch height'], correctAnswer: 'Gravity', explanation: 'Gravity accelerates the object downwards, scaling quadratically with time.' },
];

interface TargetChallenge {
  id: string;
  targetX: number;
  targetY: number;
  targetRadius: number;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
  minVelocity: number;
  maxVelocity: number;
  minAngle: number;
  maxAngle: number;
}

const TARGET_CHALLENGES: TargetChallenge[] = [
  {
    id: 't1',
    targetX: 40, targetY: 0, targetRadius: 8,
    description: 'Hit the ground target at 40 metres',
    difficulty: 'easy',
    hint: 'Try an angle of 45° and adjust velocity. Remember: range = v²sin(2θ)/g',
    minVelocity: 10, maxVelocity: 50, minAngle: 30, maxAngle: 60,
  },
  {
    id: 't2',
    targetX: 60, targetY: 0, targetRadius: 6,
    description: 'Hit the ground target at 60 metres precisely',
    difficulty: 'medium',
    hint: 'At 45°, v² = R×g. So v = √(60×9.81) ≈ 24.3 m/s',
    minVelocity: 15, maxVelocity: 40, minAngle: 20, maxAngle: 70,
  },
  {
    id: 't3',
    targetX: 25, targetY: 12, targetRadius: 4,
    description: 'Hit the floating target at (25m, 12m) — a bird in flight!',
    difficulty: 'hard',
    hint: 'Use parametric equations. At t seconds, x = v₀cosθ·t, y = v₀sinθ·t − 4.9t². Solve for t from x, then plug into y.',
    minVelocity: 10, maxVelocity: 50, minAngle: 10, maxAngle: 80,
  },
  {
    id: 't4',
    targetX: 80, targetY: 0, targetRadius: 8,
    description: 'Long range: hit the target at 80 metres',
    difficulty: 'medium',
    hint: 'For max range at 45°, v = √(R×g). You need v ≈ 28 m/s',
    minVelocity: 20, maxVelocity: 50, minAngle: 30, maxAngle: 60,
  },
  {
    id: 't5',
    targetX: 30, targetY: 15, targetRadius: 3,
    description: 'High and close — hit the drone at (30m, 15m)',
    difficulty: 'hard',
    hint: 'You need a steep angle and moderate speed. Try θ = 60° and adjust v.',
    minVelocity: 15, maxVelocity: 40, minAngle: 40, maxAngle: 80,
  },
];

export default function ProjectileMotionMath() {
  const [viewMode, setViewMode] = useState<ViewMode>('challenge');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {([
          { key: 'challenge' as ViewMode, label: 'Target Practice', icon: <Crosshair size={14} /> },
          { key: 'free-play' as ViewMode, label: 'Free Play', icon: <Play size={14} /> },
          { key: 'quiz' as ViewMode, label: 'Quiz', icon: <Target size={14} /> },
        ]).map(m => (
          <button key={m.key} onClick={() => setViewMode(m.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === m.key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{m.icon} {m.label}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'challenge' && <TargetChallengeMode />}
            {viewMode === 'free-play' && <FreePlayMode />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Projectile Quadratics Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TargetChallengeMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [trace, setTrace] = useState<{ x: number; y: number }[]>([]);

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [shotsFired, setShotsFired] = useState(0);

  const challenge = TARGET_CHALLENGES[challengeIdx];
  const g = 9.81;
  const angleRad = (angle * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);
  const flightTime = (2 * v0y) / g;
  const maxHeight = (v0y * v0y) / (2 * g);
  const maxRange = v0x * flightTime;

  const currentX = v0x * time;
  const currentY = Math.max(0, v0y * time - 0.5 * g * time * time);

  const tick = useCallback(() => {
    if (playing) {
      setTime(t => {
        if (t >= flightTime) {
          setPlaying(false);
          checkHit();
          return flightTime;
        }
        return t + 0.05;
      });
      setTrace(prev => {
        const tt = prev.length > 0 ? prev[prev.length - 1] : { x: 0, y: 0 };
        const newT = prev.length * 0.05;
        if (newT > flightTime) return prev;
        return [...prev, {
          x: v0x * newT,
          y: Math.max(0, v0y * newT - 0.5 * g * newT * newT),
        }];
      });
    }
  }, [playing, flightTime, v0x, v0y]);

  useEffect(() => {
    let id: number;
    if (playing) id = window.setInterval(tick, 50);
    return () => clearInterval(id);
  }, [playing, tick]);

  const checkHit = () => {
    setShotsFired(s => s + 1);
    const landX = maxRange;
    const dist = Math.sqrt((landX - challenge.targetX) ** 2 + (0 - challenge.targetY) ** 2);

    if (dist <= challenge.targetRadius) {
      const bonus = showHint ? 5 : 10;
      setScore(s => s + bonus);
      setFeedbackMsg(`🎯 Bullseye! Distance off: ${dist.toFixed(1)}m. +${bonus} pts`);
      setCompletedChallenges(prev => ({ ...prev, [challenge.id]: (prev[challenge.id] || 0) + 1 }));
    } else if (dist <= challenge.targetRadius * 2) {
      setScore(s => s + 3);
      setFeedbackMsg(`👌 Close! Distance off: ${dist.toFixed(1)}m. +3 pts`);
    } else {
      setFeedbackMsg(`❌ Miss! Distance off: ${dist.toFixed(1)}m. Try adjusting your angle and velocity.`);
    }
  };

  const handleFire = () => {
    setTime(0);
    setTrace([]);
    setPlaying(true);
    setFeedbackMsg(null);
  };

  const nextChallenge = () => {
    setChallengeIdx(i => (i + 1) % TARGET_CHALLENGES.length);
    setVelocity(25);
    setAngle(45);
    setTime(0);
    setTrace([]);
    setPlaying(false);
    setFeedbackMsg(null);
    setShowHint(false);
  };

  const completedCount = Object.keys(completedChallenges).length;

  const drawer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 500, H = 360;
    const groundY = 320;
    const scale = 3.5;
    const originX = 40;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let d = 20; d <= 140; d += 20) {
      const px = originX + d * scale;
      if (px < W - 20) {
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, groundY); ctx.stroke();
      }
    }
    for (let h = 10; h <= 60; h += 10) {
      const py = groundY - h * scale;
      if (py > 10) {
        ctx.beginPath(); ctx.moveTo(originX, py); ctx.lineTo(W - 20, py); ctx.stroke();
      }
    }

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(originX, groundY); ctx.lineTo(W, groundY); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let d = 20; d <= 140; d += 20) {
      const px = originX + d * scale;
      ctx.fillText(`${d}m`, px, groundY + 15);
    }

    const tx = originX + challenge.targetX * scale;
    const ty = groundY - challenge.targetY * scale;

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(tx, ty, challenge.targetRadius * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🎯', tx, ty - challenge.targetRadius * scale - 6);
    ctx.fillText(`${challenge.targetX}m, ${challenge.targetY}m`, tx, ty - challenge.targetRadius * scale - 18);

    const cannonX = originX;
    const cannonY = groundY;
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(cannonX, cannonY, 10, Math.PI, 0);
    ctx.fill();
    ctx.save();
    ctx.translate(cannonX, cannonY);
    ctx.rotate(-angleRad);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, -4, 24, 8);
    ctx.restore();

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let t = 0; t < flightTime + 0.01; t += 0.05) {
      const px = v0x * t;
      const py = v0y * t - 0.5 * g * t * t;
      if (py < 0) break;
      const sx = originX + px * scale;
      const sy = groundY - py * scale;
      if (t === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (trace.length > 1) {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      trace.forEach((p, i) => {
        const sx = originX + p.x * scale;
        const sy = groundY - Math.max(0, p.y) * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
    }

    if (playing || (time >= flightTime && trace.length > 0)) {
      const px = originX + currentX * scale;
      const py = groundY - Math.max(0, currentY) * scale;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (!playing && time >= flightTime && trace.length > 0) {
      const landPx = originX + maxRange * scale;
      const hitDist = Math.sqrt((maxRange - challenge.targetX) ** 2);
      ctx.fillStyle = hitDist <= challenge.targetRadius ? '#22c55e' : '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${maxRange.toFixed(1)}m`, landPx, groundY + 28);

      if (hitDist <= challenge.targetRadius) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tx, ty, challenge.targetRadius * scale + 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }


  }, [velocity, angle, playing, time, trace, flightTime, v0x, v0y, currentX, currentY, maxRange, challenge, angleRad]);

  useEffect(() => { drawer(); }, [drawer]);

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">🎯 Target Practice</h3>
          <p className="text-xs text-slate-500">Adjust angle and velocity to hit the yellow target</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <Trophy size={14} className="text-yellow-400 inline mr-1" />
            <span className="text-yellow-400 font-mono text-xs font-bold">{score} pts</span>
          </div>
          <span className="text-[10px] text-slate-500">{completedCount}/{TARGET_CHALLENGES.length} hit | {shotsFired} shots</span>
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Crosshair size={16} className="text-yellow-400" />
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

        <div className="rounded-2xl overflow-hidden border border-slate-700/50">
          <canvas ref={canvasRef} width={500} height={360} className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Launch Angle</span>
            <span className="text-yellow-400 font-mono">{angle}°</span>
          </div>
          <input type="range" min={challenge.minAngle} max={challenge.maxAngle} value={angle}
            onChange={e => { setAngle(Number(e.target.value)); setFeedbackMsg(null); }} disabled={playing}
            className="w-full accent-yellow-500" />
        </div>
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Initial Velocity</span>
            <span className="text-cyan-400 font-mono">{velocity} m/s</span>
          </div>
          <input type="range" min={challenge.minVelocity} max={challenge.maxVelocity} step={0.5} value={velocity}
            onChange={e => { setVelocity(Number(e.target.value)); setFeedbackMsg(null); }} disabled={playing}
            className="w-full accent-cyan-500" />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {!playing && (
          <>
            <button onClick={handleFire}
              className="px-8 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center gap-2">
              <Play size={16} fill="currentColor" /> Fire!
            </button>
            {!showHint && (
              <button onClick={() => setShowHint(true)}
                className="px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl font-bold uppercase tracking-widest text-sm border border-yellow-500/30 hover:bg-yellow-500/30 transition-all">
                💡 Hint
              </button>
            )}
            <button onClick={nextChallenge}
              className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold uppercase tracking-widest text-sm hover:text-white transition-all flex items-center gap-2">
              <ArrowRight size={14} /> Skip
            </button>
          </>
        )}
      </div>

      {feedbackMsg && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-sm font-bold text-center ${
            feedbackMsg.includes('Bullseye') || feedbackMsg.includes('Close')
              ? feedbackMsg.includes('Bullseye') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
          {feedbackMsg}
        </motion.div>
      )}

      {time >= flightTime && !playing && (
        <div className="bg-black/30 rounded-xl p-4 border border-slate-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Range</div>
              <div className="text-lg font-mono text-cyan-400 font-bold">{maxRange.toFixed(1)} m</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Max Height</div>
              <div className="text-lg font-mono text-yellow-400 font-bold">{maxHeight.toFixed(1)} m</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Flight Time</div>
              <div className="text-lg font-mono text-purple-400 font-bold">{flightTime.toFixed(2)} s</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap justify-center">
        {TARGET_CHALLENGES.map((tc, i) => (
          <button
            key={tc.id}
            onClick={() => { setChallengeIdx(i); setVelocity(25); setAngle(45); setTime(0); setTrace([]); setPlaying(false); setFeedbackMsg(null); setShowHint(false); }}
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

function FreePlayMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [velocity, setVelocity] = useState(30);
  const [angle, setAngle] = useState(45);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [trace, setTrace] = useState<{ x: number; y: number }[]>([]);

  const g = 9.81;
  const angleRad = (angle * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);
  const flightTime = (2 * v0y) / g;
  const maxHeight = (v0y * v0y) / (2 * g);
  const maxRange = v0x * flightTime;

  const currentX = v0x * time;
  const currentY = Math.max(0, v0y * time - 0.5 * g * time * time);

  const tick = useCallback(() => {
    if (playing) {
      setTime(t => {
        if (t >= flightTime) { setPlaying(false); return flightTime; }
        return t + 0.05;
      });
      setTrace(prev => {
        const newT = prev.length * 0.05;
        if (newT > flightTime) return prev;
        return [...prev, { x: v0x * newT, y: Math.max(0, v0y * newT - 0.5 * g * newT * newT) }];
      });
    }
  }, [playing, flightTime, v0x, v0y]);

  useEffect(() => {
    let id: number;
    if (playing) id = window.setInterval(tick, 50);
    return () => clearInterval(id);
  }, [playing, tick]);

  const handleFire = () => { setTime(0); setTrace([]); setPlaying(true); };

  const drawer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 500, H = 360, groundY = 320, scale = 3.0, originX = 40;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let d = 20; d <= 160; d += 20) {
      const px = originX + d * scale;
      if (px < W - 20) { ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, groundY); ctx.stroke(); }
    }

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(originX, groundY); ctx.lineTo(W, groundY); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let d = 20; d <= 160; d += 20) {
      ctx.fillText(`${d}m`, originX + d * scale, groundY + 15);
    }

    const cannonX = originX, cannonY = groundY;
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(cannonX, cannonY, 10, Math.PI, 0); ctx.fill();
    ctx.save();
    ctx.translate(cannonX, cannonY);
    ctx.rotate(-angleRad);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, -4, 24, 8);
    ctx.restore();

    if (trace.length > 1) {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      trace.forEach((p, i) => {
        const sx = originX + p.x * scale;
        const sy = groundY - Math.max(0, p.y) * scale;
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      ctx.stroke();
    }

    if (playing || time >= flightTime) {
      const px = originX + currentX * scale;
      const py = groundY - Math.max(0, currentY) * scale;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let t = 0; t < flightTime + 0.01; t += 0.05) {
      const px = v0x * t, py = v0y * t - 0.5 * g * t * t;
      if (py < 0) break;
      const sx = originX + px * scale, sy = groundY - py * scale;
      t === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }, [velocity, angle, playing, time, trace, flightTime, v0x, v0y, currentX, currentY, angleRad]);

  useEffect(() => { drawer(); }, [drawer]);

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div className="rounded-2xl overflow-hidden border border-slate-700/50">
        <canvas ref={canvasRef} width={500} height={360} className="w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Angle</span><span className="text-yellow-400 font-mono">{angle}°</span>
          </div>
          <input type="range" min={5} max={80} value={angle} onChange={e => setAngle(Number(e.target.value))} disabled={playing}
            className="w-full accent-yellow-500" />
        </div>
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Velocity</span><span className="text-cyan-400 font-mono">{velocity} m/s</span>
          </div>
          <input type="range" min={10} max={50} step={0.5} value={velocity} onChange={e => setVelocity(Number(e.target.value))} disabled={playing}
            className="w-full accent-cyan-500" />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        {!playing && (
          <button onClick={handleFire}
            className="px-8 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center gap-2">
            <Play size={16} fill="currentColor" /> Fire!
          </button>
        )}
      </div>

      {!playing && time >= flightTime && (
        <div className="grid grid-cols-3 gap-4 text-center bg-black/30 rounded-xl p-4 border border-slate-800">
          <div><div className="text-[10px] text-slate-500 uppercase">Range</div><div className="text-lg font-mono text-cyan-400 font-bold">{maxRange.toFixed(1)} m</div></div>
          <div><div className="text-[10px] text-slate-500 uppercase">Max Height</div><div className="text-lg font-mono text-yellow-400 font-bold">{maxHeight.toFixed(1)} m</div></div>
          <div><div className="text-[10px] text-slate-500 uppercase">Flight Time</div><div className="text-lg font-mono text-purple-400 font-bold">{flightTime.toFixed(2)} s</div></div>
        </div>
      )}
    </div>
  );
}