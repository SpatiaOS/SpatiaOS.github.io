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
  assert.deepEqual(table.rows.slice(0, 9).map(r => r.model_id), IMAGE_MODELS);
  assert.deepEqual(table.rows.slice(0, 9).map(r => r.cells.split(" ")[0]), ["59.91", "53.70", "52.61", "51.12", "50.30", "50.24", "49.77", "47.01", "39.51"]);
  assert.equal(table.metrics.length, 20);
  assert.equal(table.groups.reduce((n, g) => n + g.span, 0), 20);
  assert(table.rows.every(r => r.cells.split(" ").length === 20));
  assert.deepEqual(table.metrics.slice(0, 2), ["Score", "USD / case"]);
  assert.equal(table.groups[0].label, "Score / Cost");
  assert.equal(table.rows[0].cells.split(" ")[18], "257/300");
  assert.equal(table.rows.find(r => r.model_id === "gemini38_flash").cells.split(" ")[19], "285/297");
  assert.equal(table.rows[8].cells.split(" ")[18], "299/300");
  assert.equal(table.rows[8].cells.split(" ")[19], "253/253");
  assert(summary.rows.every(r => r.provisional));
  assert.equal(table.title, "Image-to-3D");
  assert.equal(table.note, "");
  assert.equal(table.extraTables, undefined);
});

test("native Image baselines retain their CadQuery-only contract", () => {
  const rows = buildImageTable(summary).rows.slice(9);
  assert.deepEqual(rows.map(r => r.model_id), ["cadrille", "cadcoder"]);
  assert.deepEqual(rows.map(r => r.cells.split(" ")[0]), ["19.13", "5.67"]);
  assert(rows.every(r => r.cells.split(" ").slice(6, 18).every(v => v === "-")));
  assert.equal(rows[1].cells.split(" ")[18], "87/100");
  const bad = structuredClone(summary);
  bad.domain_baselines[0].score += 1;
  assert.throws(() => buildImageTable(bad), /native Image score/);
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
  assert.deepEqual(tables[0].rows.map(r => r.cells.split(" ").at(-2)), assembly.additional_formats.map(r => r.score.toFixed(2)));
  assert.match(tables[0].rows[1].cells, /97\/100 96\/97/);
  assert.equal(buildAdditionalFormatTables(summary.additional_formats, "image")[0].rows[0].cells.split(" ").at(-2), summary.additional_formats[0].score.toFixed(2));
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
