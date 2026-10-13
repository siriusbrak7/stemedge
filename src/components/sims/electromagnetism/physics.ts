import type { ExamQuestion } from "@/components/ExamPlayer";
import { format3SF } from "../../../lib/format.ts";
import { seededPick } from "../../../lib/seeded-choice.ts";

export type EmSubMode = "motor" | "field" | "fleming";

export interface ElectromagnetismState {
  currentA: number;
  currentDirection: "forward" | "reverse";
  bFieldT: number;
  lengthM: number;
  /** +1 = into the page (×), −1 = out of the page (·) */
  bIntoPage: boolean;
  subMode: EmSubMode;
}

export interface CalculatedElectromagnetism {
  forceN: number;
  forceMagnitudeN: number;
  directionSign: number;
  directionLabel: string;
  currentOutOfPage: boolean;
  formulaLine: string;
}

export interface ElectromagnetismPreset {
  name: string;
  description: string;
  currentA: number;
  currentDirection: "forward" | "reverse";
  bFieldT: number;
  lengthM: number;
}

export const ELECTROMAGNETISM_PRESETS: ElectromagnetismPreset[] = [
  {
    name: "Lab wire",
    description: "Typical school bench: 2.0 A in 0.05 T over 0.50 m",
    currentA: 2,
    currentDirection: "forward",
    bFieldT: 0.05,
    lengthM: 0.5,
  },
  {
    name: "Strong magnet",
    description: "0.20 T field, modest current",
    currentA: 3,
    currentDirection: "forward",
    bFieldT: 0.2,
    lengthM: 0.4,
  },
  {
    name: "Reverse I",
    description: "Reverse conventional current — force flips",
    currentA: 4,
    currentDirection: "reverse",
    bFieldT: 0.1,
    lengthM: 0.8,
  },
  {
    name: "Zero current",
    description: "No I → no force",
    currentA: 0,
    currentDirection: "forward",
    bFieldT: 0.1,
    lengthM: 1,
  },
];

export function getInitialElectromagnetismState(): ElectromagnetismState {
  return {
    currentA: 4,
    currentDirection: "forward",
    bFieldT: 0.1,
    lengthM: 0.5,
    bIntoPage: true,
    subMode: "motor",
  };
}

export function computeElectromagnetism(state: ElectromagnetismState): CalculatedElectromagnetism {
  const bSign = state.bIntoPage ? 1 : -1;
  const currentSign = state.currentDirection === "forward" ? 1 : -1;
  const currentN = Math.max(0, state.currentA);
  const forceN = state.bFieldT * currentN * state.lengthM * bSign * currentSign;
  const forceMagnitudeN = Math.abs(forceN);
  const directionSign = Math.abs(forceN) < 1e-6 ? 0 : forceN > 0 ? 1 : -1;
  const directionLabel =
    directionSign === 0 ? "No force" : directionSign > 0 ? "Upwards" : "Downwards";
  const currentOutOfPage = state.currentDirection === "forward";
  const formulaLine = `F = BIL = ${format3SF(state.bFieldT)} × ${format3SF(currentN)} × ${format3SF(state.lengthM)} = ${format3SF(forceN)} N`;
  return {
    forceN,
    forceMagnitudeN,
    directionSign,
    directionLabel,
    currentOutOfPage,
    formulaLine,
  };
}

export const ELECTROMAGNETISM_TASKS = [
  { id: 1, title: "Motor effect", prompt: "Set a non-zero current and magnetic field. Confirm the wire experiences a force." },
  { id: 2, title: "Reverse current", prompt: "Reverse conventional current. The force should reverse while its magnitude stays the same." },
  { id: 3, title: "Reverse the field", prompt: "Reverse the magnetic field. The force should reverse again." },
];

export function evaluateElectromagnetismTasks(
  state: ElectromagnetismState,
  result: CalculatedElectromagnetism,
): Record<number, boolean> {
  return {
    1: state.currentA > 0 && state.bFieldT > 0 && result.forceMagnitudeN > 0,
    2: state.currentDirection === "reverse" && result.forceMagnitudeN > 0,
    3: !state.bIntoPage && result.forceMagnitudeN > 0,
  };
}

