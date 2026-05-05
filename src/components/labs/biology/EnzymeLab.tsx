import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, FlaskConical, Pause, Play } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { ENZYME_LAB } from '../../../data/labs/labConfigs';
import type { LabSession } from '../../../data/labs/labTypes';

function EnzymeSimulation({ variables, onRecordData }: { variables: Record<string, number>; onRecordData: (result: number | Record<string, number | string>) => void }) {
  const [paused, setPaused] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const temperature = variables.temperature ?? 37;
  const ph = variables.ph ?? 7;
  const substrate = variables['substrate-concentration'] ?? 1;
  const rate = useMemo(() => {
    const tempFactor = Math.max(0, 1 - Math.abs(temperature - 37) / 45);
    const phFactor = Math.max(0, 1 - Math.abs(ph - 7) / 7);
    return Number((100 * tempFactor * phFactor * Math.min(1, substrate / 1.2)).toFixed(1));
  }, [temperature, ph, substrate]);
  const stage = rate > 70 ? 'Rapid catalysis' : rate > 35 ? 'Partial fit' : 'Low activity';
  const denatured = temperature > 60 || ph <= 2 || ph >= 12;
  const activeSiteWidth = denatured ? 32 : Math.max(44, 76 - Math.abs(ph - 7) * 5 - Math.abs(temperature - 37) * 0.45);
  const particleCount = Math.max(4, Math.round(substrate * 10));
  const animationClass = paused ? '' : 'process-pulse-soft';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {['Substrate approaches', 'Enzyme-substrate complex', 'Products released'].map((label, idx) => (
            <div key={label} className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${idx === (rate > 65 ? 2 : rate > 25 ? 1 : 0) ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              {idx + 1}. {label}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPaused(!paused)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300">
            {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? 'Play' : 'Pause'}
          </button>
          <button onClick={() => setShowExplain(!showExplain)} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300">
            Explain
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Catalase lock-and-key model</div>
            <div className="mt-1 text-sm text-emerald-300">{stage}</div>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-mono text-emerald-300">{rate}% rate</div>
        </div>
        <svg viewBox="0 0 760 330" className="h-[330px] w-full rounded-2xl bg-black/30">
          <defs>
            <linearGradient id="enzymeFill" x1="0" x2="1"><stop stopColor="#064e3b" /><stop offset="1" stopColor="#10b981" /></linearGradient>
          </defs>
          <path d={`M280 120 C320 70 420 70 470 125 C520 185 470 265 380 265 C290 265 230 185 280 120 Z`} fill="url(#enzymeFill)" opacity="0.85" stroke="#6ee7b7" strokeWidth="3" />
          <path d={`M342 148 C360 ${130 - activeSiteWidth / 6} 400 ${130 - activeSiteWidth / 6} 418 148 C402 166 360 166 342 148 Z`} fill="#020617" stroke="#bbf7d0" strokeWidth="3" />
          <text x="380" y="302" fill="#bbf7d0" fontSize="13" textAnchor="middle">Enzyme active site {denatured ? 'distorted' : 'ready'}</text>
          {Array.from({ length: particleCount }).map((_, i) => {
            const x = paused ? 100 + i * 18 : 110 + ((i * 61 + rate * 4) % 180);
            const y = 75 + ((i * 47) % 170);
            return <circle key={i} cx={x} cy={y} r="8" fill="#fbbf24" className={animationClass} style={{ animationDelay: `${i * 0.08}s` }} />;
          })}
          <path d="M120 170 C190 145 235 142 320 146" fill="none" stroke="#fbbf24" strokeWidth="3" className={paused ? '' : 'process-flow-line'} opacity="0.8" />
          <g className={animationClass}>
            <circle cx="382" cy="145" r="12" fill={denatured ? '#ef4444' : '#fbbf24'} />
            <text x="382" y="115" fill={denatured ? '#fecaca' : '#fde68a'} fontSize="12" textAnchor="middle">{denatured ? 'poor fit' : 'bound substrate'}</text>
          </g>
          <path d="M430 148 C515 145 575 125 650 92" fill="none" stroke="#60a5fa" strokeWidth="3" className={paused ? '' : 'process-flow-line'} opacity={rate > 35 ? 0.9 : 0.25} />
          <circle cx="650" cy="92" r="8" fill="#60a5fa" opacity={rate > 35 ? 1 : 0.25} />
          <circle cx="680" cy="116" r="8" fill="#60a5fa" opacity={rate > 35 ? 1 : 0.25} />
          <text x="665" y="148" fill="#bfdbfe" fontSize="12" textAnchor="middle">Products released</text>
        </svg>
        <div className="mt-4 h-8 rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400 transition-all duration-700 ease-out" style={{ width: `${rate}%` }} /></div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-black/30 p-3"><div className="text-[10px] text-slate-500">Temp</div><div className="font-mono text-white">{temperature} C</div></div>
          <div className="rounded-xl bg-black/30 p-3"><div className="text-[10px] text-slate-500">pH</div><div className="font-mono text-white">{ph}</div></div>
          <div className="rounded-xl bg-black/30 p-3"><div className="text-[10px] text-slate-500">Rate</div><div className="font-mono text-emerald-300">{rate}</div></div>
        </div>
      </div>
      {showExplain && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-slate-300">
          Temperature and pH change the shape of the active site. Substrate concentration changes collision frequency. Extreme conditions distort the enzyme, so fewer enzyme-substrate complexes form.
        </motion.div>
      )}
      <button onClick={() => onRecordData({ reactionRate: rate, temperature, ph, substrate })} className="w-full rounded-xl bg-brand-accent px-4 py-3 text-xs font-bold uppercase tracking-widest text-black">Record enzyme rate</button>
    </div>
  );
}

export default function EnzymeLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  if (completedSession) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <FlaskConical size={48} className="mb-4 text-emerald-400" />
        <h2 className="mb-2 text-3xl font-bold text-white">Enzyme Lab Complete</h2>
        <p className="mb-6 text-slate-400">You collected {completedSession.trials.flatMap(t => t.observations).length} enzyme-rate observations.</p>
        <button onClick={() => setCompletedSession(null)} className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-white"><RotateCcw size={16} /> Try again</button>
      </motion.div>
    );
  }

  return <VirtualLabEngine config={ENZYME_LAB} renderSimulation={(props) => <EnzymeSimulation {...props} />} onComplete={setCompletedSession} />;
}
