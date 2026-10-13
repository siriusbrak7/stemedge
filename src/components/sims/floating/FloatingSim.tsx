import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { format3SF } from "@/lib/format";
import {
  computeFloating,
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
  const d = computeFloating(state);
  const waterY = 150;
  const blockH = 70;
  const submerged = d.fraction * blockH;
  const top = waterY - (blockH - submerged);

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader title="Floating & Sinking" syllabus="Syllabus 1.5.3" simNumber="#03" mode={mode} onMode={setMode} examLabel="Exam mode" onBackToHome={onBackToHome} />
        <ExamPlayer title="Density and Archimedes" paperLabel="Cambridge IGCSE 0625 · Paper 4" questions={generateFloatingExamQuestions()} onExit={() => setMode("explore")} />
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
            <rect width="560" height="280" fill="#0A0C10" />
            <rect x="80" y={waterY} width="400" height="110" fill="#0C4A6E" opacity="0.55" />
            <line x1="80" y1={waterY} x2="480" y2={waterY} stroke="#38BDF8" strokeWidth="2" />
            <rect x="80" y="150" width="8" height="110" fill="#1E293B" />
            <rect x="472" y="150" width="8" height="110" fill="#1E293B" />
            <rect x="80" y="252" width="400" height="8" fill="#1E293B" />
            <rect x="240" y={top} width="80" height={blockH} rx="4" fill="#1E2433" stroke="#F59E0B" strokeWidth="2" />
            <text x="280" y={top + 40} textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="monospace">
              {format3SF(state.objectDensity)} kg/m³
            </text>
            <text x="20" y="28" fill="#94A3B8" fontSize="11" fontFamily="monospace">
              {status} · {format3SF(d.fraction * 100)}% submerged
            </text>
            <text x="90" y="172" fill="#7DD3FC" fontSize="10" fontFamily="monospace">
              liquid {format3SF(state.liquidDensity)} kg/m³
            </text>
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
            <p className="font-mono text-[10px] uppercase text-ink-faint">Weight vs upthrust</p>
            <p className="mt-1 font-mono text-sm text-ink">
              W = {format3SF(d.weight)} N · U = {format3SF(d.upthrust)} N
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <Slider label="Object density" value={state.objectDensity} min={200} max={2000} step={10} unit="kg/m³" onChange={(objectDensity) => setState((s) => ({ ...s, objectDensity }))} />
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
    </div>
  );
}

function Slider({
  label, value, min, max, step, unit, onChange,
}: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="mt-2 flex flex-col gap-1">
      <span className="flex justify-between font-mono text-xs text-ink-muted">
        {label}
        <span className="font-bold text-amber-300">{format3SF(value)} {unit}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="h-1.5 w-full accent-amber-400" />
    </label>
  );
}
