import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'hw' | 'evolution' | 'genetics';

const TABS = [
  { id: 'hw'        as Module, label: 'HW Simulator',  icon: '📊' },
  { id: 'evolution' as Module, label: 'Evolution',      icon: '🧬' },
  { id: 'genetics'  as Module, label: 'Mendelian',      icon: '🫘' },
];

export default function PopulationGeneticsSimulator() {
  const [module, setModule] = useState<Module>('hw');
  const [startP, setStartP] = useState(60);
  const [selectionPressure, setSelectionPressure] = useState(0);
  const [migrationPressure, setMigrationPressure] = useState(0);
  const [generations, setGenerations] = useState(5);

  const model = useMemo(() => {
    const p0 = startP / 100;
    const pts = [];
    let p = p0;
    for (let g = 0; g <= generations; g++) {
      const q = 1 - p;
      pts.push({ gen: g, p, q, AA: p * p, Aa: 2 * p * q, aa: q * q });
      // Apply evolutionary forces
      p = Math.max(0.01, Math.min(0.99, p + (selectionPressure / 100) * 0.06 + (migrationPressure / 100) * 0.04));
    }
    return pts;
  }, [startP, selectionPressure, migrationPressure, generations]);

  const final = model[model.length - 1];
  const isHW = selectionPressure === 0 && migrationPressure === 0;

  // Chart dimensions
  const W = 360, H = 180, padL = 40, padB = 30;
  const toX = (g: number) => padL + (g / generations) * (W - padL - 10);
  const toY = (v: number) => H - padB - v * (H - padB - 10);

  const pLine = model.map((d, i) => `${toX(i)},${toY(d.p)}`).join(' ');
  const qLine = model.map((d, i) => `${toX(i)},${toY(d.q)}`).join(' ');

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🧬 Population Genetics</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Hardy-Weinberg equilibrium, allele frequencies, and evolutionary forces.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="pink" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── HW SIMULATOR ── */}
        {module === 'hw' && (
          <motion.div key="hw" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Allele Frequency Over Generations</div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl bg-[#0a1019] mb-3">
                {/* Grid */}
                {[0.25, 0.5, 0.75].map(f => (
                  <line key={f} x1={padL} y1={toY(f)} x2={W - 10} y2={toY(f)} stroke="#1e293b" strokeWidth="1" />
                ))}
                {/* HW equilibrium line */}
                {isHW && (
                  <line x1={padL} y1={toY(startP / 100)} x2={W - 10} y2={toY(startP / 100)}
                    stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                )}
                {/* Axes */}
                <line x1={padL} y1={H - padB} x2={W - 10} y2={H - padB} stroke="#475569" strokeWidth="1.5" />
                <line x1={padL} y1="10" x2={padL} y2={H - padB} stroke="#475569" strokeWidth="1.5" />
                {/* Y labels */}
                {[0, 0.25, 0.5, 0.75, 1].map(f => (
                  <text key={f} x={padL - 4} y={toY(f) + 4} fill="#64748b" fontSize="7" textAnchor="end">{f.toFixed(2)}</text>
                ))}
                <text x={padL + (W - padL) / 2} y={H - 4} fill="#64748b" fontSize="8" textAnchor="middle">Generation</text>
                {/* p line */}
                <motion.polyline fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round"
                  points={pLine}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(251,113,133,0.5))' }} />
                {/* q line */}
                <motion.polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round"
                  points={qLine}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.5))' }} />
                {/* Legend */}
                <rect x={W - 80} y="12" width="8" height="8" rx="2" fill="#fb7185" />
                <text x={W - 68} y="20" fill="#fb7185" fontSize="8">p (dominant)</text>
                <rect x={W - 80} y="26" width="8" height="8" rx="2" fill="#38bdf8" />
                <text x={W - 68} y="34" fill="#38bdf8" fontSize="8">q (recessive)</text>
                {isHW && <text x={W - 68} y="48" fill="#fbbf24" fontSize="7">— HW equilibrium</text>}
              </svg>

              {/* Genotype bars */}
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Genotype Distribution (generation {generations})</div>
              <div className="flex gap-4 items-end h-32">
                {[
                  { label: 'AA', value: final.AA, color: '#fb7185' },
                  { label: 'Aa', value: final.Aa, color: '#a78bfa' },
                  { label: 'aa', value: final.aa, color: '#38bdf8' },
                ].map((bar, i) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-mono font-bold" style={{ color: bar.color }}>{(bar.value * 100).toFixed(1)}%</span>
                    <div className="w-full bg-slate-800/60 rounded-lg overflow-hidden" style={{ height: '88px' }}>
                      <motion.div className="w-full rounded-lg"
                        style={{ backgroundColor: bar.color, marginTop: 'auto' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.value * 88}px` }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs text-white font-mono">{bar.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center font-mono">p² + 2pq + q² = {(final.AA + final.Aa + final.aa).toFixed(3)}</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Starting p allele (%)" value={startP} min={5} max={95} unit="%" color="pink" onChange={setStartP} />
                <StemSlider label="Selection pressure" value={selectionPressure} min={-50} max={50} color="orange" onChange={setSelectionPressure} />
                <StemSlider label="Migration pressure" value={migrationPressure} min={-50} max={50} color="purple" onChange={setMigrationPressure} />
                <StemSlider label="Generations" value={generations} min={2} max={20} color="cyan" onChange={setGenerations} />
              </div>

              <div className={`rounded-[2rem] border p-5 transition-all ${isHW ? 'border-yellow-500/30 bg-yellow-500/8' : 'border-pink-500/30 bg-pink-500/8'}`}>
                <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 ${isHW ? 'text-yellow-400' : 'text-pink-400'}`}>
                  {isHW ? '⚖ Hardy-Weinberg Equilibrium' : '🔄 Evolution in Progress'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div><span className="text-slate-500">p =</span> <span className="text-pink-400 font-bold">{final.p.toFixed(3)}</span></div>
                  <div><span className="text-slate-500">q =</span> <span className="text-cyan-400 font-bold">{final.q.toFixed(3)}</span></div>
                  <div><span className="text-slate-500">p² =</span> <span className="text-white">{(final.AA * 100).toFixed(1)}%</span></div>
                  <div><span className="text-slate-500">2pq =</span> <span className="text-white">{(final.Aa * 100).toFixed(1)}%</span></div>
                  <div className="col-span-2"><span className="text-slate-500">q² =</span> <span className="text-white">{(final.aa * 100).toFixed(1)}%</span></div>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {isHW
                    ? 'No evolutionary forces = allele frequencies remain constant. p + q = 1.'
                    : 'Selection and/or migration are shifting allele frequencies from the HW expectation.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EVOLUTION ── */}
        {module === 'evolution' && (
          <motion.div key="evolution" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              {[
                { title: 'Five Conditions for HW Equilibrium', color: '#fbbf24', icon: '⚖️',
                  items: ['1. No mutations — allele types stay constant', '2. Random mating — no mate preference', '3. No gene flow — no migration in/out', '4. No genetic drift — infinitely large population', '5. No natural selection — all genotypes equally fit'] },
                { title: 'Natural Selection', color: '#22c55e', icon: '🦋',
                  items: ['Directional: one allele favoured over another', 'Stabilising: intermediate phenotype favoured', 'Disruptive: extremes favoured, splits population', 'Acts on phenotype, not genotype directly'] },
              ].map((card, i) => (
                <motion.div key={card.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 interactive-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{card.icon}</span>
                    <div className="text-sm font-bold" style={{ color: card.color }}>{card.title}</div>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {card.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </motion.div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { title: 'Genetic Drift', color: '#a78bfa', icon: '🎲',
                  body: 'Random changes in allele frequency due to chance. Most significant in SMALL populations. Two types: Bottleneck effect (population disaster) and Founder effect (small group colonises new area).' },
                { title: 'Gene Flow (Migration)', color: '#38bdf8', icon: '🌊',
                  body: 'Movement of alleles between populations via immigration or emigration. Increases variation in receiving population, decreases between populations over time.' },
                { title: 'Mutation', color: '#fb7185', icon: '⚡',
                  body: 'Ultimate source of all new alleles. Mutations are random and mostly neutral or harmful. Rarely beneficial — but when they are, selection can increase their frequency.' },
              ].map((card, i) => (
                <motion.div key={card.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 interactive-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{card.icon}</span>
                    <div className="text-sm font-bold" style={{ color: card.color }}>{card.title}</div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── GENETICS ── */}
        {module === 'genetics' && (
          <motion.div key="genetics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <PunnettSquare />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PunnettSquare() {
  const [p1, setP1] = useState<[string,string]>(['T','t']);
  const [p2, setP2] = useState<[string,string]>(['T','t']);
  const [showRatios, setShowRatios] = useState(false);

  const cells = [
    [p1[0] + p2[0], p1[0] + p2[1]],
    [p1[1] + p2[0], p1[1] + p2[1]],
  ];
  const genotypes = cells.flat();
  const dom = genotypes.filter(g => g.includes('T'[0].toUpperCase()) && (g[0] === g[0].toUpperCase() || g[1] === g[1].toUpperCase())).length;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Punnett Square</div>
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-4">
          <div />
          {p2.map((a, i) => <div key={i} className="text-center text-lg font-bold text-pink-400">{a}</div>)}
          {p1.map((a, ri) => (
            <>
              <div key={`r${ri}`} className="text-lg font-bold text-cyan-400 flex items-center">{a}</div>
              {p2.map((b, ci) => {
                const g = (a + b).split('').sort((x,y) => x.toLowerCase() < y.toLowerCase() ? 1 : x === y ? (x === x.toUpperCase() ? -1 : 1) : -1).join('');
                const isDom = g.includes(g[0].toUpperCase());
                return (
                  <motion.div key={ci} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (ri * 2 + ci) * 0.1, type: 'spring' }}
                    className={`h-14 rounded-xl border flex items-center justify-center text-xl font-bold ${isDom ? 'border-green-500/40 bg-green-500/12 text-green-300' : 'border-pink-500/40 bg-pink-500/12 text-pink-300'}`}>
                    {g}
                  </motion.div>
                );
              })}
            </>
          ))}
        </div>
        <button onClick={() => setShowRatios(r => !r)} className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:border-slate-500 transition-colors">
          {showRatios ? 'Hide' : 'Show'} Phenotype Ratios
        </button>
        <AnimatePresence>
          {showRatios && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-xl border border-slate-800 bg-black/30 p-3 text-sm text-slate-300 overflow-hidden">
              <div className="flex justify-between">
                <span>Dominant phenotype:</span>
                <span className="text-green-400 font-bold">{dom}/4 ({(dom * 100 / 4).toFixed(0)}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Recessive phenotype:</span>
                <span className="text-pink-400 font-bold">{4 - dom}/4 ({((4 - dom) * 100 / 4).toFixed(0)}%)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Set Parental Alleles</div>
          {[['Parent 1 (P₁)', p1, setP1], ['Parent 2 (P₂)', p2, setP2]].map(([label, val, setter], i) => (
            <div key={i as number} className="mb-3">
              <div className="text-xs text-slate-400 mb-2">{label as string}</div>
              <div className="flex gap-2">
                {['TT', 'Tt', 'tt'].map(geno => (
                  <button key={geno} onClick={() => (setter as Function)([geno[0], geno[1]])}
                    className={`flex-1 rounded-xl border py-2 text-sm font-bold transition-all ${JSON.stringify(val) === JSON.stringify([geno[0], geno[1]]) ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300' : 'border-slate-700 text-slate-400'}`}>
                    {geno}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
          <p>• <strong className="text-white">Dominant allele (T)</strong>: expressed whenever present (TT or Tt)</p>
          <p>• <strong className="text-white">Recessive allele (t)</strong>: only expressed in homozygous state (tt)</p>
          <p>• A Punnett square predicts the <strong className="text-cyan-400">probability</strong> of each genotype in offspring</p>
        </div>
      </div>
    </div>
  );
}
