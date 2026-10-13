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
  const cleaned = raw.trim().replace(/,/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
