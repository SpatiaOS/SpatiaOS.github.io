#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const indexPath = join(root, "index.html");
const dataPath = join(root, "live-text-summary.json");
const rendererPath = join(root, "leaderboard-renderer.fragment.js");
const expectedInputSha256 = "74d319a896b51138dd3965f07fef3203691f52582d43eb6a158d5ff065f7a2b8";
const inputName = "index-BtO9hYwb.js";

const indexHtml = readFileSync(indexPath, "utf8");
const scriptMatch = indexHtml.match(/src="\/projects\/P3D-Bench\/assets\/(index-[^"]+\.js)"/);
if (!scriptMatch) throw new Error("active P3D-Bench bundle not found in index.html");

const inputPath = join(root, "assets", inputName);
const input = readFileSync(inputPath, "utf8");
const inputSha256 = createHash("sha256").update(input).digest("hex");
if (inputSha256 !== expectedInputSha256) {
  throw new Error(`refusing to patch unexpected bundle ${inputName} (${inputSha256})`);
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));
if (data.schema_version !== "p3d-live-text-summary-v1") throw new Error("unsupported live summary schema");
for (const [label, source] of [["score", data.score_source], ["cost", data.cost_source]]) {
  if (!source || !/^[a-z0-9][a-z0-9-]{7,63}$/.test(source.id) || !/^[0-9a-f]{64}$/.test(source.sha256)) {
    throw new Error(`invalid ${label} source provenance`);
  }
}
if (data.rows.length !== 13) throw new Error(`expected 13 Text-to-3D rows, got ${data.rows.length}`);
for (const [index, row] of data.rows.entries()) {
  if (row.metrics.trim().split(/\s+/).length !== 18) throw new Error(`${row.model}: expected 18 metric cells`);
  if (index > 0 && data.rows[index - 1].score < row.score) throw new Error("rows must be score-descending");
  if (!(row.cost_usd > 0)) throw new Error(`${row.model}: invalid cost`);
}

const textTable = {
  key: "text",
  title: "Text-to-3D",
  accent: "var(--blue)",
  superGroups: [
    { label: "Descriptive", span: 6 },
    { label: "Parametric", span: 12 },
    { label: "Score / Cost", span: 2 },
  ],
  groups: [
    { label: "JSON", span: 2 },
    { label: "OpenSCAD", span: 2 },
    { label: "Average", span: 2 },
    { label: "JSON", span: 4 },
    { label: "OpenSCAD", span: 4 },
    { label: "Average", span: 4 },
    { label: "Fixed 100", span: 2 },
  ],
  metrics: [
    "Judge", "Valid", "Judge", "Valid", "Judge", "Valid",
    "Geo", "Topo", "Judge", "Valid", "Geo", "Topo", "Judge", "Valid",
    "Geo", "Topo", "Judge", "Valid", "Score", "USD / case",
  ],
  rows: data.rows.map((row) => ({
    model: row.model,
    family: row.family,
    cells: `${row.metrics} ${row.score.toFixed(1)} $${(row.cost_usd / 100).toFixed(3)}`,
  })),
  note: "Scores use the fixed 100-case subset; costs are normalized per case across the four evaluation settings. Updated as evaluations complete.",
};

const paperTextScoreCostTotals = new Map([
  ["GPT-5.5", [84.7, 615.42]],
  ["Gemini 3.1 Pro", [83.5, 145.47]],
  ["Claude Opus 4.6", [83.1, 373.11]],
  ["Kimi K2.6", [80.9, 114.29]],
  ["GLM-5.1", [80.0, 67.51]],
  ["Doubao Seed 2.0 Pro", [76.1, 15.66]],
  ["DeepSeek V4 Pro", [76.2, 13.87]],
  ["Qwen3.6-Plus", [74.8, 27.04]],
  ["MiMo v2.5 Pro", [74.4, 9.85]],
]);

const paperTextStart = input.indexOf('{key:"text",title:"Text-to-3D"');
const paperImageStart = input.indexOf('{key:"image",title:"Image-to-3D"', paperTextStart);
if (paperTextStart < 0 || paperImageStart < 0) throw new Error("paper Text-to-3D table anchors not found");

