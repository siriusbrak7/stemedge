import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Eye, Target, GraduationCap } from 'lucide-react';
import { CELL_MISCONCEPTIONS } from '../../../data/misconceptions/biology';

type ViewMode = 'explore' | 'quiz' | 'learn';
type SimMode = 'diffusion' | 'osmosis' | 'active-transport';

interface ParticleData {
  left: number;
  right: number;
  waterLeft: number;
  waterRight: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  type: 'solute' | 'water' | 'atp';
  side: 'left' | 'right';
  bound: boolean;
  carrierIdx: number;
}

interface CarrierProtein {
  y: number;
  state: 'idle' | 'open-left' | 'grabbing' | 'transporting' | 'open-right' | 'releasing';
  timer: number;
  boundParticleIdx: number;
  atpGlow: number;
  pumpPhase: number; // 0-1 animation phase for pump shape
  conformationAngle: number; // rotation for shape change
}

export default function MembraneTransport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const carriersRef = useRef<CarrierProtein[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<SimMode>('diffusion');
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [concentration, setConcentration] = useState(70);
  const [speed, setSpeed] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [particleData, setParticleData] = useState<ParticleData[]>([]);
  const [showMisconception, setShowMisconception] = useState(false);
  const [atpCount, setAtpCount] = useState(0);

  const W = 600;
  const H = 400;

  const initSimulation = useCallback(() => {
    particlesRef.current = [];
    carriersRef.current = [];
    setElapsedTime(0);
    setParticleData([]);
    setAtpCount(0);

    if (mode === 'diffusion') {
      const highCount = Math.floor(concentration * 1.8);
      const lowCount = Math.floor((100 - concentration) * 0.6);
      for (let i = 0; i < highCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (W / 2 - 30) + 15,
          y: Math.random() * (H - 20) + 10,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          type: 'solute',
          side: 'left',
          bound: false,
          carrierIdx: -1,
        });
      }
      for (let i = 0; i < lowCount; i++) {
        particlesRef.current.push({
          x: W / 2 + 30 + Math.random() * (W / 2 - 40),
          y: Math.random() * (H - 20) + 10,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          type: 'solute',
          side: 'right',
          bound: false,
          carrierIdx: -1,
        });
      }
    } else if (mode === 'osmosis') {
      const soluteCount = Math.floor(concentration * 0.8);
      for (let i = 0; i < soluteCount; i++) {
        particlesRef.current.push({
          x: W / 2 + 25 + Math.random() * (W / 2 - 35),
          y: Math.random() * (H - 20) + 10,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          type: 'solute',
          side: 'right',
          bound: false,
          carrierIdx: -1,
        });
      }
      for (let i = 0; i < 80; i++) {
        const side = i < 30 ? 'left' : 'right';
        const xRange = side === 'left'
          ? Math.random() * (W / 2 - 30) + 15
          : W / 2 + 25 + Math.random() * (W / 2 - 35);
        particlesRef.current.push({
          x: xRange,
          y: Math.random() * (H - 20) + 10,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          type: 'water',
          side,
          bound: false,
          carrierIdx: -1,
        });
      }
    } else {
      // Active Transport: solutes start on LOW concentration side (left)
      // They need to be pumped to HIGH concentration side (right) AGAINST gradient
      const soluteCount = Math.floor(concentration * 0.5);
      for (let i = 0; i < soluteCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (W / 2 - 40) + 15,
          y: Math.random() * (H - 20) + 10,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          type: 'solute',
          side: 'left',
          bound: false,
          carrierIdx: -1,
        });
      }
      // Some already on the right (high concentration) to show gradient
      for (let i = 0; i < Math.floor(soluteCount * 0.6); i++) {
        particlesRef.current.push({
          x: W / 2 + 30 + Math.random() * (W / 2 - 40),
          y: Math.random() * (H - 20) + 10,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          type: 'solute',
          side: 'right',
          bound: false,
          carrierIdx: -1,
        });
      }
      // Add floating ATP molecules on the left side
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x: Math.random() * (W / 2 - 60) + 15,
          y: Math.random() * (H - 40) + 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          type: 'atp',
          side: 'left',
          bound: false,
          carrierIdx: -1,
        });
      }
      // Create carrier proteins at membrane channels
      const channelPositions = [50, 120, 190, 260, 330];
      for (const y of channelPositions) {
        carriersRef.current.push({
          y,
          state: 'idle',
          timer: 0,
          boundParticleIdx: -1,
          atpGlow: 0,
          pumpPhase: 0,
          conformationAngle: 0,
        });
      }
    }
    drawFrame();
  }, [mode, concentration]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Side labels with subtle gradient backgrounds
    if (mode === 'active-transport') {
      // Left = LOW concentration (source)
      const leftGrad = ctx.createLinearGradient(0, 0, W / 2 - 12, 0);
      leftGrad.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
      leftGrad.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, W / 2 - 12, H);

      // Right = HIGH concentration (destination)
      const rightGrad = ctx.createLinearGradient(W / 2 + 12, 0, W, 0);
      rightGrad.addColorStop(0, 'rgba(168, 85, 247, 0.02)');
      rightGrad.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(W / 2 + 12, 0, W / 2 - 12, H);
    }

    // Membrane
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(W / 2 - 12, 0, 24, H);

    if (mode === 'active-transport') {
      // Draw carrier proteins as pump structures
      carriersRef.current.forEach((carrier, idx) => {
        const cx = W / 2;
        const cy = carrier.y;
        const isActive = carrier.state !== 'idle';
        const glowAlpha = isActive ? 0.4 + carrier.pumpPhase * 0.3 : 0.15;

        // Pump body - outer shape
        ctx.save();
        ctx.translate(cx, cy);

        // Glow effect for active carriers
        if (isActive || carrier.atpGlow > 0) {
          const glow = carrier.atpGlow > 0 ? carrier.atpGlow : glowAlpha;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 15 * glow;
        }

        // Pump body
        ctx.fillStyle = isActive
          ? `rgba(168, 85, 247, ${0.4 + carrier.pumpPhase * 0.3})`
          : 'rgba(168, 85, 247, 0.25)';
        ctx.strokeStyle = isActive ? '#c084fc' : '#7c3aed';
        ctx.lineWidth = 2;

        // Draw channel shape based on state
        const openLeft = carrier.state === 'open-left' || carrier.state === 'grabbing' || carrier.state === 'idle';
        const openRight = carrier.state === 'open-right' || carrier.state === 'releasing';

        // Left channel door
        ctx.beginPath();
        if (openLeft) {
          ctx.moveTo(-16, -14);
          ctx.lineTo(-20, -10);
          ctx.lineTo(-20, 10);
          ctx.lineTo(-16, 14);
        } else {
          ctx.moveTo(-16, -14);
          ctx.lineTo(-12, -6);
          ctx.lineTo(-12, 6);
          ctx.lineTo(-16, 14);
        }
        ctx.lineTo(-16, 14);
        ctx.lineTo(-16, -14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Main pump body
        ctx.beginPath();
        ctx.roundRect(-14, -16, 28, 32, 4);
        ctx.fill();
        ctx.stroke();

        // Right channel door
        ctx.beginPath();
        if (openRight) {
          ctx.moveTo(16, -14);
          ctx.lineTo(20, -10);
          ctx.lineTo(20, 10);
          ctx.lineTo(16, 14);
        } else {
          ctx.moveTo(16, -14);
          ctx.lineTo(12, -6);
          ctx.lineTo(12, 6);
          ctx.lineTo(16, 14);
        }
        ctx.lineTo(16, 14);
        ctx.lineTo(16, -14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // "P" label for Pump
        ctx.fillStyle = isActive ? '#f0abfc' : '#a78bfa';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', 0, 0);

        // ATP consumption flash
        if (carrier.atpGlow > 0) {
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20 * carrier.atpGlow;
          ctx.fillStyle = `rgba(250, 204, 21, ${carrier.atpGlow * 0.8})`;
          ctx.beginPath();
          // Draw ATP spark shape
          const sparkR = 8 + carrier.atpGlow * 6;
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const r = i % 2 === 0 ? sparkR : sparkR * 0.5;
            const sx = Math.cos(angle) * r;
            const sy = -20 + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.fill();

          // "ATP" text
          ctx.fillStyle = `rgba(250, 204, 21, ${carrier.atpGlow})`;
          ctx.font = 'bold 8px monospace';
          ctx.fillText('ATP', 0, -20);
          ctx.shadowBlur = 0;
        }

        // Directional arrow (showing against-gradient movement: left → right)
        if (carrier.state === 'transporting') {
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.5 + carrier.pumpPhase * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-10, 20);
          ctx.lineTo(10, 20);
          ctx.lineTo(6, 16);
          ctx.moveTo(10, 20);
          ctx.lineTo(6, 24);
          ctx.stroke();
        }

        ctx.restore();
        ctx.shadowBlur = 0;
      });
    } else {
      // Passive channel drawing for diffusion/osmosis
      const channelColor = mode === 'osmosis' ? '#22d3ee' : '#38bdf8';
      for (let y = 30; y < H; y += 60) {
        ctx.fillStyle = channelColor;
        ctx.fillRect(W / 2 - 14, y, 28, 22);
        ctx.fillStyle = '#0f172a';
        if (mode === 'osmosis') {
          ctx.fillRect(W / 2 - 5, y + 3, 10, 16);
        } else {
          ctx.fillRect(W / 2 - 8, y + 3, 16, 16);
        }
      }
    }

    // Draw particles
    particlesRef.current.forEach(p => {
      if (p.bound) return; // bound particles drawn at carrier position

      ctx.beginPath();

      if (p.type === 'atp') {
        // ATP molecule - yellow diamond shape
        const sz = 5;
        ctx.moveTo(p.x, p.y - sz);
        ctx.lineTo(p.x + sz, p.y);
        ctx.lineTo(p.x, p.y + sz);
        ctx.lineTo(p.x - sz, p.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 6;
        ctx.fill();
        // Label
        ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ATP', p.x, p.y + 12);
      } else {
        ctx.arc(p.x, p.y, p.type === 'solute' ? 6 : 4, 0, Math.PI * 2);
        if (p.type === 'solute') {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#e11d48';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

    // Draw bound particles at carrier positions
    carriersRef.current.forEach(carrier => {
      if (carrier.boundParticleIdx >= 0 && carrier.boundParticleIdx < particlesRef.current.length) {
        const p = particlesRef.current[carrier.boundParticleIdx];
        if (p && p.bound) {
          ctx.beginPath();
          // Position inside the carrier
          let drawX = W / 2;
          if (carrier.state === 'grabbing') {
            drawX = W / 2 - 8 + carrier.pumpPhase * 4;
          } else if (carrier.state === 'transporting') {
            drawX = W / 2 - 4 + carrier.pumpPhase * 8;
          } else if (carrier.state === 'open-right' || carrier.state === 'releasing') {
            drawX = W / 2 + 8;
          }
          ctx.arc(drawX, carrier.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#fb7185';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    });

    // Counts overlay
    let leftSolute = 0, rightSolute = 0, leftWater = 0, rightWater = 0;
    particlesRef.current.forEach(p => {
      if (p.type === 'atp') return;
      if (p.x < W / 2) {
        if (p.type === 'solute') leftSolute++;
        else if (p.type === 'water') leftWater++;
      } else {
        if (p.type === 'solute') rightSolute++;
        else if (p.type === 'water') rightWater++;
      }
    });

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    if (mode === 'diffusion') {
      ctx.fillText(`Solute L:${leftSolute} | R:${rightSolute}`, 15, 22);
    } else if (mode === 'osmosis') {
      ctx.fillText(`Solute L:${leftSolute} R:${rightSolute}`, 15, 22);
      ctx.fillText(`Water  L:${leftWater} R:${rightWater}`, 15, 38);
    } else {
      ctx.fillText(`Solute L:${leftSolute} R:${rightSolute}`, 15, 22);
      // ATP counter
      const atpLeft = particlesRef.current.filter(p => p.type === 'atp' && !p.bound).length;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.fillText(`ATP Available: ${atpLeft}`, 15, 38);
    }

    // Side labels
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '16px sans-serif';
    if (mode === 'diffusion') {
      ctx.fillText('High Conc.', 30, H - 15);
      ctx.textAlign = 'right';
      ctx.fillText('Low Conc.', W - 30, H - 15);
    } else if (mode === 'osmosis') {
      ctx.fillText('Hypotonic', 40, H - 15);
      ctx.textAlign = 'right';
      ctx.fillText('Hypertonic', W - 30, H - 15);
    } else {
      ctx.fillText('Low Conc.', 40, H - 15);
      ctx.textAlign = 'right';
      ctx.fillText('High Conc.', W - 30, H - 15);
      // Direction arrow at bottom
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⟶ Against Gradient (requires ATP) ⟶', W / 2, H - 15);
    }
    ctx.textAlign = 'left';
  }, [mode, W, H]);

  const updatePhysics = useCallback(() => {
    const particles = particlesRef.current;
    const carriers = carriersRef.current;

    // Update carrier protein state machines (active transport only)
    if (mode === 'active-transport') {
      carriers.forEach((carrier, cIdx) => {
        // Decay ATP glow
        if (carrier.atpGlow > 0) {
          carrier.atpGlow = Math.max(0, carrier.atpGlow - 0.02);
        }

        switch (carrier.state) {
          case 'idle': {
            // Look for nearby solute on the LEFT side
            let closest = -1;
            let closestDist = 60;
            particles.forEach((p, pIdx) => {
              if (p.type === 'solute' && !p.bound && p.x < W / 2 - 10) {
                const dist = Math.sqrt((p.x - (W / 2 - 20)) ** 2 + (p.y - carrier.y) ** 2);
                if (dist < closestDist) {
                  closestDist = dist;
                  closest = pIdx;
                }
              }
            });
            if (closest >= 0) {
              carrier.state = 'open-left';
              carrier.boundParticleIdx = closest;
              carrier.timer = 0;
              carrier.pumpPhase = 0;
            }
            break;
          }
          case 'open-left': {
            // Attract the target particle toward the carrier
            const p = particles[carrier.boundParticleIdx];
            if (p && !p.bound) {
              const dx = (W / 2 - 16) - p.x;
              const dy = carrier.y - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              p.vx += (dx / dist) * 0.8;
              p.vy += (dy / dist) * 0.8;

              if (dist < 12) {
                carrier.state = 'grabbing';
                p.bound = true;
                p.carrierIdx = cIdx;
                carrier.timer = 0;
                carrier.pumpPhase = 0;

                // Find and consume an ATP molecule
                const atpIdx = particles.findIndex(ap => ap.type === 'atp' && !ap.bound);
                if (atpIdx >= 0) {
                  particles.splice(atpIdx, 1);
                  // Fix indices after splice
                  carriers.forEach(c => {
                    if (c.boundParticleIdx > atpIdx) c.boundParticleIdx--;
                  });
                  if (carrier.boundParticleIdx > atpIdx) carrier.boundParticleIdx--;
                  carrier.atpGlow = 1.0;
                  setAtpCount(prev => prev + 1);
                }
              }
            } else {
              carrier.state = 'idle';
              carrier.boundParticleIdx = -1;
            }
            carrier.timer++;
            if (carrier.timer > 120) {
              carrier.state = 'idle';
              carrier.boundParticleIdx = -1;
            }
            break;
          }
          case 'grabbing': {
            carrier.pumpPhase = Math.min(1, carrier.pumpPhase + 0.03);
            carrier.timer++;
            if (carrier.timer > 30) {
              carrier.state = 'transporting';
              carrier.timer = 0;
              carrier.pumpPhase = 0;
            }
            break;
          }
          case 'transporting': {
            // Conformational change - pump phase animates from 0 to 1
            carrier.pumpPhase = Math.min(1, carrier.pumpPhase + 0.02);
            carrier.conformationAngle = Math.sin(carrier.pumpPhase * Math.PI) * 15;
            carrier.timer++;
            if (carrier.pumpPhase >= 1) {
              carrier.state = 'open-right';
              carrier.timer = 0;
              carrier.pumpPhase = 0;
            }
            break;
          }
          case 'open-right': {
            carrier.timer++;
            if (carrier.timer > 15) {
              carrier.state = 'releasing';
              carrier.timer = 0;
            }
            break;
          }
          case 'releasing': {
            // Release the particle on the RIGHT side
            const p = particles[carrier.boundParticleIdx];
            if (p) {
              p.bound = false;
              p.carrierIdx = -1;
              p.x = W / 2 + 24;
              p.y = carrier.y + (Math.random() - 0.5) * 10;
              p.vx = 3 + Math.random() * 2;
              p.vy = (Math.random() - 0.5) * 3;
              p.side = 'right';
            }
            carrier.boundParticleIdx = -1;
            carrier.state = 'idle';
            carrier.timer = 0;
            carrier.pumpPhase = 0;
            carrier.conformationAngle = 0;
            break;
          }
        }
      });
    }

    // Update particle physics
    particles.forEach(p => {
      if (p.bound) return; // bound particles are drawn at carrier position

      p.x += p.vx * speed;
      p.y += p.vy * speed;

      if (p.x <= 8 || p.x >= W - 8) p.vx *= -1;
      if (p.y <= 8 || p.y >= H - 8) p.vy *= -1;

      p.x = Math.max(8, Math.min(W - 8, p.x));
      p.y = Math.max(8, Math.min(H - 8, p.y));

      const inCenterZone = p.x > W / 2 - 18 && p.x < W / 2 + 18;
      if (inCenterZone && mode !== 'active-transport') {
        let passed = false;
        for (let y = 30; y < H; y += 60) {
          if (p.y > y && p.y < y + 22) {
            if (mode === 'osmosis' && p.type === 'solute') {
              passed = false;
            } else {
              passed = true;
              p.vy += (Math.random() - 0.5) * 0.5;
            }
          }
        }

        if (!passed) {
          if (p.x < W / 2) {
            p.x = W / 2 - 19;
            p.vx = -Math.abs(p.vx);
          } else {
            p.x = W / 2 + 19;
            p.vx = Math.abs(p.vx);
          }
        }
      } else if (inCenterZone && mode === 'active-transport') {
        // In active transport, the membrane blocks ALL passive movement
        // Only carrier proteins can move solutes across
        if (p.type !== 'atp') {
          if (p.x < W / 2) {
            p.x = W / 2 - 19;
            p.vx = -Math.abs(p.vx);
          } else {
            p.x = W / 2 + 19;
            p.vx = Math.abs(p.vx);
          }
        }
      }

      // Brownian motion
      p.vx += (Math.random() - 0.5) * 0.3;
      p.vy += (Math.random() - 0.5) * 0.3;
      p.vx = Math.max(-5, Math.min(5, p.vx));
      p.vy = Math.max(-5, Math.min(5, p.vy));
    });
  }, [mode, speed, W]);

  useEffect(() => {
    initSimulation();
  }, [mode, concentration]);

  useEffect(() => {
    if (!isPlaying) return;

    const loop = () => {
      updatePhysics();
      drawFrame();
      setElapsedTime(prev => prev + 0.05);
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, mode, updatePhysics, drawFrame]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    initSimulation();
  };

  const getCurrentCounts = () => {
    let left = 0, right = 0;
    const target = mode === 'osmosis' ? 'water' : 'solute';
    particlesRef.current.forEach(p => {
      if (p.type === target) {
        if (p.x < W / 2) left++;
        else right++;
      }
    });
    return { left, right };
  };

  const counts = getCurrentCounts();
  const isEquilibrium = Math.abs(counts.left - counts.right) <= 5;

  return (
    <div className="flex flex-col items-center justify-center w-full h-[600px] bg-black p-6 rounded-3xl border border-brand-border/30 shadow-2xl relative">
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

      <div className="flex bg-slate-900 border border-brand-border rounded-xl p-1 mb-4 mt-12">
        <button
          onClick={() => { setMode('diffusion'); setIsPlaying(false); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            mode === 'diffusion' ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Diffusion
        </button>
        <button
          onClick={() => { setMode('osmosis'); setIsPlaying(false); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            mode === 'osmosis' ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Osmosis
        </button>
        <button
          onClick={() => { setMode('active-transport'); setIsPlaying(false); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            mode === 'active-transport' ? 'bg-purple-400 text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Transport
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <canvas ref={canvasRef} width={W} height={H} className="block" />

        {isEquilibrium && isPlaying && mode === 'diffusion' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-bold"
          >
            Equilibrium Reached!
          </motion.div>
        )}

        {mode === 'active-transport' && isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 right-4 flex flex-col items-end gap-1"
          >
            <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-[10px] font-bold uppercase tracking-widest">
              ATP Used: {atpCount}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-500/50 border border-purple-400" />
              <span className="text-[10px] text-purple-300">Carrier Protein</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rotate-45 bg-yellow-500/50 border border-yellow-400" />
              <span className="text-[10px] text-yellow-300">ATP Molecule</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-[600px] mt-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Left: {counts.left} {mode === 'osmosis' ? 'water' : 'solute'}</span>
          <span className={`font-bold ${
            mode === 'active-transport'
              ? counts.right > counts.left ? 'text-purple-400' : 'text-slate-400'
              : isEquilibrium ? 'text-green-400' : 'text-slate-400'
          }`}>
            {mode === 'active-transport'
              ? counts.right > counts.left ? 'PUMPING AGAINST GRADIENT' : 'PUMPING...'
              : isEquilibrium ? 'EQUILIBRIUM' : 'NOT EQUILIBRIUM'}
          </span>
          <span>Right: {counts.right} {mode === 'osmosis' ? 'water' : 'solute'}</span>
        </div>
        <div className="flex gap-2 mt-2 h-4">
          <div className="flex-1 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${mode === 'active-transport' ? 'bg-purple-500/60' : 'bg-red-500/60'}`}
              style={{ width: `${(counts.left / (counts.left + counts.right || 1)) * 100}%` }}
            />
            <div
              className="h-full bg-cyan-500/60 transition-all duration-300"
              style={{ width: `${(counts.right / (counts.left + counts.right || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 w-full max-w-[600px]">
        <div className="flex gap-3">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-xl transition-all text-sm ${
              isPlaying
                ? 'bg-red-500/20 border border-red-500 text-red-400'
                : 'bg-brand-accent text-black hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            }`}
          >
            {isPlaying ? <><span className="w-4 h-4 bg-red-500 rounded-sm"></span> Pause</> : <><Play fill="currentColor" size={18} /> Play</>}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-600 hover:text-white transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 flex-1">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              <span>Concentration</span>
              <span className="text-brand-accent">{concentration}%</span>
            </div>
            <input
              type="range" min="10" max="90" value={concentration}
              onChange={(e) => { setConcentration(Number(e.target.value)); setIsPlaying(false); }}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
          </div>
          <div className="w-24">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              <span>Speed</span>
              <span className="text-brand-accent">{speed}x</span>
            </div>
            <input
              type="range" min="0.5" max="3" step="0.5" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center max-w-lg">
        <p className="text-slate-400 text-sm">
          {mode === 'diffusion'
            ? 'Particles move randomly (Brownian motion) from high to low concentration until equilibrium.'
            : mode === 'osmosis'
              ? 'The semi-permeable membrane only allows water (cyan) to pass. Solutes (red) are trapped, causing water to shift toward higher solute concentration.'
              : 'Carrier proteins (purple pumps) actively grab solutes from the LOW concentration side and pump them to the HIGH concentration side — against the gradient. Each transport event consumes one ATP molecule (yellow).'}
        </p>

        {viewMode === 'learn' && (
          <button
            onClick={() => setShowMisconception(!showMisconception)}
            className="mt-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500/20 transition-all"
          >
            Common Misconceptions About Osmosis
          </button>
        )}
      </div>

      {showMisconception && viewMode === 'learn' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mt-4 space-y-4"
        >
          {CELL_MISCONCEPTIONS
            .filter(m => m.id.includes('osmosis') || m.id.includes('diffusion') || m.id.includes('hypotonic'))
            .map(m => (
              <div key={m.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">
                  Misconception
                </div>
                <p className="text-slate-300 text-sm italic mb-2">"{m.misconception}"</p>
                <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">
                  Correct
                </div>
                <p className="text-white text-sm font-medium">{m.correction}</p>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
}
