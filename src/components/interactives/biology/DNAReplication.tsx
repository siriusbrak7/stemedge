import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';

type ViewMode = 'initiation' | 'fork' | 'proofreading' | 'quiz';

const TABS = [
  { id: 'initiation' as ViewMode, label: 'Initiation', icon: '📍' },
  { id: 'fork' as ViewMode, label: 'Fork', icon: '🧬' },
  { id: 'proofreading' as ViewMode, label: 'Proofreading', icon: '🔍' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'dr1', question: 'Which enzyme is responsible for unzipping the DNA double helix?', type: 'multiple-choice', options: ['DNA Polymerase III', 'Helicase', 'Ligase', 'Primase'], correctAnswer: 'Helicase', explanation: 'Helicase unwinds the double helix by breaking hydrogen bonds between complementary base pairs at the replication fork.' },
  { id: 'dr2', question: 'Which enzyme builds the new complementary DNA strand?', type: 'multiple-choice', options: ['Helicase', 'DNA Polymerase III', 'RNA Primase', 'Ligase'], correctAnswer: 'DNA Polymerase III', explanation: 'DNA Polymerase III reads the template strand 3\'→5\' and adds complementary nucleotides in the 5\'→3\' direction.' },
  { id: 'dr3', question: 'What are the short fragments on the lagging strand called?', type: 'multiple-choice', options: ['Helicase fragments', 'Klenow fragments', 'Okazaki fragments', 'Sanger fragments'], correctAnswer: 'Okazaki fragments', explanation: 'Because DNA Pol III can only synthesise 5\'→3\', the lagging strand must be built in short discontinuous pieces called Okazaki fragments, later joined by Ligase.' },
  { id: 'dr4', question: 'DNA replication is described as "semi-conservative" because:', type: 'multiple-choice', options: ['Only half the DNA is copied', 'Each daughter molecule has one original and one new strand', 'The process uses half the energy', 'Only one strand is replicated'], correctAnswer: 'Each daughter molecule has one original and one new strand', explanation: 'Meselson-Stahl proved that each new DNA molecule retains one parental (conserved) strand paired with one newly synthesised strand.' },
];

interface StageData {
  title: string;
  description: string;
  enzymes: string[];
}

const STAGES: StageData[] = [
  {
    title: '1. Origin of Replication',
    description: 'Replication begins at specific sequences called origins of replication (oriC in prokaryotes). Initiator proteins recognise and bind to these AT-rich sequences (A-T base pairs have only 2 hydrogen bonds, making them easier to separate). In eukaryotes, there are thousands of origins to replicate the much larger genome quickly.',
    enzymes: ['Initiator proteins'],
  },
  {
    title: '2. Unwinding (Helicase)',
    description: 'Helicase binds to the origin and travels along the DNA, breaking the hydrogen bonds between complementary base pairs to "unzip" the double helix. This creates a Y-shaped structure called the replication fork. Topoisomerase works ahead of helicase to relieve the torsional strain caused by unwinding. Single-Strand Binding (SSB) proteins coat the separated strands to prevent them from re-annealing.',
    enzymes: ['Helicase', 'Topoisomerase', 'SSB Proteins'],
  },
  {
    title: '3. Priming (Primase)',
    description: 'DNA Polymerase III cannot start a new strand from scratch — it can only add nucleotides to an existing 3\'-OH group. RNA Primase solves this by synthesising a short RNA primer (~10 nucleotides) complementary to the template strand. This primer provides the free 3\'-OH that DNA Pol III needs to begin elongation. Both the leading and lagging strands require primers.',
    enzymes: ['RNA Primase'],
  },
  {
    title: '4. Elongation (DNA Polymerase III)',
    description: 'DNA Polymerase III reads the template strand in the 3\'→5\' direction and synthesises the new complementary strand in the 5\'→3\' direction, following base-pairing rules (A-T, G-C). The leading strand is synthesised continuously toward the replication fork. The lagging strand is synthesised discontinuously, in short segments called Okazaki fragments (~1000-2000 bases in prokaryotes), each requiring its own RNA primer. DNA Pol III also has proofreading (3\'→5\' exonuclease) activity, correcting mismatched bases immediately.',
    enzymes: ['DNA Polymerase III', 'Primase (lagging)'],
  },
  {
    title: '5. Primer Removal & Ligation',
    description: 'DNA Polymerase I removes the RNA primers and replaces them with DNA nucleotides. DNA Ligase then seals the remaining nicks (phosphodiester bond gaps) between adjacent Okazaki fragments on the lagging strand, creating a continuous sugar-phosphate backbone. The result is two identical, semi-conservative daughter DNA molecules — each composed of one original parental strand and one newly synthesised strand.',
    enzymes: ['DNA Polymerase I', 'DNA Ligase'],
  },
];

