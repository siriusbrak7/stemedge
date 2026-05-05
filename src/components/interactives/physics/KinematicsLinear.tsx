import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';

type Module = 'ticker' | 'suvat' | 'graph';

export default function KinematicsLinear() {
  const [module, setModule] = useState<Module>('ticker');
  const [speed, setSpeed] = useState(5);
  const [accel, setAccel] = useState(2);
  const [time, setTime] = useState(4);
  const [carPos, setCarPos] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef<number>(0);

  // SUVAT calculations
  const finalV = speed + accel * time;
  const displacement = speed * time + 0.5 * accel * time * time;

  // Ticker tape spacings
  const spacings = useMemo(() => Array.from({ length: 10 }, (_, i) => speed + i * accel), [speed, accel]);

  // Car animation
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const tick = () => {
      const dt = (performance.now() - start) / 1000;
      const pos = Math.min(100, (speed * dt + 0.5 * accel * dt * dt) * 3);
      setCarPos(pos);
      if (pos < 100) animRef.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, speed, accel]);

  // Graph points
  const vPoints = useMemo(() => Array.from({ length: 11 }, (_, i) => {
    const t = i * 0.5;
    return { t, v: speed + accel * t, s: speed * t + 0.5 * accel * t * t };
  }), [speed, accel]);

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🏎️ Linear Kinematics</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Explore motion, ticker tapes, SUVAT equations, and velocity-time graphs.</p>
        </div>
        <div className="flex gap-1.5 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5">
          {([['ticker', '📏 Tape'], ['suvat', '📐 SUVAT'], ['graph', '📊 Graphs']] as [Module, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setModule(id)}
              className={`rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                module === id ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.35)]' : 'text-slate-400 hover:text-white'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {module === 'ticker' && (
          <motion.div key="ticker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Ticker Tape Simulator</div>
              <svg viewBox="0 0 460 220" className="w-full rounded-2xl bg-[#0b1018]">
                {/* Track */}
                <rect x="20" y="100" width="420" height="6" rx="3" fill="#334155" />
                {/* Car */}
                <motion.g animate={{ x: carPos * 3.8 }}>
                  <rect x="25" y="78" width="40" height="22" rx="4" fill="#38bdf8" />
                  <circle cx="32" cy="102" r="5" fill="#94a3b8" />
                  <circle cx="58" cy="102" r="5" fill="#94a3b8" />
                </motion.g>
                {/* Ticker tape strip */}
                <rect x="20" y="130" width="420" height="30" rx="4" fill="#fefce8" opacity="0.08" />
                {spacings.map((s, i) => {
                  const x = 30 + i * (28 + s * 1.5);
                  return x < 430 ? <g key={i}>
                    <rect x={x} y="132" width="3" height="26" fill="#f59e0b" />
                    <text x={x + 1} y="174" fill="#64748b" fontSize="7">{i}</text>
                  </g> : null;
                })}
                {/* Labels */}
                <text x="20" y="195" fill="#94a3b8" fontSize="10">Wider gaps = higher speed. Widening gaps = acceleration.</text>
              </svg>
              <button onClick={() => { setCarPos(0); setRunning(true); }} disabled={running}
                className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-30">
                ▶ Launch Car
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center gap-4 w-full">
              {/* controls right-col */}
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <StemSlider label="Initial Speed (m/s)" value={speed} min={1} max={10} color="cyan" onChange={setSpeed} />
                <div className="mt-4">
                  <StemSlider label="Acceleration (m/s²)" value={accel} min={0} max={5} color="orange" onChange={setAccel} />
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Key Insight</div>
                <p className="text-sm text-slate-300">If ticker tape dots are <strong className="text-white">equally spaced</strong>, the object moves at constant velocity. If spacing <strong className="text-cyan-400">increases</strong>, it's accelerating. If spacing <strong className="text-red-400">decreases</strong>, it's decelerating.</p>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'suvat' && (
          <motion.div key="suvat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">SUVAT Calculator</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Metric label="s (displacement)" value={`${displacement.toFixed(1)} m`} color="text-green-400" />
                <Metric label="u (initial velocity)" value={`${speed} m/s`} color="text-cyan-400" />
                <Metric label="v (final velocity)" value={`${finalV.toFixed(1)} m/s`} color="text-yellow-400" />
                <Metric label="a (acceleration)" value={`${accel} m/s²`} color="text-orange-400" />
                <Metric label="t (time)" value={`${time} s`} color="text-purple-400" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-black/30 p-4 space-y-2">
                <div className="text-[10px] uppercase text-slate-500 mb-2">Equations Used</div>
                <p className="text-sm text-white font-mono">v = u + at = {speed} + {accel}×{time} = <span className="text-yellow-400">{finalV.toFixed(1)}</span></p>
                <p className="text-sm text-white font-mono">s = ut + ½at² = {speed}×{time} + ½×{accel}×{time}² = <span className="text-green-400">{displacement.toFixed(1)}</span></p>
                <p className="text-sm text-white font-mono">v² = u² + 2as = {speed}² + 2×{accel}×{displacement.toFixed(1)} = <span className="text-pink-400">{(finalV * finalV).toFixed(1)}</span></p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <StemSlider label="Initial Velocity u (m/s)" value={speed} min={0} max={15} color="cyan" onChange={setSpeed} />
                <div className="mt-4">
                  <StemSlider label="Acceleration a (m/s²)" value={accel} min={-5} max={8} color="orange" onChange={setAccel} />
                </div>
                <div className="mt-4">
                  <StemSlider label="Time t (s)" value={time} min={1} max={10} color="purple" onChange={setTime} />
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">The 5 SUVAT Equations</div>
                <ul className="text-sm text-slate-300 font-mono space-y-1">
                  <li>① v = u + at</li>
                  <li>② s = ut + ½at²</li>
                  <li>③ s = ½(u + v)t</li>
                  <li>④ v² = u² + 2as</li>
                  <li>⑤ s = vt - ½at²</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'graph' && (
          <motion.div key="graph" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Velocity-Time Graph</div>
              <svg viewBox="0 0 400 220" className="w-full rounded-2xl bg-[#0a1019]">
                {/* Axes */}
                <line x1="50" y1="190" x2="380" y2="190" stroke="#475569" strokeWidth="1.5" />
                <line x1="50" y1="20" x2="50" y2="190" stroke="#475569" strokeWidth="1.5" />
                <text x="210" y="215" fill="#64748b" fontSize="10" textAnchor="middle">Time (s)</text>
                <text x="15" y="110" fill="#64748b" fontSize="10" transform="rotate(-90 15 110)">Velocity (m/s)</text>
                {/* Grid */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={i} x1="50" y1={20 + i * 34} x2="380" y2={20 + i * 34} stroke="#1e293b" strokeWidth="1" />
                ))}
                {/* Area fill */}
                <motion.polygon fill="rgba(56,189,248,0.08)" stroke="none"
                  key={`fill-${speed}-${accel}`}
                  points={`50,190 ${vPoints.map(p => `${50 + p.t * 60},${190 - p.v * 6}`).join(' ')} ${50 + vPoints[vPoints.length - 1].t * 60},190`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                {/* V-T line — draw-on */}
                <motion.polyline fill="none" stroke="#38bdf8" strokeWidth="3"
                  key={`vt-${speed}-${accel}`}
                  points={vPoints.map(p => `${50 + p.t * 60},${190 - p.v * 6}`).join(' ')}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.5))' }} />
                <text x="180" y="170" fill="#38bdf8" fontSize="9" opacity="0.6">Area = displacement</text>
              </svg>

              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Displacement-Time Graph</div>
              <svg viewBox="0 0 400 220" className="w-full rounded-2xl bg-[#0a1019]">
                <line x1="50" y1="190" x2="380" y2="190" stroke="#475569" strokeWidth="1.5" />
                <line x1="50" y1="20" x2="50" y2="190" stroke="#475569" strokeWidth="1.5" />
                <text x="210" y="215" fill="#64748b" fontSize="10" textAnchor="middle">Time (s)</text>
                <text x="15" y="110" fill="#64748b" fontSize="10" transform="rotate(-90 15 110)">Displacement (m)</text>
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={i} x1="50" y1={20 + i * 34} x2="380" y2={20 + i * 34} stroke="#1e293b" strokeWidth="1" />
                ))}
                <polyline fill="none" stroke="#22c55e" strokeWidth="3"
                  points={vPoints.map(p => `${50 + p.t * 60},${190 - p.s * 2.5}`).join(' ')} />
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <StemSlider label="Initial Velocity (m/s)" value={speed} min={0} max={12} color="cyan" onChange={setSpeed} />
                <div className="mt-4">
                  <StemSlider label="Acceleration (m/s²)" value={accel} min={-4} max={6} color="orange" onChange={setAccel} />
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300 space-y-2">
                <p>📈 <strong className="text-white">V-T graph</strong>: Gradient = acceleration. Area under line = displacement.</p>
                <p>📈 <strong className="text-white">S-T graph</strong>: Gradient = velocity. A curve means non-uniform velocity.</p>
                <p className="text-xs text-slate-500 italic">Try setting a = 0 to see constant velocity (straight horizontal V-T line, linear S-T).</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-black/30 border border-slate-800 rounded-xl p-3">
      <div className="text-[9px] uppercase text-slate-500">{label}</div>
      <div className={`text-lg font-mono mt-1 ${color}`}>{value}</div>
    </div>
  );
}
