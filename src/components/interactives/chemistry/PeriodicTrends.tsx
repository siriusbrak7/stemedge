import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Zap, Maximize, X } from 'lucide-react';
import ModuleTabs from '../shared/ModuleTabs';

type Lens = 'normal' | 'reactivity' | 'size' | 'electronegativity';
type ViewMode = 'families' | 'trends' | 'configuration';

const TABS = [
  { id: 'families' as ViewMode, label: 'Families', icon: '🧱' },
  { id: 'trends' as ViewMode, label: 'Trends', icon: '📈' },
  { id: 'configuration' as ViewMode, label: 'Electron Config', icon: '⚛️' },
];

interface ElementData {
  s: string;
  name: string;
  g: number;
  p: number;
  react: number;
  size: number;
  en: number;
  mass: string;
  config: string;
  category: string;
}

const ELEMENTS: ElementData[] = [
  { s: 'H', name: 'Hydrogen', g: 1, p: 1, react: 3, size: 1, en: 2.2, mass: '1.008', config: '1s¹', category: 'nonmetal' },
  { s: 'He', name: 'Helium', g: 8, p: 1, react: 0, size: 0.8, en: 0, mass: '4.003', config: '1s²', category: 'noble' },
  { s: 'Li', name: 'Lithium', g: 1, p: 2, react: 4, size: 3, en: 1.0, mass: '6.941', config: '[He] 2s¹', category: 'metal' },
  { s: 'Be', name: 'Beryllium', g: 2, p: 2, react: 2, size: 2, en: 1.6, mass: '9.012', config: '[He] 2s²', category: 'metal' },
  { s: 'B', name: 'Boron', g: 3, p: 2, react: 1, size: 1.8, en: 2.0, mass: '10.81', config: '[He] 2s² 2p¹', category: 'metalloid' },
  { s: 'C', name: 'Carbon', g: 4, p: 2, react: 1, size: 1.6, en: 2.6, mass: '12.01', config: '[He] 2s² 2p²', category: 'nonmetal' },
  { s: 'N', name: 'Nitrogen', g: 5, p: 2, react: 1, size: 1.5, en: 3.0, mass: '14.01', config: '[He] 2s² 2p³', category: 'nonmetal' },
  { s: 'O', name: 'Oxygen', g: 6, p: 2, react: 2, size: 1.4, en: 3.4, mass: '16.00', config: '[He] 2s² 2p⁴', category: 'nonmetal' },
  { s: 'F', name: 'Fluorine', g: 7, p: 2, react: 4, size: 1.3, en: 4.0, mass: '19.00', config: '[He] 2s² 2p⁵', category: 'nonmetal' },
  { s: 'Ne', name: 'Neon', g: 8, p: 2, react: 0, size: 1.2, en: 0, mass: '20.18', config: '[He] 2s² 2p⁶', category: 'noble' },
  { s: 'Na', name: 'Sodium', g: 1, p: 3, react: 5, size: 4, en: 0.9, mass: '22.99', config: '[Ne] 3s¹', category: 'metal' },
  { s: 'Mg', name: 'Magnesium', g: 2, p: 3, react: 3, size: 3, en: 1.3, mass: '24.31', config: '[Ne] 3s²', category: 'metal' },
  { s: 'Al', name: 'Aluminum', g: 3, p: 3, react: 1, size: 2.5, en: 1.6, mass: '26.98', config: '[Ne] 3s² 3p¹', category: 'metal' },
  { s: 'Si', name: 'Silicon', g: 4, p: 3, react: 1, size: 2.2, en: 1.9, mass: '28.09', config: '[Ne] 3s² 3p²', category: 'metalloid' },
  { s: 'P', name: 'Phosphorus', g: 5, p: 3, react: 1, size: 2.0, en: 2.2, mass: '30.97', config: '[Ne] 3s² 3p³', category: 'nonmetal' },
  { s: 'S', name: 'Sulfur', g: 6, p: 3, react: 2, size: 1.8, en: 2.6, mass: '32.07', config: '[Ne] 3s² 3p⁴', category: 'nonmetal' },
  { s: 'Cl', name: 'Chlorine', g: 7, p: 3, react: 3, size: 1.7, en: 3.2, mass: '35.45', config: '[Ne] 3s² 3p⁵', category: 'nonmetal' },
  { s: 'Ar', name: 'Argon', g: 8, p: 3, react: 0, size: 1.6, en: 0, mass: '39.95', config: '[Ne] 3s² 3p⁶', category: 'noble' },
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  metal: { bg: 'bg-pink-500/10', border: 'border-pink-500/50', text: 'text-pink-400' },
  nonmetal: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400' },
  metalloid: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  noble: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400' },
};

