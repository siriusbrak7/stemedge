import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';

type ViewMode = 'meiosis1' | 'meiosis2' | 'variation' | 'quiz';

const TABS = [
  { id: 'meiosis1' as ViewMode, label: 'Meiosis I', icon: '1' },
  { id: 'meiosis2' as ViewMode, label: 'Meiosis II', icon: '2' },
  { id: 'variation' as ViewMode, label: 'Variation', icon: '🔀' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'me1', question: 'In what stage does crossing over occur?', type: 'multiple-choice', options: ['Prophase I', 'Metaphase II', 'Anaphase I', 'Telophase I'], correctAnswer: 'Prophase I', explanation: 'Homologous chromosomes pair up (synapsis) and exchange genetic material during Prophase I.' },
  { id: 'me2', question: 'How many cells result from meiosis?', type: 'multiple-choice', options: ['2 diploid', '4 diploid', '2 haploid', '4 haploid'], correctAnswer: '4 haploid', explanation: 'Two sequential divisions produce 4 genetically unique haploid (n) cells from one diploid (2n) cell.' },
  { id: 'me3', question: 'What separates during Anaphase I?', type: 'multiple-choice', options: ['Sister chromatids', 'Homologous chromosomes', 'Centrioles', 'Nuclear envelope'], correctAnswer: 'Homologous chromosomes', explanation: 'Anaphase I is the reduction division — homologous pairs are pulled apart. Sister chromatids separate later in Anaphase II.' },
  { id: 'me4', question: 'Independent assortment occurs because:', type: 'multiple-choice', options: ['DNA mutates randomly', 'Homologous pairs orient randomly at the metaphase plate', 'Crossing over swaps all genes', 'Cytokinesis is unequal'], correctAnswer: 'Homologous pairs orient randomly at the metaphase plate', explanation: 'Each bivalent can face either pole — with 23 pairs in humans, this gives 2²³ (~8.4 million) possible combinations per gamete.' },
];

interface StageInfo { title: string; description: string; }

const STAGES: StageInfo[] = [
  { title: 'Prophase I — Synapsis & Crossing Over', description: 'Chromosomes condense and become visible. Homologous chromosomes pair up tightly in a process called synapsis, forming bivalents (tetrads of 4 chromatids). Crossing over occurs: non-sister chromatids exchange segments of DNA at points called chiasmata. This recombination shuffles alleles between maternal and paternal chromosomes, generating genetic diversity — the raw material for natural selection. The nuclear envelope begins to break down and spindle fibres form.' },
  { title: 'Metaphase I — Alignment', description: 'Bivalents line up along the metaphase plate (cell equator). Crucially, the orientation of each bivalent is random — the maternal homologue may face either pole. This is independent assortment. With n chromosome pairs, there are 2ⁿ possible arrangements. In humans (n=23), this means over 8 million unique combinations before crossing over is even considered.' },
  { title: 'Anaphase I — Reduction Division', description: 'Spindle fibres shorten and pull homologous chromosomes to opposite poles. Unlike mitosis, sister chromatids remain joined at their centromeres. This is the reduction division: each pole now receives only one chromosome from each homologous pair, halving the chromosome number from diploid (2n) to haploid (n). Some chromatids carry recombinant segments from crossing over.' },
  { title: 'Telophase I & Cytokinesis I', description: 'Chromosomes arrive at opposite poles and may partially decondense. The nuclear envelope may briefly reform. The cell divides by cytokinesis into two haploid daughter cells. Each cell contains one chromosome (consisting of two sister chromatids) from each homologous pair. There is NO DNA replication between Meiosis I and Meiosis II — this is a critical difference from mitosis.' },
  { title: 'Prophase II', description: 'In both haploid cells, chromosomes re-condense. A new spindle apparatus forms. The nuclear envelope breaks down again. This phase is brief because the chromosomes are already in a haploid state. Note: no further crossing over occurs in Meiosis II.' },
  { title: 'Metaphase II', description: 'Individual chromosomes (each still consisting of two sister chromatids joined at the centromere) align along the metaphase plate of each cell. Spindle fibres from opposite poles attach to the two kinetochores of each chromosome. This arrangement is identical to metaphase of mitosis, but in a haploid cell.' },
  { title: 'Anaphase II — Sister Chromatid Separation', description: 'The centromeres finally split. Sister chromatids are pulled to opposite poles by shortening spindle fibres. Each chromatid is now an individual chromosome. If crossing over occurred in Prophase I, some of these chromatids will carry recombinant combinations of alleles that neither parent possessed.' },
  { title: 'Telophase II & Cytokinesis II — Four Gametes', description: 'Chromosomes arrive at the poles and decondense. Nuclear envelopes reform around each set of chromosomes. Both cells divide by cytokinesis, producing a total of four genetically unique haploid cells (gametes). In males, all four become sperm cells. In females, unequal cytokinesis produces one large ovum and three small polar bodies. These gametes are the basis of sexual reproduction and genetic variation.' },
];

