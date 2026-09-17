import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateTextSummary, textBaselineRows, textCost, TEXT_MODELS, TEXT_MODEL_LABELS } from "./text-table.mjs";

const summary = JSON.parse(readFileSync(new URL("../live-text-summary.json", import.meta.url)));

test("current ten models retain exact scores and both tasks' validity", () => {
  validateTextSummary(summary);
  assert.deepEqual(summary.rows.map(r => r.model_id).sort(), [...TEXT_MODELS].sort());
  assert.deepEqual(Object.fromEntries(summary.rows.map(r => [r.model_id, r.model])), TEXT_MODEL_LABELS);
  assert.deepEqual(summary.rows.map(r => r.score.toFixed(2)), ["84.73", "82.38", "82.10", "81.73", "81.40", "81.13", "80.27", "80.13", "79.17", "76.35"]);
  for (const row of summary.rows) assert.equal(row.metrics.split(" ").length, 18);
});

test("Topo is displayed independently and unavailable IoU is omitted", () => {
  assert.equal(summary.metric_policy, "omit_unavailable_valid_iou_retain_invalid_zero");
  assert.equal(summary.raw_iou_audit.main_counts.unavailable, 156);
  const copy = structuredClone(summary), row = copy.rows[0];
  for (const fmt of ["json", "openscad", "average"]) row.formats.parametric[fmt].topology = 0;
  const cells = row.metrics.split(" ");
  for (const index of [7, 11, 15]) cells[index] = "0.000";
  row.metrics = cells.join(" ");
  validateTextSummary(copy);
  row.score = row.score_with_topology;
  assert.throws(() => validateTextSummary(copy), /total score/);
});

test("every current cost is numeric and estimates remain in provenance", () => {
  assert.equal(textCost(summary.rows.find(r => r.model_id === "qwen38max")), "$0.1026");
  assert.equal(textCost(summary.rows.find(r => r.model_id === "doubao21")), "$0.1594");
  const kimi = summary.rows.find(r => r.model_id === "kimi_k3");
  assert.equal(kimi.cost_usd, null);
  assert.equal(kimi.usage_kind, "official_tokenizer_estimate");
  assert.equal(textCost(kimi), "$0.1215");
  assert.equal(textCost(summary.rows[0]), "$0.1480");
  for (const row of summary.rows) assert.match(textCost(row), /^\$\d+\.\d{4}$/);
  assert.throws(() => textCost({cost_usd: null, estimated_cost_usd: null}));
});

test("reject missing metrics, duplicates, stale scores, wrong means and costs", () => {
  for (const mutate of [
    s => s.rows.pop(),
    s => { s.rows[1].model_id = s.rows[0].model_id; },
    s => { s.rows[0].metrics = "0.1"; },
    s => { s.rows[0].score += 1; },
    s => { s.rows[0].model += " (max)"; },
    s => { s.score_revision = "old"; },
    s => { s.iou_policy = "worst_fill"; },
    s => { s.geometry_aggregation = "metric_first"; },
    s => { s.geometry_terms.push("f_score_005"); },
    s => { s.topology_in_headline = true; },
    s => { s.rows[0].formats.descriptive.average.valid = 0.8; },
    s => { s.rows[0].cost_usd = 0; },
    s => { s.rows[0].cost_usd = null; s.rows[0].estimated_cost_usd = null; s.rows[0].usd_per_generation = null; },
    s => { s.rows[0].usd_per_generation *= 4; },
    s => { s.cost_denominator_selected_responses = 100; },
    s => { s.cost_unit = "USD/UID"; },
    s => { s.rows[0].usd_per_case = s.rows[0].usd_per_generation; },
    s => { s.rows.reverse(); },
  ]) {
    const copy = structuredClone(summary);
    mutate(copy);
    assert.throws(() => validateTextSummary(copy));
  }
});

test("Text2CAD is a comparable JSON-only row with the same headline formula", () => {
  const [baseline] = textBaselineRows(summary);
  assert.equal(baseline.model, "Text2CAD");
  assert.equal(baseline.cells, "18.30 - 0.129 0.910 - - - - 0.286 0.977 0.134 0.980 - - - - - - - -");
  assert.equal(baseline.cells.split(" ").length, 20);
  for (const mutate of [
    row => { row.formats.descriptive.openscad = { judge: .2, valid: .91 }; },
    row => { row.score += 1; },
    row => { row.judge_aggregation = "valid_only"; },
    row => { row.metrics = row.metrics.replace("-", "0.000"); },
  ]) {
    const copy = structuredClone(summary);
    mutate(copy.native_baselines[0]);
    assert.throws(() => textBaselineRows(copy));
  }
});
