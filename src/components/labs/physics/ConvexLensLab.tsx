import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import VirtualLabEngine from '../VirtualLabEngine';
import { CONVEX_LENS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Eye, RotateCcw, FlaskConical } from 'lucide-react';

interface ConvexLensSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ConvexLensSimulation({ variables, isRunning, onRecordData }: ConvexLensSimProps) {
  const objectDist = variables['object-distance'] ?? 30;
  const focalLen = variables['focal-length'] ?? 10;

  const u = objectDist;
  const f = focalLen;
  const isVirtual = u < f;
  const v = isVirtual
    ? -(u * f) / (u - f)
    : (u * f) / (u - f);
  const magnification = Math.abs(v / u);
  const isAtF = Math.abs(u - f) < 0.5;

  const scale = 3.5;
  const lensX = 250;
  const lensY = 160;
  const objX = lensX - u * scale;
  const objHeight = 50;
  const imgX = isVirtual ? lensX + Math.abs(v) * scale : lensX + v * scale;
  const imgHeight = isVirtual ? objHeight * magnification : objHeight * magnification;
  const maxImgH = Math.min(imgHeight, 120);

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) { clearInterval(intervalRef.current!); return 100; }
          return prev + 2;
        });
      }, 80);
    } else if (!isRunning) { clearInterval(intervalRef.current!); }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        objectDistance: u,
        imageDistance: parseFloat(Math.abs(v).toFixed(2)),
        magnification: parseFloat(magnification.toFixed(3)),
        imageType: isVirtual ? 'virtual' : 'real',
        focalLength: f,
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0); setRecorded(false); clearInterval(intervalRef.current!);
  }, [objectDist, focalLen]);

  const progress = elapsed / 100;
  const rayOpacity = isRunning ? progress : 0;

  const focalPtLeft = lensX - f * scale;
  const focalPtRight = lensX + f * scale;
  const twoFleft = lensX - 2 * f * scale;
  const twoFright = lensX + 2 * f * scale;

  const imgLabel = isAtF ? 'Image at ∞' : isVirtual ? 'Virtual, Upright, Magnified' : v > 2 * f ? 'Real, Inverted, Diminished' : Math.abs(v - 2 * f) < 0.5 ? 'Real, Inverted, Same Size' : 'Real, Inverted, Magnified';

  const thinLensCheck = (1 / u + 1 / Math.abs(v)).toFixed(4);
  const thinLensExpected = (1 / f).toFixed(4);

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border-purple-500/30">
        {isVirtual ? 'Magnifying Glass Mode' : 'Image Projection Mode'} — Cape Coast Fishermen's Mirrors
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${isVirtual ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : 'text-orange-400 bg-orange-500/10 border-orange-500/30'}`}>
          {isVirtual ? 'Virtual Image' : 'Real Image'}
        </div>
        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${isVirtual ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : 'text-orange-400 bg-orange-500/10 border-orange-500/30'}`}>
          {isVirtual ? 'Upright' : 'Inverted'}
        </div>
        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${magnification > 1 ? 'text-green-400 bg-green-500/10 border-green-500/30' : magnification < 1 ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'}`}>
          {magnification > 1 ? 'Magnified' : magnification < 1 ? 'Diminished' : 'Same Size'}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 w-full max-w-3xl">
        <svg viewBox="0 0 500 300" className="w-full rounded-2xl bg-[#09121b]">
          <line x1="10" y1={lensY} x2="490" y2={lensY} stroke="#1e293b" strokeWidth="1" />

          <line x1={focalPtLeft} y1={lensY - 8} x2={focalPtLeft} y2={lensY + 8} stroke="#f59e0b" strokeWidth="1.5" />
          <text x={focalPtLeft} y={lensY + 18} fill="#f59e0b" fontSize="7" textAnchor="middle">F</text>
          <line x1={focalPtRight} y1={lensY - 8} x2={focalPtRight} y2={lensY + 8} stroke="#f59e0b" strokeWidth="1.5" />
          <text x={focalPtRight} y={lensY + 18} fill="#f59e0b" fontSize="7" textAnchor="middle">F</text>
          <line x1={twoFleft} y1={lensY - 6} x2={twoFleft} y2={lensY + 6} stroke="#64748b" strokeWidth="1" />
          <text x={twoFleft} y={lensY + 18} fill="#64748b" fontSize="6" textAnchor="middle">2F</text>
          <line x1={twoFright} y1={lensY - 6} x2={twoFright} y2={lensY + 6} stroke="#64748b" strokeWidth="1" />
          <text x={twoFright} y={lensY + 18} fill="#64748b" fontSize="6" textAnchor="middle">2F</text>

          <ellipse cx={lensX} cy={lensY} rx="4" ry="80" fill="#7c3aed" opacity="0.3" stroke="#a78bfa" strokeWidth="2" />
          <polygon points={`${lensX},${lensY - 85} ${lensX - 6},${lensY - 75} ${lensX + 6},${lensY - 75}`} fill="#a78bfa" />
          <polygon points={`${lensX},${lensY + 85} ${lensX - 6},${lensY + 75} ${lensX + 6},${lensY + 75}`} fill="#a78bfa" />

          <motion.line
            x1={objX} y1={lensY} x2={objX} y2={lensY - objHeight}
            stroke="#22c55e" strokeWidth="3" strokeLinecap="round"
            animate={{ opacity: isRunning ? 1 : 0.4 }}
          />
          <polygon points={`${objX},${lensY - objHeight - 6} ${objX - 4},${lensY - objHeight + 2} ${objX + 4},${lensY - objHeight + 2}`} fill="#22c55e" />
          <text x={objX} y={lensY + 14} fill="#22c55e" fontSize="7" textAnchor="middle">Object</text>

          {!isAtF && !isVirtual && rayOpacity > 0 && (
            <g opacity={rayOpacity}>
              <line x1={objX} y1={lensY - objHeight} x2={lensX} y2={lensY - objHeight} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
              <line x1={lensX} y1={lensY - objHeight} x2={imgX} y2={lensY + maxImgH} stroke="#fbbf24" strokeWidth="1" />

              <line x1={objX} y1={lensY - objHeight} x2={lensX} y2={lensY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
              <line x1={lensX} y1={lensY} x2={imgX} y2={lensY + maxImgH} stroke="#38bdf8" strokeWidth="1" />

              <line x1={objX} y1={lensY - objHeight} x2={lensX} y2={lensY - objHeight} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />

              <motion.line
                x1={imgX} y1={lensY} x2={imgX} y2={lensY + maxImgH}
                stroke="#f97316" strokeWidth="3" strokeLinecap="round"
                animate={{ opacity: progress }}
              />
              <polygon points={`${imgX},${lensY + maxImgH + 6} ${imgX - 4},${lensY + maxImgH - 2} ${imgX + 4},${lensY + maxImgH - 2}`} fill="#f97316" />
              <text x={imgX} y={lensY + maxImgH + 20} fill="#f97316" fontSize="7" textAnchor="middle">Image</text>
            </g>
          )}

          {isVirtual && !isAtF && rayOpacity > 0 && (
            <g opacity={rayOpacity}>
              <line x1={objX} y1={lensY - objHeight} x2={lensX} y2={lensY - objHeight} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
              <line x1={objX} y1={lensY - objHeight} x2={lensX} y2={lensY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />

              <line x1={lensX} y1={lensY - objHeight} x2="490" y2={lensY - objHeight - (490 - lensX) * objHeight / (lensX - objX)} stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
              <line x1={lensX} y1={lensY} x2="490" y2={lensY + (490 - lensX) * objHeight / (lensX - objX)} stroke="#38bdf8" strokeWidth="1" opacity="0.5" />

              <line x1={imgX} y1={lensY} x2={imgX} y2={lensY - maxImgH} stroke="#f97316" strokeWidth="1.5" strokeDasharray="6 3" />
              <text x={imgX} y={lensY - maxImgH - 8} fill="#f97316" fontSize="7" textAnchor="middle">Virtual Image</text>
            </g>
          )}

          <text x="250" y="285" fill="#64748b" fontSize="8" textAnchor="middle">Optical Bench — u={u}cm, f={f}cm, {imgLabel}</text>
        </svg>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Simulation Progress</span><span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-purple-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Object Dist (u)</div>
          <div className="text-2xl font-mono font-bold text-green-400">{u} cm</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Image Dist (v)</div>
          <div className="text-2xl font-mono font-bold text-orange-400">{isAtF ? '∞' : Math.abs(v).toFixed(1)} cm</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Magnification</div>
          <div className="text-2xl font-mono font-bold text-purple-400">{isAtF ? '∞' : magnification.toFixed(2)}x</div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[140px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">1/u + 1/v</div>
          <div className="text-lg font-mono font-bold text-cyan-400">{isAtF ? '∞' : thinLensCheck}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[140px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">1/f (expected)</div>
          <div className="text-lg font-mono font-bold text-yellow-400">{thinLensExpected}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[140px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Image Nature</div>
          <div className="text-sm font-bold text-slate-300">{imgLabel}</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Thin lens equation: 1/f = 1/u + 1/v. When u &gt; 2f: real, inverted, diminished. When u = 2f: real, inverted, same size. When f &lt; u &lt; 2f: real, inverted, magnified. When u &lt; f: virtual, upright, magnified — magnifying glass principle. Cape Coast fishermen use concave mirrors similarly to focus sunlight.
      </div>
    </div>
  );
}

export default function ConvexLensLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ConvexLensSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgMag = trials.length
      ? trials.flatMap(t => t.observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).magnification ?? 0) : 0)).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">You investigated lens optics across {trials.length} trial{trials.length !== 1 ? 's' : ''}.</p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg Magnification</div>
            <div className="text-2xl font-mono font-bold text-purple-400">{avgMag.toFixed(2)}x</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Trials</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">{trials.length}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setCompletedSession(null)} className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all">
            <RotateCcw size={16} /> Try Again
          </button>
          <button onClick={() => window.history.back()} className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all">
            Back to Lesson
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine config={CONVEX_LENS_LAB} renderSimulation={renderSimulation} onComplete={handleComplete} />
  );
}
