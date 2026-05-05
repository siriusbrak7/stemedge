import { useMemo, useState } from 'react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';

const tabs = [
  { id: 'macromolecules', label: 'Macromolecules' },
  { id: 'enzymes', label: 'Enzyme Kinetics' },
  { id: 'respiration', label: 'Respiration' },
  { id: 'photosynthesis', label: 'Photosynthesis' },
  { id: 'bioenergetics', label: 'ATP & Energy' },
  { id: 'membranes', label: 'Membranes' },
  { id: 'genetics', label: 'Genetics' },
];

export default function BiochemistryStudio() {
  const [tab, setTab] = useState(tabs[0].id);
  const [moleculeSize, setMoleculeSize] = useState(6);
  const [substrate, setSubstrate] = useState(4);
  const [inhibition, setInhibition] = useState<'none' | 'competitive' | 'noncompetitive'>('none');
  const [glucose, setGlucose] = useState(1);
  const [light, setLight] = useState(70);
  const [co2, setCo2] = useState(55);
  const [deltaG, setDeltaG] = useState(-18);
  const [coupling, setCoupling] = useState(12);
  const [cholesterol, setCholesterol] = useState(45);
  const [pumpRate, setPumpRate] = useState(60);
  const [geneLength, setGeneLength] = useState(9);
  const [mutation, setMutation] = useState<'none' | 'missense' | 'frameshift'>('none');

  const vmax = inhibition === 'noncompetitive' ? 0.68 : 1;
  const km = inhibition === 'competitive' ? 5.5 : 2.8;
  const enzymeRate = (s: number) => (vmax * s) / (km + s);
  const respirationAtp = glucose * (2 + 2 + 28);
  const calvinTurn = Math.round((light * 0.4 + co2 * 0.6) / 10);
  const netCoupled = deltaG + coupling;
  const fluidity = Math.round((100 - cholesterol) * 0.55 + pumpRate * 0.25);
  const codonCount = Math.floor(geneLength / 3);
  const proteinLength = mutation === 'frameshift' ? Math.max(1, codonCount - 2) : codonCount;

  const kineticsPath = useMemo(() => {
    const points = Array.from({ length: 40 }, (_, i) => {
      const s = i / 2;
      const rate = enzymeRate(s);
      const x = 20 + i * 8.6;
      const y = 250 - rate * 170;
      return `${x},${y}`;
    });
    return points.join(' ');
  }, [substrate, inhibition]);

  const activeMetrics = {
    macromolecules: [
      { label: 'Monomers', value: `${moleculeSize}`, tone: 'accent' as const },
      { label: 'Bond Type', value: 'Condensation', tone: 'success' as const },
    ],
    enzymes: [
      { label: 'Relative Vmax', value: vmax.toFixed(2), tone: 'accent' as const },
      { label: 'Relative Km', value: km.toFixed(1), tone: 'warn' as const },
    ],
    respiration: [
      { label: 'ATP Yield', value: `${respirationAtp}`, tone: 'success' as const },
      { label: 'Glucose', value: `${glucose} molecule`, tone: 'accent' as const },
    ],
    photosynthesis: [
      { label: 'Calvin Turns', value: `${calvinTurn}`, tone: 'success' as const },
      { label: 'Photon Drive', value: `${light}%`, tone: 'accent' as const },
    ],
    bioenergetics: [
      { label: 'Net ΔG', value: `${netCoupled.toFixed(1)} kJ`, tone: netCoupled < 0 ? 'success' : 'warn' },
      { label: 'Coupled Input', value: `${coupling.toFixed(1)} kJ`, tone: 'accent' as const },
    ],
    membranes: [
      { label: 'Fluidity', value: `${fluidity}%`, tone: 'accent' as const },
      { label: 'Pump Rate', value: `${pumpRate}%`, tone: 'success' as const },
    ],
    genetics: [
      { label: 'Codons', value: `${codonCount}`, tone: 'accent' as const },
      { label: 'Protein Length', value: `${proteinLength} aa`, tone: 'success' as const },
    ],
  }[tab];

  const controls = (
    <>
      {tab === 'macromolecules' && (
        <>
          <Range label="Polymer Size" value={moleculeSize} min={3} max={12} onChange={setMoleculeSize} />
          <PillRow
            label="Family"
            value={tab}
            options={['Carbohydrate', 'Lipid', 'Protein', 'Nucleic Acid']}
          />
        </>
      )}
      {tab === 'enzymes' && (
        <>
          <Range label="Substrate Conc." value={substrate} min={1} max={10} onChange={setSubstrate} />
          <SelectChips
            label="Inhibition"
            value={inhibition}
            options={[
              ['none', 'None'],
              ['competitive', 'Competitive'],
              ['noncompetitive', 'Non-competitive'],
            ]}
            onChange={(value) => setInhibition(value as typeof inhibition)}
          />
        </>
      )}
      {tab === 'respiration' && (
        <Range label="Glucose Molecules" value={glucose} min={1} max={4} onChange={setGlucose} />
      )}
      {tab === 'photosynthesis' && (
        <>
          <Range label="Light Intensity" value={light} min={20} max={100} onChange={setLight} />
          <Range label="CO₂ Availability" value={co2} min={10} max={100} onChange={setCo2} />
        </>
      )}
      {tab === 'bioenergetics' && (
        <>
          <Range label="Reaction ΔG" value={deltaG} min={-30} max={10} onChange={setDeltaG} />
          <Range label="Coupling Energy" value={coupling} min={0} max={25} onChange={setCoupling} />
        </>
      )}
      {tab === 'membranes' && (
        <>
          <Range label="Cholesterol" value={cholesterol} min={0} max={100} onChange={setCholesterol} />
          <Range label="Ion Pump Activity" value={pumpRate} min={0} max={100} onChange={setPumpRate} />
        </>
      )}
      {tab === 'genetics' && (
        <>
          <Range label="Gene Length (bases)" value={geneLength} min={6} max={18} onChange={setGeneLength} />
          <SelectChips
            label="Mutation"
            value={mutation}
            options={[
              ['none', 'None'],
              ['missense', 'Missense'],
              ['frameshift', 'Frameshift'],
            ]}
            onChange={(value) => setMutation(value as typeof mutation)}
          />
        </>
      )}
    </>
  );

  const insights = (
    <>
      <Insight
        title="Curriculum Blend"
        body="Designed as a high-fidelity bridge for A-Level, AP, and IB learners who need linked process views rather than static notes."
      />
      <Insight
        title="Why It Matters"
        body={
          tab === 'enzymes'
            ? 'Learners can see how inhibitors change the curve differently, which is often harder to understand from equations alone.'
            : tab === 'respiration'
              ? 'ATP accounting is exposed explicitly so pathway stages stop feeling like disconnected memorization.'
              : tab === 'genetics'
                ? 'The model emphasizes how base-level changes ripple into codons and protein outcomes.'
                : 'Each panel ties structure, process, and measurable outcomes together inside one systems view.'
        }
      />
    </>
  );

  return (
    <InteractiveModuleShell
      title="Biochemistry Systems Studio"
      subtitle="A 7-submodule molecular-biology environment spanning macromolecules, kinetics, metabolism, membranes, ATP coupling, and gene expression."
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      controls={controls}
      insights={insights}
      metrics={activeMetrics}
      accent="emerald"
    >
      {tab === 'macromolecules' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#07161a]">
          {Array.from({ length: moleculeSize }).map((_, idx) => (
            <g key={idx}>
              <circle cx={80 + idx * 34} cy={95 + (idx % 2) * 24} r="15" fill={idx % 2 === 0 ? '#34d399' : '#22c55e'} />
              {idx < moleculeSize - 1 && <line x1={95 + idx * 34} y1={95 + (idx % 2) * 24} x2={115 + idx * 34} y2={95 + ((idx + 1) % 2) * 24} stroke="#86efac" strokeWidth="4" />}
            </g>
          ))}
          <rect x="60" y="170" width="400" height="58" rx="20" fill="#0f2a22" stroke="#14532d" />
          <text x="80" y="205" fill="#dcfce7" fontSize="20">Build larger chains to discuss monomers, polymers, and bond formation.</text>
        </svg>
      )}

      {tab === 'enzymes' && (
        <svg viewBox="0 0 380 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#08121d]">
          <rect x="20" y="20" width="320" height="230" rx="20" fill="#071622" stroke="#164e63" />
          <polyline fill="none" stroke="#22d3ee" strokeWidth="4" points={kineticsPath} />
          <line x1="40" y1="250" x2="340" y2="250" stroke="#334155" />
          <line x1="40" y1="250" x2="40" y2="40" stroke="#334155" />
          <text x="248" y="270" fill="#94a3b8" fontSize="12">substrate concentration</text>
          <text x="8" y="34" fill="#94a3b8" fontSize="12" transform="rotate(-90 8,34)">reaction rate</text>
          <text x="50" y="52" fill="#67e8f9" fontSize="14">{inhibition === 'none' ? 'baseline' : inhibition}</text>
        </svg>
      )}

      {tab === 'respiration' && (
        <div className="grid h-[420px] grid-cols-4 gap-4">
          {[
            ['Glycolysis', 2, '#f59e0b'],
            ['Link', 2, '#38bdf8'],
            ['Krebs', 2, '#a78bfa'],
            ['ETC', 28, '#34d399'],
          ].map(([label, atp, color]) => (
            <div key={label} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
              <div className="mt-6 text-5xl font-bold" style={{ color }}>{Number(atp) * glucose}</div>
              <div className="mt-2 text-sm text-slate-400">ATP equivalents</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'photosynthesis' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#08131a]">
          <path d="M60 220 C120 80, 180 80, 240 220" fill="none" stroke="#fde047" strokeWidth="5" />
          <path d="M240 220 C300 100, 360 100, 430 220" fill="none" stroke="#38bdf8" strokeWidth="5" />
          <circle cx={60} cy={220} r="18" fill="#84cc16" />
          <circle cx={240} cy={220} r="18" fill="#22c55e" />
          <circle cx={430} cy={220} r="18" fill="#10b981" />
          <rect x="86" y="40" width={light * 3} height="18" rx="9" fill="#fde047" />
          <rect x="86" y="72" width={co2 * 3} height="18" rx="9" fill="#22c55e" />
          <text x="86" y="32" fill="#fde68a" fontSize="14">Light drive</text>
          <text x="86" y="64" fill="#86efac" fontSize="14">CO₂ supply</text>
          <text x="86" y="128" fill="#cbd5e1" fontSize="18">Z-scheme energy rise feeds Calvin-cycle carbon fixation.</text>
        </svg>
      )}

      {tab === 'bioenergetics' && (
        <div className="flex h-[420px] items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8">
            <div className="mb-5 flex items-center justify-between text-sm text-slate-400">
              <span>Reaction profile</span>
              <span>Coupled net = {netCoupled.toFixed(1)} kJ</span>
            </div>
            <div className="relative h-48 rounded-[1.5rem] bg-slate-900">
              <div className="absolute left-8 top-28 h-2 w-40 bg-rose-400" />
              <div className="absolute left-44 top-12 h-2 w-24 bg-amber-300" />
              <div className={`absolute left-[17rem] top-28 h-2 w-40 ${netCoupled < 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            </div>
          </div>
        </div>
      )}

      {tab === 'membranes' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#0a111d]">
          {Array.from({ length: 12 }).map((_, idx) => (
            <g key={idx}>
              <circle cx={70 + idx * 32} cy={96} r="10" fill="#38bdf8" />
              <circle cx={70 + idx * 32} cy={182} r="10" fill="#38bdf8" />
              <line x1={70 + idx * 32} y1={106} x2={70 + idx * 32} y2={172} stroke="#1d4ed8" strokeWidth="6" />
            </g>
          ))}
          <rect x="138" y="88" width="28" height="104" rx="14" fill="#c084fc" opacity={0.4 + pumpRate / 180} />
          <rect x="320" y="88" width="28" height="104" rx="14" fill="#c084fc" opacity={0.4 + pumpRate / 180} />
          {Array.from({ length: 5 }).map((_, idx) => (
            <circle key={idx} cx={98 + idx * 84} cy={140} r={6 + cholesterol / 30} fill="#fbbf24" opacity="0.8" />
          ))}
        </svg>
      )}

      {tab === 'genetics' && (
        <div className="grid h-[420px] grid-cols-3 gap-4">
          {[
            ['DNA', geneLength, '#38bdf8'],
            ['mRNA', geneLength, '#a78bfa'],
            ['Protein', proteinLength, mutation === 'frameshift' ? '#fb7185' : '#34d399'],
          ].map(([label, length, color]) => (
            <div key={label} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: Number(length) }).map((_, idx) => (
                  <div key={idx} className="h-8 w-6 rounded-md" style={{ backgroundColor: color, opacity: 0.45 + (idx % 3) * 0.12 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
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
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-emerald-400" />
    </div>
  );
}

function SelectChips({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(([id, display]) => (
          <button key={id} onClick={() => onChange(id)} className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${value === id ? 'bg-emerald-400 text-black' : 'bg-slate-900 text-slate-300'}`}>
            {display}
          </button>
        ))}
      </div>
    </div>
  );
}

function PillRow({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <div>
      <div className="mb-2 text-xs text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option, idx) => (
          <div key={option} className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${idx === 0 ? 'bg-emerald-400 text-black' : 'bg-slate-900 text-slate-300'}`}>
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500">{title}</div>
      <p className="text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}
