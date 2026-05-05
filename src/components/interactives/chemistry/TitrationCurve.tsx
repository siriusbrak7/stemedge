import { useEffect, useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RefreshCw } from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'apparatus' | 'curve' | 'buffer' | 'quiz';

const TABS = [
  { id: 'apparatus' as ViewMode, label: 'Apparatus', icon: '🧪' },
  { id: 'curve' as ViewMode, label: 'Curve', icon: '📈' },
  { id: 'buffer' as ViewMode, label: 'Buffer Zone', icon: '⚖️' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'tc1', question: 'What is the equivalence point?', type: 'multiple-choice', options: ['When pH = 7', 'When moles acid = moles base', 'When the indicator changes color', 'When the beaker is full'], correctAnswer: 'When moles acid = moles base', explanation: 'Equivalence is the stoichiometric neutralization point.' },
  { id: 'tc2', question: 'In a strong acid-strong base titration, pH at equivalence is:', type: 'multiple-choice', options: ['Less than 7', 'Exactly 7', 'Greater than 7', 'Always 14'], correctAnswer: 'Exactly 7', explanation: 'Strong acid and strong base salts do not hydrolyze appreciably at 25 C.' },
  { id: 'tc3', question: 'The buffer region is most important for:', type: 'multiple-choice', options: ['Strong acid only', 'Weak acid/strong base titrations', 'Empty burettes', 'Neutral salts only'], correctAnswer: 'Weak acid/strong base titrations', explanation: 'A weak acid and conjugate base mixture resists pH change before equivalence.' },
];

