import type { ExamQuestion } from "@/components/ExamPlayer";
import { format3SF } from "../../../lib/format.ts";
import { seededPick } from "../../../lib/seeded-choice.ts";

export type PathKind = "resistor" | "ammeter" | "lamp" | "variable_resistor" | "diode";
export type TrayType = "resistor_10" | "resistor_20" | "variable_resistor" | "lamp" | "diode" | "ammeter" | "voltmeter";

export interface PathComponent {
  id: string;
  kind: PathKind;
  value: number;
  label: string;
  reversed?: boolean;
}

export type Section =
  | { id: string; type: "series"; component: PathComponent }
  | { id: string; type: "parallel"; branches: [PathComponent[], PathComponent[]] };

export interface CircuitState {
  cellEmf: number;
  internalR: number;
  switchClosed: boolean;
  sections: Section[];
  voltmeterAcross: string | "supply" | "switch" | null;
}

export type Topology =
  | "Series (closed)"
  | "Parallel (closed)"
  | "Mixed (closed)"
  | "Short circuit"
  | "Switch open"
  | "Incomplete / open";

export interface ResistorReading {
  current: number;
  voltage: number;
  power: number;
}

export interface CircuitEvaluation {
  cellEmf: number;
  internalR: number;
  terminalV: number;
  totalCurrent: number;
  totalResistance: number;
  loadResistance: number;
  powerW: number;
  ammeterReading: number | null;
  voltmeterReading: number | null;
  voltmeterWhere: string;
  topology: Topology;
  isClosed: boolean;
  isShort: boolean;
  switchClosed: boolean;
  resistorCurrents: Record<string, ResistorReading>;
  branchCurrents: Record<string, number>;
  componentCurrent: Record<string, number>;
  seriesResistorCount: number;
  parallelResistorPair: boolean;
  voltagesSum: number;
  task1Complete: boolean;
  task2Complete: boolean;
  task3Complete: boolean;
  task4Complete: boolean;
  taskNotes: Record<number, string>;
  coach: string;
  ammeterHint: string | null;
  voltmeterHint: string | null;
  steps: string[];
}

export interface GuidedTask {
  id: number;
  title: string;
  prompt: string;
  goal: string;
  prediction: {
    question: string;
    choices: string[];
    answer: number;
    explanation: string;
  };
  setupFactory: () => CircuitState;
}

