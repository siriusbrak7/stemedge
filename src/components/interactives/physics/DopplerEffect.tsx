import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import StemSlider from '../shared/StemSlider';

type ViewMode = 'acoustics' | 'cosmology' | 'boom' | 'quiz';

const TABS = [
  { id: 'acoustics' as ViewMode, label: 'Acoustics', icon: '🔊' },
  { id: 'cosmology' as ViewMode, label: 'Cosmology', icon: '🌌' },
  { id: 'boom' as ViewMode, label: 'Sonic Boom', icon: '✈️' },
  { id: 'quiz' as ViewMode, label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'de1', question: 'An ambulance siren sounds higher as it approaches because:', type: 'multiple-choice', options: ['The driver turns up the volume', 'Wavefronts are compressed', 'Sound travels faster', 'Air pressure increases'], correctAnswer: 'Wavefronts are compressed', explanation: 'Compressed wavefronts mean shorter wavelength and higher observed frequency.' },
  { id: 'de2', question: 'Light from receding galaxies is shifted toward:', type: 'multiple-choice', options: ['Blue', 'Red', 'Ultraviolet', 'No color'], correctAnswer: 'Red', explanation: 'Receding sources stretch light waves, increasing wavelength toward red.' },
  { id: 'de3', question: 'A Mach cone forms when:', type: 'multiple-choice', options: ['v = 0', 'v < c', 'v > c', 'frequency is zero'], correctAnswer: 'v > c', explanation: 'The source outruns its wavefronts, so they overlap into a cone.' },
];

