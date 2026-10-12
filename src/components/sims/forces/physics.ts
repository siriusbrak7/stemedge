import type { ExamQuestion } from "@/components/ExamPlayer";

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
}

export const MOTION_TASKS: GuidedMotionTask[] = [
  {
    id: 1,
    title: "Newton 1 — coast",
    prompt:
      "Tap Nudge, then match the two forces (and set friction to 0). The trolley should keep a steady velocity. Balanced forces do not mean ‘stopped’.",
  },
  {
    id: 2,
    title: "Newton 2 — slope",
    prompt:
      "Make the right force larger than the left. The v–t graph should be a straight slope. Gradient of v–t equals acceleration.",
  },
  {
    id: 3,
    title: "Mass halves a",
    prompt:
      "Keep the same resultant force and double the mass. Acceleration should drop to half. Check a = F / m on the readouts.",
  },
  {
    id: 4,
    title: "Friction opposes",
    prompt:
      "Add friction. It always acts against the motion (or cancels a small pull when the trolley is at rest). Resultant = applied − friction.",
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

export function computeForces(state: ForcesState, velocity: number): ForcesDerived {
  const appliedN = state.rightN - state.leftN;
  const atRest = Math.abs(velocity) < REST_SPEED;
  let frictionSignedN = 0;
  let heldAtRest = false;

  if (atRest) {
    if (Math.abs(appliedN) <= state.frictionN + 1e-9) {
      frictionSignedN = -appliedN;
      heldAtRest = state.frictionN > 0 && Math.abs(appliedN) > 1e-9;
    } else {
      frictionSignedN = -Math.sign(appliedN || 1) * state.frictionN;
    }
  } else {
    frictionSignedN = -Math.sign(velocity) * state.frictionN;
  }

  const resultantN = appliedN + frictionSignedN;
  const acceleration = heldAtRest || (atRest && Math.abs(resultantN) < 1e-9)
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
    formulaLine: `F_res = (${formatForce(state.rightN)}) − (${formatForce(state.leftN)}) − (${formatForce(Math.abs(frictionSignedN))}) = ${formatForce(resultantN)} N`,
  };
}

function formatForce(n: number): string {
  return Math.abs(n) < 0.001 ? "0" : n.toFixed(1);
}

export function stepMotion(
  position: number,
  velocity: number,
  acceleration: number,
  dt: number,
): { position: number; velocity: number; hitEnd: "min" | "max" | null } {
  let v = velocity + acceleration * dt;
  let s = position + v * dt;
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
  if (Math.abs(v) < REST_SPEED && Math.abs(acceleration) < 1e-6) v = 0;
  return { position: s, velocity: v, hitEnd };
}

export function evaluateMotionTasks(args: {
  resultantN: number;
  acceleration: number;
  velocity: number;
  massKg: number;
  frictionN: number;
  running: boolean;
  timeS: number;
}): Record<number, boolean> {
  const coasting =
    args.running && Math.abs(args.resultantN) < 0.08 && Math.abs(args.velocity) > 0.4;
  const sloping =
    args.running && Math.abs(args.acceleration) > 0.4 && args.timeS > 0.6 && args.frictionN < 0.05;
  const heavy = args.massKg >= 3.9 && Math.abs(args.resultantN) > 0.5;
  const withFriction = args.frictionN >= 1.5 && Math.abs(args.resultantN) > 0.2;
  return { 1: coasting, 2: sloping, 3: heavy, 4: withFriction };
}

export function generateForcesExamQuestions(): ExamQuestion[] {
  return [
    {
      id: "f1",
      number: 1,
      marks: 2,
      paperRef: "0625/41 · Resultant force",
      prompt:
        "A trolley is pulled 10 N to the right and 4.0 N to the left. Calculate the resultant force.",
      contextLines: ["F_right = 10 N", "F_left = 4.0 N"],
      kind: "numeric",
      expected: 6,
      unit: "N",
      tolerancePct: 2,
      working: {
        equation: "F_res = F_right − F_left",
        substitution: "10 − 4.0 = 6.0",
        answer: "6.00 N (to the right)",
      },
      misconception: "Do not add the forces. Resultant is the vector difference.",
    },
    {
      id: "f2",
      number: 2,
      marks: 2,
      paperRef: "0625/41 · Newton’s 2nd law",
      prompt: "The trolley in Q1 has mass 2.0 kg. Calculate its acceleration.",
      contextLines: ["F_res = 6.0 N", "m = 2.0 kg"],
      kind: "numeric",
      expected: 3,
      unit: "m/s²",
      tolerancePct: 2,
      working: {
        equation: "a = F / m",
        substitution: "6.0 / 2.0 = 3.0",
        answer: "3.00 m/s²",
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
      kind: "text",
      expected: 0,
      unit: "",
      acceptedText: [
        "constant speed",
        "constant velocity",
        "steady speed",
        "uniform velocity",
        "keep moving",
        "continue at constant",
      ],
      tolerancePct: 0,
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
      prompt:
        "A v–t graph is a straight line from 0 to 6.0 m/s in 2.0 s. Calculate the acceleration.",
      contextLines: ["Δv = 6.0 m/s", "Δt = 2.0 s"],
      kind: "numeric",
      expected: 3,
      unit: "m/s²",
      tolerancePct: 2,
      working: {
        equation: "a = gradient = Δv / Δt",
        substitution: "6.0 / 2.0 = 3.0",
        answer: "3.00 m/s²",
      },
      misconception: "Gradient of a v–t graph is acceleration, not speed.",
    },
    {
      id: "f5",
      number: 5,
      marks: 2,
      paperRef: "0625/41 · Area under v–t",
      prompt:
        "A trolley travels at a constant 4.0 m/s for 3.0 s. Calculate the displacement from the area under the v–t graph.",
      kind: "numeric",
      expected: 12,
      unit: "m",
      tolerancePct: 2,
      working: {
        equation: "displacement = area under v–t = v × t",
        substitution: "4.0 × 3.0 = 12",
        answer: "12.0 m",
      },
      misconception: "Area under v–t is displacement, not the gradient.",
    },
    {
      id: "f6",
      number: 6,
      marks: 2,
      paperRef: "0625/41 · Friction",
      prompt:
        "A 2.0 kg trolley is pulled by 8.0 N. Friction is 3.0 N. Calculate the acceleration.",
      contextLines: ["F_pull = 8.0 N", "F_friction = 3.0 N", "m = 2.0 kg"],
      kind: "numeric",
      expected: 2.5,
      unit: "m/s²",
      tolerancePct: 2,
      working: {
        equation: "F_res = 8.0 − 3.0 ; a = F_res / m",
        substitution: "5.0 / 2.0 = 2.5",
        answer: "2.50 m/s²",
      },
      misconception: "Friction opposes motion, so subtract it from the pull before using F = ma.",
    },
  ];
}
