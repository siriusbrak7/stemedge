import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import VirtualLabEngine from '../VirtualLabEngine';
import { ELECTROMAGNET_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Magnet, RotateCcw, FlaskConical } from 'lucide-react';

const CORE_MATERIALS = [
  { name: 'Air', factor: 0.1, color: '#475569' },
  { name: 'Soft Iron', factor: 1.0, color: '#94a3b8' },
  { name: 'Steel', factor: 0.6, color: '#6b7280' },
];

interface ElectromagnetSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ElectromagnetSimulation({ variables, isRunning, onRecordData }: ElectromagnetSimProps) {
  const current = variables['current'] ?? 2;
  const turns = variables['turns'] ?? 50;
  const coreIdx = Math.round(variables['core-material'] ?? 1);

  const core = CORE_MATERIALS[coreIdx] ?? CORE_MATERIALS[1];
  const clipsPickedUp = Math.round(current * (turns / 50) * core.factor * 5);
  const fieldStrength = current * turns * core.factor;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [visibleClips, setVisibleClips] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) { clearInterval(intervalRef.current!); return 100; }
          return prev + 2;
        });
      }, 80);
    } else if (!isRunning) { clearInterval(intervalRef.current!); }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded]);

  useEffect(() => {
    const target = Math.round(clipsPickedUp * (elapsed / 100));
    setVisibleClips(target);
  }, [elapsed, clipsPickedUp]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        current,
        turns,
        coreMaterial: core.name,
        clipsPickedUp,
        fieldStrength: parseFloat(fieldStrength.toFixed(1)),
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0); setRecorded(false); setVisibleClips(0);
    clearInterval(intervalRef.current!);
  }, [current, turns, coreIdx]);

  const coilTurns = Math.min(turns / 10, 10);
  const coilElements = Array.from({ length: Math.round(coilTurns) }).map((_, i) => i);

  const fieldLineCount = Math.min(Math.round(fieldStrength / 15), 8);
  const fieldLines = Array.from({ length: fieldLineCount }).map((_, i) => i);

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border-red-500/30">
        {core.name} Core — {turns} Turns — Tema Harbour Scrap Cranes
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 w-full max-w-3xl">
        <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-[#09121b]">
          <rect x="140" y="50" width="30" height="160" rx="4" fill={core.color} opacity="0.6" stroke={core.color} strokeWidth="1" />
          <text x="155" y="140" fill="#0f172a" fontSize="7" textAnchor="middle" fontWeight="bold" transform="rotate(-90 155 140)">{core.name} Core</text>

          {coilElements.map((i) => {
            const y = 55 + i * (150 / coilElements.length);
            const h = 140 / coilElements.length;
            return (
              <ellipse key={i} cx="155" cy={y + h / 2} rx="35" ry={h / 2.5} fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.8" />
            );
          })}

          <rect x="30" y="90" width="100" height="30" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="80" y="108" fill="#22c55e" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{current}A</text>
          <text x="80" y="80" fill="#64748b" fontSize="6" textAnchor="middle">AMMETER</text>

          <line x1="30" y1="105" x2="30" y2="50" stroke="#f59e0b" strokeWidth="2" />
          <line x1="30" y1="50" x2="120" y2="50" stroke="#f59e0b" strokeWidth="2" />
          <line x1="120" y1="50" x2="120" y2="55" stroke="#f59e0b" strokeWidth="2" />
          <line x1="190" y1="50" x2="280" y2="50" stroke="#f59e0b" strokeWidth="2" />
          <line x1="280" y1="50" x2="280" y2="105" stroke="#f59e0b" strokeWidth="2" />
          <line x1="280" y1="105" x2="190" y2="105" stroke="#f59e0b" strokeWidth="2" />
          <line x1="120" y1="105" x2="130" y2="105" stroke="#f59e0b" strokeWidth="2" />

          <rect x="30" y="95" width="16" height="20" rx="3" fill="#1e293b" stroke="#ef4444" strokeWidth="1" />
          <text x="38" y="108" fill="#ef4444" fontSize="5" textAnchor="middle">+</text>
          <rect x="114" y="95" width="16" height="20" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
          <text x="122" y="108" fill="#3b82f6" fontSize="5" textAnchor="middle">−</text>

          {isRunning && fieldLines.map((i) => {
            const offset = (i - fieldLineCount / 2 + 0.5) * 18;
            return (
              <g key={i} opacity={elapsed / 100}>
                <path d={`M 190 ${130 + offset} Q 250 ${130 + offset - 15 * Math.sign(offset)} 310 ${130 + offset}`} fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
                <path d={`M 120 ${130 + offset} Q 60 ${130 + offset - 15 * Math.sign(offset)} 10 ${130 + offset}`} fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
                <polygon points={`310,${130 + offset} 305,${130 + offset - 3} 305,${130 + offset + 3}`} fill="#a78bfa" opacity="0.6" />
                <polygon points={`10,${130 + offset} 15,${130 + offset - 3} 15,${130 + offset + 3}`} fill="#a78bfa" opacity="0.6" />
              </g>
            );
          })}

          <AnimatePresence>
            {Array.from({ length: visibleClips }).map((_, i) => {
              const col = i % 5;
              const row = Math.floor(i / 5);
              const x = 350 + col * 14;
              const y = 80 + row * 10;
              const delay = i * 0.08;
              return (
                <motion.rect
                  key={i}
                  x={x} y={y} width="10" height="5" rx="1"
                  fill="#94a3b8" stroke="#64748b" strokeWidth="0.5"
                  initial={{ y: 230, opacity: 0 }}
                  animate={{ y, opacity: 1 }}
                  transition={{ duration: 0.4, delay }}
                />
              );
            })}
          </AnimatePresence>

          <text x="380" y="70" fill="#64748b" fontSize="7" textAnchor="middle">Paper Clips</text>
          <text x="380" y="240" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">{visibleClips} / {clipsPickedUp}</text>

          <rect x="320" y="220" width="120" height="45" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="380" y="238" fill="#94a3b8" fontSize="7" textAnchor="middle">Field Strength</text>
          <text x="380" y="255" fill="#a78bfa" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{(fieldStrength * (elapsed / 100)).toFixed(0)} A·turns</text>

          <text x="260" y="275" fill="#475569" fontSize="6" textAnchor="middle">Tema Harbour: Electromagnets switch ON to lift scrap, OFF to release</text>
        </svg>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Magnetisation Progress</span><span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-red-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Clips Picked</div>
          <div className="text-2xl font-mono font-bold text-amber-400">{visibleClips}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current</div>
          <div className="text-2xl font-mono font-bold text-green-400">{current} A</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">B ∝ nI</div>
          <div className="text-2xl font-mono font-bold text-purple-400">{fieldStrength.toFixed(0)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Core</div>
          <div className="text-sm font-bold text-slate-300">{core.name}</div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {CORE_MATERIALS.map((m, i) => (
          <div key={i} className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${coreIdx === i ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-slate-600 bg-slate-900/30 border-slate-800'}`}>
            {m.name} (×{m.factor})
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Magnetic field B ∝ nI (turns × current). Soft iron core concentrates field lines, making the electromagnet much stronger. Steel retains magnetism (permanent magnet) but is weaker as an electromagnet core. Tema Harbour cranes use electromagnets because they can switch ON/OFF to grab and release scrap metal.
      </div>
    </div>
  );
}

export default function ElectromagnetLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ElectromagnetSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgClips = trials.length
      ? trials.flatMap(t => t.observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).clipsPickedUp ?? 0) : 0)).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">You investigated electromagnet strength across {trials.length} trial{trials.length !== 1 ? 's' : ''}.</p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg Clips</div>
            <div className="text-2xl font-mono font-bold text-amber-400">{avgClips.toFixed(0)}</div>
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
    <VirtualLabEngine config={ELECTROMAGNET_LAB} renderSimulation={renderSimulation} onComplete={handleComplete} />
  );
}
