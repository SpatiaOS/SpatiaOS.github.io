import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {validateLiveTextDemo, mergeLiveTextManifest} from "./text-demo.mjs";

const base = JSON.parse(readFileSync(new URL("../demo/manifest.json", import.meta.url)));
const overlay = JSON.parse(readFileSync(new URL("../demo/text-live-fixed100.json", import.meta.url)));

test("Text demo covers ten models, four preserved cases and both specifications/formats", () => {
  validateLiveTextDemo(overlay);
  assert.equal(overlay.runs.filter(x => x.valid).length, 159);
  assert.equal(overlay.runs.filter(x => !x.valid).length, 1);
  for (const row of overlay.runs) for (const path of Object.values(row.assets)) {
    assert.ok(existsSync(new URL(`../demo/${path}`, import.meta.url)), path);
  }
});

test("merging Text preserves all Image and Assembly records and metadata", () => {
  const merged = mergeLiveTextManifest(base, overlay);
  assert.deepEqual(merged.runs.filter(x => x.task !== "text2cad"), base.runs.filter(x => x.task !== "text2cad"));
  assert.deepEqual(merged.cases.filter(x => x.task !== "text2cad"), base.cases.filter(x => x.task !== "text2cad"));
  for (const key of ["paper", "tasks", "figures", "gallery"]) assert.deepEqual(merged[key], base[key]);
  for (const old of base.models) {
    if (base.runs.some(x => x.task !== "text2cad" && x.model === old.id)) assert.deepEqual(merged.models.find(x => x.id === old.id), old);
  }
  assert.equal(merged.runs.filter(x => x.task === "text2cad").length, 160);
  assert.deepEqual([...new Set(merged.runs.filter(x => x.task === "text2cad").map(x => x.model))], overlay.model_ids);
});

test("showcase uses ten own-model runs with one fixed input and protocol", () => {
  const show = overlay.text_showcase;
  assert.equal(show.variants.length, 10);
  assert.equal(show.specLabel, "Parametric");
  for (const variant of show.variants) {
    const run = overlay.runs.find(x => x.id === variant.id);
    assert.equal(run.case_id, "0046/00460772");
    assert.equal(run.condition, show.input);
    assert.equal(variant.src, run.assets.pred_render);
    assert.equal(variant.mesh, run.assets.mesh);
  }
});

test("reject missing identities, stale models, borrowed images and mixed protocols", () => {
  for (const mutate of [
    x => x.runs.pop(),
    x => { x.runs[0].model = "gpt55-reason"; },
    x => { x.runs[0].assets.gt_render = "/private/gt.png"; },
    x => { x.runs[1] = {...x.runs[0]}; },
    x => { x.text_showcase.variants[0].mesh = x.text_showcase.variants[1].mesh; },
    x => { x.text_showcase.input = "another input"; },
  ]) {
    const copy = structuredClone(overlay); mutate(copy);
    assert.throws(() => validateLiveTextDemo(copy));
  }
});
