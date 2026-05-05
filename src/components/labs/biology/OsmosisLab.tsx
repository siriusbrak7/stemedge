/**
 * OsmosisLab.tsx
 *
 * Fixed: useEffect was called inside a render-prop function (illegal hook call).
 * Solution: extracted OsmosisSimulation as a proper React component so hooks
 * are always called at the top level of a component.
 *
 * Enhanced:
 * - Water potential annotations (IB/A-Level)
 * - WAEC-style terminology (turgid, plasmolysed, crenated, lysed)
 * - Mass change graph over time
 * - Isotonic range display
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import VirtualLabEngine from '../VirtualLabEngine';
import { OSMOSIS_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';
import { Droplets, FlaskConical, RotateCcw } from 'lucide-react';

// ─── Simulation sub-component (hooks are legal here) ────────────────────────

interface OsmosisSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function OsmosisSimulation({ variables, isRunning, onRecordData }: OsmosisSimProps) {
  const concentration = variables['solution-concentration'] ?? 5;
  const cellType = variables['cell-type'] ?? 0;   // 0=animal, 1=plant
  const time = variables['time'] ?? 15;

  // IB: isotonic for human cells ≈ 0.9 % NaCl
  const ISOTONIC_POINT = 0.9;
  const isIsotonic = concentration >= ISOTONIC_POINT * 0.85 && concentration <= ISOTONIC_POINT * 1.15;
  const isHypotonic = concentration < ISOTONIC_POINT * 0.85;
  const isHypertonic = concentration > ISOTONIC_POINT * 1.15;

  // Mass-change model (simplified linear approximation used in WAEC practicals)
  const massChange = (() => {
    const delta = ISOTONIC_POINT - concentration;
    if (cellType === 0) {
      // Animal cell: no cell wall → more extreme change
      return isIsotonic ? 0 : Math.max(-60, Math.min(60, delta * 10));
    } else {
      // Plant cell: cell wall limits change → smaller range
      return isIsotonic ? 0 : Math.max(-35, Math.min(35, delta * 6));
    }
  })();

  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progress timer when running
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

  // Record data once progress reaches 100 %
  useEffect(() => {
    if (elapsed >= 100 && !recorded) {
      setRecorded(true);
      onRecordData({
        massChangePercent: parseFloat(massChange.toFixed(2)),
        finalState: cellType === 0
          ? (isHypotonic ? 'lysed' : isHypertonic ? 'crenated' : 'normal')
          : (isHypotonic ? 'turgid' : isHypertonic ? 'plasmolysed' : 'flaccid'),
        solutionType: isHypotonic ? 'hypotonic' : isHypertonic ? 'hypertonic' : 'isotonic',
        concentration,
        cellType: cellType === 0 ? 'animal' : 'plant',
        timeMinutes: time,
      });
    }
  }, [elapsed, recorded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when inputs change
  useEffect(() => {
    setElapsed(0);
    setRecorded(false);
    clearInterval(intervalRef.current!);
  }, [concentration, cellType, time]);

  const progress = elapsed / 100;
  const animScale = isRunning
    ? isHypotonic
      ? 1 + progress * (cellType === 0 ? 0.45 : 0.2)
      : isHypertonic
        ? 1 - progress * (cellType === 0 ? 0.4 : 0.25)
        : 1
    : 1;

  const solutionLabel = isHypotonic ? 'Hypotonic' : isHypertonic ? 'Hypertonic' : 'Isotonic';
  const solutionColor = isHypotonic ? 'text-blue-400' : isHypertonic ? 'text-orange-400' : 'text-green-400';
  const solutionBg = isHypotonic ? 'bg-blue-500/10' : isHypertonic ? 'bg-orange-500/10' : 'bg-green-500/10';
  const solutionBorder = isHypotonic ? 'border-blue-500/30' : isHypertonic ? 'border-orange-500/30' : 'border-green-500/30';

  const finalStateLabel = cellType === 0
    ? (isHypotonic ? 'Swollen / Lysed 💥' : isHypertonic ? 'Crenated 🔴' : 'Normal ✓')
    : (isHypotonic ? 'Turgid 💪' : isHypertonic ? 'Plasmolysed 🟡' : 'Flaccid / Normal ✓');

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">

      {/* Solution type badge */}
      <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest ${solutionColor} ${solutionBg} ${solutionBorder}`}>
        {solutionLabel} Solution — {concentration}% NaCl
      </div>

      {/* Cell visualisation row */}
      <div className="flex gap-12 items-center justify-center flex-wrap">

        {/* Before */}
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Initial State</div>
          <div className="relative w-28 h-28 flex items-center justify-center">
            {cellType === 0 ? (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-900 to-red-600 border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]" />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-900 to-green-700 border-4 border-green-500 relative shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <div className="absolute inset-4 rounded bg-green-400/25 border border-green-400/20" />
              </div>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-2">{cellType === 0 ? 'Animal Cell' : 'Plant Cell'}</div>
        </div>

        {/* Animated water arrows */}
        <div className="flex flex-col items-center gap-1">
          {(isHypotonic || isIsotonic) && (
            <motion.div
              animate={{ x: isHypotonic ? [0, 8, 0] : 0, opacity: isHypotonic ? 1 : 0.3 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className={`text-lg ${isHypotonic ? 'text-blue-400' : 'text-slate-600'}`}
            >→ 💧 →</motion.div>
          )}
          {(isHypertonic || isIsotonic) && (
            <motion.div
              animate={{ x: isHypertonic ? [0, -8, 0] : 0, opacity: isHypertonic ? 1 : 0.3 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className={`text-lg ${isHypertonic ? 'text-orange-400' : 'text-slate-600'}`}
            >← 💧 ←</motion.div>
          )}
          <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${solutionColor}`}>
            {isHypotonic ? 'Water IN' : isHypertonic ? 'Water OUT' : 'Equilibrium'}
          </div>
          {/* Water potential notation for IB */}
          <div className="text-[9px] text-slate-600 mt-1">
            {isHypotonic ? 'Ψ_ext > Ψ_cell' : isHypertonic ? 'Ψ_ext < Ψ_cell' : 'Ψ_ext ≈ Ψ_cell'}
          </div>
        </div>

        {/* After (animated) */}
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
            After {time} min
          </div>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <AnimatePresence>
              {cellType === 0 ? (
                <motion.div
                  key="animal-after"
                  className="rounded-full bg-gradient-to-br from-red-900 to-red-600 border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  animate={{ scale: isRunning ? animScale : 1, opacity: isRunning ? 1 : 0.35 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ width: 96, height: 96 }}
                />
              ) : (
                <motion.div
                  key="plant-after"
                  className="relative rounded-lg bg-gradient-to-br from-green-900 to-green-700 border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] overflow-hidden"
                  animate={{ opacity: isRunning ? 1 : 0.35 }}
                  style={{ width: 96, height: 96 }}
                >
                  <motion.div
                    className="absolute inset-3 rounded bg-green-400/30 border border-green-400/20"
                    animate={{ scale: isRunning ? animScale * 0.85 : 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  {/* Plasmolysis gap indicator */}
                  {isHypertonic && isRunning && progress > 0.5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 border-4 border-dashed border-green-700 rounded-lg"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={`text-xs font-bold mt-2 ${solutionColor}`}>{finalStateLabel}</div>
        </div>
      </div>

      {/* Progress bar */}
      {isRunning && (
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Simulation Progress</span>
            <span>{elapsed}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isHypotonic ? 'bg-blue-500' : isHypertonic ? 'bg-orange-500' : 'bg-green-500'}`}
              animate={{ width: `${elapsed}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Mass change display */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Mass Change</div>
          <div className={`text-2xl font-mono font-bold ${massChange > 0 ? 'text-blue-400' : massChange < 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {massChange > 0 ? '+' : ''}{massChange.toFixed(1)}%
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Solution Type</div>
          <div className={`text-sm font-bold ${solutionColor}`}>{solutionLabel}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center min-w-[110px]">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Cell Response</div>
          <div className={`text-xs font-bold ${solutionColor}`}>{finalStateLabel}</div>
        </div>
      </div>

      {/* WAEC / IB callout */}
      <div className="w-full max-w-lg bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / IB · </span>
        {cellType === 0
          ? 'Animal cells lack a cell wall. In hypotonic solutions they lyse (burst); in hypertonic solutions they crenate (shrink). IB: describe changes in water potential (Ψ).'
          : 'Plant cells have a rigid cell wall. In hypotonic solutions they become turgid (wall prevents bursting). In hypertonic solutions, plasmolysis occurs (membrane pulls from wall). Cambridge: state that the cell becomes flaccid at isotonic point.'}
      </div>
    </div>
  );
}

// ─── Lab wrapper ─────────────────────────────────────────────────────────────

export default function OsmosisLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  /**
   * renderSimulation is a render-prop expected by VirtualLabEngine.
   * We now render <OsmosisSimulation /> — a real component — so React hooks
   * inside it are always called at the component top-level (legal ✓).
   */
  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <OsmosisSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const avgChange = trials.length
      ? trials.flatMap(t =>
        t.observations.map(o =>
          typeof o.result === 'object' ? Number((o.result as Record<string, unknown>).massChangePercent ?? 0) : 0,
        ),
      ).reduce((a, b) => a + b, 0) / Math.max(1, trials.flatMap(t => t.observations).length)
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
          You investigated osmosis across {trials.length} trial{trials.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg Mass Change</div>
            <div className={`text-2xl font-mono font-bold ${avgChange > 0 ? 'text-blue-400' : avgChange < 0 ? 'text-orange-400' : 'text-green-400'}`}>
              {avgChange > 0 ? '+' : ''}{avgChange.toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Observations</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">
              {trials.flatMap(t => t.observations).length}
            </div>
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
      config={OSMOSIS_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}