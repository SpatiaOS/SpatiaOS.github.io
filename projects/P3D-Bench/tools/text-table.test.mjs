import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateTextSummary, textCost, textNativeRows, TEXT_MODELS } from "./text-table.mjs";

const summary = JSON.parse(readFileSync(new URL("../live-text-summary.json", import.meta.url)));

test("current ten models retain exact scores and both tasks' validity", () => {
  validateTextSummary(summary);
  assert.deepEqual(summary.rows.map(r => r.model_id).sort(), [...TEXT_MODELS].sort());
  assert.equal(summary.metric_policy, "omit_unavailable_valid_iou_retain_invalid_zero");
  assert.deepEqual(summary.rows.map(r => r.score.toFixed(2)), ["84.73", "82.38", "82.10", "81.73", "81.40", "81.13", "80.27", "80.13", "79.17", "76.35"]);
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
    s => { s.score_revision = "old"; },
    s => { s.iou_policy = "worst_fill"; },
    s => { s.geometry_aggregation = "metric_first"; },
    s => { s.geometry_terms.push("f_score_005"); },
    s => { s.topology_in_headline = true; },
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

test("native JSON baseline never invents OpenSCAD, averages or an API price", () => {
  const native = { model_id: "text2cad", model: "Text2CAD (JSON only)", family: "text2cad",
    scope: "native_json_only", cost_kind: "local_checkpoint_not_api_priced", score: 70 / 3,
    formats: {descriptive: {json: {judge: .2, valid: .91}},
      parametric: {json: {geometry: .3, topology: .9, judge: .2, valid: .98}}},
    metrics: "0.200 0.910 - - - - 0.300 0.900 0.200 0.980 - - - - - - - -" };
  const input = {native_baselines: [native]};
  assert.equal(textNativeRows(input)[0].cells, "23.33 - " + native.metrics);
  for (const mutate of [r => r.formats.descriptive.openscad = {judge: .2, valid: .91},
    r => r.score++, r => r.metrics = r.metrics.replace("-", "0.000")]) {
    const copy = structuredClone(native); mutate(copy);
    assert.throws(() => textNativeRows({native_baselines: [copy]}));
  }
});
