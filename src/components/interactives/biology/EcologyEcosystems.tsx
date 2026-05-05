import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'foodweb' | 'population' | 'cycles';

const TROPHIC_LEVELS = [
  { level: 'Producers',          examples: 'Grass, algae, phytoplankton',      energy: 10000, color: '#22c55e', emoji: '🌿' },
  { level: 'Primary Consumers',  examples: 'Grasshoppers, rabbits, zooplankton', energy: 1000, color: '#38bdf8', emoji: '🐛' },
  { level: 'Secondary Consumers',examples: 'Frogs, small birds, fish',           energy: 100,  color: '#f59e0b', emoji: '🐸' },
  { level: 'Tertiary Consumers', examples: 'Hawks, snakes, large fish',           energy: 10,   color: '#ef4444', emoji: '🦅' },
];

const TABS = [
  { id: 'foodweb'    as Module, label: 'Food Webs',   icon: '🕸️' },
  { id: 'population' as Module, label: 'Populations', icon: '📈' },
  { id: 'cycles'     as Module, label: 'Cycles',      icon: '♻️' },
];

export default function EcologyEcosystems() {
  const [module, setModule] = useState<Module>('foodweb');
  const [predators, setPredators] = useState(20);
  const [prey, setPrey] = useState(70);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [generations, setGenerations] = useState<{ gen: number; prey: number; pred: number }[]>([]);
  const [chartKey, setChartKey] = useState(0);

  const simulate = () => {
    const results: { gen: number; prey: number; pred: number }[] = [];
    let p = prey, d = predators;
    for (let g = 0; g < 12; g++) {
      results.push({ gen: g, prey: Math.round(p), pred: Math.round(d) });
      const newP = Math.max(5, p + 0.25 * p - d * 0.5);
      const newD = Math.max(2, d + p * 0.08 - d * 0.12);
      p = newP; d = newD;
    }
    setGenerations(results);
    setChartKey(k => k + 1);
  };

  // Build chart points
  const chartW = 340, chartH = 180;
  const chartPad = { l: 40, r: 10, t: 10, b: 30 };
  const maxPop = generations.length > 0 ? Math.max(...generations.map(g => Math.max(g.prey, g.pred * 2))) : 100;
  const toX = (i: number) => chartPad.l + (i / 11) * (chartW - chartPad.l - chartPad.r);
  const toY = (v: number) => chartH - chartPad.b - (v / maxPop) * (chartH - chartPad.t - chartPad.b);
  const preyPoints = generations.map((g, i) => `${toX(i)},${toY(g.prey)}`).join(' ');
  const predPoints = generations.map((g, i) => `${toX(i)},${toY(g.pred)}`).join(' ');

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🌍 Ecology &amp; Ecosystems</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Food webs, population dynamics, and nutrient cycling.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="green" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── FOOD WEBS ── */}
        {module === 'foodweb' && (
          <motion.div key="fw" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Energy Pyramid</div>
              <svg viewBox="0 0 400 270" className="w-full rounded-2xl bg-[#081713]">
                {TROPHIC_LEVELS.map((t, i) => {
                  const w = 300 - i * 68;
                  const x = (400 - w) / 2;
                  const y = 195 - i * 54;
                  return (
                    <g key={t.level}>
                      {/* Background fill */}
                      <motion.rect x={x} y={y} width={w} height="46" rx="10"
                        fill={t.color} opacity="0.12" stroke={t.color} strokeWidth="1.5"
                        initial={{ scaleX: 0, originX: '50%' }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.55, delay: (3 - i) * 0.12, ease: 'easeOut' }}
                      />
                      {/* Energy bar fill */}
                      <motion.rect x={x + 2} y={y + 36} width={w - 4} height="8" rx="6"
                        fill={t.color} opacity="0.35"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        style={{ transformOrigin: `${x}px ${y + 40}px` }}
                        transition={{ duration: 0.6, delay: (3 - i) * 0.12 + 0.2, ease: 'easeOut' }}
                      />
                      <motion.text x={200} y={y + 20} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (3 - i) * 0.12 + 0.3 }}>
                        {t.emoji} {t.level}
                      </motion.text>
                      <motion.text x={200} y={y + 35} fill={t.color} fontSize="8" textAnchor="middle"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (3 - i) * 0.12 + 0.4 }}>
                        {t.energy.toLocaleString()} kJ/m²/yr
                      </motion.text>
                    </g>
                  );
                })}
                <text x="200" y="255" fill="#64748b" fontSize="9" textAnchor="middle">Only ~10% of energy transfers between trophic levels</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Trophic Levels</div>
                {TROPHIC_LEVELS.map((t, i) => (
                  <motion.div key={t.level}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 mb-3 p-2 rounded-xl hover:bg-white/4 transition-colors"
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: t.color }}>{t.level}</div>
                      <div className="text-xs text-slate-400">{t.examples}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p><strong className="text-white">10% Rule:</strong> Only ~10% of energy is passed to the next level. The rest is lost as heat (respiration), excretion, and uneaten parts.</p>
                <p>This is why food chains rarely have more than <strong className="text-green-400">4–5 trophic levels</strong>.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── POPULATIONS ── */}
        {module === 'population' && (
          <motion.div key="pop" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Predator-Prey Cycles</div>

              {generations.length > 0 ? (
                <svg key={chartKey} viewBox={`0 0 ${chartW} ${chartH}`} className="w-full rounded-2xl bg-[#0a1019] overflow-hidden">
                  {/* Grid lines */}
                  {[0.25, 0.5, 0.75].map(f => (
                    <line key={f} x1={chartPad.l} y1={toY(maxPop * f)} x2={chartW - chartPad.r} y2={toY(maxPop * f)}
                      stroke="#1e293b" strokeWidth="1" />
                  ))}
                  {/* Axes */}
                  <line x1={chartPad.l} y1={chartH - chartPad.b} x2={chartW - chartPad.r} y2={chartH - chartPad.b} stroke="#475569" strokeWidth="1.5" />
                  <line x1={chartPad.l} y1={chartPad.t} x2={chartPad.l} y2={chartH - chartPad.b} stroke="#475569" strokeWidth="1.5" />
                  <text x={chartW / 2} y={chartH - 5} fill="#64748b" fontSize="8" textAnchor="middle">Generation</text>

                  {/* Prey line — draw on */}
                  {preyPoints && (
                    <motion.polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round"
                      points={preyPoints}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.5))' }}
                    />
                  )}
                  {/* Predator line — draw on */}
                  {predPoints && (
                    <motion.polyline fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round"
                      points={predPoints}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(251,113,133,0.5))' }}
                    />
                  )}

                  {/* Data point dots */}
                  {generations.map((g, i) => (
                    <g key={i}>
                      <motion.circle cx={toX(i)} cy={toY(g.prey)} r="3" fill="#38bdf8"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.05 }} />
                      <motion.circle cx={toX(i)} cy={toY(g.pred)} r="3" fill="#fb7185"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 + i * 0.05 }} />
                    </g>
                  ))}

                  {/* Legend */}
                  <rect x={chartW - 80} y="12" width="10" height="10" rx="2" fill="#38bdf8" />
                  <text x={chartW - 66} y="21" fill="#38bdf8" fontSize="8">Prey</text>
                  <rect x={chartW - 80} y="26" width="10" height="10" rx="2" fill="#fb7185" />
                  <text x={chartW - 66} y="35" fill="#fb7185" fontSize="8">Predators</text>
                </svg>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                  <span className="text-3xl">📊</span>
                  <span>Set populations and click Simulate</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Initial Prey Population" value={prey} min={20} max={100} color="cyan" onChange={setPrey} />
                <StemSlider label="Initial Predator Population" value={predators} min={5} max={60} color="pink" onChange={setPredators} />
                <motion.button
                  onClick={simulate}
                  whileTap={{ scale: 0.96 }}
                  className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  ▶ Simulate 12 Generations
                </motion.button>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-3">
                <p><strong className="text-white">Predator-prey lag:</strong> Predator populations peak <em>after</em> prey populations peak, creating oscillating cycles.</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>↑ Prey → ↑ Food for predators</div>
                  <div>→ ↑ Predators → ↓ Prey</div>
                  <div>→ ↓ Predators → cycle repeats</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CARBON CYCLE ── */}
        {module === 'cycles' && (
          <motion.div key="cycles" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Carbon Cycle</div>
              <svg viewBox="0 0 400 280" className="w-full rounded-2xl bg-[#0a1019]">
                {/* Atmosphere */}
                <motion.rect x="120" y="10" width="160" height="40" rx="10"
                  fill="rgba(148,163,184,0.08)" stroke="#94a3b8" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
                <text x="200" y="35" fill="#94a3b8" fontSize="10" textAnchor="middle">CO₂ in Atmosphere</text>

                {/* Photosynthesis arrow */}
                <motion.path d="M160 50 L100 110" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowG2)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
                <text x="105" y="78" fill="#86efac" fontSize="8">Photosynthesis</text>

                {/* Plants */}
                <motion.circle cx="80" cy="140" r="30" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} />
                <text x="80" y="143" fill="#22c55e" fontSize="9" textAnchor="middle">🌿 Plants</text>

                {/* Respiration dashed arrow */}
                <motion.path d="M100 120 L165 52" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arrowAmb)"
                  className="process-flow-line"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
                <text x="68" y="72" fill="#fcd34d" fontSize="7">Respiration</text>

                {/* Feeding arrow */}
                <motion.path d="M110 140 L190 162" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowB2)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
                <text x="148" y="148" fill="#93c5fd" fontSize="7">Feeding</text>

                {/* Animals */}
                <motion.circle cx="220" cy="172" r="30" fill="rgba(251,113,133,0.12)" stroke="#fb7185" strokeWidth="2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }} />
                <text x="220" y="175" fill="#fb7185" fontSize="9" textAnchor="middle">🐄 Animals</text>

                {/* Decomposition */}
                <motion.path d="M220 202 L200 248" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arrowP)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.4 }} />
                <motion.circle cx="180" cy="260" r="25" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
                <text x="180" y="263" fill="#a78bfa" fontSize="8" textAnchor="middle">Decomposers</text>

                {/* Combustion */}
                <motion.rect x="300" y="200" width="70" height="35" rx="8"
                  fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} />
                <text x="335" y="222" fill="#ef4444" fontSize="8" textAnchor="middle">Fossil Fuels</text>
                <motion.path d="M335 200 L280 52" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR2)"
                  className="process-flow-line" opacity="0.6"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.1 }} />
                <text x="322" y="130" fill="#fca5a5" fontSize="7">Combustion</text>

                <defs>
                  <marker id="arrowG2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#22c55e" /></marker>
                  <marker id="arrowB2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#38bdf8" /></marker>
                  <marker id="arrowP"  markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#a78bfa" /></marker>
                  <marker id="arrowR2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#ef4444" /></marker>
                  <marker id="arrowAmb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f59e0b" /></marker>
                </defs>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Carbon Cycle Processes</div>
                <div className="space-y-2">
                  {[
                    { name: 'Photosynthesis', desc: 'CO₂ removed from atmosphere by plants → glucose', color: '#22c55e' },
                    { name: 'Respiration',    desc: 'All organisms release CO₂ back by breaking down glucose', color: '#f59e0b' },
                    { name: 'Decomposition', desc: 'Decomposers break down dead matter, releasing CO₂', color: '#a78bfa' },
                    { name: 'Combustion',    desc: 'Burning fossil fuels rapidly releases stored carbon as CO₂', color: '#ef4444' },
                  ].map((p, i) => (
                    <motion.div key={p.name}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-black/30 border border-slate-800 rounded-xl p-3 hover:border-slate-600 transition-colors interactive-card"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <div className="text-sm font-bold" style={{ color: p.color }}>{p.name}</div>
                      </div>
                      <div className="text-xs text-slate-400">{p.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Check */}
              <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Quick Check</div>
                <p className="text-sm text-white mb-3">What is the main human activity that increases atmospheric CO₂?</p>
                <div className="space-y-2">
                  {['Photosynthesis', 'Burning fossil fuels', 'Decomposition', 'Transpiration'].map((opt, i) => (
                    <button key={i} onClick={() => setQuizAnswer(i)} disabled={quizAnswer !== null}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                        quizAnswer === null ? 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5' :
                        i === 1 ? 'border-green-500/50 bg-green-500/12 text-green-300 anim-bounce-in' :
                        quizAnswer === i ? 'border-red-500/50 bg-red-500/10 text-red-300 anim-shake' :
                        'border-slate-800 text-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {quizAnswer !== null && (
                    <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-green-300 leading-relaxed">
                      ✅ Burning fossil fuels (combustion) releases carbon locked underground for millions of years, rapidly increasing atmospheric CO₂ and contributing to climate change.
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
