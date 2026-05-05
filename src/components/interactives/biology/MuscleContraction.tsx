import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'sliding' | 'junction' | 'energy' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'mc1', question: 'Which ion exposes binding sites on actin?', type: 'multiple-choice', options: ['Na+', 'K+', 'Ca2+', 'Cl-'], correctAnswer: 'Ca2+', explanation: 'Ca2+ binds to troponin, shifting tropomyosin away from the myosin-binding sites on actin.' },
  { id: 'mc2', question: 'Energy for the power stroke comes from:', type: 'multiple-choice', options: ['Glucose', 'ATP', 'GTP', 'NADH'], correctAnswer: 'ATP', explanation: 'ATP hydrolysis cocks the myosin head. ADP release triggers the power stroke.' },
  { id: 'mc3', question: 'During contraction, which bands shorten?', type: 'multiple-choice', options: ['A-band only', 'I-band and H-zone', 'Z-lines only', 'All bands'], correctAnswer: 'I-band and H-zone', explanation: 'The A-band stays constant (myosin length unchanged). The I-band (actin only) and H-zone (myosin only) shorten as filaments overlap more.' },
];

const TABS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'sliding', label: 'Sliding Filament', icon: '⚡' },
  { id: 'junction', label: 'NMJ', icon: '🔌' },
  { id: 'energy', label: 'Energy', icon: '📊' },
  { id: 'quiz', label: 'Quiz', icon: '🧠' },
];

