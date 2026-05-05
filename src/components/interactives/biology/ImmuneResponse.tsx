import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';

type ViewMode = 'innate' | 'adaptive' | 'memory' | 'quiz';

const TABS = [
  { id: 'innate' as ViewMode, label: 'Innate', icon: '🛡️' },
  { id: 'adaptive' as ViewMode, label: 'Adaptive', icon: '🧬' },
  { id: 'memory' as ViewMode, label: 'Memory', icon: '💉' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'ir1', question: 'Which cell engulfs pathogens via phagocytosis?', type: 'multiple-choice', options: ['B-Cell', 'Macrophage', 'T-Helper', 'RBC'], correctAnswer: 'Macrophage', explanation: 'Macrophages are phagocytes — they engulf, digest, and present antigens from pathogens.' },
  { id: 'ir2', question: 'Which cell produces antibodies?', type: 'multiple-choice', options: ['Macrophage', 'Cytotoxic T-Cell', 'Plasma B-Cell', 'Neutrophil'], correctAnswer: 'Plasma B-Cell', explanation: 'Activated B-cells differentiate into plasma cells that mass-produce specific antibodies.' },
  { id: 'ir3', question: 'Memory cells provide:', type: 'multiple-choice', options: ['Innate immunity', 'Long-term specific immunity', 'Inflammation', 'Fever'], correctAnswer: 'Long-term specific immunity', explanation: 'Memory B and T cells persist for years. On re-exposure, they mount a faster, stronger secondary response — the basis of vaccination.' },
];

const STEPS = [
  { title: '1. Pathogen Entry', desc: 'A pathogen (bacterium, virus, etc.) breaches the body\'s first line of defence — physical barriers like skin, mucous membranes, and stomach acid. Each pathogen has unique molecules on its surface called antigens. These antigens are like molecular "fingerprints" that the immune system can recognise as non-self. The innate immune system is immediately activated.' },
  { title: '2. Innate Response — Phagocytosis', desc: 'Macrophages (and neutrophils) are phagocytes that patrol tissues. They recognise pathogen-associated molecular patterns (PAMPs) and engulf the pathogen into a phagosome. Lysosomes fuse with the phagosome, releasing digestive enzymes that break down the pathogen. Crucially, the macrophage then displays fragments of the pathogen\'s antigens on its surface using MHC class II molecules — it becomes an antigen-presenting cell (APC). This bridges innate and adaptive immunity.' },
  { title: '3. T-Helper Cell Activation', desc: 'A T-Helper cell (CD4+) with a receptor that matches the presented antigen-MHC II complex binds to the APC. This activates the T-Helper cell, which begins to proliferate (clonal expansion) and release cytokines — chemical messengers that coordinate the broader immune response. Cytokines activate B-cells, Cytotoxic T-cells, and recruit more immune cells to the site. T-Helper cells are sometimes called the "conductors of the immune orchestra."' },
  { title: '4. B-Cell Activation & Antibodies', desc: 'B-cells that have surface antibodies matching the pathogen\'s antigen are activated (with T-Helper cell cytokine support). They undergo clonal expansion and differentiate into: (1) Plasma cells — antibody factories that secrete thousands of Y-shaped antibodies per second, and (2) Memory B-cells — long-lived cells that "remember" the antigen for future encounters. Each antibody has a variable region that binds specifically to one antigen (lock-and-key specificity).' },
  { title: '5. Antibody Action & Immune Memory', desc: 'Antibodies neutralise pathogens by: agglutination (clumping pathogens together), opsonisation (coating them for easier phagocytosis), and blocking viral attachment to host cells. The complement system is also activated, punching holes in pathogen membranes. After the infection is cleared, most effector cells die, but memory B-cells and memory T-cells persist. On second exposure, the secondary immune response is faster (1-2 days vs 7-10 days) and produces far more antibodies — this is why you rarely get the same disease twice, and why vaccines work.' },
];

