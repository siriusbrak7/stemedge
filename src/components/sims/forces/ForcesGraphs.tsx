import { format3SF } from "@/lib/format";

export interface MotionSample {
  t: number;
  v: number;
  s: number;
}

interface Props {
  samples: MotionSample[];
  acceleration: number;
  showAreaShading: boolean;
}

const GW = 760;
const GH = 300;
const PAD_L = 88;
const PAD_R = 26;
const PAD_T = 34;
const PAD_B = 70;

function mapX(t: number, tMin: number, tMax: number) {
  const span = Math.max(tMax - tMin, 0.001);
  return PAD_L + ((t - tMin) / span) * (GW - PAD_L - PAD_R);
}

function mapY(val: number, lo: number, hi: number) {
  const span = hi - lo || 1;
  return PAD_T + (1 - (val - lo) / span) * (GH - PAD_T - PAD_B);
}

function Graph({
  title,
  ylabel,
  samples,
  pick,
  accent,
  zeroLine,
  footer,
  showAreaShading,
  yDomain,
}: {
  title: string;
  ylabel: string;
  samples: MotionSample[];
  pick: (s: MotionSample) => number;
  accent: string;
  zeroLine?: boolean;
  footer?: string;
  showAreaShading?: boolean;
  yDomain?: [number, number];
}) {
  // Use a scrolling window: show at most the last 12 s of data
  const lastT = samples[samples.length - 1]?.t ?? 0;
  const windowDuration = 12;
  const tMin = Math.max(0, lastT - windowDuration);
  const tMax = Math.max(tMin + 4, lastT);

  const visible = samples.filter((s) => s.t >= tMin);

  const values = visible.map(pick);
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(0.01, ...values);
  const pad = Math.max(0.4, (rawMax - rawMin) * 0.12);
  const lo = yDomain?.[0] ?? rawMin - (rawMin < 0 ? pad : 0);
  const hi = yDomain?.[1] ?? rawMax + pad;

  const pts = visible
    .map((s) => `${mapX(s.t, tMin, tMax).toFixed(1)},${mapY(pick(s), lo, hi).toFixed(1)}`)
    .join(" ");

  const y0 = mapY(0, lo, hi);
  const yBottom = GH - PAD_B;

  // Area polygon: curve + drop-down to zero baseline + back to start
  let areaPolygon = "";
  if (showAreaShading && visible.length >= 2 && zeroLine) {
    const firstX = mapX(visible[0].t, tMin, tMax).toFixed(1);
    const lastX = mapX(visible[visible.length - 1].t, tMin, tMax).toFixed(1);
    const clampedY0 = Math.min(Math.max(y0, PAD_T), yBottom);
    areaPolygon = `${firstX},${clampedY0} ${pts} ${lastX},${clampedY0}`;
  }

  return (
    <div className="mx-auto w-full max-w-[960px] rounded-xl border border-border-subtle bg-surface p-4">
      <div className="mb-2 flex flex-col gap-1.5">
        <span className="whitespace-nowrap font-mono text-base font-bold uppercase tracking-widest text-accent">{title}</span>
        {footer && <span className="font-mono text-sm font-medium leading-relaxed text-ink-muted">{footer}</span>}
      </div>
      <svg viewBox={`0 0 ${GW} ${GH}`} className="h-auto w-full" role="img" aria-label={`${title} graph. ${footer ?? ""}`}>
        <rect width={GW} height={GH} fill="#0E1017" rx="8" />
        {/* Axes and readable scale grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const value = lo + fraction * (hi - lo);
          const y = mapY(value, lo, hi);
          return (
            <g key={`y-${fraction}`}>
              <line x1={PAD_L} y1={y} x2={GW - PAD_R} y2={y} stroke={fraction === 0 ? "#64748B" : "#273244"} strokeWidth={fraction === 0 ? 1.5 : 1} />
              <text x={PAD_L - 12} y={y + 6} textAnchor="end" fill="#E2E8F0" fontSize="18" fontFamily="monospace">{format3SF(value)}</text>
            </g>
          );
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const x = PAD_L + fraction * (GW - PAD_L - PAD_R);
          const time = tMin + fraction * (tMax - tMin);
          return (
            <g key={`x-${fraction}`}>
              <line x1={x} y1={PAD_T} x2={x} y2={GH - PAD_B} stroke="#202B3A" strokeWidth="1" />
              <text x={x} y={GH - PAD_B + 24} textAnchor="middle" fill="#E2E8F0" fontSize="17" fontFamily="monospace">{time.toFixed(1)}</text>
            </g>
          );
        })}

        {/* Area shading under v-t curve */}
        {showAreaShading && areaPolygon && (
          <polygon
            points={areaPolygon}
            fill={accent}
            fillOpacity="0.18"
            stroke="none"
          />
        )}

        {/* Data line */}
        {pts.length > 0 && (
          <polyline fill="none" stroke={accent} strokeWidth="4" strokeLinejoin="round" points={pts} />
        )}

        {/* Axis labels */}
        <text x={PAD_L} y={GH - 10} textAnchor="middle" fill="#F1F5F9" fontSize="19" fontFamily="monospace">time, t (s)</text>
        <text x={14} y={24} fill="#F1F5F9" fontSize="20" fontFamily="monospace">
          {ylabel}
        </text>
      </svg>
    </div>
  );
}

export function ForcesGraphs({ samples, acceleration, showAreaShading }: Props) {
  const last = samples[samples.length - 1];
  const t = last?.t ?? 0;
  const window = samples.filter((s) => s.t >= t - 1);
  let measuredA = acceleration;
  if (window.length >= 2) {
    const a = window[0];
    const b = window[window.length - 1];
    const dt = b.t - a.t;
    if (dt > 0.2) measuredA = (b.v - a.v) / dt;
  }
  const visible = samples.filter((s) => s.t >= Math.max(0, t - 12));
  const displacementFromVt =
    visible.length >= 2
      ? visible.slice(1).reduce((sum, s, i) => sum + ((visible[i].v + s.v) / 2) * (s.t - visible[i].t), 0)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      <Graph
        title="Velocity-time"
        ylabel="v (m/s)"
        samples={samples}
        pick={(s) => s.v}
        accent="#FDBA36"
        zeroLine
        showAreaShading={showAreaShading}
        footer={`Gradient = acceleration · a ≈ ${format3SF(measuredA)} m/s² · signed area = displacement (${format3SF(displacementFromVt)} m)`}
      />
      <Graph
        title="Position-time"
        ylabel="position (m)"
        samples={samples}
        pick={(s) => s.s}
        accent="#60C5F7"
        yDomain={[0, 16]}
        footer={`Track position: 0–16 m · gradient = velocity · v ≈ ${format3SF(visible.length >= 2 ? ((visible[visible.length - 1].s - visible[0].s) / (visible[visible.length - 1].t - visible[0].t || 1)) : 0)} m/s`}
      />
    </div>
  );
}
