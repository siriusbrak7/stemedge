import { format3SF } from "@/lib/format";
import type { CalculatedElectromagnetism, ElectromagnetismState } from "./physics";

const VW = 640;
const VH = 360;
const CX = 320;
const CY = 168;
const RADII = [36, 62, 92, 124, 158];

interface Props {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

export function MagneticFieldCanvas({ state }: Props) {
  const { currentA } = state;
  const none = Math.abs(currentA) < 0.001;
  const out = currentA > 0;
  const opacity = Math.min(Math.abs(currentA) / 10, 1);
  const stroke = out ? "#60A5FA" : "#F59E0B";

  const compasses = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const th = (deg * Math.PI) / 180;
    const r = 118;
    const x = CX + r * Math.cos(th);
    const y = CY + r * Math.sin(th);
    // Tangent: anticlockwise if current out of page
    const tangent = out ? th + Math.PI / 2 : th - Math.PI / 2;
    return { x, y, tangent, deg };
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" aria-label="Magnetic field around a wire">
        {[70, 140, 210, 280].map((y) => (
          <line key={y} x1={0} y1={y} x2={VW} y2={y} stroke="#131825" />
        ))}

        {!none &&
          RADII.map((r, i) => {
            const op = opacity * Math.max(0.2, 1 - i * 0.14);
            return (
              <g key={r} opacity={op}>
                <circle
                  cx={CX}
                  cy={CY}
                  r={r}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={i === 0 ? 2.2 : 1.5}
                  className="animate-current-dash"
                  style={{ strokeDasharray: "8 10" }}
                />
              </g>
            );
          })}

        {!none &&
          compasses.map((c) => {
            const dx = Math.cos(c.tangent) * 14;
            const dy = Math.sin(c.tangent) * 14;
            return (
              <g key={c.deg} transform={`translate(${c.x},${c.y})`}>
                <circle r="11" fill="#0E1119" stroke="#334155" />
                <line x1={-dx} y1={-dy} x2={dx} y2={dy} stroke="#F87171" strokeWidth="2" />
                <circle cx={dx * 0.7} cy={dy * 0.7} r="2.2" fill="#FCA5A5" />
              </g>
            );
          })}

        {none && (
          <text x={CX} y={CY - 56} textAnchor="middle" fill="#4B5563" fontSize="13" fontFamily="monospace">
            No current → no magnetic field
          </text>
        )}

        <circle cx={CX} cy={CY} r="20" fill="#1E2433" stroke={none ? "#334155" : stroke} strokeWidth="2.6" />
        {!none && out && <circle cx={CX} cy={CY} r="5.5" fill="#93C5FD" />}
        {!none && !out && (
          <>
            <line x1={CX - 9} y1={CY - 9} x2={CX + 9} y2={CY + 9} stroke="#FCD34D" strokeWidth="2.5" />
            <line x1={CX + 9} y1={CY - 9} x2={CX - 9} y2={CY + 9} stroke="#FCD34D" strokeWidth="2.5" />
          </>
        )}
        {none && <line x1={CX - 8} y1={CY} x2={CX + 8} y2={CY} stroke="#374151" strokeWidth="2" />}

        <text x={CX} y={CY + 38} textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace">
          {none
            ? "Wire (I = 0)"
            : out
              ? `I out of page ⊙  ${format3SF(Math.abs(currentA))} A`
              : `I into page ⊗  ${format3SF(Math.abs(currentA))} A`}
        </text>

        <rect x={16} y={VH - 62} width={300} height={46} rx="8" fill="#0E1119" stroke="#1F2432" />
        <text x={28} y={VH - 42} fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="700">
          RIGHT-HAND GRIP RULE
        </text>
        <text x={28} y={VH - 26} fill="#64748B" fontSize="10" fontFamily="monospace">
          Thumb → I ; fingers curl → B {out ? "(anticlockwise)" : "(clockwise)"}
        </text>

        <text x={VW - 18} y={24} textAnchor="end" fill="#64748B" fontSize="11" fontFamily="monospace">
          Field ∝ |I| / r
        </text>
        <text x={VW - 18} y={40} textAnchor="end" fill="#475569" fontSize="10" fontFamily="monospace">
          Red compass needle follows B
        </text>
      </svg>
    </div>
  );
}
