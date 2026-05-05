import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'circulatory' | 'plant' | 'compare';

const HEART_CHAMBERS = [
  { name: 'Right Atrium', desc: 'Receives deoxygenated blood from the body via the vena cava.', x: 140, y: 80, color: '#60a5fa' },
  { name: 'Right Ventricle', desc: 'Pumps deoxygenated blood to the lungs via the pulmonary artery.', x: 140, y: 160, color: '#3b82f6' },
  { name: 'Left Atrium', desc: 'Receives oxygenated blood from the lungs via the pulmonary vein.', x: 260, y: 80, color: '#f87171' },
  { name: 'Left Ventricle', desc: 'Pumps oxygenated blood to the body via the aorta. Thickest wall.', x: 260, y: 160, color: '#ef4444' },
];

const VESSELS = [
  { name: 'Arteries', wall: 'Thick muscular', lumen: 'Narrow', valves: 'No (except aortic)', flow: 'Away from heart', pressure: 'High' },
  { name: 'Veins', wall: 'Thin', lumen: 'Wide', valves: 'Yes (prevent backflow)', flow: 'Toward heart', pressure: 'Low' },
  { name: 'Capillaries', wall: '1 cell thick', lumen: 'Very narrow', valves: 'No', flow: 'Between arterioles/venules', pressure: 'Very low' },
];

const PLANT_VESSELS = [
  { name: 'Xylem', direction: 'Roots → Leaves (up)', carries: 'Water + mineral ions', mechanism: 'Transpiration pull, root pressure, capillarity', dead: true, lignified: true },
  { name: 'Phloem', direction: 'Leaves → All parts (up & down)', carries: 'Sucrose + amino acids', mechanism: 'Translocation (active process)', dead: false, lignified: false },
];

