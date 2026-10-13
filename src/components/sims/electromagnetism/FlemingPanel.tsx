import type { CalculatedElectromagnetism, ElectromagnetismState } from "./physics";

interface Props {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

export function FlemingPanel({ state, calculated }: Props) {
  const iRight = state.currentDirection === "forward";
  const bInto = state.bIntoPage;
  const fUp = calculated.directionSign >= 0 || calculated.directionSign === 0 && iRight && bInto;
  const noF = calculated.directionSign === 0;
  const bEnd = bInto ? { x: 158, y: 118 } : { x: 322, y: 118 };
  const iEnd = iRight ? { x: 360, y: 210 } : { x: 120, y: 210 };
  const fEnd = fUp ? { x: 240, y: 104 } : { x: 240, y: 308 };

  return (
    <div className="overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg viewBox="0 0 640 360" className="h-auto w-full" aria-label="Fleming's left-hand rule">
        <text x="24" y="32" fill="#F59E0B" fontSize="13" fontFamily="monospace" fontWeight="700">
          FLEMING’S LEFT-HAND RULE — motor effect
        </text>
        <text x="24" y="52" fill="#64748B" fontSize="11" fontFamily="monospace">
          First finger = B · Second finger = I · Thumb = F
        </text>

        {/* Palm */}
        <ellipse cx="240" cy="210" rx="42" ry="52" fill="#1E2433" stroke="#94A3B8" strokeWidth="2" />
        <text x="240" y="214" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">LEFT HAND</text>

        {/* Projected field axis; x/out symbols mark depth direction. */}
        <g>
          <line x1="240" y1="210" x2={bEnd.x} y2={bEnd.y} stroke="#60A5FA" strokeWidth="7" strokeLinecap="round" />
          <polygon points={bInto ? `${bEnd.x},${bEnd.y - 12} ${bEnd.x - 8},${bEnd.y + 4} ${bEnd.x + 8},${bEnd.y + 4}` : `${bEnd.x},${bEnd.y + 12} ${bEnd.x - 8},${bEnd.y - 4} ${bEnd.x + 8},${bEnd.y - 4}`} fill="#60A5FA" />
          <circle cx={bEnd.x} cy={bEnd.y} r="13" fill="#0E1119" stroke="#60A5FA" />
          <text x={bEnd.x} y={bEnd.y + 6} textAnchor="middle" fill="#60A5FA" fontSize="20" fontFamily="monospace" fontWeight="700">{bInto ? "×" : "⊙"}</text>
          <text x={bEnd.x + (bInto ? -12 : 12)} y={bEnd.y - 19} textAnchor={bInto ? "end" : "start"} fill="#60A5FA" fontSize="12" fontFamily="monospace" fontWeight="700">B</text>
        </g>

        {/* Middle finger — I, right or left */}
        <g>
          <line
            x1="240"
            y1="210"
            x2={iEnd.x}
            y2="210"
            stroke="#34D399"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon
            points={
              iRight ? `${iEnd.x + 12},210 ${iEnd.x - 4},202 ${iEnd.x - 4},218` : `${iEnd.x - 12},210 ${iEnd.x + 4},202 ${iEnd.x + 4},218`
            }
            fill="#34D399"
          />
          <text x={iRight ? iEnd.x - 4 : iEnd.x + 4} y="190" textAnchor={iRight ? "end" : "start"} fill="#34D399" fontSize="13" fontFamily="monospace" fontWeight="700">
            I {iRight ? "→" : "←"}
          </text>
        </g>

        {/* Thumb — F, up or down */}
        <g opacity={noF ? 0.35 : 1}>
          <line
            x1="240"
            y1="210"
            x2={fEnd.x}
            y2={fEnd.y}
            stroke="#FBBF24"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon
            points={fUp ? `${fEnd.x},${fEnd.y - 12} ${fEnd.x - 8},${fEnd.y + 4} ${fEnd.x + 8},${fEnd.y + 4}` : `${fEnd.x},${fEnd.y + 12} ${fEnd.x - 8},${fEnd.y - 4} ${fEnd.x + 8},${fEnd.y - 4}`}
            fill="#FBBF24"
          />
          <text x="252" y={fUp ? fEnd.y + 4 : fEnd.y - 8} fill="#FBBF24" fontSize="13" fontFamily="monospace" fontWeight="700">
            F {noF ? "(none)" : fUp ? "up" : "down"}
          </text>
        </g>

        <rect x="400" y="70" width="220" height="210" rx="12" fill="#0E1119" stroke="#1F2432" />
        <text x="416" y="98" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="700">
          Live mapping
        </text>
        <text x="416" y="128" fill="#60A5FA" fontSize="12" fontFamily="monospace">
          B · {bInto ? "into the page" : "out of the page"}
        </text>
        <text x="416" y="156" fill="#34D399" fontSize="12" fontFamily="monospace">
          I · {state.currentA < 0.001 ? "zero" : iRight ? "to the right" : "to the left"}
        </text>
        <text x="416" y="184" fill="#FBBF24" fontSize="12" fontFamily="monospace">
          F · {calculated.directionLabel}
        </text>
        <text x="416" y="220" fill="#64748B" fontSize="10" fontFamily="monospace">
          Reverse I or reverse B
        </text>
        <text x="416" y="236" fill="#64748B" fontSize="10" fontFamily="monospace">
          and the force reverses.
        </text>
        <text x="416" y="260" fill="#475569" fontSize="10" fontFamily="monospace">
          Right hand = generator rule.
        </text>
      </svg>
    </div>
  );
}
