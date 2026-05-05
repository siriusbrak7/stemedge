import { useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'glucose' | 'thyroid' | 'cycle' | 'quiz';

const TABS = [
  { id: 'glucose' as ViewMode, label: 'Blood Glucose', icon: '🍽️' },
  { id: 'thyroid' as ViewMode, label: 'Thyroid Axis', icon: '🌡️' },
  { id: 'cycle' as ViewMode, label: 'Cycle', icon: '📈' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'ef1', question: 'Which hormone lowers blood glucose?', type: 'multiple-choice', options: ['Glucagon', 'Adrenaline', 'Insulin', 'Cortisol'], correctAnswer: 'Insulin', explanation: 'Insulin stimulates glucose uptake and glycogen synthesis.' },
  { id: 'ef2', question: 'Which organ releases insulin and glucagon?', type: 'multiple-choice', options: ['Liver', 'Pancreas', 'Kidney', 'Thyroid'], correctAnswer: 'Pancreas', explanation: 'Pancreatic beta cells release insulin; alpha cells release glucagon.' },
  { id: 'ef3', question: 'Negative feedback means:', type: 'multiple-choice', options: ['The response amplifies the stimulus', 'The response reduces the stimulus', 'Hormones are destroyed', 'The pancreas stops working'], correctAnswer: 'The response reduces the stimulus', explanation: 'Negative feedback opposes the original change to restore homeostasis.' },
];

export default function EndocrineFeedback() {
  const [viewMode, setViewMode] = useState<ViewMode>('glucose');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">🧬 Endocrine Feedback</h2>
          <p className="text-xs text-slate-500 mt-0.5">Hormone axes, homeostasis, and negative feedback loops</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor={viewMode === 'thyroid' ? 'purple' : viewMode === 'cycle' ? 'pink' : 'green'} />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            {viewMode === 'glucose' && <GlucoseAxis />}
            {viewMode === 'thyroid' && <ThyroidAxis />}
            {viewMode === 'cycle' && <MenstrualCycle />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Endocrine Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function GlucoseAxis() {
  const [meals, setMeals] = useState(2);
  const [activity, setActivity] = useState(35);
  const glucose = Math.max(55, Math.min(165, 82 + meals * 18 - activity * 0.38));
  const insulin = Math.max(5, Math.min(100, (glucose - 75) * 1.25));
  const glucagon = Math.max(5, Math.min(100, (92 - glucose) * 1.55 + activity * 0.25));
  const liverStore = Math.max(15, Math.min(100, 65 + insulin * 0.3 - glucagon * 0.28));

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 560 360" className="w-full rounded-2xl bg-[#07120d]">
          <text x="280" y="34" fill="#86efac" fontSize="15" textAnchor="middle" fontWeight="bold">Pancreas-Liver Blood Glucose Loop</text>
          <rect x="244" y="58" width="72" height="230" rx="12" fill="#13251a" stroke="#334155" />
          <motion.rect x="254" y={278 - (glucose - 50) * 1.6} width="52" height={(glucose - 50) * 1.6} rx="8" fill={glucose > 115 ? '#f97316' : glucose < 70 ? '#ef4444' : '#22c55e'}
            animate={{ y: 278 - (glucose - 50) * 1.6, height: (glucose - 50) * 1.6 }} />
          {[70, 90, 110, 140].map(v => <g key={v}><line x1="319" y1={278 - (v - 50) * 1.6} x2="329" y2={278 - (v - 50) * 1.6} stroke="#64748b" /><text x="336" y={282 - (v - 50) * 1.6} fill="#64748b" fontSize="8">{v}</text></g>)}
          <text x="280" y="306" fill="#94a3b8" fontSize="10" textAnchor="middle">Blood glucose: {glucose.toFixed(0)} mg/dL</text>

          <path d="M 70 170 C 45 205 55 252 112 259 C 174 266 196 228 178 178 C 161 132 100 130 70 170 Z" fill="#1e293b" stroke="#ca8a04" strokeWidth="2" />
          <text x="122" y="204" fill="#facc15" fontSize="14" textAnchor="middle" fontWeight="bold">Liver</text>
          <motion.rect x="85" y="225" width={liverStore} height="12" rx="6" fill="#facc15" animate={{ width: liverStore }} />
          <text x="122" y="252" fill="#a16207" fontSize="9" textAnchor="middle">Glycogen store</text>

          <ellipse cx="445" cy="210" rx="82" ry="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="445" y="214" fill="#fbbf24" fontSize="14" textAnchor="middle" fontWeight="bold">Pancreas</text>
          <circle cx="418" cy="207" r="10" fill="#2563eb" opacity={insulin / 100} /><text x="418" y="211" fill="white" fontSize="8" textAnchor="middle">β</text>
          <circle cx="472" cy="207" r="10" fill="#f97316" opacity={glucagon / 100} /><text x="472" y="211" fill="white" fontSize="8" textAnchor="middle">α</text>

          <HormoneArrow active={insulin > glucagon} color="#60a5fa" path="M 415 190 C 360 105 220 112 150 170" label="Insulin: store glucose" lx={272} ly={106} />
          <HormoneArrow active={glucagon > insulin} color="#fb923c" path="M 410 230 C 315 320 140 305 108 252" label="Glucagon: release glucose" lx={258} ly={314} />
          {Array.from({ length: Math.round(meals) }).map((_, i) => (
            <motion.circle key={i} cx={260 + i * 18} cy="72" r="5" fill="#fb923c" animate={{ cy: [72, 128, 72], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }} />
          ))}
        </svg>
      </div>
      <Panel>
        <StemSlider label="Meals eaten" value={meals} min={0} max={4} color="orange" onChange={setMeals} />
        <StemSlider label="Exercise demand" value={activity} min={0} max={100} unit="%" color="green" onChange={setActivity} />
        <Stats rows={[['Insulin', `${insulin.toFixed(0)}%`, 'text-blue-300'], ['Glucagon', `${glucagon.toFixed(0)}%`, 'text-orange-300'], ['Liver glycogen', `${liverStore.toFixed(0)}%`, 'text-yellow-300']]} />
      </Panel>
    </div>
  );
}

function ThyroidAxis() {
  const [cold, setCold] = useState(40);
  const [stress, setStress] = useState(25);
  const trh = Math.min(100, 25 + cold * 0.55 + stress * 0.2);
  const tsh = Math.min(100, trh * 0.82);
  const t3t4 = Math.min(100, tsh * 0.9);
  const feedback = Math.max(8, 100 - t3t4 * 0.75);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 560 360" className="w-full rounded-2xl bg-[#0f0a18]">
          <AxisNode x={280} y={72} label="Hypothalamus" value={trh} color="#a78bfa" />
          <AxisNode x={280} y={174} label="Pituitary" value={tsh} color="#38bdf8" />
          <AxisNode x={280} y={286} label="Thyroid" value={t3t4} color="#f472b6" />
          <HormoneArrow active color="#a78bfa" path="M 280 104 L 280 142" label="TRH" lx={305} ly={127} />
          <HormoneArrow active color="#38bdf8" path="M 280 206 L 280 254" label="TSH" lx={305} ly={233} />
          <motion.path d="M 347 286 C 492 258 493 83 348 73" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="8 12"
            animate={{ strokeDashoffset: [20, 0], opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
          <text x="463" y="172" fill="#fb7185" fontSize="11" fontWeight="bold">negative feedback</text>
          <text x="463" y="188" fill="#94a3b8" fontSize="9">brake strength {feedback.toFixed(0)}%</text>
          <text x="95" y="88" fill="#e0e7ff" fontSize="12">Cold exposure + stress raise TRH</text>
        </svg>
      </div>
      <Panel>
        <StemSlider label="Cold exposure" value={cold} min={0} max={100} unit="%" color="purple" onChange={setCold} />
        <StemSlider label="Stress signal" value={stress} min={0} max={100} unit="%" color="pink" onChange={setStress} />
        <Stats rows={[['TRH', `${trh.toFixed(0)}%`, 'text-violet-300'], ['TSH', `${tsh.toFixed(0)}%`, 'text-cyan-300'], ['T3/T4', `${t3t4.toFixed(0)}%`, 'text-pink-300']]} />
      </Panel>
    </div>
  );
}

function MenstrualCycle() {
  const [day, setDay] = useState(14);
  const estrogen = Math.max(12, 78 * Math.exp(-Math.pow((day - 12) / 4.4, 2)) + 32 * Math.exp(-Math.pow((day - 21) / 5, 2)));
  const lh = Math.max(4, 96 * Math.exp(-Math.pow((day - 14) / 1.5, 2)));
  const fsh = Math.max(10, 34 * Math.exp(-Math.pow((day - 4) / 4, 2)) + 24 * Math.exp(-Math.pow((day - 14) / 2.4, 2)));
  const progesterone = Math.max(5, 82 * Math.exp(-Math.pow((day - 22) / 4.8, 2)));
  const phase = day < 6 ? 'Menstrual' : day < 14 ? 'Follicular' : day < 16 ? 'Ovulation' : 'Luteal';

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.35fr,0.65fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 620 360" className="w-full rounded-2xl bg-[#160b14]">
          <line x1="55" y1="300" x2="580" y2="300" stroke="#475569" />
          <line x1="55" y1="42" x2="55" y2="300" stroke="#475569" />
          {[7, 14, 21, 28].map(d => <g key={d}><line x1={55 + d * 18.3} y1="42" x2={55 + d * 18.3} y2="300" stroke="#1f2937" /><text x={55 + d * 18.3} y="322" fill="#64748b" fontSize="9" textAnchor="middle">Day {d}</text></g>)}
          <CycleCurve color="#fb7185" values={Array.from({ length: 28 }, (_, i) => Math.max(12, 78 * Math.exp(-Math.pow((i + 1 - 12) / 4.4, 2)) + 32 * Math.exp(-Math.pow((i + 1 - 21) / 5, 2))))} />
          <CycleCurve color="#facc15" values={Array.from({ length: 28 }, (_, i) => Math.max(4, 96 * Math.exp(-Math.pow((i + 1 - 14) / 1.5, 2))))} />
          <CycleCurve color="#38bdf8" values={Array.from({ length: 28 }, (_, i) => Math.max(10, 34 * Math.exp(-Math.pow((i + 1 - 4) / 4, 2)) + 24 * Math.exp(-Math.pow((i + 1 - 14) / 2.4, 2))))} />
          <CycleCurve color="#a78bfa" values={Array.from({ length: 28 }, (_, i) => Math.max(5, 82 * Math.exp(-Math.pow((i + 1 - 22) / 4.8, 2))))} />
          <motion.line x1={55 + day * 18.3} y1="42" x2={55 + day * 18.3} y2="300" stroke="#fff" strokeWidth="2" animate={{ x1: 55 + day * 18.3, x2: 55 + day * 18.3 }} />
          <text x="100" y="34" fill="#fb7185" fontSize="10">Estrogen</text>
          <text x="175" y="34" fill="#facc15" fontSize="10">LH</text>
          <text x="225" y="34" fill="#38bdf8" fontSize="10">FSH</text>
          <text x="280" y="34" fill="#a78bfa" fontSize="10">Progesterone</text>
          <g transform="translate(445 70)">
            <circle cx="56" cy="80" r="54" fill="#2a1022" stroke="#fb7185" />
            <motion.circle cx="56" cy="80" r={phase === 'Follicular' ? 14 + day : phase === 'Ovulation' ? 42 : 24} fill={phase === 'Luteal' ? '#a78bfa' : '#fb7185'} opacity="0.65" animate={{ r: phase === 'Follicular' ? 14 + day : phase === 'Ovulation' ? 42 : 24 }} />
            <text x="56" y="156" fill="#e2e8f0" fontSize="10" textAnchor="middle">{phase} phase</text>
          </g>
        </svg>
      </div>
      <Panel>
        <StemSlider label="Cycle day" value={day} min={1} max={28} color="pink" onChange={setDay} />
        <Stats rows={[['Estrogen', `${estrogen.toFixed(0)}%`, 'text-pink-300'], ['LH surge', `${lh.toFixed(0)}%`, 'text-yellow-300'], ['FSH', `${fsh.toFixed(0)}%`, 'text-cyan-300'], ['Progesterone', `${progesterone.toFixed(0)}%`, 'text-violet-300']]} />
        <p className="text-sm text-slate-400 leading-relaxed">Day {day} sits in the <span className="text-white font-bold">{phase}</span> phase. The LH spike around day 14 triggers ovulation, while progesterone dominates after ovulation.</p>
      </Panel>
    </div>
  );
}

function HormoneArrow({ active, color, path, label, lx, ly }: { active: boolean; color: string; path: string; label: string; lx: number; ly: number }) {
  return (
    <g opacity={active ? 1 : 0.2}>
      <motion.path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="9 13" animate={{ strokeDashoffset: [22, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
      <text x={lx} y={ly} fill={color} fontSize="10" fontWeight="bold">{label}</text>
    </g>
  );
}

function AxisNode({ x, y, label, value, color }: { x: number; y: number; label: string; value: number; color: string }) {
  return (
    <g>
      <motion.circle cx={x} cy={y} r={34 + value * 0.12} fill={color} opacity="0.18" animate={{ r: 34 + value * 0.12 }} />
      <circle cx={x} cy={y} r="34" fill="#111827" stroke={color} strokeWidth="2" />
      <text x={x} y={y - 3} fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">{label}</text>
      <text x={x} y={y + 14} fill={color} fontSize="11" textAnchor="middle">{value.toFixed(0)}%</text>
    </g>
  );
}

function CycleCurve({ color, values }: { color: string; values: number[] }) {
  const points = values.map((v, i) => `${55 + (i + 1) * 18.3},${300 - v * 2.25}`).join(' ');
  return <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">{children}</div>;
}

function Stats({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {rows.map(([label, value, color]) => (
        <div key={label} className="rounded-2xl border border-slate-800 bg-black/30 p-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
          <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