export function generateElectromagnetismExamQuestions(seed = 1): ExamQuestion[] {
  const bFieldT = seededPick(seed, "em-e1-field", [0.15, 0.2, 0.25]);
  const currentA = seededPick(seed, "em-e1-current", [3, 4, 5]);
  const lengthM = seededPick(seed, "em-e1-length", [0.4, 0.5, 0.6]);
  const forceN = bFieldT * currentA * lengthM;
  return [
    {
      id: "e1",
      number: 1,
      marks: 2,
      paperRef: "0625/42 · Motor effect",
      prompt: `A wire of length ${lengthM.toFixed(2)} m carries a current of ${currentA.toFixed(1)} A in a magnetic field of flux density ${bFieldT.toFixed(2)} T. The field is perpendicular to the wire. Calculate the force on the wire.`,
      contextLines: [`B = ${bFieldT.toFixed(2)} T`, `I = ${currentA.toFixed(1)} A`, `L = ${lengthM.toFixed(2)} m`],
      kind: "numeric",
      expected: forceN,
      unit: "N",
      tolerancePct: 2,
      working: {
        equation: "F = B I L",
        substitution: `${bFieldT.toFixed(2)} × ${currentA.toFixed(1)} × ${lengthM.toFixed(2)} = ${forceN.toFixed(3)}`,
        answer: `${forceN.toFixed(3)} N`,
      },
      misconception: "Do not forget L is the length in the field, in metres not centimetres.",
    },
    {
      id: "e2",
      number: 2,
      marks: 2,
      paperRef: "0625/42 · Rearrange F = BIL",
      prompt: "The force on a 0.80 m wire carrying 5.0 A is 0.20 N. Calculate B.",
      kind: "numeric",
      expected: 0.05,
      unit: "T",
      tolerancePct: 2,
      working: {
        equation: "B = F / (I L)",
        substitution: "0.20 / (5.0 × 0.80) = 0.050",
        answer: "0.0500 T",
      },
    },
    {
      id: "e3",
      number: 3,
      marks: 1,
      paperRef: "0625/42 · Fleming",
      prompt:
        "B is into the page and conventional current is to the right. Using Fleming’s left-hand rule, the force on the wire is…",
      kind: "choice",
      options: ["Up", "Down", "Into the page", "Out of the page"],
      correctIndex: 0,
      working: {
        equation: "First finger B, second finger I, thumb F",
        substitution: "B into page, I right → thumb up",
        answer: "upwards",
      },
      misconception: "Left hand for the motor effect. The right hand is the generator (dynamo) rule.",
    },
    {
      id: "e4",
      number: 4,
      marks: 1,
      paperRef: "0625/42",
      prompt: "If the current in Q3 is reversed, the force is…",
      kind: "choice",
      options: ["Up", "Down", "Into the page", "Out of the page"],
      correctIndex: 1,
      working: {
        equation: "Reverse I → reverse F",
        substitution: "Thumb now points down",
        answer: "downwards",
      },
    },
    {
      id: "e5",
      number: 5,
      marks: 2,
      paperRef: "0625/42 · Field around a wire",
      prompt:
        "Looking at a wire so that conventional current comes out of the page, the magnetic field circles are…",
      kind: "choice",
      options: ["Anticlockwise", "Clockwise", "Straight radial lines", "There is no magnetic field"],
      correctIndex: 0,
      working: {
        equation: "Right-hand grip rule",
        substitution: "Thumb out of page → fingers curl anticlockwise",
        answer: "anticlockwise",
      },
      misconception: "Do not use Fleming’s left-hand rule for the field around a single wire — that is the grip / corkscrew rule.",
    },
    {
      id: "e6",
      number: 6,
      marks: 2,
      paperRef: "0625/42",
      prompt: "A wire in a 0.10 T field carries no current. The force on the wire is…",
      kind: "numeric",
      expected: 0,
      unit: "N",
      tolerancePct: 1,
      working: {
        equation: "F = BIL",
        substitution: "I = 0 → F = 0",
        answer: "0 N",
      },
    },
  ];
}
