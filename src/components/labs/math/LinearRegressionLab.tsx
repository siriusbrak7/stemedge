import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { LINEAR_REGRESSION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface DataPoint {
  x: number;
  y: number;
}

const generateData = (dataSet: number, count: number): DataPoint[] => {
  const points: DataPoint[] = [];
  const seed = dataSet * 1000 + count * 7;
  const rand = (i: number) => {
    const x = Math.sin(seed + i * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < count; i++) {
    const x = 20 + rand(i) * 18;
    let m: number, c: number, noise: number;
    if (dataSet === 0) {
      m = 1.8; c = 30; noise = (rand(i + 50) - 0.5) * 20;
    } else if (dataSet === 1) {
      m = 2.5; c = 10; noise = (rand(i + 100) - 0.5) * 25;
    } else if (dataSet === 2) {
      m = 4.2; c = 15; noise = (rand(i + 150) - 0.5) * 15;
    } else {
      m = 3.0; c = 20; noise = (rand(i + 200) - 0.5) * 30;
    }
    const y = m * x + c + noise;
    points.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(Math.max(0, y).toFixed(1)) });
  }
  return points;
};

const computeRegression = (points: DataPoint[]) => {
  const n = points.length;
  if (n < 2) return { m: 0, c: 0, r: 0 };
  let sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
  points.forEach(p => {
    sx += p.x; sy += p.y;
    sxy += p.x * p.y;
    sx2 += p.x * p.x;
    sy2 += p.y * p.y;
  });
  const denom = n * sx2 - sx * sx;
  if (Math.abs(denom) < 0.001) return { m: 0, c: sy / n, r: 0 };
  const m = (n * sxy - sx * sy) / denom;
  const c = (sy - m * sx) / n;
  const rNum = n * sxy - sx * sy;
  const rDen = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
  const r = Math.abs(rDen) < 0.001 ? 0 : rNum / rDen;
  return { m: parseFloat(m.toFixed(2)), c: parseFloat(c.toFixed(1)), r: parseFloat(r.toFixed(3)) };
};

