import assert from "node:assert/strict";
import test from "node:test";
import { isCorrectChoice, markTextAnswer, numericAnswerMarks, studentUnitStatus } from "./exam-marking.ts";

test("text marking rejects negation before the accepted phrase", () => {
  assert.equal(markTextAnswer("it will not sink", [["sink", "sinks"]]), false);
  assert.equal(markTextAnswer("not in series", [["series"]]), false);
  assert.equal(markTextAnswer("not constant speed", [["constant speed"]]), false);
  assert.equal(markTextAnswer("isn't constant speed", [["constant speed"]]), false);
  assert.equal(markTextAnswer("it won't sink", [["sink"]]), false);
  assert.equal(markTextAnswer("it doesn't sink", [["sink"]]), false);
});

test("text marking matches whole words and synonym groups", () => {
  assert.equal(markTextAnswer("upside down", [["up"]]), false);
  assert.equal(markTextAnswer("from glass into air", [["denser to rarer", "glass into air"]]), true);
  assert.equal(markTextAnswer("dense to rare", [["denser to rarer", "dense to rare"]]), true);
  assert.equal(markTextAnswer("steady speed", [["constant speed", "steady speed"]]), true);
  assert.equal(markTextAnswer("series and clockwise", [["series"], ["clockwise"]]), true);
  assert.equal(markTextAnswer("series only", [["series"], ["clockwise"]]), false);
});

test("choice marking compares the selected option index", () => {
  assert.equal(isCorrectChoice("2", 2), true);
  assert.equal(isCorrectChoice("1", 2), false);
  assert.equal(isCorrectChoice("", 2), false);
});

test("unit status distinguishes omitted, correct and incorrect units", () => {
  assert.equal(studentUnitStatus("6.0", "N"), "omitted");
  assert.equal(studentUnitStatus("6.0 N", "N"), "correct");
  assert.equal(studentUnitStatus("6.0 m", "N"), "incorrect");
  assert.equal(studentUnitStatus("0.0006 kg/m³", "kg/m³"), "correct");
  assert.equal(studentUnitStatus("1.2 N·m", "N m"), "correct");
  assert.equal(studentUnitStatus("answer", ""), "not-required");
});

test("numeric marking awards partial credit for a correct value with a wrong unit", () => {
  assert.equal(numericAnswerMarks("6", 6, 2, "N", 2), 2);
  assert.equal(numericAnswerMarks("6 N", 6, 2, "N", 2), 2);
  assert.equal(numericAnswerMarks("6 m", 6, 2, "N", 2), 1);
  assert.equal(numericAnswerMarks("5", 6, 2, "N", 2), 0);
});