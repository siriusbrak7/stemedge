import { format3SF } from "@/lib/format";
import {
  TRACK_MAX_M,
  TRACK_MIN_M,
  type ForcesDerived,
  type ForcesState,
} from "./physics";

const VW = 640;
const VH = 280;
const GROUND_Y = 188;
const PX_PER_M = 48;
const TROLLEY_W = 72;
const TROLLEY_H = 40;

interface Props {
  state: ForcesState;
  derived: ForcesDerived;
  positionM: number;
  velocity: number;
  hitEnd: "min" | "max" | null;
}

function arrowLen(newtons: number): number {
  return Math.min(18 + Math.abs(newtons) * 6.5, 110);
}

export function ForcesCanvas({ state, derived, positionM, velocity, hitEnd }: Props) {
  const cam = positionM * PX_PER_M - VW / 2 + 40;
  const trolleyX = positionM * PX_PER_M - cam;
  const worldToScreen = (m: number) => m * PX_PER_M - cam;

  const ticks: number[] = [];
  for (let m = TRACK_MIN_M; m <= TRACK_MAX_M; m += 1) ticks.push(m);

  const leftLen = arrowLen(state.leftN);
  const rightLen = arrowLen(state.rightN);
  const fricLen = arrowLen(Math.abs(derived.frictionSignedN));
  const resLen = arrowLen(Math.abs(derived.resultantN));
  const resRight = derived.resultantN >= 0;
  const fricRight = derived.frictionSignedN >= 0;
  const movingRight = velocity > 0.05;
  const movingLeft = velocity < -0.05;

  return (
    <div className="overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" aria-label="Trolley on a metre track">
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

        <g transform={`translate(${trolleyX}, ${GROUND_Y})`}>
          {(movingRight || movingLeft) &&
            [18, 34, 50].map((dx) => (
              <line
                key={dx}
                x1={movingRight ? -TROLLEY_W / 2 - dx : TROLLEY_W / 2 + dx}
                y1={-14}
                x2={movingRight ? -TROLLEY_W / 2 - dx - 10 : TROLLEY_W / 2 + dx + 10}
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
            <g>
              <line x1={TROLLEY_W / 2} y1={-28} x2={TROLLEY_W / 2 + rightLen} y2={-28} stroke="#F59E0B" strokeWidth="3.2" />
              <polygon
                points={`${TROLLEY_W / 2 + rightLen + 8},-28 ${TROLLEY_W / 2 + rightLen - 4},-34 ${TROLLEY_W / 2 + rightLen - 4},-22`}
                fill="#F59E0B"
              />
              <text x={TROLLEY_W / 2 + rightLen / 2} y={-36} textAnchor="middle" fill="#FCD34D" fontSize="10" fontFamily="monospace">
                {format3SF(state.rightN)} N
              </text>
            </g>
          )}
          {state.leftN > 0.05 && (
            <g>
              <line x1={-TROLLEY_W / 2} y1={-28} x2={-TROLLEY_W / 2 - leftLen} y2={-28} stroke="#38BDF8" strokeWidth="3.2" />
              <polygon
                points={`${-TROLLEY_W / 2 - leftLen - 8},-28 ${-TROLLEY_W / 2 - leftLen + 4},-34 ${-TROLLEY_W / 2 - leftLen + 4},-22`}
                fill="#38BDF8"
              />
              <text x={-TROLLEY_W / 2 - leftLen / 2} y={-36} textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace">
                {format3SF(state.leftN)} N
              </text>
            </g>
          )}
          {Math.abs(derived.frictionSignedN) > 0.05 && (
            <g>
              {fricRight ? (
                <>
                  <line x1={TROLLEY_W / 2} y1={-8} x2={TROLLEY_W / 2 + fricLen} y2={-8} stroke="#F87171" strokeWidth="2.4" />
                  <polygon
                    points={`${TROLLEY_W / 2 + fricLen + 7},-8 ${TROLLEY_W / 2 + fricLen - 3},-13 ${TROLLEY_W / 2 + fricLen - 3},-3`}
                    fill="#F87171"
                  />
                </>
              ) : (
                <>
                  <line x1={-TROLLEY_W / 2} y1={-8} x2={-TROLLEY_W / 2 - fricLen} y2={-8} stroke="#F87171" strokeWidth="2.4" />
                  <polygon
                    points={`${-TROLLEY_W / 2 - fricLen - 7},-8 ${-TROLLEY_W / 2 - fricLen + 3},-13 ${-TROLLEY_W / 2 - fricLen + 3},-3`}
                    fill="#F87171"
                  />
                </>
              )}
              <text
                x={fricRight ? TROLLEY_W / 2 + fricLen / 2 : -TROLLEY_W / 2 - fricLen / 2}
                y={6}
                textAnchor="middle"
                fill="#FCA5A5"
                fontSize="9"
                fontFamily="monospace"
              >
                friction {format3SF(Math.abs(derived.frictionSignedN))} N
              </text>
            </g>
          )}
        </g>

        {Math.abs(derived.resultantN) > 0.05 && (
          <g transform={`translate(${trolleyX}, ${GROUND_Y + 48})`}>
            {resRight ? (
              <>
                <line x1={0} y1={0} x2={resLen} y2={0} stroke="#FBBF24" strokeWidth="3.4" />
                <polygon points={`${resLen + 9},0 ${resLen - 4},-7 ${resLen - 4},7`} fill="#FBBF24" />
              </>
            ) : (
              <>
                <line x1={0} y1={0} x2={-resLen} y2={0} stroke="#FBBF24" strokeWidth="3.4" />
                <polygon points={`${-resLen - 9},0 ${-resLen + 4},-7 ${-resLen + 4},7`} fill="#FBBF24" />
              </>
            )}
            <text x={0} y={-10} textAnchor="middle" fill="#FCD34D" fontSize="10" fontFamily="monospace" fontWeight="700">
              F_res {format3SF(derived.resultantN)} N
            </text>
          </g>
        )}
        {Math.abs(derived.resultantN) <= 0.05 && (
          <text x={trolleyX} y={GROUND_Y + 52} textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="monospace">
            F_res = 0  ·  Newton 1
          </text>
        )}

        <text x="16" y="22" fill="#94A3B8" fontSize="11" fontFamily="monospace">
          s = {format3SF(positionM)} m   v = {format3SF(velocity)} m/s   a = {format3SF(derived.acceleration)} m/s²
        </text>
        <text x="16" y="40" fill="#64748B" fontSize="10" fontFamily="monospace">
          {derived.newton === "first" ? "Newton 1 — constant velocity" : "Newton 2 — F = ma"}
        </text>
        {hitEnd && (
          <text x={VW - 16} y="22" textAnchor="end" fill="#F87171" fontSize="11" fontFamily="monospace">
            End of bench — reverse the force or reset
          </text>
        )}
      </svg>
    </div>
  );
}
