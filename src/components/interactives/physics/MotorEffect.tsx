import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'me1', question: "Fleming's Left Hand Rule — the thumb represents:", type: 'multiple-choice', options: ['Field direction', 'Current direction', 'Force (thrust/motion)', 'Voltage'], correctAnswer: 'Force (thrust/motion)', explanation: 'Thumb = Thrust (force), First finger = Field, Second finger = Current.' },
  { id: 'me2', question: 'The force on a current-carrying wire in a magnetic field equals:', type: 'multiple-choice', options: ['F = ma', 'F = BIL', 'F = qv', 'F = kx'], correctAnswer: 'F = BIL', explanation: 'Force = Magnetic flux density (B) × Current (I) × Length of wire (L).' },
  { id: 'me3', question: 'If current is reversed, the motor:', type: 'multiple-choice', options: ['Stops', 'Spins the same way', 'Spins in reverse', 'Speeds up'], correctAnswer: 'Spins in reverse', explanation: 'Reversing current reverses the force direction, so the coil rotates the other way.' },
  { id: 'me4', question: 'The split-ring commutator:', type: 'multiple-choice', options: ['Increases voltage', 'Reverses current every half-turn', 'Reduces friction', 'Measures speed'], correctAnswer: 'Reverses current every half-turn', explanation: 'The commutator swaps the current direction every 180° so the coil always turns the same way.' },
  { id: 'me5', question: 'Increasing which variable does NOT increase the motor force?', type: 'multiple-choice', options: ['Current (I)', 'Field strength (B)', 'Wire length (L)', 'Wire resistance (R)'], correctAnswer: 'Wire resistance (R)', explanation: 'F = BIL. Resistance is not in this formula. In fact, higher R reduces current, reducing force.' },
];

export default function MotorEffect() {
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
            {viewMode === 'simulation' && <MotorSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Motor Effect Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">The Motor Effect</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          A <strong className="text-white">current-carrying conductor</strong> placed in a <strong className="text-white">magnetic field</strong> experiences a <strong className="text-green-400">force</strong> perpendicular to both the current and the field.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-xl">F = B × I × L</p>
          <p className="text-slate-400 text-xs mt-1">Force = Flux density × Current × Wire length</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This is the principle behind every <strong className="text-white">electric motor</strong>. By placing a coil of wire in a magnetic field and passing current through it, we create a turning force (torque) that makes the coil spin.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Fleming's Left Hand Rule</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Use your <strong className="text-white">left hand</strong> with three fingers at right angles to find the force direction:
        </p>
        {/* SVG Hand Diagram */}
        <svg viewBox="0 0 300 180" className="w-full max-w-[300px] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="180" fill="#0a0a1a" rx="12" />
          {/* Thumb - Force */}
          <line x1="150" y1="140" x2="150" y2="30" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
          <polygon points="140,40 150,15 160,40" fill="#22c55e" />
          <text x="170" y="35" fill="#22c55e" fontSize="11" fontWeight="bold">Force (F)</text>
          <text x="170" y="48" fill="#22c55e" fontSize="8">👆 Thumb = Thrust</text>
          {/* First finger - Field */}
          <line x1="150" y1="140" x2="280" y2="100" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          <polygon points="270,90 290,98 272,108" fill="#ef4444" />
          <text x="230" y="130" fill="#ef4444" fontSize="11" fontWeight="bold">Field (B)</text>
          <text x="230" y="143" fill="#ef4444" fontSize="8">☝ First = Field (N→S)</text>
          {/* Second finger - Current */}
          <line x1="150" y1="140" x2="40" y2="100" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
          <polygon points="50,90 30,98 48,108" fill="#fbbf24" />
          <text x="10" y="130" fill="#fbbf24" fontSize="11" fontWeight="bold">Current (I)</text>
          <text x="10" y="143" fill="#fbbf24" fontSize="8">✌ Second = Current</text>
          {/* Center label */}
          <circle cx="150" cy="140" r="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        </svg>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">The Split-Ring Commutator</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Without a commutator, the coil would rotate 180° then stop (the forces would balance). The <strong className="text-white">split-ring commutator</strong> solves this:
        </p>
        <ol className="text-sm text-slate-300 space-y-2 list-decimal pl-5">
          <li>Every half-turn, the commutator <strong className="text-white">reverses the current direction</strong> in the coil</li>
          <li>This ensures the forces always push the same way, keeping the coil spinning</li>
          <li>Carbon <strong className="text-white">brushes</strong> maintain electrical contact as the commutator ring rotates</li>
        </ol>
      </div>
    </div>
  );
}

