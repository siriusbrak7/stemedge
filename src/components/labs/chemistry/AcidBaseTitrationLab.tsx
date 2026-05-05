import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Pipette, RotateCcw, HelpCircle, ChevronDown, CheckCircle2, FlaskConical, Target } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { ACID_BASE_TITRATION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

type Indicator = 'phenolphthalein' | 'methyl-orange';
type TrialRecord = { trial: number; initial: number; final: number; titre: number; indicator: string };

interface AcidBaseTitrationSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function AcidBaseTitrationSimulation({ variables, isRunning, onRecordData }: AcidBaseTitrationSimProps) {
  const [indicator, setIndicator] = useState<Indicator>('phenolphthalein');
  const [volumeAdded, setVolumeAdded] = useState(0);
  const [roughMode, setRoughMode] = useState(true);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState<TrialRecord[]>([]);
  const [trialNum, setTrialNum] = useState(1);
  const [initialReading, setInitialReading] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [molarityGuess, setMolarityGuess] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [dropping, setDropping] = useState(false);

  const analyteConc = 0.10; // mol/dm³ NaOH
  const analyteVol = 25.0;  // cm³
  const titrantConc = 0.10; // mol/dm³ HCl
  const equivalenceVol = (analyteConc * analyteVol) / titrantConc; // = 25.0 cm³

  const currentPH = useMemo(() => {
    const delta = volumeAdded - equivalenceVol;
    if (Math.abs(delta) < 0.15) return 7.0;
    return delta < 0 ? Math.max(1.0, 7 + delta * 0.42) : Math.min(13.0, 7 + delta * 0.48);
  }, [volumeAdded]);

  const flaskColor = useMemo(() => {
    if (indicator === 'phenolphthalein') {
      if (currentPH > 10) return 'rgba(236,72,153,0.7)';
      if (currentPH > 8.2) return `rgba(236,72,153,${(currentPH - 8.2) / 4})`;
      return 'rgba(255,255,255,0.05)';
    }
    if (currentPH < 3.2) return 'rgba(239,68,68,0.65)';
    if (currentPH < 4.4) return `rgba(245,${68 + (currentPH - 3.2) * 75},${68 - (currentPH - 3.2) * 30},0.55)`;
    return 'rgba(245,158,11,0.55)';
  }, [indicator, currentPH]);

  const atEndpoint = useMemo(() => {
    if (indicator === 'phenolphthalein') return currentPH >= 8.2 && currentPH <= 10;
    return currentPH >= 3.2 && currentPH <= 4.4;
  }, [indicator, currentPH]);

  const addDrop = () => {
    const increment = roughMode ? 1.0 : 0.10;
    setDropping(true);
    setTimeout(() => setDropping(false), 400);
    setVolumeAdded(v => Number(Math.min(50, v + increment).toFixed(1)));
    setScore(s => s + 1);
  };

  const recordTitre = () => {
    const titre = Number((volumeAdded - initialReading).toFixed(2));
    const accuracy = Math.abs(titre - equivalenceVol);
    let bonus = 0;
    if (accuracy <= 0.10) bonus = 8;
    else if (accuracy <= 0.30) bonus = 5;
    else if (accuracy <= 1.0) bonus = 2;
    setScore(s => s + bonus);
    setTrials(t => [...t, { trial: trialNum, initial: initialReading, final: volumeAdded, titre, indicator }]);
    setTrialNum(n => n + 1);
    setInitialReading(0);
    setVolumeAdded(0);
  };

  const concordantTitres = useMemo(() => {
    if (trials.length < 2) return null;
    for (let i = 0; i < trials.length; i++) {
      for (let j = i + 1; j < trials.length; j++) {
        if (Math.abs(trials[i].titre - trials[j].titre) <= 0.10) {
          return ((trials[i].titre + trials[j].titre) / 2).toFixed(2);
        }
      }
    }
    return null;
  }, [trials]);

  const submitMolarity = () => {
    const guess = Number(molarityGuess);
    if (!guess) return;
    const diff = Math.abs(guess - analyteConc);
    if (diff < 0.005) { setCalcResult('precision'); setScore(s => s + 10); }
    else if (diff < 0.02) { setCalcResult('close'); setScore(s => s + 5); }
    else setCalcResult('miss');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">🧪 Acid-Base Titration Lab</h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry Practical — Titrate HCl against NaOH to determine concentration.</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Trial</div>
            <div className="font-semibold text-white">{trialNum}</div>
          </div>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400">
            <div className="text-[10px] uppercase tracking-widest">Score</div>
            <div className="font-mono text-xl font-bold">{score}</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <button onClick={() => setShowInstructions(!showInstructions)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <HelpCircle size={14} /><span className="uppercase tracking-widest font-bold">How to Play</span>
        <ChevronDown size={14} className={`transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 space-y-1">
            <p>1. Choose an <strong className="text-white">indicator</strong> and use <strong className="text-white">Rough mode</strong> first to find the approximate endpoint.</p>
            <p>2. Switch to <strong className="text-white">Accurate mode</strong> (0.10 cm³ drops) and titrate carefully near the endpoint.</p>
            <p>3. <strong className="text-white">Record your titre</strong> when the indicator changes colour permanently.</p>
            <p>4. Run at least 2 trials. Get <strong className="text-cyan-400">concordant titres</strong> (within 0.10 cm³) to unlock the calculation step.</p>
            <p>5. Calculate the molarity of the analyte using <code className="text-cyan-400">C₁V₁ = C₂V₂</code>.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        {/* Apparatus SVG */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 500 360" className="w-full rounded-2xl bg-[#0b1018]">
            {/* Retort stand */}
            <rect x="80" y="20" width="6" height="320" fill="#64748b" />
            <rect x="50" y="330" width="100" height="10" rx="3" fill="#475569" />
            {/* Clamp */}
            <rect x="84" y="30" width="40" height="8" rx="3" fill="#94a3b8" />
            {/* Burette body */}
            <rect x="110" y="38" width="22" height="180" rx="6" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            {/* Burette liquid level */}
            <rect x="113" y={42 + volumeAdded * 3.2} width="16" height={Math.max(0, 172 - volumeAdded * 3.2)} fill="rgba(147,197,253,0.5)" rx="3" />
            {/* Burette scale marks */}
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <line x1="133" y1={42 + i * 34} x2="140" y2={42 + i * 34} stroke="#475569" strokeWidth="1" />
                <text x="144" y={46 + i * 34} fill="#64748b" fontSize="8">{(i * 10).toFixed(0)}</text>
              </g>
            ))}
            {/* Stopcock */}
            <rect x="116" y="218" width="10" height="6" rx="2" fill={dropping ? '#22c55e' : '#94a3b8'} />
            {/* Burette tip */}
            <line x1="121" y1="224" x2="121" y2="245" stroke="#cbd5e1" strokeWidth="2" />
            {/* Drop animation */}
            {dropping && (
              <motion.circle cx="121" initial={{ cy: 245, r: 3, opacity: 1 }} animate={{ cy: 290, r: 2, opacity: 0 }}
                transition={{ duration: 0.4 }} fill="#93c5fd" />
            )}
            {/* Conical flask */}
            <motion.g animate={dropping ? { rotate: [0, -2, 2, 0] } : {}} transition={{ duration: 0.5 }}
              style={{ transformOrigin: '320px 320px' }}>
              <path d="M270 270 L230 340 L410 340 L370 270 Z" fill={flaskColor} stroke="#cbd5e1" strokeWidth="2" />
              <rect x="280" y="250" width="80" height="22" rx="4" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            </motion.g>
            {/* Endpoint flash */}
            {atEndpoint && (
              <motion.circle cx="320" cy="310" r="30" fill="none" stroke="#22c55e" strokeWidth="2"
                animate={{ r: [25, 35], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
            )}
            {/* Labels */}
            <text x="90" y="16" fill="#94a3b8" fontSize="10">Burette ({volumeAdded.toFixed(1)} cm³)</text>
            <text x="270" y="246" fill="#94a3b8" fontSize="10">{analyteVol} cm³ NaOH + {indicator}</text>
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setRoughMode(true)} className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${roughMode ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-300'}`}>Rough (1 cm³)</button>
              <button onClick={() => setRoughMode(false)} className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${!roughMode ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-300'}`}>Accurate (0.1 cm³)</button>
            </div>
            <div className="flex gap-2">
              {(['phenolphthalein', 'methyl-orange'] as Indicator[]).map(ind => (
                <button key={ind} onClick={() => { setIndicator(ind); setVolumeAdded(0); }}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${indicator === ind ? 'bg-pink-400 text-black' : 'bg-slate-900 text-slate-300'}`}>
                  {ind === 'phenolphthalein' ? 'Phenolphthalein' : 'Methyl Orange'}
                </button>
              ))}
            </div>
            <button onClick={addDrop} className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black flex items-center justify-center gap-2">
              <Droplets size={14} /> Open Stopcock
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Volume Added" value={`${volumeAdded.toFixed(1)} cm³`} />
              <Metric label="pH" value={currentPH.toFixed(1)} />
            </div>
            {atEndpoint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-sm text-green-300 text-center font-bold">
                🎯 Endpoint detected! Record your titre now.
              </motion.div>
            )}
            <div className="flex gap-2">
              <button onClick={recordTitre} className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black">Record Titre</button>
              <button onClick={() => { setVolumeAdded(0); }} className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300"><RotateCcw size={16} /></button>
            </div>
          </div>

          {/* Results Table */}
          {trials.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Titre Records</div>
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-2">Trial</th><th className="py-2 px-2">Initial</th><th className="py-2 px-2">Final</th><th className="py-2 px-2">Titre</th></tr>
                </thead>
                <tbody>
                  {trials.map(t => (
                    <tr key={t.trial} className="border-b border-slate-800/50 text-slate-300">
                      <td className="py-2 px-2">{t.trial === 1 ? 'Rough' : `Acc. ${t.trial - 1}`}</td>
                      <td className="py-2 px-2">{t.initial.toFixed(2)}</td>
                      <td className="py-2 px-2">{t.final.toFixed(2)}</td>
                      <td className="py-2 px-2 font-mono">{t.titre.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {concordantTitres && (
                <div className="mt-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-sm text-cyan-300">
                  ✅ Concordant titre: <strong className="font-mono">{concordantTitres} cm³</strong>. Calculate molarity below!
                </div>
              )}
              {concordantTitres && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-2">C₁V₁ = C₂V₂ → C₂ = (C₁ × V₁) / V₂</p>
                  <div className="flex gap-2">
                    <input value={molarityGuess} onChange={e => setMolarityGuess(e.target.value)} placeholder="Molarity (mol/dm³)"
                      className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2 text-white text-sm" />
                    <button onClick={submitMolarity} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black"><Target size={14} /></button>
                  </div>
                  {calcResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`mt-2 rounded-xl border p-3 text-sm ${calcResult === 'precision' ? 'border-green-500/30 bg-green-500/10 text-green-300' : calcResult === 'close' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                      {calcResult === 'precision' ? '🏆 Excellent calculation!' : calcResult === 'close' ? 'Close! Check your arithmetic.' : `Expected: ${analyteConc.toFixed(2)} mol/dm³`}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AcidBaseTitrationLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <AcidBaseTitrationSimulation {...props} />;

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
          You completed {trials.length} titration trial{trials.length !== 1 ? 's' : ''}.
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
      config={ACID_BASE_TITRATION_LAB}
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
