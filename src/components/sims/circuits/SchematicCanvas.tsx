import { useId } from "react";
import { format3SF } from "@/lib/format";
import type { CircuitEvaluation, CircuitState, PathComponent, Section, TrayType } from "./physics";

const VW = 680;
const VH = 360;
const TOP = 78;
const BOT = 278;
const LEFT = 108;
const RIGHT = 620;
const CELL_X = 54;

interface Props {
  state: CircuitState;
  evaluation: CircuitEvaluation;
  selected: TrayType | null;
  onPlaceSeries: () => void;
  onPlaceBranch: (sectionId: string, branchIndex: 0 | 1) => void;
  onRemove: (componentId: string) => void;
  onSplitParallel: (sectionId: string) => void;
  onClipVoltmeter: (target: string | "supply") => void;
  onToggleSwitch: () => void;
}

interface LaidSection {
  section: Section;
  x: number;
  w: number;
}

function layout(sections: Section[]): LaidSection[] {
  const widths = sections.map((s) => (s.type === "parallel" ? 150 : 108));
  const gap = 16;
  const total = widths.reduce((a, b) => a + b, 0) + gap * Math.max(0, sections.length - 1);
  const inner = RIGHT - LEFT;
  let x = LEFT + Math.max(0, (inner - total) / 2);
  return sections.map((section, i) => {
    const w = widths[i];
    const laid = { section, x, w };
    x += w + gap;
    return laid;
  });
}

function wire(live: boolean) {
  return live ? "#F59E0B" : "#475569";
}

function ResistorSymbol({
  x,
  y,
  label,
  live,
  voltage,
}: {
  x: number;
  y: number;
  label: string;
  live: boolean;
  voltage: number | null;
}) {
  const ohms = label.includes("20") ? "20 Ω" : "10 Ω";
  const tag = label.split(" · ")[0];
  return (
    <g>
      <line x1={x - 48} y1={y} x2={x - 24} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <line x1={x + 24} y1={y} x2={x + 48} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <text x={x} y={y - 16} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
        {tag}
      </text>
      <rect
        x={x - 24}
        y={y - 12}
        width="48"
        height="24"
        rx="3"
        fill="#182030"
        stroke={ohms === "20 Ω" ? "#818CF8" : "#22D3EE"}
        strokeWidth="1.8"
      />
      <text x={x} y={y + 4} textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="monospace" fontWeight="700">
        {ohms}
      </text>
      {voltage !== null && (
        <text x={x} y={y + 28} textAnchor="middle" fill="#FCD34D" fontSize="9" fontFamily="monospace">
          {format3SF(voltage)} V
        </text>
      )}
    </g>
  );
}

function LampSymbol({
  x,
  y,
  label,
  live,
  current,
  voltage,
}: {
  x: number;
  y: number;
  label: string;
  live: boolean;
  current: number;
  voltage: number | null;
}) {
  const glow = live ? Math.min(1, Math.abs(current) / 0.5) : 0;
  return (
    <g>
      <line x1={x - 48} y1={y} x2={x - 18} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <line x1={x + 18} y1={y} x2={x + 48} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <circle cx={x} cy={y} r="16" fill={`rgba(251, 191, 36, ${0.12 + glow * 0.55})`} stroke="#F59E0B" strokeWidth="2" />
      <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} stroke="#FCD34D" strokeWidth="1.6" />
      <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} stroke="#FCD34D" strokeWidth="1.6" />
      <text x={x} y={y - 22} textAnchor="middle" fill="#FCD34D" fontSize="9" fontFamily="monospace">
        {label}
      </text>
      {voltage !== null && (
        <text x={x} y={y + 30} textAnchor="middle" fill="#FCD34D" fontSize="9" fontFamily="monospace">
          {format3SF(voltage)} V
        </text>
      )}
    </g>
  );
}

function AmmeterSymbol({ x, y, reading, live }: { x: number; y: number; reading: number | null; live: boolean }) {
  const text =
    reading === null ? "—" : !Number.isFinite(reading) ? "∞" : `${format3SF(reading)} A`;
  return (
    <g>
      <line x1={x - 48} y1={y} x2={x - 18} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <line x1={x + 18} y1={y} x2={x + 48} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <circle cx={x} cy={y} r="18" fill="#12241F" stroke="#10B981" strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#34D399" fontSize="14" fontWeight="800">
        A
      </text>
      <rect x={x - 28} y={y + 20} width="56" height="14" rx="3" fill="#06120E" stroke="#059669" strokeWidth="0.8" />
      <text x={x} y={y + 30.5} textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace" fontWeight="700">
        {text}
      </text>
    </g>
  );
}

