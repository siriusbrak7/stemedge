import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'sankey' | 'efficiency' | 'devices';

const TABS = [
  { id: 'sankey'     as Module, label: 'Energy Flow',   icon: '🌊' },
  { id: 'efficiency' as Module, label: 'Efficiency',    icon: '📊' },
  { id: 'devices'    as Module, label: 'Devices',       icon: '🔌' },
];

const DEVICES = [
  { id: 'filament', name: 'Filament Bulb', input: 100, useful: 5, wasted: 95, usefulType: 'Light', wastedType: 'Heat', icon: '💡', color: '#f59e0b' },
  { id: 'led', name: 'LED Bulb', input: 10, useful: 8, wasted: 2, usefulType: 'Light', wastedType: 'Heat', icon: '🔦', color: '#38bdf8' },
  { id: 'motor', name: 'Electric Motor', input: 1000, useful: 800, wasted: 200, usefulType: 'Kinetic', wastedType: 'Heat + Sound', icon: '⚙️', color: '#a78bfa' },
  { id: 'kettle', name: 'Electric Kettle', input: 2000, useful: 1800, wasted: 200, usefulType: 'Heat (Water)', wastedType: 'Heat (Surroundings)', icon: '☕', color: '#ef4444' },
];

export default function EnergyTransferSankey() {
  const [module, setModule] = useState<Module>('sankey');
  const [activeDevice, setActiveDevice] = useState(0);
  const [customInput, setCustomInput] = useState(100);
  const [customEfficiency, setCustomEfficiency] = useState(40);

  const device = DEVICES[activeDevice];
  
  // Custom Sankey variables
  const inputE = customInput;
  const usefulE = (customEfficiency / 100) * inputE;
  const wastedE = inputE - usefulE;

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🌊 Energy Flow (Sankey)</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Visualise energy transfers, useful output, wasted energy, and efficiency.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="orange" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── SANKEY ── */}
        {module === 'sankey' && (
          <motion.div key="sankey" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Live Sankey Diagram</div>
              
              <div className="flex gap-2 flex-wrap mb-6">
                {DEVICES.map((d, i) => (
                  <button key={d.id} onClick={() => { setActiveDevice(i); setCustomInput(d.input); setCustomEfficiency((d.useful / d.input) * 100); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${activeDevice === i ? 'text-black' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
                    style={activeDevice === i ? { backgroundColor: d.color, boxShadow: `0 0 12px ${d.color}60` } : {}}>
                    {d.icon} {d.name}
                  </button>
                ))}
              </div>

              <svg viewBox="0 0 400 240" className="w-full rounded-2xl bg-[#08111b] overflow-visible">
                {/* Input block */}
                <path d="M 20 80 L 120 80 L 120 180 L 20 180 Z" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="2" />
                <text x="70" y="125" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">Input</text>
                <text x="70" y="145" fill="#bae6fd" fontSize="14" textAnchor="middle" fontWeight="black">{inputE.toFixed(0)} J</text>
                
                {/* Useful Flow (straight) */}
                {(() => {
                  const width = (usefulE / inputE) * 100;
                  const wStr = Math.max(2, width);
                  return (
                    <motion.path d={`M 120 80 L 300 80 L 300 ${80 + wStr} L 120 ${80 + wStr} Z`} 
                      fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                  );
                })()}
                
                {/* Wasted Flow (curved down) */}
                {(() => {
                  const uWidth = (usefulE / inputE) * 100;
                  const wWidth = (wastedE / inputE) * 100;
                  const startY = 80 + uWidth;
                  const endY = startY + wWidth;
                  return (
                    <motion.path 
                      d={`M 120 ${startY} L 160 ${startY} Q 200 ${startY} 200 ${startY + 40} L 200 220 L ${200 - wWidth} 220 L ${200 - wWidth} ${startY + 40} Q ${200 - wWidth} ${startY} 120 ${endY} Z`}
                      fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
                  );
                })()}

                {/* Particle animations along flows */}
                <motion.circle cx="150" cy={80 + (usefulE/inputE)*50} r="3" fill="#86efac"
                  animate={{ cx: [120, 280], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx="160" cy={100} r="3" fill="#fca5a5"
                  animate={{ cx: [120, 180, 180], cy: [120, 120, 200], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.5 }} />

                {/* Output labels */}
                <text x="320" y={80 + (usefulE/inputE)*50} fill="#22c55e" fontSize="12" fontWeight="bold">Useful</text>
                <text x="320" y={80 + (usefulE/inputE)*50 + 15} fill="#bbf7d0" fontSize="14" fontWeight="black">{usefulE.toFixed(0)} J</text>
                
                <text x="210" y="210" fill="#ef4444" fontSize="12" fontWeight="bold">Wasted</text>
                <text x="210" y="225" fill="#fecaca" fontSize="14" fontWeight="black">{wastedE.toFixed(0)} J</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Adjust Energy Flow</div>
                <StemSlider label="Total Input Energy" value={customInput} min={10} max={3000} unit=" J" color="cyan" onChange={setCustomInput} />
                <StemSlider label="Efficiency" value={customEfficiency} min={1} max={100} unit="%" color="green" onChange={setCustomEfficiency} />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                <p className="mb-2"><strong>Sankey diagrams</strong> show energy transfers to scale. The width of each arrow represents the amount of energy.</p>
                <p>Conservation of Energy: <br/><span className="text-cyan-400 font-mono">Input = Useful + Wasted</span></p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EFFICIENCY ── */}
        {module === 'efficiency' && (
          <motion.div key="efficiency" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
               <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">The Efficiency Equation</div>
               <div className="bg-[#0a0a1a] rounded-xl p-6 text-center border border-slate-800 mb-6">
                 <p className="text-white font-mono text-lg mb-2">Efficiency = <span className="text-green-400">(Useful Energy Out)</span> / <span className="text-cyan-400">(Total Energy In)</span></p>
                 <p className="text-slate-400 text-sm">Multiply by 100 to get a percentage.</p>
               </div>
               
               <div className="space-y-4">
                 {[
                   { label: 'Total Input', val: customInput, color: '#38bdf8' },
                   { label: 'Useful Output', val: usefulE, color: '#22c55e' },
                   { label: 'Wasted Output', val: wastedE, color: '#ef4444' }
                 ].map((bar, i) => (
                   <div key={bar.label}>
                     <div className="flex justify-between text-xs font-bold mb-1" style={{ color: bar.color }}>
                       <span>{bar.label}</span>
                       <span>{bar.val.toFixed(1)} J</span>
                     </div>
                     <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div className="h-full rounded-full" style={{ backgroundColor: bar.color }}
                         initial={{ width: 0 }} animate={{ width: `${(bar.val / customInput) * 100}%` }} transition={{ delay: i * 0.1 }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-green-500/20 bg-green-500/5 p-5">
                <h3 className="text-green-400 font-bold mb-2">Current Efficiency: {customEfficiency.toFixed(1)}%</h3>
                <p className="text-sm text-slate-300">This means {customEfficiency.toFixed(1)}% of the input energy is transferred usefully. The other {(100 - customEfficiency).toFixed(1)}% is wasted (dissipated to the surroundings, usually as heat).</p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Test Yourself</div>
                <p className="text-sm text-slate-300 mb-3">If a motor takes in 500J and wastes 100J as heat, what is its efficiency?</p>
                <div className="bg-black/30 p-3 rounded-xl font-mono text-sm text-slate-400">
                  <p>1. Useful = 500 - 100 = 400J</p>
                  <p>2. Eff = (400 / 500) × 100</p>
                  <p className="text-green-400 font-bold mt-1">Answer = 80%</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── DEVICES ── */}
        {module === 'devices' && (
          <motion.div key="devices" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="grid gap-4 md:grid-cols-2">
              {DEVICES.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${d.color}20`, color: d.color }}>{d.icon}</div>
                    <div>
                      <h4 className="text-white font-bold">{d.name}</h4>
                      <p className="text-xs text-slate-500">Efficiency: {((d.useful / d.input) * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                      <span className="text-slate-500 block">Useful ({d.usefulType})</span>
                      <span className="text-green-400 font-mono font-bold text-sm">{d.useful} J</span>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                      <span className="text-slate-500 block">Wasted ({d.wastedType})</span>
                      <span className="text-red-400 font-mono font-bold text-sm">{d.wasted} J</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
