import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'pathway' | 'yield' | 'compare';

const TABS = [
  { id: 'pathway' as Module, label: 'ATP Pathway',  icon: '⚡' },
  { id: 'yield'   as Module, label: 'ATP Yield',    icon: '🔋' },
  { id: 'compare' as Module, label: 'Aerobic vs An', icon: '📊' },
];

const STAGES = [
  { id: 'glycolysis', label: 'Glycolysis',          location: 'Cytoplasm',         color: '#f59e0b', atp: (g: number) => g * 2,   requires: 'None (anaerobic)' },
  { id: 'krebs',      label: 'Krebs Cycle',          location: 'Mitochondrial matrix', color: '#22c55e', atp: (g: number, o: number, m: number) => Math.round(g * 2 * (o / 80) * (m / 100)), requires: 'O₂ + Acetyl-CoA' },
  { id: 'etc',        label: 'Oxidative Phosphorylation (ETC)', location: 'Inner mitochondrial membrane', color: '#38bdf8', atp: (g: number, o: number, m: number) => Math.round(g * 28 * (o / 80) * (m / 100)), requires: 'O₂ + NADH/FADH₂' },
  { id: 'fermentation', label: 'Fermentation (anaerobic fallback)', location: 'Cytoplasm', color: '#fb7185', atp: (g: number, o: number) => Math.round(g * 0 * (1 - o / 100)), requires: 'No O₂' },
];

