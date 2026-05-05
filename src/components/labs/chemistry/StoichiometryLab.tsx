import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Beaker, Factory, Scale, Gauge, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { STOICHIOMETRY_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface Reaction {
  id: string; name: string; equation: string;
  reactants: { name: string; formula: string; molarMass: number; coeff: number; color: string }[];
  products: { name: string; formula: string; molarMass: number; coeff: number; color: string }[];
  ghanaApp: string;
}

const REACTIONS: Reaction[] = [
  {
    id: 'cement', name: 'Calcium Oxide (Cement)', equation: 'CaCO₃ → CaO + CO₂',
    reactants: [{ name: 'Calcium Carbonate', formula: 'CaCO₃', molarMass: 100, coeff: 1, color: '#94a3b8' }],
    products: [
      { name: 'Calcium Oxide', formula: 'CaO', molarMass: 56, coeff: 1, color: '#f59e0b' },
      { name: 'Carbon Dioxide', formula: 'CO₂', molarMass: 44, coeff: 1, color: '#64748b' },
    ],
    ghanaApp: 'GHACEM Tema & Diamond Cement use this reaction to produce quicklime for cement.',
  },
  {
    id: 'ammonia', name: 'Haber Process (Ammonia)', equation: 'N₂ + 3H₂ → 2NH₃',
    reactants: [
      { name: 'Nitrogen', formula: 'N₂', molarMass: 28, coeff: 1, color: '#3b82f6' },
      { name: 'Hydrogen', formula: 'H₂', molarMass: 2, coeff: 3, color: '#22d3ee' },
    ],
    products: [{ name: 'Ammonia', formula: 'NH₃', molarMass: 17, coeff: 2, color: '#10b981' }],
    ghanaApp: 'Ghana imports ammonia-based fertilisers. Understanding the Haber process helps optimise local production.',
  },
  {
    id: 'neutralisation', name: 'Neutralisation', equation: 'HCl + NaOH → NaCl + H₂O',
    reactants: [
      { name: 'Hydrochloric Acid', formula: 'HCl', molarMass: 36.5, coeff: 1, color: '#ef4444' },
      { name: 'Sodium Hydroxide', formula: 'NaOH', molarMass: 40, coeff: 1, color: '#3b82f6' },
    ],
    products: [
      { name: 'Sodium Chloride', formula: 'NaCl', molarMass: 58.5, coeff: 1, color: '#f5f5f5' },
      { name: 'Water', formula: 'H₂O', molarMass: 18, coeff: 1, color: '#22d3ee' },
    ],
    ghanaApp: 'Neutralisation is used in Ghanaian water treatment plants to adjust pH for safe drinking water.',
  },
];

interface Particle {
  x: number; y: number; vx: number; vy: number;
  type: 'reactant' | 'product'; idx: number; reacted: boolean; opacity: number;
}

type Phase = 'calculate' | 'react' | 'limiting' | 'result';

interface StoichiometrySimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function StoichiometrySimulation({ variables, isRunning, onRecordData }: StoichiometrySimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const tRef = useRef(0);

  const [rxnIdx, setRxnIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('calculate');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [experiments, setExperiments] = useState(0);
  const [masses, setMasses] = useState<number[]>([]);
  const [moleAnswer, setMoleAnswer] = useState('');
  const [moleFeedback, setMoleFeedback] = useState<string | null>(null);
  const [limitingAnswer, setLimitingAnswer] = useState<string | null>(null);
  const [limitingFeedback, setLimitingFeedback] = useState<string | null>(null);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [yieldPct, setYieldPct] = useState(0);
  const [productMass, setProductMass] = useState(0);

  const rxn = REACTIONS[rxnIdx];
  const W = 600, H = 300;

  // Initialise masses
  useEffect(() => {
    setMasses(rxn.reactants.map(r => r.molarMass * r.coeff * (1 + Math.random() * 0.5)));
  }, [rxnIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const initParticles = useCallback(() => {
    particlesRef.current = [];
    rxn.reactants.forEach((r, ri) => {
      const count = Math.round((masses[ri] || r.molarMass) / r.molarMass * 8);
      for (let i = 0; i < Math.min(count, 30); i++) {
        particlesRef.current.push({
          x: 50 + Math.random() * 200, y: 80 + Math.random() * 180,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          type: 'reactant', idx: ri, reacted: false, opacity: 1,
        });
      }
    });
  }, [rxn, masses]);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0f1e'; ctx.fillRect(0, 0, W, H);

    // Beaker left (reactants)
    ctx.strokeStyle = 'rgba(148,163,184,0.4)'; ctx.lineWidth = 2;
    ctx.strokeRect(30, 60, 250, 220);
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(32, 62, 246, 216);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
    ctx.fillText('REACTANTS', 155, 55);

    // Beaker right (products)
    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.strokeRect(320, 60, 250, 220);
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(322, 62, 246, 216);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('PRODUCTS', 445, 55);

    // Arrow
    ctx.fillStyle = '#22d3ee'; ctx.font = '24px sans-serif';
    ctx.fillText('→', 290, 175);

    // Particles
    particlesRef.current.forEach(p => {
      if (p.opacity <= 0) return;
      ctx.globalAlpha = p.opacity;
      const color = p.type === 'reactant' ? rxn.reactants[p.idx]?.color : rxn.products[p.idx]?.color;
      ctx.fillStyle = color || '#888';
      ctx.shadowColor = color || '#888'; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    });

    // Progress bar
    if (phase === 'react') {
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(30, 25, W - 60, 8);
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(30, 25, (W - 60) * reactionProgress, 8);
    }

    // Equation
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
    ctx.fillText(rxn.equation, W / 2, 15);
    ctx.textAlign = 'left';
  }, [rxn, phase, reactionProgress, W, H]);

  const startReaction = useCallback(() => {
    setPhase('react');
    setExperiments(e => e + 1);
    initParticles();
    tRef.current = 0;

    // Calculate limiting reagent & yield
    const molesArr = rxn.reactants.map((r, i) => (masses[i] || r.molarMass * r.coeff) / r.molarMass);
    const scaledMoles = molesArr.map((m, i) => m / rxn.reactants[i].coeff);
    const limitingIdx = scaledMoles.indexOf(Math.min(...scaledMoles));
    const limitingMoles = molesArr[limitingIdx];
    const productMoles = (limitingMoles / rxn.reactants[limitingIdx].coeff) * rxn.products[0].coeff;
    const pMass = productMoles * rxn.products[0].molarMass;
    setProductMass(parseFloat(pMass.toFixed(2)));
    const theoreticalMax = (rxn.reactants[0].coeff > 0 ? masses[0] / rxn.reactants[0].molarMass : 1) * rxn.products[0].molarMass * rxn.products[0].coeff / rxn.reactants[0].coeff;
    setYieldPct(Math.min(100, parseFloat(((pMass / theoreticalMax) * 100).toFixed(1))));

    const startTime = Date.now();
    const duration = 4000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      tRef.current += 0.016;
      setReactionProgress(progress);

      particlesRef.current.forEach(p => {
        if (p.reacted) {
          if (p.type === 'product') { p.opacity = Math.min(1, p.opacity + 0.02); }
          else { p.opacity = Math.max(0, p.opacity - 0.03); }
          return;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 35 || p.x > 275) p.vx *= -1;
        if (p.y < 65 || p.y > 275) p.vy *= -1;
        p.vx += (Math.random() - 0.5) * 0.4; p.vy += (Math.random() - 0.5) * 0.4;
        p.vx *= 0.98; p.vy *= 0.98;

        if (Math.random() < 0.02 * progress && p.type === 'reactant') {
          p.reacted = true;
          // Spawn product particle
          particlesRef.current.push({
            x: 350 + Math.random() * 200, y: 80 + Math.random() * 180,
            vx: (Math.random() - 0.5), vy: (Math.random() - 0.5),
            type: 'product', idx: 0, reacted: true, opacity: 0,
          });
        }
      });

      drawScene();
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
      else setPhase('limiting');
    };
    animRef.current = requestAnimationFrame(animate);
  }, [rxn, masses, initParticles, drawScene]);

  useEffect(() => { drawScene(); }, [drawScene]);

  const checkMoles = () => {
    if (!masses[0]) return;
    const actual = masses[0] / rxn.reactants[0].molarMass;
    const answer = parseFloat(moleAnswer);
    if (isNaN(answer)) return;
    const pct = Math.abs(answer - actual) / actual;
    if (pct < 0.05) {
      setMoleFeedback(`✅ Correct! n = m/M = ${masses[0].toFixed(1)}/${rxn.reactants[0].molarMass} = ${actual.toFixed(3)} mol`);
      setScore(s => s + 3); setStreak(s => s + 1);
    } else {
      setMoleFeedback(`❌ n = m/M = ${masses[0].toFixed(1)}/${rxn.reactants[0].molarMass} = ${actual.toFixed(3)} mol`);
      setStreak(0);
    }
  };

  const checkLimiting = (formula: string) => {
    if (limitingAnswer) return;
    setLimitingAnswer(formula);
    const molesArr = rxn.reactants.map((r, i) => (masses[i] || r.molarMass * r.coeff) / r.molarMass);
    const scaledMoles = molesArr.map((m, i) => m / rxn.reactants[i].coeff);
    const limitingIdx = scaledMoles.indexOf(Math.min(...scaledMoles));
    if (formula === rxn.reactants[limitingIdx].formula) {
      setLimitingFeedback(`✅ Correct! ${rxn.reactants[limitingIdx].name} runs out first.`);
      setScore(s => s + 4); setStreak(s => s + 1);
    } else {
      setLimitingFeedback(`❌ The limiting reagent is ${rxn.reactants[limitingIdx].name} (${rxn.reactants[limitingIdx].formula})`);
      setStreak(0);
    }
  };

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPhase('calculate'); setMoleAnswer(''); setMoleFeedback(null);
    setLimitingAnswer(null); setLimitingFeedback(null);
    setReactionProgress(0); particlesRef.current = [];
    setMasses(rxn.reactants.map(r => r.molarMass * r.coeff * (1 + Math.random() * 0.5)));
    setTimeout(drawScene, 50);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Stoichiometry <span className="text-green-400 font-medium">Factory Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Calculate moles, find limiting reagents, and optimise yield</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold">{score} pts</span>
          </div>
          {streak >= 2 && <span className="text-orange-400 text-sm font-bold animate-pulse">🔥 {streak}</span>}
        </div>
      </div>

      {/* Reaction selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {REACTIONS.map((r, i) => (
          <button key={r.id} onClick={() => { setRxnIdx(i); reset(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              rxnIdx === i ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {r.name}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {/* Phase: Calculate */}
      {phase === 'calculate' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mass inputs */}
          <div className="bg-slate-900/60 border border-brand-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest">Reactant Masses</h3>
            {rxn.reactants.map((r, i) => (
              <div key={r.formula}>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                  <span>{r.name} ({r.formula})</span>
                  <span style={{ color: r.color }}>{(masses[i] || 0).toFixed(1)} g · M = {r.molarMass} g/mol</span>
                </div>
                <input type="range" min={r.molarMass * 0.2} max={r.molarMass * r.coeff * 3} step={0.5}
                  value={masses[i] || r.molarMass}
                  onChange={e => { const m = [...masses]; m[i] = Number(e.target.value); setMasses(m); }}
                  className="w-full accent-green-500" />
              </div>
            ))}
            <button onClick={startReaction}
              className="w-full mt-2 py-3 bg-green-500 text-black rounded-xl font-bold uppercase tracking-widest hover:bg-green-400 transition-all flex items-center justify-center gap-2">
              <Beaker size={16} /> React!
            </button>
          </div>

          {/* Mole calc challenge */}
          <div className="bg-slate-900/60 border border-orange-500/20 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">🎯 Calculate Moles</h3>
            <p className="text-slate-400 text-xs mb-3">
              How many moles of {rxn.reactants[0].name} ({rxn.reactants[0].formula}) do you have?
              <br />Mass = {(masses[0] || 0).toFixed(1)} g, Molar mass = {rxn.reactants[0].molarMass} g/mol
            </p>
            <p className="text-slate-500 text-[10px] mb-3 font-mono">n = m ÷ M</p>
            <div className="flex gap-2">
              <input type="number" step="0.001" value={moleAnswer} onChange={e => setMoleAnswer(e.target.value)}
                placeholder="n = ?" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-orange-400 outline-none" />
              <button onClick={checkMoles} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-400 transition-all">Check</button>
            </div>
            <AnimatePresence>
              {moleFeedback && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`mt-3 text-xs font-bold p-2 rounded-lg ${moleFeedback.startsWith('✅') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {moleFeedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Phase: Limiting reagent */}
      {phase === 'limiting' && rxn.reactants.length > 1 && (
        <div className="w-full max-w-lg bg-slate-900/60 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">⚗️ Limiting Reagent Challenge</h3>
          <p className="text-slate-400 text-sm mb-4">Which reactant runs out first and limits the amount of product?</p>
          <div className="flex gap-3">
            {rxn.reactants.map(r => (
              <button key={r.formula} onClick={() => checkLimiting(r.formula)} disabled={!!limitingAnswer}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                  limitingAnswer === r.formula
                    ? limitingFeedback?.startsWith('✅') ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-purple-400'}`}>
                {r.formula}
              </button>
            ))}
          </div>
          {limitingFeedback && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`mt-3 text-xs p-2 rounded-lg ${limitingFeedback.startsWith('✅') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
              {limitingFeedback}
            </motion.div>
          )}
          <button onClick={() => setPhase('result')} className="w-full mt-4 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all">
            See Results →
          </button>
        </div>
      )}
      {phase === 'limiting' && rxn.reactants.length === 1 && (
        <button onClick={() => setPhase('result')} className="px-8 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all">
          See Results →
        </button>
      )}

      {/* Phase: Result */}
      {phase === 'result' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg space-y-4">
          <div className="bg-slate-900/60 border border-brand-border rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Product Mass</div>
                <div className="text-xl font-mono text-green-400 font-bold">{productMass} g</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Yield</div>
                <div className={`text-xl font-mono font-bold ${yieldPct >= 90 ? 'text-green-400' : yieldPct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{yieldPct}%</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Experiments</div>
                <div className="text-xl font-mono text-brand-accent font-bold">{experiments}</div>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-yellow-300 text-xs">🏭 {rxn.ghanaApp}</p>
            </div>
          </div>
          <button onClick={reset} className="w-full py-3 bg-green-500 text-black rounded-xl font-bold uppercase tracking-widest hover:bg-green-400 transition-all flex items-center justify-center gap-2">
            <RotateCcw size={16} /> New Experiment
          </button>
        </motion.div>
      )}

      {/* Exam Note */}
      <div className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge / IB · </span>
        n = m/M (moles = mass ÷ molar mass). The limiting reagent is consumed first and determines the maximum product yield. Conservation of mass: total mass of reactants = total mass of products.
      </div>
    </div>
  );
}

export default function StoichiometryLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <StoichiometrySimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You investigated stoichiometry across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <button onClick={() => setCompletedSession(null)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={STOICHIOMETRY_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
