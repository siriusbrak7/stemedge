import { useState } from 'react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';

const tabs = [
  { id: 'nomenclature', label: 'Nomenclature' },
  { id: 'mechanisms', label: 'Mechanisms' },
  { id: 'functional-groups', label: 'Functional Groups' },
  { id: 'spectroscopy', label: 'Spectroscopy' },
];

export default function OrganicChemStudio() {
  const [tab, setTab] = useState(tabs[0].id);
  const [carbons, setCarbons] = useState(4);
  const [branching, setBranching] = useState(1);
  const [mechanism, setMechanism] = useState<'SN1' | 'SN2' | 'E1' | 'E2'>('SN1');
  const [oxidation, setOxidation] = useState(1);
  const [peakShift, setPeakShift] = useState(3300);

  return (
    <InteractiveModuleShell
      title="Organic Chemistry Studio"
      subtitle="A multi-representation environment for structure naming, reaction pathways, functional-group interconversion, and spectral interpretation."
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      accent="rose"
      metrics={[
        { label: 'Carbon Skeleton', value: `${carbons} C`, tone: 'accent' },
        { label: 'Current Mode', value: tab === 'mechanisms' ? mechanism : tab === 'spectroscopy' ? `${peakShift} cm⁻¹` : 'Structure view', tone: 'success' },
      ]}
      controls={
        <>
          {tab === 'nomenclature' && (
            <>
              <Range label="Carbon Count" value={carbons} min={2} max={8} onChange={setCarbons} />
              <Range label="Branching" value={branching} min={0} max={3} onChange={setBranching} />
            </>
          )}
          {tab === 'mechanisms' && (
            <div>
              <div className="mb-2 text-xs text-slate-400">Mechanism</div>
              <div className="flex flex-wrap gap-2">
                {(['SN1', 'SN2', 'E1', 'E2'] as const).map((option) => (
                  <button key={option} onClick={() => setMechanism(option)} className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${mechanism === option ? 'bg-rose-400 text-black' : 'bg-slate-900 text-slate-300'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab === 'functional-groups' && <Range label="Oxidation Step" value={oxidation} min={0} max={3} onChange={setOxidation} />}
          {tab === 'spectroscopy' && <Range label="IR Peak Position" value={peakShift} min={1700} max={3600} onChange={setPeakShift} />}
        </>
      }
      insights={
        <>
          <Panel title="Mechanistic Thinking" body="Students can compare substitution and elimination side by side instead of memorizing isolated cases." />
          <Panel title="Exam Alignment" body="This structure fits advanced secondary and pre-university curricula where names, mechanisms, and spectra need to reinforce each other." />
        </>
      }
    >
      {tab === 'nomenclature' && (
        <div className="flex h-[420px] items-center justify-center">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8">
            <div className="mb-6 text-xl text-white">{branching > 0 ? `${branching}-methyl` : ''} {['eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct'][carbons - 2]}ane</div>
            <div className="flex gap-3">
              {Array.from({ length: carbons }).map((_, idx) => (
                <div key={idx} className="relative h-14 w-14 rounded-full border border-rose-300/30 bg-rose-400/20">
                  {idx < carbons - 1 && <div className="absolute left-full top-1/2 h-1 w-5 -translate-y-1/2 bg-rose-200/80" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'mechanisms' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#170c14]">
          <rect x="70" y="120" width="90" height="50" rx="16" fill="#fb7185" />
          <rect x="360" y="120" width="90" height="50" rx="16" fill="#34d399" />
          <path d={mechanism === 'SN2' ? 'M170 145 C235 70, 290 70, 350 145' : 'M170 145 C230 40, 290 200, 350 145'} fill="none" stroke="#f9a8d4" strokeWidth="4" />
          <text x="182" y="80" fill="#fbcfe8" fontSize="18">{mechanism} electron flow</text>
        </svg>
      )}

      {tab === 'functional-groups' && (
        <div className="grid h-[420px] grid-cols-4 gap-4">
          {['Alcohol', 'Aldehyde', 'Ketone', 'Carboxylic Acid'].map((label, idx) => (
            <div key={label} className={`rounded-[1.5rem] border p-4 ${idx <= oxidation ? 'border-rose-400/30 bg-rose-400/10' : 'border-slate-800 bg-slate-950/70'}`}>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
              <div className="mt-8 h-24 rounded-2xl bg-black/30" />
            </div>
          ))}
        </div>
      )}

      {tab === 'spectroscopy' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#130d12]">
          <rect x="32" y="40" width="450" height="190" rx="18" fill="#09090b" stroke="#3f3f46" />
          <polyline
            fill="none"
            stroke="#f472b6"
            strokeWidth="4"
            points={`40,70 120,78 190,160 ${210 + (3600 - peakShift) / 14},72 350,166 470,86`}
          />
          <text x="60" y="250" fill="#cbd5e1" fontSize="16">Interpret broad peaks, strong carbonyl absorptions, and fingerprint-region clues.</text>
        </svg>
      )}
    </InteractiveModuleShell>
  );
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-rose-400" />
    </div>
  );
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500">{title}</div>
      <p className="text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}
