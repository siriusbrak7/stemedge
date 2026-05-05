import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Flame, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { FLAME_TEST_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const METAL_IONS = [
  { id: 0, name: 'Lithium (Li⁺)', symbol: 'Li', flame: '#ef4444', glow: '#ff6b6b', secondary: '#dc2626' },
  { id: 1, name: 'Sodium (Na⁺)', symbol: 'Na', flame: '#facc15', glow: '#fde047', secondary: '#eab308' },
  { id: 2, name: 'Potassium (K⁺)', symbol: 'K', flame: '#c084fc', glow: '#d8b4fe', secondary: '#a855f7' },
  { id: 3, name: 'Calcium (Ca²⁺)', symbol: 'Ca', flame: '#dc2626', glow: '#f87171', secondary: '#b91c1c' },
  { id: 4, name: 'Copper (Cu²⁺)', symbol: 'Cu', flame: '#22d3ee', glow: '#67e8f9', secondary: '#06b6d4' },
  { id: 5, name: 'Barium (Ba²⁺)', symbol: 'Ba', flame: '#4ade80', glow: '#86efac', secondary: '#16a34a' },
];

const UNKNOWN_INDICES = [0, 2, 4];

interface FlameTestSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function FlameTestSimulation({ variables, isRunning, onRecordData }: FlameTestSimProps) {
  const metalIon = Math.round(variables['metal-ion'] ?? 0);
  const concentration = variables['concentration'] ?? 1.0;

  const [selectedIon, setSelectedIon] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [flameTime, setFlameTime] = useState(0);
  const [testHistory, setTestHistory] = useState<Array<{ ion: number; colour: string }>>([]);
  const [unknownIon, setUnknownIon] = useState(0);
  const [showUnknown, setShowUnknown] = useState(false);
  const [guessInput, setGuessInput] = useState('');
  const [guessResult, setGuessResult] = useState<string | null>(null);
  const animRef = useRef<number>(0);

  const isUnknown = metalIon === 6;
  const currentIon = isUnknown ? unknownIon : selectedIon;
  const ionData = METAL_IONS[currentIon];

  useEffect(() => {
    if (metalIon === 6) {
      setShowUnknown(true);
      setUnknownIon(UNKNOWN_INDICES[Math.floor(Math.random() * UNKNOWN_INDICES.length)]);
      setGuessResult(null);
      setGuessInput('');
    }
  }, [metalIon]);

  useEffect(() => {
    setSelectedIon(Math.min(metalIon, METAL_IONS.length - 1));
  }, [metalIon]);

  useEffect(() => {
    if (!isTesting) return;
    const start = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - start) / 1000;
      setFlameTime(elapsed);
      if (elapsed < 8) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsTesting(false);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isTesting]);

  const performTest = () => {
    setIsTesting(true);
    setFlameTime(0);
    const ion = isUnknown ? unknownIon : selectedIon;
    const record = { ion, colour: METAL_IONS[ion].name };
    setTestHistory(prev => [...prev, record]);
    onRecordData({
      metalIon: METAL_IONS[ion].symbol,
      flameColour: METAL_IONS[ion].name,
      concentration,
    });
  };

  const submitGuess = () => {
    if (!guessInput.trim()) return;
    const correctSymbol = METAL_IONS[unknownIon].symbol;
    if (guessInput.trim().toUpperCase() === correctSymbol.toUpperCase()) {
      setGuessResult('correct');
    } else {
      setGuessResult('incorrect');
    }
  };

  const flickerOffsets = Array.from({ length: 6 }, (_, i) => ({
    dx: Math.sin(flameTime * 8 + i * 1.7) * 3,
    dy: Math.cos(flameTime * 6 + i * 2.3) * 2,
    scale: 0.9 + Math.sin(flameTime * 10 + i * 0.8) * 0.15,
  }));

  const flameIntensity = isTesting ? Math.min(1, flameTime * 2) * Math.max(0.3, 1 - flameTime / 10) : 0;
  const concOpacity = Math.min(1, concentration / 1.0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">
            <Flame className="inline mr-2 text-orange-400" size={24} />
            Flame Test Lab
          </h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry Practical — Identify metal ions by flame colour</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 400 420" className="w-full rounded-2xl bg-[#0b1018]">
            <defs>
              <radialGradient id="flameGlow" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor={ionData.glow} stopOpacity={0.6 * flameIntensity * concOpacity} />
                <stop offset="100%" stopColor={ionData.glow} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="innerFlame" cx="50%" cy="70%" r="40%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.7 * flameIntensity} />
                <stop offset="40%" stopColor={ionData.flame} stopOpacity={0.9 * flameIntensity * concOpacity} />
                <stop offset="100%" stopColor={ionData.secondary} stopOpacity={0.3 * flameIntensity * concOpacity} />
              </radialGradient>
              <filter id="flameBlur">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            <rect x="160" y="300" width="80" height="100" rx="8" fill="#475569" stroke="#64748b" strokeWidth="2" />
            <rect x="175" y="280" width="50" height="25" rx="4" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="185" y="250" width="30" height="35" rx="3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
            <text x="200" y="360" textAnchor="middle" fill="#94a3b8" fontSize="9">BUNSEN</text>
            <text x="200" y="372" textAnchor="middle" fill="#94a3b8" fontSize="9">BURNER</text>

            <line x1="210" y1="250" x2="210" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
            <ellipse cx="210" cy="178" rx="12" ry="6" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="240" y="215" fill="#64748b" fontSize="8">Wire loop</text>

            {flameIntensity > 0 && (
              <>
                <ellipse cx="200" cy="220" rx="70" ry="90" fill="url(#flameGlow)" filter="url(#flameBlur)" />
                {flickerOffsets.map((f, i) => (
                  <motion.ellipse
                    key={i}
                    cx={200 + f.dx}
                    cy={220 - i * 12 + f.dy}
                    rx={18 - i * 1.5}
                    ry={35 - i * 3}
                    fill={i < 2 ? 'url(#innerFlame)' : ionData.flame}
                    opacity={flameIntensity * concOpacity * (1 - i * 0.12)}
                  />
                ))}
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.circle
                    key={`spark-${i}`}
                    cx={200 + Math.sin(flameTime * 12 + i * 2.5) * 15}
                    cy={160 - Math.abs(Math.sin(flameTime * 8 + i * 1.3)) * 40}
                    r={1.5}
                    fill={ionData.glow}
                    opacity={flameIntensity * 0.6}
                  />
                ))}
              </>
            )}

            {!isTesting && (
              <text x="200" y="220" textAnchor="middle" fill="#475569" fontSize="11">
                Click "Dip &amp; Test" to start
              </text>
            )}

            <rect x="30" y="20" width="130" height="110" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <text x="95" y="40" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">FLAME COLOURS</text>
            {METAL_IONS.map((ion, i) => (
              <g key={ion.symbol}>
                <circle cx="50" cy={55 + i * 14} r="4" fill={ion.flame} />
                <text x="60" y={58 + i * 14} fill={ion.flame} fontSize="8">{ion.symbol}</text>
                <text x="80" y={58 + i * 14} fill="#94a3b8" fontSize="7">
                  {ion.name.split('(')[0].trim()}
                </text>
              </g>
            ))}

            <text x="200" y="410" textAnchor="middle" fill="#475569" fontSize="8">
              Ghana Geological Survey — Mineral Identification
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Select Metal Ion</div>
            <div className="grid grid-cols-2 gap-2">
              {METAL_IONS.map((ion) => (
                <button
                  key={ion.id}
                  onClick={() => { if (!isUnknown) setSelectedIon(ion.id); }}
                  disabled={isUnknown}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    (isUnknown ? false : selectedIon === ion.id)
                      ? `border-2 text-white`
                      : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                  style={selectedIon === ion.id && !isUnknown ? { borderColor: ion.flame, backgroundColor: ion.flame + '20' } : {}}
                >
                  <span style={{ color: ion.flame }}>{ion.symbol}</span> {ion.name.split('(')[0].trim()}
                </button>
              ))}
            </div>

            <button
              onClick={performTest}
              disabled={isTesting}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Flame size={14} /> Dip &amp; Test
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Current Ion" value={isUnknown ? 'Unknown' : ionData.symbol} />
              <Metric label="Concentration" value={`${concentration.toFixed(1)} M`} />
            </div>
          </div>

          {isUnknown && (
            <div className="rounded-[2rem] border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-400">Identify the Unknown</div>
              <p className="text-xs text-slate-400">Perform the flame test, observe the colour, then identify the metal ion.</p>
              <div className="flex gap-2">
                <input
                  value={guessInput}
                  onChange={e => setGuessInput(e.target.value)}
                  placeholder="Enter ion symbol (e.g. Li)"
                  className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2 text-white text-sm"
                />
                <button onClick={submitGuess} className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black">Check</button>
              </div>
              {guessResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-xl border p-3 text-sm ${
                    guessResult === 'correct'
                      ? 'border-green-500/30 bg-green-500/10 text-green-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {guessResult === 'correct'
                    ? `Correct! The unknown was ${METAL_IONS[unknownIon].name}`
                    : `Not quite. Try again! Observe the flame colour carefully.`}
                </motion.div>
              )}
            </div>
          )}

          {testHistory.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Test History</div>
              <div className="space-y-2">
                {testHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: METAL_IONS[h.ion].flame }} />
                    <span className="text-slate-300">{METAL_IONS[h.ion].name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              WAEC Note: Clean the wire loop in concentrated HCl between each test. The characteristic colour
              is due to electron transitions — heat excites electrons to higher energy levels; when they fall
              back, they emit light of a wavelength specific to the element. Used at Ghana Geological Survey
              for rapid mineral identification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlameTestLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <FlameTestSimulation {...props} />;

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
          You identified metal ions across {trials.length} trial{trials.length !== 1 ? 's' : ''} using flame tests.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Trials</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{trials.length}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Ions Tested</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">{trials.length}</div>
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
      config={FLAME_TEST_LAB}
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
