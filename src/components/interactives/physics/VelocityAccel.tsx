import { useEffect, useState } from 'react';
import type React from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Play, RefreshCw } from 'lucide-react';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'vectors' | 'graphs' | 'freefall';

const TABS = [
  { id: 'vectors' as ViewMode, label: 'Vectors', icon: '↗️' },
  { id: 'graphs' as ViewMode, label: 'Graphs', icon: '📈' },
  { id: 'freefall' as ViewMode, label: 'Freefall', icon: '⬇️' },
];

export default function VelocityAccel() {
  const [viewMode, setViewMode] = useState<ViewMode>('vectors');

  return (
    <div className="flex w-full flex-col gap-5 p-4 min-h-[600px] bg-[#06090f] rounded-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">⚛️ Velocity & Acceleration</h3>
          <p className="text-xs text-slate-500 mt-1">Vectors, motion graphs, and drag-limited freefall</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="cyan" />
      </div>
      {viewMode === 'vectors' && <VectorExplorer />}
      {viewMode === 'graphs' && <MotionGraphs />}
      {viewMode === 'freefall' && <FreefallDrag />}
    </div>
  );
}

function VectorExplorer() {
  const [vx, setVx] = useState(48);
  const [vy, setVy] = useState(-16);
  const [ax, setAx] = useState(18);
  const [ay, setAy] = useState(28);
  const nvx = vx + ax;
  const nvy = vy + ay;

  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 360" className="w-full rounded-2xl bg-[#07111b]">
          <Grid />
          <Vector x1={280} y1={180} dx={vx * 2} dy={vy * 2} color="#22d3ee" label="v" />
          <Vector x1={280 + vx * 2} y1={180 + vy * 2} dx={ax * 2} dy={ay * 2} color="#fb923c" label="a" />
          <Vector x1={280} y1={180} dx={nvx * 2} dy={nvy * 2} color="#22c55e" label="new v" thick />
          <circle cx="280" cy="180" r="6" fill="#e2e8f0" />
          <text x="280" y="335" fill="#94a3b8" fontSize="12" textAnchor="middle">Velocity + acceleration step = updated velocity vector</text>
        </svg>
      </Board>
      <Control>
        <StemSlider label="Velocity x" value={vx} min={-80} max={80} color="cyan" onChange={setVx} />
        <StemSlider label="Velocity y" value={vy} min={-80} max={80} color="cyan" onChange={setVy} />
        <StemSlider label="Acceleration x" value={ax} min={-50} max={50} color="orange" onChange={setAx} />
        <StemSlider label="Acceleration y" value={ay} min={-50} max={50} color="orange" onChange={setAy} />
        <Readout label="Resultant speed" value={`${Math.hypot(nvx, nvy).toFixed(1)} m/s`} color="text-green-300" />
      </Control>
    </SimGrid>
  );
}

