import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Box, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { INTEGRATION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface IntegrationSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function IntegrationSimulation({ variables, isRunning, onRecordData }: IntegrationSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const funcType = variables['function'] ?? 0;
  const numStrips = variables['num-strips'] ?? 5;
  const upperLimit = variables['upper-limit'] ?? 4;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = Math.min(elapsed / 100, 1);

  const f = (x: number): number => {
    if (funcType === 0) return x * x;
    if (funcType === 1) return Math.sin(x);
    if (funcType === 2) return Math.exp(x * 0.5);
    return Math.sqrt(Math.max(0, x));
  };

  const exactIntegral = (): number => {
    if (funcType === 0) return (upperLimit * upperLimit * upperLimit) / 3;
    if (funcType === 1) return 1 - Math.cos(upperLimit);
    if (funcType === 2) return 2 * (Math.exp(upperLimit * 0.5) - 1);
    return (2 / 3) * Math.pow(upperLimit, 1.5);
  };

  const trapeziumRule = (): number => {
    const h = upperLimit / numStrips;
    let sum = f(0) + f(upperLimit);
    for (let i = 1; i < numStrips; i++) {
      sum += 2 * f(i * h);
    }
    return (h / 2) * sum;
  };

  const trapValue = trapeziumRule();
  const exactValue = exactIntegral();
  const error = Math.abs(trapValue - exactValue);
  const errorPercent = exactValue !== 0 ? (error / Math.abs(exactValue)) * 100 : 0;

  const funcLabel = (() => {
    if (funcType === 0) return 'f(x) = x²';
    if (funcType === 1) return 'f(x) = sin(x)';
    if (funcType === 2) return 'f(x) = e^(0.5x)';
    return 'f(x) = √x';
  })();

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
  }, [funcType, numStrips, upperLimit]);

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
        trapeziumEstimate: parseFloat(trapValue.toFixed(4)),
        exactIntegral: parseFloat(exactValue.toFixed(4)),
        error: parseFloat(error.toFixed(4)),
        errorPercent: parseFloat(errorPercent.toFixed(2)),
        numStrips,
        upperLimit,
      });
    }
  }, [elapsed, recorded]); // eslint-disable-line react-hooks/exhaustive-deps

  const W = 600, H = 420;
  const padL = 55, padB = 35, padT = 20, padR = 15;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xMax = Math.max(upperLimit + 1, 5);
  const yMax = Math.max(f(upperLimit) * 1.2, 5);

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
    for (let gx = 1; gx <= xMax; gx++) { ctx.beginPath(); ctx.moveTo(toX(gx), padT); ctx.lineTo(toX(gx), padT + plotH); ctx.stroke(); }
    for (let gy = 1; gy <= yMax; gy++) { ctx.beginPath(); ctx.moveTo(padL, toY(gy)); ctx.lineTo(padL + plotW, toY(gy)); ctx.stroke(); }

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

    const visibleStrips = Math.ceil(numStrips * Math.min(progress * 1.5, 1));
    const h = upperLimit / numStrips;

    for (let i = 0; i < visibleStrips; i++) {
      const x0 = i * h;
      const x1 = (i + 1) * h;
      const y0 = f(x0);
      const y1 = f(x1);

      ctx.beginPath();
      ctx.moveTo(toX(x0), toY(0));
      ctx.lineTo(toX(x0), toY(y0));
      ctx.lineTo(toX(x1), toY(y1));
      ctx.lineTo(toX(x1), toY(0));
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(34,211,238,0.15)' : 'rgba(168,85,247,0.15)';
      ctx.fill();
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(34,211,238,0.5)' : 'rgba(168,85,247,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (progress > 0.4) {
      ctx.beginPath();
      const fillAlpha = Math.min((progress - 0.4) / 0.3, 0.08);
      ctx.moveTo(toX(0), toY(0));
      for (let px = 0; px <= plotW; px++) {
        const x = (px / plotW) * xMax;
        if (x > upperLimit) break;
        const y = f(x);
        ctx.lineTo(toX(x), toY(y));
      }
      ctx.lineTo(toX(upperLimit), toY(0));
      ctx.closePath();
      ctx.fillStyle = `rgba(34,197,94,${fillAlpha})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 6;
    for (let px = 0; px <= plotW; px++) {
      const x = (px / plotW) * xMax;
      const y = f(x);
      const sy = toY(y);
      if (sy < padT - 20 || sy > padT + plotH + 20) continue;
      if (px === 0) ctx.moveTo(padL + px, sy);
      else ctx.lineTo(padL + px, sy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    const limitScreenX = toX(upperLimit);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(250,204,21,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(limitScreenX, padT); ctx.lineTo(limitScreenX, padT + plotH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`b=${upperLimit}`, limitScreenX, padT + plotH + 25);

    for (let i = 0; i <= visibleStrips && i <= numStrips; i++) {
      const x = i * h;
      const sx = toX(x);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx, toY(0) - 3); ctx.lineTo(sx, toY(0) + 3); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(funcLabel, padL + 5, padT + 14);

    if (progress > 0.6) {
      ctx.fillStyle = 'rgba(34,211,238,0.7)';
      ctx.font = '10px monospace';
      ctx.fillText(`Trapezium: ${trapValue.toFixed(3)}`, padL + 5, padT + 28);
      ctx.fillStyle = 'rgba(34,197,94,0.7)';
      ctx.fillText(`Exact: ${exactValue.toFixed(3)}`, padL + 5, padT + 40);
      ctx.fillStyle = errorPercent < 5 ? '#22c55e' : errorPercent < 15 ? '#eab308' : '#ef4444';
      ctx.fillText(`Error: ${errorPercent.toFixed(1)}%`, padL + 5, padT + 52);
    }
  }, [funcType, numStrips, upperLimit, progress, f, trapValue, exactValue, errorPercent, funcLabel, W, H, padL, padT, plotW, plotH, xMax, yMax, toX, toY]);

  useEffect(() => { drawScene(); }, [drawScene]);

  return (
    <div className="flex flex-col items-center gap-5 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border-cyan-500/30">
        {funcLabel} — {numStrips} strips — Reservoir Volume Calculation
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full max-w-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Computing Trapezium Rule</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-cyan-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Trapezium</div>
          <div className="text-xl font-mono font-bold text-cyan-400">{trapValue.toFixed(3)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Exact</div>
          <div className="text-xl font-mono font-bold text-green-400">{exactValue.toFixed(3)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Error</div>
          <div className={`text-xl font-mono font-bold ${errorPercent < 5 ? 'text-green-400' : errorPercent < 15 ? 'text-yellow-400' : 'text-red-400'}`}>
            {errorPercent.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-mono">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Trapezium Rule Formula</div>
        <div className="text-brand-accent">∫₀{toSuperscript(upperLimit)} f(x)dx ≈ h/2 [f(x₀) + 2f(x₁) + 2f(x₂) + ... + f(xₙ)]</div>
        <div className="text-slate-400 mt-1">where h = {upperLimit}/{numStrips} = {(upperLimit / numStrips).toFixed(3)}</div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        The trapezium rule approximates the area under a curve using trapezia. More strips give better accuracy. Formula: Area ≈ h/2[y₀ + yₙ + 2(y₁ + y₂ + ... + yₙ₋₁)]. At Akosombo Dam, engineers use integration to calculate reservoir volume: V = ∫A(h)dh, where A(h) is the cross-sectional area at depth h. The trapezium rule is used when A(h) is given as data points rather than an equation.
      </div>
    </div>
  );
}

function toSuperscript(n: number): string {
  const sup = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  return String(n).split('').map(d => sup[parseInt(d)] ?? d).join('');
}

export default function IntegrationLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <IntegrationSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgError = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).errorPercent ?? 0) : 0
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
          You computed {trials.length} integration{trials.length !== 1 ? 's' : ''} using the trapezium rule.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Error</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{avgError.toFixed(1)}%</div>
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
      config={INTEGRATION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
