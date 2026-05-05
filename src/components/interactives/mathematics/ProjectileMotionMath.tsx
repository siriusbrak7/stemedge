import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const QUIZ: QuizQuestion[] = [
  { id: 'pm1', question: 'The path of a projectile is mathematically modeled by a:', type: 'multiple-choice', options: ['Linear function', 'Quadratic function (Parabola)', 'Cubic function', 'Sine wave'], correctAnswer: 'Quadratic function (Parabola)', explanation: 'Projectile motion under gravity follows a parabolic path, represented by a quadratic equation.' },
  { id: 'pm2', question: 'To find the maximum height of the projectile, you need to find the parabola\'s:', type: 'multiple-choice', options: ['x-intercepts', 'y-intercept', 'Vertex', 'Slope'], correctAnswer: 'Vertex', explanation: 'The vertex of a downward-opening parabola represents the maximum value (peak height) of the function.' },
  { id: 'pm3', question: 'The x-intercepts (roots) of the equation represent:', type: 'multiple-choice', options: ['The launch angle', 'The maximum height', 'When the projectile is on the ground', 'The initial speed'], correctAnswer: 'When the projectile is on the ground', explanation: 'The x-intercepts occur where y = 0, which corresponds to the projectile being at ground level (either launching or landing).' },
  { id: 'pm4', question: 'The term -½gt² represents the effect of:', type: 'multiple-choice', options: ['Initial velocity', 'Air resistance', 'Gravity', 'Launch height'], correctAnswer: 'Gravity', explanation: 'Gravity accelerates the object downwards at 9.81 m/s², scaling quadratically with time.' },
  { id: 'pm5', question: 'A launch angle of 45° usually provides:', type: 'multiple-choice', options: ['Max height', 'Max range', 'Shortest flight time', 'Max speed'], correctAnswer: 'Max range', explanation: 'Ignoring air resistance, 45° perfectly balances horizontal velocity and flight time to maximize distance.' },
];

