import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Calculator, Globe, GraduationCap } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'spectrum' | 'wave-speed' | 'applications' | 'quiz';

const EM_BANDS = [
  { name: 'Radio', range: '> 1 m', freq: '< 300 MHz', color: '#ef4444', ghana: 'Ghana Broadcasting Corporation (GBC) radio, FM stations across all 16 regions' },
  { name: 'Microwave', range: '1 mm – 1 m', freq: '300 MHz – 300 GHz', color: '#f97316', ghana: 'Satellite TV (DSTV, MultiTV), mobile networks (MTN, Vodafone)' },
  { name: 'Infrared', range: '700 nm – 1 mm', freq: '300 GHz – 430 THz', color: '#eab308', ghana: 'Remote controls, night vision security cameras in Accra malls' },
  { name: 'Visible', range: '400 – 700 nm', freq: '430 – 750 THz', color: '#22c55e', ghana: 'Photosynthesis in cocoa farms, solar panels at Bui Dam, human vision' },
  { name: 'UV', range: '10 – 400 nm', freq: '750 THz – 30 PHz', color: '#3b82f6', ghana: 'Sun exposure near the equator — skin protection essential in Ghana' },
  { name: 'X-ray', range: '0.01 – 10 nm', freq: '30 PHz – 30 EHz', color: '#8b5cf6', ghana: 'Korle Bu Teaching Hospital, Komfo Anokye X-ray imaging departments' },
  { name: 'Gamma', range: '< 0.01 nm', freq: '> 30 EHz', color: '#ec4899', ghana: 'Radiotherapy at National Centre for Radiotherapy, Komfo Anokye' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'em1', question: 'Which EM wave has the longest wavelength?', type: 'multiple-choice', options: ['Gamma rays', 'X-rays', 'Radio waves', 'Visible light'], correctAnswer: 'Radio waves', explanation: 'Radio waves have wavelengths from metres to kilometres — the longest in the EM spectrum.' },
  { id: 'em2', question: 'All EM waves in a vacuum travel at:', type: 'multiple-choice', options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', 'Speed of sound'], correctAnswer: '3 × 10⁸ m/s', explanation: 'All electromagnetic waves travel at the speed of light in vacuum: c = 3 × 10⁸ m/s.' },
  { id: 'em3', question: 'The relationship v = fλ means that if frequency doubles:', type: 'multiple-choice', options: ['Wavelength doubles', 'Wavelength halves', 'Speed doubles', 'Speed halves'], correctAnswer: 'Wavelength halves', explanation: 'Since v is constant (c), if f doubles, λ must halve to keep v = fλ constant.' },
  { id: 'em4', question: 'Which EM band is used for medical imaging of bones?', type: 'multiple-choice', options: ['Infrared', 'Ultraviolet', 'X-rays', 'Microwaves'], correctAnswer: 'X-rays', explanation: 'X-rays penetrate soft tissue but are absorbed by dense bone, creating images for medical diagnosis.' },
  { id: 'em5', question: 'Microwaves are used for:', type: 'multiple-choice', options: ['Medical therapy', 'Satellite communication', 'Night vision', 'Water purification'], correctAnswer: 'Satellite communication', explanation: 'Microwaves are used for satellite TV, mobile phone networks, and also for cooking (microwave ovens).' },
  { id: 'em6', question: 'Which EM wave causes sunburn?', type: 'multiple-choice', options: ['Infrared', 'Visible light', 'Ultraviolet', 'Radio waves'], correctAnswer: 'Ultraviolet', explanation: 'UV radiation damages skin cells, causing sunburn. Ghana\'s equatorial location means high UV exposure.' },
  { id: 'em7', question: 'The speed of an EM wave with f = 100 MHz and λ = 3 m is:', type: 'multiple-choice', options: ['300 m/s', '3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s'], correctAnswer: '3 × 10⁸ m/s', explanation: 'v = fλ = 100 × 10⁶ × 3 = 3 × 10⁸ m/s — the speed of light.' },
  { id: 'em8', question: 'Gamma rays are produced by:', type: 'multiple-choice', options: ['Electronic circuits', 'Radioactive decay', 'Heated objects', 'Vibrating molecules'], correctAnswer: 'Radioactive decay', explanation: 'Gamma rays are emitted from radioactive nuclei during nuclear decay. They are the most energetic EM waves.' },
];

function SpectrumExplorer() {
  const [selected, setSelected] = useState(EM_BANDS[0]);
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
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selected.color }} />
            <h3 className="text-xl font-bold text-white">{selected.name} Waves</h3>
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
            <div className="text-[10px] text-brand-accent font-bold uppercase tracking-widest mb-1">Ghana Connection</div>
            <div className="text-slate-300 text-sm">{selected.ghana}</div>
          </div>
        </motion.div>
      </AnimatePresence>
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
          <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">Frequency (MHz)</span><span className="font-mono text-cyan-400">{freq}</span></div>
          <input type="range" min={1} max={1000} step={1} value={freq} onChange={e => setFreq(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
          <div className="text-[10px] text-slate-500 mt-1">{(freq * 1e6).toExponential(2)} Hz</div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400 font-bold">Wavelength (m)</span><span className="font-mono text-cyan-400">{wavelength}</span></div>
          <input type="range" min={0.001} max={10} step={0.001} value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" />
          <div className="text-[10px] text-slate-500 mt-1">{wavelength >= 0.01 ? `${wavelength.toFixed(3)} m` : `${(wavelength * 1e3).toFixed(2)} mm`}</div>
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        <div className="text-center text-sm text-slate-300">
          <span className="font-mono">{(freq * 1e6).toExponential(2)} Hz</span> × <span className="font-mono">{wavelength} m</span> = <span className="text-brand-accent font-bold font-mono">{speed.toExponential(2)} m/s</span>
        </div>
        <div className="text-center text-xs text-slate-500 mt-2">
          {Math.abs(speed - 3e8) < 1e6 ? '✓ Close to speed of light (c = 3 × 10⁸ m/s)' : `Deviation from c: ${((Math.abs(speed - 3e8) / 3e8) * 100).toFixed(1)}%`}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Radio FM', f: 100, l: 3 }, { label: 'Microwave', f: 2450, l: 0.122 }, { label: 'Visible (green)', f: 566000, l: 5.3e-7 }].map(preset => (
          <button key={preset.label} onClick={() => { setFreq(preset.f); setWavelength(preset.l >= 0.01 ? preset.l : 0.001); }}
            className="p-3 rounded-xl border border-slate-700 bg-black/30 hover:border-brand-accent/50 transition-all text-left"
          >
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
      desc: 'Korle Bu and Komfo Anokye hospitals use X-rays for bone fracture detection. X-rays pass through soft tissue but are absorbed by dense bone, creating contrast images.' },
    { id: 'radio', title: 'GBC Radio Broadcasting', icon: '📻', band: 'Radio', color: '#ef4444',
      desc: 'Ghana Broadcasting Corporation transmits on FM (87.5–108 MHz) and AM (531–1602 kHz). Radio waves reflect off the ionosphere for long-distance AM reception.' },
    { id: 'solar', title: 'Solar Energy at Bui Dam', icon: '☀️', band: 'Visible + IR', color: '#22c55e',
      desc: 'Solar panels at Bui and across northern Ghana convert visible and infrared light to electricity using the photoelectric effect. Ghana receives 4-6 kWh/m²/day of solar radiation.' },
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
          className="bg-slate-900/60 rounded-2xl border border-brand-border p-6"
        >
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

export default function ElectromagneticSpectrum() {
  const [viewMode, setViewMode] = useState<ViewMode>('spectrum');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'spectrum', label: 'Spectrum', icon: <Radio size={14} /> },
    { key: 'wave-speed', label: 'Wave Speed', icon: <Calculator size={14} /> },
    { key: 'applications', label: 'Apply', icon: <Globe size={14} /> },
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
