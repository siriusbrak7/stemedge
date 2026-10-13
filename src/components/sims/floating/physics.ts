import type { ExamQuestion } from "@/components/ExamPlayer";
import { G_N_PER_KG } from "@/lib/format";

export interface FloatingState {
  objectDensity: number;
  liquidDensity: number;
  volumeM3: number;
}

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
  return { weight, upthrust, fraction, displaced, floats, sinks, suspends };
}

export function generateFloatingExamQuestions(): ExamQuestion[] {
  return [
    {
      id: "fl1",
      number: 1,
      marks: 2,
      paperRef: "0625/41 · Density",
      prompt: "A block has mass 0.24 kg and volume 2.0 × 10⁻⁴ m³. Calculate its density.",
      kind: "numeric",
      expected: 1200,
      unit: "kg/m³",
      tolerancePct: 2,
      working: {
        equation: "ρ = m / V",
        substitution: "0.24 / 2.0×10⁻⁴ = 1200",
        answer: "1200 kg/m³",
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
