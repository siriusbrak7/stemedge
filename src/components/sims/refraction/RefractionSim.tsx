import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { format3SF } from "@/lib/format";
import {
  computeRefraction,
  generateRefractionExamQuestions,
  getInitialRefractionState,
  type RefractionState,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

export function RefractionSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [state, setState] = useState<RefractionState>(getInitialRefractionState);
  const d = computeRefraction(state);

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader title="Light & Refraction" syllabus="Syllabus 3.2.3" simNumber="#05" mode={mode} onMode={setMode} examLabel="Exam mode" onBackToHome={onBackToHome} />
        <ExamPlayer title="Snell’s law and TIR" paperLabel="Cambridge IGCSE 0625 · Paper 4" questions={generateRefractionExamQuestions()} onExit={() => setMode("explore")} />
      </div>
    );
  }

  const cx = 280;
  const cy = 150;
  const len = 130;
  const iRad = (state.incidenceDeg * Math.PI) / 180;
  const fromBelow = state.denserToRarer;
  const incX = cx - Math.sin(iRad) * len;
  const incY = fromBelow ? cy + Math.cos(iRad) * len : cy - Math.cos(iRad) * len;
  const rRad = d.rDeg !== null ? (d.rDeg * Math.PI) / 180 : iRad;
  const outX = d.tir ? cx + Math.sin(iRad) * len : cx + Math.sin(rRad) * len;
  const outY = d.tir
    ? fromBelow
      ? cy + Math.cos(iRad) * len
      : cy - Math.cos(iRad) * len
    : fromBelow
      ? cy - Math.cos(rRad) * len
      : cy + Math.cos(rRad) * len;

  return (
    <div className="flex flex-col gap-3.5">
      <SimHeader title="Light & Refraction" syllabus="Syllabus 3.2.3 · Snell’s law" simNumber="#05" mode={mode} onMode={setMode} examLabel="Exam mode (4 questions)" onBackToHome={onBackToHome} />
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]">
        <div className="overflow-hidden rounded-xl border border-border-faint bg-inset">
          <svg viewBox="0 0 560 300" className="h-auto w-full">
            <rect width="560" height="300" fill="#0A0C10" />
            <rect x="0" y={fromBelow ? 0 : cy} width="560" height={fromBelow ? cy : 150} fill="#0E1A2E" />
            <rect x="0" y={fromBelow ? cy : 0} width="560" height={fromBelow ? 150 : cy} fill="#0A1220" />
            <line x1="40" y1={cy} x2="520" y2={cy} stroke="#64748B" strokeWidth="1.5" />
            <line x1={cx} y1="20" x2={cx} y2="280" stroke="#334155" strokeDasharray="4 4" />
            <line x1={incX} y1={incY} x2={cx} y2={cy} stroke="#FBBF24" strokeWidth="2.5" />
            <line
              x1={cx}
              y1={cy}
              x2={outX}
              y2={outY}
              stroke={d.tir ? "#38BDF8" : "#F59E0B"}
              strokeWidth="2.5"
            />
            <text x="20" y="24" fill="#94A3B8" fontSize="11" fontFamily="monospace">
              i = {format3SF(state.incidenceDeg)}° ·{" "}
              {d.tir ? "TIR" : `r = ${d.rDeg !== null ? format3SF(d.rDeg) : "—"}°`}
              {d.critical ? ` · c = ${format3SF(d.critical)}°` : ""}
            </text>
            <text x="20" y={fromBelow ? 44 : cy + 24} fill="#7DD3FC" fontSize="10" fontFamily="monospace">
              n = {format3SF(fromBelow ? d.nFrom : d.nTo)}
            </text>
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <p className="font-mono text-xs text-ink-muted">
              n₁ sin i = n₂ sin r · n = {format3SF(state.n2)}
            </p>
            {d.tir && (
              <p className="mt-2 rounded-lg border border-sky-500/30 bg-sky-500/10 p-2 text-xs text-sky-200">
                Total internal reflection — i is greater than the critical angle.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <Slider label="Angle of incidence" value={state.incidenceDeg} min={0} max={85} step={1} unit="°" onChange={(incidenceDeg) => setState((s) => ({ ...s, incidenceDeg }))} />
            <Slider label="Refractive index n₂" value={state.n2} min={1.2} max={1.8} step={0.01} unit="" onChange={(n2) => setState((s) => ({ ...s, n2 }))} />
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, denserToRarer: !s.denserToRarer }))}
              className="mt-3 w-full rounded-lg border border-border-subtle py-2 text-xs font-semibold text-ink-muted hover:text-accent"
            >
              Direction: {state.denserToRarer ? "denser → rarer (can TIR)" : "air → denser"}
            </button>
            <button type="button" onClick={() => setState(getInitialRefractionState())} className="mt-2 flex items-center gap-1 text-xs text-ink-muted hover:text-accent">
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
