import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, RotateCcw, HelpCircle, ChevronDown, AlertTriangle, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { HOOKES_LAW_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const SPRINGS = [
  { id: 'A', k: 22, elasticLimit: 2.8, color: '#38bdf8', label: 'Stiff' },
  { id: 'B', k: 14, elasticLimit: 4.0, color: '#a78bfa', label: 'Medium' },
  { id: 'C', k: 9, elasticLimit: 5.5, color: '#22c55e', label: 'Soft' },
];

type DataPoint = { mass: number; force: number; extension: number };

interface HookesLawSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function HookesLawSimulation({ variables, isRunning, onRecordData }: HookesLawSimProps) {
  const [springId, setSpringId] = useState('A');
  const [mass, setMass] = useState(100);
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [kGuess, setKGuess] = useState('');
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [snapped, setSnapped] = useState(false);

  const spring = SPRINGS.find(s => s.id === springId)!;
  const force = Number(((mass / 1000) * 9.81).toFixed(2));
  const rawExt = force / spring.k;
  const overstretched = rawExt > spring.elasticLimit;
  const extension = overstretched ? Number((rawExt * 1.15 + Math.random() * 0.3).toFixed(2)) : Number(rawExt.toFixed(3));

  // SVG spring coils
  const coilCount = 8;
  const baseY = 60;
  const coilSpacing = (110 + extension * 22) / coilCount;
  const springPath = useMemo(() => {
    let d = `M 200 ${baseY}`;
    for (let i = 0; i < coilCount; i++) {
      const y = baseY + i * coilSpacing;
      d += ` L ${i % 2 === 0 ? 180 : 220} ${y + coilSpacing * 0.5}`;
    }
    d += ` L 200 ${baseY + coilCount * coilSpacing}`;
    return d;
  }, [coilSpacing]);

  const massY = baseY + coilCount * coilSpacing;

  const capture = () => {
    if (snapped) return;
    if (overstretched && !snapped) {
      setSnapped(true);
      setScore(s => s + 1);
    }
    setPoints(prev => [...prev, { mass, force, extension }]);
    setScore(s => s + 3);
  };

  const submitGuess = () => {
    const num = Number(kGuess);
    if (!num) return;
    const diff = Math.abs(num - spring.k);
    if (diff < 1) { setResult('precision'); setScore(s => s + 10); }
    else if (diff < 3) { setResult('close'); setScore(s => s + 5); }
    else setResult('miss');
  };

  const resetSpring = () => {
    setPoints([]); setKGuess(''); setResult(null); setSnapped(false); setMass(100);
  };

  // Graph scaling
  const maxF = 6; const maxE = 7;
  const gW = 220; const gH = 180; const gX = 290; const gY = 60;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">🔩 Hooke's Law Lab</h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Load springs, record extension vs force, and determine the spring constant k.</p>
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
            <p>1. Select a spring and adjust the <strong className="text-white">mass</strong> using the slider.</p>
            <p>2. <strong className="text-white">Capture Data Points</strong> at different masses to build your Force vs Extension table.</p>
            <p>3. Watch the graph build in real-time. The <strong className="text-cyan-400">linear region</strong> obeys Hooke's Law: <code className="text-cyan-400">F = ke</code>.</p>
            <p>4. Determine the <strong className="text-white">spring constant k</strong> from the gradient of your graph.</p>
            <p>5. ⚠️ Add too much mass and you'll exceed the <strong className="text-red-400">elastic limit</strong>!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        {/* SVG: Spring + Graph */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 540 320" className="w-full rounded-2xl bg-[#0a1019]">
            {/* Clamp */}
            <rect x="160" y="40" width="80" height="10" rx="3" fill="#475569" />
            <rect x="197" y="28" width="6" height="16" fill="#64748b" />
            {/* Spring */}
            <motion.path d={springPath} fill="none"
              stroke={snapped ? '#ef4444' : overstretched ? '#f59e0b' : spring.color}
              strokeWidth="4" strokeLinecap="round"
              animate={snapped ? { opacity: [1, 0.5, 1] } : {}} transition={{ repeat: snapped ? Infinity : 0, duration: 0.5 }} />
            {/* Mass block */}
            <motion.g animate={{ y: snapped ? [0, 5, 0] : 0 }} transition={{ repeat: snapped ? 3 : 0, duration: 0.2 }}>
              <rect x="175" y={massY} width="50" height={30 + mass / 25} rx="6" fill="#e5e7eb" />
              <text x="200" y={massY + 18 + mass / 50} fill="#1e293b" fontSize="10" textAnchor="middle" fontWeight="bold">{mass}g</text>
            </motion.g>
            {/* Ruler marks */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line x1="140" y1={baseY + i * 30} x2="148" y2={baseY + i * 30} stroke="#475569" strokeWidth="1" />
                <text x="136" y={baseY + i * 30 + 3} fill="#64748b" fontSize="7" textAnchor="end">{i * 2}</text>
              </g>
            ))}
            <text x="110" y={baseY + 120} fill="#64748b" fontSize="8" transform="rotate(-90 110 170)">Extension (cm)</text>

            {/* Graph area */}
            <rect x={gX} y={gY} width={gW} height={gH} fill="#020617" stroke="#334155" rx="8" />
            {/* Axes */}
            <line x1={gX + 25} y1={gY + gH - 15} x2={gX + gW - 10} y2={gY + gH - 15} stroke="#475569" strokeWidth="1" />
            <line x1={gX + 25} y1={gY + 10} x2={gX + 25} y2={gY + gH - 15} stroke="#475569" strokeWidth="1" />
            <text x={gX + gW / 2} y={gY + gH - 2} fill="#64748b" fontSize="8" textAnchor="middle">Force (N)</text>
            <text x={gX + 8} y={gY + gH / 2} fill="#64748b" fontSize="8" transform={`rotate(-90 ${gX + 8} ${gY + gH / 2})`}>Ext (m)</text>
            <text x={gX + gW / 2} y={gY + 8} fill="#94a3b8" fontSize="9" textAnchor="middle">Extension vs Force</text>
            {/* Grid lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={gX + 25} y1={gY + 10 + i * ((gH - 25) / 5)} x2={gX + gW - 10} y2={gY + 10 + i * ((gH - 25) / 5)} stroke="#1e293b" strokeWidth="1" />
            ))}
            {/* Data points */}
            {points.map((p, i) => {
              const px = gX + 25 + (p.force / maxF) * (gW - 35);
              const py = gY + gH - 15 - (p.extension / maxE) * (gH - 25);
              const isLinear = p.extension <= spring.elasticLimit;
              return (
                <g key={i}>
                  <circle cx={px} cy={py} r="4" fill={isLinear ? '#22c55e' : '#ef4444'} />
                  <circle cx={px} cy={py} r="6" fill="none" stroke={isLinear ? '#22c55e' : '#ef4444'} opacity="0.3" />
                </g>
              );
            })}
            {/* Best-fit line through linear points */}
            {points.filter(p => p.extension <= spring.elasticLimit).length >= 2 && (() => {
              const linear = points.filter(p => p.extension <= spring.elasticLimit);
              const f0 = linear[0]; const fN = linear[linear.length - 1];
              const x1 = gX + 25 + (f0.force / maxF) * (gW - 35);
              const y1 = gY + gH - 15 - (f0.extension / maxE) * (gH - 25);
              const x2 = gX + 25 + (fN.force / maxF) * (gW - 35);
              const y2 = gY + gH - 15 - (fN.extension / maxE) * (gH - 25);
              return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22c55e" strokeWidth="2" strokeDasharray="4 3" />;
            })()}
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Spring Selector</div>
            <div className="flex gap-2 mb-4">
              {SPRINGS.map(s => (
                <button key={s.id} onClick={() => { setSpringId(s.id); resetSpring(); }}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${springId === s.id ? 'text-black' : 'bg-slate-900 text-slate-300'}`}
                  style={springId === s.id ? { backgroundColor: s.color } : {}}>
                  {s.label} ({s.id})
                </button>
              ))}
            </div>
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Mass</span><span className="font-mono text-white">{mass} g</span>
              </div>
              <input type="range" min={50} max={700} step={50} value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Metric label="Force (F)" value={`${force} N`} />
              <Metric label="Extension (e)" value={`${extension.toFixed(3)} m`} />
            </div>
            {/* Elastic limit warning */}
            <div className={`rounded-xl border p-3 text-sm mb-4 ${overstretched ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-green-500/20 bg-green-500/5 text-green-300'}`}>
              {overstretched ? (
                <span className="flex items-center gap-2"><AlertTriangle size={14} /> Elastic limit exceeded! Extension is no longer proportional.</span>
              ) : 'Linear region — Hooke\'s Law holds: F = ke'}
            </div>
            <button onClick={capture} disabled={snapped}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30">
              Capture Data Point ({points.length})
            </button>
          </div>

          {/* Data Table */}
          {points.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Data Table</div>
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-2">#</th><th className="py-2 px-2">Mass (g)</th><th className="py-2 px-2">F (N)</th><th className="py-2 px-2">e (m)</th><th className="py-2 px-2">k=F/e</th></tr>
                </thead>
                <tbody>
                  {points.map((p, i) => {
                    const k = p.force / p.extension;
                    const isLinear = p.extension <= spring.elasticLimit;
                    return (
                      <tr key={i} className={`border-b border-slate-800/50 ${isLinear ? 'text-slate-300' : 'text-red-400'}`}>
                        <td className="py-2 px-2">{i + 1}</td>
                        <td className="py-2 px-2">{p.mass}</td>
                        <td className="py-2 px-2 font-mono">{p.force.toFixed(2)}</td>
                        <td className="py-2 px-2 font-mono">{p.extension.toFixed(3)}</td>
                        <td className="py-2 px-2 font-mono">{isLinear ? k.toFixed(1) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {points.filter(p => p.extension <= spring.elasticLimit).length >= 3 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-2">Gradient of linear region = spring constant k (N/m)</p>
                  <div className="flex gap-2">
                    <input value={kGuess} onChange={e => setKGuess(e.target.value)} placeholder="Estimate k"
                      className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2 text-white text-sm" />
                    <button onClick={submitGuess} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black"><Target size={14} /></button>
                  </div>
                  {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`mt-2 rounded-xl border p-3 text-sm ${result === 'precision' ? 'border-green-500/30 bg-green-500/10 text-green-300' : result === 'close' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                      {result === 'precision' ? '🏆 Spot on! Your spring constant matches the actual value.' : result === 'close' ? 'Close. The gradient of F vs e gives a more precise k.' : `Actual k for spring ${spring.id} = ${spring.k} N/m.`}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          <button onClick={resetSpring} className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 flex items-center justify-center gap-2">
            <RotateCcw size={14} /> Reset Spring
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HookesLawLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <HookesLawSimulation {...props} />;

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
          You investigated Hooke's Law across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
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
      config={HOOKES_LAW_LAB}
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
