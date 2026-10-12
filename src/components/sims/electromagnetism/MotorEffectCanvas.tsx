import {
  type CalculatedElectromagnetism,
  type ElectromagnetismState,
} from "./physics";
import { format3SF } from "@/lib/format";

const VW = 640;
const VH = 360;
const WIRE_Y = 180;
const MAX_F = 4;
const MAX_DEF = 48;

interface Props {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

export function MotorEffectCanvas({ state, calculated }: Props) {
  const { currentA, bFieldT, lengthM, bIntoPage } = state;
  const { forceMagnitudeN, directionSign, directionLabel } = calculated;
  const noForce = Math.abs(currentA) < 0.001 || forceMagnitudeN < 1e-6;
  const deflection = Math.min((forceMagnitudeN / MAX_F) * MAX_DEF, MAX_DEF);
  const wireY = WIRE_Y - directionSign * deflection;
  const fieldHalf = 70 + (lengthM / 2) * 90;
  const left = VW / 2 - fieldHalf;
  const right = VW / 2 + fieldHalf;
  const bCount = Math.max(3, Math.round(3 + bFieldT * 20));
  const arrowH = Math.min(18 + forceMagnitudeN * 28, 90);
  const tipY = wireY - directionSign * arrowH;
  const strokeB = bIntoPage ? "#64748B" : "#60A5FA";

  const xs: number[] = [];
  for (let i = 0; i < bCount; i++) xs.push(left + 18 + (i * (right - left - 36)) / Math.max(bCount - 1, 1));
  const ys = [70, 118, 242, 290];

  return (
    <div className="overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" aria-label="Motor effect">
        {[80, 160, 240, 320].map((y) => (
          <line key={y} x1={0} y1={y} x2={VW} y2={y} stroke="#131825" />
        ))}

        {/* Field region */}
        <rect
          x={left}
          y={48}
          width={right - left}
          height={264}
          rx="10"
          fill={bIntoPage ? "#0F121A" : "#0B1524"}
          stroke="#1F2432"
        />
        {xs.map((x) =>
          ys.map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x},${y})`} opacity={0.45 + bFieldT}>
              {bIntoPage ? (
                <>
                  <line x1={-5} y1={-5} x2={5} y2={5} stroke={strokeB} strokeWidth="1.6" />
                  <line x1={5} y1={-5} x2={-5} y2={5} stroke={strokeB} strokeWidth="1.6" />
                </>
              ) : (
                <>
                  <circle r="6" fill="none" stroke={strokeB} strokeWidth="1.4" />
                  <circle r="2" fill="#93C5FD" />
                </>
              )}
            </g>
          )),
        )}

        <text x={left + 8} y={40} fill="#94A3B8" fontSize="11" fontFamily="monospace">
          B {bIntoPage ? "into page (×)" : "out of page (⊙)"} = {format3SF(bFieldT)} T
        </text>

        {/* L dimension */}
        <line x1={left} y1={318} x2={right} y2={318} stroke="#F59E0B" strokeWidth="1.2" />
        <line x1={left} y1={312} x2={left} y2={324} stroke="#F59E0B" />
        <line x1={right} y1={312} x2={right} y2={324} stroke="#F59E0B" />
        <text x={VW / 2} y={334} textAnchor="middle" fill="#FBBF24" fontSize="11" fontFamily="monospace">
          L in the field = {format3SF(lengthM)} m
        </text>

        <line x1={36} y1={WIRE_Y} x2={VW - 36} y2={WIRE_Y} stroke="#2A3042" strokeDasharray="5 4" />

        {!noForce && (
          <g>
            <line x1={VW / 2} y1={wireY} x2={VW / 2} y2={tipY} stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
            <polygon
              points={
                directionSign >= 0
                  ? `${VW / 2},${tipY - 2} ${VW / 2 - 8},${tipY + 12} ${VW / 2 + 8},${tipY + 12}`
                  : `${VW / 2},${tipY + 2} ${VW / 2 - 8},${tipY - 12} ${VW / 2 + 8},${tipY - 12}`
              }
              fill="#F59E0B"
            />
            <text
              x={VW / 2 + 14}
              y={tipY + (directionSign >= 0 ? 4 : -4)}
              fill="#FCD34D"
              fontSize="13"
              fontFamily="monospace"
              fontWeight="700"
            >
              F = {format3SF(forceMagnitudeN)} N
            </text>
          </g>
        )}

        {noForce && (
          <text x={VW / 2} y={WIRE_Y - 36} textAnchor="middle" fill="#4B5563" fontSize="13" fontFamily="monospace">
            F = BIL = 0
          </text>
        )}

        {/* Wire — thicker inside the field to show L */}
        <line x1={28} y1={wireY} x2={VW - 28} y2={wireY} stroke="#92400E" strokeWidth="10" opacity="0.28" />
        <line x1={28} y1={wireY} x2={VW - 28} y2={wireY} stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
        <line x1={left} y1={wireY} x2={right} y2={wireY} stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />

        {currentA > 0.05 &&
          [170, 260, 350, 440].map((x) => (
            <polygon
              key={x}
              points={`${x + 11},${wireY} ${x - 3},${wireY - 6} ${x - 3},${wireY + 6}`}
              fill="#FCD34D"
            />
          ))}
        {currentA < -0.05 &&
          [440, 350, 260, 170].map((x) => (
            <polygon
              key={x}
              points={`${x - 11},${wireY} ${x + 3},${wireY - 6} ${x + 3},${wireY + 6}`}
              fill="#93C5FD"
            />
          ))}

        <rect x={18} y={wireY - 14} width="16" height="28" rx="4" fill="#1E2433" stroke="#475569" />
        <rect x={VW - 34} y={wireY - 14} width="16" height="28" rx="4" fill="#1E2433" stroke="#475569" />

        <text
          x={currentA >= 0 ? VW - 96 : 48}
          y={wireY - 14}
          fill={currentA >= 0 ? "#FCD34D" : "#93C5FD"}
          fontSize="11"
          fontFamily="monospace"
        >
          {currentA >= 0 ? "I →" : "← I"} {format3SF(currentA)} A
        </text>

        <text
          x={VW - 18}
          y={24}
          textAnchor="end"
          fill={noForce ? "#4B5563" : directionSign > 0 ? "#FCD34D" : "#93C5FD"}
          fontSize="13"
          fontFamily="monospace"
          fontWeight="700"
        >
          Force: {directionLabel}
        </text>
      </svg>
    </div>
  );
}