export default function ImmuneResponse() {
  const [viewMode, setViewMode] = useState<ViewMode>('innate');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Immune Response</h2>
          <p className="text-xs text-slate-500">Innate defense, adaptive specificity, and vaccine memory</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="purple" />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'innate' && <ImmuneSim initialStep={0} />}
            {viewMode === 'adaptive' && <ImmuneSim initialStep={2} />}
            {viewMode === 'memory' && <ImmuneSim initialStep={4} />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Immune Response Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ImmuneSim({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 480 320" className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="320" fill="#0a0a1a" rx="16" />

          {/* Step 0: Pathogen entry */}
          {step === 0 && (
            <g>
              {/* Skin barrier */}
              <rect x="0" y="30" width="480" height="12" fill="#92400e" opacity="0.4" rx="2" />
              <text x="240" y="25" fill="#b45309" fontSize="8" textAnchor="middle">Skin / Mucous Membrane (1st Line)</text>
              {/* Breach */}
              <rect x="220" y="30" width="40" height="12" fill="#0a0a1a" />
              <text x="240" y="60" fill="#ef4444" fontSize="7" textAnchor="middle">Breach!</text>
              {/* Pathogen */}
              <motion.g animate={{ y: [0, 60] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}>
                <circle cx="240" cy="80" r="18" fill="#22c55e" opacity="0.7" />
                {/* Antigen spikes */}
                {[0,45,90,135,180,225,270,315].map(a => (
                  <line key={a} x1={240 + Math.cos(a*Math.PI/180)*18} y1={80 + Math.sin(a*Math.PI/180)*18}
                    x2={240 + Math.cos(a*Math.PI/180)*25} y2={80 + Math.sin(a*Math.PI/180)*25}
                    stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                ))}
                <text x="240" y="84" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">Pathogen</text>
              </motion.g>
              <text x="280" y="110" fill="#4ade80" fontSize="7">← Antigens</text>
              <text x="240" y="280" fill="#64748b" fontSize="9" textAnchor="middle">Unique surface antigens identify each pathogen</text>
            </g>
          )}

          {/* Step 1: Phagocytosis */}
          {step === 1 && (
            <g>
              {/* Macrophage */}
              <motion.g animate={{ x: [0, 30, 30] }} transition={{ duration: 2 }}>
                <path d="M 120 160 Q 90 130 110 100 Q 140 80 170 100 Q 200 80 210 110 Q 230 140 200 170 Q 190 200 160 200 Q 120 190 120 160" fill="#a855f7" opacity="0.6" stroke="#a855f7" strokeWidth="1.5" />
                <text x="160" y="150" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Macrophage</text>
              </motion.g>
              {/* Pathogen being engulfed */}
              <motion.g animate={{ x: [0, -40], opacity: [1, 0] }} transition={{ duration: 2, delay: 0.5 }}>
                <circle cx="280" cy="150" r="14" fill="#22c55e" opacity="0.7" />
                <text x="280" y="154" fill="white" fontSize="7" textAnchor="middle">🦠</text>
              </motion.g>
              {/* Antigen presentation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <rect x="155" y="195" width="30" height="12" fill="#c084fc" rx="3" />
                <text x="170" y="203" fill="white" fontSize="5" textAnchor="middle">MHC II</text>
                <text x="170" y="220" fill="#c084fc" fontSize="7" textAnchor="middle">Antigen presented</text>
              </motion.g>
              <text x="240" y="280" fill="#64748b" fontSize="9" textAnchor="middle">Macrophage becomes an antigen-presenting cell (APC)</text>
            </g>
          )}

          {/* Step 2: T-Helper activation */}
          {step === 2 && (
            <g>
              {/* APC (macrophage with MHC) */}
              <ellipse cx="160" cy="150" rx="45" ry="40" fill="#a855f7" opacity="0.4" stroke="#a855f7" strokeWidth="1.5" />
              <text x="160" y="145" fill="white" fontSize="8" textAnchor="middle">APC</text>
              <rect x="195" y="140" width="25" height="10" fill="#c084fc" rx="2" />
              <text x="207" y="148" fill="white" fontSize="5" textAnchor="middle">Ag</text>

              {/* T-Helper */}
              <motion.g animate={{ x: [-30, 0] }} transition={{ duration: 1.5 }}>
                <circle cx="280" cy="150" r="30" fill="#3b82f6" opacity="0.5" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="280" y="148" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">T-Helper</text>
                <text x="280" y="160" fill="#93c5fd" fontSize="6" textAnchor="middle">(CD4+)</text>
                <rect x="248" y="143" width="8" height="10" fill="#60a5fa" rx="1" />
              </motion.g>

              {/* Cytokines */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {[{x:320,y:120},{x:330,y:170},{x:340,y:140}].map((p,i) => (
                  <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="#fbbf24" animate={{ x: [0, 30], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                ))}
                <text x="370" y="145" fill="#fbbf24" fontSize="7">Cytokines →</text>
              </motion.g>
              <text x="240" y="280" fill="#64748b" fontSize="9" textAnchor="middle">T-Helper cells release cytokines to coordinate the response</text>
            </g>
          )}

          {/* Step 3: B-Cell activation */}
          {step === 3 && (
            <g>
              {/* B-Cell */}
              <circle cx="150" cy="130" r="35" fill="#3b82f6" opacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="150" y="128" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">B-Cell</text>
              <text x="150" y="142" fill="#93c5fd" fontSize="7" textAnchor="middle">activated</text>

              {/* Arrow to Plasma cell */}
              <path d="M 190 120 L 250 100" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
              {/* Plasma cell */}
              <circle cx="290" cy="85" r="28" fill="#6366f1" opacity="0.5" stroke="#6366f1" strokeWidth="1.5" />
              <text x="290" y="83" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Plasma</text>
              <text x="290" y="95" fill="#a5b4fc" fontSize="7" textAnchor="middle">Cell</text>

              {/* Antibodies */}
              {[{x:340,y:70},{x:350,y:95},{x:360,y:80},{x:370,y:100}].map((p,i) => (
                <motion.g key={i} animate={{ x: [0, 40], opacity: [1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}>
                  <text x={p.x} y={p.y} fill="#818cf8" fontSize="16" fontWeight="bold">Y</text>
                </motion.g>
              ))}
              <text x="420" y="90" fill="#818cf8" fontSize="8">Antibodies</text>

              {/* Arrow to Memory cell */}
              <path d="M 190 150 L 250 180" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
              <circle cx="290" cy="200" r="25" fill="#22c55e" opacity="0.3" stroke="#22c55e" strokeWidth="1.5" />
              <text x="290" y="198" fill="#4ade80" fontSize="7" textAnchor="middle" fontWeight="bold">Memory</text>
              <text x="290" y="210" fill="#4ade80" fontSize="7" textAnchor="middle">B-Cell</text>
              <text x="350" y="210" fill="#22c55e" fontSize="7">Long-lived!</text>

              <text x="240" y="280" fill="#64748b" fontSize="9" textAnchor="middle">Plasma cells produce antibodies; Memory cells persist for years</text>
            </g>
          )}

          {/* Step 4: Cleanup */}
          {step === 4 && (
            <g>
              {/* Pathogen with antibodies bound */}
              <circle cx="200" cy="140" r="20" fill="#22c55e" opacity="0.5" />
              <text x="200" y="144" fill="white" fontSize="7" textAnchor="middle">🦠</text>
              {[0,60,120,180,240,300].map(a => (
                <text key={a} x={200 + Math.cos(a*Math.PI/180)*28} y={140 + Math.sin(a*Math.PI/180)*28 + 5} fill="#818cf8" fontSize="12" textAnchor="middle">Y</text>
              ))}
              <text x="200" y="185" fill="#818cf8" fontSize="7" textAnchor="middle">Opsonised</text>

              {/* Second exposure graph */}
              <g transform="translate(280, 80)">
                <rect width="160" height="120" fill="#0f172a" rx="8" stroke="#1e293b" strokeWidth="1" />
                <text x="80" y="15" fill="#94a3b8" fontSize="8" textAnchor="middle">Antibody Response</text>
                {/* Primary */}
                <path d="M 20 100 Q 40 100 50 80 Q 60 60 70 70 L 80 80" stroke="#64748b" strokeWidth="1.5" fill="none" />
                <text x="50" y="115" fill="#64748b" fontSize="6" textAnchor="middle">1st</text>
                {/* Secondary */}
                <path d="M 90 100 Q 100 90 105 40 Q 110 20 120 25 L 140 35" stroke="#22c55e" strokeWidth="2" fill="none" />
                <text x="115" y="115" fill="#22c55e" fontSize="6" textAnchor="middle">2nd</text>
                <text x="80" y="108" fill="#475569" fontSize="6" textAnchor="middle">Time →</text>
              </g>
              <text x="240" y="280" fill="#64748b" fontSize="9" textAnchor="middle">Secondary response is faster and stronger — basis of vaccination</text>
            </g>
          )}
        </svg>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0} className={`p-2 rounded-lg ${step===0?'bg-slate-900 text-slate-700':'bg-slate-800 text-white hover:bg-slate-700'}`}><ChevronLeft size={16}/></button>
          {STEPS.map((_,i) => <button key={i} onClick={() => setStep(i)} className={`w-2.5 h-2.5 rounded-full ${i===step?'bg-brand-accent scale-125':i<step?'bg-green-600':'bg-slate-700'}`}/>)}
          <button onClick={() => setStep(s => Math.min(4, s+1))} disabled={step===4} className={`p-2 rounded-lg ${step===4?'bg-slate-900 text-slate-700':'bg-slate-800 text-white hover:bg-slate-700'}`}><ChevronRight size={16}/></button>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">Step {step+1}/5</div>
      </div>

      <div className="lg:w-[340px]">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${step < 2 ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {step < 2 ? 'Innate' : 'Adaptive'}
              </span>
            </div>
            <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">{STEPS[step].title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{STEPS[step].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
