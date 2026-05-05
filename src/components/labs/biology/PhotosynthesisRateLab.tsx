import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { PHOTOSYNTHESIS_RATE_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Sun, RotateCcw } from 'lucide-react';

interface PhotosynthesisRateSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
}

function PhotosynthesisRateSimulation({ variables, isRunning, onRecordData }: PhotosynthesisRateSimProps) {
  const lightIntensity = variables['light-intensity'] ?? 50;
  const co2Concentration = variables['co2-concentration'] ?? 5;
  const temperature = variables['temperature'] ?? 25;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleIdRef = useRef(0);

  const lightFactor = Math.min(1, lightIntensity / 100);
  const co2Factor = Math.min(1, co2Concentration / 10);
  const tempFactor = temperature >= 5 && temperature <= 35
    ? 1 - Math.abs(temperature - 25) / 50
    : temperature > 35 ? Math.max(0.1, 1 - (temperature - 35) / 30) : 0.1;
  const bubbleRate = Math.max(0, Math.round(lightFactor * co2Factor * tempFactor * 12));
  const bubbleInterval = bubbleRate > 0 ? Math.max(100, 2000 / bubbleRate) : 99999;

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

      if (bubbleRate > 0) {
        bubbleRef.current = setInterval(() => {
          const newBubble: Bubble = {
            id: bubbleIdRef.current++,
            x: 195 + Math.random() * 30,
            y: 240,
            r: 2 + Math.random() * 3,
            speed: 1 + Math.random() * 1.5,
          };
          setBubbles(prev => [...prev, newBubble]);
        }, bubbleInterval);
      }
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
      clearInterval(bubbleRef.current!);
    }
    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(bubbleRef.current!);
    };
  }, [isRunning, recorded, bubbleRate, bubbleInterval]);

  useEffect(() => {
    if (!isRunning) return;
    const moveRef = setInterval(() => {
      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed, x: b.x + Math.sin(b.y * 0.05) * 0.3 }))
          .filter(b => b.y > 20)
      );
    }, 50);
    return () => clearInterval(moveRef);
  }, [isRunning]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      clearInterval(bubbleRef.current!);
      onRecordData({
        bubblesPerMinute: bubbleRate * 5,
        lightIntensity,
        co2Concentration,
        temperature,
        limitingFactor: lightFactor < co2Factor && lightFactor < tempFactor
          ? 'light'
          : co2Factor < tempFactor
            ? 'CO2'
            : temperature > 35 || temperature < 5 ? 'temperature' : 'none',
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    setBubbles([]);
    clearInterval(intervalRef.current!);
    clearInterval(bubbleRef.current!);
  }, [lightIntensity, co2Concentration, temperature]);

  const lightColor = lightIntensity > 70 ? '#fbbf24' : lightIntensity > 30 ? '#f59e0b' : '#78716c';
  const lightOpacity = 0.2 + (lightIntensity / 100) * 0.6;

  const limitingFactor = lightFactor < co2Factor && lightFactor < tempFactor
    ? 'Light'
    : co2Factor < tempFactor
      ? 'CO2'
      : temperature > 35 || temperature < 5 ? 'Temperature' : 'None';

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest bg-green-500/10 text-green-400 border-green-500/30">
        Elodea Photosynthesis — {bubbleRate * 5} bubbles/min
      </div>

      <svg width="400" height="320" viewBox="0 0 400 320" className="max-w-full">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e910" />
            <stop offset="100%" stopColor="#0ea5e930" />
          </linearGradient>
          <radialGradient id="lampGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`${lightColor}${Math.round(lightOpacity * 255).toString(16).padStart(2, '0')}`} />
            <stop offset="100%" stopColor={`${lightColor}00`} />
          </radialGradient>
        </defs>

        <rect x="130" y="30" width="180" height="270" rx="6" fill="url(#waterGrad)" stroke="#0ea5e950" strokeWidth="1.5" />
        <rect x="128" y="26" width="184" height="8" rx="2" fill="#475569" />

        {isRunning && (
          <motion.g animate={{ opacity: lightOpacity }}>
            <circle cx="320" cy="60" r="30" fill="url(#lampGrad)" />
            <circle cx="320" cy="60" r="10" fill={lightColor} />
            <line x1="310" y1="60" x2="270" y2="80" stroke={lightColor} strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="320" y1="70" x2="280" y2="100" stroke={lightColor} strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="330" y1="60" x2="270" y2="70" stroke={lightColor} strokeWidth="0.5" strokeDasharray="3,3" />
          </motion.g>
        )}

        <text x="340" y="55" fill="#94a3b8" fontSize="8" fontFamily="monospace">
          {lightIntensity}%
        </text>
        <text x="340" y="65" fill="#64748b" fontSize="7">
          light
        </text>

        <g>
          <path
            d="M170,260 Q175,200 185,180 Q195,160 190,140 Q185,120 192,100 Q198,80 190,60"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M185,260 Q190,210 200,190 Q210,170 205,150 Q200,130 207,110 Q213,90 205,70"
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M200,260 Q205,220 215,200 Q225,180 220,160 Q215,140 222,120 Q228,100 220,80"
            fill="none"
            stroke="#15803d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {[
            { x: 185, y: 120, rx: 6, ry: 3 },
            { x: 205, y: 140, rx: 7, ry: 3 },
            { x: 192, y: 160, rx: 5, ry: 3 },
            { x: 218, y: 110, rx: 6, ry: 3 },
            { x: 200, y: 180, rx: 7, ry: 3 },
            { x: 175, y: 200, rx: 5, ry: 2.5 },
            { x: 210, y: 170, rx: 6, ry: 3 },
          ].map((leaf, i) => (
            <motion.ellipse
              key={i}
              cx={leaf.x}
              cy={leaf.y}
              rx={leaf.rx}
              ry={leaf.ry}
              fill="#22c55e40"
              stroke="#22c55e60"
              strokeWidth="0.5"
              animate={isRunning ? { rotate: [0, 3, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
            />
          ))}
        </g>

        {bubbles.map(b => (
          <motion.circle
            key={b.id}
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill="#67e8f940"
            stroke="#67e8f960"
            strokeWidth="0.5"
            animate={{ cy: b.y, opacity: b.y < 50 ? 0.3 : 0.7 }}
            transition={{ duration: 0.05 }}
          />
        ))}

        <g>
          <rect x="60" y="250" width="30" height="50" rx="4" fill="none" stroke="#64748b" strokeWidth="1" />
          <motion.rect
            x="62"
            y={250 + 45 - (temperature / 50) * 45}
            width="26"
            height={(temperature / 50) * 45}
            rx="3"
            fill={temperature > 35 ? '#ef444440' : temperature < 10 ? '#3b82f640' : '#22c55e40'}
            animate={{
              y: 250 + 45 - (temperature / 50) * 45,
              height: (temperature / 50) * 45,
            }}
          />
          <text x="75" y="240" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            {temperature}°C
          </text>
        </g>

        <text x="220" y="310" textAnchor="middle" fill="#64748b" fontSize="9">
          6CO2 + 6H2O → C6H12O6 + 6O2
        </text>
      </svg>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Simulation Progress</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-green-500"
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Bubble Rate</div>
          <div className="text-2xl font-mono font-bold text-green-400">{bubbleRate * 5}<span className="text-xs text-slate-500 ml-1">/min</span></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Limiting Factor</div>
          <div className="text-sm font-bold text-yellow-400">{limitingFactor}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">CO2</div>
          <div className="text-2xl font-mono font-bold text-cyan-400">{co2Concentration}<span className="text-xs text-slate-500 ml-1">%</span></div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Photosynthesis rate depends on light intensity, CO2 concentration, and temperature. At low light, light is the limiting factor. At high light with low CO2, CO2 becomes limiting. Above 35°C, enzymes denature and the rate drops. WAEC: describe how to investigate the effect of light intensity on the rate of photosynthesis using Elodea and bubble counting.
      </div>
    </div>
  );
}

export default function PhotosynthesisRateLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <PhotosynthesisRateSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const rates = observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).bubblesPerMinute ?? 0) : 0);
    const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
    const maxRate = rates.length ? Math.max(...rates) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <Sun size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You measured photosynthesis rates across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Bubble Rate</div>
            <div className="text-2xl font-mono font-bold text-green-400">{avgRate.toFixed(1)}/min</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Peak Rate</div>
            <div className="text-2xl font-mono font-bold text-yellow-400">{maxRate}/min</div>
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
      config={PHOTOSYNTHESIS_RATE_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
