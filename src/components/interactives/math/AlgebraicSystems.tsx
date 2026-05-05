import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, GitBranch, Grid3x3, BookOpen, Trophy, CheckCircle2, XCircle, RotateCcw, ChevronDown, Target, Shuffle } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type Mode = 'balance' | 'substitution' | 'elimination' | 'matrix' | 'applications' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'as-q1', question: 'Solve: x + y = 7 and x − y = 3. What is x?', type: 'multiple-choice', options: ['5', '4', '3', '6'], correctAnswer: '5', explanation: 'Adding equations: 2x = 10, so x = 5.' },
  { id: 'as-q2', question: 'Solve: 2x + y = 5 and x − y = 1. What is y?', type: 'multiple-choice', options: ['1', '2', '3', '-1'], correctAnswer: '1', explanation: 'Add equations: 3x = 6 → x = 2. Then y = x − 1 = 1.' },
  { id: 'as-q3', question: 'In the substitution method, if x = 2y and 3x + y = 14, what is y?', type: 'multiple-choice', options: ['2', '3', '4', '1'], correctAnswer: '2', explanation: 'Substitute: 3(2y) + y = 14 → 7y = 14 → y = 2.' },
  { id: 'as-q4', question: 'How many solutions does a system of two parallel lines have?', type: 'multiple-choice', options: ['0', '1', '2', 'Infinite'], correctAnswer: '0', explanation: 'Parallel lines never intersect, so there are no solutions (inconsistent system).' },
  { id: 'as-q5', question: 'If a system has infinitely many solutions, the lines are:', type: 'multiple-choice', options: ['Parallel', 'Coincident (overlapping)', 'Perpendicular', 'Skew'], correctAnswer: 'Coincident (overlapping)', explanation: 'When two equations represent the same line, every point is a solution (dependent system).' },
  { id: 'as-q6', question: 'A WAEC question: The sum of two numbers is 15 and their difference is 3. What is the larger number?', type: 'multiple-choice', options: ['9', '8', '10', '6'], correctAnswer: '9', explanation: 'x + y = 15, x − y = 3. Adding: 2x = 18, x = 9.' },
  { id: 'as-q7', question: 'In matrix form, the system 2x + 3y = 8, x − y = 1 is represented as:', type: 'multiple-choice', options: ['[[2,3],[1,-1]] × [x,y] = [8,1]', '[[2,1],[3,-1]] × [x,y] = [8,1]', '[[2,3],[1,-1]] × [8,1] = [x,y]', 'None of these'], correctAnswer: '[[2,3],[1,-1]] × [x,y] = [8,1]', explanation: 'Coefficient matrix × variable vector = constant vector.' },
  { id: 'as-q8', question: 'When using elimination, what must be true before adding/subtracting equations?', type: 'multiple-choice', options: ['One variable must have equal (or opposite) coefficients', 'Both variables must have the same coefficient', 'The constants must be equal', 'The equations must have integer coefficients'], correctAnswer: 'One variable must have equal (or opposite) coefficients', explanation: 'Elimination requires matching coefficients so adding/subtracting cancels one variable.' },
];

const APPS = [
  { title: 'Market Pricing in Makola', icon: '🏪', desc: 'At Makola Market in Accra, a bundle of plantain costs x cedis and a tuber of yam costs y cedis. If 3 bundles + 2 tubers cost 45 GHS and 1 bundle + 4 tubers cost 38 GHS, find the price of each.', steps: ['1. Let x = plantain bundle price, y = yam tuber price.', '2. System: 3x + 2y = 45 and x + 4y = 38.', '3. Multiply eq.2 by 3: 3x + 12y = 114.', '4. Subtract eq.1: 10y = 69 → y = 6.9 GHS.', '5. Substitute: x + 4(6.9) = 38 → x = 10.4 GHS.'] },
  { title: 'Bus Fare Calculation', icon: '🚌', desc: 'A trotro from Accra to Kumasi charges adults x GHS and children y GHS. A family of 2 adults + 3 children pays 85 GHS. Another group of 3 adults + 1 child pays 78 GHS.', steps: ['1. System: 2x + 3y = 85 and 3x + y = 78.', '2. From eq.2: y = 78 − 3x.', '3. Substitute: 2x + 3(78 − 3x) = 85.', '4. 2x + 234 − 9x = 85 → −7x = −149 → x ≈ 21.3 GHS.', '5. y = 78 − 3(21.3) = 14.1 GHS.'] },
  { title: 'Construction Mix Ratio', icon: '🏗️', desc: 'A Tema construction site mixes cement (x bags) and sand (y loads). 2 bags of cement + 5 loads of sand cover 40 m². 4 bags + 3 loads cover 50 m². Find the coverage per unit.', steps: ['1. System: 2x + 5y = 40 and 4x + 3y = 50.', '2. Multiply eq.1 by 2: 4x + 10y = 80.', '3. Subtract eq.2: 7y = 30 → y ≈ 4.29 m²/load.', '4. 2x + 5(4.29) = 40 → 2x = 18.55 → x ≈ 9.28 m²/bag.'] },
];

