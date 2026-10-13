import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lightbulb, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { format3SF } from "@/lib/format";
import { ForcesCanvas } from "./ForcesCanvas";
import { ForcesGraphs, type MotionSample } from "./ForcesGraphs";
import {
  FORCES_PRESETS,
  MOTION_TASKS,
  computeForces,
  evaluateMotionTasks,
  generateForcesExamQuestions,
  getInitialForcesState,
  stepMotion,
  type ForcesPreset,
  type ForcesState,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

export function ResultantForcesSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [state, setState] = useState<ForcesState>(getInitialForcesState);
  const [taskId, setTaskId] = useState(1);
  const [position, setPosition] = useState(1.2);
  const [velocity, setVelocity] = useState(0);
  const [samples, setSamples] = useState<MotionSample[]>([{ t: 0, v: 0, s: 1.2 }]);
  const [hitEnd, setHitEnd] = useState<"min" | "max" | null>(null);

  const timeRef = useRef(0);
  const vRef = useRef(0);
  const sRef = useRef(1.2);
  const sampleAcc = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const derived = computeForces(state, velocity);
  const tasksDone = evaluateMotionTasks({
    resultantN: derived.resultantN,
    acceleration: derived.acceleration,
    velocity,
    massKg: state.massKg,
    frictionN: state.frictionN,
    running: state.running,
    timeS: samples[samples.length - 1]?.t ?? 0,
  });
  const currentTask = MOTION_TASKS.find((t) => t.id === taskId) ?? MOTION_TASKS[0];

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = stateRef.current;
      if (st.running) {
        const inst = computeForces(st, vRef.current);
        const next = stepMotion(
          sRef.current,
          vRef.current,
          inst.acceleration,
          dt,
          st.frictionN,
          inst.appliedN,
        );
        vRef.current = next.velocity;
        sRef.current = next.position;
        timeRef.current += dt;
        sampleAcc.current += dt;
        setVelocity(next.velocity);
        setPosition(next.position);
        setHitEnd(next.hitEnd);
        if (next.hitEnd) {
          setState((prev) => ({ ...prev, running: false }));
        }
        if (sampleAcc.current >= 0.05) {
          sampleAcc.current = 0;
          const t = timeRef.current;
          const v = next.velocity;
          const s = next.position;
          setSamples((prev) => {
            const row = [...prev, { t, v, s }];
            return row.length > 240 ? row.slice(-240) : row;
          });
        }
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  function hardReset(next?: Partial<ForcesState> & { velocity?: number; position?: number }) {
    const base = getInitialForcesState();
    const merged: ForcesState = {
      ...base,
      ...next,
      running: false,
    };
    const v0 = next?.velocity ?? 0;
    const s0 = next?.position ?? 1.2;
    setState(merged);
    setVelocity(v0);
    setPosition(s0);
    setSamples([{ t: 0, v: v0, s: s0 }]);
    setHitEnd(null);
    timeRef.current = 0;
    vRef.current = v0;
    sRef.current = s0;
    sampleAcc.current = 0;
  }

  function applyPreset(p: ForcesPreset) {
    hardReset({
      leftN: p.leftN,
      rightN: p.rightN,
      frictionN: p.frictionN,
      massKg: p.massKg,
      velocity: p.velocity,
      position: p.position,
    });
  }

  function nudge() {
    const v = vRef.current + 2;
    vRef.current = v;
    setVelocity(v);
    if (!state.running) setState((s) => ({ ...s, running: true }));
  }

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader
          title="Resultant Forces & Motion"
          syllabus="Syllabus 1.5.1 · F = ma"
          simNumber="#01"
          mode={mode}
          onMode={setMode}
          examLabel="Exam mode (6 questions)"
          onBackToHome={onBackToHome}
        />
        <ExamPlayer
          title="Forces, Newton’s laws and graphs"
          paperLabel="Cambridge IGCSE 0625 · Paper 4"
          questions={generateForcesExamQuestions()}
          onExit={() => setMode("explore")}
        />
      </div>
    );
  }

  const coach = !state.running
    ? "Press Run, or Nudge to give the trolley +2 m/s. Force arrows sit on the trolley and scale with size."
    : derived.newton === "first"
      ? "F_res is zero, so a = 0. Velocity holds whatever value it already has (Newton 1)."
      : `Unbalanced: a = ${format3SF(derived.acceleration)} m/s². The v–t graph should be a straight slope of that gradient.`;

  return (
    <div className="flex flex-col gap-3.5">
      <SimHeader
        title="Resultant Forces & Motion"
        syllabus="Syllabus 1.5.1 · F = ma"
        simNumber="#01"
        mode={mode}
        onMode={setMode}
        examLabel="Exam mode (6 questions)"
        onBackToHome={onBackToHome}
      />

      <div className="flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {MOTION_TASKS.map((t) => {
              const done = tasksDone[t.id];
              const selected = t.id === currentTask.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTaskId(t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                    selected ? "bg-accent text-accent-fg" : "border border-border-subtle bg-muted-bg text-ink-muted"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className={`h-3.5 w-3.5 ${selected ? "text-accent-fg" : "text-emerald-400"}`} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  )}
                  Task {t.id}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FORCES_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                title={p.description}
                onClick={() => applyPreset(p)}
                className="rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
            Task {currentTask.id}: {currentTask.title}
          </span>
          <p className="mt-1 text-sm font-medium leading-relaxed text-ink">{currentTask.prompt}</p>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-border-faint bg-inset p-2 text-xs text-ink-muted">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          {coach}
        </div>
        {tasksDone[currentTask.id] && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-xs text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Verified. {currentTask.id === 1 && "Coasting with F_res = 0 is Newton’s first law."}
            {currentTask.id === 2 && "Gradient of a straight v–t graph is a."}
            {currentTask.id === 3 && "Same F, larger m, smaller a."}
            {currentTask.id === 4 && "Friction is a force: include it in F_res before F = ma."}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-3">
          <ForcesCanvas
            state={state}
            derived={derived}
            positionM={position}
            velocity={velocity}
            hitEnd={hitEnd}
          />
          <ForcesGraphs samples={samples} acceleration={derived.acceleration} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Readout
              label="Resultant F"
              value={`${format3SF(derived.resultantN)} N`}
              hint={derived.newton === "first" ? "balanced" : derived.resultantN > 0 ? "to the right" : "to the left"}
              highlight
            />
            <Readout label="Acceleration" value={`${format3SF(derived.acceleration)} m/s²`} hint="a = F_res / m" />
            <Readout label="Velocity" value={`${format3SF(velocity)} m/s`} hint="gradient of s–t" />
            <Readout label="Displacement" value={`${format3SF(position)} m`} hint="area under v–t" />
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface p-3">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">
              {derived.formulaLine}
            </p>
            <Slider
              label="Force left"
              value={state.leftN}
              min={0}
              max={20}
              step={0.5}
              unit="N"
              onChange={(leftN) => setState((s) => ({ ...s, leftN }))}
            />
            <Slider
              label="Force right"
              value={state.rightN}
              min={0}
              max={20}
              step={0.5}
              unit="N"
              onChange={(rightN) => setState((s) => ({ ...s, rightN }))}
            />
            <Slider
              label="Friction"
              value={state.frictionN}
              min={0}
              max={10}
              step={0.5}
              unit="N"
              onChange={(frictionN) => setState((s) => ({ ...s, frictionN }))}
            />
            <Slider
              label="Mass"
              value={state.massKg}
              min={0.5}
              max={5}
              step={0.1}
              unit="kg"
              onChange={(massKg) => setState((s) => ({ ...s, massKg }))}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, running: !s.running }))}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-bold text-accent-fg"
              >
                {state.running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {state.running ? "Pause" : "Run"}
              </button>
              <button
                type="button"
                onClick={nudge}
                className="flex min-h-11 items-center gap-1 rounded-lg border border-border-subtle px-3 text-xs font-semibold text-ink-muted hover:text-accent"
              >
                <Zap className="h-3.5 w-3.5" />
                Nudge +2 m/s
              </button>
              <button
                type="button"
                onClick={() => hardReset()}
                className="flex min-h-11 items-center gap-1 rounded-lg border border-border-subtle px-3 text-xs text-ink-muted hover:text-accent"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border-faint bg-muted-bg p-3 text-[11px] leading-relaxed text-ink-muted">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">Cambridge notes</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
              <li>Gradient of a v–t graph is acceleration.</li>
              <li>Area under a v–t graph is displacement.</li>
              <li>F = 0 means constant velocity — including already moving.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? "border-accent/30 bg-accent/10" : "border-border-subtle bg-surface"
      }`}
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold tabular-nums text-accent">{value}</p>
      <p className="mt-0.5 text-[10px] text-ink-faint">{hint}</p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-2 flex flex-col gap-1">
      <span className="flex justify-between font-mono text-xs text-ink-muted">
        {label}
        <span className="font-bold tabular-nums text-amber-300">
          {format3SF(value)} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-amber-400"
      />
    </label>
  );
}
