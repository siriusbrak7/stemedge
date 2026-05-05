import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Wind, RotateCcw, FlaskConical, Gauge } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { GAS_LAWS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface GasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface GasLawsSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function GasLawsSimulation({ variables, isRunning, onRecordData }: GasLawsSimProps) {
  const gasLaw = Math.round(variables['gas-law'] ?? 0);
  const temperature = variables['temperature'] ?? 300;
  const pressure = variables['pressure'] ?? 101;

  const [particles, setParticles] = useState<GasParticle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animTime, setAnimTime] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const animRef = useRef<number>(0);
  const startRef = useRef(0);

  const isBoyle = gasLaw === 0;

  const baseVolume = 100;
  const boyleVolume = (101 * baseVolume) / pressure;
  const charlesVolume = baseVolume * (temperature / 273);
  const displayVolume = isBoyle ? boyleVolume : charlesVolume;

  const containerWidth = 180;
  const containerHeight = 200;
  const pistonY = isBoyle
    ? containerHeight - (boyleVolume / 200) * containerHeight
    : containerHeight - (charlesVolume / 200) * containerHeight;

  useEffect(() => {
    const count = 30;
    const newParticles: GasParticle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: 110 + Math.random() * (containerWidth - 20),
        y: 80 + Math.random() * (containerHeight - pistonY - 20),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        r: 2.5 + Math.random() * 1.5,
      });
    }
    setParticles(newParticles);
    setRecorded(false);
  }, [pressure, temperature, gasLaw]);

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimTime(0);
    setRecorded(false);
    startRef.current = Date.now();

    const speedFactor = isBoyle ? 1 : temperature / 300;
    const animate = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      setAnimTime(elapsed);

      setParticles(prev => prev.map(p => {
        let nx = p.x + p.vx * speedFactor;
        let ny = p.y + p.vy * speedFactor;
        const leftBound = 110;
        const rightBound = 110 + containerWidth;
        const topBound = 80;
        const bottomBound = 80 + containerHeight - pistonY;

        if (nx - p.r < leftBound) { nx = leftBound + p.r; p.vx *= -1; }
        if (nx + p.r > rightBound) { nx = rightBound - p.r; p.vx *= -1; }
        if (ny - p.r < topBound) { ny = topBound + p.r; p.vy *= -1; }
        if (ny + p.r > bottomBound) { ny = bottomBound - p.r; p.vy *= -1; }

        p.vx += (Math.random() - 0.5) * 0.5 * speedFactor;
        p.vy += (Math.random() - 0.5) * 0.5 * speedFactor;
        const maxSpeed = 5 * speedFactor;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        return { ...p, x: nx, y: ny, vx: p.vx, vy: p.vy };
      }));

      if (elapsed < 8) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!isAnimating && animTime > 0 && !recorded) {
      setRecorded(true);
      onRecordData({
        law: isBoyle ? "Boyle's Law" : "Charles's Law",
        pressure,
        temperature,
        volume: displayVolume.toFixed(1),
        PV: isBoyle ? (pressure * boyleVolume).toFixed(1) : 'N/A',
        VoverT: !isBoyle ? (charlesVolume / temperature).toFixed(3) : 'N/A',
      });
    }
  }, [isAnimating, animTime, recorded, onRecordData, pressure, temperature, displayVolume, isBoyle, boyleVolume, charlesVolume]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const particleColour = isBoyle ? '#60a5fa' : `hsl(${Math.max(0, 240 - (temperature - 273) * 1.5)}, 70%, 65%)`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">
            <Wind className="inline mr-2 text-cyan-400" size={24} />
            Gas Laws Lab
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            WAEC Chemistry — {isBoyle ? "Boyle's Law (PV = const)" : "Charles's Law (V/T = const)"} | Tema Harbour gas cylinder safety
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 400 380" className="w-full rounded-2xl bg-[#0b1018]">
            <defs>
              <linearGradient id="pistonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="heatGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect x="110" y="80" width={containerWidth} height={containerHeight} rx="4" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <rect x="112" y={80 + pistonY} width={containerWidth - 4} height={containerHeight - pistonY} fill={particleColour} opacity="0.06" />

            {isBoyle ? (
              <>
                <rect x="110" y={75 + pistonY} width={containerWidth} height="10" rx="3" fill="url(#pistonGrad)" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="190" y={30} width="20" height={45 + pistonY} fill="#475569" stroke="#64748b" strokeWidth="1" />
                <rect x="185" y={25 + pistonY} width="30" height="8" rx="2" fill="#94a3b8" />
                {pressure > 150 && (
                  <g>
                    <line x1="80" y1={80 + pistonY / 2} x2="108" y2={80 + pistonY / 2} stroke="#ef4444" strokeWidth="2" />
                    <polygon points="108,${80 + pistonY / 2 - 4} 108,${80 + pistonY / 2 + 4} 115,${80 + pistonY / 2}" fill="#ef4444" />
                    <text x="70" y={80 + pistonY / 2 + 4} textAnchor="end" fill="#ef4444" fontSize="8">P</text>
                  </g>
                )}
              </>
            ) : (
              <>
                <rect x="110" y={75 + pistonY} width={containerWidth} height="10" rx="3" fill="url(#pistonGrad)" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="190" y1={30} x2="190" y2={75 + pistonY} stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                {temperature > 320 && (
                  <rect x="112" y={80 + containerHeight - 20} width={containerWidth - 4} height="18" fill="url(#heatGrad)" />
                )}
                {temperature > 350 && (
                  <>
                    <motion.line x1="130" y1={280} x2="130" y2={270} stroke="#ef4444" strokeWidth="1.5" opacity={0.5 + Math.sin(animTime * 6) * 0.3} />
                    <motion.line x1="160" y1={280} x2="160" y2={268} stroke="#ef4444" strokeWidth="1.5" opacity={0.4 + Math.cos(animTime * 5) * 0.3} />
                    <motion.line x1="200" y1={280} x2="200" y2={270} stroke="#ef4444" strokeWidth="1.5" opacity={0.5 + Math.sin(animTime * 7) * 0.3} />
                    <motion.line x1="240" y1={280} x2="240" y2={268} stroke="#ef4444" strokeWidth="1.5" opacity={0.4 + Math.cos(animTime * 4) * 0.3} />
                    <motion.line x1="270" y1={280} x2="270" y2={270} stroke="#ef4444" strokeWidth="1.5" opacity={0.5 + Math.sin(animTime * 8) * 0.3} />
                  </>
                )}
              </>
            )}

            {particles.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={particleColour} opacity="0.8">
                {isAnimating && (
                  <animate attributeName="cx" values={`${p.x};${p.x + p.vx * 2};${p.x}`} dur="0.3s" repeatCount="indefinite" />
                )}
              </circle>
            ))}

            <text x="200" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              {isBoyle ? "Boyle's Law: PV = constant" : "Charles's Law: V/T = constant"}
            </text>

            <rect x="25" y="80" width="70" height="80" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <text x="60" y="97" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">READINGS</text>
            <text x="35" y="113" fill="#94a3b8" fontSize="7">P = {pressure} kPa</text>
            <text x="35" y="126" fill="#94a3b8" fontSize="7">T = {temperature} K</text>
            <text x="35" y="139" fill="#94a3b8" fontSize="7">V = {displayVolume.toFixed(1)}</text>
            <text x="35" y="155" fill="#22c55e" fontSize="7">
              {isBoyle ? `PV = ${(pressure * boyleVolume).toFixed(0)}` : `V/T = ${(charlesVolume / temperature).toFixed(2)}`}
            </text>

            <text x="200" y="365" textAnchor="middle" fill="#475569" fontSize="8">
              Tema Harbour — gas cylinder safety: keep cool, avoid fire
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Gas Law</div>
            <div className="flex gap-2">
              <div className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-center border ${
                gasLaw === 0 ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}>Boyle's</div>
              <div className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-center border ${
                gasLaw === 1 ? 'border-orange-500/50 bg-orange-500/10 text-orange-300' : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}>Charles's</div>
            </div>

            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Gauge size={14} /> Run Simulation
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Volume" value={`${displayVolume.toFixed(1)}`} />
              <Metric label={isBoyle ? 'PV' : 'V/T'} value={isBoyle ? `${(pressure * boyleVolume).toFixed(0)}` : `${(charlesVolume / temperature).toFixed(3)}`} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Key Equation</div>
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-white font-mono text-sm">
                {isBoyle ? 'P₁V₁ = P₂V₂' : 'V₁/T₁ = V₂/T₂'}
              </p>
              <p className="text-slate-500 text-[10px] mt-1">
                {isBoyle ? '(at constant temperature)' : '(at constant pressure)'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              WAEC Note: {isBoyle
                ? "Boyle's Law — pressure and volume are inversely proportional at constant temperature."
                : "Charles's Law — volume is directly proportional to absolute temperature at constant pressure."}
              At Tema Harbour, LPG cylinders are stored in cool areas because heating a sealed
              cylinder increases pressure (fixed V), risking explosion — Gay-Lussac's Law: P ∝ T.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GasLawsLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <GasLawsSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
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
          You verified gas laws across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <button
          onClick={() => setCompletedSession(null)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
        >
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={GAS_LAWS_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-mono text-white">{value}</div>
    </div>
  );
}