export default function DopplerEffect() {
  const [viewMode, setViewMode] = useState<ViewMode>('acoustics');

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">⚛️ Doppler Effect</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sound, light redshift, and supersonic wavefronts</p>
        </div>
        <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor={viewMode === 'cosmology' ? 'purple' : viewMode === 'boom' ? 'orange' : 'cyan'} />
      </div>
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            {viewMode === 'acoustics' && <Acoustics />}
            {viewMode === 'cosmology' && <Cosmology />}
            {viewMode === 'boom' && <SonicBoom />}
            {viewMode === 'quiz' && <div className="max-w-xl mx-auto"><QuizMode questions={QUIZ} title="Doppler Effect Quiz" /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Acoustics() {
  const [sourceSpeed, setSourceSpeed] = useState(45);
  const [observerSpeed, setObserverSpeed] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceSpeedRef = useRef(sourceSpeed);
  const observerSpeedRef = useRef(observerSpeed);

  useEffect(() => { sourceSpeedRef.current = sourceSpeed; observerSpeedRef.current = observerSpeed; }, [sourceSpeed, observerSpeed]);
  useWaveCanvas(canvasRef, (ctx, frame) => {
    const width = 560;
    const height = 320;
    const sx = 90 + ((frame * (sourceSpeedRef.current / 100) * 1.55) % 420);
    const ox = 455 + Math.sin(frame / 80) * observerSpeedRef.current * 0.7;
    ctx.fillStyle = '#08111b';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 17; i++) {
      const age = ((frame + i * 16) % 260);
      const emitX = sx - age * (sourceSpeedRef.current / 100) * 1.55;
      const alpha = Math.max(0, 1 - age / 260);
      const grad = ctx.createRadialGradient(emitX, 155, age * 0.2, emitX, 155, age);
      grad.addColorStop(0, `rgba(34,211,238,${0.02 * alpha})`);
      grad.addColorStop(1, `rgba(34,211,238,${0.65 * alpha})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(emitX, 155, age, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawDot(ctx, sx, 155, '#f59e0b', 'S');
    drawDot(ctx, ox, 155, '#22c55e', 'O');
  });

  const relFreq = Math.max(0.35, (1 + observerSpeed / 120) / (1 - sourceSpeed / 140));

  return (
    <SimGrid>
      <CanvasCard canvasRef={canvasRef} title="Moving Source Wavefronts" />
      <ControlCard>
        <StemSlider label="Source speed" value={sourceSpeed} min={-80} max={80} unit="%" color="orange" onChange={setSourceSpeed} />
        <StemSlider label="Observer drift" value={observerSpeed} min={-60} max={60} unit="%" color="green" onChange={setObserverSpeed} />
        <Readout title="Observed frequency" value={`${relFreq.toFixed(2)}x`} tone={relFreq > 1 ? 'text-cyan-300' : 'text-red-300'} />
        <p className="text-sm text-slate-400 leading-relaxed">Wavefront spacing compresses ahead of the moving source and stretches behind it. The listener only hears a pitch shift because the arrival rate changes.</p>
      </ControlCard>
    </SimGrid>
  );
}

function Cosmology() {
  const [expansion, setExpansion] = useState(55);
  const redshift = expansion / 100;
  const wavelength = 30 + redshift * 68;
  return (
    <SimGrid>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 560 320" className="w-full rounded-2xl bg-[#080719]">
          {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={(i * 73) % 560} cy={(i * 41) % 320} r={(i % 3) + 0.7} fill="#e0e7ff" opacity="0.35" />)}
          <circle cx="100" cy="160" r="30" fill="#38bdf8" opacity="0.8" />
          <text x="100" y="210" fill="#7dd3fc" fontSize="11" textAnchor="middle">Milky Way</text>
          <motion.circle cx={395 + expansion * 0.65} cy="160" r="34" fill="#ef4444" opacity="0.7" animate={{ cx: 395 + expansion * 0.65 }} />
          <text x={395 + expansion * 0.65} y="210" fill="#fca5a5" fontSize="11" textAnchor="middle">Distant galaxy</text>
          <motion.path d={`M 134 158 ${Array.from({ length: 12 }, (_, i) => `Q ${150 + i * wavelength + wavelength / 2} ${i % 2 ? 132 : 184} ${150 + (i + 1) * wavelength} 158`).join(' ')}`}
            fill="none" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" animate={{ pathLength: [0.2, 1] }} transition={{ duration: 2.4, repeat: Infinity }} />
          <text x="280" y="55" fill="#c4b5fd" fontSize="15" textAnchor="middle" fontWeight="bold">Expanding space stretches light waves</text>
          <text x="280" y="285" fill="#fb7185" fontSize="12" textAnchor="middle">redshift z ≈ {redshift.toFixed(2)}</text>
        </svg>
      </div>
      <ControlCard>
        <StemSlider label="Expansion rate" value={expansion} min={0} max={100} unit="%" color="purple" onChange={setExpansion} />
        <Readout title="Wavelength stretch" value={`${wavelength.toFixed(0)} px`} tone="text-pink-300" />
        <p className="text-sm text-slate-400 leading-relaxed">More expansion means a larger wavelength by the time light reaches the observer. That shift toward red is the evidence used to infer cosmic expansion.</p>
      </ControlCard>
    </SimGrid>
  );
}

function SonicBoom() {
  const [mach, setMach] = useState(1.4);
  const coneAngle = Math.asin(1 / mach) * 180 / Math.PI;
  return (
    <SimGrid>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <svg viewBox="0 0 560 320" className="w-full rounded-2xl bg-[#101015]">
          <motion.g animate={{ x: [0, 18, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <polygon points="360,160 296,136 306,160 296,184" fill="#f97316" />
            <rect x="250" y="148" width="65" height="24" rx="12" fill="#fbbf24" />
            <text x="296" y="124" fill="#fed7aa" fontSize="12" textAnchor="middle">Mach {mach.toFixed(1)}</text>
          </motion.g>
          {Array.from({ length: 12 }).map((_, i) => {
            const x = 350 - i * 31 * mach;
            const r = i * 17;
            return <circle key={i} cx={x} cy="160" r={r} fill="none" stroke={mach > 1 ? '#f97316' : '#38bdf8'} strokeWidth="2" opacity={Math.max(0.12, 0.8 - i * 0.06)} />;
          })}
          {mach > 1 && (
            <g>
              <line x1="360" y1="160" x2={360 - 250} y2={160 - Math.tan(coneAngle * Math.PI / 180) * 250} stroke="#ef4444" strokeWidth="3" />
              <line x1="360" y1="160" x2={360 - 250} y2={160 + Math.tan(coneAngle * Math.PI / 180) * 250} stroke="#ef4444" strokeWidth="3" />
              <text x="160" y="50" fill="#fca5a5" fontSize="13" fontWeight="bold">Overlapping fronts form a Mach cone</text>
            </g>
          )}
          {mach <= 1 && <text x="280" y="52" fill="#7dd3fc" fontSize="13" textAnchor="middle">Subsonic: wavefronts escape ahead</text>}
        </svg>
      </div>
      <ControlCard>
        <StemSlider label="Aircraft speed" value={mach} min={0.3} max={2.4} step={0.1} unit=" Mach" color="orange" onChange={setMach} />
        <Readout title="Mach cone angle" value={mach > 1 ? `${coneAngle.toFixed(0)}°` : 'none'} tone={mach > 1 ? 'text-orange-300' : 'text-cyan-300'} />
        <p className="text-sm text-slate-400 leading-relaxed">At speeds above the wave speed, the source piles pressure waves onto one another. The cone boundary reaches listeners as a sharp pressure jump: a sonic boom.</p>
      </ControlCard>
    </SimGrid>
  );
}

function useWaveCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, draw: (ctx: CanvasRenderingContext2D, frame: number) => void) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      draw(ctx, frame);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, draw]);
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 4);
}

function SimGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.25fr,0.75fr]">{children}</div>;
}

function CanvasCard({ canvasRef, title }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; title: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">{title}</div>
      <canvas ref={canvasRef} width={560} height={320} className="w-full rounded-2xl border border-slate-800 bg-[#08111b]" />
    </div>
  );
}

function ControlCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">{children}</div>;
}

function Readout({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
      <p className="text-[10px] uppercase tracking-widest text-slate-500">{title}</p>
      <p className={`text-3xl font-mono font-bold ${tone}`}>{value}</p>
    </div>
  );
}
