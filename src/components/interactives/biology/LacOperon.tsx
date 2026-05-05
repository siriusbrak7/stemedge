import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';

type ViewMode = 'repressed' | 'induced' | 'catabolite' | 'quiz';

const TABS = [
  { id: 'repressed' as ViewMode, label: 'Repressed', icon: '🔒' },
  { id: 'induced' as ViewMode, label: 'Lactose On', icon: '🥛' },
  { id: 'catabolite' as ViewMode, label: 'Glucose Effect', icon: '⚡' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'lo1', question: 'The repressor protein binds to which region?', type: 'multiple-choice', options: ['Promoter', 'Operator', 'Structural genes', 'Regulatory gene'], correctAnswer: 'Operator', explanation: 'The repressor physically blocks RNA Polymerase by sitting on the operator sequence.' },
  { id: 'lo2', question: 'What happens when lactose (allolactose) binds to the repressor?', type: 'multiple-choice', options: ['The repressor binds tighter', 'The repressor changes shape and falls off the operator', 'RNA Polymerase is destroyed', 'The genes are permanently activated'], correctAnswer: 'The repressor changes shape and falls off the operator', explanation: 'Allolactose is an inducer — it causes an allosteric change in the repressor, so it can no longer bind the operator.' },
  { id: 'lo3', question: 'Maximum transcription of the lac operon requires:', type: 'multiple-choice', options: ['High glucose + high lactose', 'Low glucose + high lactose', 'High glucose + no lactose', 'Low glucose + no lactose'], correctAnswer: 'Low glucose + high lactose', explanation: 'Without glucose, cAMP rises and activates CAP protein, which greatly enhances RNA Polymerase binding at the promoter.' },
];

interface ScenarioData { title: string; description: string; repOnOperator: boolean; rnaMoving: boolean; capBound: boolean; transcriptionLevel: string; }

const SCENARIOS: ScenarioData[] = [
  { title: '1. No Lactose, Glucose Present', description: 'The lac repressor (encoded by the lacI regulatory gene) is active. It binds tightly to the operator sequence, physically blocking RNA Polymerase from accessing the structural genes lacZ, lacY, and lacA. Because glucose is available, the cell uses glucose for energy and has no need to express the lac operon. cAMP levels are low, so CAP protein is not bound. Result: genes are OFF.', repOnOperator: true, rnaMoving: false, capBound: false, transcriptionLevel: 'OFF' },
  { title: '2. Lactose Present, Glucose Present', description: 'Allolactose (a lactose isomer) acts as an inducer. It binds to the repressor protein and causes a conformational (shape) change — the repressor can no longer bind the operator. RNA Polymerase can now reach the structural genes. However, because glucose is still available, cAMP levels remain low and CAP is not active. Transcription occurs at a LOW basal rate. The cell preferentially uses glucose.', repOnOperator: false, rnaMoving: true, capBound: false, transcriptionLevel: 'LOW' },
  { title: '3. Lactose Present, No Glucose (Full Induction)', description: 'Without glucose, adenylyl cyclase produces cAMP, which binds to the CAP (Catabolite Activator Protein). The cAMP-CAP complex binds upstream of the promoter, bending the DNA and dramatically increasing RNA Polymerase\'s ability to bind and initiate transcription. Combined with the repressor being inactivated by allolactose, this produces MAXIMUM transcription. The cell commits fully to lactose metabolism, producing β-galactosidase (lacZ), permease (lacY), and transacetylase (lacA).', repOnOperator: false, rnaMoving: true, capBound: true, transcriptionLevel: 'MAX' },
];

