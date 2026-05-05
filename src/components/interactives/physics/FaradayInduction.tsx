import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'fi1', question: 'Moving a magnet into a coil induces:', type: 'multiple-choice', options: ['A magnetic field', 'An EMF (voltage)', 'A permanent magnet', 'Nothing'], correctAnswer: 'An EMF (voltage)', explanation: "A changing magnetic flux through a coil induces an electromotive force (Faraday's Law)." },
  { id: 'fi2', question: "Lenz's Law states the induced current:", type: 'multiple-choice', options: ['Aids the change', 'Opposes the change causing it', 'Is always clockwise', 'Is zero'], correctAnswer: 'Opposes the change causing it', explanation: 'The induced current creates a field opposing the flux change — conservation of energy.' },
  { id: 'fi3', question: 'To increase the induced EMF, you can:', type: 'multiple-choice', options: ['Move slower', 'Use fewer coils', 'Move faster or use more turns', 'Use a weaker magnet'], correctAnswer: 'Move faster or use more turns', explanation: 'EMF = -N × dΦ/dt. More turns (N) or faster flux change (dΦ/dt) increases voltage.' },
  { id: 'fi4', question: 'A generator works by:', type: 'multiple-choice', options: ['Using electricity to spin a coil', 'Rotating a coil in a magnetic field to induce EMF', 'Heating a wire', 'Compressing gas'], correctAnswer: 'Rotating a coil in a magnetic field to induce EMF', explanation: 'A generator converts mechanical energy to electrical energy using electromagnetic induction.' },
  { id: 'fi5', question: 'If you push a N-pole into a coil, the near face of the coil becomes:', type: 'multiple-choice', options: ['South pole (attracts)', 'North pole (repels)', 'Neutral', 'South then North'], correctAnswer: 'North pole (repels)', explanation: "Lenz's Law: the coil opposes the approaching N-pole by becoming a N-pole itself (repulsion)." },
];

