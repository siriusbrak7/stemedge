import { useMemo, useState } from 'react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';

const tabs = [
  { id: 'distributions', label: 'Distributions' },
  { id: 'hypothesis', label: 'Hypothesis Test' },
  { id: 'regression', label: 'Regression' },
  { id: 'bayes', label: 'Bayes' },
];

export default function ProbabilityStatsStudio() {
  const [tab, setTab] = useState(tabs[0].id);
  const [mean, setMean] = useState(50);
  const [sd, setSd] = useState(12);
  const [sampleMean, setSampleMean] = useState(58);
  const [slopeNoise, setSlopeNoise] = useState(30);
  const [prevalence, setPrevalence] = useState(15);

  const z = ((sampleMean - mean) / sd).toFixed(2);
  const pEstimate = Math.max(0.001, Math.min(0.99, Math.exp(-Math.abs(Number(z))) / 2));
  const posterior = ((0.96 * prevalence) / (0.96 * prevalence + 0.08 * (100 - prevalence))) * 100;

  const regressionPoints = useMemo(
    () =>
      Array.from({ length: 9 }, (_, idx) => {
        const x = 50 + idx * 42;
        const y = 220 - idx * 16 + ((idx % 2 === 0 ? 1 : -1) * slopeNoise) / 5;
        return { x, y };
      }),
    [slopeNoise],
  );

  return (
    <InteractiveModuleShell
      title="Probability & Statistics Studio"
      subtitle="An advanced statistics environment for distributions, inferential reasoning, regression, and Bayesian updating."
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      metrics={[
        { label: 'z Score', value: `${z}`, tone: 'accent' },
        { label: 'Inference Signal', value: `${(pEstimate * 100).toFixed(1)}%`, tone: pEstimate < 0.05 ? 'success' : 'warn' },
      ]}
      controls={
        <>
          {tab === 'distributions' && (
            <>
              <Slider label="Mean" value={mean} min={20} max={80} onChange={setMean} />
              <Slider label="Std. Dev." value={sd} min={5} max={20} onChange={setSd} />
            </>
          )}
          {tab === 'hypothesis' && <Slider label="Observed Mean" value={sampleMean} min={35} max={75} onChange={setSampleMean} />}
          {tab === 'regression' && <Slider label="Scatter Noise" value={slopeNoise} min={5} max={50} onChange={setSlopeNoise} />}
          {tab === 'bayes' && <Slider label="Prevalence %" value={prevalence} min={1} max={40} onChange={setPrevalence} />}
        </>
      }
      insights={
        <>
          <Box title="Interpretation" body="The interface keeps probability tied to visible areas, trends, and proportions instead of detached formulas." />
          <Box title="Advanced Readiness" body="This topic is positioned for A-Level, AP, and IB learners who need statistical reasoning, not just calculator steps." />
        </>
      }
    >
      {tab === 'distributions' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#08101b]">
          <rect x="24" y="40" width="470" height="200" rx="20" fill="#020617" stroke="#1e293b" />
          <path
            d={`M40 220 C160 ${200 - sd * 4}, 220 ${120 - sd * 3}, 260 80 C300 ${120 - sd * 3}, 360 ${200 - sd * 4}, 480 220`}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="5"
          />
          <line x1={260} y1="220" x2={260} y2="80" stroke="#22d3ee" strokeDasharray="6 6" />
          <text x="284" y="92" fill="#cbd5e1" fontSize="16">mean = {mean}</text>
        </svg>
      )}

      {tab === 'hypothesis' && (
        <div className="flex h-[420px] items-center justify-center">
          <div className="grid w-full max-w-3xl grid-cols-2 gap-4">
            <StatCard label="Null Mean" value={`${mean}`} />
            <StatCard label="Observed Mean" value={`${sampleMean}`} />
            <StatCard label="z" value={`${z}`} />
            <StatCard label="Approx. p-value" value={pEstimate.toFixed(3)} />
          </div>
        </div>
      )}

      {tab === 'regression' && (
        <svg viewBox="0 0 520 280" className="h-[420px] w-full rounded-[1.25rem] bg-[#0a1118]">
          <line x1="40" y1="240" x2="480" y2="240" stroke="#334155" />
          <line x1="40" y1="240" x2="40" y2="40" stroke="#334155" />
          <line x1="60" y1="220" x2="430" y2="80" stroke="#34d399" strokeWidth="3" />
          {regressionPoints.map((point, idx) => (
            <circle key={idx} cx={point.x} cy={point.y} r="6" fill="#60a5fa" />
          ))}
        </svg>
      )}

      {tab === 'bayes' && (
        <div className="grid h-[420px] grid-cols-2 gap-4">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Tree view</div>
            <div className="mt-6 space-y-4 text-slate-300">
              <div>Condition present: {prevalence}%</div>
              <div>Condition absent: {100 - prevalence}%</div>
              <div>Posterior after positive test: {posterior.toFixed(1)}%</div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Venn intuition</div>
            <svg viewBox="0 0 220 220" className="mt-4 w-full">
              <circle cx="88" cy="110" r="58" fill="#60a5fa" opacity="0.35" />
              <circle cx="136" cy="110" r="58" fill="#34d399" opacity="0.35" />
              <text x="58" y="40" fill="#bfdbfe">Condition</text>
              <text x="130" y="40" fill="#86efac">Positive test</text>
            </svg>
          </div>
        </div>
      )}
    </InteractiveModuleShell>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-cyan-400" />
    </div>
  );
}

function Box({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500">{title}</div>
      <p className="text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className="mt-4 text-4xl font-semibold text-white">{value}</div>
    </div>
  );
}
