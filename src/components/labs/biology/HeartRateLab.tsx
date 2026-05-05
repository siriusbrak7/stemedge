import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { HEART_RATE_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Heart, RotateCcw } from 'lucide-react';

interface HeartRateSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

const ACTIVITY_LABELS = ['Resting', 'Walking', 'Jogging', 'Sprinting'];
const ACTIVITY_RATES = [72, 95, 130, 170];

function HeartRateSimulation({ variables, isRunning, onRecordData }: HeartRateSimProps) {
  const activityLevel = variables['activity-level'] ?? 0;
  const duration = variables['duration'] ?? 5;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [beatPhase, setBeatPhase] = useState(0);
  const [ecgPoints, setEcgPoints] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ecgRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const actIdx = Math.min(3, Math.max(0, Math.floor(activityLevel)));
  const heartRate = ACTIVITY_RATES[actIdx];
  const activityLabel = ACTIVITY_LABELS[actIdx];
  const beatInterval = 60000 / heartRate;
  const recoveryTime = Math.max(1, Math.round((heartRate - 72) / 10 * duration * 0.3));

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return prev + 1.5;
        });
      }, 80);

      beatRef.current = setInterval(() => {
        setBeatPhase(prev => (prev + 1) % 4);
      }, Math.max(100, beatInterval / 4));

      ecgRef.current = setInterval(() => {
        setEcgPoints(prev => {
          const next = [...prev];
          const cyclePos = (next.length % 80) / 80;
          let val = 0;
          if (cyclePos > 0.1 && cyclePos < 0.15) val = 15;
          else if (cyclePos > 0.15 && cyclePos < 0.2) val = -5;
          else if (cyclePos > 0.2 && cyclePos < 0.25) val = 60 - Math.abs(cyclePos - 0.225) * 800;
          else if (cyclePos > 0.25 && cyclePos < 0.3) val = -10 + (cyclePos - 0.25) * 200;
          else if (cyclePos > 0.35 && cyclePos < 0.5) val = 8 * Math.sin((cyclePos - 0.35) / 0.15 * Math.PI);
          next.push(val);
          if (next.length > 240) next.splice(0, next.length - 240);
          return next;
        });
      }, 50);
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
      clearInterval(beatRef.current!);
      clearInterval(ecgRef.current!);
    }
    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(beatRef.current!);
      clearInterval(ecgRef.current!);
    };
  }, [isRunning, recorded, beatInterval]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      clearInterval(beatRef.current!);
      clearInterval(ecgRef.current!);
      onRecordData({
        heartRateBpm: heartRate,
        activityLevel: activityLabel,
        duration,
        recoveryTimeMin: recoveryTime,
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    setBeatPhase(0);
    setEcgPoints([]);
    clearInterval(intervalRef.current!);
    clearInterval(beatRef.current!);
    clearInterval(ecgRef.current!);
  }, [activityLevel, duration]);

  const heartScale = beatPhase === 1 ? 1.12 : beatPhase === 2 ? 1.05 : 0.95;
  const activityColor = actIdx === 0 ? '#22c55e' : actIdx === 1 ? '#eab308' : actIdx === 2 ? '#f97316' : '#ef4444';

  const renderECG = () => {
    if (ecgPoints.length < 2) return null;
    const width = 360;
    const height = 80;
    const step = width / 240;
    const points = ecgPoints.slice(-240).map((val, i) => {
      const x = i * step;
      const y = height / 2 - val * (height / 140);
      return `${x},${y}`;
    });
    return (
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest" style={{ color: activityColor, backgroundColor: `${activityColor}15`, borderColor: `${activityColor}40` }}>
        {activityLabel} — {heartRate} BPM
      </div>

      <div className="flex gap-10 items-center justify-center flex-wrap">
        <svg width="220" height="220" viewBox="0 0 220 220" className="max-w-full">
          <motion.g
            animate={{ scale: isRunning ? heartScale : 1, originX: '110px', originY: '110px' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <path
              d="M110,80 C110,50 70,20 50,50 C30,80 50,120 110,170 C170,120 190,80 170,50 C150,20 110,50 110,80 Z"
              fill={`${activityColor}30`}
              stroke={activityColor}
              strokeWidth="2.5"
            />
            <path
              d="M90,100 L100,85 L108,105 L118,75 L128,100"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>

          {isRunning && beatPhase === 1 && (
            <motion.circle
              cx="110"
              cy="110"
              r="50"
              fill="none"
              stroke={activityColor}
              strokeWidth="1"
              initial={{ r: 40, opacity: 0.6 }}
              animate={{ r: 80, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <text x="110" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            {heartRate} beats/min
          </text>
        </svg>

        <div className="flex flex-col gap-4 min-w-[160px]">
          {ACTIVITY_LABELS.map((label, idx) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                idx === actIdx ? 'border-slate-600 bg-slate-800/80' : 'border-slate-800 bg-slate-900/40 opacity-50'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: idx === 0 ? '#22c55e' : idx === 1 ? '#eab308' : idx === 2 ? '#f97316' : '#ef4444' }} />
              <div>
                <span className={`text-xs font-bold ${idx === actIdx ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                <span className="text-[10px] text-slate-500 ml-2">{ACTIVITY_RATES[idx]} bpm</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">ECG Trace</div>
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-hidden">
          <svg width="100%" height="80" viewBox="0 0 360 80" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="360" y2="40" stroke="#1e293b" strokeWidth="0.5" />
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="80" stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {renderECG()}
          </svg>
        </div>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Simulation Progress</span>
            <span>{Math.round(elapsed)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: activityColor }}
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Heart Rate</div>
          <div className="text-2xl font-mono font-bold" style={{ color: activityColor }}>{heartRate}<span className="text-xs text-slate-500 ml-1">bpm</span></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Duration</div>
          <div className="text-2xl font-mono font-bold text-white">{duration}<span className="text-xs text-slate-500 ml-1">min</span></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Recovery</div>
          <div className="text-2xl font-mono font-bold text-cyan-400">{recoveryTime}<span className="text-xs text-slate-500 ml-1">min</span></div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Heart rate increases with exercise to deliver more oxygen and glucose to muscles and remove CO2. The SAN (sino-atrial node) generates electrical impulses that spread across the atria, causing contraction. WAEC: explain how physical activity affects heart rate and describe the role of the pacemaker.
      </div>
    </div>
  );
}

export default function HeartRateLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <HeartRateSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const rates = observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).heartRateBpm ?? 0) : 0);
    const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
    const maxRate = rates.length ? Math.max(...rates) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <Heart size={48} className="text-red-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You measured heart rate across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Heart Rate</div>
            <div className="text-2xl font-mono font-bold text-red-400">{avgRate.toFixed(0)} bpm</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Peak Rate</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{maxRate} bpm</div>
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
      config={HEART_RATE_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
