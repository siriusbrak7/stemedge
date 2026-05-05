import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'alveoli' | 'blood' | 'factors';

const TABS = [
  { id: 'alveoli' as Module, label: 'Alveoli Diffusion',  icon: '🫁' },
  { id: 'blood'   as Module, label: 'Oxygen Transport',   icon: '🩸' },
  { id: 'factors' as Module, label: 'Fick\'s Law',        icon: '📈' },
];

export default function GasExchange() {
  const [module, setModule] = useState<Module>('alveoli');
  const [o2Gradient, setO2Gradient] = useState(80); // concentration diff
  const [surfaceArea, setSurfaceArea] = useState(70);
  const [thickness, setThickness] = useState(1);

  // Diffusion rate roughly follows Fick's Law: Rate ∝ (Surface Area × Conc. Gradient) / Thickness
  const diffusionRate = ((surfaceArea / 100) * (o2Gradient / 100)) / Math.max(0.5, thickness);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🫁 Gas Exchange & Transport</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Diffusion across alveoli, haemoglobin transport, and Fick's Law.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="red" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── ALVEOLI ── */}
        {module === 'alveoli' && (
          <motion.div key="alveoli" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Alveolus Capillary Interface</div>
              
              <svg viewBox="0 0 400 240" className="w-full rounded-2xl bg-[#08111b]">
                {/* Alveolus Sac */}
                <path d="M 50 0 C 50 150, 350 150, 350 0" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth={thickness} />
                <text x="200" y="50" fill="#38bdf8" fontSize="14" textAnchor="middle" fontWeight="bold">Alveolus (Air Space)</text>
                <text x="200" y="65" fill="#7dd3fc" fontSize="10" textAnchor="middle">High O₂, Low CO₂</text>

                {/* Blood Capillary */}
                <path d="M 0 160 Q 200 220 400 160 L 400 240 L 0 240 Z" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="2" />
                <text x="200" y="210" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">Blood Capillary</text>
                
                {/* Red Blood Cells moving */}
                {[0, 1, 2].map(i => (
                  <motion.g key={`rbc-${i}`}
                    animate={{ x: [0, 400] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: i * 2 }}>
                    <ellipse cx="-20" cy="180" rx="15" ry="10" fill="#dc2626" />
                    <ellipse cx="-20" cy="180" rx="8" ry="5" fill="#991b1b" />
                  </motion.g>
                ))}

                {/* O2 Diffusion Animation (Blue dots moving down) */}
                {Array.from({ length: Math.floor(diffusionRate * 10) }).map((_, i) => (
                  <motion.circle key={`o2-${i}`} r="3" fill="#38bdf8"
                    initial={{ x: 100 + Math.random() * 200, y: 80 + Math.random() * 20 }}
                    animate={{ y: [null, 180], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }} />
                ))}
                
                {/* CO2 Diffusion Animation (Red dots moving up) */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.circle key={`co2-${i}`} r="3" fill="#fca5a5"
                    initial={{ x: 150 + Math.random() * 100, y: 190 }}
                    animate={{ y: [null, 100], opacity: [0, 1, 0] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }} />
                ))}
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Concentration Gradient (O₂ diff)" value={o2Gradient} min={10} max={100} color="cyan" onChange={setO2Gradient} />
                <StemSlider label="Surface Area" value={surfaceArea} min={20} max={100} color="green" onChange={setSurfaceArea} />
                <StemSlider label="Membrane Thickness" value={thickness} min={1} max={10} color="orange" onChange={setThickness} />
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Live Diffusion Rate</div>
                <div className="flex items-end gap-2 mb-2">
                  <div className="text-4xl font-mono font-black text-white">{diffusionRate.toFixed(2)}</div>
                  <div className="text-sm text-slate-500 mb-1">units/sec</div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-cyan-400" animate={{ width: `${Math.min(100, diffusionRate * 50)}%` }} />
                </div>
                {thickness > 5 && (
                  <p className="text-xs text-orange-400 mt-3 font-bold">⚠ Thick membrane (e.g. pneumonia, fibrosis) severely reduces gas exchange rate.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BLOOD TRANSPORT ── */}
        {module === 'blood' && (
          <motion.div key="blood" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">🩸 Haemoglobin & Oxygen</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Red blood cells contain <strong className="text-white">haemoglobin</strong> (Hb), a protein with 4 iron/haem groups. It binds reversibly to oxygen.
              </p>
              <div className="bg-black/40 border border-red-500/30 rounded-xl p-4 text-center font-mono text-white mb-4">
                Hb + 4O₂ ⇌ HbO₈
                <div className="text-xs text-slate-500 mt-1">(Oxyhaemoglobin)</div>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• <strong className="text-cyan-400">In Lungs:</strong> High O₂ conc. → reaction shifts right, oxygen binds (loading).</li>
                <li>• <strong className="text-orange-400">In Tissues:</strong> Low O₂ conc. → reaction shifts left, oxygen releases (unloading).</li>
              </ul>
            </div>
            
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-xl font-bold text-slate-300 mb-4">The Bohr Effect</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                When tissues are active (e.g. exercising muscle), they produce more CO₂. This lowers the pH of the blood.
              </p>
              <div className="border-l-2 border-orange-500 pl-4 py-2 my-4">
                <p className="text-orange-300 text-sm font-bold">Increased CO₂ / Lower pH causes Haemoglobin to reduce its affinity for Oxygen.</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Result: Hb releases <strong className="text-white">more oxygen</strong> exactly where respiring tissues need it most. The oxygen dissociation curve shifts to the right.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── FICK'S LAW ── */}
        {module === 'factors' && (
          <motion.div key="factors" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="max-w-3xl mx-auto rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-brand-accent font-bold mb-4">Fick's Law of Diffusion</h3>
              <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center mb-6">
                <div className="text-xl font-mono text-white flex items-center gap-4">
                  <span>Rate</span> <span>∝</span>
                  <div className="flex flex-col items-center">
                    <span className="border-b-2 border-slate-500 pb-1">Surface Area × Conc. Difference</span>
                    <span className="pt-1">Thickness of Membrane</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-green-400 mb-1">Max Surface Area</div>
                  <p className="text-xs text-slate-400">Millions of tiny alveoli provide a massive surface area (~70m²) for rapid gas exchange.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-cyan-400 mb-1">Max Gradient</div>
                  <p className="text-xs text-slate-400">Ventilation (breathing) and continuous blood flow maintain a steep concentration gradient.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-orange-400 mb-1">Min Thickness</div>
                  <p className="text-xs text-slate-400">Alveolar walls and capillary walls are only one cell thick (squamous epithelium), minimising diffusion distance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
