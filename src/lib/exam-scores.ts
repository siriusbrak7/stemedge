export interface ExamScore {
  earned: number;
  maximum: number;
}

export interface ExamScoreStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const scoreKey = (simId: string) => `stemedge:exam-best:${simId}`;

function browserStorage(): ExamScoreStorage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

export function getBestExamScore(
  simId: string,
  storage: ExamScoreStorage | null = browserStorage(),
): ExamScore | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(scoreKey(simId));
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<ExamScore>;
    if (
      typeof value.earned !== "number" ||
      typeof value.maximum !== "number" ||
      !Number.isFinite(value.earned) ||
      !Number.isFinite(value.maximum) ||
      value.maximum <= 0 ||
      value.earned < 0 ||
      value.earned > value.maximum
    ) {
      return null;
    }
    return { earned: value.earned, maximum: value.maximum };
  } catch {
    return null;
  }
}

export function saveBestExamScore(
  simId: string,
  score: ExamScore,
  storage: ExamScoreStorage | null = browserStorage(),
): ExamScore | null {
  if (!storage || !simId || score.maximum <= 0 || score.earned < 0 || score.earned > score.maximum) {
    return getBestExamScore(simId, storage);
  }
  const previous = getBestExamScore(simId, storage);
  const best =
    previous && previous.earned / previous.maximum > score.earned / score.maximum
      ? previous
      : score;
  try {
    storage.setItem(scoreKey(simId), JSON.stringify(best));
    return best;
  } catch {
    return previous;
  }
}