export const GUIDED_TASKS: GuidedTask[] = [
  {
    id: 1,
    title: "Close a series loop",
    prompt:
      "Tap the 10 Ω resistor in the tray — it drops onto the loop. Keep the switch closed. Check I = V / R for the whole circuit.",
    goal: "Closed series circuit with at least one load.",
    prediction: {
      question: "With a resistor in the loop and the switch closed, current will…",
      choices: ["flow", "not flow"],
      answer: 0,
      explanation:
        "Closing the switch provides a complete conducting path with a finite resistance (10 Ω). By Ohm's law I = V/R = 6/10 = 0.6 A flows.",
    },
    setupFactory: () => {
      const r1 = componentFromTray("resistor_10", 1);
      return {
        cellEmf: 6,
        internalR: 0,
        switchClosed: true,
        sections: [{ id: makeId("s"), type: "series", component: r1 }],
        voltmeterAcross: null,
      };
    },
  },
  {
    id: 2,
    title: "Two resistors in series",
    prompt:
      "Add the 20 Ω as well. Current is the same through both. The p.d.s add to the terminal voltage. Read V on each resistor.",
    goal: "Two loads in series, switch closed.",
    prediction: {
      question: "Adding a second resistor in series makes total current…",
      choices: ["decrease", "stay the same", "increase"],
      answer: 0,
      explanation:
        "Resistances add in series (R_tot = R1 + R2 = 30 Ω). A greater total resistance opposes current flow, decreasing total current from 0.60 A to 0.20 A.",
    },
    setupFactory: () => {
      const r1 = componentFromTray("resistor_10", 1);
      const r2 = componentFromTray("resistor_20", 2);
      return {
        cellEmf: 6,
        internalR: 0,
        switchClosed: true,
        sections: [
          { id: makeId("s"), type: "series", component: r1 },
          { id: makeId("s"), type: "series", component: r2 },
        ],
        voltmeterAcross: null,
      };
    },
  },
  {
    id: 3,
    title: "Place the meters",
    prompt:
      "Add the ammeter (it must sit in the loop — series). Then tap the voltmeter and clip it across a resistor. Voltmeters never go in the chain.",
    goal: "Ammeter in series and voltmeter across a load.",
    prediction: {
      question: "An ideal ammeter in series changes the current…",
      choices: ["not at all", "by a lot", "to zero"],
      answer: 0,
      explanation:
        "An ideal ammeter has negligible resistance (≈ 0 Ω). Placing it in series measures the through-current without impeding the flow of charge.",
    },
    setupFactory: () => {
      const a = componentFromTray("ammeter");
      const r1 = componentFromTray("resistor_10", 1);
      const r2 = componentFromTray("resistor_20", 2);
      return {
        cellEmf: 6,
        internalR: 0,
        switchClosed: true,
        sections: [
          { id: makeId("s"), type: "series", component: a },
          { id: makeId("s"), type: "series", component: r1 },
          { id: makeId("s"), type: "series", component: r2 },
        ],
        voltmeterAcross: r1.id,
      };
    },
  },
  {
    id: 4,
    title: "Two resistors in parallel",
    prompt:
      "On a resistor, tap “add in parallel”, then add the other resistor on the new branch. Combined R is smaller than either branch. Currents add.",
    goal: "Two resistor branches in parallel, circuit closed.",
    prediction: {
      question: "Adding a parallel branch makes the cell’s total current…",
      choices: ["increase", "decrease", "stay the same"],
      answer: 0,
      explanation:
        "Adding a parallel branch provides an additional conducting path (1/R_tot = 1/R1 + 1/R2). The combined resistance drops to 6.67 Ω, so the cell delivers more total current.",
    },
    setupFactory: () => {
      const a = componentFromTray("ammeter");
      const r1 = componentFromTray("resistor_10", 1);
      const r2 = componentFromTray("resistor_20", 2);
      return {
        cellEmf: 6,
        internalR: 0,
        switchClosed: true,
        sections: [
          { id: makeId("s"), type: "series", component: a },
          { id: makeId("p"), type: "parallel", branches: [[r1], [r2]] },
        ],
        voltmeterAcross: null,
      };
    },
  },
];

export function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function componentFromTray(
  type: Exclude<TrayType, "voltmeter">,
  serial = 1,
): PathComponent {
  if (type === "ammeter") {
    return { id: makeId("A"), kind: "ammeter", value: 0, label: "Ammeter" };
  }
  if (type === "lamp") {
    return { id: makeId("L"), kind: "lamp", value: 12, label: `L${serial} · 12 Ω` };
  }
  if (type === "resistor_20") {
    return { id: makeId("R"), kind: "resistor", value: 20, label: `R${serial} · 20 Ω` };
  }
  if (type === "variable_resistor") {
    return { id: makeId("VR"), kind: "variable_resistor", value: 15, label: `VR${serial} · 15 Ω` };
  }
  if (type === "diode") {
    return { id: makeId("D"), kind: "diode", value: 0.5, label: `D${serial} · Diode`, reversed: false };
  }
  return { id: makeId("R"), kind: "resistor", value: 10, label: `R${serial} · 10 Ω` };
}

export function resistorValueLabel(value: number): string {
  return `${Number.isInteger(value) ? value : format3SF(value)} Ω`;
}

export function getInitialCircuitState(): CircuitState {
  return { cellEmf: 6, internalR: 0, switchClosed: true, sections: [], voltmeterAcross: null };
}

export function loadSeriesDemo(): CircuitState {
  const r1 = componentFromTray("resistor_10", 1);
  const r2 = componentFromTray("resistor_20", 2);
  const a = componentFromTray("ammeter");
  return {
    cellEmf: 6,
    internalR: 0,
    switchClosed: true,
    sections: [
      { id: makeId("s"), type: "series", component: a },
      { id: makeId("s"), type: "series", component: r1 },
      { id: makeId("s"), type: "series", component: r2 },
    ],
    voltmeterAcross: r2.id,
  };
}

