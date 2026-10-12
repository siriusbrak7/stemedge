import type { CalculatedElectromagnetism, ElectromagnetismState } from "./physics";

interface Props {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

export function FlemingPanel({ state, calculated }: Props) {
  const iRight = state.currentA >= 0;
  const bInto = state.bIntoPage;
  const fUp = calculated.directionSign >= 0 || calculated.directionSign === 0 && iRight && bInto;
  const noF = calculated.directionSign === 0;

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
        <ellipse cx="250" cy="210" rx="70" ry="88" fill="#1E2433" stroke="#94A3B8" strokeWidth="2" />
        <text x="250" y="216" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="monospace">
          LEFT
        </text>
        <text x="250" y="232" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="monospace">
          HAND
        </text>

        {/* Index finger — B, into/out of page, drawn downward/into */}
        <g>
          <line x1="250" y1="130" x2="250" y2="70" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" />
          {bInto ? (
            <polygon points="250,58 242,76 258,76" fill="#60A5FA" />
          ) : (
            <polygon points="250,70 242,52 258,52" fill="#60A5FA" />
          )}
          <text x="268" y="78" fill="#60A5FA" fontSize="13" fontFamily="monospace" fontWeight="700">
            B {bInto ? "into page" : "out of page"}
          </text>
        </g>

        {/* Middle finger — I, right or left */}
        <g>
          <line
            x1="318"
            y1="210"
            x2={iRight ? 430 : 140}
            y2="210"
            stroke="#34D399"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon
            points={
              iRight ? "444,210 428,202 428,218" : "126,210 142,202 142,218"
            }
            fill="#34D399"
          />
          <text x={iRight ? 360 : 148} y="198" fill="#34D399" fontSize="13" fontFamily="monospace" fontWeight="700">
            I {iRight ? "→" : "←"}
          </text>
        </g>

        {/* Thumb — F, up or down */}
        <g opacity={noF ? 0.35 : 1}>
          <line
            x1="198"
            y1="160"
            x2={fUp ? 140 : 140}
            y2={fUp ? 92 : 292}
            stroke="#FBBF24"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon
            points={fUp ? "132,78 124,98 148,94" : "132,306 124,286 148,290"}
            fill="#FBBF24"
          />
          <text x="86" y={fUp ? 90 : 300} fill="#FBBF24" fontSize="13" fontFamily="monospace" fontWeight="700">
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
          I · {Math.abs(state.currentA) < 0.001 ? "zero" : iRight ? "to the right" : "to the left"}
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
