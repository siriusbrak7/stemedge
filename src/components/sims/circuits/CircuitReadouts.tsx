import { Info, Zap } from "lucide-react";
import { format3SF } from "@/lib/format";
import type { CircuitEvaluation, CircuitState, PathComponent } from "./physics";

export interface VISample {
  v: number;
  i: number;
}

interface Props {
  evaluation: CircuitEvaluation;
  state: CircuitState;
  samples: VISample[];
}

function collectLoads(state: CircuitState): PathComponent[] {
  const out: PathComponent[] = [];
  for (const sec of state.sections) {
    if (sec.type === "series" && sec.component.kind !== "ammeter") out.push(sec.component);
    if (sec.type === "parallel") {
      for (const b of sec.branches) out.push(...b.filter((c) => c.kind !== "ammeter"));
    }
  }
  return out;
}

export function CircuitReadouts({ evaluation, state, samples }: Props) {
  const loads = collectLoads(state);
  const badge = (() => {
    switch (evaluation.topology) {
      case "Series (closed)":
        return "border-emerald-500/40 bg-emerald-950/50 text-emerald-300";
      case "Parallel (closed)":
        return "border-cyan-500/40 bg-cyan-950/50 text-cyan-300";
      case "Mixed (closed)":
        return "border-indigo-500/40 bg-indigo-950/50 text-indigo-300";
      case "Short circuit":
        return "border-rose-500/40 bg-rose-950/50 text-rose-300";
      case "Switch open":
        return "border-amber-500/40 bg-amber-950/40 text-amber-200";
      default:
        return "border-border-subtle bg-muted-bg text-ink-muted";
    }
  })();

  const iText = !Number.isFinite(evaluation.totalCurrent) ? "∞" : format3SF(evaluation.totalCurrent);
  const rText = evaluation.totalResistance === Infinity ? "∞" : format3SF(evaluation.totalResistance);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Meter label="e.m.f. E" value={format3SF(evaluation.cellEmf)} unit="V" hint="Cell (chemical)" accent />
        <Meter
          label="Terminal p.d."
          value={format3SF(evaluation.terminalV)}
          unit="V"
          hint={evaluation.internalR > 0.001 ? "E − Ir" : "Ideal cell, r = 0"}
        />
        <Meter label="Current I" value={iText} unit="A" hint="Leaves + terminal" />
        <Meter label="R (load + r)" value={rText} unit="Ω" hint="Equivalent" />
        <Meter
          label="Ammeter"
          value={evaluation.ammeterReading === null ? "—" : !Number.isFinite(evaluation.ammeterReading) ? "∞" : format3SF(evaluation.ammeterReading)}
          unit="A"
          hint="Must be in series"
        />
        <Meter
          label="Voltmeter"
          value={evaluation.voltmeterReading === null ? "—" : format3SF(evaluation.voltmeterReading)}
          unit="V"
          hint={evaluation.voltmeterWhere}
        />
      </div>

      <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${badge}`}>
        {evaluation.topology}
        {evaluation.isClosed && Number.isFinite(evaluation.powerW) && (
          <span className="ml-2 font-mono font-normal text-ink-muted">
            P = IV = {format3SF(evaluation.powerW)} W
          </span>
        )}
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Ohm’s law  V = I × R
          </span>
          <span className="font-mono text-[11px] text-ink-faint">3 s.f.</span>
        </div>
        {loads.length === 0 ? (
          <p className="py-2 text-xs italic text-ink-muted">No load yet — tap 10 Ω, 20 Ω or the lamp.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[20rem] text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle font-mono text-[10px] text-ink-faint">
                  <th className="py-1 pr-2 font-medium">Component</th>
                  <th className="py-1 pr-2 font-medium">R / Ω</th>
                  <th className="py-1 pr-2 font-medium">I / A</th>
                  <th className="py-1 pr-2 font-medium">V = IR</th>
                  <th className="py-1 font-medium">P / W</th>
                </tr>
              </thead>
              <tbody>
                {loads.map((r) => {
                  const data = evaluation.resistorCurrents[r.id];
                  return (
                    <tr key={r.id} className="border-b border-border-faint text-ink">
                      <td className="py-1.5 pr-2 font-medium">{r.label}</td>
                      <td className="py-1.5 pr-2 font-mono text-cyan-300">{format3SF(r.value)}</td>
                      <td className="py-1.5 pr-2 font-mono">{format3SF(data?.current ?? 0)}</td>
                      <td className="py-1.5 pr-2 font-mono font-semibold text-amber-300">
                        {format3SF(data?.voltage ?? 0)}
                      </td>
                      <td className="py-1.5 font-mono text-ink-muted">{format3SF(data?.power ?? 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {evaluation.isClosed && evaluation.seriesResistorCount >= 2 && (
          <p className="mt-2 font-mono text-[11px] text-emerald-300">
            Series check: ΣV = {format3SF(evaluation.voltagesSum)} V  (terminal {format3SF(evaluation.terminalV)} V)
          </p>
        )}
        {evaluation.steps.length > 0 && (
          <ul className="mt-2 space-y-1 font-mono text-[11px] text-ink-muted">
            {evaluation.steps.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        )}
      </div>

      <VIGraph samples={samples} />

      <div className="flex flex-col gap-1.5 rounded-xl border border-border-faint bg-muted-bg p-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
          <Info className="h-3.5 w-3.5" />
          Cambridge exam rules
        </div>
        <ul className="list-disc space-y-1 pl-4 text-[11px]">
          <li>
            <strong className="text-ink">Ammeter</strong> — series only. Ideal resistance 0 Ω.
          </li>
          <li>
            <strong className="text-ink">Voltmeter</strong> — parallel only. Ideal resistance infinite.
          </li>
          <li>
            <strong className="text-ink">Series</strong> — same current. p.d.s add to the terminal voltage.
          </li>
          <li>
            <strong className="text-ink">Parallel</strong> — same p.d. Branch currents add.
          </li>
          <li>
            <strong className="text-ink">Open switch</strong> — I = 0. Voltmeter across the cell still reads E.
          </li>
        </ul>
      </div>
    </div>
  );
}

function VIGraph({ samples }: { samples: VISample[] }) {
  const W = 320;
  const H = 140;
  const pl = 36;
  const pb = 24;
  const pr = 10;
  const pt = 14;
  const vMax = Math.max(6, ...samples.map((s) => s.v), 1);
  const iMax = Math.max(0.6, ...samples.map((s) => s.i), 0.1);
  const x = (v: number) => pl + (v / vMax) * (W - pl - pr);
  const y = (i: number) => H - pb - (i / iMax) * (H - pt - pb);
  const pts = samples.map((s) => `${x(s.v).toFixed(1)},${y(s.i).toFixed(1)}`).join(" ");

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">V–I graph (Ohm’s law)</p>
      <p className="mt-0.5 text-[10px] text-ink-faint">
        Drag the cell e.m.f. A metallic resistor is a straight line through the origin.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full">
        <rect width={W} height={H} fill="#0E1017" rx="8" />
        <line x1={pl} y1={pt} x2={pl} y2={H - pb} stroke="#334155" />
        <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke="#334155" />
        {pts && <polyline fill="none" stroke="#F59E0B" strokeWidth="2" points={pts} />}
        {samples.map((s, idx) => (
          <circle key={`${s.v}-${idx}`} cx={x(s.v)} cy={y(s.i)} r="2.4" fill="#FBBF24" />
        ))}
        <text x={8} y={12} fill="#64748B" fontSize="8" fontFamily="monospace">
          I / A
        </text>
        <text x={W - 8} y={H - 6} textAnchor="end" fill="#64748B" fontSize="8" fontFamily="monospace">
          V / V
        </text>
      </svg>
    </div>
  );
}

function Meter({
  label,
  value,
  unit,
  hint,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border-subtle bg-surface p-2.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{label}</span>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-mono text-xl font-bold tabular-nums ${accent ? "text-accent" : "text-ink"}`}>
          {value}
        </span>
        <span className="font-mono text-xs text-ink-faint">{unit}</span>
      </div>
      <span className="mt-0.5 text-[10px] text-ink-faint">{hint}</span>
    </div>
  );
}
