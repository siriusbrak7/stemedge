import { format3SF } from "@/lib/format";
import {
  TRACK_MAX_M,
  TRACK_MIN_M,
  type ForcesDerived,
  type ForcesState,
} from "./physics";

const VW = 640;
const VH = 300;
const GROUND_Y = 200;
const PX_PER_M = 48;
const TROLLEY_W = 72;
const TROLLEY_H = 40;

interface Props {
  state: ForcesState;
  derived: ForcesDerived;
  positionM: number;
  velocity: number;
  hitEnd: "min" | "max" | null;
  showVerticalForces: boolean;
  showVectors: boolean;
}

function arrowLen(newtons: number): number {
  return Math.abs(newtons) * 5;
}

function HArrow({
  dir,
  len,
  originX,
  originY,
  color,
  label,
  labelY,
}: {
  dir: 1 | -1;
  len: number;
  originX: number;
  originY: number;
  color: string;
  label: string;
  labelY: number;
}) {
  const tipX = originX + dir * len;
  const arrowPoints =
    dir > 0
      ? `${tipX + 8},${originY} ${tipX - 4},${originY - 6} ${tipX - 4},${originY + 6}`
      : `${tipX - 8},${originY} ${tipX + 4},${originY - 6} ${tipX + 4},${originY + 6}`;
  return (
    <>
      <line x1={originX} y1={originY} x2={tipX} y2={originY} stroke={color} strokeWidth="3" />
      <polygon points={arrowPoints} fill={color} />
      <text
        x={(originX + tipX) / 2}
        y={labelY}
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="700"
      >
        {label}
      </text>
    </>
  );
}