const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'balance', label: 'Balance', icon: <Scale size={14} /> },
  { id: 'substitution', label: 'Substitution', icon: <GitBranch size={14} /> },
  { id: 'elimination', label: 'Elimination', icon: <Target size={14} /> },
  { id: 'matrix', label: 'Matrix', icon: <Grid3x3 size={14} /> },
  { id: 'applications', label: 'Ghana Apps', icon: <BookOpen size={14} /> },
  { id: 'quiz', label: 'Quiz', icon: <Trophy size={14} /> },
];

export default function AlgebraicSystems() {
  const [mode, setMode] = useState<Mode>('balance');

  return (
    <div className="flex min-h-[600px] w-full flex-col gap-4 rounded-[2rem] border border-slate-800 bg-[#06090f] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white">Algebraic <span className="text-brand-accent font-medium">Systems</span></h2>
          <p className="text-xs text-slate-500 mt-1">Simultaneous equations, substitution, elimination, and matrix methods</p>
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
        {mode === 'balance' && <BalanceMode key="bal" />}
        {mode === 'substitution' && <SubstitutionMode key="sub" />}
        {mode === 'elimination' && <EliminationMode key="elim" />}
        {mode === 'matrix' && <MatrixMode key="mat" />}
        {mode === 'applications' && <ApplicationsMode key="apps" />}
        {mode === 'quiz' && <div key="quiz"><QuizMode questions={QUIZ_QUESTIONS} title="Algebraic Systems Quiz" /></div>}
      </AnimatePresence>

      <div className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        Three methods for simultaneous equations: (1) Substitution — express one variable in terms of another, (2) Elimination — add/subtract to cancel a variable, (3) Graphical — find the intersection point. Always verify by substituting back.
      </div>
    </div>
  );
}

function BalanceMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a1, setA1] = useState(2);
  const [b1, setB1] = useState(3);
  const [c1, setC1] = useState(8);
  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);

  const det = a1 * b2 - a2 * b1;
  const solX = det !== 0 ? (c1 * b2 - c2 * b1) / det : null;
  const solY = det !== 0 ? (a1 * c2 - a2 * c1) / det : null;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 500, H = 400;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 25) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy <= H; gy += 25) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    const ox = W / 2, oy = H / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px monospace';
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue;
      const sx = ox + i * 25;
      ctx.fillText(`${i}`, sx - 4, oy + 14);
      const sy = oy - i * 25;
      ctx.fillText(`${i}`, ox + 6, sy + 3);
    }

    const scale = 25;
    const drawLine = (a: number, b: number, c: number, color: string, label: string) => {
      if (Math.abs(b) < 0.001) {
        const xVal = c / a;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ox + xVal * scale, 0);
        ctx.lineTo(ox + xVal * scale, H);
        ctx.stroke();
      } else {
        const x1 = -10, y1 = (c - a * x1) / b;
        const x2 = 10, y2 = (c - a * x2) / b;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ox + x1 * scale, oy - y1 * scale);
        ctx.lineTo(ox + x2 * scale, oy - y2 * scale);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, 14, 14 + (color === '#22d3ee' ? 0 : 16));
    };

    drawLine(a1, b1, c1, '#22d3ee', `L1: ${a1}x + ${b1}y = ${c1}`);
    drawLine(a2, b2, c2, '#f59e0b', `L2: ${a2}x + ${b2}y = ${c2}`);

    if (solX !== null && solY !== null && isFinite(solX) && isFinite(solY)) {
      const px = ox + solX * scale;
      const py = oy - solY * scale;
      if (px > 0 && px < W && py > 0 && py < H) {
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`(${solX.toFixed(2)}, ${solY.toFixed(2)})`, px + 12, py - 8);
      }
    }

    ctx.textAlign = 'left';
  }, [a1, b1, c1, a2, b2, c2, solX, solY]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
        <canvas ref={canvasRef} width={500} height={400} className="w-full rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-2">Equation 1</div>
          <SliderCtrl label="a₁" value={a1} min={-5} max={5} step={1} onChange={setA1} />
          <SliderCtrl label="b₁" value={b1} min={-5} max={5} step={1} onChange={setB1} />
          <SliderCtrl label="c₁" value={c1} min={-10} max={10} step={1} onChange={setC1} />
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">Equation 2</div>
          <SliderCtrl label="a₂" value={a2} min={-5} max={5} step={1} onChange={setA2} />
          <SliderCtrl label="b₂" value={b2} min={-5} max={5} step={1} onChange={setB2} />
          <SliderCtrl label="c₂" value={c2} min={-10} max={10} step={1} onChange={setC2} />
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="x" value={solX !== null && isFinite(solX) ? solX.toFixed(3) : det === 0 ? '∞/none' : '?'} color={det !== 0 ? 'text-green-400' : 'text-red-400'} />
            <Metric label="y" value={solY !== null && isFinite(solY) ? solY.toFixed(3) : det === 0 ? '∞/none' : '?'} color={det !== 0 ? 'text-green-400' : 'text-red-400'} />
          </div>
          <div className={`mt-3 text-xs rounded-xl p-3 ${det === 0 ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300'}`}>
            {det === 0 ? 'Lines are parallel or coincident (det = 0)' : `Unique solution (det = ${det})`}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubstitutionMode() {
  const [eq1a, setEq1a] = useState(2);
  const [eq1b, setEq1b] = useState(1);
  const [eq1c, setEq1c] = useState(5);
  const [eq2a, setEq2a] = useState(1);
  const [eq2b, setEq2b] = useState(-1);
  const [eq2c, setEq2c] = useState(1);
  const [revealedStep, setRevealedStep] = useState(0);

  const steps = useMemo(() => {
    const s: string[] = [];
    s.push(`Step 1: From equation 2, express x in terms of y:`);
    s.push(`  x = (${eq2c} + ${-eq2b}y) / ${eq2a} = ${(eq2c / eq2a).toFixed(2)} + ${(-eq2b / eq2a).toFixed(2)}y`);
    s.push(`Step 2: Substitute into equation 1:`);
    s.push(`  ${eq1a}(${(eq2c / eq2a).toFixed(2)} + ${(-eq2b / eq2a).toFixed(2)}y) + ${eq1b}y = ${eq1c}`);
    const combinedA = eq1a * (-eq2b / eq2a) + eq1b;
    const combinedC = eq1c - eq1a * (eq2c / eq2a);
    s.push(`  ${combinedA.toFixed(2)}y = ${combinedC.toFixed(2)}`);
    const yVal = combinedC / combinedA;
    s.push(`Step 3: Solve for y: y = ${yVal.toFixed(4)}`);
    const xVal = eq2c / eq2a + (-eq2b / eq2a) * yVal;
    s.push(`Step 4: Back-substitute: x = ${xVal.toFixed(4)}`);
    s.push(`Solution: x = ${xVal.toFixed(3)}, y = ${yVal.toFixed(3)}`);
    s.push(`Verify: ${eq1a}(${xVal.toFixed(2)}) + ${eq1b}(${yVal.toFixed(2)}) = ${(eq1a * xVal + eq1b * yVal).toFixed(2)} ≈ ${eq1c} ✓`);
    return s;
  }, [eq1a, eq1b, eq1c, eq2a, eq2b, eq2c]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 space-y-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-2">Step-by-Step Solution</div>
        {steps.map((step, i) => (
          <motion.div key={i} initial={i < revealedStep ? {} : { opacity: 0, x: -20 }}
            animate={i <= revealedStep ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: i * 0.05 }}
            className={`p-3 rounded-xl text-sm font-mono ${i <= revealedStep ? 'bg-black/30 text-slate-300 border border-slate-800' : 'bg-black/10 text-slate-700'}`}>
            {step}
          </motion.div>
        ))}
        <div className="flex gap-2">
          {revealedStep < steps.length - 1 && (
            <button onClick={() => setRevealedStep(s => Math.min(s + 1, steps.length - 1))}
              className="px-5 py-2 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all">
              Next Step
            </button>
          )}
          <button onClick={() => setRevealedStep(0)}
            className="px-5 py-2 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-all flex items-center gap-2">
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-2">Equation 1</div>
          <p className="text-white text-sm font-mono mb-2">{eq1a}x + {eq1b}y = {eq1c}</p>
          <SliderCtrl label="a" value={eq1a} min={-5} max={5} step={1} onChange={v => { setEq1a(v); setRevealedStep(0); }} />
          <SliderCtrl label="b" value={eq1b} min={-5} max={5} step={1} onChange={v => { setEq1b(v); setRevealedStep(0); }} />
          <SliderCtrl label="c" value={eq1c} min={-10} max={10} step={1} onChange={v => { setEq1c(v); setRevealedStep(0); }} />
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">Equation 2</div>
          <p className="text-white text-sm font-mono mb-2">{eq2a}x + {eq2b === 0 ? '' : eq2b > 0 ? '+ ' : '− '}{Math.abs(eq2b)}y = {eq2c}</p>
          <SliderCtrl label="a" value={eq2a} min={-5} max={5} step={1} onChange={v => { setEq2a(v); setRevealedStep(0); }} />
          <SliderCtrl label="b" value={eq2b} min={-5} max={5} step={1} onChange={v => { setEq2b(v); setRevealedStep(0); }} />
          <SliderCtrl label="c" value={eq2c} min={-10} max={10} step={1} onChange={v => { setEq2c(v); setRevealedStep(0); }} />
        </div>
      </div>
    </div>
  );
}

