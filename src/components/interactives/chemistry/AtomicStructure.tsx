import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, GraduationCap, Plus, Minus, Atom } from 'lucide-react';

type ViewMode = 'explore' | 'build' | 'learn';

const ELEMENTS: Record<string, { name: string; symbol: string; protons: number; neutrons: number; electrons: number }> = {
  '1': { name: 'Hydrogen', symbol: 'H', protons: 1, neutrons: 0, electrons: 1 },
  '2': { name: 'Helium', symbol: 'He', protons: 2, neutrons: 2, electrons: 2 },
  '6': { name: 'Carbon', symbol: 'C', protons: 6, neutrons: 6, electrons: 6 },
  '7': { name: 'Nitrogen', symbol: 'N', protons: 7, neutrons: 7, electrons: 7 },
  '8': { name: 'Oxygen', symbol: 'O', protons: 8, neutrons: 8, electrons: 8 },
  '11': { name: 'Sodium', symbol: 'Na', protons: 11, neutrons: 12, electrons: 11 },
  '12': { name: 'Magnesium', symbol: 'Mg', protons: 12, neutrons: 12, electrons: 12 },
  '17': { name: 'Chlorine', symbol: 'Cl', protons: 17, neutrons: 18, electrons: 17 },
  '20': { name: 'Calcium', symbol: 'Ca', protons: 20, neutrons: 20, electrons: 20 },
  '26': { name: 'Iron', symbol: 'Fe', protons: 26, neutrons: 30, electrons: 26 },
};

const PARTICLES = [
  { id: 'p', name: 'Proton', charge: '+1', mass: '1 amu', desc: 'Positively charged particle in the nucleus. Determines element identity.', color: 'bg-red-500', textColor: 'text-red-400' },
  { id: 'n', name: 'Neutron', charge: '0', mass: '1 amu', desc: 'Neutral particle in the nucleus. Holds the nucleus together via strong force.', color: 'bg-slate-500', textColor: 'text-slate-400' },
  { id: 'e', name: 'Electron', charge: '-1', mass: '~0 amu', desc: 'Negatively charged. Orbits the nucleus in electron shells.', color: 'bg-cyan-400', textColor: 'text-cyan-400' },
];

