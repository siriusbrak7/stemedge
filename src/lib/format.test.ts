import assert from "node:assert/strict";
import test from "node:test";
import { format3SF } from "./format.ts";

test("format3SF keeps three significant figures across magnitudes", () => {
  assert.equal(format3SF(0.0005), "5.00 × 10⁻⁴");
  assert.equal(format3SF(0.0015), "0.00150");
  assert.equal(format3SF(0.05), "0.0500");
  assert.equal(format3SF(0.5), "0.500");
  assert.equal(format3SF(12.34), "12.3");
  assert.equal(format3SF(1234), "1230");
  assert.equal(format3SF(1e6), "1.00 × 10⁶");
});

test("format3SF handles zero, negative values and NaN", () => {
  assert.equal(format3SF(0), "0.00");
  assert.equal(format3SF(-0.0015), "-0.00150");
  assert.equal(format3SF(-0.0005), "-5.00 × 10⁻⁴");
  assert.equal(format3SF(Number.NaN), "—");
});