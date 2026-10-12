import React from 'react';
import {
  ElectromagnetismState,
  CalculatedElectromagnetism,
  format3SF,
} from './physics';

interface MotorEffectCanvasProps {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

// SVG viewBox dimensions
const VW = 560;
const VH = 340;
const WIRE_Y = VH / 2; // centre of canvas
const MAX_DEFLECTION = 65; // px — max wire displacement at |F| = 20 N
const MAX_FORCE_N = 20;    // normalisation denominator
const ARROW_MAX_H = 100;   // max force arrow height px

export const MotorEffectCanvas: React.FC<MotorEffectCanvasProps> = ({
  state,
  calculated,
}) => {
  const { currentA, bFieldT } = state;
  const { forceN, forceMagnitudeN, directionSign, directionLabel } = calculated;

  // Wire vertical offset (positive = up = negative y in SVG)
  const deflectionPx = Math.min(
    (forceMagnitudeN / MAX_FORCE_N) * MAX_DEFLECTION,
    MAX_DEFLECTION
  );
  const wireY = WIRE_Y - directionSign * deflectionPx;

  // Force arrow
  const arrowH = Math.min(
    (forceMagnitudeN / MAX_FORCE_N) * ARROW_MAX_H,
    ARROW_MAX_H
  );
  const arrowTipY = wireY - directionSign * arrowH;
  const arrowBaseY = wireY;
  const arrowX = VW / 2;

  // B-field symbol (into page = ×, out of page = ·)
  // Convention: positive I → force up; B into page + I right → F up (Fleming's LHR)
  // So B is always into page in this visualisation
  const noForce = Math.abs(currentA) < 0.001;

  return (
    <div className="relative bg-[#0A0C10] border border-[#1F2432] rounded-xl overflow-hidden">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto"
        aria-label="Motor effect diagram"
      >
        {/* Background grid lines (subtle) */}
        {[60, 120, 180, 240, 300].map((y) => (
          <line
            key={y}
            x1={0} y1={y} x2={VW} y2={y}
            stroke="#1A1F2C" strokeWidth="1"
          />
        ))}
        {[70, 140, 210, 280, 350, 420, 490].map((x) => (
          <line
            key={x}
            x1={x} y1={0} x2={x} y2={VH}
            stroke="#1A1F2C" strokeWidth="1"
          />
        ))}

        {/* Equilibrium centreline (dashed) */}
        <line
          x1={60} y1={WIRE_Y} x2={VW - 60} y2={WIRE_Y}
          stroke="#2A3042" strokeWidth="1" strokeDasharray="6 4"
        />

        {/* ─── B-field symbols (crosses = into page) ─────────────────────── */}
        {[100, 175, 265, 355, 445].map((x) => {
          const ys = [70, 130, 210, 270];
          return ys.map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x},${y})`}>
              <line x1={-5} y1={-5} x2={5} y2={5} stroke="#334155" strokeWidth="1.5" />
              <line x1={5} y1={-5} x2={-5} y2={5} stroke="#334155" strokeWidth="1.5" />
            </g>
          ));
        })}

        {/* B-field label */}
        <text x={20} y={28} fill="#475569" fontSize="11" fontFamily="monospace">
          B field (into page)
        </text>
        <text x={20} y={42} fill="#334155" fontSize="10" fontFamily="monospace">
          B = {format3SF(bFieldT)} T
        </text>

        {/* ─── Force arrow (only when |F| > 0) ───────────────────────────── */}
        {!noForce && arrowH > 2 && (
          <g>
            {/* Shaft */}
            <line
              x1={arrowX}
              y1={arrowBaseY}
              x2={arrowX}
              y2={arrowTipY}
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <polygon
              points={
                directionSign >= 0
                  ? `${arrowX},${arrowTipY - 1} ${arrowX - 8},${arrowTipY + 12} ${arrowX + 8},${arrowTipY + 12}`
                  : `${arrowX},${arrowTipY + 1} ${arrowX - 8},${arrowTipY - 12} ${arrowX + 8},${arrowTipY - 12}`
              }
              fill="#F59E0B"
            />
            {/* F label */}
            <text
              x={arrowX + 12}
              y={arrowTipY + (directionSign >= 0 ? 4 : -4)}
              fill="#FCD34D"
              fontSize="13"
              fontFamily="monospace"
              fontWeight="bold"
            >
              F = {format3SF(forceMagnitudeN)} N
            </text>
          </g>
        )}

        {/* No-force label */}
        {noForce && (
          <text
            x={VW / 2}
            y={WIRE_Y - 40}
            textAnchor="middle"
            fill="#4B5563"
            fontSize="13"
            fontFamily="monospace"
          >
            No current → No force  (F = BIL = 0)
          </text>
        )}

        {/* ─── Wire ───────────────────────────────────────────────────────── */}
        {/* Wire shadow/glow */}
        <line
          x1={50} y1={wireY} x2={VW - 50} y2={wireY}
          stroke="#92400E" strokeWidth="10" opacity="0.3"
        />
        {/* Wire body */}
        <line
          x1={50} y1={wireY} x2={VW - 50} y2={wireY}
          stroke="#D97706"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Current direction arrows on wire */}
        {currentA > 0.001 && (
          <>
            {[160, 260, 360].map((x) => (
              <polygon
                key={x}
                points={`${x + 12},${wireY} ${x - 2},${wireY - 6} ${x - 2},${wireY + 6}`}
                fill="#FCD34D"
                opacity="0.9"
              />
            ))}
            <text x={VW - 100} y={wireY - 10} fill="#FCD34D" fontSize="10" fontFamily="monospace">
              I → (+)
            </text>
          </>
        )}
        {currentA < -0.001 && (
          <>
            {[360, 260, 160].map((x) => (
              <polygon
                key={x}
                points={`${x - 12},${wireY} ${x + 2},${wireY - 6} ${x + 2},${wireY + 6}`}
                fill="#93C5FD"
                opacity="0.9"
              />
            ))}
            <text x={60} y={wireY - 10} fill="#93C5FD" fontSize="10" fontFamily="monospace">
              (−) ← I
            </text>
          </>
        )}

        {/* Wire terminals (end-caps) */}
        <rect x={40} y={wireY - 14} width={16} height={28} rx={4} fill="#1E2433" stroke="#475569" strokeWidth="1.5" />
        <rect x={VW - 56} y={wireY - 14} width={16} height={28} rx={4} fill="#1E2433" stroke="#475569" strokeWidth="1.5" />

        {/* ─── 3D Fleming Hint Panel ─────────────────────────────────────── */}
        <g transform={`translate(22, ${VH - 100})`}>
          {/* Panel background */}
          <rect x={0} y={0} width={148} height={90} rx={8}
            fill="#0E1119" stroke="#2A3042" strokeWidth="1.5" />

          {/* Title */}
          <text x={8} y={15} fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            FLEMING'S LEFT-HAND RULE
          </text>

          {/* B arrow (blue, downward into page = shown as down-left) */}
          <line x1={30} y1={65} x2={30} y2={35} stroke="#60A5FA" strokeWidth="2" />
          <polygon points="30,33 26,42 34,42" fill="#60A5FA" />
          <text x={36} y={37} fill="#60A5FA" fontSize="9" fontFamily="monospace">B (field)</text>

          {/* I arrow (green, right) */}
          <line x1={30} y1={65} x2={80} y2={65} stroke="#34D399" strokeWidth="2" />
          <polygon points="82,65 72,61 72,69" fill="#34D399" />
          <text x={52} y={78} fill="#34D399" fontSize="9" fontFamily="monospace">I (current)</text>

          {/* F arrow (amber, up-right) */}
          <line x1={30} y1={65} x2={60} y2={42} stroke="#FBBF24" strokeWidth="2" />
          <polygon points="62,40 52,44 58,52" fill="#FBBF24" />
          <text x={62} y={45} fill="#FBBF24" fontSize="9" fontFamily="monospace">F (force)</text>
        </g>

        {/* ─── Direction & Direction label bottom-right ────────────────────── */}
        <text
          x={VW - 20}
          y={VH - 16}
          textAnchor="end"
          fill={noForce ? '#4B5563' : directionSign > 0 ? '#FCD34D' : '#93C5FD'}
          fontSize="13"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Force: {directionLabel}
        </text>
      </svg>
    </div>
  );
};
