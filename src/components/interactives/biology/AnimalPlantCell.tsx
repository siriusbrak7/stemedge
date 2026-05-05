import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { Eye, Layers, Target, GraduationCap, ArrowRight, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import QuizMode from '../../shared/QuizMode';

type ViewMode = 'explore' | 'compare' | 'quiz' | 'learn';

interface Organelle {
  id: string;
  cell: 'animal' | 'plant' | 'both';
  name: string;
  shortDesc: string;
  function: string;
  location: string;
  size: string;
  keyFact: string;
  color: string;
  glow: string;
}

const ORGANELLES: Organelle[] = [
  { id: 'nucleus', cell: 'both', name: 'Nucleus', shortDesc: 'Control centre — stores DNA', function: 'Stores genetic material (DNA) and controls protein synthesis and cell division via mRNA transcription.', location: 'Central in animal cells; pushed to periphery by vacuole in plant cells.', size: '5–10 μm diameter', keyFact: 'Contains the nucleolus where ribosomes are assembled.', color: '#c084fc', glow: 'rgba(192,132,252,0.5)' },
  { id: 'mitochondria', cell: 'both', name: 'Mitochondria', shortDesc: 'ATP production — cellular respiration', function: 'Produces ATP via aerobic respiration. Has its own circular DNA (evidence of endosymbiosis).', location: 'Scattered in cytoplasm; more abundant in metabolically active cells.', size: '1–10 μm long', keyFact: 'Contain their own DNA — thought to originate from ancient free-living bacteria.', color: '#f97316', glow: 'rgba(249,115,22,0.5)' },
  { id: 'ribosome', cell: 'both', name: 'Ribosomes', shortDesc: 'Protein synthesis', function: 'Translate mRNA into polypeptide chains. Found free in cytoplasm or on rough ER.', location: 'Free in cytoplasm or attached to rough ER membrane.', size: '~25 nm (too small to see under light microscope)', keyFact: 'Made of rRNA + protein. All cells — even prokaryotes — have ribosomes.', color: '#22d3ee', glow: 'rgba(34,211,238,0.5)' },
  { id: 'cell-membrane', cell: 'both', name: 'Cell (Plasma) Membrane', shortDesc: 'Selective barrier — controls entry/exit', function: 'Phospholipid bilayer with embedded proteins. Controls transport of substances in/out via diffusion, osmosis, active transport.', location: 'Outermost layer in animal cells; inside cell wall in plant cells.', size: '~8 nm thick', keyFact: 'Fluid mosaic model — proteins "float" in the lipid bilayer like icebergs.', color: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
  { id: 'cell-wall', cell: 'plant', name: 'Cell Wall', shortDesc: 'Rigid support — cellulose only', function: 'Provides structural rigidity and prevents bursting in hypotonic solutions (maintains turgor). NOT a selective barrier.', location: 'Outermost layer, outside cell membrane.', size: '0.1–10 μm thick', keyFact: 'Made of cellulose microfibrils. Animal cells NEVER have a cell wall.', color: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
  { id: 'chloroplast', cell: 'plant', name: 'Chloroplast', shortDesc: 'Photosynthesis — light → glucose', function: 'Converts CO₂ + H₂O into glucose using light energy via photosynthesis. Contains chlorophyll pigment.', location: 'Mainly in leaf mesophyll cells; along cell edges facing light.', size: '4–10 μm long', keyFact: 'Like mitochondria, have their own DNA — also of endosymbiotic origin.', color: '#84cc16', glow: 'rgba(132,204,22,0.5)' },
  { id: 'vacuole', cell: 'plant', name: 'Large Central Vacuole', shortDesc: 'Water/solute storage — turgor pressure', function: 'Stores water, mineral ions, and metabolic waste. Creates turgor pressure to keep cell rigid.', location: 'Occupies up to 90% of mature plant cell volume.', size: 'Can fill most of the cell', keyFact: 'Animals have small temporary vacuoles — NOT a large permanent central vacuole.', color: '#2dd4bf', glow: 'rgba(45,212,191,0.5)' },
  { id: 'golgi', cell: 'both', name: 'Golgi Apparatus', shortDesc: 'Packaging & secretion centre', function: 'Modifies, packages and dispatches proteins/lipids in vesicles for secretion or use in lysosomes.', location: 'Near nucleus and ER — receives vesicles from ER.', size: 'Stack of 5–8 flattened sacs (cisternae)', keyFact: 'The "post office" of the cell — it sorts, addresses and ships proteins.', color: '#38bdf8', glow: 'rgba(56,189,248,0.5)' },
];

const ANIMAL_ORGANELLES = ['nucleus', 'mitochondria', 'ribosome', 'cell-membrane', 'golgi'];
const PLANT_ORGANELLES = ['nucleus', 'mitochondria', 'ribosome', 'cell-membrane', 'cell-wall', 'chloroplast', 'vacuole', 'golgi'];

const QUIZ_QUESTIONS = [
  { id: 'q1', question: 'Which structure is found in plant cells but NEVER in animal cells?', type: 'multiple-choice' as const, options: ['Cell membrane', 'Mitochondria', 'Cell wall (cellulose)', 'Ribosome'], correctAnswer: 'Cell wall (cellulose)', explanation: 'Cell walls made of cellulose are unique to plant cells. They provide rigid support and prevent bursting in dilute solutions. Animal cells only have a flexible cell membrane.' },
  { id: 'q2', question: 'Why is the large central vacuole important for plant support?', type: 'multiple-choice' as const, options: ['It produces ATP for the cell', 'It creates turgor pressure that keeps cells rigid', 'It stores chlorophyll pigment', 'It controls protein synthesis'], correctAnswer: 'It creates turgor pressure that keeps cells rigid', explanation: 'The large central vacuole fills with water, creating turgor pressure that pushes outward against the cell wall. This makes plants firm and upright. Without water, plants wilt.' },
  { id: 'q3', question: 'A student claims mitochondria and chloroplasts both have their own DNA. Why does this support endosymbiosis theory?', type: 'multiple-choice' as const, options: ['It shows they can reproduce like bacteria', 'It suggests they evolved from ancient free-living bacteria that were engulfed', 'It proves they are not found in prokaryotes', 'It explains why they produce ATP'], correctAnswer: 'It suggests they evolved from ancient free-living bacteria that were engulfed', explanation: 'Both organelles have circular DNA, replicate independently and have double membranes — all features of bacteria. Lynn Margulis proposed they were once free-living bacteria that entered into a mutually beneficial relationship with host cells.' },
  { id: 'q4', question: 'The fluid mosaic model describes the cell membrane. What does "fluid" refer to?', type: 'multiple-choice' as const, options: ['Water passes through it freely', 'Phospholipids and proteins can move laterally', 'The membrane changes size constantly', 'It contains a fluid interior'], correctAnswer: 'Phospholipids and proteins can move laterally', explanation: 'The phospholipid bilayer is not rigid — individual lipid molecules and embedded proteins can drift sideways like ships on a sea. This fluidity is essential for membrane functions like vesicle fusion.' },
];

const COMPARISONS = [
  { feature: 'Cell wall', animal: '✗ Absent', plant: '✓ Cellulose (rigid)' },
  { feature: 'Chloroplasts', animal: '✗ Absent', plant: '✓ Present (photosynthesis)' },
  { feature: 'Large vacuole', animal: '✗ Small temporary', plant: '✓ Large permanent (up to 90%)' },
  { feature: 'Shape', animal: 'Irregular / changeable', plant: 'Fixed rectangular' },
  { feature: 'Centrioles', animal: '✓ Present (cell division)', plant: '✗ Usually absent' },
  { feature: 'Mitochondria', animal: '✓ Present', plant: '✓ Present' },
  { feature: 'Nucleus', animal: '✓ Central', plant: '✓ Peripheral (pushed by vacuole)' },
  { feature: 'Ribosomes', animal: '✓ Present', plant: '✓ Present' },
];

// --- Animated Cell Canvas ---
function AnimatedCell({ cellType, activeId, onHover, onClick, viewMode }: {
  cellType: 'animal' | 'plant';
  activeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  viewMode: ViewMode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const organelleList = cellType === 'animal' ? ANIMAL_ORGANELLES : PLANT_ORGANELLES;

    // Positions for organelles (relative to center)
    const positions: Record<string, { x: number; y: number; r: number }> = cellType === 'animal' ? {
      'nucleus': { x: cx, y: cy, r: 38 },
      'mitochondria': { x: cx - 80, y: cy - 55, r: 18 },
      'ribosome': { x: cx + 65, y: cy + 60, r: 8 },
      'cell-membrane': { x: cx, y: cy, r: 135 },
      'golgi': { x: cx + 60, y: cy - 60, r: 22 },
    } : {
      'nucleus': { x: cx - 60, y: cy - 50, r: 30 },
      'cell-wall': { x: cx, y: cy, r: 145 },
      'cell-membrane': { x: cx, y: cy, r: 135 },
      'chloroplast': { x: cx + 55, y: cy + 55, r: 20 },
      'vacuole': { x: cx + 20, y: cy + 10, r: 60 },
      'mitochondria': { x: cx - 70, y: cy + 55, r: 16 },
      'ribosome': { x: cx - 30, y: cy - 85, r: 7 },
      'golgi': { x: cx + 75, y: cy - 55, r: 18 },
    };

    function getOrganelle(id: string) {
      return ORGANELLES.find(o => o.id === id)!;
    }

    function hexToRgb(hex: string) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    }

    const draw = () => {
      t.current += 0.016;
      ctx.clearRect(0, 0, W, H);

      // Cell body
      if (cellType === 'animal') {
        // Animated blob
        ctx.save();
        ctx.translate(cx, cy);
        const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, 135);
        grad.addColorStop(0, 'rgba(88, 28, 135, 0.35)');
        grad.addColorStop(0.7, 'rgba(131, 24, 67, 0.3)');
        grad.addColorStop(1, 'rgba(190, 18, 60, 0.2)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          const wobble = Math.sin(a * 3 + t.current * 1.2) * 5 + Math.sin(a * 7 + t.current * 0.8) * 2;
          const r = 130 + wobble;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r * 0.9;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(239,68,68,0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      } else {
        // Plant cell - rectangular
        ctx.save();
        const rectX = cx - 132, rectY = cy - 132;
        const rectW = 264, rectH = 264;

        // Outer wall
        ctx.fillStyle = 'rgba(34,197,94,0.08)';
        ctx.strokeStyle = activeId === 'cell-wall' ? 'rgba(34,197,94,0.9)' : 'rgba(34,197,94,0.5)';
        ctx.lineWidth = activeId === 'cell-wall' ? 8 : 6;
        ctx.beginPath();
        ctx.roundRect(rectX, rectY, rectW, rectH, 20);
        ctx.fill();
        ctx.stroke();

        // Inner membrane
        ctx.strokeStyle = 'rgba(239,68,68,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(rectX + 10, rectY + 10, rectW - 20, rectH - 20, 14);
        ctx.stroke();

        // Cell interior
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
        grad.addColorStop(0, 'rgba(6, 78, 59, 0.3)');
        grad.addColorStop(0.7, 'rgba(20, 83, 45, 0.25)');
        grad.addColorStop(1, 'rgba(21, 128, 61, 0.15)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(rectX + 12, rectY + 12, rectW - 24, rectH - 24, 12);
        ctx.fill();
        ctx.restore();
      }

      // Draw organelles
      organelleList.forEach(id => {
        const pos = positions[id];
        if (!pos) return;
        const org = getOrganelle(id);
        const isActive = activeId === id;
        const pulse = Math.sin(t.current * 2 + id.length) * 0.05 + 1;
        const rgb = hexToRgb(org.color);

        ctx.save();
        ctx.translate(pos.x, pos.y);

        // Glow effect for active/hovered
        if (isActive) {
          ctx.shadowColor = org.color;
          ctx.shadowBlur = 20;
        }

        if (id === 'nucleus') {
          // Nucleus with nucleolus
          const r = pos.r * (isActive ? 1.08 : pulse);
          const nGrad = ctx.createRadialGradient(-5, -5, 5, 0, 0, r);
          nGrad.addColorStop(0, `rgba(${rgb},0.6)`);
          nGrad.addColorStop(1, `rgba(${rgb},0.2)`);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = nGrad;
          ctx.fill();
          ctx.strokeStyle = org.color;
          ctx.lineWidth = isActive ? 2.5 : 1.5;
          ctx.stroke();
          // Nuclear pores
          for (let i = 0; i < 8; i++) {
            const pa = (i / 8) * Math.PI * 2 + t.current * 0.15;
            ctx.beginPath();
            ctx.arc(Math.cos(pa) * r, Math.sin(pa) * r, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},0.8)`;
            ctx.fill();
          }
          // Nucleolus
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},0.5)`;
          ctx.fill();

        } else if (id === 'mitochondria') {
          // Mitochondrion - elongated with cristae
          const angle = cellType === 'animal' ? -Math.PI / 6 : Math.PI / 5;
          ctx.rotate(angle + Math.sin(t.current * 0.4 + pos.x) * 0.1);
          const mGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, pos.r);
          mGrad.addColorStop(0, `rgba(${rgb},0.7)`);
          mGrad.addColorStop(1, `rgba(${rgb},0.2)`);
          ctx.beginPath();
          ctx.ellipse(0, 0, pos.r * 1.5, pos.r * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = mGrad;
          ctx.fill();
          ctx.strokeStyle = org.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Cristae
          ctx.strokeStyle = `rgba(${rgb},0.5)`;
          ctx.lineWidth = 1;
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 6, -pos.r * 0.6);
            ctx.quadraticCurveTo(i * 6 + 4, 0, i * 6, pos.r * 0.6);
            ctx.stroke();
          }

        } else if (id === 'cell-membrane') {
          // Only show as highlighted ring when active/hovered
          if (isActive) {
            ctx.beginPath();
            if (cellType === 'animal') {
              ctx.arc(0, 0 - (pos.y - cy), pos.r, 0, Math.PI * 2);
            }
            ctx.strokeStyle = `rgba(${rgb},0.8)`;
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 4]);
          }
          // Don't draw anything non-active - the cell outline IS the membrane

        } else if (id === 'cell-wall') {
          // Already drawn in cell body above
          if (isActive) {
            ctx.strokeStyle = `rgba(${rgb},0.9)`;
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.roundRect(-cx + 10, -cy + 10, 264, 264, 18);
            ctx.stroke();
            ctx.setLineDash([]);
          }

        } else if (id === 'chloroplast') {
          // Chloroplast with thylakoid stacks
          const angle2 = -Math.PI / 5;
          ctx.rotate(angle2);
          const cGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, pos.r);
          cGrad.addColorStop(0, `rgba(${rgb},0.8)`);
          cGrad.addColorStop(1, `rgba(${rgb},0.25)`);
          ctx.beginPath();
          ctx.ellipse(0, 0, pos.r * 1.6, pos.r, 0, 0, Math.PI * 2);
          ctx.fillStyle = cGrad;
          ctx.fill();
          ctx.strokeStyle = org.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Grana stacks
          for (let g = -1; g <= 1; g++) {
            for (let s = -2; s <= 2; s++) {
              ctx.beginPath();
              ctx.ellipse(g * 7, s * 3, 5, 2, 0, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${rgb},0.6)`;
              ctx.fill();
            }
          }

        } else if (id === 'vacuole') {
          // Large transparent vacuole
          const vr = pos.r * (isActive ? 1.04 : 1);
          const vGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, vr);
          vGrad.addColorStop(0, `rgba(${rgb},0.3)`);
          vGrad.addColorStop(0.8, `rgba(${rgb},0.15)`);
          vGrad.addColorStop(1, `rgba(${rgb},0.05)`);
          ctx.beginPath();
          ctx.arc(0, 0, vr, 0, Math.PI * 2);
          ctx.fillStyle = vGrad;
          ctx.fill();
          ctx.strokeStyle = `rgba(${rgb},${isActive ? 0.8 : 0.4})`;
          ctx.lineWidth = isActive ? 2 : 1.5;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
          if (isActive) {
            ctx.fillStyle = `rgba(${rgb},0.6)`;
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('H₂O', 0, 4);
          }

        } else if (id === 'golgi') {
          // Golgi stack of curved cisternae
          for (let g = -2; g <= 2; g++) {
            ctx.beginPath();
            ctx.moveTo(-pos.r * 1.3, g * 5);
            ctx.quadraticCurveTo(0, g * 5 + 6, pos.r * 1.3, g * 5);
            ctx.strokeStyle = `rgba(${rgb},${isActive ? 0.9 : 0.6})`;
            ctx.lineWidth = isActive ? 5 : 4;
            ctx.stroke();
          }
          // Vesicles
          for (let v = 0; v < 3; v++) {
            const va = (v / 3) * Math.PI + t.current * 0.5;
            const vx = Math.cos(va) * 28;
            const vy = Math.sin(va) * 14;
            ctx.beginPath();
            ctx.arc(vx, vy, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},0.5)`;
            ctx.fill();
          }

        } else if (id === 'ribosome') {
          // Multiple small ribosomes
          const positions2 = [{ x: 0, y: 0 }, { x: -15, y: -20 }, { x: 20, y: 5 }, { x: -5, y: 25 }];
          positions2.forEach(rp => {
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${isActive ? 0.9 : 0.6})`;
            ctx.fill();
          });
        }

        ctx.restore();
        ctx.shadowBlur = 0;
      });

      // Label for active organelle
      if (activeId && positions[activeId] && viewMode !== 'compare') {
        const pos = positions[activeId];
        const org = getOrganelle(activeId);
        if (org) {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.75)';
          const lx = pos.x > cx ? pos.x - 130 : pos.x + pos.r + 10;
          const ly = Math.max(20, Math.min(H - 50, pos.y - 20));
          ctx.roundRect(lx, ly, 120, 40, 8);
          ctx.fill();
          ctx.fillStyle = org.color;
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(org.name, lx + 8, ly + 14);
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.font = '9px sans-serif';
          ctx.fillText('Click for details', lx + 8, ly + 28);
          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [cellType, activeId, viewMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const organelleList = cellType === 'animal' ? ANIMAL_ORGANELLES : PLANT_ORGANELLES;

    const positions: Record<string, { x: number; y: number; r: number }> = cellType === 'animal' ? {
      'nucleus': { x: cx, y: cy, r: 38 },
      'mitochondria': { x: cx - 80, y: cy - 55, r: 24 },
      'ribosome': { x: cx + 65, y: cy + 60, r: 20 },
      'cell-membrane': { x: cx, y: cy, r: 135 },
      'golgi': { x: cx + 60, y: cy - 60, r: 28 },
    } : {
      'nucleus': { x: cx - 60, y: cy - 50, r: 36 },
      'cell-wall': { x: cx, y: cy, r: 145 },
      'cell-membrane': { x: cx, y: cy, r: 135 },
      'chloroplast': { x: cx + 55, y: cy + 55, r: 26 },
      'vacuole': { x: cx + 20, y: cy + 10, r: 65 },
      'mitochondria': { x: cx - 70, y: cy + 55, r: 22 },
      'ribosome': { x: cx - 30, y: cy - 85, r: 18 },
      'golgi': { x: cx + 75, y: cy - 55, r: 25 },
    };

    // Priority order: smallest / most specific first
    const prioritized = ['nucleus', 'mitochondria', 'chloroplast', 'golgi', 'ribosome', 'vacuole', 'cell-membrane', 'cell-wall'].filter(id => organelleList.includes(id));

    let hit: string | null = null;
    for (const id of prioritized) {
      const pos = positions[id];
      if (!pos) continue;
      const dx = mx - pos.x;
      const dy = my - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (id === 'cell-membrane') {
        // Hit zone = outer ring
        if (dist > pos.r - 25 && dist < pos.r + 15) { hit = id; break; }
      } else if (id === 'cell-wall') {
        // Hit = within ~20px of the rect border
        const halfW = 132, halfH = 132;
        const edgeX = Math.abs(mx - cx) - halfW;
        const edgeY = Math.abs(my - cy) - halfH;
        if ((edgeX > -15 && edgeX < 15) || (edgeY > -15 && edgeY < 15)) { hit = id; break; }
      } else {
        if (dist <= pos.r) { hit = id; break; }
      }
    }

    onHover(hit);
    canvas.style.cursor = hit ? 'pointer' : 'default';
  }, [cellType, onHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const organelleList = cellType === 'animal' ? ANIMAL_ORGANELLES : PLANT_ORGANELLES;

    const positions: Record<string, { x: number; y: number; r: number }> = cellType === 'animal' ? {
      'nucleus': { x: cx, y: cy, r: 38 },
      'mitochondria': { x: cx - 80, y: cy - 55, r: 24 },
      'ribosome': { x: cx + 65, y: cy + 60, r: 20 },
      'cell-membrane': { x: cx, y: cy, r: 135 },
      'golgi': { x: cx + 60, y: cy - 60, r: 28 },
    } : {
      'nucleus': { x: cx - 60, y: cy - 50, r: 36 },
      'cell-wall': { x: cx, y: cy, r: 145 },
      'cell-membrane': { x: cx, y: cy, r: 135 },
      'chloroplast': { x: cx + 55, y: cy + 55, r: 26 },
      'vacuole': { x: cx + 20, y: cy + 10, r: 65 },
      'mitochondria': { x: cx - 70, y: cy + 55, r: 22 },
      'ribosome': { x: cx - 30, y: cy - 85, r: 18 },
      'golgi': { x: cx + 75, y: cy - 55, r: 25 },
    };

    const prioritized = ['nucleus', 'mitochondria', 'chloroplast', 'golgi', 'ribosome', 'vacuole', 'cell-membrane', 'cell-wall'].filter(id => organelleList.includes(id));

    for (const id of prioritized) {
      const pos = positions[id];
      if (!pos) continue;
      const dx = mx - pos.x;
      const dy = my - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (id === 'cell-membrane') {
        if (dist > pos.r - 25 && dist < pos.r + 15) { onClick(id); return; }
      } else if (id === 'cell-wall') {
        const halfW = 132, halfH = 132;
        const edgeX = Math.abs(mx - cx) - halfW;
        const edgeY = Math.abs(my - cy) - halfH;
        if ((edgeX > -15 && edgeX < 15) || (edgeY > -15 && edgeY < 15)) { onClick(id); return; }
      } else {
        if (dist <= pos.r) { onClick(id); return; }
      }
    }
  }, [cellType, onClick]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="w-full max-w-[300px] h-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
    />
  );
}

// --- Detail Panel ---
function OrganelleDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const org = ORGANELLES.find(o => o.id === id);
  if (!org) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 10 }}
      className="bg-slate-900/95 backdrop-blur-xl border rounded-2xl p-5 shadow-2xl"
      style={{ borderColor: `${org.color}50` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${org.color}25`, border: `1px solid ${org.color}50` }}>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: org.color }} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{org.name}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{org.cell === 'both' ? 'Animal & Plant' : `${org.cell} cells only`}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white text-lg leading-none">×</button>
      </div>
      <p className="text-slate-300 text-xs leading-relaxed mb-3">{org.function}</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-black/30 rounded-lg p-2">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Location</div>
          <div className="text-xs text-slate-300">{org.location}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Size</div>
          <div className="text-xs text-slate-300 font-mono">{org.size}</div>
        </div>
      </div>
      <div className="rounded-lg p-3 border" style={{ backgroundColor: `${org.color}08`, borderColor: `${org.color}30` }}>
        <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: org.color }}>Key Exam Fact</div>
        <p className="text-xs text-slate-300">{org.keyFact}</p>
      </div>
    </motion.div>
  );
}

