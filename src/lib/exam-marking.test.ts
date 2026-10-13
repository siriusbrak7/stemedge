import assert from "node:assert/strict";
import test from "node:test";
import { isCorrectChoice, markTextAnswer } from "./exam-marking.ts";

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