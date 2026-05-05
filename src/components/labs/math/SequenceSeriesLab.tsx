import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { BarChart3, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { SEQUENCE_SERIES_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface SequenceSeriesSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function SequenceSeriesSimulation({ variables, isRunning, onRecordData }: SequenceSeriesSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seqType = variables['sequence-type'] ?? 0;
  const firstTerm = variables['first-term'] ?? 3;
  const diffOrRatio = variables['common-diff-ratio'] ?? 2;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = Math.min(elapsed / 100, 1);
  const N = 12;

  const isArithmetic = seqType === 0;
  const terms: number[] = [];
  const seriesSums: number[] = [];

  for (let n = 1; n <= N; n++) {
    if (isArithmetic) {
      terms.push(firstTerm + (n - 1) * diffOrRatio);
    } else {
      terms.push(firstTerm * Math.pow(diffOrRatio, n - 1));
    }
  }

  let cumulative = 0;
  for (let n = 0; n < N; n++) {
    cumulative += terms[n];
    seriesSums.push(cumulative);
  }

  const nthTerm = (n: number): number => {
    if (isArithmetic) return firstTerm + (n - 1) * diffOrRatio;
    return firstTerm * Math.pow(diffOrRatio, n - 1);
  };

  const seriesSum = (n: number): number => {
    if (isArithmetic) return (n / 2) * (2 * firstTerm + (n - 1) * diffOrRatio);
    if (Math.abs(diffOrRatio) < 1) return firstTerm * (1 - Math.pow(diffOrRatio, n)) / (1 - diffOrRatio);
    return firstTerm * (Math.pow(diffOrRatio, n) - 1) / (diffOrRatio - 1);
  };

  const sumToInfinity = (): number | null => {
    if (isArithmetic) return null;
    if (Math.abs(diffOrRatio) >= 1) return null;
    return firstTerm / (1 - diffOrRatio);
  };

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
  }, [seqType, firstTerm, diffOrRatio]);

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) { clearInterval(intervalRef.current!); return 100; }
          return prev + 2;
        });
      }, 60);
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        sequenceType: isArithmetic ? 'arithmetic' : 'geometric',
        firstTerm,
        commonDiffOrRatio: diffOrRatio,
        tenthTerm: parseFloat(nthTerm(10).toFixed(2)),
        sumOfTen: parseFloat(seriesSum(10).toFixed(2)),
        sumToInfinity: sumToInfinity() !== null ? parseFloat(sumToInfinity()!.toFixed(2)) : null,
      });
    }
  }, [elapsed, recorded]); // eslint-disable-line react-hooks/exhaustive-deps

  const W = 600, H = 420;
  const splitY = 260;
  const padL = 50, padR = 15;
  const topPadT = 20, topPadB = 15;
  const botPadT = 15, botPadB = 30;
  const plotW = W - padL - padR;
  const topH = splitY - topPadT - topPadB;
  const botH = H - splitY - botPadT - botPadB;

  const maxTerm = Math.max(...terms.map(Math.abs), 5);
  const maxSum = Math.max(...seriesSums.map(Math.abs), 5);

  const toBarX = (i: number) => padL + 20 + i * (plotW - 40) / N;
  const barW = (plotW - 40) / N - 6;

  const toTopY = (v: number) => topPadT + topH / 2 - (v / maxTerm) * (topH / 2 - 5);
  const toBotY = (v: number) => splitY + botPadT + botH - (v / maxSum) * (botH - 10) - 5;

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060b18';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    const topMidY = topPadT + topH / 2;
    ctx.beginPath(); ctx.moveTo(padL, topMidY); ctx.lineTo(padL + plotW, topMidY); ctx.stroke();

    const visibleCount = Math.ceil(N * Math.min(progress * 1.5, 1));

    for (let i = 0; i < visibleCount; i++) {
      const val = terms[i];
      const bx = toBarX(i);
      const barHeight = Math.abs(val / maxTerm) * (topH / 2 - 5);
      const by = val >= 0 ? topMidY - barHeight : topMidY;

      const grad = ctx.createLinearGradient(bx, by, bx, by + barHeight);
      if (isArithmetic) {
        grad.addColorStop(0, 'rgba(34,211,238,0.8)');
        grad.addColorStop(1, 'rgba(34,211,238,0.3)');
      } else {
        grad.addColorStop(0, 'rgba(249,115,22,0.8)');
        grad.addColorStop(1, 'rgba(249,115,22,0.3)');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, barW, barHeight);
      ctx.strokeStyle = isArithmetic ? 'rgba(34,211,238,0.6)' : 'rgba(249,115,22,0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, barW, barHeight);

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`T${i + 1}`, bx + barW / 2, topPadT + topH + 8);
    }

    if (progress > 0.3) {
      ctx.beginPath();
      ctx.strokeStyle = isArithmetic ? 'rgba(34,211,238,0.5)' : 'rgba(249,115,22,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      for (let i = 0; i < visibleCount; i++) {
        const cx = toBarX(i) + barW / 2;
        const cy = toTopY(terms[i]);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    const termLabel = isArithmetic ? `Tₙ = ${firstTerm} + (n−1)×${diffOrRatio}` : `Tₙ = ${firstTerm} × ${diffOrRatio}ⁿ⁻¹`;
    ctx.fillText(termLabel, padL + 5, topPadT + 12);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, splitY + botPadT); ctx.lineTo(padL + plotW, splitY + botPadT); ctx.stroke();

    const barGrad = ctx.createLinearGradient(0, splitY + botPadT, 0, H - botPadB);
    barGrad.addColorStop(0, 'rgba(34,197,94,0.8)');
    barGrad.addColorStop(1, 'rgba(34,197,94,0.2)');

    const sumVisible = Math.ceil(N * Math.min(progress * 1.2, 1));
    for (let i = 0; i < sumVisible; i++) {
      const val = seriesSums[i];
      const bx = toBarX(i);
      const barHeight = Math.abs(val / maxSum) * (botH - 15);

      ctx.fillStyle = barGrad;
      ctx.fillRect(bx, splitY + botPadT + botH - barHeight - 5, barW, barHeight);
      ctx.strokeStyle = 'rgba(34,197,94,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, splitY + botPadT + botH - barHeight - 5, barW, barHeight);

      if (progress > 0.5 && i < sumVisible - 1) {
        const nextVal = seriesSums[i + 1] || val;
        const cx1 = bx + barW / 2;
        const cx2 = toBarX(i + 1) + barW / 2;
        const cy1 = toBotY(val);
        const cy2 = toBotY(nextVal);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(34,197,94,0.4)';
        ctx.lineWidth = 1;
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.stroke();
      }
    }

    const sumLabel = isArithmetic
      ? `Sₙ = n/2(2×${firstTerm} + (n−1)×${diffOrRatio})`
      : `Sₙ = ${firstTerm}(${diffOrRatio}ⁿ − 1)/(${diffOrRatio} − 1)`;
    ctx.fillStyle = 'rgba(34,197,94,0.7)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Series Sum: ${sumLabel}`, padL + 5, splitY + botPadT + 12);

    const infSum = sumToInfinity();
    if (infSum !== null && progress > 0.7) {
      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = 'rgba(250,204,21,0.5)';
      ctx.lineWidth = 1;
      const infY = toBotY(infSum);
      ctx.beginPath(); ctx.moveTo(padL, infY); ctx.lineTo(padL + plotW, infY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`S∞ = ${infSum.toFixed(2)}`, padL + plotW - 5, infY - 5);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, splitY); ctx.lineTo(padL + plotW, splitY); ctx.stroke();

    ctx.fillStyle = isArithmetic ? '#22d3ee' : '#f97316';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(isArithmetic ? 'ARITHMETIC' : 'GEOMETRIC', padL + plotW - 90, topPadT + 12);

    if (isArithmetic) {
      ctx.fillStyle = 'rgba(34,211,238,0.4)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Linear growth', padL + plotW - 5, topMidY - 5);
    } else {
      const growth = Math.abs(diffOrRatio) > 1 ? 'Exponential growth' : Math.abs(diffOrRatio) < 1 ? 'Converging' : 'Oscillating';
      ctx.fillStyle = 'rgba(249,115,22,0.4)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(growth, padL + plotW - 5, topMidY - 5);
    }
  }, [seqType, firstTerm, diffOrRatio, progress, terms, seriesSums, isArithmetic, maxTerm, maxSum, sumToInfinity, W, H, padL, padR, plotW, splitY, topPadT, topPadB, botPadT, botPadB, topH, botH, toBarX, barW, toTopY, toBotY]);

  useEffect(() => { drawScene(); }, [drawScene]);

  const s10 = seriesSum(10);
  const t10 = nthTerm(10);
  const infSum = sumToInfinity();

  return (
    <div className="flex flex-col items-center gap-5 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border-green-500/30">
        {isArithmetic ? 'Arithmetic Sequence' : 'Geometric Sequence'} — Microfinance Compound Interest
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full max-w-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Building Sequence</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-green-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">T₁₀</div>
          <div className={`text-xl font-mono font-bold ${isArithmetic ? 'text-cyan-400' : 'text-orange-400'}`}>{t10.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">S₁₀</div>
          <div className="text-xl font-mono font-bold text-green-400">{s10.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{isArithmetic ? 'd' : 'r'}</div>
          <div className={`text-xl font-mono font-bold ${isArithmetic ? 'text-cyan-400' : 'text-orange-400'}`}>{diffOrRatio}</div>
        </div>
        {infSum !== null && (
          <div className="bg-slate-900/60 border border-yellow-500/20 rounded-xl p-4 text-center min-w-[100px]">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">S∞</div>
            <div className="text-xl font-mono font-bold text-yellow-400">{infSum.toFixed(2)}</div>
          </div>
        )}
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        {isArithmetic
          ? 'Arithmetic: Tₙ = a + (n−1)d, Sₙ = n/2(2a + (n−1)d). Constant difference between consecutive terms produces linear bar growth.'
          : 'Geometric: Tₙ = arⁿ⁻¹, Sₙ = a(rⁿ−1)/(r−1) for r≠1. S∞ = a/(1−r) only when |r| < 1. A GHC 1000 microfinance loan at 5% monthly compound interest grows as a geometric sequence: 1000, 1050, 1102.50, ... — after 12 months the debt is GHC 1795.85. This exponential growth is why interest rate caps matter.'}
      </div>
    </div>
  );
}

export default function SequenceSeriesLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <SequenceSeriesSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgSum = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).sumOfTen ?? 0) : 0
          )
        ).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

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
          You explored {trials.length} sequence{trials.length !== 1 ? 's' : ''} and series.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg S₁₀</div>
            <div className="text-2xl font-mono font-bold text-green-400">{avgSum.toFixed(2)}</div>
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
      config={SEQUENCE_SERIES_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
