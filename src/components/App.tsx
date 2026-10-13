import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  Layers,
  Magnet,
  Sparkles,
  Moon,
  Sun,
  Waves,
  Zap,
  Atom,
} from "lucide-react";
import { ResultantForcesSim } from "@/components/sims/forces/ResultantForcesSim";
import { MomentsSim } from "@/components/sims/moments/MomentsSim";
import { FloatingSim } from "@/components/sims/floating/FloatingSim";
import { CircuitsSim } from "@/components/sims/circuits/CircuitsSim";
import { RefractionSim } from "@/components/sims/refraction/RefractionSim";
import { ElectromagnetismSim } from "@/components/sims/electromagnetism/ElectromagnetismSim";
import { getBestExamScore } from "@/lib/exam-scores";

export type SimView =
  | "home"
  | "forces_sim"
  | "moments_sim"
  | "floating_sim"
  | "circuits_sim"
  | "refraction_sim"
  | "electromagnetism_sim";

const SIM_LIST = [
  {
    id: "forces",
    view: "forces_sim" as SimView,
    num: "01",
    title: "Resultant Forces & Motion",
    desc: "Forces on a block, resultant force, Newton's 2nd law (F = ma), and a live velocity–time graph.",
    tags: ["Syllabus 1.5.1", "Guided tasks", "Exam mode"],
    icon: Zap,
  },
  {
    id: "moments",
    view: "moments_sim" as SimView,
    num: "02",
    title: "Principle of Moments",
    desc: "Drag masses on a metre rule, include the rule’s own weight, and see moment = F × d_perp.",
    tags: ["Syllabus 1.5.2", "Guided tasks", "Exam mode"],
    icon: Layers,
  },
  {
    id: "floating",
    view: "floating_sim" as SimView,
    num: "03",
    title: "Floating & Sinking",
    desc: "Density, Archimedes’ principle, upthrust, and the fraction of a body that sits below the waterline.",
    tags: ["Syllabus 1.5.3", "Guided tasks", "Exam mode"],
    icon: Waves,
  },
  {
    id: "circuits",
    view: "circuits_sim" as SimView,
    num: "04",
    title: "Electrical Circuits",
    desc: "Build series and parallel loops, place A and V correctly, and see Ohm’s law as a straight V–I line.",
    tags: ["Syllabus 4.2", "Guided tasks", "Exam mode"],
    icon: Atom,
  },
  {
    id: "refraction",
    view: "refraction_sim" as SimView,
    num: "05",
    title: "Light & Refraction",
    desc: "Snell’s law, refractive index n = sin i / sin r, and total internal reflection with critical angle.",
    tags: ["Syllabus 3.2.3", "Guided tasks", "Exam mode"],
    icon: Sparkles,
  },
  {
    id: "electromagnetism",
    view: "electromagnetism_sim" as SimView,
    num: "06",
    title: "Electromagnetism",
    desc: "Field around a current-carrying wire, motor effect, Fleming’s left-hand rule, and F = BIL.",
    tags: ["Syllabus 4.5", "Guided tasks", "Exam mode"],
    icon: Magnet,
  },
];

const SIM_SHORT_NAMES: Record<SimView, string> = {
  home: "Simulations directory",
  forces_sim: "Resultant Forces",
  moments_sim: "Principle of Moments",
  floating_sim: "Floating & Sinking",
  circuits_sim: "Electrical Circuits",
  refraction_sim: "Light & Refraction",
  electromagnetism_sim: "Electromagnetism",
};

const ROUTE_TO_VIEW: Record<string, SimView> = {
  forces: "forces_sim",
  moments: "moments_sim",
  floating: "floating_sim",
  circuits: "circuits_sim",
  refraction: "refraction_sim",
  electromagnetism: "electromagnetism_sim",
};

const VIEW_TO_ROUTE: Partial<Record<SimView, string>> = Object.fromEntries(
  Object.entries(ROUTE_TO_VIEW).map(([route, view]) => [view, route]),
);