function EliminationMode() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState(() => genElimQuestion());
  const [userX, setUserX] = useState('');
  const [userY, setUserY] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  function genElimQuestion() {
    const x = Math.floor(Math.random() * 9) - 4;
    const y = Math.floor(Math.random() * 9) - 4;
    const a1 = Math.floor(Math.random() * 4) + 1;
    const b1 = Math.floor(Math.random() * 4) + 1;
    const c1 = a1 * x + b1 * y;
    const a2 = Math.floor(Math.random() * 4) + 1;
    const b2 = Math.floor(Math.random() * 4) + 1;
    const c2 = a2 * x + b2 * y;
    return { x, y, a1, b1, c1, a2, b2, c2 };
  }

  const check = () => {
    const ux = parseFloat(userX);
    const uy = parseFloat(userY);
    if (isNaN(ux) || isNaN(uy)) return;
    if (Math.abs(ux - question.x) < 0.1 && Math.abs(uy - question.y) < 0.1) {
      setFeedback({ correct: true, msg: `Correct! x = ${question.x}, y = ${question.y}` });
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setFeedback({ correct: false, msg: `Not quite. x = ${question.x}, y = ${question.y}. Try eliminating one variable first.` });
      setStreak(0);
    }
  };

  const next = () => {
    setQuestion(genElimQuestion());
    setUserX(''); setUserY(''); setFeedback(null);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Elimination Practice</div>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono text-sm font-bold">{score}</span>
            {streak >= 2 && <span className="text-orange-400 text-xs font-bold">🔥 {streak}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-cyan-300 font-mono text-sm">
            {question.a1}x + {question.b1}y = {question.c1}
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 font-mono text-sm">
            {question.a2}x + {question.b2}y = {question.c2}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">x =</div>
            <input type="number" step="0.1" value={userX} onChange={e => setUserX(e.target.value)}
              disabled={!!feedback} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm disabled:opacity-50" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">y =</div>
            <input type="number" step="0.1" value={userY} onChange={e => setUserY(e.target.value)}
              disabled={!!feedback} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm disabled:opacity-50" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={check} disabled={!!feedback || !userX || !userY}
            className="px-6 py-2 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-30 hover:bg-white transition-all">Check</button>
          <button onClick={next}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-all flex items-center gap-2">
            <Shuffle size={12} /> Skip
          </button>
        </div>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 text-sm ${feedback.correct ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            {feedback.correct ? <CheckCircle2 size={16} className="inline mr-2" /> : <XCircle size={16} className="inline mr-2" />}
            {feedback.msg}
            <button onClick={next} className="block mx-auto mt-3 text-xs underline opacity-70 hover:opacity-100">Next Question</button>
          </motion.div>
        )}
      </div>

      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Elimination Method</div>
        <div className="space-y-3 text-xs text-slate-400">
          <div className="bg-black/30 rounded-xl p-3"><strong className="text-white">1.</strong> Multiply one or both equations so one variable has equal/opposite coefficients.</div>
          <div className="bg-black/30 rounded-xl p-3"><strong className="text-white">2.</strong> Add or subtract the equations to eliminate that variable.</div>
          <div className="bg-black/30 rounded-xl p-3"><strong className="text-white">3.</strong> Solve the resulting single-variable equation.</div>
          <div className="bg-black/30 rounded-xl p-3"><strong className="text-white">4.</strong> Back-substitute to find the other variable.</div>
          <div className="bg-black/30 rounded-xl p-3"><strong className="text-white">5.</strong> Verify by substituting into BOTH original equations.</div>
        </div>
        <div className="mt-4 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
          <strong className="text-brand-accent">Tip:</strong> Choose the variable whose coefficients have the smallest LCM to keep arithmetic simple.
        </div>
      </div>
    </div>
  );
}

