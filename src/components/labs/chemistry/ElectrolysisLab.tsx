import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Zap, RotateCcw, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { ELECTROLYSIS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

const ELECTROLYTES = [
  {
    id: 0, name: 'CuSO₄ (aq)', anodeProduct: 'O₂ gas', cathodeProduct: 'Cu metal',
    anodeColour: '#94a3b8', cathodeColour: '#f97316',
    anodeGas: false, cathodeGas: false, copperDeposit: true,
    solutionColour: '#3b82f6', solutionOpacity: 0.3,
  },
  {
    id: 1, name: 'NaCl (aq)', anodeProduct: 'Cl₂ gas', cathodeProduct: 'H₂ gas',
    anodeColour: '#22c55e', cathodeColour: '#93c5fd',
    anodeGas: true, cathodeGas: true, copperDeposit: false,
    solutionColour: '#e2e8f0', solutionOpacity: 0.15,
  },
  {
    id: 2, name: 'H₂SO₄ (aq)', anodeProduct: 'O₂ gas', cathodeProduct: 'H₂ gas',
    anodeColour: '#ef4444', cathodeColour: '#93c5fd',
    anodeGas: true, cathodeGas: true, copperDeposit: false,
    solutionColour: '#fbbf24', solutionOpacity: 0.1,
  },
  {
    id: 3, name: 'CuCl₂ (aq)', anodeProduct: 'Cl₂ gas', cathodeProduct: 'Cu metal',
    anodeColour: '#22c55e', cathodeColour: '#f97316',
    anodeGas: true, cathodeGas: false, copperDeposit: true,
    solutionColour: '#06b6d4', solutionOpacity: 0.3,
  },
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
}

interface ElectrolysisSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ElectrolysisSimulation({ variables, isRunning, onRecordData }: ElectrolysisSimProps) {
  const electrolyte = Math.round(variables['electrolyte'] ?? 0);
  const current = variables['current'] ?? 0.5;
  const time = variables['time'] ?? 10;

  const [isRunningSim, setIsRunningSim] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [anodeBubbles, setAnodeBubbles] = useState<Bubble[]>([]);
  const [cathodeBubbles, setCathodeBubbles] = useState<Bubble[]>([]);
  const [copperThickness, setCopperThickness] = useState(0);
  const [bubbleId, setBubbleId] = useState(0);
  const animRef = useRef<number>(0);
  const startRef = useRef(0);

  const electrolyteData = ELECTROLYTES[Math.min(electrolyte, ELECTROLYTES.length - 1)];

  useEffect(() => {
    setElapsed(0);
    setCopperThickness(0);
    setAnodeBubbles([]);
    setCathodeBubbles([]);
    setIsRunningSim(false);
  }, [electrolyte]);

  const startElectrolysis = () => {
    setIsRunningSim(true);
    setElapsed(0);
    setCopperThickness(0);
    setAnodeBubbles([]);
    setCathodeBubbles([]);
    startRef.current = Date.now();

    const totalMs = time * 1000;
    const animate = () => {
      const e = (Date.now() - startRef.current) / 1000;
      setElapsed(e);

      if (electrolyteData.copperDeposit) {
        const faraday = 96500;
        const charge = current * e;
        const massCu = (charge * 63.5) / (2 * faraday);
        setCopperThickness(Math.min(8, massCu * 800));
      }

      if (Math.random() < current * 0.15) {
        if (electrolyteData.anodeGas) {
          setBubbleId(prev => prev + 1);
          setAnodeBubbles(prev => [...prev, {
            id: bubbleId, x: 145 + (Math.random() - 0.5) * 10,
            y: 260, r: 2 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1.5 * current,
            drift: (Math.random() - 0.5) * 0.5,
          }]);
        }
        if (electrolyteData.cathodeGas) {
          setBubbleId(prev => prev + 1);
          setCathodeBubbles(prev => [...prev, {
            id: bubbleId + 1000, x: 255 + (Math.random() - 0.5) * 10,
            y: 260, r: 2 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1.5 * current,
            drift: (Math.random() - 0.5) * 0.5,
          }]);
        }
      }

      setAnodeBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed, x: b.x + Math.sin(b.y * 0.05) * b.drift }))
        .filter(b => b.y > 140));
      setCathodeBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed, x: b.x + Math.sin(b.y * 0.05) * b.drift }))
        .filter(b => b.y > 140));

      if (e < time) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunningSim(false);
        const charge = current * time;
        const massCu = electrolyteData.copperDeposit ? ((charge * 63.5) / (2 * 96500) * 1000).toFixed(1) : '0';
        onRecordData({
          electrolyte: electrolyteData.name,
          anodeProduct: electrolyteData.anodeProduct,
          cathodeProduct: electrolyteData.cathodeProduct,
          charge: charge.toFixed(1),
          copperMass_mg: massCu,
          current,
          time,
        });
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const chargeDelivered = current * elapsed;
  const progress = Math.min(1, elapsed / time);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light text-white">
            <Zap className="inline mr-2 text-yellow-400" size={24} />
            Electrolysis Lab
          </h2>
          <p className="text-xs text-slate-500 mt-1">WAEC Chemistry — Electroplating &amp; Faraday's Laws | Kumasi jewellery context</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 400 380" className="w-full rounded-2xl bg-[#0b1018]">
            <rect x="70" y="120" width="260" height="200" rx="8" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <rect x="75" y="135" width="250" height="180" fill={electrolyteData.solutionColour}
              opacity={electrolyteData.solutionOpacity + progress * 0.05} rx="4" />

            <rect x="130" y="130" width="12" height="180" rx="3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="258" y="130" width="12" height="180" rx="3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />

            {electrolyteData.copperDeposit && (
              <rect x="258" y={310 - copperThickness} width="12" height={copperThickness} fill="#f97316" opacity="0.9" rx="2" />
            )}

            <text x="136" y="125" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">+ Anode</text>
            <text x="264" y="125" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">− Cathode</text>

            {anodeBubbles.map(b => (
              <circle key={`a-${b.id}`} cx={b.x} cy={b.y} r={b.r} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            ))}
            {cathodeBubbles.map(b => (
              <circle key={`c-${b.id}`} cx={b.x} cy={b.y} r={b.r} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            ))}

            {isRunningSim && (
              <>
                <motion.circle cx="136" cy="160" r="4" fill="#ef4444" opacity={0.4 + Math.sin(elapsed * 8) * 0.3} />
                <motion.circle cx="264" cy="160" r="4" fill="#3b82f6" opacity={0.4 + Math.cos(elapsed * 8) * 0.3} />
              </>
            )}

            <line x1="136" y1="130" x2="136" y2="90" stroke="#ef4444" strokeWidth="2" />
            <line x1="264" y1="130" x2="264" y2="90" stroke="#3b82f6" strokeWidth="2" />
            <line x1="136" y1="90" x2="200" y2="70" stroke="#ef4444" strokeWidth="2" />
            <line x1="264" y1="90" x2="200" y2="70" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="200" cy="65" r="12" fill="none" stroke="#eab308" strokeWidth="2" />
            <text x="200" y="69" textAnchor="middle" fill="#eab308" fontSize="10" fontWeight="bold">⚡</text>

            <rect x="70" y="320" width="260" height="4" rx="2" fill="#1e293b" />
            <rect x="70" y="320" width={260 * progress} height="4" rx="2" fill="#22c55e" />
            <text x="200" y="345" textAnchor="middle" fill="#64748b" fontSize="9">
              {elapsed.toFixed(1)}s / {time}s
            </text>

            <text x="200" y="375" textAnchor="middle" fill="#475569" fontSize="8">
              Kumasi electroplating — gold jewellery production
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Electrolyte</div>
            <div className="grid grid-cols-2 gap-2">
              {ELECTROLYTES.map(el => (
                <div key={el.id} className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                  electrolyte === el.id
                    ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
                    : 'border-slate-700 bg-slate-900 text-slate-500'
                }`}>
                  {el.name}
                </div>
              ))}
            </div>

            <button
              onClick={startElectrolysis}
              disabled={isRunningSim}
              className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap size={14} /> Start Electrolysis
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Current" value={`${current.toFixed(1)} A`} />
              <Metric label="Charge" value={`${chargeDelivered.toFixed(1)} C`} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Products</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-400">Anode:</span>
                <span className="text-xs text-white font-mono">{electrolyteData.anodeProduct}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-slate-400">Cathode:</span>
                <span className="text-xs text-white font-mono">{electrolyteData.cathodeProduct}</span>
              </div>
              {electrolyteData.copperDeposit && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs text-slate-400">Cu deposit:</span>
                  <span className="text-xs text-orange-400 font-mono">{copperThickness.toFixed(1)} units</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              WAEC Note: Faraday's First Law — mass deposited ∝ charge (m = QM/zF). In Kumasi's jewellery
              workshops, electroplating uses the same principle: the item (cathode) is coated when current
              flows through a gold or silver salt solution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ElectrolysisLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ElectrolysisSimulation {...props} />;

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
          You completed {trials.length} electrolysis trial{trials.length !== 1 ? 's' : ''}.
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
      config={ELECTROLYSIS_LAB}
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
