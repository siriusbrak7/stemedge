import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'filtration' | 'chromatography' | 'distillation';

const METHODS: { id: Module; icon: string; title: string; principle: string; when: string; apparatus: string[]; steps: string[] }[] = [
  {
    id: 'filtration', icon: '🧫', title: 'Filtration',
    principle: 'Separates an insoluble solid from a liquid using filter paper. Solid particles are too large to pass through the paper pores.',
    when: 'Insoluble solid mixed with liquid (e.g. sand from water, precipitate collection).',
    apparatus: ['Funnel', 'Filter paper', 'Conical flask', 'Retort stand'],
    steps: ['Fold filter paper and place in funnel.', 'Pour mixture through the funnel.', 'Solid residue stays on the paper.', 'Filtrate (liquid) collects in the flask below.'],
  },
  {
    id: 'chromatography', icon: '🎨', title: 'Paper Chromatography',
    principle: 'Separates dissolved substances based on their different solubilities. More soluble components travel further up the paper with the solvent front.',
    when: 'Identifying unknown dyes, pigments, or amino acids in a mixture.',
    apparatus: ['Chromatography paper', 'Beaker', 'Solvent', 'Capillary tube', 'Pencil baseline'],
    steps: ['Draw a pencil baseline near the bottom of the paper.', 'Spot the sample mixture on the baseline.', 'Place paper in solvent (below the baseline).', 'Solvent rises by capillary action, carrying components at different rates.', 'Mark the solvent front and calculate Rf values.'],
  },
  {
    id: 'distillation', icon: '🔬', title: 'Simple Distillation',
    principle: 'Separates a solvent from a solution by evaporation and condensation. The substance with the lowest boiling point evaporates first.',
    when: 'Obtaining pure water from saltwater, or separating liquids with different boiling points.',
    apparatus: ['Round-bottom flask', 'Thermometer', 'Condenser', 'Receiving flask', 'Bunsen burner'],
    steps: ['Heat the mixture in the flask.', 'The liquid with the lower boiling point evaporates first.', 'Vapour passes through the condenser where cold water cools it.', 'Pure liquid (distillate) collects in the receiving flask.'],
  },
];

