import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'tr1', question: 'A step-up transformer:', type: 'multiple-choice', options: ['Increases voltage, decreases current', 'Increases both voltage and current', 'Decreases voltage', 'Creates energy'], correctAnswer: 'Increases voltage, decreases current', explanation: 'Power is conserved (P = VI). Voltage up → current down.' },
  { id: 'tr2', question: 'Transformers only work with AC because:', type: 'multiple-choice', options: ['DC is dangerous', 'AC creates a changing magnetic flux', 'AC moves faster', 'DC wires are thinner'], correctAnswer: 'AC creates a changing magnetic flux', explanation: "A changing flux is needed to induce an EMF in the secondary (Faraday's Law). DC gives a static field." },
  { id: 'tr3', question: 'Primary: 100 turns, 10V. Secondary: 500 turns. Secondary voltage:', type: 'multiple-choice', options: ['2V', '10V', '50V', '500V'], correctAnswer: '50V', explanation: 'Vs/Vp = Ns/Np → Vs = 10 × (500/100) = 50V.' },
  { id: 'tr4', question: 'Power loss in transmission lines is due to:', type: 'multiple-choice', options: ['High voltage', 'Low voltage', 'P = I²R (current squared × resistance)', 'Gravity'], correctAnswer: 'P = I²R (current squared × resistance)', explanation: 'Heat loss = I²R. Using high voltage (low current) minimises this loss.' },
  { id: 'tr5', question: 'A transformer with 90% efficiency and 100W input gives output power of:', type: 'multiple-choice', options: ['90W', '100W', '110W', '10W'], correctAnswer: '90W', explanation: 'Output = Efficiency × Input = 0.9 × 100 = 90W. 10W lost as heat.' },
];

