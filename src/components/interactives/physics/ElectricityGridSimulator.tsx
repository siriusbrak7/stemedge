import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'grid' | 'losses' | 'efficiency';

const TABS = [
  { id: 'grid'       as Module, label: 'Live Grid',    icon: '⚡' },
  { id: 'losses'     as Module, label: 'Transmission', icon: '🔌' },
  { id: 'efficiency' as Module, label: 'Efficiency',   icon: '📊' },
];

export default function ElectricityGridSimulator() {
  const [module, setModule] = useState<Module>('grid');
  const [generation, setGeneration] = useState(750);
  const [demand, setDemand] = useState(620);
  const [voltage, setVoltage] = useState(161);
  const [distance, setDistance] = useState(160);

  const current = generation / voltage;
  const resistance = 0.05 * distance; // 0.05 Ω/km
  const powerLoss = current * current * resistance;
  const lossPercent = Math.min(40, (powerLoss / generation) * 100);
  const delivered = Math.max(0, Math.round(generation * (1 - lossPercent / 100)));
  const margin = delivered - demand;
  const isOk = margin >= 0;

  // Electron flow speed for animation
  const flowSpeed = Math.min(3, Math.max(0.5, generation / 400));

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">⚡ Electricity Grid Simulator</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Balance generation, transmission voltage, line losses, and demand.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="cyan" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── LIVE GRID ── */}
        {module === 'grid' && (
          <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.3fr,0.7fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">National Grid Model</div>
              <svg viewBox="0 0 480 260" className="w-full rounded-2xl bg-[#060c12]">
                {/* ── Power station ── */}
                <rect x="20" y="90" width="90" height="80" rx="12" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
                <text x="65" y="122" fill="#22c55e" fontSize="10" textAnchor="middle" fontWeight="bold">⚡ Station</text>
                <text x="65" y="137" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">{generation} MW</text>
                <text x="65" y="152" fill="#64748b" fontSize="8" textAnchor="middle">generation</text>

                {/* ── Step-up transformer ── */}
                <rect x="140" y="108" width="60" height="44" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="170" y="127" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">Step-Up</text>
                <text x="170" y="140" fill="#7dd3fc" fontSize="8" textAnchor="middle">→ {voltage} kV</text>

                {/* ── Transmission line with animated current ── */}
                <line x1="200" y1="130" x2="300" y2="130" stroke="#22c55e" strokeWidth="3" opacity="0.3" />
                <motion.line x1="200" y1="124" x2="300" y2="124" stroke="#22c55e" strokeWidth="2"
                  strokeDasharray="10 8"
                  animate={{ strokeDashoffset: [40, 0] }}
                  transition={{ duration: 1.2 / flowSpeed, repeat: Infinity, ease: 'linear' }}
                  style={{ filter: 'drop-shadow(0 0 3px #22c55e)' }} />
                <motion.line x1="200" y1="136" x2="300" y2="136" stroke="#22c55e" strokeWidth="2"
                  strokeDasharray="10 8"
                  animate={{ strokeDashoffset: [40, 0] }}
                  transition={{ duration: 1.2 / flowSpeed, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                  style={{ filter: 'drop-shadow(0 0 3px #22c55e)' }} />

                {/* Distance / heat loss label */}
                <text x="250" y="118" fill="#64748b" fontSize="7.5" textAnchor="middle">{distance} km</text>
                <motion.text x="250" y="155" fill="#f59e0b" fontSize="8" textAnchor="middle"
                  animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                  🔥 {lossPercent.toFixed(1)}% heat loss
                </motion.text>

                {/* ── Step-down transformer ── */}
                <rect x="300" y="108" width="60" height="44" rx="8" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.5" />
                <text x="330" y="127" fill="#a78bfa" fontSize="8" textAnchor="middle" fontWeight="bold">Step-Down</text>
                <text x="330" y="140" fill="#c4b5fd" fontSize="8" textAnchor="middle">→ 11 kV</text>

                {/* ── Distribution arrow ── */}
                <motion.line x1="360" y1="130" x2="400" y2="130" stroke="#a78bfa" strokeWidth="2"
                  strokeDasharray="6 4" animate={{ strokeDashoffset: [20, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />

                {/* ── Consumer box ── */}
                <rect x="400" y="90" width="70" height="80" rx="12" fill="#0f172a"
                  stroke={isOk ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
                <text x="435" y="118" fill={isOk ? '#22c55e' : '#ef4444'} fontSize="9" textAnchor="middle" fontWeight="bold">🏘 Demand</text>
                <text x="435" y="133" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">{demand} MW</text>
                <text x="435" y="149" fill="#64748b" fontSize="7.5" textAnchor="middle">required</text>
                <text x="435" y="162" fill={isOk ? '#22c55e' : '#ef4444'} fontSize="7.5" textAnchor="middle">{isOk ? `+${margin} spare` : `−${Math.abs(margin)} short`}</text>

                {/* ── Tower pylons ── */}
                {[230, 265].map(x => (
                  <g key={x}>
                    <line x1={x} y1="110" x2={x} y2="145" stroke="#475569" strokeWidth="2" />
                    <line x1={x - 12} y1="114" x2={x + 12} y2="114" stroke="#475569" strokeWidth="1.5" />
                    <line x1={x - 8} y1="120" x2={x + 8} y2="120" stroke="#475569" strokeWidth="1.5" />
                  </g>
                ))}

                {/* ── Status bar ── */}
                <rect x="20" y="195" width="440" height="50" rx="10"
                  fill={isOk ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}
                  stroke={isOk ? '#22c55e30' : '#ef444430'} />
                <text x="240" y="216" fill={isOk ? '#22c55e' : '#ef4444'} fontSize="9.5" textAnchor="middle" fontWeight="bold">
                  {isOk ? `✓ SUPPLY MEETS DEMAND — Reserve: ${margin} MW` : `⚠ SHORTFALL: ${Math.abs(margin)} MW — increase generation or raise voltage`}
                </text>
                <text x="240" y="235" fill="#64748b" fontSize="8" textAnchor="middle">
                  P = I²R loss = ({current.toFixed(1)} A)² × {resistance.toFixed(0)} Ω = {powerLoss.toFixed(0)} MW wasted
                </text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Generation" value={generation} min={200} max={1200} unit=" MW" color="green" onChange={setGeneration} />
                <StemSlider label="Demand" value={demand} min={200} max={1200} unit=" MW" color="orange" onChange={setDemand} />
                <StemSlider label="Transmission voltage" value={voltage} min={33} max={330} unit=" kV" color="cyan" onChange={setVoltage} />
                <StemSlider label="Line distance" value={distance} min={20} max={400} unit=" km" color="purple" onChange={setDistance} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Current', value: `${current.toFixed(1)} A`, color: '#38bdf8' },
                  { label: 'Line R', value: `${resistance.toFixed(0)} Ω`, color: '#a78bfa' },
                  { label: 'Power loss', value: `${lossPercent.toFixed(1)}%`, color: '#f59e0b' },
                  { label: 'Delivered', value: `${delivered} MW`, color: isOk ? '#22c55e' : '#ef4444' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                    <div className="text-[9px] uppercase text-slate-500">{m.label}</div>
                    <div className="text-lg font-mono font-bold mt-1" style={{ color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TRANSMISSION ── */}
        {module === 'losses' && (
          <motion.div key="losses" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Power Loss vs Transmission Voltage</div>
              <svg viewBox="0 0 340 200" className="w-full rounded-2xl bg-[#08111b] mb-3">
                <line x1="40" y1="170" x2="320" y2="170" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="20"  x2="40"  y2="170" stroke="#334155" strokeWidth="1.5" />
                {/* Curve: loss ∝ 1/V² */}
                {(() => {
                  const pts = [];
                  for (let v = 33; v <= 330; v += 10) {
                    const I = generation / v;
                    const loss = Math.min(40, (I * I * resistance / generation) * 100);
                    const x = 40 + ((v - 33) / (330 - 33)) * 280;
                    const y = 170 - (loss / 40) * 150;
                    pts.push(`${x},${y}`);
                  }
                  return (
                    <>
                      <polyline points={pts.join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2.5"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.6))' }} />
                      {/* Current voltage marker */}
                      {(() => {
                        const vx = 40 + ((voltage - 33) / (330 - 33)) * 280;
                        const vy = 170 - (lossPercent / 40) * 150;
                        return (
                          <>
                            <motion.circle cx={vx} cy={vy} r="5" fill="#38bdf8"
                              animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            <line x1={vx} y1={vy} x2={vx} y2="170" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                          </>
                        );
                      })()}
                    </>
                  );
                })()}
                <text x="180" y="190" fill="#64748b" fontSize="8" textAnchor="middle">Voltage (kV)</text>
                <text x="18" y="95" fill="#64748b" fontSize="7" transform="rotate(-90 18 95)">Loss (%)</text>
              </svg>
              <p className="text-xs text-slate-500 text-center">Blue dot = current setting ({voltage} kV → {lossPercent.toFixed(1)}% loss)</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">The Key Equation</div>
                <div className="bg-black/30 rounded-xl p-4 text-center mb-3">
                  <p className="text-white font-mono text-base">P_loss = I²R</p>
                  <p className="text-slate-500 text-xs mt-1">Where I = P/V (power over voltage)</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Doubling the transmission voltage halves the current, which reduces power loss by a factor of <strong className="text-cyan-400">4</strong> (since loss ∝ I²). This is why national grids transmit at 275–400 kV.
                </p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Generation" value={generation} min={200} max={1200} unit=" MW" color="green" onChange={setGeneration} />
                <StemSlider label="Transmission voltage" value={voltage} min={33} max={330} unit=" kV" color="cyan" onChange={setVoltage} />
                <StemSlider label="Line distance" value={distance} min={20} max={400} unit=" km" color="purple" onChange={setDistance} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EFFICIENCY ── */}
        {module === 'efficiency' && (
          <motion.div key="efficiency" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="grid gap-5 lg:grid-cols-2 mb-5">
              {[
                { label: 'Useful output (delivered)', value: delivered, color: '#22c55e', pct: (delivered / generation) * 100 },
                { label: 'Wasted (heat in lines)', value: generation - delivered, color: '#f59e0b', pct: lossPercent },
              ].map((b, i) => (
                <motion.div key={b.label} initial={{ opacity: 0, x: i === 0 ? -12 : 12 }} animate={{ opacity: 1, x: 0 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: b.color }}>{b.label}</div>
                  <div className="text-4xl font-mono font-bold mb-2" style={{ color: b.color }}>{b.pct.toFixed(1)}%</div>
                  <div className="text-sm text-slate-400 mb-3">{b.value} MW</div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: b.color }}
                      animate={{ width: `${b.pct}%` }} transition={{ type: 'spring', stiffness: 60, damping: 15 }} />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 overflow-x-auto">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Transformers in the Grid</div>
              <table className="w-full text-sm min-w-[460px]">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-3 text-left">Location</th><th className="py-2 px-3">Type</th><th className="py-2 px-3">Voltage Change</th><th className="py-2 px-3">Why</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Power station', 'Step-up', '25 kV → 275–400 kV', 'Reduce current → cut I²R losses over long distance'],
                    ['Grid substation', 'Step-down', '275 kV → 132 kV', 'Heavy industry supply'],
                    ['Local substation', 'Step-down', '132 kV → 33 kV → 11 kV', 'Offices and light industry'],
                    ['Street transformer', 'Step-down', '11 kV → 230 V', 'Homes and small businesses'],
                  ].map(([loc, type, v, why], i) => (
                    <motion.tr key={loc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20 text-slate-300">
                      <td className="py-2.5 px-3 text-white font-medium">{loc}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{type}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-yellow-300">{v}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-xs">{why}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
