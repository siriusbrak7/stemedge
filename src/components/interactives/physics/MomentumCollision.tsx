import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Circle, TrendingUp, Globe, GraduationCap } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'elastic' | 'inelastic' | 'impulse' | 'ghana' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'mc1', question: 'In a closed system, total momentum is always:', type: 'multiple-choice', options: ['Increasing', 'Decreasing', 'Conserved', 'Zero'], correctAnswer: 'Conserved', explanation: 'The law of conservation of momentum states that in the absence of external forces, total momentum of a system remains constant.' },
  { id: 'mc2', question: 'A 2 kg object at 3 m/s collides with a 1 kg object at rest. If they stick together, the final velocity is:', type: 'multiple-choice', options: ['3 m/s', '2 m/s', '1.5 m/s', '6 m/s'], correctAnswer: '2 m/s', explanation: 'm₁v₁ = (m₁+m₂)V → 2×3 = 3×V → V = 2 m/s' },
  { id: 'mc3', question: 'Impulse equals:', type: 'multiple-choice', options: ['Force × velocity', 'Force × time', 'Mass × velocity', 'Mass × acceleration'], correctAnswer: 'Force × time', explanation: 'Impulse = F × t = change in momentum. The area under a force-time graph equals impulse.' },
  { id: 'mc4', question: 'In an elastic collision, which is conserved?', type: 'multiple-choice', options: ['Momentum only', 'Kinetic energy only', 'Both momentum and kinetic energy', 'Neither'], correctAnswer: 'Both momentum and kinetic energy', explanation: 'In perfectly elastic collisions, both momentum and kinetic energy are conserved. In inelastic collisions, only momentum is conserved.' },
  { id: 'mc5', question: 'A 1000 kg car at 20 m/s has momentum:', type: 'multiple-choice', options: ['200 kg·m/s', '2000 kg·m/s', '20000 kg·m/s', '50000 kg·m/s'], correctAnswer: '20000 kg·m/s', explanation: 'p = mv = 1000 × 20 = 20,000 kg·m/s' },
  { id: 'mc6', question: 'In an inelastic collision, kinetic energy:', type: 'multiple-choice', options: ['Is always conserved', 'Is partially or fully lost', 'Increases', 'Remains the same'], correctAnswer: 'Is partially or fully lost', explanation: 'In inelastic collisions, some kinetic energy is converted to heat, sound, or deformation energy. Only momentum is conserved.' },
  { id: 'mc7', question: 'A seatbelt increases the time of impact. This:', type: 'multiple-choice', options: ['Increases the force', 'Decreases the impulse', 'Decreases the force on the body', 'Has no effect'], correctAnswer: 'Decreases the force on the body', explanation: 'Impulse = F×t is fixed for a given change in momentum. Increasing t means F decreases — this is why seatbelts and airbags save lives.' },
  { id: 'mc8', question: 'The SI unit of momentum is:', type: 'multiple-choice', options: ['N·s', 'kg·m/s', 'J·s', 'N/m'], correctAnswer: 'kg·m/s', explanation: 'Momentum = mass × velocity, so units are kg × m/s = kg·m/s. Note: N·s is equivalent and also correct for impulse.' },
];

