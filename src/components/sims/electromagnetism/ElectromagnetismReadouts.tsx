import type { ElementType } from "react";
import { Activity, ArrowUpDown, Magnet, Ruler, Zap } from "lucide-react";
import { format3SF } from "@/lib/format";
import type { CalculatedElectromagnetism, ElectromagnetismState } from "./physics";

interface Props {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

export function ElectromagnetismReadouts({ state, calculated }: Props) {
  const none = Math.abs(state.currentA) < 0.001;
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3">
      <div className="flex items-center gap-2 border-b border-border-faint pb-1">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Live readouts</span>
      </div>
      <Card icon={Zap} label="Force  F = BIL" value={none ? "0" : format3SF(calculated.forceMagnitudeN)} unit="N" highlight={!none} />
      <Card
        icon={ArrowUpDown}
        label="Force direction"
        value={calculated.directionLabel}
        unit=""
        accent={none ? "text-ink-faint" : calculated.directionSign > 0 ? "text-amber-300" : "text-blue-300"}
      />
      <Card icon={Magnet} label="Flux density B" value={format3SF(state.bFieldT)} unit="T" />
      <Card
        icon={Zap}
        label="Current I"
        value={format3SF(state.currentA)}
        unit="A"
        accent={state.currentA >= 0 ? "text-amber-300" : "text-blue-300"}
      />
      <Card icon={Ruler} label="Length in field L" value={format3SF(state.lengthM)} unit="m" />
      <div className="rounded-lg border border-border-faint bg-canvas-elevated px-2.5 py-1.5">
        <span className="font-mono text-[10px] text-ink-faint">{calculated.formulaLine}</span>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  label,
  value,
  unit,
  highlight,
  accent = "text-amber-300",
}: {
  icon: ElementType;
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
  accent?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        highlight ? "border-accent/30 bg-accent/10" : "border-border-faint bg-canvas-elevated"
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-accent/20 text-accent" : "bg-surface text-ink-muted"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
        <p className={`mt-0.5 font-mono text-lg font-bold leading-none ${accent}`}>
          {value} {unit && <span className="text-xs font-medium text-ink-faint">{unit}</span>}
        </p>
      </div>
    </div>
  );
}
