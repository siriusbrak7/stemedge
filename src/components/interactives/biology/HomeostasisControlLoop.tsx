import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type Module = 'loop' | 'variables' | 'theory';

const TABS = [
  { id: 'loop'      as Module, label: 'Control Loop',  icon: '🔄' },
  { id: 'variables' as Module, label: 'Variables',     icon: '🌡️' },
  { id: 'theory'    as Module, label: 'Theory',        icon: '📚' },
];

const VARIABLES = [
  {
    id: 'glucose', label: 'Blood Glucose', unit: 'mg/dL', min: 45, max: 180, setPoint: 90,
    color: '#22c55e', sliderColor: 'green' as const,
    lowHormone: 'Glucagon', highHormone: 'Insulin',
    lowResponse: 'Liver releases glucose (glycogenolysis)',
    highResponse: 'Liver stores glucose (glycogenesis)',
    organ: 'Pancreas', icon: '🩸',
  },
  {
    id: 'temp', label: 'Body Temperature', unit: '°C', min: 34.0, max: 41.0, setPoint: 37.0, step: 0.1,
    color: '#f59e0b', sliderColor: 'orange' as const,
    lowHormone: 'Shivering / vasoconstriction', highHormone: 'Sweating / vasodilation',
    lowResponse: 'Muscles contract rapidly to generate heat',
    highResponse: 'Sweat glands release sweat; blood vessels dilate',
    organ: 'Hypothalamus', icon: '🌡️',
  },
  {
    id: 'hydration', label: 'Blood Osmolarity', unit: '%', min: 20, max: 100, setPoint: 60,
    color: '#38bdf8', sliderColor: 'cyan' as const,
    lowHormone: 'Low ADH', highHormone: 'High ADH',
    lowResponse: 'Kidney excretes dilute urine (less water reabsorption)',
    highResponse: 'Kidney reabsorbs more water → concentrated urine',
    organ: 'Posterior Pituitary', icon: '💧',
  },
];

