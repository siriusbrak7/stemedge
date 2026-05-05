import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'learn' | 'simulation' | 'quiz';

const TABS = [
  { id: 'learn'      as ViewMode, label: 'Learn',      icon: '📚' },
  { id: 'simulation' as ViewMode, label: 'Simulation', icon: '📐' },
  { id: 'quiz'       as ViewMode, label: 'Quiz',       icon: '📝' },
];

const MATERIALS = {
  Air: 1.00,
  Water: 1.33,
  Glass: 1.50,
  Diamond: 2.42
};

type MaterialName = keyof typeof MATERIALS;

const QUIZ: QuizQuestion[] = [
  { id: 'or1', question: 'Light bends toward the normal when entering a:', type: 'multiple-choice', options: ['Less dense medium', 'More dense medium', 'Vacuum', 'It never bends'], correctAnswer: 'More dense medium', explanation: 'Light slows down in denser media and bends toward the normal.' },
  { id: 'or2', question: 'Total internal reflection occurs when:', type: 'multiple-choice', options: ['Angle of incidence > critical angle', 'Light enters a denser medium', 'Refractive index is 1', 'Angle of incidence = 0'], correctAnswer: 'Angle of incidence > critical angle', explanation: 'When moving from dense to less dense, if angle > critical angle, all light reflects back inside.' },
  { id: 'or3', question: 'Snell\'s Law relates:', type: 'multiple-choice', options: ['Force and mass', 'Refractive indices and angles', 'Voltage and current', 'Temperature and pressure'], correctAnswer: 'Refractive indices and angles', explanation: 'n₁sin(θ₁) = n₂sin(θ₂)' },
  { id: 'or4', question: 'Which material has the highest refractive index?', type: 'multiple-choice', options: ['Air', 'Water', 'Glass', 'Diamond'], correctAnswer: 'Diamond', explanation: 'Diamond (2.42) bends light much more than glass or water, giving it its sparkle.' }
];

