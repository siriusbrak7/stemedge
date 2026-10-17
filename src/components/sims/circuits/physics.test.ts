import assert from "node:assert/strict";
import test from "node:test";
import {
  GUIDED_TASKS,
  componentFromTray,
  evaluateCircuit,
  getInitialCircuitState,
  lampResistanceAtCurrent,
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

test("lamp resistance rises with current and the circuit solver converges", () => {
  assert.ok(lampResistanceAtCurrent(12, 1) > lampResistanceAtCurrent(12, 0));
  const lamp = componentFromTray("lamp");
  const state: CircuitState = {
    ...getInitialCircuitState(),
    sections: [{ id: "lamp", type: "series", component: lamp }],
  };
  const evaluation = evaluateCircuit(state);
  const reading = evaluation.resistorCurrents[lamp.id];
  assert.ok(Number.isFinite(evaluation.totalCurrent));
  assert.ok(reading.voltage / reading.current > lamp.value);
  assert.ok(Math.abs(reading.voltage - state.cellEmf) < 1e-6);
  assert.equal(Number.isNaN(evaluation.powerW), false);
});

test("voltmeter across open switch measures cell EMF and 0 V when closed", () => {
  const resistor = componentFromTray("resistor_10");
  const openState: CircuitState = {
    ...getInitialCircuitState(),
    cellEmf: 6,
    switchClosed: false,
    sections: [{ id: "s1", type: "series", component: resistor }],
    voltmeterAcross: "switch",
  };
  const openEval = evaluateCircuit(openState);
  assert.equal(openEval.voltmeterReading, 6);
  assert.equal(openEval.voltmeterWhere, "across switch");

  const closedState: CircuitState = {
    ...openState,
    switchClosed: true,
  };
  const closedEval = evaluateCircuit(closedState);
  assert.equal(closedEval.voltmeterReading, 0);
});

test("voltmeter across supply measures terminal p.d. V = E - Ir", () => {
  const resistor = componentFromTray("resistor_10");
  const state: CircuitState = {
    ...getInitialCircuitState(),
    cellEmf: 6,
    internalR: 2, // total R = 10 + 2 = 12 -> I = 0.5 A, V_term = 6 - 0.5*2 = 5 V
    switchClosed: true,
    sections: [{ id: "s1", type: "series", component: resistor }],
    voltmeterAcross: "supply",
  };
  const evaluation = evaluateCircuit(state);
  assert.equal(evaluation.totalCurrent, 0.5);
  assert.equal(evaluation.terminalV, 5);
  assert.equal(evaluation.voltmeterReading, 5);
});

test("parallel branches with equal resistors split current equally 50/50", () => {
  const r1 = componentFromTray("resistor_10");
  const r2 = componentFromTray("resistor_10");
  const state: CircuitState = {
    ...getInitialCircuitState(),
    cellEmf: 6,
    internalR: 0,
    switchClosed: true,
    sections: [
      {
        id: "p1",
        type: "parallel",
        branches: [[r1], [r2]],
      },
    ],
  };
  const evaluation = evaluateCircuit(state);
  // Total current through circuit is 6V / 5 ohm = 1.2A
  assert.equal(Math.round(evaluation.totalCurrent * 10) / 10, 1.2);
  assert.equal(Math.round(evaluation.branchCurrents["p1:0"] * 10) / 10, 0.6);
  assert.equal(Math.round(evaluation.branchCurrents["p1:1"] * 10) / 10, 0.6);
});

test("parallel branches with unequal resistors split current inversely proportional to resistance", () => {
  const r1 = componentFromTray("resistor_10");
  const r2 = componentFromTray("resistor_20");
  const state: CircuitState = {
    ...getInitialCircuitState(),
    cellEmf: 6,
    internalR: 0,
    switchClosed: true,
    sections: [
      {
        id: "p1",
        type: "parallel",
        branches: [[r1], [r2]],
      },
    ],
  };
  const evaluation = evaluateCircuit(state);
  // Total resistance is 10*20 / 30 = 20/3 ohm = 6.667 ohm. Total current = 6 / (20/3) = 0.9 A.
  // Branch 1 (10 ohm): 6V / 10 ohm = 0.6 A
  // Branch 2 (20 ohm): 6V / 20 ohm = 0.3 A
  assert.equal(Math.round(evaluation.totalCurrent * 10) / 10, 0.9);
  assert.equal(Math.round(evaluation.branchCurrents["p1:0"] * 10) / 10, 0.6);
  assert.equal(Math.round(evaluation.branchCurrents["p1:1"] * 10) / 10, 0.3);
});

test("all guided task setup factories create circuits that pass task verification", () => {
  for (const task of GUIDED_TASKS) {
    assert.ok(typeof task.setupFactory === "function", `Task ${task.id} must have a setupFactory`);
    const setupState = task.setupFactory();
    const evaluation = evaluateCircuit(setupState, task.id);
    const complete =
      task.id === 1 ? evaluation.task1Complete :
      task.id === 2 ? evaluation.task2Complete :
      task.id === 3 ? evaluation.task3Complete :
      evaluation.task4Complete;
    assert.equal(complete, true, `Task ${task.id} setupFactory should pass task verification`);
  }
});

test("diode conducts in forward bias and blocks current in reverse bias", () => {
  const r10 = componentFromTray("resistor_10");
  const diodeFwd = componentFromTray("diode");
  const fwdState: CircuitState = {
    ...getInitialCircuitState(),
    cellEmf: 6,
    internalR: 0,
    switchClosed: true,
    sections: [
      { id: "s1", type: "series", component: r10 },
      { id: "s2", type: "series", component: diodeFwd },
    ],
  };
  const fwdEval = evaluateCircuit(fwdState);
  assert.equal(fwdEval.isClosed, true);
  // Total R = 10 + 0.5 = 10.5 ohm -> I = 6 / 10.5 approx 0.571 A
  assert.ok(fwdEval.totalCurrent > 0.5 && fwdEval.totalCurrent < 0.6);

  const diodeRev = { ...diodeFwd, reversed: true };
  const revState: CircuitState = {
    ...fwdState,
    sections: [
      { id: "s1", type: "series", component: r10 },
      { id: "s2", type: "series", component: diodeRev },
    ],
    voltmeterAcross: diodeRev.id,
  };
  const revEval = evaluateCircuit(revState);
  assert.equal(revEval.isClosed, false);
  assert.equal(revEval.totalCurrent, 0);
  assert.ok(revEval.coach.includes("reverse-biased"));
});

test("variable resistor updates total resistance and circuit current", () => {
  const vr = componentFromTray("variable_resistor");
  const state: CircuitState = {
    ...getInitialCircuitState(),
    cellEmf: 6,
    internalR: 0,
    switchClosed: true,
    sections: [{ id: "s1", type: "series", component: vr }],
  };
  // Base vr value is 15 ohm: I = 6 / 15 = 0.4 A
  const eval1 = evaluateCircuit(state);
  assert.equal(eval1.totalCurrent, 0.4);

  // Adjust vr value to 30 ohm: I = 6 / 30 = 0.2 A
  const vrAdjusted = { ...vr, value: 30 };
  const state2: CircuitState = {
    ...state,
    sections: [{ id: "s1", type: "series", component: vrAdjusted }],
  };
  const eval2 = evaluateCircuit(state2);
  assert.equal(eval2.totalCurrent, 0.2);
});