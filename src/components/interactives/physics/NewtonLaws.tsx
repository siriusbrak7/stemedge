import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';

type LawMode = '1st' | '2nd' | '3rd';
type ViewMode = 'inertia' | 'acceleration' | 'reaction';

const TABS = [
  { id: 'inertia' as ViewMode, label: 'Inertia', icon: '🧊' },
  { id: 'acceleration' as ViewMode, label: 'F = ma', icon: '🚗' },
  { id: 'reaction' as ViewMode, label: 'Action-Reaction', icon: '↔️' },
];

const LAW_META = {
  '1st': {
    formula: 'ΣF = 0 → v = const',
    color: '#22D3EE',
    title: 'Law of Inertia',
    desc: 'An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an unbalanced force.',
  },
  '2nd': {
    formula: 'F = ma',
    color: '#f59e0b',
    title: 'Law of Acceleration',
    desc: 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma.',
  },
  '3rd': {
    formula: 'F₁₂ = −F₂₁',
    color: '#fb7185',
    title: 'Law of Action–Reaction',
    desc: 'For every action, there is an equal and opposite reaction. Forces always come in pairs.',
  },
};

const TRAIL_LENGTH = 10;

export default function NewtonLaws() {
  const [viewMode, setViewMode] = useState<ViewMode>('acceleration');
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [friction, setFriction] = useState(0);
  const [trail, setTrail] = useState<number[]>([]);
  const lawMode: LawMode = viewMode === 'inertia' ? '1st' : viewMode === 'reaction' ? '3rd' : '2nd';
  const meta = LAW_META[lawMode];

  const acceleration = lawMode === '2nd' ? Math.max(0, (force - friction) / mass) : 0;
  const distance = Math.min(560, 0.5 * acceleration * Math.pow(time, 2));
  const velocity = acceleration * time;

  // Scale velocity (m/s) to 0–1 for gauge
  const velNorm = Math.min(1, velocity / 60);

  useEffect(() => {
    if (!isPlaying || distance >= 560) {
      if (distance >= 560) setIsPlaying(false);
      return;
    }
    const interval = window.setInterval(() => {
      setTime(prev => prev + 0.1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, distance]);

  // Trail
  useEffect(() => {
    if (isPlaying) {
      setTrail(prev => [...prev.slice(-(TRAIL_LENGTH - 1)), distance]);
    }
  }, [distance, isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setTrail([]);
  };

  const boxSize = Math.max(38, Math.min(68, mass * 2.8));

  // Velocity gauge arc (SVG semi-circle)
  const gaugeR = 36;
  const gaugePerim = Math.PI * gaugeR;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Newton's Laws</h3>
          <p className="text-xs text-slate-500">Three linked force-motion investigations</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={(v) => { setViewMode(v); reset(); }} accentColor={viewMode === 'acceleration' ? 'orange' : viewMode === 'reaction' ? 'pink' : 'cyan'} />
      </div>

      {/* Controls + HUD */}
      <div className="w-full flex flex-col md:flex-row gap-5 mb-5">
        {/* Sliders */}
        <div className="flex-1 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <StemSlider label={lawMode === '3rd' ? 'Action force' : 'Applied Force'} value={force} min={0} max={100} unit="N" color="cyan"
            onChange={v => { setForce(v); reset(); }} />
          <StemSlider label="Mass" value={mass} min={1} max={50} unit="kg" color="orange"
            onChange={v => { setMass(v); reset(); }} />
          <StemSlider label="Friction" value={friction} min={0} max={50} unit="N" color="pink"
            onChange={v => { setFriction(v); reset(); }} disabled={lawMode === '3rd'} />
        </div>

        {/* HUD */}
        <div className="md:w-64 p-5 rounded-2xl border bg-black flex flex-col justify-between relative overflow-hidden"
          style={{ borderColor: `${meta.color}40`, boxShadow: `0 0 30px ${meta.color}18` }}
        >
          <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[9px] font-bold"
            style={{ backgroundColor: `${meta.color}25`, color: meta.color }}>
            {lawMode} Law · {meta.title}
          </div>

          {/* Formula */}
          <div className="text-center font-mono mt-6 mb-4">
            <div className="text-2xl font-black" style={{ color: meta.color }}>{meta.formula}</div>
            {lawMode === '2nd' && (
              <div className="text-xs text-slate-500 mt-1">
                a = ({force} − {friction}) ÷ {mass} = <span style={{ color: meta.color }}>{acceleration.toFixed(2)} m/s²</span>
              </div>
            )}
          </div>

          {/* Velocity Gauge */}
          {lawMode === '2nd' && (
            <div className="flex flex-col items-center gap-1">
              <svg width="90" height="52" viewBox="0 0 90 52">
                {/* Track */}
                <path d={`M 8 46 A ${gaugeR} ${gaugeR} 0 0 1 82 46`}
                  fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                {/* Fill */}
                <motion.path d={`M 8 46 A ${gaugeR} ${gaugeR} 0 0 1 82 46`}
                  fill="none" strokeWidth="8" strokeLinecap="round"
                  stroke={meta.color}
                  strokeDasharray={`${gaugePerim} ${gaugePerim}`}
                  animate={{ strokeDashoffset: gaugePerim * (1 - velNorm) }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  style={{ filter: `drop-shadow(0 0 6px ${meta.color})` }}
                />
              </svg>
              <div className="text-xs text-slate-500">
                Velocity: <span className="font-mono" style={{ color: meta.color }}>{velocity.toFixed(1)} m/s</span>
              </div>
              <div className="text-xs text-slate-600">
                Distance: <span className="font-mono text-white">{distance.toFixed(1)} m</span>
              </div>
            </div>
          )}

          {/* Play controls */}
          <div className="flex gap-3 justify-center mt-3">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileTap={{ scale: 0.92 }}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: isPlaying ? '#ef4444' : meta.color,
                boxShadow: `0 0 20px ${isPlaying ? '#ef444466' : meta.color + '55'}`,
              }}
            >
              {isPlaying
                ? <span className="w-4 h-4 bg-white rounded-sm" />
                : <Play size={18} fill="black" color="black" />}
            </motion.button>
            <button onClick={reset}
              className="w-11 h-11 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center hover:text-white transition-colors">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Simulation track */}
      <div className="relative w-full h-36 border-b-2 border-slate-700 bg-slate-900/20 rounded-xl overflow-hidden">
        {/* Distance markers */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-8 text-[9px] font-mono text-slate-700">
          {['0m', '100m', '200m', '300m', '400m', '500m'].map(l => <span key={l}>{l}</span>)}
        </div>
        {/* Ground texture */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 opacity-40" />

        {/* Motion Trail */}
        {trail.map((pos, i) => {
          const alpha = (i + 1) / trail.length;
          return (
            <div key={i} className="absolute bottom-2 left-8 flex items-end"
              style={{
                transform: `translateX(${pos}px)`,
                width: `${boxSize}px`,
                height: `${boxSize * alpha}px`,
                backgroundColor: meta.color,
                opacity: alpha * 0.15,
                borderRadius: '4px',
              }}
            />
          );
        })}

        {/* Main object box */}
        <motion.div
          className="absolute bottom-2 left-8 flex items-center justify-center border-2 z-20"
          style={{
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            borderColor: meta.color,
            backgroundColor: `${meta.color}20`,
            boxShadow: isPlaying ? `0 0 20px ${meta.color}50` : 'none',
            borderRadius: '8px',
          }}
          animate={{ x: distance }}
          transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
        >
          <span className="font-bold text-xs" style={{ color: meta.color }}>{mass}kg</span>

          {/* Force arrow */}
          {force > 0 && distance < 560 && (
            <motion.div className="absolute top-1/2 left-full flex items-center -translate-y-1/2 ml-1"
              animate={{ opacity: isPlaying ? 1 : 0.5 }}
            >
              <div className="h-1 rounded-full" style={{
                width: `${Math.max(8, (force - friction) * 0.6)}px`,
                backgroundColor: meta.color,
              }} />
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[7px] border-t-transparent border-b-transparent"
                style={{ borderLeftColor: meta.color }} />
            </motion.div>
          )}

          {/* Friction arrow */}
          {friction > 0 && (
            <motion.div className="absolute top-1/2 right-full flex items-center -translate-y-1/2 mr-1 flex-row-reverse"
              animate={{ opacity: isPlaying ? 0.8 : 0.3 }}
            >
              <div className="h-1 rounded-full bg-red-500" style={{ width: `${friction * 0.5}px` }} />
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[7px] border-t-transparent border-b-transparent border-r-red-500" />
            </motion.div>
          )}
        </motion.div>

        {/* 1st Law: stationary pulsing state */}
        {lawMode === '1st' && !isPlaying && time === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="text-xs text-slate-500 font-mono"
              animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              Apply force and press ▶ to observe inertia
            </motion.div>
          </div>
        )}

        {/* 3rd Law: collision blocks */}
        {lawMode === '3rd' && (
          <div className="absolute bottom-2 right-24 flex items-end gap-3">
            <motion.div className="w-14 h-14 rounded-lg border-2 border-purple-500 bg-purple-500/15 flex items-center justify-center"
              animate={isPlaying ? { x: [0, -16, 0] } : {}}
              transition={{ duration: 0.55, repeat: isPlaying ? Infinity : 0 }}
              style={{ boxShadow: isPlaying ? '0 0 16px rgba(167,139,250,0.5)' : 'none' }}
            >
              <span className="text-purple-400 text-xs font-bold">A</span>
            </motion.div>
            <div className="flex items-center gap-1 self-center">
              <span className="text-brand-accent text-xs font-bold">→F</span>
              <span className="text-red-400 text-xs font-bold">←F</span>
            </div>
            <motion.div className="w-14 h-14 rounded-lg border-2 border-green-500 bg-green-500/15 flex items-center justify-center"
              animate={isPlaying ? { x: [0, 16, 0] } : {}}
              transition={{ duration: 0.55, repeat: isPlaying ? Infinity : 0 }}
              style={{ boxShadow: isPlaying ? '0 0 16px rgba(34,197,94,0.5)' : 'none' }}
            >
              <span className="text-green-400 text-xs font-bold">B</span>
            </motion.div>
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5 w-full max-w-xl">
        <div className="rounded-xl p-5 border" style={{ borderColor: `${meta.color}30`, backgroundColor: `${meta.color}08` }}>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: meta.color }}>
            Newton's {lawMode} Law · {meta.title}
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">{meta.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}
