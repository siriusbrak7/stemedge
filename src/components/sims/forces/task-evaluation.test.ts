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

test("task 1 requires coasting with zero resultant force while moving", () => {
  // Balanced forces (resultant ≈ 0), moving, running
  assert.equal(
    evaluateMotionTasks({ ...base, resultantN: 0, velocity: 1.5, running: true })[1],
    true,
  );
  // Stationary
  assert.equal(
    evaluateMotionTasks({ ...base, resultantN: 0, velocity: 0, running: true })[1],
    false,
  );
  // Not running
  assert.equal(
    evaluateMotionTasks({ ...base, resultantN: 0, velocity: 1.5, running: false })[1],
    false,
  );
});

test("task 2 requires acceleration and slope without friction", () => {
  assert.equal(
    evaluateMotionTasks({ ...base, acceleration: 2.5, running: true, frictionN: 0, timeS: 1.0 })[2],
    true,
  );
  // With high friction
  assert.equal(
    evaluateMotionTasks({ ...base, acceleration: 2.5, running: true, frictionN: 2.0, timeS: 1.0 })[2],
    false,
  );
});

test("mass task requires doubled mass and unchanged resultant", () => {
  assert.equal(evaluateMotionTasks(base)[3], true);
  assert.equal(evaluateMotionTasks({ ...base, resultantN: 7 })[3], false);
  assert.equal(evaluateMotionTasks({ ...base, massKg: 3 })[3], false);
});

test("mass task handles baseline mass above 2.5 kg by normalizing to 2.0 kg", () => {
  // If student started with mass = 3.5 kg, baseline normalizes to 2.0 kg, so mass = 4.0 kg passes
  const highBaseline = {
    ...base,
    massKg: 4.0,
    task3Baseline: { massKg: 3.5, resultantN: 6 },
  };
  assert.equal(evaluateMotionTasks(highBaseline)[3], true);
});

test("friction task requires the simulation to have run", () => {
  assert.equal(evaluateMotionTasks({ ...base, timeS: 0, observedMotion: true })[4], false);
  assert.equal(evaluateMotionTasks({ ...base, velocity: 0, observedMotion: true })[4], true);
  assert.equal(evaluateMotionTasks({ ...base, velocity: 0.5, observedMotion: true })[4], false);
  assert.equal(evaluateMotionTasks({ ...base, velocity: 0, observedMotion: false })[4], false);
  assert.equal(evaluateMotionTasks({ ...base, velocity: 0, observedMotion: true, appliedN: 4 })[4], false);
});
