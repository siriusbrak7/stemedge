import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plug, Shield, Zap, Globe, GraduationCap } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'plug-wiring' | 'fuses' | 'shock' | 'ghana' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'es1', question: 'In a Ghana/UK 3-pin plug, the live wire is:', type: 'multiple-choice', options: ['Blue', 'Brown', 'Green/Yellow', 'Black'], correctAnswer: 'Brown', explanation: 'Live = Brown, Neutral = Blue, Earth = Green/Yellow. This is the standard UK/Ghana colour code.' },
  { id: 'es2', question: 'A 5A fuse is used for:', type: 'multiple-choice', options: ['Lighting circuits', 'Electric cooker', 'Electric shower', 'Air conditioner'], correctAnswer: 'Lighting circuits', explanation: 'Lighting circuits use 5A fuses. Heavier appliances like cookers (30A) and showers (15A) need higher-rated fuses.' },
  { id: 'es3', question: 'The earth wire protects by:', type: 'multiple-choice', options: ['Carrying current to the appliance', 'Providing a path for fault current to ground', 'Reducing voltage', 'Increasing resistance'], correctAnswer: 'Providing a path for fault current to ground', explanation: 'If a live wire touches the metal casing, the earth wire provides a low-resistance path to ground, causing the fuse to blow and disconnecting the supply.' },
  { id: 'es4', question: 'A current of 50 mA through the body can cause:', type: 'multiple-choice', options: ['No effect', 'Tingling sensation', 'Respiratory failure / death', 'Slight warmth'], correctAnswer: 'Respiratory failure / death', explanation: '50 mA (0.05 A) through the chest can cause respiratory failure and potentially death. Currents above 30 mA are dangerous.' },
  { id: 'es5', question: 'RCD stands for:', type: 'multiple-choice', options: ['Residual Current Device', 'Rapid Circuit Disconnector', 'Rectified Current Distributor', 'Resistance Control Device'], correctAnswer: 'Residual Current Device', explanation: 'An RCD (Residual Current Device) detects imbalances between live and neutral current (leakage to earth) and trips within milliseconds.' },
  { id: 'es6', question: 'Body resistance is approximately:', type: 'multiple-choice', options: ['1 Ω', '100 Ω', '1000–100,000 Ω', '1,000,000 Ω'], correctAnswer: '1000–100,000 Ω', explanation: 'Dry skin resistance is around 100,000 Ω, but wet skin can drop to 1,000 Ω. This is why water and electricity are dangerous together.' },
  { id: 'es7', question: 'GRIDCo stands for:', type: 'multiple-choice', options: ['Ghana Radio and Industrial Distribution Company', 'Ghana Grid Company', 'General Regional Industrial Distribution Corporation', 'Ghana Renewable Infrastructure Development Company'], correctAnswer: 'Ghana Grid Company', explanation: 'Ghana Grid Company (GRIDCo) operates the national electricity transmission network, moving power from generating stations to distribution companies.' },
  { id: 'es8', question: 'At 240V with wet hands (1000Ω), current through body is:', type: 'multiple-choice', options: ['0.24 A (dangerous)', '0.0024 A (safe)', '2.4 A (fatal)', '24 A'], correctAnswer: '0.24 A (dangerous)', explanation: 'I = V/R = 240/1000 = 0.24 A = 240 mA — well above the 30 mA danger threshold. Always keep hands dry around electricity.' },
];

