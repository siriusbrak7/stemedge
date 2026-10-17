import type { ExamQuestion } from "@/components/ExamPlayer";
import { seededPick } from "../../../lib/seeded-choice.ts";

export const TRACK_MIN_M = 0;
export const TRACK_MAX_M = 16;
export const REST_SPEED = 0.03;

export interface ForcesState {
  leftN: number;
  rightN: number;
  frictionN: number;
  massKg: number;
  running: boolean;
}

export interface ForcesDerived {
  appliedN: number;
  frictionSignedN: number;
  resultantN: number;
  acceleration: number;
  newton: "first" | "second";
  heldAtRest: boolean;
  formulaLine: string;
}

export interface ForcesPreset {
  name: string;
  description: string;
  leftN: number;
  rightN: number;
  frictionN: number;
  massKg: number;
  velocity: number;
  position: number;
}

export interface GuidedMotionTask {
  id: number;
  title: string;
  prompt: string;
  /** Short status shown in badge while the task is active */
  targetHint: string;
  /** Clicking 'Setup Task' applies these starting conditions */
  setup: Partial<ForcesState> & { velocity?: number; position?: number };
}

export const MOTION_TASKS: GuidedMotionTask[] = [
  {
    id: 1,
    title: "Newton 1 — coast",
    prompt:
      "Press \"Setup Task\", then \"Nudge +2 m/s\" to start moving, then \"Run\". Both forces are equal and friction is 0. The trolley keeps a steady speed — balanced forces do NOT mean stopped.",
    targetHint: "Goal: F_res = 0 while trolley moves at constant velocity",
    setup: { leftN: 5, rightN: 5, frictionN: 0, massKg: 2, velocity: 0, position: 2 },
  },
  {
    id: 2,
    title: "Newton 2 — slope",
    prompt:
      "Press \"Setup Task\", then \"Run\". Right force > left force means unbalanced. Watch the v–t graph: the slope (gradient) equals acceleration. Check: a = F_res / m.",
    targetHint: "Goal: unbalanced F_res, straight slope on v–t graph",
    setup: { leftN: 4, rightN: 10, frictionN: 0, massKg: 2, velocity: 0, position: 1 },
  },
  {
    id: 3,
    title: "Mass halves a",
    prompt:
      "Press \"Setup Task\" (sets m = 2.0 kg, F_res = 6 N). Note the acceleration readout. Now drag mass to 4.0 kg — keeping F_res the same. Acceleration should halve. Check a = F/m.",
    targetHint: "Goal: same F_res, mass doubled to ≥ 3.9 kg",
    setup: { leftN: 4, rightN: 10, frictionN: 0, massKg: 2, velocity: 0, position: 1 },
  },
  {
    id: 4,
    title: "Friction opposes",
    prompt:
      "Press \"Setup Task\", then \"Run\". The trolley starts moving with no applied horizontal force. Friction opposes its motion and brings it to rest. Compare the velocity–time and position–time graphs.",
    targetHint: "Goal: observe motion, deceleration and then rest",
    setup: { leftN: 0, rightN: 0, frictionN: 3, massKg: 2, velocity: 2, position: 3 },
  },
];

export const FORCES_PRESETS: ForcesPreset[] = [
  {
    name: "Balanced (rest)",
    description: "Equal forces, at rest — F_res = 0, a = 0",
    leftN: 6,
    rightN: 6,
    frictionN: 0,
    massKg: 2,
    velocity: 0,
    position: 2,
  },
  {
    name: "Coasting",
    description: "F_res = 0 but already moving — Newton 1",
    leftN: 5,
    rightN: 5,
    frictionN: 0,
    massKg: 2,
    velocity: 2.5,
    position: 2,
  },
  {
    name: "Unbalanced",
    description: "6 N resultant, 2.0 kg → a = 3.0 m/s²",
    leftN: 4,
    rightN: 10,
    frictionN: 0,
    massKg: 2,
    velocity: 0,
    position: 1,
  },
  {
    name: "Heavy trolley",
    description: "Same 6 N on 4.0 kg → a = 1.5 m/s²",
    leftN: 4,
    rightN: 10,
    frictionN: 0,
    massKg: 4,
    velocity: 0,
    position: 1,
  },
  {
    name: "With friction",
    description: "8 N pull against 3 N friction, 2.0 kg → a = 2.5 m/s²",
    leftN: 0,
    rightN: 8,
    frictionN: 3,
    massKg: 2,
    velocity: 0,
    position: 1,
  },
];

