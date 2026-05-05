import { useMemo, useState } from 'react';
import { CheckCircle2, Minus, Plus } from 'lucide-react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';

const CHALLENGES = [
  { species: 'Fe2+ -> Fe3+', electrons: 1, side: 'right', label: 'Oxidation: Fe2+ loses one electron' },
  { species: 'Cu2+ -> Cu', electrons: 2, side: 'left', label: 'Reduction: Cu2+ gains two electrons' },
  { species: 'Cl2 -> Cl-', electrons: 2, side: 'left', label: 'Reduction: chlorine gains electrons' },
];

export default function RedoxHalfEquationBuilder() {
  const [idx, setIdx] = useState(0);
  const [electrons, setElectrons] = useState(1);
  const [side, setSide] = useState<'left' | 'right'>('right');
  const challenge = CHALLENGES[idx];
  const correct = electrons === challenge.electrons && side === challenge.side;
  const equation = useMemo(() => side === 'left' ? `${electrons}e- + ${challenge.species}` : `${challenge.species} + ${electrons}e-`, [challenge.species, electrons, side]);

  return (
    <InteractiveModuleShell
      title="Redox Half-Equation Builder"
      subtitle="Place electrons on the correct side, then balance electron count to identify oxidation and reduction."
      accent="emerald"
      metrics={[
        { label: 'Electrons', value: `${electrons}`, tone: correct ? 'success' : 'warn' },
        { label: 'Status', value: correct ? 'Balanced' : 'Adjust', tone: correct ? 'success' : 'warn' },
      ]}
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setSide('left')} className={`rounded-xl px-3 py-2 text-xs font-bold ${side === 'left' ? 'bg-emerald-300 text-black' : 'bg-slate-900 text-slate-300'}`}>e- left</button>
            <button onClick={() => setSide('right')} className={`rounded-xl px-3 py-2 text-xs font-bold ${side === 'right' ? 'bg-emerald-300 text-black' : 'bg-slate-900 text-slate-300'}`}>e- right</button>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3">
            <button onClick={() => setElectrons(Math.max(1, electrons - 1))}><Minus size={16} /></button>
            <span className="font-mono text-2xl text-white">{electrons}</span>
            <button onClick={() => setElectrons(Math.min(6, electrons + 1))}><Plus size={16} /></button>
          </div>
          <button onClick={() => { const next = (idx + 1) % CHALLENGES.length; setIdx(next); setElectrons(1); setSide('right'); }} className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200">Next challenge</button>
        </>
      }
      insights={
        <>
          <p className="text-sm text-slate-300">Oxidation loses electrons, so electrons appear on the product side. Reduction gains electrons, so electrons appear on the reactant side.</p>
          <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200">{challenge.label}</p>
        </>
      }
    >
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-8 rounded-2xl bg-slate-950 p-8 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Build the half equation</div>
        <div className="rounded-2xl border border-slate-800 bg-black/30 px-8 py-6 font-mono text-3xl text-white">{equation}</div>
        <div className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold ${correct ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>
          {correct && <CheckCircle2 size={18} />} {correct ? 'Charge is balanced' : 'Check electron side and count'}
        </div>
      </div>
    </InteractiveModuleShell>
  );
}
