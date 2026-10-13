import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { SimulationReadout as Readout, SimulationSlider as Slider } from "@/components/ui/SimulationControls";
import { format3SF } from "@/lib/format";
import {
  computeRefraction,
  evaluateRefractionTasks,
  generateRefractionExamQuestions,
  getInitialRefractionState,
  REFRACTION_PRESETS,
  REFRACTION_TASKS,
  type RefractionState,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

export function RefractionSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [state, setState] = useState<RefractionState>(getInitialRefractionState);
  const [taskId, setTaskId] = useState(1);
  const d = computeRefraction(state);
  const taskResults = evaluateRefractionTasks(state, d);
  const currentTask = REFRACTION_TASKS.find((task) => task.id === taskId) ?? REFRACTION_TASKS[0];

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader title="Light & Refraction" syllabus="Syllabus 3.2.3" simNumber="#05" mode={mode} onMode={setMode} examLabel="Exam mode" onBackToHome={onBackToHome} />
        <ExamPlayer simId="refraction" title="Snell’s law and TIR" paperLabel="Cambridge IGCSE 0625 · Paper 4" questionFactory={generateRefractionExamQuestions} onExit={() => setMode("explore")} />
      </div>
    );
  }

  const cx = 280;
  const cy = 150;
  const len = 130;
  const iRad = (state.incidenceDeg * Math.PI) / 180;
  const fromBelow = state.denserToRarer;
  const sourceSign = fromBelow ? 1 : -1;
  const targetSign = -sourceSign;
  const incX = cx - Math.sin(iRad) * len;
  const incY = cy + sourceSign * Math.cos(iRad) * len;
  const rRad = d.rDeg !== null ? (d.rDeg * Math.PI) / 180 : iRad;
  const reflectedX = cx + Math.sin(iRad) * len;
  const reflectedY = cy + sourceSign * Math.cos(iRad) * len;
  const refractedX = cx + Math.sin(rRad) * len;
  const refractedY = cy + targetSign * Math.cos(rRad) * len;
  const outX = d.tir ? reflectedX : refractedX;
  const outY = d.tir ? reflectedY : refractedY;
  const iArcEndX = cx - Math.sin(iRad) * 34;
  const iArcEndY = cy + sourceSign * Math.cos(iRad) * 34;
  const rArcEndX = cx + Math.sin(rRad) * 34;
  const rArcEndY = cy + targetSign * Math.cos(rRad) * 34;
  const materialLabel = state.material === "custom" ? "Medium" : `${state.material[0].toUpperCase()}${state.material.slice(1)}`;
  const ratioText = d.observedRatio === null ? "—" : format3SF(d.observedRatio);

  return (
    <div className="flex flex-col gap-3.5">
      <SimHeader title="Light & Refraction" syllabus="Syllabus 3.2.3 · Snell’s law" simNumber="#05" mode={mode} onMode={setMode} examLabel="Exam mode (4 questions)" onBackToHome={onBackToHome} />
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]">
        <div className="overflow-hidden rounded-xl border border-border-faint bg-inset">
          <svg viewBox="0 0 560 300" className="h-auto w-full">
            <rect width="560" height="300" fill="#0A0C10" />
            <rect x="0" y="0" width="560" height={cy} fill="#0A1220" />
            <rect x="0" y={cy} width="560" height="150" fill="#0E1A2E" />
            <line x1="40" y1={cy} x2="520" y2={cy} stroke="#64748B" strokeWidth="1.5" />
            <line x1={cx} y1="20" x2={cx} y2="280" stroke="#334155" strokeDasharray="4 4" />
            <text x="24" y="38" fill="#94A3B8" fontSize="11" fontFamily="monospace">Air · n = 1.00</text>
            <text x="24" y={cy + 25} fill="#7DD3FC" fontSize="11" fontFamily="monospace">{materialLabel} · n = {format3SF(state.n2)}</text>
            <text x={cx + 8} y="44" fill="#64748B" fontSize="10" fontFamily="monospace">normal</text>
            {!d.tir && (
              <line
                x1={cx}
                y1={cy}
                x2={reflectedX}
                y2={reflectedY}
                stroke="#CBD5E1"
                strokeWidth="1.8"
                strokeDasharray="5 5"
                opacity="0.42"
              />
            )}
            <line x1={incX} y1={incY} x2={cx} y2={cy} stroke="#FBBF24" strokeWidth="2.5" />
            <line
              x1={cx}
              y1={cy}
              x2={outX}
              y2={outY}
              stroke={d.tir ? "#38BDF8" : "#F59E0B"}
              strokeWidth="2.5"
            />
            <path d={`M ${cx} ${cy + sourceSign * 34} A 34 34 0 0 0 ${iArcEndX} ${iArcEndY}`} fill="none" stroke="#FBBF24" strokeWidth="1.4" />
            {!d.tir && <path d={`M ${cx} ${cy + targetSign * 34} A 34 34 0 0 1 ${rArcEndX} ${rArcEndY}`} fill="none" stroke="#38BDF8" strokeWidth="1.4" />}
            <text x={cx - Math.sin(iRad / 2) * 48} y={cy + sourceSign * Math.cos(iRad / 2) * 48} fill="#FBBF24" fontSize="11" fontFamily="monospace">i</text>
            {!d.tir && <text x={cx + Math.sin(rRad / 2) * 48} y={cy + targetSign * Math.cos(rRad / 2) * 48} fill="#38BDF8" fontSize="11" fontFamily="monospace">r</text>}
            <text x={(incX + cx) / 2 - 12} y={(incY + cy) / 2} fill="#FBBF24" fontSize="10" fontFamily="monospace">incident ray</text>
            <text x={(outX + cx) / 2 + 8} y={(outY + cy) / 2} fill={d.tir ? "#38BDF8" : "#F59E0B"} fontSize="10" fontFamily="monospace">
              {d.tir ? "reflected ray · TIR" : "refracted ray"}
            </text>
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <Readout label="sin i" value={format3SF(d.sinI)} hint="incident angle" compact />
              <Readout label="sin r" value={d.sinR === null ? "—" : format3SF(d.sinR)} hint="refracted angle" compact />
              <Readout label="n = sin i / sin r" value={ratioText} hint="live ratio" compact />
              <Readout label="Critical angle" value={d.critical === null ? "—" : `${format3SF(d.critical)}°`} hint="denser → rarer" compact />
            </div>
            <p className="mt-3 border-t border-border-faint pt-2 font-mono text-[11px] leading-relaxed text-ink-muted">
              {d.tir
                ? `i = ${format3SF(state.incidenceDeg)}° > c = ${format3SF(d.critical ?? 0)}° · total internal reflection`
                : d.rDeg === null
                  ? "sin r is zero at normal incidence; the ratio is undefined."
                  : `${format3SF(d.nFrom)} × sin ${format3SF(state.incidenceDeg)}° = ${format3SF(d.nTo)} × sin ${format3SF(d.rDeg)}°`}
            </p>
            {d.tir && (
              <p className="mt-2 rounded-lg border border-sky-500/30 bg-sky-500/10 p-2 text-xs text-sky-200">
                Total internal reflection — i is greater than the critical angle.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <Slider label="Angle of incidence" value={state.incidenceDeg} min={0} max={85} step={1} unit="°" onChange={(incidenceDeg) => setState((s) => ({ ...s, incidenceDeg }))} />
            <Slider label={`Refractive index n₂ · ${materialLabel}`} value={state.n2} min={1.2} max={2.5} step={0.01} unit="" onChange={(n2) => setState((s) => ({ ...s, n2, material: "custom" }))} />
            <div className="mt-3 grid grid-cols-2 rounded-lg border border-border-subtle bg-inset p-1" role="group" aria-label="Ray direction">
              <button type="button" aria-pressed={!state.denserToRarer} onClick={() => setState((s) => ({ ...s, denserToRarer: false }))} className={`rounded-md px-2 py-2 text-xs font-semibold ${!state.denserToRarer ? "bg-accent text-accent-fg" : "text-ink-muted"}`}>
                Air → glass
              </button>
              <button type="button" aria-pressed={state.denserToRarer} onClick={() => setState((s) => ({ ...s, denserToRarer: true }))} className={`rounded-md px-2 py-2 text-xs font-semibold ${state.denserToRarer ? "bg-accent text-accent-fg" : "text-ink-muted"}`}>
                Glass → air
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {REFRACTION_PRESETS.map((preset) => (
                <button key={preset.name} type="button" onClick={() => setState((s) => ({ ...s, n2: preset.n, material: preset.material }))} className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold ${state.material === preset.material ? "border-accent/50 bg-accent/10 text-accent" : "border-border-subtle text-ink-muted hover:text-accent"}`}>
                  {preset.name} · {format3SF(preset.n)}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setState(getInitialRefractionState())} className="mt-2 flex items-center gap-1 text-xs text-ink-muted hover:text-accent">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {REFRACTION_TASKS.map((task) => (
            <button key={task.id} type="button" onClick={() => setTaskId(task.id)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${task.id === taskId ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"}`}>
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