export default function HomeostasisControlLoop() {
  const [module, setModule] = useState<Module>('loop');
  const [values, setValues] = useState({ glucose: 130, temp: 37.0, hydration: 55 });
  const [activeVar, setActiveVar] = useState(0);

  const v = VARIABLES[activeVar];
  const current = values[v.id as keyof typeof values];
  const deviation = current - v.setPoint;
  const stress = Math.min(100, Math.abs(deviation) * (v.id === 'temp' ? 20 : 1.5));
  const isHigh = deviation > 0;
  const isBalanced = Math.abs(deviation) < (v.id === 'temp' ? 0.3 : 5);
  const hormone = isBalanced ? 'Balanced ✓' : isHigh ? v.highHormone : v.lowHormone;
  const response = isBalanced ? 'System is at set point — no corrective action needed.' : isHigh ? v.highResponse : v.lowResponse;

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🔄 Homeostasis Control Loop</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Negative feedback regulation of internal body conditions.</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="green" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── CONTROL LOOP ── */}
        {module === 'loop' && (
          <motion.div key="loop" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            {/* SVG Feedback Loop */}
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Negative Feedback Loop</div>
              {/* Variable selector */}
              <div className="flex gap-2 flex-wrap mb-4">
                {VARIABLES.map((vr, i) => (
                  <button key={vr.id} onClick={() => setActiveVar(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${activeVar === i ? 'text-black' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
                    style={activeVar === i ? { backgroundColor: vr.color, boxShadow: `0 0 12px ${vr.color}60` } : {}}>
                    {vr.icon} {vr.label.split(' ')[1] || vr.label}
                  </button>
                ))}
              </div>

              <svg viewBox="0 0 420 310" className="w-full rounded-2xl bg-[#08111b]">
                {/* Background */}
                <rect width="420" height="310" fill="#08111b" />

                {/* Flow arrows — animated when not balanced */}
                {['top','right','bottom','left'].map((dir, i) => {
                  const paths: Record<string,string> = {
                    top:    'M 210 60 L 340 60',
                    right:  'M 340 60 L 340 200',
                    bottom: 'M 340 200 L 210 200',
                    left:   'M 210 200 L 210 60',
                  };
                  return (
                    <motion.path key={dir} d={paths[dir]} fill="none"
                      stroke={isBalanced ? '#22c55e' : v.color} strokeWidth="2"
                      strokeDasharray="8 6"
                      animate={!isBalanced ? { strokeDashoffset: [36, 0] } : { strokeDashoffset: 0 }}
                      transition={{ duration: 1.2, repeat: !isBalanced ? Infinity : 0, ease: 'linear' }}
                    />
                  );
                })}

                {/* Nodes */}
                {[
                  { x: 80,  y: 130, label: 'Receptor / Sensor',    sub: 'Detects deviation', color: '#38bdf8', emoji: '👁️' },
                  { x: 210, y: 40,  label: 'Control Centre',       sub: v.organ,             color: '#a78bfa', emoji: '🧠' },
                  { x: 340, y: 130, label: 'Effector',             sub: 'Produces response', color: '#fb7185', emoji: '💪' },
                  { x: 210, y: 200, label: 'Body / Internal Env',  sub: `${v.label}: ${current.toFixed(v.id === 'temp' ? 1 : 0)} ${v.unit}`, color: v.color, emoji: v.icon },
                ].map((node, i) => (
                  <motion.g key={node.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: i === 3 && !isBalanced ? [1, 1.05, 1] : 1 }}
                    transition={{ delay: i * 0.1, ...(i === 3 && !isBalanced ? { duration: 1.2, repeat: Infinity } : {}) }}
                  >
                    <rect x={node.x - 55} y={node.y - 32} width="110" height="64" rx="12"
                      fill={`${node.color}15`} stroke={node.color} strokeWidth="1.5" />
                    <text x={node.x} y={node.y - 12} fill={node.color} fontSize="8.5" textAnchor="middle" fontWeight="bold">{node.label}</text>
                    <text x={node.x} y={node.y + 2} fill="#94a3b8" fontSize="7.5" textAnchor="middle">{node.sub}</text>
                    <text x={node.x} y={node.y + 18} fill="#64748b" fontSize="11" textAnchor="middle">{node.emoji}</text>
                  </motion.g>
                ))}

                {/* Arrow labels */}
                <text x="275" y="52" fill="#64748b" fontSize="7">signal</text>
                <text x="350" y="135" fill="#64748b" fontSize="7">output</text>
                <text x="275" y="215" fill="#64748b" fontSize="7">feedback</text>
                <text x="45"  y="135" fill="#64748b" fontSize="7">monitor</text>

                {/* Status badge */}
                <rect x="120" y="252" width="180" height="42" rx="10"
                  fill={isBalanced ? 'rgba(34,197,94,0.12)' : `${v.color}18`}
                  stroke={isBalanced ? '#22c55e' : v.color} strokeWidth="1.5" />
                <text x="210" y="270" fill={isBalanced ? '#22c55e' : v.color} fontSize="9" textAnchor="middle" fontWeight="bold">
                  {isBalanced ? '✓ HOMEOSTASIS MAINTAINED' : isHigh ? '▲ ABOVE SET POINT' : '▼ BELOW SET POINT'}
                </text>
                <text x="210" y="284" fill="#94a3b8" fontSize="7.5" textAnchor="middle">{hormone}</text>
              </svg>
            </div>

            <div className="space-y-4">
              {/* Slider */}
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Adjust Value</div>
                <StemSlider
                  label={v.label} value={current}
                  min={v.min} max={v.max} step={v.id === 'temp' ? 0.1 : 1}
                  unit={v.unit} color={v.sliderColor}
                  onChange={val => setValues(prev => ({ ...prev, [v.id]: val }))}
                />
                {/* Set-point marker */}
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Set point: <span style={{ color: v.color }}>{v.setPoint} {v.unit}</span></span>
                  <span className={`font-mono font-bold ${isBalanced ? 'text-green-400' : deviation > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {deviation > 0 ? '+' : ''}{deviation.toFixed(v.id === 'temp' ? 1 : 0)} {v.unit}
                  </span>
                </div>
              </div>

              {/* Stress gauge */}
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Homeostatic Stress</div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <motion.div className="h-full rounded-full"
                    style={{ backgroundColor: isBalanced ? '#22c55e' : stress > 60 ? '#ef4444' : v.color }}
                    animate={{ width: `${stress}%` }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  />
                </div>
                <div className={`text-sm font-medium ${isBalanced ? 'text-green-400' : 'text-white'}`}>{Math.round(stress)}% — {isBalanced ? 'At set point' : 'Corrective response active'}</div>
              </div>

              {/* Response */}
              <AnimatePresence mode="wait">
                <motion.div key={hormone} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`rounded-[2rem] border p-5 ${isBalanced ? 'border-green-500/30 bg-green-500/8' : 'border-slate-800 bg-slate-950/70'}`}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: isBalanced ? '#22c55e' : v.color }}>
                    {isBalanced ? 'Homeostasis' : 'Active Response'}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{response}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── VARIABLES ── */}
        {module === 'variables' && (
          <motion.div key="variables" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 md:grid-cols-3">
            {VARIABLES.map((vr, i) => {
              const cur = values[vr.id as keyof typeof values];
              const dev = cur - vr.setPoint;
              const balanced = Math.abs(dev) < (vr.id === 'temp' ? 0.3 : 5);
              const pct = Math.min(100, Math.max(0, ((cur - vr.min) / (vr.max - vr.min)) * 100));
              return (
                <motion.div key={vr.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-3xl mb-2">{vr.icon}</div>
                  <div className="text-sm font-bold mb-1" style={{ color: vr.color }}>{vr.label}</div>
                  <div className="text-3xl font-mono font-bold text-white mb-1">{cur.toFixed(vr.id === 'temp' ? 1 : 0)}</div>
                  <div className="text-xs text-slate-500 mb-4">{vr.unit} | Set point: {vr.setPoint}</div>

                  <div className="mb-4">
                    <StemSlider label="" value={cur} min={vr.min} max={vr.max} step={vr.id === 'temp' ? 0.1 : 1}
                      unit="" color={vr.sliderColor}
                      onChange={val => setValues(prev => ({ ...prev, [vr.id]: val }))} />
                  </div>

                  <div className={`rounded-xl border p-3 text-xs ${balanced ? 'border-green-500/30 bg-green-500/8 text-green-300' : 'border-slate-700 text-slate-400'}`}>
                    <div className="font-bold mb-1">{vr.organ}</div>
                    {balanced ? 'At set point ✓' : dev > 0 ? vr.highHormone : vr.lowHormone}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── THEORY ── */}
        {module === 'theory' && (
          <motion.div key="theory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              {[
                { title: 'What is Homeostasis?', color: '#22c55e',
                  body: 'The maintenance of a constant internal environment despite changes in the external environment. It involves continuous monitoring and corrective responses to keep conditions within a narrow optimal range.' },
                { title: 'Negative Feedback', color: '#38bdf8',
                  body: 'The most common homeostatic mechanism. When a variable deviates from the set point, a response is triggered that opposes (negates) the change, bringing it back to normal. This creates a self-correcting loop.' },
                { title: 'Components of the Loop', color: '#a78bfa',
                  body: '① Receptor/Sensor: detects the stimulus (deviation). ② Control centre: compares to set point, sends instructions. ③ Effector: carries out the corrective response. ④ Feedback: the restored condition is detected by the receptor.' },
                { title: 'Positive Feedback (rare)', color: '#fb7185',
                  body: 'Amplifies the change rather than opposing it. Examples: blood clotting, childbirth (oxytocin loop), nerve action potentials. These are self-amplifying and typically end in a sudden completion event.' },
              ].map((card, i) => (
                <motion.div key={card.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 interactive-card">
                  <div className="text-sm font-bold mb-2" style={{ color: card.color }}>{card.title}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-green-500/20 bg-green-500/5 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-400 mb-3">🎯 Quick Check</div>
                <QuickCheck />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Key Terms</div>
                <div className="space-y-2">
                  {[
                    { term: 'Set point', def: 'The optimal value for a variable (e.g., 37°C, 90 mg/dL)' },
                    { term: 'Stimulus',  def: 'Any change that triggers a homeostatic response' },
                    { term: 'Effector',  def: 'Organ or gland that carries out the corrective action' },
                    { term: 'ADH',       def: 'Anti-Diuretic Hormone — controls water reabsorption in kidneys' },
                    { term: 'Glucagon',  def: 'Hormone from alpha cells; raises blood glucose' },
                    { term: 'Insulin',   def: 'Hormone from beta cells; lowers blood glucose' },
                  ].map(item => (
                    <div key={item.term} className="flex gap-2 text-xs">
                      <span className="text-green-400 font-bold w-20 shrink-0">{item.term}</span>
                      <span className="text-slate-400">{item.def}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickCheck() {
  const [ans, setAns] = useState<number | null>(null);
  const opts = ['Positive feedback', 'Negative feedback', 'Active transport', 'Osmosis'];
  return (
    <div>
      <p className="text-sm text-white mb-3">Which mechanism keeps blood glucose levels stable?</p>
      <div className="space-y-2">
        {opts.map((o, i) => (
          <button key={i} onClick={() => setAns(i)} disabled={ans !== null}
            className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
              ans === null ? 'border-slate-800 text-slate-300 hover:border-green-500/40' :
              i === 1 ? 'border-green-500/50 bg-green-500/12 text-green-300 anim-bounce-in' :
              ans === i ? 'border-red-500/50 bg-red-500/10 text-red-300' : 'border-slate-800 text-slate-500'
            }`}>{o}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {ans !== null && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-green-300 leading-relaxed">
            ✅ Negative feedback: when glucose rises above the set point, insulin is secreted to bring it back down — opposing the change.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
