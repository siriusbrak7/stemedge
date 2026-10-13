import type { ExamQuestion } from "@/components/ExamPlayer";

export interface RefractionState {
  n2: number;
  incidenceDeg: number;
  denserToRarer: boolean;
  material: "water" | "glass" | "diamond" | "custom";
}

export const REFRACTION_PRESETS = [
  { name: "Water", n: 1.33, material: "water" as const },
  { name: "Glass", n: 1.5, material: "glass" as const },
  { name: "Diamond", n: 2.42, material: "diamond" as const },
];

export const REFRACTION_TASKS = [
  { id: 1, title: "Towards the normal", prompt: "Set Air → glass. Use an incidence angle above 0°. The ray should bend towards the normal." },
  { id: 2, title: "Away from the normal", prompt: "Set Glass → air below the critical angle. The ray should bend away from the normal." },
  { id: 3, title: "Total internal reflection", prompt: "Set Glass → air and increase the incidence angle above the critical angle." },
];

export function getInitialRefractionState(): RefractionState {
  return { n2: 1.5, incidenceDeg: 35, denserToRarer: false, material: "glass" };
}

export function computeRefraction(s: RefractionState) {
  const nAir = 1.0;
  const nFrom = s.denserToRarer ? s.n2 : nAir;
  const nTo = s.denserToRarer ? nAir : s.n2;
  const i = (s.incidenceDeg * Math.PI) / 180;
  const critical = nFrom > nTo ? (Math.asin(nTo / nFrom) * 180) / Math.PI : null;
  const product = nFrom * Math.sin(i);
  const tir = critical !== null && s.incidenceDeg > critical + 1e-6;
  let rDeg: number | null = null;
  if (!tir) {
    const arg = product / nTo;
    if (arg <= 1) rDeg = (Math.asin(arg) * 180) / Math.PI;
  }
  const sinR = rDeg === null ? null : Math.sin((rDeg * Math.PI) / 180);
  return {
    nFrom,
    nTo,
    critical,
    tir,
    rDeg,
    sinI: Math.sin(i),
    sinR,
    observedRatio: sinR === null || sinR === 0 ? null : Math.sin(i) / sinR,
    n: s.n2,
  };
}

export function evaluateRefractionTasks(
  state: RefractionState,
  result: ReturnType<typeof computeRefraction>,
): Record<number, boolean> {
  const refracted = result.rDeg !== null;
  return {
    1: !state.denserToRarer && refracted && result.rDeg! < state.incidenceDeg - 0.5,
    2: state.denserToRarer && refracted && result.rDeg! > state.incidenceDeg + 0.5,
    3: state.denserToRarer && result.tir,
  };
}

export function generateRefractionExamQuestions(): ExamQuestion[] {
  return [
    {
      id: "r1",
      number: 1,
      marks: 2,
      paperRef: "0625/43 · Snell’s law",
      prompt: "A ray in air (n = 1.00) hits glass at 40° and refracts at 25°. Calculate n of the glass.",
      kind: "numeric",
      expected: 1.52,
      unit: "",
      tolerancePct: 2.5,
      working: {
        equation: "n = sin i / sin r",
        substitution: "sin 40° / sin 25° = 1.52",
        answer: "1.52",
      },
      misconception: "Do not divide the angles. Use sines.",
    },
    {
      id: "r2",
      number: 2,
      marks: 2,
      paperRef: "0625/43 · Critical angle",
      prompt: "Glass of n = 1.50 meets air. Calculate the critical angle.",
      kind: "numeric",
      expected: 41.8,
      unit: "°",
      tolerancePct: 2,
      working: {
        equation: "sin c = 1 / n",
        substitution: "c = sin⁻¹(1/1.50) = 41.8°",
        answer: "41.8°",
      },
    },
    {
      id: "r3",
      number: 3,
      marks: 1,
      paperRef: "0625/43",
      prompt: "TIR can only happen when light is travelling from…",
      kind: "choice",
      options: [
        "From an optically denser medium into a rarer medium",
        "From a rarer medium into a denser medium",
        "Between media with equal refractive index",
        "Only when travelling along the normal",
      ],
      correctIndex: 0,
      working: {
        equation: "n1 > n2 and i > c",
        substitution: "Towards the normal is the opposite case",
        answer: "optically denser to rarer (e.g. glass → air)",
      },
    },
    {
      id: "r4",
      number: 4,
      marks: 2,
      paperRef: "0625/43",
      prompt: "Light in water (n = 1.33) is incident at 30° on a water–air surface. Calculate the angle of refraction in air.",
      kind: "numeric",
      expected: 41.7,
      unit: "°",
      tolerancePct: 3,
      working: {
        equation: "n1 sin i = n2 sin r",
        substitution: "1.33 sin 30° = 1.00 sin r → r = 41.7°",
        answer: "41.7°",
      },
    },
  ];
}