export default function PeriodicTrends() {
  const [lens, setLens] = useState<Lens>('normal');
  const [viewMode, setViewMode] = useState<ViewMode>('families');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  const getElementStyle = (el: ElementData) => {
    switch (lens) {
      case 'reactivity':
        if (el.react === 0) return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-500', glow: '' };
        if (el.react >= 4) return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' };
        if (el.react === 3) return { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', glow: '' };
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: '' };
      case 'size':
        return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: '' };
      case 'electronegativity':
        if (el.en === 0) return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-500', glow: '' };
        if (el.en >= 3.0) return { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-[0_0_10px_rgba(168,85,247,0.5)]' };
        if (el.en >= 2.0) return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/50', text: 'text-indigo-400', glow: '' };
        return { bg: 'bg-slate-700/30', border: 'border-slate-600', text: 'text-slate-400', glow: '' };
      default:
        return CATEGORY_COLORS[el.category] || { bg: 'bg-slate-800', border: 'border-brand-border', text: 'text-slate-300', glow: '' };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 relative">
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-bold text-white">Periodic Trends</h3>
          <p className="text-xs text-slate-500">Element families, atomic trends, and electron configurations</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={(v) => { setViewMode(v); setLens(v === 'families' ? 'normal' : v === 'configuration' ? 'electronegativity' : lens); }} accentColor="purple" />
      </div>

      {viewMode === 'trends' && (
      <div className="flex gap-2 p-2 bg-slate-900 border border-brand-border rounded-xl backdrop-blur-md z-50 shadow-xl mt-6 mb-6">
        {[
          { key: 'normal' as Lens, icon: Eye, label: 'Normal' },
          { key: 'reactivity' as Lens, icon: Zap, label: 'Reactivity' },
          { key: 'size' as Lens, icon: Maximize, label: 'Radius' },
          { key: 'electronegativity' as Lens, icon: Zap, label: 'EN' },
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setLens(key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${lens === key ? 'bg-brand-accent text-black' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      )}

      <div className="w-full max-w-4xl grid grid-cols-8 gap-2 p-4 bg-black/40 rounded-[2rem] border border-brand-border/50 relative overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`g${i}`} className="text-center text-[10px] text-slate-500 font-bold uppercase mb-1">
            Group {i + 1 === 8 ? '0' : i + 1}
          </div>
        ))}

        {ELEMENTS.map((el, i) => {
          const s = getElementStyle(el);
          const glowClass = 'glow' in s ? s.glow : '';
          return (
            <motion.button
              key={el.s}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedElement(el)}
              className={`aspect-square relative rounded-xl border flex flex-col items-center justify-center transition-all duration-500 origin-center ${s.bg} ${s.border} ${glowClass} hover:scale-105 hover:brightness-125 cursor-pointer`}
              style={{ gridColumnStart: el.g }}
            >
              {lens === 'size' && (
                <motion.div
                  animate={{ scale: el.size / 2 }}
                  className="absolute inset-0 m-auto bg-cyan-500/20 rounded-full pointer-events-none"
                  style={{ width: '20px', height: '20px' }}
                />
              )}

              {lens === 'reactivity' && el.react > 0 && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 / el.react }}
                  className="absolute inset-0 bg-red-500/10 rounded-xl pointer-events-none"
                />
              )}

              <span className={`font-mono text-xl font-bold relative z-10 ${s.text}`}>{el.s}</span>
              <span className="text-[8px] text-slate-500 font-mono absolute top-1 left-2">{i + 1}</span>
            </motion.button>
          );
        })}
      </div>

      {lens === 'normal' && (
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${val.bg} border ${val.border}`} />
              <span className="text-xs text-slate-400 capitalize">{key}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 border border-brand-border bg-slate-900/50 rounded-xl text-center max-w-2xl">
        <p className="text-slate-300 text-sm">
          {viewMode === 'families' && "Click any element to inspect its family. Metals, non-metals, metalloids, and noble gases cluster by valence-shell behaviour."}
          {viewMode === 'trends' && lens === 'normal' && "Choose a trend lens above to compare periodic patterns."}
          {viewMode === 'trends' && lens === 'reactivity' && "Reactivity increases DOWN Group 1 but decreases down Group 7. Noble gases are unreactive because their outer shell is full."}
          {viewMode === 'trends' && lens === 'size' && "Atomic radius decreases across a period as nuclear charge pulls electrons closer, and increases down a group as shells are added."}
          {viewMode === 'trends' && lens === 'electronegativity' && "Electronegativity increases across a period and decreases down a group. Fluorine is the strongest electron attractor."}
          {viewMode === 'configuration' && "Electron configuration explains the table: elements in the same group have similar valence electron patterns, so they react in similar ways."}
        </p>
      </div>

      {viewMode === 'configuration' && (
        <div className="mt-4 grid gap-3 md:grid-cols-3 max-w-4xl w-full">
          {['Group 1: ns1 outer electron', 'Group 7: ns2 np5, needs one electron', 'Group 0: full outer shell'].map((text, idx) => (
            <div key={text} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-[10px] uppercase tracking-widest text-purple-300 mb-2">Pattern {idx + 1}</div>
              <p className="text-sm text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-brand-accent">{selectedElement.s}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedElement.name}</h3>
                    <span className="text-slate-400 text-sm">Atomic Number: {ELEMENTS.indexOf(selectedElement) + 1}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Mass</div>
                  <div className="text-white font-mono font-bold">{selectedElement.mass}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Category</div>
                  <div className={`font-bold capitalize ${CATEGORY_COLORS[selectedElement.category]?.text || 'text-white'}`}>{selectedElement.category}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Electron Config</div>
                  <div className="text-cyan-400 font-mono text-sm font-bold">{selectedElement.config}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Electronegativity</div>
                  <div className="text-purple-400 font-mono font-bold">{selectedElement.en || 'N/A'}</div>
                </div>
              </div>

              <div className="text-center">
                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
                  Period {selectedElement.p}, Group {selectedElement.g === 8 ? 0 : selectedElement.g}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
