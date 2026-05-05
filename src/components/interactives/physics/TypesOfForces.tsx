import { useState } from 'react';
import { motion } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';
import { MoveHorizontal, RotateCcw } from 'lucide-react';

type ViewMode = 'freebody' | 'netforce' | 'scenarios';

const TABS = [
  { id: 'freebody' as ViewMode, label: 'Free Body', icon: '📦' },
  { id: 'netforce' as ViewMode, label: 'Net Force', icon: 'Σ' },
  { id: 'scenarios' as ViewMode, label: 'Scenarios', icon: '🧭' },
];

const SCENARIOS = [
  { id: 'free', name: 'Free Body', friction: 0, tension: 0, weight: 50, normal: 50, desc: 'Block at rest on a surface' },
  { id: 'pushed', name: 'Being Pushed', friction: 30, tension: 50, weight: 50, normal: 50, desc: 'Block being pushed to the right' },
  { id: 'braking', name: 'Car Braking', friction: 80, tension: 0, weight: 100, normal: 100, desc: 'Car slowing down due to friction' },
  { id: 'hanging', name: 'Hanging Object', friction: 0, tension: 50, weight: 50, normal: 0, desc: 'Object suspended by a rope' },
];

export default function TypesOfForces() {
  const [forces, setForces] = useState({ friction: 0, tension: 0, weight: 50, normal: 50 });
  const [viewMode, setViewMode] = useState<ViewMode>('freebody');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showFBD, setShowFBD] = useState(true);

  const netX = forces.tension - forces.friction;
  const netY = forces.normal - forces.weight;

  const loadScenario = (id: string) => {
    const scenario = SCENARIOS.find(s => s.id === id);
    if (scenario) {
      setForces({ friction: scenario.friction, tension: scenario.tension, weight: scenario.weight, normal: scenario.normal });
      setSelectedScenario(id);
    }
  };

  const reset = () => {
    setForces({ friction: 0, tension: 0, weight: 50, normal: 50 });
    setSelectedScenario(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <h3 className="text-xl font-bold text-white">Types of Forces</h3>
          <p className="text-xs text-slate-500">Free-body diagrams, net force, and real situations</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor={viewMode === 'scenarios' ? 'green' : 'cyan'} />
      </div>

      <div className="w-full max-w-2xl bg-slate-900/50 p-6 rounded-2xl border border-brand-border mb-8 flex flex-col sm:flex-row gap-6 justify-between items-center z-50">
        <div className="flex-1 w-full space-y-5">
          <StemSlider label="Friction (←)" value={forces.friction} min={0} max={100} unit=" N" color="red"
            onChange={v => setForces({ ...forces, friction: v })} />
          <StemSlider label="Applied Force (→)" value={forces.tension} min={0} max={100} unit=" N" color="green"
            onChange={v => setForces({ ...forces, tension: v })} />
          <StemSlider label="Weight (↓)" value={forces.weight} min={0} max={200} unit=" N" color="cyan"
            onChange={v => setForces({ ...forces, weight: v, normal: v })} />
        </div>

        <div className="h-16 w-px bg-brand-border hidden sm:block"></div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Net Force</div>
          <div className={`text-4xl font-mono font-bold ${netX > 0 ? 'text-green-500' : netX < 0 ? 'text-red-500' : 'text-slate-400'}`}>
            {Math.abs(netX)}N {netX > 0 ? '→' : netX < 0 ? '←' : '⚖'}
          </div>
          {netX === 0 && (
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs font-bold">
              EQUILIBRIUM
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setShowFBD(!showFBD)}
              className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                showFBD ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              FBD
            </button>
            <button
              onClick={reset}
              className="p-1 bg-slate-800 text-slate-400 rounded hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'scenarios' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 w-full max-w-4xl">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => loadScenario(s.id)}
              className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                selectedScenario === s.id
                  ? 'bg-green-400 text-black border-green-400 shadow-[0_0_18px_rgba(74,222,128,0.35)]'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="block">{s.name}</span>
              <span className="block mt-1 text-[10px] normal-case font-medium tracking-normal opacity-70">{s.desc}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative w-full max-w-lg h-56 flex items-center justify-center mt-4">
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-800 rounded-full border border-slate-600"></div>

        <motion.div
          animate={{ x: netX * 0.3 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative w-28 h-28 rounded-xl border border-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center z-20 mb-4"
          style={{ background: 'linear-gradient(135deg, #94a3b8, #475569)' }}
        >
          <span className="text-white font-bold opacity-50 text-sm">5 kg</span>

          {showFBD && viewMode !== 'netforce' && (
            <>
              {forces.friction > 0 && (
                <motion.div
                  className="absolute top-1/2 -left-2 flex items-center pr-2"
                  animate={{ width: forces.friction * 1.5 }}
                  style={{ y: '-50%', right: '100%' }}
                >
                  <div className="flex-1 h-2 bg-red-500 rounded-l-md"></div>
                  <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-red-500 -ml-1"></div>
                  <span className="absolute -top-6 left-0 text-red-400 text-xs font-bold font-mono">{forces.friction}N</span>
                </motion.div>
              )}

              {forces.tension > 0 && (
                <motion.div
                  className="absolute top-1/2 -right-2 flex items-center pl-2"
                  animate={{ width: forces.tension * 1.5 }}
                  style={{ y: '-50%', left: '100%' }}
                >
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-green-500 -mr-1"></div>
                  <div className="flex-1 h-2 bg-green-500 rounded-r-md"></div>
                  <span className="absolute -top-6 right-0 text-green-400 text-xs font-bold font-mono">{forces.tension}N</span>
                </motion.div>
              )}

              {forces.weight > 0 && (
                <motion.div className="absolute -bottom-14 left-1/2 flex flex-col items-center" style={{ x: '-50%' }}>
                  <div className="w-2 bg-blue-500 opacity-60" style={{ height: `${forces.weight * 0.5}px` }}></div>
                  <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-blue-500 opacity-60 -mt-1"></div>
                  <span className="text-blue-400 text-[10px] font-bold mt-1">{forces.weight}N</span>
                </motion.div>
              )}

              {forces.normal > 0 && (
                <motion.div className="absolute -top-14 left-1/2 flex flex-col items-center" style={{ x: '-50%' }}>
                  <span className="text-yellow-400 text-[10px] font-bold mb-1">{forces.normal}N</span>
                  <div className="w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-yellow-500 opacity-60 -mb-1"></div>
                  <div className="w-2 bg-yellow-500 opacity-60" style={{ height: `${forces.normal * 0.5}px` }}></div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {netX !== 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md ${
              netX > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <MoveHorizontal size={16} />
            <span className="text-sm font-bold">F=ma → Accelerating {netX > 0 ? 'Right' : 'Left'}</span>
          </motion.div>
        )}
      </div>

      {viewMode === 'netforce' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-2xl grid gap-3 md:grid-cols-2"
        >
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Equilibrium</h4>
            <p className="text-slate-300 text-sm">
              Net force is the vector sum of all forces. If ΣF = 0, the object is in equilibrium and does not accelerate.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Here ΣFx = {netX} N and ΣFy = {netY} N.
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Force Types</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-red-400">Friction: opposes motion</div>
              <div className="text-green-400">Applied: external push</div>
              <div className="text-blue-400">Weight: gravity pull</div>
              <div className="text-yellow-400">Normal: surface support</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
