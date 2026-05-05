import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { BIODIVERSITY_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Grid3X3, RotateCcw } from 'lucide-react';

interface BiodiversitySimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

const HABITATS = ['Forest Floor', 'Grassland', 'Stream Edge'];
const SPECIES_SETS: Record<string, Array<{ symbol: string; color: string; name: string }>> = {
  'Forest Floor': [
    { symbol: 'M', color: '#22c55e', name: 'Moss' },
    { symbol: 'F', color: '#a78bfa', name: 'Fern' },
    { symbol: 'A', color: '#ef4444', name: 'Ant' },
    { symbol: 'S', color: '#6b7280', name: 'Snail' },
    { symbol: 'B', color: '#92400e', name: 'Beetle' },
    { symbol: 'L', color: '#84cc16', name: 'Liverwort' },
  ],
  'Grassland': [
    { symbol: 'G', color: '#22c55e', name: 'Grass' },
    { symbol: 'H', color: '#eab308', name: 'Herb' },
    { symbol: 'C', color: '#f97316', name: 'Cricket' },
    { symbol: 'W', color: '#ec4899', name: 'Wildflower' },
    { symbol: 'D', color: '#6b7280', name: 'Dung beetle' },
    { symbol: 'P', color: '#3b82f6', name: 'Plover' },
  ],
  'Stream Edge': [
    { symbol: 'R', color: '#22c55e', name: 'Reed' },
    { symbol: 'T', color: '#14b8a6', name: 'Tadpole' },
    { symbol: 'N', color: '#6b7280', name: 'Snail' },
    { symbol: 'O', color: '#3b82f6', name: 'Dragonfly' },
    { symbol: 'K', color: '#a78bfa', name: 'Knotgrass' },
    { symbol: 'E', color: '#84cc16', name: 'Algae' },
  ],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function BiodiversitySimulation({ variables, isRunning, onRecordData }: BiodiversitySimProps) {
  const habitat = variables['habitat'] ?? 0;
  const quadratSize = variables['quadrat-size'] ?? 5;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const habIdx = Math.min(2, Math.max(0, Math.floor(habitat)));
  const habitatName = HABITATS[habIdx];
  const speciesSet = SPECIES_SETS[habitatName];
  const gridSize = Math.max(3, Math.min(10, Math.round(quadratSize)));

  const rng = seededRandom(habIdx * 1000 + gridSize * 7);
  const grid: Array<typeof speciesSet[0]> = [];
  const counts: Record<string, number> = {};

  for (let i = 0; i < gridSize * gridSize; i++) {
    const r = rng();
    const speciesIdx = Math.floor(r * speciesSet.length);
    const species = speciesSet[Math.min(speciesIdx, speciesSet.length - 1)];
    grid.push(species);
    counts[species.name] = (counts[species.name] || 0) + 1;
  }

  const totalOrganisms = gridSize * gridSize;
  const speciesCount = Object.keys(counts).length;

  const simpsonIndex = (() => {
    let sumNn1 = 0;
    let N = 0;
    Object.values(counts).forEach(n => {
      sumNn1 += n * (n - 1);
      N += n;
    });
    return N > 1 ? 1 - sumNn1 / (N * (N - 1)) : 0;
  })();

  useEffect(() => {
    if (isRunning && !recorded) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
    } else if (!isRunning) {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, recorded]);

  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        speciesCount,
        simpsonsIndex: parseFloat(simpsonIndex.toFixed(3)),
        habitat: habitatName,
        quadratSize: gridSize,
        totalOrganisms,
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    clearInterval(intervalRef.current!);
  }, [habitat, quadratSize]);

  const progress = elapsed / 100;
  const cellSize = Math.min(40, 280 / gridSize);
  const svgSize = gridSize * cellSize + 20;

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest bg-teal-500/10 text-teal-400 border-teal-500/30">
        {habitatName} — Quadrat Sampling
      </div>

      <div className="flex gap-8 items-start justify-center flex-wrap">
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="max-w-full border border-slate-700 rounded-lg bg-slate-950/50">
          {grid.map((species, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const x = 10 + col * cellSize;
            const y = 10 + row * cellSize;
            const revealed = isRunning ? idx / (gridSize * gridSize) < progress : progress >= 1;

            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  fill={revealed ? `${species.color}15` : '#0f172a'}
                  stroke={revealed ? `${species.color}30` : '#1e293b'}
                  strokeWidth="0.5"
                />
                {revealed && (
                  <motion.text
                    x={x + cellSize / 2}
                    y={y + cellSize / 2 + 4}
                    textAnchor="middle"
                    fill={species.color}
                    fontSize={Math.min(14, cellSize * 0.5)}
                    fontWeight="bold"
                    fontFamily="monospace"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                  >
                    {species.symbol}
                  </motion.text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex flex-col gap-3 min-w-[140px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Species Legend</div>
          {speciesSet.map(sp => {
            const count = counts[sp.name] || 0;
            return (
              <div
                key={sp.name}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/40"
              >
                <span className="font-mono font-bold text-sm" style={{ color: sp.color }}>{sp.symbol}</span>
                <span className="text-xs text-slate-300 flex-1">{sp.name}</span>
                <span className="text-xs font-mono text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Sampling Progress</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-teal-500"
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Species Count</div>
          <div className="text-2xl font-mono font-bold text-teal-400">{speciesCount}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Simpson's Index</div>
          <div className="text-2xl font-mono font-bold text-cyan-400">{simpsonIndex.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Grid Size</div>
          <div className="text-2xl font-mono font-bold text-white">{gridSize}×{gridSize}</div>
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Species Distribution</div>
        <div className="flex gap-1 flex-wrap">
          {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => {
            const sp = speciesSet.find(s => s.name === name);
            return (
              <div
                key={name}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold"
                style={{ backgroundColor: `${sp?.color}15`, color: sp?.color, borderColor: `${sp?.color}30`, border: '1px solid' }}
              >
                {name}: {count}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        Simpson's Index of Diversity (D) measures species diversity: D = 1 - Σ(n(n-1)) / N(N-1). Values closer to 1 indicate higher diversity. Quadrat sampling estimates population size and distribution. WAEC: describe how to use a quadrat to sample organisms and calculate Simpson's Index.
      </div>
    </div>
  );
}

export default function BiodiversityLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <BiodiversitySimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const indices = observations.map(o => typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).simpsonsIndex ?? 0) : 0);
    const avgIndex = indices.length ? indices.reduce((a, b) => a + b, 0) / indices.length : 0;
    const avgSpecies = observations.length
      ? observations.reduce((sum, o) => sum + (typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).speciesCount ?? 0) : 0), 0) / observations.length
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(20,184,166,0.2)]">
          <Grid3X3 size={48} className="text-teal-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You surveyed biodiversity across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Simpson's D</div>
            <div className="text-2xl font-mono font-bold text-teal-400">{avgIndex.toFixed(2)}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Species</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">{avgSpecies.toFixed(1)}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Observations</div>
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
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Back to Lesson
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={BIODIVERSITY_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
