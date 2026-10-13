import type { ExamQuestion } from "@/components/ExamPlayer";
import { G_N_PER_KG } from "../../../lib/format.ts";
import { seededPick } from "../../../lib/seeded-choice.ts";

export interface FloatingState {
  objectDensity: number;
  liquidDensity: number;
  volumeM3: number;
}

export const FLOATING_PRESETS = [
  { name: "Wood · water", objectDensity: 700, liquidDensity: 1000 },
  { name: "Ice · water", objectDensity: 917, liquidDensity: 1000 },
  { name: "Steel · water", objectDensity: 7850, liquidDensity: 1000 },
  { name: "Wood · oil", objectDensity: 700, liquidDensity: 850 },
];

export const FLOATING_TASKS = [
  { id: 1, title: "Floating", prompt: "Choose an object less dense than its liquid. Compare its weight with the upthrust." },
  { id: 2, title: "Fraction submerged", prompt: "For a floating object, set the object density to half the liquid density." },
  { id: 3, title: "Suspended", prompt: "Set the object and liquid to the same density so the object is neutrally buoyant." },
  { id: 4, title: "Sinking", prompt: "Choose an object denser than its liquid and identify the normal reaction at the tank bottom." },
];

export function getInitialFloatingState(): FloatingState {
  return { objectDensity: 700, liquidDensity: 1000, volumeM3: 0.002 };
}

export function computeFloating(s: FloatingState) {
  const weight = s.objectDensity * s.volumeM3 * G_N_PER_KG;
  const sinks = s.objectDensity > s.liquidDensity + 1;
  const fraction = sinks ? 1 : Math.min(1, s.objectDensity / s.liquidDensity);
  const displaced = s.volumeM3 * fraction;
  const upthrust = s.liquidDensity * displaced * G_N_PER_KG;
  const floats = s.objectDensity < s.liquidDensity - 1;
  const suspends = !floats && !sinks;
  const normalReaction = sinks ? Math.max(0, weight - upthrust) : 0;
  const netForce = weight - upthrust - normalReaction;
  return { weight, upthrust, fraction, displaced, floats, sinks, suspends, normalReaction, netForce };
}

export function evaluateFloatingTasks(
  state: FloatingState,
  result: ReturnType<typeof computeFloating>,
): Record<number, boolean> {
  return {
    1: result.floats && Math.abs(result.weight - result.upthrust) < 0.05,
    2: result.floats && Math.abs(result.fraction - 0.5) < 0.03,
    3: result.suspends,
    4: result.sinks && result.normalReaction > 0,
  };
}

export function generateFloatingExamQuestions(seed = 1): ExamQuestion[] {
  const massKg = seededPick(seed, "floating-fl1-mass", [0.18, 0.24, 0.3]);
  const volumeM3 = seededPick(seed, "floating-fl1-volume", [0.00015, 0.0002, 0.00025]);
  const density = massKg / volumeM3;
  return [
    {
      id: "fl1",
      number: 1,
      marks: 2,
      paperRef: "0625/41 · Density",
      prompt: `A block has mass ${massKg.toFixed(2)} kg and volume ${volumeM3.toExponential(1)} m³. Calculate its density.`,
      kind: "numeric",
      expected: density,
      unit: "kg/m³",
      tolerancePct: 2,
      working: {
        equation: "ρ = m / V",
        substitution: `${massKg.toFixed(2)} / ${volumeM3.toExponential(1)} = ${density.toFixed(1)}`,
        answer: `${density.toFixed(2)} kg/m³`,
      },
    },
    {
      id: "fl2",
      number: 2,
      marks: 2,
      paperRef: "0625/41 · Archimedes",
      prompt:
        "An object of volume 0.0020 m³ is fully immersed in water (ρ = 1000 kg/m³). Calculate the upthrust. g = 9.8 N/kg.",
      kind: "numeric",
      expected: 19.6,
      unit: "N",
      tolerancePct: 2,
      working: {
        equation: "U = ρ V g",
        substitution: "1000 × 0.0020 × 9.8 = 19.6",
        answer: "19.6 N",
      },
      misconception: "Upthrust equals the weight of the displaced liquid, not the object’s weight.",
    },
    {
      id: "fl3",
      number: 3,
      marks: 2,
      paperRef: "0625/41",
      prompt:
        "A wooden cube of density 700 kg/m³ floats in water (1000 kg/m³). What fraction of its volume is submerged?",
      kind: "numeric",
      expected: 0.7,
      unit: "",
      tolerancePct: 2,
      working: {
        equation: "V_sub / V = ρ_object / ρ_liquid",
        substitution: "700 / 1000 = 0.70",
        answer: "0.700 (70%)",
      },
    },
    {
      id: "fl4",
      number: 4,
      marks: 1,
      paperRef: "0625/41",
      prompt: "An object denser than the liquid will…",
      kind: "choice",
      options: ["Sink", "Float", "Stay suspended", "Rise to the surface"],
      correctIndex: 0,
      working: {
        equation: "W > U_max when ρ_object > ρ_liquid",
        substitution: "Net force downward",
        answer: "sink",
      },
    },
  ];
}
