import React, { useState, useRef } from 'react';
import {
  PEGBOARD_SLOTS,
  PegSlot,
  PlacedComponent,
  Wire,
  CircuitEvaluation,
  ComponentType,
  getTerminalCoord,
  format3SF,
} from './physics';
import { X, Zap, Trash2 } from 'lucide-react';

interface PegboardCanvasProps {
  components: PlacedComponent[];
  wires: Wire[];
  evaluation: CircuitEvaluation;
  onAddComponentToSlot: (type: ComponentType, slotId: string) => void;
  onMoveComponent: (fromSlotId: string, toSlotId: string) => void;
  onRemoveComponent: (componentId: string) => void;
  onAddWire: (fromTerminalId: string, toTerminalId: string) => void;
  onRemoveWire: (wireId: string) => void;
  selectedComponentType: ComponentType | null;
  activeWireStartTerminal: string | null;
  setActiveWireStartTerminal: (terminalId: string | null) => void;
}

export const PegboardCanvas: React.FC<PegboardCanvasProps> = ({
  components,
  wires,
  evaluation,
  onAddComponentToSlot,
  onMoveComponent,
  onRemoveComponent,
  onAddWire,
  onRemoveWire,
  selectedComponentType,
  activeWireStartTerminal,
  setActiveWireStartTerminal,
}) => {
  const [hoveredTerminalId, setHoveredTerminalId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);
  const [draggingSlotId, setDraggingSlotId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 310;

  // Handle pointer tracking for live wire drawing preview
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !activeWireStartTerminal) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  };

  // Click on a terminal to start or finish wiring
  const handleTerminalClick = (terminalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeWireStartTerminal) {
      setActiveWireStartTerminal(terminalId);
    } else {
      if (activeWireStartTerminal !== terminalId) {
        onAddWire(activeWireStartTerminal, terminalId);
      }
      setActiveWireStartTerminal(null);
      setMousePos(null);
    }
  };

  // Click on empty canvas cancels wiring mode
  const handleCanvasClick = () => {
    if (activeWireStartTerminal) {
      setActiveWireStartTerminal(null);
      setMousePos(null);
    }
  };

  // Helper to generate L-shaped orthogonal wire path with rounded corner
  const getLShapedWirePath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): string => {
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Straight line if aligned horizontally or vertically
    if (Math.abs(dx) < 4 || Math.abs(dy) < 4) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    // Determine corner: Horizontal then Vertical or Vertical then Horizontal
    // If predominantly horizontal, travel X first, then Y
    const cornerX = x2;
    const cornerY = y1;
    const radius = 8;

    const dirX = Math.sign(dx);
    const dirY = Math.sign(dy);

    const startBendX = cornerX - dirX * radius;
    const startBendY = cornerY;
    const endBendX = cornerX;
    const endBendY = cornerY + dirY * radius;

    return `M ${x1} ${y1} L ${startBendX} ${startBendY} Q ${cornerX} ${cornerY} ${endBendX} ${endBendY} L ${x2} ${y2}`;
  };

  // Wire drawing preview path
  let wirePreviewPath: string | null = null;
  if (activeWireStartTerminal && mousePos) {
    const startCoord = getTerminalCoord(activeWireStartTerminal);
    if (startCoord) {
      wirePreviewPath = getLShapedWirePath(
        startCoord.x,
        startCoord.y,
        mousePos.x,
        mousePos.y
      );
    }
  }

  return (
    <div
      id="circuits-workbench-container"
      className="relative flex flex-col rounded-xl bg-[#0D1017] border border-[#232938] overflow-hidden select-none shadow-inner"
    >
      {/* Workbench Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121622] border-b border-[#1E2333]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
            Interactive Circuit Workbench (4×3 Pegboard)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="hidden sm:inline">Click terminals to wire</span>
          {activeWireStartTerminal && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold animate-pulse border border-amber-500/40">
              Wiring Mode Active
            </span>
          )}
        </div>
      </div>

      {/* SVG Pegboard Workbench Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[580px] cursor-crosshair"
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
        >
          <defs>
            {/* Subtle workbench grid texture */}
            <pattern
              id="workbench-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#171C2B"
                strokeWidth="0.8"
              />
              <circle cx="20" cy="20" r="1" fill="#1F263B" />
            </pattern>

            {/* Glowing filter for active current wires */}
            <filter id="amber-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width={svgWidth} height={svgHeight} fill="url(#workbench-grid)" />

          {/* Render 12 Pegboard Slots */}
          {PEGBOARD_SLOTS.map((slot) => {
            const comp = components.find((c) => c.slotId === slot.id);
            const isHovered = false;

            return (
              <g
                key={slot.id}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const compType = e.dataTransfer.getData('text/plain') as ComponentType;
                  if (compType) {
                    onAddComponentToSlot(compType, slot.id);
                  } else if (draggingSlotId && draggingSlotId !== slot.id) {
                    onMoveComponent(draggingSlotId, slot.id);
                    setDraggingSlotId(null);
                  }
                }}
                onClick={() => {
                  if (draggingSlotId && draggingSlotId !== slot.id) {
                    onMoveComponent(draggingSlotId, slot.id);
                    setDraggingSlotId(null);
                  } else if (selectedComponentType && !comp) {
                    onAddComponentToSlot(selectedComponentType, slot.id);
                  }
                }}
              >
                {/* Slot Base Outline */}
                <rect
                  x={slot.x - 55}
                  y={slot.y - 32}
                  width="110"
                  height="64"
                  rx="8"
                  fill={comp ? '#141824' : '#10141F'}
                  stroke={comp ? '#283147' : '#1A2133'}
                  strokeWidth="1.2"
                  strokeDasharray={comp ? 'none' : '3 3'}
                  className="transition-colors cursor-pointer hover:stroke-slate-500"
                />

                {/* Slot Coordinate Label (Faint) */}
                <text
                  x={slot.x}
                  y={slot.y - 20}
                  textAnchor="middle"
                  fill="#2A344D"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  [{slot.col},{slot.row}]
                </text>

                {/* If slot is empty, show prompt hint */}
                {!comp && (
                  <text
                    x={slot.x}
                    y={slot.y + 4}
                    textAnchor="middle"
                    fill="#334155"
                    fontSize="10"
                    fontFamily="sans-serif"
                    className="pointer-events-none"
                  >
                    Empty Slot
                  </text>
                )}

                {/* Component in Slot */}
                {comp && (
                  <g
                    onMouseDown={() => {
                      setDraggingSlotId(slot.id);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Delete Component Button on hover */}
                    <circle
                      cx={slot.x + 44}
                      cy={slot.y - 22}
                      r="7"
                      fill="#1E2333"
                      stroke="#334155"
                      strokeWidth="1"
                      className="hover:fill-rose-950/80 hover:stroke-rose-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveComponent(comp.id);
                      }}
                    />
                    <text
                      x={slot.x + 44}
                      y={slot.y - 19.5}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      ×
                    </text>

                    {/* CELL COMPONENT (6 V) */}
                    {comp.type === 'cell' && (
                      <g>
                        {/* Positive long line */}
                        <line
                          x1={slot.x - 8}
                          y1={slot.y - 20}
                          x2={slot.x - 8}
                          y2={slot.y + 20}
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                        />
                        {/* Negative short thick line */}
                        <line
                          x1={slot.x + 8}
                          y1={slot.y - 12}
                          x2={slot.x + 8}
                          y2={slot.y + 12}
                          stroke="#F59E0B"
                          strokeWidth="4.5"
                        />
                        {/* Internal connection wires to terminals */}
                        <line
                          x1={slot.leftTerminal.x}
                          y1={slot.y}
                          x2={slot.x - 8}
                          y2={slot.y}
                          stroke="#F59E0B"
                          strokeWidth="2"
                        />
                        <line
                          x1={slot.x + 8}
                          y1={slot.y}
                          x2={slot.rightTerminal.x}
                          y2={slot.y}
                          stroke="#F59E0B"
                          strokeWidth="2"
                        />
                        {/* Labels */}
                        <text
                          x={slot.x - 14}
                          y={slot.y - 12}
                          fill="#F59E0B"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          +
                        </text>
                        <text
                          x={slot.x + 14}
                          y={slot.y - 12}
                          fill="#94A3B8"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          −
                        </text>
                        <text
                          x={slot.x}
                          y={slot.y + 25}
                          textAnchor="middle"
                          fill="#F8FAFC"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          6.0 V
                        </text>
                      </g>
                    )}

                    {/* RESISTOR (10 Ω or 20 Ω) */}
                    {(comp.type === 'resistor_10' || comp.type === 'resistor_20') && (
                      <g>
                        <line
                          x1={slot.leftTerminal.x}
                          y1={slot.y}
                          x2={slot.x - 24}
                          y2={slot.y}
                          stroke={evaluation.isClosed ? '#F59E0B' : '#475569'}
                          strokeWidth="2"
                        />
                        <line
                          x1={slot.x + 24}
                          y1={slot.y}
                          x2={slot.rightTerminal.x}
                          y2={slot.y}
                          stroke={evaluation.isClosed ? '#F59E0B' : '#475569'}
                          strokeWidth="2"
                        />
                        {/* IEC Resistor Box */}
                        <rect
                          x={slot.x - 24}
                          y={slot.y - 12}
                          width="48"
                          height="24"
                          rx="3"
                          fill="#182030"
                          stroke={comp.type === 'resistor_10' ? '#06B6D4' : '#6366F1'}
                          strokeWidth="1.8"
                        />
                        <text
                          x={slot.x}
                          y={slot.y + 4}
                          textAnchor="middle"
                          fill="#F1F5F9"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {comp.type === 'resistor_10' ? '10 Ω' : '20 Ω'}
                        </text>
                      </g>
                    )}

                    {/* AMMETER */}
                    {comp.type === 'ammeter' && (
                      <g>
                        <line
                          x1={slot.leftTerminal.x}
                          y1={slot.y}
                          x2={slot.x - 18}
                          y2={slot.y}
                          stroke={evaluation.isClosed ? '#F59E0B' : '#475569'}
                          strokeWidth="2"
                        />
                        <line
                          x1={slot.x + 18}
                          y1={slot.y}
                          x2={slot.rightTerminal.x}
                          y2={slot.y}
                          stroke={evaluation.isClosed ? '#F59E0B' : '#475569'}
                          strokeWidth="2"
                        />
                        {/* Ammeter Circle */}
                        <circle
                          cx={slot.x}
                          cy={slot.y - 2}
                          r="18"
                          fill="#12241F"
                          stroke="#10B981"
                          strokeWidth="2"
                        />
                        <text
                          x={slot.x}
                          y={slot.y + 4}
                          textAnchor="middle"
                          fill="#34D399"
                          fontSize="14"
                          fontWeight="extrabold"
                        >
                          A
                        </text>
                        {/* Digital Reading Display */}
                        <rect
                          x={slot.x - 26}
                          y={slot.y + 16}
                          width="52"
                          height="14"
                          rx="3"
                          fill="#06120E"
                          stroke="#059669"
                          strokeWidth="0.8"
                        />
                        <text
                          x={slot.x}
                          y={slot.y + 27}
                          textAnchor="middle"
                          fill="#34D399"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {evaluation.ammeterReading !== null
                            ? `${format3SF(evaluation.ammeterReading)} A`
                            : '—'}
                        </text>
                      </g>
                    )}

                    {/* VOLTMETER */}
                    {comp.type === 'voltmeter' && (
                      <g>
                        <line
                          x1={slot.leftTerminal.x}
                          y1={slot.y}
                          x2={slot.x - 18}
                          y2={slot.y}
                          stroke="#38BDF8"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <line
                          x1={slot.x + 18}
                          y1={slot.y}
                          x2={slot.rightTerminal.x}
                          y2={slot.y}
                          stroke="#38BDF8"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        {/* Voltmeter Circle */}
                        <circle
                          cx={slot.x}
                          cy={slot.y - 2}
                          r="18"
                          fill="#0F2133"
                          stroke="#0EA5E9"
                          strokeWidth="2"
                        />
                        <text
                          x={slot.x}
                          y={slot.y + 4}
                          textAnchor="middle"
                          fill="#38BDF8"
                          fontSize="14"
                          fontWeight="extrabold"
                        >
                          V
                        </text>
                        {/* Digital Reading Display */}
                        <rect
                          x={slot.x - 26}
                          y={slot.y + 16}
                          width="52"
                          height="14"
                          rx="3"
                          fill="#081524"
                          stroke="#0284C7"
                          strokeWidth="0.8"
                        />
                        <text
                          x={slot.x}
                          y={slot.y + 27}
                          textAnchor="middle"
                          fill="#38BDF8"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {evaluation.voltmeterReading !== null
                            ? `${format3SF(evaluation.voltmeterReading)} V`
                            : '—'}
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* Left Terminal Pin */}
                <g
                  className="cursor-pointer group"
                  onClick={(e) => handleTerminalClick(slot.leftTerminal.id, e)}
                  onMouseEnter={() => setHoveredTerminalId(slot.leftTerminal.id)}
                  onMouseLeave={() => setHoveredTerminalId(null)}
                >
                  <circle
                    cx={slot.leftTerminal.x}
                    cy={slot.leftTerminal.y}
                    r={activeWireStartTerminal === slot.leftTerminal.id ? 7 : 5}
                    fill={
                      activeWireStartTerminal === slot.leftTerminal.id
                        ? '#F59E0B'
                        : hoveredTerminalId === slot.leftTerminal.id
                        ? '#FBBF24'
                        : '#334155'
                    }
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  {activeWireStartTerminal === slot.leftTerminal.id && (
                    <circle
                      cx={slot.leftTerminal.x}
                      cy={slot.leftTerminal.y}
                      r="12"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      className="animate-spin"
                    />
                  )}
                </g>

                {/* Right Terminal Pin */}
                <g
                  className="cursor-pointer group"
                  onClick={(e) => handleTerminalClick(slot.rightTerminal.id, e)}
                  onMouseEnter={() => setHoveredTerminalId(slot.rightTerminal.id)}
                  onMouseLeave={() => setHoveredTerminalId(null)}
                >
                  <circle
                    cx={slot.rightTerminal.x}
                    cy={slot.rightTerminal.y}
                    r={activeWireStartTerminal === slot.rightTerminal.id ? 7 : 5}
                    fill={
                      activeWireStartTerminal === slot.rightTerminal.id
                        ? '#F59E0B'
                        : hoveredTerminalId === slot.rightTerminal.id
                        ? '#FBBF24'
                        : '#334155'
                    }
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  {activeWireStartTerminal === slot.rightTerminal.id && (
                    <circle
                      cx={slot.rightTerminal.x}
                      cy={slot.rightTerminal.y}
                      r="12"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      className="animate-spin"
                    />
                  )}
                </g>
              </g>
            );
          })}

          {/* RENDER PLACED WIRES */}
          {wires.map((wire) => {
            const isCarryingCurrent = evaluation.isClosed && evaluation.totalCurrent > 0.001;
            // Wire color rule: Active in vibrant amber, inactive in muted slate
            const wireColor = isCarryingCurrent ? '#F59E0B' : '#475569';
            const isHovered = hoveredWireId === wire.id;
            const pathData = getLShapedWirePath(
              wire.fromX,
              wire.fromY,
              wire.toX,
              wire.toY
            );

            return (
              <g
                key={wire.id}
                onMouseEnter={() => setHoveredWireId(wire.id)}
                onMouseLeave={() => setHoveredWireId(null)}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveWire(wire.id);
                }}
              >
                {/* Invisible thicker hit-testing stroke */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                />

                {/* Glow layer if carrying current */}
                {isCarryingCurrent && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeOpacity="0.4"
                    filter="url(#amber-glow)"
                  />
                )}

                {/* Physical Copper Wire Stroke */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHovered ? '#EF4444' : wireColor}
                  strokeWidth={isHovered ? 3 : 2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors"
                />

                {/* Wire Delete X on Hover */}
                {isHovered && (
                  <g
                    transform={`translate(${(wire.fromX + wire.toX) / 2}, ${(wire.fromY + wire.toY) / 2})`}
                  >
                    <circle r="8" fill="#450A0A" stroke="#EF4444" strokeWidth="1" />
                    <text
                      textAnchor="middle"
                      dy="3"
                      fill="#FCA5A5"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ACTIVE WIRE PREVIEW (while user is connecting two terminals) */}
          {wirePreviewPath && (
            <path
              d={wirePreviewPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}
        </svg>
      </div>
    </div>
  );
};
