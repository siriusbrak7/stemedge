import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { format3SF } from "@/lib/format";
import { isCorrectChoice, markTextAnswer, numericAnswerMarks } from "@/lib/exam-marking";
import { saveBestExamScore } from "@/lib/exam-scores";
import { nextAttemptSeed } from "@/lib/seeded-choice";

export interface ExamQuestion {
  id: string;
  number: number;
  marks: number;
  prompt: string;
  contextLines?: string[];
  paperRef?: string;
  kind: "numeric" | "text" | "choice";
  expected?: number;
  unit?: string;
  acceptedText?: string[][];
  tolerancePct?: number;
  options?: string[];
  correctIndex?: number;
  working: { equation: string; substitution: string; answer: string };
  misconception?: string;
}

type Mark = "idle" | "correct" | "partial" | "wrong";

interface ExamPlayerProps {
  simId: string;
  title: string;
  paperLabel: string;
  questionFactory: (seed: number) => ExamQuestion[];
  onExit: () => void;
}

export function ExamPlayer({ simId, title, paperLabel, questionFactory, onExit }: ExamPlayerProps) {
  const [attemptSeed, setAttemptSeed] = useState(() =>
    [...simId].reduce((seed, character) => Math.imul(seed ^ character.charCodeAt(0), 16_777_619) >>> 0, 2_166_136_261),
  );
  const questions = useMemo(() => questionFactory(attemptSeed), [attemptSeed, questionFactory]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [mark, setMark] = useState<Mark>("idle");
  const [scores, setScores] = useState<number[]>([]);
  const [summary, setSummary] = useState(false);
  const answerRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const q = questions[index];
  const last = index === questions.length - 1;
  const maxMarks = useMemo(
    () => questions.reduce((s, item) => s + item.marks, 0),
    [questions],
  );
  const earned = scores.reduce((total, score) => total + score, 0);

  useEffect(() => {
    if (summary) {
      summaryRef.current?.focus();
    } else if (mark !== "idle") {
      resultRef.current?.focus();
    } else {
      answerRef.current?.focus();
    }
  }, [attemptSeed, index, mark, summary]);

  useEffect(() => {
    try {
      const random = new Uint32Array(1);
      globalThis.crypto.getRandomValues(random);
      setAttemptSeed(random[0]);
    } catch {
      setAttemptSeed(nextAttemptSeed(Date.now() ^ simId.length));
    }
  }, [simId]);

  useEffect(() => {
    if (summary) saveBestExamScore(simId, { earned, maximum: maxMarks });
  }, [earned, maxMarks, simId, summary]);

  if (!q) return null;

  function submit() {
    if (mark !== "idle") return;
    const trimmed = input.trim();
    if (!trimmed) return;
    let awarded = 0;
    if (q.kind === "text") {
      awarded = markTextAnswer(trimmed, q.acceptedText ?? []) ? q.marks : 0;
    } else if (q.kind === "choice") {
      awarded = isCorrectChoice(trimmed, q.correctIndex ?? -1) ? q.marks : 0;
    } else {
      if (q.expected !== undefined) {
        awarded = numericAnswerMarks(trimmed, q.expected, q.tolerancePct ?? 0, q.unit ?? "", q.marks);
      }
    }
    const nextMark: Mark = awarded === q.marks ? "correct" : awarded > 0 ? "partial" : "wrong";
    setMark(nextMark);
    setScores((prev) => {
      const copy = [...prev];
      copy[index] = awarded;
      return copy;
    });
  }

  function handlePlayerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" || event.defaultPrevented) return;
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    if (mark === "idle") submit();
    else next();
  }

  function next() {
    if (last) {
      setSummary(true);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setMark("idle");
  }

  function restart() {
    setIndex(0);
    setInput("");
    setMark("idle");
    setScores([]);
    setSummary(false);
    setAttemptSeed((seed) => nextAttemptSeed(seed));
  }

  if (summary) {
    return (
      <div ref={summaryRef} tabIndex={-1} className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-8 focus:outline-none">
        <GraduationCap className="h-12 w-12 text-accent" />
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-ink">Paper complete</h2>
          <p className="mt-1 text-sm text-ink-muted">{paperLabel}</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-5xl font-extrabold text-accent">
            {earned} / {maxMarks}
          </p>
          <p className="mt-1 font-mono text-sm text-ink-faint">marks</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {questions.map((item, i) => (
            <div
              key={item.id}
              className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                scores[i] === item.marks
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : (scores[i] ?? 0) > 0
                    ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
                    : "border-rose-500/40 bg-rose-500/15 text-rose-300"
              }`}
            >
              {item.number}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={restart}
            className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-ink-muted hover:border-accent/40 hover:text-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Retry paper
          </button>
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-fg hover:bg-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div tabIndex={-1} onKeyDown={handlePlayerKeyDown} className="mx-auto flex w-full max-w-3xl flex-col gap-4 focus:outline-none">
      <div className="flex items-center justify-between gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted-bg">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-200"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs text-ink-muted">
          Q{index + 1} of {questions.length}
        </span>
        <span className="shrink-0 font-mono text-xs font-bold text-accent">
          {earned} / {maxMarks} marks
        </span>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5">
        <div className="flex items-start justify-between gap-3 border-b border-border-faint pb-3">
          <div>
            <p className="font-mono text-[11px] text-ink-faint">{q.paperRef ?? paperLabel}</p>
            <h2 className="mt-1 text-base font-bold text-ink">{title}</h2>
          </div>
          <span className="font-mono text-xs font-bold text-accent">
            [{q.marks} {q.marks === 1 ? "mark" : "marks"}]
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-bold text-sm text-accent">
            {q.number}
          </div>
          <p className="text-sm font-medium leading-relaxed text-ink">{q.prompt}</p>
        </div>

        {q.contextLines && q.contextLines.length > 0 && (
          <div className="rounded-xl border border-border-faint bg-inset p-3">
            <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-faint">
              Given
            </p>
            {q.contextLines.map((line) => (
              <p key={line} className="font-mono text-xs text-ink-muted">
                {line}
              </p>
            ))}
          </div>
        )}

        {q.kind === "choice" ? (
          <div role="radiogroup" aria-label="Answer options" className="grid gap-2">
            {(q.options ?? []).map((option, optionIndex) => (
              <label
                key={option}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                  input === String(optionIndex)
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-border-subtle bg-inset text-ink-muted"
                } ${mark !== "idle" ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <input
                  ref={optionIndex === 0 ? answerRef : undefined}
                  type="radio"
                  name={`answer-${q.id}`}
                  value={optionIndex}
                  checked={input === String(optionIndex)}
                  disabled={mark !== "idle"}
                  onChange={() => setInput(String(optionIndex))}
                  className="accent-amber-400"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={answerRef}
              type="text"
              inputMode={q.kind === "numeric" ? "decimal" : "text"}
              step="any"
              value={input}
              disabled={mark !== "idle"}
              onChange={(e) => setInput(e.target.value)}
              placeholder={q.kind === "text" ? "Type your answer…" : "Enter value (3 s.f.)"}
              className="min-h-11 flex-1 rounded-xl border border-border-subtle bg-inset px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 focus:outline-none disabled:opacity-60"
            />
            {q.kind === "numeric" && q.unit && (
            <span className="shrink-0 rounded-xl border border-border-subtle bg-inset px-3 py-2.5 font-mono text-xs font-bold text-accent">
              {q.unit}
            </span>
            )}
          </div>
        )}

        {mark === "idle" ? (
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim()}
            className="self-start rounded-xl bg-accent px-5 py-2 text-sm font-bold text-accent-fg transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <div
            ref={resultRef}
            tabIndex={-1}
            className={`flex flex-col gap-3 rounded-xl border p-4 ${
              mark === "correct"
                ? "border-emerald-500/30 bg-emerald-500/10"
                : mark === "partial"
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-rose-500/30 bg-rose-500/10"
            }`}
          >
            <div className="flex items-center gap-2">
              {mark === "correct" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : mark === "partial" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-400" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
              )}
              <span
                className={`text-sm font-bold ${
                  mark === "correct" ? "text-emerald-300" : mark === "partial" ? "text-amber-200" : "text-rose-300"
                }`}
              >
                {mark === "correct"
                  ? `Full marks [${q.marks}/${q.marks}]`
                  : mark === "partial"
                    ? `${scores[index]}/${q.marks} — correct value, check the unit`
                    : `0/${q.marks} — see mark scheme`}
              </span>
              {mark !== "correct" && (
                <span className="ml-auto font-mono text-xs text-ink-muted">
                  {q.kind === "text"
                    ? `Expected: ${q.acceptedText?.[0]?.[0] ?? q.working.answer}`
                    : q.kind === "choice"
                      ? `Expected: ${q.options?.[q.correctIndex ?? -1] ?? q.working.answer}`
                      : `Correct: ${format3SF(q.expected ?? 0)} ${q.unit ?? ""}`}
                </span>
              )}
            </div>

            {mark === "wrong" && q.misconception && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p>
                  <span className="font-bold">Examiner note: </span>
                  {q.misconception}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border-faint bg-inset p-3">
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                <BookOpen className="h-3.5 w-3.5" />
                Mark scheme
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <SchemeCell label="1. Formula (C1)" value={q.working.equation} />
                <SchemeCell label="2. Substitution (C1)" value={q.working.substitution} />
                <SchemeCell label="3. Answer (A1)" value={q.working.answer} accent />
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              className="self-start flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-bold text-accent-fg hover:bg-amber-400"
            >
              {last ? (
                <>
                  <GraduationCap className="h-4 w-4" />
                  View results
                </>
              ) : (
                <>
                  Next question
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onExit}
        className="self-start flex items-center gap-1.5 font-mono text-xs text-ink-faint hover:text-ink-muted"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Return to explore
      </button>
    </div>
  );
}

function SchemeCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border-faint bg-surface p-2">
      <span className="mb-1 block font-mono text-[10px] uppercase text-ink-faint">{label}</span>
      <span className={`font-mono text-xs font-semibold ${accent ? "text-emerald-300" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
