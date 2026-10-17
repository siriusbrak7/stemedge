import assert from "node:assert/strict";
import test from "node:test";
import {
  MOTION_TASKS,
  computeForces,
  generateForcesExamQuestions,
  stepMotion,
  type ForcesState,
} from "./physics.ts";

test("friction stops motion without reversing it at common frame steps", () => {
  const state: ForcesState = {
    leftN: 0,
    rightN: 0,
    frictionN: 10,
    massKg: 0.5,
    running: true,
  };

  for (const dt of [1 / 60, 0.05]) {
    let position = 8;
    let velocity = 0.25;
    let stoppedAt = -1;
    for (let frame = 0; frame < Math.ceil(1 / dt); frame += 1) {
      const forces = computeForces(state, velocity);
      const next = stepMotion(
        position,
        velocity,
        forces.acceleration,
        dt,
        state.frictionN,
        forces.appliedN,
      );
      position = next.position;
      velocity = next.velocity;
      assert.ok(velocity >= 0, `velocity reversed at dt=${dt}, frame=${frame}`);
      if (velocity === 0 && stoppedAt < 0) stoppedAt = frame;
    }
    assert.ok(stoppedAt >= 0, `did not stop within 1 s at dt=${dt}`);
    assert.equal(velocity, 0, `did not remain stopped at dt=${dt}`);
  }
});

test("computeForces calculates Newton 1 balanced state without friction term in formula", () => {
  const state: ForcesState = {
    leftN: 5,
    rightN: 5,
    frictionN: 0,
    massKg: 2,
    running: true,
  };
  const derived = computeForces(state, 0);
  assert.equal(derived.resultantN, 0);
  assert.equal(derived.acceleration, 0);
  assert.equal(derived.newton, "first");
  assert.equal(derived.heldAtRest, false);
  assert.equal(derived.formulaLine, "F_res = 5.0 − 5.0 = 0 N");
});

test("computeForces calculates Newton 2 unbalanced acceleration", () => {
  const state: ForcesState = {
    leftN: 4,
    rightN: 10,
    frictionN: 0,
    massKg: 2,
    running: true,
  };
  const derived = computeForces(state, 0);
  assert.equal(derived.resultantN, 6);
  assert.equal(derived.acceleration, 3);
  assert.equal(derived.newton, "second");
  assert.equal(derived.formulaLine, "F_res = 10.0 − 4.0 = 6.0 N");
});

test("computeForces applies kinetic friction opposing motion direction", () => {
  const state: ForcesState = {
    leftN: 0,
    rightN: 8,
    frictionN: 3,
    massKg: 2,
    running: true,
  };

  // Moving right: friction acts left (-3 N)
  const movingRight = computeForces(state, 2.0);
  assert.equal(movingRight.frictionSignedN, -3);
  assert.equal(movingRight.resultantN, 5);
  assert.equal(movingRight.acceleration, 2.5);
  assert.equal(movingRight.formulaLine, "F_res = 8.0 − 0 − 3.0 = 5.0 N");

  // Moving left: friction acts right (+3 N)
  const leftState: ForcesState = {
    leftN: 8,
    rightN: 0,
    frictionN: 3,
    massKg: 2,
    running: true,
  };
  const movingLeft = computeForces(leftState, -2.0);
  assert.equal(movingLeft.frictionSignedN, 3);
  assert.equal(movingLeft.resultantN, -5);
  assert.equal(movingLeft.acceleration, -2.5);
  assert.equal(movingLeft.formulaLine, "F_res = 0 − 8.0 + 3.0 = -5.0 N");
});

test("computeForces identifies static friction holding trolley at rest", () => {
  const state: ForcesState = {
    leftN: 0,
    rightN: 6,
    frictionN: 8,
    massKg: 2,
    running: true,
  };
  const derived = computeForces(state, 0);
  assert.equal(derived.heldAtRest, true);
  assert.equal(derived.frictionSignedN, -6);
  assert.equal(derived.resultantN, 0);
  assert.equal(derived.acceleration, 0);
  assert.ok(derived.formulaLine.includes("(held at rest)"));
});

test("stepMotion stops at track boundaries and returns hitEnd", () => {
  const minHit = stepMotion(0.2, -5, -2, 0.1);
  assert.equal(minHit.position, 0);
  assert.equal(minHit.velocity, 0);
  assert.equal(minHit.hitEnd, "min");

  const maxHit = stepMotion(15.8, 5, 2, 0.1);
  assert.equal(maxHit.position, 16);
  assert.equal(maxHit.velocity, 0);
  assert.equal(maxHit.hitEnd, "max");
});

test("stepMotion uses constant acceleration displacement and handles stopping within a frame", () => {
  const accelerated = stepMotion(2, 0, 3, 0.5, 0, 6, 2);
  assert.equal(accelerated.velocity, 1.5);
  assert.equal(accelerated.position, 2.375);
  const reversal = stepMotion(5, 1, -2, 1, 0, -2, 1);
  assert.equal(reversal.velocity, -1);
  assert.equal(reversal.position, 5);
});

test("friction learning task actually decelerates a moving trolley to rest", () => {
  const setup = MOTION_TASKS[3].setup;
  const state: ForcesState = {
    leftN: setup.leftN ?? 0,
    rightN: setup.rightN ?? 0,
    frictionN: setup.frictionN ?? 0,
    massKg: setup.massKg ?? 1,
    running: true,
  };
  let position = setup.position ?? 0;
  let velocity = setup.velocity ?? 0;
  const initialVelocity = velocity;
  for (let i = 0; i < 180 && velocity !== 0; i += 1) {
    const forces = computeForces(state, velocity);
    const next = stepMotion(position, velocity, forces.acceleration, 1 / 60, state.frictionN, forces.appliedN, state.massKg);
    position = next.position;
    velocity = next.velocity;
  }
  assert.ok(initialVelocity > 0.4);
  assert.equal(velocity, 0);
  assert.ok(position > (setup.position ?? 0));
  assert.ok(position < 16);
});

test("generateForcesExamQuestions produces valid numeric and choice questions with correct working", () => {
  const questions = generateForcesExamQuestions(42);
  assert.equal(questions.length, 6);
  for (const q of questions) {
    assert.ok(q.id);
    assert.ok(q.prompt.length > 10);
    if (q.kind === "numeric") {
      assert.ok(typeof q.expected === "number" && !Number.isNaN(q.expected));
    } else if (q.kind === "choice") {
      assert.ok(Array.isArray(q.options) && q.options.length > 1);
      assert.ok(typeof q.correctIndex === "number");
    }
    assert.ok(q.working?.equation);
  }
});

