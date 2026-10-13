import assert from "node:assert/strict";
import test from "node:test";
import { computeMoments, type MomentsState } from "./physics.ts";

test("a lone load is not in equilibrium even when its moment is below the old threshold", () => {
  const state: MomentsState = {
    pivotM: 0.5,
    ruleMassKg: 0,
    includeRule: false,
    loads: [{ id: "load", massKg: 0.1, posM: 0.42 }],
  };
  assert.equal(computeMoments(state).balanced, false);
});

test("relative moment tolerance recognizes the 2 kg and 3 kg balance", () => {
  const state: MomentsState = {
    pivotM: 0.5,
    ruleMassKg: 0,
    includeRule: false,
    loads: [
      { id: "left", massKg: 2, posM: 0.2 },
      { id: "right", massKg: 3, posM: 0.7 },
    ],
  };
  assert.equal(computeMoments(state).balanced, true);
});