export function loadParallelDemo(): CircuitState {
  const r1 = componentFromTray("resistor_10", 1);
  const r2 = componentFromTray("resistor_20", 2);
  const a = componentFromTray("ammeter");
  return {
    cellEmf: 6,
    internalR: 0,
    switchClosed: true,
    sections: [
      { id: makeId("s"), type: "series", component: a },
      { id: makeId("p"), type: "parallel", branches: [[r1], [r2]] },
    ],
    voltmeterAcross: "supply",
  };
}

function isLoad(c: PathComponent): boolean {
  return c.kind === "resistor" || c.kind === "lamp" || c.kind === "variable_resistor" || c.kind === "diode";
}

function resistanceOf(c: PathComponent): number {
  if (c.kind === "ammeter") return 0;
  if (c.kind === "diode") return c.reversed ? Infinity : 0.5;
  return c.value;
}

function branchResistance(branch: PathComponent[]): number {
  if (branch.length === 0) return Infinity;
  return branch.reduce((sum, c) => sum + resistanceOf(c), 0);
}

function sectionResistance(section: Section): number {
  if (section.type === "series") return resistanceOf(section.component);
  const r1 = branchResistance(section.branches[0]);
  const r2 = branchResistance(section.branches[1]);
  const parts = [r1, r2].filter((r) => Number.isFinite(r));
  if (parts.length === 0) return Infinity;
  const recip = parts.reduce((s, r) => s + 1 / Math.max(r, 1e-12), 0);
  return 1 / recip;
}

// k = 2 A⁻² in R = R₀(1 + kI²); illustrative steady-state filament model.
export const LAMP_TEMP_COEFFICIENT = 2;

export function lampResistanceAtCurrent(baseResistance: number, currentA: number): number {
  return baseResistance * (1 + LAMP_TEMP_COEFFICIENT * currentA * currentA);
}

function resistanceAtCurrent(component: PathComponent, currentA: number): number {
  return component.kind === "lamp"
    ? lampResistanceAtCurrent(component.value, currentA)
    : resistanceOf(component);
}

function branchResistanceAtCurrent(branch: PathComponent[], currentA: number): number {
  if (branch.length === 0) return Infinity;
  return branch.reduce((sum, component) => sum + resistanceAtCurrent(component, currentA), 0);
}

function parallelBranchCurrents(section: Extract<Section, { type: "parallel" }>, totalCurrent: number) {
  let currents: [number, number] = [totalCurrent / 2, totalCurrent / 2];
  for (let iteration = 0; iteration < 24; iteration += 1) {
    const resistances = section.branches.map((branch, index) =>
      branchResistanceAtCurrent(branch, currents[index]),
    ) as [number, number];
    const conductances = resistances.map((resistance) =>
      Number.isFinite(resistance) && resistance > 0 ? 1 / resistance : resistance === 0 ? Infinity : 0,
    ) as [number, number];
    const next: [number, number] =
      conductances[0] === Infinity && conductances[1] === Infinity
        ? [totalCurrent / 2, totalCurrent / 2]
        : conductances[0] === Infinity
          ? [totalCurrent, 0]
          : conductances[1] === Infinity
            ? [0, totalCurrent]
            : conductances[0] + conductances[1] > 0
              ? [
                  totalCurrent * (conductances[0] / (conductances[0] + conductances[1])),
                  totalCurrent * (conductances[1] / (conductances[0] + conductances[1])),
                ]
              : [0, 0];
    const settled: [number, number] = [
      currents[0] * 0.5 + next[0] * 0.5,
      currents[1] * 0.5 + next[1] * 0.5,
    ];
    if (Math.abs(settled[0] - currents[0]) < 1e-9) {
      currents = next;
      break;
    }
    currents = settled;
  }
  return currents;
}

function sectionResistanceAtCurrent(section: Section, currentA: number): number {
  if (section.type === "series") return resistanceAtCurrent(section.component, currentA);
  const branchCurrents = parallelBranchCurrents(section, currentA);
  const branchResistances = section.branches.map((branch, index) =>
    branchResistanceAtCurrent(branch, branchCurrents[index]),
  );
  const conductance = branchResistances.reduce(
    (sum, resistance) => sum + (Number.isFinite(resistance) && resistance > 0 ? 1 / resistance : 0),
    0,
  );
  return conductance > 0 ? 1 / conductance : Infinity;
}

