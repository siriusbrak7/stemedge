import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { ECOSYSTEM_ENERGY_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { TreePine, RotateCcw } from 'lucide-react';

interface EcosystemEnergySimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

const TROPHIC_LEVELS = [
  { name: 'Producer (Grass)', color: '#22c55e', icon: '🌿' },
  { name: 'Primary Consumer (Kob)', color: '#eab308', icon: '🦌' },
  { name: 'Secondary Consumer (Lion)', color: '#ef4444', icon: '🦁' },
];

function EcosystemEnergySimulation({ variables, isRunning, onRecordData }: EcosystemEnergySimProps) {
  const producerEnergy = variables['producer-energy'] ?? 1000;
  const transferEff = variables['transfer-efficiency'] ?? 10;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [flowParticles, setFlowParticles] = useState<Array<{ id: number; x: number; y: number; vy: number }>>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleIdRef = useRef(0);

  const eff = transferEff / 100;
  const primaryEnergy = Math.round(producerEnergy * eff);
  const secondaryEnergy = Math.round(primaryEnergy * eff);
  const energies = [producerEnergy, primaryEnergy, secondaryEnergy];

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

      particleRef.current = setInterval(() => {
        setFlowParticles(prev => {
          const newId = particleIdRef.current++;
          const updated = [
            ...prev.map(p => ({ ...p, y: p.y + p.vy })),
            { id: newId, x: 120 + Math.random() * 60, y: 60, vy: 1.5 + Math.random() },
          ].filter(p => p.y < 300);
          return updated.slice(-30);
        });
      }, 200);
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
      clearInterval(particleRef.current!);
    }
    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(particleRef.current!);
    };
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      clearInterval(particleRef.current!);
      onRecordData({
        producerEnergy,
        primaryConsumerEnergy: primaryEnergy,
        secondaryConsumerEnergy: secondaryEnergy,
        transferEfficiency: transferEff,
        energyLost: producerEnergy - primaryEnergy - Math.round(producerEnergy * (1 - eff) * 0.4),
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    setFlowParticles([]);
    clearInterval(intervalRef.current!);
    clearInterval(particleRef.current!);
  }, [producerEnergy, transferEff]);

  const progress = elapsed / 100;
  const maxEnergy = Math.max(producerEnergy, 1);
  const barWidth = (energy: number) => (energy / maxEnergy) * 200;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border-amber-500/30">
        Ghana Savanna — Energy Flow
      </div>

      <svg width="420" height="320" viewBox="0 0 420 320" className="max-w-full">
        <defs>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e40" />
            <stop offset="100%" stopColor="#22c55e10" />
          </linearGradient>
          <linearGradient id="kobGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eab30840" />
            <stop offset="100%" stopColor="#eab30810" />
          </linearGradient>
          <linearGradient id="lionGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef444440" />
            <stop offset="100%" stopColor="#ef444410" />
          </linearGradient>
        </defs>

        <text x="30" y="40" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">kJ</text>

        {TROPHIC_LEVELS.map((level, idx) => {
          const y = 50 + idx * 90;
          const w = isRunning ? barWidth(energies[idx]) * progress : barWidth(energies[idx]) * 0.3;
          const h = 60;

          return (
            <g key={level.name}>
              <motion.rect
                x="50"
                y={y}
                width={Math.max(10, w)}
                height={h}
                rx="6"
                fill={`url(#${idx === 0 ? 'grass' : idx === 1 ? 'kob' : 'lion'}Grad)`}
                stroke={level.color}
                strokeWidth="1.5"
                animate={{ width: Math.max(10, isRunning ? barWidth(energies[idx]) * progress : barWidth(energies[idx]) * 0.3) }}
                transition={{ duration: 0.8 }}
              />
              <text x="60" y={y + 25} fill="white" fontSize="13" fontWeight="bold">{level.icon}</text>
              <text x="85" y={y + 25} fill="white" fontSize="11" fontWeight="bold">{level.name}</text>
              <text x="60" y={y + 45} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                {isRunning ? Math.round(energies[idx] * progress) : '—'} kJ
              </text>
            </g>
          );
        })}

        {isRunning && flowParticles.map(p => (
          <motion.circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r="2"
            fill="#fbbf24"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.8 }}
          />
        ))}

        {TROPHIC_LEVELS.slice(0, -1).map((_, idx) => {
          const arrowY = 110 + idx * 90;
          return (
            <g key={`arrow-${idx}`}>
              <motion.line
                x1="260"
                y1={arrowY - 10}
                x2="260"
                y2={arrowY + 20}
                stroke="#fbbf24"
                strokeWidth="2"
                animate={{ opacity: isRunning ? 0.8 : 0.2 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <motion.polygon
                points="255,110 265,110 260,120"
                fill="#fbbf24"
                animate={{ opacity: isRunning ? 0.8 : 0.2 }}
                style={{ transform: `translate(0px, ${idx * 90}px)` }}
              />
              <text x="275" y={arrowY + 5} fill="#fbbf24" fontSize="9" fontFamily="monospace">
                {transferEff}% →
              </text>
              <text x="275" y={arrowY + 18} fill="#64748b" fontSize="8">
                {100 - transferEff}% lost
              </text>
            </g>
          );
        })}

        <text x="210" y="310" textAnchor="middle" fill="#64748b" fontSize="9">
          Transfer efficiency: {transferEff}% per level
        </text>
      </svg>

      <div className="flex gap-3 flex-wrap justify-center">
        {TROPHIC_LEVELS.map((level, idx) => (
          <div
            key={level.name}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]"
          >
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{level.name.split('(')[0].trim()}</div>
            <div className="text-lg font-mono font-bold" style={{ color: level.color }}>
              {isRunning ? Math.round(energies[idx] * progress) : '—'}<span className="text-xs text-slate-500 ml-1">kJ</span>
            </div>
          </div>
        ))}
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Energy Flow Progress</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-amber-500"
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transfer Eff.</div>
          <div className="text-2xl font-mono font-bold text-amber-400">{transferEff}%</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Energy Lost</div>
          <div className="text-2xl font-mono font-bold text-red-400">{100 - transferEff}%</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Only about 10% of energy transfers between trophic levels; the rest is lost as heat, respiration, and egestion. This limits food chain length. In Ghana, kob antelope graze savanna grasses and lions prey on kob. WAEC: explain why food chains rarely exceed 4 trophic levels, using the 10% rule.
      </div>
    </div>
  );
}

export default function EcosystemEnergyLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <EcosystemEnergySimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const avgEff = observations.length
      ? observations.reduce((sum, o) => sum + (typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).transferEfficiency ?? 0) : 0), 0) / observations.length
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <TreePine size={48} className="text-amber-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You explored energy flow across {trials.length} trial{trials.length !== 1 ? 's' : ''} in the savanna ecosystem.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Transfer Eff.</div>
            <div className="text-2xl font-mono font-bold text-amber-400">{avgEff.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Observations</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">{observations.length}</div>
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
      config={ECOSYSTEM_ENERGY_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
