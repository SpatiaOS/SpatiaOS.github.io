import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateTextSummary, textCost, TEXT_MODELS } from "./text-table.mjs";

const summary = JSON.parse(readFileSync(new URL("../live-text-summary.json", import.meta.url)));

test("current ten models retain exact scores and both tasks' validity", () => {
  validateTextSummary(summary);
  assert.deepEqual(summary.rows.map(r => r.model_id), TEXT_MODELS);
  assert.deepEqual(summary.rows.map(r => r.score.toFixed(2)), ["89.14", "87.18", "87.13", "86.70", "86.57", "86.49", "85.70", "85.44", "84.66", "82.34"]);
  for (const row of summary.rows) assert.equal(row.metrics.split(" ").length, 18);
});

test("every current cost is numeric and estimates remain in provenance", () => {
  assert.equal(textCost(summary.rows.find(r => r.model_id === "qwen38max")), "$0.410");
  assert.equal(textCost(summary.rows.find(r => r.model_id === "doubao21")), "$0.638");
  const kimi = summary.rows.find(r => r.model_id === "kimi_k3");
  assert.equal(kimi.cost_usd, null);
  assert.equal(kimi.usage_kind, "official_tokenizer_estimate");
  assert.equal(textCost(kimi), "$0.486");
  assert.equal(textCost(summary.rows[0]), "$0.592");
  for (const row of summary.rows) assert.match(textCost(row), /^\$\d+\.\d{3}$/);
  assert.throws(() => textCost({cost_usd: null, estimated_cost_usd: null}));
});

test("reject missing metrics, duplicates, stale scores, wrong means and costs", () => {
  for (const mutate of [
    s => s.rows.pop(),
    s => { s.rows[1].model_id = s.rows[0].model_id; },
    s => { s.rows[0].metrics = "0.1"; },
    s => { s.rows[0].score += 1; },
    s => { s.rows[0].formats.descriptive.average.valid = 0.8; },
    s => { s.rows[0].cost_usd = 0; },
    s => { s.rows[0].cost_usd = null; s.rows[0].estimated_cost_usd = null; s.rows[0].usd_per_case = null; },
    s => { s.rows[0].usd_per_case *= 100; },
    s => { s.rows.reverse(); },
  ]) {
    const copy = structuredClone(summary);
    mutate(copy);
    assert.throws(() => validateTextSummary(copy));
  }
});
