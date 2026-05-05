import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import VirtualLabEngine from '../VirtualLabEngine';
import { RESISTIVITY_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Ruler, RotateCcw, FlaskConical } from 'lucide-react';

const WIRE_MATERIALS = [
  { name: 'Copper', rho: 1.7e-8, color: '#f97316' },
  { name: 'Nichrome', rho: 1.1e-6, color: '#94a3b8' },
  { name: 'Constantan', rho: 4.9e-7, color: '#6b7280' },
];

interface ResistivitySimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ResistivitySimulation({ variables, isRunning, onRecordData }: ResistivitySimProps) {
  const wireLength = variables['wire-length'] ?? 100;
  const wireDiameter = variables['wire-diameter'] ?? 0.3;
  const materialIdx = Math.round(variables['wire-material'] ?? 1);

  const mat = WIRE_MATERIALS[materialIdx] ?? WIRE_MATERIALS[1];
  const lengthM = wireLength / 100;
  const area = Math.PI * (wireDiameter / 2000) ** 2;
  const resistance = mat.rho * lengthM / area;
  const supplyVoltage = 3;
  const current = supplyVoltage / resistance;
  const powerDissipated = current * current * resistance;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [electronPhases, setElectronPhases] = useState<number[]>([0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

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
        wireLength,
        wireDiameter,
        material: mat.name,
        resistance: parseFloat(resistance.toFixed(3)),
        current: parseFloat(current.toFixed(4)),
        resistivity: mat.rho,
        calculatedRho: parseFloat(mat.rho.toExponential(2)),
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0); setRecorded(false);
    clearInterval(intervalRef.current!);
  }, [wireLength, wireDiameter, materialIdx]);

  useEffect(() => {
    if (!isRunning) return;
    const speed = Math.min(current * 12, 4);
    const tick = () => {
      phaseRef.current = (phaseRef.current + speed * 0.006) % 1;
      setElectronPhases([
        phaseRef.current,
        (phaseRef.current + 1 / 7) % 1,
        (phaseRef.current + 2 / 7) % 1,
        (phaseRef.current + 3 / 7) % 1,
        (phaseRef.current + 4 / 7) % 1,
        (phaseRef.current + 5 / 7) % 1,
        (phaseRef.current + 6 / 7) % 1,
      ]);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, current]);

  const progress = elapsed / 100;
  const displayR = resistance * progress;
  const displayI = current * progress;
  const displayV = supplyVoltage * progress;

  const wireStartX = 60;
  const wireEndX = 60 + (wireLength / 200) * 300;
  const wireY = 130;
  const wireThickness = Math.max(wireDiameter * 8, 2);

  const leadX = wireStartX + (wireLength / 200) * 300;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border-amber-500/30">
        {mat.name} Wire — d = {wireDiameter}mm — Aluminium vs Copper Power Lines
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 w-full max-w-3xl">
        <svg viewBox="0 0 520 260" className="w-full rounded-2xl bg-[#09121b]">
          <rect x="40" y="30" width="440" height="15" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          {Array.from({ length: 20 }).map((_, i) => {
            const x = 50 + i * 22;
            return (
              <g key={i}>
                <line x1={x} y1="30" x2={x} y2={i % 5 === 0 ? 48 : 40} stroke="#64748b" strokeWidth={i % 5 === 0 ? "1" : "0.5"} />
                {i % 5 === 0 && <text x={x} y="58" fill="#64748b" fontSize="6" textAnchor="middle">{i * 10}</text>}
              </g>
            );
          })}
          <text x="260" y="22" fill="#94a3b8" fontSize="7" textAnchor="middle">Metre Stick (cm)</text>

          <rect x={wireStartX} y={wireY - wireThickness / 2} width={wireEndX - wireStartX} height={wireThickness} rx={wireThickness / 2} fill={mat.color} opacity="0.8" />
          <motion.rect
            x={wireStartX} y={wireY - wireThickness / 2}
            width={(wireEndX - wireStartX) * progress}
            height={wireThickness}
            rx={wireThickness / 2}
            fill={mat.color}
            opacity="0.4"
            animate={{ opacity: isRunning ? [0.2, 0.5, 0.2] : 0.2 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />

          {isRunning && electronPhases.map((phase, i) => {
            const ex = wireStartX + phase * (wireEndX - wireStartX);
            return (
              <motion.circle
                key={i}
                cx={ex}
                cy={wireY}
                r="2.5"
                fill="#fbbf24"
                opacity={0.8}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
              />
            );
          })}

          <line x1={wireStartX} y1={wireY - 20} x2={wireStartX} y2={wireY - wireThickness / 2 - 2} stroke="#ef4444" strokeWidth="2" />
          <circle cx={wireStartX} cy={wireY - 24} r="4" fill="#ef4444" />
          <text x={wireStartX} y={wireY - 32} fill="#ef4444" fontSize="6" textAnchor="middle">0 cm</text>

          <line x1={leadX} y1={wireY - 20} x2={leadX} y2={wireY - wireThickness / 2 - 2} stroke="#ef4444" strokeWidth="2" />
          <circle cx={leadX} cy={wireY - 24} r="4" fill="#ef4444" />
          <text x={leadX} y={wireY - 32} fill="#ef4444" fontSize="6" textAnchor="middle">{wireLength} cm</text>

          <line x1={wireStartX} y1={wireY + 20} x2={wireStartX} y2={wireY + wireThickness / 2 + 2} stroke="#3b82f6" strokeWidth="2" />
          <line x1={leadX} y1={wireY + 20} x2={leadX} y2={wireY + wireThickness / 2 + 2} stroke="#3b82f6" strokeWidth="2" />

          <line x1={wireStartX} y1={wireY + 30} x2={leadX} y2={wireY + 30} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />

          <rect x="20" y={wireY + 40} width="70" height="35" rx="5" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
          <text x="55" y={wireY + 55} fill="#22c55e" fontSize="6" textAnchor="middle" fontWeight="bold">AMMETER</text>
          <text x="55" y={wireY + 68} fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{displayI.toFixed(3)} A</text>

          <rect x="120" y={wireY + 40} width="70" height="35" rx="5" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="155" y={wireY + 55} fill="#a78bfa" fontSize="6" textAnchor="middle" fontWeight="bold">VOLTMETER</text>
          <text x="155" y={wireY + 68} fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{displayV.toFixed(2)} V</text>

          <rect x="220" y={wireY + 40} width="110" height="35" rx="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="275" y={wireY + 55} fill="#f59e0b" fontSize="6" textAnchor="middle" fontWeight="bold">RESISTANCE</text>
          <text x="275" y={wireY + 68} fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{displayR.toFixed(3)} Ω</text>

          <rect x="360" y={wireY + 40} width="140" height="35" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="430" y={wireY + 55} fill="#38bdf8" fontSize="6" textAnchor="middle" fontWeight="bold">RESISTIVITY ρ</text>
          <text x="430" y={wireY + 68} fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{mat.rho.toExponential(1)} Ωm</text>

          <rect x="350" y="75" width="155" height="45" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="428" y="92" fill="#94a3b8" fontSize="7" textAnchor="middle" fontWeight="bold">CALCULATIONS</text>
          <text x="360" y="107" fill="#64748b" fontSize="6">A = π(d/2)² = {(area * 1e6).toFixed(4)} mm²</text>
          <text x="360" y="117" fill="#64748b" fontSize="6">R = ρL/A = {resistance.toFixed(3)} Ω</text>

          <text x="260" y="252" fill="#475569" fontSize="6" textAnchor="middle">Ghana uses Al overhead lines — lighter, cheaper than Cu despite higher ρ. Thicker wire compensates.</text>
        </svg>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Measurement Progress</span><span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-amber-500" animate={{ width: `${elapsed}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Resistance</div>
          <div className="text-2xl font-mono font-bold text-amber-400">{displayR.toFixed(3)} Ω</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current</div>
          <div className="text-2xl font-mono font-bold text-green-400">{displayI.toFixed(3)} A</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Resistivity</div>
          <div className="text-lg font-mono font-bold text-cyan-400">{mat.rho.toExponential(1)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Power</div>
          <div className="text-2xl font-mono font-bold text-red-400">{(powerDissipated * progress).toFixed(3)} W</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        R = ρL/A. Resistance is proportional to length (double L = double R) and inversely proportional to cross-sectional area. Copper (ρ = 1.7×10⁻⁸ Ωm) is an excellent conductor. Ghana uses aluminium overhead lines because they are lighter and cheaper — the higher resistivity is compensated by using thicker wires. Nichrome (ρ = 1.1×10⁻⁶ Ωm) is used in heaters due to high resistivity and melting point.
      </div>
    </div>
  );
}

export default function ResistivityLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ResistivitySimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgR = trials.length
      ? trials.flatMap(t => t.observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).resistance ?? 0) : 0)).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
      : 0;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">You investigated resistivity across {trials.length} trial{trials.length !== 1 ? 's' : ''}.</p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg Resistance</div>
            <div className="text-2xl font-mono font-bold text-amber-400">{avgR.toFixed(3)} Ω</div>
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
    <VirtualLabEngine config={RESISTIVITY_LAB} renderSimulation={renderSimulation} onComplete={handleComplete} />
  );
}
