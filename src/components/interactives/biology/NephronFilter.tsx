import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'filtration' | 'countercurrent' | 'adh' | 'quiz';

const TABS = [
  { id: 'filtration' as ViewMode, label: 'Filtration', icon: '🩸' },
  { id: 'countercurrent' as ViewMode, label: 'Loop Gradient', icon: '🧂' },
  { id: 'adh' as ViewMode, label: 'ADH Control', icon: '💧' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ = [
  { id: 'nf1', question: 'Where does ultrafiltration occur?', type: 'multiple-choice' as const, options: ['Loop of Henle', "Bowman's Capsule", 'Collecting Duct', 'PCT'], correctAnswer: "Bowman's Capsule", explanation: 'High blood pressure forces small molecules out of the glomerulus into Bowman\'s capsule.' },
  { id: 'nf2', question: 'The Loop of Henle primarily creates:', type: 'multiple-choice' as const, options: ['Urine', 'A concentration gradient', 'Red blood cells', 'Glucose'], correctAnswer: 'A concentration gradient', explanation: 'The countercurrent multiplier establishes an osmotic gradient in the medulla for water reabsorption.' },
  { id: 'nf3', question: 'ADH acts on which structure?', type: 'multiple-choice' as const, options: ['Glomerulus', 'PCT', 'Collecting Duct', 'Afferent arteriole'], correctAnswer: 'Collecting Duct', explanation: 'ADH makes the collecting duct more permeable to water, allowing more reabsorption and producing concentrated urine.' },
];

const STEPS = [
  { title: '1. Ultrafiltration (Bowman\'s Capsule)', desc: 'Blood enters the glomerulus under high pressure via the afferent arteriole (wider than the efferent). This pressure forces water, glucose, amino acids, urea, Na⁺, K⁺, and other small molecules through the capillary walls and podocytes into Bowman\'s capsule. Large molecules (proteins, blood cells) are too big to pass — they remain in the blood. The resulting fluid is called glomerular filtrate (~180 L/day in humans, but 99% is reabsorbed).' },
  { title: '2. Selective Reabsorption (PCT)', desc: 'The Proximal Convoluted Tubule reabsorbs ~65% of filtrate. ALL glucose and amino acids are actively transported back into the peritubular capillaries via co-transporters (secondary active transport with Na⁺). Most Na⁺ is reabsorbed via Na⁺/K⁺-ATPase pumps. Water follows by osmosis. The brush border (microvilli) of PCT cells greatly increases surface area for absorption. Clinical note: if blood glucose exceeds the transport maximum (~180 mg/dL), glucose appears in urine — a sign of diabetes mellitus.' },
  { title: '3. Loop of Henle (Countercurrent)', desc: 'The descending limb is permeable to water but not salts — water leaves by osmosis as the filtrate descends into the increasingly salty medulla. The ascending limb is impermeable to water but actively pumps out Na⁺/Cl⁻ via the Na-K-2Cl co-transporter. This "countercurrent multiplier" creates a concentration gradient (300 mOsm at the cortex → 1200 mOsm at the inner medulla), which is essential for producing concentrated urine in the collecting duct.' },
  { title: '4. Fine-tuning (DCT & Collecting Duct)', desc: 'The DCT and collecting duct are under hormonal control. ADH (antidiuretic hormone) from the posterior pituitary makes the collecting duct permeable to water — water is reabsorbed by osmosis using the medullary gradient, producing concentrated urine. Without ADH, the duct is impermeable and dilute urine is excreted. Aldosterone from the adrenal cortex increases Na⁺ reabsorption (and K⁺ secretion) in the DCT. This is the renin-angiotensin-aldosterone system (RAAS) in action.' },
];

export default function NephronFilter() {
  const [viewMode, setViewMode] = useState<ViewMode>('filtration');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Nephron Filter</h2>
          <p className="text-xs text-slate-500">Filtration, countercurrent multiplication, and ADH water recovery</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="cyan" />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'filtration' && <NephronSim initialStep={0} />}
            {viewMode === 'countercurrent' && <NephronSim initialStep={2} />}
            {viewMode === 'adh' && <ADHControl />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Nephron Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NephronSim({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const colors = ['#ef4444', '#3b82f6', '#eab308', '#a855f7'];
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 420 380" className="w-full max-w-[400px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="420" height="380" fill="#0a0a1a" rx="16" />
          {/* Cortex / Medulla boundary */}
          <line x1="0" y1="180" x2="420" y2="180" stroke="#1e293b" strokeWidth="1" strokeDasharray="6 4" />
          <text x="10" y="30" fill="#334155" fontSize="9">CORTEX</text>
          <text x="10" y="195" fill="#334155" fontSize="9">MEDULLA</text>

          {/* Bowman's Capsule + Glomerulus */}
          <ellipse cx="100" cy="70" rx="45" ry="40" fill="none" stroke={step === 0 ? '#ef4444' : '#334155'} strokeWidth={step === 0 ? 2.5 : 1.5} />
          <circle cx="95" cy="65" r="6" fill="#dc2626" opacity="0.6" />
          <circle cx="105" cy="60" r="5" fill="#dc2626" opacity="0.5" />
          <circle cx="98" cy="75" r="5" fill="#dc2626" opacity="0.5" />
          <circle cx="108" cy="72" r="4" fill="#dc2626" opacity="0.4" />
          <text x="100" y="55" fill="#f87171" fontSize="7" textAnchor="middle">Glomerulus</text>
          <text x="100" y="100" fill="#94a3b8" fontSize="7" textAnchor="middle">Bowman's</text>
          {/* Afferent/Efferent */}
          <line x1="40" y1="55" x2="60" y2="65" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <line x1="40" y1="85" x2="60" y2="78" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <text x="25" y="52" fill="#ef4444" fontSize="6">Aff.</text>
          <text x="25" y="92" fill="#ef4444" fontSize="6">Eff.</text>

          {/* PCT */}
          <path d="M 145 70 Q 200 40 230 70 Q 260 100 230 120 Q 200 140 180 120" stroke={step === 1 ? '#3b82f6' : '#475569'} strokeWidth={step === 1 ? 2.5 : 1.5} fill="none" strokeLinecap="round" />
          <text x="220" y="65" fill={step === 1 ? '#60a5fa' : '#475569'} fontSize="8" fontWeight={step === 1 ? 'bold' : 'normal'}>PCT</text>
          {/* Brush border indicators */}
          {step === 1 && [50, 60, 70, 80, 90].map(p => <line key={p} x1={145 + p} y1={55} x2={145 + p} y2={48} stroke="#60a5fa" strokeWidth="1" opacity="0.5" />)}

          {/* Loop of Henle */}
          <path d="M 180 120 L 180 300 Q 180 330 210 330 Q 240 330 240 300 L 240 120" stroke={step === 2 ? '#eab308' : '#475569'} strokeWidth={step === 2 ? 2.5 : 1.5} fill="none" strokeLinecap="round" />
          <text x="160" y="220" fill={step === 2 ? '#fbbf24' : '#475569'} fontSize="7" transform="rotate(-90, 160, 220)">Descending (H₂O out)</text>
          <text x="260" y="220" fill={step === 2 ? '#fbbf24' : '#475569'} fontSize="7" transform="rotate(-90, 260, 220)">Ascending (Na⁺ out)</text>
          {/* Water/Na arrows */}
          {step === 2 && (
            <>
              <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                <path d="M 175 230 L 155 230" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="140" y="234" fill="#3b82f6" fontSize="6">H₂O</text>
              </motion.g>
              <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
                <path d="M 245 250 L 265 250" stroke="#eab308" strokeWidth="1.5" />
                <text x="270" y="254" fill="#eab308" fontSize="6">Na⁺Cl⁻</text>
              </motion.g>
            </>
          )}

          {/* DCT */}
          <path d="M 240 120 Q 280 80 320 100 Q 350 120 330 150" stroke={step === 3 ? '#a855f7' : '#475569'} strokeWidth={step === 3 ? 2.5 : 1.5} fill="none" strokeLinecap="round" />
          <text x="310" y="90" fill={step === 3 ? '#c084fc' : '#475569'} fontSize="8" fontWeight={step === 3 ? 'bold' : 'normal'}>DCT</text>

          {/* Collecting Duct */}
          <path d="M 330 150 L 330 350" stroke={step === 3 ? '#a855f7' : '#475569'} strokeWidth={step === 3 ? 3 : 2} strokeLinecap="round" />
          <text x="350" y="250" fill={step === 3 ? '#c084fc' : '#475569'} fontSize="7">Collecting</text>
          <text x="350" y="262" fill={step === 3 ? '#c084fc' : '#475569'} fontSize="7">Duct</text>
          <text x="330" y="372" fill="#94a3b8" fontSize="7" textAnchor="middle">→ Urine</text>

          {/* ADH label */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="380" y="300" fill="#a855f7" fontSize="8" fontWeight="bold">ADH</text>
              <path d="M 375 295 L 340 280" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
            </motion.g>
          )}

          {/* Filtrate particle */}
          <motion.circle r="5" fill={colors[step]} opacity="0.9"
            animate={step === 0 ? { cx: [95, 140], cy: [65, 70] } : step === 1 ? { cx: [145, 230, 180], cy: [70, 70, 120] } : step === 2 ? { cx: [180, 180, 210, 240], cy: [120, 300, 330, 120] } : { cx: [240, 320, 330, 330], cy: [120, 100, 150, 350] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </svg>

        {/* Step nav */}
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0} className={`p-2 rounded-lg ${step===0?'bg-slate-900 text-slate-700':'bg-slate-800 text-white hover:bg-slate-700'}`}><ChevronLeft size={16}/></button>
          {STEPS.map((_,i) => <button key={i} onClick={() => setStep(i)} className={`w-2.5 h-2.5 rounded-full ${i===step?'bg-brand-accent scale-125':i<step?'bg-green-600':'bg-slate-700'}`}/>)}
          <button onClick={() => setStep(s => Math.min(3, s+1))} disabled={step===3} className={`p-2 rounded-lg ${step===3?'bg-slate-900 text-slate-700':'bg-slate-800 text-white hover:bg-slate-700'}`}><ChevronRight size={16}/></button>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">Region {step+1}/4</div>
      </div>
      <div className="lg:w-[340px]">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">{STEPS[step].title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{STEPS[step].desc}</p>
          </motion.div>
        </AnimatePresence>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mt-4 space-y-1">
          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Particle Legend</h4>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-400"/><span className="text-[11px] text-slate-400">Water (H₂O)</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-400"/><span className="text-[11px] text-slate-400">Glucose</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"/><span className="text-[11px] text-slate-400">Na⁺ / K⁺</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-700"/><span className="text-[11px] text-slate-400">Urea</span></div>
        </div>
      </div>
    </div>
  );
}

function ADHControl() {
  const [adh, setAdh] = useState(65);
  const [medulla, setMedulla] = useState(70);
  const waterReabsorbed = Math.min(99, 35 + adh * 0.42 + medulla * 0.22);
  const urineVolume = Math.max(0.4, 6 - waterReabsorbed * 0.055);
  const urineConc = Math.round(250 + waterReabsorbed * 9.5);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 520 360" className="w-full rounded-2xl bg-[#07111b]">
          <defs>
            <linearGradient id="medullaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#92400e" stopOpacity={medulla / 100} />
            </linearGradient>
          </defs>
          <rect x="40" y="45" width="440" height="270" rx="22" fill="url(#medullaGradient)" stroke="#1e293b" />
          <path d="M 260 45 L 260 315" stroke="#38bdf8" strokeWidth="18" strokeLinecap="round" opacity="0.35" />
          <path d="M 260 45 L 260 315" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
          <text x="260" y="34" fill="#bfdbfe" fontSize="13" textAnchor="middle" fontWeight="bold">Collecting duct water permeability</text>
          {Array.from({ length: Math.round(adh / 12) }).map((_, i) => (
            <motion.circle key={i} cx={248 + (i % 2) * 24} cy={80 + i * 25} r="5" fill="#22d3ee"
              animate={{ x: [248 + (i % 2) * 24, 190 + (i % 4) * 34], opacity: [1, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.16 }} />
          ))}
          <motion.rect x="338" y={300 - waterReabsorbed * 2.2} width="60" height={waterReabsorbed * 2.2} rx="12" fill="#22c55e" opacity="0.75" animate={{ y: 300 - waterReabsorbed * 2.2, height: waterReabsorbed * 2.2 }} />
          <text x="368" y="326" fill="#86efac" fontSize="10" textAnchor="middle">Water returned</text>
          <motion.rect x="120" y={300 - urineVolume * 35} width="60" height={urineVolume * 35} rx="12" fill="#facc15" opacity="0.75" animate={{ y: 300 - urineVolume * 35, height: urineVolume * 35 }} />
          <text x="150" y="326" fill="#fde68a" fontSize="10" textAnchor="middle">Urine volume</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
        <StemSlider label="ADH level" value={adh} min={0} max={100} unit="%" color="cyan" onChange={setAdh} />
        <StemSlider label="Medullary salt gradient" value={medulla} min={0} max={100} unit="%" color="orange" onChange={setMedulla} />
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Water reabsorbed" value={`${waterReabsorbed.toFixed(0)}%`} color="text-cyan-300" />
          <Metric label="Urine concentration" value={`${urineConc} mOsm`} color="text-yellow-300" />
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">More ADH inserts aquaporins into the collecting duct, so water leaves the filtrate and returns to blood. Low ADH produces a larger volume of dilute urine.</p>
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-black/30 p-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}
