import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, RotateCcw, Eye, GraduationCap, Minus } from 'lucide-react';

type ViewMode = 'explore' | 'build' | 'learn';

const ELEMENTS: Record<number, { name: string; symbol: string; config: string }> = {
  1: { name: 'Hydrogen', symbol: 'H', config: '1s¹' },
  2: { name: 'Helium', symbol: 'He', config: '1s²' },
  3: { name: 'Lithium', symbol: 'Li', config: '[He] 2s¹' },
  4: { name: 'Beryllium', symbol: 'Be', config: '[He] 2s²' },
  5: { name: 'Boron', symbol: 'B', config: '[He] 2s² 2p¹' },
  6: { name: 'Carbon', symbol: 'C', config: '[He] 2s² 2p²' },
  7: { name: 'Nitrogen', symbol: 'N', config: '[He] 2s² 2p³' },
  8: { name: 'Oxygen', symbol: 'O', config: '[He] 2s² 2p⁴' },
  9: { name: 'Fluorine', symbol: 'F', config: '[He] 2s² 2p⁵' },
  10: { name: 'Neon', symbol: 'Ne', config: '[He] 2s² 2p⁶' },
  11: { name: 'Sodium', symbol: 'Na', config: '[Ne] 3s¹' },
  12: { name: 'Magnesium', symbol: 'Mg', config: '[Ne] 3s²' },
  13: { name: 'Aluminum', symbol: 'Al', config: '[Ne] 3s² 3p¹' },
  14: { name: 'Silicon', symbol: 'Si', config: '[Ne] 3s² 3p²' },
  15: { name: 'Phosphorus', symbol: 'P', config: '[Ne] 3s² 3p³' },
  16: { name: 'Sulfur', symbol: 'S', config: '[Ne] 3s² 3p⁴' },
  17: { name: 'Chlorine', symbol: 'Cl', config: '[Ne] 3s² 3p⁵' },
  18: { name: 'Argon', symbol: 'Ar', config: '[Ne] 3s² 3p⁶' },
};

const SHELLS = [
  { name: '1s', max: 2, radius: 50 },
  { name: '2s', max: 2, radius: 80 },
  { name: '2p', max: 6, radius: 110 },
  { name: '3s', max: 2, radius: 140 },
  { name: '3p', max: 6, radius: 170 },
];

const FILL_ORDER = ['1s', '2s', '2p', '3s', '3p'];