export default function App() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const routeSimId = pathname.split("/")[2] ?? "";
  const currentView = ROUTE_TO_VIEW[routeSimId] ?? "home";
  const setCurrentView = useCallback((view: SimView) => {
    const simId = VIEW_TO_ROUTE[view];
    if (simId) navigate({ to: "/sim/$simId", params: { simId } });
    else navigate({ to: "/" });
  }, [navigate]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("stemedge:theme");
      setTheme(stored === "light" || stored === "dark" ? stored : matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    } catch {
      setTheme(matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("stemedge:theme", theme);
    } catch {
      // Theme remains active for the current page if storage is unavailable.
    }
  }, [theme]);

  const handleChipKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setDropdownOpen((prev) => !prev);
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const activeIndex = SIM_LIST.findIndex((sim) => sim.view === currentView);
        setFocusIndex(
          activeIndex >= 0
            ? activeIndex
            : e.key === "ArrowDown"
              ? 0
              : SIM_LIST.length - 1,
        );
        setDropdownOpen(true);
      }
      if (e.key === "Escape") setDropdownOpen(false);
    },
    [currentView],
  );

  useEffect(() => {
    if (dropdownOpen) itemRefs.current[focusIndex]?.focus();
  }, [dropdownOpen, focusIndex]);

  function handleListboxKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement);
    let nextIndex: number | null = null;
    if (e.key === "ArrowDown") nextIndex = (Math.max(currentIndex, 0) + 1) % SIM_LIST.length;
    if (e.key === "ArrowUp") nextIndex = (Math.max(currentIndex, 0) - 1 + SIM_LIST.length) % SIM_LIST.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = SIM_LIST.length - 1;
    if (e.key === "Escape") {
      e.preventDefault();
      setDropdownOpen(false);
      chipRef.current?.focus();
      return;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      setFocusIndex(nextIndex);
    }
  }

  const isOnSim = currentView !== "home";
  const chipLabel = isOnSim ? `Current: ${SIM_SHORT_NAMES[currentView]}` : "Select simulation";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-canvas text-ink selection:bg-accent/20 selection:text-amber-200">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-faint bg-canvas-elevated/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <button
          type="button"
          onClick={() => setCurrentView("home")}
          className="group flex items-center gap-2.5 text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-base font-extrabold text-accent-fg shadow-sm transition-transform group-hover:scale-105">
            S
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-ink transition-colors group-hover:text-accent">
                STEMEdge
              </span>
              <span className="rounded border border-accent/20 bg-chip px-2 py-0.5 font-mono text-[10px] uppercase text-amber-300">
                Cambridge IGCSE
              </span>
            </div>
            <span className="hidden font-sans text-[11px] text-ink-muted sm:inline">
              Physics 0625 Interactive Laboratory
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2.5" ref={dropdownRef}>
          <button
            type="button"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-ink-muted hover:text-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrentView("home")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              currentView === "home"
                ? "border border-border-subtle bg-chip text-amber-300"
                : "text-ink-muted hover:bg-muted-bg hover:text-ink"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simulations directory</span>
            <span className="sm:hidden">Directory</span>
          </button>

          <div className="relative">
            <button
              ref={chipRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((prev) => !prev)}
              onKeyDown={handleChipKeyDown}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isOnSim
                  ? "border-amber-400 bg-accent text-accent-fg hover:bg-amber-400"
                  : "border-border-subtle bg-muted-bg text-ink-muted hover:bg-surface"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span className="max-w-[160px] truncate">{chipLabel}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div
                role="listbox"
                aria-label="Select a simulation"
                onKeyDown={handleListboxKeyDown}
                className="absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-xl border border-border-subtle bg-canvas-elevated shadow-2xl"
              >
                {SIM_LIST.map((sim, idx) => {
                  const IconComp = sim.icon;
                  const isActive = currentView === sim.view;
                  return (
                    <button
                      key={sim.id}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setCurrentView(sim.view);
                        setDropdownOpen(false);
                        chipRef.current?.focus();
                      }}
                      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                        isActive
                          ? "border-l-2 border-accent bg-accent/15 text-amber-300"
                          : "border-l-2 border-transparent text-ink-muted hover:bg-muted-bg hover:text-ink"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? "bg-accent/20 text-accent" : "bg-muted-bg text-ink-faint"
                        }`}
                      >
                        <IconComp className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold leading-none">
                          {sim.num} — {sim.title}
                        </span>
                        <span className="mt-0.5 block font-mono text-[9px] text-ink-faint">{sim.tags[0]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-3 sm:px-6 sm:py-3.5">
        {currentView === "forces_sim" ? (
          <ResultantForcesSim onBackToHome={() => setCurrentView("home")} />
        ) : currentView === "moments_sim" ? (
          <MomentsSim onBackToHome={() => setCurrentView("home")} />
        ) : currentView === "floating_sim" ? (
          <FloatingSim onBackToHome={() => setCurrentView("home")} />
        ) : currentView === "circuits_sim" ? (
          <CircuitsSim onBackToHome={() => setCurrentView("home")} />
        ) : currentView === "refraction_sim" ? (
          <RefractionSim onBackToHome={() => setCurrentView("home")} />
        ) : currentView === "electromagnetism_sim" ? (
          <ElectromagnetismSim onBackToHome={() => setCurrentView("home")} />
        ) : (
          <Directory onOpen={setCurrentView} />
        )}
      </main>

      <footer className="flex flex-col items-center justify-between gap-2 border-t border-border-faint bg-canvas-elevated px-6 py-3 font-mono text-xs text-ink-faint sm:flex-row">
        <div>STEMEdge · Cambridge IGCSE Physics (0625)</div>
        <div>SI units · 3 significant figures · g = 9.8 N/kg</div>
      </footer>
    </div>
  );
}

function Directory({ onOpen }: { onOpen: (view: SimView) => void }) {
  const [bestScores, setBestScores] = useState<Record<string, ReturnType<typeof getBestExamScore>>>({});

  useEffect(() => {
    setBestScores(
      Object.fromEntries(SIM_LIST.map((sim) => [sim.id, getBestExamScore(sim.id)])),
    );
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-6 sm:flex-row sm:items-center">
        <div className="flex max-w-2xl flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              Cambridge IGCSE (0625)
            </span>
            <span className="text-ink-faint">·</span>
            <span className="text-xs text-ink-muted">Exam papers 4 & 6 prep</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Six interactive Cambridge physics simulations
          </h1>
          <p className="text-sm leading-relaxed text-ink-muted">
            Live physical feedback, graphs that update with the apparatus, and structured Paper 4
            calculations with SI units and 3 s.f. mark schemes.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-ink-faint">g = 9.8 N/kg · SI units</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SIM_LIST.map((sim) => {
          const IconComponent = sim.icon;
          const bestScore = bestScores[sim.id];
          return (
            <button
              key={sim.id}
              type="button"
              onClick={() => onOpen(sim.view)}
              className="flex flex-col justify-between rounded-xl border border-accent/40 bg-surface p-5 text-left transition-colors hover:border-accent/80"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink-faint">{sim.num}</span>
                  <span className="rounded border border-accent/30 bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                    Guided tasks · Exam mode
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-ink">{sim.title}</h3>
                    {bestScore && (
                      <p className="mt-0.5 font-mono text-[10px] text-accent">
                        Best {bestScore.earned}/{bestScore.maximum}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-ink-muted">{sim.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border-faint pt-3">
                <div className="flex flex-wrap gap-1">
                  {sim.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-border-faint bg-canvas-elevated px-1.5 py-0.5 font-mono text-[10px] text-ink-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                  Open
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