const paperTextSource = input.slice(paperTextStart, paperImageStart);
let paperTextTable = paperTextSource
  .replace(
    'superGroups:[{label:"Descriptive",span:6},{label:"Parametric",span:12}]',
    'superGroups:[{label:"Descriptive",span:6},{label:"Parametric",span:12},{label:"Score / Cost",span:2}]',
  )
  .replace(
    'groups:[{label:"JSON",span:2},{label:"OpenSCAD",span:2},{label:"Average",span:2},{label:"JSON",span:4},{label:"OpenSCAD",span:4},{label:"Average",span:4}]',
    'groups:[{label:"JSON",span:2},{label:"OpenSCAD",span:2},{label:"Average",span:2},{label:"JSON",span:4},{label:"OpenSCAD",span:4},{label:"Average",span:4},{label:"Paper set",span:2}]',
  )
  .replace(
    'metrics:["Judge","Valid","Judge","Valid","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid"]',
    'metrics:["Judge","Valid","Judge","Valid","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Score","USD / case"]',
  )
  .replace(/,domainRows:\[\{model:"Text2CAD",cells:"[^"]*"\}\]/, "");

for (const [model, [score, totalCost]] of paperTextScoreCostTotals) {
  const escapedModel = model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rowPattern = new RegExp(`(\\{model:"${escapedModel}",family:"[^"]+",cells:")([^"]+)("\\})`);
  if (!rowPattern.test(paperTextTable)) throw new Error(`paper Text-to-3D row missing: ${model}`);
  paperTextTable = paperTextTable.replace(
    rowPattern,
    (_, prefix, cells, suffix) => `${prefix}${cells} ${score.toFixed(1)} $${(totalCost / 400).toFixed(3)}${suffix}`,
  );
}

if (paperTextTable.includes('model:"Text2CAD"') || (paperTextTable.match(/\$\d/g) || []).length !== paperTextScoreCostTotals.size) {
  throw new Error("paper Text-to-3D score/cost patch incomplete");
}

const liveStart = input.indexOf(",p2=[");
const rendererStart = input.indexOf("function m2(", liveStart);
const rendererEnd = input.indexOf("function Ws(", rendererStart);
const assemblyStart = input.indexOf('{key:"assembly",title:"Assembly-3D"', liveStart);
if ([liveStart, rendererStart, rendererEnd, assemblyStart].some((value) => value < 0)) {
  throw new Error("leaderboard bundle anchors not found");
}

let assemblyTable = input.slice(assemblyStart, rendererStart - 2);
const assemblyNote = "Assembly-3D scores use a fixed 100-assembly subset evaluated identically across all models, so they differ from the paper's 203-assembly results. Updated as evaluations complete.";
assemblyTable = assemblyTable.replace(/,note:"[^"]*"}$/, `,note:${JSON.stringify(assemblyNote)}}`);
if (!assemblyTable.endsWith("}")) throw new Error("failed to preserve the Assembly-3D table");

const renderer = readFileSync(rendererPath, "utf8").trim();
const beforeLive = input.slice(0, liveStart).replace(paperTextSource, paperTextTable);
if (beforeLive === input.slice(0, liveStart)) throw new Error("paper Text-to-3D table was not patched");

const patched = beforeLive
  + `,p2=[${JSON.stringify(textTable)},${assemblyTable}];`
  + renderer
  + input.slice(rendererEnd);

if (!patched.includes("Generated assembly and parts") || !patched.includes("P3D-Dataset")) {
  throw new Error("restored Dataset/assembly components were not preserved");
}
if (!data.rows.some((row) => row.model === "Kimi K3") || !assemblyTable.includes("Kimi K3")) {
  throw new Error("Kimi K3 leaderboard rows missing");
}

const outputHash = createHash("sha256").update(patched).digest("hex").slice(0, 8);
const outputName = `index-live-${outputHash}.js`;
writeFileSync(join(root, "assets", outputName), patched);
writeFileSync(indexPath, indexHtml.replace(scriptMatch[1], outputName));
console.log(`patched ${inputName} -> ${outputName}`);
