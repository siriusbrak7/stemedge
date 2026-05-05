import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Snowflake, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { CRYSTAL_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const SOLUTES = [
  {
    id: 0, name: 'CuSO₄', colour: '#3b82f6', crystalColour: '#60a5fa',
    solubility: (t: number) => 14 + t * 0.45,
  },
  {
    id: 0, name: 'KNO₃', colour: '#a855f7', crystalColour: '#c084fc',
    solubility: (t: number) => 13 + t * 2.1,
  },
  {
    id: 2, name: 'NaCl', colour: '#f8fafc', crystalColour: '#e2e8f0',
    solubility: (t: number) => 35.5 + t * 0.04,
  },
];

interface CrystalPoint {
  x: number;
  y: number;
  size: number;
  rotation: number;
  growth: number;
}

interface CrystalSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function CrystalSimulation({ variables, isRunning, onRecordData }: CrystalSimProps) {
  const solute = Math.round(variables['solute'] ?? 0);
  const temperature = variables['temperature'] ?? 25;
  const waterVolume = variables['water-volume'] ?? 50;

  const [dissolvedMass, setDissolvedMass] = useState(20);
  const [crystals, setCrystals] = useState<CrystalPoint[]>([]);
  const [isGrowing, setIsGrowing] = useState(false);
  const [growTime, setGrowTime] = useState(0);
  const [status, setStatus] = useState<'unsaturated' | 'saturated' | 'supersaturated'>('unsaturated');
  const animRef = useRef<number>(0);

  const soluteData = SOLUTES[Math.min(solute, SOLUTES.length - 1)];
  const maxSolubility = soluteData.solubility(temperature);
  const effectiveSolubility = maxSolubility * (waterVolume / 100);

  useEffect(() => {
    const ratio = dissolvedMass / effectiveSolubility;
    if (ratio < 0.85) setStatus('unsaturated');
    else if (ratio <= 1.05) setStatus('saturated');
    else setStatus('supersaturated');
  }, [dissolvedMass, effectiveSolubility]);

  useEffect(() => {
    setCrystals([]);
    setGrowTime(0);
    setIsGrowing(false);
  }, [solute, temperature]);

  const addSolute = () => {
    setDissolvedMass(prev => Math.min(200, prev + 5));
  };

  const startCrystallization = () => {
    if (status !== 'supersaturated' && dissolvedMass <= effectiveSolubility) return;
    setIsGrowing(true);
    setGrowTime(0);

    const newCrystals: CrystalPoint[] = [];
    const count = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < count; i++) {
      newCrystals.push({
        x: 130 + Math.random() * 140,
        y: 250 + Math.random() * 60,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * 360,
        growth: 0,
      });
    }
    setCrystals(newCrystals);

    const startTime = Date.now();
    const duration = 6000;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setGrowTime(elapsed / 1000);

      setCrystals(prev => prev.map(c => ({
        ...c,
        growth: Math.min(1, progress * 1.5),
        size: (3 + Math.random() * 2) * (1 + progress * 3),
      })));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsGrowing(false);
        const excess = Math.max(0, dissolvedMass - effectiveSolubility);
        const crystalMass = excess * 0.85;
        setDissolvedMass(prev => prev - crystalMass);
        onRecordData({
          solute: soluteData.name,
          temperature,
          solubility: effectiveSolubility.toFixed(1),
          status,
          crystalMass: crystalMass.toFixed(1),
          waterVolume,
        });
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const statusColours = {
    unsaturated: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300' },
    saturated: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300' },
    supersaturated: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300' },
  };
  const sc = statusColours[status];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">
            <Snowflake className="inline mr-2 text-cyan-400" size={24} />
            Crystal Growing &amp; Solubility Lab
          </h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — Solubility curves &amp; crystallisation | Ada salt production</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 400 400" className="w-full rounded-2xl bg-[#0b1018]">
            <rect x="100" y="100" width="200" height="220" rx="6" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <rect x="105" y="110" width="190" height="205" fill={soluteData.colour} opacity={0.12 + (dissolvedMass / 200) * 0.15} rx="3" />

            <rect x="100" y="90" width="200" height="15" rx="4" fill="#475569" stroke="#64748b" strokeWidth="1.5" />

            {crystals.map((c, i) => (
              <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${c.rotation})`}>
                <rect
                  x={-c.size / 2}
                  y={-c.size / 2}
                  width={c.size * c.growth}
                  height={c.size * c.growth}
                  fill={soluteData.crystalColour}
                  opacity={0.6 + c.growth * 0.3}
                  stroke={soluteData.crystalColour}
                  strokeWidth="0.5"
                />
                {c.growth > 0.5 && (
                  <g>
                    <line x1={-c.size * c.growth * 0.3} y1={0} x2={c.size * c.growth * 0.3} y2={0}
                      stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                    <line x1={0} y1={-c.size * c.growth * 0.3} x2={0} y2={c.size * c.growth * 0.3}
                      stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  </g>
                )}
              </g>
            ))}

            {isGrowing && (
              <motion.circle
                cx={200} cy={210}
                r={15 + Math.sin(growTime * 4) * 5}
                fill="none"
                stroke={soluteData.crystalColour}
                strokeWidth="1"
                opacity={0.3}
              />
            )}

            <Thermometer x={330} y={130} width={20} height={160} temperature={temperature} />

            <text x="200" y="385" textAnchor="middle" fill="#475569" fontSize="8">
              Ada salt production — solar evaporation of seawater
            </text>

            <rect x="30" y="20" width="140" height="65" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <text x="100" y="37" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">SOLUBILITY CURVE</text>
            <line x1="40" y1="75" x2="160" y2="75" stroke="#334155" strokeWidth="1" />
            <line x1="40" y1="45" x2="40" y2="75" stroke="#334155" strokeWidth="1" />
            <polyline
              points={Array.from({ length: 8 }, (_, i) => {
                const t = 10 + i * 10;
                const s = soluteData.solubility(t);
                return `${40 + i * 15},${75 - (s / 100) * 30}`;
              }).join(' ')}
              fill="none" stroke={soluteData.colour} strokeWidth="1.5"
            />
            <circle cx={40 + ((temperature - 10) / 70) * 105} cy={75 - (maxSolubility / 100) * 30} r="3" fill="#ef4444" />
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className={`rounded-xl border p-3 text-center ${sc.bg} ${sc.border}`}>
              <div className={`text-xs font-bold uppercase tracking-widest ${sc.text}`}>{status}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Solubility" value={`${effectiveSolubility.toFixed(1)} g`} />
              <Metric label="Dissolved" value={`${dissolvedMass.toFixed(1)} g`} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={addSolute}
                className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white border border-slate-700"
              >
                +5g Solute
              </button>
              <button
                onClick={startCrystallization}
                disabled={isGrowing || dissolvedMass <= effectiveSolubility}
                className="rounded-xl bg-purple-500 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50"
              >
                <Snowflake size={12} className="inline mr-1" /> Crystallise
              </button>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>Temperature: <span className="text-orange-400 font-mono">{temperature}°C</span></p>
              <p>Water: <span className="text-cyan-400 font-mono">{waterVolume} mL</span></p>
              <p>Solute: <span className="text-white font-mono">{soluteData.name}</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              WAEC Note: Solubility = mass of solute (g) dissolved in 100g water at a given temperature.
              At Ada, seawater is pumped into shallow ponds; the hot sun evaporates water, NaCl
              crystallises out because its solubility barely increases with temperature (flat curve).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CrystalLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <CrystalSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
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
          You explored solubility and crystallisation across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <button
          onClick={() => setCompletedSession(null)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
        >
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={CRYSTAL_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-mono text-white">{value}</div>
    </div>
  );
}

function Thermometer({ x, y, width, height, temperature }: { x: number; y: number; width: number; height: number; temperature: number }) {
  const fillHeight = ((temperature - 10) / 70) * (height - 20);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={width / 2} fill="none" stroke="#64748b" strokeWidth="1.5" />
      <rect x={x + 3} y={y + height - fillHeight - 10} width={width - 6} height={fillHeight + 5} rx={(width - 6) / 2} fill="#ef4444" />
      <circle cx={x + width / 2} cy={y + height + 8} r={width / 2 + 2} fill="#ef4444" stroke="#64748b" strokeWidth="1.5" />
      <text x={x + width / 2} y={y - 5} textAnchor="middle" fill="#94a3b8" fontSize="8">{temperature}°C</text>
    </g>
  );
}
