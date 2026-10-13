export type TextAnswerGroups = readonly (readonly string[])[];

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