export function getInitialForcesState(): ForcesState {
  return { leftN: 4, rightN: 10, frictionN: 0, massKg: 2, running: false };
}

/**
 * Build a pedagogically correct formula string.
 *
 * The identity is always:  F_res = F_right − F_left + F_friction_signed
 *
 * frictionSignedN is already a signed quantity:
 *   negative → opposes rightward motion (subtracts from resultant)
 *   positive → opposes leftward motion  (adds to resultant)
 *
 * Showing the algebraic sign means the displayed arithmetic always checks out:
 *   Moving right, f = −3 N:  F_res = 8.0 − 0.0 − 3.0 = 5.0 N  ✓
 *   Moving left,  f = +2 N:  F_res = 0.0 − 6.0 + 2.0 = −4.0 N ✓
 *   Held at rest, f = −6 N:  F_res = 6.0 − 6.0 + 0.0 = 0.0 N  ✓
 */
function buildFormulaLine(
  rightN: number,
  leftN: number,
  frictionSignedN: number,
  resultantN: number,
  heldAtRest = false,
): string {
  const fStr = (n: number) => (Math.abs(n) < 0.001 ? "0" : n.toFixed(1));
  let formula = `F_res = ${fStr(rightN)} − ${fStr(leftN)}`;
  if (Math.abs(frictionSignedN) > 0.001) {
    const fricOp = frictionSignedN > 0 ? "+" : "−";
    const fricAbs = Math.abs(frictionSignedN);
    formula += ` ${fricOp} ${fStr(fricAbs)}`;
  }
  formula += ` = ${fStr(resultantN)} N`;
  if (heldAtRest) {
    formula += " (held at rest)";
  }
  return formula;
}

export function computeForces(state: ForcesState, velocity: number): ForcesDerived {
  const appliedN = state.rightN - state.leftN;
  const atRest = Math.abs(velocity) < REST_SPEED;
  let frictionSignedN = 0;
  let heldAtRest = false;

  if (atRest) {
    if (Math.abs(appliedN) <= state.frictionN + 1e-9) {
      // Static friction exactly cancels applied force — object held at rest
      frictionSignedN = -appliedN;
      heldAtRest = state.frictionN > 0 && Math.abs(appliedN) > 1e-9;
    } else {
      // Applied force overcomes static friction — kinetic friction at onset
      frictionSignedN = -Math.sign(appliedN || 1) * state.frictionN;
    }
  } else {
    // Kinetic friction always opposes direction of motion
    frictionSignedN = -Math.sign(velocity) * state.frictionN;
  }

  const resultantN = appliedN + frictionSignedN;
  const acceleration =
    heldAtRest || (atRest && Math.abs(resultantN) < 1e-9)
      ? 0
      : state.massKg > 0
        ? resultantN / state.massKg
        : 0;
  const newton = Math.abs(resultantN) < 0.05 ? "first" : "second";

  return {
    appliedN,
    frictionSignedN,
    resultantN,
    acceleration,
    newton,
    heldAtRest,
    formulaLine: buildFormulaLine(state.rightN, state.leftN, frictionSignedN, resultantN, heldAtRest),
  };
}

export function stepMotion(
  position: number,
  velocity: number,
  acceleration: number,
  dt: number,
  frictionN = 0,
  appliedN = 0,
  massKg = 1,
): { position: number; velocity: number; hitEnd: "min" | "max" | null } {
  const canRemainAtRest = frictionN >= Math.abs(appliedN) - 1e-9;
  let v = velocity;
  let s = position;

  // Static friction holds the trolley when it is already at rest and can
  // balance the applied force. Otherwise integrate the constant net force.
  if (Math.abs(velocity) < REST_SPEED && canRemainAtRest && Math.abs(acceleration) < 1e-9) {
    v = 0;
  } else if (Math.abs(acceleration) > 1e-9 && velocity !== 0 && velocity * (velocity + acceleration * dt) <= 0) {
    // Integrate to the exact stop, then use the remaining time only if the
    // applied force overcomes static friction and accelerates the trolley back.
    const tStop = Math.min(dt, Math.abs(velocity / acceleration));
    s += velocity * tStop + 0.5 * acceleration * tStop * tStop;
    v = velocity + acceleration * tStop;
    if (canRemainAtRest) {
      v = 0;
    } else {
      const remaining = dt - tStop;
      const aAfterStop = (appliedN - Math.sign(appliedN || 1) * frictionN) / Math.max(massKg, 1e-9);
      s += 0.5 * aAfterStop * remaining * remaining;
      v = aAfterStop * remaining;
    }
  } else {
    s += velocity * dt + 0.5 * acceleration * dt * dt;
    v = velocity + acceleration * dt;
  }

  let hitEnd: "min" | "max" | null = null;
  if (s <= TRACK_MIN_M) {
    s = TRACK_MIN_M;
    v = 0;
    hitEnd = "min";
  } else if (s >= TRACK_MAX_M) {
    s = TRACK_MAX_M;
    v = 0;
    hitEnd = "max";
  }
  if (Math.abs(v) < REST_SPEED && canRemainAtRest) v = 0;
  return { position: s, velocity: v, hitEnd };
}

