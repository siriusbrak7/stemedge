import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import VirtualLabEngine from '../VirtualLabEngine';
import { CIRCUIT_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Zap, RotateCcw, FlaskConical } from 'lucide-react';

interface CircuitSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function CircuitSimulation({ variables, isRunning, onRecordData }: CircuitSimProps) {
  const resistance = variables['resistance'] ?? 100;
  const voltage = variables['voltage'] ?? 9;
  const circuitType = variables['circuit-type'] ?? 0;

  const isSeries = circuitType === 0;
  const totalR = isSeries ? resistance * 2 : resistance / 2;
  const current = voltage / totalR;
  const vPerResistor = isSeries ? voltage / 2 : voltage;
  const powerLoss = current * current * totalR;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [electronPhases, setElectronPhases] = useState<number[]>([0, 0.2, 0.4, 0.6, 0.8]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

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
      }, 80);
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        voltage,
        current: parseFloat(current.toFixed(4)),
        resistorValue: resistance,
        voltagePerResistor: parseFloat(vPerResistor.toFixed(2)),
        totalResistance: parseFloat(totalR.toFixed(2)),
        powerLoss: parseFloat(powerLoss.toFixed(4)),
        circuitType: isSeries ? 'series' : 'parallel',
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    clearInterval(intervalRef.current!);
  }, [resistance, voltage, circuitType]);

  useEffect(() => {
    if (!isRunning) return;
    const speed = Math.min(current * 8, 3);
    const tick = () => {
      phaseRef.current = (phaseRef.current + speed * 0.008) % 1;
      setElectronPhases([phaseRef.current, (phaseRef.current + 0.2) % 1, (phaseRef.current + 0.4) % 1, (phaseRef.current + 0.6) % 1, (phaseRef.current + 0.8) % 1]);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, current]);

  const progress = elapsed / 100;

  const wirePath = isSeries
    ? [{ x: 60, y: 60 }, { x: 200, y: 60 }, { x: 340, y: 60 }, { x: 440, y: 60 }, { x: 440, y: 200 }, { x: 340, y: 200 }, { x: 200, y: 200 }, { x: 60, y: 200 }]
    : [{ x: 60, y: 60 }, { x: 200, y: 60 }, { x: 440, y: 60 }, { x: 440, y: 200 }, { x: 200, y: 200 }, { x: 60, y: 200 }];

  const getPointOnPath = (phase: number) => {
    const totalLen = wirePath.length;
    const idx = phase * totalLen;
    const i = Math.floor(idx) % totalLen;
    const next = (i + 1) % totalLen;
    const t = idx - Math.floor(idx);
    return {
      x: wirePath[i].x + (wirePath[next].x - wirePath[i].x) * t,
      y: wirePath[i].y + (wirePath[next].y - wirePath[i].y) * t,
    };
  };

  const displayCurrent = isRunning ? (current * progress) : 0;
  const displayVoltage = isRunning ? voltage * progress : 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-500/10 border-yellow-500/30">
        {isSeries ? 'Series Circuit' : 'Parallel Circuit'} — Ohm's Law Measurement
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 w-full max-w-2xl">
        <svg viewBox="0 0 500 260" className="w-full rounded-2xl bg-[#09121b]">
          <rect x="40" y="45" width="40" height="70" rx="4" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          <text x="60" y="87" fill="#22c55e" fontSize="8" textAnchor="middle" fontWeight="bold">{voltage}V</text>
          <text x="60" y="97" fill="#64748b" fontSize="6" textAnchor="middle">EMF</text>
          <line x1="40" y1="60" x2="20" y2="60" stroke="#ef4444" strokeWidth="2" />
          <line x1="40" y1="100" x2="20" y2="100" stroke="#3b82f6" strokeWidth="2" />
          <text x="12" y="64" fill="#ef4444" fontSize="7" textAnchor="middle">+</text>
          <text x="12" y="104" fill="#3b82f6" fontSize="7" textAnchor="middle">−</text>

          <line x1="20" y1="60" x2="200" y2="60" stroke="#cbd5e1" strokeWidth="2" />

          {isSeries ? (
            <>
              <rect x="200" y="50" width="60" height="20" rx="3" fill="#1e293b" stroke="#a78bfa" strokeWidth="1.5" />
              <rect x="210" y="55" width="40" height="10" rx="2" fill="#7c3aed" opacity="0.4" />
              <text x="230" y="63" fill="#a78bfa" fontSize="7" textAnchor="middle" fontWeight="bold">R1</text>
              <line x1="260" y1="60" x2="340" y2="60" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="340" y="50" width="60" height="20" rx="3" fill="#1e293b" stroke="#a78bfa" strokeWidth="1.5" />
              <rect x="350" y="55" width="40" height="10" rx="2" fill="#7c3aed" opacity="0.4" />
              <text x="370" y="63" fill="#a78bfa" fontSize="7" textAnchor="middle" fontWeight="bold">R2</text>
              <line x1="400" y1="60" x2="440" y2="60" stroke="#cbd5e1" strokeWidth="2" />
            </>
          ) : (
            <>
              <line x1="200" y1="60" x2="300" y2="60" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="300" y1="60" x2="300" y2="30" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="300" y1="30" x2="340" y2="30" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="340" y="20" width="60" height="20" rx="3" fill="#1e293b" stroke="#a78bfa" strokeWidth="1.5" />
              <text x="370" y="33" fill="#a78bfa" fontSize="7" textAnchor="middle" fontWeight="bold">R1</text>
              <line x1="400" y1="30" x2="440" y2="30" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="300" y1="60" x2="300" y2="90" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="300" y1="90" x2="340" y2="90" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="340" y="80" width="60" height="20" rx="3" fill="#1e293b" stroke="#a78bfa" strokeWidth="1.5" />
              <text x="370" y="93" fill="#a78bfa" fontSize="7" textAnchor="middle" fontWeight="bold">R2</text>
              <line x1="400" y1="90" x2="440" y2="90" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="440" y1="30" x2="440" y2="90" stroke="#cbd5e1" strokeWidth="2" />
            </>
          )}

          <line x1="440" y1="60" x2="440" y2="200" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="440" y1="200" x2="60" y2="200" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="60" y1="200" x2="60" y2="100" stroke="#cbd5e1" strokeWidth="2" />

          <circle cx="60" cy="200" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="60" y="203" fill="#38bdf8" fontSize="6" textAnchor="middle" fontWeight="bold">A</text>
          <text x="60" y="225" fill="#38bdf8" fontSize="7" textAnchor="middle">{displayCurrent.toFixed(3)} A</text>

          <rect x="140" y="190" width="24" height="20" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
          <text x="152" y="203" fill="#22c55e" fontSize="6" textAnchor="middle" fontWeight="bold">V</text>
          <text x="152" y="225" fill="#22c55e" fontSize="7" textAnchor="middle">{(vPerResistor * progress).toFixed(1)} V</text>

          {isRunning && electronPhases.map((phase, i) => {
            const pt = getPointOnPath(phase);
            return (
              <motion.circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#fbbf24"
                opacity={0.9}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
              />
            );
          })}

          <text x="230" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">{resistance} Ω each</text>
          <text x="230" y="145" fill="#64748b" fontSize="7" textAnchor="middle">Total R = {totalR.toFixed(1)} Ω</text>
          <text x="230" y="158" fill="#64748b" fontSize="7" textAnchor="middle">I = V/R = {voltage}/{totalR.toFixed(1)} = {current.toFixed(3)} A</text>

          <text x="480" y="135" fill="#475569" fontSize="7" textAnchor="end" transform="rotate(90 480 135)">Akosombo → Load</text>
        </svg>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Simulation Progress</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-yellow-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current</div>
          <div className="text-2xl font-mono font-bold text-cyan-400">{displayCurrent.toFixed(3)} A</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Voltage</div>
          <div className="text-2xl font-mono font-bold text-green-400">{displayVoltage.toFixed(1)} V</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Power Loss</div>
          <div className="text-2xl font-mono font-bold text-red-400">{(powerLoss * progress).toFixed(2)} W</div>
        </div>
      </div>

      {recorded && (
        <div className="w-full max-w-lg rounded-xl border border-green-400/25 bg-green-400/10 p-3 text-center text-xs font-bold uppercase tracking-widest text-green-300">
          Measurement recorded. Change one variable in the control panel and run again.
        </div>
      )}

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Ohm's Law: V = IR. In series circuits, current is the same through all components. In parallel, voltage is the same across branches. Ghana's Akosombo Dam transmits at 161 kV to reduce I, minimizing P = I²R losses in transmission lines.
      </div>
    </div>
  );
}

export default function CircuitLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <CircuitSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgCurrent = trials.length
      ? trials.flatMap(t => t.observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).current ?? 0) : 0)).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">You investigated Ohm's Law across {trials.length} trial{trials.length !== 1 ? 's' : ''}.</p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg Current</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{avgCurrent.toFixed(3)} A</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Trials</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">{trials.length}</div>
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
    <VirtualLabEngine config={CIRCUIT_LAB} renderSimulation={renderSimulation} onComplete={handleComplete} />
  );
}
