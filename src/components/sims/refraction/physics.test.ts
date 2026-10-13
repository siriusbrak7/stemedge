import assert from "node:assert/strict";
import test from "node:test";
import {
  computeRefraction,
  evaluateRefractionTasks,
  getInitialRefractionState,
} from "./physics.ts";

test("refraction keeps Snell ratio and task conditions consistent", () => {
  const airToGlass = { ...getInitialRefractionState(), incidenceDeg: 35 };
  const refracted = computeRefraction(airToGlass);
  assert.ok(refracted.rDeg !== null && refracted.rDeg < airToGlass.incidenceDeg);
  assert.ok(Math.abs((refracted.observedRatio ?? 0) - airToGlass.n2) < 0.01);
  assert.equal(evaluateRefractionTasks(airToGlass, refracted)[1], true);

  const glassToAir = { ...airToGlass, denserToRarer: true, incidenceDeg: 20 };
  const away = computeRefraction(glassToAir);
  assert.ok(away.rDeg !== null && away.rDeg > glassToAir.incidenceDeg);
  assert.ok(Math.abs((away.observedRatio ?? 0) - 1 / glassToAir.n2) < 0.01);
  assert.equal(evaluateRefractionTasks(glassToAir, away)[2], true);

  const totalInternal = computeRefraction({ ...glassToAir, incidenceDeg: 60 });
  assert.equal(totalInternal.tir, true);
  assert.equal(evaluateRefractionTasks({ ...glassToAir, incidenceDeg: 60 }, totalInternal)[3], true);
});