import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Eye, GraduationCap, Target, BookOpen, Beaker, Layers } from 'lucide-react';

type ViewMode = 'explore' | 'quiz' | 'learn';

const LEVELS = [
  {
    id: 'cell',
    name: 'Cell',
    desc: 'The basic building block of life. All living things are made of one or more cells.',
    examples: ['Red blood cell', 'Neuron', 'Muscle cell', 'E. coli bacterium'],
    keyFact: 'Cells are the smallest unit of life that can function independently.',
    realWorld: 'Stem cells can become any type of cell in the body.',
    size: '~10 μm (animal cells)',
    color: '#ec4899',
    glowColor: 'rgba(236,72,153,0.3)',
  },
  {
    id: 'tissue',
    name: 'Tissue',
    desc: 'A group of similar cells working together to perform a specific function.',
    examples: ['Muscle tissue', 'Nerve tissue', 'Epithelial tissue', 'Connective tissue'],
    keyFact: 'Tissues form when cells of the same type group together and specialize.',
    realWorld: 'Cancer occurs when tissue cells divide uncontrollably.',
    size: 'mm to cm scale',
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.3)',
  },
  {
    id: 'organ',
    name: 'Organ',
    desc: 'Different tissues combine to perform a specific function. An organ contains multiple tissue types.',
    examples: ['Heart', 'Lungs', 'Brain', 'Stomach'],
    keyFact: 'Each organ is made of 2+ tissue types working together.',
    realWorld: 'Organ transplants save lives by replacing failed organs.',
    size: 'cm scale',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
  },
  {
    id: 'system',
    name: 'Organ System',
    desc: 'Multiple organs working in coordination to perform complex life functions.',
    examples: ['Circulatory system', 'Nervous system', 'Respiratory system', 'Digestive system'],
    keyFact: 'The human body has 11 organ systems working together.',
    realWorld: 'Diabetes affects multiple organ systems simultaneously.',
    size: 'body-scale',
    color: '#22d3ee',
    glowColor: 'rgba(34,211,238,0.3)',
  },
  {
    id: 'organism',
    name: 'Organism',
    desc: 'The complete living being. All systems work together to maintain homeostasis.',
    examples: ['Human', 'Oak tree', 'E. coli', 'Mushroom'],
    keyFact: 'An organism can be unicellular (one cell) or multicellular (many cells).',
    realWorld: 'Humans are complex multicellular organisms with 37+ trillion cells.',
    size: 'varies enormously',
    color: '#22d3ee',
    glowColor: 'rgba(34,211,238,0.3)',
  },
];