export default function FaradayInduction() {
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
            {viewMode === 'simulation' && <InductionSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Faraday's Induction Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">What is Electromagnetic Induction?</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          When the <strong className="text-white">magnetic flux</strong> through a conductor changes, an <strong className="text-brand-accent">electromotive force (EMF)</strong> is induced. This is the principle behind every generator, dynamo, and transformer on Earth.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          <strong className="text-white">Magnetic flux (Φ)</strong> is a measure of how much magnetic field passes through a surface. It depends on: the field strength (B), the area of the coil (A), and the angle between the field and the coil.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">Φ = B × A × cos(θ)</p>
          <p className="text-slate-400 text-xs mt-1">Flux = Field strength × Area × cos(angle)</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Faraday's Law</h3>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-xl">ε = −N × dΦ/dt</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">The induced EMF (ε) equals the <strong className="text-white">negative</strong> of the number of turns (N) times the rate of change of flux (dΦ/dt).</p>
        <ul className="text-sm text-slate-300 space-y-2 list-disc pl-5 marker:text-brand-accent">
          <li><strong className="text-white">More turns</strong> → more EMF (each turn contributes)</li>
          <li><strong className="text-white">Faster movement</strong> → greater dΦ/dt → more EMF</li>
          <li><strong className="text-white">Stronger magnet</strong> → more flux → more EMF</li>
          <li>The <strong className="text-white">negative sign</strong> is Lenz's Law</li>
        </ul>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Lenz's Law</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          The induced current always flows in a direction that <strong className="text-red-400">opposes</strong> the change causing it. This is a consequence of <strong className="text-white">conservation of energy</strong>.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
            <p className="text-red-400 text-xs font-bold mb-1">N-pole approaching →</p>
            <p className="text-slate-300 text-xs">Coil face becomes N (repels approaching magnet)</p>
            <p className="text-slate-500 text-[10px] mt-1">Current flows to create an opposing field</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl">
            <p className="text-blue-400 text-xs font-bold mb-1">← N-pole retreating</p>
            <p className="text-slate-300 text-xs">Coil face becomes S (attracts departing magnet)</p>
            <p className="text-slate-500 text-[10px] mt-1">Current reverses to try to maintain flux</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InductionSim() {
  const [magnetX, setMagnetX] = useState(120);
  const [turns, setTurns] = useState(5);
  const lastX = useRef(120);
  const isDragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const coilCX = 280;
  const distance = Math.abs(magnetX - coilCX);
  const velocity = magnetX - lastX.current;
  const flux = turns * Math.max(0, 1 - distance / 200);
  const emf = Math.min(100, Math.abs(velocity) * turns * 2 / Math.max(30, distance));
  const bulbBrightness = Math.min(1, emf / 40);

  // Galvanometer needle angle: -45 to +45 degrees based on velocity direction
  const needleAngle = Math.max(-45, Math.min(45, velocity * 5));

  // Lenz's Law: coil face polarity
  const lenzLabel = Math.abs(velocity) < 1 ? '' : velocity > 0 ? 'N (repels)' : 'S (attracts)';
  const lenzColor = velocity > 0 ? '#ef4444' : '#3b82f6';

  const handlePointerDown = () => { isDragging.current = true; };
  const handlePointerUp = () => { isDragging.current = false; lastX.current = magnetX; };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    lastX.current = magnetX;
    setMagnetX(Math.max(40, Math.min(460, x)));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg ref={svgRef} viewBox="0 0 500 380" className="w-full max-w-[480px] cursor-grab active:cursor-grabbing select-none touch-none"
          onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
          <rect width="500" height="380" fill="#0a0a1a" rx="16" />

          {/* Instructions */}
          <text x="250" y="22" fill="#64748b" fontSize="10" textAnchor="middle">← Drag the magnet through the coil →</text>

          {/* Coil */}
          {Array.from({ length: turns }).map((_, i) => {
            const cx = coilCX + i * 6 - (turns * 3);
            return <ellipse key={i} cx={cx} cy="180" rx="8" ry="55" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />;
          })}
          <text x={coilCX} y="250" fill="#f59e0b" fontSize="9" textAnchor="middle">{turns} turns</text>

          {/* Lenz's Law face label */}
          {lenzLabel && (
            <g>
              <rect x={coilCX - turns * 3 - 40} y="165" width="30" height="30" rx="4" fill={lenzColor} opacity="0.2" />
              <text x={coilCX - turns * 3 - 25} y="184" fill={lenzColor} fontSize="8" textAnchor="middle" fontWeight="bold">{lenzLabel}</text>
            </g>
          )}

          {/* Magnet */}
          <g onPointerDown={handlePointerDown} style={{ cursor: 'grab' }}>
            <rect x={magnetX - 40} y="155" width="40" height="50" fill="#ef4444" rx="4" />
            <rect x={magnetX} y="155" width="40" height="50" fill="#3b82f6" rx="4" />
            <text x={magnetX - 20} y="184" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">N</text>
            <text x={magnetX + 20} y="184" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">S</text>
          </g>

          {/* Flux arrows inside coil */}
          {flux > 0.1 && [160, 175, 190, 205].map(y => (
            <motion.g key={y} animate={{ opacity: [0.2, flux * 0.8, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <line x1={coilCX - 15} y1={y} x2={coilCX + 15} y2={y} stroke="#f59e0b" strokeWidth="1" />
              <polygon points={`${coilCX + 12},${y - 2} ${coilCX + 16},${y} ${coilCX + 12},${y + 2}`} fill="#f59e0b" />
            </motion.g>
          ))}

          {/* Field lines when moving */}
          {Math.abs(velocity) > 1 && [145, 165, 195, 215].map(y => (
            <motion.line key={y} x1={magnetX + 42} y1={y} x2={coilCX - 30} y2={y}
              stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4 4"
              animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 0.5, repeat: Infinity }} />
          ))}

          {/* Wire to galvanometer */}
          <path d={`M ${coilCX - turns * 3 - 8} 125 L ${coilCX - turns * 3 - 8} 50 L 420 50 L 420 80`} stroke="#94a3b8" strokeWidth="1.5" fill="none" />
          <path d={`M ${coilCX + turns * 3 + 8} 235 L ${coilCX + turns * 3 + 8} 320 L 420 320 L 420 160`} stroke="#94a3b8" strokeWidth="1.5" fill="none" />

          {/* Galvanometer */}
          <circle cx="420" cy="120" r="30" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          {/* Scale markings */}
          {[-40, -20, 0, 20, 40].map(deg => {
            const rad = (deg - 90) * Math.PI / 180;
            const x1 = 420 + Math.cos(rad) * 24;
            const y1 = 120 + Math.sin(rad) * 24;
            const x2 = 420 + Math.cos(rad) * 28;
            const y2 = 120 + Math.sin(rad) * 28;
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="1" />;
          })}
          <text x="395" y="110" fill="#64748b" fontSize="6">-</text>
          <text x="443" y="110" fill="#64748b" fontSize="6">+</text>
          <text x="420" y="106" fill="#64748b" fontSize="6" textAnchor="middle">0</text>
          {/* Needle */}
          <motion.line x1="420" y1="120" x2="420" y2="95"
            stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
            style={{ transformOrigin: '420px 120px' }}
            animate={{ rotate: needleAngle }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }} />
          <circle cx="420" cy="120" r="3" fill="#ef4444" />
          <text x="420" y="155" fill="#64748b" fontSize="7" textAnchor="middle">GALVANOMETER</text>

          {/* EMF readout */}
          <text x="420" y="172" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">{emf.toFixed(1)} mV</text>

          {/* Flux readout */}
          <rect x="15" y="300" width="130" height="55" rx="8" fill="#1e293b" />
          <text x="80" y="318" fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="bold">FLUX (Φ)</text>
          <text x="80" y="340" fill="#f59e0b" fontSize="18" textAnchor="middle" fontWeight="bold">{flux.toFixed(2)}</text>
          <text x="80" y="352" fill="#64748b" fontSize="7" textAnchor="middle">Wb (arbitrary)</text>

          {/* Velocity indicator */}
          <rect x="160" y="300" width="130" height="55" rx="8" fill="#1e293b" />
          <text x="225" y="318" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">VELOCITY</text>
          <text x="225" y="340" fill={Math.abs(velocity) > 1 ? '#22c55e' : '#64748b'} fontSize="18" textAnchor="middle" fontWeight="bold">{Math.abs(velocity).toFixed(0)}</text>
          <text x="225" y="352" fill="#64748b" fontSize="7" textAnchor="middle">{velocity > 1 ? '→ approaching' : velocity < -1 ? '← retreating' : 'stationary'}</text>

          {/* Status */}
          <text x="250" y="372" fill="#475569" fontSize="8" textAnchor="middle">
            {Math.abs(velocity) < 1 ? 'No flux change — no EMF induced' : velocity > 0 ? 'N-pole approaching coil → opposing N-pole induced (repels)' : 'N-pole retreating → S-pole induced (attracts)'}
          </text>
        </svg>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 uppercase">Coil Turns</span>
          <input type="range" min="2" max="12" value={turns} onChange={e => setTurns(Number(e.target.value))} className="w-24 accent-brand-accent" />
          <span className="text-xs text-brand-accent font-mono">{turns}</span>
        </div>
      </div>

      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Faraday's Law</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">An EMF is induced whenever the <strong className="text-white">magnetic flux</strong> through a conductor changes.</p>
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-700 text-center mb-3">
            <p className="text-white font-mono">ε = −N × dΦ/dt</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">The negative sign is <strong className="text-white">Lenz's Law</strong> — the induced current opposes the change causing it.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">What to Observe</h4>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-3">
            <li>Galvanometer needle swings <strong className="text-white">left</strong> when approaching, <strong className="text-white">right</strong> when retreating</li>
            <li>Faster dragging = larger EMF and brighter needle swing</li>
            <li>More turns = stronger induced EMF for same speed</li>
            <li>When stationary, no flux change = <strong className="text-white">zero EMF</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
