import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'entropy' | 'enthalpy' | 'gibbs' | 'quiz';

const TABS = [
  { id: 'entropy' as ViewMode, label: 'Entropy', icon: '🧊' },
  { id: 'enthalpy' as ViewMode, label: 'Enthalpy', icon: '🔥' },
  { id: 'gibbs' as ViewMode, label: 'Gibbs', icon: '⚖️' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'es1', question: 'Entropy measures:', type: 'multiple-choice', options: ['Total heat', 'Disorder/randomness', 'Reaction speed', 'Activation energy'], correctAnswer: 'Disorder/randomness', explanation: 'Entropy measures how many arrangements, or microstates, are available.' },
  { id: 'es2', question: 'A reaction is always spontaneous if:', type: 'multiple-choice', options: ['ΔH > 0, ΔS > 0', 'ΔH < 0, ΔS > 0', 'ΔH > 0, ΔS < 0', 'ΔH < 0, ΔS < 0'], correctAnswer: 'ΔH < 0, ΔS > 0', explanation: 'ΔG = ΔH - TΔS is always negative in this case.' },
  { id: 'es3', question: 'Ice melting is:', type: 'multiple-choice', options: ['Endothermic, ΔS > 0', 'Exothermic, ΔS < 0', 'Endothermic, ΔS < 0', 'Exothermic, ΔS > 0'], correctAnswer: 'Endothermic, ΔS > 0', explanation: 'Melting absorbs heat and increases particle disorder.' },
];

