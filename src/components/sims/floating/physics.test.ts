import assert from "node:assert/strict";
import test from "node:test";
import { computeFloating, getInitialFloatingState } from "./physics.ts";

test("floating, suspended and sinking force results remain physically consistent", () => {
  const base = getInitialFloatingState();
  const floating = computeFloating(base);
  assert.equal(floating.floats, true);
  assert.ok(Math.abs(floating.weight - floating.upthrust) < 1e-9);
  assert.equal(floating.normalReaction, 0);

  const suspended = computeFloating({ ...base, objectDensity: 1000 });
  assert.equal(suspended.suspends, true);
  assert.ok(Math.abs(suspended.weight - suspended.upthrust) < 1e-9);

  const sinking = computeFloating({ ...base, objectDensity: 1500 });
  assert.equal(sinking.sinks, true);
  assert.ok(sinking.normalReaction > 0);
  assert.equal(sinking.netForce, 0);
});