export default function OpticsRefraction() {
  const [viewMode, setViewMode] = useState<ViewMode>('simulation');

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">📐 Optics & Refraction</h3>
          <p className="text-xs text-slate-500 mt-1">WAEC Physics — Snell's Law, Critical Angle, and Total Internal Reflection.</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="blue" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={viewMode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {viewMode === 'learn' && <LearnPanel />}
          {viewMode === 'simulation' && <RefractionSim />}
          {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Optics Quiz" /></div>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LearnPanel() {
  return (
    <div className="grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h3 className="text-blue-400 font-bold text-lg mb-4">Snell's Law</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          When light passes between two mediums, it changes speed and bends. This is called <strong className="text-white">refraction</strong>.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">n₁ sin θ₁ = n₂ sin θ₂</p>
        </div>
        <ul className="text-sm text-slate-300 space-y-2 list-disc pl-5">
          <li>Moving to <strong className="text-white">denser</strong> medium (n₂ &gt; n₁) → bends <strong className="text-blue-400">toward</strong> the normal (θ₂ &lt; θ₁)</li>
          <li>Moving to <strong className="text-white">less dense</strong> medium (n₂ &lt; n₁) → bends <strong className="text-red-400">away from</strong> the normal (θ₂ &gt; θ₁)</li>
        </ul>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h3 className="text-amber-400 font-bold text-lg mb-4">Total Internal Reflection (TIR)</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          When light moves from a denser to a less dense medium (e.g., Water → Air), if the angle of incidence is too large, the light cannot escape. It all reflects back inside.
        </p>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-xl p-4 text-center mb-4">
          <p className="text-white font-mono text-lg">sin θc = n₂ / n₁</p>
          <p className="text-slate-400 text-xs mt-1">The Critical Angle Formula</p>
        </div>
        <p className="text-slate-300 text-sm">
          Fibre optic cables use TIR to trap light pulses inside the glass core, allowing high-speed data transmission over long distances.
        </p>
      </div>
    </div>
  );
}

function RefractionSim() {
  const [med1, setMed1] = useState<MaterialName>('Air');
  const [med2, setMed2] = useState<MaterialName>('Glass');
  const [angle1, setAngle1] = useState(45);

  const n1 = MATERIALS[med1];
  const n2 = MATERIALS[med2];

  const rad1 = angle1 * Math.PI / 180;
  const sin2 = (n1 / n2) * Math.sin(rad1);
  
  let angle2 = 0;
  let isTIR = false;
  let criticalAngle: number | null = null;

  if (n1 > n2) {
    criticalAngle = Math.asin(n2 / n1) * 180 / Math.PI;
    if (angle1 >= criticalAngle) {
      isTIR = true;
    } else {
      angle2 = Math.asin(sin2) * 180 / Math.PI;
    }
  } else {
    angle2 = Math.asin(sin2) * 180 / Math.PI;
  }

  const origin = { x: 250, y: 150 };
  const rayLen = 200;
  
  const incX = origin.x - Math.sin(rad1) * rayLen;
  const incY = origin.y - Math.cos(rad1) * rayLen;

  let outX, outY;
  if (isTIR) {
    outX = origin.x + Math.sin(rad1) * rayLen;
    outY = origin.y - Math.cos(rad1) * rayLen;
  } else {
    const rad2 = angle2 * Math.PI / 180;
    outX = origin.x + Math.sin(rad2) * rayLen;
    outY = origin.y + Math.cos(rad2) * rayLen;
  }

  const matColor = (mat: MaterialName) => {
    switch (mat) {
      case 'Air': return '#0a0a1a';
      case 'Water': return '#1e3a8a';
      case 'Glass': return '#0f172a';
      case 'Diamond': return '#1e293b';
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr,0.7fr]">
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <svg viewBox="0 0 500 300" className="w-full bg-[#0a0a1a] rounded-2xl border border-slate-800 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="150" fill={matColor(med1)} />
            <text x="20" y="30" fill="#94a3b8" fontSize="12" fontWeight="bold">{med1} (n={n1.toFixed(2)})</text>
            
            <rect x="0" y="150" width="500" height="150" fill={matColor(med2)} opacity="0.8" />
            <text x="20" y="280" fill="#94a3b8" fontSize="12" fontWeight="bold">{med2} (n={n2.toFixed(2)})</text>

            <line x1="0" y1="150" x2="500" y2="150" stroke="#475569" strokeWidth="2" />
            <line x1="250" y1="20" x2="250" y2="280" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5 5" />

            <line x1={incX} y1={incY} x2={origin.x} y2={origin.y} stroke="#ef4444" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 5px #ef4444)' }} />
            <path d={`M 250 100 A 50 50 0 0 ${angle1 > 0 ? 0 : 1} ${250 - Math.sin(rad1)*50} ${150 - Math.cos(rad1)*50}`} fill="none" stroke="#ef4444" strokeWidth="1" />
            <text x={250 - Math.sin(rad1)*60 - 15} y={150 - Math.cos(rad1)*60} fill="#fca5a5" fontSize="10">{angle1.toFixed(1)}°</text>

            <line x1={origin.x} y1={origin.y} x2={outX} y2={outY} stroke={isTIR ? "#ef4444" : "#3b82f6"} strokeWidth="3" style={{ filter: `drop-shadow(0 0 5px ${isTIR ? '#ef4444' : '#3b82f6'})` }} />
            
            {!isTIR && (
              <>
                <path d={`M 250 200 A 50 50 0 0 ${angle2 > 0 ? 0 : 1} ${250 + Math.sin(angle2 * Math.PI/180)*50} ${150 + Math.cos(angle2 * Math.PI/180)*50}`} fill="none" stroke="#3b82f6" strokeWidth="1" />
                <text x={250 + Math.sin(angle2 * Math.PI/180)*60 + 10} y={150 + Math.cos(angle2 * Math.PI/180)*60 + 10} fill="#93c5fd" fontSize="10">{angle2.toFixed(1)}°</text>
              </>
            )}

            {isTIR && <text x="320" y="100" fill="#fca5a5" fontSize="12" fontWeight="bold">Total Internal Reflection</text>}
          </svg>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Medium 1</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(MATERIALS).map(m => (
                    <button key={m} onClick={() => setMed1(m as MaterialName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${med1 === m ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>{m}</button>
                  ))}
                </div>
             </div>
             <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Medium 2</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(MATERIALS).map(m => (
                    <button key={m} onClick={() => setMed2(m as MaterialName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${med2 === m ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>{m}</button>
                  ))}
                </div>
             </div>
          </div>
          <StemSlider label="Angle of Incidence (θ₁)" value={angle1} min={0} max={89} unit="°" color="red" onChange={setAngle1} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Live Calculation</h3>
          <div className="space-y-3">
            <div className="bg-[#0a0a1a] p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Snell's Law</p>
              <p className="text-white font-mono text-xs">{n1.toFixed(2)} × sin({angle1}°) = {n2.toFixed(2)} × sin(θ₂)</p>
              <p className="text-white font-mono text-xs">{(n1 * Math.sin(rad1)).toFixed(3)} = {n2.toFixed(2)} × sin(θ₂)</p>
              {!isTIR && <p className="text-blue-400 font-mono text-sm mt-2 font-bold">θ₂ = {angle2.toFixed(1)}°</p>}
            </div>

            {criticalAngle !== null ? (
              <div className={`p-4 rounded-xl border ${isTIR ? 'bg-amber-500/10 border-amber-500/50' : 'bg-[#0a0a1a] border-slate-800'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Critical Angle (θc)</p>
                <p className="text-white font-mono text-xs">sin⁻¹({n2.toFixed(2)} / {n1.toFixed(2)})</p>
                <p className="text-amber-400 font-mono text-lg font-bold">θc = {criticalAngle.toFixed(1)}°</p>
                {isTIR ? (
                  <p className="text-xs text-red-400 mt-2 font-bold">θ₁ &gt; θc → TIR occurs</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-2">θ₁ &lt; θc → Light refracts</p>
                )}
              </div>
            ) : (
              <div className="bg-[#0a0a1a] p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400">Light is moving to a denser medium. TIR cannot occur.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
