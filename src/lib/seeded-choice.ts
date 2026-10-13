export function seededPick<T>(seed: number, key: string, options: readonly T[]): T {
  if (options.length === 0) throw new Error("seededPick requires at least one option");
  let hash = 2_166_136_261 ^ (seed >>> 0);
  for (const character of key) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return options[(hash >>> 0) % options.length];
}

export function nextAttemptSeed(seed: number): number {
  return (Math.imul(seed >>> 0, 1_664_525) + 1_013_904_223) >>> 0;
}