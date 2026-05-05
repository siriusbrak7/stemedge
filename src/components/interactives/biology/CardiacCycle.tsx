import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import StemSlider from '../shared/StemSlider';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'heart' | 'wiggers' | 'quiz';
type Phase = 'diastole' | 'atrial-systole' | 'ventricular-systole';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'cc1', question: 'Which chamber pumps deoxygenated blood to the lungs?', type: 'multiple-choice', options: ['Left Atrium', 'Right Atrium', 'Left Ventricle', 'Right Ventricle'], correctAnswer: 'Right Ventricle', explanation: 'The right ventricle pumps blood through the pulmonary artery to the lungs for gas exchange.' },
  { id: 'cc2', question: 'What prevents the backflow of blood from the ventricles to the atria?', type: 'multiple-choice', options: ['Aortic Valve', 'Atrioventricular (AV) Valves', 'Pulmonary Valve', 'Septum'], correctAnswer: 'Atrioventricular (AV) Valves', explanation: 'The AV valves (tricuspid on the right, bicuspid/mitral on the left) snap shut during ventricular systole to prevent backflow — producing the first heart sound ("lub").' },
  { id: 'cc3', question: 'What is the correct sequence of electrical conduction in the heart?', type: 'multiple-choice', options: ['AV node → SA node → Bundle of His → Purkinje', 'SA node → AV node → Bundle of His → Purkinje fibres', 'Purkinje → AV node → SA node → Bundle of His', 'SA node → Purkinje → AV node'], correctAnswer: 'SA node → AV node → Bundle of His → Purkinje fibres', explanation: 'The SA node (pacemaker) initiates the impulse, which travels to the AV node, down the Bundle of His through the septum, and into Purkinje fibres to contract the ventricles from the apex upward.' },
  { id: 'cc4', question: 'The second heart sound ("dub") is caused by the closure of which valves?', type: 'multiple-choice', options: ['AV valves', 'Semilunar valves', 'Tricuspid valve only', 'Mitral valve only'], correctAnswer: 'Semilunar valves', explanation: 'The aortic and pulmonary (semilunar) valves close at the start of diastole when ventricular pressure drops below arterial pressure.' },
];

const PHASE_DESCRIPTIONS: Record<Phase, { title: string; detail: string }> = {
  'diastole': {
    title: 'General Diastole (0.4s)',
    detail: 'All four chambers are relaxed. The semilunar valves (aortic & pulmonary) are closed because arterial pressure exceeds ventricular pressure. Blood flows passively from the veins into the atria and through the open AV valves into the ventricles — this accounts for ~80% of ventricular filling. The SA node is preparing to fire.',
  },
  'atrial-systole': {
    title: 'Atrial Systole (0.1s)',
    detail: 'The SA node fires an electrical impulse across both atria. The atria contract simultaneously, squeezing the remaining ~20% of blood into the ventricles (the "atrial kick"). The AV valves remain open. This contraction corresponds to the P wave on an ECG. The impulse reaches the AV node, which delays it briefly to allow complete ventricular filling.',
  },
  'ventricular-systole': {
    title: 'Ventricular Systole (0.3s)',
    detail: 'The signal passes through the Bundle of His and Purkinje fibres, causing the ventricles to contract powerfully from the apex upward. Rising ventricular pressure snaps the AV valves shut — producing the first heart sound ("lub"). When pressure exceeds arterial pressure, the semilunar valves open and blood is ejected into the pulmonary artery (right) and aorta (left). This corresponds to the QRS complex on an ECG.',
  },
};