function MatrixMode() {
  const [a1, setA1] = useState(2);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);

  const det = a1 * b2 - a2 * b1;
  const solX = det !== 0 ? (c1 * b2 - c2 * b1) / det : null;
  const solY = det !== 0 ? (a1 * c2 - a2 * c1) / det : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 space-y-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-2">Cramer's Rule</div>

        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="bg-black/30 border border-slate-800 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase mb-2">Coefficient Matrix A</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-center">
              <span className="text-cyan-400">{a1}</span><span className="text-cyan-400">{b1}</span>
              <span className="text-amber-400">{a2}</span><span className="text-amber-400">{b2}</span>
            </div>
          </div>
          <div className="text-2xl text-slate-500">×</div>
          <div className="bg-black/30 border border-slate-800 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase mb-2">Variables</div>
            <div className="grid gap-1 text-center">
              <div className="text-white">x</div>
              <div className="text-white">y</div>
            </div>
          </div>
          <div className="text-2xl text-slate-500">=</div>
          <div className="bg-black/30 border border-slate-800 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase mb-2">Constants</div>
            <div className="grid gap-1 text-center">
              <div className="text-green-400">{c1}</div>
              <div className="text-green-400">{c2}</div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-sm">
          <div className="text-[10px] text-slate-500 uppercase mb-2">Determinants</div>
          <div className="text-cyan-400">det(A) = ({a1})({b2}) − ({a2})({b1}) = <span className="text-white font-bold">{det}</span></div>
          <div className="text-amber-400">det(Ax) = ({c1})({b2}) − ({c2})({b1}) = <span className="text-white font-bold">{c1 * b2 - c2 * b1}</span></div>
          <div className="text-purple-400">det(Ay) = ({a1})({c2}) − ({a2})({c1}) = <span className="text-white font-bold">{a1 * c2 - a2 * c1}</span></div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 font-mono text-sm">
          <div className="text-[10px] text-green-400 uppercase mb-2">Solution (Cramer's Rule)</div>
          {det !== 0 ? (
            <>
              <div className="text-white">x = det(Ax) / det(A) = {solX!.toFixed(4)}</div>
              <div className="text-white">y = det(Ay) / det(A) = {solY!.toFixed(4)}</div>
            </>
          ) : (
            <div className="text-red-400">det(A) = 0 → No unique solution (parallel or coincident lines)</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <SliderCtrl label="a₁" value={a1} min={-5} max={5} step={1} onChange={setA1} />
          <SliderCtrl label="b₁" value={b1} min={-5} max={5} step={1} onChange={setB1} />
          <SliderCtrl label="c₁" value={c1} min={-10} max={10} step={1} onChange={setC1} />
          <SliderCtrl label="a₂" value={a2} min={-5} max={5} step={1} onChange={setA2} />
          <SliderCtrl label="b₂" value={b2} min={-5} max={5} step={1} onChange={setB2} />
          <SliderCtrl label="c₂" value={c2} min={-10} max={10} step={1} onChange={setC2} />
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">
          <strong className="text-white">Cramer's Rule:</strong> For a system Ax = b, xᵢ = det(Aᵢ) / det(A), where Aᵢ is A with column i replaced by b. Only works when det(A) ≠ 0.
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
        <h3 className="text-lg font-medium text-white">Algebraic Systems in Ghana</h3>
        <p className="text-xs text-slate-500">Simultaneous equations in everyday contexts</p>
      </div>
      {APPS.map((app, i) => (
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
                    <motion.div key={si} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.12 }}
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

function SliderCtrl({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} className="w-full accent-cyan-400" />
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
