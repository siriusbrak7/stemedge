import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Activity, Droplet } from 'lucide-react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type ViewMode = 'action-potential' | 'synapse' | 'quiz';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'nt1', question: 'What ion rushes INTO the neuron during depolarization?', type: 'multiple-choice', options: ['Potassium (K+)', 'Sodium (Na+)', 'Calcium (Ca2+)', 'Chloride (Cl-)'], correctAnswer: 'Sodium (Na+)', explanation: 'Sodium channels open, allowing Na+ to rush in, making the inside of the cell positive.' },
  { id: 'nt2', question: 'Which ion triggers the release of neurotransmitters at the axon terminal?', type: 'multiple-choice', options: ['Sodium (Na+)', 'Potassium (K+)', 'Calcium (Ca2+)', 'Magnesium (Mg2+)'], correctAnswer: 'Calcium (Ca2+)', explanation: 'When the action potential reaches the terminal, voltage-gated Calcium channels open. Ca2+ entering the cell causes vesicles to fuse with the membrane.' },
  { id: 'nt3', question: 'What happens to neurotransmitters after they bind to receptors?', type: 'multiple-choice', options: ['They stay bound forever', 'They are broken down by enzymes or reuptaken', 'They enter the postsynaptic cell', 'They turn into ATP'], correctAnswer: 'They are broken down by enzymes or reuptaken', explanation: 'To stop the signal, neurotransmitters are quickly cleared from the synaptic cleft via reuptake or enzymatic breakdown (like acetylcholinesterase).' },
];