function EmptySlot({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return (
    <g className={active ? "animate-slot-pulse" : undefined}>
      <rect
        x={x - 44}
        y={y - 18}
        width="88"
        height="36"
        rx="6"
        fill="#10141F"
        stroke={active ? "#F59E0B" : "#334155"}
        strokeDasharray="4 3"
        strokeWidth="1.4"
      />
      <text x={x} y={y + 4} textAnchor="middle" fill={active ? "#FBBF24" : "#64748B"} fontSize="9" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

export function SchematicCanvas({
  state,
  evaluation,
  selected,
  onPlaceSeries,
  onPlaceBranch,
  onRemove,
  onSplitParallel,
  onClipVoltmeter,
  onToggleSwitch,
}: Props) {
  const laid = layout(state.sections);
  const live = evaluation.isClosed;
  const placingPath = selected === "resistor_10" || selected === "resistor_20" || selected === "ammeter" || selected === "lamp";
  const placingV = selected === "voltmeter";
  const flowId = useId();
  const loopD = `M ${CELL_X} ${TOP} L ${RIGHT} ${TOP} L ${RIGHT} ${BOT} L ${CELL_X} ${BOT}`;

  function renderComp(c: PathComponent, x: number, y: number) {
    const i = evaluation.componentCurrent[c.id] ?? 0;
    const isLive = live && Math.abs(i) > 0.001;
    const seriesOwner = state.sections.find((s) => s.type === "series" && s.component.id === c.id);
    const v = evaluation.resistorCurrents[c.id]?.voltage ?? null;
    return (
      <g key={c.id}>
        {c.kind === "ammeter" ? (
          <AmmeterSymbol x={x} y={y} reading={evaluation.componentCurrent[c.id] ?? evaluation.ammeterReading} live={isLive} />
        ) : c.kind === "lamp" ? (
          <LampSymbol x={x} y={y} label={c.label} live={isLive} current={i} voltage={isLive ? v : 0} />
        ) : (
          <ResistorSymbol x={x} y={y} label={c.label} live={isLive} voltage={isLive ? v : live ? 0 : null} />
        )}
        <g
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(c.id);
          }}
        >
          <rect x={x + 28} y={y - 28} width="18" height="18" rx="4" fill="#1E2333" stroke="#64748B" />
          <text x={x + 37} y={y - 15} textAnchor="middle" fill="#94A3B8" fontSize="12" className="pointer-events-none">
            ×
          </text>
        </g>
        {placingV && c.kind !== "ammeter" && (
          <g
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClipVoltmeter(c.id);
            }}
          >
            <rect x={x - 32} y={y + 16} width="64" height="18" rx="4" fill="#082F49" stroke="#38BDF8" />
            <text x={x} y={y + 28} textAnchor="middle" fill="#7DD3FC" fontSize="9" fontFamily="monospace">
              clip V here
            </text>
          </g>
        )}
        {c.kind !== "ammeter" && seriesOwner && (
          <g
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSplitParallel(seriesOwner.id);
            }}
          >
            <rect x={x - 40} y={y - 48} width="80" height="16" rx="4" fill="#1E1B4B" stroke="#818CF8" />
            <text x={x} y={y - 37} textAnchor="middle" fill="#C4B5FD" fontSize="8" fontFamily="monospace">
              add in parallel
            </text>
          </g>
        )}
      </g>
    );
  }

  const vTarget = state.voltmeterAcross;
  let vLead: { x1: number; x2: number; y: number } | null = null;
  if (vTarget === "supply") {
    vLead = { x1: CELL_X + 18, x2: LEFT - 8, y: TOP };
  } else if (vTarget) {
    for (const item of laid) {
      if (item.section.type === "series" && item.section.component.id === vTarget) {
        vLead = { x1: item.x + 10, x2: item.x + item.w - 10, y: TOP };
      }
      if (item.section.type === "parallel") {
        item.section.branches.forEach((branch, bi) => {
          const cy = bi === 0 ? TOP : TOP + 56;
          const cx = item.x + item.w / 2;
          if (branch[0]?.id === vTarget) vLead = { x1: cx - 24, x2: cx + 24, y: cy };
        });
      }
    }
  }

  const trailingX = laid.length ? laid[laid.length - 1].x + laid[laid.length - 1].w + 58 : (LEFT + RIGHT) / 2;
  const switchX = 200;
  const switchOpen = !state.switchClosed;

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-inset shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-faint bg-canvas-elevated px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-accent" : "bg-slate-600"}`} />
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink">
            Cambridge schematic
          </span>
        </div>
        <span className="font-mono text-[11px] text-ink-faint">
          {placingV
            ? "Clip the voltmeter across the cell or a load"
            : placingPath
              ? "Tap a dashed branch slot, or just tap a part in the tray to add it"
              : "Tap a part in the tray to add it to the loop"}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full min-w-[560px]">
          <defs>
            <pattern id={`${flowId}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#171C2B" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width={VW} height={VH} fill={`url(#${flowId}-grid)`} />

          <path
            d={loopD}
            fill="none"
            stroke={live ? "#F59E0B" : "#334155"}
            strokeWidth="2.4"
            strokeLinecap="round"
            className={live ? "animate-current-dash" : undefined}
            style={live ? { strokeDasharray: "10 8" } : undefined}
          />

          <g>
            <line x1={CELL_X} y1={TOP} x2={CELL_X} y2={118} stroke="#F59E0B" strokeWidth="2.2" />
            <line x1={CELL_X - 16} y1={126} x2={CELL_X + 16} y2={126} stroke="#F59E0B" strokeWidth="2.4" />
            <line x1={CELL_X - 7} y1={146} x2={CELL_X + 7} y2={146} stroke="#F59E0B" strokeWidth="6" />
            <line x1={CELL_X} y1={154} x2={CELL_X} y2={BOT} stroke="#F59E0B" strokeWidth="2.2" />
            <text x={CELL_X - 24} y={130} fill="#FBBF24" fontSize="12" fontWeight="700">
              +
            </text>
            <text x={CELL_X - 24} y={154} fill="#94A3B8" fontSize="12" fontWeight="700">
              −
            </text>
            <text x={CELL_X} y={176} textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="monospace" fontWeight="700">
              {format3SF(state.cellEmf)} V
            </text>
            {state.internalR > 0.001 && (
              <text x={CELL_X} y={190} textAnchor="middle" fill="#F87171" fontSize="9" fontFamily="monospace">
                r = {format3SF(state.internalR)} Ω
              </text>
            )}
            {placingV && (
              <g className="cursor-pointer" onClick={() => onClipVoltmeter("supply")}>
                <rect x={CELL_X - 32} y={198} width="64" height="18" rx="4" fill="#082F49" stroke="#38BDF8" />
                <text x={CELL_X} y={210} textAnchor="middle" fill="#7DD3FC" fontSize="8" fontFamily="monospace">
                  clip V (cell)
                </text>
              </g>
            )}
          </g>

          <g className="cursor-pointer" onClick={onToggleSwitch}>
            <line x1={switchX - 28} y1={BOT} x2={switchX - 10} y2={BOT} stroke={live || !switchOpen ? "#F59E0B" : "#475569"} strokeWidth="2.4" />
            <line
              x1={switchX - 10}
              y1={BOT}
              x2={switchOpen ? switchX + 8 : switchX + 14}
              y2={switchOpen ? BOT - 16 : BOT}
              stroke="#E2E8F0"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <line x1={switchX + 14} y1={BOT} x2={switchX + 32} y2={BOT} stroke={live || !switchOpen ? "#F59E0B" : "#475569"} strokeWidth="2.4" />
            <circle cx={switchX - 10} cy={BOT} r="3.5" fill="#F8FAFC" />
            <circle cx={switchX + 14} cy={BOT} r="3.5" fill="#F8FAFC" />
            <rect x={switchX - 36} y={BOT + 8} width="72" height="18" rx="4" fill="#141722" stroke="#F59E0B" />
            <text x={switchX} y={BOT + 21} textAnchor="middle" fill="#FCD34D" fontSize="9" fontFamily="monospace" fontWeight="700">
              {switchOpen ? "switch OPEN" : "switch CLOSED"}
            </text>
          </g>

          {live && (
            <>
              <polygon points={`${RIGHT - 18},${TOP - 8} ${RIGHT},${TOP} ${RIGHT - 18},${TOP + 8}`} fill="#FCD34D" />
              <text x={RIGHT - 8} y={TOP - 14} textAnchor="end" fill="#FCD34D" fontSize="9" fontFamily="monospace">
                conventional I
              </text>
            </>
          )}

          {laid.map((item) => {
            if (item.section.type === "series") {
              const cx = item.x + item.w / 2;
              return <g key={item.section.id}>{renderComp(item.section.component, cx, TOP)}</g>;
            }
            const cx = item.x + item.w / 2;
            const [b0, b1] = item.section.branches;
            const y2 = TOP + 58;
            const i0 = evaluation.branchCurrents[`${item.section.id}:0`];
            const i1 = evaluation.branchCurrents[`${item.section.id}:1`];
            return (
              <g key={item.section.id}>
                <line x1={item.x} y1={TOP} x2={item.x} y2={y2} stroke={wire(live)} strokeWidth="2" />
                <line x1={item.x + item.w} y1={TOP} x2={item.x + item.w} y2={y2} stroke={wire(live)} strokeWidth="2" />
                <line x1={item.x} y1={y2} x2={item.x + item.w} y2={y2} stroke={wire(live)} strokeWidth="2" />
                {Number.isFinite(i0) && live && (
                  <text x={item.x - 4} y={TOP + 28} textAnchor="end" fill="#FCD34D" fontSize="8" fontFamily="monospace">
                    {format3SF(i0)} A
                  </text>
                )}
                {Number.isFinite(i1) && live && (
                  <text x={item.x - 4} y={y2 - 6} textAnchor="end" fill="#FCD34D" fontSize="8" fontFamily="monospace">
                    {format3SF(i1)} A
                  </text>
                )}
                {b0[0] ? (
                  renderComp(b0[0], cx, TOP)
                ) : (
                  <g
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaceBranch(item.section.id, 0);
                    }}
                  >
                    <EmptySlot x={cx} y={TOP} label="branch 1 — tap a part" active />
                  </g>
                )}
                {b1[0] ? (
                  renderComp(b1[0], cx, y2)
                ) : (
                  <g
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaceBranch(item.section.id, 1);
                    }}
                  >
                    <EmptySlot x={cx} y={y2} label="branch 2 — tap a part" active />
                  </g>
                )}
              </g>
            );
          })}

          {state.sections.length < 4 && (
            <g
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onPlaceSeries();
              }}
            >
              <EmptySlot
                x={trailingX}
                y={TOP}
                label={state.sections.length === 0 ? "tap to add 10 Ω" : placingPath ? "place here" : "tap tray to add"}
                active={placingPath}
              />
            </g>
          )}

          {state.sections.length === 0 && (
            <text x={VW / 2} y={TOP - 22} textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="monospace">
              Empty loop — tap 10 Ω in the tray. Cell is already on the left. Switch is on the bottom rail.
            </text>
          )}

          {vLead && (
            <g>
              <line x1={vLead.x1} y1={vLead.y} x2={vLead.x1} y2={BOT - 48} stroke="#38BDF8" strokeWidth="1.4" strokeDasharray="3 3" />
              <line x1={vLead.x2} y1={vLead.y} x2={vLead.x2} y2={BOT - 48} stroke="#38BDF8" strokeWidth="1.4" strokeDasharray="3 3" />
              <line x1={vLead.x1} y1={BOT - 48} x2={vLead.x2} y2={BOT - 48} stroke="#38BDF8" strokeWidth="1.4" strokeDasharray="3 3" />
              <circle cx={(vLead.x1 + vLead.x2) / 2} cy={BOT - 48} r="16" fill="#0F2133" stroke="#0EA5E9" strokeWidth="2" />
              <text
                x={(vLead.x1 + vLead.x2) / 2}
                y={BOT - 43}
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="13"
                fontWeight="800"
              >
                V
              </text>
              <text
                x={(vLead.x1 + vLead.x2) / 2}
                y={BOT - 26}
                textAnchor="middle"
                fill="#7DD3FC"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="700"
              >
                {evaluation.voltmeterReading !== null ? `${format3SF(evaluation.voltmeterReading)} V` : "—"}
              </text>
            </g>
          )}

          {evaluation.isShort && (
            <text x={VW / 2} y={32} textAnchor="middle" fill="#F87171" fontSize="12" fontFamily="monospace" fontWeight="700">
              SHORT CIRCUIT — current theoretically huge. Add a load.
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
