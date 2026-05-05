import React, { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Calculator, Globe, GraduationCap, GripVertical, CheckCircle2, XCircle, Trophy, ArrowRight, Shuffle } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'spectrum' | 'sort-challenge' | 'wave-speed' | 'applications' | 'quiz';

const EM_BANDS = [
  { name: 'Radio', range: '> 1 m', freq: '< 300 MHz', freqValue: 1e8, energy: 1, color: '#ef4444', ghana: 'GBC radio, FM stations across Ghana', icon: '📻' },
  { name: 'Microwave', range: '1 mm – 1 m', freq: '300 MHz – 300 GHz', freqValue: 1e10, energy: 2, color: '#f97316', ghana: 'DSTV satellite, MTN/Vodafone mobile networks', icon: '📡' },
  { name: 'Infrared', range: '700 nm – 1 mm', freq: '300 GHz – 430 THz', freqValue: 1e13, energy: 3, color: '#eab308', ghana: 'TV remotes, night security cameras', icon: '🌡️' },
  { name: 'Visible', range: '400 – 700 nm', freq: '430 – 750 THz', freqValue: 5e14, energy: 4, color: '#22c55e', ghana: 'Photosynthesis in cocoa farms, solar panels', icon: '👁️' },
  { name: 'UV', range: '10 – 400 nm', freq: '750 THz – 30 PHz', freqValue: 1e16, energy: 5, color: '#3b82f6', ghana: 'Equatorial sun — skin protection essential', icon: '☀️' },
  { name: 'X-ray', range: '0.01 – 10 nm', freq: '30 PHz – 30 EHz', freqValue: 1e18, energy: 6, color: '#8b5cf6', ghana: 'Korle Bu & KATH X-ray imaging', icon: '🦴' },
  { name: 'Gamma', range: '< 0.01 nm', freq: '> 30 EHz', freqValue: 1e20, energy: 7, color: '#ec4899', ghana: 'Cancer radiotherapy at specialist centres', icon: '☢️' },
];

interface SortItem {
  id: string;
  name: string;
  type: 'band' | 'application';
  bandIndex?: number;
  correctPosition: number;
}