function ElasticCollision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(1);
  const [v1, setV1] = useState(3);
  const [v2, setV2] = useState(0);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({ x1: 80, x2: 260, vv1: 3, vv2: 0, collided: false });

  useEffect(() => {
    stateRef.current = { x1: 80, x2: 260, vv1: v1, vv2: v2, collided: false };
  }, [v1, v2]);

  const start = useCallback(() => {
    stateRef.current = { x1: 80, x2: 260, vv1: v1, vv2: v2, collided: false };
    setRunning(true);
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const s = stateRef.current;
      const W = 340, H = 180;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#06090f';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 120);
      ctx.lineTo(W - 10, 120);
      ctx.stroke();

      if (!s.collided) {
        s.x1 += s.vv1 * 0.5;
        s.x2 += s.vv2 * 0.5;
      } else {
        s.x1 += s.vv1 * 0.5;
        s.x2 += s.vv2 * 0.5;
      }

      const r1 = 12 + m1 * 4;
      const r2 = 12 + m2 * 4;

      if (!s.collided && s.x1 + r1 >= s.x2 - r2) {
        const newV1 = ((m1 - m2) * s.vv1 + 2 * m2 * s.vv2) / (m1 + m2);
        const newV2 = ((m2 - m1) * s.vv2 + 2 * m1 * s.vv1) / (m1 + m2);
        s.vv1 = newV1;
        s.vv2 = newV2;
        s.collided = true;
      }

      ctx.beginPath();
      ctx.arc(s.x1, 90, r1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,0.3)';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${m1}kg`, s.x1, 93);

      ctx.beginPath();
      ctx.arc(s.x2, 90, r2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239,68,68,0.3)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`${m2}kg`, s.x2, 93);

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`v=${s.vv1.toFixed(1)} m/s`, s.x1, 75);
      ctx.fillText(`v=${s.vv2.toFixed(1)} m/s`, s.x2, 75);

      if (s.collided) {
        const p1 = m1 * s.vv1;
        const p2 = m2 * s.vv2;
        const ke1 = 0.5 * m1 * s.vv1 * s.vv1;
        const ke2 = 0.5 * m2 * s.vv2 * s.vv2;
        ctx.fillStyle = 'rgba(34,211,238,0.6)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`p_total = ${(p1 + p2).toFixed(1)} kg·m/s`, 10, 20);
        ctx.fillText(`KE_total = ${(ke1 + ke2).toFixed(1)} J`, 10, 35);
      }

      if (s.x1 > W + 50 || s.x2 > W + 50 || s.x1 < -50 || s.x2 < -50) {
        setRunning(false);
        return;
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [m1, m2, v1, v2]);

  const pBefore = m1 * v1 + m2 * v2;
  const keBefore = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const v1After = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2After = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  const keAfter = 0.5 * m1 * v1After * v1After + 0.5 * m2 * v2After * v2After;

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex justify-center">
        <div className="bg-black/60 rounded-2xl border border-brand-border p-2">
          <canvas ref={canvasRef} width={340} height={180} className="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {[{ label: 'm₁ (kg)', val: m1, set: setM1, min: 1, max: 5, step: 1, color: 'text-cyan-400' },
            { label: 'v₁ (m/s)', val: v1, set: setV1, min: -5, max: 5, step: 0.5, color: 'text-cyan-400' },
          ].map(({ label, val, set, min, max, step, color }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">{label}</span><span className={`font-mono ${color}`}>{val}</span></div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[{ label: 'm₂ (kg)', val: m2, set: setM2, min: 1, max: 5, step: 1, color: 'text-red-400' },
            { label: 'v₂ (m/s)', val: v2, set: setV2, min: -5, max: 5, step: 0.5, color: 'text-red-400' },
          ].map(({ label, val, set, min, max, step, color }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">{label}</span><span className={`font-mono ${color}`}>{val}</span></div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
            </div>
          ))}
        </div>
      </div>
      <button onClick={start} className="px-4 py-2 bg-brand-accent text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-all self-center">
        {running ? 'Restart' : 'Start Collision'}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">After Collision</div>
          <div className="font-mono text-sm text-cyan-400">v₁ = {v1After.toFixed(2)} m/s</div>
          <div className="font-mono text-sm text-red-400">v₂ = {v2After.toFixed(2)} m/s</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Conservation Check</div>
          <div className="font-mono text-xs text-green-400">p = {pBefore.toFixed(1)} ✓ conserved</div>
          <div className="font-mono text-xs text-green-400">KE = {keBefore.toFixed(1)} → {keAfter.toFixed(1)} ✓ conserved</div>
        </div>
      </div>
    </div>
  );
}