export default function TransportSystems() {
  const [module, setModule] = useState<Module>('circulatory');
  const [chamber, setChamber] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const cardiacOutput = ((heartRate * 70) / 1000).toFixed(1); // L/min approx

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🫀 Transport Systems</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Biology — Compare human circulatory and plant vascular systems.</p>
        </div>
        <div className="flex gap-1">
          {([['circulatory', '❤️ Heart & Blood'], ['plant', '🌱 Xylem & Phloem'], ['compare', '⚖️ Compare']] as [Module, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setModule(id)}
              className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${module === id ? 'bg-emerald-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {module === 'circulatory' && (
          <motion.div key="circ" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Double Circulatory System</div>
              <svg viewBox="0 0 400 280" className="w-full rounded-2xl bg-[#0a0f16]">
                {/* Heart outline */}
                <rect x="110" y="50" width="180" height="160" rx="20" fill="rgba(239,68,68,0.06)" stroke="#475569" strokeWidth="2" />
                <line x1="200" y1="50" x2="200" y2="210" stroke="#475569" strokeWidth="2" strokeDasharray="6 4" />
                <text x="200" y="40" fill="#94a3b8" fontSize="10" textAnchor="middle">Septum</text>
                {/* Chambers */}
                {HEART_CHAMBERS.map((c, i) => (
                  <g key={c.name} onClick={() => setChamber(i)} style={{ cursor: 'pointer' }}>
                    <motion.rect x={c.x - 30} y={c.y - 20} width="60" height="40" rx="8"
                      fill={chamber === i ? c.color : `${c.color}44`} stroke={c.color} strokeWidth={chamber === i ? 3 : 1}
                      animate={{ scale: chamber === i ? 1.05 : 1 }} />
                    <text x={c.x} y={c.y + 4} fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">{c.name.split(' ')[1]}</text>
                  </g>
                ))}
                {/* Flow arrows — pulmonary circuit */}
                <path d="M140 60 C140 20, 260 20, 260 60" fill="none" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowB)" />
                <text x="200" y="16" fill="#93c5fd" fontSize="8" textAnchor="middle">Pulmonary circuit (to lungs)</text>
                {/* Flow arrows — systemic circuit */}
                <path d="M260 200 C260 260, 140 260, 140 200" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR)" />
                <text x="200" y="272" fill="#fca5a5" fontSize="8" textAnchor="middle">Systemic circuit (to body)</text>
                <defs>
                  <marker id="arrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#60a5fa" /></marker>
                  <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#ef4444" /></marker>
                </defs>
                {/* Heartbeat pulse */}
                <motion.circle cx="200" cy="130" r="8" fill="rgba(239,68,68,0.4)"
                  animate={{ r: [8, 14, 8], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 60 / heartRate }} />
              </svg>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-2">{HEART_CHAMBERS[chamber].name}</div>
                <p className="text-sm text-slate-300">{HEART_CHAMBERS[chamber].desc}</p>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Heart Rate</span><span className="font-mono text-white">{heartRate} bpm</span></div>
                <input type="range" min={40} max={180} value={heartRate} onChange={e => setHeartRate(Number(e.target.value))} className="w-full accent-red-400" />
                <div className="mt-3 bg-black/30 border border-slate-800 rounded-xl p-3">
                  <div className="text-[9px] uppercase text-slate-500">Cardiac Output</div>
                  <div className="text-lg font-mono text-white mt-1">{cardiacOutput} L/min</div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Blood Vessel Comparison</div>
                <table className="w-full text-[10px] text-left">
                  <thead className="text-[9px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <tr><th className="py-1 px-1">Vessel</th><th className="py-1 px-1">Wall</th><th className="py-1 px-1">Lumen</th><th className="py-1 px-1">Valves</th></tr>
                  </thead>
                  <tbody>
                    {VESSELS.map(v => (
                      <tr key={v.name} className="border-b border-slate-800/50 text-slate-300">
                        <td className="py-1 px-1 font-medium">{v.name}</td>
                        <td className="py-1 px-1">{v.wall}</td>
                        <td className="py-1 px-1">{v.lumen}</td>
                        <td className="py-1 px-1">{v.valves}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {module === 'plant' && (
          <motion.div key="plant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Vascular Bundle Cross-Section</div>
              <svg viewBox="0 0 400 280" className="w-full rounded-2xl bg-[#081310]">
                {/* Stem cross-section */}
                <circle cx="200" cy="140" r="110" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.3" />
                <circle cx="200" cy="140" r="90" fill="rgba(34,197,94,0.05)" stroke="#334155" strokeWidth="1" />
                {/* Xylem vessels */}
                {[{ x: 160, y: 100 }, { x: 180, y: 90 }, { x: 200, y: 85 }, { x: 220, y: 90 }, { x: 240, y: 100 }].map((p, i) => (
                  <g key={`x${i}`}>
                    <circle cx={p.x} cy={p.y} r="12" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" />
                    <text x={p.x} y={p.y + 3} fill="#22c55e" fontSize="7" textAnchor="middle">X</text>
                  </g>
                ))}
                {/* Phloem */}
                {[{ x: 155, y: 145 }, { x: 175, y: 155 }, { x: 200, y: 160 }, { x: 225, y: 155 }, { x: 245, y: 145 }].map((p, i) => (
                  <g key={`p${i}`}>
                    <circle cx={p.x} cy={p.y} r="8" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="2" />
                    <text x={p.x} y={p.y + 3} fill="#f59e0b" fontSize="7" textAnchor="middle">P</text>
                  </g>
                ))}
                {/* Cambium line */}
                <path d="M150 125 Q200 115, 250 125" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 3" />
                <text x="270" y="122" fill="#a78bfa" fontSize="8">Cambium</text>
                {/* Labels */}
                <text x="280" y="90" fill="#22c55e" fontSize="9">Xylem (inner)</text>
                <text x="270" y="160" fill="#f59e0b" fontSize="9">Phloem (outer)</text>
                {/* Arrows showing direction */}
                <line x1="200" y1="200" x2="200" y2="35" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowG)" />
                <text x="210" y="60" fill="#86efac" fontSize="8">Water ↑</text>
                <line x1="300" y1="80" x2="300" y2="220" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowY)" />
                <text x="310" y="160" fill="#fcd34d" fontSize="8">Sucrose ↕</text>
                <defs>
                  <marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#22c55e" /></marker>
                  <marker id="arrowY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f59e0b" /></marker>
                </defs>
              </svg>
            </div>
            <div className="space-y-4">
              {PLANT_VESSELS.map(v => (
                <div key={v.name} className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: v.name === 'Xylem' ? '#22c55e' : '#f59e0b' }}>{v.name}</div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><strong className="text-white">Direction:</strong> {v.direction}</p>
                    <p><strong className="text-white">Carries:</strong> {v.carries}</p>
                    <p><strong className="text-white">Mechanism:</strong> {v.mechanism}</p>
                    <div className="flex gap-3 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${v.dead ? 'border-slate-600 text-slate-400' : 'border-green-500/30 text-green-400'}`}>
                        {v.dead ? 'Dead cells' : 'Living cells'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${v.lignified ? 'border-cyan-500/30 text-cyan-400' : 'border-slate-600 text-slate-400'}`}>
                        {v.lignified ? 'Lignified walls' : 'No lignin'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {module === 'compare' && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Human vs Plant Transport</div>
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr><th className="py-2 px-3">Feature</th><th className="py-2 px-3">🫀 Human</th><th className="py-2 px-3">🌱 Plant</th></tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50"><td className="py-2 px-3 text-white">Pump</td><td className="py-2 px-3">Heart (4-chambered)</td><td className="py-2 px-3">No pump — passive transpiration pull</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 px-3 text-white">Transport medium</td><td className="py-2 px-3">Blood (plasma + cells)</td><td className="py-2 px-3">Water (xylem), sap (phloem)</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 px-3 text-white">Vessels</td><td className="py-2 px-3">Arteries, veins, capillaries</td><td className="py-2 px-3">Xylem, phloem</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 px-3 text-white">Circulation type</td><td className="py-2 px-3">Closed double circulation</td><td className="py-2 px-3">Open system (no return loop)</td></tr>
                  <tr><td className="py-2 px-3 text-white">Gas exchange</td><td className="py-2 px-3">Lungs (alveoli)</td><td className="py-2 px-3">Stomata on leaves</td></tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">🎯 Quick Check</div>
              <p className="text-sm text-white mb-3">Why is the left ventricle wall thicker than the right?</p>
              <div className="space-y-2">
                {['It receives more blood', 'It pumps blood to the lungs only', 'It must generate higher pressure to pump blood around the entire body', 'It contains more valves'].map((opt, i) => (
                  <button key={i} onClick={() => setQuizAnswer(i)} disabled={quizAnswer !== null}
                    className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                      quizAnswer === null ? 'border-slate-800 text-slate-300 hover:border-cyan-500/30' :
                      i === 2 ? 'border-green-500/40 bg-green-500/10 text-green-300' :
                      quizAnswer === i ? 'border-red-500/40 bg-red-500/10 text-red-300' :
                      'border-slate-800 text-slate-500'
                    }`}>{opt}</button>
                ))}
              </div>
              {quizAnswer !== null && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-green-300">
                  ✅ The left ventricle pumps oxygenated blood through the systemic circuit (entire body), requiring much higher pressure than the pulmonary circuit.
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
