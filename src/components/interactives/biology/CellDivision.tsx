import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, GitCompare, Hand, GraduationCap, Globe } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'mitosis' | 'meiosis' | 'chromosomes' | 'quiz';

const MITOSIS_STAGES = [
  { id: 'interphase', name: 'Interphase', desc: 'DNA replicates. Chromatin is uncoiled. Cell grows and prepares for division.', chromosomes: 4, color: '#60a5fa' },
  { id: 'prophase', name: 'Prophase', desc: 'Chromatin condenses into chromosomes. Nuclear membrane begins to break down. Centrioles move to poles.', chromosomes: 4, color: '#a78bfa' },
  { id: 'metaphase', name: 'Metaphase', desc: 'Chromosomes align at the cell equator (metaphase plate). Spindle fibres attach to centromeres.', chromosomes: 4, color: '#f59e0b' },
  { id: 'anaphase', name: 'Anaphase', desc: 'Sister chromatids separate and are pulled to opposite poles by spindle fibres.', chromosomes: 4, color: '#ef4444' },
  { id: 'telophase', name: 'Telophase', desc: 'Nuclear membranes reform around each set of chromosomes. Chromosomes begin to decondense.', chromosomes: 4, color: '#22c55e' },
  { id: 'cytokinesis', name: 'Cytokinesis', desc: 'Cytoplasm divides. In animal cells, a cleavage furrow forms. Two identical daughter cells result.', chromosomes: 4, color: '#06b6d4' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'cd1', question: 'During which phase of mitosis do chromosomes align at the cell equator?', type: 'multiple-choice', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], correctAnswer: 'Metaphase', explanation: 'During metaphase, chromosomes line up at the metaphase plate (cell equator) with spindle fibres attached to centromeres.' },
  { id: 'cd2', question: 'How many daughter cells are produced from one cell undergoing mitosis?', type: 'multiple-choice', options: ['1', '2', '4', '8'], correctAnswer: '2', explanation: 'Mitosis produces 2 genetically identical daughter cells, each with the same chromosome number as the parent.' },
  { id: 'cd3', question: 'Meiosis reduces the chromosome number by:', type: 'multiple-choice', options: ['No change', 'Half', 'One quarter', 'Double'], correctAnswer: 'Half', explanation: 'Meiosis is a reduction division: diploid (2n) cells become haploid (n) — the chromosome number is halved.' },
  { id: 'cd4', question: 'Which stage of mitosis involves the separation of sister chromatids?', type: 'multiple-choice', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], correctAnswer: 'Anaphase', explanation: 'In anaphase, the centromere splits and sister chromatids are pulled to opposite poles by spindle fibres.' },
  { id: 'cd5', question: 'A cell with 2n = 46 undergoes meiosis. Each gamete has:', type: 'multiple-choice', options: ['46 chromosomes', '23 chromosomes', '92 chromosomes', '12 chromosomes'], correctAnswer: '23 chromosomes', explanation: 'Meiosis halves the chromosome number: 2n = 46 → n = 23. Each gamete receives 23 chromosomes.' },
  { id: 'cd6', question: 'Crossing over occurs during which stage of meiosis?', type: 'multiple-choice', options: ['Prophase I', 'Metaphase I', 'Prophase II', 'Anaphase II'], correctAnswer: 'Prophase I', explanation: 'Crossing over (exchange of genetic material between homologous chromosomes) occurs during Prophase I of meiosis.' },
  { id: 'cd7', question: 'Which is NOT a function of mitosis?', type: 'multiple-choice', options: ['Growth', 'Repair of damaged tissue', 'Production of gametes', 'Asexual reproduction'], correctAnswer: 'Production of gametes', explanation: 'Gametes are produced by meiosis, not mitosis. Mitosis is for growth, repair, and asexual reproduction.' },
  { id: 'cd8', question: 'In cytokinesis of plant cells, what structure forms?', type: 'multiple-choice', options: ['Cleavage furrow', 'Cell plate', 'Spindle fibre', 'Aster'], correctAnswer: 'Cell plate', explanation: 'Plant cells form a cell plate from vesicles at the equator, which develops into a new cell wall. Animal cells use a cleavage furrow.' },
];

