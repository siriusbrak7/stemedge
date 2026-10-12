import React from 'react';
import {
  ElectromagnetismState,
  CalculatedElectromagnetism,
  format3SF,
} from './physics';

interface MagneticFieldCanvasProps {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

const VW = 560;
const VH = 340;
const CX = VW / 2;
const CY = VH / 2;

// Field circle radii in px
const CIRCLE_RADII = [28, 52, 80, 112, 148, 188];

export const MagneticFieldCanvas: React.FC<MagneticFieldCanvasProps> = ({
  state,
  calculated,
}) => {
  const { currentA } = state;
  const noField = Math.abs(currentA) < 0.001;
  const absI = Math.abs(currentA);
  const maxI = 10;

  // Opacity scales with |I| / max
  const baseOpacity = Math.min(absI / maxI, 1);

  // RHR: positive I (out of page ⊙) → field circles anticlockwise
  //       negative I (into page ⊗) → field circles clockwise
  const isOutOfPage = currentA > 0;

  return (
    <div className="relative bg-[#0A0C10] border border-[#1F2432] rounded-xl overflow-hidden">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto"
        aria-label="Magnetic field around a current-carrying wire"
      >
        {/* Background grid */}
        {[60, 120, 180, 240, 300].map((y) => (
          <line key={y} x1={0} y1={y} x2={VW} y2={y} stroke="#131825" strokeWidth="1" />
        ))}
        {[70, 140, 210, 280, 350, 420, 490].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={VH} stroke="#131825" strokeWidth="1" />
        ))}

        {/* ─── Field circles ─────────────────────────────────────────────── */}
        {!noField && CIRCLE_RADII.map((r, i) => {
          // Opacity decreases with radius (field weakens with distance)
          const ringOpacity = baseOpacity * Math.max(0.15, 1 - (i / CIRCLE_RADII.length) * 0.7);
          // Colour: blue for out-of-page, amber for into-page
          const stroke = isOutOfPage ? '#60A5FA' : '#F59E0B';

          // Arrow angle on circle (top of each circle)
          // Anticlockwise (out of page) → arrow points left at top (270° tangent)
          // Clockwise (into page) → arrow points right at top (90° tangent)
          const arrowAngle = isOutOfPage ? -Math.PI / 2 : Math.PI / 2; // tangent at top
          const arrowCircleAngle = -Math.PI / 2; // position on circle (top)
          const ax = CX + r * Math.cos(arrowCircleAngle);
          const ay = CY + r * Math.sin(arrowCircleAngle);
          const dx = Math.cos(arrowAngle) * 10;
          const dy = Math.sin(arrowAngle) * 10;

          return (
            <g key={r} opacity={ringOpacity}>
              {/* Circle */}
              <circle
                cx={CX} cy={CY} r={r}
                fill="none"
                stroke={stroke}
                strokeWidth={i === 0 ? 2 : 1.5}
              />
              {/* Direction arrowhead on circle (top) */}
              <g transform={`translate(${ax},${ay})`}>
                <polygon
                  points={`${dx * 0.6},${dy * 0.6} ${-dy * 0.4 - dx * 0.4},${dx * 0.4 - dy * 0.4} ${dy * 0.4 - dx * 0.4},${-dx * 0.4 - dy * 0.4}`}
                  fill={stroke}
                />
              </g>
              {/* Additional arrow at right (90° around) for clarity on larger circles */}
              {r >= 80 && (() => {
                const bAngle = 0; // right side of circle
                const bx = CX + r * Math.cos(bAngle);
                const by = CY + r * Math.sin(bAngle);
                const bdx = Math.cos(arrowAngle + Math.PI / 2) * 10;
                const bdy = Math.sin(arrowAngle + Math.PI / 2) * 10;
                return (
                  <g transform={`translate(${bx},${by})`}>
                    <polygon
                      points={`${bdx * 0.6},${bdy * 0.6} ${-bdy * 0.4 - bdx * 0.4},${bdx * 0.4 - bdy * 0.4} ${bdy * 0.4 - bdx * 0.4},${-bdx * 0.4 - bdy * 0.4}`}
                      fill={stroke}
                    />
                  </g>
                );
              })()}
            </g>
          );
        })}

        {/* No-field message */}
        {noField && (
          <text
            x={CX} y={CY - 60}
            textAnchor="middle"
            fill="#4B5563"
            fontSize="13"
            fontFamily="monospace"
          >
            No current → No magnetic field
          </text>
        )}

        {/* ─── Wire cross-section symbol ──────────────────────────────────── */}
        {/* Wire circle */}
        <circle
          cx={CX} cy={CY} r={18}
          fill="#1E2433"
          stroke={noField ? '#334155' : isOutOfPage ? '#60A5FA' : '#F59E0B'}
          strokeWidth="2.5"
        />
        {/* Symbol: ⊙ (out of page) or ⊗ (into page) */}
        {!noField && isOutOfPage && (
          <>
            {/* Dot */}
            <circle cx={CX} cy={CY} r={5} fill="#93C5FD" />
          </>
        )}
        {!noField && !isOutOfPage && (
          <>
            {/* Cross (into page) */}
            <line x1={CX - 9} y1={CY - 9} x2={CX + 9} y2={CY + 9} stroke="#FCD34D" strokeWidth="2.5" />
            <line x1={CX + 9} y1={CY - 9} x2={CX - 9} y2={CY + 9} stroke="#FCD34D" strokeWidth="2.5" />
          </>
        )}
        {noField && (
          <>
            {/* neutral dash */}
            <line x1={CX - 8} y1={CY} x2={CX + 8} y2={CY} stroke="#374151" strokeWidth="2" />
          </>
        )}

        {/* Wire label */}
        <text
          x={CX}
          y={CY + 32}
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
          fontFamily="monospace"
        >
          {noField
            ? 'Wire (I = 0)'
            : isOutOfPage
            ? `Wire (I out of page, ${format3SF(absI)} A)`
            : `Wire (I into page, ${format3SF(absI)} A)`}
        </text>

        {/* ─── RHR instruction label ─────────────────────────────────────── */}
        <rect x={16} y={VH - 56} width={280} height={44} rx={6}
          fill="#0E1119" stroke="#1F2432" strokeWidth="1" />
        <text x={24} y={VH - 38} fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">
          RIGHT-HAND RULE
        </text>
        <text x={24} y={VH - 22} fill="#64748B" fontSize="9.5" fontFamily="monospace">
          Thumb → current direction; fingers curl → B field
        </text>

        {/* ─── B-field intensity label top-right ─────────────────────────── */}
        <text x={VW - 20} y={24} textAnchor="end" fill="#475569" fontSize="11" fontFamily="monospace">
          I = {format3SF(currentA)} A
        </text>
        <text x={VW - 20} y={40} textAnchor="end" fill="#334155" fontSize="10" fontFamily="monospace">
          Field ∝ |I| / r
        </text>
      </svg>
    </div>
  );
};
