import { ArrowLeft, Compass, GraduationCap } from "lucide-react";

interface SimHeaderProps {
  title: string;
  syllabus: string;
  simNumber: string;
  mode: "explore" | "exam";
  onMode: (mode: "explore" | "exam") => void;
  examLabel: string;
  exploreLabel?: string;
  onBackToHome?: () => void;
}

export function SimHeader({
  title,
  syllabus,
  simNumber,
  mode,
  onMode,
  examLabel,
  exploreLabel = "Explore",
  onBackToHome,
}: SimHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border-faint pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:bg-muted-bg hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Directory
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
              Sim {simNumber}
            </span>
            <span className="text-ink-faint">·</span>
            <span className="text-xs text-ink-muted">{syllabus}</span>
          </div>
          <h1 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center self-start rounded-xl border border-border-subtle bg-surface p-1 sm:self-auto">
        <button
          type="button"
          onClick={() => onMode("explore")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === "explore"
              ? "bg-accent text-accent-fg"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          {exploreLabel}
        </button>
        <button
          type="button"
          onClick={() => onMode("exam")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === "exam"
              ? "bg-accent text-accent-fg"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          {examLabel}
        </button>
      </div>
    </div>
  );
}
