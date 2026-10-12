import { Battery, Gauge } from "lucide-react";
import { format3SF } from "@/lib/format";
import type { TrayType } from "./physics";

interface Props {
  selected: TrayType | null;
  cellEmf: number;
  internalR: number;
  onSelectVoltmeter: () => void;
  onAdd: (type: Exclude<TrayType, "voltmeter">) => void;
  onEmf: (v: number) => void;
  onInternalR: (v: number) => void;
}

const PARTS: Array<{
  type: Exclude<TrayType, "voltmeter">;
  badge: string;
  label: string;
  hint: string;
}> = [
  { type: "resistor_10", badge: "10 Ω", label: "Resistor", hint: "Tap to add in series" },
  { type: "resistor_20", badge: "20 Ω", label: "Resistor", hint: "Tap to add in series" },
  { type: "lamp", badge: "12 Ω", label: "Lamp", hint: "Glows with current" },
  { type: "ammeter", badge: "A", label: "Ammeter", hint: "Series · 0 Ω" },
];

export function ComponentTray({
  selected,
  cellEmf,
  internalR,
  onSelectVoltmeter,
  onAdd,
  onEmf,
  onInternalR,
}: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Component tray</span>
        <span className="text-[11px] text-ink-faint">
          {selected === "voltmeter" ? "Now clip V on the schematic" : "Tap a part to add it"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col justify-center rounded-lg border border-accent/40 bg-accent/10 p-2">
          <div className="mb-1 flex items-center justify-center gap-1">
            <Battery className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold text-ink">Cell {format3SF(cellEmf)} V</span>
          </div>
          <input
            type="range"
            min={1.5}
            max={12}
            step={0.5}
            value={cellEmf}
            onChange={(e) => onEmf(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-amber-400"
            aria-label="Cell e.m.f."
          />
          <label className="mt-1 flex flex-col gap-0.5">
            <span className="text-[9px] text-ink-faint">internal r {format3SF(internalR)} Ω</span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={internalR}
              onChange={(e) => onInternalR(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-rose-400"
              aria-label="Internal resistance"
            />
          </label>
        </div>
        {PARTS.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAdd(item.type)}
            className="flex min-h-11 flex-col items-center justify-center rounded-lg border border-border-subtle bg-muted-bg p-2 text-center hover:border-accent hover:text-accent"
          >
            <span className="text-sm font-bold text-ink">{item.badge}</span>
            <span className="text-[11px] font-semibold text-ink-muted">{item.label}</span>
            <span className="text-[9px] text-ink-faint">{item.hint}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={onSelectVoltmeter}
          className={`flex min-h-11 flex-col items-center justify-center rounded-lg border p-2 text-center ${
            selected === "voltmeter"
              ? "border-accent bg-accent/20 ring-2 ring-accent/30"
              : "border-sky-500/40 bg-muted-bg hover:border-accent"
          }`}
        >
          <Gauge className="mb-0.5 h-4 w-4 text-sky-300" />
          <span className="text-sm font-bold text-ink">V</span>
          <span className="text-[11px] font-semibold text-ink-muted">Voltmeter</span>
          <span className="text-[9px] text-ink-faint">Clip in parallel</span>
        </button>
      </div>
    </div>
  );
}
