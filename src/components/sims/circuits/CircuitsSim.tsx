import { useEffect, useMemo, useRef, useState } from "react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { CircuitReadouts, type RecordedReading, type VISample } from "./CircuitReadouts";
import { ComponentTray } from "./ComponentTray";
import { SchematicCanvas } from "./SchematicCanvas";
import { TaskHeader } from "./TaskHeader";
import {
  GUIDED_TASKS,
  componentFromTray,
  evaluateCircuit,
  generateCircuitsExamQuestions,
  getInitialCircuitState,
  loadParallelDemo,
  loadSeriesDemo,
  makeId,
  type CircuitState,
  type PathComponent,
  type Section,
  type TrayType,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

function findEmptyBranch(state: CircuitState): { id: string; index: 0 | 1 } | null {
  for (const sec of state.sections) {
    if (sec.type !== "parallel") continue;
    if (sec.branches[0].length === 0) return { id: sec.id, index: 0 };
    if (sec.branches[1].length === 0) return { id: sec.id, index: 1 };
  }
  return null;
}

export function CircuitsSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [taskId, setTaskId] = useState(1);
  const [state, setState] = useState<CircuitState>(getInitialCircuitState);
  const [selected, setSelected] = useState<TrayType | null>(null);
  const [samples, setSamples] = useState<VISample[]>([]);
  const [readings, setReadings] = useState<RecordedReading[]>([]);
  const [placementMessage, setPlacementMessage] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const serial = useRef(1);
  const evaluation = useMemo(() => evaluateCircuit(state, taskId), [state, taskId]);
  const currentTask = GUIDED_TASKS.find((t) => t.id === taskId) ?? GUIDED_TASKS[0];

  useEffect(() => {
    setSamples([]);
  }, [state.sections, state.internalR, state.switchClosed]);

  useEffect(() => {
    if (state.sections.length === 0) serial.current = 1;
  }, [state.sections.length]);

  useEffect(() => {
    if (!evaluation.isClosed || !Number.isFinite(evaluation.totalCurrent)) return;
    const v = evaluation.terminalV;
    const i = evaluation.totalCurrent;
    setSamples((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.abs(last.v - v) < 0.05 && Math.abs(last.i - i) < 0.005) return prev;
      const next = [...prev, { v, i }];
      return next.length > 24 ? next.slice(-24) : next;
    });
  }, [evaluation.isClosed, evaluation.terminalV, evaluation.totalCurrent]);

  function nextSerial() {
    const n = serial.current;
    serial.current += 1;
    return n;
  }

  function placeComponent(comp: PathComponent) {
    setPlacementMessage("");
    setState((prev) => {
      const empty = findEmptyBranch(prev);
      if (empty) {
        return {
          ...prev,
          sections: prev.sections.map((sec) => {
            if (sec.id !== empty.id || sec.type !== "parallel") return sec;
            const branches: [PathComponent[], PathComponent[]] = [[...sec.branches[0]], [...sec.branches[1]]];
            branches[empty.index] = [comp];
            return { ...sec, branches };
          }),
        };
      }
      if (prev.sections.length >= 4) return prev;
      return {
        ...prev,
        sections: [...prev.sections, { id: makeId("s"), type: "series", component: comp }],
      };
    });
    setSelected(null);
  }

  function hasPlacementRoom(): boolean {
    if (!findEmptyBranch(state) && state.sections.length >= 4) {
      setPlacementMessage("The circuit is full: remove a section before adding another.");
      return false;
    }
    setPlacementMessage("");
    return true;
  }

  function onAdd(type: Exclude<TrayType, "voltmeter">) {
    if (!hasPlacementRoom()) return;
    placeComponent(componentFromTray(type, nextSerial()));
  }

  function onPlaceSeries() {
    if (selected === "voltmeter") return;
    if (!hasPlacementRoom()) return;
    const type = selected ?? "resistor_10";
    placeComponent(componentFromTray(type, nextSerial()));
  }

  function onPlaceBranch(sectionId: string, branchIndex: 0 | 1) {
    if (selected === "voltmeter" || selected === null) return;
    const comp = componentFromTray(selected, nextSerial());
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId || sec.type !== "parallel") return sec;
        const branches: [PathComponent[], PathComponent[]] = [[...sec.branches[0]], [...sec.branches[1]]];
        branches[branchIndex] = [comp];
        return { ...sec, branches };
      }),
    }));
    setSelected(null);
  }

  function onRemove(componentId: string) {
    setState((prev) => {
      const sections: Section[] = prev.sections.flatMap((sec): Section[] => {
        if (sec.type === "series") {
          return sec.component.id === componentId ? [] : [sec];
        }
        const b0 = sec.branches[0].filter((c) => c.id !== componentId);
        const b1 = sec.branches[1].filter((c) => c.id !== componentId);
        if (b0.length === 0 && b1.length === 0) return [];
        if (b0.length === 1 && b1.length === 0) {
          return [{ id: makeId("s"), type: "series" as const, component: b0[0] }];
        }
        if (b1.length === 1 && b0.length === 0) {
          return [{ id: makeId("s"), type: "series" as const, component: b1[0] }];
        }
        return [{ ...sec, branches: [b0, b1] as [PathComponent[], PathComponent[]] }];
      });
      const voltmeterAcross = prev.voltmeterAcross === componentId ? null : prev.voltmeterAcross;
      return { ...prev, sections, voltmeterAcross };
    });
  }

  function onSplitParallel(sectionId: string) {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId || sec.type !== "series" || sec.component.kind === "ammeter") {
          return sec;
        }
        return {
          id: makeId("p"),
          type: "parallel" as const,
          branches: [[sec.component], []] as [PathComponent[], PathComponent[]],
        };
      }),
    }));
  }

  function onClipVoltmeter(target: string | "supply" | "switch" | null) {
    setState((prev) => ({ ...prev, voltmeterAcross: target }));
    setSelected(null);
  }

  function onUpdateComponent(id: string, updates: Partial<PathComponent>) {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.type === "series") {
          if (sec.component.id === id) {
            return { ...sec, component: { ...sec.component, ...updates } };
          }
          return sec;
        }
        const b0 = sec.branches[0].map((c) => (c.id === id ? { ...c, ...updates } : c));
        const b1 = sec.branches[1].map((c) => (c.id === id ? { ...c, ...updates } : c));
        return { ...sec, branches: [b0, b1] as [PathComponent[], PathComponent[]] };
      }),
    }));
  }

  function handleSetupTask(id: number) {
    const task = GUIDED_TASKS.find((t) => t.id === id);
    if (task?.setupFactory) {
      hardReset(task.setupFactory());
    }
    setTaskId(id);
    setPrediction(null);
  }

  function hardReset(next?: CircuitState) {
    serial.current = 1;
    setState(next ?? getInitialCircuitState());
    setSelected(null);
    setSamples([]);
    setReadings([]);
    setPlacementMessage("");
  }

  function recordReading() {
    const current = evaluation.totalCurrent;
    if (!evaluation.isClosed || !Number.isFinite(current) || current <= 0) return;
    setReadings((previous) => [
      ...previous,
      { voltage: evaluation.terminalV, current, resistance: evaluation.terminalV / current },
    ].slice(-20));
  }

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader
          title="Electrical Circuits & Ohm’s Law"
          syllabus="Syllabus 4.2 · V = IR"
          simNumber="#04"
          mode={mode}
          onMode={setMode}
          exploreLabel="Guided lab"
          examLabel="Paper 4 exam"
          onBackToHome={onBackToHome}
        />
        <ExamPlayer
          simId="circuits"
          title="Electrical circuits & Ohm’s law"
          paperLabel="Cambridge IGCSE 0625 · Paper 4"
          questionFactory={generateCircuitsExamQuestions}
          onExit={() => setMode("explore")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SimHeader
        title="Electrical Circuits & Ohm’s Law"
        syllabus="Syllabus 4.2 · V = IR"
        simNumber="#04"
        mode={mode}
        onMode={setMode}
        exploreLabel="Guided lab (4 tasks)"
        examLabel="Paper 4 exam (8 questions)"
        onBackToHome={onBackToHome}
      />

      <TaskHeader
        current={currentTask}
        tasks={GUIDED_TASKS}
        evaluation={evaluation}
        prediction={prediction}
        onPrediction={setPrediction}
        onSelect={(id) => { setTaskId(id); setPrediction(null); }}
        onReset={() => hardReset()}
        onSetupTask={handleSetupTask}
        onLoadSeries={() => {
          hardReset(loadSeriesDemo());
          setTaskId(3);
          setPrediction(null);
        }}
        onLoadParallel={() => {
          hardReset(loadParallelDemo());
          setTaskId(4);
          setPrediction(null);
        }}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-7">
          <SchematicCanvas
            state={state}
            evaluation={evaluation}
            selected={selected}
            onPlaceSeries={onPlaceSeries}
            onPlaceBranch={onPlaceBranch}
            onRemove={onRemove}
            onSplitParallel={onSplitParallel}
            onClipVoltmeter={onClipVoltmeter}
            onToggleSwitch={() => setState((s) => ({ ...s, switchClosed: !s.switchClosed }))}
            onUpdateComponent={onUpdateComponent}
          />
          <ComponentTray
            selected={selected}
            cellEmf={state.cellEmf}
            internalR={state.internalR}
            onSelectVoltmeter={() => setSelected((s) => (s === "voltmeter" ? null : "voltmeter"))}
            onAdd={onAdd}
            onEmf={(cellEmf) => setState((s) => ({ ...s, cellEmf }))}
            onInternalR={(internalR) => setState((s) => ({ ...s, internalR }))}
          />
          {placementMessage && <p role="status" className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">{placementMessage}</p>}
        </div>
        <div className="lg:col-span-5">
          <CircuitReadouts
            evaluation={evaluation}
            state={state}
            samples={samples}
            readings={readings}
            onRecordReading={recordReading}
            onClearReadings={() => setReadings([])}
          />
        </div>
      </div>
    </div>
  );
}
