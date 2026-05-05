import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'density' | 'pressure' | 'upthrust';

const MATERIALS = [
  { name: 'Cork', density: 200, color: '#d4a574' },
  { name: 'Wood', density: 600, color: '#a3754e' },
  { name: 'Water', density: 1000, color: '#38bdf8' },
  { name: 'Aluminium', density: 2700, color: '#94a3b8' },
  { name: 'Iron', density: 7870, color: '#64748b' },
  { name: 'Gold', density: 19300, color: '#fbbf24' },
];

export default function PropertiesOfMatter() {
  const [module, setModule] = useState<Module>('density');
  const [objDensity, setObjDensity] = useState(800);
  const [depth, setDepth] = useState(50);
  const [objVolume, setObjVolume] = useState(0.002);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const fluidDensity = 1000; // water
  const sinks = objDensity > fluidDensity;
  const floatLevel = sinks ? 100 : Math.round((objDensity / fluidDensity) * 100);
  const pressure = (fluidDensity * 9.81 * (depth / 100)).toFixed(0); // Pa, depth in m
  const upthrust = (fluidDensity * objVolume * 9.81).toFixed(2); // N
  const weight = (objDensity * objVolume * 9.81).toFixed(2);
  const netForce = (Number(weight) - Number(upthrust)).toFixed(2);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">⚖️ Properties of Matter</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Density, fluid pressure, and Archimedes' principle.</p>
        </div>
        <div className="flex gap-1">
          {([['density', '📏 Density'], ['pressure', '💧 Pressure'], ['upthrust', '🚢 Upthrust']] as [Module, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setModule(id)}
              className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${module === id ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {module === 'density' && (
          <motion.div key="density" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Float or Sink?</div>
              <svg viewBox="0 0 400 260" className="w-full rounded-2xl bg-[#08121c]">
                {/* Water */}
                <rect x="60" y="100" width="280" height="140" rx="8" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="80" y="120" fill="#38bdf8" fontSize="8" opacity="0.5">Water (ρ = 1000 kg/m³)</text>
                {/* Object */}
                <motion.rect x="165" width="70" height="50" rx="8"
                  fill={sinks ? '#64748b' : '#f8fafc'} stroke={sinks ? '#475569' : '#e2e8f0'} strokeWidth="2"
                  animate={{ y: sinks ? 170 : 100 - (100 - floatLevel) * 0.5 }}
                  transition={{ type: 'spring', stiffness: 60 }} />
                <motion.text x="200" textAnchor="middle" fontSize="10" fill={sinks ? '#e2e8f0' : '#1e293b'} fontWeight="bold"
                  animate={{ y: sinks ? 200 : 130 - (100 - floatLevel) * 0.5 }}>
                  {objDensity} kg/m³
                </motion.text>
                {/* Status */}
                <text x="200" y="255" fill={sinks ? '#fca5a5' : '#86efac'} fontSize="12" textAnchor="middle" fontWeight="bold">
                  {sinks ? '⬇ SINKS' : `⬆ FLOATS (${floatLevel}% submerged)`}
                </text>
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Object Density (kg/m³)</span><span className="font-mono text-white">{objDensity}</span></div>
                <input type="range" min={100} max={20000} step={100} value={objDensity} onChange={e => setObjDensity(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Material Densities</div>
                <div className="space-y-2">
                  {MATERIALS.map(m => (
                    <div key={m.name} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-sm text-white flex-1">{m.name}</span>
                      <span className="text-xs font-mono text-slate-400">{m.density} kg/m³</span>
                      <span className={`text-xs ${m.density > 1000 ? 'text-red-400' : 'text-green-400'}`}>
                        {m.density > 1000 ? 'Sinks' : 'Floats'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-black/30 border border-slate-800 rounded-xl p-3 text-sm text-slate-300">
                <strong className="text-white">Rule:</strong> Object sinks if ρ_object {'>'} ρ_fluid. It floats when ρ_object {'<'} ρ_fluid.
              </div>
            </div>
          </motion.div>
        )}

        {module === 'pressure' && (
          <motion.div key="pressure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Fluid Pressure vs Depth</div>
              <svg viewBox="0 0 400 260" className="w-full rounded-2xl bg-[#08121c]">
                {/* Container */}
                <rect x="100" y="30" width="200" height="200" rx="8" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Depth indicator */}
                <motion.line x1="100" x2="300" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3"
                  animate={{ y1: 30 + depth * 2, y2: 30 + depth * 2 }} />
                <motion.text x="310" fill="#f59e0b" fontSize="10" animate={{ y: 34 + depth * 2 }}>
                  {depth} cm
                </motion.text>
                {/* Pressure arrows (bigger at bottom) */}
                {[20, 40, 60, 80].map(d => {
                  const y = 30 + d * 2;
                  const size = d * 0.4;
                  return (
                    <g key={d}>
                      <line x1={100 - size} y1={y} x2="100" y2={y} stroke="#38bdf8" strokeWidth={1 + d / 30} />
                      <line x1="300" y1={y} x2={300 + size} y2={y} stroke="#38bdf8" strokeWidth={1 + d / 30} />
                    </g>
                  );
                })}
                <text x="200" y="252" fill="#94a3b8" fontSize="10" textAnchor="middle">Pressure increases with depth</text>
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Depth (cm)</span><span className="font-mono text-white">{depth}</span></div>
                <input type="range" min={5} max={95} value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="bg-black/40 border border-slate-700 rounded-2xl p-4 text-center">
                  <p className="text-slate-400 text-sm">P = ρgh</p>
                  <p className="text-white font-mono text-sm mt-1">P = 1000 × 9.81 × {(depth / 100).toFixed(2)}</p>
                  <div className="text-3xl font-mono font-bold text-cyan-400 mt-2">{pressure} Pa</div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p>Fluid pressure depends on <strong className="text-white">depth</strong>, <strong className="text-white">fluid density</strong>, and <strong className="text-white">gravitational field strength</strong>.</p>
                <p>Pressure acts <strong className="text-cyan-400">equally in all directions</strong> at any given depth.</p>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'upthrust' && (
          <motion.div key="upthrust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Archimedes' Principle</div>
              <svg viewBox="0 0 400 260" className="w-full rounded-2xl bg-[#08121c]">
                <rect x="100" y="60" width="200" height="170" rx="8" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Object */}
                <rect x="165" y="120" width="70" height="60" rx="8" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2" />
                <text x="200" y="155" fill="#1e293b" fontSize="9" textAnchor="middle" fontWeight="bold">Object</text>
                {/* Weight arrow (down) */}
                <line x1="200" y1="180" x2="200" y2="220" stroke="#ef4444" strokeWidth="3" />
                <polygon points="200,225 195,218 205,218" fill="#ef4444" />
                <text x="215" y="210" fill="#fca5a5" fontSize="9">W = {weight} N</text>
                {/* Upthrust arrow (up) */}
                <line x1="200" y1="120" x2="200" y2="80" stroke="#22c55e" strokeWidth="3" />
                <polygon points="200,75 195,82 205,82" fill="#22c55e" />
                <text x="215" y="90" fill="#86efac" fontSize="9">U = {upthrust} N</text>
                {/* Net force */}
                <text x="200" y="250" fill={Number(netForce) > 0 ? '#fca5a5' : '#86efac'} fontSize="11" textAnchor="middle" fontWeight="bold">
                  Net = {netForce} N ({Number(netForce) > 0 ? 'Sinks' : 'Floats'})
                </text>
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Object Density (kg/m³)</span><span className="font-mono text-white">{objDensity}</span></div>
                  <input type="range" min={200} max={12000} step={100} value={objDensity} onChange={e => setObjDensity(Number(e.target.value))} className="w-full accent-cyan-400" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Object Volume (m³)</span><span className="font-mono text-white">{objVolume}</span></div>
                  <input type="range" min={0.001} max={0.01} step={0.001} value={objVolume} onChange={e => setObjVolume(Number(e.target.value))} className="w-full accent-cyan-400" />
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p><strong className="text-white">Archimedes' Principle:</strong> The upthrust on a body equals the weight of fluid displaced.</p>
                <p className="font-mono text-cyan-400">U = ρ_fluid × V_displaced × g</p>
                <p>If upthrust {'>'} weight → object <strong className="text-green-400">floats</strong>. If weight {'>'} upthrust → object <strong className="text-red-400">sinks</strong>.</p>
              </div>
              <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Quick Check</div>
                <p className="text-sm text-white mb-3">A steel ship floats because:</p>
                <div className="space-y-2">
                  {['Steel is less dense than water', 'The hollow shape displaces enough water for upthrust > weight', 'Ships are made of special light steel', 'Water pushes ships up automatically'].map((opt, i) => (
                    <button key={i} onClick={() => setQuizAnswer(i)} disabled={quizAnswer !== null}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                        quizAnswer === null ? 'border-slate-800 text-slate-300 hover:border-cyan-500/30' :
                        i === 1 ? 'border-green-500/40 bg-green-500/10 text-green-300' :
                        quizAnswer === i ? 'border-red-500/40 bg-red-500/10 text-red-300' :
                        'border-slate-800 text-slate-500'
                      }`}>{opt}</button>
                  ))}
                </div>
                {quizAnswer !== null && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-green-300">
                    ✅ The hollow hull shape gives the ship a large volume, displacing enough water so that upthrust exceeds the total weight. The average density of the ship (steel + air inside) is less than water.
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
