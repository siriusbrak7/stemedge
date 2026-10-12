import { format3SF } from "@/lib/format";
import { computeAngleMoment, type AngleState } from "./physics";

const VW = 560;
const VH = 280;
const PX = 80;
const PY = 200;
const SCALE = 320;

interface Props {
  state: AngleState;
}

export function AngleForceCanvas({ state }: Props) {
  const { dPerp, momentNm, sin } = computeAngleMoment(state);
  const ax = PX + state.lengthM * SCALE;
  const ay = PY;
  const rad = (state.angleDeg * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = -Math.sin(rad);
  const fLen = 52 + state.forceN * 2.4;
  const fx = ax + ux * fLen;
  const fy = ay + uy * fLen;
  const t = (PX - ax) * ux + (PY - ay) * uy;
  const footX = ax + t * ux;
  const footY = ay + t * uy;
  const loX = ax - ux * 90;
  const loY = ay - uy * 90;
  const hiX = ax + ux * (fLen + 36);
  const hiY = ay + uy * (fLen + 36);
  const nearlyPerp = state.angleDeg >= 75;
  const dimY = PY + 34;

  return (
    <div className="overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" aria-label="Force at an angle to a pivoted beam">
        <rect width={VW} height={VH} fill="#0A0C10" />
        <text x="16" y="22" fill="#94A3B8" fontSize="11" fontFamily="monospace">
          moment = F × d_perp = F × L × sinθ
        </text>
        <text x="16" y="42" fill="#FCD34D" fontSize="12" fontFamily="monospace" fontWeight="700">
          {format3SF(state.forceN)} × {format3SF(dPerp)} = {format3SF(momentNm)} N m
        </text>

        <polygon points={`${PX},${PY} ${PX - 14},${PY + 40} ${PX + 14},${PY + 40}`} fill="#64748B" />
        <rect x={PX - 26} y={PY + 40} width="52" height="8" rx="2" fill="#334155" />
        <line x1={PX} y1={PY} x2={ax} y2={ay} stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
        <circle cx={PX} cy={PY} r="5" fill="#E2E8F0" />

        <line x1={loX} y1={loY} x2={hiX} y2={hiY} stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
        <line x1={ax} y1={ay} x2={fx} y2={fy} stroke="#38BDF8" strokeWidth="3.2" />
        <polygon points={arrowHead(ax, ay, fx, fy)} fill="#38BDF8" />
        <text x={Math.min(VW - 90, fx + 8)} y={Math.max(18, fy)} fill="#7DD3FC" fontSize="11" fontFamily="monospace">
          F = {format3SF(state.forceN)} N
        </text>

        {nearlyPerp ? (
          <g>
            <line x1={PX} y1={dimY} x2={ax} y2={dimY} stroke="#34D399" strokeWidth="2" />
            <line x1={PX} y1={dimY - 5} x2={PX} y2={dimY + 5} stroke="#34D399" />
            <line x1={ax} y1={dimY - 5} x2={ax} y2={dimY + 5} stroke="#34D399" />
            <text x={(PX + ax) / 2} y={dimY + 16} textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="monospace">
              d_perp = L = {format3SF(dPerp)} m
            </text>
          </g>
        ) : (
          <g>
            <line x1={PX} y1={PY} x2={footX} y2={footY} stroke="#34D399" strokeWidth="2" />
            <circle cx={footX} cy={footY} r="3" fill="#34D399" />
            <text
              x={(PX + footX) / 2 + 12}
              y={(PY + footY) / 2 - 4}
              fill="#6EE7B7"
              fontSize="10"
              fontFamily="monospace"
            >
              d_perp = {format3SF(dPerp)} m
            </text>
          </g>
        )}

        {state.angleDeg > 8 && (
          <text x={ax - 10} y={ay - 16} textAnchor="end" fill="#CBD5E1" fontSize="11" fontFamily="monospace">
            θ = {format3SF(state.angleDeg)}°
          </text>
        )}
        <text x={(PX + ax) / 2} y={PY + 18} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
          L = {format3SF(state.lengthM)} m
        </text>
        <text x="16" y={VH - 12} fill="#64748B" fontSize="10" fontFamily="monospace">
          Dashed line = line of action. Green = perpendicular distance from the pivot. sinθ = {format3SF(sin)}
        </text>
      </svg>
    </div>
  );
}

function arrowHead(x1: number, y1: number, x2: number, y2: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const s = 10;
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  return `${x2},${y2} ${x2 + Math.cos(a1) * s},${y2 + Math.sin(a1) * s} ${x2 + Math.cos(a2) * s},${y2 + Math.sin(a2) * s}`;
}
