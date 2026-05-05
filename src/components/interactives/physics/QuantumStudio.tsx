import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';
import InteractiveModuleShell from '../shared/InteractiveModuleShell';

type ViewMode = 'photoelectric' | 'duality' | 'spectra' | 'uncertainty';

const tabs = [
  { id: 'photoelectric' as ViewMode, label: 'Photoelectric', icon: '☀️' },
  { id: 'duality'       as ViewMode, label: 'Wave-Particle', icon: '🌊' },
  { id: 'spectra'       as ViewMode, label: 'Spectra',       icon: '🌈' },
  { id: 'uncertainty'   as ViewMode, label: 'Uncertainty',   icon: '🎲' },
];

export default function QuantumStudio() {
  const [tab, setTab] = useState<ViewMode>('photoelectric');
  const [frequency, setFrequency] = useState(7);
  const [intensity, setIntensity] = useState(60);
  const [slitSpacing, setSlitSpacing] = useState(24);
  const [level, setLevel] = useState(3);
  const [positionSpread, setPositionSpread] = useState(35);

  const threshold = 5.2;
  const emission = frequency > threshold;
  const kinetic = Math.max(0, frequency - threshold) * 1.6;
  const fringeSpacing = 120 / slitSpacing;
  const uncertainty = 100 / Math.max(positionSpread, 1);

  const spectrumLines = Array.from({ length: level }, (_, idx) => 80 + idx * (180 / level));

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🌌 Quantum Studio</h3>
          <p className="text-xs text-slate-500 mt-1">Advanced Physics — Photoelectric effect, wave-particle duality, and quantized energy.</p>
        </div>
        <ModuleTabs tabs={tabs} active={tab} onChange={setTab} accentColor="amber" />
      </div>

      <AnimatePresence mode="wait">
        {/* PHOTOELECTRIC */}
        {tab === 'photoelectric' && (
          <motion.div key="pe" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Photoelectric Emission</div>
              <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-[#0a0f18] overflow-hidden">
                {/* Metal surface */}
                <rect x="320" y="40" width="90" height="190" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="365" y="250" fill="#64748b" fontSize="12" textAnchor="middle">Metal Plate</text>
                
                {/* Incident Light Waves */}
                {Array.from({ length: Math.ceil(intensity / 20) }).map((_, i) => (
                  <motion.path key={i}
                    d={`M 0 ${100 + i*20} Q 40 ${80 + i*20} 80 ${100 + i*20} T 160 ${100 + i*20} T 240 ${100 + i*20} T 320 ${100 + i*20}`}
                    fill="none" stroke={frequency > 8 ? '#a855f7' : frequency > 5 ? '#22c55e' : '#ef4444'} strokeWidth="3"
                    initial={{ strokeDasharray: "20 40", strokeDashoffset: 60 }}
                    animate={{ strokeDashoffset: 0 }} transition={{ duration: 10/frequency, repeat: Infinity, ease: 'linear' }}
                    style={{ filter: `drop-shadow(0 0 5px ${frequency > 8 ? '#a855f7' : frequency > 5 ? '#22c55e' : '#ef4444'})` }} />
                ))}

                {/* Emitted Electrons */}
                {emission && Array.from({ length: Math.floor(intensity / 10) }).map((_, idx) => (
                  <motion.circle key={`e-${idx}`} cx="320" cy={80 + (idx % 6) * 20} r="5" fill="#fcd34d"
                    animate={{ cx: [320, 100], opacity: [1, 0] }}
                    transition={{ duration: 2 / Math.max(0.1, kinetic), repeat: Infinity, delay: Math.random(), ease: 'easeOut' }}
                    style={{ filter: 'drop-shadow(0 0 4px #fcd34d)' }} />
                ))}

                {/* Status Text overlay in SVG */}
                {!emission && (
                   <text x="160" y="240" fill="#ef4444" fontSize="14" fontWeight="bold">f &lt; f₀ : No electrons emitted</text>
                )}
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
                <StemSlider label="Light Frequency (f)" value={frequency} min={1} max={10} color={frequency > threshold ? 'green' : 'red'} onChange={setFrequency} />
                <StemSlider label="Light Intensity" value={intensity} min={10} max={100} color="amber" onChange={setIntensity} />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Metrics</div>
                <div className="space-y-2">
                  <div className="bg-black/30 p-3 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Photon Energy (E = hf)</span>
                    <span className="text-white font-mono">{(frequency * 4.14).toFixed(1)} eV</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Max Kinetic Energy (Kmax)</span>
                    <span className={`font-mono font-bold ${emission ? 'text-amber-400' : 'text-red-400'}`}>{emission ? kinetic.toFixed(2) : '0.00'} eV</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* DUALITY */}
        {tab === 'duality' && (
          <motion.div key="duality" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
               <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Double Slit Interference</div>
               <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-[#0a1020]">
                {/* Slit barrier */}
                <rect x="145" y="32" width="10" height="210" fill="#1e293b" />
                <rect x="145" y={137 - slitSpacing/2} width="10" height="12" fill="#0a1020" />
                <rect x="145" y={137 + slitSpacing/2} width="10" height="12" fill="#0a1020" />
                
                {/* Screen */}
                <rect x="434" y="32" width="12" height="210" fill="#334155" />
                
                {/* Interference Pattern on Screen */}
                {Array.from({ length: 15 }).map((_, idx) => {
                  const y = 40 + idx * 14;
                  const distFromCenter = Math.abs(137 - y);
                  // Pattern intensity calculation
                  const intensity = Math.max(0, Math.cos(distFromCenter * Math.PI / fringeSpacing));
                  return (
                    <rect key={idx} x={434} y={y} width="12" height="10" fill="#38bdf8" opacity={intensity * 0.8} />
                  );
                })}
                
                {/* Wave fronts arriving */}
                {Array.from({length: 4}).map((_, i) => (
                   <motion.path key={i} d="M 40 50 Q 80 137 40 224" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.3"
                     initial={{ x: -20 }} animate={{ x: 100 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i*0.5 }} />
                ))}
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <StemSlider label="Slit Separation (d)" value={slitSpacing} min={12} max={50} color="cyan" onChange={setSlitSpacing} />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                <p className="mb-2"><strong>Wave-Particle Duality:</strong> Light propagates as a wave (showing interference) but is detected as discrete particles (photons) on the screen.</p>
                <p>Decreasing the slit separation increases the fringe spacing on the screen (<span className="font-mono text-cyan-400">y = λL/d</span>).</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SPECTRA */}
        {tab === 'spectra' && (
          <motion.div key="spectra" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
               <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Energy Level Transitions</div>
               <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-[#081018]">
                {/* Energy Levels */}
                {spectrumLines.map((y, idx) => (
                  <g key={idx}>
                    <line x1="80" y1={y} x2="240" y2={y} stroke="#c084fc" strokeWidth="2" />
                    <text x="60" y={y+4} fill="#a855f7" fontSize="12">n={level - idx}</text>
                  </g>
                ))}
                
                {/* Emission arrows & Photons */}
                {spectrumLines.slice(1).map((y, idx) => {
                  const targetY = spectrumLines[idx + 1] || spectrumLines[spectrumLines.length-1];
                  const energyDiff = y - targetY;
                  const color = energyDiff > 40 ? '#38bdf8' : energyDiff > 20 ? '#22c55e' : '#ef4444';
                  
                  return (
                    <g key={`t-${idx}`}>
                      {/* Electron drop arrow */}
                      <line x1={120 + idx*30} y1={spectrumLines[0]} x2={120 + idx*30} y2={y} stroke={color} strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 4" />
                      {/* Emitted Photon wave */}
                      <motion.path d={`M ${130 + idx*30} ${y} Q ${150 + idx*30} ${y-10} ${170 + idx*30} ${y} T ${210 + idx*30} ${y}`} fill="none" stroke={color} strokeWidth="2"
                        initial={{ opacity: 0, x: 0 }} animate={{ opacity: [0, 1, 0], x: 200 }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }} />
                    </g>
                  );
                })}
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#fff" /></marker>
                </defs>
              </svg>
            </div>
            <div className="space-y-4">
               <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                 <StemSlider label="Excited Levels Available" value={level} min={2} max={6} color="purple" onChange={setLevel} />
               </div>
               <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                 <p>Electrons exist in discrete, quantized energy levels. When they drop to a lower energy state, they emit a photon of specific frequency corresponding exactly to the energy difference: <span className="font-mono text-purple-400">ΔE = hf</span>.</p>
               </div>
            </div>
          </motion.div>
        )}

        {/* UNCERTAINTY */}
        {tab === 'uncertainty' && (
          <motion.div key="unc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
               <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Heisenberg Uncertainty Principle</div>
               <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-[#0b1117] flex items-center justify-center">
                {/* Wave packet representing particle */}
                <path d={`M 50 140 Q 150 140 250 140 T 450 140`} stroke="#334155" strokeWidth="1" fill="none" />
                
                {/* Position spread */}
                <rect x={250 - positionSpread * 2} y="80" width={positionSpread * 4} height="40" rx="8" fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="2" />
                <text x="250" y="105" fill="#86efac" fontSize="14" textAnchor="middle" fontWeight="bold">Δx (Position)</text>
                
                {/* Momentum spread */}
                <rect x={250 - uncertainty * 5} y="160" width={uncertainty * 10} height="40" rx="8" fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth="2" />
                <text x="250" y="185" fill="#fdba74" fontSize="14" textAnchor="middle" fontWeight="bold">Δp (Momentum)</text>
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <StemSlider label="Position Spread (Δx)" value={positionSpread} min={10} max={80} color="green" onChange={setPositionSpread} />
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                <p className="mb-3">The more precisely the position is determined, the less precisely the momentum is known, and vice versa.</p>
                <div className="bg-[#0a0a1a] p-3 rounded-xl border border-slate-800 text-center font-mono text-white">
                  Δx × Δp ≥ h / 4π
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
