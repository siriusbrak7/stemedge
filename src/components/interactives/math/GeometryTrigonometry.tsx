import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Triangle, Ruler, Compass, Calculator, BookOpen, RotateCcw, Trophy, CheckCircle2, XCircle, HelpCircle, ChevronDown } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type Mode = 'explore' | 'soh-cah-toa' | 'unit-circle' | 'solve' | 'applications' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'gt-q1', question: 'In a right triangle, if the opposite side is 3 and the hypotenuse is 5, what is sin(θ)?', type: 'multiple-choice', options: ['3/5', '4/5', '3/4', '5/3'], correctAnswer: '3/5', explanation: 'sin(θ) = opposite / hypotenuse = 3/5.' },
  { id: 'gt-q2', question: 'What is cos(60°)?', type: 'multiple-choice', options: ['0.5', '0.866', '0.707', '1'], correctAnswer: '0.5', explanation: 'cos(60°) = 1/2 = 0.5.' },
  { id: 'gt-q3', question: 'A ladder 10 m long leans against a wall at 70° to the ground. How high up the wall does it reach?', type: 'multiple-choice', options: ['9.40 m', '8.66 m', '5.00 m', '7.66 m'], correctAnswer: '9.40 m', explanation: 'Height = 10 × sin(70°) ≈ 10 × 0.9397 ≈ 9.40 m.' },
  { id: 'gt-q4', question: 'In a right triangle with angle θ, which ratio equals tan(θ)?', type: 'multiple-choice', options: ['opposite/hypotenuse', 'adjacent/hypotenuse', 'opposite/adjacent', 'adjacent/opposite'], correctAnswer: 'opposite/adjacent', explanation: 'tan(θ) = opposite / adjacent (TOA).' },
  { id: 'gt-q5', question: 'If sin(θ) = 0.6 and the hypotenuse is 10, what is the length of the opposite side?', type: 'multiple-choice', options: ['6', '8', '4', '10'], correctAnswer: '6', explanation: 'opposite = sin(θ) × hypotenuse = 0.6 × 10 = 6.' },
  { id: 'gt-q6', question: 'What is the value of sin(30°)?', type: 'multiple-choice', options: ['0.5', '0.866', '0.707', '0'], correctAnswer: '0.5', explanation: 'sin(30°) = 1/2 = 0.5.' },
  { id: 'gt-q7', question: 'In SOH CAH TOA, what does CAH stand for?', type: 'multiple-choice', options: ['Cos = Adjacent / Hypotenuse', 'Cos = Adjacent / Hypotenuse', 'Sin = Adjacent / Hypotenuse', 'Tan = Adjacent / Hypotenuse'], correctAnswer: 'Cos = Adjacent / Hypotenuse', explanation: 'CAH: Cosine = Adjacent divided by Hypotenuse.' },
  { id: 'gt-q8', question: 'A WAEC exam question: Find the value of x in a right triangle where the opposite side is x, the angle is 45°, and the hypotenuse is 14 cm.', type: 'multiple-choice', options: ['9.90 cm', '7.00 cm', '12.12 cm', '14.00 cm'], correctAnswer: '9.90 cm', explanation: 'x = 14 × sin(45°) = 14 × 0.7071 ≈ 9.90 cm.' },
];

const APPLICATIONS = [
  { title: 'Flagpole Height at Independence Square', icon: '🇬🇭', desc: 'A student stands 20 m from the Black Star Gate flagpole. The angle of elevation to the top is 58°. Height = 20 × tan(58°) ≈ 32.0 m.', steps: ['1. Identify: angle = 58°, adjacent = 20 m, find opposite (height).', '2. Choose ratio: tan(58°) = opposite / adjacent.', '3. Solve: opposite = 20 × tan(58°) = 20 × 1.6003 ≈ 32.0 m.'] },
  { title: 'River Width at Adomi Bridge', icon: '🌉', desc: 'A surveyor stands at one bank and sights the opposite bank at 40° to the shoreline. She walks 50 m along the bank and sights again at 65°. Calculate the river width using trigonometry.', steps: ['1. Set up two right triangles sharing the river width (w).', '2. From position 1: w = 50 × tan(40°) ≈ 41.95 m.', '3. From position 2 (verification): w = d × tan(65°), where d is shorter distance.'] },
  { title: 'Kente Cloth Diagonal Pattern', icon: '🧵', desc: 'A kente weaver creates a diamond pattern where each side is 8 cm and the acute angle is 50°. Find the diagonals of the rhombus.', steps: ['1. Short diagonal d₁ = 2 × 8 × sin(50°/2) = 16 × sin(25°) ≈ 6.76 cm.', '2. Long diagonal d₂ = 2 × 8 × cos(50°/2) = 16 × cos(25°) ≈ 14.50 cm.', '3. The rhombus diagonals bisect each other at 90°.'] },
];