function MotorSim() {
  const [current, setCurrent] = useState(5);
  const [fieldStrength, setFieldStrength] = useState(0.5);
  const [isRunning, setIsRunning] = useState(false);
  const [angle, setAngle] = useState(0);
  const animRef = useRef<number>(0);

  const wireLength = 0.2;
  const force = fieldStrength * Math.abs(current) * wireLength;
  const rpm = force * 200;
  const direction = current >= 0 ? 1 : -1;

  useEffect(() => {
    if (!isRunning || force < 0.01) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const spin = () => {
      setAngle(prev => (prev + direction * force * 3) % 360);
      animRef.current = requestAnimationFrame(spin);
    };
    animRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, force, direction]);

  // Coil visual: project a rectangle rotating around Y-axis
  const rad = (angle * Math.PI) / 180;
  const coilWidth = Math.abs(Math.cos(rad)) * 60;
  const coilColor = Math.sin(rad) > 0 ? '#fbbf24' : '#f97316';

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 480 380" className="w-full max-w-[460px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="380" fill="#0a0a1a" rx="16" />
          <text x="240" y="28" fill="#64748b" fontSize="10" textAnchor="middle">DC Motor — Spinning Coil in Magnetic Field</text>

          {/* Magnets */}
          <rect x="40" y="100" width="55" height="170" fill="#ef4444" rx="6" />
          <text x="67" y="190" fill="white" fontSize="20" textAnchor="middle" fontWeight="bold">N</text>
          <rect x="385" y="100" width="55" height="170" fill="#3b82f6" rx="6" />
          <text x="412" y="190" fill="white" fontSize="20" textAnchor="middle" fontWeight="bold">S</text>

          {/* Field lines */}
          {[130, 155, 185, 215, 240].map(y => (
            <g key={y}>
              <line x1="95" y1={y} x2="385" y2={y} stroke="#475569" strokeWidth="0.5" strokeDasharray="4 3" />
              <polygon points={`240,${y - 3} 246,${y} 240,${y + 3}`} fill="#475569" />
            </g>
          ))}
          <text x="240" y="118" fill="#475569" fontSize="8" textAnchor="middle">B field (N → S) →</text>

          {/* Axle */}
          <line x1="240" y1="100" x2="240" y2="280" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />

          {/* Spinning Coil */}
          <rect x={240 - coilWidth / 2} y="140" width={coilWidth} height="90" fill="none" stroke={coilColor} strokeWidth="4" rx="4" />
          {/* Current direction arrows on coil sides */}
          {coilWidth > 10 && (
            <>
              {/* Left side */}
              <text x={240 - coilWidth / 2 - 8} y="185" fill={current >= 0 ? '#22c55e' : '#ef4444'} fontSize="14" textAnchor="middle">
                {(Math.sin(rad) > 0) === (current >= 0) ? '↑' : '↓'}
              </text>
              {/* Right side */}
              <text x={240 + coilWidth / 2 + 8} y="185" fill={current >= 0 ? '#22c55e' : '#ef4444'} fontSize="14" textAnchor="middle">
                {(Math.sin(rad) > 0) === (current >= 0) ? '↓' : '↑'}
              </text>
            </>
          )}

          {/* Force arrows */}
          {isRunning && force > 0.01 && coilWidth > 10 && (
            <>
              <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity }}>
                <line x1={240 - coilWidth / 2} y1="185" x2={240 - coilWidth / 2} y2={185 - force * 80} stroke="#22c55e" strokeWidth="3" />
                <polygon points={`${240 - coilWidth / 2 - 5},${185 - force * 80 + 8} ${240 - coilWidth / 2},${185 - force * 80} ${240 - coilWidth / 2 + 5},${185 - force * 80 + 8}`} fill="#22c55e" />
              </motion.g>
              <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity }}>
                <line x1={240 + coilWidth / 2} y1="185" x2={240 + coilWidth / 2} y2={185 + force * 80} stroke="#22c55e" strokeWidth="3" />
                <polygon points={`${240 + coilWidth / 2 - 5},${185 + force * 80 - 8} ${240 + coilWidth / 2},${185 + force * 80} ${240 + coilWidth / 2 + 5},${185 + force * 80 - 8}`} fill="#22c55e" />
              </motion.g>
            </>
          )}

          {/* Commutator (split ring at bottom) */}
          <ellipse cx="240" cy="255" rx="15" ry="8" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <line x1="240" y1="247" x2="240" y2="263" stroke="#0a0a1a" strokeWidth="2" />
          <text x="240" y="275" fill="#64748b" fontSize="7" textAnchor="middle">Split-ring commutator</text>

          {/* Brushes */}
          <rect x="218" y="260" width="8" height="15" fill="#475569" rx="1" />
          <rect x="254" y="260" width="8" height="15" fill="#475569" rx="1" />
          <text x="222" y="285" fill="#64748b" fontSize="6" textAnchor="middle">Brush</text>
          <text x="258" y="285" fill="#64748b" fontSize="6" textAnchor="middle">Brush</text>

          {/* LHR quick reference */}
          <g transform="translate(340, 295)">
            <rect x="-5" y="-5" width="100" height="60" rx="6" fill="#1e293b" />
            <text x="45" y="10" fill="#64748b" fontSize="7" textAnchor="middle" fontWeight="bold">Left Hand Rule</text>
            <text x="45" y="24" fill="#22c55e" fontSize="7" textAnchor="middle">👆 Thumb = Force</text>
            <text x="45" y="36" fill="#ef4444" fontSize="7" textAnchor="middle">☝ 1st = Field (N→S)</text>
            <text x="45" y="48" fill="#fbbf24" fontSize="7" textAnchor="middle">✌ 2nd = Current</text>
          </g>

          {/* Readouts */}
          <rect x="20" y="300" width="100" height="50" rx="8" fill="#1e293b" />
          <text x="70" y="318" fill="#22c55e" fontSize="8" textAnchor="middle" fontWeight="bold">FORCE</text>
          <text x="70" y="338" fill="#22c55e" fontSize="16" textAnchor="middle" fontWeight="bold">{force.toFixed(2)} N</text>

          <rect x="130" y="300" width="100" height="50" rx="8" fill="#1e293b" />
          <text x="180" y="318" fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">SPEED</text>
          <text x="180" y="338" fill="#fbbf24" fontSize="16" textAnchor="middle" fontWeight="bold">{isRunning ? rpm.toFixed(0) : '0'} rpm</text>
        </svg>

        {/* Controls */}
        <div className="flex gap-4 items-center flex-wrap justify-center">
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Current (A)</label>
            <input type="range" min="-10" max="10" value={current} onChange={e => setCurrent(Number(e.target.value))} className="w-28 accent-brand-accent" />
            <span className="text-xs text-brand-accent font-mono">{current} A</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Field (T)</label>
            <input type="range" min="0.1" max="2" step="0.1" value={fieldStrength} onChange={e => setFieldStrength(Number(e.target.value))} className="w-28 accent-brand-accent" />
            <span className="text-xs text-brand-accent font-mono">{fieldStrength.toFixed(1)} T</span>
          </div>
          <button onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-3 rounded-xl text-sm font-bold uppercase transition-all ${isRunning ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-brand-accent text-black hover:bg-brand-accent/80'}`}>
            {isRunning ? 'Stop Motor' : 'Start Motor'}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">The Motor Effect</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">A current-carrying conductor in a magnetic field experiences a <strong className="text-green-400">force</strong> perpendicular to both.</p>
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-700 text-center mb-3">
            <p className="text-white font-mono text-lg">F = BIL</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">Direction found by <strong className="text-white">Fleming's Left Hand Rule</strong>. Reversing current or field reverses the force.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">What to Observe</h4>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-3">
            <li>The coil <strong className="text-white">spins continuously</strong> thanks to the commutator</li>
            <li>Reversing current (negative A) <strong className="text-white">reverses rotation</strong></li>
            <li>Higher current or stronger field = <strong className="text-white">faster spin</strong></li>
            <li>Force arrows show opposite directions on each coil side, creating torque</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
