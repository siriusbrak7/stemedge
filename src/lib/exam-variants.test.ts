import assert from "node:assert/strict";
import test from "node:test";
import { generateForcesExamQuestions } from "../components/sims/forces/physics.ts";
import { generateMomentsExamQuestions } from "../components/sims/moments/physics.ts";
import { generateFloatingExamQuestions } from "../components/sims/floating/physics.ts";
import { generateCircuitsExamQuestions } from "../components/sims/circuits/physics.ts";
import { generateRefractionExamQuestions } from "../components/sims/refraction/physics.ts";
import { generateElectromagnetismExamQuestions } from "../components/sims/electromagnetism/physics.ts";

test("first numeric exam scenarios vary deterministically from their seed", () => {
  const generators = [
    generateForcesExamQuestions,
    generateMomentsExamQuestions,
    generateFloatingExamQuestions,
    generateCircuitsExamQuestions,
    generateRefractionExamQuestions,
    generateElectromagnetismExamQuestions,
  ];
  for (const generate of generators) {
    assert.notEqual(generate(100)[0].prompt, generate(101)[0].prompt);
    assert.equal(generate(100)[0].prompt, generate(100)[0].prompt);
  }
});

test("seeded prompts, contexts, expected results and substitutions agree", () => {
  const forces = generateForcesExamQuestions(41);
  const right = Number(forces[0].contextLines?.[0].match(/[\d.]+/)?.[0]);
  const left = Number(forces[0].contextLines?.[1].match(/[\d.]+/)?.[0]);
  assert.equal(forces[0].expected, right - left);
  assert.equal(forces[1].expected, forces[0].expected! / 2);

  const moments = generateMomentsExamQuestions(42)[0];
  const force = Number(moments.contextLines?.[0].match(/[\d.]+/)?.[0]);
  const distance = Number(moments.contextLines?.[1].match(/[\d.]+/)?.[0]);
  assert.equal(moments.expected, force * distance);

  const floating = generateFloatingExamQuestions(43)[0];
  const floatingData = floating.prompt.match(/mass ([\d.]+) kg and volume ([\de.+-]+) m³/);
  assert.ok(floatingData);
  assert.ok(Math.abs(floating.expected! - Number(floatingData[1]) / Number(floatingData[2])) < 1e-8);

  const circuits = generateCircuitsExamQuestions(44)[0];
  const emf = Number(circuits.contextLines?.[0].match(/[\d.]+/)?.[0]);
  const resistance = Number(circuits.contextLines?.[1].match(/[\d.]+/)?.[0]);
  assert.equal(circuits.expected, emf / resistance);

  const refraction = generateRefractionExamQuestions(45)[0];
  const angles = refraction.prompt.match(/at (\d+)° and refracts at (\d+)°/);
  assert.ok(angles);
  const index = Math.sin((Number(angles[1]) * Math.PI) / 180) / Math.sin((Number(angles[2]) * Math.PI) / 180);
  assert.equal(refraction.expected, index);

  const electromagnetism = generateElectromagnetismExamQuestions(46)[0];
  const values = electromagnetism.contextLines?.map((line) => Number(line.match(/[\d.]+/)?.[0]));
  assert.equal(values?.length, 3);
  assert.equal(electromagnetism.expected, values![0] * values![1] * values![2]);
});