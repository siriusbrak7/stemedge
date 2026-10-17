import { AlertTriangle, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import type { CircuitEvaluation, GuidedTask } from "./physics";

interface Props {
  current: GuidedTask;
  tasks: GuidedTask[];
  evaluation: CircuitEvaluation;
  prediction: number | null;
  onPrediction: (choice: number) => void;
  onSelect: (id: number) => void;
  onReset: () => void;
  onLoadSeries: () => void;
  onLoadParallel: () => void;
  onSetupTask: (id: number) => void;
}

export function TaskHeader({
  current,
  tasks,
  evaluation,
  prediction,
  onPrediction,
  onSelect,
  onReset,
  onLoadSeries,
  onLoadParallel,
  onSetupTask,
}: Props) {
  const complete =
    (current.id === 1 && evaluation.task1Complete) ||
    (current.id === 2 && evaluation.task2Complete) ||
    (current.id === 3 && evaluation.task3Complete) ||
    (current.id === 4 && evaluation.task4Complete);
  const note = evaluation.taskNotes[current.id];

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tasks.map((t) => {
            const done =
              (t.id === 1 && evaluation.task1Complete) ||
              (t.id === 2 && evaluation.task2Complete) ||
              (t.id === 3 && evaluation.task3Complete) ||
              (t.id === 4 && evaluation.task4Complete);
            const selected = t.id === current.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id)}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
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
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onLoadSeries}
            className="min-h-11 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-accent"
          >
            Series example
          </button>
          <button
            type="button"
            onClick={onLoadParallel}
            className="min-h-11 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-accent"
          >
            Parallel example
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-11 items-center gap-1 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-accent"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
            Task {current.id}: {current.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSetupTask(current.id)}
              className="flex items-center gap-1 rounded-lg bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent hover:bg-accent/25"
            >
              Setup Task
            </button>
            {complete && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/70 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm font-medium leading-relaxed text-ink">{current.prompt}</p>
      </div>

      <fieldset className="rounded-lg border border-border-faint bg-muted-bg p-2">
        <legend className="px-1 text-[11px] font-bold text-ink-muted">Predict, then test</legend>
        <p className="mb-2 text-xs text-ink">{current.prediction.question}</p>
        <div className="flex flex-wrap gap-2">
          {current.prediction.choices.map((choice, index) => (
            <button key={choice} type="button" aria-pressed={prediction === index} onClick={() => onPrediction(index)}
              className={`min-h-10 rounded-lg border px-3 text-xs font-semibold ${prediction === index ? "border-accent bg-accent/15 text-accent" : "border-border-subtle text-ink-muted"}`}>
              {choice}
            </button>
          ))}
        </div>
        {complete && prediction !== null && (
          <div className="mt-2 flex flex-col gap-1 border-t border-border-faint pt-2">
            <p role="status" className={`text-xs font-semibold ${prediction === current.prediction.answer ? "text-emerald-300" : "text-amber-200"}`}>
              {prediction === current.prediction.answer ? "✓ Your prediction matches the observation!" : "Note the difference:"}
            </p>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              {current.prediction.explanation}
            </p>
          </div>
        )}
      </fieldset>

      <div className="flex items-start gap-2 rounded-lg border border-border-faint bg-inset p-2 text-xs text-ink-muted">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <span>{evaluation.coach}</span>
      </div>

      {complete && note && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-xs text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Cambridge note: </strong>
            {note}
          </span>
        </div>
      )}

      {evaluation.ammeterHint && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-950/40 p-2 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          {evaluation.ammeterHint}
        </div>
      )}
      {evaluation.voltmeterHint && current.id === 3 && !evaluation.task3Complete && (
        <div className="flex items-start gap-2 rounded-lg border border-sky-500/40 bg-sky-950/40 p-2 text-xs text-sky-200">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          {evaluation.voltmeterHint}
        </div>
      )}
    </div>
  );
}