export function evaluateMotionTasks(args: {
  resultantN: number;
  acceleration: number;
  velocity: number;
  massKg: number;
  frictionN: number;
  appliedN?: number;
  running: boolean;
  timeS: number;
  observedMotion?: boolean;
  task3Baseline?: { massKg: number; resultantN: number };
}): Record<number, boolean> {
  const coasting =
    args.running && Math.abs(args.resultantN) < 0.08 && Math.abs(args.velocity) > 0.4;
  const sloping =
    args.running && Math.abs(args.acceleration) > 0.4 && args.timeS > 0.6 && args.frictionN < 0.05;
  // Task 3: mass at least doubled AND resultant unchanged within 5 % of baseline
  // If baseline mass > 2.5 kg, normalize to 2.0 kg so doubling targets <= 4.0 kg
  // (well within the 5.0 kg slider max — avoids dead-end trap)
  const baseMass =
    args.task3Baseline && args.task3Baseline.massKg > 0
      ? args.task3Baseline.massKg > 2.5
        ? 2.0
        : args.task3Baseline.massKg
      : 2.0;
  const targetResultant =
    args.task3Baseline !== undefined
      ? args.task3Baseline.resultantN
      : 6.0;
  const heavy =
    args.task3Baseline !== undefined &&
    args.massKg >= baseMass * 1.95 &&
    Math.abs(args.resultantN - targetResultant) <=
      Math.max(0.05, Math.abs(targetResultant) * 0.05);
  const withFriction =
    args.timeS > 0.5 &&
    args.frictionN >= 1.5 &&
    args.frictionN > Math.abs(args.appliedN ?? 0) &&
    args.observedMotion === true &&
    Math.abs(args.velocity) < 0.08;
  return { 1: coasting, 2: sloping, 3: heavy, 4: withFriction };
}

