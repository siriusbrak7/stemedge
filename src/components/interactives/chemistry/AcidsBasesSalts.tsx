import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'scale' | 'reactions' | 'indicators';

const PH_DATA = [
  { ph: 1, substance: 'Battery Acid', type: 'Strong Acid', color: '#dc2626' },
  { ph: 2, substance: 'Lemon Juice', type: 'Acid', color: '#ef4444' },
  { ph: 3, substance: 'Vinegar', type: 'Weak Acid', color: '#f97316' },
  { ph: 5, substance: 'Coffee', type: 'Weak Acid', color: '#eab308' },
  { ph: 7, substance: 'Pure Water', type: 'Neutral', color: '#22c55e' },
  { ph: 8, substance: 'Baking Soda', type: 'Weak Base', color: '#06b6d4' },
  { ph: 10, substance: 'Milk of Magnesia', type: 'Base', color: '#3b82f6' },
  { ph: 13, substance: 'NaOH (1M)', type: 'Strong Base', color: '#7c3aed' },
  { ph: 14, substance: 'Drain Cleaner', type: 'Strong Base', color: '#6d28d9' },
];

const SALT_REACTIONS = [
  { acid: 'HCl', base: 'NaOH', salt: 'NaCl', water: true, gas: '', equation: 'HCl + NaOH → NaCl + H₂O', type: 'Neutralization' },
  { acid: 'H₂SO₄', base: 'CaCO₃', salt: 'CaSO₄', water: true, gas: 'CO₂', equation: 'H₂SO₄ + CaCO₃ → CaSO₄ + H₂O + CO₂', type: 'Acid + Carbonate' },
  { acid: '2HCl', base: 'Mg', salt: 'MgCl₂', water: false, gas: 'H₂', equation: '2HCl + Mg → MgCl₂ + H₂', type: 'Acid + Metal' },
  { acid: 'HNO₃', base: 'CuO', salt: 'Cu(NO₃)₂', water: true, gas: '', equation: '2HNO₃ + CuO → Cu(NO₃)₂ + H₂O', type: 'Acid + Metal Oxide' },
];

const INDICATORS = [
  { name: 'Litmus', acid: 'Red', neutral: 'Purple', alkali: 'Blue', acidColor: '#ef4444', alkaliColor: '#3b82f6' },
  { name: 'Phenolphthalein', acid: 'Colorless', neutral: 'Colorless', alkali: 'Pink', acidColor: '#f8fafc08', alkaliColor: '#ec4899' },
  { name: 'Methyl Orange', acid: 'Red', neutral: 'Orange', alkali: 'Yellow', acidColor: '#ef4444', alkaliColor: '#eab308' },
  { name: 'Universal Indicator', acid: 'Red → Yellow', neutral: 'Green', alkali: 'Blue → Purple', acidColor: '#ef4444', alkaliColor: '#7c3aed' },
];

