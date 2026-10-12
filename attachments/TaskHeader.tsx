import React from 'react';
import { GuidedTask, CircuitEvaluation } from './physics';
import { RotateCcw, Trash2, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface TaskHeaderProps {
  currentTask: GuidedTask;
  allTasks: GuidedTask[];
  onSelectTask: (taskId: number) => void;
  evaluation: CircuitEvaluation;
  onResetTask: () => void;
  onClearBoard: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  currentTask,
  allTasks,
  onSelectTask,
  evaluation,
  onResetTask,
  onClearBoard,
}) => {
  // Check if current task is complete
  const isCurrentTaskComplete =
    (currentTask.id === 1 && evaluation.task1Complete) ||
    (currentTask.id === 2 && evaluation.task2Complete) ||
    (currentTask.id === 3 && evaluation.task3Complete) ||
    (currentTask.id === 4 && evaluation.task4Complete);

  const completionNote = evaluation.taskCompletionNotes[currentTask.id];

  return (
    <div
      id="circuits-task-banner"
      className="flex flex-col gap-2.5 p-3 rounded-xl bg-[#141722] border border-[#232938]"
    >
      {/* Task Tabs & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {allTasks.map((t) => {
            const isCompleted =
              (t.id === 1 && evaluation.task1Complete) ||
              (t.id === 2 && evaluation.task2Complete) ||
              (t.id === 3 && evaluation.task3Complete) ||
              (t.id === 4 && evaluation.task4Complete);

            const isSelected = t.id === currentTask.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTask(t.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-[#181D2A] text-slate-400 hover:text-slate-200 border border-[#232938]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                )}
                <span>Task {t.id}</span>
              </button>
            );
          })}
        </div>

        {/* Clear Board & Reset Task buttons - prominent and easy to find */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onResetTask}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181D2A] hover:bg-[#202738] border border-[#232938] text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            title="Reset this task to starter components"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Task</span>
          </button>
          <button
            type="button"
            onClick={onClearBoard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181D2A] hover:bg-rose-950/40 border border-[#232938] hover:border-rose-800/60 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-colors"
            title="Wipe canvas completely"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Board</span>
          </button>
        </div>
      </div>

      {/* Task Prompt Content */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            Task {currentTask.id}: {currentTask.title}
          </span>
          {isCurrentTaskComplete && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/50 text-[11px] font-bold text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              Verified Complete
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          {currentTask.prompt}
        </p>
      </div>

      {/* Post-Completion Teaching Note */}
      {isCurrentTaskComplete && completionNote && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <span className="font-bold">Cambridge Validation: </span>
            <span>{completionNote}</span>
          </div>
        </div>
      )}

      {/* Placement Hints / Alerts if any meter is misplaced */}
      {evaluation.ammeterHint && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{evaluation.ammeterHint}</span>
        </div>
      )}

      {evaluation.voltmeterHint && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-sky-950/40 border border-sky-500/40 text-sky-300 text-xs">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
          <span>{evaluation.voltmeterHint}</span>
        </div>
      )}
    </div>
  );
};
