import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'punnett' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'm1', question: 'What is the phenotypic ratio of Aa × Aa?', type: 'multiple-choice', options: ['1:1', '3:1', '1:2:1', '9:3:3:1'], correctAnswer: '3:1', explanation: 'AA, Aa, and aA all show the dominant phenotype; only aa shows recessive → 3 dominant : 1 recessive.' },
  { id: 'm2', question: 'An allele only expressed when homozygous is:', type: 'multiple-choice', options: ['Dominant', 'Recessive', 'Codominant', 'Incomplete'], correctAnswer: 'Recessive', explanation: 'Recessive alleles are masked by dominant ones and only show in the phenotype as aa.' },
  { id: 'm3', question: 'A test cross involves crossing an unknown genotype with:', type: 'multiple-choice', options: ['AA', 'Aa', 'aa', 'Any genotype'], correctAnswer: 'aa', explanation: 'Crossing with homozygous recessive (aa) reveals the unknown genotype from the offspring ratio.' },
];

const CONCEPTS = [
  { title: 'Gregor Mendel & the Pea Plants', content: 'In the 1860s, Gregor Mendel crossed thousands of pea plants and tracked seven traits (seed shape, colour, pod shape, etc.). He discovered that traits are inherited as discrete "factors" (now called genes) that do not blend. His Law of Segregation states that each organism carries two alleles for each trait, and these separate during gamete formation so each gamete carries only one allele.' },
  { title: 'Alleles, Genotype & Phenotype', content: 'An allele is a variant of a gene (e.g., "B" for brown fur, "b" for white fur). The genotype is the combination of alleles an organism has (BB, Bb, or bb). The phenotype is the observable trait expressed — how the organism actually looks. Two organisms can have different genotypes (BB and Bb) yet share the same phenotype (brown fur) if one allele is dominant.' },
  { title: 'Homozygous vs Heterozygous', content: 'Homozygous means both alleles are the same — either homozygous dominant (AA) or homozygous recessive (aa). Heterozygous (Aa) means the two alleles differ. Heterozygous individuals are sometimes called "carriers" of the recessive allele because they carry it without expressing it in their phenotype.' },
  { title: 'Dominance, Recessiveness & Beyond', content: 'A dominant allele (uppercase, e.g., A) masks the effect of a recessive allele (lowercase, a) in heterozygotes. However, not all inheritance is simple dominance: Incomplete dominance produces a blended phenotype (red × white → pink). Codominance means both alleles are fully expressed (e.g., AB blood type). These patterns extend Mendel\'s original model.' },
];

export default function MendelianInheritance() {
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {(['learn', 'punnett', 'quiz'] as ViewMode[]).map((mode) => (
          <button key={mode} onClick={() => setViewMode(mode)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{mode === 'punnett' ? 'Punnett Square' : mode}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'learn' && <LearnMode />}
            {viewMode === 'punnett' && <PunnettSquare />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Mendelian Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LearnMode() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {CONCEPTS.map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-2">{c.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{c.content}</p>
        </motion.div>
      ))}
    </div>
  );
}

const TRAITS: Record<string, { dom: string; rec: string; domLabel: string; recLabel: string }> = {
  'Seed Colour': { dom: '🟡', rec: '🟢', domLabel: 'Yellow (Y)', recLabel: 'Green (y)' },
  'Flower Colour': { dom: '🟣', rec: '⚪', domLabel: 'Purple (P)', recLabel: 'White (p)' },
  'Seed Shape': { dom: '⚫', rec: '🔘', domLabel: 'Round (R)', recLabel: 'Wrinkled (r)' },
};

function PunnettSquare() {
  const [traitName, setTraitName] = useState('Seed Colour');
  const [p1, setP1] = useState('Aa');
  const [p2, setP2] = useState('Aa');
  const trait = TRAITS[traitName];
  const a1 = p1.split('');
  const a2 = p2.split('');
  const grid = [[a1[0]+a2[0], a1[1]+a2[0]], [a1[0]+a2[1], a1[1]+a2[1]]];
  const isDom = (g: string) => g[0] === g[0].toUpperCase() || g[1] === g[1].toUpperCase() ? g.includes(g[0].toUpperCase()) || g.includes(g[1].toUpperCase()) : false;
  const hasDom = (g: string) => g[0] >= 'A' && g[0] <= 'Z' || g[1] >= 'A' && g[1] <= 'Z';
  const domCount = grid.flat().filter(hasDom).length;
  const recCount = 4 - domCount;

  return (
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest">Trait</label>
          <select value={traitName} onChange={e => setTraitName(e.target.value)} className="bg-slate-800 text-white p-2 rounded-lg text-sm outline-none">
            {Object.keys(TRAITS).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest">Parent 1</label>
          <select value={p1} onChange={e => setP1(e.target.value)} className="bg-slate-800 text-white p-2 rounded-lg text-sm outline-none">
            <option value="AA">AA (Homozygous Dom.)</option>
            <option value="Aa">Aa (Heterozygous)</option>
            <option value="aa">aa (Homozygous Rec.)</option>
          </select>
        </div>
        <div className="text-xl font-bold text-slate-600">×</div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest">Parent 2</label>
          <select value={p2} onChange={e => setP2(e.target.value)} className="bg-slate-800 text-white p-2 rounded-lg text-sm outline-none">
            <option value="AA">AA (Homozygous Dom.)</option>
            <option value="Aa">Aa (Heterozygous)</option>
            <option value="aa">aa (Homozygous Rec.)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div></div>
        <div className="text-center font-bold text-lg text-slate-400">{a1[0]}</div>
        <div className="text-center font-bold text-lg text-slate-400">{a1[1]}</div>
        {a2.map((allele, row) => (
          <> 
            <div key={`h${row}`} className="flex items-center justify-center font-bold text-lg text-slate-400">{allele}</div>
            {grid[row].map((g, col) => (
              <motion.div key={`${row}${col}`} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`w-28 h-28 flex flex-col items-center justify-center text-3xl font-bold border-2 rounded-xl ${hasDom(g) ? 'bg-green-500/15 text-green-400 border-green-500/40' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40'}`}>
                <span>{hasDom(g) ? trait.dom : trait.rec}</span>
                <span className="text-sm mt-1">{g}</span>
              </motion.div>
            ))}
          </>
        ))}
      </div>

      {/* Ratio Bar */}
      <div className="w-full max-w-md">
        <div className="flex h-8 rounded-lg overflow-hidden border border-slate-700">
          {domCount > 0 && <div className="bg-green-500/30 flex items-center justify-center text-xs font-bold text-green-400" style={{ width: `${domCount / 4 * 100}%` }}>{trait.domLabel} ({domCount})</div>}
          {recCount > 0 && <div className="bg-yellow-500/30 flex items-center justify-center text-xs font-bold text-yellow-400" style={{ width: `${recCount / 4 * 100}%` }}>{trait.recLabel} ({recCount})</div>}
        </div>
        <div className="text-center text-sm text-slate-400 mt-2 font-mono">Phenotype Ratio: {domCount} : {recCount}</div>
      </div>
    </div>
  );
}
