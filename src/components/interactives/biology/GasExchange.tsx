import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StemSlider from '../shared/StemSlider';
import ModuleTabs from '../shared/ModuleTabs';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';

type Module = 'alveoli' | 'haemoglobin' | 'fick' | 'quiz';

const TABS = [
  { id: 'alveoli' as Module, label: 'Alveoli Sim', icon: '🫁' },
  { id: 'haemoglobin' as Module, label: 'Haemoglobin', icon: '🩸' },
  { id: 'fick' as Module, label: "Fick's Law", icon: '📐' },
  { id: 'quiz' as Module, label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'ge1', question: 'Why do alveoli have thin walls (one cell thick)?', type: 'multiple-choice', options: ['To allow cells to divide quickly', 'To minimise the diffusion distance for gases', 'To increase the surface area', 'To allow blood to flow faster'], correctAnswer: 'To minimise the diffusion distance for gases', explanation: 'Fick\'s Law: Rate ∝ (Surface Area × Conc. Difference) / Thickness. Thinner walls = shorter diffusion distance = faster gas exchange.' },
  { id: 'ge2', question: 'Oxygen diffuses FROM the alveoli INTO the blood because:', type: 'multiple-choice', options: ['The heart pumps it there', 'O₂ concentration is higher in the alveoli than the blood', 'The diaphragm contracts', 'Blood pressure forces it in'], correctAnswer: 'O₂ concentration is higher in the alveoli than the blood', explanation: 'Diffusion always moves from high concentration to low concentration (down the gradient). Air in alveoli has ~21% O₂; deoxygenated blood arriving has very low O₂.' },
  { id: 'ge3', question: 'The Bohr Effect means that at higher CO₂, haemoglobin:', type: 'multiple-choice', options: ['Binds more tightly to oxygen', 'Releases oxygen more readily', 'Produces more red blood cells', 'Stops functioning entirely'], correctAnswer: 'Releases oxygen more readily', explanation: 'CO₂ lowers pH. Lower pH reduces haemoglobin\'s affinity for O₂ — it unloads O₂ in actively respiring tissues where CO₂ is high. This is the Bohr Effect.' },
  { id: 'ge4', question: 'Emphysema reduces gas exchange because it:', type: 'multiple-choice', options: ['Thickens alveolar walls', 'Destroys alveolar walls, reducing surface area', 'Reduces haemoglobin levels', 'Blocks the pulmonary artery'], correctAnswer: 'Destroys alveolar walls, reducing surface area', explanation: 'Emphysema breaks down the walls between alveoli, creating larger but fewer air sacs. Surface area is dramatically reduced, impairing O₂ uptake. Fick\'s Law: less area → lower rate.' },
];