export function ForcesCanvas({
  state,
  derived,
  positionM,
  velocity,
  hitEnd,
  showVerticalForces,
  showVectors,
}: Props) {
  const cam = positionM * PX_PER_M - VW / 2 + 40;
  const trolleyX = positionM * PX_PER_M - cam;
  const worldToScreen = (m: number) => m * PX_PER_M - cam;

  const ticks: number[] = [];
  for (let m = TRACK_MIN_M; m <= TRACK_MAX_M; m += 1) ticks.push(m);

  const leftLen = arrowLen(state.leftN);
  const rightLen = arrowLen(state.rightN);
  const fricLen = arrowLen(Math.abs(derived.frictionSignedN));
  const resLen = Math.max(10, arrowLen(derived.resultantN));
  const resRight = derived.resultantN >= 0;
  const fricRight = derived.frictionSignedN >= 0;

  const velLen = Math.min(Math.abs(velocity) * 14, 90);
  const velDir: 1 | -1 = velocity >= 0 ? 1 : -1;
  const accLen = Math.min(Math.abs(derived.acceleration) * 14, 90);
  const accDir: 1 | -1 = derived.acceleration >= 0 ? 1 : -1;

  const weightN = state.massKg * 9.81;
  const weightLen = Math.min(weightN * 2.5, 90);

  return (
    <div className="mx-auto w-full max-w-[960px] overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" role="img" aria-label="Force diagram showing a trolley, applied forces, friction and resultant force">
        <rect width={VW} height={VH} fill="#0A0C10" />

        {ticks.map((m) => {
          const x = worldToScreen(m);
          if (x < -20 || x > VW + 20) return null;
          return (
            <g key={m}>
              <line x1={x} y1={GROUND_Y} x2={x} y2={GROUND_Y + 10} stroke="#334155" />
              <text x={x} y={GROUND_Y + 24} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace">
                {m} m
              </text>
            </g>
          );
        })}
        <line x1={-40} y1={GROUND_Y} x2={VW + 40} y2={GROUND_Y} stroke="#334155" strokeWidth="5" />
        <line
          x1={worldToScreen(TRACK_MIN_M) - 6}
          y1={GROUND_Y - 36}
          x2={worldToScreen(TRACK_MIN_M) - 6}
          y2={GROUND_Y}
          stroke="#64748B"
          strokeWidth="4"
        />
        <line
          x1={worldToScreen(TRACK_MAX_M) + 6}
          y1={GROUND_Y - 36}
          x2={worldToScreen(TRACK_MAX_M) + 6}
          y2={GROUND_Y}
          stroke="#64748B"
          strokeWidth="4"
        />
        <text x={worldToScreen(TRACK_MIN_M) + 5} y={GROUND_Y - 42} fill="#CBD5E1" fontSize="12" fontFamily="monospace">wall</text>
        <text x={worldToScreen(TRACK_MAX_M) - 5} y={GROUND_Y - 42} textAnchor="end" fill="#CBD5E1" fontSize="12" fontFamily="monospace">wall</text>

        <g transform={`translate(${trolleyX}, ${GROUND_Y})`}>
          {Math.abs(velocity) > 0.05 &&
            [18, 34, 50].map((dx) => (
              <line
                key={dx}
                x1={velocity > 0 ? -TROLLEY_W / 2 - dx : TROLLEY_W / 2 + dx}
                y1={-14}
                x2={velocity > 0 ? -TROLLEY_W / 2 - dx - 10 : TROLLEY_W / 2 + dx + 10}
                y2={-14}
                stroke="#F59E0B"
                strokeWidth="2"
                opacity={0.35}
              />
            ))}
          <rect
            x={-TROLLEY_W / 2}
            y={-TROLLEY_H - 8}
            width={TROLLEY_W}
            height={TROLLEY_H}
            rx="6"
            fill="#1E2433"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          <circle cx={-22} cy={-8} r="8" fill="#0F121A" stroke="#94A3B8" strokeWidth="2" />
          <circle cx={22} cy={-8} r="8" fill="#0F121A" stroke="#94A3B8" strokeWidth="2" />
          <text x="0" y={-TROLLEY_H + 16} textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="700">
            {format3SF(state.massKg)} kg
          </text>

          {state.rightN > 0.05 && (
            <HArrow
              dir={1}
              len={rightLen}
              originX={TROLLEY_W / 2}
              originY={-28}
              color="#F59E0B"
              label={`${format3SF(state.rightN)} N`}
              labelY={-38}
            />
          )}
          {state.leftN > 0.05 && (
            <HArrow
              dir={-1}
              len={leftLen}
              originX={-TROLLEY_W / 2}
              originY={-28}
              color="#38BDF8"
              label={`${format3SF(state.leftN)} N`}
              labelY={-38}
            />
          )}

          {Math.abs(derived.frictionSignedN) > 0.05 && (
            <>
              <HArrow
                dir={fricRight ? 1 : -1}
                len={fricLen}
                originX={fricRight ? TROLLEY_W / 2 : -TROLLEY_W / 2}
                originY={-4}
                color="#F87171"
                label={`f = ${format3SF(Math.abs(derived.frictionSignedN))} N`}
                labelY={10}
              />
              {derived.heldAtRest && (
                <text x="0" y={22} textAnchor="middle" fill="#FCA5A5" fontSize="8" fontFamily="monospace">
                  (static — holds trolley at rest)
                </text>
              )}
            </>
          )}

          {showVectors && Math.abs(velocity) > 0.05 && (
            <HArrow
              dir={velDir}
              len={velLen}
              originX={0}
              originY={-TROLLEY_H - 20}
              color="#34D399"
              label={`v=${format3SF(velocity)} m/s`}
              labelY={-TROLLEY_H - 32}
            />
          )}
          {showVectors && Math.abs(derived.acceleration) > 0.01 && (
            <HArrow
              dir={accDir}
              len={accLen}
              originX={0}
              originY={-TROLLEY_H - 50}
              color="#22D3EE"
              label={`a=${format3SF(derived.acceleration)} m/s²`}
              labelY={-TROLLEY_H - 62}
            />
          )}

          {showVerticalForces && (
            <>
              <line x1={0} y1={-TROLLEY_H / 2 - 8} x2={0} y2={-TROLLEY_H / 2 - 8 + weightLen} stroke="#A78BFA" strokeWidth="2.5" />
              <polygon
                points={`0,${-TROLLEY_H / 2 - 8 + weightLen + 8} -5,${-TROLLEY_H / 2 - 8 + weightLen} 5,${-TROLLEY_H / 2 - 8 + weightLen}`}
                fill="#A78BFA"
              />
              <text x={14} y={-TROLLEY_H / 2 - 8 + weightLen / 2} fill="#C4B5FD" fontSize="9" fontFamily="monospace">
                W={format3SF(weightN)} N
              </text>
              <line x1={0} y1={0} x2={0} y2={-weightLen} stroke="#86EFAC" strokeWidth="2.5" />
              <polygon
                points={`0,${-weightLen - 8} -5,${-weightLen} 5,${-weightLen}`}
                fill="#86EFAC"
              />
              <text x={14} y={-weightLen / 2} fill="#86EFAC" fontSize="9" fontFamily="monospace">
                R={format3SF(weightN)} N
              </text>
            </>
          )}
        </g>

        {Math.abs(derived.resultantN) > 0.05 ? (
          <g transform={`translate(${trolleyX}, ${GROUND_Y + 52})`}>
            {resRight ? (
              <>
                <line x1={0} y1={0} x2={resLen} y2={0} stroke="#FBBF24" strokeWidth="3" strokeDasharray="6,3" />
                <polygon points={`${resLen + 9},0 ${resLen - 4},-7 ${resLen - 4},7`} fill="#FBBF24" />
              </>
            ) : (
              <>
                <line x1={0} y1={0} x2={-resLen} y2={0} stroke="#FBBF24" strokeWidth="3" strokeDasharray="6,3" />
                <polygon points={`${-resLen - 9},0 ${-resLen + 4},-7 ${-resLen + 4},7`} fill="#FBBF24" />
              </>
            )}
            <text
              x={resRight ? resLen / 2 : -resLen / 2}
              y={-10}
              textAnchor="middle"
              fill="#FCD34D"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="700"
            >
              RESULTANT: {format3SF(derived.resultantN)} N
            </text>
            <text
              x={resRight ? resLen / 2 : -resLen / 2}
              y={16}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="8"
              fontFamily="monospace"
            >
          (vector sum · not an extra applied force)
            </text>
          </g>
        ) : (
          <text x={trolleyX} y={GROUND_Y + 60} textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="monospace">
            F_res = 0 · Newton's 1st Law (Balanced)
          </text>
        )}

        <text x="16" y="24" fill="#F1F5F9" fontSize="14" fontFamily="monospace">
          s = {format3SF(positionM)} m   v = {format3SF(velocity)} m/s   a = {format3SF(derived.acceleration)} m/s²
        </text>
        <text x="16" y="46" fill="#CBD5E1" fontSize="13" fontFamily="monospace">
          {derived.newton === "first" ? "Newton 1 — constant velocity (F_res = 0)" : "Newton 2 — F = ma (F_res ≠ 0)"}
        </text>
        {hitEnd && (
          <text x="16" y="66" fill="#FCA5A5" fontSize="13" fontFamily="monospace">
            Wall collision: the track stops the trolley; wall contact is outside the force model
          </text>
        )}
        <g transform={`translate(16, ${VH - 24})`}>
          <line x1="0" y1="0" x2="16" y2="0" stroke="#38BDF8" strokeWidth="3" />
          <text x="20" y="3" fill="#CBD5E1" fontSize="9" fontFamily="monospace">left</text>
          <line x1="58" y1="0" x2="74" y2="0" stroke="#F59E0B" strokeWidth="3" />
          <text x="78" y="3" fill="#CBD5E1" fontSize="9" fontFamily="monospace">right</text>
          <line x1="126" y1="0" x2="142" y2="0" stroke="#F87171" strokeWidth="3" />
          <text x="146" y="3" fill="#CBD5E1" fontSize="9" fontFamily="monospace">friction</text>
          <line x1="212" y1="0" x2="228" y2="0" stroke="#FBBF24" strokeWidth="3" strokeDasharray="4,2" />
          <text x="232" y="3" fill="#CBD5E1" fontSize="9" fontFamily="monospace">resultant</text>
          <text x="322" y="3" fill="#64748B" fontSize="8" fontFamily="monospace">arrow length ∝ force</text>
        </g>
      </svg>
    </div>
  );
}