export default function AnimalPlantCell() {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [hoveredAnimal, setHoveredAnimal] = useState<string | null>(null);
  const [hoveredPlant, setHoveredPlant] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const selectedOrg = ORGANELLES.find(o => o.id === selectedId);

  return (
    <div className="relative flex flex-col items-center w-full min-h-[600px] bg-[#05070A] rounded-3xl overflow-hidden border border-slate-800">
      {/* Tab Bar */}
      <div className="absolute top-4 left-4 flex gap-1.5 z-20">
        {[
          { id: 'explore', icon: <Eye size={13} />, label: 'Explore' },
          { id: 'compare', icon: <Layers size={13} />, label: 'Compare' },
          { id: 'learn', icon: <GraduationCap size={13} />, label: 'Learn' },
          { id: 'quiz', icon: <Target size={13} />, label: 'Quiz' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setViewMode(tab.id as ViewMode); setSelectedId(null); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${viewMode === tab.id ? 'bg-brand-accent text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]' : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col h-full pt-16 pb-4 px-4">
        <AnimatePresence mode="wait">
          {viewMode === 'quiz' ? (
            <motion.div key="quiz" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto w-full mt-4">
              <QuizMode questions={QUIZ_QUESTIONS} title="Cell Structure Quiz" onComplete={(score, total) => { setQuizScore(score); setQuizDone(true); }} />
            </motion.div>
          ) : viewMode === 'compare' ? (
            <motion.div key="compare" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-4">
              <h2 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">Animal vs Plant Cell — Side-by-Side Comparison</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="p-4 text-left text-slate-500 text-[10px] uppercase tracking-widest font-bold">Feature</th>
                      <th className="p-4 text-center">
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Animal Cell</span>
                        </span>
                      </th>
                      <th className="p-4 text-center">
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                          <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Plant Cell</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISONS.map((row, i) => (
                      <motion.tr
                        key={row.feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="p-4 text-white font-medium text-xs">{row.feature}</td>
                        <td className={`p-4 text-center text-xs ${row.animal.startsWith('✗') ? 'text-red-400' : row.animal.startsWith('✓') ? 'text-green-400' : 'text-slate-300'}`}>{row.animal}</td>
                        <td className={`p-4 text-center text-xs ${row.plant.startsWith('✗') ? 'text-red-400' : row.plant.startsWith('✓') ? 'text-green-400' : 'text-slate-300'}`}>{row.plant}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-5 flex-wrap">
                {['Cell wall', 'Chloroplast', 'Large vacuole'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {item} → plant only
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="cells" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
              {/* Dual Cell View */}
              <div className="flex gap-6 w-full max-w-3xl justify-center items-start mt-2">
                {/* Animal Cell */}
                <div className="flex-1 flex flex-col items-center">
                  <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mb-3">Animal Cell</h3>
                  <div className="relative">
                    <AnimatedCell
                      cellType="animal"
                      activeId={hoveredAnimal}
                      onHover={setHoveredAnimal}
                      onClick={(id) => setSelectedId(selectedId === id ? null : id)}
                      viewMode={viewMode}
                    />
                    {viewMode === 'explore' && hoveredAnimal && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-0 right-0 text-center"
                      >
                        <span className="text-[10px] text-brand-accent font-mono">{ORGANELLES.find(o => o.id === hoveredAnimal)?.name}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Plant Cell */}
                <div className="flex-1 flex flex-col items-center">
                  <h3 className="text-[10px] font-bold text-green-400 uppercase tracking-[0.3em] mb-3">Plant Cell</h3>
                  <div className="relative">
                    <AnimatedCell
                      cellType="plant"
                      activeId={hoveredPlant}
                      onHover={setHoveredPlant}
                      onClick={(id) => setSelectedId(selectedId === id ? null : id)}
                      viewMode={viewMode}
                    />
                    {viewMode === 'explore' && hoveredPlant && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-0 right-0 text-center"
                      >
                        <span className="text-[10px] text-brand-accent font-mono">{ORGANELLES.find(o => o.id === hoveredPlant)?.name}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Organelle Detail Panel */}
              <AnimatePresence>
                {selectedId && (
                  <motion.div
                    className="w-full max-w-2xl mt-10"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                  >
                    <OrganelleDetail id={selectedId} onClose={() => setSelectedId(null)} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Learn Mode */}
              {viewMode === 'learn' && !selectedId && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-2xl mt-8 space-y-3"
                >
                  <p className="text-xs text-slate-500 text-center mb-4">Click an organelle above for a detailed breakdown, or browse all below.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {ORGANELLES.filter(o => o.cell !== 'plant').map(org => (
                      <button
                        key={org.id}
                        onClick={() => setSelectedId(org.id)}
                        className="text-left bg-slate-900/50 border border-slate-800 rounded-xl p-3 hover:border-slate-600 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: org.color }} />
                          <span className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">{org.name}</span>
                          {org.cell !== 'both' && (
                            <span className="text-[9px] text-green-400 uppercase tracking-widest ml-auto">plant only</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{org.shortDesc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {viewMode === 'explore' && !selectedId && (
                <p className="text-[10px] text-slate-600 mt-8 text-center">
                  Hover over organelles to identify them · Click to explore in detail
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}