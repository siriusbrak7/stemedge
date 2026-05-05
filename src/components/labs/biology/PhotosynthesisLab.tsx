import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, FlaskConical, Pause, Play } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { PHOTOSYNTHESIS_LAB } from '../../../data/labs/labConfigs';
import type { LabSession } from '../../../data/labs/labTypes';

function PhotosynthesisSimulation({ variables, onRecordData }: { variables: Record<string, number>; onRecordData: (result: number | Record<string, number | string>) => void }) {
  const [paused, setPaused] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const light = variables['light-intensity'] ?? 5000;
  const temperature = variables.temperature ?? 25;
  const co2 = variables['co2-concentration'] ?? 0.04;
  const rate = useMemo(() => {
    const lightFactor = Math.min(1, light / 7000);
    const tempFactor = Math.max(0, 1 - Math.abs(temperature - 30) / 25);
    const co2Factor = Math.min(1, co2 / 0.08);
    return Number((40 * lightFactor * tempFactor * co2Factor).toFixed(1));
  }, [light, temperature, co2]);
  const limiting = light < 2500 ? 'Light intensity limiting' : co2 < 0.04 ? 'CO2 limiting' : temperature > 38 || temperature < 15 ? 'Temperature limiting' : 'Conditions near optimum';
  const stageIndex = rate > 24 ? 2 : rate > 10 ? 1 : 0;
  const flowClass = paused ? '' : 'process-flow-line';
  const bubbleClass = paused ? '' : 'process-float';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {['Light captured', 'ATP made', 'Glucose formed'].map((label, idx) => (
            <div key={label} className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${idx <= stageIndex ? 'border-green-400/40 bg-green-400/10 text-green-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              {idx + 1}. {label}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPaused(!paused)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300">
            {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? 'Play' : 'Pause'}
          </button>
          <button onClick={() => setShowExplain(!showExplain)} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300">Explain</button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Light to glucose energy flow</div>
            <div className="mt-1 text-sm text-green-300">{limiting}</div>
          </div>
          <div className="rounded-full border border-green-400/20 bg-green-400/5 px-3 py-1 text-xs font-mono text-green-300">{rate} bubbles/min</div>
        </div>
        <svg viewBox="0 0 760 330" className="h-[330px] w-full rounded-2xl bg-black/30">
          <rect x="120" y="86" width="520" height="180" rx="28" fill="#082f49" stroke="#38bdf8" />
          <circle cx="92" cy="60" r={Math.max(14, light / 450)} fill="#facc15" opacity="0.85" className={paused ? '' : 'process-pulse-soft'} />
          <path d="M110 78 C190 90 230 120 290 155" fill="none" stroke="#facc15" strokeWidth="4" className={flowClass} />
          <path d="M300 238 C340 130 430 130 470 238" stroke="#22c55e" strokeWidth="9" fill="none" strokeLinecap="round" />
          <ellipse cx="390" cy="170" rx="80" ry="30" fill="#14532d" stroke="#86efac" />
          <text x="390" y="175" fill="#dcfce7" fontSize="13" textAnchor="middle">Chloroplast</text>
          <path d="M390 170 C470 145 520 120 590 96" fill="none" stroke="#a3e635" strokeWidth="4" className={flowClass} opacity={rate > 8 ? 1 : 0.35} />
          <text x="515" y="116" fill="#d9f99d" fontSize="12" textAnchor="middle">ATP</text>
          <path d="M390 172 C475 188 530 220 600 238" fill="none" stroke="#34d399" strokeWidth="4" className={flowClass} opacity={rate > 18 ? 1 : 0.35} />
          <text x="555" y="255" fill="#bbf7d0" fontSize="12" textAnchor="middle">Glucose</text>
          {Array.from({ length: Math.min(32, Math.round(rate)) }).map((_, i) => (
            <circle key={i} cx={220 + (i * 41) % 340} cy={230 - ((i * 31) % 120)} r={4 + (i % 3)} fill="#bae6fd" opacity="0.85" className={bubbleClass} style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
          <text x="390" y="302" fill="#86efac" fontSize="14" textAnchor="middle">CO2 + water + light -&gt; glucose + oxygen</text>
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-black/30 p-3"><div className="text-[10px] text-slate-500">Light</div><div className="font-mono text-yellow-300">{light} lux</div></div>
          <div className="rounded-xl bg-black/30 p-3"><div className="text-[10px] text-slate-500">Temp</div><div className="font-mono text-white">{temperature} C</div></div>
          <div className="rounded-xl bg-black/30 p-3"><div className="text-[10px] text-slate-500">CO2</div><div className="font-mono text-green-300">{co2}%</div></div>
        </div>
      </div>
      {showExplain && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-green-400/20 bg-green-400/5 p-4 text-sm text-slate-300">
          Light energy drives ATP formation, ATP supports carbon fixation, and oxygen bubbles show the rate. If one condition is too low or too extreme, it becomes the limiting factor.
        </motion.div>
      )}
      <button onClick={() => onRecordData({ bubbleRate: rate, light, temperature, co2 })} className="w-full rounded-xl bg-brand-accent px-4 py-3 text-xs font-bold uppercase tracking-widest text-black">Record bubble count</button>
    </div>
  );
}

export default function PhotosynthesisLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  if (completedSession) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <FlaskConical size={48} className="mb-4 text-green-400" />
        <h2 className="mb-2 text-3xl font-bold text-white">Photosynthesis Lab Complete</h2>
        <p className="mb-6 text-slate-400">You collected {completedSession.trials.flatMap(t => t.observations).length} photosynthesis observations.</p>
        <button onClick={() => setCompletedSession(null)} className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-white"><RotateCcw size={16} /> Try again</button>
      </motion.div>
    );
  }

  return <VirtualLabEngine config={PHOTOSYNTHESIS_LAB} renderSimulation={(props) => <PhotosynthesisSimulation {...props} />} onComplete={setCompletedSession} />;
}
