import { useRef, useState } from "react";
import { format3SF, G_N_PER_KG } from "@/lib/format";
import {
  MASS_BANK_KG,
  RULE_LENGTH_M,
  snapPos,
  type Load,
  type MomentsDerived,
  type MomentsState,
} from "./physics";

const VW = 640;
const VH = 300;
const RULE_X0 = 48;
const RULE_X1 = 592;
const RULE_Y = 148;
const PX_PER_M = (RULE_X1 - RULE_X0) / RULE_LENGTH_M;

interface Props {
  state: MomentsState;
  derived: MomentsDerived;
  onChange: (next: MomentsState) => void;
}

function toSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

function xOf(posM: number) {
  return RULE_X0 + posM * PX_PER_M;
}

export function MetreRuleCanvas({ state, derived, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ kind: "load" | "pivot" | "bank"; id?: string; massKg?: number } | null>(null);
  const tilt = derived.balanced ? 0 : Math.max(-16, Math.min(16, derived.net * 1.1));
  const pivotX = xOf(state.pivotM);

  function posFromX(x: number) {
    return snapPos((x - RULE_X0) / PX_PER_M);
  }

  function onPointerDownLoad(e: React.PointerEvent, id: string) {
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag({ kind: "load", id });
  }

  function onPointerDownPivot(e: React.PointerEvent) {
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag({ kind: "pivot" });
  }

  function onPointerDownBank(e: React.PointerEvent, massKg: number) {
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag({ kind: "bank", massKg });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag || !svgRef.current) return;
    const p = toSvg(svgRef.current, e.clientX, e.clientY);
    const posM = posFromX(p.x);
    if (drag.kind === "pivot") {
      onChange({ ...state, pivotM: Math.max(0.1, Math.min(0.9, posM)) });
    } else if (drag.kind === "load" && drag.id) {
      const onBeam = p.y > 70 && p.y < 230;
      onChange({
        ...state,
        loads: onBeam
          ? state.loads.map((l) => (l.id === drag.id ? { ...l, posM } : l))
          : state.loads,
      });
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!drag || !svgRef.current) {
      setDrag(null);
      return;
    }
    const p = toSvg(svgRef.current, e.clientX, e.clientY);
    const posM = posFromX(p.x);
    const onBeam = p.y > 70 && p.y < 210 && p.x >= RULE_X0 - 8 && p.x <= RULE_X1 + 8;

    if (drag.kind === "bank" && drag.massKg != null && onBeam) {
      onChange({
        ...state,
        loads: [...state.loads, { id: `m${Date.now()}`, massKg: drag.massKg, posM }],
      });
    } else if (drag.kind === "load" && drag.id && !onBeam) {
      onChange({ ...state, loads: state.loads.filter((l) => l.id !== drag.id) });
    }
    setDrag(null);
  }

  const ticks = Array.from({ length: 11 }, (_, i) => i / 10);

  return (
    <div className="overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-auto w-full touch-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDrag(null)}
        aria-label="Metre rule on a knife-edge pivot"
      >
        <rect width={VW} height={VH} fill="#0A0C10" />
        <text x="16" y="22" fill="#94A3B8" fontSize="11" fontFamily="monospace">
          Drag masses onto the rule · drag the fulcrum · drag a mass off to remove
        </text>
        <text x={VW - 16} y="22" textAnchor="end" fill={derived.balanced ? "#34D399" : "#F59E0B"} fontSize="12" fontFamily="monospace" fontWeight="700">
          {derived.balanced ? "EQUILIBRIUM" : "UNBALANCED"}
        </text>

        <polygon points={`${pivotX},154 ${pivotX - 16},228 ${pivotX + 16},228`} fill="#64748B" />
        <rect x={pivotX - 28} y="228" width="56" height="8" rx="2" fill="#334155" />
        <text x={pivotX} y="252" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
          pivot {Math.round(state.pivotM * 100)} cm
        </text>
        <rect
          x={pivotX - 10}
          y="150"
          width="20"
          height="80"
          fill="transparent"
          className="cursor-ew-resize"
          onPointerDown={onPointerDownPivot}
        />

        <g transform={`rotate(${tilt} ${pivotX} ${RULE_Y})`}>
          <rect x={RULE_X0} y={RULE_Y - 7} width={RULE_X1 - RULE_X0} height="14" rx="2" fill="#B45309" />
          <rect x={RULE_X0} y={RULE_Y - 7} width={RULE_X1 - RULE_X0} height="6" fill="#F59E0B" opacity="0.35" />
          {ticks.map((m) => {
            const x = xOf(m);
            const major = Number.isInteger(m * 10);
            return (
              <g key={m}>
                <line x1={x} y1={RULE_Y - 7} x2={x} y2={RULE_Y + (major ? 10 : 5)} stroke="#0B0D12" strokeWidth="1" />
                {major && (
                  <text x={x} y={RULE_Y + 24} textAnchor="middle" fill="#FCD34D" fontSize="9" fontFamily="monospace">
                    {Math.round(m * 100)}
                  </text>
                )}
              </g>
            );
          })}

          {state.includeRule && (
            <g>
              <polygon points={`${xOf(0.5)},${RULE_Y - 14} ${xOf(0.5) - 7},${RULE_Y - 26} ${xOf(0.5) + 7},${RULE_Y - 26}`} fill="#34D399" />
              <text x={xOf(0.5)} y={RULE_Y - 30} textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="monospace">
                C.o.G. {format3SF(state.ruleMassKg * G_N_PER_KG)} N
              </text>
            </g>
          )}

          {state.loads.map((load) => (
            <MassBlock
              key={load.id}
              load={load}
              onPointerDown={(ev) => onPointerDownLoad(ev, load.id)}
            />
          ))}

          {derived.terms
            .filter((t) => t.sense !== "none" && t.id !== "rule")
            .map((t) => {
              const x1 = pivotX;
              const x2 = xOf(t.posM);
              return (
                <g key={`arm-${t.id}`} opacity="0.85">
                  <line x1={x1} y1={RULE_Y + 36} x2={x2} y2={RULE_Y + 36} stroke="#64748B" strokeDasharray="4 3" />
                  <text
                    x={(x1 + x2) / 2}
                    y={RULE_Y + 50}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    d = {format3SF(t.armM)} m · {t.sense.toUpperCase()} {format3SF(t.momentNm)} N m
                  </text>
                </g>
              );
            })}
        </g>

        {MASS_BANK_KG.map((m, i) => {
          const x = 70 + i * 70;
          const y = 272;
          return (
            <g
              key={m}
              className="cursor-grab"
              onPointerDown={(e) => onPointerDownBank(e, m)}
              transform={`translate(${x}, ${y})`}
            >
              <rect x="-24" y="-16" width="48" height="22" rx="4" fill="#1E2433" stroke="#F59E0B" />
              <text x="0" y="-1" textAnchor="middle" fill="#FCD34D" fontSize="10" fontFamily="monospace" fontWeight="700">
                {m} kg
              </text>
            </g>
          );
        })}
        <text x="16" y="276" fill="#64748B" fontSize="9" fontFamily="monospace">
          tray
        </text>
      </svg>
    </div>
  );
}

function MassBlock({
  load,
  onPointerDown,
}: {
  load: Load;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const x = xOf(load.posM);
  const h = 18 + load.massKg * 10;
  return (
    <g className="cursor-grab" onPointerDown={onPointerDown}>
      <line x1={x} y1={RULE_Y - 7} x2={x} y2={RULE_Y - 7 - 8} stroke="#94A3B8" />
      <rect
        x={x - 18}
        y={RULE_Y - 7 - 8 - h}
        width="36"
        height={h}
        rx="4"
        fill="#1E2433"
        stroke={load.hidden ? "#A78BFA" : "#38BDF8"}
        strokeWidth="2"
      />
      <text
        x={x}
        y={RULE_Y - 7 - 8 - h / 2 + 4}
        textAnchor="middle"
        fill={load.hidden ? "#DDD6FE" : "#E0F2FE"}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="700"
      >
        {load.hidden ? "?" : `${format3SF(load.massKg)} kg`}
      </text>
    </g>
  );
}