const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'explore', label: 'Explore', icon: <Triangle size={14} /> },
  { id: 'soh-cah-toa', label: 'SOH CAH TOA', icon: <Ruler size={14} /> },
  { id: 'unit-circle', label: 'Unit Circle', icon: <Compass size={14} /> },
  { id: 'solve', label: 'Solve', icon: <Calculator size={14} /> },
  { id: 'applications', label: 'Ghana Apps', icon: <BookOpen size={14} /> },
  { id: 'quiz', label: 'Quiz', icon: <Trophy size={14} /> },
];

export default function GeometryTrigonometry() {
  const [mode, setMode] = useState<Mode>('explore');

  return (
    <div className="flex min-h-[600px] w-full flex-col gap-4 rounded-[2rem] border border-slate-800 bg-[#06090f] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white">Geometry & <span className="text-brand-accent font-medium">Trigonometry</span></h2>
          <p className="text-xs text-slate-500 mt-1">SOH CAH TOA, unit circle, and real-world applications</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === m.id ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
            {m.icon}{m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'explore' && <ExploreMode key="explore" />}
        {mode === 'soh-cah-toa' && <SohCahToaMode key="soh" />}
        {mode === 'unit-circle' && <UnitCircleMode key="unit" />}
        {mode === 'solve' && <SolveMode key="solve" />}
        {mode === 'applications' && <ApplicationsMode key="apps" />}
        {mode === 'quiz' && <div key="quiz"><QuizMode questions={QUIZ_QUESTIONS} title="Geometry & Trigonometry Quiz" /></div>}
      </AnimatePresence>

      <div className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        SOH CAH TOA: sin = O/H, cos = A/H, tan = O/A. Sine rule: a/sinA = b/sinB. Cosine rule: a² = b² + c² − 2bc·cosA. Always draw a diagram first.
      </div>
    </div>
  );
}

function ExploreMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(35);
  const [hyp, setHyp] = useState(10);

  const opposite = hyp * Math.sin((angle * Math.PI) / 180);
  const adjacent = hyp * Math.cos((angle * Math.PI) / 180);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 500, H = 380;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const ox = 80, oy = 300;
    const scale = 22;
    const angleRad = (angle * Math.PI) / 180;
    const ax = adjacent * scale;
    const ay = opposite * scale;

    ctx.fillStyle = 'rgba(34,211,238,0.08)';
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + ax, oy);
    ctx.lineTo(ox + ax, oy - ay);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + ax, oy);
    ctx.lineTo(ox + ax, oy - ay);
    ctx.closePath();
    ctx.stroke();

    const arcR = 30;
    ctx.beginPath();
    ctx.arc(ox, oy, arcR, 0, -angleRad, true);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${angle}°`, ox + arcR + 16, oy - 8);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`adj = ${adjacent.toFixed(2)}`, ox + ax / 2, oy + 18);

    ctx.save();
    ctx.translate(ox + ax + 14, oy - ay / 2);
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(`opp = ${opposite.toFixed(2)}`, 0, 0);
    ctx.restore();

    const mx = ox + ax / 2;
    const my = oy - ay / 2;
    ctx.fillStyle = '#f472b6';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`hyp = ${hyp.toFixed(1)}`, mx - 30, my + 4);

    const rSq = opposite * opposite + adjacent * adjacent;
    const rDiff = Math.abs(rSq - hyp * hyp);
    ctx.fillStyle = rDiff < 0.1 ? '#22c55e' : '#ef4444';
    ctx.font = '10px monospace';
    ctx.fillText(`a² + b² = ${rSq.toFixed(2)}  |  c² = ${(hyp * hyp).toFixed(2)}  ${rDiff < 0.1 ? '✓' : '✗'}`, W / 2, H - 20);

    for (let gx = 0; gx <= W; gx += 44) { ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy <= H; gy += 44) { ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
  }, [angle, hyp, opposite, adjacent]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
        <canvas ref={canvasRef} width={500} height={380} className="w-full rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <SliderCtrl label="Angle θ" value={angle} min={5} max={85} step={1} unit="°" onChange={setAngle} color="accent-yellow-400" />
          <SliderCtrl label="Hypotenuse" value={hyp} min={3} max={15} step={0.5} unit="" onChange={setHyp} color="accent-cyan-400" />
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="sin(θ)" value={Math.sin(angle * Math.PI / 180).toFixed(4)} color="text-cyan-400" />
            <Metric label="cos(θ)" value={Math.cos(angle * Math.PI / 180).toFixed(4)} color="text-yellow-400" />
            <Metric label="tan(θ)" value={Math.tan(angle * Math.PI / 180).toFixed(4)} color="text-purple-400" />
            <Metric label="Opposite" value={opposite.toFixed(2)} color="text-pink-400" />
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">
          <strong className="text-white">Pythagorean Check:</strong> {adjacent.toFixed(2)}² + {opposite.toFixed(2)}² = {(adjacent * adjacent + opposite * opposite).toFixed(2)} ≈ {(hyp * hyp).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

function SohCahToaMode() {
  const [ratio, setRatio] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [angle, setAngle] = useState(30);

  const rad = (angle * Math.PI) / 180;
  const vals = { sin: Math.sin(rad), cos: Math.cos(rad), tan: angle === 90 ? Infinity : Math.tan(rad) };
  const labels = { sin: { f: 'O/H', full: 'opposite / hypotenuse', c: '#22d3ee' }, cos: { f: 'A/H', full: 'adjacent / hypotenuse', c: '#fbbf24' }, tan: { f: 'O/A', full: 'opposite / adjacent', c: '#a78bfa' } };

  const W = 500, H = 380;
  const ox = 100, oy = 320, scale = 20;
  const adj = 10, opp = 10 * Math.tan(rad);
  const hypLen = 10 / Math.cos(rad);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl">
          <polygon points={`${ox},${oy} ${ox + adj * scale},${oy} ${ox + adj * scale},${oy - Math.min(opp, 14) * scale}`}
            fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2.5" />
          <line x1={ox} y1={oy} x2={ox} y2={oy - 20} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

          {ratio === 'sin' && <line x1={ox + adj * scale} y1={oy} x2={ox + adj * scale} y2={oy - Math.min(opp, 14) * scale} stroke="#22d3ee" strokeWidth="4" />}
          {ratio === 'cos' && <line x1={ox} y1={oy} x2={ox + adj * scale} y2={oy} stroke="#fbbf24" strokeWidth="4" />}
          {ratio === 'tan' && <>
            <line x1={ox + adj * scale} y1={oy} x2={ox + adj * scale} y2={oy - Math.min(opp, 14) * scale} stroke="#a78bfa" strokeWidth="3" />
            <line x1={ox} y1={oy} x2={ox + adj * scale} y2={oy} stroke="#fbbf24" strokeWidth="3" opacity="0.5" />
          </>}

          <path d={`M ${ox + 35} ${oy} A 35 35 0 0 0 ${ox + 35 * Math.cos(rad)} ${oy - 35 * Math.sin(rad)}`}
            fill="none" stroke="#fbbf24" strokeWidth="2" />
          <text x={ox + 50} y={oy - 10} fill="#fbbf24" fontSize="12" fontWeight="bold">{angle}°</text>

          {ratio === 'sin' && <text x={ox + adj * scale + 14} y={oy - Math.min(opp, 14) * scale / 2} fill="#22d3ee" fontSize="11" fontWeight="bold">OPP</text>}
          {ratio === 'sin' && <text x={ox + adj * scale / 2 - 10} y={oy + 20} fill="#475569" fontSize="10">ADJ</text>}
          {ratio === 'cos' && <text x={ox + adj * scale / 2 - 10} y={oy + 20} fill="#fbbf24" fontSize="11" fontWeight="bold">ADJ</text>}
          {ratio === 'tan' && <>
            <text x={ox + adj * scale + 14} y={oy - Math.min(opp, 14) * scale / 2} fill="#a78bfa" fontSize="11" fontWeight="bold">OPP</text>
            <text x={ox + adj * scale / 2 - 10} y={oy + 20} fill="#fbbf24" fontSize="11">ADJ</text>
          </>}

          <text x={W / 2} y={30} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
            {ratio}({angle}°) = {labels[ratio].f} = {vals[ratio] === Infinity ? '∞' : vals[ratio].toFixed(4)}
          </text>
        </svg>
      </div>
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Select Ratio</div>
          {(['sin', 'cos', 'tan'] as const).map(r => (
            <button key={r} onClick={() => setRatio(r)}
              className={`w-full mb-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-left transition-all ${
                ratio === r ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {r} — {labels[r].full}
            </button>
          ))}
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <SliderCtrl label="Angle θ" value={angle} min={1} max={89} step={1} unit="°" onChange={setAngle} color="accent-yellow-400" />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {(['sin', 'cos', 'tan'] as const).map(r => (
              <div key={r} className={`rounded-xl border p-3 text-center ${ratio === r ? 'border-brand-accent/40 bg-brand-accent/5' : 'border-slate-800 bg-black/30'}`}>
                <div className="text-[10px] text-slate-500 uppercase">{r}</div>
                <div className="text-lg font-mono font-bold" style={{ color: labels[r].c }}>{vals[r] === Infinity ? '∞' : vals[r].toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Special Angles</div>
          <table className="w-full text-xs text-center">
            <thead className="text-slate-500"><tr><th>θ</th><th>sin</th><th>cos</th><th>tan</th></tr></thead>
            <tbody className="text-slate-300">
              {[0, 30, 45, 60, 90].map(a => (
                <tr key={a} className={a === angle ? 'text-brand-accent font-bold' : ''}>
                  <td>{a}°</td><td>{a === 90 ? '1' : Math.sin(a * Math.PI / 180).toFixed(3)}</td>
                  <td>{a === 90 ? '0' : Math.cos(a * Math.PI / 180).toFixed(3)}</td>
                  <td>{a === 90 ? '∞' : a === 0 ? '0' : Math.tan(a * Math.PI / 180).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UnitCircleMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 420, H = 420;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, R = 150;
    const rad = (angle * Math.PI) / 180;
    const px = cx + R * Math.cos(rad);
    const py = cy - R * Math.sin(rad);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let a = 0; a < 360; a += 15) {
      const ar = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx + R * Math.cos(ar), cy - R * Math.sin(ar));
      ctx.lineTo(cx + (R + 8) * Math.cos(ar), cy - (R + 8) * Math.sin(ar));
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - R - 30, cy); ctx.lineTo(cx + R + 30, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - R - 30); ctx.lineTo(cx, cy + R + 30); ctx.stroke();

    ctx.strokeStyle = 'rgba(34,211,238,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(250,204,21,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, -rad, true);
    ctx.stroke();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`cos = ${Math.cos(rad).toFixed(3)}`, (cx + px) / 2, cy + 18);

    ctx.fillStyle = '#a78bfa';
    ctx.fillText(`sin = ${Math.sin(rad).toFixed(3)}`, px + 40, (cy + py) / 2);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`(${Math.cos(rad).toFixed(2)}, ${Math.sin(rad).toFixed(2)})`, px, py - 14);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '11px monospace';
    ctx.fillText(`${angle}°`, cx + 42, cy - 6);

    [{ a: 0, l: '0°' }, { a: 90, l: '90°' }, { a: 180, l: '180°' }, { a: 270, l: '270°' }].forEach(({ a, l }) => {
      const ar = (a * Math.PI) / 180;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace';
      ctx.fillText(l, cx + (R + 18) * Math.cos(ar), cy - (R + 18) * Math.sin(ar) + 4);
    });
  }, [angle]);

  useEffect(() => { draw(); }, [draw]);

  const rad = (angle * Math.PI) / 180;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr,280px]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
        <canvas ref={canvasRef} width={420} height={420} className="w-full rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <SliderCtrl label="Angle" value={angle} min={0} max={360} step={5} unit="°" onChange={setAngle} color="accent-yellow-400" />
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="cos(θ)" value={Math.cos(rad).toFixed(4)} color="text-yellow-400" />
            <Metric label="sin(θ)" value={Math.sin(rad).toFixed(4)} color="text-purple-400" />
            <Metric label="tan(θ)" value={angle % 180 === 90 ? 'undefined' : Math.tan(rad).toFixed(4)} color="text-cyan-400" />
            <Metric label="Radius" value="1.0000" color="text-pink-400" />
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">
          <strong className="text-white">Unit Circle:</strong> A circle of radius 1. The x-coordinate equals cos(θ), the y-coordinate equals sin(θ). Every point on the circle is (cos θ, sin θ).
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Quadrant Signs</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 text-green-300">Q1: sin+ cos+ tan+</div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 text-blue-300">Q2: sin+ cos− tan−</div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-red-300">Q3: sin− cos− tan+</div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2 text-yellow-300">Q4: sin− cos+ tan−</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SolveMode() {
  type SolveScenario = 'find-side' | 'find-angle' | 'find-height';
  const [scenario, setScenario] = useState<SolveScenario>('find-side');
  const [given1, setGiven1] = useState(30);
  const [given2, setGiven2] = useState(10);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [score, setScore] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);

  const rad = (given1 * Math.PI) / 180;
  let correctAnswer: number;
  let questionText: string;

  if (scenario === 'find-side') {
    correctAnswer = given2 * Math.sin(rad);
    questionText = `Find the opposite side: angle = ${given1}°, hypotenuse = ${given2}.`;
  } else if (scenario === 'find-angle') {
    correctAnswer = given1;
    questionText = `Given opposite = ${(given2 * Math.sin(rad)).toFixed(2)} and hypotenuse = ${given2}, what is the angle?`;
  } else {
    correctAnswer = given2 * Math.tan(rad);
    questionText = `Find the height: angle of elevation = ${given1}°, distance = ${given2} m.`;
  }

  const check = () => {
    const num = parseFloat(userAnswer);
    if (isNaN(num)) return;
    const diff = Math.abs(num - correctAnswer);
    if (diff < correctAnswer * 0.05 + 0.5) {
      setFeedback({ correct: true, msg: `Correct! Answer = ${correctAnswer.toFixed(2)}` });
      setScore(s => s + 1);
    } else {
      setFeedback({ correct: false, msg: `Not quite. Answer = ${correctAnswer.toFixed(2)}. Use ${scenario === 'find-side' ? 'sin(θ) × hyp' : scenario === 'find-angle' ? 'sin⁻¹(O/H)' : 'tan(θ) × distance'}` });
    }
  };

  const next = () => {
    setGiven1(Math.floor(Math.random() * 60) + 10);
    setGiven2(Math.floor(Math.random() * 15) + 5);
    setUserAnswer('');
    setFeedback(null);
    setQuestionNum(n => n + 1);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['find-side', 'find-angle', 'find-height'] as SolveScenario[]).map(s => (
              <button key={s} onClick={() => { setScenario(s); setFeedback(null); setUserAnswer(''); }}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${scenario === s ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400'}`}>
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono text-sm font-bold">{score}</span>
          </div>
        </div>

        <div className="bg-black/30 border border-slate-800 rounded-xl p-5">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Question {questionNum}</div>
          <p className="text-white text-sm font-medium">{questionText}</p>
        </div>

        <div className="flex gap-3">
          <input type="number" step="0.01" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
            placeholder="Enter your answer..." disabled={!!feedback}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-brand-accent outline-none disabled:opacity-50" />
          <button onClick={check} disabled={!!feedback || !userAnswer}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm disabled:opacity-30 hover:bg-white transition-all">
            Check
          </button>
        </div>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 text-sm ${feedback.correct ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            {feedback.correct ? <CheckCircle2 size={16} className="inline mr-2" /> : <XCircle size={16} className="inline mr-2" />}
            {feedback.msg}
          </motion.div>
        )}

        {feedback && (
          <button onClick={next} className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all">
            Next Question →
          </button>
        )}
      </div>

      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Formula Reference</div>
        <div className="space-y-3 text-sm">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-cyan-300">
            <strong>SOH:</strong> sin(θ) = opposite / hypotenuse
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-yellow-300">
            <strong>CAH:</strong> cos(θ) = adjacent / hypotenuse
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-purple-300">
            <strong>TOA:</strong> tan(θ) = opposite / adjacent
          </div>
          <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 text-pink-300">
            <strong>Inverse:</strong> θ = sin⁻¹(O/H) = cos⁻¹(A/H) = tan⁻¹(O/A)
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsMode() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white">Trigonometry in Ghana</h3>
        <p className="text-xs text-slate-500">Real-world applications from West African contexts</p>
      </div>
      {APPLICATIONS.map((app, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 overflow-hidden">
          <button onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full p-5 text-left flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{app.icon}</span>
              <div>
                <div className="text-sm font-bold text-white">{app.title}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">{app.desc}</div>
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${expanded === i ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-800">
                <div className="p-5 space-y-2">
                  <p className="text-sm text-slate-300">{app.desc}</p>
                  {app.steps.map((step, si) => (
                    <motion.div key={si} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.15 }}
                      className="text-sm text-slate-400 bg-black/30 rounded-xl p-3 font-mono">
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function SliderCtrl({ label, value, min, max, step, unit, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void; color: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className={`font-mono text-white`}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} className={`w-full ${color}`} />
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
