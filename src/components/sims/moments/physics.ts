import type { ExamQuestion } from "@/components/ExamPlayer";
import { G_N_PER_KG } from "../../../lib/format.ts";
import { seededPick } from "../../../lib/seeded-choice.ts";

export const RULE_LENGTH_M = 1;
export const SNAP_M = 0.01;

export interface Load {
  id: string;
  massKg: number;
  posM: number;
  hidden?: boolean;
}

export interface MomentsState {
  pivotM: number;
  ruleMassKg: number;
  includeRule: boolean;
  loads: Load[];
}

export interface MomentTerm {
  id: string;
  label: string;
  weightN: number;
  posM: number;
  armM: number;
  momentNm: number;
  sense: "cw" | "acw" | "none";
}

export interface MomentsDerived {
  terms: MomentTerm[];
  cw: number;
  acw: number;
  net: number;
  balanced: boolean;
  formulaLine: string;
}

export interface GuidedMomentTask {
  id: number;
  title: string;
  prompt: string;
}

export const MASS_BANK_KG = [0.1, 0.2, 0.5, 1, 2];

export const MOMENT_TASKS: GuidedMomentTask[] = [
  {
    id: 1,
    title: "Equal arms",
    prompt:
      "Hang equal masses at equal distances from the pivot. Clockwise moments should equal anticlockwise — the rule sits level.",
  },
  {
    id: 2,
    title: "Unequal masses",
    prompt:
      "Put 2.0 kg at 20 cm left of the pivot. Place 1.0 kg so it balances. Heavier mass needs the shorter perpendicular distance.",
  },
  {
    id: 3,
    title: "Weight of the rule",
    prompt:
      "Turn on the rule’s own weight. Move the pivot off-centre. The rule’s weight acts at 50 cm (centre of gravity). Balance with one mass.",
  },
  {
    id: 4,
    title: "Unknown mass",
    prompt:
      "Load the ‘mystery’ preset. Use the principle of moments to find the hidden mass, then type your answer.",
  },
];

export function getInitialMomentsState(): MomentsState {
  return {
    pivotM: 0.5,
    ruleMassKg: 0.12,
    includeRule: false,
    loads: [
      { id: "L", massKg: 2, posM: 0.2 },
      { id: "R", massKg: 2, posM: 0.8 },
    ],
  };
}

export function snapPos(posM: number): number {
  const clamped = Math.max(0, Math.min(RULE_LENGTH_M, posM));
  return Math.round(clamped / SNAP_M) * SNAP_M;
}

export function computeMoments(s: MomentsState): MomentsDerived {
  const terms: MomentTerm[] = [];

  const push = (id: string, label: string, massKg: number, posM: number) => {
    const weightN = massKg * G_N_PER_KG;
    const armM = posM - s.pivotM;
    const momentNm = weightN * Math.abs(armM);
    const sense: MomentTerm["sense"] =
      Math.abs(armM) < 0.0005 ? "none" : armM > 0 ? "cw" : "acw";
    terms.push({ id, label, weightN, posM, armM: Math.abs(armM), momentNm, sense });
  };

  if (s.includeRule && s.ruleMassKg > 0) {
    push("rule", "rule (C.o.G.)", s.ruleMassKg, 0.5);
  }
  s.loads.forEach((load) => {
    const label = load.hidden ? "?" : `${load.massKg.toFixed(2)} kg`;
    push(load.id, label, load.massKg, load.posM);
  });

  const cw = terms.filter((t) => t.sense === "cw").reduce((a, t) => a + t.momentNm, 0);
  const acw = terms.filter((t) => t.sense === "acw").reduce((a, t) => a + t.momentNm, 0);
  const net = cw - acw;
  const largestMoment = Math.max(cw, acw);
  const balanced = largestMoment > 0 && Math.abs(net) <= Math.max(0.005, 0.01 * largestMoment);

  return {
    terms,
    cw,
    acw,
    net,
    balanced,
    formulaLine: balanced
      ? "Σ clockwise = Σ anticlockwise  →  equilibrium"
      : `Σ CW ${cw.toFixed(2)} N m  ≠  Σ ACW ${acw.toFixed(2)} N m`,
  };
}

export function evaluateMomentTasks(
  s: MomentsState,
  d: MomentsDerived,
  mysterySolved: boolean,
): Record<number, boolean> {
  const left = s.loads.filter((l) => l.posM < s.pivotM - 0.005);
  const right = s.loads.filter((l) => l.posM > s.pivotM + 0.005);
  const equal =
    d.balanced &&
    left.length === 1 &&
    right.length === 1 &&
    Math.abs(left[0].massKg - right[0].massKg) < 0.05 &&
    Math.abs(Math.abs(left[0].posM - s.pivotM) - Math.abs(right[0].posM - s.pivotM)) < 0.02;

  const twoVsOne =
    d.balanced &&
    s.loads.some((l) => Math.abs(l.massKg - 2) < 0.05 && Math.abs(l.posM - (s.pivotM - 0.2)) < 0.03) &&
    s.loads.some((l) => Math.abs(l.massKg - 1) < 0.05 && Math.abs(l.posM - (s.pivotM + 0.4)) < 0.04);

  const withRule =
    s.includeRule &&
    d.balanced &&
    Math.abs(s.pivotM - 0.5) > 0.08 &&
    s.loads.length >= 1;

  const mystery = mysterySolved;

  return { 1: equal, 2: twoVsOne, 3: withRule, 4: mystery };
}