function MotionGraphs() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [accel, setAccel] = useState(4);
  const x = 12 * time + 0.5 * accel * time * time;
  const v = 12 + accel * time;
  const carSpring = useSpring(0, { stiffness: 120, damping: 18 });
  const carX = useTransform(carSpring, value => `${Math.min(88, value)}%`);

  useEffect(() => {
    carSpring.set((x / 310) * 88);
  }, [x, carSpring]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime(t => {
        const next = Number((t + 0.1).toFixed(1));
        if (next >= 8) {
          setPlaying(false);
          return 8;
        }
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, [playing]);

  const reset = () => { setPlaying(false); setTime(0); };

  return (
    <div className="grid gap-5 max-w-5xl mx-auto">
      <Board>
        <div className="relative h-40 rounded-2xl bg-[#07111b] border border-slate-800 overflow-hidden">
          <div className="absolute left-0 right-0 bottom-9 border-t border-dashed border-slate-600" />
          <motion.div className="absolute bottom-9 left-4" style={{ x: carX }}>
            <Car velocity={v} />
          </motion.div>
          <Hud time={time} velocity={v} accel={accel} distance={x} />
          <div className="absolute right-4 top-4 flex gap-2">
            <IconButton onClick={() => setPlaying(p => !p)}><Play size={16} fill="currentColor" /></IconButton>
            <IconButton onClick={reset}><RefreshCw size={16} /></IconButton>
          </div>
        </div>
      </Board>
      <div className="grid gap-5 lg:grid-cols-[0.7fr,1.3fr]">
        <Control>
          <StemSlider label="Acceleration" value={accel} min={-3} max={8} unit=" m/s2" color="orange" onChange={(v) => { setAccel(v); reset(); }} />
          <Readout label="Current velocity" value={`${v.toFixed(1)} m/s`} color="text-cyan-300" />
        </Control>
        <Board>
          <svg viewBox="0 0 620 260" className="w-full rounded-2xl bg-[#07111b]">
            <MiniGraph x={30} y={30} title="x-t" color="#22c55e" time={time} makeY={(t) => 12 * t + 0.5 * accel * t * t} max={360} />
            <MiniGraph x={325} y={30} title="v-t" color="#22d3ee" time={time} makeY={(t) => 12 + accel * t} max={80} />
          </svg>
        </Board>
      </div>
    </div>
  );
}

function FreefallDrag() {
  const [mass, setMass] = useState(55);
  const [drag, setDrag] = useState(45);
  const terminal = Math.sqrt((mass * 9.8) / Math.max(5, drag)) * 11;
  const noDragY = 285;
  const dragY = Math.min(285, 40 + terminal * 3.3);
  return (
    <SimGrid>
      <Board>
        <svg viewBox="0 0 560 360" className="w-full rounded-2xl bg-[#07111b]">
          <line x1="160" y1="35" x2="160" y2="325" stroke="#334155" strokeWidth="4" />
          <line x1="395" y1="35" x2="395" y2="325" stroke="#334155" strokeWidth="4" />
          <text x="160" y="24" fill="#94a3b8" fontSize="12" textAnchor="middle">No air resistance</text>
          <text x="395" y="24" fill="#94a3b8" fontSize="12" textAnchor="middle">With drag</text>
          <motion.circle cx="160" cy={noDragY} r="20" fill="#22d3ee" animate={{ cy: [45, noDragY, 45] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeIn' }} />
          <motion.circle cx="395" cy={dragY} r="20" fill="#fb923c" animate={{ cy: [45, dragY, dragY - 10, dragY] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.path key={i} d={`M ${350 + i * 16} 280 C ${335 + i * 16} 242 ${372 + i * 16} 210 ${352 + i * 16} 172`} fill="none" stroke="#f97316" strokeWidth="2" opacity="0.45"
              animate={{ y: [0, -14, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.1 }} />
          ))}
          <text x="395" y="330" fill="#fb923c" fontSize="12" textAnchor="middle">terminal velocity ≈ {terminal.toFixed(1)} m/s</text>
        </svg>
      </Board>
      <Control>
        <StemSlider label="Object mass" value={mass} min={10} max={100} unit=" kg" color="cyan" onChange={setMass} />
        <StemSlider label="Air resistance" value={drag} min={5} max={100} unit="%" color="orange" onChange={setDrag} />
        <Readout label="Terminal velocity" value={`${terminal.toFixed(1)} m/s`} color="text-orange-300" />
        <p className="text-sm text-slate-400 leading-relaxed">Without drag, acceleration stays near 9.8 m/s2. With drag, air resistance increases with speed until it balances weight and acceleration falls to zero.</p>
      </Control>
    </SimGrid>
  );
}

function Grid() {
  return (
    <>
      {Array.from({ length: 13 }).map((_, i) => <line key={`v${i}`} x1={40 + i * 40} y1="30" x2={40 + i * 40} y2="330" stroke="#132033" />)}
      {Array.from({ length: 8 }).map((_, i) => <line key={`h${i}`} x1="40" y1={40 + i * 40} x2="520" y2={40 + i * 40} stroke="#132033" />)}
      <line x1="40" y1="180" x2="520" y2="180" stroke="#334155" />
      <line x1="280" y1="30" x2="280" y2="330" stroke="#334155" />
    </>
  );
}

function Vector({ x1, y1, dx, dy, color, label, thick = false }: { x1: number; y1: number; dx: number; dy: number; color: string; label: string; thick?: boolean }) {
  const x2 = x1 + dx;
  const y2 = y1 + dy;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={thick ? 5 : 3} strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={thick ? 6 : 4} fill={color} />
      <text x={x2 + 8} y={y2 - 8} fill={color} fontSize="13" fontWeight="bold">{label}</text>
    </g>
  );
}

function MiniGraph({ x, y, title, color, time, makeY, max }: { x: number; y: number; title: string; color: string; time: number; makeY: (t: number) => number; max: number }) {
  const points = Array.from({ length: Math.floor(time * 10) + 1 }, (_, i) => {
    const t = i / 10;
    return `${x + t * 27},${y + 170 - Math.min(165, Math.max(0, makeY(t) / max * 165))}`;
  }).join(' ');
  return (
    <g>
      <line x1={x} y1={y + 170} x2={x + 230} y2={y + 170} stroke="#475569" />
      <line x1={x} y1={y} x2={x} y2={y + 170} stroke="#475569" />
      <text x={x + 10} y={y + 16} fill={color} fontSize="13" fontWeight="bold">{title}</text>
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Car({ velocity }: { velocity: number }) {
  return (
    <div className="relative w-16 h-8">
      <div className="absolute bottom-0 w-16 h-6 rounded-t-lg rounded-r-2xl bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
      <div className="absolute bottom-[-6px] left-2 w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-900" />
      <div className="absolute bottom-[-6px] right-2 w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-900" />
      <motion.div className="absolute left-full top-4 h-0.5 bg-cyan-300" animate={{ width: Math.max(6, velocity) }} />
    </div>
  );
}

function Hud({ time, velocity, accel, distance }: { time: number; velocity: number; accel: number; distance: number }) {
  return (
    <div className="absolute left-4 top-4 flex gap-2 flex-wrap text-xs font-mono">
      {[['t', `${time.toFixed(1)}s`, 'text-white'], ['v', `${velocity.toFixed(1)}m/s`, 'text-cyan-300'], ['a', `${accel.toFixed(1)}m/s2`, 'text-orange-300'], ['x', `${distance.toFixed(1)}m`, 'text-green-300']].map(([k, v, c]) => (
        <div key={k} className="rounded-lg border border-slate-800 bg-black/40 px-3 py-1"><span className="text-slate-500">{k}=</span> <span className={c}>{v}</span></div>
      ))}
    </div>
  );
}

function SimGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.25fr,0.75fr]">{children}</div>;
}

function Board({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">{children}</div>;
}

function Control({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">{children}</div>;
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="rounded-2xl border border-slate-800 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p><p className={`text-2xl font-mono font-bold ${color}`}>{value}</p></div>;
}

function IconButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:scale-105 transition-transform">{children}</button>;
}
