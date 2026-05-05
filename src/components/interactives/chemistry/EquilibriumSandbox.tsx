import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'principle' | 'kc' | 'applications';

const TABS = [
  { id: 'principle'    as Module, label: 'Le Chatelier',    icon: '⚖️' },
  { id: 'kc'           as Module, label: 'Kc Calculator',   icon: '🧮' },
  { id: 'applications' as Module, label: 'Haber Process',   icon: '🏭' },
];

export default function EquilibriumSandbox() {
  const [module, setModule] = useState<Module>('principle');
  
  // N2 + 3H2 <=> 2NH3 (Exothermic: ΔH = -92 kJ/mol)
  const [pressure, setPressure] = useState(200); // atm
  const [temperature, setTemperature] = useState(450); // C
  
  // Calculate relative yield of NH3 based on conditions
  const yieldNH3 = useMemo(() => {
    // Favour high pressure (4 moles gas -> 2 moles gas)
    const pFactor = pressure / 400; 
    // Favour low temp (Exothermic) - but needs activation energy
    const tFactor = Math.max(0.1, 1 - (temperature - 200) / 600);
    return Math.min(100, Math.max(5, (pFactor * tFactor) * 100 * 2));
  }, [pressure, temperature]);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">⚖️ Chemical Equilibrium</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — Reversible reactions, Le Chatelier's Principle, and the Haber Process.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="cyan" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── LE CHATELIER ── */}
        {module === 'principle' && (
          <motion.div key="principle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Dynamic Equilibrium</div>
              
              <div className="flex justify-center items-center gap-4 py-8 bg-[#060c12] rounded-2xl border border-slate-800 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">N₂ + 3H₂</div>
                  <div className="text-xs text-slate-500">Reactants (4 moles)</div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <motion.div className="text-yellow-400 font-bold"
                    animate={{ x: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                    ⇌
                  </motion.div>
                  <div className="text-[10px] text-pink-400 whitespace-nowrap">ΔH = -92 kJ/mol</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">2NH₃</div>
                  <div className="text-xs text-slate-500">Products (2 moles)</div>
                </div>
              </div>

              {/* See-saw animation */}
              <div className="h-40 relative flex items-center justify-center mt-8">
                {/* Pivot */}
                <div className="absolute bottom-0 w-4 h-8 bg-slate-600 custom-triangle" />
                
                {/* Board */}
                <motion.div 
                  className="w-64 h-2 bg-slate-400 rounded-full flex justify-between items-end pb-2 px-2"
                  animate={{ rotate: yieldNH3 > 50 ? 10 : yieldNH3 < 30 ? -10 : 0 }}
                  transition={{ type: 'spring', stiffness: 50 }}>
                  
                  {/* Reactant blocks */}
                  <div className="flex gap-1 mb-1">
                    <div className="w-8 h-8 bg-cyan-500/20 border-2 border-cyan-500 rounded flex items-center justify-center text-xs font-bold text-cyan-300">N₂</div>
                    <div className="w-8 h-8 bg-blue-500/20 border-2 border-blue-500 rounded flex items-center justify-center text-xs font-bold text-blue-300">3H₂</div>
                  </div>

                  {/* Product blocks */}
                  <div className="w-12 h-12 bg-green-500/20 border-2 border-green-500 rounded flex items-center justify-center text-sm font-bold text-green-300 mb-1">
                    2NH₃
                  </div>
                </motion.div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                When a stress is applied to a system at equilibrium, the system shifts to counteract the stress.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Pressure (atm)" value={pressure} min={1} max={500} color="purple" onChange={setPressure} />
                <StemSlider label="Temperature (°C)" value={temperature} min={100} max={800} color="orange" onChange={setTemperature} />
              </div>
              
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Equilibrium Shift</div>
                <div className="text-3xl font-mono font-black text-green-400 mb-2">{yieldNH3.toFixed(1)}% NH₃</div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  {yieldNH3 > 50 
                    ? "The equilibrium position has shifted to the RIGHT (favouring products)." 
                    : "The equilibrium position has shifted to the LEFT (favouring reactants)."}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/30 p-2 rounded-lg border border-slate-800 text-slate-400">
                    <strong className="text-purple-400">Pressure:</strong> High pressure favours the side with fewer moles of gas (Products: 2 vs Reactants: 4).
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-slate-800 text-slate-400">
                    <strong className="text-orange-400">Temperature:</strong> Low temperature favours the exothermic (forward) reaction.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── KC CALCULATOR ── */}
        {module === 'kc' && (
          <motion.div key="kc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Equilibrium Constant (Kc)</div>
              <div className="bg-[#0a0a1a] rounded-xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
                <div className="text-white font-mono text-lg mb-2">aA + bB ⇌ cC + dD</div>
                <div className="flex items-center gap-2 mt-4 text-xl font-mono text-slate-300">
                  <span>Kc =</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="border-b-2 border-slate-600 pb-1">[C]<sup>c</sup> [D]<sup>d</sup></span>
                    <span>[A]<sup>a</sup> [B]<sup>b</sup></span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Kc is constant at a constant temperature. Only changing the temperature changes the value of Kc.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <h3 className="text-cyan-400 font-bold mb-2">Meaning of Kc Value</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-green-400 font-bold min-w-[60px]">Kc &gt; 1</span>
                    <span>Reaction favours products (equilibrium lies to the right).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400 font-bold min-w-[60px]">Kc &lt; 1</span>
                    <span>Reaction favours reactants (equilibrium lies to the left).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-yellow-400 font-bold min-w-[60px]">Kc ≈ 1</span>
                    <span>Significant amounts of both reactants and products are present.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HABER PROCESS ── */}
        {module === 'applications' && (
          <motion.div key="applications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-6 max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">🏭 The Haber Process (Industrial Compromise)</h3>
              <p className="text-slate-300 mb-6">
                To maximize ammonia (NH₃) yield economically, industry must balance Le Chatelier's Principle against reaction rate and cost.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-orange-400 mb-1">Temp: ~450°C</div>
                  <p className="text-xs text-slate-400">Low temp gives higher yield, but reaction would be too slow. 450°C is a compromise between yield and rate.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-purple-400 mb-1">Pressure: 200 atm</div>
                  <p className="text-xs text-slate-400">High pressure increases yield and rate, but building stronger pipes/vessels is very expensive and dangerous.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-slate-300 mb-1">Iron Catalyst</div>
                  <p className="text-xs text-slate-400">Speeds up both forward and reverse reactions equally. Reaches equilibrium faster, doesn't change yield.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .custom-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
}
