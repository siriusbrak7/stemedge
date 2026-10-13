import { format3SF } from "@/lib/format";

export interface SimulationSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  symbol?: string;
  bipolar?: boolean;
}

export function SimulationSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  symbol,
  bipolar,
}: SimulationSliderProps) {
  return (
    <label className="mt-2 flex flex-col gap-1">
      <span className="flex justify-between font-mono text-xs text-ink-muted">
        <span>
          {symbol && <strong className="mr-1 text-accent">{symbol}</strong>}
          {label}
        </span>
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
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer accent-amber-400"
      />
      {bipolar && (
        <span className="flex justify-between font-mono text-[9px] text-ink-faint">
          <span>{min} {unit}</span>
          <span>0</span>
          <span>+{max} {unit}</span>
        </span>
      )}
    </label>
  );
}

export interface SimulationReadoutProps {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
  compact?: boolean;
}

export function SimulationReadout({
  label,
  value,
  hint,
  highlight,
  compact,
}: SimulationReadoutProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? "border-accent/30 bg-accent/10" : "border-border-subtle bg-surface"
      }`}
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className={`mt-1 font-mono font-bold tabular-nums text-accent ${compact ? "text-sm" : "text-lg"}`}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[10px] text-ink-faint">{hint}</p>}
    </div>
  );
}
