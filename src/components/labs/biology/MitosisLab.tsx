import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { MITOSIS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Microscope, RotateCcw } from 'lucide-react';

interface MitosisSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

const STAGE_NAMES = ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'];
const STAGE_COLORS = ['#a855f7', '#ec4899', '#f97316', '#22c55e'];

function MitosisSimulation({ variables, isRunning, onRecordData }: MitosisSimProps) {
  const cellSample = variables['cell-sample'] ?? 0;
  const magnification = variables['magnification'] ?? 1;

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stageIndex = Math.min(3, Math.max(0, Math.floor(cellSample)));
  const stageName = STAGE_NAMES[stageIndex];
  const stageColor = STAGE_COLORS[stageIndex];

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
        stageIdentified: stageName,
        stageIndex,
        accuracy: 85 + Math.random() * 15,
        magnification,
      });
    }
  }, [elapsed, recorded]);

  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    clearInterval(intervalRef.current!);
  }, [cellSample, magnification]);

  const progress = elapsed / 100;
  const scale = magnification;

  const cx = 200;
  const cy = 180;
  const cellRx = 80 * scale;
  const cellRy = 65 * scale;

  const chromosomeX = (i: number) => {
    if (stageIndex === 0) return cx + Math.cos(i * 1.2) * 30 * progress;
    if (stageIndex === 1) return cx - 30 + i * 20;
    const side = i % 2 === 0 ? -1 : 1;
    return cx + side * (stageIndex === 2 ? 35 : 50) * progress;
  };
  const chromosomeY = (i: number) => {
    if (stageIndex === 0) return cy - 20 + i * 12 + Math.sin(i * 1.5) * 8 * progress;
    if (stageIndex === 1) return cy;
    if (stageIndex === 2) return cy - 30 * progress + Math.floor(i / 2) * 30;
    return cy - 20 + Math.floor(i / 2) * 30;
  };

  const numChromosomes = 4;

  const renderChromosomes = () => {
    return Array.from({ length: numChromosomes }, (_, i) => {
      const x = chromosomeX(i);
      const y = chromosomeY(i);
      const rotation = stageIndex === 0 ? i * 40 : stageIndex === 1 ? 90 : 0;
      const chrWidth = stageIndex >= 2 ? 4 : 6;
      const chrHeight = stageIndex === 0 ? 18 + progress * 6 : 22;

      if (stageIndex === 2 || stageIndex === 3) {
        const side = i % 2 === 0 ? -1 : 1;
        const sepX = cx + side * 35 * progress;
        const sepY = cy - 25 + Math.floor(i / 2) * 30;

        return (
          <g key={i}>
            <motion.rect
              x={sepX - 3}
              y={sepY - 10}
              width={6}
              height={20}
              rx={3}
              fill={stageColor}
              animate={{ opacity: isRunning ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            />
            {stageIndex === 2 && (
              <motion.line
                x1={cx - 20 * progress}
                y1={sepY}
                x2={cx + 20 * progress}
                y2={sepY}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3,3"
                animate={{ opacity: progress > 0.3 ? 0.6 : 0 }}
              />
            )}
          </g>
        );
      }

      return (
        <g key={i}>
          <motion.rect
            x={x - chrWidth / 2}
            y={y - chrHeight / 2}
            width={chrWidth}
            height={chrHeight}
            rx={3}
            fill={stageColor}
            animate={{
              x: x - chrWidth / 2,
              y: y - chrHeight / 2,
              opacity: isRunning ? 1 : 0.3,
              rotate: isRunning ? rotation * progress : 0,
            }}
            transition={{ duration: 0.8 }}
          />
          {stageIndex === 0 && progress > 0.5 && (
            <motion.circle
              cx={x}
              cy={y}
              r={2}
              fill="#fbbf24"
              animate={{ opacity: 0.8 }}
            />
          )}
        </g>
      );
    });
  };

  const renderSpindleFibers = () => {
    if (stageIndex < 1 || stageIndex > 2) return null;
    return Array.from({ length: numChromosomes }, (_, i) => {
      const side = stageIndex === 2 ? (i % 2 === 0 ? -1 : 1) : 0;
      const targetX = stageIndex === 2 ? cx + side * 35 * progress : chromosomeX(i);
      const targetY = stageIndex === 2 ? cy - 25 + Math.floor(i / 2) * 30 : cy;
      return (
        <motion.line
          key={`spindle-${i}`}
          x1={cx}
          y1={cy - cellRy * 0.7}
          x2={targetX}
          y2={targetY}
          stroke="#64748b"
          strokeWidth={1}
          strokeDasharray="2,2"
          animate={{ opacity: isRunning && progress > 0.2 ? 0.5 : 0 }}
          transition={{ duration: 0.5 }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div
        className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest"
        style={{
          color: stageColor,
          backgroundColor: `${stageColor}15`,
          borderColor: `${stageColor}40`,
        }}
      >
        {stageName} — Mitosis Stage {stageIndex + 1}/4
      </div>

      <div className="flex gap-8 items-start justify-center flex-wrap">
        <svg width={400 * scale} height={360 * scale} viewBox="0 0 400 360" className="max-w-full">
          <defs>
            <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`${stageColor}20`} />
              <stop offset="100%" stopColor={`${stageColor}08`} />
            </radialGradient>
          </defs>

          <motion.ellipse
            cx={cx}
            cy={cy}
            rx={cellRx}
            ry={cellRy}
            fill="url(#cellGrad)"
            stroke={stageColor}
            strokeWidth={2}
            animate={{
              rx: stageIndex === 3 && isRunning ? cellRx + 15 * progress : cellRx,
              ry: stageIndex === 3 && isRunning ? cellRy * 0.7 : cellRy,
            }}
            transition={{ duration: 1 }}
          />

          <motion.ellipse
            cx={cx}
            cy={cy}
            rx={cellRx * 0.85}
            ry={cellRy * 0.85}
            fill="none"
            stroke={`${stageColor}30`}
            strokeWidth={1}
            strokeDasharray="4,4"
            animate={{ opacity: stageIndex >= 2 ? 0.8 : 0.2 }}
          />

          {stageIndex === 0 && (
            <motion.ellipse
              cx={cx}
              cy={cy}
              rx={25 * (1 - progress * 0.8)}
              ry={20 * (1 - progress * 0.8)}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="3,3"
              animate={{ opacity: 1 - progress * 0.9 }}
            />
          )}

          {stageIndex === 3 && isRunning && progress > 0.5 && (
            <>
              <motion.ellipse
                cx={cx - 50 * progress}
                cy={cy}
                rx={18 * progress}
                ry={14 * progress}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={1.5}
                animate={{ opacity: progress }}
              />
              <motion.ellipse
                cx={cx + 50 * progress}
                cy={cy}
                rx={18 * progress}
                ry={14 * progress}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={1.5}
                animate={{ opacity: progress }}
              />
            </>
          )}

          {renderSpindleFibers()}
          {renderChromosomes()}

          {stageIndex === 1 && (
            <motion.line
              x1={cx}
              y1={cy - cellRy * 0.8}
              x2={cx}
              y2={cy + cellRy * 0.8}
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="4,2"
              animate={{ opacity: isRunning ? 0.7 : 0.2 }}
            />
          )}

          <text x={cx} y={cy + cellRy + 25} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
            {magnification.toFixed(0)}x magnification
          </text>
        </svg>

        <div className="flex flex-col gap-3 min-w-[140px]">
          {STAGE_NAMES.map((name, idx) => (
            <div
              key={name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                idx === stageIndex
                  ? 'border-slate-600 bg-slate-800/80'
                  : 'border-slate-800 bg-slate-900/40 opacity-50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: STAGE_COLORS[idx] }}
              />
              <span className={`text-xs font-bold ${idx === stageIndex ? 'text-white' : 'text-slate-500'}`}>
                {name}
              </span>
              {idx === stageIndex && isRunning && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ backgroundColor: stageColor }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Simulation Progress</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: stageColor }}
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current Stage</div>
          <div className="text-lg font-mono font-bold" style={{ color: stageColor }}>{stageName}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Chromosomes</div>
          <div className="text-2xl font-mono font-bold text-white">{numChromosomes * 2}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Division</div>
          <div className="text-sm font-bold text-brand-accent">Equational</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC · </span>
        {stageIndex === 0
          ? 'In prophase, chromosomes condense and become visible. The nuclear membrane begins to disintegrate. WAEC: state that chromosomes shorten and thicken.'
          : stageIndex === 1
          ? 'In metaphase, chromosomes align at the cell equator (metaphase plate). Spindle fibers attach to centromeres. WAEC: describe the arrangement of chromosomes at the equator.'
          : stageIndex === 2
          ? 'In anaphase, sister chromatids are pulled apart to opposite poles by spindle fibres. WAEC: state that centromeres divide and chromatids separate.'
          : 'In telophase, two new nuclear membranes form around the separated chromatid sets. Cytokinesis follows, dividing the cytoplasm. WAEC: describe the reformation of nuclear membranes.'}
      </div>
    </div>
  );
}

export default function MitosisLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <MitosisSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const observations = trials.flatMap(t => t.observations);
    const stageCounts: Record<string, number> = {};
    observations.forEach(o => {
      if (typeof o.result === 'object') {
        const stage = String((o.result as Record<string, unknown>).stageIdentified ?? '');
        if (stage) stageCounts[stage] = (stageCounts[stage] || 0) + 1;
      }
    });
    const mostIdentified = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          <Microscope size={48} className="text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You identified {trials.length} mitosis stage{trials.length !== 1 ? 's' : ''} across your trials.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Most Identified</div>
            <div className="text-2xl font-mono font-bold text-purple-400">
              {mostIdentified ? mostIdentified[0] : '—'}
            </div>
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
      config={MITOSIS_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
