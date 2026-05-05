import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'journey' | 'enzymes' | 'absorption';

const ORGANS = [
  { name: 'Mouth',          y: 30,  desc: 'Mechanical digestion by teeth (mastication). Salivary amylase begins starch → maltose hydrolysis. pH ≈ 6.8.', enzyme: 'Salivary Amylase', substrate: 'Starch',             product: 'Maltose',               ph: 6.8 },
  { name: 'Oesophagus',     y: 65,  desc: 'Peristaltic waves of smooth muscle push the bolus toward the stomach. No chemical digestion occurs here.',    enzyme: '—',              substrate: '—',                  product: '—',                     ph: 7.0 },
  { name: 'Stomach',        y: 110, desc: 'HCl creates pH 2. Pepsin (from pepsinogen) hydrolyses proteins into polypeptides. Churning creates chyme.',   enzyme: 'Pepsin',         substrate: 'Protein',             product: 'Polypeptides',          ph: 2.0 },
  { name: 'Duodenum',       y: 160, desc: 'Bile emulsifies fats. Pancreatic lipase, amylase and trypsin complete digestion.',                            enzyme: 'Lipase / Trypsin',substrate: 'Lipids / Polypeptides',product: 'Fatty acids + Amino acids',ph: 8.5},
  { name: 'Ileum',          y: 210, desc: 'Villi and microvilli increase surface area. Glucose and amino acids absorbed by active transport; fatty acids by diffusion.', enzyme: 'Maltase / Peptidase', substrate: 'Maltose / Dipeptides', product: 'Glucose / Amino acids', ph: 7.5 },
  { name: 'Large Intestine',y: 250, desc: 'Water and mineral salts reabsorbed. Bacteria ferment undigested fibre. Faeces formed in rectum.',             enzyme: '—',              substrate: '—',                  product: '—',                     ph: 6.5 },
];

const FOOD_TYPES = [
  { id: 'starch',  label: 'Starch',  color: '#60a5fa', breakdown: ['Starch', 'Maltose', 'Glucose'],                    enzymes: ['Amylase', 'Maltase'] },
  { id: 'protein', label: 'Protein', color: '#fb7185', breakdown: ['Protein', 'Polypeptides', 'Amino acids'],           enzymes: ['Pepsin', 'Trypsin', 'Peptidase'] },
  { id: 'lipid',   label: 'Lipid',   color: '#fbbf24', breakdown: ['Triglyceride', 'Fatty acids + Glycerol'],           enzymes: ['Lipase (+ bile)'] },
];

const VILLI_FEATURES = [
  { label: 'Microvilli',              desc: 'Brush border on epithelial cells increases surface area by 600×.' },
  { label: 'Thin epithelium',         desc: 'Single cell thick (1 μm) — very short diffusion distance.' },
  { label: 'Dense capillary network', desc: 'Blood maintains steep concentration gradient via continuous flow.' },
  { label: 'Lacteal',                 desc: 'Central lymph vessel absorbs fatty acids as chylomicrons.' },
];

const TABS = [
  { id: 'journey'    as Module, label: 'Digestive Journey', icon: '🫁' },
  { id: 'enzymes'    as Module, label: 'Enzyme Action',     icon: '🧪' },
  { id: 'absorption' as Module, label: 'Absorption',        icon: '🔬' },
];

