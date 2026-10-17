import { useState } from "react";
import { Info, Zap } from "lucide-react";
import { format3SF } from "@/lib/format";
import { evaluateCircuit, type CircuitEvaluation, type CircuitState, type PathComponent } from "./physics";

export interface VISample {
  v: number;
  i: number;
}

interface Props {
  evaluation: CircuitEvaluation;
  state: CircuitState;
  samples: VISample[];
  readings: RecordedReading[];
  onRecordReading: () => void;
  onClearReadings: () => void;
}

export interface RecordedReading {
  voltage: number;
  current: number;
  resistance: number;
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

export function CircuitReadouts({
  evaluation,
  state,
  samples,
  readings,
  onRecordReading,
  onClearReadings,
}: Props) {
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
      <div aria-live="polite" aria-atomic="true" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
        <div className="mt-3 border-t border-border-faint pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRecordReading}
              disabled={!evaluation.isClosed || !Number.isFinite(evaluation.totalCurrent) || evaluation.totalCurrent <= 0}
              className="min-h-10 rounded-lg border border-accent/40 bg-accent/15 px-3 text-xs font-semibold text-accent hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Record reading
            </button>
            {readings.length > 0 && (
              <button
                type="button"
                onClick={onClearReadings}
                className="min-h-10 rounded-lg border border-border-subtle px-2.5 text-xs text-ink-muted hover:text-rose-300"
              >
                Clear table
              </button>
            )}
          </div>
          {readings.length > 0 && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="text-[10px] text-ink-faint">
                  <tr><th className="py-1 pr-2">#</th><th className="py-1 pr-2">V / V</th><th className="py-1 pr-2">I / A</th><th className="py-1">R / Ω</th></tr>
                </thead>
                <tbody>
                  {readings.map((reading, index) => (
                    <tr key={`${index}-${reading.voltage}`} className="border-t border-border-faint text-ink">
                      <td className="py-1 pr-2 text-ink-faint">#{index + 1}</td>
                      <td className="py-1 pr-2">{format3SF(reading.voltage)}</td>
                      <td className="py-1 pr-2">{format3SF(reading.current)}</td>
                      <td className="py-1">{format3SF(reading.resistance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                      <td className="py-1.5 pr-2 font-mono text-cyan-300">
                        {r.kind === "diode"
                          ? r.reversed ? "∞" : "0.50"
                          : format3SF(r.kind === "lamp" && data && data.current > 0 ? data.voltage / data.current : r.value)}
                      </td>
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

      <VIGraph samples={samples} state={state} readings={readings} />

      <details className="rounded-xl border border-border-faint bg-muted-bg p-3 text-xs text-ink-muted">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
          <Info className="h-3.5 w-3.5" />
          Cambridge exam rules (open for a reminder)
        </summary>
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
          <li>
            <strong className="text-ink">Lamp model</strong> — simplified non-ohmic model: filament resistance rises with current; heating delay is omitted.
          </li>
        </ul>
      </details>
    </div>
  );
}

function VIGraph({
  samples,
  state,
  readings,
}: {
  samples: VISample[];
  state: CircuitState;
  readings: RecordedReading[];
}) {
  const [showBestFit, setShowBestFit] = useState(false);
  const W = 420, H = 272, pl = 54, pb = 48, pr = 14, pt = 16;
  const curve = Array.from({ length: 41 }, (_, index) => evaluateCircuit({ ...state, cellEmf: (12 * index) / 40 }))
    .filter((point) => point.isClosed && Number.isFinite(point.totalCurrent) && Number.isFinite(point.terminalV));
  const allV = [
    ...curve.map((p) => p.terminalV),
    ...samples.map((s) => s.v),
    ...readings.map((r) => r.voltage),
  ];
  const allI = [
    ...curve.map((p) => p.totalCurrent),
    ...samples.map((s) => s.i),
    ...readings.map((r) => r.current),
  ];
  const vMax = Math.max(1, ...allV);
  const iMax = Math.max(0.1, ...allI);
  const x = (v: number) => pl + (v / vMax) * (W - pl - pr);
  const y = (i: number) => H - pb - (i / iMax) * (H - pt - pb);
  const curvePoints = curve.map((point) => `${x(point.terminalV).toFixed(1)},${y(point.totalCurrent).toFixed(1)}`).join(" ");

  // Linear regression on readings (I = slope * V + intercept)
  let bestFit: { slope: number; intercept: number; rExp: number } | null = null;
  if (readings.length >= 2) {
    const n = readings.length;
    const sumV = readings.reduce((acc, r) => acc + r.voltage, 0);
    const sumI = readings.reduce((acc, r) => acc + r.current, 0);
    const meanV = sumV / n;
    const meanI = sumI / n;
    const num = readings.reduce((acc, r) => acc + (r.voltage - meanV) * (r.current - meanI), 0);
    const den = readings.reduce((acc, r) => acc + (r.voltage - meanV) ** 2, 0);
    if (den > 1e-9) {
      const slope = num / den; // dI / dV
      const intercept = meanI - slope * meanV;
      if (slope > 1e-6) {
        bestFit = { slope, intercept, rExp: 1 / slope };
      }
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Whole-circuit current–voltage graph</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">Current I against terminal potential difference V. The curve includes every component in this circuit.</p>
      <svg role="img" aria-label="Whole circuit current against terminal potential difference graph" viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full">
        <rect width={W} height={H} fill="#0E1017" rx="8" />
        {[0, 1, 2, 3, 4].map((n) => {
          const yy = H - pb - ((H - pt - pb) * n) / 4;
          const xx = pl + ((W - pl - pr) * n) / 4;
          return <g key={n}>
            <line x1={pl} y1={yy} x2={W - pr} y2={yy} stroke="#263244" />
            <line x1={xx} y1={pt} x2={xx} y2={H - pb} stroke="#263244" />
            <text x={pl - 7} y={yy + 4} fill="#CBD5E1" textAnchor="end" fontSize="11" fontFamily="monospace">{(iMax * n / 4).toFixed(2)}</text>
            <text x={n === 0 ? xx + 5 : xx} y={H - 27} fill="#CBD5E1" textAnchor={n === 0 ? "start" : "middle"} fontSize="11" fontFamily="monospace">{(vMax * n / 4).toFixed(1)}</text>
          </g>;
        })}
        <line x1={pl} y1={pt} x2={pl} y2={H - pb} stroke="#64748B" />
        <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke="#64748B" />
        {curvePoints && <polyline fill="none" stroke="#22D3EE" strokeWidth="3" points={curvePoints} />}
        {showBestFit && bestFit && (
          <line
            x1={x(0)}
            y1={y(Math.max(0, bestFit.intercept))}
            x2={x(vMax)}
            y2={y(Math.max(0, bestFit.slope * vMax + bestFit.intercept))}
            stroke="#10B981"
            strokeWidth="2.2"
            strokeDasharray="5 3"
          />
        )}
        {readings.map((r, index) => (
          <g key={`reading-${index}-${r.voltage}`}>
            <circle cx={x(r.voltage)} cy={y(r.current)} r="5" fill="#F59E0B" stroke="#0E1017" strokeWidth="1.5" />
            <text x={x(r.voltage) + 7} y={y(r.current) - 4} fill="#FCD34D" fontSize="8" fontFamily="monospace">
              #{index + 1}
            </text>
          </g>
        ))}
        {samples.length > 0 && (
          <circle
            cx={x(samples[samples.length - 1].v)}
            cy={y(samples[samples.length - 1].i)}
            r="6"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        )}
        <text x={pl} y={12} fill="#E2E8F0" fontSize="12" fontFamily="monospace">I (A)</text>
        <text x={W - pr} y={H - 5} textAnchor="end" fill="#E2E8F0" fontSize="12" fontFamily="monospace">Terminal p.d. V (V)</text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border-faint pt-2 text-xs">
        <button
          type="button"
          onClick={() => setShowBestFit((s) => !s)}
          className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition ${
            showBestFit
              ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
              : "border-border-subtle bg-muted-bg text-ink-muted hover:border-emerald-500 hover:text-emerald-300"
          }`}
        >
          {showBestFit ? "Hide best-fit line" : "Best-fit line (Paper 6)"}
        </button>
        {showBestFit && bestFit ? (
          <span className="font-mono text-[11px] text-emerald-300">
            Gradient ΔI/ΔV = {format3SF(bestFit.slope)} A/V → <strong className="text-white">R = ΔV/ΔI = {format3SF(bestFit.rExp)} Ω</strong>
          </span>
        ) : showBestFit && readings.length < 2 ? (
          <span className="font-mono text-[10px] text-amber-300/80">
            Record ≥ 2 readings at different V to calculate best-fit gradient
          </span>
        ) : (
          <span className="text-[10px] text-ink-faint">
            Cyan curve: theoretical circuit response · Amber dots: recorded readings
          </span>
        )}
      </div>
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
