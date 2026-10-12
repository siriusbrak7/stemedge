import React, { useState, useCallback } from 'react';
import {
  ElectromagnetismState,
  ElectromagnetismExamQuestion,
  getInitialElectromagnetismState,
  computeElectromagnetism,
  generateElectromagnetismExamQuestions,
  ElectromagnetismPreset,
} from './physics';
import { MotorEffectCanvas } from './MotorEffectCanvas';
import { MagneticFieldCanvas } from './MagneticFieldCanvas';
import { ElectromagnetismReadouts } from './ElectromagnetismReadouts';
import { ElectromagnetismControls } from './ElectromagnetismControls';
import { ElectromagnetismExamMode } from './ElectromagnetismExamMode';
import { Magnet, GraduationCap, Compass, ArrowLeft, Zap, Waves } from 'lucide-react';

interface ElectromagnetismSimProps {
  onBackToHome?: () => void;
}

export const ElectromagnetismSim: React.FC<ElectromagnetismSimProps> = ({
  onBackToHome,
}) => {
  const [mode, setMode] = useState<'explore' | 'exam'>('explore');

  // Live simulation state
  const [state, setState] = useState<ElectromagnetismState>(
    getInitialElectromagnetismState
  );

  // Exam mode snapshot
  const [examSnapshot, setExamSnapshot] = useState<ElectromagnetismState | null>(null);
  const [examQuestions, setExamQuestions] = useState<ElectromagnetismExamQuestion[]>(
    []
  );

  // Computed values (derived from state — instant, no debounce needed)
  const calculated = computeElectromagnetism(state);

  // ── Mode switching ──────────────────────────────────────────────────────────
  const handleEnterExam = () => {
    const snapshot = { ...state };
    setExamSnapshot(snapshot);
    setExamQuestions(generateElectromagnetismExamQuestions());
    setMode('exam');
  };

  const handleReturnToExplore = () => {
    setMode('explore');
  };

  // ── Slider handlers (immediate update) ─────────────────────────────────────
  const handleChangeCurrentA = useCallback((val: number) => {
    setState((prev) => ({ ...prev, currentA: val }));
  }, []);

  const handleChangeBFieldT = useCallback((val: number) => {
    setState((prev) => ({ ...prev, bFieldT: val }));
  }, []);

  const handleChangeLengthM = useCallback((val: number) => {
    setState((prev) => ({ ...prev, lengthM: val }));
  }, []);

  const handleApplyPreset = useCallback((preset: ElectromagnetismPreset) => {
    setState((prev) => ({
      ...prev,
      currentA: preset.currentA,
      bFieldT: preset.bFieldT,
      lengthM: preset.lengthM,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState(getInitialElectromagnetismState());
  }, []);

  const handleSetSubMode = useCallback((subMode: 'motor' | 'field') => {
    setState((prev) => ({ ...prev, subMode }));
  }, []);

  return (
    <div id="electromagnetism-sim-root" className="flex flex-col gap-3.5 w-full">
      {/* ── Sub-Header Bar ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2432]">
        <div className="flex items-center gap-2.5">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="p-1.5 rounded-lg bg-[#141722] border border-[#232938] hover:bg-[#1E2333] text-slate-300 hover:text-amber-400 transition-colors"
              title="Return to STEMEdge Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">Electromagnetism</h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 hidden sm:inline">
              Syllabus 4.5
            </span>
          </div>
        </div>

        {/* Mode pill */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0E1017] border border-[#232938]">
          <button
            type="button"
            onClick={handleReturnToExplore}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'explore'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Mode</span>
          </button>

          <button
            type="button"
            onClick={handleEnterExam}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'exam'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Exam Mode (6 Questions)</span>
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3.5 items-start">
          {/* Left column (60%) — Canvas + sub-mode switcher */}
          <div className="flex flex-col gap-3">
            {/* Sub-mode switcher pill */}
            <div className="flex items-center self-start p-0.5 rounded-lg bg-[#0E1017] border border-[#232938]">
              <button
                type="button"
                onClick={() => handleSetSubMode('motor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  state.subMode === 'motor'
                    ? 'bg-[#1E2333] text-amber-300 border border-amber-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Motor Effect
              </button>
              <button
                type="button"
                onClick={() => handleSetSubMode('field')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  state.subMode === 'field'
                    ? 'bg-[#1E2333] text-amber-300 border border-amber-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                Magnetic Field
              </button>
            </div>

            {/* Canvas */}
            {state.subMode === 'motor' ? (
              <MotorEffectCanvas state={state} calculated={calculated} />
            ) : (
              <MagneticFieldCanvas state={state} calculated={calculated} />
            )}
          </div>

          {/* Right column (40%) — Readouts + Controls */}
          <div className="flex flex-col gap-3">
            <ElectromagnetismReadouts state={state} calculated={calculated} />
            <ElectromagnetismControls
              state={state}
              calculated={calculated}
              onChangeCurrentA={handleChangeCurrentA}
              onChangeBFieldT={handleChangeBFieldT}
              onChangeLengthM={handleChangeLengthM}
              onApplyPreset={handleApplyPreset}
              onReset={handleReset}
            />
          </div>
        </div>
      ) : (
        <ElectromagnetismExamMode
          questions={examQuestions}
          snapshot={examSnapshot || state}
          onReturnToExplore={handleReturnToExplore}
        />
      )}
    </div>
  );
};