const SORT_CHALLENGES = [
  {
    id: 'sc1',
    title: 'Sort by Frequency (Low to High)',
    instruction: 'Drag the EM bands into order from lowest frequency to highest frequency',
    criteria: 'frequency',
    items: [
      { id: 'radio', name: 'Radio Waves', type: 'band' as const, bandIndex: 0, correctPosition: 0 },
      { id: 'visible', name: 'Visible Light', type: 'band' as const, bandIndex: 3, correctPosition: 3 },
      { id: 'gamma', name: 'Gamma Rays', type: 'band' as const, bandIndex: 6, correctPosition: 6 },
      { id: 'xray', name: 'X-Rays', type: 'band' as const, bandIndex: 5, correctPosition: 5 },
      { id: 'uv', name: 'Ultraviolet', type: 'band' as const, bandIndex: 4, correctPosition: 4 },
      { id: 'ir', name: 'Infrared', type: 'band' as const, bandIndex: 2, correctPosition: 2 },
      { id: 'micro', name: 'Microwaves', type: 'band' as const, bandIndex: 1, correctPosition: 1 },
    ],
  },
  {
    id: 'sc2',
    title: 'Sort by Energy (Low to High)',
    instruction: 'Drag the EM bands into order from lowest energy to highest energy',
    criteria: 'energy',
    items: [
      { id: 'micro', name: 'Microwaves', type: 'band' as const, bandIndex: 1, correctPosition: 1 },
      { id: 'uv', name: 'Ultraviolet', type: 'band' as const, bandIndex: 4, correctPosition: 4 },
      { id: 'radio', name: 'Radio Waves', type: 'band' as const, bandIndex: 0, correctPosition: 0 },
      { id: 'gamma', name: 'Gamma Rays', type: 'band' as const, bandIndex: 6, correctPosition: 6 },
      { id: 'visible', name: 'Visible Light', type: 'band' as const, bandIndex: 3, correctPosition: 3 },
      { id: 'xray', name: 'X-Rays', type: 'band' as const, bandIndex: 5, correctPosition: 5 },
      { id: 'ir', name: 'Infrared', type: 'band' as const, bandIndex: 2, correctPosition: 2 },
    ],
  },
  {
    id: 'sc3',
    title: 'Match Application to Band',
    instruction: 'Sort these real-world applications into order of the EM band they use (low to high frequency)',
    criteria: 'application',
    items: [
      { id: 'gbc', name: 'GBC Radio FM broadcast', type: 'application' as const, bandIndex: 0, correctPosition: 0 },
      { id: 'dstv', name: 'DSTV satellite dish', type: 'application' as const, bandIndex: 1, correctPosition: 1 },
      { id: 'remote', name: 'TV remote control', type: 'application' as const, bandIndex: 2, correctPosition: 2 },
      { id: 'solar', name: 'Solar panel electricity', type: 'application' as const, bandIndex: 3, correctPosition: 3 },
      { id: 'sterilise', name: 'UV sterilisation in hospitals', type: 'application' as const, bandIndex: 4, correctPosition: 4 },
      { id: 'xray', name: 'Korle Bu X-ray bone scan', type: 'application' as const, bandIndex: 5, correctPosition: 5 },
      { id: 'cancer', name: 'Cancer radiotherapy', type: 'application' as const, bandIndex: 6, correctPosition: 6 },
    ],
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'em1', question: 'Which EM wave has the longest wavelength?', type: 'multiple-choice', options: ['Gamma rays', 'X-rays', 'Radio waves', 'Visible light'], correctAnswer: 'Radio waves', explanation: 'Radio waves have wavelengths from metres to kilometres.' },
  { id: 'em2', question: 'All EM waves in a vacuum travel at:', type: 'multiple-choice', options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', 'Speed of sound'], correctAnswer: '3 × 10⁸ m/s', explanation: 'All electromagnetic waves travel at c = 3 × 10⁸ m/s in vacuum.' },
  { id: 'em3', question: 'The relationship v = fλ means that if frequency doubles:', type: 'multiple-choice', options: ['Wavelength doubles', 'Wavelength halves', 'Speed doubles', 'Speed halves'], correctAnswer: 'Wavelength halves', explanation: 'Since v is constant (c), if f doubles, λ must halve.' },
  { id: 'em4', question: 'Which EM band is used for medical imaging of bones?', type: 'multiple-choice', options: ['Infrared', 'Ultraviolet', 'X-rays', 'Microwaves'], correctAnswer: 'X-rays', explanation: 'X-rays penetrate soft tissue but are absorbed by dense bone.' },
  { id: 'em5', question: 'Which EM wave causes sunburn?', type: 'multiple-choice', options: ['Infrared', 'Visible light', 'Ultraviolet', 'Radio waves'], correctAnswer: 'Ultraviolet', explanation: 'UV radiation damages skin cells. Ghana\'s equatorial location means high year-round exposure.' },
];

export default function ElectromagneticSpectrum() {
  const [viewMode, setViewMode] = useState<ViewMode>('spectrum');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'spectrum', label: 'Spectrum', icon: <Radio size={14} /> },
    { key: 'sort-challenge', label: 'Sort Challenge', icon: <GripVertical size={14} /> },
    { key: 'wave-speed', label: 'Wave Speed', icon: <Calculator size={14} /> },
    { key: 'applications', label: 'Ghana Apps', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{icon} {label}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'spectrum' && <SpectrumExplorer />}
            {viewMode === 'sort-challenge' && <SortChallengeMode />}
            {viewMode === 'wave-speed' && <WaveSpeedCalculator />}
            {viewMode === 'applications' && <Applications />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="EM Spectrum Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · </span>
        All EM waves travel at c = 3×10⁸ m/s in vacuum. v = fλ. Know the spectrum order, uses of each band, and ionising vs non-ionising radiation for WASSCE.
      </div>
    </div>
  );
}