function loadResistanceAtCurrent(state: CircuitState, currentA: number): number {
  return state.sections.reduce(
    (sum, section) => sum + sectionResistanceAtCurrent(section, currentA),
    0,
  );
}

function countSeriesResistors(state: CircuitState): number {
  return state.sections.filter((s) => s.type === "series" && s.component.kind === "resistor").length;
}

function hasSeriesAmmeter(state: CircuitState): boolean {
  return state.sections.some((sec) => sec.type === "series" && sec.component.kind === "ammeter");
}

function parallelResistorPair(state: CircuitState): boolean {
  return state.sections.some((sec) => {
    if (sec.type !== "parallel") return false;
    return sec.branches[0].some((c) => c.kind === "resistor") && sec.branches[1].some((c) => c.kind === "resistor");
  });
}

function allComponents(state: CircuitState): PathComponent[] {
  const list: PathComponent[] = [];
  for (const sec of state.sections) {
    if (sec.type === "series") list.push(sec.component);
    else list.push(...sec.branches[0], ...sec.branches[1]);
  }
  return list;
}

function loadResistanceOf(state: CircuitState): number {
  if (state.sections.length === 0) return Infinity;
  let rTot = 0;
  for (const sec of state.sections) {
    const r = sectionResistance(sec);
    if (!Number.isFinite(r)) return Infinity;
    rTot += r;
  }
  return rTot;
}

function hasZeroResistanceParallelBranch(state: CircuitState): boolean {
  return state.sections.some(
    (section) =>
      section.type === "parallel" &&
      section.branches.some((branch) => branchResistance(branch) === 0),
  );
}

