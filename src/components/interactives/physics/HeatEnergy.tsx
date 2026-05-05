import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'transfer' | 'shc' | 'latent';

const MATERIALS = [
  { name: 'Water',     shc: 4200, color: '#38bdf8', sliderColor: 'cyan'   as const },
  { name: 'Aluminium', shc: 900,  color: '#94a3b8', sliderColor: 'cyan'   as const },
  { name: 'Copper',    shc: 390,  color: '#f59e0b', sliderColor: 'orange' as const },
  { name: 'Iron',      shc: 450,  color: '#64748b', sliderColor: 'cyan'   as const },
  { name: 'Oil',       shc: 2000, color: '#a3e635', sliderColor: 'green'  as const },
];

const TRANSFER_METHODS = [
  {
    name: 'Conduction', icon: '🔩', color: '#f59e0b',
    desc: 'Energy transferred through vibrating particles in solids. Metals conduct best — free electrons carry kinetic energy rapidly.',
    example: 'Metal spoon in hot soup gets warm.',
    animClass: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    name: 'Convection', icon: '🌊', color: '#38bdf8',
    desc: 'Hot fluid rises (less dense), cool fluid sinks (more dense), creating convection currents. Only in liquids and gases.',
    example: 'Hot air rises from a radiator and circulates the room.',
    animClass: 'border-cyan-500/30 bg-cyan-500/5',
  },
  {
    name: 'Radiation', icon: '☀️', color: '#f87171',
    desc: 'Infrared electromagnetic waves transfer energy through a vacuum. No medium needed. Dark/matt surfaces emit and absorb best.',
    example: 'You feel warmth from the sun across empty space.',
    animClass: 'border-red-500/30 bg-red-500/5',
  },
];

const TABS = [
  { id: 'transfer' as Module, label: 'Transfer Methods', icon: '🔄' },
  { id: 'shc'      as Module, label: 'SHC',              icon: '🌡️' },
  { id: 'latent'   as Module, label: 'Latent Heat',      icon: '❄️' },
];

