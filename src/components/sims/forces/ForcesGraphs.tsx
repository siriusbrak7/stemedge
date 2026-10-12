import { format3SF } from "@/lib/format";

export interface MotionSample {
  t: number;
  v: number;
  s: number;
}

interface Props {
  samples: MotionSample[];
  acceleration: number;
}

const GW = 520;
const GH = 168;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 28;

function mapX(t: number, tMax: number) {
  return PAD_L + (t / Math.max(tMax, 0.001)) * (GW - PAD_L - PAD_R);
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
}: {
  title: string;
  ylabel: string;
  samples: MotionSample[];
  pick: (s: MotionSample) => number;
  accent: string;
  zeroLine?: boolean;
  footer?: string;
}) {
  const tMax = Math.max(4, samples[samples.length - 1]?.t ?? 1);
  const values = samples.map(pick);
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(0.01, ...values);
  const pad = Math.max(0.4, (rawMax - rawMin) * 0.12);
  const lo = rawMin - (zeroLine ? 0 : 0) - (rawMin < 0 ? pad : 0);
  const hi = rawMax + pad;
  const pts = samples
    .map((s) => `${mapX(s.t, tMax).toFixed(1)},${mapY(pick(s), lo, hi).toFixed(1)}`)
    .join(" ");
  const y0 = mapY(0, lo, hi);

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{title}</span>
        {footer && <span className="font-mono text-[10px] text-ink-faint">{footer}</span>}
      </div>
      <svg viewBox={`0 0 ${GW} ${GH}`} className="h-auto w-full">
        <rect width={GW} height={GH} fill="#0E1017" rx="8" />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={GH - PAD_B} stroke="#334155" />
        <line x1={PAD_L} y1={GH - PAD_B} x2={GW - PAD_R} y2={GH - PAD_B} stroke="#334155" />
        {zeroLine && y0 > PAD_T && y0 < GH - PAD_B && (
          <line x1={PAD_L} y1={y0} x2={GW - PAD_R} y2={y0} stroke="#1F2432" />
        )}
        {pts.length > 0 && (
          <polyline fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" points={pts} />
        )}
        <text x={8} y={14} fill="#64748B" fontSize="9" fontFamily="monospace">
          {ylabel}
        </text>
        <text x={GW - 8} y={GH - 8} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
          t (s)
        </text>
        <text x={PAD_L - 6} y={PAD_T + 4} textAnchor="end" fill="#64748B" fontSize="8" fontFamily="monospace">
          {format3SF(hi)}
        </text>
        <text x={PAD_L - 6} y={GH - PAD_B} textAnchor="end" fill="#64748B" fontSize="8" fontFamily="monospace">
          {format3SF(lo)}
        </text>
      </svg>
    </div>
  );
}

export function ForcesGraphs({ samples, acceleration }: Props) {
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
  const area =
    samples.length >= 2
      ? samples.slice(1).reduce((sum, s, i) => sum + ((samples[i].v + s.v) / 2) * (s.t - samples[i].t), 0)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Graph
        title="Velocity–time"
        ylabel="v (m/s)"
        samples={samples}
        pick={(s) => s.v}
        accent="#F59E0B"
        zeroLine
        footer={`gradient ≈ ${format3SF(measuredA)} m/s²  (= a)`}
      />
      <Graph
        title="Displacement–time"
        ylabel="s (m)"
        samples={samples}
        pick={(s) => s.s}
        accent="#38BDF8"
        footer={`area under v–t ≈ ${format3SF(area)} m`}
      />
    </div>
  );
}
