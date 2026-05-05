import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Target, Shuffle, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { PARABOLA_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

type Mode = 'explore' | 'vertex-hunt' | 'root-finder' | 'discriminant' | 'bridge';

interface Challenge {
  targetVertex?: { h: number; k: number };
  equation?: { a: number; b: number; c: number };
  equations?: { a: number; b: number; c: number; roots: number }[];
  bridgeSpan?: number;
  bridgeHeight?: number;
}

const genVertexChallenge = (): Challenge => ({
  targetVertex: { h: Math.floor(Math.random() * 8 - 4), k: Math.floor(Math.random() * 6 + 1) },
});

const genRootChallenge = (): Challenge => {
  const r1 = Math.floor(Math.random() * 6 - 3);
  const r2 = Math.floor(Math.random() * 6 - 3);
  return { equation: { a: 1, b: -(r1 + r2), c: r1 * r2 } };
};

const genDiscriminantChallenge = (): Challenge => ({
  equations: [
    { a: 1, b: -4, c: 3, roots: 2 },   // b²-4ac = 4 > 0
    { a: 1, b: -2, c: 1, roots: 1 },    // b²-4ac = 0
    { a: 1, b: 1, c: 3, roots: 0 },     // b²-4ac = -11 < 0
  ].sort(() => Math.random() - 0.5),
});

const genBridgeChallenge = (): Challenge => ({
  bridgeSpan: (Math.floor(Math.random() * 4) + 3) * 2,  // 6,8,10,12
  bridgeHeight: Math.floor(Math.random() * 4) + 4,       // 4-7
});

interface ParabolaSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ParabolaSimulation({ variables, isRunning, onRecordData }: ParabolaSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('explore');
  const [a, setA] = useState(-1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(4);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(genVertexChallenge());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [discAnswers, setDiscAnswers] = useState<Record<number, number | null>>({});
  const [rootAnswer, setRootAnswer] = useState({ r1: '', r2: '' });

  const W = 600, H = 400;
  const originX = W / 2, originY = H / 2;
  const scale = 30; // px per unit

  // Derived values
  const vertexH = -b / (2 * a || 0.001);
  const vertexK = a * vertexH * vertexH + b * vertexH + c;
  const disc = b * b - 4 * a * c;
  const numRoots = disc > 0.01 ? 2 : Math.abs(disc) < 0.01 ? 1 : 0;

  const toScreenX = (x: number) => originX + x * scale;
  const toScreenY = (y: number) => originY - y * scale;

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060b18'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let gx = -10; gx <= 10; gx++) { const sx = toScreenX(gx); ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke(); }
    for (let gy = -8; gy <= 8; gy++) { const sy = toScreenY(gy); ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(W, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, H); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    for (let i = -9; i <= 9; i++) { if (i !== 0) ctx.fillText(`${i}`, toScreenX(i), originY + 14); }
    ctx.textAlign = 'right';
    for (let i = -6; i <= 6; i++) { if (i !== 0) ctx.fillText(`${i}`, originX - 6, toScreenY(i) + 3); }

    // Bridge mode: draw ground and span
    if (mode === 'bridge' && challenge.bridgeSpan) {
      const span = challenge.bridgeSpan;
      const height = challenge.bridgeHeight || 5;
      // Ground
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(toScreenX(-span / 2 - 1), originY); ctx.lineTo(toScreenX(span / 2 + 1), originY); ctx.stroke();
      // Target pillars
      ctx.fillStyle = 'rgba(239,68,68,0.3)';
      ctx.fillRect(toScreenX(-span / 2) - 3, originY - 5, 6, 10);
      ctx.fillRect(toScreenX(span / 2) - 3, originY - 5, 6, 10);
      // Target height marker
      ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(250,204,21,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(toScreenX(-span / 2), toScreenY(height)); ctx.lineTo(toScreenX(span / 2), toScreenY(height)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`Span: ${span}m`, originX, originY + 30);
      ctx.fillText(`Height: ${height}m`, originX, toScreenY(height) - 8);
    }

    // Target vertex marker
    if (mode === 'vertex-hunt' && challenge.targetVertex) {
      const tx = toScreenX(challenge.targetVertex.h);
      const ty = toScreenY(challenge.targetVertex.k);
      ctx.strokeStyle = 'rgba(239,68,68,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx - 6, ty); ctx.lineTo(tx + 6, ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx, ty - 6); ctx.lineTo(tx, ty + 6); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`Target (${challenge.targetVertex.h}, ${challenge.targetVertex.k})`, tx + 14, ty - 4);
    }

    // Parabola curve
    ctx.beginPath(); ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2.5;
    ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 8;
    let first = true;
    for (let px = 0; px < W; px++) {
      const x = (px - originX) / scale;
      const y = a * x * x + b * x + c;
      const sy = toScreenY(y);
      if (sy < -50 || sy > H + 50) { first = true; continue; }
      if (first) { ctx.moveTo(px, sy); first = false; } else ctx.lineTo(px, sy);
    }
    ctx.stroke(); ctx.shadowBlur = 0;

    // Axis of symmetry
    ctx.setLineDash([6, 4]); ctx.strokeStyle = 'rgba(168,85,247,0.4)'; ctx.lineWidth = 1;
    const axisX = toScreenX(vertexH);
    ctx.beginPath(); ctx.moveTo(axisX, 0); ctx.lineTo(axisX, H); ctx.stroke();
    ctx.setLineDash([]);

    // Vertex dot
    const vx = toScreenX(vertexH), vy = toScreenY(vertexK);
    if (vy > 0 && vy < H) {
      ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.arc(vx, vy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f472b6'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`(${vertexH.toFixed(1)}, ${vertexK.toFixed(1)})`, vx + 10, vy - 8);
    }

    // Root markers
    if (numRoots >= 1) {
      const roots = numRoots === 2
        ? [(-b + Math.sqrt(disc)) / (2 * a), (-b - Math.sqrt(disc)) / (2 * a)]
        : [-b / (2 * a)];
      roots.forEach(r => {
        const rx = toScreenX(r);
        ctx.fillStyle = '#a3e635'; ctx.beginPath(); ctx.arc(rx, originY, 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '9px monospace'; ctx.textAlign = 'center';
        ctx.fillText(r.toFixed(1), rx, originY + 18);
      });
    }

    // Discriminant colour indicator
    const discColor = numRoots === 2 ? '#22c55e' : numRoots === 1 ? '#eab308' : '#ef4444';
    ctx.fillStyle = discColor; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`Δ = b²−4ac = ${disc.toFixed(1)} → ${numRoots} root${numRoots !== 1 ? 's' : ''}`, 10, 18);

    // Equation
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '12px monospace';
    ctx.fillText(`f(x) = ${a}x² ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)}`, 10, 35);
  }, [a, b, c, mode, challenge, W, H, originX, originY, scale, vertexH, vertexK, disc, numRoots, toScreenX, toScreenY]);

  useEffect(() => { drawScene(); }, [drawScene]);

  const checkVertex = () => {
    if (!challenge.targetVertex) return;
    const dh = Math.abs(vertexH - challenge.targetVertex.h);
    const dk = Math.abs(vertexK - challenge.targetVertex.k);
    if (dh < 0.5 && dk < 0.5) {
      setFeedback('🎯 Perfect vertex match! +3 pts'); setScore(s => s + 3); setStreak(s => s + 1);
    } else if (dh < 1 && dk < 1) {
      setFeedback('👍 Close! +1 pt'); setScore(s => s + 1);
    } else {
      setFeedback(`❌ Your vertex is (${vertexH.toFixed(1)}, ${vertexK.toFixed(1)}), target was (${challenge.targetVertex.h}, ${challenge.targetVertex.k})`);
      setStreak(0);
    }
  };

  const checkRoots = () => {
    if (!challenge.equation) return;
    const { a: ca, b: cb, c: cc } = challenge.equation;
    const d = cb * cb - 4 * ca * cc;
    if (d < 0) return;
    const r1a = (-cb + Math.sqrt(d)) / (2 * ca);
    const r2a = (-cb - Math.sqrt(d)) / (2 * ca);
    const ur1 = parseFloat(rootAnswer.r1), ur2 = parseFloat(rootAnswer.r2);
    if (isNaN(ur1) || isNaN(ur2)) return;
    const match = (Math.abs(ur1 - r1a) < 0.2 && Math.abs(ur2 - r2a) < 0.2) || (Math.abs(ur1 - r2a) < 0.2 && Math.abs(ur2 - r1a) < 0.2);
    if (match) {
      setFeedback(`✅ Correct! Roots: x = ${r1a.toFixed(1)} and x = ${r2a.toFixed(1)} → +4 pts`); setScore(s => s + 4); setStreak(s => s + 1);
    } else {
      setFeedback(`❌ Roots are x = ${r1a.toFixed(1)} and x = ${r2a.toFixed(1)}. Use x = (−b ± √Δ) / 2a`); setStreak(0);
    }
  };

  const checkDiscriminant = (idx: number, guess: number) => {
    if (discAnswers[idx] !== undefined && discAnswers[idx] !== null) return;
    const eq = challenge.equations?.[idx];
    if (!eq) return;
    setDiscAnswers(prev => ({ ...prev, [idx]: guess }));
    if (guess === eq.roots) { setScore(s => s + 2); setStreak(s => s + 1); }
    else { setStreak(0); }
  };

  const checkBridge = () => {
    if (!challenge.bridgeSpan || !challenge.bridgeHeight) return;
    const span = challenge.bridgeSpan;
    const height = challenge.bridgeHeight;
    // Check if parabola roots ≈ ±span/2 and vertex height ≈ target
    const rootsOk = numRoots === 2 && (() => {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      const actualSpan = Math.abs(r1 - r2);
      return Math.abs(actualSpan - span) < span * 0.1;
    })();
    const heightOk = Math.abs(vertexK - height) < height * 0.1;
    if (rootsOk && heightOk) {
      setFeedback('🏗️ Perfect bridge design! +5 pts'); setScore(s => s + 5); setStreak(s => s + 1);
    } else if (rootsOk || heightOk) {
      setFeedback(`👍 ${rootsOk ? 'Span is correct' : 'Height is correct'}, adjust the other. +1 pt`); setScore(s => s + 1);
    } else {
      setFeedback(`❌ Span ≈ ${numRoots === 2 ? Math.abs((-b + Math.sqrt(disc)) / (2 * a) - (-b - Math.sqrt(disc)) / (2 * a)).toFixed(1) : '?'}m (need ${span}m), Height = ${vertexK.toFixed(1)}m (need ${height}m)`);
      setStreak(0);
    }
  };

  const newChallenge = (m: Mode) => {
    setMode(m); setFeedback(null); setDiscAnswers({}); setRootAnswer({ r1: '', r2: '' });
    if (m === 'vertex-hunt') { setChallenge(genVertexChallenge()); setA(-1); setB(0); setC(0); }
    else if (m === 'root-finder') { const ch = genRootChallenge(); setChallenge(ch); setA(ch.equation!.a); setB(ch.equation!.b); setC(ch.equation!.c); }
    else if (m === 'discriminant') setChallenge(genDiscriminantChallenge());
    else if (m === 'bridge') { setChallenge(genBridgeChallenge()); setA(-0.5); setB(0); setC(3); }
  };

  const MODES: { id: Mode; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'vertex-hunt', label: 'Vertex Hunt' },
    { id: 'root-finder', label: 'Root Finder' },
    { id: 'discriminant', label: 'Discriminant' },
    { id: 'bridge', label: 'Bridge Design' },
  ];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Parabola <span className="text-brand-accent font-medium">Architect Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Design parabolas, find roots, and build bridges</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold">{score} pts</span>
          </div>
          {streak >= 2 && <span className="text-orange-400 text-sm font-bold animate-pulse">🔥 {streak}</span>}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap justify-center">
        {MODES.map(m => (
          <button key={m.id} onClick={() => newChallenge(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === m.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {/* Sliders (explore, vertex-hunt, bridge) */}
      {(mode === 'explore' || mode === 'vertex-hunt' || mode === 'bridge') && (
        <div className="w-full grid grid-cols-3 gap-4">
          {[{ label: 'a', val: a, set: setA, min: -3, max: 3, step: 0.1, color: 'cyan' },
            { label: 'b', val: b, set: setB, min: -6, max: 6, step: 0.5, color: 'yellow' },
            { label: 'c', val: c, set: setC, min: -6, max: 8, step: 0.5, color: 'pink' }].map(s => (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                <span>{s.label}</span><span className={`text-${s.color}-400`}>{s.val.toFixed(1)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                onChange={e => s.set(Number(e.target.value))} className={`w-full accent-${s.color}-400`} />
            </div>
          ))}
        </div>
      )}

      {/* Vertex Hunt action */}
      {mode === 'vertex-hunt' && (
        <button onClick={checkVertex} className="px-8 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all">
          <Target size={16} className="inline mr-2" /> Check Vertex
        </button>
      )}

      {/* Root Finder */}
      {mode === 'root-finder' && challenge.equation && (
        <div className="w-full max-w-md bg-slate-900/60 border border-orange-500/20 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">🎯 Find the Roots</h3>
          <p className="text-slate-400 text-xs mb-3 font-mono">
            f(x) = x² {challenge.equation.b >= 0 ? '+' : '−'} {Math.abs(challenge.equation.b)}x {challenge.equation.c >= 0 ? '+' : '−'} {Math.abs(challenge.equation.c)}
          </p>
          <p className="text-slate-500 text-[10px] mb-3">Use the quadratic formula: x = (−b ± √(b²−4ac)) / 2a</p>
          <div className="flex gap-2 mb-3">
            <input type="number" step="0.1" value={rootAnswer.r1} onChange={e => setRootAnswer({ ...rootAnswer, r1: e.target.value })}
              placeholder="Root 1" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-orange-400 outline-none" />
            <input type="number" step="0.1" value={rootAnswer.r2} onChange={e => setRootAnswer({ ...rootAnswer, r2: e.target.value })}
              placeholder="Root 2" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-orange-400 outline-none" />
          </div>
          <button onClick={checkRoots} className="w-full py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-400 transition-all">Check Roots</button>
        </div>
      )}

      {/* Discriminant challenge */}
      {mode === 'discriminant' && challenge.equations && (
        <div className="w-full max-w-lg space-y-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest text-center">Predict the Number of Real Roots</h3>
          {challenge.equations.map((eq, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <span className="text-white font-mono text-sm">
                x² {eq.b >= 0 ? '+' : '−'} {Math.abs(eq.b)}x {eq.c >= 0 ? '+' : '−'} {Math.abs(eq.c)}
              </span>
              <div className="flex gap-2">
                {[0, 1, 2].map(n => (
                  <button key={n} onClick={() => checkDiscriminant(i, n)} disabled={discAnswers[i] !== undefined && discAnswers[i] !== null}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      discAnswers[i] === n
                        ? n === eq.roots ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-red-500/20 border-2 border-red-500 text-red-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-400'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bridge action */}
      {mode === 'bridge' && (
        <button onClick={checkBridge} className="px-8 py-3 bg-green-500 text-black rounded-xl font-bold uppercase tracking-widest hover:bg-green-400 transition-all">
          🏗️ Submit Bridge Design
        </button>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`w-full max-w-md text-center p-3 rounded-xl text-sm font-bold ${
              feedback.includes('✅') || feedback.includes('🎯') || feedback.includes('🏗️') || feedback.includes('Perfect')
                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                : feedback.includes('👍') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {feedback}
            <button onClick={() => newChallenge(mode)} className="block mx-auto mt-2 text-xs underline opacity-70 hover:opacity-100">
              New Challenge
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Note */}
      <div className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge / IB · </span>
        Standard form: f(x) = ax² + bx + c. Vertex: (−b/2a, f(−b/2a)). Discriminant Δ = b²−4ac determines roots: Δ{'>'} 0 → 2 roots, Δ=0 → 1 root, Δ{'<'}0 → 0 real roots. Quadratic formula: x = (−b ± √Δ) / 2a.
      </div>
    </div>
  );
}

export default function ParabolaLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ParabolaSimulation {...props} />;

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
          You explored parabolas across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
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
      config={PARABOLA_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
