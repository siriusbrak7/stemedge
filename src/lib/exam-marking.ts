import { isWithinTolerance, parseStudentAnswer } from "./format.ts";

export type TextAnswerGroups = readonly (readonly string[])[];

export type StudentUnitStatus = "not-required" | "omitted" | "correct" | "incorrect";

const NEGATION_WORDS = new Set(["not", "no", "never"]);

function answerTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\b(?:isn't|isnt|won't|wont|doesn't|doesnt)\b/g, "not")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function phraseStart(tokens: string[], phrase: string[]): number {
  if (phrase.length === 0 || phrase.length > tokens.length) return -1;
  for (let start = 0; start <= tokens.length - phrase.length; start += 1) {
    if (phrase.every((word, offset) => tokens[start + offset] === word)) return start;
  }
  return -1;
}

export function markTextAnswer(raw: string, groups: TextAnswerGroups): boolean {
  const tokens = answerTokens(raw);
  if (tokens.length === 0 || groups.length === 0) return false;

  return groups.every((group) =>
    group.some((synonym) => {
      const start = phraseStart(tokens, answerTokens(synonym));
      return start >= 0 && !tokens.slice(0, start).some((word) => NEGATION_WORDS.has(word));
    }),
  );
}

export function isCorrectChoice(selected: string, correctIndex: number): boolean {
  return Number.isInteger(correctIndex) && Number(selected) === correctIndex;
}

function normalizeUnit(unit: string): string {
  return unit
    .toLowerCase()
    .replaceAll("²", "2")
    .replaceAll("³", "3")
    .replaceAll("°", "deg")
    .replaceAll("Ω", "ohm")
    .replace(/[\s·⋅]/g, "");
}

export function studentUnitStatus(raw: string, expectedUnit: string): StudentUnitStatus {
  if (!expectedUnit) return "not-required";
  const supplied = parseStudentAnswer(raw).unit;
  if (!supplied) return "omitted";
  return normalizeUnit(supplied) === normalizeUnit(expectedUnit) ? "correct" : "incorrect";
}

export function numericAnswerMarks(
  raw: string,
  expected: number,
  tolerancePct: number,
  unit: string,
  maxMarks: number,
): number {
  const value = parseStudentAnswer(raw).value;
  if (value === null || !isWithinTolerance(value, expected, tolerancePct)) return 0;
  return studentUnitStatus(raw, unit) === "incorrect" ? Math.max(0, maxMarks - 1) : maxMarks;
}