function PlugWiring() {
  const [wires, setWires] = useState<Record<string, string | null>>({ live: null, neutral: null, earth: null });
  const [showAnswer, setShowAnswer] = useState(false);
  const correct = { live: 'brown', neutral: 'blue', earth: 'green-yellow' };
  const wireColors = [
    { id: 'brown', name: 'Brown (Live)', color: '#92400e' },
    { id: 'blue', name: 'Blue (Neutral)', color: '#3b82f6' },
    { id: 'green-yellow', name: 'Green/Yellow (Earth)', color: '#22c55e' },
  ];
  const terminals = [
    { id: 'live', name: 'Live (L)', x: 70, y: 50, color: '#ef4444' },
    { id: 'neutral', name: 'Neutral (N)', x: 200, y: 50, color: '#3b82f6' },
    { id: 'earth', name: 'Earth (E)', x: 135, y: 20, color: '#22c55e' },
  ];
  const allCorrect = wires.live === 'brown' && wires.neutral === 'blue' && wires.earth === 'green-yellow';
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex justify-center">
        <svg viewBox="0 0 280 120" width={300} height={130}>
          <rect x={30} y={10} width={220} height={100} rx={10} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          {terminals.map(term => (
            <g key={term.id}>
              <circle cx={term.x} cy={term.y} r={12} fill="none" stroke={term.color} strokeWidth={2} strokeDasharray={!wires[term.id] ? "3 2" : "0"} />
              {wires[term.id] && (
                <circle cx={term.x} cy={term.y} r={8}
                  fill={wireColors.find(w => w.id === wires[term.id])?.color || 'gray'}
                  stroke="white" strokeWidth={1}
                />
              )}
              <text x={term.x} y={term.y + 28} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontWeight="bold">{term.name}</text>
            </g>
          ))}
          <text x={140} y={95} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.2)">UK/Ghana 3-Pin Plug</text>
        </svg>
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Drag wires to terminals (click to assign)</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {wireColors.map(wire => (
            <button key={wire.id} onClick={() => {
              const unassigned = (['live', 'neutral', 'earth'] as const).find(t => !wires[t]);
              if (unassigned) setWires(prev => ({ ...prev, [unassigned]: wire.id }));
            }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-black/40 hover:border-brand-accent/50 transition-all"
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: wire.color }} />
              <span className="text-white text-xs font-mono">{wire.name}</span>
            </button>
          ))}
          <button onClick={() => { setWires({ live: null, neutral: null, earth: null }); setShowAnswer(false); }}
            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold hover:text-white transition-all"
          >Reset</button>
        </div>
        {allCorrect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 font-bold text-sm text-center">
            Correct! All wires are properly connected.
          </motion.div>
        )}
        {!allCorrect && showAnswer && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-300 text-xs space-y-1">
            <div>Live → Brown wire → Right terminal pin</div>
            <div>Neutral → Blue wire → Left terminal pin</div>
            <div>Earth → Green/Yellow wire → Top (largest) pin</div>
          </div>
        )}
        <button onClick={() => setShowAnswer(!showAnswer)} className="mt-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition-all">
          {showAnswer ? 'Hide' : 'Show'} Answer
        </button>
      </div>
    </div>
  );
}

