import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'ds1', question: 'For constructive interference, the path difference must be:', type: 'multiple-choice', options: ['nλ (whole wavelengths)', '(n+½)λ', 'Zero only', 'Random'], correctAnswer: 'nλ (whole wavelengths)', explanation: 'Whole wavelength path differences mean crests arrive with crests, reinforcing the wave.' },
  { id: 'ds2', question: 'Dark fringes are caused by ... interference.', type: 'multiple-choice', options: ['Constructive', 'Destructive', 'Diffractive', 'Reflective'], correctAnswer: 'Destructive', explanation: 'Destructive interference occurs when a crest meets a trough, cancelling out.' },
  { id: 'ds3', question: 'Increasing wavelength makes fringes:', type: 'multiple-choice', options: ['Narrower', 'Wider', 'Disappear', 'No change'], correctAnswer: 'Wider', explanation: 'w = λD/s. Larger wavelength (λ) -> larger fringe spacing (w).' },
  { id: 'ds4', question: 'Decreasing the slit separation (s) makes fringes:', type: 'multiple-choice', options: ['Narrower', 'Wider', 'Disappear', 'No change'], correctAnswer: 'Wider', explanation: 'w = λD/s. Since s is in the denominator, a smaller s leads to a larger w.' },
  { id: 'ds5', question: 'The double-slit experiment proved light is a:', type: 'multiple-choice', options: ['Particle', 'Wave', 'Gas', 'Liquid'], correctAnswer: 'Wave', explanation: 'Only waves exhibit interference patterns. This was Thomas Young\'s historic proof.' }
];

export default function DoubleSlit() {
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
            {viewMode === 'simulation' && <SlitSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Double Slit Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">Superposition & Interference</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          When two waves meet, they combine. This is the principle of <strong className="text-white">superposition</strong>.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl text-center">
            <p className="text-green-400 font-bold text-sm mb-1">Constructive</p>
            <p className="text-slate-300 text-xs">Crest + Crest = Bigger wave</p>
            <p className="text-slate-500 text-[10px] mt-1">In phase (path diff = nλ)</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl text-center">
            <p className="text-red-400 font-bold text-sm mb-1">Destructive</p>
            <p className="text-slate-300 text-xs">Crest + Trough = Cancels out</p>
            <p className="text-slate-500 text-[10px] mt-1">Antiphase (path diff = nλ + ½λ)</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-brand-accent font-bold text-lg mb-4">Young's Double Slit Experiment</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Thomas Young shone monochromatic light through two narrow slits. Instead of two lines of light on the screen behind, he saw an <strong className="text-white">interference pattern</strong> of alternating bright and dark bands (fringes). This proved that light behaves as a wave.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">w = λD / s</p>
        </div>
        <ul className="text-sm text-slate-300 space-y-2 list-disc pl-5">
          <li><strong className="text-white">w</strong> = fringe spacing (distance between bright bands)</li>
          <li><strong className="text-white">λ</strong> = wavelength of the light</li>
          <li><strong className="text-white">D</strong> = distance to the screen</li>
          <li><strong className="text-white">s</strong> = slit separation</li>
        </ul>
      </div>
    </div>
  );
}

