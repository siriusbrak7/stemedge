/**
 * CentralDogma.tsx
 * Biology interactive: From DNA to Protein — The Central Dogma
 * Curriculum: GES Elective Biology Unit 3, Cambridge A-Level 9700 Topic 6.1, IB DP Topic 2.7
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, Dna, FlaskConical, AlertTriangle, Target,
  Play, RotateCcw, ChevronRight, GraduationCap
} from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'transcription' | 'translation' | 'mutation' | 'quiz';
type MutationType = 'substitution' | 'insertion' | 'deletion';

// ─── Genetic code (partial — enough for demos) ────────────────────────────────

const CODON_TABLE: Record<string, string> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'Stop', UAG: 'Stop',
  UGU: 'Cys', UGC: 'Cys', UGA: 'Stop', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met*',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};

type DNABase = 'A' | 'T' | 'G' | 'C';
type RNABase = 'A' | 'U' | 'G' | 'C';

function dnaToMRNA(template: DNABase[]): RNABase[] {
  const map: Record<DNABase, RNABase> = { A: 'U', T: 'A', G: 'C', C: 'G' };
  return template.map(b => map[b]);
}

function mRNAToCodons(mRNA: RNABase[]): string[] {
  const codons: string[] = [];
  for (let i = 0; i < mRNA.length - 2; i += 3) {
    codons.push(mRNA.slice(i, i + 3).join(''));
  }
  return codons;
}

function codonsToAA(codons: string[]): string[] {
  return codons.map(c => CODON_TABLE[c] || '?');
}

// ─── Preset strands ────────────────────────────────────────────────────────────

const PRESET_STRANDS: { name: string; template: DNABase[] }[] = [
  { name: 'Haemoglobin', template: ['A','T','G','G','A','A','G','G','A','G','T','T'] },
  { name: 'Insulin', template: ['A','T','G','G','C','T','C','A','C','G','C','T'] },
  { name: 'Custom', template: ['T','A','C','G','G','A','A','T','G','C','T','A'] },
];

// ─── Mutation data ─────────────────────────────────────────────────────────────

type MutationClass = 'silent' | 'missense' | 'nonsense' | 'frameshift';

function classifyMutation(originalAA: string[], mutantAA: string[]): MutationClass {
  const firstDiff = originalAA.findIndex((a, i) => a !== mutantAA[i]);
  if (firstDiff === -1) return 'silent';
  if (mutantAA[firstDiff] === 'Stop') return 'nonsense';
  if (originalAA.length !== mutantAA.length) return 'frameshift';
  return 'missense';
}

// ─── Quiz questions ────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'cq1', question: 'RNA polymerase reads the DNA template strand in which direction?', type: 'multiple-choice', options: ["5'→3'", "3'→5'", 'Both directions', 'Neither direction'], correctAnswer: "3'→5'", explanation: "RNA polymerase reads the template strand 3'→5' while building the mRNA 5'→3'." },
  { id: 'cq2', question: 'Which base in mRNA replaces Thymine (T) from DNA?', type: 'multiple-choice', options: ['Adenine', 'Uracil', 'Cytosine', 'Guanine'], correctAnswer: 'Uracil', explanation: 'RNA uses Uracil (U) instead of Thymine (T). A in DNA pairs with U in RNA.' },
  { id: 'cq3', question: 'Where does translation occur?', type: 'multiple-choice', options: ['Nucleus', 'Mitochondria', 'Ribosome (cytoplasm)', 'Golgi apparatus'], correctAnswer: 'Ribosome (cytoplasm)', explanation: 'Translation occurs at ribosomes. They can be free in the cytoplasm or attached to the rough ER.' },
  { id: 'cq4', question: 'The genetic code is described as "degenerate" because:', type: 'multiple-choice', options: ['It breaks down over time', 'Multiple codons can code for the same amino acid', 'All organisms use different codes', 'Some codons have no function'], correctAnswer: 'Multiple codons can code for the same amino acid', explanation: 'Degeneracy (redundancy) means many amino acids have 2–6 different codons. This reduces the impact of silent mutations.' },
  { id: 'cq5', question: 'A mutation that inserts one extra base into a gene causes:', type: 'multiple-choice', options: ['A silent mutation', 'A missense mutation', 'A frameshift mutation', 'No change'], correctAnswer: 'A frameshift mutation', explanation: 'An insertion shifts the reading frame for all downstream codons, potentially changing many amino acids — the most severe type.' },
];

// ─── Base colors ───────────────────────────────────────────────────────────────

const DNA_COLORS: Record<string, string> = {
  A: '#f87171', T: '#60a5fa', G: '#4ade80', C: '#fbbf24',
};
const RNA_COLORS: Record<string, string> = {
  A: '#fb923c', U: '#818cf8', G: '#34d399', C: '#fde68a',
};
const AA_COLORS = ['#22d3ee', '#c084fc', '#f97316', '#4ade80', '#f87171', '#fbbf24', '#38bdf8'];

// ─── Main component ────────────────────────────────────────────────────────────

export default function CentralDogma() {
  const [viewMode, setViewMode] = useState<ViewMode>('transcription');

  const MODES = [
    { key: 'transcription' as ViewMode, label: 'Transcription', icon: <Dna size={14} /> },
    { key: 'translation' as ViewMode, label: 'Translation', icon: <FlaskConical size={14} /> },
    { key: 'mutation' as ViewMode, label: 'Mutations', icon: <AlertTriangle size={14} /> },
    { key: 'quiz' as ViewMode, label: 'Quiz', icon: <Target size={14} /> },
  ];

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)} aria-label={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'transcription' && <TranscriptionMode />}
            {viewMode === 'translation' && <TranslationMode />}
            {viewMode === 'mutation' && <MutationMode />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Central Dogma Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · Cambridge A-Level · IB DP · </span>
        WAEC commonly tests: (1) where transcription and translation occur, (2) writing complementary mRNA from a DNA template,
        (3) using the codon table to find amino acid sequences. Cambridge/IB additionally tests mutation types and their effects.
      </div>
    </div>
  );
}

// ─── Transcription Mode ────────────────────────────────────────────────────────

function TranscriptionMode() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hoveredBase, setHoveredBase] = useState<{ base: string; rule: string } | null>(null);

  const strand = PRESET_STRANDS[selectedPreset].template;
  const mRNA = dnaToMRNA(strand);
  const builtBases = mRNA.slice(0, Math.round(progress * mRNA.length));

  const animRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const pausedAt = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animRef.current);
      pausedAt.current = progress;
      return;
    }
    startTime.current = performance.now() - pausedAt.current * (4000 / speed);
    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const p = Math.min(1, elapsed / (4000 / speed));
      setProgress(p);
      if (p < 1) animRef.current = requestAnimationFrame(animate);
      else setIsPlaying(false);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, speed]);

  const reset = () => { setProgress(0); pausedAt.current = 0; setIsPlaying(false); };

  const polymeraseX = Math.round(progress * strand.length);

  const CODING_STRAND = strand.map(b => ({ A: 'T', T: 'A', G: 'C', C: 'G' } as Record<DNABase,DNABase>)[b] || b);

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Preset selector */}
      <div className="flex gap-2 flex-wrap items-center">
        {PRESET_STRANDS.map((p, i) => (
          <button key={i} onClick={() => { setSelectedPreset(i); reset(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedPreset === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {p.name}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <label className="text-[10px] text-slate-400 uppercase tracking-widest">Speed</label>
          <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={e => setSpeed(Number(e.target.value))}
            className="w-20 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" aria-label="Speed" />
          <span className="text-brand-accent font-mono text-xs">{speed}x</span>
        </div>
      </div>

      {/* Central Dogma flow banner */}
      <div className="flex items-center justify-center gap-3 text-sm">
        {['DNA', '→ mRNA', '→ Protein'].map((step, i) => (
          <div key={i} className={`px-4 py-2 rounded-lg font-bold ${
            i === 0 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            i === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>{step}</div>
        ))}
      </div>

      {/* DNA strands visualiser */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5 overflow-x-auto">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
          <span className="text-blue-400">Coding strand (5'→3')</span> · <span className="text-slate-400">Template strand (3'→5')</span>
        </div>
        <div className="space-y-2 min-w-[400px]">
          {/* Coding strand */}
          <div className="flex gap-1 items-center">
            <span className="text-[9px] text-blue-400 w-16 text-right mr-1">5'→3'</span>
            {CODING_STRAND.map((b, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setHoveredBase({ base: b, rule: `Coding strand: ${b}` })}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black cursor-pointer hover:scale-110 transition-transform text-black"
                style={{ backgroundColor: DNA_COLORS[b] ?? '#666' }}
              >
                {b}
              </motion.div>
            ))}
          </div>

          {/* Bonds */}
          <div className="flex gap-1 items-center">
            <span className="w-16 mr-1" />
            {strand.map((_, i) => (
              <div key={i} className="w-9 flex justify-center">
                <div className="w-px h-4 bg-slate-600" />
              </div>
            ))}
          </div>

          {/* Template strand */}
          <div className="flex gap-1 items-center">
            <span className="text-[9px] text-slate-400 w-16 text-right mr-1">3'→5'</span>
            {strand.map((b, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black text-black opacity-70"
                style={{ backgroundColor: DNA_COLORS[b] ?? '#666' }}
              >
                {b}
              </motion.div>
            ))}
          </div>

          {/* RNA Polymerase indicator */}
          <div className="flex gap-1 items-center">
            <span className="w-16 mr-1" />
            {strand.map((_, i) => (
              <div key={i} className="w-9 flex justify-center">
                {i === polymeraseX && polymeraseX < strand.length && (
                  <motion.div
                    layoutId="polymerase"
                    className="text-xs text-brand-accent font-bold"
                    title="RNA Polymerase"
                  >↓</motion.div>
                )}
              </div>
            ))}
          </div>

          {/* mRNA being built */}
          <div className="flex gap-1 items-center mt-2">
            <span className="text-[9px] text-yellow-400 w-16 text-right mr-1">mRNA 5'→3'</span>
            {mRNA.map((b, i) => (
              <AnimatePresence key={i}>
                {i < builtBases.length ? (
                  <motion.div
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black text-black"
                    style={{ backgroundColor: RNA_COLORS[b] ?? '#666' }}
                  >
                    {b}
                  </motion.div>
                ) : (
                  <div className="w-9 h-9 rounded-lg border border-dashed border-slate-700" />
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* Pairing rules legend */}
        <div className="flex flex-wrap gap-3 mt-4 text-[10px]">
          {[['A', 'T', 'DNA A-T'], ['G', 'C', 'DNA G-C'], ['A→U', '', 'RNA pairing']].map(([from, to, label], i) => (
            <span key={i} className="flex items-center gap-1 text-slate-400">
              <span className="px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: DNA_COLORS[from[0]] + '40', color: DNA_COLORS[from[0]] }}>{from}</span>
              {to && <><span>→</span><span className="px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: DNA_COLORS[to[0]] + '40', color: DNA_COLORS[to[0]] }}>{to}</span></>}
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* mRNA sequence */}
      {builtBases.length > 0 && (
        <div className="bg-yellow-500/5 rounded-xl border border-yellow-500/20 p-4">
          <div className="text-[10px] text-yellow-400 uppercase tracking-widest mb-2">mRNA Sequence</div>
          <div className="font-mono text-lg text-yellow-300">{builtBases.join('')}</div>
          <div className="text-xs text-slate-400 mt-1">
            Codons: {mRNAToCodons(builtBases as RNABase[]).join(' | ')}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
            isPlaying ? 'bg-red-500/20 border border-red-500 text-red-400' : 'bg-brand-accent text-black hover:bg-white'
          }`}
        >
          {isPlaying ? 'Pause' : <><Play size={16} fill="currentColor" /> Transcribe</>}
        </button>
        <button onClick={reset} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Translation Mode ─────────────────────────────────────────────────────────

function TranslationMode() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [ribosomeCodon, setRibosomeCodon] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCodonTable, setShowCodonTable] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const strand = PRESET_STRANDS[selectedPreset].template;
  const mRNA = dnaToMRNA(strand);
  const codons = mRNAToCodons(mRNA);
  const aminoAcids = codonsToAA(codons);

  useEffect(() => {
    if (!isPlaying) { clearInterval(intervalRef.current!); return; }
    intervalRef.current = setInterval(() => {
      setRibosomeCodon(prev => {
        if (prev >= codons.length - 1) { setIsPlaying(false); clearInterval(intervalRef.current!); return prev; }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(intervalRef.current!);
  }, [isPlaying, codons.length]);

  const reset = () => { setIsPlaying(false); setRibosomeCodon(0); };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div className="flex gap-2 flex-wrap items-center">
        {PRESET_STRANDS.map((p, i) => (
          <button key={i} onClick={() => { setSelectedPreset(i); reset(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedPreset === i ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {p.name}
          </button>
        ))}
        <button onClick={() => setShowCodonTable(!showCodonTable)}
          className={`ml-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showCodonTable ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          Codon Table
        </button>
      </div>

      {/* mRNA strip */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5 overflow-x-auto">
        <div className="text-[10px] text-yellow-400 uppercase tracking-widest mb-3">mRNA: {mRNA.join('')}</div>
        <div className="flex gap-1 items-start min-w-[350px]">
          {codons.map((codon, i) => {
            const aa = aminoAcids[i];
            const isActive = i === ribosomeCodon;
            const isComplete = i < ribosomeCodon;
            const isStop = aa === 'Stop';
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {/* Codon bases */}
                <div className="flex gap-0.5">
                  {(codon.split('') as RNABase[]).map((b, j) => (
                    <div key={j} className="w-7 h-7 rounded text-[10px] font-black flex items-center justify-center text-black"
                      style={{ backgroundColor: RNA_COLORS[b] ?? '#666', opacity: isComplete ? 0.4 : 1 }}>
                      {b}
                    </div>
                  ))}
                </div>
                {/* Ribosome indicator */}
                {isActive && (
                  <motion.div layoutId="ribosome"
                    className="bg-orange-500/20 border border-orange-500/60 rounded-lg px-1 py-0.5 text-[8px] text-orange-400 font-bold">
                    ▲ RB
                  </motion.div>
                )}
                {/* tRNA + amino acid */}
                {(isActive || isComplete) && !isStop && (
                  <motion.div
                    initial={{ scale: 0, y: -8 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-black text-black"
                    style={{ backgroundColor: AA_COLORS[i % AA_COLORS.length] }}
                  >
                    {aa.replace('*', '')}
                  </motion.div>
                )}
                {isStop && (isActive || isComplete) && (
                  <div className="text-[9px] text-red-400 font-bold">STOP</div>
                )}
                <div className="text-[8px] text-slate-600">{codon}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Polypeptide chain */}
      {ribosomeCodon > 0 && (
        <div className="bg-purple-500/5 rounded-xl border border-purple-500/20 p-4">
          <div className="text-[10px] text-purple-400 uppercase tracking-widest mb-2">Growing Polypeptide Chain</div>
          <div className="flex gap-2 flex-wrap">
            {aminoAcids.slice(0, ribosomeCodon).filter(a => a !== 'Stop').map((aa, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-black"
                style={{ backgroundColor: AA_COLORS[i % AA_COLORS.length] }}>
                {aa.replace('*', '')}
              </motion.div>
            ))}
            {ribosomeCodon < codons.length && <span className="text-slate-600 text-xl">...</span>}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
            isPlaying ? 'bg-red-500/20 border border-red-500 text-red-400' : 'bg-brand-accent text-black hover:bg-white'
          }`}
        >
          {isPlaying ? 'Pause' : <><Play size={16} fill="currentColor" /> Translate</>}
        </button>
        <button onClick={reset} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors">
          <RotateCcw size={18} />
        </button>
        {!isPlaying && ribosomeCodon < codons.length - 1 && (
          <button onClick={() => setRibosomeCodon(r => Math.min(r + 1, codons.length - 1))}
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold uppercase tracking-widest text-xs hover:text-white transition-all">
            Step <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Codon table */}
      <AnimatePresence>
        {showCodonTable && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Standard Genetic Code (Partial)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {Object.entries(CODON_TABLE).map(([codon, aa]) => (
                  <div key={codon} className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono ${
                    aa === 'Stop' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    aa === 'Met*' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    'bg-black/40 border-slate-800 text-slate-300'
                  }`}>
                    <span className="font-bold">{codon}</span>
                    <span className="text-slate-400">{aa}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mutation Mode ─────────────────────────────────────────────────────────────

function MutationMode() {
  const [originalStrand, setOriginalStrand] = useState<DNABase[]>(['T','A','C','G','C','A','A','T','G','C','A']);
  const [mutationType, setMutationType] = useState<MutationType>('substitution');
  const [mutationPos, setMutationPos] = useState(3);
  const [newBase, setNewBase] = useState<DNABase>('A');
  const [showSickleCells, setShowSickleCells] = useState(false);

  const bases: DNABase[] = ['A', 'T', 'G', 'C'];

  // Original
  const origMRNA = dnaToMRNA(originalStrand);
  const origCodons = mRNAToCodons(origMRNA);
  const origAA = codonsToAA(origCodons);

  // Mutant
  let mutantStrand = [...originalStrand];
  let mutantNote = '';
  if (mutationType === 'substitution') {
    mutantStrand[mutationPos] = newBase;
    mutantNote = `Base at position ${mutationPos + 1} changed: ${originalStrand[mutationPos]} → ${newBase}`;
  } else if (mutationType === 'insertion') {
    mutantStrand.splice(mutationPos, 0, newBase);
    mutantNote = `${newBase} inserted at position ${mutationPos + 1}`;
  } else {
    mutantStrand.splice(mutationPos, 1);
    mutantNote = `Base at position ${mutationPos + 1} (${originalStrand[mutationPos]}) deleted`;
  }

  const mutMRNA = dnaToMRNA(mutantStrand as DNABase[]);
  const mutCodons = mRNAToCodons(mutMRNA);
  const mutAA = codonsToAA(mutCodons);

  const mutClass: MutationClass = classifyMutation(origAA, mutAA);
  const mutClassColors: Record<MutationClass, string> = {
    silent: 'text-yellow-400', missense: 'text-orange-400', nonsense: 'text-red-400', frameshift: 'text-red-600',
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Mutation Type</div>
          <div className="flex gap-2">
            {(['substitution', 'insertion', 'deletion'] as MutationType[]).map(mt => (
              <button key={mt} onClick={() => setMutationType(mt)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mutationType === mt ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {mt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Position ({mutationPos + 1})</div>
          <input type="range" min={0} max={originalStrand.length - 1} value={mutationPos} onChange={e => setMutationPos(Number(e.target.value))}
            className="w-32 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" aria-label="Mutation position" />
        </div>
        {mutationType !== 'deletion' && (
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">New Base</div>
            <div className="flex gap-1">
              {bases.map(b => (
                <button key={b} onClick={() => setNewBase(b)}
                  className="w-9 h-9 rounded-lg text-sm font-black text-black transition-all hover:scale-110"
                  style={{ backgroundColor: newBase === b ? DNA_COLORS[b] : DNA_COLORS[b] + '40', color: newBase === b ? 'black' : DNA_COLORS[b] }}
                  aria-label={`Base ${b}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => setShowSickleCells(!showSickleCells)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showSickleCells ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          IB: Sickle Cell
        </button>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-green-500/5 rounded-2xl border border-green-500/20 p-4">
          <div className="text-[10px] text-green-400 uppercase tracking-widest mb-3">Original</div>
          <div className="flex gap-1 flex-wrap mb-3">
            {originalStrand.map((b, i) => (
              <div key={i}
                className="w-8 h-8 rounded text-xs font-black flex items-center justify-center text-black"
                style={{ backgroundColor: DNA_COLORS[b] }}
              >
                {b}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-400 font-mono mb-2">mRNA: {origMRNA.join('')}</div>
          <div className="flex gap-1 flex-wrap">
            {origAA.map((aa, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold text-black"
                style={{ backgroundColor: AA_COLORS[i % AA_COLORS.length] }}>
                {aa.replace('*', '')}
              </span>
            ))}
          </div>
        </div>

        {/* Mutant */}
        <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-4">
          <div className="text-[10px] text-red-400 uppercase tracking-widest mb-3">Mutant</div>
          <div className="flex gap-1 flex-wrap mb-3">
            {mutantStrand.map((b, i) => {
              const isChanged = mutationType === 'substitution'
                ? i === mutationPos
                : mutationType === 'insertion'
                ? i === mutationPos
                : false;
              const isDeleted = mutationType === 'deletion' && i >= mutationPos;
              return (
                <div key={i}
                  className={`w-8 h-8 rounded text-xs font-black flex items-center justify-center text-black transition-all ${
                    isChanged ? 'ring-4 ring-red-400 scale-110' : isDeleted ? 'opacity-60' : ''
                  }`}
                  style={{ backgroundColor: DNA_COLORS[b as DNABase] ?? '#666' }}
                >
                  {b}
                </div>
              );
            })}
          </div>
          <div className="text-xs text-slate-400 font-mono mb-2">mRNA: {mutMRNA.join('')}</div>
          <div className="flex gap-1 flex-wrap">
            {mutAA.map((aa, i) => {
              const isDiff = aa !== origAA[i];
              return (
                <span key={i}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold text-black ${isDiff ? 'ring-2 ring-red-400' : ''}`}
                  style={{ backgroundColor: AA_COLORS[i % AA_COLORS.length] }}>
                  {aa.replace('*', '')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mutation classification */}
      <div className={`rounded-xl border p-4 ${
        mutClass === 'silent' ? 'bg-yellow-500/10 border-yellow-500/30' :
        mutClass === 'missense' ? 'bg-orange-500/10 border-orange-500/30' :
        'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} className={mutClassColors[mutClass]} />
          <div>
            <div className={`font-bold uppercase tracking-widest text-sm ${mutClassColors[mutClass]}`}>{mutClass} mutation</div>
            <div className="text-slate-400 text-xs mt-0.5">{mutantNote}</div>
          </div>
        </div>
        <div className="mt-3 text-slate-300 text-xs">
          {mutClass === 'silent' && 'No change in amino acid sequence — the genetic code is degenerate (multiple codons per AA).'}
          {mutClass === 'missense' && 'One amino acid is changed — may affect protein function depending on location and type.'}
          {mutClass === 'nonsense' && 'A premature stop codon is created — protein is truncated (shortened) and likely non-functional.'}
          {mutClass === 'frameshift' && 'The entire reading frame is shifted — all amino acids downstream are changed. Most severe type.'}
        </div>
      </div>

      {/* Sickle Cell Disease */}
      <AnimatePresence>
        {showSickleCells && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/5 rounded-2xl border border-red-500/20 p-5">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">🔬 IB Extension: Sickle Cell Disease</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] text-green-400 uppercase tracking-widest mb-1">Normal HBB gene</div>
                <div className="font-mono">DNA: ...GAG... → mRNA: GAG → Glutamic acid (Glu)</div>
              </div>
              <div>
                <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">Sickle cell HBB gene</div>
                <div className="font-mono">DNA: ...GTG... → mRNA: GUG → Valine (Val)</div>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-3">
              A single base substitution (A→T at position 6 of the β-globin gene) changes one amino acid.
              This causes haemoglobin to polymerise under low oxygen, deforming red blood cells into a sickle shape.
              This is a <strong className="text-orange-400">missense mutation</strong> with severe effects.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