export default function RespirationEnergyMap() {
  const [module, setModule] = useState<Module>('pathway');
  const [oxygen, setOxygen] = useState(80);
  const [glucose, setGlucose] = useState(1);
  const [mitochondria, setMitochondria] = useState(75);

  const aerobicFactor = Math.min(1, oxygen / 80) * (mitochondria / 100);
  const glycolysisATP = glucose * 2;
  const krebsATP      = Math.round(glucose * 2 * aerobicFactor);
  const etcATP        = Math.round(glucose * 28 * aerobicFactor);
  const anaerobicATP  = Math.round(glucose * 2 * (1 - Math.min(1, oxygen / 80)));
  const totalATP      = glycolysisATP + krebsATP + etcATP;
  const co2Out        = Math.round(glucose * 6 * aerobicFactor);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">⚡ Respiration Energy Map</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Track ATP yield through glycolysis, Krebs cycle, and oxidative phosphorylation.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="orange" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── PATHWAY ── */}
        {module === 'pathway' && (
          <motion.div key="pathway" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Respiration Pathway</div>
              <svg viewBox="0 0 420 320" className="w-full rounded-2xl bg-[#06090f]">
                {/* Cytoplasm region */}
                <rect x="10" y="10" width="400" height="100" rx="12" fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" />
                <text x="20" y="26" fill="#f59e0b" fontSize="8" opacity="0.6">Cytoplasm</text>

                {/* Mitochondria region */}
                <rect x="10" y="120" width="400" height="180" rx="12" fill="rgba(56,189,248,0.04)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" />
                <text x="20" y="136" fill="#38bdf8" fontSize="8" opacity="0.6">Mitochondria</text>

                {/* Glucose → Glycolysis */}
                <motion.rect x="30" y="36" width="80" height="48" rx="10"
                  fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} />
                <text x="70" y="56" fill="#fcd34d" fontSize="9" textAnchor="middle" fontWeight="bold">Glucose</text>
                <text x="70" y="70" fill="#f59e0b" fontSize="7.5" textAnchor="middle">C₆H₁₂O₆</text>
                <text x="70" y="82" fill="#64748b" fontSize="7" textAnchor="middle">{glucose} molecule{glucose > 1 ? 's' : ''}</text>

                {/* Flow: Glucose → Glycolysis */}
                <motion.path d="M 115 60 L 155 60" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-o)"
                  strokeDasharray="5 4" className="process-flow-line" />
                <text x="135" y="53" fill="#64748b" fontSize="7" textAnchor="middle">2 ATP used</text>

                {/* Glycolysis box */}
                <motion.rect x="158" y="36" width="80" height="48" rx="10"
                  fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} />
                <text x="198" y="56" fill="#fcd34d" fontSize="8.5" textAnchor="middle" fontWeight="bold">Glycolysis</text>
                <text x="198" y="68" fill="#f59e0b" fontSize="7.5" textAnchor="middle">4 ATP made</text>
                <text x="198" y="80" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">+{glycolysisATP} ATP net</text>

                {/* Pyruvate down */}
                <motion.path d="M 198 84 L 198 144" stroke="#f59e0b" strokeWidth="2"
                  animate={oxygen > 20 ? { strokeDashoffset: [24, 0] } : {}}
                  strokeDasharray="6 4" transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                <text x="208" y="117" fill="#64748b" fontSize="7">Pyruvate</text>

                {/* Acetyl CoA */}
                <motion.rect x="158" y="148" width="80" height="40" rx="10"
                  fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.5" opacity={aerobicFactor}
                  initial={{ opacity: 0 }} animate={{ opacity: aerobicFactor }} />
                <text x="198" y="163" fill="#86efac" fontSize="8" textAnchor="middle" fontWeight="bold">Acetyl-CoA</text>
                <text x="198" y="178" fill="#22c55e" fontSize="7" textAnchor="middle">→ Krebs cycle</text>

                {/* Krebs → ETC flow */}
                <motion.path d="M 198 188 L 198 224" stroke="#22c55e" strokeWidth="2"
                  strokeDasharray="6 4" opacity={aerobicFactor}
                  animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />

                {/* Krebs box */}
                <motion.rect x="158" y="226" width="80" height="40" rx="10"
                  fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.5" opacity={aerobicFactor}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: aerobicFactor, scale: 1 }} transition={{ delay: 0.4 }} />
                <text x="198" y="241" fill="#86efac" fontSize="8" textAnchor="middle" fontWeight="bold">Krebs Cycle</text>
                <text x="198" y="258" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">+{krebsATP} ATP</text>

                {/* ETC box */}
                <motion.rect x="300" y="190" width="100" height="52" rx="10"
                  fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.5" opacity={aerobicFactor}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: aerobicFactor, scale: 1 }} transition={{ delay: 0.6 }} />
                <text x="350" y="207" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">ETC</text>
                <text x="350" y="221" fill="#38bdf8" fontSize="7.5" textAnchor="middle">O₂ + NADH/FADH₂</text>
                <text x="350" y="236" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">+{etcATP} ATP</text>

                {/* Krebs → ETC */}
                <motion.path d="M 238 248 L 300 220" stroke="#38bdf8" strokeWidth="1.5" opacity={aerobicFactor}
                  strokeDasharray="5 4" className="process-flow-line" />

                {/* Fermentation (low O₂) */}
                {oxygen < 50 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <rect x="300" y="40" width="100" height="48" rx="10"
                      fill="rgba(251,113,133,0.12)" stroke="#fb7185" strokeWidth="1.5" />
                    <text x="350" y="57" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">Fermentation</text>
                    <text x="350" y="70" fill="#fb7185" fontSize="7.5" textAnchor="middle">Lactate / Ethanol</text>
                    <text x="350" y="82" fill="#fb7185" fontSize="7.5" textAnchor="middle">No extra ATP</text>
                    <path d="M 238 65 L 300 65" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="5 3" />
                  </motion.g>
                )}

                {/* Total ATP badge */}
                <motion.rect x="10" y="276" width="120" height="36" rx="10"
                  fill="rgba(250,204,21,0.12)" stroke="#fbbf24" strokeWidth="1.5"
                  animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
                <text x="70" y="290" fill="#fcd34d" fontSize="8" textAnchor="middle" fontWeight="bold">TOTAL ATP</text>
                <text x="70" y="305" fill="#facc15" fontSize="14" textAnchor="middle" fontWeight="black">{totalATP}</text>

                <defs>
                  <marker id="arr-o" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Oxygen availability" value={oxygen} min={0} max={100} unit="%" color="cyan" onChange={setOxygen} />
                <StemSlider label="Glucose molecules" value={glucose} min={1} max={6} color="orange" onChange={setGlucose} />
                <StemSlider label="Mitochondrial capacity" value={mitochondria} min={10} max={100} unit="%" color="green" onChange={setMitochondria} />
              </div>

              {/* Live stats */}
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Live Output</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Glycolysis ATP', value: glycolysisATP, color: '#f59e0b' },
                    { label: 'Krebs ATP', value: krebsATP, color: '#22c55e' },
                    { label: 'ETC ATP', value: etcATP, color: '#38bdf8' },
                    { label: 'CO₂ released', value: co2Out, color: '#64748b', suffix: 'mol' },
                  ].map(item => (
                    <motion.div key={item.label} layout className="bg-black/30 border border-slate-800 rounded-xl p-3">
                      <div className="text-[9px] uppercase text-slate-500">{item.label}</div>
                      <div className="text-2xl font-mono font-bold mt-1" style={{ color: item.color }}>
                        {item.value}<span className="text-xs text-slate-500 ml-1">{item.suffix || 'ATP'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {oxygen < 30 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-3 rounded-xl border border-pink-500/30 bg-pink-500/10 p-3 text-xs text-pink-300">
                    ⚠️ Low O₂ — aerobic respiration limited. Cells may switch to fermentation (+{anaerobicATP} ATP from lactate pathway).
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── YIELD ── */}
        {module === 'yield' && (
          <motion.div key="yield" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-5">ATP per Glucose (Aerobic, theoretical max = 32)</div>
              <div className="space-y-5">
                {[
                  { label: 'Glycolysis (cytoplasm)',            val: 2,  max: 2,  color: '#f59e0b', note: 'Net 2 ATP (4 made − 2 used to start)' },
                  { label: 'Link reaction + Krebs (per glucose)',val: 2,  max: 2,  color: '#22c55e', note: 'Generates NADH and FADH₂ for ETC' },
                  { label: 'ETC / Oxidative phosphorylation',   val: 28, max: 28, color: '#38bdf8', note: 'Uses NADH + FADH₂ via chemiosmosis' },
                ].map((row, i) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs text-slate-300">{row.label}</span>
                      <span className="font-mono text-sm font-bold" style={{ color: row.color }}>{row.val} ATP</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-1">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: row.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(row.val / 32) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.15 }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500">{row.note}</div>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <span className="text-sm text-white font-bold">Total</span>
                  <motion.span key={totalATP} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    className="text-3xl font-mono font-black text-yellow-400">{32} ATP
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Coenzymes</div>
                {[
                  { name: 'NAD⁺ → NADH', role: 'Carries H atoms from Krebs to ETC', color: '#22c55e' },
                  { name: 'FAD → FADH₂', role: 'Carries H atoms from Krebs to ETC', color: '#38bdf8' },
                  { name: 'ADP + Pᵢ → ATP', role: 'Energy currency: produced by chemiosmosis', color: '#fbbf24' },
                ].map(c => (
                  <div key={c.name} className="flex gap-3 mb-3 p-2 rounded-xl hover:bg-slate-800/30 transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: c.color }} />
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-slate-400">{c.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-slate-300 space-y-2">
                <p><strong className="text-white">Overall equation (aerobic):</strong></p>
                <p className="font-mono text-sm text-yellow-300 bg-black/30 rounded-xl p-3">
                  C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 32 ATP
                </p>
                <p className="text-xs text-slate-500">Anaerobic (lactic acid): C₆H₁₂O₆ → 2C₃H₆O₃ + 2 ATP</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── COMPARE ── */}
        {module === 'compare' && (
          <motion.div key="compare" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 overflow-x-auto mb-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Aerobic vs Anaerobic Comparison</div>
              <table className="w-full text-sm min-w-[520px]">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-3 text-left">Feature</th><th className="py-2 px-3 text-cyan-400">Aerobic</th><th className="py-2 px-3 text-pink-400">Anaerobic</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Oxygen required', '✅ Yes', '❌ No'],
                    ['ATP yield per glucose', '32', '2'],
                    ['Location', 'Cytoplasm + mitochondria', 'Cytoplasm only'],
                    ['Products', 'CO₂ + H₂O + ATP', 'Lactic acid (animals) / Ethanol + CO₂ (yeast)'],
                    ['Duration', 'Sustained activity', 'Short bursts only'],
                    ['Oxygen debt', 'None', 'Yes — repaid during recovery'],
                  ].map(([f, a, b], i) => (
                    <motion.tr key={f} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors text-slate-300">
                      <td className="py-2.5 px-3 font-medium text-white">{f}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{a}</td>
                      <td className="py-2.5 px-3 text-pink-300">{b}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="text-sm font-bold text-cyan-400 mb-2">🏃 Sprint vs Marathon</div>
                <p className="text-sm text-slate-300">During a 100m sprint, muscles use anaerobic respiration (only 2 ATP per glucose) because oxygen delivery can't keep up. Lactic acid builds up, causing muscle fatigue. After the race, heavy breathing repays the "oxygen debt".</p>
              </div>
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="text-sm font-bold text-amber-400 mb-2">🍞 Fermentation in Industry</div>
                <p className="text-sm text-slate-300">Yeast use anaerobic fermentation: glucose → ethanol + CO₂ + 2 ATP. Used in bread making (CO₂ causes rise) and brewing (ethanol). The same biochemistry as muscle lactic acid, just a different final product.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
