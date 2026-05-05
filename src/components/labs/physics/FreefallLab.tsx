import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import VirtualLabEngine from '../VirtualLabEngine';
import { FREEFALL_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { ArrowDown, RotateCcw, FlaskConical } from 'lucide-react';

const OBJECTS = [
  { name: 'Steel Ball', dragCoeff: 0.01, color: '#94a3b8', radius: 10, mass: 200 },
  { name: 'Tennis Ball', dragCoeff: 0.15, color: '#22c55e', radius: 12, mass: 57 },
  { name: 'Flat Paper', dragCoeff: 0.8, color: '#e2e8f0', radius: 18, mass: 5 },
];

interface FreefallSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function FreefallSimulation({ variables, isRunning, onRecordData }: FreefallSimProps) {
  const height = variables['height'] ?? 2;
  const objectType = Math.round(variables['object-type'] ?? 0);

  const obj = OBJECTS[objectType] ?? OBJECTS[0];
  const g = 9.81;
  const theoreticalTime = Math.sqrt((2 * height) / g);
  const dragEffect = obj.dragCoeff * height;
  const actualTime = theoreticalTime * (1 + dragEffect * 0.3);
  const terminalVelLimit = Math.sqrt((2 * obj.mass * g) / (obj.dragCoeff * 1.225 * 0.01 + 0.001));
  const maxVel = Math.min(g * actualTime, terminalVelLimit);

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [objY, setObjY] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (isRunning && !recorded) {
      startRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const dt = (Date.now() - startRef.current) / 1000;
        const progress = Math.min(dt / actualTime, 1);
        setElapsed(progress * 100);
        setCurrentTime(dt);

        const dragDecel = obj.dragCoeff * progress * progress * 2;
        const effectiveG = g * Math.max(1 - dragDecel, 0.1);
        const fallDist = Math.min(0.5 * effectiveG * dt * dt, height);
        setObjY(fallDist / height);

        if (progress >= 1) {
          clearInterval(intervalRef.current!);
          setElapsed(100);
          setCurrentTime(actualTime);
          setObjY(1);
        }
      }, 16);
    } else if (!isRunning) { clearInterval(intervalRef.current!); }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded, actualTime, height, obj.dragCoeff]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      const measuredG = (2 * height) / (actualTime * actualTime);
      onRecordData({
        height,
        fallTime: parseFloat(actualTime.toFixed(3)),
        objectType: obj.name,
        measuredG: parseFloat(measuredG.toFixed(2)),
        theoreticalTime: parseFloat(theoreticalTime.toFixed(3)),
        dragEffect: obj.dragCoeff,
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0); setRecorded(false); setObjY(0); setCurrentTime(0);
    clearInterval(intervalRef.current!);
  }, [height, objectType]);

  const towerH = 200;
  const towerTop = 30;
  const towerBottom = towerTop + towerH;
  const objVisualY = towerTop + objY * towerH;

  const calcG = currentTime > 0 ? (2 * objY * height) / (currentTime * currentTime) : 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border-cyan-500/30">
        {obj.name} — Drop Height: {height}m — Galileo's Experiment
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 w-full max-w-2xl">
        <svg viewBox="0 0 500 280" className="w-full rounded-2xl bg-[#09121b]">
          <rect x="80" y={towerTop} width="20" height={towerH} fill="#475569" />
          <rect x="75" y={towerTop - 5} width="30" height="8" rx="2" fill="#64748b" />
          <rect x="60" y={towerBottom} width="60" height="8" rx="2" fill="#475569" />

          {Array.from({ length: 5 }).map((_, i) => {
            const markH = height * (i + 1) / 5;
            const markY = towerTop + (i + 1) * towerH / 5;
            return (
              <g key={i}>
                <line x1="55" y1={markY} x2="75" y2={markY} stroke="#64748b" strokeWidth="1" />
                <text x="50" y={markY + 3} fill="#64748b" fontSize="6" textAnchor="end">{markH.toFixed(1)}m</text>
              </g>
            );
          })}

          <line x1="100" y1={towerTop} x2="100" y2={towerBottom} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

          {isRunning && (
            <motion.g animate={{ y: 0 }}>
              <circle cx="90" cy={objVisualY} r={obj.radius} fill={obj.color} opacity={0.9} />
              {objectType === 2 && (
                <rect x={90 - obj.radius} y={objVisualY - 2} width={obj.radius * 2} height="4" rx="1" fill={obj.color} opacity="0.7" />
              )}
            </motion.g>
          )}

          {!isRunning && !recorded && (
            <circle cx="90" cy={towerTop + 10} r={obj.radius} fill={obj.color} opacity={0.6} />
          )}

          {recorded && (
            <circle cx="90" cy={towerBottom - 5} r={obj.radius} fill={obj.color} opacity={0.9} />
          )}

          <rect x="150" y="40" width="140" height="60" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="220" y="62" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">STOPWATCH</text>
          <text x="220" y="85" fill="#22c55e" fontSize="18" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
            {currentTime.toFixed(2)} s
          </text>

          <rect x="150" y="115" width="140" height="50" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="220" y="135" fill="#94a3b8" fontSize="7" textAnchor="middle">HEIGHT FALLEN</text>
          <text x="220" y="155" fill="#38bdf8" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
            {(objY * height).toFixed(2)} m
          </text>

          <rect x="310" y="40" width="170" height="125" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="395" y="60" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">MEASUREMENTS</text>
          <text x="320" y="80" fill="#64748b" fontSize="7">Object: <tspan fill="#e2e8f0">{obj.name}</tspan></text>
          <text x="320" y="95" fill="#64748b" fontSize="7">Height: <tspan fill="#e2e8f0">{height} m</tspan></text>
          <text x="320" y="110" fill="#64748b" fontSize="7">Theoretical t: <tspan fill="#fbbf24">{theoreticalTime.toFixed(3)} s</tspan></text>
          <text x="320" y="125" fill="#64748b" fontSize="7">Actual t: <tspan fill="#22c55e">{actualTime.toFixed(3)} s</tspan></text>
          <text x="320" y="140" fill="#64748b" fontSize="7">Air resistance: <tspan fill="#ef4444">{obj.dragCoeff > 0.1 ? 'Significant' : 'Negligible'}</tspan></text>
          <text x="320" y="155" fill="#64748b" fontSize="7">Calc g: <tspan fill="#a78bfa">{calcG > 0 ? calcG.toFixed(2) : '—'} m/s²</tspan></text>

          <rect x="150" y="180" width="330" height="80" rx="6" fill="#020617" stroke="#334155" strokeWidth="1" />
          <text x="315" y="198" fill="#64748b" fontSize="7" textAnchor="middle">s = ½gt²  →  g = 2s/t²</text>
          <line x1="170" y1="245" x2="460" y2="245" stroke="#475569" strokeWidth="1" />
          <line x1="170" y1="210" x2="170" y2="245" stroke="#475569" strokeWidth="1" />
          <text x="315" y="255" fill="#475569" fontSize="6" textAnchor="middle">Time →</text>
          <text x="162" y="230" fill="#475569" fontSize="6" textAnchor="end" transform="rotate(-90 162 230)">s →</text>

          {isRunning && (
            <>
              <line x1="170" y1="245" x2={170 + (currentTime / actualTime) * 290} y2={245 - objY * 30} stroke={obj.color} strokeWidth="2" />
              <circle cx={170 + (currentTime / actualTime) * 290} cy={245 - objY * 30} r="3" fill={obj.color} />
            </>
          )}

          <text x="90" y={towerBottom + 25} fill="#64748b" fontSize="7" textAnchor="middle">Drop Tower</text>
          <text x="315" y="275" fill="#475569" fontSize="6" textAnchor="middle">Galileo: All objects fall at same rate in vacuum — air resistance causes differences</text>
        </svg>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Drop Progress</span><span>{Math.round(elapsed)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-cyan-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.05 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Fall Time</div>
          <div className="text-2xl font-mono font-bold text-green-400">{currentTime.toFixed(2)} s</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Calc g</div>
          <div className="text-2xl font-mono font-bold text-purple-400">{calcG > 0 ? calcG.toFixed(2) : '—'} m/s²</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Air Drag</div>
          <div className={`text-sm font-bold ${obj.dragCoeff > 0.1 ? 'text-red-400' : 'text-green-400'}`}>{obj.dragCoeff > 0.1 ? 'High' : 'Low'}</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        s = ut + ½at², with u = 0: s = ½gt², so g = 2s/t². Galileo showed all objects fall at the same rate regardless of mass (in vacuum). Air resistance slows flat paper significantly but barely affects a dense steel ball. Always consider drag in real experiments.
      </div>
    </div>
  );
}

export default function FreefallLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <FreefallSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgG = trials.length
      ? trials.flatMap(t => t.observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).measuredG ?? 0) : 0)).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">You investigated free fall across {trials.length} trial{trials.length !== 1 ? 's' : ''}.</p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Average g</div>
            <div className="text-2xl font-mono font-bold text-purple-400">{avgG.toFixed(2)} m/s²</div>
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
    <VirtualLabEngine config={FREEFALL_LAB} renderSimulation={renderSimulation} onComplete={handleComplete} />
  );
}
