import type { ExamQuestion } from "@/components/ExamPlayer";

export interface RefractionState {
  n2: number;
  incidenceDeg: number;
  denserToRarer: boolean;
}

export function getInitialRefractionState(): RefractionState {
  return { n2: 1.5, incidenceDeg: 35, denserToRarer: false };
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
  return {
    nFrom,
    nTo,
    critical,
    tir,
    rDeg,
    sinI: Math.sin(i),
    n: s.n2,
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