export default function TitrationCurve() {
  const [viewMode, setViewMode] = useState<ViewMode>('apparatus');
  const [volume, setVolume] = useState(0);
  const [dripping, setDripping] = useState(false);

  useEffect(() => {
    if (!dripping) return;
    const id = window.setInterval(() => setVolume(v => Math.min(50, Number((v + 0.4).toFixed(1)))), 70);
    return () => clearInterval(id);
  }, [dripping]);

  const reset = () => { setVolume(0); setDripping(false); };

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">🧪 Titration Curve</h2>
          <p className="text-xs text-slate-500 mt-0.5">Apparatus, live pH plotting, and weak-acid buffer analysis</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="cyan" />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            {viewMode === 'apparatus' && <Apparatus volume={volume} dripping={dripping} setDripping={setDripping} reset={reset} />}
            {viewMode === 'curve' && <CurveGraph volume={volume} setVolume={setVolume} reset={reset} />}
            {viewMode === 'buffer' && <BufferZone volume={volume} setVolume={setVolume} />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Titration Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function strongPH(v: number) {
  const acidMoles = 25 * 0.1;
  const baseMoles = v * 0.1;
  const total = 25 + v;
  if (Math.abs(acidMoles - baseMoles) < 0.0001) return 7;
  if (baseMoles < acidMoles) return -Math.log10((acidMoles - baseMoles) / total);
  return 14 + Math.log10((baseMoles - acidMoles) / total);
}

function weakPH(v: number) {
  const kaP = 4.76;
  if (v <= 0) return 2.9;
  if (v < 25) return kaP + Math.log10(v / Math.max(0.1, 25 - v));
  if (Math.abs(v - 25) < 0.2) return 8.72;
  return Math.min(13, 14 + Math.log10(((v - 25) * 0.1) / (25 + v)));
}

function indicator(ph: number) {
  if (ph < 8.2) return 'rgba(255,255,255,0.16)';
  const alpha = Math.min(0.75, 0.18 + (ph - 8.2) * 0.18);
  return `rgba(236,72,153,${alpha})`;
}

function Apparatus({ volume, dripping, setDripping, reset }: { volume: number; dripping: boolean; setDripping: (v: boolean) => void; reset: () => void }) {
  const ph = strongPH(volume);
  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 420" className="w-full rounded-2xl bg-[#07111b]">
          <rect x="116" y="35" width="30" height="235" rx="10" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <motion.rect x="120" y={42 + volume * 4.1} width="22" height={218 - volume * 4.1} rx="8" fill="#93c5fd" opacity="0.75" animate={{ y: 42 + volume * 4.1, height: 218 - volume * 4.1 }} />
          {Array.from({ length: 11 }).map((_, i) => <line key={i} x1="146" y1={44 + i * 21} x2="160" y2={44 + i * 21} stroke="#64748b" />)}
          <rect x="124" y="270" width="16" height="28" rx="4" fill="#1e293b" stroke="#94a3b8" />
          <circle cx="132" cy="284" r="6" fill={dripping ? '#ef4444' : '#22c55e'} />
          {dripping && <motion.circle cx="132" cy="304" r="4" fill="#93c5fd" animate={{ cy: [304, 352], opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />}
          <path d="M 214 228 L 338 228 L 382 386 L 170 386 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
          <motion.path d="M 202 332 Q 276 350 350 332 L 376 382 L 176 382 Z" fill={indicator(ph)} animate={{ fill: indicator(ph) }} />
          <motion.ellipse cx="276" cy="333" rx="76" ry="16" fill={indicator(ph)} animate={{ fill: indicator(ph) }} />
          <text x="276" y="407" fill="#94a3b8" fontSize="12" textAnchor="middle">HCl + phenolphthalein</text>
          <text x="132" y="24" fill="#93c5fd" fontSize="12" textAnchor="middle">0.1 M NaOH</text>
          <g transform="translate(405 90)">
            <rect width="118" height="120" rx="18" fill="#0f172a" stroke="#1e293b" />
            <text x="59" y="32" fill="#94a3b8" fontSize="10" textAnchor="middle">Live pH</text>
            <text x="59" y="68" fill="#22d3ee" fontSize="30" textAnchor="middle" fontWeight="bold">{ph.toFixed(2)}</text>
            <text x="59" y="96" fill="#f472b6" fontSize="10" textAnchor="middle">{ph >= 8.2 ? 'pink endpoint' : 'colorless'}</text>
          </g>
        </svg>
      </Board>
      <Control>
        <Readout label="Base added" value={`${volume.toFixed(1)} mL`} color="text-cyan-300" />
        <div className="flex gap-3">
          <button onPointerDown={() => setDripping(true)} onPointerUp={() => setDripping(false)} onPointerLeave={() => setDripping(false)} className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-bold uppercase text-black">Hold to drip</button>
          <button onClick={reset} className="w-12 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center"><RefreshCw size={16} /></button>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">The indicator remains clear in acid, then turns pink just after the steep pH jump near equivalence.</p>
      </Control>
    </SimGrid>
  );
}

function CurveGraph({ volume, setVolume, reset }: { volume: number; setVolume: (v: number) => void; reset: () => void }) {
  const ph = strongPH(volume);
  const points = Array.from({ length: Math.floor(volume * 2) + 1 }, (_, i) => {
    const v = i / 2;
    return `${55 + v * 9.2},${300 - strongPH(v) / 14 * 245}`;
  }).join(' ');
  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 350" className="w-full rounded-2xl bg-[#07111b]">
          <GraphAxes />
          <rect x={55 + 25 * 9.2 - 8} y="55" width="16" height="245" fill="#22d3ee" opacity="0.08" />
          <line x1={55 + 25 * 9.2} y1="55" x2={55 + 25 * 9.2} y2="300" stroke="#ef4444" strokeDasharray="5 6" />
          <text x={55 + 25 * 9.2 + 12} y="76" fill="#fca5a5" fontSize="10">Equivalence</text>
          <motion.polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={55 + volume * 9.2} cy={300 - ph / 14 * 245} r="6" fill="#facc15" />
          <text x="306" y="328" fill="#64748b" fontSize="11" textAnchor="middle">NaOH added (mL)</text>
          <text x="22" y="178" fill="#64748b" fontSize="11" transform="rotate(-90 22 178)" textAnchor="middle">pH</text>
        </svg>
      </Board>
      <Control>
        <StemSlider label="NaOH volume" value={volume} min={0} max={50} step={0.5} unit=" mL" color="cyan" onChange={setVolume} />
        <Readout label="Current pH" value={ph.toFixed(2)} color="text-yellow-300" />
        <button onClick={reset} className="rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold uppercase text-slate-200 flex items-center justify-center gap-2"><RefreshCw size={16} />Reset</button>
      </Control>
    </SimGrid>
  );
}

function BufferZone({ volume, setVolume }: { volume: number; setVolume: (v: number) => void }) {
  const ph = weakPH(volume);
  const inBuffer = volume > 3 && volume < 22;
  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 350" className="w-full rounded-2xl bg-[#07111b]">
          <GraphAxes />
          <rect x={55 + 3 * 9.2} y="55" width={19 * 9.2} height="245" fill="#22c55e" opacity="0.12" />
          <text x={55 + 12.5 * 9.2} y="78" fill="#86efac" fontSize="12" textAnchor="middle" fontWeight="bold">Buffer region</text>
          <polyline points={Array.from({ length: 101 }, (_, i) => {
            const v = i / 2;
            return `${55 + v * 9.2},${300 - weakPH(v) / 14 * 245}`;
          }).join(' ')} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={55 + volume * 9.2} cy={300 - ph / 14 * 245} r="6" fill={inBuffer ? '#86efac' : '#facc15'} />
          <text x="306" y="328" fill="#64748b" fontSize="11" textAnchor="middle">NaOH added to weak acid (mL)</text>
        </svg>
      </Board>
      <Control>
        <StemSlider label="NaOH volume" value={volume} min={0} max={50} step={0.5} unit=" mL" color="green" onChange={setVolume} />
        <Readout label="Weak acid pH" value={ph.toFixed(2)} color={inBuffer ? 'text-green-300' : 'text-yellow-300'} />
        <p className="text-sm text-slate-400 leading-relaxed">In the buffer region, HA and A- are both present. Added base is absorbed by HA, so pH changes gradually until the weak acid is nearly consumed.</p>
      </Control>
    </SimGrid>
  );
}

function GraphAxes() {
  return (
    <>
      <line x1="55" y1="300" x2="515" y2="300" stroke="#475569" />
      <line x1="55" y1="55" x2="55" y2="300" stroke="#475569" />
      {Array.from({ length: 8 }).map((_, i) => <g key={i}><line x1="50" y1={300 - i * 35} x2="515" y2={300 - i * 35} stroke="#132033" /><text x="42" y={304 - i * 35} fill="#64748b" fontSize="8" textAnchor="end">{i * 2}</text></g>)}
      {Array.from({ length: 6 }).map((_, i) => <g key={i}><line x1={55 + i * 92} y1="55" x2={55 + i * 92} y2="305" stroke="#132033" /><text x={55 + i * 92} y="318" fill="#64748b" fontSize="8" textAnchor="middle">{i * 10}</text></g>)}
    </>
  );
}

function SimGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.25fr,0.75fr]">{children}</div>;
}

function Board({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">{children}</div>;
}

function Control({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">{children}</div>;
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="rounded-2xl border border-slate-800 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p><p className={`text-2xl font-mono font-bold ${color}`}>{value}</p></div>;
}