const ENZYME_COLORS: Record<string, string> = {
  'Helicase': '#a855f7',
  'Topoisomerase': '#f59e0b',
  'SSB Proteins': '#06b6d4',
  'RNA Primase': '#ec4899',
  'DNA Polymerase III': '#22c55e',
  'DNA Polymerase I': '#14b8a6',
  'DNA Ligase': '#f97316',
  'Initiator proteins': '#8b5cf6',
  'Primase (lagging)': '#ec4899',
};

export default function DNAReplication() {
  const [viewMode, setViewMode] = useState<ViewMode>('initiation');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">DNA Replication</h2>
          <p className="text-xs text-slate-500">Origins, replication forks, and error correction</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="green" />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'initiation' && <ReplicationFork initialStage={0} />}
            {viewMode === 'fork' && <ReplicationFork initialStage={1} />}
            {viewMode === 'proofreading' && <ProofreadingPanel />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="DNA Replication Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReplicationFork({ initialStage = 0 }: { initialStage?: number }) {
  const [stage, setStage] = useState(initialStage);
  const current = STAGES[stage];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      {/* SVG Diagram */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 500 360" className="w-full max-w-[480px]" xmlns="http://www.w3.org/2000/svg">
          {/* Background gradient for medullary feel */}
          <defs>
            <linearGradient id="dna-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0a1a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="500" height="360" fill="url(#dna-bg)" rx="16" />

          {stage === 0 && <OriginStage />}
          {stage === 1 && <UnwindingStage />}
          {stage === 2 && <PrimingStage />}
          {stage === 3 && <ElongationStage />}
          {stage === 4 && <LigationStage />}
        </svg>

        {/* Stage Navigation */}
        <div className="flex items-center gap-4">
          <button onClick={() => setStage(s => Math.max(0, s - 1))} disabled={stage === 0}
            className={`p-2 rounded-lg transition-all ${stage === 0 ? 'bg-slate-900 text-slate-700' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Progress dots */}
          <div className="flex gap-2">
            {STAGES.map((_, i) => (
              <button key={i} onClick={() => setStage(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === stage ? 'bg-brand-accent scale-125' : i < stage ? 'bg-green-600' : 'bg-slate-700'}`}
              />
            ))}
          </div>

          <button onClick={() => setStage(s => Math.min(STAGES.length - 1, s + 1))} disabled={stage === STAGES.length - 1}
            className={`p-2 rounded-lg transition-all ${stage === STAGES.length - 1 ? 'bg-slate-900 text-slate-700' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">Step {stage + 1} of {STAGES.length}</div>
      </div>

      {/* Description Panel */}
      <div className="lg:w-[360px] flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div key={stage} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5"
          >
            <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">{current.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{current.description}</p>
            <div className="flex flex-wrap gap-2">
              {current.enzymes.map(e => (
                <span key={e} className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                  style={{ color: ENZYME_COLORS[e] || '#94a3b8', borderColor: (ENZYME_COLORS[e] || '#94a3b8') + '40', backgroundColor: (ENZYME_COLORS[e] || '#94a3b8') + '10' }}
                >{e}</span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enzyme Legend */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Key Enzymes</h4>
          {Object.entries(ENZYME_COLORS).filter(([k]) => !k.includes('(')).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-slate-400">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProofreadingPanel() {
  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 520 320" className="w-full rounded-2xl bg-[#07111b]">
          <text x="260" y="38" fill="#86efac" fontSize="15" textAnchor="middle" fontWeight="bold">DNA polymerase checks each new base</text>
          <path d="M 65 150 H 455" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
          <path d="M 65 190 H 455" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          {['A', 'T', 'G', 'C', 'A', 'G', 'T', 'C'].map((base, i) => (
            <g key={i}>
              <text x={90 + i * 45} y="140" fill="#bfdbfe" fontSize="13" textAnchor="middle" fontWeight="bold">{base}</text>
              <text x={90 + i * 45} y="212" fill={i === 5 ? '#f97316' : '#fecaca'} fontSize="13" textAnchor="middle" fontWeight="bold">{i === 5 ? 'T' : ({ A: 'T', T: 'A', G: 'C', C: 'G' } as Record<string, string>)[base]}</text>
              <line x1={90 + i * 45} y1="154" x2={90 + i * 45} y2="184" stroke={i === 5 ? '#f97316' : '#475569'} strokeDasharray="3 3" />
            </g>
          ))}
          <motion.rect x="305" y="103" width="72" height="118" rx="16" fill="#22c55e" opacity="0.25" stroke="#22c55e"
            animate={{ x: [80, 305, 305, 380] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.text x="340" y="88" fill="#22c55e" fontSize="11" textAnchor="middle" fontWeight="bold"
            animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity }}>Mismatch clipped out</motion.text>
          <circle cx="315" cy="208" r="14" fill="#f97316" opacity="0.35" />
        </svg>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
        <h3 className="text-green-300 font-bold text-sm uppercase tracking-widest">Error Control</h3>
        <p className="text-sm text-slate-400 leading-relaxed">DNA polymerase has proofreading activity. If a wrong base is inserted, the enzyme backs up, removes it with exonuclease activity, and resumes synthesis.</p>
        <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Why it matters</p>
          <p className="text-2xl font-mono font-bold text-green-300">low mutation rate</p>
        </div>
      </div>
    </div>
  );
}

/* ── SVG Stage Components ──────────────────────────────────────────────── */

function DoubleHelix({ x, y, width, separated = false, separationPoint = 0.5 }: { x: number; y: number; width: number; separated?: boolean; separationPoint?: number }) {
  const basePairs = Math.floor(width / 20);
  const bases = ['A-T', 'G-C', 'T-A', 'C-G', 'A-T', 'G-C', 'T-A', 'A-T', 'C-G', 'G-C', 'T-A', 'A-T', 'C-G', 'A-T', 'G-C'];
  const bpColors: Record<string, [string, string]> = { 'A': ['#3b82f6', '#ef4444'], 'T': ['#ef4444', '#3b82f6'], 'G': ['#22c55e', '#eab308'], 'C': ['#eab308', '#22c55e'] };

  return (
    <g>
      {Array.from({ length: basePairs }).map((_, i) => {
        const bx = x + i * 20;
        const pairStr = bases[i % bases.length];
        const [left, right] = pairStr.split('-');
        const amp = 20;
        const phase = (i / basePairs) * Math.PI * 3;
        const topY = y + Math.sin(phase) * amp;
        const botY = y - Math.sin(phase) * amp;
        const sepX = x + separationPoint * width;
        const isSep = separated && bx > sepX;

        return (
          <g key={i}>
            {/* Top backbone */}
            <circle cx={bx} cy={isSep ? topY - 30 : topY} r="4" fill={bpColors[left]?.[0] || '#3b82f6'} />
            {/* Bottom backbone */}
            <circle cx={bx} cy={isSep ? botY + 30 : botY} r="4" fill={bpColors[right]?.[0] || '#ef4444'} />
            {/* Hydrogen bond (rung) */}
            {!isSep && <line x1={bx} y1={topY + 4} x2={bx} y2={botY - 4} stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />}
            {/* Base labels */}
            <text x={bx} y={isSep ? topY - 38 : topY - 8} fill={bpColors[left]?.[0] || '#3b82f6'} fontSize="7" textAnchor="middle" fontWeight="bold">{left}</text>
            <text x={bx} y={isSep ? botY + 42 : botY + 12} fill={bpColors[right]?.[0] || '#ef4444'} fontSize="7" textAnchor="middle" fontWeight="bold">{right}</text>
          </g>
        );
      })}
      {/* Backbone lines */}
      <path d={Array.from({ length: basePairs }).map((_, i) => {
        const bx = x + i * 20;
        const phase = (i / basePairs) * Math.PI * 3;
        const topY = (separated && bx > x + separationPoint * width) ? y + Math.sin(phase) * 20 - 30 : y + Math.sin(phase) * 20;
        return `${i === 0 ? 'M' : 'L'} ${bx} ${topY}`;
      }).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />
      <path d={Array.from({ length: basePairs }).map((_, i) => {
        const bx = x + i * 20;
        const phase = (i / basePairs) * Math.PI * 3;
        const botY = (separated && bx > x + separationPoint * width) ? y - Math.sin(phase) * 20 + 30 : y - Math.sin(phase) * 20;
        return `${i === 0 ? 'M' : 'L'} ${bx} ${botY}`;
      }).join(' ')} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" />
    </g>
  );
}

function OriginStage() {
  return (
    <g>
      <DoubleHelix x={40} y={180} width={420} />
      {/* Origin marker */}
      <rect x="200" y="140" width="80" height="80" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" rx="8" />
      <text x="240" y="132" fill="#8b5cf6" fontSize="10" textAnchor="middle" fontWeight="bold">oriC</text>
      <motion.rect x="205" y="145" width="70" height="70" fill="#8b5cf6" fillOpacity="0.08" rx="6"
        animate={{ fillOpacity: [0.05, 0.15, 0.05] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="250" y="320" fill="#64748b" fontSize="10" textAnchor="middle">Initiator proteins bind to the AT-rich origin</text>
    </g>
  );
}

function UnwindingStage() {
  return (
    <g>
      <DoubleHelix x={40} y={180} width={420} separated separationPoint={0.5} />
      {/* Helicase */}
      <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
        <polygon points="250,150 270,180 250,210 230,180" fill="#a855f7" opacity="0.9" />
        <text x="250" y="185" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">Helicase</text>
      </motion.g>
      {/* Topoisomerase */}
      <circle cx="180" cy="180" r="14" fill="#f59e0b" opacity="0.8" />
      <text x="180" y="183" fill="black" fontSize="6" textAnchor="middle" fontWeight="bold">Topo</text>
      {/* SSB */}
      {[290, 320, 350, 380].map(cx => (
        <circle key={cx} cx={cx} cy={150} r="5" fill="#06b6d4" opacity="0.7" />
      ))}
      {[290, 320, 350, 380].map(cx => (
        <circle key={cx + 'b'} cx={cx} cy={210} r="5" fill="#06b6d4" opacity="0.7" />
      ))}
      <text x="360" y="138" fill="#06b6d4" fontSize="7" textAnchor="middle">SSB</text>
      <text x="250" y="320" fill="#64748b" fontSize="10" textAnchor="middle">Helicase unzips • Topoisomerase relieves tension • SSB stabilises</text>
    </g>
  );
}

function PrimingStage() {
  return (
    <g>
      <DoubleHelix x={40} y={180} width={420} separated separationPoint={0.45} />
      {/* Primase on leading strand */}
      <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect x="265" y="130" width="40" height="18" fill="#ec4899" rx="4" />
        <text x="285" y="142" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">Primase</text>
      </motion.g>
      {/* RNA primer (leading) */}
      <rect x="310" y="134" width="30" height="8" fill="#ec4899" fillOpacity="0.4" rx="2" stroke="#ec4899" strokeWidth="1" />
      <text x="325" y="141" fill="#ec4899" fontSize="6" textAnchor="middle">RNA</text>
      {/* Primer on lagging */}
      <rect x="310" y="218" width="25" height="8" fill="#ec4899" fillOpacity="0.4" rx="2" stroke="#ec4899" strokeWidth="1" />
      <text x="322" y="225" fill="#ec4899" fontSize="6" textAnchor="middle">RNA</text>
      <text x="250" y="320" fill="#64748b" fontSize="10" textAnchor="middle">Primase lays short RNA primers for Pol III to extend</text>
    </g>
  );
}

function ElongationStage() {
  return (
    <g>
      <DoubleHelix x={40} y={180} width={420} separated separationPoint={0.4} />
      {/* DNA Pol III on leading strand — continuous */}
      <motion.g animate={{ x: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <rect x="280" y="120" width="50" height="22" fill="#22c55e" rx="6" />
        <text x="305" y="135" fill="black" fontSize="7" textAnchor="middle" fontWeight="bold">Pol III</text>
      </motion.g>
      {/* Direction arrow (leading) */}
      <path d="M 340 131 L 360 131 L 355 126 M 360 131 L 355 136" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      <text x="370" y="125" fill="#22c55e" fontSize="7">5'→3'</text>
      <text x="252" y="112" fill="#4ade80" fontSize="8" fontWeight="bold">Leading (continuous)</text>
      {/* New bases appearing */}
      {[340, 360, 380, 400].map(cx => (
        <motion.circle key={cx} cx={cx} cy={140} r="3.5" fill="#4ade80"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (cx - 340) * 0.15 }} />
      ))}

      {/* Lagging strand — Okazaki fragments */}
      <text x="252" y="256" fill="#f97316" fontSize="8" fontWeight="bold">Lagging (Okazaki fragments)</text>
      {/* Fragment 1 */}
      <rect x="340" y="210" width="50" height="10" fill="#22c55e" fillOpacity="0.3" rx="2" stroke="#22c55e" strokeWidth="1" />
      {/* Fragment 2 */}
      <rect x="400" y="210" width="40" height="10" fill="#22c55e" fillOpacity="0.3" rx="2" stroke="#22c55e" strokeWidth="1" />
      {/* Gap between fragments */}
      <motion.line x1="391" y1="215" x2="399" y2="215" stroke="#f97316" strokeWidth="2" strokeDasharray="2 2"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      {/* Pol III on lagging */}
      <motion.g animate={{ x: [-5, 0, -5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect x="315" y="205" width="40" height="18" fill="#22c55e" rx="4" />
        <text x="335" y="217" fill="black" fontSize="6" textAnchor="middle" fontWeight="bold">Pol III</text>
      </motion.g>
      <path d="M 315 214 L 300 214 L 305 209 M 300 214 L 305 219" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      <text x="288" y="224" fill="#22c55e" fontSize="6">3'←5'</text>

      <text x="250" y="320" fill="#64748b" fontSize="10" textAnchor="middle">Leading: continuous | Lagging: Okazaki fragments (5'→3')</text>
    </g>
  );
}

function LigationStage() {
  return (
    <g>
      <DoubleHelix x={40} y={120} width={420} />
      <text x="250" y="80" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">✓ Daughter Molecule 1</text>

      <DoubleHelix x={40} y={260} width={420} />
      <text x="250" y="310" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">✓ Daughter Molecule 2</text>

      {/* Semi-conservative labels */}
      <text x="250" y="340" fill="#64748b" fontSize="10" textAnchor="middle">Each molecule = 1 original strand + 1 new strand</text>

      {/* Ligase icon */}
      <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <circle cx="430" cy="190" r="16" fill="#f97316" opacity="0.8" />
        <text x="430" y="194" fill="black" fontSize="7" textAnchor="middle" fontWeight="bold">Ligase</text>
      </motion.g>
    </g>
  );
}
