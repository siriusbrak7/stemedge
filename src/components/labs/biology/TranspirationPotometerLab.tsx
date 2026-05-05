import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, SunMedium, CloudDrizzle, Wrench, Gauge, HelpCircle, ChevronDown, Play, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { TRANSPIRATION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

type TrialRecord = { trial: number; wind: number; light: number; humidity: number; uptake: number };

interface TranspirationSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function TranspirationSimulation({ variables, isRunning, onRecordData }: TranspirationSimProps) {
  const [assembled, setAssembled] = useState({ shoot: false, capillary: false, reservoir: false, seal: false });
  const [wind, setWind] = useState(30);
  const [light, setLight] = useState(55);
  const [humidity, setHumidity] = useState(45);
  const [trials, setTrials] = useState<TrialRecord[]>([]);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hypothesis, setHypothesis] = useState('');
  const [running, setRunning] = useState(false);
  const [bubblePos, setBubblePos] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<string | null>(null);
  const animRef = useRef<number>(0);

  const ready = Object.values(assembled).every(Boolean);
  const uptake = useMemo(() => {
    const base = 1.4 + light * 0.018 + wind * 0.014 - humidity * 0.012;
    return Math.max(0.3, Number(base.toFixed(2)));
  }, [wind, light, humidity]);

  // Bubble animation
  useEffect(() => {
    if (!running) return;
    const speed = uptake * 0.8;
    const start = performance.now();
    const tick = () => {
      const dt = (performance.now() - start) / 1000;
      const pos = Math.min(100, dt * speed * 8);
      setBubblePos(pos);
      if (pos >= 100) {
        setRunning(false);
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, uptake]);

  const runTrial = () => {
    if (!ready || running) return;
    setBubblePos(0);
    setRunning(true);
    const trialNum = trials.length + 1;
    setTrials(prev => [...prev, { trial: trialNum, wind, light, humidity, uptake }]);
    setScore(s => s + 5);
  };

  const resetBubble = () => { setBubblePos(0); setRunning(false); };

  const submitChallenge = (answer: string) => {
    setChallengeAnswer(answer);
    if (answer === 'light') { setChallengeResult('correct'); setScore(s => s + 8); }
    else if (answer === 'wind') { setChallengeResult('partial'); setScore(s => s + 4); }
    else { setChallengeResult('wrong'); }
  };

  const PARTS: { key: keyof typeof assembled; label: string; desc: string }[] = [
    { key: 'shoot', label: 'Plant Shoot', desc: 'A leafy stem cut underwater to prevent air bubbles entering the xylem.' },
    { key: 'capillary', label: 'Capillary Tube', desc: 'Narrow glass tube where the air bubble moves as water is taken up.' },
    { key: 'reservoir', label: 'Water Reservoir', desc: 'Allows refilling of water to reset the bubble position between trials.' },
    { key: 'seal', label: 'Airtight Seal', desc: 'Vaseline/rubber seals prevent air leaks — essential for accurate readings.' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">🌿 Transpiration Potometer Lab</h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology Practical — Measure the rate of water uptake under different environmental conditions.</p>
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
            <p>1. <strong className="text-white">Assemble</strong> the potometer by clicking each component. Hover to see what it does.</p>
            <p>2. Write a <strong className="text-white">hypothesis</strong> predicting which condition most affects transpiration.</p>
            <p>3. Adjust <strong className="text-cyan-400">wind, light, and humidity</strong> then press <strong className="text-white">Run Trial</strong>.</p>
            <p>4. Watch the <strong className="text-white">air bubble</strong> move along the capillary — faster = higher transpiration rate.</p>
            <p>5. Run <strong className="text-cyan-400">3+ trials</strong> varying ONE factor at a time to answer the challenge question.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        {/* Apparatus */}
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={14} className="text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                {ready ? 'Apparatus Ready ✓' : 'Assembly Required'}
              </span>
            </div>
            <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-[#08131a]">
              {/* Bench */}
              <rect x="30" y="220" width="460" height="40" fill="#374151" rx="4" />
              {/* Capillary tube */}
              <line x1="130" y1="165" x2="390" y2="165" stroke={assembled.capillary ? '#93c5fd' : '#334155'} strokeWidth="6" strokeLinecap="round" />
              {/* Scale markings on capillary */}
              {assembled.capillary && Array.from({ length: 11 }).map((_, i) => (
                <g key={i}>
                  <line x1={130 + i * 26} y1="172" x2={130 + i * 26} y2="178" stroke="#475569" strokeWidth="1" />
                  {i % 2 === 0 && <text x={130 + i * 26} y="188" fill="#64748b" fontSize="7" textAnchor="middle">{i}</text>}
                </g>
              ))}
              {/* Reservoir */}
              <rect x="390" y="145" width="55" height="40" rx="10" fill={assembled.reservoir ? '#60a5fa' : '#334155'} opacity="0.7" />
              {assembled.reservoir && <text x="417" y="170" fill="#1e293b" fontSize="8" textAnchor="middle" fontWeight="bold">H₂O</text>}
              {/* Seal */}
              <rect x="96" y="148" width="24" height="34" rx="8" fill={assembled.seal ? '#f59e0b' : '#334155'} opacity="0.8" />
              {/* Plant shoot */}
              <path d="M60 180 C80 140, 98 110, 108 90" fill="none" stroke={assembled.shoot ? '#22c55e' : '#334155'} strokeWidth="8" strokeLinecap="round" />
              {assembled.shoot && (
                <>
                  <ellipse cx="95" cy="85" rx="20" ry="12" fill="#16a34a" opacity="0.7" />
                  <ellipse cx="115" cy="75" rx="18" ry="10" fill="#22c55e" opacity="0.6" />
                  <ellipse cx="80" cy="95" rx="16" ry="9" fill="#15803d" opacity="0.5" />
                </>
              )}
              {/* Air bubble */}
              {ready && (
                <motion.circle cx={140 + bubblePos * 2.4} cy={165} r="6" fill="#f8fafc"
                  animate={{ cx: 140 + bubblePos * 2.4 }} transition={{ duration: 0.1 }}>
                </motion.circle>
              )}
              {/* Label */}
              <text x="240" y="50" fill="#94a3b8" fontSize="11" textAnchor="middle">
                {ready ? 'Bubble displacement shows water uptake rate' : 'Assemble all 4 components to begin'}
              </text>
            </svg>
          </div>

          {/* Assembly buttons with descriptions */}
          <div className="grid gap-2 sm:grid-cols-2">
            {PARTS.map(({ key, label, desc }) => (
              <button key={key} onClick={() => setAssembled(p => ({ ...p, [key]: !p[key] }))}
                className={`rounded-xl border px-4 py-3 text-left transition-all group ${
                  assembled[key] ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-slate-800 bg-black/30 text-slate-300 hover:border-slate-600'
                }`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wrench size={12} /> {label} {assembled[key] && '✓'}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Hypothesis */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Your Hypothesis</div>
            <textarea value={hypothesis} onChange={e => setHypothesis(e.target.value)} rows={2}
              placeholder="e.g. I predict that increasing wind speed will increase the rate of transpiration because..."
              className="w-full bg-black/30 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white resize-none" />
          </div>

          {/* Environmental controls */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Environmental Controls</div>
            <LabSlider icon={<Wind size={14} />} label="Wind Speed" value={wind} min={0} max={100} onChange={setWind} accent="accent-cyan-400" />
            <LabSlider icon={<SunMedium size={14} />} label="Light Intensity" value={light} min={0} max={100} onChange={setLight} accent="accent-yellow-400" />
            <LabSlider icon={<CloudDrizzle size={14} />} label="Humidity" value={humidity} min={0} max={100} onChange={setHumidity} accent="accent-blue-400" />
          </div>

          {/* Readout + Run */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
              <div className="flex items-center gap-2 text-cyan-300 text-sm"><Gauge size={16} /> Uptake Rate</div>
              <div className="mt-2 text-3xl font-mono font-bold text-white">{uptake} <span className="text-sm text-slate-500">mm/min</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={runTrial} disabled={!ready || running}
                className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30 flex items-center justify-center gap-2">
                <Play size={14} /> Run Trial
              </button>
              <button onClick={resetBubble} className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300"><RotateCcw size={14} /></button>
            </div>
          </div>

          {/* Data Table */}
          {trials.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Data Table</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <tr><th className="py-2 px-2">#</th><th className="py-2 px-2">Wind</th><th className="py-2 px-2">Light</th><th className="py-2 px-2">Humid</th><th className="py-2 px-2">Rate</th></tr>
                  </thead>
                  <tbody>
                    {trials.map(t => (
                      <tr key={t.trial} className="border-b border-slate-800/50 text-slate-300">
                        <td className="py-2 px-2">{t.trial}</td><td className="py-2 px-2">{t.wind}</td>
                        <td className="py-2 px-2">{t.light}</td><td className="py-2 px-2">{t.humidity}</td>
                        <td className="py-2 px-2 font-mono font-bold">{t.uptake}</td>
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
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Inquiry Challenge</div>
              <p className="text-sm text-white mb-3">Which variable had the <strong>greatest effect</strong> on transpiration rate?</p>
              <div className="space-y-2">
                {[{ key: 'light', label: 'Light intensity (opens stomata)' }, { key: 'wind', label: 'Wind speed (steepens diffusion gradient)' }, { key: 'humidity', label: 'Humidity (reduces water potential gradient)' }].map(opt => (
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
              className={`rounded-xl border p-3 text-sm ${challengeResult === 'correct' ? 'border-green-500/30 bg-green-500/10 text-green-300' : challengeResult === 'partial' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
              {challengeResult === 'correct'
                ? '🏆 Correct! Light intensity has the greatest effect because it controls stomatal opening — the primary route for water loss.'
                : challengeResult === 'partial'
                ? 'Good reasoning! Wind does increase transpiration by maintaining the diffusion gradient, but light has a stronger effect because it directly controls stomatal aperture.'
                : 'Not quite. High humidity actually slows transpiration. Light intensity has the greatest effect.'}
            </motion.div>
          )}

          {/* Theory note */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">
            <strong className="text-slate-300">Key Concept:</strong> Transpiration is the evaporation of water from leaf surfaces (stomata). High light opens stomata wider. Wind removes saturated air. High humidity reduces the water potential gradient, slowing evaporation.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TranspirationPotometerLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <TranspirationSimulation {...props} />;

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
          You investigated transpiration across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
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
      config={TRANSPIRATION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}

function LabSlider({ icon, label, value, min, max, onChange, accent }: {
  icon: ReactNode; label: string; value: number; min: number; max: number; onChange: (v: number) => void; accent: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">{icon}{label}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className={`w-full ${accent}`} />
    </div>
  );
}
