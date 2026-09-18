import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { assemblyCostPerCase, buildAssemblyTable, keepMissingCostsLast, supportEstimatedCosts, readActiveBundle, readLiveTables, replaceLiveTable } from "./live-tables.mjs";

const summary = JSON.parse(readFileSync(new URL("../live-assembly-summary.json", import.meta.url)));
const assembly = buildAssemblyTable(summary);
const textRaw = '{key:"text",title:"Text-to-3D",rows:[{model:"keep [}] and \\\" quotes",cells:"1 2"}]}';
const oldAssembly = '{key:"assembly",title:"Assembly-3D",rows:[]}';
const prefix = 'const paper=[{key:"assembly",rows:["paper results"]}],p2=';
const suffix = ';function unchangedDemo(){return "demo"}';
const fixture = `${prefix}[${textRaw},${oldAssembly}]${suffix}`;

test("preserve the measured models and audited costs with three-axis Judge scores", () => {
  const original = assembly.rows.filter((row) => !["doubao_seed21", "mimo25", "deepseek41_flash"].includes(row.model_id));
  assert.deepEqual(original.map((row) => row.model), ["GPT-6 Astra", "Claude Opus 5", "Gemini 3.8 Flash", "Kimi K3", "Grok 4.6", "Qwen 3.8 Max", "GLM 5.3 Flash"]);
  assert.deepEqual(original.map((row) => row.cells.split(" ")[0]), ["63.45", "54.20", "53.16", "50.76", "50.69", "49.74", "48.84"]);
  assert(assembly.rows.every((row) => row.cells.split(" ").length === 17));
  assert.deepEqual(original.map((row) => row.cells.split(" ")[1]), ["$1.292", "$0.978", "$0.158", "$0.571", "$0.302", "$0.120", "$0.034"]);
  assert.deepEqual(assembly.metrics.slice(0, 2), ["Score", "USD / case"]);
  assert.equal(assembly.groups[0].label, "Score / Cost");
  assert.deepEqual(summary.rows.find((row) => row.model_id === "gpt6_astra_local").coverage, { total: 200, tested: 183, valid: 182, invalid: 1, api_unrun: 17 });
});

test("displayed Assembly cost pools actual case counts and rejects stale format means", () => {
  const row = structuredClone(summary.rows[0]);
  assert.equal(assemblyCostPerCase(row), 236.4436875 / 183);
  row.cost_usd_per_case = row.cost_usd / 100;
  assert.throws(() => assemblyCostPerCase(row), /pooled Assembly cost/);
});

test("accept completed additions only with the same evaluator and preserve original rows", () => {
  const extended = structuredClone(summary);
  extended.rows = extended.rows.filter((row) => !["doubao_seed21", "mimo25", "deepseek41_flash"].includes(row.model_id));
  const row = structuredClone(extended.rows[0]);
  Object.assign(row, { model_id: "mimo25", model: "MiMo-V2.5", family: "mimo", cost_usd: null,
    usage_kind: "not_yet_audited", generation_cost: null, score_source_sha256: "frozen-source",
    evaluation: { model_id: "google/gemini-3.8-flash", reasoning_effort: "high" } });
  extended.rows.push(row);
  assert.equal(buildAssemblyTable(extended).rows.length, 8);
  row.evaluation.model_id = "old-evaluator";
  assert.throws(() => buildAssemblyTable(extended), /shared evaluator/);
  row.evaluation.model_id = "google/gemini-3.8-flash";
  extended.rows = extended.rows.filter((entry) => entry.model_id !== "kimi_k3");
  assert.throws(() => buildAssemblyTable(extended), /missing original/);
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

test("costs require complete usage and preserve equal format denominators", () => {
  let invalid = structuredClone(summary);
  invalid.rows[0].cost_usd *= 2;
  assert.throws(() => buildAssemblyTable(invalid), /cost formats/);
  invalid = structuredClone(summary);
  invalid.rows[0].generation_cost.formats.cadquery.cases_with_complete_usage -= 1;
  assert.throws(() => buildAssemblyTable(invalid), /coverage/);
  invalid = structuredClone(summary);
  invalid.rows.find((row) => row.model_id === "kimi_k3").cost_usd = 0;
  assert.throws(() => buildAssemblyTable(invalid), /audited token/);
});

test("missing costs stay last in either sorting direction", () => {
  const anchor = '      const difference = sort.endsWith("asc") ? leftValue - rightValue : rightValue - leftValue;';
  const comparator = keepMissingCostsLast(`const leftValue=left.value,rightValue=right.value;\n${anchor}\nreturn difference || left.index-right.index;`);
  const compare = new Function("left", "right", "sort", comparator);
  for (const direction of ["cost-asc", "cost-desc"]) {
    assert(compare({value:1,index:1},{value:Infinity,index:0},direction)<0);
    assert(compare({value:Infinity,index:0},{value:1,index:1},direction)>0);
  }
  assert.equal(keepMissingCostsLast(comparator), comparator);
  assert.throws(() => keepMissingCostsLast("unrelated comparator"), /anchor changed/);
});

test("Kimi cost retains estimated provenance and sorts numerically", () => {
  const kimi = summary.rows.find((row) => row.model_id === "kimi_k3");
  assert.equal(kimi.cost_usd, null);
  assert.equal(kimi.usage_kind, "estimated_official_tokenizer");
  assert.equal(kimi.cost_estimate.formats.cadquery.generation_requests + kimi.cost_estimate.formats.openscad.generation_requests, 240);
  const parse = new Function("token", supportEstimatedCosts('return Number(token.replace(/[$,!^]/g, ""));'));
  assert.equal(parse("≈$0.575"), 0.575);
  let bad = structuredClone(summary);
  bad.rows.find((row) => row.model_id === "kimi_k3").estimated_cost_usd *= 2;
  assert.throws(() => buildAssemblyTable(bad), /estimated cost formats/);
  bad = structuredClone(summary);
  bad.rows.find((row) => row.model_id === "kimi_k3").cost_estimate = null;
  assert.throws(() => buildAssemblyTable(bad), /provenance/);
});

test("active renderer highlights only Geo, Judge and Part and hides F@0.05", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const input = readActiveBundle(root).input;
  assert.match(input, /new Set\(\["Geo", "Judge", "Part"\]\)/);
  assert.match(input, /s==="f_score_005"\|\|s==="qa_parametric"/);
  assert.doesNotMatch(input, /i\.task==="text2cad"&&s==="f_score_005"/);
});
