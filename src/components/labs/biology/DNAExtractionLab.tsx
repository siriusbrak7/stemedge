import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { DNA_EXTRACTION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { FlaskConical, RotateCcw } from 'lucide-react';

interface DNAExtractionSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

const SAMPLES = ['Strawberry', 'Banana', 'Onion'];
const SAMPLE_COLORS = ['#ef4444', '#eab308', '#a78bfa'];

function DNAExtractionSimulation({ variables, isRunning, onRecordData }: DNAExtractionSimProps) {
  const sampleType = variables['sample-type'] ?? 0;
  const saltConcentration = variables['salt-concentration'] ?? 5;
  const alcoholTemp = variables['alcohol-temp'] ?? -5;

  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sampleIndex = Math.min(2, Math.max(0, Math.floor(sampleType)));
  const sampleName = SAMPLES[sampleIndex];
  const sampleColor = SAMPLE_COLORS[sampleIndex];

  const saltOptimal = saltConcentration >= 3 && saltConcentration <= 8;
  const tempOptimal = alcoholTemp <= 0;
  const yieldMultiplier = (saltOptimal ? 1 : 0.5) * (tempOptimal ? 1 : 0.6) * (sampleIndex === 0 ? 1.2 : sampleIndex === 1 ? 0.9 : 0.7);
  const dnaYield = Math.round(12 * yieldMultiplier * (0.8 + Math.random() * 0.4));

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          const newElapsed = prev + 1.5;
          setStep(Math.min(4, Math.floor(newElapsed / 20)));
          return newElapsed;
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
        dnaYieldMg: dnaYield,
        sampleType: sampleName,
        saltConcentration,
        alcoholTemp,
        quality: dnaYield >= 10 ? 'high' : dnaYield >= 6 ? 'medium' : 'low',
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setStep(0);
    setRecorded(false);
    clearInterval(intervalRef.current!);
  }, [sampleType, saltConcentration, alcoholTemp]);

  const progress = elapsed / 100;

  const STEPS = [
    'Mash sample',
    'Add salt + detergent',
    'Filter mixture',
    'Add cold alcohol',
    'Observe DNA precipitate',
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
        DNA Extraction — Step {step + 1}/5
      </div>

      <svg width="420" height="340" viewBox="0 0 420 340" className="max-w-full">
        <defs>
          <linearGradient id="beakerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`${sampleColor}60`} />
            <stop offset="100%" stopColor={`${sampleColor}90`} />
          </linearGradient>
          <linearGradient id="alcoholGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa30" />
            <stop offset="100%" stopColor="#60a5fa60" />
          </linearGradient>
        </defs>

        <rect x="120" y="60" width="160" height="220" rx="4" fill="none" stroke="#475569" strokeWidth="2" />
        <rect x="116" y="56" width="168" height="8" rx="2" fill="#475569" />

        {step >= 0 && (
          <motion.rect
            x="124"
            y={280 - (step >= 0 ? 60 : 0)}
            width="152"
            height={step >= 0 ? 60 : 0}
            fill="url(#liquidGrad)"
            animate={{ height: step >= 0 ? 60 : 0, y: 220 }}
            transition={{ duration: 0.8 }}
            rx="2"
          />
        )}

        {step >= 1 && (
          <motion.rect
            x="124"
            y={220 - 40}
            width="152"
            height={40}
            fill={`${sampleColor}40`}
            animate={{ height: 40, y: 180 }}
            transition={{ duration: 0.6 }}
            rx="2"
          />
        )}

        {step >= 2 && (
          <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
            <rect x="124" y="160" width="152" height="120" fill={`${sampleColor}25`} rx="2" />
            <line x1="124" y1="160" x2="276" y2="160" stroke="#475569" strokeWidth="0.5" strokeDasharray="3,3" />
          </motion.g>
        )}

        {step >= 3 && (
          <motion.rect
            x="124"
            y="80"
            width="152"
            height={80 * Math.min(1, (elapsed - 60) / 20)}
            fill="url(#alcoholGrad)"
            animate={{ height: 80 }}
            transition={{ duration: 1.2 }}
            rx="2"
          />
        )}

        {step >= 4 && (
          <motion.g animate={{ opacity: progress }}>
            {Array.from({ length: 5 }, (_, i) => {
              const bx = 160 + i * 22 + Math.sin(i * 2) * 8;
              const by = 155 - i * 6;
              return (
                <motion.g key={`dna-${i}`}>
                  <motion.path
                    d={`M${bx},${by} Q${bx + 8},${by - 12} ${bx + 16},${by} Q${bx + 24},${by + 12} ${bx + 32},${by}`}
                    fill="none"
                    stroke="white"
                    strokeWidth={1.5}
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  />
                  <motion.circle
                    cx={bx + 8}
                    cy={by - 6}
                    r={1.5}
                    fill="#fbbf24"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  />
                  <motion.circle
                    cx={bx + 24}
                    cy={by + 6}
                    r={1.5}
                    fill="#60a5fa"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 + 0.5 }}
                  />
                </motion.g>
              );
            })}
          </motion.g>
        )}

        {step >= 1 && step < 3 && (
          <motion.g animate={{ opacity: 0.7 }}>
            <circle cx="200" cy="210" r="6" fill="#fbbf2440" />
            <circle cx="220" cy="200" r="4" fill="#fbbf2430" />
            <text x="200" y="245" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              NaCl + Detergent
            </text>
          </motion.g>
        )}

        <text x="200" y="310" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
          {sampleName} Sample
        </text>

        <circle cx="80" cy="100" r="8" fill={sampleColor} />
        <text x="80" y="120" textAnchor="middle" fill="#94a3b8" fontSize="8">{sampleName}</text>

        {step >= 3 && (
          <g>
            <rect x="310" y="85" width="60" height="50" rx="4" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,3" />
            <text x="340" y="105" textAnchor="middle" fill="#60a5fa" fontSize="8">Cold</text>
            <text x="340" y="118" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace">
              {alcoholTemp}°C
            </text>
            <motion.path
              d="M310,110 L280,130"
              stroke="#60a5fa"
              strokeWidth={1}
              strokeDasharray="3,2"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </g>
        )}
      </svg>

      <div className="flex gap-2 flex-wrap justify-center max-w-md">
        {STEPS.map((name, idx) => (
          <div
            key={name}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
              idx <= step
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900/40 text-slate-600 border border-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] bg-slate-800">
              {idx < step ? '✓' : idx + 1}
            </span>
            {name}
          </div>
        ))}
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Extraction Progress</span>
            <span>{Math.round(elapsed)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">DNA Yield</div>
          <div className="text-2xl font-mono font-bold text-white">{step >= 4 ? `${dnaYield}` : '—'}<span className="text-xs text-slate-500 ml-1">mg</span></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Salt</div>
          <div className={`text-sm font-bold ${saltOptimal ? 'text-green-400' : 'text-orange-400'}`}>{saltConcentration}%</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Alcohol Temp</div>
          <div className={`text-sm font-bold ${tempOptimal ? 'text-blue-400' : 'text-orange-400'}`}>{alcoholTemp}°C</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        DNA extraction uses salt to clump proteins, detergent to break down cell membranes, and cold alcohol to precipitate DNA (DNA is insoluble in alcohol). Strawberries are octoploid, giving higher yields. WAEC: describe the steps in DNA extraction and explain the role of each reagent.
      </div>
    </div>
  );
}

export default function DNAExtractionLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <DNAExtractionSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const totalYield = observations.reduce((sum, o) => {
      if (typeof o.result === 'object') return sum + Number((o.result as Record<string, unknown>).dnaYieldMg ?? 0);
      return sum;
    }, 0);
    const avgYield = observations.length ? totalYield / observations.length : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <FlaskConical size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You extracted DNA across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg DNA Yield</div>
            <div className="text-2xl font-mono font-bold text-emerald-400">{avgYield.toFixed(1)} mg</div>
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
      config={DNA_EXTRACTION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
