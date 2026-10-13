import { useId, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { SimulationSlider as Slider } from "@/components/ui/SimulationControls";
import { format3SF } from "@/lib/format";
import {
  computeFloating,
  evaluateFloatingTasks,
  FLOATING_PRESETS,
  FLOATING_TASKS,
  generateFloatingExamQuestions,
  getInitialFloatingState,
  type FloatingState,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

export function FloatingSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [state, setState] = useState<FloatingState>(getInitialFloatingState);
  const [taskId, setTaskId] = useState(1);
  const d = computeFloating(state);
  const taskResults = evaluateFloatingTasks(state, d);
  const currentTask = FLOATING_TASKS.find((task) => task.id === taskId) ?? FLOATING_TASKS[0];
  const clipId = useId();
  const waterY = 150;
  const blockH = Math.cbrt(state.volumeM3 / 0.002) * 70;
  const blockX = (560 - blockH) / 2;
  const top = d.sinks
    ? 252 - blockH
    : d.suspends
      ? waterY + 55 - blockH / 2
      : waterY - blockH * (1 - d.fraction);
  const submergedTop = Math.max(waterY, top);
  const submergedHeight = Math.max(0, Math.min(top + blockH, 252) - submergedTop);
  const forceScale = Math.max(d.weight, d.upthrust, d.normalReaction, 1);
  const weightArrow = Math.max(8, (d.weight / forceScale) * 44);
  const upthrustArrow = Math.max(8, (d.upthrust / forceScale) * 44);
  const normalArrow = Math.max(0, (d.normalReaction / forceScale) * 44);

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader title="Floating & Sinking" syllabus="Syllabus 1.5.3" simNumber="#03" mode={mode} onMode={setMode} examLabel="Exam mode" onBackToHome={onBackToHome} />
        <ExamPlayer simId="floating" title="Density and Archimedes" paperLabel="Cambridge IGCSE 0625 · Paper 4" questionFactory={generateFloatingExamQuestions} onExit={() => setMode("explore")} />
      </div>
    );
  }

  const status = d.sinks ? "Sinks" : d.suspends ? "Suspended" : "Floats";

  return (
    <div className="flex flex-col gap-3.5">
      <SimHeader title="Floating & Sinking" syllabus="Syllabus 1.5.3 · Archimedes" simNumber="#03" mode={mode} onMode={setMode} examLabel="Exam mode (4 questions)" onBackToHome={onBackToHome} />
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]">
        <div className="overflow-hidden rounded-xl border border-border-faint bg-inset">
          <svg viewBox="0 0 560 280" className="h-auto w-full">
            <defs>
              <clipPath id={clipId}>
                <rect x={blockX} y={top} width={blockH} height={blockH} rx="4" />
              </clipPath>
              <marker id={`${clipId}-arrow`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0 0 L7 3.5 L0 7 Z" fill="#FBBF24" />
              </marker>
              <marker id={`${clipId}-blue-arrow`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0 0 L7 3.5 L0 7 Z" fill="#38BDF8" />
              </marker>
            </defs>
            <rect width="560" height="280" fill="#0A0C10" />
            <rect x="80" y={waterY} width="400" height="110" fill="#0C4A6E" opacity="0.55" />
            <line x1="80" y1={waterY} x2="480" y2={waterY} stroke="#38BDF8" strokeWidth="2" />
            <rect x="80" y="150" width="8" height="110" fill="#1E293B" />
            <rect x="472" y="150" width="8" height="110" fill="#1E293B" />
            <rect x="80" y="252" width="400" height="8" fill="#1E293B" />
            <rect x={blockX} y={top} width={blockH} height={blockH} rx="4" fill="#1E2433" stroke="#F59E0B" strokeWidth="2" className="transition-[y] duration-500" />
            <rect x={blockX} y={submergedTop} width={blockH} height={submergedHeight} fill="#38BDF8" opacity="0.42" clipPath={`url(#${clipId})`} className="transition-[y,height] duration-500" />
            <text x="280" y={Math.min(240, top + blockH / 2 + 4)} textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="monospace">
              {format3SF(state.objectDensity)} kg/m³
            </text>
            <line x1="205" y1={top + blockH / 2} x2="205" y2={top + blockH / 2 + weightArrow} stroke="#FBBF24" strokeWidth="2.2" markerEnd={`url(#${clipId}-arrow)`} />
            <text x="190" y={top + blockH / 2 + weightArrow + 14} fill="#FBBF24" fontSize="10" fontFamily="monospace">W</text>
            <line x1="355" y1={top + blockH / 2} x2="355" y2={top + blockH / 2 - upthrustArrow} stroke="#38BDF8" strokeWidth="2.2" markerEnd={`url(#${clipId}-blue-arrow)`} />
            <text x="361" y={top + blockH / 2 - upthrustArrow - 3} fill="#38BDF8" fontSize="10" fontFamily="monospace">U</text>
            {d.sinks && (
              <g>
                <line x1="330" y1="248" x2="330" y2={248 - normalArrow} stroke="#34D399" strokeWidth="2.2" markerEnd={`url(#${clipId}-blue-arrow)`} />
                <text x="337" y={248 - normalArrow} fill="#34D399" fontSize="9" fontFamily="monospace">N</text>
              </g>
            )}
            <text x="20" y="28" fill="#94A3B8" fontSize="11" fontFamily="monospace">
              {status} · {format3SF(d.fraction * 100)}% submerged
            </text>
            <text x="90" y="172" fill="#7DD3FC" fontSize="10" fontFamily="monospace">
              liquid {format3SF(state.liquidDensity)} kg/m³
            </text>
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <div aria-live="polite" aria-atomic="true" className="grid grid-cols-2 gap-2 font-mono text-xs">
              <FloatingReadout label="Density" value={`${format3SF(state.objectDensity)} kg/m³`} />
              <FloatingReadout label="Submerged" value={`${format3SF(d.fraction * 100)}%`} />
              <FloatingReadout label="Weight W" value={`${format3SF(d.weight)} N`} />
              <FloatingReadout label="Upthrust U" value={`${format3SF(d.upthrust)} N`} />
              <FloatingReadout label="Normal reaction" value={`${format3SF(d.normalReaction)} N`} />
              <FloatingReadout label="Net force" value={`${format3SF(d.netForce)} N`} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FLOATING_PRESETS.map((preset) => (
                <button key={preset.name} type="button" onClick={() => setState((s) => ({ ...s, objectDensity: preset.objectDensity, liquidDensity: preset.liquidDensity }))} className="rounded-md border border-border-subtle px-2 py-1.5 text-[11px] font-semibold text-ink-muted hover:border-accent/50 hover:text-accent">
                  {preset.name}
                </button>
              ))}
            </div>
            <Slider label="Object density" value={state.objectDensity} min={200} max={8000} step={10} unit="kg/m³" onChange={(objectDensity) => setState((s) => ({ ...s, objectDensity }))} />
            <Slider label="Liquid density" value={state.liquidDensity} min={600} max={1400} step={10} unit="kg/m³" onChange={(liquidDensity) => setState((s) => ({ ...s, liquidDensity }))} />
            <Slider
              label="Volume"
              value={state.volumeM3 * 1_000_000}
              min={500}
              max={5000}
              step={100}
              unit="cm³"
              onChange={(volumeCm3) =>
                setState((s) => ({ ...s, volumeM3: volumeCm3 / 1_000_000 }))
              }
            />
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Floats when object density is less than liquid density — then V_sub/V equals ρ_object/ρ_liquid. Sinks when weight exceeds maximum upthrust.
            </p>
            <button type="button" onClick={() => setState(getInitialFloatingState())} className="mt-2 flex items-center gap-1 text-xs text-ink-muted hover:text-accent">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {FLOATING_TASKS.map((task) => (
            <button key={task.id} type="button" onClick={() => setTaskId(task.id)} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${taskId === task.id ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"}`}>
              {taskResults[task.id] ? "✓" : "○"} Task {task.id}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-ink">{currentTask.title}</p>
        <p className="mt-1 text-xs text-ink-muted">{currentTask.prompt}</p>
      </div>
    </div>
  );
}

function FloatingReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-faint bg-inset p-2">
      <p className="text-[10px] text-ink-faint">{label}</p>
      <p className="mt-1 font-bold tabular-nums text-accent">{value}</p>
    </div>
  );
}

