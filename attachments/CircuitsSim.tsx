import React, { useState, useMemo, useCallback } from 'react';
import {
  PlacedComponent,
  Wire,
  ComponentType,
  evaluateCircuit,
  GUIDED_TASKS,
  GuidedTask,
  generateCircuitsExamQuestions,
  CircuitsExamQuestion,
  getTerminalCoord,
  PEGBOARD_SLOTS,
} from './physics';
import { TaskHeader } from './TaskHeader';
import { PegboardCanvas } from './PegboardCanvas';
import { ComponentTray } from './ComponentTray';
import { CircuitReadouts } from './CircuitReadouts';
import { CircuitsExamMode } from './CircuitsExamMode';
import { Zap, GraduationCap, Compass, ArrowLeft } from 'lucide-react';

interface CircuitsSimProps {
  onBackToHome?: () => void;
}

export const CircuitsSim: React.FC<CircuitsSimProps> = ({ onBackToHome }) => {
  const [mode, setMode] = useState<'lab' | 'exam'>('lab');
  const [currentTaskId, setCurrentTaskId] = useState<number>(1);

  // Placed components on the 4x3 pegboard
  const [components, setComponents] = useState<PlacedComponent[]>([
    {
      id: 'comp_cell_1',
      type: 'cell',
      slotId: 'slot_1_0', // Placed at top row, col 1
      value: 6.0,
      label: 'Cell (6.0 V)',
    },
  ]);

  // Placed wires between terminals
  const [wires, setWires] = useState<Wire[]>([]);

  // Selection & Wiring state
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType | null>(null);
  const [activeWireStartTerminal, setActiveWireStartTerminal] = useState<string | null>(null);

  // Exam mode questions snapshot
  const [examQuestions, setExamQuestions] = useState<CircuitsExamQuestion[]>([]);

  // Live circuit evaluation
  const evaluation = useMemo(() => {
    return evaluateCircuit(components, wires);
  }, [components, wires]);

  const currentTask = GUIDED_TASKS.find((t) => t.id === currentTaskId) || GUIDED_TASKS[0];

  // Add component to slot
  const handleAddComponentToSlot = useCallback((type: ComponentType, slotId: string) => {
    setComponents((prev) => {
      // Remove any component already occupying that slot
      const filtered = prev.filter((c) => c.slotId !== slotId);

      let val = 10;
      let label = 'Resistor 10 Ω';
      if (type === 'cell') {
        val = 6.0;
        label = 'Cell (6.0 V)';
      } else if (type === 'resistor_10') {
        val = 10;
        label = 'Resistor 10 Ω';
      } else if (type === 'resistor_20') {
        val = 20;
        label = 'Resistor 20 Ω';
      } else if (type === 'ammeter') {
        val = 0;
        label = 'Ammeter (A)';
      } else if (type === 'voltmeter') {
        val = Infinity;
        label = 'Voltmeter (V)';
      }

      const newComp: PlacedComponent = {
        id: `comp_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type,
        slotId,
        value: val,
        label,
      };

      return [...filtered, newComp];
    });
    setSelectedComponentType(null);
  }, []);

  // Move component between slots
  const handleMoveComponent = useCallback((fromSlotId: string, toSlotId: string) => {
    setComponents((prev) => {
      const compToMove = prev.find((c) => c.slotId === fromSlotId);
      if (!compToMove) return prev;
      // Remove any occupant at destination slot
      const filtered = prev.filter((c) => c.slotId !== toSlotId && c.slotId !== fromSlotId);
      return [...filtered, { ...compToMove, slotId: toSlotId }];
    });
  }, []);

  // Remove component
  const handleRemoveComponent = useCallback((componentId: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== componentId));
  }, []);

  // Add wire between terminals
  const handleAddWire = useCallback((fromTerminalId: string, toTerminalId: string) => {
    if (fromTerminalId === toTerminalId) return;

    const fromCoord = getTerminalCoord(fromTerminalId);
    const toCoord = getTerminalCoord(toTerminalId);
    if (!fromCoord || !toCoord) return;

    setWires((prev) => {
      // Avoid duplicate wire between same pair of terminals
      const exists = prev.some(
        (w) =>
          (w.fromTerminalId === fromTerminalId && w.toTerminalId === toTerminalId) ||
          (w.fromTerminalId === toTerminalId && w.toTerminalId === fromTerminalId)
      );
      if (exists) return prev;

      const newWire: Wire = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        fromTerminalId,
        toTerminalId,
        fromX: fromCoord.x,
        fromY: fromCoord.y,
        toX: toCoord.x,
        toY: toCoord.y,
        current: 0,
      };
      return [...prev, newWire];
    });
  }, []);

  // Remove wire
  const handleRemoveWire = useCallback((wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  }, []);

  // Clear Board (Reduction 6)
  const handleClearBoard = useCallback(() => {
    setComponents([]);
    setWires([]);
    setActiveWireStartTerminal(null);
  }, []);

  // Reset Task (Reduction 6)
  const handleResetTask = useCallback(() => {
    setActiveWireStartTerminal(null);
    setWires([]);
    // Provide standard starter cell
    setComponents([
      {
        id: 'comp_cell_1',
        type: 'cell',
        slotId: 'slot_1_0',
        value: 6.0,
        label: 'Cell (6.0 V)',
      },
    ]);
  }, []);

  // Switch to Exam Mode
  const handleEnterExam = () => {
    const questions = generateCircuitsExamQuestions();
    setExamQuestions(questions);
    setMode('exam');
  };

  const handleReturnToLab = () => {
    setMode('lab');
  };

  return (
    <div id="sim-circuits-container" className="flex flex-col gap-3 w-full pb-4">
      {/* Simulation Top Bar & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1F2432]">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141722] hover:bg-[#1E2333] border border-[#232938] text-xs font-semibold text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Sim #04
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Syllabus 4.2 Electrical Quantities</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Electrical Circuits &amp; Ohm's Law</span>
            </h1>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center bg-[#141722] p-1 rounded-xl border border-[#232938] self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReturnToLab}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'lab'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guided Lab (4 Tasks)</span>
          </button>

          <button
            type="button"
            onClick={handleEnterExam}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'exam'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Cambridge Exam Mode (Paper 4)</span>
          </button>
        </div>
      </div>

      {/* Main View */}
      {mode === 'lab' ? (
        <div className="flex flex-col gap-3">
          {/* Task Navigation Banner */}
          <TaskHeader
            currentTask={currentTask}
            allTasks={GUIDED_TASKS}
            onSelectTask={setCurrentTaskId}
            evaluation={evaluation}
            onResetTask={handleResetTask}
            onClearBoard={handleClearBoard}
          />

          {/* 60 / 40 Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left 60%: Interactive Pegboard Canvas & Component Tray */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <PegboardCanvas
                components={components}
                wires={wires}
                evaluation={evaluation}
                onAddComponentToSlot={handleAddComponentToSlot}
                onMoveComponent={handleMoveComponent}
                onRemoveComponent={handleRemoveComponent}
                onAddWire={handleAddWire}
                onRemoveWire={handleRemoveWire}
                selectedComponentType={selectedComponentType}
                activeWireStartTerminal={activeWireStartTerminal}
                setActiveWireStartTerminal={setActiveWireStartTerminal}
              />

              <ComponentTray
                onSelectComponentType={setSelectedComponentType}
                selectedComponentType={selectedComponentType}
                isWiringMode={activeWireStartTerminal !== null}
                onToggleWiringMode={() => setActiveWireStartTerminal(null)}
                activeWireStartTerminal={activeWireStartTerminal}
              />
            </div>

            {/* Right 40%: Telemetry Matrix & Component Breakdown */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <CircuitReadouts
                evaluation={evaluation}
                components={components}
              />
            </div>
          </div>
        </div>
      ) : (
        <CircuitsExamMode
          questions={examQuestions}
          onReturnToLab={handleReturnToLab}
        />
      )}
    </div>
  );
};
