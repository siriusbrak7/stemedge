import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Layers, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { INEQUALITIES_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface Inequality {
  a: number;
  b: number;
  c: number;
  sign: '<' | '>' | '<=' | '>=';
  label: string;
  color: string;
}

const INEQ_SETS: Record<number, Record<number, Inequality[]>> = {
  0: {
    2: [
      { a: 3, b: 2, c: 18, sign: '<=', label: '3x + 2y ≤ 18', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 8, sign: '<=', label: 'x + y ≤ 8', color: 'rgba(249,115,22,0.15)' },
    ],
    3: [
      { a: 3, b: 2, c: 18, sign: '<=', label: '3x + 2y ≤ 18 (land)', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 8, sign: '<=', label: 'x + y ≤ 8 (labour)', color: 'rgba(249,115,22,0.15)' },
      { a: 2, b: 1, c: 10, sign: '<=', label: '2x + y ≤ 10 (capital)', color: 'rgba(168,85,247,0.15)' },
    ],
    4: [
      { a: 3, b: 2, c: 18, sign: '<=', label: '3x + 2y ≤ 18', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 8, sign: '<=', label: 'x + y ≤ 8', color: 'rgba(249,115,22,0.15)' },
      { a: 2, b: 1, c: 10, sign: '<=', label: '2x + y ≤ 10', color: 'rgba(168,85,247,0.15)' },
      { a: 0, b: 1, c: 2, sign: '>=', label: 'y ≥ 2 (min coffee)', color: 'rgba(250,204,21,0.15)' },
    ],
    5: [
      { a: 3, b: 2, c: 18, sign: '<=', label: '3x + 2y ≤ 18', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 8, sign: '<=', label: 'x + y ≤ 8', color: 'rgba(249,115,22,0.15)' },
      { a: 2, b: 1, c: 10, sign: '<=', label: '2x + y ≤ 10', color: 'rgba(168,85,247,0.15)' },
      { a: 0, b: 1, c: 2, sign: '>=', label: 'y ≥ 2', color: 'rgba(250,204,21,0.15)' },
      { a: 1, b: 0, c: 1, sign: '>=', label: 'x ≥ 1', color: 'rgba(163,230,53,0.15)' },
    ],
  },
  1: {
    2: [
      { a: 2, b: 5, c: 20, sign: '<=', label: '2x + 5y ≤ 20 (cost)', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 6, sign: '<=', label: 'x + y ≤ 6 (total items)', color: 'rgba(249,115,22,0.15)' },
    ],
    3: [
      { a: 2, b: 5, c: 20, sign: '<=', label: '2x + 5y ≤ 20 (budget)', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 6, sign: '<=', label: 'x + y ≤ 6', color: 'rgba(249,115,22,0.15)' },
      { a: 0, b: 1, c: 1, sign: '>=', label: 'y ≥ 1 (min fruit)', color: 'rgba(168,85,247,0.15)' },
    ],
    4: [
      { a: 2, b: 5, c: 20, sign: '<=', label: '2x + 5y ≤ 20 (budget)', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 6, sign: '<=', label: 'x + y ≤ 6', color: 'rgba(249,115,22,0.15)' },
      { a: 0, b: 1, c: 1, sign: '>=', label: 'y ≥ 1', color: 'rgba(168,85,247,0.15)' },
      { a: 1, b: 0, c: 1, sign: '>=', label: 'x ≥ 1 (min protein)', color: 'rgba(250,204,21,0.15)' },
    ],
    5: [
      { a: 2, b: 5, c: 20, sign: '<=', label: '2x + 5y ≤ 20', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 1, c: 6, sign: '<=', label: 'x + y ≤ 6', color: 'rgba(249,115,22,0.15)' },
      { a: 0, b: 1, c: 1, sign: '>=', label: 'y ≥ 1', color: 'rgba(168,85,247,0.15)' },
      { a: 1, b: 0, c: 1, sign: '>=', label: 'x ≥ 1', color: 'rgba(250,204,21,0.15)' },
      { a: 0, b: 1, c: 4, sign: '<=', label: 'y ≤ 4 (max fruit)', color: 'rgba(163,230,53,0.15)' },
    ],
  },
  2: {
    2: [
      { a: 4, b: 2, c: 16, sign: '<=', label: '4x + 2y ≤ 16 (machine hrs)', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 2, c: 10, sign: '<=', label: 'x + 2y ≤ 10 (labour hrs)', color: 'rgba(249,115,22,0.15)' },
    ],
    3: [
      { a: 4, b: 2, c: 16, sign: '<=', label: '4x + 2y ≤ 16 (machine)', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 2, c: 10, sign: '<=', label: 'x + 2y ≤ 10 (labour)', color: 'rgba(249,115,22,0.15)' },
      { a: 0, b: 1, c: 1, sign: '>=', label: 'y ≥ 1 (min product B)', color: 'rgba(168,85,247,0.15)' },
    ],
    4: [
      { a: 4, b: 2, c: 16, sign: '<=', label: '4x + 2y ≤ 16', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 2, c: 10, sign: '<=', label: 'x + 2y ≤ 10', color: 'rgba(249,115,22,0.15)' },
      { a: 0, b: 1, c: 1, sign: '>=', label: 'y ≥ 1', color: 'rgba(168,85,247,0.15)' },
      { a: 1, b: 0, c: 2, sign: '>=', label: 'x ≥ 2 (min product A)', color: 'rgba(250,204,21,0.15)' },
    ],
    5: [
      { a: 4, b: 2, c: 16, sign: '<=', label: '4x + 2y ≤ 16', color: 'rgba(34,211,238,0.15)' },
      { a: 1, b: 2, c: 10, sign: '<=', label: 'x + 2y ≤ 10', color: 'rgba(249,115,22,0.15)' },
      { a: 0, b: 1, c: 1, sign: '>=', label: 'y ≥ 1', color: 'rgba(168,85,247,0.15)' },
      { a: 1, b: 0, c: 2, sign: '>=', label: 'x ≥ 2', color: 'rgba(250,204,21,0.15)' },
      { a: 1, b: 1, c: 5, sign: '<=', label: 'x + y ≤ 5 (storage)', color: 'rgba(163,230,53,0.15)' },
    ],
  },
};

const findVertices = (ineqs: Inequality[]): { x: number; y: number }[] => {
  const allIneqs = [...ineqs, { a: 1, b: 0, c: 0, sign: '>=', label: 'x ≥ 0', color: '' }, { a: 0, b: 1, c: 0, sign: '>=', label: 'y ≥ 0', color: '' }];
  const vertices: { x: number; y: number }[] = [];
  for (let i = 0; i < allIneqs.length; i++) {
    for (let j = i + 1; j < allIneqs.length; j++) {
      const det = allIneqs[i].a * allIneqs[j].b - allIneqs[j].a * allIneqs[i].b;
      if (Math.abs(det) < 0.001) continue;
      const x = (allIneqs[i].c * allIneqs[j].b - allIneqs[j].c * allIneqs[i].b) / det;
      const y = (allIneqs[i].a * allIneqs[j].c - allIneqs[j].a * allIneqs[i].c) / det;
      if (x < -0.01 || y < -0.01) continue;
      let feasible = true;
      for (const inq of allIneqs) {
        const val = inq.a * x + inq.b * y;
        if (inq.sign === '<=' && val > inq.c + 0.01) feasible = false;
        if (inq.sign === '>=' && val < inq.c - 0.01) feasible = false;
        if (inq.sign === '<' && val >= inq.c - 0.01) feasible = false;
        if (inq.sign === '>' && val <= inq.c + 0.01) feasible = false;
      }
      if (feasible) vertices.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
  }
  return vertices;
};

const OBJECTIVES: Record<number, string> = { 0: 'P = 3x + 2y', 1: 'P = 4x + 5y', 2: 'P = 5x + 3y' };

interface InequalitiesSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function InequalitiesSimulation({ variables, isRunning, onRecordData }: InequalitiesSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const numInequalities = variables['num-inequalities'] ?? 3;
  const problemType = variables['problem-type'] ?? 0;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ineqs = INEQ_SETS[problemType]?.[numInequalities] ?? INEQ_SETS[0][3];
  const vertices = findVertices(ineqs);
  const progress = Math.min(elapsed / 100, 1);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
  }, [numInequalities, problemType]);

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) { clearInterval(intervalRef.current!); return 100; }
          return prev + 2;
        });
      }, 60);
    } else if (!isRunning) { clearInterval(intervalRef.current!); }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      const objCoeffs = problemType === 1 ? [4, 5] : problemType === 2 ? [5, 3] : [3, 2];
      let maxP = -Infinity, optVertex = { x: 0, y: 0 };
      vertices.forEach(v => {
        const p = objCoeffs[0] * v.x + objCoeffs[1] * v.y;
        if (p > maxP) { maxP = p; optVertex = v; }
      });
      onRecordData({
        feasibleVertices: vertices.length,
        optimalVertex: `(${optVertex.x}, ${optVertex.y})`,
        optimalValue: parseFloat(maxP.toFixed(2)),
        numInequalities,
      });
    }
  }, [elapsed, recorded]); // eslint-disable-line react-hooks/exhaustive-deps

  const W = 600, H = 420;
  const padL = 50, padB = 35, padT = 15, padR = 15;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xMax = 10, yMax = 10;
  const toX = (v: number) => padL + (v / xMax) * plotW;
  const toY = (v: number) => padT + plotH - (v / yMax) * plotH;

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060b18';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= xMax; i++) { ctx.beginPath(); ctx.moveTo(toX(i), padT); ctx.lineTo(toX(i), padT + plotH); ctx.stroke(); }
    for (let i = 1; i <= yMax; i++) { ctx.beginPath(); ctx.moveTo(padL, toY(i)); ctx.lineTo(padL + plotW, toY(i)); ctx.stroke(); }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let i = 1; i <= xMax; i++) ctx.fillText(`${i}`, toX(i), padT + plotH + 14);
    ctx.textAlign = 'right';
    for (let i = 1; i <= yMax; i++) ctx.fillText(`${i}`, padL - 6, toY(i) + 3);

    const visibleIneqs = ineqs.slice(0, Math.ceil(ineqs.length * Math.min(progress * 2, 1)));
    visibleIneqs.forEach((ineq, idx) => {
      if (ineq.b === 0) return;
      const x1 = 0, y1 = ineq.c / ineq.b;
      const x2 = xMax, y2 = (ineq.c - ineq.a * x2) / ineq.b;

      const isStrict = ineq.sign === '<' || ineq.sign === '>';
      ctx.beginPath();
      ctx.strokeStyle = ineq.color.replace('0.15', '0.6');
      ctx.lineWidth = isStrict ? 1.5 : 2;
      if (isStrict) ctx.setLineDash([6, 4]);
      ctx.moveTo(toX(x1), toY(y1));
      ctx.lineTo(toX(x2), toY(y2));
      ctx.stroke();
      ctx.setLineDash([]);

      const isAbove = ineq.sign === '>=' || ineq.sign === '>';
      ctx.beginPath();
      ctx.moveTo(padL, isAbove ? padT : toY(y1));
      ctx.lineTo(padL + plotW, isAbove ? padT : toY(y2));
      ctx.lineTo(padL + plotW, isAbove ? toY(y2) : padT + plotH);
      ctx.lineTo(padL, isAbove ? toY(y1) : padT + plotH);
      ctx.closePath();
      ctx.fillStyle = ineq.color;
      ctx.fill();
    });

    if (progress > 0.5 && vertices.length > 0) {
      ctx.beginPath();
      const sorted = [...vertices].sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
      sorted.forEach((v, i) => {
        if (i === 0) ctx.moveTo(toX(v.x), toY(v.y));
        else ctx.lineTo(toX(v.x), toY(v.y));
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(250,204,21,0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(250,204,21,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      vertices.forEach(v => {
        ctx.beginPath();
        ctx.arc(toX(v.x), toY(v.y), 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fbbf24';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`(${v.x}, ${v.y})`, toX(v.x) + 8, toY(v.y) - 5);
      });
    }

    if (progress > 0.8) {
      const objCoeffs = problemType === 1 ? [4, 5] : problemType === 2 ? [5, 3] : [3, 2];
      let maxP = -Infinity, optV = { x: 0, y: 0 };
      vertices.forEach(v => {
        const p = objCoeffs[0] * v.x + objCoeffs[1] * v.y;
        if (p > maxP) { maxP = p; optV = v; }
      });
      ctx.beginPath();
      ctx.arc(toX(optV.x), toY(optV.y), 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Optimal: P = ${maxP.toFixed(1)}`, toX(optV.x) + 12, toY(optV.y) + 4);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    const objLabel = OBJECTIVES[problemType] ?? OBJECTIVES[0];
    ctx.fillText(`Objective: maximise ${objLabel}`, padL + 5, padT + 12);

    if (problemType === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '9px sans-serif';
      ctx.fillText('Ghana cocoa/coffee farm allocation', padL + 5, padT + 26);
    }
  }, [ineqs, vertices, progress, problemType, W, H, padL, padT, plotW, plotH, xMax, yMax, toX, toY]);

  useEffect(() => { drawScene(); }, [drawScene]);

  return (
    <div className="flex flex-col items-center gap-5 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border-purple-500/30">
        {problemType === 0 ? 'Cocoa/Coffee Farm — Resource Allocation' : problemType === 1 ? 'Diet Optimization' : 'Production Planning'} — {ineqs.length} constraints
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full max-w-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Graphing Inequalities</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-purple-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="w-full max-w-lg space-y-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Constraints</div>
        {ineqs.map((ineq, i) => (
          <div key={i} className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ineq.color.replace('0.15', '0.6') }} />
            <span className="text-slate-300">{ineq.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-green-500/20 rounded-lg px-3 py-2 text-xs font-mono">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-green-400">Objective: maximise {OBJECTIVES[problemType] ?? OBJECTIVES[0]}</span>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Vertices</div>
          <div className="text-xl font-mono font-bold text-yellow-400">{vertices.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Feasible</div>
          <div className={`text-xl font-mono font-bold ${vertices.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {vertices.length > 0 ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        Strict inequalities (&lt; / &gt;) use dashed lines; non-strict (≤ / ≥) use solid lines. The feasible region is the overlap of all shaded regions. The maximum/minimum of the objective function always occurs at a vertex of the feasible region (corner point theorem). A Ghana cocoa farmer with limited land and labour can use this method to find the optimal crop mix.
      </div>
    </div>
  );
}

export default function InequalitiesLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <InequalitiesSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const totalVertices = trials.flatMap(t =>
      t.observations.map(o =>
        typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).feasibleVertices ?? 0) : 0
      )
    ).reduce((a, b) => a + b, 0);

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
          You solved {trials.length} linear programming problem{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Vertices</div>
            <div className="text-2xl font-mono font-bold text-yellow-400">{totalVertices}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Observations</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">{trials.flatMap(t => t.observations).length}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setCompletedSession(null)} className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
            <RotateCcw size={16} /> Try Again
          </button>
          <button onClick={() => window.history.back()} className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all">
            Back to Lesson
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={INEQUALITIES_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