export default function MuscleContraction() {
  const [viewMode, setViewMode] = useState<ViewMode>('sliding');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">💪 Muscle Contraction</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sliding Filament Theory — WAEC Biology</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="pink" />
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {viewMode === 'sliding' && <SlidingFilament />}
            {viewMode === 'junction' && <NeuromuscularJunction />}
            {viewMode === 'energy' && <EnergyFatigue />}
            {viewMode === 'quiz' && (
              <div className="max-w-xl mx-auto">
                <QuizMode questions={QUIZ} title="Muscle Contraction Quiz" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Particles ─────────────────────────────── */
interface Particle { id: number; cx: number; cy: number; delay: number; }

function useParticles(active: boolean): Particle[] {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<number>(0);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const emit = () => {
      const newP: Particle = {
        id: idRef.current++,
        cx: 90 + Math.random() * 320,
        cy: 120 + Math.random() * 60,
        delay: 0,
      };
      setParticles(prev => [...prev.slice(-18), newP]);
    };
    timerRef.current = window.setInterval(emit, 140);
    return () => clearInterval(timerRef.current);
  }, [active]);

  return particles;
}

/* ─── Main Simulation ───────────────────────── */
function SlidingFilament() {
  const [contracted, setContracted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<number>(0);
  const particles = useParticles(contracted);

  const offset = contracted ? 28 : 0;

  // Fill-ring while held
  const startHold = () => {
    setContracted(true);
    setHoldProgress(0);
    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress(p => Math.min(1, p + 0.025));
    }, 40);
  };
  const endHold = () => {
    setContracted(false);
    setHoldProgress(0);
    clearInterval(holdIntervalRef.current);
  };

  const springOffset = useSpring(offset, { stiffness: 200, damping: 22 });
  useEffect(() => { springOffset.set(offset); }, [offset, springOffset]);

  // Ring circumference
  const R = 38;
  const circ = 2 * Math.PI * R;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      {/* SVG Sarcomere */}
      <div className="flex-1 flex flex-col items-center gap-5">
        <svg viewBox="0 0 500 310" className="w-full max-w-[500px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="310" fill="#06090f" rx="18" />

          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f1825" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="310" fill="url(#grid)" rx="18" />

          {/* Sarcomere background glow */}
          {contracted && (
            <motion.ellipse
              cx={250} cy={150}
              rx={180} ry={70}
              fill="rgba(244,114,182,0.06)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5] }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Z-lines */}
          <motion.line
            x1={80} y1="55" x2={80} y2="250" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round"
            animate={{ x1: 80 + offset, x2: 80 + offset }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          />
          <motion.line
            x1={420} y1="55" x2={420} y2="250" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round"
            animate={{ x1: 420 - offset, x2: 420 - offset }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          />
          {/* Z-line glow */}
          {contracted && (
            <>
              <motion.line x1={80 + offset} y1="55" x2={80 + offset} y2="250"
                stroke="#c084fc" strokeWidth="8" strokeLinecap="round" opacity={0.18}
                animate={{ opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <motion.line x1={420 - offset} y1="55" x2={420 - offset} y2="250"
                stroke="#c084fc" strokeWidth="8" strokeLinecap="round" opacity={0.18}
                animate={{ opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            </>
          )}
          <motion.text x={80 + offset} y="48" fill="#a855f7" fontSize="8.5" textAnchor="middle" fontWeight="bold"
            animate={{ x: 80 + offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
            Z-line
          </motion.text>
          <motion.text x={420 - offset} y="48" fill="#a855f7" fontSize="8.5" textAnchor="middle" fontWeight="bold"
            animate={{ x: 420 - offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
            Z-line
          </motion.text>

          {/* Actin (thin filaments) — upper set from left Z */}
          <motion.g animate={{ x: offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <g key={`at${i}`}>
                <circle cx={86 + i * 17} cy={108} r="7.5" fill="#3b82f6" opacity={0.75} />
                {i > 0 && (
                  <line x1={86 + (i-1)*17 + 7} y1="108" x2={86 + i*17 - 7} y2="108"
                    stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
                )}
              </g>
            ))}
            <text x="168" y="93" fill="#60a5fa" fontSize="8" fontWeight="bold">Actin (thin)</text>
          </motion.g>

          {/* Actin bottom — from right Z */}
          <motion.g animate={{ x: -offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <g key={`ab${i}`}>
                <circle cx={414 - i * 17} cy={192} r="7.5" fill="#3b82f6" opacity={0.75} />
                {i > 0 && (
                  <line x1={414 - (i-1)*17 - 7} y1="192" x2={414 - i*17 + 7} y2="192"
                    stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
                )}
              </g>
            ))}
          </motion.g>

          {/* Myosin (thick) */}
          <rect x="148" y="126" width="204" height="48" fill="#7f1d1d" opacity="0.5" rx="8" />
          <rect x="148" y="126" width="204" height="48" fill="none" stroke="#ef4444" strokeWidth="1.5" rx="8" />
          <text x="250" y="154" fill="#fca5a5" fontSize="9" textAnchor="middle" fontWeight="bold">Myosin (thick)</text>

          {/* Myosin heads — top */}
          {[172, 210, 250, 290, 328].map((cx, i) => (
            <motion.g key={`mh-top-${i}`}
              animate={{ rotate: contracted ? -48 : 0 }}
              style={{ transformOrigin: `${cx}px 126px` }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.03 }}
            >
              <line x1={cx} y1={126} x2={cx} y2={108} stroke="#f87171" strokeWidth="2.5" />
              <circle cx={cx} cy={105} r="5.5" fill="#ef4444" />
              <circle cx={cx} cy={105} r="2.5" fill="#fca5a5" opacity={contracted ? 1 : 0.4} />
            </motion.g>
          ))}
          {/* Myosin heads — bottom */}
          {[172, 210, 250, 290, 328].map((cx, i) => (
            <motion.g key={`mh-bot-${i}`}
              animate={{ rotate: contracted ? 48 : 0 }}
              style={{ transformOrigin: `${cx}px 174px` }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.03 }}
            >
              <line x1={cx} y1={174} x2={cx} y2={192} stroke="#f87171" strokeWidth="2.5" />
              <circle cx={cx} cy={195} r="5.5" fill="#ef4444" />
              <circle cx={cx} cy={195} r="2.5" fill="#fca5a5" opacity={contracted ? 1 : 0.4} />
            </motion.g>
          ))}

          {/* Band labels with animated width lines */}
          {/* I-band left */}
          <motion.line
            x1={80 + offset} y1="260" x2="148" y2="260" stroke="#3b82f6" strokeWidth="1.5"
            animate={{ x1: 80 + offset }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          />
          <motion.text
            x={(80 + offset + 148) / 2} y="273" fill="#60a5fa" fontSize="8" textAnchor="middle"
            animate={{ x: (80 + offset + 148) / 2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            I-band
          </motion.text>
          {/* A-band */}
          <line x1="148" y1="260" x2="352" y2="260" stroke="#ef4444" strokeWidth="1.5" />
          <text x="250" y="273" fill="#ef4444" fontSize="8" textAnchor="middle">A-band</text>
          {/* I-band right */}
          <motion.line
            x1="352" y1="260" x2={420 - offset} y2="260" stroke="#3b82f6" strokeWidth="1.5"
            animate={{ x2: 420 - offset }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          />
          {/* H-zone */}
          <motion.line
            x1={contracted ? 238 : 222} y1="285" x2={contracted ? 262 : 278} y2="285"
            stroke="#eab308" strokeWidth="2"
            animate={{ x1: contracted ? 238 : 222, x2: contracted ? 262 : 278 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          />
          <text x="250" y="298" fill="#eab308" fontSize="7.5" textAnchor="middle">H-zone</text>

          {/* Ca²⁺ ions */}
          <AnimatePresence>
            {contracted && [115, 185, 250, 315, 385].map((cx, i) => (
              <motion.text key={cx} x={cx} y={75} fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold"
                initial={{ opacity: 0, y: 82 }}
                animate={{ opacity: [0, 1, 1, 0], y: [82, 70, 62, 50] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
              >
                Ca²⁺
              </motion.text>
            ))}
          </AnimatePresence>

          {/* ATP burst particles */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.circle key={p.id} cx={p.cx} cy={p.cy} r="3"
                fill="#facc15"
                initial={{ opacity: 0.9, cy: p.cy, r: 3 }}
                animate={{ opacity: 0, cy: p.cy - 28, r: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Hold Button with progress ring */}
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" className="absolute pointer-events-none" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="#1e293b" strokeWidth="5" />
            <motion.circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke="#fb7185"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ * (1 - holdProgress) }}
              transition={{ duration: 0.04 }}
            />
          </svg>
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className={`w-20 h-20 rounded-full font-bold text-xs uppercase tracking-wider transition-all select-none z-10 ${
              contracted
                ? 'bg-pink-400 text-black shadow-[0_0_30px_rgba(244,114,182,0.6)] scale-95'
                : 'bg-slate-800 border-2 border-pink-400/50 text-pink-300 hover:border-pink-400 hover:text-white'
            }`}
          >
            {contracted ? 'Contracting' : 'Hold\nContract'}
          </button>
        </div>

        <p className="text-[10px] text-slate-600 text-center -mt-1">
          Hold to trigger ATP + Ca²⁺ cross-bridge cycle
        </p>
      </div>

      {/* Info panel */}
      <div className="lg:w-[340px] space-y-4">
        {/* State indicator */}
        <div className={`rounded-2xl border p-4 transition-all duration-300 ${
          contracted
            ? 'border-pink-400/40 bg-pink-400/8 shadow-[0_0_24px_rgba(244,114,182,0.15)]'
            : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: contracted ? '#fb7185' : '#475569' }}
              animate={contracted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.7, repeat: contracted ? Infinity : 0 }}
            />
            <span className={`text-xs font-bold uppercase tracking-widest ${contracted ? 'text-pink-400' : 'text-slate-500'}`}>
              {contracted ? 'Contracting — Cross-bridge active' : 'Relaxed — Tropomyosin blocking'}
            </span>
          </div>
          {contracted && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between"><span>Ca²⁺ released</span><span className="text-green-400 font-mono">✓ active</span></div>
              <div className="flex justify-between"><span>Troponin bound</span><span className="text-green-400 font-mono">✓ active</span></div>
              <div className="flex justify-between"><span>Cross-bridge formed</span><span className="text-green-400 font-mono">✓ active</span></div>
              <div className="flex justify-between"><span>Power stroke</span><span className="text-yellow-400 font-mono">⚡ firing</span></div>
            </motion.div>
          )}
        </div>

        {/* Theory */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-pink-400 font-bold text-sm uppercase tracking-widest mb-3">Sliding Filament Theory</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            A nerve impulse triggers <strong className="text-white">Ca²⁺ release</strong> from the sarcoplasmic reticulum.
            Ca²⁺ binds to <strong className="text-white">troponin</strong>, shifting <strong className="text-white">tropomyosin</strong> away
            from the myosin-binding sites on actin.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            The myosin head (cocked by ATP hydrolysis) binds to actin, forming a <strong className="text-white">cross-bridge</strong>.
            ADP release causes the <strong className="text-white">power stroke</strong> — the head pivots, pulling actin toward the M-line.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            A new ATP binds, detaching the head. The sarcomere shortens:
            <strong className="text-blue-400"> I-bands</strong> and <strong className="text-yellow-400"> H-zone</strong> shrink,
            but the <strong className="text-red-400"> A-band</strong> stays constant.
          </p>
        </div>

        {/* Legend */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Colour Legend</div>
          <div className="space-y-2 text-xs text-slate-400">
            {[
              { color: '#a855f7', label: 'Z-lines — define sarcomere boundaries' },
              { color: '#3b82f6', label: 'Actin (thin filaments)' },
              { color: '#ef4444', label: 'Myosin (thick filament) + heads' },
              { color: '#eab308', label: 'H-zone — myosin only, shrinks on contraction' },
              { color: '#22c55e', label: 'Ca²⁺ ions — released from SR' },
              { color: '#facc15', label: 'ATP energy particles' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NeuromuscularJunction() {
  const [stimulus, setStimulus] = useState(65);
  const vesicles = Math.max(3, Math.round(stimulus / 12));
  const caRelease = Math.round(stimulus * 0.9);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.25fr,0.75fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Motor End Plate Cascade</div>
        <svg viewBox="0 0 560 360" className="w-full rounded-2xl bg-[#07101a]">
          <defs>
            <linearGradient id="axonGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path d="M 25 90 C 160 45 280 55 380 92 C 455 120 505 111 540 90" fill="none" stroke="url(#axonGrad)" strokeWidth="44" strokeLinecap="round" />
          <path d="M 38 91 C 172 51 286 63 380 96 C 455 121 502 112 528 93" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <text x="280" y="46" fill="#7dd3fc" fontSize="13" textAnchor="middle" fontWeight="bold">Motor neuron terminal</text>

          {Array.from({ length: vesicles }).map((_, i) => (
            <motion.g key={`vesicle-${i}`} animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}>
              <circle cx={175 + (i % 5) * 38} cy={84 + Math.floor(i / 5) * 28} r="12" fill="#f59e0b" opacity="0.25" stroke="#fbbf24" />
              <text x={175 + (i % 5) * 38} y={88 + Math.floor(i / 5) * 28} fill="#fde68a" fontSize="8" textAnchor="middle">ACh</text>
            </motion.g>
          ))}

          <motion.path d="M 55 91 C 150 64 260 70 360 96" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="12 22" animate={{ strokeDashoffset: [34, 0] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
          <text x="82" y="63" fill="#facc15" fontSize="10" fontWeight="bold">Action potential</text>

          <rect x="35" y="255" width="490" height="58" rx="28" fill="#451a1a" opacity="0.55" stroke="#f87171" />
          <text x="280" y="333" fill="#fca5a5" fontSize="12" textAnchor="middle" fontWeight="bold">Muscle fibre membrane</text>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={`rec-${i}`} x={95 + i * 45} y="239" width="22" height="35" rx="8" fill={stimulus > 35 ? '#22c55e' : '#1e293b'} stroke="#22c55e" opacity={stimulus > 35 ? 0.9 : 0.5} />
          ))}

          {Array.from({ length: vesicles * 3 }).map((_, i) => (
            <motion.circle key={`ach-${i}`} cx={145 + (i % 12) * 26} cy="132" r="4" fill="#facc15"
              animate={{ cy: [132, 238], opacity: [0, 1, 0], cx: [145 + (i % 12) * 26, 100 + (i % 9) * 45] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }} />
          ))}

          <motion.path d="M 90 285 C 150 215 245 215 312 285 S 445 355 512 283" fill="none" stroke="#22c55e" strokeWidth="3"
            strokeDasharray="10 18" animate={{ strokeDashoffset: [28, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          <text x="292" y="212" fill="#86efac" fontSize="11" textAnchor="middle">End-plate potential opens channels</text>

          <g transform="translate(380 145)">
            <rect x="0" y="0" width="125" height="52" rx="16" fill="#172554" stroke="#60a5fa" />
            <text x="62" y="21" fill="#bfdbfe" fontSize="10" textAnchor="middle" fontWeight="bold">SR Ca2+ Release</text>
            <text x="62" y="39" fill="#60a5fa" fontSize="16" textAnchor="middle" fontWeight="bold">{caRelease}%</text>
          </g>
          {Array.from({ length: Math.ceil(caRelease / 12) }).map((_, i) => (
            <motion.text key={`ca-${i}`} x={392 + (i % 4) * 28} y={206 + Math.floor(i / 4) * 22} fill="#38bdf8" fontSize="10" fontWeight="bold"
              animate={{ y: [206 + Math.floor(i / 4) * 22, 226 + Math.floor(i / 4) * 22, 206 + Math.floor(i / 4) * 22], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}>Ca2+</motion.text>
          ))}
        </svg>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
          <StemSlider label="Nerve impulse strength" value={stimulus} min={0} max={100} unit="%" color="pink" onChange={setStimulus} />
          <div className="grid grid-cols-2 gap-3">
            <Metric label="ACh vesicles" value={vesicles.toString()} color="text-yellow-300" />
            <Metric label="Ca2+ release" value={`${caRelease}%`} color="text-cyan-300" />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-pink-300 font-bold text-sm uppercase tracking-widest mb-3">Inquiry Focus</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Increase the impulse and watch the chain: action potential reaches the terminal, calcium enters the neuron, acetylcholine diffuses across the cleft, receptors open, and the muscle fibre releases Ca2+ for contraction.
          </p>
        </div>
      </div>
    </div>
  );
}

function EnergyFatigue() {
  const [intensity, setIntensity] = useState(55);
  const atp = Math.max(8, 100 - intensity * 0.72);
  const creatine = Math.max(5, 95 - intensity * 0.95);
  const glycolysis = Math.min(100, 20 + intensity * 0.9);
  const lactate = Math.max(0, (intensity - 35) * 1.45);
  const fatigue = Math.min(100, lactate * 0.65 + (100 - atp) * 0.28);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Metabolic Systems During Exercise</div>
        <svg viewBox="0 0 520 330" className="w-full rounded-2xl bg-[#08111b]">
          <line x1="62" y1="270" x2="485" y2="270" stroke="#334155" />
          <line x1="62" y1="45" x2="62" y2="270" stroke="#334155" />
          <text x="270" y="306" fill="#64748b" fontSize="11" textAnchor="middle">Exercise intensity</text>
          <text x="24" y="156" fill="#64748b" fontSize="11" transform="rotate(-90 24 156)" textAnchor="middle">Relative contribution</text>
          {[
            { label: 'ATP stores', value: atp, color: '#facc15', x: 95 },
            { label: 'Creatine phosphate', value: creatine, color: '#38bdf8', x: 190 },
            { label: 'Anaerobic glycolysis', value: glycolysis, color: '#fb7185', x: 310 },
            { label: 'Lactic acid', value: lactate, color: '#f97316', x: 420 },
          ].map((bar) => (
            <g key={bar.label}>
              <motion.rect x={bar.x} y={270 - bar.value * 2.05} width="54" height={bar.value * 2.05} rx="8" fill={bar.color} opacity="0.78"
                animate={{ y: 270 - bar.value * 2.05, height: bar.value * 2.05 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
              <text x={bar.x + 27} y="288" fill="#94a3b8" fontSize="8" textAnchor="middle">{bar.label}</text>
              <text x={bar.x + 27} y={258 - bar.value * 2.05} fill={bar.color} fontSize="12" textAnchor="middle" fontWeight="bold">{Math.round(bar.value)}%</text>
            </g>
          ))}
          <motion.path d={`M 65 ${270 - fatigue * 1.7} C 165 ${255 - fatigue} 270 ${245 - fatigue * 1.15} 485 ${270 - fatigue * 1.7}`} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <text x="438" y={252 - fatigue * 1.7} fill="#fca5a5" fontSize="10" fontWeight="bold">fatigue pressure</text>
        </svg>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
          <StemSlider label="Exercise intensity" value={intensity} min={0} max={100} unit="%" color="orange" onChange={setIntensity} />
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400" animate={{ width: `${fatigue}%` }} />
          </div>
          <p className="text-xs text-slate-500">Fatigue index: <span className="text-red-300 font-bold">{Math.round(fatigue)}%</span></p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-orange-300 font-bold text-sm uppercase tracking-widest mb-3">What Changes?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Low intensity can rely on stored ATP and aerobic recovery. As intensity rises, phosphocreatine is consumed quickly, glycolysis takes over, and lactate accumulation reduces pH, slowing cross-bridge cycling.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-black/30 p-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}