// Alveolus + Capillary Interactive Simulation
function AlveoliSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t = useRef(0);
  const [o2Gradient, setO2Gradient] = useState(75);
  const [surfaceArea, setSurfaceArea] = useState(70);
  const [thickness, setThickness] = useState(2);
  const [showCondition, setShowCondition] = useState<'normal' | 'emphysema' | 'fibrosis'>('normal');

  const getConditionParams = useCallback(() => {
    if (showCondition === 'emphysema') return { sa: 25, thick: 2, note: 'Emphysema: walls destroyed → SA reduced by ~75%' };
    if (showCondition === 'fibrosis') return { sa: 70, thick: 8, note: 'Fibrosis: scar tissue thickens alveolar walls' };
    return { sa: surfaceArea, thick: thickness, note: null };
  }, [showCondition, surfaceArea, thickness]);

  const { sa, thick, note } = getConditionParams();
  const diffusionRate = ((sa / 100) * (o2Gradient / 100)) / Math.max(0.5, thick / 5);
  const particleRate = Math.max(1, Math.round(diffusionRate * 8));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    // Particles
    const o2particles: { x: number; y: number; vy: number; age: number; maxAge: number; side: number }[] = [];
    const co2particles: { x: number; y: number; vy: number; age: number; maxAge: number; side: number }[] = [];
    const rbcs: { x: number; speed: number }[] = [{ x: -30, speed: 0.6 }, { x: 80, speed: 0.5 }, { x: 200, speed: 0.7 }];

    const alveolus = { top: 20, h: 120, bottom: 140 };
    const membrane = { top: 140, bottom: 140 + thick * 5 };
    const capillary = { top: 140 + thick * 5, h: 80 };

    let frameCount = 0;

    const draw = () => {
      t.current += 0.016;
      ctx.clearRect(0, 0, W, H);

      const mTop = 140;
      const mBot = Math.min(200, mTop + thick * 5);
      const capTop = mBot;

      // Draw alveolus (air sac)
      if (showCondition === 'emphysema') {
        // Fewer, larger broken alveoli
        ctx.save();
        ctx.fillStyle = 'rgba(56,189,248,0.08)';
        ctx.strokeStyle = 'rgba(56,189,248,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(W * 0.3, 60, 65, 55, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(W * 0.7, 65, 60, 50, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(239,68,68,0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(W * 0.3 - 20, 80); ctx.lineTo(W * 0.3 + 20, 80); // broken wall
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      } else {
        // Normal alveolus dome
        const alvGrad = ctx.createLinearGradient(0, 0, 0, mTop);
        alvGrad.addColorStop(0, 'rgba(56,189,248,0.12)');
        alvGrad.addColorStop(1, 'rgba(56,189,248,0.06)');
        ctx.fillStyle = alvGrad;
        ctx.strokeStyle = 'rgba(56,189,248,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(W / 2, -5, W * 0.55, 0.2, Math.PI - 0.2);
        ctx.fill(); ctx.stroke();
        // Moist lining shimmer
        ctx.strokeStyle = 'rgba(147,210,248,0.3)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(W / 2, -5, W * 0.52, 0.25, Math.PI - 0.25);
        ctx.stroke();
      }

      // Labels
      ctx.fillStyle = 'rgba(147,210,248,0.8)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Air Space (Alveolus)', W / 2, 18);
      ctx.fillStyle = 'rgba(147,210,248,0.5)';
      ctx.font = '9px monospace';
      ctx.fillText(`pO₂ HIGH ${o2Gradient}% → `, W / 2, 30);

      // Membrane / alveolar wall
      const wallColor = showCondition === 'fibrosis' ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.15)';
      ctx.fillStyle = wallColor;
      ctx.fillRect(0, mTop, W, mBot - mTop);
      ctx.strokeStyle = showCondition === 'fibrosis' ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, mTop, W, mBot - mTop);
      ctx.fillStyle = showCondition === 'fibrosis' ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.5)';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Alveolar + Capillary Walls (${(thick * 0.5).toFixed(1)} μm)`, W / 2, mTop + (mBot - mTop) / 2 + 3);

      // Capillary
      const capGrad = ctx.createLinearGradient(0, capTop, 0, capTop + 70);
      capGrad.addColorStop(0, 'rgba(239,68,68,0.15)');
      capGrad.addColorStop(1, 'rgba(59,130,246,0.15)');
      ctx.fillStyle = capGrad;
      ctx.fillRect(0, capTop, W, 75);
      ctx.strokeStyle = 'rgba(239,68,68,0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, capTop, W, 75);

      // Red blood cells moving
      rbcs.forEach(rbc => {
        rbc.x += rbc.speed;
        if (rbc.x > W + 40) rbc.x = -40;
        ctx.save();
        ctx.translate(rbc.x, capTop + 37);
        const saturation = Math.min(1, particleRate / 8);
        const r = Math.round(180 + saturation * 75);
        const g = Math.round(40 + (1 - saturation) * 40);
        ctx.fillStyle = `rgba(${r},${g},60,0.85)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // O₂ particles moving from alveolus to blood
      frameCount++;
      if (frameCount % Math.max(2, Math.round(12 / particleRate)) === 0) {
        const side = Math.random() > 0.5 ? 1 : -1;
        o2particles.push({ x: W / 2 + (Math.random() - 0.5) * 100, y: mTop - 15, vy: 1.5 + Math.random(), age: 0, maxAge: 50 + Math.floor(Math.random() * 20), side });
      }

      // CO₂ particles moving from blood to alveolus
      if (frameCount % 18 === 0) {
        co2particles.push({ x: W / 2 + (Math.random() - 0.5) * 80, y: capTop + 20, vy: -(1.2 + Math.random()), age: 0, maxAge: 55, side: Math.random() > 0.5 ? 1 : -1 });
      }

      // Draw + update O₂ particles
      for (let i = o2particles.length - 1; i >= 0; i--) {
        const p = o2particles[i];
        p.y += p.vy;
        p.age++;
        const alpha = Math.min(1, p.age / 10) * Math.max(0, 1 - p.age / p.maxAge);
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(p.age * 0.2) * 3, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${alpha})`;
        ctx.fill();
        // O₂ label
        if (p.age > 5 && p.age < 15) {
          ctx.fillStyle = `rgba(56,189,248,${alpha * 0.8})`;
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('O₂', p.x + Math.sin(p.age * 0.2) * 3, p.y - 6);
        }
        if (p.age >= p.maxAge) o2particles.splice(i, 1);
      }

      // Draw + update CO₂ particles
      for (let i = co2particles.length - 1; i >= 0; i--) {
        const p = co2particles[i];
        p.y += p.vy;
        p.age++;
        const alpha = Math.min(1, p.age / 8) * Math.max(0, 1 - p.age / p.maxAge);
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(p.age * 0.18) * 2, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252,165,165,${alpha})`;
        ctx.fill();
        if (p.age > 4 && p.age < 14) {
          ctx.fillStyle = `rgba(252,165,165,${alpha * 0.8})`;
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('CO₂', p.x + Math.cos(p.age * 0.18) * 2, p.y - 6);
        }
        if (p.age >= p.maxAge) co2particles.splice(i, 1);
      }

      // Diffusion arrows
      const arrowAlpha = Math.min(0.8, diffusionRate * 0.6);
      ctx.strokeStyle = `rgba(56,189,248,${arrowAlpha})`;
      ctx.fillStyle = `rgba(56,189,248,${arrowAlpha})`;
      ctx.lineWidth = 2;
      // O₂ arrow down
      ctx.beginPath();
      ctx.moveTo(W * 0.75, mTop - 10);
      ctx.lineTo(W * 0.75, mBot + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W * 0.75 - 6, mBot + 4);
      ctx.lineTo(W * 0.75, mBot + 12);
      ctx.lineTo(W * 0.75 + 6, mBot + 4);
      ctx.fill();
      ctx.fillStyle = `rgba(56,189,248,${arrowAlpha})`;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('O₂ →', W * 0.77, mTop + (mBot - mTop) / 2 + 3);

      // CO₂ arrow up
      ctx.strokeStyle = `rgba(252,165,165,0.6)`;
      ctx.fillStyle = `rgba(252,165,165,0.6)`;
      ctx.beginPath();
      ctx.moveTo(W * 0.25, mBot + 10);
      ctx.lineTo(W * 0.25, mTop - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W * 0.25 - 6, mTop - 4);
      ctx.lineTo(W * 0.25, mTop - 12);
      ctx.lineTo(W * 0.25 + 6, mTop - 4);
      ctx.fill();
      ctx.fillStyle = `rgba(252,165,165,0.6)`;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('CO₂ ←', W * 0.23, mTop + (mBot - mTop) / 2 + 3);

      // Capillary blood flow label
      ctx.fillStyle = 'rgba(239,68,68,0.6)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Blood Capillary — pO₂ LOW`, W / 2, capTop + 65);

      // Condition note
      if (note) {
        ctx.fillStyle = showCondition === 'fibrosis' ? 'rgba(168,85,247,0.9)' : 'rgba(239,68,68,0.9)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(note, W / 2, H - 8);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [o2Gradient, sa, thick, showCondition, particleRate, note]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr,0.85fr]">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Live Gas Exchange Simulation</div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {(['normal', 'emphysema', 'fibrosis'] as const).map(c => (
            <button
              key={c}
              onClick={() => setShowCondition(c)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${showCondition === c ? (c === 'normal' ? 'bg-cyan-500 text-black' : c === 'emphysema' ? 'bg-red-500 text-white' : 'bg-purple-500 text-white') : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <canvas ref={canvasRef} width={340} height={215} className="w-full rounded-xl bg-[#05070a]" />
        {showCondition !== 'normal' && (
          <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${showCondition === 'emphysema' ? 'border-red-500/30 bg-red-500/8 text-red-300' : 'border-purple-500/30 bg-purple-500/8 text-purple-300'}`}>
            {showCondition === 'emphysema'
              ? '⚠ Emphysema (often from smoking): alveolar walls destroyed, massive reduction in surface area. Fick\'s Law predicts severely reduced gas exchange rate.'
              : '⚠ Pulmonary Fibrosis: scar tissue thickens the alveolar membrane. Longer diffusion distance drastically slows O₂ and CO₂ exchange.'
            }
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Adjust Variables</div>
          {showCondition === 'normal' && (
            <>
              <StemSlider label="O₂ Concentration Gradient" value={o2Gradient} min={10} max={100} color="cyan" onChange={setO2Gradient} />
              <StemSlider label="Functional Surface Area" value={surfaceArea} min={10} max={100} unit="%" color="green" onChange={setSurfaceArea} />
              <StemSlider label="Membrane Thickness" value={thickness} min={1} max={10} color="orange" onChange={setThickness} />
            </>
          )}
          {showCondition !== 'normal' && (
            <p className="text-xs text-slate-400">Condition parameters are fixed to simulate disease state. Switch to "normal" to adjust.</p>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Fick's Law Live Output</div>
          <div className="text-3xl font-mono font-black text-white mb-1">{diffusionRate.toFixed(2)}</div>
          <div className="text-xs text-slate-500 mb-3">relative diffusion rate</div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: diffusionRate > 1 ? '#22c55e' : diffusionRate > 0.5 ? '#f59e0b' : '#ef4444' }}
              animate={{ width: `${Math.min(100, diffusionRate * 35)}%` }}
              transition={{ type: 'spring', stiffness: 80 }}
            />
          </div>
          <div className="mt-3 text-[10px] font-mono text-slate-400 font-bold">
            Rate ∝ (SA × ΔConc) ÷ Thickness
          </div>
        </div>

        {/* 4 Alveolar Adaptations */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Alveolar Adaptations</div>
          <div className="space-y-2 text-xs text-slate-300">
            {[
              { label: 'Large surface area', desc: '~70 m² — millions of alveoli', color: '#22c55e' },
              { label: 'One-cell-thick walls', desc: 'Minimal diffusion distance (~0.5 μm)', color: '#38bdf8' },
              { label: 'Moist lining', desc: 'Gases dissolve before diffusing', color: '#a78bfa' },
              { label: 'Dense capillary network', desc: 'Maintains steep gradient via blood flow', color: '#f97316' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-white">{item.label}</span>
                <span className="text-slate-500">— {item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Haemoglobin / O2 Dissociation Curve
function HaemoglobinModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pH, setPH] = useState(74); // × 0.01 + 7
  const [temperature, setTemperature] = useState(37);
  const [highlight, setHighlight] = useState<'lungs' | 'tissue' | null>(null);

  const actualPH = pH / 100 + 7.0;
  const bohrShift = (7.4 - actualPH) * 20; // shift right when pH drops
  const tempShift = (temperature - 37) * 1.5;
  const totalShift = bohrShift + tempShift;

  const getSaturation = (pO2: number) => {
    // Hill equation approximation with shift
    const p50 = 26.8 + totalShift;
    const h = 2.7;
    const sat = (pO2 ** h) / (p50 ** h + pO2 ** h);
    return Math.min(1, Math.max(0, sat));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const padL = 50, padR = 20, padT = 20, padB = 40;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i / 4) * plotH;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace'; ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 25}%`, padL - 5, y + 3);
    }
    for (let i = 0; i <= 5; i++) {
      const x = padL + (i / 5) * plotW;
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`${i * 20}`, x, padT + plotH + 14);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('pO₂ (mmHg)', padL + plotW / 2, H - 5);
    ctx.save();
    ctx.translate(12, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Haemoglobin Saturation (%)', 0, 0);
    ctx.restore();

    // Normal curve (pH 7.4, 37°C) as reference
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let px = 0; px <= 100; px++) {
      const p50ref = 26.8, h = 2.7;
      const sat = (px ** h) / (p50ref ** h + px ** h);
      const cx = padL + (px / 100) * plotW;
      const cy = padT + (1 - sat) * plotH;
      if (px === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Normal (pH 7.4, 37°C)', padL + 5, padT + 35);

    // Current curve
    const curveColor = totalShift > 2 ? '#f97316' : totalShift < -2 ? '#38bdf8' : '#ef4444';
    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= 100; px++) {
      const sat = getSaturation(px);
      const cx = padL + (px / 100) * plotW;
      const cy = padT + (1 - sat) * plotH;
      if (px === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Lungs zone (pO₂ ~100 mmHg)
    const lungX = padL + (100 / 100) * plotW;
    const lungSat = getSaturation(100);
    const lungY = padT + (1 - lungSat) * plotH;
    ctx.fillStyle = 'rgba(56,189,248,0.15)';
    ctx.fillRect(padL + 0.75 * plotW, padT, 0.2 * plotW, plotH);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Lungs', padL + 0.85 * plotW, padT + 12);
    ctx.beginPath(); ctx.arc(lungX - 5, lungY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8'; ctx.fill();

    // Tissue zone (pO₂ ~40 mmHg)
    const tissueX = padL + (40 / 100) * plotW;
    const tissueSat = getSaturation(40);
    const tissueY = padT + (1 - tissueSat) * plotH;
    ctx.fillStyle = 'rgba(249,115,22,0.12)';
    ctx.fillRect(padL + 0.25 * plotW, padT, 0.2 * plotW, plotH);
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Tissues', padL + 0.35 * plotW, padT + 12);
    ctx.beginPath(); ctx.arc(tissueX + 5, tissueY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316'; ctx.fill();

    // O₂ released at tissues
    const release = getSaturation(100) - getSaturation(40);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(tissueX + 5, tissueY);
    ctx.lineTo(lungX - 5, tissueY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`O₂ unloaded: ${Math.round(release * 100)}%`, padL + 0.6 * plotW, tissueY - 8);

    // Shift label
    if (Math.abs(totalShift) > 1) {
      ctx.fillStyle = totalShift > 0 ? '#f97316' : '#38bdf8';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(totalShift > 0 ? '→ Bohr shift (right) — better O₂ delivery' : '← Left shift — stronger O₂ binding', padL + plotW / 2, padT + plotH - 5);
    }
  }, [pH, temperature, totalShift]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">O₂ Dissociation Curve (interactive)</div>
        <canvas ref={canvasRef} width={380} height={280} className="w-full rounded-xl bg-[#05070a]" />
        <div className="mt-3 flex gap-4 text-[10px] justify-center">
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-white/20" style={{ borderTop: '2px dashed rgba(255,255,255,0.3)' }} /><span className="text-slate-500">Normal</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-red-500" /><span className="text-slate-400">Current</span></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <StemSlider label="Blood pH" value={pH} min={65} max={80} step={1} unit="" color="cyan" onChange={setPH}
          />
          <div className="text-center font-mono text-2xl font-bold text-white">{actualPH.toFixed(2)}</div>
          <StemSlider label="Temperature" value={temperature} min={30} max={42} unit="°C" color="orange" onChange={setTemperature} />
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Bohr Effect</div>
          <p className="text-xs text-slate-300 leading-relaxed">Active muscles produce more CO₂, lowering blood pH. Lower pH <span className="text-orange-400 font-bold">reduces Hb's affinity</span> for O₂ — the curve shifts RIGHT, delivering more O₂ where it's needed most.</p>
          <div className="bg-black/40 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Hb reaction</div>
            <div className="font-mono text-xs text-white">HbO₈ + H⁺ ⇌ HHb + O₂</div>
            <div className="text-[10px] text-slate-500 mt-1">Low pH → reaction shifts right → O₂ released</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fick's Law Interactive
function FicksLaw() {
  const [sa, setSA] = useState(70);
  const [cd, setCD] = useState(65);
  const [thick, setThick] = useState(3);

  const rate = ((sa / 100) * (cd / 100)) / Math.max(0.2, thick / 5);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Fick's Law of Diffusion</div>
        <div className="bg-[#0a0a1a] border border-slate-700 rounded-2xl p-6 flex flex-col items-center mb-5">
          <div className="text-base font-mono text-white flex items-center gap-3 flex-wrap justify-center">
            <span>Rate</span><span className="text-slate-500">∝</span>
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-slate-500 pb-1 text-sm">Surface Area × Concentration Difference</span>
              <span className="pt-1 text-sm">Thickness of Membrane</span>
            </div>
          </div>
          <div className="mt-5 text-4xl font-mono font-black" style={{ color: rate > 1 ? '#22c55e' : rate > 0.4 ? '#f59e0b' : '#ef4444' }}>
            {rate.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">relative diffusion rate</div>
        </div>

        <div className="space-y-4">
          <StemSlider label="Surface Area" value={sa} min={5} max={100} unit="%" color="green" onChange={setSA} />
          <StemSlider label="Concentration Difference" value={cd} min={5} max={100} unit="%" color="cyan" onChange={setCD} />
          <StemSlider label="Membrane Thickness" value={thick} min={1} max={15} color="orange" onChange={setThick} />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Maximise Surface Area', icon: '⬆️', title: 'Alveoli — 70 m²', desc: 'Millions of tiny alveoli create the surface area of a tennis court. More area = more parallel diffusion pathways.', color: '#22c55e' },
          { label: 'Maximise Gradient', icon: '⬆️', title: 'Ventilation + Blood Flow', desc: 'Breathing replaces O₂-depleted air. Continuous blood flow removes O₂-rich blood. Both maintain a steep gradient.', color: '#38bdf8' },
          { label: 'Minimise Thickness', icon: '⬇️', title: 'One-cell-thick walls', desc: 'Alveolar and capillary walls each just one cell thick (~0.5 μm each). Total diffusion distance ~1 μm.', color: '#f97316' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color }} />
              <span className="text-xs font-bold" style={{ color: card.color }}>{card.title}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}

        <div className="rounded-[1.5rem] border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-2">Clinical Connection</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-red-400 font-bold">Emphysema</span>: SA ↓↓ (broken alveolar walls)<br />
            <span className="text-purple-400 font-bold">Fibrosis</span>: Thickness ↑↑ (scarring)<br />
            Both dramatically reduce the diffusion rate per Fick's Law.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GasExchange() {
  const [module, setModule] = useState<Module>('alveoli');

  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-light text-white">🫁 Gas Exchange</h3>
          <p className="text-xs text-slate-500 mt-1">Alveoli, haemoglobin transport, and Fick's Law — interactive simulations</p>
        </div>
        <ModuleTabs tabs={TABS} active={module} onChange={setModule} accentColor="cyan" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={module} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
          {module === 'alveoli' && <AlveoliSimulation />}
          {module === 'haemoglobin' && <HaemoglobinModule />}
          {module === 'fick' && <FicksLaw />}
          {module === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Gas Exchange Quiz" /></div>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}