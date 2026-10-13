import assert from "node:assert/strict";
import test from "node:test";
import {
  componentFromTray,
  evaluateCircuit,
  getInitialCircuitState,
  resistorValueLabel,
  type CircuitState,
} from "./physics.ts";

test("resistor display uses component value rather than its serial label", () => {
  const resistor = componentFromTray("resistor_10", 20);
  assert.equal(resistor.label, "R20 · 10 Ω");
  assert.equal(resistorValueLabel(resistor.value), "10 Ω");
});

test("an ammeter in parallel with a load is a short circuit", () => {
  const resistor = componentFromTray("resistor_10");
  const ammeter = componentFromTray("ammeter");
  const state: CircuitState = {
    ...getInitialCircuitState(),
    sections: [
      {
        id: "parallel",
        type: "parallel",
        branches: [[ammeter], [resistor]],
      },
    ],
  };

  const evaluation = evaluateCircuit(state);
  assert.equal(evaluation.topology, "Short circuit");
  assert.equal(evaluation.isShort, true);
  assert.equal(evaluation.totalCurrent, Infinity);
  assert.equal(evaluation.terminalV, 0);
  assert.equal(Number.isNaN(evaluation.terminalV), false);
  assert.equal(
    evaluation.coach,
    "An ammeter in parallel is a short circuit; ammeters go in series.",
  );
});