export default function ProjectileMotionMath() {
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
            {viewMode === 'simulation' && <ProjectileSim />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Projectile Quadratics Quiz" /></div>}
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
        <h3 className="text-brand-accent font-bold text-lg mb-4">Projectile Motion as a Parabola</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          When an object is thrown or launched under the influence of gravity (ignoring air resistance), it traces a perfect <strong className="text-white">parabola</strong>. The mathematics of projectiles is entirely based on <strong className="text-brand-accent">quadratic equations</strong>.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">y(t) = −½gt² + v₀y·t + h₀</p>
        </div>
        <ul className="text-sm text-slate-300 space-y-2 list-disc pl-5">
          <li><strong className="text-white">y(t)</strong> = Height at time t</li>
          <li><strong className="text-white">−½gt²</strong> = Gravity pulling it down (the "ax²" term making it a parabola)</li>
          <li><strong className="text-white">v₀y·t</strong> = Initial upward velocity (the "bx" term)</li>
          <li><strong className="text-white">h₀</strong> = Initial height (the "c" term, y-intercept)</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-3">The Vertex (Max Height)</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            The peak of the flight path is the <strong className="text-white">vertex</strong> of the parabola. It occurs when vertical velocity becomes zero before falling back down. Time to vertex is `-b / 2a`.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest mb-3">The Roots (Range)</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            The object hits the ground when <strong className="text-white">y = 0</strong>. Solving the quadratic equation for t gives the total flight time, which dictates the horizontal range.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProjectileSim() {
  const [velocity, setVelocity] = useState(20); // Initial velocity m/s
  const [angle, setAngle] = useState(45); // Launch angle degrees
  const [playing, setPlaying] = useState(false);
  const [trace, setTrace] = useState(true);
  const [time, setTime] = useState(0);
  const g = 9.81;

  // Math
  const v0x = velocity * Math.cos(angle * Math.PI / 180);
  const v0y = velocity * Math.sin(angle * Math.PI / 180);
  
  const flightTime = (2 * v0y) / g;
  const maxHeight = (v0y * v0y) / (2 * g);
  const maxRange = v0x * flightTime;

  const currentX = v0x * time;
  const currentY = v0y * time - 0.5 * g * time * time;

  const tick = useCallback(() => {
    if (playing) {
      setTime(t => {
        if (t >= flightTime) {
          setPlaying(false);
          return flightTime;
        }
        return t + 0.05;
      });
    }
  }, [playing, flightTime]);

  useEffect(() => {
    let id: number;
    if (playing) id = window.setInterval(tick, 50);
    return () => clearInterval(id);
  }, [playing, tick]);

  const handleFire = () => {
    setTime(0);
    setPlaying(true);
  };

  const scale = 400 / Math.max(60, maxRange * 1.1); 
  const groundY = 320;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
      <div className="flex-1 flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 500 360" className="w-full bg-[#0a0a1a] rounded-2xl border border-slate-800" xmlns="http://www.w3.org/2000/svg">
          {/* Grid */}
          {Array.from({length: 10}).map((_, i) => (
             <line key={`hy-${i}`} x1={0} y1={groundY - i*40} x2={500} y2={groundY - i*40} stroke="#1e293b" strokeWidth="1" />
          ))}
          {Array.from({length: 12}).map((_, i) => (
             <line key={`hx-${i}`} x1={40 + i*40} y1={0} x2={40 + i*40} y2={360} stroke="#1e293b" strokeWidth="1" />
          ))}
          
          {/* Axes */}
          <line x1="40" y1={groundY} x2="480" y2={groundY} stroke="#475569" strokeWidth="3" />
          <line x1="40" y1={20} x2="40" y2={groundY} stroke="#475569" strokeWidth="3" />
          <text x="460" y={groundY + 20} fill="#64748b" fontSize="10">x (distance)</text>
          <text x="15" y="40" fill="#64748b" fontSize="10" transform="rotate(-90 15 40)">y (height)</text>

          {/* Trace (Past dots) */}
          {trace && Array.from({length: Math.floor(time / 0.1)}).map((_, i) => {
            const t = i * 0.1;
            const x = v0x * t;
            const y = v0y * t - 0.5 * g * t * t;
            return <circle key={i} cx={40 + x * scale} cy={groundY - y * scale} r="2" fill="#3b82f6" opacity="0.4" />;
          })}

          {/* Theoretical Parabola Path */}
          <path d={`M ${Array.from({length: 50}).map((_, i) => {
             const t = (i / 49) * flightTime;
             const x = v0x * t;
             const y = v0y * t - 0.5 * g * t * t;
             return `${40 + x * scale} ${groundY - y * scale}`;
          }).join(' L ')}`} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

          {/* Key Points */}
          <circle cx={40 + (maxRange/2) * scale} cy={groundY - maxHeight * scale} r="4" fill="#ef4444" />
          <text x={40 + (maxRange/2) * scale} y={groundY - maxHeight * scale - 10} fill="#ef4444" fontSize="10" textAnchor="middle">Vertex</text>
          
          <circle cx={40 + maxRange * scale} cy={groundY} r="4" fill="#fbbf24" />
          <text x={40 + maxRange * scale} y={groundY + 15} fill="#fbbf24" fontSize="10" textAnchor="middle">Root</text>

          {/* Projectile */}
          <circle cx={40 + currentX * scale} cy={groundY - currentY * scale} r="6" fill="#3b82f6" />
          
          {/* Velocity Vector */}
          {time < flightTime && (
            <line x1={40 + currentX * scale} y1={groundY - currentY * scale} 
                  x2={40 + currentX * scale + v0x * 0.5} y2={groundY - currentY * scale - (v0y - g*time) * 0.5} 
                  stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreen)" />
          )}

          {/* Cannon */}
          <g transform={`translate(40, ${groundY}) rotate(${-angle})`}>
             <rect x="-5" y="-5" width="20" height="10" fill="#94a3b8" rx="2" />
          </g>
          
          <defs>
            <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" /></marker>
          </defs>
        </svg>

        <div className="flex gap-4 w-full bg-slate-900 border border-slate-800 p-4 rounded-xl">
           <div className="flex-1 flex flex-col gap-1">
             <label className="text-[10px] text-slate-500 uppercase tracking-widest flex justify-between font-bold">
               <span>Velocity (v₀)</span>
               <span className="text-blue-400">{velocity} m/s</span>
             </label>
             <input type="range" min="10" max="30" value={velocity} onChange={e => {setVelocity(Number(e.target.value)); setTime(0);}} className="w-full accent-blue-500" />
           </div>
           <div className="flex-1 flex flex-col gap-1">
             <label className="text-[10px] text-slate-500 uppercase tracking-widest flex justify-between font-bold">
               <span>Angle (θ)</span>
               <span className="text-green-400">{angle}°</span>
             </label>
             <input type="range" min="15" max="85" value={angle} onChange={e => {setAngle(Number(e.target.value)); setTime(0);}} className="w-full accent-green-500" />
           </div>
        </div>
        
        <div className="flex gap-2 w-full">
          <button onClick={handleFire} disabled={playing} className="flex-1 py-3 bg-brand-accent text-black rounded-xl text-sm font-bold uppercase hover:bg-brand-accent/80 disabled:opacity-50 transition-all">
            {playing ? 'In Flight...' : 'Fire Projectile'}
          </button>
          <button onClick={() => setTrace(!trace)} className={`px-4 rounded-xl text-xs font-bold uppercase transition-all ${trace ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}>
            Trace
          </button>
        </div>
      </div>

      <div className="lg:w-[340px] space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">Quadratic Equation</h3>
          <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-700 mb-3 text-center">
            <p className="text-white font-mono text-xs">y(t) = −4.9t² + {v0y.toFixed(1)}t</p>
          </div>
          <div className="space-y-2">
             <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800 flex justify-between items-center">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Max Height (Vertex)</p>
                 <p className="text-xs text-red-400 font-mono">y = -b/(2a)</p>
               </div>
               <p className="text-xl font-mono text-white">{maxHeight.toFixed(1)}m</p>
             </div>
             
             <div className="bg-[#0a0a1a] p-3 rounded-lg border border-slate-800 flex justify-between items-center">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Flight Time (Root)</p>
                 <p className="text-xs text-amber-400 font-mono">-4.9t² + {v0y.toFixed(1)}t = 0</p>
               </div>
               <p className="text-xl font-mono text-white">{flightTime.toFixed(2)}s</p>
             </div>
          </div>
        </div>
        
        {/* Height vs Time Graph */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Height vs Time</p>
          <svg viewBox="0 0 300 100" className="w-full bg-[#0a0a1a] rounded-lg border border-slate-800" xmlns="http://www.w3.org/2000/svg">
            <polyline points={Array.from({length: 40}).map((_, i) => {
              const t = (i / 39) * flightTime;
              const h = v0y * t - 0.5 * g * t * t;
              return `${(t/flightTime)*300},${100 - (h/maxHeight)*100}`;
            }).join(' ')} fill="none" stroke="#22c55e" strokeWidth="2" />
            {/* Live point */}
            <circle cx={(time/flightTime)*300 || 0} cy={100 - (currentY/maxHeight)*100 || 100} r="4" fill="#f8fafc" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-slate-800/50 p-2 rounded text-center">
               <p className="text-[9px] text-slate-400">Time (t)</p>
               <p className="font-mono text-white">{time.toFixed(2)}s</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
               <p className="text-[9px] text-slate-400">Height y(t)</p>
               <p className="font-mono text-green-400">{Math.max(0, currentY).toFixed(1)}m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