export default function CardiacCycle() {
  const [viewMode, setViewMode] = useState<ViewMode>('heart');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-1.5 z-20 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5">
        {(['heart', 'wiggers', 'quiz'] as ViewMode[]).map((mode) => (
          <button key={mode} onClick={() => setViewMode(mode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === mode
                ? 'bg-brand-accent text-black shadow-[0_0_10px_rgba(34,211,238,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {mode === 'wiggers' ? 'Pressure Graph' : mode}
          </button>
        ))}
      </div>

      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {viewMode === 'heart' && <HeartView />}
            {viewMode === 'wiggers' && <WiggersGraph />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Cardiac Cycle Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── SVG Anatomical Heart ────────────────────────────────────────────────── */

function HeartView() {
  const [phase, setPhase] = useState<Phase>('diastole');
  const [playing, setPlaying] = useState(true);
  const [bpm, setBpm] = useState(72);

  useEffect(() => {
    if (!playing) return;
    const durations: Record<Phase, number> = {
      'diastole': (60 / bpm) * 500,
      'atrial-systole': (60 / bpm) * 125,
      'ventricular-systole': (60 / bpm) * 375,
    };
    const timer = setTimeout(() => {
      setPhase(p => p === 'diastole' ? 'atrial-systole' : p === 'atrial-systole' ? 'ventricular-systole' : 'diastole');
    }, durations[phase]);
    return () => clearTimeout(timer);
  }, [phase, playing, bpm]);

  const atriaScale = phase === 'atrial-systole' ? 0.92 : 1;
  const ventScale = phase === 'ventricular-systole' ? 0.88 : 1;
  const avOpen = phase !== 'ventricular-systole';
  const slOpen = phase === 'ventricular-systole';

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      {/* SVG Heart */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <svg viewBox="0 0 440 520" className="w-full max-w-[420px]" xmlns="http://www.w3.org/2000/svg">
          {/* Great Vessels */}
          {/* Superior Vena Cava */}
          <path d="M 100 0 L 100 80" stroke="#4a90d9" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.7" />
          <text x="40" y="40" fill="#4a90d9" fontSize="9" fontWeight="bold">SVC</text>
          {/* Inferior Vena Cava */}
          <path d="M 100 430 L 100 520" stroke="#4a90d9" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.7" />
          <text x="40" y="490" fill="#4a90d9" fontSize="9" fontWeight="bold">IVC</text>
          {/* Pulmonary Artery */}
          <path d="M 180 60 Q 200 20 240 30" stroke="#5b8dd9" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7" />
          <text x="200" y="20" fill="#5b8dd9" fontSize="9" fontWeight="bold">PA</text>
          {/* Pulmonary Veins */}
          <path d="M 340 80 Q 360 50 380 30" stroke="#e74c3c" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
          <text x="370" y="22" fill="#e74c3c" fontSize="9" fontWeight="bold">PV</text>
          {/* Aorta */}
          <path d="M 280 60 Q 320 10 380 10 Q 430 10 430 80 L 430 520" stroke="#e74c3c" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.7" />
          <text x="400" y="50" fill="#e74c3c" fontSize="10" fontWeight="bold">Aorta</text>

          {/* Heart Outline */}
          <path d="M 60 100 Q 60 60 120 60 Q 200 60 220 140 Q 240 60 320 60 Q 380 60 380 100 L 380 300 Q 380 460 220 480 Q 60 460 60 300 Z"
            fill="#1a0a0a" stroke="#8b2020" strokeWidth="3" />

          {/* Septum */}
          <line x1="220" y1="100" x2="220" y2="440" stroke="#5a1515" strokeWidth="8" />

          {/* Right Atrium */}
          <motion.g animate={{ scale: atriaScale }} style={{ transformOrigin: '140px 140px' }}>
            <path d="M 70 110 Q 70 80 140 80 L 210 80 L 210 190 L 70 190 Z" fill="#2a4a8a" fillOpacity="0.6" stroke="#4a90d9" strokeWidth="1.5" rx="10" />
            <text x="120" y="145" fill="#7cb3f0" fontSize="14" fontWeight="bold" textAnchor="middle">RA</text>
            {/* Blood particles flowing in during diastole */}
            {phase === 'diastole' && (
              <>
                <motion.circle cx="100" cy="120" r="3" fill="#4a90d9" animate={{ y: [0, 20, 40] }} transition={{ duration: 1, repeat: Infinity }} />
                <motion.circle cx="160" cy="130" r="3" fill="#4a90d9" animate={{ y: [0, 15, 30] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} />
              </>
            )}
          </motion.g>

          {/* Left Atrium */}
          <motion.g animate={{ scale: atriaScale }} style={{ transformOrigin: '300px 140px' }}>
            <path d="M 230 110 L 370 110 L 370 190 L 230 190 Z" fill="#8a2a2a" fillOpacity="0.5" stroke="#e74c3c" strokeWidth="1.5" />
            <text x="300" y="145" fill="#f08080" fontSize="14" fontWeight="bold" textAnchor="middle">LA</text>
            {phase === 'diastole' && (
              <motion.circle cx="300" cy="130" r="3" fill="#e74c3c" animate={{ y: [0, 15, 30] }} transition={{ duration: 1.1, repeat: Infinity }} />
            )}
          </motion.g>

          {/* AV Valves */}
          <g>
            {/* Tricuspid (Right) */}
            <motion.g animate={{ rotate: avOpen ? 80 : 0 }} style={{ transformOrigin: '140px 195px' }}>
              <line x1="140" y1="195" x2="170" y2="195" stroke={avOpen ? '#22c55e' : '#ef4444'} strokeWidth="4" strokeLinecap="round" />
            </motion.g>
            <motion.g animate={{ rotate: avOpen ? -80 : 0 }} style={{ transformOrigin: '140px 195px' }}>
              <line x1="140" y1="195" x2="110" y2="195" stroke={avOpen ? '#22c55e' : '#ef4444'} strokeWidth="4" strokeLinecap="round" />
            </motion.g>
            <text x="140" y="212" fill="#999" fontSize="7" textAnchor="middle">{avOpen ? 'OPEN' : 'SHUT'}</text>

            {/* Mitral/Bicuspid (Left) */}
            <motion.g animate={{ rotate: avOpen ? 80 : 0 }} style={{ transformOrigin: '300px 195px' }}>
              <line x1="300" y1="195" x2="330" y2="195" stroke={avOpen ? '#22c55e' : '#ef4444'} strokeWidth="4" strokeLinecap="round" />
            </motion.g>
            <motion.g animate={{ rotate: avOpen ? -80 : 0 }} style={{ transformOrigin: '300px 195px' }}>
              <line x1="300" y1="195" x2="270" y2="195" stroke={avOpen ? '#22c55e' : '#ef4444'} strokeWidth="4" strokeLinecap="round" />
            </motion.g>
            <text x="300" y="212" fill="#999" fontSize="7" textAnchor="middle">{avOpen ? 'OPEN' : 'SHUT'}</text>
          </g>

          {/* Right Ventricle */}
          <motion.g animate={{ scale: ventScale }} style={{ transformOrigin: '140px 330px' }}>
            <path d="M 70 220 L 210 220 L 210 420 Q 210 450 140 460 Q 70 450 70 420 Z" fill="#1a3a6a" fillOpacity="0.5" stroke="#4a90d9" strokeWidth="1.5" />
            <text x="140" y="340" fill="#7cb3f0" fontSize="14" fontWeight="bold" textAnchor="middle">RV</text>
            {/* Ejection particles */}
            {phase === 'ventricular-systole' && (
              <motion.circle cx="180" cy="220" r="4" fill="#5b8dd9" animate={{ y: [0, -60, -120] }} transition={{ duration: 0.6, repeat: Infinity }} />
            )}
          </motion.g>

          {/* Left Ventricle */}
          <motion.g animate={{ scale: ventScale }} style={{ transformOrigin: '300px 330px' }}>
            <path d="M 230 220 L 370 220 L 370 420 Q 370 450 300 460 Q 230 450 230 420 Z" fill="#6a1a1a" fillOpacity="0.5" stroke="#e74c3c" strokeWidth="1.5" />
            <text x="300" y="340" fill="#f08080" fontSize="14" fontWeight="bold" textAnchor="middle">LV</text>
            {phase === 'ventricular-systole' && (
              <motion.circle cx="300" cy="220" r="4" fill="#e74c3c" animate={{ y: [0, -60, -140] }} transition={{ duration: 0.5, repeat: Infinity }} />
            )}
          </motion.g>

          {/* Semilunar Valve indicators */}
          <circle cx="180" cy="70" r="8" fill={slOpen ? '#22c55e' : '#ef4444'} opacity="0.7" />
          <text x="180" y="74" fill="white" fontSize="6" textAnchor="middle">{slOpen ? 'O' : 'X'}</text>
          <circle cx="280" cy="70" r="8" fill={slOpen ? '#22c55e' : '#ef4444'} opacity="0.7" />
          <text x="280" y="74" fill="white" fontSize="6" textAnchor="middle">{slOpen ? 'O' : 'X'}</text>

          {/* Heart sounds */}
          {phase === 'ventricular-systole' && (
            <motion.text x="220" y="480" fill="#ef4444" fontSize="16" fontWeight="bold" textAnchor="middle"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [1, 0], scale: [1, 1.5] }} transition={{ duration: 0.5 }}
            >♥ LUB</motion.text>
          )}
          {phase === 'diastole' && (
            <motion.text x="220" y="480" fill="#4a90d9" fontSize="14" fontWeight="bold" textAnchor="middle"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [1, 0], scale: [1, 1.3] }} transition={{ duration: 0.4 }}
            >♥ DUB</motion.text>
          )}
        </svg>

        {/* Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={() => setPlaying(!playing)} className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-white transition-colors">
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="flex-1 min-w-[160px]">
            <StemSlider label="Heart Rate" value={bpm} min={40} max={140} unit=" BPM" color="red" onChange={setBpm} />
          </div>
          <div className="flex gap-1.5">
            {(['diastole', 'atrial-systole', 'ventricular-systole'] as Phase[]).map(p => (
              <motion.div key={p}
                className="rounded-full"
                style={{ backgroundColor: phase === p ? '#ef4444' : '#1e293b', height: '10px' }}
                animate={{ width: phase === p ? '20px' : '10px', boxShadow: phase === p ? '0 0 8px rgba(239,68,68,0.6)' : 'none' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Descriptive Panel */}
      <div className="lg:w-[340px] flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5"
          >
            <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">{PHASE_DESCRIPTIONS[phase].title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{PHASE_DESCRIPTIONS[phase].detail}</p>
          </motion.div>
        </AnimatePresence>

        {/* Key */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Colour Key</h4>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4a90d9]" /><span className="text-xs text-slate-400">Deoxygenated blood (right side)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#e74c3c]" /><span className="text-xs text-slate-400">Oxygenated blood (left side)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-xs text-slate-400">Valve open</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-xs text-slate-400">Valve closed</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Wiggers-style Pressure Graph ────────────────────────────────────────── */

function WiggersGraph() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(prev => (prev + 1) % 200), 30);
    return () => clearInterval(t);
  }, []);

  // Generate pressure curve points
  const genCurve = useCallback((type: 'lv' | 'aortic' | 'la') => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      let y = 0;
      if (type === 'lv') {
        if (t < 0.15) y = 8;
        else if (t < 0.2) y = 8 + (t - 0.15) / 0.05 * 112;
        else if (t < 0.45) y = 120;
        else if (t < 0.55) y = 120 - (t - 0.45) / 0.1 * 112;
        else y = 8;
      } else if (type === 'aortic') {
        if (t < 0.2) y = 80;
        else if (t < 0.25) y = 80 + (t - 0.2) / 0.05 * 40;
        else if (t < 0.45) y = 120 - (t - 0.25) / 0.2 * 10;
        else if (t < 0.55) y = 110 - (t - 0.45) / 0.1 * 5; // dicrotic notch area
        else y = 80 + (1 - t) / 0.45 * 25;
      } else {
        if (t < 0.1) y = 5;
        else if (t < 0.15) y = 5 + (t - 0.1) / 0.05 * 8; // a-wave
        else if (t < 0.2) y = 13 - (t - 0.15) / 0.05 * 5;
        else if (t < 0.45) y = 8 + (t - 0.2) / 0.25 * 7; // v-wave
        else y = 5;
      }
      const svgY = 220 - (y / 130) * 180;
      pts.push(`${i * 2.8},${svgY}`);
    }
    return pts.join(' ');
  }, []);

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto gap-6">
      <h3 className="text-xl font-bold uppercase tracking-widest text-brand-accent">Wiggers Diagram (Left Heart)</h3>

      <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
        <svg viewBox="0 0 560 260" className="w-full">
          {/* Grid */}
          {[0, 40, 80, 120].map(p => {
            const y = 220 - (p / 130) * 180;
            return <g key={p}>
              <line x1="0" y1={y} x2="560" y2={y} stroke="#1e293b" strokeWidth="0.5" />
              <text x="560" y={y + 4} fill="#475569" fontSize="8" textAnchor="end">{p}</text>
            </g>;
          })}
          <text x="565" y="130" fill="#475569" fontSize="7" textAnchor="end" transform="rotate(-90, 565, 130)">mmHg</text>

          {/* LV Pressure */}
          <polyline points={genCurve('lv')} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          {/* Aortic Pressure */}
          <polyline points={genCurve('aortic')} fill="none" stroke="#ef4444" strokeWidth="2" />
          {/* LA Pressure */}
          <polyline points={genCurve('la')} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Playhead */}
          <line x1={time * 2.8} y1="30" x2={time * 2.8} y2="230" stroke="white" strokeWidth="1" opacity="0.3" />

          {/* Phase labels */}
          <rect x="0" y="232" width={0.15 * 560} height="18" fill="#22c55e" fillOpacity="0.15" />
          <text x={0.075 * 560} y="244" fill="#22c55e" fontSize="7" textAnchor="middle">Diastole</text>
          <rect x={0.15 * 560} y="232" width={0.05 * 560} height="18" fill="#eab308" fillOpacity="0.15" />
          <text x={0.175 * 560} y="244" fill="#eab308" fontSize="6" textAnchor="middle">AS</text>
          <rect x={0.2 * 560} y="232" width={0.35 * 560} height="18" fill="#ef4444" fillOpacity="0.15" />
          <text x={0.375 * 560} y="244" fill="#ef4444" fontSize="7" textAnchor="middle">Ventricular Systole</text>
          <rect x={0.55 * 560} y="232" width={0.45 * 560} height="18" fill="#22c55e" fillOpacity="0.15" />
          <text x={0.775 * 560} y="244" fill="#22c55e" fontSize="7" textAnchor="middle">Diastole</text>
        </svg>

        {/* Legend */}
        <div className="flex gap-6 mt-3 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-blue-500" /><span className="text-[10px] text-slate-400">LV Pressure</span></div>
          <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-red-500" /><span className="text-[10px] text-slate-400">Aortic Pressure</span></div>
          <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-green-500 border-dashed" /><span className="text-[10px] text-slate-400">LA Pressure</span></div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-slate-400 text-sm leading-relaxed">
        <strong className="text-white">Reading the Wiggers Diagram:</strong> The <span className="text-blue-400">blue curve</span> (LV pressure) rises sharply during ventricular systole. When it exceeds the <span className="text-red-400">red curve</span> (aortic pressure), the aortic valve opens and blood is ejected. The <span className="text-green-400">green dashed curve</span> (LA pressure) shows the small a-wave (atrial contraction) and v-wave (atrial filling while AV valve is shut). The dicrotic notch in the aortic curve marks semilunar valve closure.
      </div>
    </div>
  );
}
