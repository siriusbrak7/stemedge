import assert from "node:assert/strict";
import test from "node:test";
import { computeForces, stepMotion, type ForcesState } from "./physics.ts";

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