function InelasticCollision() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(2);
  const [v1, setV1] = useState(4);
  const v2 = 0;
  const vFinal = (m1 * v1) / (m1 + m2);
  const keBefore = 0.5 * m1 * v1 * v1;
  const keAfter = 0.5 * (m1 + m2) * vFinal * vFinal;
  const keLoss = ((keBefore - keAfter) / keBefore) * 100;

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6 text-center">
        <div className="text-2xl font-mono font-bold text-white mb-4">{m1}kg × {v1}m/s + {m2}kg × 0 = ({m1}+{m2})kg × V</div>
        <div className="text-3xl font-mono font-black text-brand-accent">V = {vFinal.toFixed(2)} m/s</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {[{ label: 'm₁ (kg)', val: m1, set: setM1, min: 1, max: 8 },
            { label: 'm₂ (kg)', val: m2, set: setM2, min: 1, max: 8 },
            { label: 'v₁ (m/s)', val: v1, set: setV1, min: 1, max: 10 },
          ].map(({ label, val, set, min, max }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">{label}</span><span className="font-mono text-brand-accent">{val}</span></div>
              <input type="range" min={min} max={max} step={1} value={val} onChange={e => set(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Momentum</div>
            <div className="font-mono text-sm text-green-400">{(m1 * v1).toFixed(1)} kg·m/s → {((m1 + m2) * vFinal).toFixed(1)} kg·m/s ✓</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Kinetic Energy</div>
            <div className="font-mono text-sm text-red-400">{keBefore.toFixed(1)} J → {keAfter.toFixed(1)} J</div>
            <div className="font-mono text-xs text-orange-400 mt-1">{keLoss.toFixed(1)}% energy lost</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1">KE Lost To</div>
            <div className="text-slate-300 text-xs">Heat, sound, deformation of objects</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpulseMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [force, setForce] = useState(100);
  const [time, setTime] = useState(0.5);
  const impulse = force * time;
  const mass = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 340, H = 180;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 150);
    ctx.lineTo(W - 10, 150);
    ctx.moveTo(30, 20);
    ctx.lineTo(30, 150);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('t (s)', W / 2, 170);
    ctx.save();
    ctx.translate(12, 85);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('F (N)', 0, 0);
    ctx.restore();

    const maxF = 500;
    const maxT = 2;
    const scaleX = (W - 50) / maxT;
    const scaleY = 110 / maxF;
    const tW = time * scaleX;
    const fH = force * scaleY;

    ctx.fillStyle = 'rgba(34,211,238,0.15)';
    ctx.fillRect(30, 150 - fH, tW, fH);

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(30, 150);
    ctx.lineTo(30, 150 - fH);
    ctx.lineTo(30 + tW, 150 - fH);
    ctx.lineTo(30 + tW, 150);
    ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Impulse = ${impulse.toFixed(1)} N·s`, 30 + tW / 2, 150 - fH - 10);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${force}N`, 35, 150 - fH - 2);
    ctx.fillText(`${time}s`, 30 + tW + 5, 155);

    const deltaV = impulse / mass;
    ctx.fillStyle = 'rgba(74,222,128,0.6)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Δv = ${deltaV.toFixed(1)} m/s (m=${mass}kg)`, W - 10, 25);
  }, [force, time, impulse]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex justify-center">
        <div className="bg-black/60 rounded-2xl border border-brand-border p-2">
          <canvas ref={canvasRef} width={340} height={180} className="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">Force (N)</span><span className="font-mono text-cyan-400">{force}</span></div>
          <input type="range" min={10} max={500} step={10} value={force} onChange={e => setForce(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">Time (s)</span><span className="font-mono text-cyan-400">{time}</span></div>
          <input type="range" min={0.1} max={2} step={0.1} value={time} onChange={e => setTime(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        <div className="text-center">
          <span className="text-brand-accent font-bold text-lg font-mono">Impulse = F × t = {impulse.toFixed(1)} N·s</span>
          <div className="text-slate-400 text-sm mt-2">Shaded area = impulse = change in momentum</div>
          <div className="text-slate-400 text-sm">Δp = mΔv → Δv = {impulse.toFixed(1)}/{mass} = {(impulse / mass).toFixed(2)} m/s</div>
        </div>
      </div>
    </div>
  );
}

function GhanaContext() {
  const cards = [
    { id: 'circle', title: 'Kwame Nkrumah Circle Safety', icon: '🚗', color: '#f87171',
      context: 'At Kwame Nkrumah Interchange, one of Accra\'s busiest junctions, understanding momentum and impulse is critical. A 1500 kg car at 60 km/h (16.7 m/s) carries 25,000 kg·m/s of momentum. Stopping requires a large impulse applied over time.',
      calculation: 'F = Δp/Δt. With seatbelt (Δt ≈ 0.5s): F = 25000/0.5 = 50,000N. Without (Δt ≈ 0.01s): F = 2,500,000N — fatal.' },
    { id: 'seatbelt', title: 'Seatbelt Physics', icon: '🪢', color: '#22d3ee',
      context: 'Seatbelts and airbags increase the time of impact. By extending Δt from ~0.01s (hitting dashboard) to ~0.5s (belt stretch), the force on the body is reduced by a factor of 50. This is why Ghana\'s NRSA mandates seatbelt use.',
      calculation: 'Without belt: F = 70kg × 16.7m/s ÷ 0.01s = 117kN. With belt: F = 70 × 16.7 ÷ 0.5 = 2.3kN — survivable.' },
    { id: 'trotro', title: 'Trotro Safety', icon: '🚐', color: '#fbbf24',
      context: 'Ghana\'s trotros (minibuses) often carry 15+ passengers. In a crash at 40 km/h, the total momentum of unrestrained passengers creates enormous forces. Understanding impulse helps design safer vehicles.',
      calculation: '15 passengers × 70 kg × 11.1 m/s = 11,655 kg·m/s total momentum that must be safely absorbed.' },
  ];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-light text-white">Momentum & Safety in <span className="text-brand-accent font-medium">Ghana</span></h2>
      </div>
      {cards.map(card => (
        <div key={card.id} className="bg-slate-900/60 rounded-2xl border border-brand-border overflow-hidden">
          <div className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors" onClick={() => setExpanded(expanded === card.id ? null : card.id)}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-white font-bold">{card.title}</h3>
            </div>
          </div>
          <AnimatePresence>
            {expanded === card.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-800">
                <div className="p-5 space-y-3">
                  <p className="text-slate-300 text-sm">{card.context}</p>
                  <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-3">
                    <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">Calculation</span>
                    <p className="text-slate-300 text-sm font-mono mt-1">{card.calculation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function MomentumCollision() {
  const [viewMode, setViewMode] = useState<ViewMode>('elastic');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'elastic', label: 'Elastic', icon: <Zap size={14} /> },
    { key: 'inelastic', label: 'Inelastic', icon: <Circle size={14} /> },
    { key: 'impulse', label: 'Impulse', icon: <TrendingUp size={14} /> },
    { key: 'ghana', label: 'Ghana', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{icon} {label}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'elastic' && <ElasticCollision />}
            {viewMode === 'inelastic' && <InelasticCollision />}
            {viewMode === 'impulse' && <ImpulseMode />}
            {viewMode === 'ghana' && <GhanaContext />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Momentum & Collisions Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · </span>
Momentum is always conserved in collisions. For elastic: KE is also conserved. Impulse = F×t = Δp. Always draw diagrams and show working for WASSCE.
      </div>
    </div>
  );
}
