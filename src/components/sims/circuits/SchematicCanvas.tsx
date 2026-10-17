import { useId } from "react";
import { format3SF } from "@/lib/format";
import type { CircuitEvaluation, CircuitState, PathComponent, Section, TrayType } from "./physics";
import { resistorValueLabel } from "./physics";

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
  onClipVoltmeter: (target: string | "supply" | "switch" | null) => void;
  onToggleSwitch: () => void;
  onUpdateComponent?: (id: string, updates: Partial<PathComponent>) => void;
}

interface LaidSection {
  section: Section;
  x: number;
  w: number;
}

function layout(sections: Section[]): LaidSection[] {
  const widths = sections.map((s) => (s.type === "parallel" ? 120 : 100));
  const gap = 8;
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
  value,
  live,
  voltage,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  live: boolean;
  voltage: number | null;
}) {
  const ohms = resistorValueLabel(value);
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
        stroke={value === 20 ? "#818CF8" : "#22D3EE"}
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

function VariableResistorSymbol({
  x,
  y,
  label,
  value,
  live,
  voltage,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  live: boolean;
  voltage: number | null;
}) {
  const ohms = resistorValueLabel(value);
  const tag = label.split(" · ")[0];
  return (
    <g>
      <line x1={x - 48} y1={y} x2={x - 24} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <line x1={x + 24} y1={y} x2={x + 48} y2={y} stroke={wire(live)} strokeWidth="2.2" />
      <text x={x} y={y - 18} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
        {tag}
      </text>
      <rect
        x={x - 24}
        y={y - 12}
        width="48"
        height="24"
        rx="3"
        fill="#182030"
        stroke="#F59E0B"
        strokeWidth="1.8"
      />
      <line x1={x - 18} y1={y + 16} x2={x + 20} y2={y - 16} stroke="#F59E0B" strokeWidth="1.6" />
      <polygon
        points={`${x + 20},${y - 16} ${x + 12},${y - 16} ${x + 19},${y - 9}`}
        fill="#F59E0B"
      />
      <text x={x} y={y + 4} textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="700">
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

function DiodeSymbol({
  x,
  y,
  label,
  live,
  reversed,
  voltage,
}: {
  x: number;
  y: number;
  label: string;
  live: boolean;
  reversed: boolean;
  voltage: number | null;
}) {
  const tag = label.split(" · ")[0];
  const color = reversed ? "#F43F5E" : live ? "#34D399" : "#10B981";
  return (
    <g>
      <line x1={x - 48} y1={y} x2={x - 16} y2={y} stroke={wire(live && !reversed)} strokeWidth="2.2" />
      <line x1={x + 16} y1={y} x2={x + 48} y2={y} stroke={wire(live && !reversed)} strokeWidth="2.2" />
      <text x={x} y={y - 18} textAnchor="middle" fill={reversed ? "#FB7185" : "#94A3B8"} fontSize="9" fontFamily="monospace">
        {tag} {reversed ? "(rev)" : "(fwd)"}
      </text>
      {reversed ? (
        <>
          <polygon points={`${x + 14},${y - 12} ${x + 14},${y + 12} ${x - 14},${y}`} fill="#3F1219" stroke={color} strokeWidth="1.8" />
          <line x1={x - 14} y1={y - 12} x2={x - 14} y2={y + 12} stroke={color} strokeWidth="2" />
        </>
      ) : (
        <>
          <polygon points={`${x - 14},${y - 12} ${x - 14},${y + 12} ${x + 14},${y}`} fill="#0F2D24" stroke={color} strokeWidth="1.8" />
          <line x1={x + 14} y1={y - 12} x2={x + 14} y2={y + 12} stroke={color} strokeWidth="2" />
        </>
      )}
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
  onUpdateComponent,
}: Props) {
  const laid = layout(state.sections);
  const live = evaluation.isClosed;
  const placingV = selected === "voltmeter";
  const flowId = useId();
  const switchX = 200;
  const loopD = `M ${CELL_X} ${TOP} L ${RIGHT} ${TOP} L ${RIGHT} ${BOT} L ${switchX + 32} ${BOT} M ${switchX - 28} ${BOT} L ${CELL_X} ${BOT}`;

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
        ) : c.kind === "variable_resistor" ? (
          <VariableResistorSymbol x={x} y={y} label={c.label} value={c.value} live={isLive} voltage={isLive ? v : live ? 0 : null} />
        ) : c.kind === "diode" ? (
          <DiodeSymbol x={x} y={y} label={c.label} live={isLive} reversed={Boolean(c.reversed)} voltage={isLive ? v : live ? 0 : null} />
        ) : (
          <ResistorSymbol
            x={x}
            y={y}
            label={c.label}
            value={c.value}
            live={isLive}
            voltage={isLive ? v : live ? 0 : null}
          />
        )}
        <g
          role="button" tabIndex={0} aria-label={`Remove ${c.label}`}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRemove(c.id); } }}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(c.id);
          }}
        >
          <rect x={x + 22} y={y - 34} width="30" height="30" rx="6" fill="#1E2333" stroke="#64748B" />
          <text x={x + 37} y={y - 15} textAnchor="middle" fill="#94A3B8" fontSize="12" className="pointer-events-none">
            ×
          </text>
        </g>
        {!placingV && onUpdateComponent && c.kind === "variable_resistor" && (
          <g className="font-mono text-[9px]">
            <g
              role="button"
              tabIndex={0}
              aria-label="Decrease variable resistance by 5 ohms"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const n = Math.max(0, c.value - 5);
                  onUpdateComponent(c.id, { value: n, label: c.label.replace(/\d+\s*Ω/, `${n} Ω`) });
                }
              }}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const nextVal = Math.max(0, c.value - 5);
                onUpdateComponent(c.id, {
                  value: nextVal,
                  label: c.label.replace(/\d+\s*Ω/, `${nextVal} Ω`),
                });
              }}
            >
              <rect x={x - 44} y={y + 14} width="40" height="20" rx="4" fill="#0F172A" stroke="#475569" />
              <text x={x - 24} y={y + 27} textAnchor="middle" fill="#CBD5E1">−5Ω</text>
            </g>
            <g
              role="button"
              tabIndex={0}
              aria-label="Increase variable resistance by 5 ohms"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const n = Math.min(50, c.value + 5);
                  onUpdateComponent(c.id, { value: n, label: c.label.replace(/\d+\s*Ω/, `${n} Ω`) });
                }
              }}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const nextVal = Math.min(50, c.value + 5);
                onUpdateComponent(c.id, {
                  value: nextVal,
                  label: c.label.replace(/\d+\s*Ω/, `${nextVal} Ω`),
                });
              }}
            >
              <rect x={x + 4} y={y + 14} width="40" height="20" rx="4" fill="#0F172A" stroke="#475569" />
              <text x={x + 24} y={y + 27} textAnchor="middle" fill="#CBD5E1">+5Ω</text>
            </g>
          </g>
        )}
        {!placingV && onUpdateComponent && c.kind === "diode" && (
          <g
            role="button"
            tabIndex={0}
            aria-label="Flip diode polarity"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onUpdateComponent(c.id, { reversed: !c.reversed });
              }
            }}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateComponent(c.id, { reversed: !c.reversed });
            }}
          >
            <rect x={x - 40} y={y + 14} width="80" height="20" rx="4" fill="#0F172A" stroke="#475569" />
            <text x={x} y={y + 27} textAnchor="middle" fill="#CBD5E1" fontSize="9" fontFamily="monospace">
              ⇄ Flip bias
            </text>
          </g>
        )}
        {placingV && c.kind !== "ammeter" && (
          <g
            role="button" tabIndex={0} aria-label={`Measure voltage across ${c.label}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClipVoltmeter(c.id); } }}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClipVoltmeter(c.id);
            }}
          >
            <rect x={x - 44} y={y + 14} width="88" height="24" rx="5" fill="#082F49" stroke="#38BDF8" />
            <text x={x} y={y + 28} textAnchor="middle" fill="#7DD3FC" fontSize="9" fontFamily="monospace">
              clip V here
            </text>
          </g>
        )}
        {c.kind !== "ammeter" && seriesOwner && (
          <g
            role="button" tabIndex={0} aria-label={`Split ${c.label} into parallel branches`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSplitParallel(seriesOwner.id); } }}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSplitParallel(seriesOwner.id);
            }}
          >
            <rect x={x - 48} y={y - 42} width="96" height="18" rx="4" fill="#1E1B4B" stroke="#818CF8" />
            <text x={x} y={y - 30} textAnchor="middle" fill="#C4B5FD" fontSize="8.5" fontFamily="monospace">
              + add parallel
            </text>
          </g>
        )}
      </g>
    );
  }

  const vTarget = state.voltmeterAcross;
  let vLead: { x1: number; x2: number; y: number; isBottom?: boolean } | null = null;
  if (vTarget === "supply") {
    vLead = { x1: CELL_X + 18, x2: LEFT - 8, y: TOP };
  } else if (vTarget === "switch") {
    vLead = { x1: switchX - 16, x2: switchX + 22, y: BOT, isBottom: true };
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
  const switchOpen = !state.switchClosed;

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-inset shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-faint bg-canvas-elevated px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-accent" : "bg-slate-600"}`} />
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink">
            Cambridge schematic
          </span>
          {state.voltmeterAcross && (
            <button
              type="button"
              onClick={() => onClipVoltmeter(null)}
              className="flex items-center gap-1 rounded border border-sky-400/40 bg-sky-950/60 px-2 py-0.5 font-mono text-[10px] text-sky-300 hover:bg-sky-900"
              title="Remove voltmeter probes from the circuit"
            >
              ✕ Unclip voltmeter
            </button>
          )}
        </div>
        <span className="font-mono text-[11px] text-ink-faint">
          {placingV
            ? "Clip the voltmeter across the cell, a load, or the switch"
            : "Tap a tray part to add it, or a dashed branch slot to fill it"}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg role="group" aria-label="Interactive electrical circuit schematic. Use the switch, component controls, or tray to change the circuit." viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full">
          <defs>
            <pattern id={`${flowId}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#171C2B" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width={VW} height={VH} fill={`url(#${flowId}-grid)`} />

          {evaluation.isShort && (
            <g className="animate-pulse">
              <rect x={180} y={10} width={360} height={28} rx={6} fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
              <text x={360} y={28} textAnchor="middle" fill="#FCA5A5" fontSize="11" fontFamily="monospace" fontWeight="700">
                ⚠️ SHORT CIRCUIT · Excessive Current (I → ∞)
              </text>
            </g>
          )}

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
              <g role="button" tabIndex={0} aria-label="Measure voltage across the cell" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClipVoltmeter("supply"); } }} className="cursor-pointer" onClick={() => onClipVoltmeter("supply")}>
                <rect x={CELL_X - 44} y={195} width="88" height="24" rx="5" fill="#082F49" stroke="#38BDF8" />
                <text x={CELL_X} y={210} textAnchor="middle" fill="#7DD3FC" fontSize="8" fontFamily="monospace">
                  clip V (cell)
                </text>
              </g>
            )}
          </g>

          <g role="button" tabIndex={0} aria-pressed={!switchOpen} aria-label={`Switch ${switchOpen ? "open" : "closed"}; activate to toggle`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleSwitch(); } }} className="cursor-pointer" onClick={onToggleSwitch}>
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

          {placingV && (
            <g
              role="button"
              tabIndex={0}
              aria-label="Measure voltage across the switch"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClipVoltmeter("switch");
                }
              }}
              className="cursor-pointer"
              onClick={() => onClipVoltmeter("switch")}
            >
              <rect x={switchX - 44} y={BOT + 32} width="88" height="22" rx="4" fill="#082F49" stroke="#38BDF8" />
              <text x={switchX} y={BOT + 46} textAnchor="middle" fill="#7DD3FC" fontSize="8" fontFamily="monospace">
                clip V (switch)
              </text>
            </g>
          )}

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
            const b0Live = live && b0.length > 0 && Math.abs(i0 ?? 0) > 0.001;
            const b1Live = live && b1.length > 0 && Math.abs(i1 ?? 0) > 0.001;
            return (
              <g key={item.section.id}>
                {/* Vertical split rails */}
                <line x1={item.x} y1={TOP} x2={item.x} y2={y2} stroke={b1Live ? wire(live) : "#475569"} strokeWidth="2" />
                <line x1={item.x + item.w} y1={TOP} x2={item.x + item.w} y2={y2} stroke={b1Live ? wire(live) : "#475569"} strokeWidth="2" />
                {/* Horizontal branch rails */}
                <line x1={item.x} y1={TOP} x2={item.x + item.w} y2={TOP} stroke={wire(b0Live)} strokeWidth="2" />
                <line x1={item.x} y1={y2} x2={item.x + item.w} y2={y2} stroke={wire(b1Live)} strokeWidth="2" />

                {/* Junction flow indicators */}
                {b0Live && (
                  <polygon points={`${item.x + 18},${TOP} ${item.x + 10},${TOP - 4} ${item.x + 10},${TOP + 4}`} fill="#FCD34D" />
                )}
                {b1Live && (
                  <polygon points={`${item.x + 18},${y2} ${item.x + 10},${y2 - 4} ${item.x + 10},${y2 + 4}`} fill="#FCD34D" />
                )}

                {Number.isFinite(i0) && b0Live && (
                  <text x={item.x - 4} y={TOP + 28} textAnchor="end" fill="#FCD34D" fontSize="8" fontFamily="monospace">
                    {format3SF(i0)} A
                  </text>
                )}
                {Number.isFinite(i1) && b1Live && (
                  <text x={item.x - 4} y={y2 - 6} textAnchor="end" fill="#FCD34D" fontSize="8" fontFamily="monospace">
                    {format3SF(i1)} A
                  </text>
                )}
                {b0[0] ? (
                  renderComp(b0[0], cx, TOP)
                ) : (
                  <g
                    role="button" tabIndex={0} aria-label="Add a component to parallel branch 1"
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPlaceBranch(item.section.id, 0); } }}
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
                    role="button" tabIndex={0} aria-label="Add a component to parallel branch 2"
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPlaceBranch(item.section.id, 1); } }}
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

          {state.sections.length < 4 && !placingV && (
            <g
              role={placingV ? undefined : "button"} tabIndex={placingV ? undefined : 0}
              aria-label={placingV ? undefined : "Add a component in series"}
              onKeyDown={(e) => { if (!placingV && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onPlaceSeries(); } }}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onPlaceSeries();
              }}
            >
              <EmptySlot
                x={trailingX}
                y={TOP}
                label={state.sections.length === 0 ? "tap to add 10 Ω" : "tap tray to add"}
                active={false}
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
              <line
                x1={vLead.x1}
                y1={vLead.y}
                x2={vLead.x1}
                y2={vLead.isBottom ? BOT + 48 : BOT - 48}
                stroke="#38BDF8"
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
              <line
                x1={vLead.x2}
                y1={vLead.y}
                x2={vLead.x2}
                y2={vLead.isBottom ? BOT + 48 : BOT - 48}
                stroke="#38BDF8"
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
              <line
                x1={vLead.x1}
                y1={vLead.isBottom ? BOT + 48 : BOT - 48}
                x2={vLead.x2}
                y2={vLead.isBottom ? BOT + 48 : BOT - 48}
                stroke="#38BDF8"
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
              <circle
                cx={(vLead.x1 + vLead.x2) / 2}
                cy={vLead.isBottom ? BOT + 48 : BOT - 48}
                r="16"
                fill="#0F2133"
                stroke="#0EA5E9"
                strokeWidth="2"
              />
              <text
                x={(vLead.x1 + vLead.x2) / 2}
                y={vLead.isBottom ? BOT + 53 : BOT - 43}
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="13"
                fontWeight="800"
              >
                V
              </text>
              <text
                x={(vLead.x1 + vLead.x2) / 2}
                y={vLead.isBottom ? BOT + 70 : BOT - 26}
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