export function generateForcesExamQuestions(seed = 1): ExamQuestion[] {
  const rightForce = seededPick(seed, "forces-f1-right", [9, 10, 11, 12]);
  const leftForce = seededPick(seed, "forces-f1-left", [3, 4, 5]);
  const resultant = rightForce - leftForce;
  const rightText = rightForce.toFixed(1);
  const leftText = leftForce.toFixed(1);
  const resultantText = resultant.toFixed(1);
  const velocityChange = seededPick(seed, "forces-f4-dv", [5, 6, 8]);
  const velocityTime = seededPick(seed, "forces-f4-time", [2, 2.5, 4]);
  const graphAcceleration = velocityChange / velocityTime;
  const constantSpeed = seededPick(seed, "forces-f5-speed", [3, 4, 5]);
  const travelTime = seededPick(seed, "forces-f5-time", [2, 3, 4]);
  const displacement = constantSpeed * travelTime;
  const pull = seededPick(seed, "forces-f6-pull", [7, 8, 9]);
  const friction = seededPick(seed, "forces-f6-friction", [2, 3, 4]);
  const trolleyMass = seededPick(seed, "forces-f6-mass", [1.5, 2, 2.5]);
  const frictionAcceleration = (pull - friction) / trolleyMass;
  return [
    {
      id: "f1",
      number: 1,
      marks: 2,
      paperRef: "0625/41 · Resultant force",
      prompt: `A trolley is pulled ${rightText} N to the right and ${leftText} N to the left. Calculate the resultant force.`,
      contextLines: [`F_right = ${rightText} N`, `F_left = ${leftText} N`],
      kind: "numeric",
      expected: resultant,
      unit: "N",
      tolerancePct: 2,
      working: {
        equation: "F_res = F_right − F_left",
        substitution: `${rightText} − ${leftText} = ${resultantText}`,
        answer: `${resultant.toFixed(2)} N (to the right)`,
      },
      misconception: "Do not add the forces. Resultant is the vector difference.",
    },
    {
      id: "f2",
      number: 2,
      marks: 2,
      paperRef: "0625/41 · Newton’s 2nd law",
      prompt: `The trolley in Q1 has mass 2.0 kg. Calculate its acceleration.`,
      contextLines: [`F_res = ${resultantText} N`, "m = 2.0 kg"],
      kind: "numeric",
      expected: resultant / 2,
      unit: "m/s²",
      tolerancePct: 2,
      working: {
        equation: "a = F / m",
        substitution: `${resultantText} / 2.0 = ${(resultant / 2).toFixed(1)}`,
        answer: `${(resultant / 2).toFixed(2)} m/s²`,
      },
      misconception: "Use the resultant force, not one of the applied forces.",
    },
    {
      id: "f3",
      number: 3,
      marks: 1,
      paperRef: "0625/41 · Newton’s 1st law",
      prompt:
        "The two forces on a trolley are equal and opposite. The trolley is already moving. It will…",
      kind: "choice",
      options: [
        "Come to rest because the forces are balanced",
        "Continue at constant velocity",
        "Accelerate in the direction of motion",
        "Change direction",
      ],
      correctIndex: 1,
      working: {
        equation: "F_res = 0 ⇒ a = 0",
        substitution: "Velocity does not change",
        answer: "continue at constant velocity",
      },
      misconception: "Zero resultant force does not mean the object must be at rest.",
    },
    {
      id: "f4",
      number: 4,
      marks: 2,
      paperRef: "0625/41 · v–t graph",
      prompt: `A v–t graph is a straight line from 0 to ${velocityChange.toFixed(1)} m/s in ${velocityTime.toFixed(1)} s. Calculate the acceleration.`,
      contextLines: [`Δv = ${velocityChange.toFixed(1)} m/s`, `Δt = ${velocityTime.toFixed(1)} s`],
      kind: "numeric",
      expected: graphAcceleration,
      unit: "m/s²",
      tolerancePct: 2,
      working: {
        equation: "a = gradient = Δv / Δt",
        substitution: `${velocityChange.toFixed(1)} / ${velocityTime.toFixed(1)} = ${graphAcceleration.toFixed(2)}`,
        answer: `${graphAcceleration.toFixed(2)} m/s²`,
      },
      misconception: "Gradient of a v–t graph is acceleration, not speed.",
    },
    {
      id: "f5",
      number: 5,
      marks: 2,
      paperRef: "0625/41 · Area under v–t",
      prompt: `A trolley travels at a constant ${constantSpeed.toFixed(1)} m/s for ${travelTime.toFixed(1)} s. Calculate the displacement from the area under the v–t graph.`,
      kind: "numeric",
      expected: displacement,
      unit: "m",
      tolerancePct: 2,
      working: {
        equation: "displacement = area under v–t = v × t",
        substitution: `${constantSpeed.toFixed(1)} × ${travelTime.toFixed(1)} = ${displacement.toFixed(1)}`,
        answer: `${displacement.toFixed(1)} m`,
      },
      misconception: "Area under v–t is displacement, not the gradient.",
    },
    {
      id: "f6",
      number: 6,
      marks: 2,
      paperRef: "0625/41 · Friction",
      prompt: `A ${trolleyMass.toFixed(1)} kg trolley is pulled by ${pull.toFixed(1)} N. Friction is ${friction.toFixed(1)} N. Calculate the acceleration.`,
      contextLines: [`F_pull = ${pull.toFixed(1)} N`, `F_friction = ${friction.toFixed(1)} N`, `m = ${trolleyMass.toFixed(1)} kg`],
      kind: "numeric",
      expected: frictionAcceleration,
      unit: "m/s²",
      tolerancePct: 2,
      working: {
        equation: `F_res = ${pull.toFixed(1)} − ${friction.toFixed(1)} ; a = F_res / m`,
        substitution: `${(pull - friction).toFixed(1)} / ${trolleyMass.toFixed(1)} = ${frictionAcceleration.toFixed(2)}`,
        answer: `${frictionAcceleration.toFixed(2)} m/s²`,
      },
      misconception: "Friction opposes motion, so subtract it from the pull before using F = ma.",
    },
  ];
}
