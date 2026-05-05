import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, RotateCcw, HelpCircle, ChevronDown, AlertTriangle, FlaskConical, CheckCircle2, XCircle, ArrowRight, Pencil } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { HOOKES_LAW_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const SPRINGS = [
  { id: 'A', k: 22, elasticLimit: 2.8, color: '#38bdf8', label: 'Stiff' },
  { id: 'B', k: 14, elasticLimit: 4.0, color: '#a78bfa', label: 'Medium' },
  { id: 'C', k: 9, elasticLimit: 5.5, color: '#22c55e', label: 'Soft' },
];

type DataPoint = { mass: number; force: number; extension: number };
type Phase = 'predict' | 'collect' | 'reconcile';

interface HookesLawSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function HookesLawSimulation({ variables, isRunning, onRecordData }: HookesLawSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [springId, setSpringId] = useState('A');
  const [mass, setMass] = useState(100);
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [kGuess, setKGuess] = useState('');
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [snapped, setSnapped] = useState(false);

  const [phase, setPhase] = useState<Phase>('predict');
  const [predictionPoints, setPredictionPoints] = useState<{ mass: number; force: number; extension: number }[]>([]);
  const [predictionComplete, setPredictionComplete] = useState(false);
  const [showReconciliation, setShowReconciliation] = useState(false);

  const spring = SPRINGS.find(s => s.id === springId)!;
  const force = Number(((mass / 1000) * 9.81).toFixed(2));
  const rawExt = force / spring.k;
  const overstretched = rawExt > spring.elasticLimit;
  const extension = overstretched ? Number((rawExt * 1.15 + Math.random() * 0.3).toFixed(2)) : Number(rawExt.toFixed(3));

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

  const resetAll = () => {
    setPoints([]); setKGuess(''); setResult(null); setSnapped(false); setMass(100);
    setPhase('predict'); setPredictionPoints([]); setPredictionComplete(false);
    setShowReconciliation(false);
  };

  const addPredictionPoint = (predMass: number) => {
    if (predictionComplete) return;
    const predForce = Number(((predMass / 1000) * 9.81).toFixed(2));
    const predExt = predForce / spring.k;
    setPredictionPoints(prev => [...prev, { mass: predMass, force: predForce, extension: Number(predExt.toFixed(3)) }]);
  };

  const finishPrediction = () => {
    if (predictionPoints.length >= 2) {
      setPredictionComplete(true);
      setPhase('collect');
    }
  };

  const startReconciliation = () => {
    setShowReconciliation(true);
    setPhase('reconcile');
  };

  const maxF = 6; const maxE = 7;
  const gW = 220; const gH = 180; const gX = 290; const gY = 60;

  const predictedLinePoints = predictionPoints.length >= 2 ? (() => {
    const p0 = predictionPoints[0];
    const pN = predictionPoints[predictionPoints.length - 1];
    const x1 = gX + 25 + (p0.force / maxF) * (gW - 35);
    const y1 = gY + gH - 15 - (p0.extension / maxE) * (gH - 25);
    const x2 = gX + 25 + (pN.force / maxF) * (gW - 35);
    const y2 = gY + gH - 15 - (pN.extension / maxE) * (gH - 25);
    return { x1, y1, x2, y2 };
  })() : null;

  const [sketching, setSketching] = useState(false);
  const [sketchPoints, setSketchPoints] = useState<{ x: number; y: number }[]>([]);

  const handleCanvasMouseDown = () => {
    if (phase !== 'predict' || predictionComplete) return;
    setSketching(true);
    setSketchPoints([]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!sketching) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSketchPoints(prev => [...prev, { x, y }]);
  };

  const handleCanvasMouseUp = () => {
    if (!sketching) return;
    setSketching(false);

    if (sketchPoints.length > 10) {
      const convertedPoints = sketchPoints.map(p => {
        const force = ((p.x - gX - 25) / (gW - 35)) * maxF;
        const extension = ((gY + gH - 15 - p.y) / (gH - 25)) * maxE;
        return { mass: Math.round(force / 9.81 * 1000 / 50) * 50, force: Number(force.toFixed(2)), extension: Number(Math.max(0, extension).toFixed(3)) };
      }).filter(p => p.force > 0 && p.extension > 0);

      const uniquePoints: typeof predictionPoints = [];
      const seenForces = new Set<number>();
      convertedPoints.forEach(p => {
        const roundedForce = Math.round(p.force * 10) / 10;
        if (!seenForces.has(roundedForce) && uniquePoints.length < 8) {
          seenForces.add(roundedForce);
          uniquePoints.push(p);
        }
      });

      if (uniquePoints.length >= 2) {
        setPredictionPoints(uniquePoints);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">🔩 Hooke's Law Lab</h2>
          <p className="text-xs text-slate-500 mt-1">Predict, measure, and reconcile — discover the spring constant k.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400">
            <div className="text-[10px] uppercase tracking-widest">Score</div>
            <div className="font-mono text-xl font-bold">{score}</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
            phase === 'predict' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
            phase === 'collect' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
            'bg-green-500/10 text-green-400 border border-green-500/30'
          }`}>
            {phase === 'predict' ? 'Phase 1: Predict' : phase === 'collect' ? 'Phase 2: Collect' : 'Phase 3: Reconcile'}
          </div>
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
            <p><strong className="text-yellow-400">Phase 1 — Predict:</strong> Sketch what you think the Force vs Extension graph will look like by drawing on the graph area.</p>
            <p><strong className="text-cyan-400">Phase 2 — Collect Data:</strong> Add masses to the spring and capture real data points. Compare them to your prediction.</p>
            <p><strong className="text-green-400">Phase 3 — Reconcile:</strong> Compare your prediction sketch with your actual data. Where do they match? Where do they differ? Why?</p>
            <p className="text-xs text-slate-500 italic mt-1">⚠️ Add too much mass and you'll exceed the elastic limit — a surprise worth discovering!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 540 320" className="w-full rounded-2xl bg-[#0a1019]"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}>
            <rect x="160" y="40" width="80" height="10" rx="3" fill="#475569" />
            <rect x="197" y="28" width="6" height="16" fill="#64748b" />

            <motion.path d={springPath} fill="none"
              stroke={snapped ? '#ef4444' : overstretched ? '#f59e0b' : spring.color}
              strokeWidth="4" strokeLinecap="round"
              animate={snapped ? { opacity: [1, 0.5, 1] } : {}} transition={{ repeat: snapped ? Infinity : 0, duration: 0.5 }} />

            <motion.g animate={{ y: snapped ? [0, 5, 0] : 0 }} transition={{ repeat: snapped ? 3 : 0, duration: 0.2 }}>
              <rect x="175" y={massY} width="50" height={30 + mass / 25} rx="6" fill="#e5e7eb" />
              <text x="200" y={massY + 18 + mass / 50} fill="#1e293b" fontSize="10" textAnchor="middle" fontWeight="bold">{mass}g</text>
            </motion.g>

            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line x1="140" y1={baseY + i * 30} x2="148" y2={baseY + i * 30} stroke="#475569" strokeWidth="1" />
                <text x="136" y={baseY + i * 30 + 3} fill="#64748b" fontSize="7" textAnchor="end">{i * 2}</text>
              </g>
            ))}
            <text x="110" y={baseY + 120} fill="#64748b" fontSize="8" transform="rotate(-90 110 170)">Extension (cm)</text>

            <rect x={gX} y={gY} width={gW} height={gH} fill="#020617" stroke="#334155" rx="8" />
            <line x1={gX + 25} y1={gY + gH - 15} x2={gX + gW - 10} y2={gY + gH - 15} stroke="#475569" strokeWidth="1" />
            <line x1={gX + 25} y1={gY + 10} x2={gX + 25} y2={gY + gH - 15} stroke="#475569" strokeWidth="1" />
            <text x={gX + gW / 2} y={gY + gH - 2} fill="#64748b" fontSize="8" textAnchor="middle">Force (N)</text>
            <text x={gX + 8} y={gY + gH / 2} fill="#64748b" fontSize="8" transform={`rotate(-90 ${gX + 8} ${gY + gH / 2})`}>Ext (cm)</text>

            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={gX + 25} y1={gY + 10 + i * ((gH - 25) / 5)} x2={gX + gW - 10} y2={gY + 10 + i * ((gH - 25) / 5)} stroke="#1e293b" strokeWidth="1" />
            ))}

            {phase === 'predict' && !predictionComplete && (
              <>
                <text x={gX + gW / 2} y={gY + gH / 2 - 10} fill="#fbbf24" fontSize="10" textAnchor="middle" opacity={0.6}>
                  <Pencil size={12} className="inline mr-1" /> Draw your prediction here
                </text>
                {sketchPoints.length > 1 && (
                  <polyline
                    points={sketchPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity="0.8"
                    strokeDasharray="6 3" strokeLinecap="round"
                  />
                )}
              </>
            )}

            {predictedLinePoints && (
              <line
                x1={predictedLinePoints.x1} y1={predictedLinePoints.y1}
                x2={predictedLinePoints.x2} y2={predictedLinePoints.y2}
                stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" opacity="0.7"
              />
            )}

            {predictionPoints.map((p, i) => {
              const px = gX + 25 + (p.force / maxF) * (gW - 35);
              const py = gY + gH - 15 - (p.extension / maxE) * (gH - 25);
              return (
                <g key={`pred-${i}`}>
                  <circle cx={px} cy={py} r="5" fill="#fbbf24" opacity="0.6" />
                  <circle cx={px} cy={py} r="8" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
                </g>
              );
            })}

            {points.map((p, i) => {
              const px = gX + 25 + (p.force / maxF) * (gW - 35);
              const py = gY + gH - 15 - (p.extension / maxE) * (gH - 25);
              const isLinear = p.extension <= spring.elasticLimit;
              return (
                <g key={`data-${i}`}>
                  <circle cx={px} cy={py} r="5" fill={isLinear ? '#22c55e' : '#ef4444'} />
                  <circle cx={px} cy={py} r="8" fill="none" stroke={isLinear ? '#22c55e' : '#ef4444'} strokeWidth="1.5" opacity="0.6" />
                </g>
              );
            })}

            {points.filter(p => p.extension <= spring.elasticLimit).length >= 2 && (() => {
              const linear = points.filter(p => p.extension <= spring.elasticLimit);
              const f0 = linear[0]; const fN = linear[linear.length - 1];
              const x1 = gX + 25 + (f0.force / maxF) * (gW - 35);
              const y1 = gY + gH - 15 - (f0.extension / maxE) * (gH - 25);
              const x2 = gX + 25 + (fN.force / maxF) * (gW - 35);
              const y2 = gY + gH - 15 - (fN.extension / maxE) * (gH - 25);
              return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22c55e" strokeWidth="2.5" />;
            })()}
          </svg>
        </div>

        <div className="space-y-4">
          {phase === 'predict' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] border border-yellow-500/30 bg-yellow-500/5 p-5">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Pencil size={14} /> Phase 1: Sketch Your Prediction
              </h3>
              <p className="text-slate-300 text-xs mb-4">
                Before collecting any data, draw what you think the Force vs Extension graph will look like for <strong className="text-white">Spring {springId}</strong>.
                What happens when the spring reaches its elastic limit?
              </p>
              <div className="flex gap-2">
                <button onClick={() => addPredictionPoint(100)} className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:text-white border border-slate-700">
                  Quick: Add (100g)
                </button>
                <button onClick={() => addPredictionPoint(300)} className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:text-white border border-slate-700">
                  Quick: Add (300g)
                </button>
                <button onClick={() => addPredictionPoint(500)} className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:text-white border border-slate-700">
                  Quick: Add (500g)
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Or <strong className="text-yellow-400">draw directly on the graph</strong> by clicking and dragging.</p>
              {predictionPoints.length >= 2 && (
                <button onClick={finishPrediction} className="w-full mt-4 px-4 py-3 bg-yellow-500 text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                  Lock Prediction & Start Collecting <ArrowRight size={14} />
                </button>
              )}
            </motion.div>
          )}

          {phase === 'collect' && (
            <>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">🔬 Phase 2: Collect Data</h3>
                <div className="flex gap-2 mb-4">
                  {SPRINGS.map(s => (
                    <button key={s.id} onClick={() => { setSpringId(s.id); resetAll(); }}
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
                  <div className="rounded-xl border border-slate-800 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Force (F)</div>
                    <div className="mt-1 text-lg font-mono text-white">{force} N</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Extension (e)</div>
                    <div className="mt-1 text-lg font-mono text-white">{extension.toFixed(3)} cm</div>
                  </div>
                </div>
                <div className={`rounded-xl border p-3 text-sm mb-4 ${overstretched ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-green-500/20 bg-green-500/5 text-green-300'}`}>
                  {overstretched ? (
                    <span className="flex items-center gap-2"><AlertTriangle size={14} /> Elastic limit exceeded! The spring is permanently deformed.</span>
                  ) : 'Linear region — Hooke\'s Law holds: F = ke'}
                </div>
                <button onClick={capture} disabled={snapped}
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30">
                  Capture Data Point ({points.length})
                </button>
              </div>

              {points.length >= 3 && (
                <button onClick={startReconciliation}
                  className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-green-400 transition-all flex items-center justify-center gap-2">
                  Phase 3: Reconcile Predictions <ArrowRight size={14} />
                </button>
              )}
            </>
          )}

          {phase === 'reconcile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] border border-green-500/30 bg-green-500/5 p-5">
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">💡 Phase 3: Reconcile</h3>

              <div className="bg-black/30 rounded-xl p-4 border border-slate-800 mb-4">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Your Prediction vs Actual Data</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-yellow-400 font-bold mb-1">Predicted:</div>
                    {predictionPoints.slice(0, 3).map((p, i) => (
                      <div key={i} className="text-slate-400 font-mono">{p.mass}g → F={p.force}N, e={p.extension.toFixed(2)}cm</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-green-400 font-bold mb-1">Actual:</div>
                    {points.slice(0, 3).map((p, i) => (
                      <div key={i} className="text-slate-400 font-mono">{p.mass}g → F={p.force}N, e={p.extension.toFixed(2)}cm</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-4 border border-slate-800 mb-4">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Key Questions</div>
                <div className="space-y-2 text-xs text-slate-400">
                  <p><strong className="text-white">1. Where did your prediction match?</strong> {points.length >= 2 && predictionPoints.length >= 2 ? 'Look at the slope of both lines. Are they similar?' : 'Collect more data to compare.'}</p>
                  <p><strong className="text-white">2. Where did it differ?</strong> Did you predict the elastic limit correctly? Many students think the relationship stays linear forever!</p>
                  <p><strong className="text-white">3. What surprised you?</strong> {snapped ? 'You discovered the elastic limit — the spring no longer follows Hooke\'s Law beyond this point.' : 'Try adding more mass to find the elastic limit.'}</p>
                </div>
              </div>

              {points.filter(p => p.extension <= spring.elasticLimit).length >= 3 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Now calculate the spring constant k from your data:</p>
                  <div className="flex gap-2 mb-3">
                    <input value={kGuess} onChange={e => setKGuess(e.target.value)} placeholder="Estimate k (N/m)"
                      className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2 text-white text-sm" />
                    <button onClick={submitGuess} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black"><Target size={14} /></button>
                  </div>
                  {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`rounded-xl border p-3 text-sm ${result === 'precision' ? 'border-green-500/30 bg-green-500/10 text-green-300' : result === 'close' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                      {result === 'precision' ? '🏆 Spot on!' : result === 'close' ? 'Very close!' : `Actual k for spring ${springId} = ${spring.k} N/m.`}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {points.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Data Table</div>
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-2">#</th><th className="py-2 px-2">Mass</th><th className="py-2 px-2">F (N)</th><th className="py-2 px-2">e (cm)</th></tr>
                </thead>
                <tbody>
                  {points.map((p, i) => (
                    <tr key={i} className={`border-b border-slate-800/50 ${p.extension <= spring.elasticLimit ? 'text-slate-300' : 'text-red-400'}`}>
                      <td className="py-2 px-2">{i + 1}</td>
                      <td className="py-2 px-2">{p.mass}g</td>
                      <td className="py-2 px-2 font-mono">{p.force.toFixed(2)}</td>
                      <td className="py-2 px-2 font-mono">{p.extension.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={resetAll} className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 flex items-center justify-center gap-2 hover:text-white transition-colors">
            <RotateCcw size={14} /> Reset Everything
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