export function evaluateCircuit(state: CircuitState, currentTaskId = 1): CircuitEvaluation {
  const empty = state.sections.length === 0;
  let rLoad = loadResistanceOf(state);
  const steps: string[] = [];

  if (!empty) {
    for (const sec of state.sections) {
      const r = sectionResistance(sec);
      if (sec.type === "series") {
        if (isLoad(sec.component)) {
          steps.push(`Series: ${sec.component.label} adds ${format3SF(r)} Ω`);
        }
      } else {
        const r1 = branchResistance(sec.branches[0]);
        const r2 = branchResistance(sec.branches[1]);
        steps.push(
          `Parallel: 1/R = 1/${Number.isFinite(r1) ? format3SF(r1) : "∞"} + 1/${Number.isFinite(r2) ? format3SF(r2) : "∞"} → R = ${format3SF(r)} Ω`,
        );
      }
    }
  }

  const switchOpen = !state.switchClosed;
  const parallelShort = hasZeroResistanceParallelBranch(state);
  const isShort = state.switchClosed && !empty && (parallelShort || (Number.isFinite(rLoad) && rLoad <= 0.001));
  const rInternal = Math.max(0, state.internalR);
  let rTotalIfClosed = (Number.isFinite(rLoad) ? rLoad : 0) + rInternal;
  const isClosed = state.switchClosed && Number.isFinite(rLoad) && rLoad > 0.001 && !parallelShort;

  let totalCurrent = 0;
  if (switchOpen) {
    totalCurrent = 0;
  } else if (isShort) {
    totalCurrent = rInternal > 0.001 ? state.cellEmf / rInternal : Infinity;
  } else if (isClosed) {
    totalCurrent = state.cellEmf / rTotalIfClosed;
    for (let iteration = 0; iteration < 48; iteration += 1) {
      const nextResistance = loadResistanceAtCurrent(state, totalCurrent);
      const nextCurrent = state.cellEmf / (nextResistance + rInternal);
      if (Math.abs(nextCurrent - totalCurrent) < 1e-10) {
        totalCurrent = nextCurrent;
        rLoad = nextResistance;
        break;
      }
      totalCurrent = totalCurrent * 0.5 + nextCurrent * 0.5;
      rLoad = nextResistance;
    }
    rLoad = loadResistanceAtCurrent(state, totalCurrent);
    rTotalIfClosed = rLoad + rInternal;
  }

  const terminalV = switchOpen
    ? state.cellEmf
    : isShort
      ? rInternal > 0.001
        ? 0
        : 0
      : state.cellEmf - totalCurrent * rInternal;

  if (isClosed) {
    steps.push(
      `I = E / (R + r) = ${format3SF(state.cellEmf)} / (${format3SF(rLoad)} + ${format3SF(rInternal)}) = ${format3SF(totalCurrent)} A`,
    );
    if (rInternal > 0.001) {
      steps.push(
        `Terminal p.d. V = E − Ir = ${format3SF(state.cellEmf)} − ${format3SF(totalCurrent)}×${format3SF(rInternal)} = ${format3SF(terminalV)} V`,
      );
    }
  }

  const resistorCurrents: Record<string, ResistorReading> = {};
  const componentCurrent: Record<string, number> = {};
  const branchCurrents: Record<string, number> = {};
  let voltagesSum = 0;

  if (isClosed) {
    for (const sec of state.sections) {
      if (sec.type === "series") {
        const i = totalCurrent;
        componentCurrent[sec.component.id] = i;
        if (isLoad(sec.component)) {
          const v = i * resistanceAtCurrent(sec.component, i);
          voltagesSum += v;
          resistorCurrents[sec.component.id] = { current: i, voltage: v, power: i * v };
        }
      } else {
        const branchIs = parallelBranchCurrents(sec, totalCurrent);
        const rSec = sectionResistanceAtCurrent(sec, totalCurrent);
        const vSec = totalCurrent * rSec;
        voltagesSum += Number.isFinite(vSec) ? vSec : 0;
        sec.branches.forEach((branch, idx) => {
          const iB = branchIs[idx];
          branchCurrents[`${sec.id}:${idx}`] = iB;
          for (const c of branch) {
            componentCurrent[c.id] = iB;
            if (isLoad(c)) {
              const voltage = iB * resistanceAtCurrent(c, iB);
              resistorCurrents[c.id] = { current: iB, voltage, power: iB * voltage };
            }
          }
        });
      }
    }
  }

  let ammeterReading: number | null = null;
  for (const c of allComponents(state)) {
    if (c.kind === "ammeter") {
      if (switchOpen) ammeterReading = 0;
      else if (isShort) ammeterReading = totalCurrent;
      else ammeterReading = componentCurrent[c.id] ?? 0;
      break;
    }
  }

  let voltmeterReading: number | null = null;
  let voltmeterWhere = "not clipped";
  if (state.voltmeterAcross === "supply") {
    voltmeterWhere = "cell terminals";
    voltmeterReading = terminalV;
  } else if (state.voltmeterAcross === "switch") {
    voltmeterWhere = "across switch";
    voltmeterReading = switchOpen ? state.cellEmf : 0;
  } else if (state.voltmeterAcross) {
    const target = allComponents(state).find((c) => c.id === state.voltmeterAcross);
    if (target && isLoad(target)) {
      voltmeterWhere = target.label;
      voltmeterReading = isClosed ? (resistorCurrents[target.id]?.voltage ?? 0) : 0;
    } else if (target?.kind === "ammeter") {
      voltmeterWhere = "ammeter (≈ 0 Ω)";
      voltmeterReading = 0;
    }
  }

  const hasParallel = state.sections.some((s) => s.type === "parallel");
  const seriesLoadN = state.sections.filter((s) => s.type === "series" && isLoad(s.component)).length;
  const hasSeriesLoad = seriesLoadN > 0;

  let topology: Topology;
  if (switchOpen) topology = "Switch open";
  else if (empty) topology = "Incomplete / open";
  else if (isShort) topology = "Short circuit";
  else if (!isClosed) topology = "Incomplete / open";
  else if (hasParallel && hasSeriesLoad) topology = "Mixed (closed)";
  else if (hasParallel) topology = "Parallel (closed)";
  else topology = "Series (closed)";

  const task1 = isClosed && !hasParallel && hasSeriesLoad;
  const task2 = isClosed && !hasParallel && seriesLoadN >= 2;
  const voltmeterTarget = state.voltmeterAcross && state.voltmeterAcross !== "supply" && state.voltmeterAcross !== "switch"
    ? allComponents(state).find((component) => component.id === state.voltmeterAcross)
    : undefined;
  const task3 =
    isClosed &&
    hasSeriesAmmeter(state) &&
    voltmeterTarget !== undefined &&
    isLoad(voltmeterTarget) &&
    Boolean(resistorCurrents[voltmeterTarget.id]);
  const task4 = isClosed && state.sections.some((sec) => {
    if (sec.type !== "parallel") return false;
    return sec.branches[0].some(isLoad) && sec.branches[1].some(isLoad);
  });

  let coach: string;
  if (empty && switchOpen) {
    coach = "Close the switch, then tap a 10 Ω resistor in the tray. It will appear on the loop.";
  } else if (empty) {
    coach = "Tap the 10 Ω resistor in the tray — it drops onto the top rail. The cell is already in the loop.";
  } else if (switchOpen) {
    coach =
      state.voltmeterAcross === "switch"
        ? "Voltmeter across the open switch reads the full cell e.m.f. because the meter's huge resistance completes the probe circuit with negligible current."
        : "Switch is open, so I = 0. A voltmeter across the cell or an open switch reads the e.m.f. Across a load it reads 0.";
  } else if (isShort) {
    coach = parallelShort
      ? "An ammeter in parallel is a short circuit; ammeters go in series."
      : "There is no load — this is a short circuit. Current would be huge (limited only by internal resistance). Add a resistor or lamp.";
  } else if (!isClosed) {
    const reverseDiode = allComponents(state).find((c) => c.kind === "diode" && c.reversed);
    coach = reverseDiode
      ? "The diode is reverse-biased and blocks conventional current (infinite resistance). Tap ⇄ Flip on the diode to allow forward conduction."
      : "The conducting path is incomplete. Add a resistor or lamp to each open branch.";
  } else if (currentTaskId === 1) {
    coach = task1 ? "The loop is complete. Predict I = E/R, then add an ammeter in series to check your calculation." : "Add a load in the series path and close the switch to complete this task.";
  } else if (currentTaskId === 2) {
    coach = task2 ? "Both loads are in series: current is equal through them and their p.d.s add." : "Add a second load (resistor or lamp) in series with the switch closed.";
  } else if (currentTaskId === 3) {
    coach = task3 ? "The ammeter is in series and the voltmeter is across a load. Compare the readings with V = IR." : ammeterReading === null ? "Place the ammeter in the main series path; an ideal ammeter has negligible resistance." : "Select the voltmeter, then clip it across a load (not along the circuit).";
  } else {
    coach = task4 ? "Both parallel branches contain loads. Compare branch current with total current." : "Split a component into parallel branches, then place a resistor or lamp in each branch.";
  }

  const ammeterHint = hasParallel
    ? hasSeriesAmmeter(state)
      ? null
      : "An ammeter on one branch only reads that branch. For I_tot, place it on the top rail before the split."
    : null;

  const voltmeterHint =
    state.voltmeterAcross === null
      ? "A voltmeter is a high-resistance probe. Tap V, then clip it across the cell or a resistor."
      : null;

  const powerW = isClosed && Number.isFinite(totalCurrent) ? terminalV * totalCurrent : 0;

  return {
    cellEmf: state.cellEmf,
    internalR: rInternal,
    terminalV,
    totalCurrent,
    totalResistance: switchOpen || empty ? Infinity : isShort ? rInternal : rTotalIfClosed,
    loadResistance: rLoad,
    powerW,
    ammeterReading,
    voltmeterReading,
    voltmeterWhere,
    topology,
    isClosed,
    isShort,
    switchClosed: state.switchClosed,
    resistorCurrents,
    branchCurrents,
    componentCurrent,
    seriesResistorCount: seriesLoadN,
    parallelResistorPair: parallelResistorPair(state),
    voltagesSum,
    task1Complete: task1,
    task2Complete: task2,
    task3Complete: task3,
    task4Complete: task4,
    taskNotes: {
      1: "I = V/R holds for the whole series loop. Conventional current leaves the positive terminal.",
      2: "Series: I is the same through every component. p.d.s add: V1 + V2 = V_terminal.",
      3: "Ammeter in series (≈ 0 Ω). Voltmeter in parallel (≈ infinite Ω). Swapping them wrecks the circuit.",
      4: "Parallel: each branch has the same p.d. Currents add. Combined R is smaller than the smallest branch.",
    },
    coach,
    ammeterHint,
    voltmeterHint,
    steps,
  };
}

