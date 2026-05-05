import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Trophy, Target, Crosshair, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { PROJECTILE_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface Projectile {
  x: number; y: number; vx: number; vy: number;
  trail: { x: number; y: number }[];
  active: boolean;
  landed: boolean;
  landX: number;
}

interface ProjectileSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

const GRAVITY = 9.81;
const SCALE = 3;

function ProjectileSimulation({ variables, isRunning, onRecordData }: ProjectileSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const projectileRef = useRef<Projectile | null>(null);

  const angle = variables['launch-angle'] ?? 45;
  const velocity = variables['initial-velocity'] ?? 30;
  const mass = variables['mass'] ?? 1;

  const [isFlying, setIsFlying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [targetMode, setTargetMode] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onRecordDataRef = useRef(onRecordData);
  onRecordDataRef.current = onRecordData;

  const W = 700;
  const H = 350;
  const groundY = H - 40;

  const angleRad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(angleRad);
  const vy = velocity * Math.sin(angleRad);
  const flightTime = (2 * vy) / GRAVITY;
  const maxHeight = (vy * vy) / (2 * GRAVITY);
  const range = vx * flightTime;

  const generateTarget = useCallback(() => {
    const minRange = 20;
    const maxRange = 120;
    setTargetX(Math.floor(Math.random() * (maxRange - minRange) + minRange));
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#0a0f1e');
    skyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, groundY);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let d = 20; d <= 160; d += 20) {
      const px = 30 + d * SCALE;
      if (px < W - 20) {
        ctx.beginPath();
        ctx.moveTo(px, groundY);
        ctx.lineTo(px, groundY + 6);
        ctx.stroke();
        ctx.fillText(`${d}m`, px, groundY + 16);
      }
    }

    for (let h = 10; h <= 60; h += 10) {
      const py = groundY - h * SCALE;
      if (py > 10) {
        ctx.fillText(`${h}m`, 15, py + 3);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(30, py);
        ctx.lineTo(W, py);
        ctx.stroke();
        ctx.strokeStyle = '#334155';
      }
    }

    if (targetMode && targetX > 0) {
      const tx = 30 + targetX * SCALE;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tx - 8, groundY - 20, 16, 20);
      ctx.beginPath();
      ctx.arc(tx, groundY - 20, 12, Math.PI, 0);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, groundY - 20, 8, Math.PI, 0);
      ctx.fillStyle = '#fca5a5';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, groundY - 20, 4, Math.PI, 0);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${targetX}m`, tx, groundY + 28);
    }

    const cannonX = 30;
    const cannonY = groundY;
    ctx.save();
    ctx.translate(cannonX, cannonY);
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(0, 0, 12, Math.PI, 0);
    ctx.fill();
    ctx.rotate(-angleRad);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, -4, 30, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(25, -5, 8, 10);
    ctx.restore();

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cannonX, cannonY, 20, -angleRad, 0);
    ctx.stroke();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText(`${angle}°`, cannonX + 22, cannonY - 5);

    const proj = projectileRef.current;
    if (proj && proj.trail.length > 1) {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      proj.trail.forEach((p, i) => {
        const px = 30 + p.x * SCALE;
        const py = groundY - p.y * SCALE;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (proj && (proj.active || proj.landed)) {
      const px = 30 + proj.x * SCALE;
      const py = groundY - Math.max(0, proj.y) * SCALE;

      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();
      ctx.shadowBlur = 0;

      if (proj.landed) {
        const landPx = 30 + proj.landX * SCALE;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(landPx, groundY - 15);
        ctx.lineTo(landPx, groundY + 5);
        ctx.stroke();
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${proj.landX.toFixed(1)}m`, landPx, groundY + 28);
      }
    }

    if (!isFlying && showFormulas) {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const dt = 0.05;
      for (let t = 0; t < flightTime + dt; t += dt) {
        const px = 30 + (vx * t) * SCALE;
        const py = groundY - (vy * t - 0.5 * GRAVITY * t * t) * SCALE;
        if (py > groundY) break;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [angle, velocity, isFlying, targetMode, targetX, showFormulas, angleRad, vx, vy, flightTime, W, H, groundY]);

  const launch = useCallback(() => {
    projectileRef.current = {
      x: 0, y: 0,
      vx: vx, vy: vy,
      trail: [{ x: 0, y: 0 }],
      active: true, landed: false, landX: 0,
    };
    setIsFlying(true);
    setShowResult(false);
    setTotalShots(prev => prev + 1);

    let t = 0;
    const dt = 0.03;

    const step = () => {
      const proj = projectileRef.current;
      if (!proj || !proj.active) return;

      t += dt;
      proj.x = proj.vx * t;
      proj.y = proj.vy * t - 0.5 * GRAVITY * t * t;
      proj.trail.push({ x: proj.x, y: Math.max(0, proj.y) });

      if (proj.y <= 0 && t > 0.1) {
        proj.active = false;
        proj.landed = true;
        proj.y = 0;
        proj.landX = proj.x;
        setIsFlying(false);
        setShowResult(true);

        onRecordDataRef.current({
          range: Number(proj.landX.toFixed(1)),
          maxHeight: Number(maxHeight.toFixed(1)),
          flightTime: Number(flightTime.toFixed(2)),
          angle,
          velocity,
          mass,
        });

        if (targetMode && targetX > 0) {
          const dist = Math.abs(proj.landX - targetX);
          if (dist < 3) {
            setScore(prev => prev + 3);
          } else if (dist < 8) {
            setScore(prev => prev + 1);
          }
        }
      }

      drawScene();
      if (proj.active) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, [vx, vy, drawScene, targetMode, targetX, maxHeight, flightTime, angle, velocity, mass]);

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    projectileRef.current = null;
    setIsFlying(false);
    setShowResult(false);
    if (targetMode) generateTarget();
    setTimeout(drawScene, 50);
  };

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Projectile <span className="text-brand-accent font-medium">Motion Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Investigate how angle and velocity affect projectile range</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold text-sm">{score} pts</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">SHOTS: {totalShots}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setTargetMode(false); reset(); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            !targetMode ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Free Launch
        </button>
        <button
          onClick={() => { setTargetMode(true); reset(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            targetMode ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Crosshair size={14} /> Target Challenge
        </button>
        <button
          onClick={() => setShowFormulas(!showFormulas)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            showFormulas ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Formulas
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <canvas ref={canvasRef} width={W} height={H} className="block" />
      </div>

      <div className="w-full max-w-[700px] grid grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Launch Angle</span>
            <span className="text-yellow-400 text-sm font-mono">{angle}°</span>
          </div>
          <input type="range" min="5" max="80" value={angle} disabled={isFlying}
            className="w-full accent-yellow-500" readOnly />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Initial Velocity</span>
            <span className="text-cyan-400 text-sm font-mono">{velocity} m/s</span>
          </div>
          <input type="range" min="10" max="50" value={velocity} disabled={isFlying}
            className="w-full accent-cyan-500" readOnly />
        </div>
      </div>

      <div className="flex gap-3">
        {!isFlying && !showResult && (
          <button onClick={launch} disabled={isFlying}
            className="flex items-center gap-2 px-8 py-3 bg-brand-accent text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <Play fill="currentColor" size={18} /> Launch
          </button>
        )}
        {showResult && (
          <button onClick={reset}
            className="flex items-center gap-2 px-8 py-3 bg-brand-accent text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all"
          >
            <RotateCcw size={18} /> Reset
          </button>
        )}
      </div>

      {showResult && projectileRef.current?.landed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[700px] bg-slate-900/60 rounded-2xl border border-brand-border p-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Range</div>
              <div className="text-xl font-mono text-brand-accent font-bold">{projectileRef.current.landX.toFixed(1)}m</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Max Height</div>
              <div className="text-xl font-mono text-yellow-400 font-bold">{maxHeight.toFixed(1)}m</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Flight Time</div>
              <div className="text-xl font-mono text-purple-400 font-bold">{flightTime.toFixed(2)}s</div>
            </div>
          </div>
          {targetMode && (
            <div className="mt-4 text-center">
              {Math.abs(projectileRef.current.landX - targetX) < 3 ? (
                <span className="text-green-400 font-bold text-lg">🎯 Direct Hit! +3 pts</span>
              ) : Math.abs(projectileRef.current.landX - targetX) < 8 ? (
                <span className="text-yellow-400 font-bold">Close! +1 pt ({Math.abs(projectileRef.current.landX - targetX).toFixed(1)}m off)</span>
              ) : (
                <span className="text-red-400 font-bold">Miss! ({Math.abs(projectileRef.current.landX - targetX).toFixed(1)}m off target)</span>
              )}
            </div>
          )}
        </motion.div>
      )}

      {showFormulas && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full max-w-[700px] bg-purple-500/5 rounded-2xl border border-purple-500/20 p-6 space-y-3"
        >
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Physics Formulas</h3>
          <div className="grid grid-cols-2 gap-3 font-mono text-sm">
            <div className="bg-black/30 p-3 rounded-lg border border-purple-500/10">
              <div className="text-[10px] text-purple-400 mb-1">Horizontal velocity</div>
              <div className="text-white">vₓ = v₀ × cos(θ) = <span className="text-cyan-400">{vx.toFixed(1)}</span> m/s</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg border border-purple-500/10">
              <div className="text-[10px] text-purple-400 mb-1">Vertical velocity</div>
              <div className="text-white">vᵧ = v₀ × sin(θ) = <span className="text-yellow-400">{vy.toFixed(1)}</span> m/s</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg border border-purple-500/10">
              <div className="text-[10px] text-purple-400 mb-1">Range</div>
              <div className="text-white">R = v₀²sin(2θ)/g = <span className="text-green-400">{range.toFixed(1)}</span> m</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg border border-purple-500/10">
              <div className="text-[10px] text-purple-400 mb-1">Max Height</div>
              <div className="text-white">H = vᵧ²/(2g) = <span className="text-orange-400">{maxHeight.toFixed(1)}</span> m</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ProjectileLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ProjectileSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgRange = trials.length
      ? trials.flatMap(t =>
          t.observations.map(o =>
            typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).range ?? 0) : 0
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
          You investigated projectile motion across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Average Range</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{avgRange.toFixed(1)} m</div>
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
      config={PROJECTILE_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
