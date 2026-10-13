import assert from "node:assert/strict";
import test from "node:test";
import { getBestExamScore, saveBestExamScore, type ExamScoreStorage } from "./exam-scores.ts";

function memoryStorage(): ExamScoreStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
  };
}

test("exam best scores persist per simulation and never regress", () => {
  const storage = memoryStorage();
  assert.deepEqual(saveBestExamScore("forces", { earned: 4, maximum: 10 }, storage), {
    earned: 4,
    maximum: 10,
  });
  assert.deepEqual(saveBestExamScore("forces", { earned: 3, maximum: 10 }, storage), {
    earned: 4,
    maximum: 10,
  });
  assert.deepEqual(getBestExamScore("forces", storage), { earned: 4, maximum: 10 });
  assert.equal(getBestExamScore("moments", storage), null);
});

test("corrupt and unavailable storage fails closed", () => {
  const broken: ExamScoreStorage = {
    getItem: () => "not json",
    setItem: () => { throw new Error("storage unavailable"); },
  };
  assert.equal(getBestExamScore("forces", broken), null);
  assert.equal(saveBestExamScore("forces", { earned: 1, maximum: 4 }, broken), null);
});