// Cell level: Canvas-based animated cell with organelles
function CellVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  interface Organelle {
    x: number; y: number; vx: number; vy: number;
    type: 'mito' | 'ribosome' | 'er' | 'golgi' | 'vacuole';
    size: number; angle: number;
  }

  const organelles = useRef<Organelle[]>([]);

  useEffect(() => {
    organelles.current = [];
    // Mitochondria
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
      organelles.current.push({
        x: 100 + Math.cos(angle) * (30 + Math.random() * 25),
        y: 100 + Math.sin(angle) * (25 + Math.random() * 20),
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        type: 'mito', size: 12 + Math.random() * 6, angle: Math.random() * Math.PI,
      });
    }
    // Ribosomes
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 50;
      organelles.current.push({
        x: 100 + Math.cos(angle) * dist,
        y: 100 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        type: 'ribosome', size: 3, angle: 0,
      });
    }
    // ER segments
    for (let i = 0; i < 3; i++) {
      organelles.current.push({
        x: 80 + Math.random() * 40, y: 115 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
        type: 'er', size: 25, angle: Math.random() * Math.PI,
      });
    }

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, 200, 200);

      // Cell membrane - animated blob shape
      ctx.save();
      ctx.translate(100, 100);
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const wobble = Math.sin(a * 3 + t * 1.5) * 4 + Math.sin(a * 5 + t * 0.8) * 2;
        const r = 72 + wobble;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * (r * 0.85);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Membrane fill
      const memGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 80);
      memGrad.addColorStop(0, 'rgba(236, 72, 153, 0.08)');
      memGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.15)');
      memGrad.addColorStop(1, 'rgba(236, 72, 153, 0.25)');
      ctx.fillStyle = memGrad;
      ctx.fill();

      // Phospholipid bilayer membrane stroke
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Second membrane line
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const wobble = Math.sin(a * 3 + t * 1.5) * 4 + Math.sin(a * 5 + t * 0.8) * 2;
        const r = 68 + wobble;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * (r * 0.85);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Nucleus
      const nucX = 100, nucY = 92;
      const nucR = 24 + Math.sin(t * 0.7) * 1.5;
      ctx.beginPath();
      ctx.arc(nucX, nucY, nucR, 0, Math.PI * 2);
      const nucGrad = ctx.createRadialGradient(nucX - 5, nucY - 5, 5, nucX, nucY, nucR);
      nucGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
      nucGrad.addColorStop(1, 'rgba(168, 85, 247, 0.12)');
      ctx.fillStyle = nucGrad;
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Nuclear pores
      for (let i = 0; i < 6; i++) {
        const poreAngle = (i / 6) * Math.PI * 2 + t * 0.2;
        const px = nucX + Math.cos(poreAngle) * nucR;
        const py = nucY + Math.sin(poreAngle) * nucR;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#c084fc';
        ctx.fill();
      }

      // Nucleolus
      ctx.beginPath();
      ctx.arc(nucX + 5, nucY - 3, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.fill();

      // Chromatin strands inside nucleus
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const startA = (i / 3) * Math.PI * 2;
        for (let j = 0; j < 20; j++) {
          const pt = j / 20;
          const px = nucX + Math.cos(startA + pt * 4 + t * 0.3) * (nucR * 0.7 * pt);
          const py = nucY + Math.sin(startA + pt * 3 + t * 0.5) * (nucR * 0.5 * pt);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Update and draw organelles
      organelles.current.forEach(org => {
        // Drift
        org.x += org.vx;
        org.y += org.vy;
        // Stay within cell bounds
        const dx = org.x - 100, dy = org.y - 100;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 60) {
          org.vx -= dx * 0.005;
          org.vy -= dy * 0.005;
        }
        // Avoid nucleus
        const ndx = org.x - nucX, ndy = org.y - nucY;
        const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
        if (ndist < 30 && org.type !== 'ribosome') {
          org.vx += ndx * 0.01;
          org.vy += ndy * 0.01;
        }
        org.vx += (Math.random() - 0.5) * 0.05;
        org.vy += (Math.random() - 0.5) * 0.05;
        org.vx *= 0.98;
        org.vy *= 0.98;

        if (org.type === 'mito') {
          ctx.save();
          ctx.translate(org.x, org.y);
          ctx.rotate(org.angle + t * 0.1);
          // Outer membrane
          ctx.beginPath();
          ctx.ellipse(0, 0, org.size, org.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Cristae folds
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
          ctx.lineWidth = 1;
          for (let c = 0; c < 3; c++) {
            ctx.beginPath();
            const cx = -org.size * 0.5 + c * (org.size * 0.4);
            ctx.moveTo(cx, -org.size * 0.35);
            ctx.quadraticCurveTo(cx + 3, 0, cx, org.size * 0.35);
            ctx.stroke();
          }
          ctx.restore();
        } else if (org.type === 'ribosome') {
          ctx.beginPath();
          ctx.arc(org.x, org.y, org.size, 0, Math.PI * 2);
          ctx.fillStyle = '#22d3ee';
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (org.type === 'er') {
          ctx.save();
          ctx.translate(org.x, org.y);
          ctx.rotate(org.angle);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let s = 0; s < 3; s++) {
            const sy = -8 + s * 8;
            ctx.moveTo(-org.size * 0.5, sy);
            ctx.quadraticCurveTo(-org.size * 0.2, sy + 5 + Math.sin(t + s) * 2, 0, sy);
            ctx.quadraticCurveTo(org.size * 0.2, sy - 5 + Math.cos(t + s) * 2, org.size * 0.5, sy);
          }
          ctx.stroke();
          ctx.restore();
        }
      });

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NUCLEUS', nucX, nucY + nucR + 12);
      ctx.fillText('CYTOPLASM', 50, 175);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return <canvas ref={canvasRef} width={200} height={200} className="rounded-xl" />;
}

// Tissue: Canvas with connected pulsing cells
function TissueVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, 200, 200);

      const cols = 4, rows = 4;
      const cellW = 40, cellH = 40;
      const startX = 20, startY = 20;

      // Draw connections first (gap junctions)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = startX + c * cellW + cellW / 2;
          const cy = startY + r * cellH + cellH / 2;
          if (c < cols - 1) {
            ctx.beginPath();
            ctx.moveTo(cx + 14, cy);
            ctx.lineTo(cx + cellW - 14, cy);
            ctx.stroke();
          }
          if (r < rows - 1) {
            ctx.beginPath();
            ctx.moveTo(cx, cy + 14);
            ctx.lineTo(cx, cy + cellH - 14);
            ctx.stroke();
          }
        }
      }

      // Draw cells with synchronized pulse
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const cx = startX + c * cellW + cellW / 2;
          const cy = startY + r * cellH + cellH / 2;
          const wave = Math.sin(t * 2 - (r + c) * 0.5) * 0.15 + 1;
          const pulse = Math.sin(t * 3 + idx * 0.3) * 0.1 + 0.9;

          // Cell body
          ctx.beginPath();
          const cellR = 13 * wave * pulse;
          // Slightly irregular shape
          for (let i = 0; i <= 30; i++) {
            const a = (i / 30) * Math.PI * 2;
            const wobble = Math.sin(a * 4 + t * 2 + idx) * 1.5;
            const pr = cellR + wobble;
            const px = cx + Math.cos(a) * pr;
            const py = cy + Math.sin(a) * pr;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          const alpha = 0.15 + Math.sin(t * 2 - (r + c) * 0.5) * 0.08;
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 + pulse * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Nucleus dot
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(192, 132, 252, ${0.4 + pulse * 0.2})`;
          ctx.fill();
        }
      }

      // Signal wave visualization
      const waveX = (t * 40) % 220;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(waveX, 20);
      ctx.lineTo(waveX, 180);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SYNCHRONIZED CELLS', 100, 195);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return <canvas ref={canvasRef} width={200} height={200} className="rounded-xl" />;
}

// Organ: Animated SVG heart with pumping
function OrganVisual() {
  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center">
      <motion.svg
        viewBox="0 0 200 200"
        width={180}
        height={180}
        animate={{ scale: [1, 1.06, 1, 1.04, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <radialGradient id="heartGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          <filter id="heartGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Heart shape */}
        <motion.path
          d="M100 170 C30 120 5 80 30 50 C50 25 80 30 100 60 C120 30 150 25 170 50 C195 80 170 120 100 170Z"
          fill="url(#heartGrad)"
          stroke="#f87171"
          strokeWidth="2"
          filter="url(#heartGlow)"
        />

        {/* Internal chambers - atria */}
        <path
          d="M85 85 Q100 70 115 85"
          fill="none"
          stroke="rgba(220,38,38,0.4)"
          strokeWidth="1.5"
        />

        {/* Septum */}
        <line
          x1="100" y1="65" x2="100" y2="140"
          stroke="rgba(220,38,38,0.3)"
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Ventricle lines */}
        <path
          d="M85 100 Q90 130 100 145"
          fill="none"
          stroke="rgba(220,38,38,0.3)"
          strokeWidth="1.5"
        />
        <path
          d="M115 100 Q110 130 100 145"
          fill="none"
          stroke="rgba(220,38,38,0.3)"
          strokeWidth="1.5"
        />

        {/* Blood vessels - aorta */}
        <motion.path
          d="M100 60 Q100 35 120 25"
          fill="none"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ strokeWidth: [4, 5, 4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {/* Pulmonary artery */}
        <motion.path
          d="M85 58 Q80 35 60 30"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ strokeWidth: [3, 4, 3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        />

        {/* Pulmonary veins */}
        <path
          d="M115 58 Q120 40 140 35"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.7}
        />

        {/* Vena cava */}
        <path
          d="M90 63 Q85 40 75 28"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* Blood flow particles */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.circle
            key={`blood-${i}`}
            r="2.5"
            fill="#ef4444"
            animate={{
              cx: [90 - i * 3, 95, 100, 110, 120 + i * 2],
              cy: [100, 85, 60, 40, 25 - i * 3],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'linear',
            }}
          />
        ))}

        {/* Tissue labels */}
        <text x="70" y="110" fontSize="6" fill="rgba(255,255,255,0.3)" fontFamily="monospace">Muscle</text>
        <text x="108" y="95" fontSize="6" fill="rgba(255,255,255,0.3)" fontFamily="monospace">Nerve</text>
        <text x="75" y="78" fontSize="6" fill="rgba(255,255,255,0.3)" fontFamily="monospace">Epithelial</text>
      </motion.svg>

      {/* Pulse ring effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-red-500/20"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  );
}

// Organ System: Animated circulatory system diagram
function SystemVisual() {
  return (
    <div className="relative w-[200px] h-[200px]">
      <svg viewBox="0 0 200 200" width={200} height={200}>
        <defs>
          <linearGradient id="arteryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="veinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </linearGradient>
        </defs>

        {/* Body outline */}
        <ellipse cx="100" cy="100" rx="80" ry="90" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Heart center */}
        <motion.path
          d="M100 85 C90 80 82 82 85 90 C88 95 94 98 100 105 C106 98 112 95 115 90 C118 82 110 80 100 85Z"
          fill="#ef4444"
          stroke="#f87171"
          strokeWidth="1"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ transformOrigin: '100px 93px' }}
        />

        {/* Arteries - red/oxygenated */}
        <motion.path
          d="M100 85 Q100 60 85 40"
          fill="none" stroke="url(#arteryGrad)" strokeWidth="3" strokeLinecap="round"
          animate={{ strokeWidth: [3, 3.5, 3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <path d="M85 40 Q70 25 60 35" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
        <path d="M85 40 Q90 25 100 20" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
        <path d="M100 85 Q100 60 115 40" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity={0.8} />

        {/* Downward arteries */}
        <motion.path
          d="M100 105 Q100 130 90 155"
          fill="none" stroke="url(#arteryGrad)" strokeWidth="3" strokeLinecap="round"
          animate={{ strokeWidth: [3, 3.5, 3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <path d="M90 155 Q85 170 75 180" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.7} />
        <path d="M100 105 Q110 130 110 155" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity={0.8} />
        <path d="M110 155 Q115 170 125 180" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.7} />

        {/* Veins - blue/deoxygenated */}
        <path d="M55 45 Q65 55 80 70 Q90 80 95 88" fill="none" stroke="url(#veinGrad)" strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
        <path d="M145 45 Q135 55 120 70 Q110 80 105 88" fill="none" stroke="url(#veinGrad)" strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
        <path d="M70 185 Q80 170 88 150 Q95 130 98 108" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
        <path d="M130 185 Q120 170 112 150 Q105 130 102 108" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity={0.6} />

        {/* Capillary beds */}
        {[
          { cx: 55, cy: 40 }, { cx: 145, cy: 40 },
          { cx: 70, cy: 185 }, { cx: 130, cy: 185 },
          { cx: 40, cy: 100 }, { cx: 160, cy: 100 },
        ].map((pos, i) => (
          <motion.circle
            key={`cap-${i}`}
            cx={pos.cx} cy={pos.cy} r={6}
            fill="none"
            stroke={i < 2 ? '#ef4444' : '#3b82f6'}
            strokeWidth={1}
            opacity={0.4}
            animate={{ r: [5, 7, 5], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Organ labels */}
        <text x="100" y="15" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="monospace">BRAIN</text>
        <text x="35" y="103" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="monospace">LUNGS</text>
        <text x="165" y="103" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="monospace">KIDNEYS</text>

        {/* Flowing blood particles */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.circle
            key={`flow-${i}`}
            r="2"
            fill={i < 3 ? '#ef4444' : '#60a5fa'}
            animate={i < 3 ? {
              cx: [100, 95, 90, 85, 80, 70, 60],
              cy: [85, 70, 55, 45, 40, 38, 40],
              opacity: [0, 1, 1, 1, 1, 0.5, 0],
            } : {
              cx: [60, 70, 80, 88, 95, 98],
              cy: [45, 55, 65, 75, 82, 90],
              opacity: [0, 0.5, 1, 1, 1, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  );
}

// Organism: Human silhouette with glowing systems
function OrganismVisual() {
  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center">
      <svg viewBox="0 0 200 200" width={200} height={200}>
        <defs>
          <radialGradient id="bodyGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.15)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </radialGradient>
        </defs>

        {/* Aura glow */}
        <ellipse cx="100" cy="110" rx="55" ry="75" fill="url(#bodyGlow)" />

        {/* Head */}
        <motion.circle
          cx="100" cy="42" r="18"
          fill="rgba(34,211,238,0.1)"
          stroke="#22d3ee"
          strokeWidth="1.5"
          animate={{ strokeOpacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Torso */}
        <motion.path
          d="M82 60 L78 130 L98 145 L100 145 L102 145 L122 130 L118 60 Z"
          fill="rgba(34,211,238,0.06)"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeLinejoin="round"
          animate={{ strokeOpacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />

        {/* Arms */}
        <path d="M82 65 L55 100 L50 125" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
        <path d="M118 65 L145 100 L150 125" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />

        {/* Legs */}
        <path d="M90 140 L82 190" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
        <path d="M110 140 L118 190" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />

        {/* Internal systems highlights */}
        {/* Brain */}
        <motion.circle
          cx="100" cy="38" r="8"
          fill="rgba(168,85,247,0.2)"
          stroke="#a855f7"
          strokeWidth="1"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Heart */}
        <motion.path
          d="M100 82 C96 79 93 80 94 84 C95 87 98 88 100 92 C102 88 105 87 106 84 C107 80 104 79 100 82Z"
          fill="#ef4444"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ transformOrigin: '100px 86px' }}
        />

        {/* Lungs */}
        <ellipse cx="90" cy="86" rx="8" ry="12" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="0.8" opacity={0.5} />
        <ellipse cx="110" cy="86" rx="8" ry="12" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="0.8" opacity={0.5} />

        {/* Digestive */}
        <motion.path
          d="M96 100 Q94 110 96 118 Q98 125 100 130"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1"
          opacity={0.4}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />

        {/* Energy pulse */}
        <motion.ellipse
          cx="100" cy="100"
          rx="40" ry="60"
          fill="none"
          stroke="rgba(34,211,238,0.15)"
          strokeWidth="1"
          animate={{ rx: [40, 50, 40], ry: [60, 70, 60], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* System labels */}
        <text x="100" y="10" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="monospace">HOMEOSTASIS</text>
      </svg>
    </div>
  );
}

export default function LevelsOfOrg() {
  const [level, setLevel] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const currentLevel = LEVELS[level];

  const renderVisual = () => {
    switch (currentLevel.id) {
      case 'cell': return <CellVisual />;
      case 'tissue': return <TissueVisual />;
      case 'organ': return <OrganVisual />;
      case 'system': return <SystemVisual />;
      case 'organism': return <OrganismVisual />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 relative">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button
          onClick={() => setViewMode('explore')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={14} />
          Explore
        </button>
        <button
          onClick={() => setViewMode('learn')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap size={14} />
          Learn
        </button>
      </div>

      <div className="flex items-center justify-between w-full max-w-3xl mb-12 relative px-8">
        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>
        <motion.div
          className="absolute top-1/2 left-10 h-0.5 bg-brand-accent -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(level / (LEVELS.length - 1)) * 100}%` }}
        ></motion.div>

        {LEVELS.map((lvl, idx) => (
          <button
            key={lvl.id}
            onClick={() => setLevel(idx)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-xs font-bold ${
              idx <= level
                ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                : 'bg-slate-900 border-2 border-slate-700 text-slate-500'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center flex-1 w-full relative pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            {/* Animated visual with glow */}
            <div
              className="relative flex items-center justify-center rounded-2xl p-4"
              style={{
                boxShadow: `0 0 60px ${currentLevel.glowColor}, 0 0 120px ${currentLevel.glowColor}`,
                background: `radial-gradient(circle, ${currentLevel.glowColor} 0%, transparent 70%)`,
              }}
            >
              {renderVisual()}
            </div>

            <div className="mt-8 text-center max-w-md">
              <h3 className="text-3xl font-light text-white mb-2">{currentLevel.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{currentLevel.desc}</p>
            </div>

            {viewMode === 'learn' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 w-full max-w-md space-y-3"
              >
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={14} className="text-brand-accent" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Fact</span>
                  </div>
                  <p className="text-slate-300 text-sm">{currentLevel.keyFact}</p>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={14} className="text-green-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real World</span>
                  </div>
                  <p className="text-slate-300 text-sm">{currentLevel.realWorld}</p>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Beaker size={14} className="text-orange-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Examples</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentLevel.examples.map((ex, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={14} className="text-cyan-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scale</span>
                  </div>
                  <p className="text-slate-300 text-sm font-mono">{currentLevel.size}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 right-4 flex gap-3">
          {level > 0 && (
            <button
              onClick={() => setLevel(l => l - 1)}
              className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              {LEVELS[level - 1].name}
            </button>
          )}
          {level < LEVELS.length - 1 && (
            <button
              onClick={() => setLevel(l => l + 1)}
              className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              {LEVELS[level + 1].name}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