export function generateCircuitsExamQuestions(seed = 1): ExamQuestion[] {
  const emf = seededPick(seed, "circuits-c1-emf", [4.5, 6, 7.5]);
  const resistance = seededPick(seed, "circuits-c1-resistance", [10, 15, 20]);
  const current = emf / resistance;
  const series = seededPick(seed, "circuits-c2-series", [
    { r1: 10, r2: 20, emf: 6 },
    { r1: 12, r2: 24, emf: 7.5 },
    { r1: 15, r2: 30, emf: 9 },
  ]);
  const seriesCurrent = series.emf / (series.r1 + series.r2);
  const secondResistorVoltage = seriesCurrent * series.r2;
  const parallel = seededPick(seed, "circuits-c4-parallel", [
    { r1: 10, r2: 20 },
    { r1: 12, r2: 24 },
    { r1: 15, r2: 30 },
  ]);
  const parallelResistance = 1 / (1 / parallel.r1 + 1 / parallel.r2);
  const openEmf = seededPick(seed, "circuits-c5-emf", [4.5, 6, 9]);
  const powerVoltage = seededPick(seed, "circuits-c7-voltage", [4.5, 6, 9]);
  const powerCurrent = seededPick(seed, "circuits-c7-current", [0.4, 0.6, 0.8]);
  const power = powerVoltage * powerCurrent;
  const branchCircuit = seededPick(seed, "circuits-c8-branch", [
    { resistance: 10, other: 20, voltage: 4.5 },
    { resistance: 12, other: 24, voltage: 6 },
    { resistance: 15, other: 30, voltage: 9 },
  ]);
  const branchCurrent = branchCircuit.voltage / branchCircuit.resistance;
  return [
    {
      id: "c1",
      number: 1,
      marks: 2,
      paperRef: "0625/41 · Ohm’s law",
      prompt: `A ${emf.toFixed(1)} V cell is connected to a ${resistance} Ω resistor. The switch is closed. Calculate the current.`,
      contextLines: [`E = ${emf.toFixed(1)} V`, `R = ${resistance} Ω`],
      kind: "numeric",
      expected: current,
      unit: "A",
      tolerancePct: 2,
      working: {
        equation: "I = V / R",
        substitution: `${emf.toFixed(1)} / ${resistance} = ${current.toFixed(2)}`,
        answer: `${current.toFixed(3)} A`,
      },
      misconception: "Current is not 6 × 10. Rearrange V = IR to I = V/R.",
    },
    {
      id: "c2",
      number: 2,
      marks: 2,
      paperRef: "0625/41 · Series",
      prompt: `Two resistors, ${series.r1} Ω and ${series.r2} Ω, are in series with a ${series.emf.toFixed(1)} V cell. Calculate the current.`,
      contextLines: [`R₁ = ${series.r1} Ω`, `R₂ = ${series.r2} Ω`, `E = ${series.emf.toFixed(1)} V`],
      kind: "numeric",
      expected: seriesCurrent,
      unit: "A",
      tolerancePct: 2,
      working: {
        equation: "R_tot = R1 + R2 ; I = V / R_tot",
        substitution: `${series.r1 + series.r2} Ω ; ${series.emf.toFixed(1)} / ${series.r1 + series.r2} = ${seriesCurrent.toFixed(3)}`,
        answer: `${seriesCurrent.toFixed(3)} A`,
      },
      misconception: "In series you add resistances, you do not add currents.",
    },
    {
      id: "c3",
      number: 3,
      marks: 2,
      paperRef: "0625/41 · Series p.d.",
      prompt: `Using the circuit in Q2, calculate the p.d. across the ${series.r2} Ω resistor.`,
      contextLines: [`I = ${seriesCurrent.toFixed(3)} A`, `R = ${series.r2} Ω`],
      kind: "numeric",
      expected: secondResistorVoltage,
      unit: "V",
      tolerancePct: 2,
      working: {
        equation: "V = IR",
        substitution: `${seriesCurrent.toFixed(3)} × ${series.r2} = ${secondResistorVoltage.toFixed(2)}`,
        answer: `${secondResistorVoltage.toFixed(2)} V`,
      },
      misconception: "p.d. splits in series in proportion to resistance — not equally.",
    },
    {
      id: "c4",
      number: 4,
      marks: 2,
      paperRef: "0625/41 · Parallel",
      prompt: `A ${parallel.r1} Ω and a ${parallel.r2} Ω resistor are in parallel. Calculate the combined resistance.`,
      contextLines: [`R₁ = ${parallel.r1} Ω`, `R₂ = ${parallel.r2} Ω`],
      kind: "numeric",
      expected: parallelResistance,
      unit: "Ω",
      tolerancePct: 2.5,
      working: {
        equation: "1/R = 1/R1 + 1/R2",
        substitution: `1/${parallel.r1} + 1/${parallel.r2} → R = ${parallelResistance.toFixed(2)}`,
        answer: `${parallelResistance.toFixed(2)} Ω`,
      },
      misconception: "Combined parallel resistance is smaller than the smallest branch.",
    },
    {
      id: "c5",
      number: 5,
      marks: 2,
      paperRef: "0625/41 · Open switch",
      prompt:
        `A voltmeter is connected across the terminals of a ${openEmf.toFixed(1)} V cell. The switch in the loop is open. What does the voltmeter read?`,
      contextLines: [`E = ${openEmf.toFixed(1)} V`, "switch open → I = 0"],
      kind: "numeric",
      expected: openEmf,
      unit: "V",
      tolerancePct: 2,
      working: {
        equation: "I = 0 so Ir = 0 ; V_terminal = E",
        substitution: `V = ${openEmf.toFixed(1)}`,
        answer: `${openEmf.toFixed(2)} V`,
      },
      misconception: "An open switch does not make the cell’s e.m.f. vanish. Current is zero; the voltmeter across the cell still reads E.",
    },
    {
      id: "c6",
      number: 6,
      marks: 1,
      paperRef: "0625/41 · Meters",
      prompt: "An ammeter must be connected in…",
      kind: "choice",
      options: ["In series", "In parallel", "Across the cell", "Across a resistor"],
      correctIndex: 0,
      working: {
        equation: "Ammeter resistance ≈ 0 Ω",
        substitution: "Whole current must pass through it",
        answer: "series",
      },
      misconception: "A voltmeter goes in parallel; an ammeter in series. Swapping them shorts or opens the circuit.",
    },
    {
      id: "c7",
      number: 7,
      marks: 2,
      paperRef: "0625/41 · Power",
      prompt: `A ${powerVoltage.toFixed(1)} V cell supplies ${powerCurrent.toFixed(2)} A to a resistor. Calculate the power transferred in the resistor.`,
      contextLines: [`V = ${powerVoltage.toFixed(1)} V`, `I = ${powerCurrent.toFixed(2)} A`],
      kind: "numeric",
      expected: power,
      unit: "W",
      tolerancePct: 2,
      working: {
        equation: "P = IV",
        substitution: `${powerCurrent.toFixed(2)} × ${powerVoltage.toFixed(1)} = ${power.toFixed(2)}`,
        answer: `${power.toFixed(2)} W`,
      },
      misconception: "Power is IV (or I²R or V²/R), not I/V.",
    },
    {
      id: "c8",
      number: 8,
      marks: 2,
      paperRef: "0625/41 · Parallel current",
      prompt: `A ${branchCircuit.resistance} Ω and a ${branchCircuit.other} Ω resistor in parallel are connected to ${branchCircuit.voltage.toFixed(1)} V. Calculate the current in the ${branchCircuit.resistance} Ω branch.`,
      contextLines: [`V = ${branchCircuit.voltage.toFixed(1)} V`, `R_branch = ${branchCircuit.resistance} Ω`],
      kind: "numeric",
      expected: branchCurrent,
      unit: "A",
      tolerancePct: 2,
      working: {
        equation: "I = V / R  (same V on each branch)",
        substitution: `${branchCircuit.voltage.toFixed(1)} / ${branchCircuit.resistance} = ${branchCurrent.toFixed(3)}`,
        answer: `${branchCurrent.toFixed(3)} A`,
      },
      misconception: "In parallel the p.d. is the same; current is not.",
    },
  ];
}