export default function Meiosis() {
  const [viewMode, setViewMode] = useState<ViewMode>('meiosis1');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Meiosis</h2>
          <p className="text-xs text-slate-500">Reduction division, chromatid separation, and genetic variation</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="pink" />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'meiosis1' && <MeiosisStages initialStage={0} />}
            {viewMode === 'meiosis2' && <MeiosisStages initialStage={4} />}
            {viewMode === 'variation' && <VariationPanel />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Meiosis Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Chromosome({ x, y, color, scale = 1, crossed = false, crossColor }: { x: number; y: number; color: string; scale?: number; crossed?: boolean; crossColor?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M -4 -20 Q -6 -2 -4 0 Q -6 2 -4 20" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 4 -20 Q 6 -2 4 0 Q 6 2 4 20" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="0" r="3" fill="#475569" />
      {crossed && crossColor && (
        <>
          <path d="M -4 10 Q -6 15 -4 20" stroke={crossColor} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 4 10 Q 6 15 4 20" stroke={crossColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function CellMembrane({ cx, cy, rx, ry, pinch = false }: { cx: number; cy: number; rx: number; ry: number; pinch?: boolean }) {
  if (pinch) {
    return (
      <>
        <ellipse cx={cx - rx * 0.55} cy={cy} rx={rx * 0.45} ry={ry} fill="none" stroke="#334155" strokeWidth="2" />
        <ellipse cx={cx + rx * 0.55} cy={cy} rx={rx * 0.45} ry={ry} fill="none" stroke="#334155" strokeWidth="2" />
      </>
    );
  }
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#334155" strokeWidth="2" />;
}

function MeiosisStages({ initialStage = 0 }: { initialStage?: number }) {
  const [stage, setStage] = useState(initialStage);
  const s = STAGES[stage];
  const isMeiosis2 = stage >= 4;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 480 320" className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="320" fill="#0a0a1a" rx="16" />
          
          {/* Stage 0: Prophase I */}
          {stage === 0 && (
            <g>
              <CellMembrane cx={240} cy={160} rx={180} ry={130} />
              <motion.g animate={{ x: [0, 3, 0], y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Chromosome x={200} y={140} color="#3b82f6" crossed crossColor="#ef4444" />
                <Chromosome x={215} y={140} color="#ef4444" crossed crossColor="#3b82f6" />
              </motion.g>
              <Chromosome x={270} y={160} color="#3b82f6" />
              <Chromosome x={285} y={160} color="#ef4444" />
              <text x={207} y={100} fill="#a855f7" fontSize="8" textAnchor="middle">Chiasma</text>
              <line x1="207" y1="104" x2="207" y2="118" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
              <text x="60" y="30" fill="#3b82f6" fontSize="9">● Maternal</text>
              <text x="60" y="45" fill="#ef4444" fontSize="9">● Paternal</text>
              <text x="240" y="305" fill="#64748b" fontSize="9" textAnchor="middle">2n = 4 (diploid)</text>
            </g>
          )}

          {/* Stage 1: Metaphase I */}
          {stage === 1 && (
            <g>
              <CellMembrane cx={240} cy={160} rx={180} ry={130} />
              <line x1="240" y1="40" x2="240" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <text x="240" y="30" fill="#475569" fontSize="8" textAnchor="middle">Metaphase Plate</text>
              <Chromosome x={225} y={130} color="#3b82f6" crossed crossColor="#ef4444" />
              <Chromosome x={255} y={130} color="#ef4444" crossed crossColor="#3b82f6" />
              <Chromosome x={225} y={190} color="#3b82f6" />
              <Chromosome x={255} y={190} color="#ef4444" />
              <line x1="80" y1="160" x2="130" y2="130" stroke="#94a3b8" strokeWidth="1" />
              <line x1="400" y1="160" x2="350" y2="130" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="80" cy="160" r="6" fill="#334155" />
              <circle cx="400" cy="160" r="6" fill="#334155" />
              <text x="80" y="180" fill="#64748b" fontSize="7" textAnchor="middle">Centriole</text>
              <text x="400" y="180" fill="#64748b" fontSize="7" textAnchor="middle">Centriole</text>
            </g>
          )}

          {/* Stage 2: Anaphase I */}
          {stage === 2 && (
            <g>
              <CellMembrane cx={240} cy={160} rx={180} ry={130} />
              <motion.g animate={{ x: -30 }} transition={{ duration: 1 }}>
                <Chromosome x={170} y={130} color="#3b82f6" crossed crossColor="#ef4444" />
                <Chromosome x={170} y={190} color="#3b82f6" />
              </motion.g>
              <motion.g animate={{ x: 30 }} transition={{ duration: 1 }}>
                <Chromosome x={310} y={130} color="#ef4444" crossed crossColor="#3b82f6" />
                <Chromosome x={310} y={190} color="#ef4444" />
              </motion.g>
              <path d="M 160 130 L 90 160" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 320 130 L 390 160" stroke="#94a3b8" strokeWidth="1" />
            </g>
          )}

          {/* Stage 3: Telophase I */}
          {stage === 3 && (
            <g>
              <CellMembrane cx={240} cy={160} rx={180} ry={130} pinch />
              <Chromosome x={130} y={140} color="#3b82f6" crossed crossColor="#ef4444" scale={0.8} />
              <Chromosome x={130} y={180} color="#3b82f6" scale={0.8} />
              <Chromosome x={350} y={140} color="#ef4444" crossed crossColor="#3b82f6" scale={0.8} />
              <Chromosome x={350} y={180} color="#ef4444" scale={0.8} />
              <text x="130" y="240" fill="#3b82f6" fontSize="8" textAnchor="middle">n = 2</text>
              <text x="350" y="240" fill="#ef4444" fontSize="8" textAnchor="middle">n = 2</text>
            </g>
          )}

          {/* Stage 4: Prophase II */}
          {stage === 4 && (
            <g>
              <CellMembrane cx={140} cy={160} rx={100} ry={110} />
              <CellMembrane cx={340} cy={160} rx={100} ry={110} />
              <Chromosome x={130} y={140} color="#3b82f6" crossed crossColor="#ef4444" scale={0.8} />
              <Chromosome x={150} y={180} color="#3b82f6" scale={0.8} />
              <Chromosome x={330} y={140} color="#ef4444" crossed crossColor="#3b82f6" scale={0.8} />
              <Chromosome x={350} y={180} color="#ef4444" scale={0.8} />
              <text x="240" y="305" fill="#64748b" fontSize="9" textAnchor="middle">Two haploid cells prepare for Meiosis II</text>
            </g>
          )}

          {/* Stage 5: Metaphase II */}
          {stage === 5 && (
            <g>
              <CellMembrane cx={140} cy={160} rx={100} ry={110} />
              <CellMembrane cx={340} cy={160} rx={100} ry={110} />
              <line x1="140" y1="60" x2="140" y2="260" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="340" y1="60" x2="340" y2="260" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <Chromosome x={140} y={130} color="#3b82f6" crossed crossColor="#ef4444" scale={0.7} />
              <Chromosome x={140} y={190} color="#3b82f6" scale={0.7} />
              <Chromosome x={340} y={130} color="#ef4444" crossed crossColor="#3b82f6" scale={0.7} />
              <Chromosome x={340} y={190} color="#ef4444" scale={0.7} />
            </g>
          )}

          {/* Stage 6: Anaphase II */}
          {stage === 6 && (
            <g>
              <CellMembrane cx={140} cy={160} rx={100} ry={110} />
              <CellMembrane cx={340} cy={160} rx={100} ry={110} />
              <motion.g animate={{ x: -15 }}><Chromosome x={110} y={140} color="#3b82f6" scale={0.5} /></motion.g>
              <motion.g animate={{ x: 15 }}><Chromosome x={170} y={140} color="#3b82f6" scale={0.5} /></motion.g>
              <motion.g animate={{ x: -15 }}><Chromosome x={110} y={185} color="#3b82f6" scale={0.5} /></motion.g>
              <motion.g animate={{ x: 15 }}><Chromosome x={170} y={185} color="#ef4444" scale={0.5} /></motion.g>
              <motion.g animate={{ x: -15 }}><Chromosome x={310} y={140} color="#ef4444" scale={0.5} /></motion.g>
              <motion.g animate={{ x: 15 }}><Chromosome x={370} y={140} color="#ef4444" scale={0.5} /></motion.g>
              <motion.g animate={{ x: -15 }}><Chromosome x={310} y={185} color="#ef4444" scale={0.5} /></motion.g>
              <motion.g animate={{ x: 15 }}><Chromosome x={370} y={185} color="#3b82f6" scale={0.5} /></motion.g>
              <text x="240" y="305" fill="#64748b" fontSize="9" textAnchor="middle">Sister chromatids finally separate</text>
            </g>
          )}

          {/* Stage 7: Telophase II — 4 cells */}
          {stage === 7 && (
            <g>
              <ellipse cx={100} cy={110} rx={65} ry={60} fill="none" stroke="#22c55e" strokeWidth="2" />
              <ellipse cx={230} cy={110} rx={65} ry={60} fill="none" stroke="#22c55e" strokeWidth="2" />
              <ellipse cx={100} cy={230} rx={65} ry={60} fill="none" stroke="#22c55e" strokeWidth="2" />
              <ellipse cx={230} cy={230} rx={65} ry={60} fill="none" stroke="#22c55e" strokeWidth="2" />
              <Chromosome x={95} y={105} color="#3b82f6" scale={0.45} />
              <Chromosome x={110} y={115} color="#3b82f6" scale={0.45} />
              <Chromosome x={225} y={105} color="#3b82f6" scale={0.45} />
              <Chromosome x={240} y={115} color="#ef4444" scale={0.45} />
              <Chromosome x={95} y={225} color="#ef4444" scale={0.45} />
              <Chromosome x={110} y={235} color="#ef4444" scale={0.45} />
              <Chromosome x={225} y={225} color="#ef4444" scale={0.45} />
              <Chromosome x={240} y={235} color="#3b82f6" scale={0.45} />
              {[100,230,100,230].map((cx, i) => (
                <text key={i} x={cx} y={[150,150,270,270][i]} fill="#22c55e" fontSize="8" textAnchor="middle">n</text>
              ))}
              <text x="380" y="160" fill="#22c55e" fontSize="12" fontWeight="bold">4 unique</text>
              <text x="380" y="175" fill="#22c55e" fontSize="12" fontWeight="bold">haploid</text>
              <text x="380" y="190" fill="#22c55e" fontSize="12" fontWeight="bold">gametes</text>
              <motion.text x="380" y="210" fill="#4ade80" fontSize="20" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>✓</motion.text>
            </g>
          )}
        </svg>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button onClick={() => setStage(p => Math.max(0, p - 1))} disabled={stage === 0}
            className={`p-2 rounded-lg ${stage === 0 ? 'bg-slate-900 text-slate-700' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {STAGES.map((_, i) => (
              <button key={i} onClick={() => setStage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === stage ? 'bg-brand-accent scale-125' : i < stage ? 'bg-green-600' : 'bg-slate-700'}`} />
            ))}
          </div>
          <button onClick={() => setStage(p => Math.min(7, p + 1))} disabled={stage === 7}
            className={`p-2 rounded-lg ${stage === 7 ? 'bg-slate-900 text-slate-700' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">Stage {stage + 1} / {STAGES.length} {isMeiosis2 ? '(Meiosis II)' : '(Meiosis I)'}</div>
      </div>

      {/* Description */}
      <div className="lg:w-[340px]">
        <AnimatePresence mode="wait">
          <motion.div key={stage} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${isMeiosis2 ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {isMeiosis2 ? 'Meiosis II' : 'Meiosis I'}
              </span>
              <span className="text-[10px] text-slate-600 font-mono">Step {stage + 1}/8</span>
            </div>
            <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">{s.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function VariationPanel() {
  const [pairs, setPairs] = useState(4);
  const combinations = Math.pow(2, pairs);
  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 520 320" className="w-full rounded-2xl bg-[#120914]">
          <text x="260" y="36" fill="#f9a8d4" fontSize="15" textAnchor="middle" fontWeight="bold">Independent assortment creates combinations</text>
          {Array.from({ length: pairs }).map((_, i) => (
            <g key={i} transform={`translate(${90 + i * 80} 150)`}>
              <line x1="0" y1="-70" x2="0" y2="70" stroke="#475569" strokeDasharray="3 4" />
              <motion.g animate={{ rotate: [0, i % 2 ? 180 : -180, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.15 }}>
                <Chromosome x={-15} y={0} color="#3b82f6" scale={0.75} />
                <Chromosome x={15} y={0} color="#ef4444" scale={0.75} />
              </motion.g>
              <text x="0" y="96" fill="#94a3b8" fontSize="10" textAnchor="middle">Pair {i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Chromosome pairs</span>
            <span className="text-pink-300 font-mono">{pairs}</span>
          </div>
          <input type="range" min="1" max="8" value={pairs} onChange={e => setPairs(Number(e.target.value))} className="w-full accent-pink-400" />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Possible gamete combinations</p>
          <p className="text-4xl font-mono font-bold text-pink-300">2^{pairs} = {combinations}</p>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">Crossing over shuffles alleles within chromosomes. Independent assortment then randomly sends maternal or paternal homologues to each gamete.</p>
      </div>
    </div>
  );
}
