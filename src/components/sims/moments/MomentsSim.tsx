import { useMemo, useState } from "react";
import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { format3SF, isWithinTolerance } from "@/lib/format";
import { AngleForceCanvas } from "./AngleForceCanvas";
import { MetreRuleCanvas } from "./MetreRuleCanvas";
import {
  MOMENT_TASKS,
  computeAngleMoment,
  computeMoments,
  evaluateMomentTasks,
  generateMomentsExamQuestions,
  getInitialAngleState,
  getInitialMomentsState,
  mysteryPreset,
  type AngleState,
  type MomentsState,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

export function MomentsSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [lab, setLab] = useState<"rule" | "angle">("rule");
  const [state, setState] = useState<MomentsState>(getInitialMomentsState);
  const [angle, setAngle] = useState<AngleState>(getInitialAngleState);
  const [taskId, setTaskId] = useState(1);
  const [guess, setGuess] = useState("");
  const [mysterySolved, setMysterySolved] = useState(false);
  const [guessMsg, setGuessMsg] = useState<string | null>(null);

  const derived = useMemo(() => computeMoments(state), [state]);
  const angleD = useMemo(() => computeAngleMoment(angle), [angle]);
  const tasksDone = evaluateMomentTasks(state, derived, mysterySolved);
  const currentTask = MOMENT_TASKS.find((t) => t.id === taskId) ?? MOMENT_TASKS[0];
  const hidden = state.loads.find((l) => l.hidden);

  function resetRule() {
    setState(getInitialMomentsState());
    setGuess("");
    setMysterySolved(false);
    setGuessMsg(null);
  }

  function checkMystery() {
    if (!hidden) {
      setGuessMsg("Load the mystery preset first.");
      return;
    }
    const n = Number(guess);
    if (!Number.isFinite(n)) {
      setGuessMsg("Enter a mass in kg.");
      return;
    }
    if (isWithinTolerance(n, hidden.massKg, 4)) {
      setMysterySolved(true);
      setGuessMsg(`Yes — the hidden mass is ${format3SF(hidden.massKg)} kg.`);
      setState((s) => ({
        ...s,
        loads: s.loads.map((l) => (l.hidden ? { ...l, hidden: false } : l)),
      }));
    } else {
      setGuessMsg("Not yet. Use m1 d1 = m2 d2, with distances from the pivot.");
    }
  }

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader
          title="Principle of Moments"
          syllabus="Syllabus 1.5.2 · moment = F × d"
          simNumber="#02"
          mode={mode}
          onMode={setMode}
          examLabel="Exam mode (6 questions)"
          onBackToHome={onBackToHome}
        />
        <ExamPlayer
          title="Moments, equilibrium and perpendicular distance"
          paperLabel="Cambridge IGCSE 0625 · Paper 4"
          questions={generateMomentsExamQuestions()}
          onExit={() => setMode("explore")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <SimHeader
        title="Principle of Moments"
        syllabus="Syllabus 1.5.2 · moment = F × d_perp"
        simNumber="#02"
        mode={mode}
        onMode={setMode}
        examLabel="Exam mode (6 questions)"
        onBackToHome={onBackToHome}
      />

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setLab("rule")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            lab === "rule" ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"
          }`}
        >
          Metre-rule lab
        </button>
        <button
          type="button"
          onClick={() => setLab("angle")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            lab === "angle" ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"
          }`}
        >
          Force at an angle
        </button>
      </div>

      {lab === "rule" ? (
        <>
          <div className="flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {MOMENT_TASKS.map((t) => {
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
                <button
                  type="button"
                  onClick={() => {
                    setState(getInitialMomentsState());
                    setGuessMsg(null);
                    setMysterySolved(false);
                  }}
                  className="rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent"
                >
                  Equal masses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setState({
                      pivotM: 0.5,
                      ruleMassKg: 0.12,
                      includeRule: false,
                      loads: [
                        { id: "h", massKg: 2, posM: 0.3 },
                        { id: "l", massKg: 1, posM: 0.7 },
                      ],
                    });
                    setTaskId(2);
                  }}
                  className="rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent"
                >
                  2 kg vs 1 kg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setState(mysteryPreset());
                    setGuess("");
                    setMysterySolved(false);
                    setGuessMsg(null);
                    setTaskId(4);
                  }}
                  className="rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent"
                >
                  Mystery mass
                </button>
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
              {derived.balanced
                ? "The rule is in equilibrium: clockwise moments equal anticlockwise moments."
                : "Drag a mass along the rule, or move the pivot, until the two moment totals match."}
            </div>
            {tasksDone[currentTask.id] && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-xs text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Verified. {currentTask.id === 1 && "Equal masses at equal arms is the simplest case of the principle."}
                {currentTask.id === 2 && "2.0 × 0.20 m = 1.0 × 0.40 m."}
                {currentTask.id === 3 && "A uniform rule’s weight acts at its centre — the 50 cm mark."}
                {currentTask.id === 4 && "Unknown mass from m1 d1 = m2 d2. That is Paper 6."}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]">
            <div className="flex flex-col gap-3">
              <MetreRuleCanvas state={state} derived={derived} onChange={setState} />
              <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface">
                <table className="w-full min-w-[28rem] text-left font-mono text-xs">
                  <thead className="text-[10px] tracking-wider text-ink-faint">
                    <tr className="border-b border-border-faint">
                      <th className="px-3 py-2 font-medium">Load</th>
                      <th className="px-3 py-2 font-medium">Weight / N</th>
                      <th className="px-3 py-2 font-medium">d⊥ / m</th>
                      <th className="px-3 py-2 font-medium">Moment / N m</th>
                      <th className="px-3 py-2 font-medium">Sense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {derived.terms.map((t) => {
                      const mysteryRow = t.label === "?";
                      return (
                        <tr key={t.id} className="border-b border-border-faint">
                          <td className="px-3 py-1.5 text-ink">{t.label}</td>
                          <td className="px-3 py-1.5 tabular-nums text-ink-muted">
                            {mysteryRow ? "?" : format3SF(t.weightN)}
                          </td>
                          <td className="px-3 py-1.5 tabular-nums text-ink-muted">{format3SF(t.armM)}</td>
                          <td className="px-3 py-1.5 tabular-nums text-accent">
                            {mysteryRow ? "?" : format3SF(t.momentNm)}
                          </td>
                          <td className="px-3 py-1.5 uppercase text-ink-muted">{t.sense === "none" ? "—" : t.sense}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                className={`rounded-xl border p-3 ${
                  derived.balanced ? "border-emerald-500/40 bg-emerald-500/10" : "border-border-subtle bg-surface"
                }`}
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                  Principle of moments
                </p>
                <p className="mt-1 font-mono text-sm text-ink">{derived.formulaLine}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Mini label="Σ ACW" value={`${format3SF(derived.acw)} N m`} />
                  <Mini label="Σ CW" value={`${format3SF(derived.cw)} N m`} />
                </div>
                <p className="mt-2 font-mono text-xs text-ink-muted">
                  net (CW − ACW) = {format3SF(derived.net)} N m
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface p-3">
                <label className="flex items-center justify-between gap-2 text-sm text-ink">
                  <span>Include weight of the rule</span>
                  <input
                    type="checkbox"
                    checked={state.includeRule}
                    onChange={(e) => setState((s) => ({ ...s, includeRule: e.target.checked }))}
                    className="h-4 w-4 accent-amber-400"
                  />
                </label>
                {state.includeRule && (
                  <Slider
                    label="Rule mass (uniform, acts at 50 cm)"
                    value={state.ruleMassKg}
                    min={0.05}
                    max={0.4}
                    step={0.01}
                    unit="kg"
                    onChange={(ruleMassKg) => setState((s) => ({ ...s, ruleMassKg }))}
                  />
                )}
                <button
                  type="button"
                  onClick={resetRule}
                  className="mt-3 flex min-h-11 items-center gap-1 text-xs text-ink-muted hover:text-accent"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset rule
                </button>
              </div>

              {hidden && (
                <div className="rounded-xl border border-border-subtle bg-surface p-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    Find the mystery mass
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    m₁d₁ = m₂d₂. Distances are from the pivot, not from the 0 cm end.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="mass in kg"
                      className="min-h-11 flex-1 rounded-lg border border-border-subtle bg-inset px-3 font-mono text-sm text-ink"
                    />
                    <button
                      type="button"
                      onClick={checkMystery}
                      className="rounded-lg bg-accent px-3 text-xs font-bold text-accent-fg"
                    >
                      Check
                    </button>
                  </div>
                  {guessMsg && <p className="mt-2 text-xs text-ink-muted">{guessMsg}</p>}
                </div>
              )}

              <div className="rounded-xl border border-border-faint bg-muted-bg p-3 text-[11px] leading-relaxed text-ink-muted">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">Cambridge notes</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4">
                  <li>moment = force × perpendicular distance from the pivot.</li>
                  <li>A uniform rule’s weight acts at its centre of gravity (50 cm).</li>
                  <li>Equilibrium needs ΣF = 0 and Σ moments = 0.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]">
          <AngleForceCanvas state={angle} />
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Moment</p>
              <p className="mt-1 font-mono text-lg font-bold text-accent">{format3SF(angleD.momentNm)} N m</p>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                d_perp = L sinθ = {format3SF(angle.lengthM)} × sin {format3SF(angle.angleDeg)}° = {format3SF(angleD.dPerp)} m
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface p-3">
              <Slider
                label="Force F"
                value={angle.forceN}
                min={1}
                max={25}
                step={0.5}
                unit="N"
                onChange={(forceN) => setAngle((s) => ({ ...s, forceN }))}
              />
              <Slider
                label="Distance to force L"
                value={angle.lengthM}
                min={0.1}
                max={0.8}
                step={0.01}
                unit="m"
                onChange={(lengthM) => setAngle((s) => ({ ...s, lengthM }))}
              />
              <Slider
                label="Angle to the beam θ"
                value={angle.angleDeg}
                min={0}
                max={90}
                step={1}
                unit="°"
                onChange={(angleDeg) => setAngle((s) => ({ ...s, angleDeg }))}
              />
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                At 90° the force is perpendicular and d_perp = L (maximum moment). At 0° the force acts along the
                beam and the moment is zero.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-inset px-2.5 py-2">
      <p className="font-mono text-[10px] uppercase text-ink-faint">{label}</p>
      <p className="font-mono text-sm font-bold tabular-nums text-accent">{value}</p>
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
