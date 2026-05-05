import { useMemo, useState } from 'react';
import { Atom } from 'lucide-react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';
import SecondaryControl from '../shared/SecondaryControl';

export default function MolecularGeometryVSEPR() {
  const [bonds, setBonds] = useState(4);
  const [lonePairs, setLonePairs] = useState(0);
  const model = useMemo(() => {
    const domains = bonds + lonePairs;
    if (domains === 2) return { shape: 'Linear', angle: '180', note: 'Two electron domains repel to opposite sides.' };
    if (domains === 3 && lonePairs === 0) return { shape: 'Trigonal planar', angle: '120', note: 'Three bonding domains spread flat.' };
    if (domains === 3) return { shape: 'Bent', angle: '<120', note: 'A lone pair compresses the bond angle.' };
    if (domains === 4 && lonePairs === 0) return { shape: 'Tetrahedral', angle: '109.5', note: 'Four bonding domains form a tetrahedron.' };
    if (domains === 4 && lonePairs === 1) return { shape: 'Trigonal pyramidal', angle: '107', note: 'One lone pair pushes the bonds downward.' };
    if (domains === 4) return { shape: 'Bent', angle: '104.5', note: 'Two lone pairs strongly compress the angle.' };
    return { shape: 'Expanded geometry', angle: 'varies', note: 'Higher-domain shapes need an expanded valence shell.' };
  }, [bonds, lonePairs]);

  const points = [[380, 70], [520, 180], [440, 290], [260, 290], [240, 135], [560, 90]].slice(0, bonds);

  return (
    <InteractiveModuleShell
      title="Molecular Geometry VSEPR Builder"
      subtitle="Change bonding pairs and lone pairs to predict shape, bond angle, and polarity clues."
      accent="cyan"
      metrics={[
        { label: 'Shape', value: model.shape, tone: 'accent' },
        { label: 'Angle', value: `${model.angle} deg`, tone: 'success' },
      ]}
      controls={
        <>
          <SecondaryControl label="Bonding pairs" value={bonds} min={2} max={6} onChange={setBonds} />
          <SecondaryControl label="Lone pairs" value={lonePairs} min={0} max={2} onChange={setLonePairs} />
        </>
      }
      insights={
        <>
          <p className="text-sm text-slate-300">VSEPR: electron domains repel and arrange as far apart as possible around the central atom.</p>
          <p className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-cyan-200">{model.note}</p>
        </>
      }
    >
      <svg viewBox="0 0 760 360" className="h-[360px] w-full rounded-2xl bg-slate-950">
        {points.map(([x, y], i) => <line key={i} x1="380" y1="180" x2={x} y2={y} stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" />)}
        {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="24" fill="#0f172a" stroke="#67e8f9" />)}
        <circle cx="380" cy="180" r="38" fill="#0f172a" stroke="#22d3ee" strokeWidth="3" />
        <Atom x={362} y={162} color="#22d3ee" />
        {Array.from({ length: lonePairs }).map((_, i) => (
          <g key={i} transform={`translate(${330 + i * 100} 120)`}>
            <circle cx="0" cy="0" r="5" fill="#fbbf24" />
            <circle cx="18" cy="0" r="5" fill="#fbbf24" />
            <text x="9" y="-16" fill="#fbbf24" fontSize="10" textAnchor="middle">lone pair</text>
          </g>
        ))}
        <text x="380" y="330" fill="#fff" fontSize="18" textAnchor="middle" fontWeight="700">{model.shape}</text>
      </svg>
    </InteractiveModuleShell>
  );
}
