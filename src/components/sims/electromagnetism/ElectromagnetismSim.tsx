import { useCallback, useState, type ElementType } from "react";
import { Magnet, Waves, Zap } from "lucide-react";
import { ExamPlayer } from "@/components/ExamPlayer";
import { SimHeader } from "@/components/SimHeader";
import { ElectromagnetismControls } from "./ElectromagnetismControls";
import { ElectromagnetismReadouts } from "./ElectromagnetismReadouts";
import { FlemingPanel } from "./FlemingPanel";
import { MagneticFieldCanvas } from "./MagneticFieldCanvas";
import { MotorEffectCanvas } from "./MotorEffectCanvas";
import {
  computeElectromagnetism,
  ELECTROMAGNETISM_TASKS,
  evaluateElectromagnetismTasks,
  generateElectromagnetismExamQuestions,
  getInitialElectromagnetismState,
  type ElectromagnetismPreset,
  type ElectromagnetismState,
  type EmSubMode,
} from "./physics";

interface Props {
  onBackToHome?: () => void;
}

export function ElectromagnetismSim({ onBackToHome }: Props) {
  const [mode, setMode] = useState<"explore" | "exam">("explore");
  const [state, setState] = useState<ElectromagnetismState>(getInitialElectromagnetismState);
  const [taskId, setTaskId] = useState(1);
  const calculated = computeElectromagnetism(state);
  const tasksDone = evaluateElectromagnetismTasks(state, calculated);
  const currentTask = ELECTROMAGNETISM_TASKS.find((task) => task.id === taskId) ?? ELECTROMAGNETISM_TASKS[0];

  const setSub = useCallback((subMode: EmSubMode) => {
    setState((p) => ({ ...p, subMode }));
  }, []);

  if (mode === "exam") {
    return (
      <div className="flex flex-col gap-4">
        <SimHeader
          title="Electromagnetism"
          syllabus="Syllabus 4.5"
          simNumber="#06"
          mode={mode}
          onMode={setMode}
          examLabel="Exam mode (6 questions)"
          onBackToHome={onBackToHome}
        />
        <ExamPlayer
          simId="electromagnetism"
          title="Electromagnetism & motor effect"
          paperLabel="Cambridge IGCSE 0625 · Paper 4"
          questionFactory={generateElectromagnetismExamQuestions}
          onExit={() => setMode("explore")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <SimHeader
        title="Electromagnetism"
        syllabus="Syllabus 4.5 · F = BIL"
        simNumber="#06"
        mode={mode}
        onMode={setMode}
        examLabel="Exam mode (6 questions)"
        onBackToHome={onBackToHome}
      />

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1 self-start rounded-lg border border-border-subtle bg-canvas-elevated p-0.5">
            <SubBtn active={state.subMode === "motor"} onClick={() => setSub("motor")} icon={Zap} label="Motor effect" />
            <SubBtn active={state.subMode === "field"} onClick={() => setSub("field")} icon={Waves} label="Field around a wire" />
            <SubBtn active={state.subMode === "fleming"} onClick={() => setSub("fleming")} icon={Magnet} label="Fleming’s rule" />
          </div>

          {state.subMode === "motor" && <MotorEffectCanvas state={state} calculated={calculated} />}
          {state.subMode === "field" && <MagneticFieldCanvas state={state} calculated={calculated} />}
          {state.subMode === "fleming" && <FlemingPanel state={state} calculated={calculated} />}

          <p className="font-mono text-[11px] text-ink-faint">
            Current magnitude is non-negative. Forward means right along the wire and out of the page in the field view; reverse means left and into the page. Length L is the highlighted span inside the field region.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <ElectromagnetismReadouts state={state} calculated={calculated} />
          <ElectromagnetismControls
            state={state}
            calculated={calculated}
            onChangeCurrentA={(currentA) => setState((p) => ({ ...p, currentA }))}
            onToggleCurrentDirection={() => setState((p) => ({ ...p, currentDirection: p.currentDirection === "forward" ? "reverse" : "forward" }))}
            onChangeBFieldT={(bFieldT) => setState((p) => ({ ...p, bFieldT }))}
            onChangeLengthM={(lengthM) => setState((p) => ({ ...p, lengthM }))}
            onToggleBDir={() => setState((p) => ({ ...p, bIntoPage: !p.bIntoPage }))}
            onApplyPreset={(preset: ElectromagnetismPreset) =>
              setState((p) => ({
                ...p,
                currentA: preset.currentA,
                currentDirection: preset.currentDirection,
                bFieldT: preset.bFieldT,
                lengthM: preset.lengthM,
              }))
            }
            onReset={() => setState(getInitialElectromagnetismState())}
          />
        </div>
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {ELECTROMAGNETISM_TASKS.map((task) => (
            <button key={task.id} type="button" onClick={() => setTaskId(task.id)} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${taskId === task.id ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"}`}>
              {tasksDone[task.id] ? "✓" : "○"} Task {task.id}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-ink">{currentTask.title}</p>
        <p className="mt-1 text-xs text-ink-muted">{currentTask.prompt}</p>
      </div>
    </div>
  );
}

function SubBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
        active ? "border border-accent/30 bg-surface text-amber-300" : "text-ink-faint hover:text-ink"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