function SpectrumExplorer() {
  const [selected, setSelected] = useState(EM_BANDS[3]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-4">
        <svg viewBox="0 0 600 60" width="100%" className="rounded-xl" style={{ maxWidth: 600 }}>
          <defs>
            <linearGradient id="spectrumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="15%" stopColor="#f97316" />
              <stop offset="28%" stopColor="#eab308" />
              <stop offset="42%" stopColor="#22c55e" />
              <stop offset="58%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect x={10} y={5} width={580} height={30} rx={4} fill="url(#spectrumGrad)" opacity={0.8} />
          {EM_BANDS.map((band, i) => {
            const x = 10 + (i / (EM_BANDS.length - 1)) * 560;
            return (
              <g key={band.name} onClick={() => setSelected(band)} style={{ cursor: 'pointer' }}>
                <line x1={x} y1={35} x2={x} y2={45} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
                <text x={x} y={55} textAnchor="middle" fontSize="8" fill={selected.name === band.name ? band.color : 'rgba(255,255,255,0.4)'} fontWeight="bold">{band.name}</text>
                {selected.name === band.name && <rect x={x - 40} y={3} width={80} height={34} rx={4} fill="none" stroke={band.color} strokeWidth={2} />}
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selected.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="bg-slate-900/60 rounded-2xl border border-brand-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{selected.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{selected.name} Waves</h3>
              <div className="w-4 h-4 rounded-full inline-block mr-2" style={{ backgroundColor: selected.color }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Wavelength</div>
              <div className="font-mono text-sm" style={{ color: selected.color }}>{selected.range}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Frequency</div>
              <div className="font-mono text-sm" style={{ color: selected.color }}>{selected.freq}</div>
            </div>
          </div>
          <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3">
            <div className="text-[10px] text-brand-accent font-bold uppercase tracking-widest mb-1">🇬🇭 Ghana Connection</div>
            <div className="text-slate-300 text-sm">{selected.ghana}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SortChallengeMode() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [items, setItems] = useState<SortItem[]>(() => [...SORT_CHALLENGES[0].items].sort(() => Math.random() - 0.5));
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const challenge = SORT_CHALLENGES[challengeIdx];
  const completedCount = Object.keys(completedChallenges).length;

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newItems = [...items];
    const dragged = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(idx, 0, dragged);
    setItems(newItems);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const checkOrder = () => {
    setSubmitted(true);
    const allCorrect = items.every((item, i) => item.correctPosition === i);
    if (allCorrect) {
      setScore(s => s + 10);
      setFeedback('✅ Perfect! All items in correct order! +10 pts');
      setCompletedChallenges(prev => ({ ...prev, [challenge.id]: true }));
    } else {
      const correctCount = items.filter((item, i) => item.correctPosition === i).length;
      setFeedback(`You got ${correctCount}/${items.length} correct. Review the spectrum and try again.`);
    }
  };

  const nextChallenge = () => {
    const next = (challengeIdx + 1) % SORT_CHALLENGES.length;
    setChallengeIdx(next);
    setItems([...SORT_CHALLENGES[next].items].sort(() => Math.random() - 0.5));
    setSubmitted(false);
    setFeedback(null);
  };

  const retry = () => {
    setItems([...challenge.items].sort(() => Math.random() - 0.5));
    setSubmitted(false);
    setFeedback(null);
  };

  const getItemStyle = (item: SortItem) => {
    if (item.type === 'band' && item.bandIndex !== undefined) {
      return { borderColor: EM_BANDS[item.bandIndex].color, backgroundColor: `${EM_BANDS[item.bandIndex].color}15` };
    }
    if (item.type === 'application' && item.bandIndex !== undefined) {
      return { borderColor: EM_BANDS[item.bandIndex].color, backgroundColor: `${EM_BANDS[item.bandIndex].color}10` };
    }
    return { borderColor: '#475569', backgroundColor: 'rgba(30, 41, 59, 0.5)' };
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">🔀 Sort Challenge</h3>
          <p className="text-xs text-slate-500">{challenge.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <Trophy size={14} className="text-yellow-400 inline mr-1" />
            <span className="text-yellow-400 font-mono text-xs font-bold">{score} pts</span>
          </div>
          <span className="text-[10px] text-slate-500">{completedCount}/{SORT_CHALLENGES.length} done</span>
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <p className="text-slate-300 text-sm mb-2">{challenge.instruction}</p>

        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Lowest {challenge.criteria} ↑</div>
        <div className="space-y-2 mb-4">
          {items.map((item, idx) => {
            const style = getItemStyle(item);
            const isCorrect = submitted && item.correctPosition === idx;
            const isWrong = submitted && item.correctPosition !== idx;

            return (
              <div
                key={item.id}
                draggable={!submitted}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  !submitted ? 'cursor-grab active:cursor-grabbing hover:border-brand-accent/50' : ''
                } ${isCorrect ? 'border-green-500 bg-green-500/10' : ''} ${isWrong ? 'border-red-500/50 bg-red-500/10' : ''}`}
                style={!submitted ? { ...style, borderWidth: '2px' } : {}}
              >
                <GripVertical size={14} className="text-slate-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-white text-sm font-medium">{item.name}</span>
                  {item.bandIndex !== undefined && (
                    <span className="text-xs ml-2" style={{ color: EM_BANDS[item.bandIndex].color }}>
                      {item.type === 'band' ? EM_BANDS[item.bandIndex].range : EM_BANDS[item.bandIndex].name}
                    </span>
                  )}
                </div>
                {submitted && isCorrect && <CheckCircle2 size={16} className="text-green-400 shrink-0" />}
                {submitted && isWrong && <XCircle size={16} className="text-red-400 shrink-0" />}
              </div>
            );
          })}
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Highest {challenge.criteria} ↓</div>

        {!submitted ? (
          <button
            onClick={checkOrder}
            className="w-full mt-4 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all"
          >
            Check Order
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            {feedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`p-3 rounded-xl text-sm font-bold text-center ${
                  feedback.includes('Perfect') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                }`}>
                {feedback}
              </motion.div>
            )}
            <div className="flex gap-2">
              {!feedback?.includes('Perfect') && (
                <button onClick={retry} className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                  <Shuffle size={14} /> Retry
                </button>
              )}
              <button onClick={nextChallenge} className="flex-1 px-4 py-3 bg-brand-accent text-black rounded-xl font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2">
                Next Challenge <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {SORT_CHALLENGES.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => {
              setChallengeIdx(i);
              setItems([...SORT_CHALLENGES[i].items].sort(() => Math.random() - 0.5));
              setSubmitted(false);
              setFeedback(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              challengeIdx === i
                ? 'bg-brand-accent text-black'
                : completedChallenges[sc.id]
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {completedChallenges[sc.id] && '✓ '}Challenge {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function WaveSpeedCalculator() {
  const [freq, setFreq] = useState(100);
  const [wavelength, setWavelength] = useState(3);
  const speed = freq * 1e6 * wavelength;

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6 text-center">
        <div className="text-2xl font-mono font-bold text-white mb-2">v = f × λ</div>
        <div className="text-4xl font-mono font-black text-brand-accent">{(speed / 1e8).toFixed(2)} × 10⁸ m/s</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-slate-400 font-bold">Frequency (MHz)</span>
            <span className="font-mono text-cyan-400">{freq}</span>
          </div>
          <input type="range" min={1} max={1000} step={1} value={freq} onChange={e => setFreq(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-slate-400 font-bold">Wavelength (m)</span>
            <span className="font-mono text-cyan-400">{wavelength}</span>
          </div>
          <input type="range" min={0.001} max={10} step={0.001} value={wavelength} onChange={e => setWavelength(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        <div className="text-center text-sm text-slate-300">
          <span className="font-mono">{(freq * 1e6).toExponential(2)} Hz</span> × <span className="font-mono">{wavelength} m</span> =
          <span className="text-brand-accent font-bold font-mono ml-2">{speed.toExponential(2)} m/s</span>
        </div>
        <div className="text-center text-xs text-slate-500 mt-2">
          {Math.abs(speed - 3e8) < 1e6 ? '✓ Close to speed of light (c = 3 × 10⁸ m/s)' : `Deviation from c: ${((Math.abs(speed - 3e8) / 3e8) * 100).toFixed(1)}%`}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Radio FM', f: 100, l: 3 }, { label: 'Microwave', f: 2450, l: 0.122 }, { label: 'Visible (green)', f: 566000, l: 5.3e-7 }].map(preset => (
          <button key={preset.label} onClick={() => { setFreq(preset.f); setWavelength(preset.l >= 0.01 ? preset.l : 0.001); }}
            className="p-3 rounded-xl border border-slate-700 bg-black/30 hover:border-brand-accent/50 transition-all text-left">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{preset.label}</div>
            <div className="text-white text-xs font-mono mt-1">{preset.f} MHz</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Applications() {
  const apps = [
    { id: 'satellite', title: 'Satellite TV in Ghana', icon: '📡', band: 'Microwave', color: '#f97316',
      desc: 'DSTV and MultiTV use Ku-band microwaves (12-18 GHz) to broadcast signals from satellites to Ghanaian homes. The dish focuses these waves onto the LNB receiver.' },
    { id: 'hospital', title: 'Hospital X-ray Imaging', icon: '🏥', band: 'X-ray', color: '#8b5cf6',
      desc: 'Korle Bu and Komfo Anokye hospitals use X-rays for bone fracture detection. X-rays pass through soft tissue but are absorbed by dense bone.' },
    { id: 'radio', title: 'GBC Radio Broadcasting', icon: '📻', band: 'Radio', color: '#ef4444',
      desc: 'Ghana Broadcasting Corporation transmits on FM (87.5–108 MHz) and AM bands. Radio waves reflect off the ionosphere for long-distance AM reception.' },
    { id: 'solar', title: 'Solar Energy in Ghana', icon: '☀️', band: 'Visible + IR', color: '#22c55e',
      desc: 'Solar panels across northern Ghana convert visible and infrared light to electricity. Ghana receives 4-6 kWh/m²/day of solar radiation.' },
  ];

  const [selected, setSelected] = useState(apps[0]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {apps.map(app => (
          <button key={app.id} onClick={() => setSelected(app)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selected.id === app.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >{app.icon} {app.title.split(' ')[0]}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{selected.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{selected.title}</h3>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: selected.color }}>{selected.band} waves</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{selected.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}