function SlitSim() {
  const [mode, setMode] = useState<'single' | 'double'>('double');
  const [wavelength, setWavelength] = useState(500); // nm
  const [slitSep, setSlitSep] = useState(0.2); // mm
  const [distance, setDistance] = useState(2); // m

  // Calculate fringe spacing (simplified scale for visualization)
  const w = mode === 'double' ? (wavelength * distance) / (slitSep * 1000) : 0;
  
  // Wavelength to RGB color mapping
  const getColor = (wl: number) => {
    if (wl < 450) return `rgb(138, 43, 226)`; // Violet/Blue
    if (wl < 500) return `rgb(0, 191, 255)`; // Cyan
    if (wl < 550) return `rgb(0, 255, 0)`; // Green
    if (wl < 600) return `rgb(255, 255, 0)`; // Yellow
    if (wl < 650) return `rgb(255, 140, 0)`; // Orange
    return `rgb(255, 0, 0)`; // Red
  };
  const color = getColor(wavelength);

  // Generate pattern intensity string for CSS gradient
  const getPattern = () => {
    if (mode === 'single') {
      // Single slit diffraction envelope: sinc squared approx
      return `radial-gradient(ellipse at center, ${color} 0%, rgba(0,0,0,1) 30%, ${color} 40%, rgba(0,0,0,1) 50%)`;
    }
    
    // Double slit interference within diffraction envelope
    const stops = [];
    const numFringes = 15;
    for (let i = -numFringes; i <= numFringes; i++) {
      const pos = 50 + (i * w);
      if (pos >= 0 && pos <= 100) {
        // Envelope fade (sinc approx)
        const envelope = Math.max(0, 1 - Math.abs(i) / 10);
        const aColor = color.replace(')', `, ${envelope})`).replace('rgb', 'rgba');
        stops.push(`rgba(0,0,0,1) ${pos - w/4}%`);
        stops.push(`${aColor} ${pos}%`);
        stops.push(`rgba(0,0,0,1) ${pos + w/4}%`);
      }
    }
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4 w-full">
        <div className="flex gap-2">
          <button onClick={() => setMode('single')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${mode === 'single' ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400'}`}>Single Slit</button>
          <button onClick={() => setMode('double')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${mode === 'double' ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400'}`}>Double Slit</button>
        </div>

        {/* Diagram */}
        <svg viewBox="0 0 500 250" className="w-full bg-[#0a0a1a] rounded-2xl border border-slate-800" xmlns="http://www.w3.org/2000/svg">
          {/* Laser source */}
          <rect x="20" y="115" width="40" height="20" fill="#334155" rx="4" />
          <line x1="60" y1="125" x2="150" y2="125" stroke={color} strokeWidth="4" />
          <line x1="60" y1="125" x2="150" y2="125" stroke="white" strokeWidth="1" opacity="0.5" />

          {/* Slit barrier */}
          <rect x="150" y="20" width="10" height="210" fill="#64748b" />
          {mode === 'double' ? (
            <>
              <rect x="149" y={125 - slitSep * 100 - 5} width="12" height="10" fill="#0a0a1a" />
              <rect x="149" y={125 + slitSep * 100 - 5} width="12" height="10" fill="#0a0a1a" />
              {/* Diffracting waves */}
              <path d="M 160 120 Q 250 20 400 20" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
              <path d="M 160 130 Q 250 230 400 230" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
            </>
          ) : (
            <rect x="149" y="120" width="12" height="10" fill="#0a0a1a" />
          )}

          {/* Screen projection lines */}
          <line x1="160" y1={125} x2="440" y2={125} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Screen plane */}
          <rect x="440" y="20" width="10" height="210" fill="#cbd5e1" />
          <text x="460" y="130" fill="#94a3b8" fontSize="10">Screen</text>
        </svg>

        {/* Interference Pattern View */}
        <div className="w-full bg-[#0a0a1a] rounded-2xl border border-slate-800 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 text-center">Screen View (Intensity Pattern)</p>
          <div className="w-full height-16 rounded-lg overflow-hidden border border-slate-700 h-24" style={{ background: getPattern() }} />
        </div>

        {/* Controls */}
        <div className="flex gap-4 flex-wrap justify-center w-full bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[120px]">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Wavelength (λ)</label>
            <input type="range" min="400" max="700" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full" style={{ accentColor: color }} />
            <span className="text-xs font-mono" style={{ color }}>{wavelength} nm</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[120px]">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Slit Sep (s)</label>
            <input type="range" min="0.1" max="0.5" step="0.05" value={slitSep} onChange={e => setSlitSep(Number(e.target.value))} className="w-full accent-slate-400" disabled={mode === 'single'} />
            <span className="text-xs text-slate-300 font-mono">{mode === 'single' ? 'N/A' : `${slitSep.toFixed(2)} mm`}</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[120px]">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Distance (D)</label>
            <input type="range" min="1" max="5" step="0.5" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-slate-400" />
            <span className="text-xs text-slate-300 font-mono">{distance.toFixed(1)} m</span>
          </div>
        </div>
      </div>

      <div className="lg:w-[320px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Analysis</h3>
          
          {mode === 'double' ? (
            <div className="space-y-3">
              <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Fringe Spacing (w)</p>
                <p className="text-white font-mono text-xl">{w.toFixed(1)} <span className="text-sm text-slate-400">mm</span></p>
                <p className="text-xs text-slate-500 mt-1">Distance between bright bands</p>
              </div>
              <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Effect Observations</p>
                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-3">
                  <li>Longer λ (Red) → <strong className="text-white">Wider</strong> fringes</li>
                  <li>Shorter λ (Blue) → <strong className="text-white">Narrower</strong> fringes</li>
                  <li>Smaller s → <strong className="text-white">Wider</strong> fringes</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800">
              <p className="text-sm text-slate-300">Single slit produces a broad central maximum with much fainter secondary fringes (diffraction envelope). Double slits produce sharp, evenly spaced interference fringes within that envelope.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
