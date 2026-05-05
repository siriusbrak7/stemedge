import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Eye, Target, GraduationCap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

type ViewMode = 'explore' | 'quiz' | 'learn';
type SimMode = 'diffusion' | 'osmosis' | 'active-transport';
type ChallengePhase = 'goal' | 'predict' | 'observe' | 'reflect';

interface Challenge {
  id: string;
  mode: SimMode;
  goal: string;
  setup: { concentration: number; mode: SimMode };
  question: string;
  predictionOptions: string[];
  correctPrediction: number;
  explanation: string;
  misconceptionId?: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    mode: 'diffusion',
    goal: 'Make the particles spread evenly on both sides',
    setup: { concentration: 85, mode: 'diffusion' },
    question: 'What must happen for the particles to reach equilibrium?',
    predictionOptions: [
      'Particles move from high to low concentration until both sides are equal',
      'Particles move from low to high concentration',
      'Particles stop moving completely',
      'The membrane pushes particles to balance them'
    ],
    correctPrediction: 0,
    explanation: 'Particles move randomly from areas of high concentration to low concentration until they are evenly distributed. This is called dynamic equilibrium — particles still move, but there is no net change.',
  },
  {
    id: 'c2',
    mode: 'osmosis',
    goal: 'Make the cell swell with water',
    setup: { concentration: 70, mode: 'osmosis' },
    question: 'To make water move INTO the cell, the outside solution should be:',
    predictionOptions: [
      'Hypertonic (higher solute outside)',
      'Hypotonic (lower solute outside)',
      'Isotonic (equal solute)',
      'Water cannot move through the membrane'
    ],
    correctPrediction: 1,
    explanation: 'In a hypotonic solution, the outside has fewer solutes than inside the cell. Water moves by osmosis from high water potential (outside) to low water potential (inside), causing the cell to swell.',
  },
  {
    id: 'c3',
    mode: 'active-transport',
    goal: 'Move solutes from LOW concentration to HIGH concentration',
    setup: { concentration: 40, mode: 'active-transport' },
    question: 'To move solutes AGAINST the concentration gradient, the cell must:',
    predictionOptions: [
      'Wait for diffusion to do the work',
      'Use energy (ATP) and carrier proteins',
      'Increase the temperature',
      'Open larger channels in the membrane'
    ],
    correctPrediction: 1,
    explanation: 'Active transport requires energy in the form of ATP. Carrier proteins change shape using ATP to pump solutes against their concentration gradient — from low to high concentration.',
  },
];