export default function NutritionDigestion() {
  const [module, setModule] = useState<Module>('journey');
  const [stage, setStage] = useState(0);
  const [foodType, setFoodType] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const organ = ORGANS[stage];
  const food = FOOD_TYPES[foodType];

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🍽️ Nutrition &amp; Digestion</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Follow food through the alimentary canal and master enzyme action.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="cyan" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── JOURNEY ── */}
        {module === 'journey' && (
          <motion.div key="journey" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Alimentary Canal</div>
              {/* Food type selector */}
              <div className="flex gap-2 flex-wrap mb-3">
                {FOOD_TYPES.map((f, i) => (
                  <button key={f.id} onClick={() => setFoodType(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${foodType === i ? 'text-black' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
                    style={foodType === i ? { backgroundColor: f.color, boxShadow: `0 0 12px ${f.color}60` } : {}}
                  >{f.label}</button>
                ))}
              </div>
              <svg viewBox="0 0 420 300" className="w-full rounded-2xl bg-[#08111b]">
                {/* Animated peristalsis path */}
                <path
                  d="M180 20 C180 50, 200 60, 210 80 C220 100, 190 130, 200 160 C210 190, 240 200, 230 230 C220 260, 200 280, 210 290"
                  fill="none" stroke="#1e3a52" strokeWidth="22" strokeLinecap="round"
                />
                {/* Flow animation overlay */}
                <path
                  d="M180 20 C180 50, 200 60, 210 80 C220 100, 190 130, 200 160 C210 190, 240 200, 230 230 C220 260, 200 280, 210 290"
                  fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray="8 18" className="process-flow-line" opacity="0.3"
                />
                {/* Organ nodes */}
                {ORGANS.map((o, i) => (
                  <g key={o.name} onClick={() => setStage(i)} style={{ cursor: 'pointer' }}>
                    {stage === i && (
                      <motion.circle
                        cx={195 + (i % 2 === 0 ? 0 : 15)} cy={o.y} r={22}
                        fill="none" stroke="#22d3ee" strokeWidth="2" opacity={0.3}
                        animate={{ r: [18, 26, 18], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      />
                    )}
                    <circle
                      cx={195 + (i % 2 === 0 ? 0 : 15)} cy={o.y}
                      r={stage === i ? 16 : 11}
                      fill={stage === i ? '#22d3ee' : '#1e293b'}
                      stroke={stage === i ? '#06b6d4' : '#475569'}
                      strokeWidth="2"
                      style={{ transition: 'all 0.3s' }}
                    />
                    <text x={240} y={o.y + 4} fill={stage === i ? '#e2e8f0' : '#64748b'} fontSize="11"
                      fontWeight={stage === i ? 'bold' : 'normal'}>{o.name}</text>
                  </g>
                ))}
                {/* Animated food bolus */}
                <motion.g>
                  <motion.circle
                    cx={195 + (stage % 2 === 0 ? 0 : 15)}
                    cy={ORGANS[stage].y}
                    r={14}
                    fill={food.color}
                    animate={{ cy: ORGANS[stage].y, r: [12, 16, 12] }}
                    transition={{ cy: { type: 'spring', stiffness: 80 }, r: { duration: 1, repeat: Infinity } }}
                    style={{ filter: `drop-shadow(0 0 8px ${food.color})` }}
                    opacity={0.85}
                  />
                </motion.g>
              </svg>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-2">{organ.name}</div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{organ.desc}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Enzyme', val: organ.enzyme },
                      { label: 'pH',     val: organ.ph.toString() },
                      { label: 'Product',val: organ.product },
                    ].map(item => (
                      <div key={item.label} className="bg-black/30 border border-slate-800 rounded-xl p-3 text-center">
                        <div className="text-[9px] uppercase text-slate-500 mb-1">{item.label}</div>
                        <div className="text-xs text-white font-mono">{item.val}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Stage indicator dots */}
              <div className="flex justify-center gap-2">
                {ORGANS.map((_, i) => (
                  <button key={i} onClick={() => setStage(i)}
                    className={`rounded-full transition-all duration-200 ${stage === i ? 'w-6 h-2.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStage(s => Math.max(0, s - 1))} disabled={stage === 0}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 disabled:opacity-30 hover:border-slate-500 transition-colors">
                  ← Previous
                </button>
                <button onClick={() => setStage(s => Math.min(ORGANS.length - 1, s + 1))} disabled={stage === ORGANS.length - 1}
                  className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-black disabled:opacity-30 hover:bg-cyan-300 transition-colors shadow-[0_0_16px_rgba(34,211,238,0.4)]">
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ENZYMES ── */}
        {module === 'enzymes' && (
          <motion.div key="enzymes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Enzyme Breakdown Chain</div>
              <div className="flex gap-2 flex-wrap mb-5">
                {FOOD_TYPES.map((f, i) => (
                  <button key={f.id} onClick={() => setFoodType(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${foodType === i ? 'text-black' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
                    style={foodType === i ? { backgroundColor: f.color, boxShadow: `0 0 12px ${f.color}60` } : {}}
                  >{f.label}</button>
                ))}
              </div>

              {/* Animated breakdown chain */}
              <AnimatePresence mode="wait">
                <motion.div key={food.id} className="flex flex-wrap items-center gap-3">
                  {food.breakdown.map((step, i) => (
                    <motion.div key={step} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 }}
                      className="flex items-center gap-3">
                      <div className="bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-center min-w-[90px]"
                        style={{ borderColor: i === food.breakdown.length - 1 ? food.color : undefined, boxShadow: i === food.breakdown.length - 1 ? `0 0 12px ${food.color}40` : undefined }}>
                        <div className="text-white text-sm font-medium">{step}</div>
                      </div>
                      {i < food.breakdown.length - 1 && (
                        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 + 0.15 }}
                          className="text-center">
                          <div className="text-[10px] text-cyan-400 font-mono">{food.enzymes[i]}</div>
                          <div className="text-slate-500 text-lg">→</div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Lock-and-key SVG */}
              <div className="mt-6">
                <div className="text-[10px] uppercase text-slate-500 mb-2">Lock-and-Key Model</div>
                <svg viewBox="0 0 400 110" className="w-full rounded-xl bg-[#0a1019]">
                  <text x="20" y="18" fill="#94a3b8" fontSize="9">Enzyme (specific active site)</text>
                  <path d="M60 45 Q60 78, 90 78 L90 58 Q110 58, 110 48 L110 78 Q110 100, 140 100 Q170 100, 170 78 L170 45 Q170 28, 140 28 L90 28 Q60 28, 60 45"
                    fill="#22d3ee" opacity="0.15" stroke="#22d3ee" strokeWidth="1.5" />
                  <motion.rect x="88" y="43" width="24" height="20" rx="4" fill={food.color} opacity="0.85"
                    animate={{ y: [38, 43, 43], opacity: [0, 1, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }} />
                  <text x="100" y="57" fill="#1e293b" fontSize="7" textAnchor="middle" fontWeight="bold">S</text>
                  <line x1="180" y1="63" x2="228" y2="63" stroke="#475569" strokeWidth="2" markerEnd="url(#arr-nd)" />
                  <defs><marker id="arr-nd" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#475569" /></marker></defs>
                  <rect x="238" y="48" width="16" height="14" rx="3" fill="#86efac" />
                  <rect x="262" y="48" width="16" height="14" rx="3" fill="#fde047" />
                  <text x="250" y="83" fill="#94a3b8" fontSize="9">Products</text>
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 overflow-x-auto">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Enzyme Summary Table</div>
                <table className="w-full text-xs text-left min-w-[320px]">
                  <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <tr><th className="py-2 px-2">Enzyme</th><th className="py-2 px-2">Substrate</th><th className="py-2 px-2">Product</th><th className="py-2 px-2">pH</th></tr>
                  </thead>
                  <tbody>
                    {ORGANS.filter(o => o.enzyme !== '—').map((o, i) => (
                      <motion.tr key={o.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                        className="border-b border-slate-800/50 text-slate-300 hover:bg-slate-800/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-cyan-400">{o.enzyme}</td>
                        <td className="py-2 px-2">{o.substrate}</td>
                        <td className="py-2 px-2">{o.product}</td>
                        <td className="py-2 px-2 font-mono">{o.ph}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p>• Enzymes are <strong className="text-white">biological catalysts</strong> — they speed up reactions without being used up.</p>
                <p>• Each enzyme has a <strong className="text-cyan-400">specific active site</strong> (lock-and-key).</p>
                <p>• <strong className="text-white">Denaturation</strong> occurs at extreme pH or temperature — active site shape changes permanently.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ABSORPTION ── */}
        {module === 'absorption' && (
          <motion.div key="absorption" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Villus Structure</div>
              <svg viewBox="0 0 400 280" className="w-full rounded-2xl bg-[#08111b]">
                {/* Villus outline */}
                <motion.path d="M120 280 Q120 100, 200 60 Q280 100, 280 280"
                  fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.4))' }}
                />
                {/* Epithelial cells */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.rect key={i} x={130 + i * 18} y={80 + i * 20} width="16" height="10" rx="2"
                    fill="rgba(34,211,238,0.18)" stroke="#22d3ee" strokeWidth="1"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.07 }} />
                ))}
                {/* Microvilli brush border */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.line key={`mv${i}`} x1={135 + i * 10} y1={70 + Math.abs(i - 7) * 3}
                    x2={135 + i * 10} y2={60 + Math.abs(i - 7) * 3}
                    stroke="#06b6d4" strokeWidth="2"
                    initial={{ opacity: 0, y1: 80, y2: 70 }} animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.04 }}
                  />
                ))}
                {/* Blood capillary — animated flow */}
                <path d="M170 270 Q170 130, 190 100 Q210 130, 210 270" fill="none" stroke="#334155" strokeWidth="5" />
                <path d="M170 270 Q170 130, 190 100 Q210 130, 210 270" fill="none" stroke="#ef4444" strokeWidth="3"
                  strokeDasharray="6 4" className="process-flow-line" opacity="0.7" />
                <text x="218" y="200" fill="#fca5a5" fontSize="9">Blood capillary</text>
                {/* Lacteal */}
                <motion.line x1="200" y1="270" x2="200" y2="110" stroke="#86efac" strokeWidth="4" opacity="0.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }} />
                <text x="135" y="248" fill="#86efac" fontSize="9">Lacteal</text>
                <text x="130" y="50" fill="#94a3b8" fontSize="9">Microvilli (brush border)</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Adaptations for Absorption</div>
                {VILLI_FEATURES.map((f, i) => (
                  <motion.div key={f.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                    className="bg-black/30 border border-slate-800 rounded-xl p-3 mb-2 hover:border-cyan-500/30 transition-colors interactive-card">
                    <div className="text-sm text-cyan-300 font-medium">{f.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{f.desc}</div>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Quick Check</div>
                <p className="text-sm text-white mb-3">Why are villi important for absorption?</p>
                <div className="space-y-2">
                  {['They produce enzymes', 'They increase surface area', 'They store nutrients', 'They produce bile'].map((opt, i) => (
                    <button key={i} onClick={() => setQuizAnswer(i)} disabled={quizAnswer !== null}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                        quizAnswer === null ? 'border-slate-800 text-slate-300 hover:border-cyan-500/40' :
                        i === 1 ? 'border-green-500/50 bg-green-500/12 text-green-300' :
                        quizAnswer === i ? 'border-red-500/50 bg-red-500/10 text-red-300' :
                        'border-slate-800 text-slate-500'
                      }`}>{opt}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {quizAnswer !== null && (
                    <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-green-300 leading-relaxed">
                      ✅ Villi increase the surface area of the small intestine, allowing faster and more efficient absorption of digested nutrients.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