function MitosisStageCell({ stage, index }: { stage: typeof MITOSIS_STAGES[0]; index: number }) {
  const isSplit = stage.id === 'cytokinesis';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col items-center"
    >
      <svg viewBox="0 0 120 80" width={120} height={80}>
        {isSplit ? (
          <>
            <ellipse cx={30} cy={40} rx={24} ry={32} fill="none" stroke={stage.color} strokeWidth={2} />
            <ellipse cx={90} cy={40} rx={24} ry={32} fill="none" stroke={stage.color} strokeWidth={2} />
            <line x1={55} y1={10} x2={65} y2={70} stroke={stage.color} strokeWidth={1.5} strokeDasharray="3 2" />
          </>
        ) : (
          <ellipse cx={60} cy={40} rx={48} ry={32} fill="none" stroke={stage.color} strokeWidth={2} />
        )}
        {stage.id === 'interphase' && (
          <circle cx={50} cy={35} r={12} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
        )}
        {(stage.id === 'prophase' || stage.id === 'metaphase') && (
          <>
            <line x1={35} y1={30} x2={35} y2={50} stroke={stage.color} strokeWidth={2.5} />
            <line x1={60} y1={30} x2={60} y2={50} stroke={stage.color} strokeWidth={2.5} />
            <line x1={85} y1={30} x2={85} y2={50} stroke={stage.color} strokeWidth={2.5} />
          </>
        )}
        {stage.id === 'metaphase' && (
          <>
            <line x1={10} y1={40} x2={50} y2={40} stroke="#9ca3af" strokeWidth={1} strokeDasharray="2 2" />
            <line x1={70} y1={40} x2={110} y2={40} stroke="#9ca3af" strokeWidth={1} strokeDasharray="2 2" />
          </>
        )}
        {stage.id === 'anaphase' && (
          <>
            <line x1={25} y1={25} x2={25} y2={35} stroke={stage.color} strokeWidth={2} />
            <line x1={25} y1={42} x2={25} y2={52} stroke={stage.color} strokeWidth={2} />
            <line x1={95} y1={25} x2={95} y2={35} stroke={stage.color} strokeWidth={2} />
            <line x1={95} y1={42} x2={95} y2={52} stroke={stage.color} strokeWidth={2} />
            <line x1={10} y1={40} x2={25} y2={30} stroke="#9ca3af" strokeWidth={1} />
            <line x1={10} y1={40} x2={25} y2={47} stroke="#9ca3af" strokeWidth={1} />
            <line x1={110} y1={40} x2={95} y2={30} stroke="#9ca3af" strokeWidth={1} />
            <line x1={110} y1={40} x2={95} y2={47} stroke="#9ca3af" strokeWidth={1} />
          </>
        )}
        {stage.id === 'telophase' && (
          <>
            <circle cx={30} cy={35} r={10} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
            <circle cx={90} cy={35} r={10} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
          </>
        )}
      </svg>
      <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: stage.color }}>{stage.name}</div>
    </motion.div>
  );
}