export default function MembraneTransport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const carriersRef = useRef<CarrierProtein[]>([]);

  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [mode, setMode] = useState<SimMode>('diffusion');
  const [concentration, setConcentration] = useState(70);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [atpCount, setAtpCount] = useState(0);

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [phase, setPhase] = useState<ChallengePhase>('goal');
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [observation, setObservation] = useState('');
  const [challengeComplete, setChallengeComplete] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);

  const challenge = CHALLENGES[currentChallenge];
  const W = 600;
  const H = 400;

  const isChallengeMode = viewMode === 'explore';

  const initSimulation = useCallback(() => {
    particlesRef.current = [];
    carriersRef.current = [];
    setElapsedTime(0);
    setAtpCount(0);

    const activeMode = isChallengeMode ? challenge.setup.mode : mode;
    const activeConc = isChallengeMode ? challenge.setup.concentration : concentration;

    if (activeMode === 'diffusion') {
      const highCount = Math.floor(activeConc * 1.8);
      const lowCount = Math.floor((100 - activeConc) * 0.6);
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
    } else if (activeMode === 'osmosis') {
      const soluteCount = Math.floor(activeConc * 0.8);
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
      const soluteCount = Math.floor(activeConc * 0.5);
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
  }, [mode, concentration, isChallengeMode, challenge, W, H]);

  const getCurrentCounts = useCallback(() => {
    let left = 0, right = 0;
    const target = isChallengeMode
      ? (challenge.setup.mode === 'osmosis' ? 'water' : 'solute')
      : (mode === 'osmosis' ? 'water' : 'solute');
    particlesRef.current.forEach(p => {
      if (p.type === target) {
        if (p.x < W / 2) left++;
        else right++;
      }
    });
    return { left, right };
  }, [isChallengeMode, challenge, mode, W]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const activeMode = isChallengeMode ? challenge.setup.mode : mode;

    if (activeMode === 'active-transport') {
      const leftGrad = ctx.createLinearGradient(0, 0, W / 2 - 12, 0);
      leftGrad.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
      leftGrad.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, W / 2 - 12, H);

      const rightGrad = ctx.createLinearGradient(W / 2 + 12, 0, W, 0);
      rightGrad.addColorStop(0, 'rgba(168, 85, 247, 0.02)');
      rightGrad.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(W / 2 + 12, 0, W / 2 - 12, H);
    }

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(W / 2 - 12, 0, 24, H);

    if (activeMode === 'active-transport') {
      carriersRef.current.forEach((carrier) => {
        const cx = W / 2;
        const cy = carrier.y;
        const isActive = carrier.state !== 'idle';
        const glowAlpha = isActive ? 0.4 + carrier.pumpPhase * 0.3 : 0.15;

        ctx.save();
        ctx.translate(cx, cy);

        if (isActive || carrier.atpGlow > 0) {
          const glow = carrier.atpGlow > 0 ? carrier.atpGlow : glowAlpha;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 15 * glow;
        }

        ctx.fillStyle = isActive
          ? `rgba(168, 85, 247, ${0.4 + carrier.pumpPhase * 0.3})`
          : 'rgba(168, 85, 247, 0.25)';
        ctx.strokeStyle = isActive ? '#c084fc' : '#7c3aed';
        ctx.lineWidth = 2;

        const openLeft = carrier.state === 'open-left' || carrier.state === 'grabbing' || carrier.state === 'idle';
        const openRight = carrier.state === 'open-right' || carrier.state === 'releasing';

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

        ctx.beginPath();
        ctx.roundRect(-14, -16, 28, 32, 4);
        ctx.fill();
        ctx.stroke();

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

        ctx.fillStyle = isActive ? '#f0abfc' : '#a78bfa';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', 0, 0);

        if (carrier.atpGlow > 0) {
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20 * carrier.atpGlow;
          ctx.fillStyle = `rgba(250, 204, 21, ${carrier.atpGlow * 0.8})`;
          ctx.beginPath();
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
          ctx.fillStyle = `rgba(250, 204, 21, ${carrier.atpGlow})`;
          ctx.font = 'bold 8px monospace';
          ctx.fillText('ATP', 0, -20);
          ctx.shadowBlur = 0;
        }

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
      const channelColor = activeMode === 'osmosis' ? '#22d3ee' : '#38bdf8';
      for (let y = 30; y < H; y += 60) {
        ctx.fillStyle = channelColor;
        ctx.fillRect(W / 2 - 14, y, 28, 22);
        ctx.fillStyle = '#0f172a';
        if (activeMode === 'osmosis') {
          ctx.fillRect(W / 2 - 5, y + 3, 10, 16);
        } else {
          ctx.fillRect(W / 2 - 8, y + 3, 16, 16);
        }
      }
    }

    particlesRef.current.forEach(p => {
      if (p.bound) return;

      ctx.beginPath();

      if (p.type === 'atp') {
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

    carriersRef.current.forEach(carrier => {
      if (carrier.boundParticleIdx >= 0 && carrier.boundParticleIdx < particlesRef.current.length) {
        const p = particlesRef.current[carrier.boundParticleIdx];
        if (p && p.bound) {
          ctx.beginPath();
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

    const counts = getCurrentCounts();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    if (activeMode === 'diffusion') {
      ctx.fillText(`Solute L:${counts.left} | R:${counts.right}`, 15, 22);
    } else if (activeMode === 'osmosis') {
      ctx.fillText(`Solute L:${counts.left} R:${counts.right}`, 15, 22);
      ctx.fillText(`Water  L:${counts.left} R:${counts.right}`, 15, 38);
    } else {
      ctx.fillText(`Solute L:${counts.left} R:${counts.right}`, 15, 22);
      const atpLeft = particlesRef.current.filter(p => p.type === 'atp' && !p.bound).length;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.fillText(`ATP Available: ${atpLeft}`, 15, 38);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '16px sans-serif';
    if (activeMode === 'diffusion') {
      ctx.fillText('High Conc.', 30, H - 15);
      ctx.textAlign = 'right';
      ctx.fillText('Low Conc.', W - 30, H - 15);
    } else if (activeMode === 'osmosis') {
      ctx.fillText('Inside Cell', 40, H - 15);
      ctx.textAlign = 'right';
      ctx.fillText('Outside Cell', W - 30, H - 15);
    } else {
      ctx.fillText('Low Conc.', 40, H - 15);
      ctx.textAlign = 'right';
      ctx.fillText('High Conc.', W - 30, H - 15);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⟶ Against Gradient (requires ATP) ⟶', W / 2, H - 15);
    }
    ctx.textAlign = 'left';
  }, [isChallengeMode, challenge, mode, W, H, getCurrentCounts]);

  const updatePhysics = useCallback(() => {
    const particles = particlesRef.current;
    const carriers = carriersRef.current;
    const activeMode = isChallengeMode ? challenge.setup.mode : mode;

    if (activeMode === 'active-transport') {
      carriers.forEach((carrier, cIdx) => {
        if (carrier.atpGlow > 0) {
          carrier.atpGlow = Math.max(0, carrier.atpGlow - 0.02);
        }

        switch (carrier.state) {
          case 'idle': {
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

                const atpIdx = particles.findIndex(ap => ap.type === 'atp' && !ap.bound);
                if (atpIdx >= 0) {
                  particles.splice(atpIdx, 1);
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

    particles.forEach(p => {
      if (p.bound) return;

      p.x += p.vx * speed;
      p.y += p.vy * speed;

      if (p.x <= 8 || p.x >= W - 8) p.vx *= -1;
      if (p.y <= 8 || p.y >= H - 8) p.vy *= -1;

      p.x = Math.max(8, Math.min(W - 8, p.x));
      p.y = Math.max(8, Math.min(H - 8, p.y));

      const inCenterZone = p.x > W / 2 - 18 && p.x < W / 2 + 18;
      if (inCenterZone && activeMode !== 'active-transport') {
        let passed = false;
        for (let y = 30; y < H; y += 60) {
          if (p.y > y && p.y < y + 22) {
            if (activeMode === 'osmosis' && p.type === 'solute') {
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
      } else if (inCenterZone && activeMode === 'active-transport') {
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

      p.vx += (Math.random() - 0.5) * 0.3;
      p.vy += (Math.random() - 0.5) * 0.3;
      p.vx = Math.max(-5, Math.min(5, p.vx));
      p.vy = Math.max(-5, Math.min(5, p.vy));
    });
  }, [isChallengeMode, challenge, mode, speed, W, H]);

  useEffect(() => {
    initSimulation();
  }, [mode, concentration, currentChallenge]);

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

  const counts = getCurrentCounts();
  const isEquilibrium = Math.abs(counts.left - counts.right) <= 5;

  const checkGoalAchieved = () => {
    const activeMode = isChallengeMode ? challenge.setup.mode : mode;
    if (activeMode === 'diffusion') return isEquilibrium;
    if (activeMode === 'osmosis') return counts.left > counts.right;
    if (activeMode === 'active-transport') return counts.right > counts.left * 1.5;
    return false;
  };

  const handlePredictionSelect = (idx: number) => {
    setSelectedPrediction(idx);
    const isCorrect = idx === challenge.correctPrediction;
    if (isCorrect) setScore(s => s + 3);
  };

  const moveToObserve = () => {
    setPhase('observe');
    setIsPlaying(true);
  };

  const handleReflect = () => {
    const goalAchieved = checkGoalAchieved();
    if (goalAchieved) {
      setChallengeComplete(prev => ({ ...prev, [challenge.id]: true }));
      setScore(s => s + 5);
    }
    setPhase('reflect');
    setShowResult(true);
  };

  const nextChallenge = () => {
    const next = (currentChallenge + 1) % CHALLENGES.length;
    setCurrentChallenge(next);
    setPhase('goal');
    setSelectedPrediction(null);
    setShowResult(false);
    setObservation('');
    setIsPlaying(false);
    initSimulation();
  };

  const completedCount = Object.keys(challengeComplete).length;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] bg-black p-6 rounded-3xl border border-brand-border/30 shadow-2xl relative">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button
          onClick={() => setViewMode('explore')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={14} />
          Challenge
        </button>
        <button
          onClick={() => setViewMode('learn')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap size={14} />
          Free Play
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          <span className="text-yellow-400 font-mono text-xs font-bold">{score} pts</span>
        </div>
        <div className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
          <span className="text-brand-accent font-mono text-xs font-bold">{completedCount}/{CHALLENGES.length} done</span>
        </div>
      </div>

      {viewMode === 'explore' && (
        <>
          {phase === 'goal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg mt-16 mb-4 bg-slate-900/80 border border-brand-accent/30 rounded-2xl p-6 text-center"
            >
              <div className="text-brand-accent text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">Challenge {currentChallenge + 1}: {challenge.mode === 'diffusion' ? 'Diffusion' : challenge.mode === 'osmosis' ? 'Osmosis' : 'Active Transport'}</h3>
              <p className="text-slate-300 text-sm mb-4"><strong className="text-brand-accent">Goal:</strong> {challenge.goal}</p>
              <button
                onClick={() => setPhase('predict')}
                className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all"
              >
                Start Challenge →
              </button>
            </motion.div>
          )}

          {phase === 'predict' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg mt-16 mb-4 bg-slate-900/80 border border-yellow-500/20 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3">🤔 Make Your Prediction</h3>
              <p className="text-white text-sm mb-4">{challenge.question}</p>
              <div className="space-y-2 mb-4">
                {challenge.predictionOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePredictionSelect(idx)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all border ${
                      selectedPrediction === idx
                        ? idx === challenge.correctPrediction
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-yellow-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {selectedPrediction === idx && (
                        idx === challenge.correctPrediction
                          ? <CheckCircle2 size={16} className="text-green-400" />
                          : <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {selectedPrediction !== null && (
                <button
                  onClick={moveToObserve}
                  className="w-full px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                >
                  Run the Simulation <ArrowRight size={16} />
                </button>
              )}
            </motion.div>
          )}

          {phase === 'observe' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg mt-16 mb-4 bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">🔬 Observe the Results</h3>
              <p className="text-slate-300 text-sm mb-3">Watch the simulation. Did your prediction match what happened?</p>
              <div className="bg-black/40 rounded-xl p-3 border border-slate-800 mb-4">
                <div className="text-xs text-slate-500 mb-1">Left Side</div>
                <div className="text-lg font-mono text-white">{counts.left} particles</div>
                <div className="text-xs text-slate-500 mt-2 mb-1">Right Side</div>
                <div className="text-lg font-mono text-white">{counts.right} particles</div>
                <div className="text-xs text-slate-500 mt-2">
                  Status: {isEquilibrium ? <span className="text-green-400">Equilibrium</span> : <span className="text-yellow-400">Not at equilibrium</span>}
                </div>
              </div>
              <textarea
                value={observation}
                onChange={e => setObservation(e.target.value)}
                placeholder="What did you observe? Did it match your prediction?"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm resize-none h-20 focus:border-cyan-400 outline-none mb-3"
              />
              <button
                onClick={handleReflect}
                disabled={!observation.trim()}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-green-400 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                Submit Observation <CheckCircle2 size={16} />
              </button>
            </motion.div>
          )}

          {phase === 'reflect' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg mt-16 mb-4 bg-slate-900/80 border border-green-500/20 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">💡 What We Learned</h3>
              <div className={`p-4 rounded-xl border mb-4 ${checkGoalAchieved() ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'}`}>
                <p className="text-sm leading-relaxed">{challenge.explanation}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800 mb-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Your Prediction</div>
                <div className={`text-sm ${selectedPrediction === challenge.correctPrediction ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedPrediction !== null ? challenge.predictionOptions[selectedPrediction] : 'No prediction made'}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 mb-1">What Actually Happened</div>
                <div className="text-sm text-cyan-400">{challenge.predictionOptions[challenge.correctPrediction]}</div>
              </div>
              <button
                onClick={nextChallenge}
                className="w-full px-6 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                {currentChallenge < CHALLENGES.length - 1 ? 'Next Challenge →' : 'Restart Challenges ↻'} <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </>
      )}

      <div className={`relative rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] ${viewMode === 'explore' ? 'mt-4' : 'mt-12'}`}>
        <canvas ref={canvasRef} width={W} height={H} className="block" />

        {isEquilibrium && isPlaying && !isChallengeMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-bold"
          >
            Equilibrium Reached!
          </motion.div>
        )}
      </div>

      {viewMode === 'learn' && (
        <>
          <div className="w-full max-w-[600px] mt-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Left: {counts.left}</span>
              <span className={isEquilibrium ? 'text-green-400 font-bold' : 'text-slate-400'}>
                {isEquilibrium ? 'EQUILIBRIUM' : 'NOT EQUILIBRIUM'}
              </span>
              <span>Right: {counts.right}</span>
            </div>
            <div className="flex gap-2 mt-2 h-4">
              <div className="flex-1 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-red-500/60 transition-all duration-300"
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

            <div className="flex bg-slate-900 border border-brand-border rounded-xl p-1">
              <button
                onClick={() => { setMode('diffusion'); setIsPlaying(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'diffusion' ? 'bg-brand-accent text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Diffusion
              </button>
              <button
                onClick={() => { setMode('osmosis'); setIsPlaying(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'osmosis' ? 'bg-brand-accent text-black' : 'text-slate-400 hover:text-white'
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
                ? 'Particles move randomly from high to low concentration until equilibrium.'
                : mode === 'osmosis'
                  ? 'Water moves across the membrane toward the higher solute concentration.'
                  : 'Carrier proteins use ATP to pump solutes against the concentration gradient.'}
            </p>
          </div>
        </>
      )}

      {viewMode === 'explore' && (
        <div className="flex flex-wrap items-center gap-4 mt-4 w-full max-w-[600px]">
          <button onClick={togglePlay} className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-xl transition-all text-sm ${
            isPlaying ? 'bg-red-500/20 border border-red-500 text-red-400' : 'bg-brand-accent text-black hover:bg-white'
          }`}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleReset} className="p-3 bg-slate-800 text-slate-300 rounded-xl hover:text-white">
            <RotateCcw size={18} />
          </button>
        </div>
      )}
    </div>
  );
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
  pumpPhase: number;
  conformationAngle: number;
}