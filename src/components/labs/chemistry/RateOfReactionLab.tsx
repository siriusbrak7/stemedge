import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, HelpCircle, ChevronDown, Thermometer, Layers3, Target, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { RATE_OF_REACTION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

type TrialRecord = { conc: number; temp: number; sa: number; time50: number; rate: number };

interface RateOfReactionSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function RateOfReactionSimulation({ variables, isRunning, onRecordData }: RateOfReactionSimProps) {
  const [concentration, setConcentration] = useState(40);
  const [temperature, setTemperature] = useState(25);
  const [surfaceArea, setSurfaceArea] = useState(50);
  const [reacting, setReacting] = useState(false);
  const [gasVolume, setGasVolume] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [trials, setTrials] = useState<TrialRecord[]>([]);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef(0);

  // Rate model: higher values = faster gas production
  const rateConstant = useMemo(() => 0.3 + concentration * 0.02 + temperature * 0.018 + surfaceArea * 0.015, [concentration, temperature, surfaceArea]);
  const maxGas = 100;

  useEffect(() => {
    if (!reacting) return;
    startRef.current = performance.now();
    const tick = () => {
      const dt = (performance.now() - startRef.current) / 1000;
      setElapsed(dt);
      // Asymptotic gas collection: V = Vmax * (1 - e^(-k*t))
      const vol = maxGas * (1 - Math.exp(-rateConstant * dt * 0.08));
      setGasVolume(Number(vol.toFixed(1)));
      if (vol >= maxGas - 0.5) {
        setReacting(false);
      } else {
        animRef.current = requestAnimationFrame(tick);
      }
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [reacting, rateConstant]);

  const startReaction = () => {
    setGasVolume(0); setElapsed(0); setReacting(true);
  };

  const recordTrial = () => {
    // Time to collect 50 cm³
    const time50 = elapsed > 0 ? Number((-Math.log(1 - 50 / maxGas) / (rateConstant * 0.08)).toFixed(1)) : 0;
    const rate = time50 > 0 ? Number((50 / time50).toFixed(2)) : 0;
    setTrials(prev => [...prev, { conc: concentration, temp: temperature, sa: surfaceArea, time50, rate }]);
    setScore(s => s + 3);
    setReacting(false);
  };

  const submitChallenge = (answer: string) => {
    setChallengeAnswer(answer);
    // All three factors increase rate; temperature has the strongest effect (Arrhenius)
    if (answer === 'temperature') { setChallengeResult('correct'); setScore(s => s + 8); }
    else { setChallengeResult('partial'); setScore(s => s + 3); }
  };

  // SVG syringe fill
  const syringeWidth = 180;
  const fillWidth = (gasVolume / maxGas) * syringeWidth;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">⚡ Rate of Reaction Lab</h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — React marble chips (CaCO₃) with HCl and measure gas collection rate.</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400">
          <div className="text-[10px] uppercase tracking-widest">Score</div>
          <div className="font-mono text-xl font-bold">{score}</div>
        </div>
      </div>

      <button onClick={() => setShowInstructions(!showInstructions)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <HelpCircle size={14} /><span className="uppercase tracking-widest font-bold">How to Play</span>
        <ChevronDown size={14} className={`transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 space-y-1">
            <p>1. Adjust <strong className="text-white">concentration</strong>, <strong className="text-white">temperature</strong>, and <strong className="text-white">surface area</strong>.</p>
            <p>2. Press <strong className="text-white">Start Reaction</strong> to add marble chips to the acid. Watch the gas syringe fill.</p>
            <p>3. <strong className="text-white">Record the trial</strong> to log the time to collect 50 cm³ of CO₂.</p>
            <p>4. Run <strong className="text-cyan-400">at least 3 trials</strong> varying one factor at a time to answer the challenge.</p>
            <p className="text-xs text-slate-500 italic">CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        {/* Apparatus SVG */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 520 320" className="w-full rounded-2xl bg-[#0a0f16]">
            {/* Flask */}
            <path d="M80 170 L160 170 L185 290 L55 290 Z" fill="rgba(59,130,246,0.12)" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="95" y="148" width="50" height="24" rx="4" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            {/* Marble chips */}
            {Array.from({ length: Math.floor(surfaceArea / 15) + 2 }).map((_, i) => (
              <motion.circle key={i} cx={90 + i * 14} cy={255 - i * 5} r={surfaceArea > 50 ? 4 : 6}
                fill="#d1d5db" animate={reacting ? { cy: [255 - i * 5, 250 - i * 5, 255 - i * 5] } : {}}
                transition={{ repeat: reacting ? Infinity : 0, duration: 0.6 + i * 0.1 }} />
            ))}
            {/* Bubbles */}
            {reacting && Array.from({ length: 8 }).map((_, i) => (
              <motion.circle key={`b${i}`} cx={100 + Math.random() * 40} r={2 + Math.random() * 3}
                fill="rgba(255,255,255,0.2)" initial={{ cy: 250 }} animate={{ cy: 170, opacity: [0.4, 0] }}
                transition={{ duration: 1.2 + i * 0.2, repeat: Infinity, delay: i * 0.15 }} />
            ))}
            {/* Delivery tube */}
            <line x1="145" y1="148" x2="145" y2="130" stroke="#94a3b8" strokeWidth="3" />
            <line x1="145" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="3" />
            <line x1="280" y1="130" x2="280" y2="145" stroke="#94a3b8" strokeWidth="3" />
            {/* Gas syringe */}
            <rect x="270" y="145" width={syringeWidth + 20} height="40" rx="16" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            <motion.rect x="275" y="150" width={fillWidth} height="30" rx="12" fill="#86efac" opacity="0.6"
              animate={{ width: fillWidth }} transition={{ duration: 0.3 }} />
            {/* Syringe plunger */}
            <rect x={275 + fillWidth} y="150" width="8" height="30" rx="3" fill="#94a3b8" />
            {/* Scale markings */}
            {[0, 25, 50, 75, 100].map(v => {
              const x = 275 + (v / maxGas) * syringeWidth;
              return <g key={v}>
                <line x1={x} y1="188" x2={x} y2="195" stroke="#475569" strokeWidth="1" />
                <text x={x} y="205" fill="#64748b" fontSize="8" textAnchor="middle">{v}</text>
              </g>;
            })}
            <text x="370" y="220" fill="#94a3b8" fontSize="10" textAnchor="middle">Volume (cm³)</text>
            {/* Timer display */}
            <text x="400" y="130" fill="#e2e8f0" fontSize="14" fontFamily="monospace">{elapsed.toFixed(1)}s</text>
            {/* Live readout */}
            <text x="80" y="310" fill="#94a3b8" fontSize="10">Gas collected: {gasVolume.toFixed(0)} cm³</text>
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <RangeCtrl label="HCl Concentration (%)" value={concentration} min={10} max={100} onChange={setConcentration} color="accent-red-400" />
            <RangeCtrl label="Temperature (°C)" value={temperature} min={10} max={60} onChange={setTemperature} color="accent-orange-400" />
            <RangeCtrl label="Surface Area (chip size)" value={surfaceArea} min={10} max={100} onChange={setSurfaceArea} color="accent-cyan-400" />
            <div className="flex gap-2">
              <button onClick={startReaction} disabled={reacting}
                className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30 flex items-center justify-center gap-2">
                <Play size={14} /> Start Reaction
              </button>
              <button onClick={recordTrial} disabled={!reacting && gasVolume < 10}
                className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30">
                Record Trial
              </button>
            </div>
          </div>

          {/* Collision Theory Panel */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Collision Theory</div>
            <div className="text-sm text-slate-400 space-y-1">
              <p>⬆ <strong className="text-white">Concentration</strong> → more particles → more frequent collisions</p>
              <p>🌡 <strong className="text-white">Temperature</strong> → faster particles → more energetic collisions (Arrhenius)</p>
              <p>🔨 <strong className="text-white">Surface area</strong> → more exposed reactant → more collision sites</p>
            </div>
          </div>

          {/* Data Table */}
          {trials.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Data Table</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <tr><th className="py-2 px-1">#</th><th className="py-2 px-1">Conc</th><th className="py-2 px-1">Temp</th><th className="py-2 px-1">SA</th><th className="py-2 px-1">t₅₀ (s)</th><th className="py-2 px-1">Rate</th></tr>
                  </thead>
                  <tbody>
                    {trials.map((t, i) => (
                      <tr key={i} className="border-b border-slate-800/50 text-slate-300">
                        <td className="py-2 px-1">{i + 1}</td>
                        <td className="py-2 px-1">{t.conc}%</td>
                        <td className="py-2 px-1">{t.temp}°C</td>
                        <td className="py-2 px-1">{t.sa}</td>
                        <td className="py-2 px-1 font-mono">{t.time50}</td>
                        <td className="py-2 px-1 font-mono">{t.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Challenge */}
          {trials.length >= 3 && !challengeAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-cyan-500/30 bg-cyan-500/5 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Challenge Question</div>
              <p className="text-sm text-white mb-3">Based on collision theory, which single factor has the <strong>greatest effect</strong> on reaction rate?</p>
              <div className="space-y-2">
                {[{ key: 'concentration', label: 'Concentration' }, { key: 'temperature', label: 'Temperature (Arrhenius effect)' }, { key: 'surface-area', label: 'Surface Area' }].map(opt => (
                  <button key={opt.key} onClick={() => submitChallenge(opt.key)}
                    className="w-full text-left bg-black/30 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 hover:border-cyan-500/30 hover:text-white transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {challengeResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-xl border p-3 text-sm ${challengeResult === 'correct' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'}`}>
              {challengeResult === 'correct'
                ? '🏆 Correct! Temperature has the strongest effect — it increases both collision frequency AND energy (Arrhenius equation).'
                : 'Good thought! All three increase rate, but temperature has the strongest effect because it increases both collision frequency AND the proportion of particles exceeding activation energy.'}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RateOfReactionLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <RateOfReactionSimulation {...props} />;

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
          You investigated reaction rates across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <button onClick={() => setCompletedSession(null)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={RATE_OF_REACTION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}

function RangeCtrl({ label, value, min, max, onChange, color }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>{label}</span><span className="font-mono text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className={`w-full ${color}`} />
    </div>
  );
}
