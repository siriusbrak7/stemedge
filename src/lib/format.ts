/** Cambridge IGCSE 3 significant figures, SI units, g = 9.8 N/kg. */

export const G_N_PER_KG = 9.8;

export function format3SF(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0.00";
  const abs = Math.abs(value);
  if (abs < 1e-3 || abs > 1e5) {
    const [mantissa, exponent] = value.toExponential(2).split("e");
    const superscript = String(Number(exponent))
      .replaceAll("-", "⁻")
      .replaceAll("0", "⁰")
      .replaceAll("1", "¹")
      .replaceAll("2", "²")
      .replaceAll("3", "³")
      .replaceAll("4", "⁴")
      .replaceAll("5", "⁵")
      .replaceAll("6", "⁶")
      .replaceAll("7", "⁷")
      .replaceAll("8", "⁸")
      .replaceAll("9", "⁹");
    return `${mantissa} × 10${superscript}`;
  }
  const exp = Math.floor(Math.log10(abs));
  const decimals = Math.max(0, 2 - exp);
  return Number(value.toPrecision(3)).toFixed(decimals);
}

export function isWithinTolerance(
  student: number,
  expected: number,
  tolerancePct: number,
): boolean {
  if (!Number.isFinite(student) || !Number.isFinite(expected)) return false;
  const tol = Math.max(Math.abs(expected) * (tolerancePct / 100), 1e-9);
  return Math.abs(student - expected) <= tol;
}

export function parseStudentNumber(raw: string): number | null {
  return parseStudentAnswer(raw).value;
}

export function parseStudentAnswer(raw: string): { value: number | null; unit: string } {
  const superscripts: Record<string, string> = {
    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9",
    "⁻": "-",
    "⁺": "+",
  };
  const cleaned = raw
    .trim()
    .replace(/,/g, "")
    .replaceAll("×", "x")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, (character) => superscripts[character] ?? character);
  const match = cleaned.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*(?:[eE]([+-]?\d+)|[xX]\s*10\s*\^?\s*([+-]?\d+)))?\s*(.*)$/,
  );
  if (!match) return { value: null, unit: "" };
  const mantissa = Number(match[1]);
  const exponent = Number(match[2] ?? match[3] ?? 0);
  const value = mantissa * 10 ** exponent;
  return {
    value: Number.isFinite(value) ? value : null,
    unit: match[4].trim(),
  };
}
