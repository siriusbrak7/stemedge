import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Thermometer, Droplets, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { NEUTRALIZATION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const ACIDS = [
  { id: 0, name: 'HCl (strong)', formula: 'HCl', type: 'strong', diprotic: false },
  { id: 1, name: 'CH₃COOH (weak)', formula: 'CH₃COOH', type: 'weak', diprotic: false },
  { id: 2, name: 'H₂SO₄ (diprotic)', formula: 'H₂SO₄', type: 'strong', diprotic: true },
];

interface NeutralizationSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function NeutralizationSimulation({ variables, isRunning, onRecordData }: NeutralizationSimProps) {
  const acidType = Math.round(variables['acid-type'] ?? 0);
  const concentration = variables['concentration'] ?? 1.0;
  const volume = variables['volume'] ?? 50;

  const [isPouring, setIsPouring] = useState(false);
  const [pourProgress, setPourProgress] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [initialTemp] = useState(25);
  const [currentPH, setCurrentPH] = useState(13);
  const [isComplete, setIsComplete] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const animRef = useRef<number>(0);

  const acid = ACIDS[Math.min(acidType, ACIDS.length - 1)];

  const getDeltaT = () => {
    const moles = concentration * (volume / 1000);
    const totalVol = volume * 2;
    const mass = totalVol;
    const baseEnthalpy = acid.type === 'strong' ? -57 : -45;
    const effectiveMoles = acid.diprotic ? moles * 2 : moles;
    const q = Math.abs(baseEnthalpy) * effectiveMoles * 1000;
    return q / (mass * 4.18);
  };

  const deltaT = getDeltaT();
  const maxTemp = initialTemp + deltaT;

  useEffect(() => {
    setCurrentTemp(25);
    setCurrentPH(13);
    setPourProgress(0);
    setIsComplete(false);
    setRecorded(false);
    setIsPouring(false);
  }, [acidType, concentration, volume]);

  const startPouring = () => {
    if (isPouring || isComplete) return;
    setIsPouring(true);
    setPourProgress(0);
    const startTime = Date.now();
    const duration = 4000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setPourProgress(progress);

      const tempProgress = Math.min(1, progress * 1.2);
      const eased = 1 - Math.exp(-tempProgress * 4);
      setCurrentTemp(initialTemp + deltaT * eased);

      if (progress < 0.4) {
        setCurrentPH(13 - progress * 8);
      } else if (progress < 0.6) {
        setCurrentPH(13 - 0.4 * 8 - (progress - 0.4) * 20);
      } else {
        setCurrentPH(Math.max(1, 7 - (progress - 0.6) * 10));
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsPouring(false);
        setIsComplete(true);
        setCurrentTemp(maxTemp);
        setCurrentPH(acid.type === 'strong' ? 7 : 8.5);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isComplete && !recorded) {
      setRecorded(true);
      const moles = concentration * (volume / 1000);
      const effectiveMoles = acid.diprotic ? moles * 2 : moles;
      const totalVol = volume * 2;
      const q = currentTemp > initialTemp ? (totalVol * 4.18 * (currentTemp - initialTemp)) : 0;
      const deltaH = effectiveMoles > 0 ? -(q / effectiveMoles / 1000) : 0;

      onRecordData({
        acid: acid.formula,
        concentration,
        volume,
        deltaT: (currentTemp - initialTemp).toFixed(2),
        maxTemp: currentTemp.toFixed(1),
        finalPH: currentPH.toFixed(1),
        Q: q.toFixed(0),
        deltaH: deltaH.toFixed(1),
      });
    }
  }, [isComplete, recorded, currentTemp, currentPH, acid, concentration, volume, initialTemp, onRecordData]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const thermHeight = 140;
  const thermFill = ((currentTemp - 20) / (maxTemp - 15)) * thermHeight;
  const phColour = currentPH < 4 ? '#ef4444' : currentPH < 7 ? '#eab308' : currentPH <= 8 ? '#22c55e' : '#3b82f6';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">
            <Thermometer className="inline mr-2 text-red-400" size={24} />
            Neutralization &amp; Enthalpy Lab
          </h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — Q = mcΔT | Ashanti lime treatment of acidic soil</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 400 380" className="w-full rounded-2xl bg-[#0b1018]">
            <rect x="120" y="180" width="160" height="140" rx="8" fill="none" stroke="#64748b" strokeWidth="2" />
            <rect x="125" y="185" width="150" height="130" fill={phColour} opacity={0.1 + pourProgress * 0.08} rx="4" />
            <rect x="115" y="168" width="170" height="16" rx="5" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
            <text x="200" y="180" textAnchor="middle" fill="#94a3b8" fontSize="7">Polystyrene cup (insulated)</text>

            <rect x="170" y="100" width="14" height="75" rx="4" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="173" y={100 + thermHeight - thermFill} width="8" height={Math.max(0, thermFill)} rx="3" fill="#ef4444" />
            <circle cx="177" cy="85" r="10" fill="#ef4444" stroke="#cbd5e1" strokeWidth="1.5" />
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i}>
                <line x1="185" y1={105 + i * 14} x2="192" y2={105 + i * 14} stroke="#475569" strokeWidth="1" />
                <text x="195" y={108 + i * 14} fill="#64748b" fontSize="6">{(20 + i * (deltaT + 5) / 4).toFixed(0)}°</text>
              </g>
            ))}

            {isPouring && (
              <>
                <rect x="280" y="50" width="35" height="60" rx="4" fill="none" stroke="#ef4444" strokeWidth="1.5"
                  transform={`rotate(${-20 * (1 - pourProgress)}, 280, 50)`} />
                <rect x="283" y={55 + (1 - pourProgress) * 40} width="29" height={pourProgress * 40} fill="#ef4444" opacity="0.3" rx="2" />
                <motion.line
                  x1="295" y1="108" x2="220" y2="175"
                  stroke="#ef4444" strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity={pourProgress < 0.9 ? 0.7 : 0}
                />
              </>
            )}

            {isComplete && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x="130" y="230" width="140" height="40" rx="8" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
                <text x="200" y="248" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">
                  Q = mcΔT
                </text>
                <text x="200" y="262" textAnchor="middle" fill="#94a3b8" fontSize="8">
                  = {volume * 2}×4.18×{(currentTemp - initialTemp).toFixed(1)}
                </text>
              </motion.g>
            )}

            <text x="200" y="365" textAnchor="middle" fill="#475569" fontSize="8">
              Ashanti region — CaO + 2H⁺ → Ca²⁺ + H₂O (soil treatment)
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Acid Type</div>
            <div className="space-y-2">
              {ACIDS.map(a => (
                <div key={a.id} className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                  acidType === a.id
                    ? 'border-red-500/50 bg-red-500/10 text-red-300'
                    : 'border-slate-700 bg-slate-900 text-slate-500'
                }`}>
                  {a.name}
                </div>
              ))}
            </div>

            <button
              onClick={startPouring}
              disabled={isPouring || isComplete}
              className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Droplets size={14} /> Pour Acid into Base
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Temperature" value={`${currentTemp.toFixed(1)}°C`} />
              <Metric label="pH" value={currentPH.toFixed(1)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="ΔT" value={`${(currentTemp - initialTemp).toFixed(1)}°C`} />
              <Metric label="Q" value={`${(volume * 2 * 4.18 * (currentTemp - initialTemp)).toFixed(0)} J`} />
            </div>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-green-500/20 bg-green-500/5 p-5 space-y-2"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-400">Results</div>
              <p className="text-xs text-slate-300">
                ΔT = <span className="text-white font-mono">{(currentTemp - initialTemp).toFixed(2)}°C</span>
              </p>
              <p className="text-xs text-slate-300">
                Q = mcΔT = <span className="text-white font-mono">{(volume * 2 * 4.18 * (currentTemp - initialTemp)).toFixed(0)} J</span>
              </p>
              <p className="text-xs text-slate-300">
                ΔH = <span className="text-white font-mono">
                  {acid.type === 'strong' ? '≈ -57' : '≈ -45'} kJ/mol
                </span>
              </p>
            </motion.div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              WAEC Note: Q = mcΔT where m = total volume (g), c = 4.18 J/g°C, ΔT = T_max − T_initial.
              For strong acid + strong base, ΔH ≈ −57 kJ/mol (per mole of H₂O formed). In the Ashanti
              region, farmers add CaO (lime) to neutralise acidic soil: CaO + 2H⁺ → Ca²⁺ + H₂O.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NeutralizationLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <NeutralizationSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const avgDeltaT = observations.length
      ? observations.reduce((sum, o) => {
          const r = typeof o.result === 'object' ? o.result as Record<string, unknown> : {};
          return sum + Number(r.deltaT ?? 0);
        }, 0) / observations.length
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
          You measured neutralization enthalpy across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg ΔT</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{avgDeltaT.toFixed(1)}°C</div>
          </div>
        </div>
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
      config={NEUTRALIZATION_LAB}
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
