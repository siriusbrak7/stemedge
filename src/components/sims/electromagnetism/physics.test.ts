import assert from "node:assert/strict";
import test from "node:test";
import {
  computeElectromagnetism,
  evaluateElectromagnetismTasks,
  getInitialElectromagnetismState,
} from "./physics.ts";

test("forward/reverse current and field directions reverse the force", () => {
  const base = getInitialElectromagnetismState();
  const forward = computeElectromagnetism(base);
  const reverseCurrent = computeElectromagnetism({ ...base, currentDirection: "reverse" });
  const reverseField = computeElectromagnetism({ ...base, bIntoPage: false });
  assert.ok(forward.forceN > 0);
  assert.equal(reverseCurrent.forceN, -forward.forceN);
  assert.equal(reverseField.forceN, -forward.forceN);
  assert.equal(reverseCurrent.forceMagnitudeN, forward.forceMagnitudeN);
});

test("electromagnetism tasks require field/current and respond to both reversals", () => {
  const state = getInitialElectromagnetismState();
  const tasks = evaluateElectromagnetismTasks(state, computeElectromagnetism(state));
  assert.equal(tasks[1], true);
  assert.equal(tasks[2], false);
  assert.equal(tasks[3], false);
  assert.equal(
    evaluateElectromagnetismTasks(
      { ...state, currentDirection: "reverse", bIntoPage: false },
      computeElectromagnetism({ ...state, currentDirection: "reverse", bIntoPage: false }),
    )[2],
    true,
  );
});