export default function Transformers() {
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {(['learn', 'simulation', 'quiz'] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === m ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>{m}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'learn' && <LearnPanel />}
            {viewMode === 'simulation' && <TransformerSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Transformers Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LearnPanel() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">How Transformers Work</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          A transformer changes the <strong className="text-white">voltage</strong> of an AC supply. It consists of two coils of wire wound around a shared <strong className="text-white">laminated iron core</strong>.
        </p>
        <ol className="text-sm text-slate-300 space-y-2 list-decimal pl-5 mb-4">
          <li>AC current in the <strong className="text-red-400">primary coil</strong> creates a changing magnetic field</li>
          <li>The iron core carries this changing flux to the <strong className="text-blue-400">secondary coil</strong></li>
          <li>The changing flux induces an EMF in the secondary coil (Faraday's Law)</li>
          <li>The voltage ratio depends on the turns ratio</li>
        </ol>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Transformer Equation</h3>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-blue-400 font-mono text-xl">Vs</span>
              <div className="w-8 h-0.5 bg-slate-600"></div>
              <span className="text-red-400 font-mono text-xl">Vp</span>
            </div>
            <span className="text-white text-2xl">=</span>
            <div className="flex flex-col items-center">
              <span className="text-blue-400 font-mono text-xl">Ns</span>
              <div className="w-8 h-0.5 bg-slate-600"></div>
              <span className="text-red-400 font-mono text-xl">Np</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl">
            <p className="text-green-400 text-xs font-bold">Step-Up (Ns &gt; Np)</p>
            <p className="text-slate-300 text-xs mt-1">Voltage increases, current decreases</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl">
            <p className="text-amber-400 text-xs font-bold">Step-Down (Ns &lt; Np)</p>
            <p className="text-slate-300 text-xs mt-1">Voltage decreases, current increases</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">The National Grid</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Power stations generate electricity at ~25kV. <strong className="text-white">Step-up transformers</strong> boost this to 400kV for transmission. Near homes, <strong className="text-white">step-down transformers</strong> reduce it to 230V.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-white font-mono mb-1">P<sub>loss</sub> = I² × R</p>
          <p className="text-slate-400 text-xs">High voltage → low current → minimal heat loss in wires</p>
        </div>
      </div>
    </div>
  );
}

function TransformerSim() {
  const [primaryTurns, setPrimaryTurns] = useState(10);
  const [secondaryTurns, setSecondaryTurns] = useState(20);
  const [efficiency, setEfficiency] = useState(100);
  const primaryVoltage = 12;

  const ratio = secondaryTurns / primaryTurns;
  const secondaryVoltage = primaryVoltage * ratio;
  const isStepUp = ratio > 1;
  const isStepDown = ratio < 1;

  const primaryCurrent = 2;
  const powerIn = primaryVoltage * primaryCurrent;
  const powerOut = powerIn * (efficiency / 100);
  const secondaryCurrent = powerOut / secondaryVoltage;
  const heatLoss = powerIn - powerOut;

  // AC waveform points
  const wavePoints = (amplitude: number, phase: number = 0) => {
    const pts: string[] = [];
    for (let x = 0; x <= 120; x += 2) {
      const y = 30 - Math.sin((x / 120) * 4 * Math.PI + phase) * amplitude;
      pts.push(`${x + 5},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 480 320" className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="320" fill="#0a0a1a" rx="16" />

          {/* Type Label */}
          <rect x="175" y="8" width="130" height="26" fill="#1e293b" rx="13" />
          <text x="240" y="25" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">
            {isStepUp ? '⬆ STEP-UP' : isStepDown ? '⬇ STEP-DOWN' : '= ISOLATION'}
          </text>

          {/* Iron Core */}
          <path d="M 120 70 L 360 70 L 360 230 L 120 230 Z" fill="none" stroke="#475569" strokeWidth="38" strokeLinejoin="round" />
          <path d="M 120 70 L 360 70 L 360 230 L 120 230 Z" fill="none" stroke="#334155" strokeWidth="34" strokeLinejoin="round" />
          <text x="240" y="155" fill="#64748b" fontSize="9" textAnchor="middle">Iron Core</text>

          {/* Flux animation */}
          <motion.path d="M 120 70 L 360 70 L 360 230 L 120 230 Z" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 8"
            animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} opacity="0.5" />

          {/* Primary Coil */}
          {Array.from({ length: Math.min(primaryTurns, 15) }).map((_, i) => (
            <ellipse key={`p-${i}`} cx="120" cy={95 + i * (110 / Math.max(1, Math.min(primaryTurns, 15) - 1))} rx="30" ry="9" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          ))}
          <text x="55" y="130" fill="#ef4444" fontSize="9" fontWeight="bold">Primary</text>
          <text x="55" y="145" fill="#fca5a5" fontSize="8">{primaryTurns} turns</text>
          <text x="55" y="160" fill="#fca5a5" fontSize="8">{primaryVoltage}V AC</text>
          <text x="55" y="175" fill="#fca5a5" fontSize="8">{primaryCurrent.toFixed(1)}A</text>

          {/* Secondary Coil */}
          {Array.from({ length: Math.min(secondaryTurns, 15) }).map((_, i) => (
            <ellipse key={`s-${i}`} cx="360" cy={95 + i * (110 / Math.max(1, Math.min(secondaryTurns, 15) - 1))} rx="30" ry="9" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          ))}
          <text x="425" y="130" fill="#3b82f6" fontSize="9" fontWeight="bold">Secondary</text>
          <text x="425" y="145" fill="#93c5fd" fontSize="8">{secondaryTurns} turns</text>
          <text x="425" y="160" fill="#93c5fd" fontSize="8">{secondaryVoltage.toFixed(1)}V AC</text>
          <text x="425" y="175" fill="#93c5fd" fontSize="8">{secondaryCurrent.toFixed(2)}A</text>

          {/* AC Source */}
          <circle cx="120" cy="270" r="15" fill="none" stroke="#ef4444" strokeWidth="2" />
          <path d="M 110 270 Q 115 260 120 270 T 130 270" fill="none" stroke="#ef4444" strokeWidth="2" />
          <path d="M 120 230 L 120 255" stroke="#ef4444" strokeWidth="2" />

          {/* Load */}
          <circle cx="360" cy="270" r="15" fill={`rgba(251, 191, 36, ${Math.min(1, secondaryVoltage / 40)})`} stroke="#3b82f6" strokeWidth="2" />
          <text x="360" y="274" fill={secondaryVoltage > 10 ? 'black' : '#94a3b8'} fontSize="12" textAnchor="middle">💡</text>
          <path d="M 360 230 L 360 255" stroke="#3b82f6" strokeWidth="2" />

          {/* Heat loss indicator */}
          {heatLoss > 0.1 && (
            <g>
              <text x="240" y="245" fill="#ef4444" fontSize="8" textAnchor="middle">🔥 Heat loss: {heatLoss.toFixed(1)}W</text>
            </g>
          )}
        </svg>

        {/* AC Waveform comparison */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[460px]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Primary Waveform</p>
            <svg viewBox="0 0 130 60" className="w-full" xmlns="http://www.w3.org/2000/svg">
              <rect width="130" height="60" fill="#0a0a1a" rx="4" />
              <line x1="5" y1="30" x2="125" y2="30" stroke="#334155" strokeWidth="0.5" />
              <polyline points={wavePoints(20)} fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <text x="65" y="55" fill="#ef4444" fontSize="7" textAnchor="middle">{primaryVoltage}V peak</text>
            </svg>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Secondary Waveform</p>
            <svg viewBox="0 0 130 60" className="w-full" xmlns="http://www.w3.org/2000/svg">
              <rect width="130" height="60" fill="#0a0a1a" rx="4" />
              <line x1="5" y1="30" x2="125" y2="30" stroke="#334155" strokeWidth="0.5" />
              <polyline points={wavePoints(Math.min(25, 20 * ratio))} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="65" y="55" fill="#3b82f6" fontSize="7" textAnchor="middle">{secondaryVoltage.toFixed(1)}V peak</text>
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 flex-wrap justify-center">
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Primary Turns (Np)</label>
            <input type="range" min="5" max="30" value={primaryTurns} onChange={e => setPrimaryTurns(Number(e.target.value))} className="w-24 accent-red-500" />
            <span className="text-xs text-red-400 font-mono">{primaryTurns}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Secondary Turns (Ns)</label>
            <input type="range" min="5" max="30" value={secondaryTurns} onChange={e => setSecondaryTurns(Number(e.target.value))} className="w-24 accent-blue-500" />
            <span className="text-xs text-blue-400 font-mono">{secondaryTurns}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Efficiency (%)</label>
            <input type="range" min="70" max="100" value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} className="w-24 accent-amber-500" />
            <span className="text-xs text-amber-400 font-mono">{efficiency}%</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Live Verification</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-400">Vs/Vp = <span className="text-white font-mono">{secondaryVoltage.toFixed(1)}/{primaryVoltage} = {ratio.toFixed(2)}</span></p>
              <p className="text-slate-400">Ns/Np = <span className="text-white font-mono">{secondaryTurns}/{primaryTurns} = {ratio.toFixed(2)}</span></p>
              <p className="text-green-400 text-xs mt-1">✓ Ratios match</p>
            </div>
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-slate-400">P<sub>in</sub> = <span className="text-white font-mono">{powerIn.toFixed(1)}W</span></p>
              <p className="text-slate-400">P<sub>out</sub> = <span className="text-white font-mono">{powerOut.toFixed(1)}W</span></p>
              {heatLoss > 0.1 && <p className="text-red-400 text-xs mt-1">Heat loss = {heatLoss.toFixed(1)}W</p>}
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Power Grid Application</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Power stations use <strong className="text-white">step-up</strong> transformers to send electricity at <strong className="text-white">400,000V</strong>. This means very <strong className="text-white">low current</strong>, minimising heat loss (P = I²R) in the long transmission wires. Near your home, <strong className="text-white">step-down</strong> transformers reduce it to a safe 230V.
          </p>
        </div>
      </div>
    </div>
  );
}
