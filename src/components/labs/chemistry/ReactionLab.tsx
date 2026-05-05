import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Flame, Trophy, RotateCcw, Play, Thermometer, Droplets, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { REACTION_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  type: 'acid' | 'base' | 'product' | 'water' | 'gas';
  reacted: boolean;
  opacity: number;
  size: number;
}

const REACTIONS = [
  {
    id: 'neutralization',
    name: 'Neutralization',
    equation: 'HCl + NaOH → NaCl + H₂O',
    acid: 'Hydrochloric Acid (HCl)',
    base: 'Sodium Hydroxide (NaOH)',
    products: ['Sodium Chloride (NaCl)', 'Water (H₂O)'],
    exothermic: true,
    gasProduced: false,
    color: { acid: '#ef4444', base: '#3b82f6', product: '#a855f7', water: '#22d3ee' },
    phChange: [1, 7],
    tempChange: 12,
    fact: 'Neutralization reactions always produce water and a salt.',
  },
  {
    id: 'carbonate',
    name: 'Acid + Carbonate',
    equation: 'HCl + CaCO₃ → CaCl₂ + H₂O + CO₂',
    acid: 'Hydrochloric Acid (HCl)',
    base: 'Calcium Carbonate (CaCO₃)',
    products: ['Calcium Chloride (CaCl₂)', 'Water', 'Carbon Dioxide (CO₂)'],
    exothermic: true,
    gasProduced: true,
    color: { acid: '#ef4444', base: '#f5f5f5', product: '#22c55e', water: '#22d3ee' },
    phChange: [2, 5],
    tempChange: 8,
    fact: 'The fizzing you see is carbon dioxide gas escaping — this is how we test for carbonates!',
  },
  {
    id: 'metal-acid',
    name: 'Metal + Acid',
    equation: '2HCl + Mg → MgCl₂ + H₂',
    acid: 'Hydrochloric Acid (HCl)',
    base: 'Magnesium (Mg)',
    products: ['Magnesium Chloride (MgCl₂)', 'Hydrogen Gas (H₂)'],
    exothermic: true,
    gasProduced: true,
    color: { acid: '#ef4444', base: '#94a3b8', product: '#eab308', water: '#22d3ee' },
    phChange: [1, 4],
    tempChange: 18,
    fact: 'The hydrogen gas produced gives a squeaky pop test with a lit splint!',
  },
];

interface ReactionSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function ReactionSimulation({ variables, isRunning, onRecordData }: ReactionSimProps) {
  const acidConc = variables['acid-concentration'] ?? 1.0;
  const temperature = variables['temperature'] ?? 25;
  const reactionType = Math.round(variables['reaction-type'] ?? 0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const [reactionIdx, setReactionIdx] = useState(0);
  const [isReacting, setIsReacting] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'predict' | 'observe' | 'result'>('setup');
  const [prediction, setPrediction] = useState('');
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentPH, setCurrentPH] = useState(1);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [showBubbles, setShowBubbles] = useState(false);
  const [experiments, setExperiments] = useState(0);
  const [recorded, setRecorded] = useState(false);

  const reaction = REACTIONS[reactionIdx];
  const W = 500;
  const H = 380;

  const acidConcPercent = acidConc / 3.0 * 100;

  useEffect(() => {
    const idx = Math.min(reactionType, REACTIONS.length - 1);
    setReactionIdx(idx);
  }, [reactionType]);

