import { Hand, RotateCcw, Sliders } from "lucide-react";
import { format3SF } from "@/lib/format";
import {
  ELECTROMAGNETISM_PRESETS,
  type CalculatedElectromagnetism,
  type ElectromagnetismPreset,
  type ElectromagnetismState,
} from "./physics";

interface Props {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
  onChangeCurrentA: (v: number) => void;
  onChangeBFieldT: (v: number) => void;
  onChangeLengthM: (v: number) => void;
  onToggleBDir: () => void;
  onApplyPreset: (p: ElectromagnetismPreset) => void;
  onReset: () => void;
}

export function ElectromagnetismControls({
  state,
  onChangeCurrentA,
  onChangeBFieldT,
  onChangeLengthM,
  onToggleBDir,
  onApplyPreset,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-3">
      <div className="flex items-center justify-between border-b border-border-faint pb-1">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Controls</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 rounded-lg border border-border-faint bg-canvas-elevated px-2 py-1 font-mono text-[10px] text-ink-muted hover:text-accent"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <SliderRow
        label="Current"
        symbol="I"
        value={state.currentA}
        min={-10}
        max={10}
        step={0.1}
        unit="A"
        onChange={onChangeCurrentA}
        bipolar
      />
      <SliderRow
        label="Magnetic flux density"
        symbol="B"
        value={state.bFieldT}
        min={0.01}
        max={0.2}
        step={0.01}
        unit="T"
        onChange={onChangeBFieldT}
      />
      <SliderRow
        label="Length in the field"
        symbol="L"
        value={state.lengthM}
        min={0.1}
        max={2}
        step={0.05}
        unit="m"
        onChange={onChangeLengthM}
      />

      <button
        type="button"
        onClick={onToggleBDir}
        className="rounded-lg border border-border-subtle bg-inset px-3 py-2 text-left text-xs font-semibold text-ink-muted hover:text-accent"
      >
        B direction: {state.bIntoPage ? "into the page (×)" : "out of the page (⊙)"} — tap to reverse
      </button>

      <div>
        <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-faint">
          Real-world presets
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ELECTROMAGNETISM_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              title={p.description}
              onClick={() => onApplyPreset(p)}
              className="rounded-lg border border-border-faint bg-canvas-elevated px-2.5 py-1 font-mono text-[10px] text-ink-muted hover:border-accent/40 hover:text-amber-300"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border-faint bg-canvas-elevated p-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Hand className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
            Fleming’s left-hand rule
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <Hint color="text-blue-400" title="Index → B" sub="field" />
          <Hint color="text-emerald-400" title="Middle → I" sub="current" />
          <Hint color="text-amber-300" title="Thumb → F" sub="force" />
        </div>
      </div>
    </div>
  );
}

function Hint({ color, title, sub }: { color: string; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border-faint bg-surface p-1.5">
      <span className={`font-mono text-[9px] ${color}`}>{title}</span>
      <span className="font-mono text-[9px] text-ink-faint">{sub}</span>
    </div>
  );
}

function SliderRow({
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  bipolar,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  bipolar?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ink-muted">
          <span className="font-bold text-accent">{symbol}</span> — {label}
        </span>
        <span className="font-mono text-xs font-bold tabular-nums text-amber-300">
          {format3SF(value)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full accent-amber-400"
      />
      {bipolar && (
        <div className="flex justify-between font-mono text-[9px] text-ink-faint">
          <span>{min} A</span>
          <span>0</span>
          <span>+{max} A</span>
        </div>
      )}
    </div>
  );
}
