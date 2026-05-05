import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Dna, ArrowRight } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { PROTEIN_SYNTHESIS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface AminoAcid {
  codon: string;
  name: string;
  abbr: string;
  color: string;
}

const CODON_TABLE: Record<string, AminoAcid> = {
  'AUG': { codon: 'AUG', name: 'Methionine (Start)', abbr: 'Met', color: '#10b981' },
  'UUU': { codon: 'UUU', name: 'Phenylalanine', abbr: 'Phe', color: '#8b5cf6' },
  'UUC': { codon: 'UUC', name: 'Phenylalanine', abbr: 'Phe', color: '#8b5cf6' },
  'UUA': { codon: 'UUA', name: 'Leucine', abbr: 'Leu', color: '#3b82f6' },
  'UUG': { codon: 'UUG', name: 'Leucine', abbr: 'Leu', color: '#3b82f6' },
  'CUU': { codon: 'CUU', name: 'Leucine', abbr: 'Leu', color: '#3b82f6' },
  'CUC': { codon: 'CUC', name: 'Leucine', abbr: 'Leu', color: '#3b82f6' },
  'CUA': { codon: 'CUA', name: 'Leucine', abbr: 'Leu', color: '#3b82f6' },
  'CUG': { codon: 'CUG', name: 'Leucine', abbr: 'Leu', color: '#3b82f6' },
  'AUU': { codon: 'AUU', name: 'Isoleucine', abbr: 'Ile', color: '#06b6d4' },
  'AUC': { codon: 'AUC', name: 'Isoleucine', abbr: 'Ile', color: '#06b6d4' },
  'AUA': { codon: 'AUA', name: 'Isoleucine', abbr: 'Ile', color: '#06b6d4' },
  'GUU': { codon: 'GUU', name: 'Valine', abbr: 'Val', color: '#0ea5e9' },
  'GUC': { codon: 'GUC', name: 'Valine', abbr: 'Val', color: '#0ea5e9' },
  'GUA': { codon: 'GUA', name: 'Valine', abbr: 'Val', color: '#0ea5e9' },
  'GUG': { codon: 'GUG', name: 'Valine', abbr: 'Val', color: '#0ea5e9' },
  'UCU': { codon: 'UCU', name: 'Serine', abbr: 'Ser', color: '#f59e0b' },
  'UCC': { codon: 'UCC', name: 'Serine', abbr: 'Ser', color: '#f59e0b' },
  'UCA': { codon: 'UCA', name: 'Serine', abbr: 'Ser', color: '#f59e0b' },
  'UCG': { codon: 'UCG', name: 'Serine', abbr: 'Ser', color: '#f59e0b' },
  'CCU': { codon: 'CCU', name: 'Proline', abbr: 'Pro', color: '#d946ef' },
  'CCC': { codon: 'CCC', name: 'Proline', abbr: 'Pro', color: '#d946ef' },
  'CCA': { codon: 'CCA', name: 'Proline', abbr: 'Pro', color: '#d946ef' },
  'CCG': { codon: 'CCG', name: 'Proline', abbr: 'Pro', color: '#d946ef' },
  'ACU': { codon: 'ACU', name: 'Threonine', abbr: 'Thr', color: '#f43f5e' },
  'ACC': { codon: 'ACC', name: 'Threonine', abbr: 'Thr', color: '#f43f5e' },
  'ACA': { codon: 'ACA', name: 'Threonine', abbr: 'Thr', color: '#f43f5e' },
  'ACG': { codon: 'ACG', name: 'Threonine', abbr: 'Thr', color: '#f43f5e' },
  'GCU': { codon: 'GCU', name: 'Alanine', abbr: 'Ala', color: '#ec4899' },
  'GCC': { codon: 'GCC', name: 'Alanine', abbr: 'Ala', color: '#ec4899' },
  'GCA': { codon: 'GCA', name: 'Alanine', abbr: 'Ala', color: '#ec4899' },
  'GCG': { codon: 'GCG', name: 'Alanine', abbr: 'Ala', color: '#ec4899' },
  'UAU': { codon: 'UAU', name: 'Tyrosine', abbr: 'Tyr', color: '#84cc16' },
  'UAC': { codon: 'UAC', name: 'Tyrosine', abbr: 'Tyr', color: '#84cc16' },
  'CAU': { codon: 'CAU', name: 'Histidine', abbr: 'His', color: '#eab308' },
  'CAC': { codon: 'CAC', name: 'Histidine', abbr: 'His', color: '#eab308' },
  'CAA': { codon: 'CAA', name: 'Glutamine', abbr: 'Gln', color: '#eab308' },
  'CAG': { codon: 'CAG', name: 'Glutamine', abbr: 'Gln', color: '#eab308' },
  'AAU': { codon: 'AAU', name: 'Asparagine', abbr: 'Asn', color: '#f97316' },
  'AAC': { codon: 'AAC', name: 'Asparagine', abbr: 'Asn', color: '#f97316' },
  'AAA': { codon: 'AAA', name: 'Lysine', abbr: 'Lys', color: '#f97316' },
  'AAG': { codon: 'AAG', name: 'Lysine', abbr: 'Lys', color: '#f97316' },
  'GAU': { codon: 'GAU', name: 'Aspartic Acid', abbr: 'Asp', color: '#ef4444' },
  'GAC': { codon: 'GAC', name: 'Aspartic Acid', abbr: 'Asp', color: '#ef4444' },
  'GAA': { codon: 'GAA', name: 'Glutamic Acid', abbr: 'Glu', color: '#ef4444' },
  'GAG': { codon: 'GAG', name: 'Glutamic Acid', abbr: 'Glu', color: '#ef4444' },
  'UGU': { codon: 'UGU', name: 'Cysteine', abbr: 'Cys', color: '#a855f7' },
  'UGC': { codon: 'UGC', name: 'Cysteine', abbr: 'Cys', color: '#a855f7' },
  'UGG': { codon: 'UGG', name: 'Tryptophan', abbr: 'Trp', color: '#a855f7' },
  'CGU': { codon: 'CGU', name: 'Arginine', abbr: 'Arg', color: '#6366f1' },
  'CGC': { codon: 'CGC', name: 'Arginine', abbr: 'Arg', color: '#6366f1' },
  'CGA': { codon: 'CGA', name: 'Arginine', abbr: 'Arg', color: '#6366f1' },
  'CGG': { codon: 'CGG', name: 'Arginine', abbr: 'Arg', color: '#6366f1' },
  'AGU': { codon: 'AGU', name: 'Serine', abbr: 'Ser', color: '#f59e0b' },
  'AGC': { codon: 'AGC', name: 'Serine', abbr: 'Ser', color: '#f59e0b' },
  'AGA': { codon: 'AGA', name: 'Arginine', abbr: 'Arg', color: '#6366f1' },
  'AGG': { codon: 'AGG', name: 'Arginine', abbr: 'Arg', color: '#6366f1' },
  'GGU': { codon: 'GGU', name: 'Glycine', abbr: 'Gly', color: '#14b8a6' },
  'GGC': { codon: 'GGC', name: 'Glycine', abbr: 'Gly', color: '#14b8a6' },
  'GGA': { codon: 'GGA', name: 'Glycine', abbr: 'Gly', color: '#14b8a6' },
  'GGG': { codon: 'GGG', name: 'Glycine', abbr: 'Gly', color: '#14b8a6' },
  'UAA': { codon: 'UAA', name: 'STOP', abbr: 'STOP', color: '#ef4444' },
  'UAG': { codon: 'UAG', name: 'STOP', abbr: 'STOP', color: '#ef4444' },
  'UGA': { codon: 'UGA', name: 'STOP', abbr: 'STOP', color: '#ef4444' },
};

const GENE_TEMPLATES = [
  { id: 'hbb', name: 'Haemoglobin (HBB)', sequence: 'TACCACTGA' },
  { id: 'ins', name: 'Insulin (INS)', sequence: 'TACAAACGA' },
  { id: 'sickle', name: 'Sickle Cell (HBB mutant)', sequence: 'TACCACGGA' },
];

// ─── Simulation sub-component ──────────────────────────────────────────────────

interface ProteinSynthesisSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ProteinSynthesisSimulation({ variables, isRunning, onRecordData }: ProteinSynthesisSimProps) {
  const geneIdx = Math.round(variables['gene-template'] ?? 0);
  const mutationTypeVal = Math.round(variables['mutation-type'] ?? 0);
  const mutationPosition = Math.round(variables['mutation-position'] ?? 3);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [phase, setPhase] = useState<'transcribe' | 'translate' | 'mutate' | 'result'>('transcribe');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dnaTemplate, setDnaTemplate] = useState(GENE_TEMPLATES[geneIdx]?.sequence ?? GENE_TEMPLATES[0].sequence);
  const [mrnaTranscript, setMrnaTranscript] = useState<string>('');
  const [proteinChain, setProteinChain] = useState<AminoAcid[]>([]);
  const [currentCodonIdx, setCurrentCodonIdx] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [mutationType, setMutationType] = useState<'normal' | 'substitution' | 'deletion'>('normal');
  const [hasRecorded, setHasRecorded] = useState(false);

  const W = 700;
  const H = 250;

  useEffect(() => {
    const seq = GENE_TEMPLATES[geneIdx]?.sequence ?? GENE_TEMPLATES[0].sequence;
    setDnaTemplate(seq);
    setMutationType('normal');
    setPhase('transcribe');
    setMrnaTranscript('');
    setProteinChain([]);
    setCurrentCodonIdx(0);
    setFeedbackMsg('');
    setScore(0);
    setStreak(0);
    setHasRecorded(false);
  }, [geneIdx]);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(W - 50, 150);
    ctx.stroke();

    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < mrnaTranscript.length; i++) {
      const x = 100 + i * 30;
      const base = mrnaTranscript[i];
      ctx.fillStyle = base === 'A' ? '#3b82f6' : base === 'U' ? '#eab308' : base === 'G' ? '#22c55e' : '#ef4444';
      ctx.fillText(base, x, 145);

      ctx.fillRect(x - 2, 148, 4, 10);
    }

    if (phase === 'translate' || phase === 'mutate' || phase === 'result') {
      const ribosomeX = 100 + currentCodonIdx * 90;

      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(ribosomeX + 30, 110, 60, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(ribosomeX + 30, 170, 50, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
      ctx.fillRect(ribosomeX - 15, 125, 90, 40);
      ctx.strokeStyle = '#22d3ee';
      ctx.strokeRect(ribosomeX - 15, 125, 90, 40);

      proteinChain.forEach((aa, idx) => {
        const aaX = ribosomeX + 30 - (proteinChain.length - idx) * 30;
        const aaY = 50 + (idx % 2 === 0 ? 0 : 10);

        ctx.fillStyle = aa.color;
        ctx.beginPath();
        ctx.arc(aaX, aaY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(aa.abbr, aaX, aaY + 4);

        if (idx > 0) {
          const prevX = ribosomeX + 30 - (proteinChain.length - idx + 1) * 30;
          const prevY = 50 + ((idx - 1) % 2 === 0 ? 0 : 10);
          ctx.beginPath();
          ctx.moveTo(prevX + 12, prevY);
          ctx.lineTo(aaX - 12, aaY);
          ctx.strokeStyle = '#64748b';
          ctx.stroke();
        }
      });
    }

  }, [mrnaTranscript, phase, currentCodonIdx, proteinChain]);

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  useEffect(() => {
    if (!isRunning) return;
    if (phase !== 'transcribe' || mrnaTranscript.length > 0) return;

    let idx = 0;
    const target = dnaTemplate;
    const interval = setInterval(() => {
      if (idx >= target.length) {
        clearInterval(interval);
        setPhase('translate');
        return;
      }
      const dnaBase = target[idx];
      const rnaBase = dnaBase === 'T' ? 'A' : dnaBase === 'A' ? 'U' : dnaBase === 'C' ? 'G' : 'C';
      setMrnaTranscript(prev => prev + rnaBase);
      setScore(s => s + 2);
      idx++;
    }, 600);

    return () => clearInterval(interval);
  }, [isRunning, phase, dnaTemplate, mrnaTranscript.length]);

  useEffect(() => {
    if (!isRunning) return;
    if (phase !== 'translate') return;

    const codons: string[] = [];
    for (let i = 0; i + 3 <= mrnaTranscript.length; i += 3) {
      codons.push(mrnaTranscript.slice(i, i + 3));
    }

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= codons.length) {
        clearInterval(interval);
        if (mutationTypeVal > 0) {
          setPhase('mutate');
        } else {
          setPhase('result');
        }
        return;
      }
      const codon = codons[idx];
      const aa = CODON_TABLE[codon];
      if (aa) {
        setProteinChain(prev => [...prev, aa]);
        setScore(s => s + 3);
        setStreak(s => s + 1);
        setFeedbackMsg(`Translating: ${codon} → ${aa.name}`);
      }
      setCurrentCodonIdx(idx);
      idx++;
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, phase, mrnaTranscript, mutationTypeVal]);

  useEffect(() => {
    if (!isRunning) return;
    if (phase !== 'result') return;
    if (hasRecorded) return;

    const aminoAcidSequence = proteinChain.map(aa => aa.abbr).join('-');
    const geneName = GENE_TEMPLATES[geneIdx]?.name ?? 'Unknown';

    let appliedMutation = 'none';
    if (mutationType === 'substitution') appliedMutation = 'substitution';
    else if (mutationType === 'deletion') appliedMutation = 'deletion';

    setHasRecorded(true);
    onRecordData({
      aminoAcidSequence,
      proteinLength: proteinChain.length,
      geneTemplate: geneName,
      mutationType: appliedMutation,
      mutationPosition,
      score,
      dnaTemplate,
      mrnaTranscript,
    });
  }, [isRunning, phase, hasRecorded, proteinChain, geneIdx, mutationType, mutationPosition, score, dnaTemplate, mrnaTranscript, onRecordData]);

  const applyMutation = (type: 'substitution' | 'deletion') => {
    let mutatedSequence = dnaTemplate;
    if (type === 'substitution') {
      mutatedSequence = mutatedSequence.slice(0, 4) + 'A' + mutatedSequence.slice(5);
      setFeedbackMsg('Point mutation applied: Substitution at base 5');
    } else if (type === 'deletion') {
      mutatedSequence = mutatedSequence.slice(0, 4) + mutatedSequence.slice(5);
      setFeedbackMsg('Frameshift mutation applied: Deletion of base 5');
    }

    setMutationType(type);
    setDnaTemplate(mutatedSequence);
    setMrnaTranscript('');
    setProteinChain([]);
    setCurrentCodonIdx(0);
    setPhase('transcribe');
    setHasRecorded(false);
  };

  const handleTranscribe = (base: string) => {
    if (!isRunning) return;
    const targetIdx = mrnaTranscript.length;
    if (targetIdx >= dnaTemplate.length) return;

    const dnaBase = dnaTemplate[targetIdx];
    const correctRna = dnaBase === 'T' ? 'A' : dnaBase === 'A' ? 'U' : dnaBase === 'C' ? 'G' : 'C';

    if (base === correctRna) {
      setMrnaTranscript(prev => prev + base);
      setScore(s => s + 2);
      setStreak(s => s + 1);
      setFeedbackMsg(`Correct! DNA ${dnaBase} pairs with RNA ${base}`);

      if (mrnaTranscript.length + 1 === dnaTemplate.length) {
        setTimeout(() => setPhase('translate'), 1000);
      }
    } else {
      setScore(s => Math.max(0, s - 1));
      setStreak(0);
      setFeedbackMsg(`Oops! DNA ${dnaBase} pairs with RNA ${correctRna}, not ${base}`);
    }
  };

  const handleTranslate = (codon: string) => {
    if (!isRunning) return;
    const activeCodon = mrnaTranscript.slice(currentCodonIdx * 3, currentCodonIdx * 3 + 3);

    if (codon === activeCodon) {
      const aa = CODON_TABLE[codon];
      setProteinChain(prev => [...prev, aa]);
      setCurrentCodonIdx(c => c + 1);
      setScore(s => s + 3);
      setStreak(s => s + 1);
      setFeedbackMsg(`Matched! ${codon} codes for ${aa.name}`);

      if (currentCodonIdx * 3 + 3 >= mrnaTranscript.length) {
        setTimeout(() => {
          if (mutationTypeVal > 0) {
            setPhase('mutate');
          } else {
            setPhase('result');
          }
        }, 1000);
      }
    } else {
      setScore(s => Math.max(0, s - 1));
      setStreak(0);
      setFeedbackMsg(`Incorrect codon match.`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Protein <span className="text-brand-accent font-medium">Synthesis Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Transcribe DNA to mRNA and translate to proteins</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold text-sm">{score} pts</span>
          </div>
          {streak > 2 && (
            <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full animate-pulse">
              <span className="text-orange-400 text-xs font-bold">🔥 {streak} streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Templates */}
      {phase === 'transcribe' && mrnaTranscript.length === 0 && !isRunning && (
        <div className="flex gap-2 w-full justify-center">
          {GENE_TEMPLATES.map(gene => (
            <button
              key={gene.id}
              onClick={() => { setDnaTemplate(gene.sequence); setMutationType('normal'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                dnaTemplate === gene.sequence && mutationType === 'normal'
                  ? 'bg-brand-accent text-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {gene.name}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full max-w-full" />

        {/* DNA Overlay during transcribe */}
        {phase === 'transcribe' && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-black/40 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <Dna size={18} className="text-brand-accent" />
              <span className="text-sm font-mono text-white">Template DNA:</span>
            </div>
            <div className="font-mono text-xl tracking-[0.3em] font-bold">
              {dnaTemplate.split('').map((base, i) => (
                <span key={i} className={
                  i === mrnaTranscript.length ? 'text-brand-accent underline underline-offset-4' :
                  i < mrnaTranscript.length ? 'text-slate-500' : 'text-white'
                }>{base}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Message */}
      <div className="h-6">
        <AnimatePresence mode="wait">
          {feedbackMsg && (
            <motion.div
              key={feedbackMsg}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-cyan-400 font-medium text-center"
            >
              {feedbackMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls based on Phase */}
      <div className="w-full max-w-[500px]">

        {phase === 'transcribe' && (
          <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6 text-center">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-4">Transcription Phase</h3>
            <p className="text-slate-400 text-sm mb-6">Select the complementary RNA base for the highlighted DNA base.</p>
            <div className="flex justify-center gap-4">
              {['A', 'U', 'C', 'G'].map(base => (
                <button
                  key={base}
                  onClick={() => handleTranscribe(base)}
                  disabled={!isRunning}
                  className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-brand-accent hover:text-brand-accent text-xl font-bold font-mono transition-all text-white disabled:opacity-50"
                >
                  {base}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'translate' && (
          <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6 text-center">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Translation Phase</h3>
            <p className="text-slate-400 text-sm mb-6">Match the incoming tRNA anticodon to the active mRNA codon in the ribosome.</p>

            <div className="flex justify-center gap-3 flex-wrap">
              {(() => {
                const activeCodon = mrnaTranscript.slice(currentCodonIdx * 3, currentCodonIdx * 3 + 3);
                if (activeCodon.length < 3) return null;

                const options = [activeCodon];
                const allCodons = Object.keys(CODON_TABLE);
                while(options.length < 3) {
                  const randomCodon = allCodons[Math.floor(Math.random() * allCodons.length)];
                  if (!options.includes(randomCodon)) options.push(randomCodon);
                }

                return options.sort(() => Math.random() - 0.5).map(codon => {
                  const aa = CODON_TABLE[codon];
                  return (
                    <button
                      key={codon}
                      onClick={() => handleTranslate(codon)}
                      disabled={!isRunning}
                      className="px-6 py-3 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-green-400 transition-all flex flex-col items-center gap-1 disabled:opacity-50"
                    >
                      <span className="text-white font-mono font-bold tracking-widest">{codon}</span>
                      <span className="text-xs" style={{ color: aa.color }}>{aa.name}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {phase === 'mutate' && (
          <div className="bg-slate-900/60 rounded-2xl border border-orange-500/30 p-6 text-center">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Mutation Challenge</h3>
            <p className="text-slate-400 text-sm mb-6">Introduce a mutation to the DNA template and observe how it affects the protein.</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => applyMutation('substitution')}
                disabled={!isRunning}
                className="w-full px-4 py-3 bg-slate-800 border border-orange-500/50 rounded-xl text-orange-400 font-bold hover:bg-orange-500/20 transition-all disabled:opacity-50"
              >
                Apply Point Substitution (Sickle Cell)
              </button>
              <button
                onClick={() => applyMutation('deletion')}
                disabled={!isRunning}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/50 rounded-xl text-red-400 font-bold hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                Apply Frameshift Deletion
              </button>
              <button
                onClick={() => setPhase('result')}
                disabled={!isRunning}
                className="w-full px-4 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowRight size={16} /> Skip Mutation (View Result)
              </button>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="bg-slate-900/60 rounded-2xl border border-green-500/30 p-6 text-center">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Protein Produced</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {proteinChain.map((aa, i) => (
                <div key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: aa.color + '20', color: aa.color, border: `1px solid ${aa.color}40` }}>
                  {aa.abbr}
                </div>
              ))}
            </div>
            <div className="text-slate-400 text-sm">
              {proteinChain.map(aa => aa.abbr).join(' — ')}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Lab wrapper ─────────────────────────────────────────────────────────────

export default function ProteinSynthesisLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ProteinSynthesisSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const totalScore = trials.flatMap(t =>
      t.observations.map(o =>
        typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).score ?? 0) : 0,
      ),
    ).reduce((a, b) => a + b, 0);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <Dna size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You explored protein synthesis across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Score</div>
            <div className="text-2xl font-mono font-bold text-yellow-400">
              {totalScore}
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Observations</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">
              {trials.flatMap(t => t.observations).length}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCompletedSession(null)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Back to Lesson
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={PROTEIN_SYNTHESIS_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
