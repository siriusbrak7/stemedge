import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Zap, Radio, Activity, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { WAVE_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const EM_BANDS = [
  { name: 'Radio', freqMin: 3e3, freqMax: 3e11, color: '#6366f1', wavelengthLabel: '> 1 mm', example: 'Citi FM 97.3 MHz', ghanaApp: 'Radio broadcasting' },
  { name: 'Microwave', freqMin: 3e9, freqMax: 3e11, color: '#8b5cf6', wavelengthLabel: '1 mm – 1 m', example: 'DSTV satellite dish', ghanaApp: 'Satellite TV' },
  { name: 'Infrared', freqMin: 3e11, freqMax: 4e14, color: '#f97316', wavelengthLabel: '700 nm – 1 mm', example: 'TV remote control', ghanaApp: 'Night vision cameras' },
  { name: 'Visible Light', freqMin: 4e14, freqMax: 7.5e14, color: '#22d3ee', wavelengthLabel: '400 – 700 nm', example: 'Human eye', ghanaApp: 'Solar panels (visible light)' },
  { name: 'Ultraviolet', freqMin: 7.5e14, freqMax: 3e17, color: '#a855f7', wavelengthLabel: '10 – 400 nm', example: 'Sunscreen', ghanaApp: 'UV sterilisation in hospitals' },
  { name: 'X-Ray', freqMin: 3e17, freqMax: 3e19, color: '#ec4899', wavelengthLabel: '0.01 – 10 nm', example: 'Korle Bu hospital scanner', ghanaApp: 'Medical imaging' },
  { name: 'Gamma', freqMin: 3e19, freqMax: 3e25, color: '#ef4444', wavelengthLabel: '< 0.01 nm', example: 'Radioactive decay', ghanaApp: 'Cancer radiotherapy' },
];

const GHANA_CHALLENGES = [
  { q: 'Citi FM broadcasts at 97.3 MHz. Which EM wave type is this?', answer: 'Radio', opts: ['Radio', 'Microwave', 'Infrared', 'Ultraviolet'] },
  { q: 'The DSTV satellite dish at your house receives signals. What wave type?', answer: 'Microwave', opts: ['Radio', 'Microwave', 'X-Ray', 'Gamma'] },
  { q: 'Korle Bu Teaching Hospital uses these waves for bone scans.', answer: 'X-Ray', opts: ['Infrared', 'Ultraviolet', 'X-Ray', 'Gamma'] },
  { q: 'Hospitals in Accra use these for sterilising equipment and treating skin conditions.', answer: 'Ultraviolet', opts: ['Visible Light', 'Ultraviolet', 'X-Ray', 'Infrared'] },
  { q: 'Solar panels on Ghanaian rooftops convert which EM waves into electricity?', answer: 'Visible Light', opts: ['Radio', 'Microwave', 'Visible Light', 'Infrared'] },
];

type Mode = 'oscilloscope' | 'em-spectrum' | 'doppler' | 'ghana-challenge';

interface WaveSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function WaveSimulation({ variables, isRunning, onRecordData }: WaveSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const onRecordDataRef = useRef(onRecordData);
  onRecordDataRef.current = onRecordData;

  const freq = variables['frequency'] ?? 5;
  const amplitude = variables['amplitude'] ?? 5;
  const damping = variables['damping'] ?? 0;

  const [mode, setMode] = useState<Mode>('oscilloscope');
  const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse');
  const [dopplerSpeed, setDopplerSpeed] = useState(0.5);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [speedPred, setSpeedPred] = useState('');
  const [speedFeedback, setSpeedFeedback] = useState<string | null>(null);
  const [dopplerPred, setDopplerPred] = useState<'higher' | 'lower' | null>(null);
  const [dopplerFeedback, setDopplerFeedback] = useState<string | null>(null);
  const [sourceX, setSourceX] = useState(100);

  const W = 700, H = 280;
  const SPEED_OF_LIGHT = 3e8;
  const wavelength = waveType === 'transverse' ? SPEED_OF_LIGHT / (freq * 1e14) : SPEED_OF_LIGHT / (freq * 1e9);

  const visualAmplitude = amplitude * 12;

  const drawOscilloscope = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060b18';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(34,211,238,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const centerY = H / 2;

    if (waveType === 'transverse') {
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10;
      for (let x = 0; x < W; x++) {
        let amp = visualAmplitude;
        if (damping > 0) {
          amp = visualAmplitude * Math.exp(-damping * 0.3 * (x / W));
        }
        const y = centerY - amp * Math.sin((x / W) * freq * Math.PI * 2 + tRef.current);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(250,204,21,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(20, centerY - visualAmplitude); ctx.lineTo(W - 20, centerY - visualAmplitude); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, centerY + visualAmplitude); ctx.lineTo(W - 20, centerY + visualAmplitude); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '11px monospace';
      ctx.fillText(`A = ${amplitude} units`, 25, centerY - visualAmplitude - 5);

      const λPx = W / freq;
      ctx.strokeStyle = 'rgba(163,230,53,0.7)';
      ctx.beginPath(); ctx.moveTo(30, H - 20); ctx.lineTo(30 + λPx, H - 20); ctx.stroke();
      ctx.fillStyle = '#a3e635';
      ctx.fillText('λ (1 cycle)', 30 + λPx / 2 - 30, H - 5);

      for (let i = 0; i < 8; i++) {
        const px = (i / 8) * W;
        let amp = visualAmplitude;
        if (damping > 0) {
          amp = visualAmplitude * Math.exp(-damping * 0.3 * (px / W));
        }
        const py = centerY - amp * Math.sin((px / W) * freq * Math.PI * 2 + tRef.current);
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f472b6'; ctx.fill();
      }
    } else {
      const numParticles = 60;
      const spacing = W / numParticles;
      for (let i = 0; i < numParticles; i++) {
        const baseX = i * spacing;
        let amp = visualAmplitude;
        if (damping > 0) {
          amp = visualAmplitude * Math.exp(-damping * 0.3 * (i / numParticles));
        }
        const displacement = amp * 0.3 * Math.sin((i / numParticles) * freq * Math.PI * 2 + tRef.current);
        const x = baseX + displacement;
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin((i / numParticles) * freq * Math.PI + tRef.current));
        ctx.fillStyle = `rgba(34,211,238,${alpha})`;
        ctx.beginPath(); ctx.arc(x, centerY + (i % 3 - 1) * 12, 5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#22d3ee';
      ctx.font = '11px monospace';
      ctx.fillText('← Compression Rarefaction →', W / 2 - 110, 25);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    const dampingLabel = damping > 0 ? ` | damping = ${damping}` : '';
    ctx.fillText(`f = ${freq} Hz | A = ${amplitude} | v = f × λ = 3×10⁸ m/s (EM)${dampingLabel}`, 15, 18);
  }, [freq, amplitude, damping, waveType, visualAmplitude, W, H]);

  const drawEMSpectrum = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060b18'; ctx.fillRect(0, 0, W, H);

    const bandW = W / EM_BANDS.length;
    EM_BANDS.forEach((band, i) => {
      const x = i * bandW;
      const grad = ctx.createLinearGradient(x, 0, x + bandW, 0);
      grad.addColorStop(0, band.color + 'aa');
      grad.addColorStop(1, band.color + '44');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 60, bandW, H - 120);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(band.name, x + bandW / 2, 50);
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText(band.wavelengthLabel, x + bandW / 2, H - 60);
      ctx.fillText(band.example, x + bandW / 2, H - 45);
    });
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px monospace';
    ctx.fillText('← Longer λ, Lower f', 10, H - 15);
    ctx.fillText('Shorter λ, Higher f →', W - 180, H - 15);
  }, [W, H]);

  const drawDoppler = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060b18'; ctx.fillRect(0, 0, W, H);

    const srcY = H / 2;
    const numRings = 6;
    for (let r = 1; r <= numRings; r++) {
      const progress = (tRef.current * dopplerSpeed * 15 + r * 40) % 220;
      ctx.beginPath();
      ctx.arc(sourceX + progress * 0.4, srcY, progress * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34,211,238,${0.8 - progress / 260})`;
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath();
      ctx.arc(sourceX - progress * 0.7, srcY, progress * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251,146,60,${0.7 - progress / 280})`;
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(sourceX - 20, srcY - 12, 40, 24);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🚑', sourceX, srcY + 5);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#22d3ee'; ctx.font = '11px monospace';
    ctx.fillText('Compressed wavefronts → higher pitch', sourceX + 30, srcY - 30);
    ctx.fillStyle = '#fb923c';
    ctx.fillText('Stretched wavefronts → lower pitch', 20, srcY + 50);
  }, [sourceX, dopplerSpeed, W, H]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (mode === 'oscilloscope') drawOscilloscope(ctx);
    else if (mode === 'em-spectrum') drawEMSpectrum(ctx);
    else if (mode === 'doppler') drawDoppler(ctx);
    else { ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#060b18'; ctx.fillRect(0, 0, W, H); }
  }, [mode, drawOscilloscope, drawEMSpectrum, drawDoppler, W, H]);

  useEffect(() => {
    const loop = () => {
      tRef.current += 0.04;
      if (mode === 'doppler') setSourceX(prev => { const nx = prev + dopplerSpeed * 1.5; return nx > W - 50 ? 80 : nx; });
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, draw, dopplerSpeed, W]);

  const recordWaveData = () => {
    const waveSpeed = freq * (W / freq);
    onRecordDataRef.current({
      frequency: freq,
      amplitude: amplitude,
      damping: damping,
      wavelength: Number((SPEED_OF_LIGHT / (freq * 1e14)).toExponential(2)),
      waveSpeed: Number(waveSpeed.toFixed(0)),
    });
  };

  const checkSpeed = () => {
    const v = parseFloat(speedPred);
    const actual = freq * (W / freq);
    const pct = Math.abs(v - actual) / actual;
    if (pct < 0.10) { setSpeedFeedback('✅ Correct! v = f × λ'); setScore(s => s + 3); setStreak(s => s + 1); }
    else { setSpeedFeedback(`❌ Actual ≈ ${actual.toFixed(0)} units/s. Use v = f × λ`); setStreak(0); }
  };

  const handleEMAnswer = (opt: string) => {
    if (selected) return;
    const ch = GHANA_CHALLENGES[challengeIdx];
    setSelected(opt);
    if (opt === ch.answer) { setFeedback('correct'); setScore(s => s + 3); setStreak(s => s + 1); }
    else { setFeedback('wrong'); setStreak(0); }
  };

  const nextChallenge = () => {
    setChallengeIdx(i => (i + 1) % GHANA_CHALLENGES.length);
    setSelected(null); setFeedback(null);
  };

  const handleDopplerPred = (dir: 'higher' | 'lower') => {
    setDopplerPred(dir);
    if (dir === 'higher') { setDopplerFeedback('✅ Correct! Approaching source → compressed wavefronts → higher frequency'); setScore(s => s + 4); setStreak(s => s + 1); }
    else { setDopplerFeedback('❌ As the source approaches, wavefronts compress → frequency increases (higher pitch)'); setStreak(0); }
  };

  const ch = GHANA_CHALLENGES[challengeIdx];

  const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
    { id: 'oscilloscope', label: 'Oscilloscope', icon: <Activity size={14} /> },
    { id: 'em-spectrum', label: 'EM Spectrum', icon: <Zap size={14} /> },
    { id: 'doppler', label: 'Doppler', icon: <Radio size={14} /> },
    { id: 'ghana-challenge', label: 'Ghana Challenge', icon: <Trophy size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Wave <span className="text-brand-accent font-medium">Synthesiser Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Explore waves, the EM spectrum, and the Doppler effect</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold">{score} pts</span>
          </div>
          {streak >= 2 && <span className="text-orange-400 text-sm font-bold animate-pulse">🔥 {streak}</span>}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === m.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {m.icon}{m.label}
          </button>
        ))}
      </div>

      {mode !== 'ghana-challenge' && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full">
          <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
        </div>
      )}

      {mode === 'oscilloscope' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-brand-border rounded-2xl p-5 space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                <span>Frequency</span><span className="text-brand-accent">{freq} Hz</span>
              </div>
              <input type="range" min={1} max={6} step={0.5} value={freq} readOnly
                className="w-full accent-cyan-400" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                <span>Amplitude</span><span className="text-yellow-400">{amplitude} units</span>
              </div>
              <input type="range" min={1} max={10} value={amplitude} readOnly
                className="w-full accent-yellow-400" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                <span>Damping</span><span className="text-purple-400">{damping}</span>
              </div>
              <input type="range" min={0} max={5} step={0.5} value={damping} readOnly
                className="w-full accent-purple-400" />
            </div>
            <div className="flex gap-2">
              {(['transverse', 'longitudinal'] as const).map(t => (
                <button key={t} onClick={() => setWaveType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    waveType === t ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={recordWaveData}
              className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black">
              Record Wave Data
            </button>
          </div>
          <div className="bg-slate-900/60 border border-orange-500/20 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">🎯 Predict Wave Speed</h3>
            <p className="text-slate-400 text-xs mb-3">Given f = {freq} Hz and visible λ ≈ {(W / freq).toFixed(0)} px, predict v = f × λ (in px/s)</p>
            <div className="flex gap-2">
              <input type="number" value={speedPred} onChange={e => setSpeedPred(e.target.value)}
                placeholder="Enter v..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-orange-400 outline-none" />
              <button onClick={checkSpeed} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-400 transition-all">Check</button>
            </div>
            <AnimatePresence>
              {speedFeedback && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 text-xs font-bold p-2 rounded-lg ${speedFeedback.startsWith('✅') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {speedFeedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {mode === 'em-spectrum' && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EM_BANDS.map(b => (
            <div key={b.name} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: b.color }} />
              <div className="text-xs font-bold text-white">{b.name}</div>
              <div className="text-[9px] text-slate-400 mt-1">{b.ghanaApp}</div>
            </div>
          ))}
        </div>
      )}

      {mode === 'doppler' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-brand-border rounded-2xl p-5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              <span>Source Speed</span><span className="text-brand-accent">{dopplerSpeed.toFixed(1)}×</span>
            </div>
            <input type="range" min={0.2} max={2} step={0.1} value={dopplerSpeed}
              onChange={e => setDopplerSpeed(Number(e.target.value))}
              className="w-full accent-cyan-400" />
            <p className="text-slate-500 text-xs mt-3">Watch the ambulance approaching you (right side). The wavefronts in front are compressed.</p>
          </div>
          <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">🎯 Predict</h3>
            <p className="text-slate-400 text-xs mb-3">As the ambulance approaches you, does the siren pitch sound <strong className="text-white">higher</strong> or <strong className="text-white">lower</strong>?</p>
            <div className="flex gap-2">
              {(['higher', 'lower'] as const).map(dir => (
                <button key={dir} onClick={() => handleDopplerPred(dir)} disabled={!!dopplerPred}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                    dopplerPred === dir
                      ? dopplerFeedback?.startsWith('✅') ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-red-500/20 border-2 border-red-500 text-red-400'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}`}>
                  {dir}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {dopplerFeedback && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`mt-3 text-xs p-2 rounded-lg ${dopplerFeedback.startsWith('✅') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {dopplerFeedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {mode === 'ghana-challenge' && (
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-slate-900/60 border border-brand-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                🇬🇭 Ghana EM Challenge {challengeIdx + 1}/{GHANA_CHALLENGES.length}
              </span>
              <span className="text-xs text-yellow-400 font-mono">+3 pts</span>
            </div>
            <p className="text-white font-medium mb-5">{ch.q}</p>
            <div className="space-y-2">
              {ch.opts.map(opt => (
                <button key={opt} onClick={() => handleEMAnswer(opt)} disabled={!!selected}
                  className={`w-full p-3 rounded-xl text-left text-sm border transition-all ${
                    selected === opt
                      ? feedback === 'correct' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'
                      : selected && opt === ch.answer ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-brand-accent/50'}`}>
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected === opt && (feedback === 'correct' ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />)}
                  </div>
                </button>
              ))}
            </div>
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <p className={`text-sm font-bold mb-3 ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback === 'correct' ? '🎯 Correct! +3 pts' : `The answer is: ${ch.answer}`}
                </p>
                <button onClick={nextChallenge} className="px-6 py-2 bg-brand-accent text-black rounded-xl text-sm font-bold hover:bg-white transition-all">
                  Next Challenge →
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      <div className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge / IB · </span>
        All EM waves travel at 3×10⁸ m/s in a vacuum. Use v = fλ. The Doppler effect increases observed frequency as a source approaches. EM spectrum: Radio → Micro → IR → Visible → UV → X-Ray → Gamma (increasing frequency).
      </div>
    </div>
  );
}

export default function WaveLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <WaveSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgFreq = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).frequency ?? 0) : 0
          )
        ).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You investigated wave properties across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Average Frequency</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{avgFreq.toFixed(1)} Hz</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Trials</div>
            <div className="text-2xl font-mono font-bold text-white">{trials.length}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setCompletedSession(null)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={WAVE_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
