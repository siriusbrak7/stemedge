import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Activity, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { DIFFERENTIATION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface DifferentiationSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function DifferentiationSimulation({ variables, isRunning, onRecordData }: DifferentiationSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const functionType = variables['function-type'] ?? 0;
  const coeffA = variables['coeff-a'] ?? 1;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [tangentX, setTangentX] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = Math.min(elapsed / 100, 1);

  const f = (x: number): number => {
    if (functionType === 0) return coeffA * x * x * x - 3 * x;
    if (functionType === 1) return coeffA * Math.sin(x) + 0.5 * Math.cos(x * 0.5);
    if (functionType === 2) return coeffA * Math.exp(x * 0.3);
    return coeffA * x * x - 2 * x + 1;
  };

  const fPrime = (x: number): number => {
    if (functionType === 0) return 3 * coeffA * x * x - 3;
    if (functionType === 1) return coeffA * Math.cos(x) - 0.25 * Math.sin(x * 0.5);
    if (functionType === 2) return coeffA * 0.3 * Math.exp(x * 0.3);
    return 2 * coeffA * x - 2;
  };

  const funcLabel = (() => {
    if (functionType === 0) return `f(x) = ${coeffA}x³ − 3x`;
    if (functionType === 1) return `f(x) = ${coeffA}sin(x) + 0.5cos(x/2)`;
    if (functionType === 2) return `f(x) = ${coeffA}e^(0.3x)`;
    return `f(x) = ${coeffA}x² − 2x + 1`;
  })();

  const derivLabel = (() => {
    if (functionType === 0) return `f'(x) = ${3 * coeffA}x² − 3`;
    if (functionType === 1) return `f'(x) = ${coeffA}cos(x) − 0.25sin(x/2)`;
    if (functionType === 2) return `f'(x) = ${coeffA * 0.3}e^(0.3x)`;
    return `f'(x) = ${2 * coeffA}x − 2`;
  })();

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    setTangentX(0);
  }, [functionType, coeffA]);

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) { clearInterval(intervalRef.current!); return 100; }
          return prev + 1;
        });
      }, 60);
      animRef.current = setInterval(() => {
        setTangentX(prev => {
          const next = prev + 0.08;
          return next > 5 ? -5 : next;
        });
      }, 50);
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
      clearInterval(animRef.current!);
    }
    return () => { clearInterval(intervalRef.current!); clearInterval(animRef.current!); };
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      clearInterval(animRef.current!);
      const grad = fPrime(tangentX);
      onRecordData({
        tangentPosition: parseFloat(tangentX.toFixed(2)),
        gradient: parseFloat(grad.toFixed(3)),
        functionType,
        coefficientA: coeffA,
      });
    }
  }, [elapsed, recorded]); // eslint-disable-line react-hooks/exhaustive-deps

  const W = 600, H = 440;
  const splitY = 320;
  const padL = 50, padR = 15;
  const topPadT = 15, topPadB = 25;
  const botPadT = 15, botPadB = 25;
  const plotW = W - padL - padR;

  const topH = splitY - topPadT - topPadB;
  const botH = H - splitY - botPadT - botPadB;

  const xMin = -5, xMax = 5;
  const yTopMin = -5, yTopMax = 10;
  const yBotMin = -8, yBotMax = 8;

  const toX = (v: number) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const toTopY = (v: number) => topPadT + topH - ((v - yTopMin) / (yTopMax - yTopMin)) * topH;
  const toBotY = (v: number) => splitY + botPadT + botH - ((v - yBotMin) / (yBotMax - yBotMin)) * botH;

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
    for (let gx = Math.ceil(xMin); gx <= xMax; gx++) {
      const sx = toX(gx);
      ctx.beginPath(); ctx.moveTo(sx, topPadT); ctx.lineTo(sx, splitY - topPadB); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, splitY + botPadT); ctx.lineTo(sx, H - botPadB); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    const topOriginY = toTopY(0);
    if (topOriginY > topPadT && topOriginY < splitY - topPadB) {
      ctx.beginPath(); ctx.moveTo(padL, topOriginY); ctx.lineTo(padL + plotW, topOriginY); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(toX(0), topPadT); ctx.lineTo(toX(0), splitY - topPadB); ctx.stroke();

    const botOriginY = toBotY(0);
    if (botOriginY > splitY + botPadT && botOriginY < H - botPadB) {
      ctx.beginPath(); ctx.moveTo(padL, botOriginY); ctx.lineTo(padL + plotW, botOriginY); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(toX(0), splitY + botPadT); ctx.lineTo(toX(0), H - botPadB); ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, splitY); ctx.lineTo(padL + plotW, splitY); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('f(x)', padL + 5, topPadT + 12);
    ctx.fillStyle = 'rgba(34,211,238,0.7)';
    ctx.fillText(funcLabel, padL + 35, topPadT + 12);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText("f'(x)", padL + 5, splitY + botPadT + 12);
    ctx.fillStyle = 'rgba(250,204,21,0.7)';
    ctx.fillText(derivLabel, padL + 35, splitY + botPadT + 12);

    ctx.beginPath();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 6;
    for (let px = 0; px < plotW; px++) {
      const x = xMin + (px / plotW) * (xMax - xMin);
      const y = f(x);
      const sy = toTopY(y);
      if (sy < topPadT - 20 || sy > splitY - topPadB + 20) continue;
      if (px === 0) ctx.moveTo(padL + px, sy);
      else ctx.lineTo(padL + px, sy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 4;
    for (let px = 0; px < plotW; px++) {
      const x = xMin + (px / plotW) * (xMax - xMin);
      const y = fPrime(x);
      const sy = toBotY(y);
      if (sy < splitY + botPadT - 20 || sy > H - botPadB + 20) continue;
      if (px === 0) ctx.moveTo(padL + px, sy);
      else ctx.lineTo(padL + px, sy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (progress > 0.2) {
      const tx = tangentX;
      const ty = f(tx);
      const grad = fPrime(tx);
      const tanLen = 2;
      const x1 = tx - tanLen, y1 = ty - grad * tanLen;
      const x2 = tx + tanLen, y2 = ty + grad * tanLen;

      ctx.beginPath();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 6;
      ctx.moveTo(toX(x1), toTopY(y1));
      ctx.lineTo(toX(x2), toTopY(y2));
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(toX(tx), toTopY(ty), 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      const gradBotY = toBotY(grad);
      ctx.beginPath();
      ctx.arc(toX(tx), gradBotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();

      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(249,115,22,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(toX(tx), topPadT);
      ctx.lineTo(toX(tx), H - botPadB);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      const infoX = toX(tx) + 10;
      const infoY = Math.max(topPadT + 30, toTopY(ty) - 15);
      ctx.fillText(`x = ${tx.toFixed(1)}`, infoX, infoY);
      ctx.fillText(`f'(x) = ${grad.toFixed(2)}`, infoX, infoY + 14);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let i = Math.ceil(xMin); i <= xMax; i++) {
      if (i !== 0) ctx.fillText(`${i}`, toX(i), splitY - topPadB + 12);
    }

    if (functionType === 0) {
      const sp1x = 1 / Math.sqrt(coeffA);
      const sp2x = -1 / Math.sqrt(coeffA);
      if (progress > 0.6) {
        [sp1x, sp2x].forEach(spx => {
          if (spx >= xMin && spx <= xMax) {
            ctx.beginPath();
            ctx.arc(toX(spx), toTopY(f(spx)), 4, 0, Math.PI * 2);
            ctx.fillStyle = '#22c55e';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#22c55e';
            ctx.font = '8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('SP', toX(spx), toTopY(f(spx)) - 10);
          }
        });
      }
    }
  }, [functionType, coeffA, tangentX, progress, funcLabel, derivLabel, f, fPrime, W, H, padL, padR, plotW, splitY, topPadT, topPadB, botPadT, botPadB, topH, botH, xMin, xMax, yTopMin, yTopMax, yBotMin, yBotMax, toX, toTopY, toBotY]);

  useEffect(() => { drawScene(); }, [drawScene]);

  const currentGradient = fPrime(tangentX);
  const currentFx = f(tangentX);

  return (
    <div className="flex flex-col items-center gap-5 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border-orange-500/30">
        {functionType === 0 ? 'Polynomial' : functionType === 1 ? 'Trigonometric' : functionType === 2 ? 'Exponential' : 'Quadratic'} — Akosombo Dam Water Level Rate of Change
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full max-w-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Tangent Sliding Along Curve</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-orange-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">f(x)</div>
          <div className="text-xl font-mono font-bold text-cyan-400">{currentFx.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">f'(x) Gradient</div>
          <div className={`text-xl font-mono font-bold ${currentGradient > 0 ? 'text-green-400' : currentGradient < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
            {currentGradient.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">x Position</div>
          <div className="text-xl font-mono font-bold text-orange-400">{tangentX.toFixed(1)}</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge / IB · </span>
        The derivative f'(x) gives the gradient of the tangent at any point. Where f'(x) = 0, the function has a stationary point (maximum, minimum, or point of inflection). f'(x) &gt; 0 means f is increasing; f'(x) &lt; 0 means f is decreasing. At Akosombo Dam, dh/dt represents the rate of change of water level — positive during rainy season (rising), negative during dry season (falling).
      </div>
    </div>
  );
}

export default function DifferentiationLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <DifferentiationSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgGrad = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).gradient ?? 0) : 0
          )
        ).reduce((a, b) => a + Math.abs(b), 0) / Math.max(1, trials.flatMap(t => t.observations).length)
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
          You explored derivatives across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg |Gradient|</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{avgGrad.toFixed(2)}</div>
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
      config={DIFFERENTIATION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
