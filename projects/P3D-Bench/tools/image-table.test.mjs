import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildImageTable, buildAdditionalFormatTables, IMAGE_MODELS } from "./image-table.mjs";
import { readLiveTables, replaceLiveTable, readActiveBundle } from "./live-tables.mjs";
import { fileURLToPath } from "node:url";

const summary = JSON.parse(readFileSync(new URL("../live-image-summary.json", import.meta.url)));
const assembly = JSON.parse(readFileSync(new URL("../live-assembly-summary.json", import.meta.url)));

test("Image uses current nine-model Hard100 data and records all coverage gaps", () => {
  const table = buildImageTable(summary);
  assert.deepEqual(table.rows.map(r => r.model_id), IMAGE_MODELS);
  assert.deepEqual(table.rows.map(r => r.cells.split(" ").at(-2)), ["71.66", "66.80", "66.45", "66.34", "65.93", "64.95", "64.70", "62.79", "53.45"]);
  assert.equal(table.metrics.length, 20);
  assert.equal(table.groups.reduce((n, g) => n + g.span, 0), 20);
  assert(table.rows.every(r => r.cells.split(" ").length === 20));
  assert.equal(table.rows[0].cells.split(" ")[16], "257/300");
  assert.equal(table.rows[2].cells.split(" ")[17], "285/297");
  assert.equal(table.rows.at(-1).cells.split(" ")[16], "196/300");
  assert(summary.rows.every(r => r.provisional));
  assert.match(table.note, /provisional/);
});

test("reject mismatched cohort, changed scores, weighting, validity and cost coverage", () => {
  for (const mutate of [
    s => s.rows.pop(),
    s => { s.rows[0].model_id = s.rows[1].model_id; },
    s => { s.rows[0].score += 1; },
    s => { s.rows[0].average.judge += 0.01; },
    s => { s.rows[0].formats.cadquery.valid = 1; },
    s => { s.rows[0].counts.tested = 300; },
    s => { s.rows[0].cost_usd_per_case = NaN; },
    s => { s.rows[0].counts.cost_covered--; },
    s => { s.rows[0].provisional = false; },
  ]) {
    const bad = structuredClone(summary);
    mutate(bad);
    assert.throws(() => buildImageTable(bad));
  }
});

test("additional Gemini formats have independent per-format scores and coverage", () => {
  const tables = buildAdditionalFormatTables(assembly.additional_formats, "assembly");
  assert.deepEqual(tables[0].rows.map(r => r.cells.split(" ").at(-2)), ["62.35", "63.92"]);
  assert.match(tables[0].rows[1].cells, /97\/100 96\/97/);
  assert.equal(buildImageTable(summary).extraTables[0].rows[0].cells.split(" ").at(-2), "62.64");
  const bad = structuredClone(assembly.additional_formats);
  bad[0].score += 1;
  assert.throws(() => buildAdditionalFormatTables(bad, "assembly"), /score/);
  bad[0].score -= 1;
  bad.push(bad[0]);
  assert.throws(() => buildAdditionalFormatTables(bad, "assembly"), /source/);
});

test("adding Image preserves Text and Assembly bytes and is repeatable", () => {
  const input = 'const before=1,p2=[{key:"assembly",rows:[]},{key:"text",rows:[]}];const after=2';
  const table = buildImageTable(summary);
  assert.throws(() => replaceLiveTable(input, table), /not found/);
  const patched = replaceLiveTable(input, table, { append: true });
  const before = readLiveTables(input), after = readLiveTables(patched);
  assert.deepEqual(after.entries.slice(0, 2), before.entries);
  assert.deepEqual(after.entries.map(e => e.key), ["assembly", "text", "image"]);
  assert.equal(patched.slice(0, after.start), input.slice(0, before.start));
  assert.equal(patched.slice(after.end), input.slice(before.end));
  assert.equal(replaceLiveTable(patched, table, { append: true }), patched);
});

test("active release contains exactly the validated Image table and source mirrors", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const bundle = readActiveBundle(root);
  const entries = readLiveTables(bundle.input).entries;
  assert.deepEqual(entries.map(e => e.key), ["assembly", "text", "image"]);
  assert.deepEqual(JSON.parse(entries.find(e => e.key === "image").raw), buildImageTable(summary));
  for (const [a, b] of [["live-image-summary.json", "liveImageSummary.json"], ["live-assembly-summary.json", "liveAssemblySummary.json"]]) {
    assert.equal(readFileSync(new URL(`../${a}`, import.meta.url), "utf8"),
      readFileSync(new URL(`../../../.github/site-src/src/${b}`, import.meta.url), "utf8"));
  }
});