function MitosisWalkthrough() {
  const [stage, setStage] = useState(0);
  const current = MITOSIS_STAGES[stage];
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {MITOSIS_STAGES.map((s, i) => (
          <button key={s.id} onClick={() => setStage(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${stage === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >{s.name}</button>
        ))}
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <MitosisStageCell stage={current} index={0} />
          <div>
            <h3 className="text-xl font-bold text-white">{current.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{current.desc}</p>
          </div>
        </div>
        <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Chromosome count: </span>
          <span className="font-mono text-brand-accent font-bold">2n = {current.chromosomes * 2}</span>
          <span className="text-slate-600 mx-3">|</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Type: </span>
          <span className="font-mono text-green-400 font-bold">Mitosis (equational)</span>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {MITOSIS_STAGES.map((s, i) => (
          <div key={s.id}>
            <MitosisStageCell stage={s} index={i} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => setStage(s => Math.max(0, s - 1))} disabled={stage === 0}
          className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold disabled:opacity-30 hover:text-white transition-all"
        >Previous</button>
        <button onClick={() => setStage(s => Math.min(MITOSIS_STAGES.length - 1, s + 1))} disabled={stage === MITOSIS_STAGES.length - 1}
          className="px-4 py-2 bg-brand-accent text-black rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-white transition-all"
        >Next Stage</button>
      </div>
    </div>
  );
}

function MeiosisComparison() {
  const [highlightDiff, setHighlightDiff] = useState(false);
  const comparison = [
    { feature: 'Divisions', mitosis: '1 division', meiosis: '2 divisions', diff: true },
    { feature: 'Daughter cells', mitosis: '2 diploid (2n)', meiosis: '4 haploid (n)', diff: true },
    { feature: 'Genetic variation', mitosis: 'No variation (clones)', meiosis: 'Crossing over + independent assortment', diff: true },
    { feature: 'DNA replication', mitosis: 'Once (before prophase)', meiosis: 'Once (before Meiosis I only)', diff: false },
    { feature: 'Homologous pairing', mitosis: 'Does not occur', meiosis: 'Synapsis in Prophase I', diff: true },
    { feature: 'Function', mitosis: 'Growth, repair, asexual reproduction', meiosis: 'Gamete production, sexual reproduction', diff: true },
    { feature: 'Chromosome number', mitosis: 'Maintained (2n → 2n)', meiosis: 'Halved (2n → n)', diff: true },
    { feature: 'Occurrence', mitosis: 'Somatic (body) cells', meiosis: 'Germ cells only', diff: false },
  ];
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex justify-end">
        <button onClick={() => setHighlightDiff(!highlightDiff)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${highlightDiff ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >Highlight Differences</button>
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border overflow-hidden">
        <div className="grid grid-cols-3 gap-0 text-xs font-bold uppercase tracking-widest text-slate-500 p-4 border-b border-slate-800">
          <div>Feature</div>
          <div className="text-center text-cyan-400">Mitosis</div>
          <div className="text-center text-purple-400">Meiosis</div>
        </div>
        {comparison.map((row, i) => (
          <motion.div key={row.feature} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={`grid grid-cols-3 gap-0 p-4 text-sm border-b border-slate-800/50 ${highlightDiff && row.diff ? 'bg-yellow-500/5' : ''}`}
          >
            <div className="text-slate-400 font-medium">{row.feature}</div>
            <div className="text-center text-cyan-300 font-mono text-xs">{row.mitosis}</div>
            <div className={`text-center font-mono text-xs ${highlightDiff && row.diff ? 'text-yellow-300' : 'text-purple-300'}`}>{row.meiosis}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Mitosis SVG</h3>
          <svg viewBox="0 0 200 80" width={200} height={80}>
            <ellipse cx={55} cy={40} rx={40} ry={28} fill="none" stroke="#22d3ee" strokeWidth={2} />
            <line x1={40} y1={30} x2={40} y2={50} stroke="#22d3ee" strokeWidth={2} />
            <line x1={55} y1={30} x2={55} y2={50} stroke="#22d3ee" strokeWidth={2} />
            <line x1={70} y1={30} x2={70} y2={50} stroke="#22d3ee" strokeWidth={2} />
            <text x={55} y={75} textAnchor="middle" fontSize="8" fill="#22d3ee">2n → 2n</text>
          </svg>
        </div>
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Meiosis SVG</h3>
          <svg viewBox="0 0 200 80" width={200} height={80}>
            <ellipse cx={55} cy={40} rx={40} ry={28} fill="none" stroke="#a78bfa" strokeWidth={2} />
            <line x1={45} y1={33} x2={50} y2={47} stroke="#a78bfa" strokeWidth={2} />
            <line x1={65} y1={33} x2={60} y2={47} stroke="#a78bfa" strokeWidth={2} />
            <text x={55} y={75} textAnchor="middle" fontSize="8" fill="#a78bfa">2n → n</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChromosomeCounting() {
  const [diploid, setDiploid] = useState(4);
  const [dragging, setDragging] = useState<number | null>(null);
  const [target, setTarget] = useState<{ haploid: number; expected: number }>({ haploid: 0, expected: 0 });
  const [score, setScore] = useState(0);

  const generateTarget = useCallback(() => {
    const d = (Math.floor(Math.random() * 6) + 2) * 2;
    setDiploid(d);
    setTarget({ haploid: 0, expected: d / 2 });
  }, []);

  useEffect(() => { generateTarget(); }, [generateTarget]);

  const handleDrop = (value: number) => {
    if (value === target.expected) {
      setScore(s => s + 1);
    }
    setTarget(t => ({ ...t, haploid: value }));
    setTimeout(generateTarget, 1500);
  };

  const options = [diploid / 2 - 1, diploid / 2, diploid / 2 + 1].filter(v => v > 0);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6 text-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Diploid Number (2n)</div>
        <div className="text-5xl font-mono font-black text-brand-accent">{diploid}</div>
        <div className="text-slate-400 text-sm mt-2">Drag the correct haploid number (n)</div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-slate-500 text-sm">2n = {diploid}</span>
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-brand-accent text-xl">→</motion.div>
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center text-xl font-mono font-bold text-slate-400">
          {target.haploid || '?'}
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {options.map(opt => (
          <motion.button key={opt} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleDrop(opt)}
            onPointerDown={() => setDragging(opt)}
            onPointerUp={() => setDragging(null)}
            className={`w-16 h-16 rounded-xl font-mono font-bold text-xl transition-all ${dragging === opt ? 'bg-brand-accent text-black scale-110' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'}`}
          >{opt}</motion.button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-yellow-400 font-mono font-bold">Score: {score}</span>
        <button onClick={generateTarget} className="ml-4 px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:text-white transition-all">New Question</button>
      </div>
      {target.haploid > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`p-3 rounded-xl text-center text-sm font-bold ${target.haploid === target.expected ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}
        >
          {target.haploid === target.expected ? 'Correct! n = ' + target.expected : `Incorrect. n = ${target.expected}`}
        </motion.div>
      )}
    </div>
  );
}

export default function CellDivision() {
  const [viewMode, setViewMode] = useState<ViewMode>('mitosis');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'mitosis', label: 'Mitosis', icon: <Eye size={14} /> },
    { key: 'meiosis', label: 'Meiosis', icon: <GitCompare size={14} /> },
    { key: 'chromosomes', label: 'Chromosomes', icon: <Hand size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{icon} {label}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'mitosis' && <MitosisWalkthrough />}
            {viewMode === 'meiosis' && <MeiosisComparison />}
            {viewMode === 'chromosomes' && <ChromosomeCounting />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Cell Division Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · </span>
Mitosis produces 2 identical diploid daughter cells. Meiosis produces 4 genetically different haploid gametes. Know the stages and their key events for WASSCE.
      </div>
    </div>
  );
}