export default function AtomicStructure() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);

  const selected = PARTICLES.find(p => p.id === hovered);
  const charge = protons - electrons;
  const massNumber = protons + neutrons;
  const element = ELEMENTS[protons.toString()];
  const isIon = charge !== 0;
  const isIsotope = element && neutrons !== element.neutrons;

  const getShellConfig = (e: number) => {
    const shells: number[] = [];
    let remaining = e;
    const maxPerShell = [2, 8, 8, 18, 18, 32];
    for (let i = 0; i < maxPerShell.length && remaining > 0; i++) {
      const inShell = Math.min(remaining, maxPerShell[i]);
      shells.push(inShell);
      remaining -= inShell;
    }
    return shells;
  };

  const shells = getShellConfig(electrons);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-full p-8 gap-8">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button onClick={() => setViewMode('explore')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Eye size={14} /> Explore
        </button>
        <button onClick={() => setViewMode('build')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'build' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Atom size={14} /> Build
        </button>
        <button onClick={() => setViewMode('learn')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <GraduationCap size={14} /> Learn
        </button>
      </div>

      {viewMode === 'explore' ? (
        <>
          <div className="w-full md:w-1/3 flex flex-col gap-4 z-40 mt-8">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Atom Scanner</h2>
            <div className={`p-6 rounded-2xl border transition-all duration-300 min-h-[200px] flex flex-col justify-center ${selected ? 'bg-slate-900 border-slate-700' : 'bg-slate-900/40 border-brand-border'}`}>
              {selected ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${selected.color} shadow-[0_0_10px_currentColor]`}></div>
                    <h3 className="text-2xl font-bold text-white">{selected.name}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{selected.desc}</p>
                  <div className="flex gap-4">
                    <div className="bg-black/50 p-2 rounded border border-slate-800 text-center flex-1">
                      <span className="block text-[8px] uppercase tracking-widest text-slate-500 mb-1">Charge</span>
                      <span className="font-mono font-bold text-brand-accent">{selected.charge}</span>
                    </div>
                    <div className="bg-black/50 p-2 rounded border border-slate-800 text-center flex-1">
                      <span className="block text-[8px] uppercase tracking-widest text-slate-500 mb-1">Mass</span>
                      <span className="font-mono font-bold text-orange-400">{selected.mass}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-slate-500 font-mono text-sm">
                  Hover over a subatomic particle to scan its properties.
                </div>
              )}
            </div>
          </div>

          <div className="relative w-[300px] h-[300px] flex items-center justify-center group">
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/50"></div>
            <div className="absolute inset-16 rounded-full border border-dashed border-slate-700/50"></div>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} className="absolute inset-16 z-20 pointer-events-none">
              <div className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-auto cursor-pointer" onMouseEnter={() => setHovered('e')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute bottom-0 left-1/2 -ml-2 -mb-2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-auto cursor-pointer" onMouseEnter={() => setHovered('e')} onMouseLeave={() => setHovered(null)}></div>
            </motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} className="absolute inset-4 z-20 pointer-events-none">
              <div className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-auto cursor-pointer" onMouseEnter={() => setHovered('e')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute bottom-0 left-1/2 -ml-2 -mb-2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-auto cursor-pointer" onMouseEnter={() => setHovered('e')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute left-0 top-1/2 -mt-2 -ml-2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-auto cursor-pointer" onMouseEnter={() => setHovered('e')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute right-0 top-1/2 -mt-2 -mr-2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-auto cursor-pointer" onMouseEnter={() => setHovered('e')} onMouseLeave={() => setHovered(null)}></div>
            </motion.div>
            <div className="relative w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center p-1 z-30">
              <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('p')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-5 left-5 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer hover:scale-125 transition-transform z-10" onMouseEnter={() => setHovered('p')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute bottom-3 right-4 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('p')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-8 left-2 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('p')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute bottom-5 left-6 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('p')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-2 right-4 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('p')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-4 left-2 w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('n')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-3 right-5 w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('n')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute bottom-4 left-3 w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('n')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute bottom-2 right-6 w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('n')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-7 right-3 w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)] cursor-pointer hover:scale-125 transition-transform" onMouseEnter={() => setHovered('n')} onMouseLeave={() => setHovered(null)}></div>
              <div className="absolute top-6 left-7 w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)] cursor-pointer hover:scale-125 transition-transform z-20" onMouseEnter={() => setHovered('n')} onMouseLeave={() => setHovered(null)}></div>
            </div>
          </div>
        </>
      ) : viewMode === 'build' ? (
        <div className="flex flex-col items-center gap-8 mt-8 w-full max-w-2xl">
          <div className="flex gap-6 w-full">
            <div className="flex-1 space-y-4">
              <div className="bg-slate-900/60 rounded-xl p-4 border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Protons</span>
                  <span className="text-2xl font-mono font-bold text-red-400">{protons}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setProtons(Math.max(1, protons - 1))} className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 flex items-center justify-center"><Minus size={16} /></button>
                  <button onClick={() => setProtons(Math.min(26, protons + 1))} className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 flex items-center justify-center"><Plus size={16} /></button>
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Neutrons</span>
                  <span className="text-2xl font-mono font-bold text-slate-400">{neutrons}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setNeutrons(Math.max(0, neutrons - 1))} className="w-10 h-10 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-400 hover:bg-slate-700 flex items-center justify-center"><Minus size={16} /></button>
                  <button onClick={() => setNeutrons(Math.min(40, neutrons + 1))} className="w-10 h-10 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-400 hover:bg-slate-700 flex items-center justify-center"><Plus size={16} /></button>
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-4 border border-cyan-400/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Electrons</span>
                  <span className="text-2xl font-mono font-bold text-cyan-400">{electrons}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setElectrons(Math.max(0, electrons - 1))} className="w-10 h-10 bg-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/30 flex items-center justify-center"><Minus size={16} /></button>
                  <button onClick={() => setElectrons(Math.min(30, electrons + 1))} className="w-10 h-10 bg-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/30 flex items-center justify-center"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-black/60 rounded-2xl border border-brand-accent/30 p-6 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Your Atom</div>
                {element ? (
                  <div>
                    <div className="text-5xl font-bold text-white mb-2">{element.symbol}</div>
                    <div className="text-lg text-slate-400">{element.name}</div>
                  </div>
                ) : (
                  <div className="text-2xl text-slate-600">Unknown</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Atomic #</div>
                  <div className="text-xl font-mono font-bold text-red-400">{protons}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Mass #</div>
                  <div className="text-xl font-mono font-bold text-orange-400">{massNumber}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Charge</div>
                  <div className={`text-xl font-mono font-bold ${charge === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {charge === 0 ? '0 (neutral)' : charge > 0 ? `+${charge}` : charge}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Shells</div>
                  <div className="text-sm font-mono font-bold text-cyan-400">
                    {shells.join(', ')}
                  </div>
                </div>
              </div>

              {isIon && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                    Ion: {element?.symbol || '?'}{charge > 0 ? `${charge}+` : `${Math.abs(charge)}-`}
                  </span>
                </div>
              )}

              {isIsotope && element && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                  <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                    Isotope: {massNumber}{element.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-8 max-w-lg">
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
            <h3 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Atomic Number = Identity</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The number of protons determines which element an atom is. Change the protons, change the element. Every carbon atom has exactly 6 protons.
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3">Isotopes</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Atoms of the same element with different numbers of neutrons are called isotopes. Carbon-12 and Carbon-14 both have 6 protons, but Carbon-14 has 8 neutrons.
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3">Ions</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              When an atom gains or loses electrons, it becomes an ion. A positive ion (cation) has lost electrons. A negative ion (anion) has gained electrons.
            </p>
          </div>
          <button
            onClick={() => setViewMode('build')}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Try Building Atoms →
          </button>
        </div>
      )}
    </div>
  );
}
