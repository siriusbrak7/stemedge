/**
 * WaveProperties.tsx
 * Physics interactive: Waves — Properties, Types, and the EM Spectrum
 * Curriculum: GES SHS Physics, Cambridge IGCSE 0625/A-Level 9702, IB DP Topic 4, NGSS HS-PS4-1
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, Radio, Zap, Calculator, GraduationCap, Play, RotateCcw
} from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'wave-lab' | 'em-spectrum' | 'doppler' | 'calculations' | 'quiz';
type WaveType = 'transverse' | 'longitudinal';

// ─── EM Spectrum data ─────────────────────────────────────────────────────────

interface EMBand {
  id: string;
  name: string;
  wavelengthMin: number; // metres
  wavelengthMax: number;
  freqMin: number; // Hz
  freqMax: number;
  color: string;
  application: string;
  ghanaExample: string;
  emoji: string;
}

const EM_BANDS: EMBand[] = [
  { id: 'gamma', name: 'Gamma Rays', wavelengthMin: 1e-14, wavelengthMax: 1e-11, freqMin: 3e19, freqMax: 3e22, color: '#c084fc', application: 'Cancer radiotherapy, food sterilisation', ghanaExample: 'Korle Bu Cancer Centre uses gamma radiation for tumour treatment', emoji: '☢️' },
  { id: 'xray', name: 'X-Rays', wavelengthMin: 1e-11, wavelengthMax: 1e-8, freqMin: 3e16, freqMax: 3e19, color: '#818cf8', application: 'Medical imaging, security scanning', ghanaExample: 'Korle Bu Teaching Hospital & KATH use X-ray diagnostics daily', emoji: '🦴' },
  { id: 'uv', name: 'Ultraviolet', wavelengthMin: 1e-8, wavelengthMax: 4e-7, freqMin: 7.5e14, freqMax: 3e16, color: '#a855f7', application: 'Sterilisation, sunburn (skin damage)', ghanaExample: 'High UV index in Ghana — cause of skin cancer and eye damage', emoji: '☀️' },
  { id: 'visible', name: 'Visible Light', wavelengthMin: 4e-7, wavelengthMax: 7e-7, freqMin: 4.3e14, freqMax: 7.5e14, color: '#fbbf24', application: 'Human vision, photosynthesis, photography', ghanaExample: 'Cocoa plants use visible light for photosynthesis in Ghana\'s forests', emoji: '👁️' },
  { id: 'ir', name: 'Infrared', wavelengthMin: 7e-7, wavelengthMax: 1e-3, freqMin: 3e11, freqMax: 4.3e14, color: '#f97316', application: 'Thermal imaging, TV remotes, night vision', ghanaExample: 'TV remotes and DSTV decoders use IR signals', emoji: '🌡️' },
  { id: 'microwave', name: 'Microwaves', wavelengthMin: 1e-3, wavelengthMax: 0.1, freqMin: 3e9, freqMax: 3e11, color: '#22d3ee', application: 'Mobile communication, DSTV, radar', ghanaExample: 'DSTV satellite dishes & MTN/Vodafone cell towers use microwaves', emoji: '📡' },
  { id: 'radio', name: 'Radio Waves', wavelengthMin: 0.1, wavelengthMax: 1e4, freqMin: 3e4, freqMax: 3e9, color: '#4ade80', application: 'Broadcasting, WiFi, FM/AM radio', ghanaExample: 'GBC Radio, Citi FM, Joy FM broadcast at 88–108 MHz', emoji: '📻' },
];

// ─── Quiz questions ───────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'wq1', question: 'A wave has f = 200 Hz and λ = 1.5 m. Its speed is:', type: 'multiple-choice', options: ['133 m/s', '300 m/s', '201.5 m/s', '0.0075 m/s'], correctAnswer: '300 m/s', explanation: 'v = fλ = 200 × 1.5 = 300 m/s' },
  { id: 'wq2', question: 'Which type of wave requires a medium to travel?', type: 'multiple-choice', options: ['Electromagnetic waves', 'Longitudinal mechanical waves', 'Radio waves', 'Light waves'], correctAnswer: 'Longitudinal mechanical waves', explanation: 'Mechanical waves (transverse and longitudinal) need a medium. EM waves can travel through vacuum.' },
  { id: 'wq3', question: 'Which EM radiation has the highest frequency?', type: 'multiple-choice', options: ['Radio waves', 'Infrared', 'Visible light', 'Gamma rays'], correctAnswer: 'Gamma rays', explanation: 'Gamma rays have the shortest wavelength and highest frequency in the EM spectrum.' },
  { id: 'wq4', question: 'The Doppler effect when a source moves away causes:', type: 'multiple-choice', options: ['Blue shift', 'Red shift', 'No change in frequency', 'The wave speed changes'], correctAnswer: 'Red shift', explanation: 'When the source moves away, wavefronts are stretched → lower observed frequency → red shift.' },
  { id: 'wq5', question: 'What is the relationship between period T and frequency f?', type: 'multiple-choice', options: ['T = f', 'T = 1/f', 'T = f²', 'f = T²'], correctAnswer: 'T = 1/f', explanation: 'Period and frequency are reciprocals: T = 1/f (e.g., f = 5 Hz → T = 0.2 s).' },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function WaveProperties() {
  const [viewMode, setViewMode] = useState<ViewMode>('wave-lab');

  const MODES = [
    { key: 'wave-lab' as ViewMode, label: 'Wave Lab', icon: <Eye size={14} /> },
    { key: 'em-spectrum' as ViewMode, label: 'EM Spectrum', icon: <Radio size={14} /> },
    { key: 'doppler' as ViewMode, label: 'Doppler', icon: <Zap size={14} /> },
    { key: 'calculations' as ViewMode, label: 'Calculations', icon: <Calculator size={14} /> },
    { key: 'quiz' as ViewMode, label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)} aria-label={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'wave-lab' && <WaveLab />}
            {viewMode === 'em-spectrum' && <EMSpectrum />}
            {viewMode === 'doppler' && <DopplerMode />}
            {viewMode === 'calculations' && <CalculationsMode />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Waves Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · Cambridge · IB · </span>
        Key formulae: v = fλ, T = 1/f. WAEC commonly asks you to: (1) calculate wave speed, (2) identify EM wave types,
        (3) describe transverse vs longitudinal. Cambridge A-Level adds Doppler and superposition.
      </div>
    </div>
  );
}

// ─── Wave Lab ─────────────────────────────────────────────────────────────────

function WaveLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [amplitude, setAmplitude] = useState(1.0);
  const [frequency, setFrequency] = useState(1.5);
  const [waveSpeed, setWaveSpeed] = useState(3);
  const [waveType, setWaveType] = useState<WaveType>('transverse');
  const [superposition, setSuperposition] = useState(false);
  const [a2, setA2] = useState(0.7);
  const [f2, setF2] = useState(2.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const W = 560, H = 220;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.016;
    const t = timeRef.current;
    const λ = waveSpeed / frequency;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const cy = H / 2;

    if (waveType === 'transverse') {
      // Equilibrium line
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.setLineDash([]);

      // Wave 1
      const scaleAmp = amplitude * 60;
      const scaleλ = (λ / 8) * W;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let px = 0; px <= W; px++) {
        const x = px / W;
        const y = cy - scaleAmp * Math.sin(2 * Math.PI * (x * 8 / λ - frequency * t));
        if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
      }
      ctx.stroke();

      // Wave 2 (superposition)
      if (superposition) {
        const scaleAmp2 = a2 * 60;
        const λ2 = waveSpeed / f2;
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let px = 0; px <= W; px++) {
          const x = px / W;
          const y = cy - scaleAmp2 * Math.sin(2 * Math.PI * (x * 8 / λ2 - f2 * t));
          if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Resultant
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let px = 0; px <= W; px++) {
          const x = px / W;
          const y1 = scaleAmp * Math.sin(2 * Math.PI * (x * 8 / λ - frequency * t));
          const y2 = a2 * 60 * Math.sin(2 * Math.PI * (x * 8 / λ - f2 * t));
          if (px === 0) ctx.moveTo(px, cy - (y1 + y2)); else ctx.lineTo(px, cy - (y1 + y2));
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Annotations
      if (showAnnotations && !superposition) {
        const halfλPx = (W / 8) * (λ / 2);
        const startX = 20;
        // Wavelength arrow
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, cy + scaleAmp + 20);
        ctx.lineTo(startX + halfλPx * 2, cy + scaleAmp + 20);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('λ', startX + halfλPx, cy + scaleAmp + 34);

        // Amplitude arrow
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(12, cy);
        ctx.lineTo(12, cy - scaleAmp);
        ctx.stroke();
        ctx.fillStyle = '#c084fc';
        ctx.textAlign = 'right';
        ctx.fillText('A', 10, cy - scaleAmp / 2 + 4);
      }

      // Moving particle dot
      const dotX = W * 0.3;
      const dotY = cy - scaleAmp * Math.sin(2 * Math.PI * (0.3 * 8 / λ - frequency * t));
      ctx.beginPath();
      ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#f87171';
      ctx.shadowColor = '#f87171';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

    } else {
      // Longitudinal wave — dots
      const numDots = 40;
      const spacing = W / numDots;
      for (let i = 0; i < numDots; i++) {
        const x0 = i * spacing + spacing / 2;
        const displacement = amplitude * 25 * Math.sin(2 * Math.PI * (i / numDots * 8 / (waveSpeed / frequency) - frequency * t));
        const x = x0 + displacement;
        ctx.beginPath();
        ctx.arc(x, cy, 4, 0, Math.PI * 2);
        const density = Math.abs(displacement) < 5 ? 0.9 : 0.3;
        ctx.fillStyle = `rgba(34,211,238,${density})`;
        ctx.fill();
      }
      // Labels
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Compression ↔ Rarefaction', 20, 20);
    }

    // v = fλ display
    const v = frequency * (waveSpeed / frequency);
    ctx.fillStyle = 'rgba(34,211,238,0.6)';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`v = fλ = ${frequency.toFixed(1)} × ${(waveSpeed / frequency).toFixed(2)} = ${v.toFixed(1)} m/s`, W - 10, 18);

    if (isPlaying) {
      animRef.current = requestAnimationFrame(draw);
    }
  }, [amplitude, frequency, waveSpeed, waveType, superposition, a2, f2, isPlaying, showAnnotations]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, isPlaying]);

  useEffect(() => { if (!isPlaying) draw(); }, [isPlaying, draw]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Wave type + controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <button onClick={() => setWaveType('transverse')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${waveType === 'transverse' ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          Transverse
        </button>
        <button onClick={() => setWaveType('longitudinal')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${waveType === 'longitudinal' ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          Longitudinal
        </button>
        <button onClick={() => setSuperposition(!superposition)} disabled={waveType === 'longitudinal'}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-30 ${superposition ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          Superposition
        </button>
        <button onClick={() => setShowAnnotations(!showAnnotations)}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showAnnotations ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-800 text-slate-400'}`}>
          Annotations
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="ml-auto p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors">
          {isPlaying ? <span className="w-4 h-4 bg-current rounded-sm inline-block align-middle" /> : <Play size={16} />}
        </button>
      </div>

      {/* Canvas */}
      <div className="rounded-2xl overflow-hidden border border-brand-border shadow-xl">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Amplitude (A)', val: amplitude, set: setAmplitude, min: 0.1, max: 2, step: 0.1, color: '#c084fc' },
          { label: 'Frequency (Hz)', val: frequency, set: setFrequency, min: 0.5, max: 5, step: 0.5, color: '#22d3ee' },
          { label: 'Wave Speed', val: waveSpeed, set: setWaveSpeed, min: 1, max: 5, step: 0.5, color: '#4ade80' },
        ].map(({ label, val, set, min, max, step, color }) => (
          <div key={label} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-slate-400 uppercase tracking-widest font-bold">{label}</span>
              <span className="font-mono font-bold" style={{ color }}>{val}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" aria-label={label} />
          </div>
        ))}
      </div>

      {superposition && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Wave 2 Amplitude', val: a2, set: setA2, min: 0.1, max: 2, step: 0.1 },
            { label: 'Wave 2 Frequency', val: f2, set: setF2, min: 0.5, max: 5, step: 0.5 },
          ].map(({ label, val, set, min, max, step }) => (
            <div key={label} className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
              <div className="flex justify-between text-[10px] mb-2">
                <span className="text-orange-400 uppercase tracking-widest font-bold">{label}</span>
                <span className="font-mono font-bold text-orange-400">{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500" aria-label={label} />
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Wavelength</div>
          <div className="font-mono text-brand-accent font-bold">{(waveSpeed / frequency).toFixed(2)} m</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Period</div>
          <div className="font-mono text-brand-accent font-bold">{(1 / frequency).toFixed(2)} s</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Speed</div>
          <div className="font-mono text-brand-accent font-bold">{waveSpeed} m/s</div>
        </div>
      </div>
    </div>
  );
}

// ─── EM Spectrum Mode ─────────────────────────────────────────────────────────

function EMSpectrum() {
  const [selected, setSelected] = useState<EMBand | null>(null);
  const [v, setV] = useState('3e8');
  const [f, setF] = useState('');
  const [λ, setLambda] = useState('');
  const [solveFor, setSolveFor] = useState<'v' | 'f' | 'λ'>('f');
  const [calcResult, setCalcResult] = useState('');

  const calcWave = () => {
    const vNum = parseFloat(v);
    const fNum = parseFloat(f);
    const λNum = parseFloat(λ);
    if (solveFor === 'f' && !isNaN(vNum) && !isNaN(λNum) && λNum !== 0) {
      setCalcResult(`f = v/λ = ${vNum}/${λNum} = ${(vNum / λNum).toExponential(3)} Hz`);
    } else if (solveFor === 'λ' && !isNaN(vNum) && !isNaN(fNum) && fNum !== 0) {
      setCalcResult(`λ = v/f = ${vNum}/${fNum} = ${(vNum / fNum).toExponential(3)} m`);
    } else if (solveFor === 'v' && !isNaN(fNum) && !isNaN(λNum)) {
      setCalcResult(`v = fλ = ${fNum} × ${λNum} = ${(fNum * λNum).toExponential(3)} m/s`);
    } else {
      setCalcResult('Please fill the two known values.');
    }
  };

  const formatSci = (n: number) => {
    if (n === 0) return '0';
    const exp = Math.floor(Math.log10(Math.abs(n)));
    const man = (n / Math.pow(10, exp)).toFixed(1);
    return `${man}×10${exp >= 0 ? '⁺' : '⁻'}${Math.abs(exp)}`;
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Spectrum bar */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5 overflow-x-auto">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Click a band for details</div>
        <div className="flex min-w-[600px] rounded-xl overflow-hidden">
          {EM_BANDS.map(band => (
            <button
              key={band.id}
              onClick={() => setSelected(selected?.id === band.id ? null : band)}
              style={{ backgroundColor: `${band.color}30`, borderColor: selected?.id === band.id ? band.color : 'transparent' }}
              className="flex-1 p-3 border-2 transition-all hover:opacity-100"
              aria-label={band.name}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{band.emoji}</div>
                <div className="text-[9px] font-bold text-white">{band.name.split(' ')[0]}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-2 min-w-[600px]">
          <span>← Higher frequency / shorter λ / more energy</span>
          <span>Lower frequency / longer λ →</span>
        </div>
      </div>

      {/* Selected band detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border p-5"
            style={{ borderColor: `${selected.color}40`, backgroundColor: `${selected.color}08` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{selected.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                <div className="text-sm font-mono" style={{ color: selected.color }}>
                  λ: {formatSci(selected.wavelengthMin)} – {formatSci(selected.wavelengthMax)} m &nbsp;|&nbsp;
                  f: {formatSci(selected.freqMin)} – {formatSci(selected.freqMax)} Hz
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Applications</div>
                <div className="text-white text-sm">{selected.application}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] text-yellow-400 uppercase tracking-widest mb-1">🇬🇭 Ghana Context</div>
                <div className="text-slate-300 text-sm">{selected.ghanaExample}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* v = fλ calculator */}
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-4">v = fλ Calculator</h3>
        <div className="flex gap-2 flex-wrap mb-3">
          {(['v', 'f', 'λ'] as const).map(q => (
            <button key={q} onClick={() => setSolveFor(q)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${solveFor === q ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              Solve for {q}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'v', label: 'Speed (m/s)', val: v, set: setV },
            { key: 'f', label: 'Frequency (Hz)', val: f, set: setF },
            { key: 'λ', label: 'Wavelength (m)', val: λ, set: setLambda },
          ].map(({ key, label, val, set }) => (
            <div key={key}>
              <div className="text-[10px] text-slate-500 mb-1">{label}</div>
              <input
                value={val}
                onChange={e => set(e.target.value)}
                disabled={solveFor === key}
                placeholder={solveFor === key ? 'Solving...' : ''}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-accent focus:outline-none disabled:opacity-40"
                aria-label={label}
              />
            </div>
          ))}
        </div>
        <button onClick={calcWave} className="mt-3 px-5 py-2 bg-brand-accent text-black rounded-xl font-bold text-xs uppercase hover:bg-white transition-all">
          Calculate
        </button>
        {calcResult && (
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl font-mono text-sm text-green-400">
            {calcResult}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Doppler Mode ─────────────────────────────────────────────────────────────

function DopplerMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [sourceV, setSourceV] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ghanaMode, setGhanaMode] = useState(false);

  const W = 560, H = 280;
  const waveSpeed = 340; // m/s (sound in air)

  const sourceFreq = 400; // Hz
  const observedFront = sourceFreq * waveSpeed / (waveSpeed - sourceV * waveSpeed);
  const observedBack = sourceFreq * waveSpeed / (waveSpeed + sourceV * waveSpeed);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.02;
    const t = timeRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const cy = H / 2;
    const sourcePx = W / 2 + Math.sin(t) * W * 0.15 * sourceV; // oscillate source

    // Road (Ghana mode)
    if (ghanaMode) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, cy + 30, W, 50);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 15]);
      ctx.beginPath(); ctx.moveTo(0, cy + 55); ctx.lineTo(W, cy + 55); ctx.stroke();
      ctx.setLineDash([]);
      // Car
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(sourcePx - 20, cy + 35, 40, 20);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(sourcePx - 14, cy + 30, 28, 12);
      // Radar gun
      ctx.fillStyle = '#64748b';
      ctx.fillRect(W - 30, cy + 32, 20, 15);
    } else {
      // Wave source dot
      ctx.beginPath();
      ctx.arc(sourcePx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Wavefronts (circles emanating from source at different past positions)
    const numWaves = 8;
    const speed = 1.5;
    for (let i = 0; i < numWaves; i++) {
      const age = (i / numWaves + t) % 1;
      const emittedX = sourcePx - sourceV * age * W * 0.3;
      const radius = age * W * speed * 0.3;
      const alpha = (1 - age) * 0.5;
      ctx.beginPath();
      ctx.arc(emittedX, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Observer ears
    const leftX = 50, rightX = W - 50;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👂', leftX, cy + 8);
    ctx.fillText('👂', rightX, cy + 8);

    // Frequency labels
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#f87171';
    ctx.textAlign = 'center';
    ctx.fillText(`f = ${observedFront.toFixed(0)} Hz`, rightX, cy - 30);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`f = ${observedBack.toFixed(0)} Hz`, leftX, cy - 30);

    // Source freq
    ctx.fillStyle = '#22d3ee';
    ctx.fillText(`f₀ = ${sourceFreq} Hz`, W / 2, 20);

    // Direction arrows
    ctx.strokeStyle = 'rgba(248,113,113,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sourcePx + 15, cy - 5);
    ctx.lineTo(rightX - 30, cy - 5);
    ctx.stroke();

    // Labels
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(248,113,113,0.6)';
    ctx.fillText('Higher f (compressed)', (sourcePx + rightX) / 2, cy - 12);
    ctx.fillStyle = 'rgba(96,165,250,0.6)';
    ctx.fillText('Lower f (stretched)', (leftX + sourcePx) / 2, cy - 12);

    if (isPlaying) {
      animRef.current = requestAnimationFrame(draw);
    }
  }, [sourceV, isPlaying, ghanaMode, observedFront, observedBack]);

  useEffect(() => {
    if (isPlaying) animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, isPlaying]);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex gap-3 flex-wrap items-center">
        <button onClick={() => setGhanaMode(!ghanaMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${ghanaMode ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          🇬🇭 Ghana Speed Camera
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors">
          {isPlaying ? 'Pause' : <Play size={16} />}
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-brand-border">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4 border border-brand-border">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-400 uppercase tracking-widest font-bold">Source Velocity</span>
          <span className="text-brand-accent font-mono font-bold">{(sourceV * 100).toFixed(0)}% wave speed</span>
        </div>
        <input type="range" min={0} max={0.85} step={0.05} value={sourceV} onChange={e => setSourceV(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-brand-accent" aria-label="Source velocity" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
          <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">Toward Observer (Right)</div>
          <div className="text-2xl font-mono font-bold text-red-400">{observedFront.toFixed(0)} Hz</div>
          <div className="text-xs text-slate-400 mt-1">Compressed wavefronts → higher pitch</div>
        </div>
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Away from Observer (Left)</div>
          <div className="text-2xl font-mono font-bold text-blue-400">{observedBack.toFixed(0)} Hz</div>
          <div className="text-xs text-slate-400 mt-1">Stretched wavefronts → lower pitch</div>
        </div>
      </div>

      {ghanaMode && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-xs text-slate-300">
          <span className="text-yellow-400 font-bold">🇬🇭 Ghana Speed Camera: </span>
          Police use radar guns that emit microwaves. When the car approaches, the reflected microwaves have a higher frequency.
          The shift in frequency is proportional to the car's speed — this is how speeding is detected on Accra–Kumasi roads.
        </div>
      )}
    </div>
  );
}

// ─── Calculations Mode ────────────────────────────────────────────────────────

function CalculationsMode() {
  const EXAMPLES = [
    {
      title: 'Find wave speed (v = fλ)',
      difficulty: 'easy',
      problem: 'A light wave has f = 5 × 10¹⁴ Hz and λ = 6 × 10⁻⁷ m. Find the speed.',
      steps: [
        'Formula: v = fλ',
        'Substitute: v = (5 × 10¹⁴) × (6 × 10⁻⁷)',
        'v = 30 × 10⁷ = 3 × 10⁸ m/s ✓ (speed of light)',
      ],
    },
    {
      title: 'Find frequency from λ and v',
      difficulty: 'easy',
      problem: 'A sound wave travels at 340 m/s with wavelength 0.68 m. Find frequency.',
      steps: [
        'Rearrange: f = v/λ',
        'Substitute: f = 340 / 0.68',
        'f = 500 Hz',
      ],
    },
    {
      title: 'Radio wave — Ghana FM broadcast',
      difficulty: 'medium',
      problem: 'Citi FM broadcasts at 97.3 MHz. Find its wavelength. (c = 3 × 10⁸ m/s)',
      steps: [
        'Convert: f = 97.3 MHz = 97.3 × 10⁶ Hz',
        'Rearrange: λ = v/f = (3 × 10⁸) / (97.3 × 10⁶)',
        'λ = 3.08 m',
      ],
    },
    {
      title: 'Period ↔ Frequency',
      difficulty: 'easy',
      problem: 'A wave oscillates with period T = 0.004 s. Find its frequency.',
      steps: [
        'Formula: f = 1/T',
        'Substitute: f = 1 / 0.004',
        'f = 250 Hz',
      ],
    },
    {
      title: 'Doppler effect (A-Level)',
      difficulty: 'hard',
      problem: 'A car approaches at 20 m/s emitting 600 Hz. v_sound = 340 m/s. Find observed f.',
      steps: [
        'Formula: f\' = f × v / (v − v_s)',
        'Substitute: f\' = 600 × 340 / (340 − 20)',
        'f\' = 600 × 340/320 = 637.5 Hz',
      ],
    },
    {
      title: 'Photon energy E = hf (IB HL)',
      difficulty: 'hard',
      problem: 'Find the energy of a UV photon with f = 1.0 × 10¹⁵ Hz. (h = 6.63 × 10⁻³⁴ J·s)',
      steps: [
        'Formula: E = hf',
        'Substitute: E = (6.63 × 10⁻³⁴) × (1.0 × 10¹⁵)',
        'E = 6.63 × 10⁻¹⁹ J',
      ],
    },
  ];

  const [revealed, setRevealed] = useState<Record<number, number>>({});

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      {EXAMPLES.map((ex, i) => (
        <div key={i} className="bg-slate-900/60 rounded-2xl border border-brand-border overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                ex.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ex.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
              }`}>{ex.difficulty}</span>
              <h3 className="text-white font-bold text-sm">{ex.title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">{ex.problem}</p>
            <div className="space-y-2 mb-4">
              {ex.steps.slice(0, (revealed[i] ?? 0) + 1).map((step, j) => (
                <motion.div key={j} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`p-2 rounded-lg font-mono text-sm border ${j === (revealed[i] ?? 0) ? 'bg-brand-accent/10 border-brand-accent/30 text-white' : 'bg-black/30 border-slate-800 text-slate-300'}`}
                >
                  <span className="text-slate-600 mr-2">{j + 1}.</span> {step}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              {(revealed[i] ?? 0) < ex.steps.length - 1 && (
                <button onClick={() => setRevealed(prev => ({ ...prev, [i]: (prev[i] ?? 0) + 1 }))}
                  className="px-4 py-2 bg-brand-accent text-black rounded-xl font-bold text-xs uppercase hover:bg-white transition-all">
                  Next Step
                </button>
              )}
              {(revealed[i] ?? 0) > 0 && (
                <button onClick={() => setRevealed(prev => ({ ...prev, [i]: 0 }))}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase hover:text-white transition-all">
                  Reset
                </button>
              )}
              {(revealed[i] ?? 0) === ex.steps.length - 1 && (
                <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                  <CheckCircle2 size={14} /> Complete
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Re-export CheckCircle2 used inline ──────────────────────────────────────

function CheckCircle2({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
