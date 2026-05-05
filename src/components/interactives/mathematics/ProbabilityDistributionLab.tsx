import { useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';
import SecondaryControl from '../shared/SecondaryControl';

function combination(n: number, r: number) {
  let value = 1;
  for (let i = 1; i <= r; i++) value = value * (n - r + i) / i;
  return value;
}

export default function ProbabilityDistributionLab() {
  const [trials, setTrials] = useState(10);
  const [prob, setProb] = useState(50);
  const [cutoff, setCutoff] = useState(6);

  const bars = useMemo(() => {
    const p = prob / 100;
    return Array.from({ length: trials + 1 }, (_, k) => {
      const value = combination(trials, k) * p ** k * (1 - p) ** (trials - k);
      return { k, value };
    });
  }, [trials, prob]);
  const targetProb = bars.filter((b) => b.k >= cutoff).reduce((sum, b) => sum + b.value, 0);

  return (
    <InteractiveModuleShell
      title="Probability Distribution Lab"
      subtitle="Build a binomial distribution and measure probability as area under bars."
      accent="emerald"
      metrics={[
        { label: `P(X >= ${cutoff})`, value: targetProb.toFixed(3), tone: 'success' },
        { label: 'Mean', value: (trials * prob / 100).toFixed(1), tone: 'accent' },
      ]}
      controls={
        <>
          <SecondaryControl label="Trials n" value={trials} min={2} max={24} onChange={setTrials} />
          <SecondaryControl label="Success probability (%)" value={prob} min={5} max={95} onChange={setProb} />
          <SecondaryControl label="Cutoff k" value={cutoff} min={0} max={trials} onChange={setCutoff} />
        </>
      }
      insights={
        <>
          <p className="text-sm text-slate-300">Each bar represents P(X = k). Adding bars gives cumulative probabilities.</p>
          <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200">Binomial conditions: fixed trials, two outcomes, independent trials, constant probability.</p>
        </>
      }
    >
      <div className="rounded-2xl bg-slate-950 p-6">
        <div className="mb-4 flex items-center gap-2 text-white"><BarChart3 className="text-emerald-300" /> Binomial distribution</div>
        <div className="flex h-72 items-end gap-1">
          {bars.map((bar) => (
            <div key={bar.k} className="flex flex-1 flex-col items-center gap-1">
              <div className={`w-full rounded-t ${bar.k >= cutoff ? 'bg-emerald-400' : 'bg-slate-700'}`} style={{ height: `${Math.max(2, bar.value * 620)}px` }} />
              {trials <= 16 && <span className="text-[9px] text-slate-500">{bar.k}</span>}
            </div>
          ))}
        </div>
      </div>
    </InteractiveModuleShell>
  );
}