export function mysteryPreset(): MomentsState {
  return {
    pivotM: 0.5,
    ruleMassKg: 0.12,
    includeRule: false,
    loads: [
      { id: "known", massKg: 2, posM: 0.2 },
      { id: "mystery", massKg: 1.5, posM: 0.85, hidden: true },
    ],
  };
}

export interface AngleState {
  forceN: number;
  lengthM: number;
  angleDeg: number;
}

export function getInitialAngleState(): AngleState {
  return { forceN: 12, lengthM: 0.4, angleDeg: 90 };
}

export function computeAngleMoment(s: AngleState) {
  const rad = (s.angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const dPerp = s.lengthM * sin;
  const momentNm = s.forceN * dPerp;
  return { sin, dPerp, momentNm };
}

export function generateMomentsExamQuestions(seed = 1): ExamQuestion[] {
  const forceN = seededPick(seed, "moments-m1-force", [2.5, 3, 4]);
  const distanceM = seededPick(seed, "moments-m1-distance", [0.3, 0.4, 0.5]);
  const momentNm = forceN * distanceM;
  const balance = seededPick(seed, "moments-m2-balance", [
    { knownMass: 1.5, knownArm: 0.2, unknownArm: 0.3 },
    { knownMass: 2, knownArm: 0.3, unknownArm: 0.2 },
    { knownMass: 2.5, knownArm: 0.4, unknownArm: 0.25 },
  ]);
  const balancingMass = (balance.knownMass * balance.knownArm) / balance.unknownArm;
  const ruleScenario = seededPick(seed, "moments-m3-rule", [
    { ruleWeight: 1.2, pivot: 0.4, loadWeight: 0.8 },
    { ruleWeight: 0.8, pivot: 0.3, loadWeight: 0.8 },
    { ruleWeight: 0.8, pivot: 0.4, loadWeight: 1.6 },
  ]);
  const balancingPosition = ruleScenario.pivot - (ruleScenario.ruleWeight * (0.5 - ruleScenario.pivot)) / ruleScenario.loadWeight;
  const angleForce = seededPick(seed, "moments-m4-force", [8, 10, 12]);
  const angleLength = seededPick(seed, "moments-m4-length", [0.4, 0.5, 0.6]);
  const forceAngle = seededPick(seed, "moments-m4-angle", [30, 45, 60]);
  const angledMoment = angleForce * angleLength * Math.sin((forceAngle * Math.PI) / 180);
  const unknownMassData = seededPick(seed, "moments-m6-data", [
    { knownMass: 1.5, knownArm: 0.2, unknownArm: 0.3 },
    { knownMass: 2, knownArm: 0.2, unknownArm: 0.4 },
    { knownMass: 2.5, knownArm: 0.3, unknownArm: 0.5 },
  ]);
  const unknownMass = (unknownMassData.knownMass * unknownMassData.knownArm) / unknownMassData.unknownArm;
  return [
    {
      id: "m1",
      number: 1,
      marks: 2,
      paperRef: "0625/42 · Moment of a force",
      prompt: `A ${forceN.toFixed(1)} N force acts ${distanceM.toFixed(2)} m from a pivot, perpendicular to the beam. Calculate the moment.`,
      contextLines: [`F = ${forceN.toFixed(1)} N`, `d = ${distanceM.toFixed(2)} m`],
      kind: "numeric",
      expected: momentNm,
      unit: "N m",
      tolerancePct: 2,
      working: {
        equation: "moment = F × d",
        substitution: `${forceN.toFixed(1)} × ${distanceM.toFixed(2)} = ${momentNm.toFixed(2)}`,
        answer: `${momentNm.toFixed(2)} N m`,
      },
      misconception: "d must be the perpendicular distance from the pivot to the line of action.",
    },
    {
      id: "m2",
      number: 2,
      marks: 2,
      paperRef: "0625/42 · Principle of moments",
      prompt: `A ${balance.knownMass.toFixed(1)} kg mass sits ${balance.knownArm.toFixed(2)} m to the left of a pivot. What mass, ${balance.unknownArm.toFixed(2)} m to the right, balances the beam? g = 9.8 N/kg.`,
      kind: "numeric",
      expected: balancingMass,
      unit: "kg",
      tolerancePct: 3,
      working: {
        equation: "m1 g d1 = m2 g d2  →  m2 = m1 d1 / d2",
        substitution: `${balance.knownMass.toFixed(1)} × ${balance.knownArm.toFixed(2)} / ${balance.unknownArm.toFixed(2)} = ${balancingMass.toFixed(2)}`,
        answer: `${balancingMass.toFixed(2)} kg`,
      },
      misconception: "g cancels. You can use masses × distances if both weights are mg.",
    },
    {
      id: "m3",
      number: 3,
      marks: 2,
      paperRef: "0625/42 · Weight of a uniform rule",
      prompt: `A uniform metre rule of weight ${ruleScenario.ruleWeight.toFixed(1)} N is pivoted at the ${Math.round(ruleScenario.pivot * 100)} cm mark. Where (from the 0 cm end) must a ${ruleScenario.loadWeight.toFixed(1)} N load sit to balance? The rule’s weight acts at 50 cm.`,
      contextLines: [`Pivot = ${ruleScenario.pivot.toFixed(2)} m`, `W_rule = ${ruleScenario.ruleWeight.toFixed(1)} N at 0.50 m`, `W_load = ${ruleScenario.loadWeight.toFixed(1)} N`],
      kind: "numeric",
      expected: balancingPosition,
      unit: "m",
      tolerancePct: 4,
      working: {
        equation: `${ruleScenario.ruleWeight.toFixed(1)} × (0.50 − ${ruleScenario.pivot.toFixed(2)}) = ${ruleScenario.loadWeight.toFixed(1)} × (${ruleScenario.pivot.toFixed(2)} − x)`,
        substitution: `${(ruleScenario.ruleWeight * (0.5 - ruleScenario.pivot)).toFixed(2)} = ${ruleScenario.loadWeight.toFixed(1)}(${ruleScenario.pivot.toFixed(2)} − x) → x = ${balancingPosition.toFixed(2)}`,
        answer: `${balancingPosition.toFixed(3)} m (the ${Math.round(balancingPosition * 100)} cm mark)`,
      },
      misconception: "The rule’s own weight still produces a moment unless the pivot is at 50 cm.",
    },
    {
      id: "m4",
      number: 4,
      marks: 2,
      paperRef: "0625/42 · Perpendicular distance",
      prompt: `A ${angleForce} N force acts at ${angleLength.toFixed(2)} m from a pivot, at ${forceAngle}° to the beam. Calculate the moment. moment = F × L × sinθ`,
      contextLines: [`F = ${angleForce} N`, `L = ${angleLength.toFixed(2)} m`, `θ = ${forceAngle}°`],
      kind: "numeric",
      expected: angledMoment,
      unit: "N m",
      tolerancePct: 3,
      working: {
        equation: "moment = F L sinθ",
        substitution: `${angleForce} × ${angleLength.toFixed(2)} × sin ${forceAngle}° = ${angledMoment.toFixed(2)}`,
        answer: `${angledMoment.toFixed(2)} N m`,
      },
      misconception: "Do not use L itself unless the force is perpendicular (sin 90° = 1).",
    },
    {
      id: "m5",
      number: 5,
      marks: 1,
      paperRef: "0625/42 · Unit",
      prompt: "The SI unit of moment of a force is…",
      kind: "choice",
      options: ["N m (newton metre)", "N/m", "kg m/s", "W"],
      correctIndex: 0,
      working: {
        equation: "moment = F × d",
        substitution: "N × m",
        answer: "N m (newton metre)",
      },
    },
    {
      id: "m6",
      number: 6,
      marks: 2,
      paperRef: "0625/42 · Unknown mass",
      prompt: `A ${unknownMassData.knownMass.toFixed(1)} kg mass at ${unknownMassData.knownArm.toFixed(2)} m left of a pivot balances an unknown mass at ${unknownMassData.unknownArm.toFixed(2)} m to the right. Find the unknown mass.`,
      contextLines: [`${unknownMassData.knownMass.toFixed(1)} kg at ${unknownMassData.knownArm.toFixed(2)} m ACW`, `? kg at ${unknownMassData.unknownArm.toFixed(2)} m CW`],
      kind: "numeric",
      expected: unknownMass,
      unit: "kg",
      tolerancePct: 3,
      working: {
        equation: `${unknownMassData.knownMass.toFixed(1)} × ${unknownMassData.knownArm.toFixed(2)} = m × ${unknownMassData.unknownArm.toFixed(2)}`,
        substitution: `m = ${(unknownMassData.knownMass * unknownMassData.knownArm).toFixed(2)} / ${unknownMassData.unknownArm.toFixed(2)} = ${unknownMass.toFixed(2)}`,
        answer: `${unknownMass.toFixed(2)} kg`,
      },
    },
  ];
}
