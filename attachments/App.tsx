import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ResultantForcesSim } from './sims/forces/ResultantForcesSim';
import { MomentsSim } from './sims/moments/MomentsSim';
import { FloatingSim } from './sims/floating/FloatingSim';
import { CircuitsSim } from './sims/circuits/CircuitsSim';
import { RefractionSim } from './sims/refraction/RefractionSim';
import { ElectromagnetismSim } from './sims/electromagnetism/ElectromagnetismSim';
import {
  Compass,
  Layers,
  Sparkles,
  Zap,
  Waves,
  Magnet,
  Atom,
  ChevronRight,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

type SimView =
  | 'home'
  | 'forces_sim'
  | 'moments_sim'
  | 'floating_sim'
  | 'circuits_sim'
  | 'refraction_sim'
  | 'electromagnetism_sim';

// ── Sim metadata ──────────────────────────────────────────────────────────────
const SIM_LIST = [
  {
    id: 'forces',
    view: 'forces_sim' as SimView,
    num: '01',
    title: 'Resultant Forces & Motion',
    desc: "Forces on a block, resultant force calculation, Newton's 2nd law (F = ma), and real-time velocity-time graphs.",
    tags: ['Syllabus 1.5.1', 'Paper 4 & 6', 'Interactive v–t Graph'],
    ready: true,
    icon: Zap,
  },
  {
    id: 'moments',
    view: 'moments_sim' as SimView,
    num: '02',
    title: 'Principle of Moments',
    desc: 'Balancing a beam with pivot points, clockwise and anticlockwise moments (F × d), center of gravity.',
    tags: ['Syllabus 1.5.2', 'Equilibrium', 'Beam Balance'],
    ready: true,
    icon: Layers,
  },
  {
    id: 'floating',
    view: 'floating_sim' as SimView,
    num: '03',
    title: 'Floating & Sinking',
    desc: 'Density, Archimedes principle, upthrust in liquids, and hydrostatic pressure variations.',
    tags: ['Syllabus 1.5.3', 'Upthrust', 'Density Column'],
    ready: true,
    icon: Waves,
  },
  {
    id: 'circuits',
    view: 'circuits_sim' as SimView,
    num: '04',
    title: 'Electrical Circuits',
    desc: "Interactive wire and component drag. Series ammeters, parallel voltmeters, Ohm's law (V = IR).",
    tags: ['Syllabus 4.2', 'V = IR', 'Guided Lab'],
    ready: true,
    icon: Atom,
  },
  {
    id: 'refraction',
    view: 'refraction_sim' as SimView,
    num: '05',
    title: 'Light & Refraction',
    desc: "Snell's Law, refractive index (n = sin i / sin r), and Total Internal Reflection (TIR) with critical angle.",
    tags: ['Syllabus 3.2.3', "Snell's Law", 'Ray Optics'],
    ready: true,
    icon: Sparkles,
  },
  {
    id: 'electromagnetism',
    view: 'electromagnetism_sim' as SimView,
    num: '06',
    title: 'Electromagnetism',
    desc: "Magnetic field around current-carrying wires, motor effect, Fleming's Left-Hand Rule, and F = BIL.",
    tags: ['Syllabus 4.5', 'Motor Effect', 'F = BIL'],
    ready: true,
    icon: Magnet,
  },
];

// Lookup: view key → short display name for the chip
const SIM_SHORT_NAMES: Record<SimView, string> = {
  home: 'Simulations Directory',
  forces_sim: 'Resultant Forces',
  moments_sim: 'Principle of Moments',
  floating_sim: 'Floating & Sinking',
  circuits_sim: 'Electrical Circuits',
  refraction_sim: 'Light & Refraction',
  electromagnetism_sim: 'Electromagnetism',
};

export default function App() {
  const [currentView, setCurrentView] = useState<SimView>('forces_sim');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedItem, setFocusedItem] = useState<number>(-1);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setFocusedItem(-1);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Keyboard navigation within the dropdown
  const handleChipKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setDropdownOpen((prev) => !prev);
        if (!dropdownOpen) {
          setFocusedItem(0);
          requestAnimationFrame(() => itemRefs.current[0]?.focus());
        }
      }
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setFocusedItem(-1);
      }
    },
    [dropdownOpen]
  );

  const handleItemKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) % SIM_LIST.length;
        setFocusedItem(next);
        itemRefs.current[next]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1 + SIM_LIST.length) % SIM_LIST.length;
        setFocusedItem(prev);
        itemRefs.current[prev]?.focus();
      } else if (e.key === 'Escape') {
        setDropdownOpen(false);
        setFocusedItem(-1);
        chipRef.current?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCurrentView(SIM_LIST[idx].view);
        setDropdownOpen(false);
        setFocusedItem(-1);
        chipRef.current?.focus();
      }
    },
    []
  );

  const isOnSim = currentView !== 'home';
  const chipLabel = isOnSim
    ? `Current: ${SIM_SHORT_NAMES[currentView]}`
    : 'Select Simulation';

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-300">
      {/* ── Top Application Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0E1017]/90 border-b border-[#1F2432] backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-100 text-base group-hover:text-amber-400 transition-colors">
                  STEMEdge
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#151923] text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  Cambridge IGCSE
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Physics 0625 Interactive Laboratory
              </span>
            </div>
          </button>
        </div>

        {/* Nav — Simulations Directory + dropdown chip */}
        <div className="flex items-center gap-2.5" ref={dropdownRef}>
          {/* Directory button */}
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-[#151923] border border-[#232938] text-amber-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141722]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Simulations Directory</span>
          </button>

          {/* Simulation selector chip + dropdown */}
          <div className="relative">
            <button
              ref={chipRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              onClick={() => {
                setDropdownOpen((prev) => !prev);
                if (!dropdownOpen) {
                  const activeIdx = SIM_LIST.findIndex(
                    (s) => s.view === currentView
                  );
                  const startIdx = activeIdx >= 0 ? activeIdx : 0;
                  setFocusedItem(startIdx);
                  requestAnimationFrame(() =>
                    itemRefs.current[startIdx]?.focus()
                  );
                }
              }}
              onKeyDown={handleChipKeyDown}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isOnSim
                  ? 'bg-amber-500 border-amber-400 text-slate-950 hover:bg-amber-400'
                  : 'bg-[#141722] border-[#232938] text-slate-300 hover:bg-[#1A1F2C]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="max-w-[180px] truncate">{chipLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                role="listbox"
                aria-label="Select a simulation"
                className="absolute right-0 top-full mt-1.5 w-64 bg-[#0E1117] border border-[#232938] rounded-xl shadow-2xl overflow-hidden z-50"
              >
                {SIM_LIST.map((sim, idx) => {
                  const IconComp = sim.icon;
                  const isActive = currentView === sim.view;
                  return (
                    <button
                      key={sim.id}
                      ref={(el) => { itemRefs.current[idx] = el; }}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      tabIndex={dropdownOpen ? 0 : -1}
                      onKeyDown={(e) => handleItemKeyDown(e, idx)}
                      onClick={() => {
                        setCurrentView(sim.view);
                        setDropdownOpen(false);
                        setFocusedItem(-1);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-xs font-medium transition-colors focus:outline-none ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-500'
                          : 'text-slate-300 hover:bg-[#141722] hover:text-slate-100 border-l-2 border-transparent focus:bg-[#141722]'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-[#1A2030] text-slate-400'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold leading-none truncate">
                          {sim.num} — {sim.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono mt-0.5 ${
                            isActive ? 'text-amber-400/70' : 'text-slate-600'
                          }`}
                        >
                          {sim.tags[0]}
                        </span>
                      </div>
                      {isActive && (
                        <Compass className="w-3 h-3 text-amber-400 shrink-0 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col">
        {currentView === 'forces_sim' ? (
          <ResultantForcesSim onBackToHome={() => setCurrentView('home')} />
        ) : currentView === 'moments_sim' ? (
          <MomentsSim onBackToHome={() => setCurrentView('home')} />
        ) : currentView === 'floating_sim' ? (
          <FloatingSim onBackToHome={() => setCurrentView('home')} />
        ) : currentView === 'circuits_sim' ? (
          <CircuitsSim onBackToHome={() => setCurrentView('home')} />
        ) : currentView === 'refraction_sim' ? (
          <RefractionSim onBackToHome={() => setCurrentView('home')} />
        ) : currentView === 'electromagnetism_sim' ? (
          <ElectromagnetismSim onBackToHome={() => setCurrentView('home')} />
        ) : (
          /* ── Home / Simulations Directory ───────────────────────────── */
          <div className="flex flex-col gap-6">
            {/* Catalog Welcome Hero */}
            <div className="bg-[#141722] border border-[#232938] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    Cambridge IGCSE (0625)
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Exam Papers 4 & 6 Prep</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Six Interactive Cambridge Physics Simulations
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Experience immediate physical feedback, read velocity–time graphs in lockstep, and train on real Cambridge exam calculation questions with typed numerical inputs and exact unit requirements.
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentView('forces_sim')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Launch Simulation #1</span>
                </button>
                <span className="text-[11px] font-mono text-slate-500">
                  g = 9.8 N/kg • SI Units • Cambridge Terminology
                </span>
              </div>
            </div>

            {/* Simulations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIM_LIST.map((sim) => {
                const IconComponent = sim.icon;
                return (
                  <div
                    key={sim.id}
                    className="flex flex-col justify-between rounded-xl border p-5 transition-all bg-[#141722] border-amber-500/40 hover:border-amber-500/80 shadow-sm cursor-pointer"
                    onClick={() => setCurrentView(sim.view)}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {sim.num}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Complete (Explore + Exam)
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500/15 text-amber-400">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-slate-200">{sim.title}</h3>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{sim.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1F2432] flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {sim.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1017] text-slate-400 border border-[#1F2432]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Persistent Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#1F2432] bg-[#0E1017] px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500">
        <div>STEMEdge • Cambridge IGCSE Physics (0625) Syllabus Standard</div>
        <div>SI Units • 3 Significant Figures • g = 9.8 N/kg</div>
      </footer>
    </div>
  );
}