export default function EntropySpontaneity() {
  const [viewMode, setViewMode] = useState<ViewMode>('entropy');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">🧪 Entropy & Spontaneity</h2>
          <p className="text-xs text-slate-500 mt-0.5">Disorder, heat flow, and Gibbs free energy</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor={viewMode === 'enthalpy' ? 'orange' : viewMode === 'gibbs' ? 'green' : 'cyan'} />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            {viewMode === 'entropy' && <EntropyBox />}
            {viewMode === 'enthalpy' && <EnthalpyDiagram />}
            {viewMode === 'gibbs' && <GibbsBalance />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Entropy & Gibbs Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function EntropyBox() {
  const [temperature, setTemperature] = useState(320);
  const [order, setOrder] = useState(70);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleBox(canvasRef, temperature, order);
  const entropy = Math.min(100, temperature * 0.11 + (100 - order) * 0.65);

  return (
    <SimGrid>
      <Board>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Particle Box: Solid Lattice to Gas</div>
        <canvas ref={canvasRef} width={560} height={340} className="w-full rounded-2xl border border-slate-800 bg-[#07111b]" />
      </Board>
      <Control>
        <StemSlider label="Temperature" value={temperature} min={80} max={900} unit=" K" color="orange" onChange={setTemperature} />
        <StemSlider label="Lattice order" value={order} min={0} max={100} unit="%" color="cyan" onChange={setOrder} />
        <Readout label="Entropy estimate" value={`${entropy.toFixed(0)}%`} color="text-cyan-300" />
        <p className="text-sm text-slate-400 leading-relaxed">Ordered, cool particles occupy fewer microstates. Heating breaks the lattice and increases the number of possible arrangements.</p>
      </Control>
    </SimGrid>
  );
}

function EnthalpyDiagram() {
  const [reaction, setReaction] = useState<'exo' | 'endo'>('exo');
  const [activation, setActivation] = useState(62);
  const productY = reaction === 'exo' ? 230 : 90;
  const reactantY = reaction === 'exo' ? 105 : 230;
  const peakY = Math.max(35, Math.min(145, reactantY - activation * 1.2));
  const deltaH = reaction === 'exo' ? -85 : 72;

  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 340" className="w-full rounded-2xl bg-[#120d0a]">
          <line x1="65" y1="285" x2="505" y2="285" stroke="#475569" />
          <line x1="65" y1="40" x2="65" y2="285" stroke="#475569" />
          <text x="28" y="164" fill="#64748b" fontSize="11" transform="rotate(-90 28 164)" textAnchor="middle">Potential energy</text>
          <path d={`M 80 ${reactantY} C 190 ${reactantY} 206 ${peakY} 278 ${peakY} S 360 ${productY} 485 ${productY}`} fill="none" stroke={reaction === 'exo' ? '#22c55e' : '#fb923c'} strokeWidth="5" strokeLinecap="round" />
          <line x1="78" y1={reactantY} x2="160" y2={reactantY} stroke="#e2e8f0" strokeDasharray="4 6" />
          <line x1="405" y1={productY} x2="490" y2={productY} stroke="#e2e8f0" strokeDasharray="4 6" />
          <motion.line x1="230" y1={reactantY} x2="230" y2={peakY} stroke="#facc15" strokeWidth="4" animate={{ y1: reactantY, y2: peakY }} />
          <text x="246" y={(reactantY + peakY) / 2} fill="#fde68a" fontSize="11">Ea</text>
          <motion.line x1="518" y1={reactantY} x2="518" y2={productY} stroke="#f472b6" strokeWidth="4" animate={{ y1: reactantY, y2: productY }} />
          <text x="522" y={(reactantY + productY) / 2} fill="#f9a8d4" fontSize="11">ΔH {deltaH} kJ</text>
          <text x="118" y={reactantY - 12} fill="#e2e8f0" fontSize="11">Reactants</text>
          <text x="420" y={productY - 12} fill="#e2e8f0" fontSize="11">Products</text>
        </svg>
      </Board>
      <Control>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setReaction('exo')} className={`rounded-xl px-3 py-2 text-xs font-bold uppercase ${reaction === 'exo' ? 'bg-green-400 text-black' : 'bg-slate-800 text-slate-400'}`}>Exothermic</button>
          <button onClick={() => setReaction('endo')} className={`rounded-xl px-3 py-2 text-xs font-bold uppercase ${reaction === 'endo' ? 'bg-orange-400 text-black' : 'bg-slate-800 text-slate-400'}`}>Endothermic</button>
        </div>
        <StemSlider label="Activation barrier" value={activation} min={15} max={100} unit="%" color="yellow" onChange={setActivation} />
        <Readout label="Heat effect" value={reaction === 'exo' ? 'Released' : 'Absorbed'} color={reaction === 'exo' ? 'text-green-300' : 'text-orange-300'} />
        <p className="text-sm text-slate-400 leading-relaxed">Activation energy controls how hard it is to start the reaction. ΔH compares products with reactants after the reaction path is complete.</p>
      </Control>
    </SimGrid>
  );
}

function GibbsBalance() {
  const [deltaH, setDeltaH] = useState(45);
  const [deltaS, setDeltaS] = useState(0.18);
  const [temp, setTemp] = useState(298);
  const tds = temp * deltaS;
  const deltaG = deltaH - tds;
  const spontaneous = deltaG < 0;
  const tilt = Math.max(-12, Math.min(12, deltaG / 8));

  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 340" className="w-full rounded-2xl bg-[#07120d]">
          <text x="280" y="38" fill="#86efac" fontSize="16" textAnchor="middle" fontWeight="bold">ΔG = ΔH - TΔS</text>
          <motion.g style={{ transformOrigin: '280px 180px' }} animate={{ rotate: tilt }}>
            <rect x="145" y="171" width="270" height="14" rx="7" fill="#94a3b8" />
            <circle cx="280" cy="178" r="20" fill="#22c55e" />
            <motion.circle cx="165" cy="178" r={Math.max(18, Math.abs(deltaH) * 0.42)} fill="#fb923c" opacity="0.75" />
            <motion.circle cx="395" cy="178" r={Math.max(18, Math.abs(tds) * 0.42)} fill="#38bdf8" opacity="0.75" />
          </motion.g>
          <text x="165" y="255" fill="#fb923c" fontSize="13" textAnchor="middle">ΔH: {deltaH.toFixed(0)}</text>
          <text x="395" y="255" fill="#38bdf8" fontSize="13" textAnchor="middle">TΔS: {tds.toFixed(0)}</text>
          <rect x="170" y="280" width="220" height="34" rx="17" fill={spontaneous ? '#14532d' : '#451a1a'} stroke={spontaneous ? '#22c55e' : '#ef4444'} />
          <text x="280" y="302" fill={spontaneous ? '#86efac' : '#fca5a5'} fontSize="14" textAnchor="middle" fontWeight="bold">{spontaneous ? 'SPONTANEOUS' : 'NON-SPONTANEOUS'} ΔG = {deltaG.toFixed(1)}</text>
        </svg>
      </Board>
      <Control>
        <StemSlider label="ΔH" value={deltaH} min={-120} max={160} unit=" kJ/mol" color="orange" onChange={setDeltaH} />
        <StemSlider label="ΔS" value={deltaS} min={-0.35} max={0.45} step={0.01} unit=" kJ/K" color="cyan" onChange={setDeltaS} />
        <StemSlider label="Temperature" value={temp} min={100} max={900} unit=" K" color="yellow" onChange={setTemp} />
        <Readout label="ΔG" value={`${deltaG.toFixed(1)} kJ/mol`} color={spontaneous ? 'text-green-300' : 'text-red-300'} />
      </Control>
    </SimGrid>
  );
}

function useParticleBox(canvasRef: React.RefObject<HTMLCanvasElement | null>, temperature: number, order: number) {
  const particles = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  useEffect(() => {
    particles.current = Array.from({ length: 80 }, (_, i) => {
      const col = i % 10;
      const row = Math.floor(i / 10);
      return { x: 90 + col * 42, y: 58 + row * 31, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    const speed = temperature / 300;
    const latticePull = order / 100;
    const draw = () => {
      ctx.fillStyle = '#07111b';
      ctx.fillRect(0, 0, 560, 340);
      particles.current.forEach((p, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const tx = 90 + col * 42;
        const ty = 58 + row * 31;
        p.vx += (Math.random() - 0.5) * 0.18 * speed;
        p.vy += (Math.random() - 0.5) * 0.18 * speed;
        p.x += p.vx * speed + (tx - p.x) * 0.02 * latticePull;
        p.y += p.vy * speed + (ty - p.y) * 0.02 * latticePull;
        if (p.x < 18 || p.x > 542) p.vx *= -1;
        if (p.y < 18 || p.y > 322) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = order > 55 ? '#38bdf8' : temperature > 600 ? '#fb7185' : '#facc15';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, temperature, order]);
}

function SimGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.25fr,0.75fr]">{children}</div>;
}

function Board({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">{children}</div>;
}

function Control({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">{children}</div>;
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="rounded-2xl border border-slate-800 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p><p className={`text-2xl font-mono font-bold ${color}`}>{value}</p></div>;
}