export default function ElectronConfig() {
  const [electrons, setElectrons] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const maxElectrons = 18;

  const getShellElectrons = (e: number) => {
    const result: Record<string, number> = {};
    let remaining = e;
    for (const shell of FILL_ORDER) {
      const shellData = SHELLS.find(s => s.name === shell)!;
      const count = Math.min(remaining, shellData.max);
      result[shell] = count;
      remaining -= count;
    }
    return result;
  };

  const shellElectrons = getShellElectrons(electrons);
  const shell1 = (shellElectrons['1s'] || 0);
  const shell2 = (shellElectrons['2s'] || 0) + (shellElectrons['2p'] || 0);
  const shell3 = (shellElectrons['3s'] || 0) + (shellElectrons['3p'] || 0);

  const element = ELEMENTS[electrons];

  const renderShell = (count: number, radius: number, maxNodes: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / maxNodes) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x, y }}
          transition={{ type: 'spring' }}
          className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] -ml-1.5 -mt-1.5 origin-center z-20"
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-8">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button onClick={() => setViewMode('explore')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Eye size={14} /> Explore
        </button>
        <button onClick={() => setViewMode('build')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'build' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <GraduationCap size={14} /> Build
        </button>
        <button onClick={() => setViewMode('learn')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <GraduationCap size={14} /> Learn
        </button>
      </div>

      <div className="w-full max-w-sm bg-slate-900 border border-brand-border rounded-2xl p-6 flex flex-col gap-4 mx-auto relative overflow-hidden z-50 mt-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-mono text-xl text-white">{element?.name || 'Empty'}</h3>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">
            {electrons > 0 ? `${element?.symbol} (Z=${electrons})` : 'No element'}
          </span>
        </div>

        <div className="flex justify-between w-full font-mono text-xs text-slate-400 bg-black/40 p-3 rounded-lg border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="uppercase tracking-widest text-[8px] mb-1">1s</span>
            <span className={shellElectrons['1s'] === 2 ? 'text-green-400' : 'text-brand-accent'}>
              {shellElectrons['1s'] || 0} / 2
            </span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="uppercase tracking-widest text-[8px] mb-1">2s</span>
            <span className={shellElectrons['2s'] === 2 ? 'text-green-400' : 'text-brand-accent'}>
              {shellElectrons['2s'] || 0} / 2
            </span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="uppercase tracking-widest text-[8px] mb-1">2p</span>
            <span className={shellElectrons['2p'] === 6 ? 'text-green-400' : 'text-brand-accent'}>
              {shellElectrons['2p'] || 0} / 6
            </span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="uppercase tracking-widest text-[8px] mb-1">3s</span>
            <span className={shellElectrons['3s'] === 2 ? 'text-green-400' : 'text-brand-accent'}>
              {shellElectrons['3s'] || 0} / 2
            </span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="uppercase tracking-widest text-[8px] mb-1">3p</span>
            <span className={shellElectrons['3p'] === 6 ? 'text-green-400' : 'text-brand-accent'}>
              {shellElectrons['3p'] || 0} / 6
            </span>
          </div>
        </div>

        {element && (
          <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-lg p-3 text-center">
            <span className="text-brand-accent text-sm font-mono font-bold">
              {element.config}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => { if (electrons > 0) setElectrons(e => e - 1); }}
            disabled={electrons <= 0}
            className="w-12 h-12 bg-slate-800 border border-slate-600 text-slate-400 rounded-xl hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => { if (electrons < maxElectrons) setElectrons(e => e + 1); }}
            disabled={electrons >= maxElectrons}
            className="flex-1 py-3 bg-brand-accent text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <Plus size={16} /> Add Electron
          </button>
          <button onClick={() => setElectrons(0)} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute w-12 h-12 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold shadow-[0_0_20px_rgba(239,68,68,0.5)] z-30">
          +{electrons}
        </div>

        <div className={`absolute rounded-full border transition-colors duration-500 ${shell1 > 0 ? (shell1 === 2 ? 'border-green-500/40' : 'border-cyan-500/40') : 'border-slate-700'} border-dashed z-10`} style={{ width: 100, height: 100 }}></div>
        <div className={`absolute rounded-full border transition-colors duration-500 ${shell2 > 0 ? (shell2 === 10 ? 'border-green-500/40' : 'border-cyan-500/40') : 'border-slate-700'} border-dashed z-10`} style={{ width: 170, height: 170 }}></div>
        <div className={`absolute rounded-full border transition-colors duration-500 ${shell3 > 0 ? (shell3 === 8 ? 'border-green-500/40' : 'border-cyan-500/40') : 'border-slate-700'} border-dashed z-10`} style={{ width: 240, height: 240 }}></div>

        <AnimatePresence>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            {renderShell(shell1, 50, 2)}
            {renderShell(shell2, 85, 10)}
            {renderShell(shell3, 120, 8)}
          </div>
        </AnimatePresence>
      </div>

      {viewMode === 'learn' && (
        <div className="max-w-md space-y-3">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Aufbau Principle</h4>
            <p className="text-slate-300 text-sm">Electrons fill orbitals starting from the lowest energy level. 1s fills before 2s, 2s before 2p, etc.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Full Shell = Stability</h4>
            <p className="text-slate-300 text-sm">Noble gases (He, Ne, Ar) have completely filled shells, making them chemically stable and unreactive.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Noble Gas Notation</h4>
            <p className="text-slate-300 text-sm">Instead of writing all electrons, we use [He] or [Ne] to represent filled inner shells. Example: Na = [Ne] 3s¹</p>
          </div>
        </div>
      )}
    </div>
  );
}
