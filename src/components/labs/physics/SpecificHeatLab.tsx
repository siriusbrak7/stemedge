import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import VirtualLabEngine from '../VirtualLabEngine';
import { SPECIFIC_HEAT_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Thermometer, RotateCcw, FlaskConical } from 'lucide-react';

const MATERIALS = [
  { name: 'Water', c: 4200, color: '#3b82f6' },
  { name: 'Aluminium', c: 900, color: '#94a3b8' },
  { name: 'Copper', c: 385, color: '#f97316' },
  { name: 'Iron', c: 450, color: '#6b7280' },
];

interface SpecificHeatSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function SpecificHeatSimulation({ variables, isRunning, onRecordData }: SpecificHeatSimProps) {
  const materialIdx = Math.round(variables['material'] ?? 0);
  const mass = variables['mass'] ?? 100;
  const heaterPower = variables['heater-power'] ?? 50;

  const mat = MATERIALS[materialIdx] ?? MATERIALS[0];
  const massKg = mass / 1000;
  const tempRate = heaterPower / (mat.c * massKg);

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [tempHistory, setTempHistory] = useState<{ time: number; temp: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    if (isRunning && !recorded) {
      tickRef.current = 0;
      setTempHistory([]);
      intervalRef.current = setInterval(() => {
        tickRef.current += 1;
        setElapsed(prev => {
          if (prev >= 100) { clearInterval(intervalRef.current!); return 100; }
          return prev + 2;
        });
        setTempHistory(h => {
          const simTime = tickRef.current * 0.5;
          const temp = 25 + tempRate * simTime;
          if (tickRef.current % 4 === 0) return [...h, { time: simTime, temp: Math.min(temp, 100) }];
          return h;
        });
      }, 80);
    } else if (!isRunning) { clearInterval(intervalRef.current!); }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded, tempRate]);

  useEffect(() => {
    const simTime = elapsed * 0.25;
    const finalTemp = Math.min(25 + tempRate * simTime, 100);
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        material: mat.name,
        specificHeat: mat.c,
        finalTemperature: parseFloat(finalTemp.toFixed(1)),
        temperatureRise: parseFloat((finalTemp - 25).toFixed(1)),
        mass,
        heaterPower,
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0); setRecorded(false); setTempHistory([]); tickRef.current = 0;
    clearInterval(intervalRef.current!);
  }, [materialIdx, mass, heaterPower]);

  const progress = elapsed / 100;
  const simTime = elapsed * 0.25;
  const currentTemp = Math.min(25 + tempRate * simTime * progress, 100);
  const tempRise = currentTemp - 25;

  const thermoHeight = Math.min((tempRise / 75) * 100, 100);
  const graphW = 240;
  const graphH = 140;
  const graphX = 260;
  const graphY = 40;
  const maxTime = 25;
  const maxTempDisplay = 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border-orange-500/30">
        {mat.name} — c = {mat.c} J/kg°C — Volta River Temperature Moderation
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 w-full max-w-3xl">
        <svg viewBox="0 0 520 230" className="w-full rounded-2xl bg-[#09121b]">
          <rect x="60" y="60" width="80" height="130" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <rect x="65" y="65" width="70" height="120" rx="4" fill="#0c1220" />

          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <line x1="55" y1={65 + i * 15} x2="60" y2={65 + i * 15} stroke="#475569" strokeWidth="1" />
              <text x="50" y={68 + i * 15} fill="#64748b" fontSize="6" textAnchor="end">{100 - i * 10}</text>
            </g>
          ))}

          <rect x="68" y={185 - thermoHeight * 1.2} width="64" height={thermoHeight * 1.2} rx="3" fill={mat.color} opacity="0.7" />

          <rect x="80" y="130" width="40" height="50" rx="4" fill="#ef4444" opacity="0.8" />
          <rect x="85" y="125" width="30" height="8" rx="2" fill="#64748b" />
          <text x="100" y="133" fill="#94a3b8" fontSize="6" textAnchor="middle">Heater</text>

          <rect x="70" y="75" width="60" height="45" rx="3" fill={mat.color} opacity="0.3" />
          <text x="100" y="98" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontWeight="bold">{mat.name}</text>
          <text x="100" y="108" fill="#94a3b8" fontSize="6" textAnchor="middle">{mass}g</text>

          <text x="100" y="50" fill={mat.color} fontSize="12" textAnchor="middle" fontWeight="bold">{currentTemp.toFixed(1)}°C</text>
          <text x="100" y="215" fill="#94a3b8" fontSize="7" textAnchor="middle">ΔT = {tempRise.toFixed(1)}°C</text>

          <rect x={graphX} y={graphY} width={graphW} height={graphH} fill="#020617" stroke="#334155" rx="6" />
          <line x1={graphX + 25} y1={graphY + graphH - 15} x2={graphX + graphW - 10} y2={graphY + graphH - 15} stroke="#475569" strokeWidth="1" />
          <line x1={graphX + 25} y1={graphY + 5} x2={graphX + 25} y2={graphY + graphH - 15} stroke="#475569" strokeWidth="1" />
          <text x={graphX + graphW / 2} y={graphY + graphH - 2} fill="#64748b" fontSize="7" textAnchor="middle">Time (s)</text>
          <text x={graphX + 8} y={graphY + graphH / 2} fill="#64748b" fontSize="7" transform={`rotate(-90 ${graphX + 8} ${graphY + graphH / 2})`}>Temp (°C)</text>

          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={graphX + 25} y1={graphY + 5 + i * ((graphH - 20) / 5)} x2={graphX + graphW - 10} y2={graphY + 5 + i * ((graphH - 20) / 5)} stroke="#1e293b" strokeWidth="0.5" />
          ))}

          {tempHistory.length >= 2 && (
            <polyline
              fill="none"
              stroke={mat.color}
              strokeWidth="2"
              points={tempHistory.map(p => {
                const px = graphX + 25 + (p.time / maxTime) * (graphW - 35);
                const py = graphY + graphH - 15 - ((p.temp - 25) / (maxTempDisplay - 25)) * (graphH - 20);
                return `${px},${py}`;
              }).join(' ')}
            />
          )}

          {tempHistory.map((p, i) => {
            const px = graphX + 25 + (p.time / maxTime) * (graphW - 35);
            const py = graphY + graphH - 15 - ((p.temp - 25) / (maxTempDisplay - 25)) * (graphH - 20);
            return <circle key={i} cx={px} cy={py} r="2" fill={mat.color} />;
          })}

          <text x={graphX + graphW / 2} y={graphY + graphH - 28} fill="#475569" fontSize="6" textAnchor="middle">Rate: {tempRate.toFixed(2)} °C/s</text>
        </svg>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Heating Progress</span><span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-orange-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Temperature</div>
          <div className="text-2xl font-mono font-bold text-red-400">{currentTemp.toFixed(1)}°C</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Heating Rate</div>
          <div className="text-2xl font-mono font-bold text-orange-400">{tempRate.toFixed(2)}°C/s</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Sp. Heat Cap.</div>
          <div className="text-2xl font-mono font-bold text-blue-400">{mat.c}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Energy In</div>
          <div className="text-2xl font-mono font-bold text-yellow-400">{(heaterPower * simTime * progress).toFixed(0)} J</div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {MATERIALS.map((m, i) => (
          <div key={i} className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${materialIdx === i ? `${m.color === '#3b82f6' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : m.color === '#f97316' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' : m.color === '#6b7280' ? 'text-gray-400 bg-gray-500/10 border-gray-500/30' : 'text-slate-400 bg-slate-500/10 border-slate-500/30'}` : 'text-slate-600 bg-slate-900/30 border-slate-800'}`}>
            {m.name} (c={m.c})
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        E = mcΔT. Specific heat capacity c = E/(mΔT). Water's high c (4200 J/kg°C) means it absorbs lots of energy with small temperature rise. The Volta River moderates Akosombo's climate: water absorbs daytime heat and releases it at night, reducing temperature extremes.
      </div>
    </div>
  );
}

export default function SpecificHeatLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <SpecificHeatSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgTempRise = trials.length
      ? trials.flatMap(t => t.observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).temperatureRise ?? 0) : 0)).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">You investigated specific heat capacity across {trials.length} trial{trials.length !== 1 ? 's' : ''}.</p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg Temp Rise</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{avgTempRise.toFixed(1)}°C</div>
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
    <VirtualLabEngine config={SPECIFIC_HEAT_LAB} renderSimulation={renderSimulation} onComplete={handleComplete} />
  );
}
