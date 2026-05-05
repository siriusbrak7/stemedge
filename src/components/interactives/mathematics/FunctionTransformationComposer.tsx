import { useMemo, useState } from 'react';
import { MoveHorizontal, MoveVertical } from 'lucide-react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';
import SecondaryControl from '../shared/SecondaryControl';

export default function FunctionTransformationComposer() {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [base, setBase] = useState<'quadratic' | 'absolute'>('quadratic');

  const path = useMemo(() => {
    const pts: string[] = [];
    for (let px = -10; px <= 10; px += 0.4) {
      const x = px;
      const fx = base === 'quadratic' ? (x - h) ** 2 : Math.abs(x - h);
      const y = a * fx + k;
      pts.push(`${380 + x * 28},${210 - y * 18}`);
    }
    return pts.join(' ');
  }, [a, h, k, base]);

  return (
    <InteractiveModuleShell
      title="Function Transformation Composer"
      subtitle="Stack vertical stretch, reflection, and translation transformations on parent functions."
      accent="cyan"
      metrics={[
        { label: 'Equation', value: base === 'quadratic' ? `y=${a}(x-${h})^2+${k}` : `y=${a}|x-${h}|+${k}`, tone: 'accent' },
      ]}
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setBase('quadratic')} className={`rounded-xl px-3 py-2 text-xs font-bold ${base === 'quadratic' ? 'bg-cyan-300 text-black' : 'bg-slate-900 text-slate-300'}`}>x squared</button>
            <button onClick={() => setBase('absolute')} className={`rounded-xl px-3 py-2 text-xs font-bold ${base === 'absolute' ? 'bg-cyan-300 text-black' : 'bg-slate-900 text-slate-300'}`}>absolute</button>
          </div>
          <SecondaryControl label="Vertical scale a" value={a} min={-4} max={4} onChange={setA} />
          <SecondaryControl label="Horizontal shift h" value={h} min={-6} max={6} onChange={setH} />
          <SecondaryControl label="Vertical shift k" value={k} min={-6} max={6} onChange={setK} />
        </>
      }
      insights={
        <>
          <p className="text-sm text-slate-300">The value inside the function shifts the graph horizontally in the opposite direction.</p>
          <p className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-cyan-200">Negative a reflects the graph in the x-axis. Larger |a| stretches it vertically.</p>
        </>
      }
    >
      <svg viewBox="0 0 760 420" className="h-[420px] w-full rounded-2xl bg-slate-950">
        <line x1="40" y1="210" x2="720" y2="210" stroke="#334155" />
        <line x1="380" y1="30" x2="380" y2="390" stroke="#334155" />
        <polyline points={path} fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <MoveHorizontal x="650" y="52" color="#67e8f9" />
        <MoveVertical x="650" y="92" color="#67e8f9" />
        <text x="380" y="395" fill="#64748b" fontSize="11" textAnchor="middle">x-axis</text>
      </svg>
    </InteractiveModuleShell>
  );
}
