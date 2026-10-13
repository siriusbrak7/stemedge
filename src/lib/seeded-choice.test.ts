import assert from "node:assert/strict";
import test from "node:test";
import { nextAttemptSeed, seededPick } from "./seeded-choice.ts";

test("seeded picks are reproducible and retries advance the sequence", () => {
  const options = [10, 12, 14, 16];
  const first = seededPick(123, "forces-f1", options);
  assert.equal(seededPick(123, "forces-f1", options), first);
  assert.notEqual(seededPick(nextAttemptSeed(123), "forces-f1", options), first);
});