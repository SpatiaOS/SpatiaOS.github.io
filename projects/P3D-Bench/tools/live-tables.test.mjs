import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildAssemblyTable, readLiveTables, replaceLiveTable } from "./live-tables.mjs";

const summary = JSON.parse(readFileSync(new URL("../live-assembly-summary.json", import.meta.url)));
const assembly = buildAssemblyTable(summary);
const textRaw = '{key:"text",title:"Text-to-3D",rows:[{model:"keep [}] and \\\" quotes",cells:"1 2"}]}';
const oldAssembly = '{key:"assembly",title:"Assembly-3D",rows:[]}';
const prefix = 'const paper=[{key:"assembly",rows:["paper results"]}],p2=';
const suffix = ';function unchangedDemo(){return "demo"}';
const fixture = `${prefix}[${textRaw},${oldAssembly}]${suffix}`;

test("publish exactly the seven measured models and precise scores", () => {
  assert.deepEqual(assembly.rows.map((row) => row.model), ["GPT-6 Astra", "Claude Opus 5", "Gemini 3.8 Flash", "Grok 4.6", "Kimi K3", "Qwen 3.8 Max", "GLM 5.3 Flash"]);
  assert.deepEqual(assembly.rows.map((row) => row.cells.split(" ").at(-2)), ["75.18", "69.99", "68.61", "67.12", "66.82", "65.97", "65.82"]);
  assert(assembly.rows.every((row) => row.cells.split(" ").length === 17 && row.cells.endsWith(" -")));
  assert.deepEqual(summary.rows[0].coverage, { total: 200, tested: 183, valid: 182, invalid: 1, api_unrun: 17 });
});

test("Assembly moves first while Text, Paper and demo bytes remain intact", () => {
  const patched = replaceLiveTable(fixture, assembly, { first: true });
  const parsed = readLiveTables(patched);
  assert.deepEqual(parsed.entries.map((entry) => entry.key), ["assembly", "text"]);
  assert.equal(parsed.entries[1].raw, textRaw);
  assert.equal(patched.slice(0, parsed.start), prefix);
  assert.equal(patched.slice(parsed.end), suffix);
  assert.equal(replaceLiveTable(patched, assembly, { first: true }), patched);
});

test("a later Text update preserves the first Assembly table byte for byte", () => {
  const current = replaceLiveTable(fixture, assembly, { first: true });
  const patched = replaceLiveTable(current, { key: "text", title: "Text-to-3D", rows: [{ model: "new text" }] });
  const parsed = readLiveTables(patched);
  assert.deepEqual(parsed.entries.map((entry) => entry.key), ["assembly", "text"]);
  assert.equal(parsed.entries[0].raw, readLiveTables(current).entries[0].raw);
});

test("reject stale scores, duplicated models and incorrect API denominators", () => {
  let invalid = structuredClone(summary);
  invalid.rows[0].score = 74.1;
  assert.throws(() => buildAssemblyTable(invalid), /score/);
  invalid = structuredClone(summary);
  invalid.rows[1].model_id = invalid.rows[0].model_id;
  assert.throws(() => buildAssemblyTable(invalid), /duplicate/);
  invalid = structuredClone(summary);
  invalid.rows[0].formats.cadquery.coverage.tested = 100;
  assert.throws(() => buildAssemblyTable(invalid), /coverage/);
});

test("reject changed bundle boundaries instead of patching another table", () => {
  assert.throws(() => readLiveTables(fixture.replace(",p2=", ",newName=")), /expected one/);
  assert.throws(() => readLiveTables(fixture.replace(oldAssembly, textRaw)), /duplicate/);
});