export default function HeatEnergy() {
  const [module, setModule] = useState<Module>('transfer');
  const [material, setMaterial] = useState(0);
  const [mass, setMass] = useState(2);
  const [deltaT, setDeltaT] = useState(30);
  const [latentMass, setLatentMass] = useState(0.5);
  const [curveProgress, setCurveProgress] = useState(0);
  const animRef = useRef<number>(0);

  const mat = MATERIALS[material];
  const energy = (mass * mat.shc * deltaT) / 1000;
  const meltEnergy = latentMass * 334;
  const boilEnergy = latentMass * 2260;

  // Animate heating curve draw-on when switching to latent tab
  useEffect(() => {
    if (module !== 'latent') return;
    setCurveProgress(0);
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurveProgress(t);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [module]);

  // Animated heating curve segments (6 points)
  const allPoints = useMemo(() => [
    { t: 0,   T: -20 },
    { t: 40,  T: 0   },
    { t: 100, T: 0   },
    { t: 140, T: 100 },
    { t: 200, T: 100 },
    { t: 240, T: 120 },
  ], []);

  // Build partial polyline points based on curveProgress
  const curvePolyline = useMemo(() => {
    const totalLength = 240; // t goes from 0 to 240
    const targetT = curveProgress * totalLength;
    const pts: string[] = [];
    for (let i = 0; i < allPoints.length; i++) {
      const p = allPoints[i];
      if (p.t <= targetT) {
        pts.push(`${40 + p.t * 1.4},${210 - p.T * 1.4}`);
        if (i < allPoints.length - 1 && allPoints[i + 1].t > targetT) {
          // Interpolate within segment
          const next = allPoints[i + 1];
          const seg = (targetT - p.t) / (next.t - p.t);
          const ix = p.t + (next.t - p.t) * seg;
          const iT = p.T + (next.T - p.T) * seg;
          pts.push(`${40 + ix * 1.4},${210 - iT * 1.4}`);
        }
      }
    }
    return pts.join(' ');
  }, [curveProgress, allPoints]);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🔥 Heat &amp; Energy Transfer</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Conduction, convection, radiation, SHC and latent heat.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="orange" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── TRANSFER ── */}
        {module === 'transfer' && (
          <motion.div key="transfer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {TRANSFER_METHODS.map((m, i) => (
                <motion.div key={m.name}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`rounded-[2rem] border p-5 interactive-card ${m.animClass}`}
                >
                  <div className="text-3xl mb-3">{m.icon}</div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: m.color }}>{m.name}</h4>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">{m.desc}</p>
                  <div className="bg-black/30 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400">
                    <strong className="text-slate-300">Example:</strong> {m.example}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 overflow-x-auto">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Key Comparisons</div>
              <table className="w-full text-sm text-left min-w-[500px]">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Feature</th>
                    <th className="py-2 px-3 text-amber-400">Conduction</th>
                    <th className="py-2 px-3 text-cyan-400">Convection</th>
                    <th className="py-2 px-3 text-red-400">Radiation</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-2 px-3 text-white font-medium">Medium needed?</td>
                    <td className="py-2 px-3">Yes (solid best)</td>
                    <td className="py-2 px-3">Yes (fluid only)</td>
                    <td className="py-2 px-3">No (vacuum OK)</td>
                  </tr>
                  <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-2 px-3 text-white font-medium">Mechanism</td>
                    <td className="py-2 px-3">Particle vibration</td>
                    <td className="py-2 px-3">Density currents</td>
                    <td className="py-2 px-3">EM waves</td>
                  </tr>
                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-2 px-3 text-white font-medium">Direction</td>
                    <td className="py-2 px-3">Hot → cold along material</td>
                    <td className="py-2 px-3">Circular currents</td>
                    <td className="py-2 px-3">All directions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── SHC ── */}
        {module === 'shc' && (
          <motion.div key="shc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Q = mcΔT Calculator</div>

              {/* Material Selector */}
              <div className="flex gap-2 flex-wrap mb-5">
                {MATERIALS.map((m, i) => (
                  <button key={m.name} onClick={() => setMaterial(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                      material === i ? 'text-black shadow-[0_0_12px_rgba(0,0,0,0.3)]' : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                    style={material === i ? { backgroundColor: m.color } : {}}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              {/* Q Result */}
              <div className="bg-black/40 border border-slate-700 rounded-2xl p-5 text-center mb-5">
                <p className="text-slate-400 text-sm mb-1 font-mono">Q = m × c × ΔT</p>
                <p className="text-slate-300 font-mono text-sm">{mass} kg × {mat.shc} J/kg°C × {deltaT}°C</p>
                <motion.div key={`${energy}-${material}`}
                  initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-mono font-black mt-3" style={{ color: mat.color }}
                >
                  {energy.toFixed(1)}
                  <span className="text-xl font-normal text-slate-400 ml-2">kJ</span>
                </motion.div>
              </div>

              {/* SHC Comparison bars */}
              <div className="text-[10px] text-slate-500 uppercase mb-3">SHC Comparison (J/kg°C)</div>
              <div className="space-y-3">
                {MATERIALS.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <span className={`text-xs w-20 shrink-0 ${i === material ? 'text-white font-bold' : 'text-slate-400'}`}>{m.name}</span>
                    <div className="flex-1 bg-slate-800/60 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.shc / 4200) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 font-mono w-12 text-right">{m.shc.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Mass (kg)" value={mass} min={0.5} max={5} step={0.5} unit="kg" color="orange" onChange={setMass} />
                <StemSlider label="Temperature Change ΔT" value={deltaT} min={5} max={80} step={5} unit="°C" color="orange" onChange={setDeltaT} />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-3">
                <p><strong className="text-white">Specific Heat Capacity (c)</strong> = the energy needed to raise 1 kg of a substance by 1°C.</p>
                <p>Water has the <strong className="text-cyan-400">highest SHC</strong> (4200 J/kg°C) — this is why it's excellent for cooling systems and why coastal climates are mild.</p>
                <p className="text-xs text-slate-500 italic">Metals have low SHC — they heat up and cool down quickly.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LATENT HEAT ── */}
        {module === 'latent' && (
          <motion.div key="latent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Heating Curve of Water</div>
              <svg viewBox="0 0 420 265" className="w-full rounded-2xl bg-[#0b0f16] overflow-hidden">
                {/* Phase background fills */}
                <rect x="41" y="21" width="56" height="189" fill="rgba(147,197,253,0.04)" />
                <rect x="97" y="69" width="84" height="141" fill="rgba(34,211,238,0.04)" />
                <rect x="181" y="21" width="84" height="189" fill="rgba(56,189,248,0.04)" />
                <rect x="265" y="21" width="56" height="189" fill="rgba(167,139,250,0.04)" />
                <rect x="321" y="21" width="56" height="189" fill="rgba(244,114,182,0.04)" />

                {/* Axes */}
                <line x1="40" y1="210" x2="400" y2="210" stroke="#475569" strokeWidth="1.5" />
                <line x1="40" y1="21" x2="40" y2="210" stroke="#475569" strokeWidth="1.5" />
                <text x="220" y="252" fill="#64748b" fontSize="9" textAnchor="middle">Time / Energy Added →</text>
                <text x="12" y="130" fill="#64748b" fontSize="9" transform="rotate(-90 12 130)">Temperature (°C)</text>

                {/* Temperature labels */}
                <text x="30" y="214" fill="#64748b" fontSize="8" textAnchor="end">0</text>
                <line x1="37" y1="210" x2="43" y2="210" stroke="#475569" strokeWidth="1" />
                <text x="30" y="74" fill="#64748b" fontSize="8" textAnchor="end">100</text>
                <line x1="37" y1="70" x2="43" y2="70" stroke="#475569" strokeWidth="1" />
                <text x="30" y="38" fill="#64748b" fontSize="8" textAnchor="end">120</text>

                {/* Animated curve */}
                {curvePolyline && (
                  <polyline fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    points={curvePolyline}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.6))' }}
                  />
                )}

                {/* Phase labels — appear as curve passes through */}
                {curveProgress > 0.05 && <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x="55" y="195" fill="#93c5fd" fontSize="9">Ice</motion.text>}
                {curveProgress > 0.25 && <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x="110" y="218" fill="#22d3ee" fontSize="9">Melting</motion.text>}
                {curveProgress > 0.5 && <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x="182" y="145" fill="#38bdf8" fontSize="9">Water</motion.text>}
                {curveProgress > 0.75 && <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x="245" y="85" fill="#a78bfa" fontSize="9">Boiling</motion.text>}
                {curveProgress > 0.95 && <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x="320" y="52" fill="#f472b6" fontSize="9">Steam</motion.text>}

                {/* Latent heat annotations */}
                {curveProgress > 0.35 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <line x1="97" y1="210" x2="97" y2="195" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="181" y1="210" x2="181" y2="195" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
                    <text x="138" y="190" fill="#fcd34d" fontSize="7" textAnchor="middle">Lf = 334 kJ/kg</text>
                  </motion.g>
                )}
                {curveProgress > 0.85 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <line x1="265" y1="74" x2="265" y2="59" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="321" y1="74" x2="321" y2="59" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
                    <text x="293" y="55" fill="#fcd34d" fontSize="7" textAnchor="middle">Lv = 2260 kJ/kg</text>
                  </motion.g>
                )}
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Latent Heat Calculator</div>
                <StemSlider label="Mass of water" value={latentMass} min={0.1} max={3} step={0.1} unit="kg" color="purple" onChange={setLatentMass} />
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <motion.div key={`melt-${meltEnergy}`} initial={{ scale: 0.93 }} animate={{ scale: 1 }}
                    className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                    <div className="text-[9px] uppercase text-slate-500 mb-1">To Melt (Q = mLf)</div>
                    <div className="text-2xl font-mono font-bold text-blue-400">{meltEnergy.toFixed(0)}</div>
                    <div className="text-xs text-blue-500/70">kJ</div>
                  </motion.div>
                  <motion.div key={`boil-${boilEnergy}`} initial={{ scale: 0.93 }} animate={{ scale: 1 }}
                    className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                    <div className="text-[9px] uppercase text-slate-500 mb-1">To Boil (Q = mLv)</div>
                    <div className="text-2xl font-mono font-bold text-purple-400">{boilEnergy.toFixed(0)}</div>
                    <div className="text-xs text-purple-500/70">kJ</div>
                  </motion.div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-3">
                <p><strong className="text-white">Latent heat</strong> = energy absorbed/released during a phase change with <strong className="text-cyan-400">no temperature change</strong>.</p>
                <p>The <strong className="text-white">flat sections</strong> on the heating curve show where all energy goes into breaking intermolecular bonds.</p>
                <p className="text-xs text-slate-500 italic">Lv ≫ Lf because ALL bonds must break, not just weaken.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