function FusesCircuitBreakers() {
  const [appliance, setAppliance] = useState('lamp');
  const appliances = [
    { id: 'lamp', name: 'Table Lamp', power: 60, voltage: 240, fuse: 3 },
    { id: 'tv', name: 'Television', power: 150, voltage: 240, fuse: 5 },
    { id: 'iron', name: 'Electric Iron', power: 1000, voltage: 240, fuse: 13 },
    { id: 'cooker', name: 'Electric Cooker', power: 3000, voltage: 240, fuse: 30 },
    { id: 'shower', name: 'Electric Shower', power: 7500, voltage: 240, fuse: 40 },
  ];
  const current = appliances.find(a => a.id === appliance)!;
  const calculatedCurrent = current.power / current.voltage;
  const fuseOptions = [3, 5, 13, 30, 40];
  const [selectedFuse, setSelectedFuse] = useState(3);
  const isCorrect = selectedFuse >= calculatedCurrent && selectedFuse <= calculatedCurrent * 1.5;
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {appliances.map(app => (
          <button key={app.id} onClick={() => setAppliance(app.id)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${appliance === app.id ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >{app.name}</button>
        ))}
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Power</div>
            <div className="font-mono text-lg text-brand-accent font-bold">{current.power} W</div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Voltage</div>
            <div className="font-mono text-lg text-white font-bold">{current.voltage} V</div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current</div>
            <div className="font-mono text-lg text-yellow-400 font-bold">{calculatedCurrent.toFixed(2)} A</div>
          </div>
        </div>
        <div className="text-xs text-slate-400 mb-3">I = P/V = {current.power}/{current.voltage} = {calculatedCurrent.toFixed(2)} A</div>
        <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Select the correct fuse rating:</h3>
        <div className="flex gap-3">
          {fuseOptions.map(f => (
            <button key={f} onClick={() => setSelectedFuse(f)}
              className={`w-14 h-14 rounded-xl font-mono font-bold text-lg transition-all ${selectedFuse === f ? 'bg-brand-accent text-black scale-110' : 'bg-slate-800 text-white border border-slate-700 hover:border-brand-accent/50'}`}
            >{f}A</button>
          ))}
        </div>
        {selectedFuse > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`mt-4 p-3 rounded-xl text-sm font-bold text-center ${isCorrect ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}
          >
            {isCorrect ? `✓ ${selectedFuse}A fuse is correct (just above ${calculatedCurrent.toFixed(2)}A)` : `✗ ${selectedFuse}A is wrong. Current is ${calculatedCurrent.toFixed(2)}A — fuse must be the smallest rating above this.`}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ShockScenarios() {
  const [wetSkin, setWetSkin] = useState(false);
  const resistance = wetSkin ? 1000 : 100000;
  const voltage = 240;
  const current = voltage / resistance;
  const currentMA = current * 1000;
  const dangerLevel = currentMA < 1 ? 'safe' : currentMA < 15 ? 'tingling' : currentMA < 30 ? 'painful' : currentMA < 50 ? 'breathing' : 'fatal';
  const dangerColor = dangerLevel === 'safe' ? 'text-green-400' : dangerLevel === 'tingling' ? 'text-yellow-400' : dangerLevel === 'painful' ? 'text-orange-400' : dangerLevel === 'breathing' ? 'text-red-400' : 'text-red-600';
  const dangerText = dangerLevel === 'safe' ? 'Safe (< 1 mA)' : dangerLevel === 'tingling' ? 'Tingling (1-15 mA)' : dangerLevel === 'painful' ? 'Painful (15-30 mA)' : dangerLevel === 'breathing' ? 'Breathing difficulty (30-50 mA)' : 'Likely fatal (> 50 mA)';
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
        <div className="text-center mb-4">
          <div className="text-2xl font-mono font-bold text-white">I = V / R</div>
          <div className="text-sm text-slate-400">Current through body at {voltage}V mains</div>
        </div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={() => setWetSkin(!wetSkin)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${wetSkin ? 'bg-blue-500 text-black' : 'bg-slate-800 text-slate-400'}`}
          >{wetSkin ? 'Wet Skin' : 'Dry Skin'}</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/40 rounded-xl p-4 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Voltage</div>
            <div className="font-mono text-lg text-white font-bold">{voltage} V</div>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Resistance</div>
            <div className="font-mono text-lg text-yellow-400 font-bold">{resistance.toLocaleString()} Ω</div>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current</div>
            <div className={`font-mono text-lg font-bold ${dangerColor}`}>{currentMA.toFixed(1)} mA</div>
          </div>
        </div>
        <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold ${dangerColor} bg-black/40 border border-slate-800`}>
          {dangerText}
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-5">
        <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Current Effect Scale</h3>
        <div className="space-y-2">
          {[
            { range: '0-1 mA', effect: 'No sensation', color: 'bg-green-500' },
            { range: '1-15 mA', effect: 'Tingling, mild shock', color: 'bg-yellow-500' },
            { range: '15-30 mA', effect: 'Painful, muscle freeze', color: 'bg-orange-500' },
            { range: '30-50 mA', effect: 'Breathing difficulty', color: 'bg-red-500' },
            { range: '50-200 mA', effect: 'Ventricular fibrillation, likely fatal', color: 'bg-red-700' },
          ].map(level => (
            <div key={level.range} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${level.color}`} />
              <span className="text-slate-500 text-xs font-mono w-20">{level.range}</span>
              <span className="text-slate-300 text-xs">{level.effect}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GhanaContext() {
  const cards = [
    { id: 'gridco', title: 'GRIDCo Transmission', icon: '⚡', context: 'Ghana Grid Company (GRIDCo) operates the national transmission network at 161 kV and 330 kV. Power from Akosombo, Bui, and Takoradi thermal plants travels through high-voltage lines to ECG and NEDCO distribution networks. Transmission uses high voltage to reduce current and minimise I²R heat losses.' },
    { id: 'home', title: 'Home Wiring in Ghana', icon: '🏠', context: 'Ghanaian homes use 240V, 50Hz supply (UK standard). Ring main circuits supply power sockets, with radial circuits for lighting. ECG (Electricity Company of Ghana) distributes to southern Ghana, while NEDCO serves the north.' },
    { id: 'safety', title: 'Electrical Safety in Ghana', icon: '⚠️', context: 'Common hazards in Ghana include: exposed wiring in older buildings, overloaded circuits from multiple appliances on one socket, and using electrical appliances with wet hands. ECG recommends RCD installation and regular inspection by licensed electricians.' },
  ];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-light text-white">Electrical Safety in <span className="text-brand-accent font-medium">Ghana</span></h2>
      </div>
      {cards.map(card => (
        <div key={card.id} className="bg-slate-900/60 rounded-2xl border border-brand-border overflow-hidden">
          <div className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors" onClick={() => setExpanded(expanded === card.id ? null : card.id)}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-white font-bold">{card.title}</h3>
            </div>
          </div>
          <AnimatePresence>
            {expanded === card.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-800">
                <div className="p-5"><p className="text-slate-300 text-sm leading-relaxed">{card.context}</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function ElectricalSafety() {
  const [viewMode, setViewMode] = useState<ViewMode>('plug-wiring');

  const MODES: { key: ViewMode; label: string; icon: ReactNode }[] = [
    { key: 'plug-wiring', label: 'Plug Wiring', icon: <Plug size={14} /> },
    { key: 'fuses', label: 'Fuses', icon: <Shield size={14} /> },
    { key: 'shock', label: 'Shock', icon: <Zap size={14} /> },
    { key: 'ghana', label: 'Ghana', icon: <Globe size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl">
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
        {MODES.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setViewMode(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === key ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
          >{icon} {label}</button>
        ))}
      </div>
      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'plug-wiring' && <PlugWiring />}
            {viewMode === 'fuses' && <FusesCircuitBreakers />}
            {viewMode === 'shock' && <ShockScenarios />}
            {viewMode === 'ghana' && <GhanaContext />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Electrical Safety Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full mt-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold text-[9px] uppercase tracking-widest">Exam Note · WAEC · </span>
Know the 3-pin plug wiring (Brown=Live, Blue=Neutral, Green/Yellow=Earth), fuse selection (smallest rating above operating current), and household safety for WASSCE.
      </div>
    </div>
  );
}
