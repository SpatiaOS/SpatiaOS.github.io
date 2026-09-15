import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateSpatialDemo, mergeSpatialManifest } from "./spatial-demo.mjs";
import { mergeLiveTextManifest } from "./text-demo.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../demo/${name}`, import.meta.url)));
const base = read("manifest.json"), text = read("text-live-fixed100.json"), data = read("spatial-live.json");

test("eight new cases have all 180 evaluated model/format combinations", () => {
  validateSpatialDemo(data);
  for (const task of ["image2cad", "text_image2cad"]) {
    assert.equal(data.cases.filter(c => c.task === task).length, 4);
    assert.equal(new Set(data.runs.filter(r => r.task === task).map(r => r.model)).size, 9);
  }
  assert(data.cases.every(c => !base.cases.some(old => old.id.split("/").at(-1) === c.id.split("/").at(-1))));
});

test("all assets match the published digest inventory", () => {
  const audit = read("spatial-live-audit.json");
  for (const [path, record] of Object.entries(audit.assets)) {
    const bytes = readFileSync(new URL(`../demo/${path}`, import.meta.url));
    assert.equal(bytes.length, record.bytes, path);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), record.sha256, path);
  }
  for (const run of data.runs) for (const path of Object.values(run.assets)) assert(audit.assets[path], path);
});

test("spatial replacement preserves current Text, page metadata and model identities", () => {
  const currentText = mergeLiveTextManifest(base, text), merged = mergeSpatialManifest(currentText, data);
  for (const key of ["paper", "tasks", "figures", "gallery", "text_showcase"]) assert.deepEqual(merged[key], currentText[key]);
  assert.deepEqual(merged.runs.filter(r => r.task === "text2cad"), currentText.runs.filter(r => r.task === "text2cad"));
  assert.deepEqual(merged.cases.filter(r => r.task === "text2cad"), currentText.cases.filter(r => r.task === "text2cad"));
  assert.equal(merged.runs.length, 340);
  assert.equal(new Set(merged.models.map(m => m.id)).size, 19);
  assert.deepEqual(mergeSpatialManifest(merged, data), merged);
});

test("showcase and part examples point to each model's own selected output", () => {
  for (const show of Object.values(data.spatial_showcases)) assert.equal(show.variants.length, 9);
  const parts = read("spatial-assemblies.json");
  assert.equal(parts.items.length, 2);
  assert.deepEqual(parts.items.map(p => p.model), ["gpt6_astra_local-reason", "claude_opus5-reason"]);
  const inventory = read("spatial-live-audit.json").assets;
  for (const part of parts.items) {
    const run = data.runs.find(r => r.id + "_parts" === part.id);
    assert(run);
    assert.deepEqual(part.assets, run.assets);
    assert.deepEqual(part.metrics, run.metrics);
    assert.equal(part.condition, run.condition);
    assert(part.aligned_pairs.length >= 3);
    for (const pair of part.aligned_pairs) {
      assert(inventory[pair.gt.mesh] && inventory[pair.pred.mesh]);
      assert(pair.f_score >= 0 && pair.f_score <= 1);
    }
  }
});

test("reject old models, duplicate runs, mixed input and borrowed showcase meshes", () => {
  for (const change of [
    d => { d.runs[0].model = "gpt55-reason"; },
    d => { d.runs[1] = structuredClone(d.runs[0]); },
    d => { d.runs[0].assets.input_image = d.runs.at(-1).assets.input_image; },
    d => { d.runs[0].metrics.judge_geometry = null; },
    d => { d.spatial_showcases.image2cad.variants[0].mesh = d.runs.at(-1).assets.mesh; },
    d => { d.spatial_showcases.text_image2cad.input = "changed"; },
  ]) {
    const bad = structuredClone(data); change(bad);
    assert.throws(() => validateSpatialDemo(bad));
  }
});
