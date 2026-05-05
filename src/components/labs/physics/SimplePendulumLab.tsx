import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Target, HelpCircle, ChevronDown, CheckCircle2, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { SIMPLE_PENDULUM_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface PendulumSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function SimplePendulumSimulation({ variables, isRunning, onRecordData }: PendulumSimProps) {
  const length = variables['string-length'] ?? 1.0;
  const mass = variables['bob-mass'] ?? 120;
  const oscillationCount = variables['oscillation-count'] ?? 10;

  const [swinging, setSwinging] = useState(false);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ length: number; measuredT: number; calcG: number }[]>([]);
  const [guessG, setGuessG] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [angle, setAngle] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const swRef = useRef<number>(0);

  const trueT = useMemo(() => 2 * Math.PI * Math.sqrt(length / 9.81), [length]);
  const stringLen = length * 120;

  useEffect(() => {
    if (!swinging) { setAngle(0); return; }
    const maxAngle = 25;
    const omega = (2 * Math.PI) / trueT;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      setAngle(maxAngle * Math.cos(omega * elapsed));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [swinging, trueT]);

  useEffect(() => {
    if (!stopwatchRunning) return;
    startTimeRef.current = performance.now() - stopwatchMs;
    const tick = () => {
      setStopwatchMs(performance.now() - startTimeRef.current);
      swRef.current = requestAnimationFrame(tick);
    };
    swRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(swRef.current);
  }, [stopwatchRunning]);

  const startExperiment = () => {
    setSwinging(true);
    setStopwatchMs(0);
    setStopwatchRunning(false);
    setRecorded(false);
  };

  const toggleStopwatch = () => {
    if (!swinging) return;
    setStopwatchRunning(r => !r);
  };

  const recordDataPoint = () => {
    const totalTimeSec = stopwatchMs / 1000;
    const measuredT = totalTimeSec / oscillationCount;
    const calcG = (4 * Math.PI * Math.PI * length) / (measuredT * measuredT);
    const newPoint = { length, measuredT: Number(measuredT.toFixed(3)), calcG: Number(calcG.toFixed(2)) };
    setDataPoints(prev => [...prev, newPoint]);
    onRecordData({ length, measuredT: Number(measuredT.toFixed(3)), calcG: Number(calcG.toFixed(2)), oscillationCount });
    setRecorded(true);
    setSwinging(false);
    setStopwatchRunning(false);
    setStopwatchMs(0);
  };

  const submitG = () => {
    const num = Number(guessG);
    if (!num || dataPoints.length === 0) return;
    const avgG = dataPoints.reduce((s, d) => s + d.calcG, 0) / dataPoints.length;
    const diff = Math.abs(num - avgG);
    if (diff < 0.3) setResult('precision');
    else if (diff < 1.0) setResult('close');
    else setResult('miss');
  };

  const cx = 250, cy = 50;
  const rad = (angle * Math.PI) / 180;
  const bobX = cx + Math.sin(rad) * stringLen;
  const bobY = cy + Math.cos(rad) * stringLen;
  const bobR = 12 + mass / 40;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${s}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-5">
      <button onClick={() => setShowInstructions(!showInstructions)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <HelpCircle size={14} /><span className="uppercase tracking-widest font-bold">How to Play</span>
        <ChevronDown size={14} className={`transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 space-y-1">
            <p>1. Set the <strong className="text-white">string length</strong> and press <strong className="text-white">Release Pendulum</strong>.</p>
            <p>2. Use the <strong className="text-white">stopwatch</strong> to time <strong className="text-cyan-400">{oscillationCount} complete oscillations</strong>.</p>
            <p>3. <strong className="text-white">Record</strong> the data point. The period T and calculated g will auto-populate.</p>
            <p>4. Repeat with <strong className="text-white">different lengths</strong> to build a reliable dataset.</p>
            <p>5. Use <code className="text-cyan-400">g = 4pi2L / T2</code> to estimate gravitational acceleration.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 500 320" className="w-full rounded-2xl bg-[#09121b]">
            <rect x="200" y="40" width="100" height="12" rx="3" fill="#475569" />
            <rect x="247" y="28" width="6" height="16" fill="#64748b" />
            <line x1={cx} y1={cy} x2={bobX} y2={bobY} stroke="#cbd5e1" strokeWidth="2" />
            <circle cx={bobX} cy={bobY} r={bobR} fill="#38bdf8" />
            <circle cx={bobX} cy={bobY} r={bobR - 3} fill="#0ea5e9" />
            <line x1={cx} y1={cy} x2={cx} y2={cy + stringLen + 30} stroke="#334155" strokeWidth="1" strokeDasharray="6 4" />
            <path d={`M ${cx - 60} ${cy + stringLen} Q ${cx} ${cy + stringLen - 15} ${cx + 60} ${cy + stringLen}`}
              fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x={cx + 15} y={(cy + bobY) / 2} fill="#94a3b8" fontSize="10">L = {length.toFixed(1)} m</text>
            <text x={cx - 40} y={cy + stringLen + 25} fill="#64748b" fontSize="9">Equilibrium</text>
            <text x={bobX + bobR + 8} y={bobY + 4} fill="#94a3b8" fontSize="9">{mass}g</text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <button onClick={startExperiment} disabled={swinging}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30 flex items-center justify-center gap-2">
              <Play size={14} /> Release Pendulum
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Stopwatch</div>
            <div className="text-center mb-4">
              <div className={`text-4xl font-mono font-bold ${stopwatchRunning ? 'text-green-400' : 'text-white'}`}>{formatTime(stopwatchMs)}</div>
              <div className="text-xs text-slate-500 mt-1">seconds</div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleStopwatch} disabled={!swinging}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-30 flex items-center justify-center gap-2 ${stopwatchRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`}>
                {stopwatchRunning ? <><Pause size={14} /> Stop</> : <><Play size={14} /> Start</>}
              </button>
              <button onClick={recordDataPoint} disabled={!swinging || stopwatchMs < 500 || recorded}
                className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30">
                Record
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center italic">Count {oscillationCount} complete swings, then stop and record.</p>
          </div>

          {dataPoints.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Data Table</div>
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-2">L (m)</th><th className="py-2 px-2">T (s)</th><th className="py-2 px-2">T2 (s2)</th><th className="py-2 px-2">g (m/s2)</th></tr>
                </thead>
                <tbody>
                  {dataPoints.map((d, i) => (
                    <tr key={i} className="border-b border-slate-800/50 text-slate-300">
                      <td className="py-2 px-2 font-mono">{d.length.toFixed(1)}</td>
                      <td className="py-2 px-2 font-mono">{d.measuredT.toFixed(3)}</td>
                      <td className="py-2 px-2 font-mono">{(d.measuredT ** 2).toFixed(3)}</td>
                      <td className="py-2 px-2 font-mono">{d.calcG.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dataPoints.length >= 3 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-2">g = 4pi2L / T2 - Average your g values:</p>
                  <div className="flex gap-2">
                    <input value={guessG} onChange={e => setGuessG(e.target.value)} placeholder="Your g estimate"
                      className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2 text-white text-sm" />
                    <button onClick={submitG} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black"><Target size={14} /></button>
                  </div>
                  {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`mt-2 rounded-xl border p-3 text-sm ${result === 'precision' ? 'border-green-500/30 bg-green-500/10 text-green-300' : result === 'close' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                      {result === 'precision' ? 'Excellent! Your measurement of g is highly accurate.' : result === 'close' ? 'Good estimate. Try timing more oscillations for precision.' : `The accepted value is 9.81 m/s2. Your data suggests ${(dataPoints.reduce((s, d) => s + d.calcG, 0) / dataPoints.length).toFixed(2)}.`}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SimplePendulumLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <SimplePendulumSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgG = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).calcG ?? 0) : 0
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
          You investigated pendulum motion across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Average g</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{avgG.toFixed(2)} m/s2</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Trials</div>
            <div className="text-2xl font-mono font-bold text-white">{trials.length}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setCompletedSession(null)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={SIMPLE_PENDULUM_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