export default function LacOperon() {
  const [viewMode, setViewMode] = useState<ViewMode>('repressed');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Lac Operon</h2>
          <p className="text-xs text-slate-500">Repression, induction, and catabolite activation</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="yellow" />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'repressed' && <OperonSim initialScenario={0} />}
            {viewMode === 'induced' && <OperonSim initialScenario={1} />}
            {viewMode === 'catabolite' && <OperonSim initialScenario={2} />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Lac Operon Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function OperonSim({ initialScenario = 0 }: { initialScenario?: number }) {
  const [scenario, setScenario] = useState(initialScenario);
  const s = SCENARIOS[scenario];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 520 280" className="w-full max-w-[500px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="520" height="280" fill="#0a0a1a" rx="16" />

          {/* DNA backbone */}
          <rect x="20" y="120" width="480" height="16" fill="#1e3a5f" rx="4" />

          {/* Gene regions */}
          <rect x="20" y="120" width="60" height="16" fill="#6366f1" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1" />
          <text x="50" y="114" fill="#818cf8" fontSize="8" textAnchor="middle" fontWeight="bold">lacI</text>

          {/* CAP binding site */}
          <rect x="90" y="120" width="40" height="16" fill={s.capBound ? '#f59e0b' : '#334155'} fillOpacity="0.3" stroke={s.capBound ? '#f59e0b' : '#475569'} strokeWidth="1" />
          <text x="110" y="114" fill={s.capBound ? '#f59e0b' : '#64748b'} fontSize="7" textAnchor="middle">CAP site</text>

          <rect x="135" y="120" width="55" height="16" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1" />
          <text x="162" y="114" fill="#60a5fa" fontSize="8" textAnchor="middle" fontWeight="bold">Promoter</text>

          <rect x="195" y="120" width="45" height="16" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="217" y="114" fill="#f87171" fontSize="8" textAnchor="middle" fontWeight="bold">Operator</text>

          <rect x="245" y="120" width="80" height="16" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1" />
          <text x="285" y="131" fill="#4ade80" fontSize="8" textAnchor="middle" fontWeight="bold">lacZ</text>

          <rect x="330" y="120" width="70" height="16" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1" />
          <text x="365" y="131" fill="#4ade80" fontSize="8" textAnchor="middle" fontWeight="bold">lacY</text>

          <rect x="405" y="120" width="70" height="16" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1" />
          <text x="440" y="131" fill="#4ade80" fontSize="8" textAnchor="middle" fontWeight="bold">lacA</text>

          {/* Repressor */}
          <motion.g animate={{ x: s.repOnOperator ? 0 : 40, y: s.repOnOperator ? 0 : 70, opacity: 1 }}>
            <rect x="200" y={s.repOnOperator ? 90 : 90} width="36" height="26" fill="#ef4444" rx="6" stroke="#dc2626" strokeWidth="1.5" />
            <text x="218" y="106" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">Rep.</text>
          </motion.g>

          {/* Allolactose binding to repressor */}
          {!s.repOnOperator && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <circle cx="250" cy="175" r="8" fill="#a855f7" />
              <text x="250" y="178" fill="white" fontSize="5" textAnchor="middle">Lac</text>
              <text x="275" y="178" fill="#a855f7" fontSize="7">← allolactose bound</text>
            </motion.g>
          )}

          {/* CAP-cAMP */}
          {s.capBound && (
            <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ellipse cx="110" cy="102" rx="18" ry="14" fill="#f59e0b" opacity="0.8" />
              <text x="110" y="106" fill="black" fontSize="7" textAnchor="middle" fontWeight="bold">CAP</text>
              <text x="110" y="82" fill="#f59e0b" fontSize="7" textAnchor="middle">cAMP-CAP</text>
            </motion.g>
          )}

          {/* RNA Polymerase */}
          <motion.g animate={{ x: s.rnaMoving ? [0, 200] : 0, opacity: 1 }}
            transition={{ duration: s.rnaMoving ? 4 : 0, repeat: s.rnaMoving ? Infinity : 0, ease: 'linear' }}>
            <ellipse cx="155" cy="145" rx="22" ry="14" fill="#eab308" />
            <text x="155" y="149" fill="black" fontSize="7" textAnchor="middle" fontWeight="bold">RNA Pol</text>
          </motion.g>

          {/* mRNA production */}
          {s.rnaMoving && (
            <motion.g animate={{ opacity: [0, 1] }} transition={{ delay: 1, duration: 1 }}>
              <path d="M 280 140 Q 300 155 320 145 Q 340 135 360 150" stroke="#4ade80" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <text x="320" y="165" fill="#4ade80" fontSize="7" textAnchor="middle">mRNA</text>
            </motion.g>
          )}

          {/* Transcription level indicator */}
          <rect x="20" y="220" width="100" height="30" fill={s.transcriptionLevel === 'OFF' ? '#1e293b' : s.transcriptionLevel === 'LOW' ? '#854d0e' : '#166534'} rx="6" />
          <text x="70" y="239" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">{s.transcriptionLevel}</text>
          <text x="70" y="265" fill="#64748b" fontSize="8" textAnchor="middle">Transcription</text>
        </svg>

        {/* Scenario buttons */}
        <div className="flex gap-2">
          {SCENARIOS.map((_, i) => (
            <button key={i} onClick={() => setScenario(i)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${scenario === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              Scenario {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="lg:w-[340px]">
        <AnimatePresence mode="wait">
          <motion.div key={scenario} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">{s.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.description}</p>
            <div className="bg-black/40 rounded-xl p-3 space-y-1 border border-slate-800">
              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Gene Products</h4>
              <p className="text-[11px] text-slate-400"><span className="text-green-400 font-bold">lacZ</span> → β-galactosidase (breaks lactose → glucose + galactose)</p>
              <p className="text-[11px] text-slate-400"><span className="text-green-400 font-bold">lacY</span> → Permease (transports lactose into the cell)</p>
              <p className="text-[11px] text-slate-400"><span className="text-green-400 font-bold">lacA</span> → Transacetylase (detoxification role)</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
