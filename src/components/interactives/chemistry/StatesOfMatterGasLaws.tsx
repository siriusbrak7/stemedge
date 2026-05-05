import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'states' | 'boyles' | 'charles';

const STATES = [
  { name: 'Solid', desc: 'Particles vibrate in fixed positions. Strong intermolecular forces hold a regular lattice structure. Fixed shape and volume.', icon: '🧊', color: '#60a5fa', arrangement: 'Regular lattice', movement: 'Vibrate in place', spacing: 'Very close', energy: 'Low KE' },
  { name: 'Liquid', desc: 'Particles move past each other but stay close. Weaker forces than solids. Fixed volume, takes container shape.', icon: '💧', color: '#22d3ee', arrangement: 'Irregular, close', movement: 'Slide past each other', spacing: 'Close', energy: 'Medium KE' },
  { name: 'Gas', desc: 'Particles move rapidly in all directions. Very weak forces. No fixed shape or volume — fills any container.', icon: '💨', color: '#a78bfa', arrangement: 'Random', movement: 'Rapid, random motion', spacing: 'Very far apart', energy: 'High KE' },
];

export default function StatesOfMatterGasLaws() {
  const [module, setModule] = useState<Module>('states');
  const [stateIdx, setStateIdx] = useState(0);
  const [volume, setVolume] = useState(60);
  const [temperature, setTemperature] = useState(300);
  const [charlesTemp, setCharlesTemp] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  // Boyle's law: PV = const → P = k/V
  const boylesP = useMemo(() => Math.round((100 * 60) / volume), [volume]);
  // Charles's law: V/T = const
  const charlesV = useMemo(() => Math.round((60 * charlesTemp) / 300), [charlesTemp]);

  // Particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 300, H = 200;

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: 30 + Math.random() * (W - 60), y: 30 + Math.random() * (H - 60),
          vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
        });
      }
    }

    const speedFactor = stateIdx === 0 ? 0.15 : stateIdx === 1 ? 0.8 : 2.5;
    const wallPadding = stateIdx === 0 ? 80 : stateIdx === 1 ? 40 : 10;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050a12';
      ctx.fillRect(0, 0, W, H);

      // Container
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(wallPadding, wallPadding, W - wallPadding * 2, H - wallPadding * 2);

      particlesRef.current.forEach(p => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Bounce
        const minX = wallPadding + 5, maxX = W - wallPadding - 5;
        const minY = wallPadding + 5, maxY = H - wallPadding - 5;
        if (p.x < minX || p.x > maxX) p.vx *= -1;
        if (p.y < minY || p.y > maxY) p.vy *= -1;
        p.x = Math.max(minX, Math.min(maxX, p.x));
        p.y = Math.max(minY, Math.min(maxY, p.y));

        // Random nudge
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;
        const maxV = stateIdx === 0 ? 0.5 : stateIdx === 1 ? 2 : 5;
        p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
        p.vy = Math.max(-maxV, Math.min(maxV, p.vy));

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = STATES[stateIdx].color;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [stateIdx]);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🧊 States of Matter & Gas Laws</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry/Physics — Particle behaviour, Boyle's Law, and Charles' Law.</p>
        </div>
        <div className="flex gap-1">
          {([['states', '🔬 Particles'], ['boyles', '📉 Boyle\'s'], ['charles', '📈 Charles\'']] as [Module, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setModule(id)}
              className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${module === id ? 'bg-violet-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {module === 'states' && (
          <motion.div key="states" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Particle Model</div>
              <div className="flex gap-2 mb-4">
                {STATES.map((s, i) => (
                  <button key={s.name} onClick={() => setStateIdx(i)}
                    className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest ${stateIdx === i ? 'text-black' : 'bg-slate-900 text-slate-300'}`}
                    style={stateIdx === i ? { backgroundColor: s.color } : {}}>
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
              <canvas ref={canvasRef} width={300} height={200} className="w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-3xl mb-2">{STATES[stateIdx].icon}</div>
                <h4 className="text-lg text-white font-medium">{STATES[stateIdx].name}</h4>
                <p className="text-sm text-slate-300 mt-2">{STATES[stateIdx].desc}</p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <tr><th className="py-2 px-2">Property</th>{STATES.map(s => <th key={s.name} className="py-2 px-2" style={{ color: s.color }}>{s.name}</th>)}</tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-800/50"><td className="py-2 px-2 text-white">Arrangement</td>{STATES.map(s => <td key={s.name} className="py-2 px-2">{s.arrangement}</td>)}</tr>
                    <tr className="border-b border-slate-800/50"><td className="py-2 px-2 text-white">Movement</td>{STATES.map(s => <td key={s.name} className="py-2 px-2">{s.movement}</td>)}</tr>
                    <tr className="border-b border-slate-800/50"><td className="py-2 px-2 text-white">Spacing</td>{STATES.map(s => <td key={s.name} className="py-2 px-2">{s.spacing}</td>)}</tr>
                    <tr><td className="py-2 px-2 text-white">Energy</td>{STATES.map(s => <td key={s.name} className="py-2 px-2">{s.energy}</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'boyles' && (
          <motion.div key="boyles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Boyle's Law: P ∝ 1/V (constant T)</div>
              <svg viewBox="0 0 400 240" className="w-full rounded-2xl bg-[#0b1015]">
                {/* Piston container */}
                <rect x="80" y="40" width={volume * 3} height="120" rx="8" fill="rgba(96,165,250,0.1)" stroke="#60a5fa" strokeWidth="2" />
                {/* Piston */}
                <motion.rect x={80 + volume * 3 - 10} y="35" width="20" height="130" rx="4" fill="#94a3b8"
                  animate={{ x: 80 + volume * 3 - 10 }} transition={{ type: 'spring' }} />
                {/* Particles inside */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.circle key={i} cy={70 + (i % 3) * 30} r="4" fill="#60a5fa"
                    animate={{ cx: 100 + (i * (volume * 3 - 40)) / 12 }} transition={{ type: 'spring' }} />
                ))}
                {/* Pressure gauge */}
                <text x="200" y="195" fill="#94a3b8" fontSize="10" textAnchor="middle">Pressure: {boylesP} kPa</text>
                {/* PV graph */}
                <text x="200" y="225" fill="#64748b" fontSize="9" textAnchor="middle">PV = {(boylesP * volume / 100).toFixed(0)} × 100 = constant</text>
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Volume</span><span className="font-mono text-white">{volume} cm³</span></div>
                <input type="range" min={20} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-blue-400" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                    <div className="text-[9px] uppercase text-slate-500">Pressure</div>
                    <div className="text-xl font-mono text-blue-400 mt-1">{boylesP} kPa</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                    <div className="text-[9px] uppercase text-slate-500">PV Product</div>
                    <div className="text-xl font-mono text-purple-400 mt-1">{(boylesP * volume).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p><strong className="text-white">Boyle's Law:</strong> At constant temperature, PV = constant.</p>
                <p>Decrease volume → particles hit walls more frequently → pressure increases.</p>
                <p className="font-mono text-violet-400">P₁V₁ = P₂V₂</p>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'charles' && (
          <motion.div key="charles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Charles' Law: V ∝ T (constant P)</div>
              <svg viewBox="0 0 400 240" className="w-full rounded-2xl bg-[#0b1015]">
                {/* Axes */}
                <line x1="60" y1="200" x2="370" y2="200" stroke="#475569" strokeWidth="1.5" />
                <line x1="60" y1="20" x2="60" y2="200" stroke="#475569" strokeWidth="1.5" />
                <text x="210" y="225" fill="#64748b" fontSize="10" textAnchor="middle">Temperature (K)</text>
                <text x="25" y="115" fill="#64748b" fontSize="10" transform="rotate(-90 25 115)">Volume (cm³)</text>
                {/* V-T line (straight through origin at -273°C = 0 K) */}
                <line x1="60" y1="200" x2="350" y2="30" stroke="#22c55e" strokeWidth="3" />
                {/* Current point */}
                <motion.circle r="6" fill="#22c55e" animate={{ cx: 60 + (charlesTemp / 600) * 290, cy: 200 - (charlesV / 120) * 170 }} />
                {/* -273 label */}
                <text x="60" y="215" fill="#64748b" fontSize="8" textAnchor="middle">0 K</text>
                <text x="350" y="215" fill="#64748b" fontSize="8" textAnchor="middle">600 K</text>
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Temperature (K)</span><span className="font-mono text-white">{charlesTemp} K ({charlesTemp - 273}°C)</span></div>
                <input type="range" min={100} max={600} value={charlesTemp} onChange={e => setCharlesTemp(Number(e.target.value))} className="w-full accent-green-400" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                    <div className="text-[9px] uppercase text-slate-500">Volume</div>
                    <div className="text-xl font-mono text-green-400 mt-1">{charlesV} cm³</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                    <div className="text-[9px] uppercase text-slate-500">V/T Ratio</div>
                    <div className="text-xl font-mono text-orange-400 mt-1">{(charlesV / charlesTemp).toFixed(3)}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p><strong className="text-white">Charles' Law:</strong> At constant pressure, V/T = constant.</p>
                <p>Higher temperature → faster particles → more force on piston → volume expands.</p>
                <p className="font-mono text-green-400">V₁/T₁ = V₂/T₂</p>
                <p className="text-xs text-slate-500 italic">Temperature MUST be in Kelvin (K = °C + 273).</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
