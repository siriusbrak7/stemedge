import assert from "node:assert/strict";
import test from "node:test";
import { evaluateMotionTasks } from "./physics.ts";

const base = {
  resultantN: 6,
  acceleration: 3,
  velocity: 0,
  massKg: 4,
  frictionN: 2,
  running: false,
  timeS: 1,
  task3Baseline: { massKg: 2, resultantN: 6 },
};

test("mass task requires doubled mass and unchanged resultant", () => {
  assert.equal(evaluateMotionTasks(base)[3], true);
  assert.equal(evaluateMotionTasks({ ...base, resultantN: 7 })[3], false);
  assert.equal(evaluateMotionTasks({ ...base, massKg: 3 })[3], false);
});

test("friction task requires the simulation to have run", () => {
  assert.equal(evaluateMotionTasks({ ...base, timeS: 0 })[4], false);
  assert.equal(evaluateMotionTasks(base)[4], true);
});