  const initParticles = useCallback(() => {
    particlesRef.current = [];
    const count = Math.floor(acidConcPercent * 0.6) + 10;

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: 80 + Math.random() * 140,
        y: 200 + Math.random() * 140,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        type: 'acid',
        reacted: false,
        opacity: 1,
        size: 4 + Math.random() * 2,
      });
    }

    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x: 250 + Math.random() * 160,
        y: 200 + Math.random() * 140,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: 'base',
        reacted: false,
        opacity: 1,
        size: 5 + Math.random() * 3,
      });
    }
  }, [acidConcPercent]);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);

    const bx = 80, by = 120, bw = 340, bh = 230;

    const liquidH = bh * 0.85;
    const liquidY = by + bh - liquidH;

    const phNorm = (currentPH - 1) / 13;
    const r = Math.floor(239 * (1 - phNorm) + 34 * phNorm);
    const g = Math.floor(68 * (1 - phNorm) + 197 * phNorm);
    const b = Math.floor(68 * (1 - phNorm) + 94 * phNorm);
    const liquidGrad = ctx.createLinearGradient(bx, liquidY, bx, by + bh);
    liquidGrad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
    liquidGrad.addColorStop(1, `rgba(${r},${g},${b},0.15)`);
    ctx.fillStyle = liquidGrad;
    ctx.fillRect(bx + 4, liquidY, bw - 8, liquidH);

    if (showBubbles && reaction.gasProduced) {
      const t = timeRef.current;
      for (let i = 0; i < 25; i++) {
        const bub_x = bx + 20 + Math.random() * (bw - 40);
        const bub_y = liquidY + Math.random() * liquidH;
        const bubR = 3 + Math.random() * 7;
        const drift = Math.sin(t * 3 + i) * 8;
        const bubbleY = bub_y - (t * 30 + i * 12) % liquidH;
        ctx.beginPath();
        ctx.arc(bub_x + drift, bubbleY, bubR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bub_x + drift - bubR * 0.3, bubbleY - bubR * 0.3, bubR * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
      }
    }

    particlesRef.current.forEach(p => {
      if (p.opacity <= 0) return;
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      if (p.type === 'acid') {
        ctx.fillStyle = reaction.color.acid;
        ctx.shadowColor = reaction.color.acid;
      } else if (p.type === 'base') {
        ctx.fillStyle = reaction.color.base;
        ctx.shadowColor = reaction.color.base;
      } else if (p.type === 'product') {
        ctx.fillStyle = reaction.color.product;
        ctx.shadowColor = reaction.color.product;
      } else if (p.type === 'gas') {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.shadowColor = 'rgba(255,255,255,0.2)';
      } else {
        ctx.fillStyle = reaction.color.water;
        ctx.shadowColor = reaction.color.water;
      }
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 5, by);
    ctx.lineTo(bx + 15, by - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + bw + 5, by);
    ctx.lineTo(bx + bw - 15, by - 10);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'right';
    for (let i = 1; i <= 4; i++) {
      const my = by + bh - (bh * i * 0.2);
      ctx.beginPath();
      ctx.moveTo(bx + 4, my);
      ctx.lineTo(bx + 25, my);
      ctx.stroke();
      ctx.fillText(`${i * 50}ml`, bx + 55, my + 3);
    }

    if (isReacting && reaction.exothermic) {
      const glowAlpha = Math.sin(timeRef.current * 5) * 0.15 + 0.18;
      ctx.fillStyle = `rgba(239, 68, 68, ${glowAlpha})`;
      ctx.fillRect(bx + 4, liquidY, bw - 8, liquidH);
      const heatGrad = ctx.createRadialGradient(bx + bw / 2, liquidY + liquidH / 2, 10, bx + bw / 2, liquidY + liquidH / 2, bw * 0.6);
      heatGrad.addColorStop(0, `rgba(251, 146, 60, ${glowAlpha * 0.5})`);
      heatGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = heatGrad;
      ctx.fillRect(bx + 4, liquidY, bw - 8, liquidH);
    }

    const phBarY = H - 35;
    const phGrad = ctx.createLinearGradient(80, phBarY, 420, phBarY);
    phGrad.addColorStop(0, '#ef4444');
    phGrad.addColorStop(0.35, '#eab308');
    phGrad.addColorStop(0.5, '#22c55e');
    phGrad.addColorStop(0.65, '#3b82f6');
    phGrad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = phGrad;
    ctx.fillRect(80, phBarY, 340, 8);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, phBarY, 340, 8);

    const phX = 80 + (currentPH / 14) * 340;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(phX, phBarY - 3);
    ctx.lineTo(phX - 4, phBarY - 8);
    ctx.lineTo(phX + 4, phBarY - 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ACID ←', 110, H - 8);
    ctx.fillText(`pH ${currentPH.toFixed(1)}`, 250, H - 8);
    ctx.fillText('→ BASE', 390, H - 8);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Temp: ${currentTemp.toFixed(0)}°C`, 15, 20);
    ctx.fillText(`Progress: ${(reactionProgress * 100).toFixed(0)}%`, 15, 35);

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(reaction.equation, W / 2, 80);
  }, [reaction, currentPH, currentTemp, isReacting, showBubbles, reactionProgress, W, H]);

  const startReaction = useCallback(() => {
    setIsReacting(true);
    setPhase('observe');
    setShowBubbles(reaction.gasProduced);
    setExperiments(prev => prev + 1);
    timeRef.current = 0;
    setRecorded(false);

    const speedFactor = 1 + (temperature - 25) * 0.03;
    const totalDuration = 5000 / speedFactor;
    const startTime = Date.now();
    const startPH = reaction.phChange[0];
    const endPH = reaction.phChange[1];
    const startTemp = temperature;
    const endTemp = temperature + reaction.tempChange;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalDuration);
      timeRef.current += 0.016;

      setReactionProgress(progress);
      setCurrentPH(startPH + (endPH - startPH) * progress);
      setCurrentTemp(startTemp + (endTemp - startTemp) * Math.min(1, progress * 1.5) * Math.exp(-progress * 0.5));

      const particles = particlesRef.current;
      const reactionChance = 0.02 * speedFactor;

      particles.forEach(p => {
        if (p.reacted || p.opacity <= 0) {
          if (p.type === 'gas') {
            p.y -= 1.5;
            p.x += Math.sin(timeRef.current * 3 + p.x) * 0.5;
            p.opacity -= 0.005;
          }
          return;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 84 || p.x > 416) p.vx *= -1;
        if (p.y < 140 || p.y > 346) p.vy *= -1;
        p.x = Math.max(84, Math.min(416, p.x));
        p.y = Math.max(140, Math.min(346, p.y));

        p.vx += (Math.random() - 0.5) * 0.3 * speedFactor;
        p.vy += (Math.random() - 0.5) * 0.3 * speedFactor;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.type === 'acid' && Math.random() < reactionChance * progress) {
          const nearby = particles.find(b =>
            b.type === 'base' && !b.reacted &&
            Math.abs(b.x - p.x) < 30 && Math.abs(b.y - p.y) < 30
          );
          if (nearby) {
            p.reacted = true;
            nearby.reacted = true;
            p.type = 'product';
            p.size = 6;
            nearby.type = 'water';
            nearby.size = 4;

            const flashX = (p.x + nearby.x) / 2;
            const flashY = (p.y + nearby.y) / 2;
            particles.push({
              x: flashX, y: flashY,
              vx: 0, vy: 0,
              type: 'product',
              reacted: true,
              opacity: 0.9,
              size: 12,
            });
            setTimeout(() => {
              const flash = particles.find(fp => fp.x === flashX && fp.y === flashY && fp.size === 12);
              if (flash) flash.opacity = 0;
            }, 120);

            if (reaction.gasProduced) {
              for (let g = 0; g < 2 + Math.floor(Math.random() * 2); g++) {
                particles.push({
                  x: p.x + (Math.random() - 0.5) * 10,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -1.5 - Math.random() * 3,
                  type: 'gas',
                  reacted: true,
                  opacity: 0.7,
                  size: 3 + Math.random() * 4,
                });
              }
            }
          }
        }
      });

      drawScene();

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsReacting(false);
        setPhase('result');
        setShowBubbles(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [reaction, temperature, drawScene]);

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsReacting(false);
    setPhase('setup');
    setReactionProgress(0);
    setCurrentPH(reaction.phChange[0]);
    setCurrentTemp(temperature);
    setShowBubbles(false);
    setPrediction('');
    setPredictionResult(null);
    setRecorded(false);
    initParticles();
    setTimeout(drawScene, 50);
  };

  const submitPrediction = () => {
    if (!prediction) return;
    const correct = reaction.gasProduced ? 'yes' : 'no';
    if (prediction.toLowerCase() === correct) {
      setPredictionResult('correct');
      setScore(prev => prev + 3);
    } else {
      setPredictionResult('wrong');
    }
    setTimeout(startReaction, 800);
  };

  const recordReactionData = () => {
    if (recorded) return;
    setRecorded(true);
    onRecordData({
      finalPH: Number(currentPH.toFixed(2)),
      peakTemp: Number(currentTemp.toFixed(1)),
      gasProduced: reaction.gasProduced ? 'Yes' : 'No',
      reactionType: reaction.name,
      acidConcentration: acidConc,
      temperature,
      progress: Number((reactionProgress * 100).toFixed(1)),
    });
  };

  useEffect(() => {
    if (phase === 'result' && !recorded) {
      recordReactionData();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initParticles();
    setCurrentPH(reaction.phChange[0]);
    setTimeout(drawScene, 50);
  }, [reactionIdx, acidConcPercent, initParticles, drawScene, reaction]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Chemical <span className="text-green-400 font-medium">Reactions Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Investigate acid reactions, pH changes, and gas production</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold text-sm">{score} pts</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">EXPERIMENTS: {experiments}</span>
        </div>
      </div>

      {/* Reaction selector */}
      <div className="flex gap-2 flex-wrap">
        {REACTIONS.map((r, i) => (
          <button key={r.id}
            onClick={() => { setReactionIdx(i); reset(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              reactionIdx === i ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <canvas ref={canvasRef} width={W} height={H} className="block" />
      </div>

      {/* Controls */}
      <div className="w-full max-w-[500px] grid grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Acid Concentration</span>
            <span className="text-red-400 text-sm font-mono">{acidConc.toFixed(1)} M</span>
          </div>
          <div className="text-[9px] text-slate-600 mb-1">(Use VirtualLabEngine controls to adjust)</div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span>Temperature</span>
            <span className="text-orange-400 text-sm font-mono">{temperature}°C</span>
          </div>
          <div className="text-[9px] text-slate-600 mb-1">(Use VirtualLabEngine controls to adjust)</div>
        </div>
      </div>

      {/* Prediction */}
      {phase === 'setup' && (
        <div className="w-full max-w-[500px] bg-slate-900/60 rounded-2xl border border-orange-500/20 p-6">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">🧪 Prediction Phase</h3>
          <p className="text-white text-sm font-medium mb-1">{reaction.equation}</p>
          <p className="text-slate-400 text-sm mb-3">Examine the reactants above. Will this reaction produce a gas? Think about which products could be gaseous at room temperature.</p>
          <div className="flex gap-3">
            <button onClick={() => { setPrediction('yes'); }}
              className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                prediction === 'yes' ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
              }`}>Yes — Gas produced</button>
            <button onClick={() => { setPrediction('no'); }}
              className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                prediction === 'no' ? 'bg-red-500/20 border-2 border-red-500 text-red-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
              }`}>No — No gas</button>
          </div>
          {prediction && (
            <button onClick={submitPrediction}
              className="w-full mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-400 transition-all"
            >Confirm Prediction & Start Reaction</button>
          )}
          {predictionResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`mt-3 p-3 rounded-lg text-sm font-bold ${
                predictionResult === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
              {predictionResult === 'correct' ? '🎯 Correct prediction! +3 pts. Watch the reaction unfold...' : `❌ Not quite — this reaction ${reaction.gasProduced ? 'does produce gas (' + reaction.products[reaction.products.length - 1] + ')' : 'only produces aqueous products'}. Observe carefully...`}
            </motion.div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {phase === 'setup' && !prediction && (
          <button onClick={startReaction} disabled={isReacting}
            className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-slate-300 font-bold uppercase tracking-widest rounded-xl border border-slate-700 hover:text-white transition-all"
          ><Play fill="currentColor" size={18} /> Quick React</button>
        )}
        {(phase === 'result') && (
          <button onClick={reset}
            className="flex items-center gap-2 px-8 py-3 bg-green-500 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-green-400 transition-all"
          ><RotateCcw size={18} /> New Experiment</button>
        )}
      </div>

      {/* Results */}
      {phase === 'result' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[500px] space-y-4"
        >
          <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Final pH</div>
                <div className="text-xl font-mono text-green-400 font-bold">{currentPH.toFixed(1)}</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Peak Temp</div>
                <div className="text-xl font-mono text-orange-400 font-bold">{currentTemp.toFixed(0)}°C</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Gas</div>
                <div className="text-xl font-mono text-cyan-400 font-bold">{reaction.gasProduced ? 'Yes' : 'No'}</div>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-yellow-300 text-sm">💡 {reaction.fact}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ReactionLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <ReactionSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const avgPH = observations.length
      ? observations.reduce((sum, o) => sum + (typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).finalPH ?? 0) : 0), 0) / observations.length
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
          You investigated chemical reactions across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Avg Final pH</div>
            <div className="text-2xl font-mono font-bold text-green-400">{avgPH.toFixed(1)}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Observations</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">{observations.length}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCompletedSession(null)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={REACTION_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