export default function SynapticSpark() {
  const [viewMode, setViewMode] = useState<ViewMode>('action-potential');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        {(['action-potential', 'synapse', 'quiz'] as ViewMode[]).map((mode) => (
          <button key={mode} onClick={() => setViewMode(mode)}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === mode ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {mode.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {viewMode === 'action-potential' && <ActionPotentialMode />}
            {viewMode === 'synapse' && <SynapseMode />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ_QUESTIONS} title="Neurotransmission Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActionPotentialMode() {
  const [naOpen, setNaOpen] = useState(false);
  const [kOpen, setKOpen] = useState(false);
  const [potential, setPotential] = useState(-70);
  const graphRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPotential(p => {
        let newP = p;
        if (naOpen) newP += 5; // Depolarization
        else if (kOpen) newP -= 4; // Repolarization
        else if (p > -70) newP -= 1; // Leak back to resting
        else if (p < -70) newP += 1;
        return Math.max(-90, Math.min(40, newP));
      });
      timeRef.current += 1;
      setPoints(prev => {
        const newPoints = [...prev, { x: timeRef.current, y: potential }];
        if (newPoints.length > 200) newPoints.shift();
        return newPoints;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [naOpen, kOpen, potential]);

  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const zeroY = canvas.height / 2; // say 0mV is middle
    const restY = zeroY + 35; // -70mV
    ctx.moveTo(0, restY); ctx.lineTo(canvas.width, restY); // resting line
    ctx.stroke();

    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4'; // brand accent
    ctx.lineWidth = 3;
    
    const minX = points[0].x;
    const scaleX = canvas.width / 200;
    
    points.forEach((p, i) => {
      const x = (p.x - minX) * scaleX;
      // map -90 to +40 to canvas height
      const y = canvas.height - ((p.y + 90) / 130) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [points]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      <div className="flex gap-8 w-full">
        {/* Membrane Simulator */}
        <div className="flex-1 bg-slate-900/60 rounded-2xl border border-brand-border p-6 relative h-[300px]">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">Cell Membrane</div>
          {/* Extracellular */}
          <div className="absolute top-12 w-full text-center text-xs text-slate-500">Extracellular Fluid (High Na+)</div>
          
          {/* Membrane */}
          <div className="absolute top-1/2 left-0 w-full h-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-800/80 border-y border-brand-accent/50 flex justify-center gap-12 items-center -translate-y-1/2 z-10">
            {/* Na+ Channel */}
            <div 
              onMouseDown={() => setNaOpen(true)} onMouseUp={() => setNaOpen(false)} onMouseLeave={() => setNaOpen(false)}
              className={`w-12 h-16 rounded cursor-pointer flex flex-col items-center justify-center transition-all ${naOpen ? 'bg-orange-500 scale-110 shadow-[0_0_20px_#f97316]' : 'bg-slate-700'}`}
            >
              <span className="text-[10px] font-bold text-white">Na+ Gate</span>
              <span className="text-xs">{naOpen ? 'OPEN' : 'HOLD'}</span>
            </div>
            
            {/* K+ Channel */}
            <div 
              onMouseDown={() => setKOpen(true)} onMouseUp={() => setKOpen(false)} onMouseLeave={() => setKOpen(false)}
              className={`w-12 h-16 rounded cursor-pointer flex flex-col items-center justify-center transition-all ${kOpen ? 'bg-blue-500 scale-110 shadow-[0_0_20px_#3b82f6]' : 'bg-slate-700'}`}
            >
              <span className="text-[10px] font-bold text-white">K+ Gate</span>
              <span className="text-xs">{kOpen ? 'OPEN' : 'HOLD'}</span>
            </div>
          </div>

          {/* Intracellular */}
          <div className="absolute bottom-12 w-full text-center text-xs text-slate-500">Intracellular Fluid (High K+)</div>
          
          {/* Particles */}
          <AnimatePresence>
            {naOpen && <motion.div initial={{y:0, opacity:1}} animate={{y:100, opacity:0}} transition={{repeat: Infinity, duration: 0.5}} className="absolute top-1/3 left-[40%] w-3 h-3 bg-orange-400 rounded-full blur-[2px]" />}
            {kOpen && <motion.div initial={{y:200, opacity:1}} animate={{y:100, opacity:0}} transition={{repeat: Infinity, duration: 0.5}} className="absolute bottom-1/3 right-[40%] w-3 h-3 bg-blue-400 rounded-full blur-[2px]" />}
          </AnimatePresence>
        </div>

        {/* Graph */}
        <div className="flex-1 bg-slate-900/60 rounded-2xl border border-brand-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-slate-400 uppercase tracking-widest">Membrane Potential (mV)</div>
            <div className={`text-xl font-mono font-bold ${potential > 0 ? 'text-orange-400' : 'text-cyan-400'}`}>{Math.round(potential)} mV</div>
          </div>
          <canvas ref={graphRef} width={400} height={200} className="w-full flex-1 bg-black/40 rounded-xl" />
        </div>
      </div>
      
      <div className="text-sm text-slate-400 text-center max-w-2xl bg-brand-accent/5 p-4 rounded-xl border border-brand-accent/20">
        <strong className="text-brand-accent">Instructions:</strong> Hold the <strong>Na+ Gate</strong> to simulate Depolarization (action potential fires). Then hold the <strong>K+ Gate</strong> to simulate Repolarization (falling phase).
      </div>
    </div>
  );
}

function SynapseMode() {
  const [vesicles, setVesicles] = useState([0, 1, 2]);
  const [released, setReleased] = useState<number[]>([]);
  const [receptors, setReceptors] = useState([false, false, false, false]);

  const releaseVesicle = () => {
    if (vesicles.length === 0) return;
    const v = vesicles.pop();
    setVesicles([...vesicles]);
    setReleased([...released, v as number]);
    
    // Simulate binding after delay
    setTimeout(() => {
      setReceptors(prev => prev.map((_, i) => Math.random() > 0.3));
      setTimeout(() => setReceptors([false, false, false, false]), 800); // Cleared from cleft
    }, 1000);
  };

  const signalPassed = receptors.filter(Boolean).length >= 3;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      <div className="relative w-[400px] h-[500px] bg-slate-900/60 border border-brand-border rounded-full flex flex-col justify-between overflow-hidden p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Pre-synaptic terminal */}
        <div className="w-full h-[40%] bg-slate-800/80 rounded-b-full border-b-4 border-purple-500/50 relative flex flex-col items-center pt-8">
          <div className="text-xs text-purple-300 uppercase tracking-widest font-bold">Axon Terminal</div>
          <div className="flex gap-4 mt-4">
            <AnimatePresence>
              {vesicles.map(v => (
                <motion.div key={v} exit={{ y: 150, opacity: 0, scale: 0.5 }} transition={{ duration: 1 }}
                  className="w-10 h-10 rounded-full border-2 border-cyan-400/50 bg-cyan-900/30 flex items-center justify-center relative shadow-[0_0_15px_#06b6d4]">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full blur-[1px]"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full blur-[1px] absolute top-2 left-2"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full blur-[1px] absolute bottom-2 right-2"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Synaptic Cleft */}
        <div className="w-full flex-1 relative">
          <AnimatePresence>
            {released.map((r, i) => (
              <motion.div key={r + '-' + i} initial={{ y: -50, opacity: 0 }} animate={{ y: 50, opacity: [1, 0] }} transition={{ duration: 1, delay: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-[2px] shadow-[0_0_10px_#06b6d4]" />
            ))}
          </AnimatePresence>
        </div>

        {/* Post-synaptic membrane */}
        <div className={`w-full h-[30%] bg-slate-800/80 rounded-t-full border-t-4 transition-colors duration-500 relative flex justify-center items-start pt-2 gap-6 ${signalPassed ? 'border-orange-500 shadow-[0_-20px_50px_rgba(249,115,22,0.3)] bg-orange-900/20' : 'border-blue-500/50'}`}>
           {receptors.map((active, i) => (
             <div key={i} className={`w-12 h-6 rounded-b-xl border-2 transition-all duration-300 ${active ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_15px_#22d3ee]' : 'bg-slate-700 border-slate-600'}`}>
                {active && <div className="w-full h-full animate-ping bg-cyan-400 rounded-b-xl opacity-50"></div>}
             </div>
           ))}
           <div className="absolute bottom-6 text-xs text-blue-300 uppercase tracking-widest font-bold">Post-synaptic Dendrite</div>
           {signalPassed && <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} className="absolute top-1/2 text-orange-400 font-black italic tracking-widest text-xl drop-shadow-[0_0_10px_#f97316]">ACTION POTENTIAL FIRED!</motion.div>}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={releaseVesicle} disabled={vesicles.length === 0}
          className="px-8 py-4 bg-brand-accent text-black rounded-xl font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
          <Droplet size={20} /> Release Neurotransmitters
        </button>
        <button onClick={() => { setVesicles([0, 1, 2]); setReleased([]); setReceptors([false, false, false, false]); }} className="px-6 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase hover:bg-slate-700 transition-all">
          Reset
        </button>
      </div>
    </div>
  );
}