export default function AcidsBasesSalts() {
  const [module, setModule] = useState<Module>('scale');
  const [ph, setPh] = useState(7);
  const [reactionIdx, setReactionIdx] = useState(0);

  const phColor = ph < 4 ? '#ef4444' : ph < 7 ? '#f59e0b' : ph === 7 ? '#22c55e' : ph < 11 ? '#3b82f6' : '#7c3aed';
  const hConc = Math.pow(10, -ph);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">⚗️ Acids, Bases & Salts</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — Explore the pH scale, salt-forming reactions, and indicator behaviour.</p>
        </div>
        <div className="flex gap-1">
          {([['scale', '📊 pH Scale'], ['reactions', '🧪 Reactions'], ['indicators', '🎨 Indicators']] as [Module, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setModule(id)}
              className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${module === id ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {module === 'scale' && (
          <motion.div key="scale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Universal pH Scale</div>
              <svg viewBox="0 0 440 200" className="w-full rounded-2xl bg-[#0b0f16]">
                {/* Gradient bar */}
                <defs>
                  <linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="25%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="75%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <rect x="30" y="40" width="380" height="30" rx="8" fill="url(#phGrad)" />
                {/* Scale numbers */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <text key={i} x={30 + i * (380 / 14)} y="88" fill={i === ph ? '#ffffff' : '#64748b'} fontSize={i === ph ? '12' : '9'} textAnchor="middle" fontWeight={i === ph ? 'bold' : 'normal'}>{i}</text>
                ))}
                {/* Indicator triangle */}
                <motion.g animate={{ x: 30 + ph * (380 / 14) - 30 }}>
                  <polygon points="30,35 35,25 25,25" fill="#ffffff" />
                </motion.g>
                {/* Beaker */}
                <rect x="160" y="105" width="120" height="80" rx="8" fill={phColor} opacity="0.25" stroke={phColor} strokeWidth="2" />
                <text x="220" y="150" fill={phColor} fontSize="28" textAnchor="middle" fontWeight="bold">{ph}</text>
                <text x="220" y="170" fill="#94a3b8" fontSize="9" textAnchor="middle">{ph < 7 ? 'ACIDIC' : ph === 7 ? 'NEUTRAL' : 'ALKALINE'}</text>
              </svg>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>pH Value</span><span className="font-mono text-white">{ph}</span></div>
                <input type="range" min={0} max={14} value={ph} onChange={e => setPh(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">[H⁺] Concentration</div>
                <div className="text-2xl font-mono text-white">{hConc.toExponential(1)} mol/dm³</div>
                <p className="mt-3 text-xs text-slate-400">Each pH unit = 10× change in H⁺ concentration. pH 3 has 10,000× more H⁺ than pH 7.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Common Substances</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {PH_DATA.map(s => (
                    <div key={s.ph} className="flex items-center gap-3 text-sm text-slate-300 py-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="font-mono text-xs w-8">{s.ph}</span>
                      <span>{s.substance}</span>
                      <span className="text-xs text-slate-500 ml-auto">{s.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'reactions' && (
          <motion.div key="reactions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Salt-Forming Reactions</div>
              <div className="flex gap-2 flex-wrap mb-4">
                {SALT_REACTIONS.map((r, i) => (
                  <button key={i} onClick={() => setReactionIdx(i)}
                    className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${reactionIdx === i ? 'bg-green-400 text-black' : 'bg-slate-900 text-slate-300'}`}>
                    {r.type}
                  </button>
                ))}
              </div>
              {(() => {
                const r = SALT_REACTIONS[reactionIdx];
                return (
                  <motion.div key={reactionIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-black/40 border border-slate-700 rounded-2xl p-5 text-center">
                      <p className="text-xl text-white font-mono">{r.equation}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                        <div className="text-[9px] uppercase text-slate-500">Acid</div>
                        <div className="text-sm text-red-400 font-mono mt-1">{r.acid}</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                        <div className="text-[9px] uppercase text-slate-500">Base/Metal</div>
                        <div className="text-sm text-blue-400 font-mono mt-1">{r.base}</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                        <div className="text-[9px] uppercase text-slate-500">Salt</div>
                        <div className="text-sm text-green-400 font-mono mt-1">{r.salt}</div>
                      </div>
                    </div>
                    {r.gas && (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-sm text-yellow-300 text-center">
                        Gas produced: <strong className="font-mono">{r.gas}</strong> {r.gas === 'CO₂' ? '(limewater turns milky)' : '(squeaky pop test)'}
                      </div>
                    )}
                  </motion.div>
                );
              })()}
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">WAEC Pattern</div>
              <ul className="text-sm text-slate-300 space-y-3">
                <li className="bg-black/30 border border-slate-800 rounded-xl p-3">
                  <strong className="text-white">Acid + Base → Salt + Water</strong>
                  <p className="text-xs text-slate-500 mt-1">Neutralization. Always produces water.</p>
                </li>
                <li className="bg-black/30 border border-slate-800 rounded-xl p-3">
                  <strong className="text-white">Acid + Carbonate → Salt + Water + CO₂</strong>
                  <p className="text-xs text-slate-500 mt-1">Produces carbon dioxide. Fizzing observed.</p>
                </li>
                <li className="bg-black/30 border border-slate-800 rounded-xl p-3">
                  <strong className="text-white">Acid + Metal → Salt + H₂</strong>
                  <p className="text-xs text-slate-500 mt-1">Reactive metals only. Hydrogen gas produced.</p>
                </li>
                <li className="bg-black/30 border border-slate-800 rounded-xl p-3">
                  <strong className="text-white">Acid + Metal Oxide → Salt + Water</strong>
                  <p className="text-xs text-slate-500 mt-1">Metal oxide acts as a base.</p>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {module === 'indicators' && (
          <motion.div key="indicators" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Indicator Behaviour at pH {ph}</div>
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Drag to change pH</span><span className="font-mono text-white">{ph}</span></div>
                <input type="range" min={0} max={14} value={ph} onChange={e => setPh(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {INDICATORS.map(ind => {
                  const inAcid = ph < 7;
                  const neutral = ph === 7;
                  const displayColor = inAcid ? ind.acidColor : ind.alkaliColor;
                  const displayText = inAcid ? ind.acid : neutral ? ind.neutral : ind.alkali;
                  return (
                    <motion.div key={ind.name} layout className="bg-black/40 border border-slate-700 rounded-2xl p-4 text-center">
                      <div className="text-xs text-slate-500 mb-2">{ind.name}</div>
                      <motion.div className="w-16 h-16 rounded-full mx-auto border-2 border-white/10"
                        animate={{ backgroundColor: displayColor }} transition={{ duration: 0.5 }} />
                      <div className="text-sm text-white mt-2 font-medium">{displayText}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Indicator Reference Table</div>
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-2">Indicator</th><th className="py-2 px-2">Acid</th><th className="py-2 px-2">Neutral</th><th className="py-2 px-2">Alkali</th></tr>
                </thead>
                <tbody>
                  {INDICATORS.map(ind => (
                    <tr key={ind.name} className="border-b border-slate-800/50 text-slate-300">
                      <td className="py-2 px-2 font-medium">{ind.name}</td>
                      <td className="py-2 px-2">{ind.acid}</td>
                      <td className="py-2 px-2">{ind.neutral}</td>
                      <td className="py-2 px-2">{ind.alkali}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-300">
                <strong className="text-cyan-400">WAEC Tip:</strong> Universal indicator gives a continuous colour spectrum and is preferred for estimating pH values. Litmus only tells you acidic vs alkaline.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