export default function SeparationTechniques() {
  const [module, setModule] = useState<Module>('filtration');
  const [rfValue, setRfValue] = useState<string>('');
  const [rfResult, setRfResult] = useState<string | null>(null);
  const [distillTemp, setDistillTemp] = useState(25);
  const [distilling, setDistilling] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const method = METHODS.find(m => m.id === module)!;

  // Chromatography Rf data
  const spots = [
    { name: 'Red dye', distFromOrigin: 6.2, color: '#ef4444' },
    { name: 'Blue dye', distFromOrigin: 3.8, color: '#3b82f6' },
    { name: 'Yellow dye', distFromOrigin: 8.1, color: '#eab308' },
  ];
  const solventFront = 9.5;

  const checkRf = () => {
    const val = Number(rfValue);
    const expected = Number((spots[0].distFromOrigin / solventFront).toFixed(2));
    if (Math.abs(val - expected) < 0.03) { setRfResult('correct'); }
    else setRfResult('wrong');
  };

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🧪 Separation Techniques</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — Master filtration, chromatography, and distillation.</p>
        </div>
        <div className="flex gap-1">
          {METHODS.map(m => (
            <button key={m.id} onClick={() => { setModule(m.id); setQuizAnswer(null); }}
              className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${module === m.id ? 'bg-green-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {m.icon} {m.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {module === 'filtration' && (
          <motion.div key="filt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Filtration Apparatus</div>
              <svg viewBox="0 0 400 300" className="w-full rounded-2xl bg-[#08120f]">
                {/* Retort stand */}
                <rect x="50" y="20" width="8" height="260" fill="#94a3b8" />
                <rect x="30" y="270" width="100" height="10" rx="3" fill="#94a3b8" />
                <rect x="55" y="60" width="80" height="6" rx="2" fill="#64748b" />
                {/* Funnel */}
                <path d="M120 70 L200 70 L180 140 L140 140 Z" fill="rgba(226,232,240,0.1)" stroke="#e2e8f0" strokeWidth="2" />
                {/* Filter paper (cone inside funnel) */}
                <path d="M130 75 L190 75 L175 130 L145 130 Z" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="160" y="105" fill="#fcd34d" fontSize="7" textAnchor="middle">Filter paper</text>
                {/* Residue on paper */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <circle key={i} cx={145 + i * 5} cy={115 + (i % 3) * 4} r="3" fill="#a3754e" opacity="0.7" />
                ))}
                <text x="210" y="120" fill="#d4a574" fontSize="8">Residue (solid)</text>
                {/* Funnel stem */}
                <rect x="155" y="140" width="10" height="50" fill="rgba(226,232,240,0.1)" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Drops */}
                <motion.circle cx="160" cy="195" r="3" fill="#38bdf8"
                  animate={{ cy: [190, 210], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
                {/* Conical flask */}
                <path d="M120 210 L200 210 L220 270 L100 270 Z" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="2" />
                <text x="160" y="255" fill="#38bdf8" fontSize="8" textAnchor="middle">Filtrate (liquid)</text>
                {/* Mixture being poured */}
                <rect x="240" y="30" width="60" height="60" rx="8" fill="rgba(168,162,158,0.1)" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="270" y="55" fill="#94a3b8" fontSize="7" textAnchor="middle">Mixture</text>
                <path d="M250 90 Q200 90, 160 75" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
            </div>
            <div className="space-y-4">
              <InfoPanel method={method} />
              <StepsPanel steps={method.steps} />
            </div>
          </motion.div>
        )}

        {module === 'chromatography' && (
          <motion.div key="chrom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Chromatogram</div>
              <svg viewBox="0 0 400 300" className="w-full rounded-2xl bg-[#0a0f14]">
                {/* Beaker */}
                <rect x="100" y="200" width="200" height="80" rx="8" fill="rgba(56,189,248,0.05)" stroke="#475569" strokeWidth="1.5" />
                {/* Solvent level */}
                <rect x="105" y="260" width="190" height="15" rx="4" fill="rgba(56,189,248,0.15)" />
                <text x="200" y="273" fill="#38bdf8" fontSize="7" textAnchor="middle">Solvent</text>
                {/* Paper strip */}
                <rect x="175" y="30" width="50" height="250" fill="rgba(255,255,255,0.03)" stroke="#cbd5e1" strokeWidth="1.5" />
                {/* Pencil baseline */}
                <line x1="178" y1="240" x2="222" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="230" y="243" fill="#94a3b8" fontSize="7">Origin line</text>
                {/* Solvent front */}
                <line x1="178" y1={240 - solventFront * 18} x2="222" y2={240 - solventFront * 18} stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="230" y={243 - solventFront * 18} fill="#22d3ee" fontSize="7">Solvent front</text>
                {/* Spots */}
                {spots.map((s, i) => (
                  <g key={s.name}>
                    <motion.circle cx="200" r="8" fill={s.color} opacity="0.7"
                      initial={{ cy: 240 }} animate={{ cy: 240 - s.distFromOrigin * 18 }}
                      transition={{ delay: 0.3 + i * 0.4, duration: 1 }} />
                    <text x="230" y={244 - s.distFromOrigin * 18} fill={s.color} fontSize="7">{s.name}</text>
                  </g>
                ))}
                {/* Measurements */}
                <text x="155" y="245" fill="#64748b" fontSize="6" textAnchor="end">0</text>
                <text x="155" y={245 - solventFront * 18} fill="#64748b" fontSize="6" textAnchor="end">{solventFront}</text>
              </svg>
            </div>
            <div className="space-y-4">
              <InfoPanel method={method} />
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Rf Value Calculator</div>
                <p className="text-sm text-slate-300 mb-2">Rf = Distance moved by spot / Distance moved by solvent front</p>
                <table className="w-full text-xs text-left mb-3">
                  <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <tr><th className="py-1 px-2">Spot</th><th className="py-1 px-2">Distance</th><th className="py-1 px-2">Rf</th></tr>
                  </thead>
                  <tbody>
                    {spots.map(s => (
                      <tr key={s.name} className="border-b border-slate-800/50 text-slate-300">
                        <td className="py-1 px-2" style={{ color: s.color }}>{s.name}</td>
                        <td className="py-1 px-2 font-mono">{s.distFromOrigin} cm</td>
                        <td className="py-1 px-2 font-mono">{(s.distFromOrigin / solventFront).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-slate-400 mb-2">Solvent front = {solventFront} cm. Calculate Rf for the red dye:</p>
                <div className="flex gap-2">
                  <input value={rfValue} onChange={e => setRfValue(e.target.value)} placeholder="Rf = ?"
                    className="flex-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2 text-white text-sm" />
                  <button onClick={checkRf} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black">Check</button>
                </div>
                {rfResult && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`mt-2 rounded-xl border p-3 text-sm ${rfResult === 'correct' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                    {rfResult === 'correct' ? `🏆 Correct! Rf = ${spots[0].distFromOrigin}/${solventFront} = ${(spots[0].distFromOrigin / solventFront).toFixed(2)}` : `Try again. Rf = distance of spot / distance of solvent front = ${spots[0].distFromOrigin}/${solventFront}`}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {module === 'distillation' && (
          <motion.div key="dist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Distillation Apparatus</div>
              <svg viewBox="0 0 440 300" className="w-full rounded-2xl bg-[#0a0f14]">
                {/* Round-bottom flask */}
                <circle cx="100" cy="200" r="50" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="2" />
                <motion.circle cx="100" cy="200" r="50" fill="rgba(239,68,68,0.0)"
                  animate={distilling ? { fill: ['rgba(239,68,68,0.0)', 'rgba(239,68,68,0.15)', 'rgba(239,68,68,0.0)'] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }} />
                <text x="100" y="205" fill="#38bdf8" fontSize="8" textAnchor="middle">Saltwater</text>
                {/* Bunsen burner */}
                <rect x="80" y="255" width="40" height="30" rx="4" fill="#f59e0b" opacity="0.3" />
                {distilling && <motion.path d="M95 255 Q100 235, 105 255" fill="#f59e0b" opacity="0.6"
                  animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 0.5 }} />}
                {/* Thermometer */}
                <rect x="95" y="120" width="10" height="35" rx="3" fill="#475569" />
                <rect x="97" y="125" width="6" height="25" rx="2" fill={distillTemp > 80 ? '#ef4444' : '#94a3b8'} />
                <text x="115" y="140" fill="#94a3b8" fontSize="8">{distillTemp}°C</text>
                {/* Delivery tube / condenser */}
                <path d="M130 155 Q180 120, 250 130 Q310 140, 340 170" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                {/* Condenser jacket */}
                <rect x="200" y="115" width="100" height="30" rx="8" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="250" y="135" fill="#38bdf8" fontSize="7" textAnchor="middle">Cold water in condenser</text>
                {/* Receiving flask */}
                <path d="M320 175 L370 175 L380 230 L310 230 Z" fill="rgba(226,232,240,0.05)" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Distillate drops */}
                {distilling && (
                  <motion.circle cx="345" cy="180" r="3" fill="#e2e8f0"
                    animate={{ cy: [175, 210], opacity: [0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                )}
                <text x="345" y="245" fill="#e2e8f0" fontSize="8" textAnchor="middle">Pure water</text>
                {/* Vapour animation */}
                {distilling && Array.from({ length: 4 }).map((_, i) => (
                  <motion.circle key={i} r="3" fill="rgba(255,255,255,0.15)"
                    initial={{ cx: 100, cy: 170 }}
                    animate={{ cx: [100, 150, 220, 300, 340], cy: [170, 140, 130, 140, 175], opacity: [0.3, 0.5, 0.4, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.6 }} />
                ))}
              </svg>
              <button onClick={() => { setDistilling(!distilling); if (!distilling) setDistillTemp(100); else setDistillTemp(25); }}
                className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest ${distilling ? 'bg-red-500 text-white' : 'bg-orange-400 text-black'}`}>
                {distilling ? '⏹ Stop Heating' : '🔥 Start Heating'}
              </button>
            </div>
            <div className="space-y-4">
              <InfoPanel method={method} />
              <StepsPanel steps={method.steps} />
              <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Quick Check</div>
                <p className="text-sm text-white mb-3">What is collected in the receiving flask?</p>
                <div className="space-y-2">
                  {['Saltwater', 'Salt crystals', 'Pure water (distillate)', 'Vapour'].map((opt, i) => (
                    <button key={i} onClick={() => setQuizAnswer(i)} disabled={quizAnswer !== null}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                        quizAnswer === null ? 'border-slate-800 text-slate-300 hover:border-cyan-500/30' :
                        i === 2 ? 'border-green-500/40 bg-green-500/10 text-green-300' :
                        quizAnswer === i ? 'border-red-500/40 bg-red-500/10 text-red-300' :
                        'border-slate-800 text-slate-500'
                      }`}>{opt}</button>
                  ))}
                </div>
                {quizAnswer !== null && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-green-300">
                    ✅ The vapour condenses back to pure water (distillate) in the condenser, leaving salt behind in the flask.
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

function InfoPanel({ method }: { method: { title: string; principle: string; when: string; apparatus: string[] } }) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">{method.title}</div>
      <p className="text-sm text-slate-300 mb-3">{method.principle}</p>
      <div className="bg-black/30 border border-slate-800 rounded-xl p-3 mb-3">
        <div className="text-[9px] uppercase text-slate-500 mb-1">When to use</div>
        <p className="text-xs text-slate-300">{method.when}</p>
      </div>
      <div className="text-[9px] uppercase text-slate-500 mb-1">Apparatus</div>
      <div className="flex flex-wrap gap-1">
        {method.apparatus.map(a => (
          <span key={a} className="text-xs bg-slate-900 border border-slate-800 rounded-full px-2 py-1 text-slate-300">{a}</span>
        ))}
      </div>
    </div>
  );
}

function StepsPanel({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Procedure</div>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
            className="flex gap-3 text-sm text-slate-300">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-400 font-bold">{i + 1}</span>
            <span>{s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