interface LinearRegressionSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function LinearRegressionSimulation({ variables, isRunning, onRecordData }: LinearRegressionSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataSet = variables['data-set'] ?? 0;
  const pointsCount = variables['points-count'] ?? 10;

  const [data, setData] = useState<DataPoint[]>(() => generateData(dataSet, pointsCount));
  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const regression = computeRegression(data);
  const progress = Math.min(elapsed / 100, 1);

  useEffect(() => {
    setData(generateData(dataSet, pointsCount));
    setElapsed(0);
    setRecorded(false);
  }, [dataSet, pointsCount]);

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
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
        gradient: regression.m,
        intercept: regression.c,
        correlation: regression.r,
        equation: `y = ${regression.m}x + ${regression.c}`,
        pointsCount: data.length,
      });
    }
  }, [elapsed, recorded]); // eslint-disable-line react-hooks/exhaustive-deps

  const W = 600, H = 400;
  const padL = 60, padB = 40, padT = 20, padR = 20;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xMin = 15, xMax = 42;
  const yMin = 0, yMax = Math.max(150, ...data.map(p => p.y)) + 10;

  const toX = (v: number) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const toY = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

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
    for (let gx = Math.ceil(xMin / 5) * 5; gx <= xMax; gx += 5) {
      const sx = toX(gx);
      ctx.beginPath(); ctx.moveTo(sx, padT); ctx.lineTo(sx, padT + plotH); ctx.stroke();
    }
    for (let gy = Math.ceil(yMin / 20) * 20; gy <= yMax; gy += 20) {
      const sy = toY(gy);
      ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + plotW, sy); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let gx = Math.ceil(xMin / 5) * 5; gx <= xMax; gx += 5) {
      ctx.fillText(`${gx}`, toX(gx), padT + plotH + 15);
    }
    ctx.textAlign = 'right';
    for (let gy = Math.ceil(yMin / 20) * 20; gy <= yMax; gy += 20) {
      ctx.fillText(`${gy}`, padL - 8, toY(gy) + 3);
    }

    ctx.save();
    ctx.translate(12, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dataSet === 1 ? 'Cold Drink Sales' : 'y values', 0, 0);
    ctx.restore();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dataSet === 1 ? 'Temperature (°C)' : 'x values', padL + plotW / 2, H - 5);

    const visiblePoints = data.slice(0, Math.ceil(data.length * Math.min(progress * 1.5, 1)));
    visiblePoints.forEach(p => {
      const px = toX(p.x), py = toY(p.y);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (progress > 0.3) {
      const lineProgress = Math.min((progress - 0.3) / 0.5, 1);
      const x1 = xMin, y1 = regression.m * x1 + regression.c;
      const x2 = xMax, y2 = regression.m * x2 + regression.c;
      const endX = x1 + (x2 - x1) * lineProgress;
      const endY = regression.m * endX + regression.c;

      ctx.beginPath();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 8;
      ctx.moveTo(toX(x1), toY(y1));
      ctx.lineTo(toX(endX), toY(endY));
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    const eqText = `y = ${regression.m}x ${regression.c >= 0 ? '+' : '−'} ${Math.abs(regression.c)}`;
    ctx.fillText(eqText, padL + 10, padT + 20);

    ctx.fillStyle = regression.r > 0.8 ? '#22c55e' : regression.r > 0.5 ? '#eab308' : '#ef4444';
    ctx.font = '10px monospace';
    ctx.fillText(`r = ${regression.r.toFixed(3)}`, padL + 10, padT + 35);

    if (dataSet === 1) {
      const predX = 35;
      const predY = regression.m * predX + regression.c;
      if (progress > 0.8) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(250,204,21,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(toX(predX), toY(predY));
        ctx.lineTo(toX(predX), padT + plotH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX(predX), toY(predY));
        ctx.lineTo(padL, toY(predY));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(toX(predX), toY(predY), 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '9px monospace';
        ctx.fillText(`At 35°C: ~${predY.toFixed(0)} sales`, toX(predX) + 8, toY(predY) - 6);
      }
    }
  }, [data, regression, progress, dataSet, W, H, padL, padT, plotW, plotH, xMin, xMax, yMin, yMax, toX, toY]);

  useEffect(() => { drawScene(); }, [drawScene]);

  return (
    <div className="flex flex-col items-center gap-5 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border-cyan-500/30">
        {dataSet === 0 ? 'Height vs Arm Span' : dataSet === 1 ? 'Kejetia Market: Temperature vs Sales' : dataSet === 2 ? 'Study Hours vs Exam Score' : 'Custom Data Set'} — {data.length} points
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full max-w-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Regression Calculation</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-orange-500"
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Gradient (m)</div>
          <div className="text-xl font-mono font-bold text-orange-400">{regression.m}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Intercept (c)</div>
          <div className="text-xl font-mono font-bold text-cyan-400">{regression.c}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[100px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Correlation (r)</div>
          <div className={`text-xl font-mono font-bold ${regression.r > 0.8 ? 'text-green-400' : regression.r > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
            {regression.r.toFixed(3)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        The line of best fit minimises the sum of squared residuals (least squares method). Gradient m = (nΣxy − ΣxΣy) / (nΣx² − (Σx)²). Use the line for interpolation (within data range), not extrapolation. At Kejetia Market, a trader can predict cold drink stock from temperature forecasts using this method.
      </div>
    </div>
  );
}

export default function LinearRegressionLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <LinearRegressionSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgR = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).correlation ?? 0) : 0
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
          You analysed {trials.length} dataset{trials.length !== 1 ? 's' : ''} with linear regression.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Correlation</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{avgR.toFixed(3)}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Observations</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">
              {trials.flatMap(t => t.observations).length}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCompletedSession(null)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Back to Lesson
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={LINEAR_REGRESSION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
