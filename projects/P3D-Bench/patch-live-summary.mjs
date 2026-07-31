#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const indexPath = join(root, "index.html");
const dataPath = join(root, "live-text-summary.json");
const assemblyDataPath = join(root, "live-assembly-summary.json");
const rendererPath = join(root, "leaderboard-renderer.fragment.js");
const expectedInputSha256 = "fdf9066e56a7986c68c29c14b0169714d0805e43813bf825bf24096de77f98ed";
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
if (data.rows.length !== 15) throw new Error(`expected 15 Text-to-3D rows, got ${data.rows.length}`);
for (const [index, row] of data.rows.entries()) {
  if (row.metrics.trim().split(/\s+/).length !== 18) throw new Error(`${row.model}: expected 18 metric cells`);
  if (index > 0 && data.rows[index - 1].score < row.score) throw new Error("rows must be score-descending");
  if (!(row.cost_usd > 0)) throw new Error(`${row.model}: invalid cost`);
}

const assemblyData = JSON.parse(readFileSync(assemblyDataPath, "utf8"));
if (assemblyData.schema_version !== "p3d-live-assembly-summary-v1") throw new Error("unsupported live assembly summary schema");
for (const [label, source] of [["score", assemblyData.score_source], ["cost", assemblyData.cost_source]]) {
  if (!source || !/^[a-z0-9][a-z0-9-]{7,63}$/.test(source.id) || !/^[0-9a-f]{64}$/.test(source.sha256)) {
    throw new Error(`invalid assembly ${label} source provenance`);
  }
}
if (assemblyData.rows.length !== 14) throw new Error(`expected 14 Assembly-3D rows, got ${assemblyData.rows.length}`);
for (const [index, row] of assemblyData.rows.entries()) {
  if (index > 0 && assemblyData.rows[index - 1].score < row.score) throw new Error("assembly rows must be score-descending");
  if (!(row.cost_usd > 0)) throw new Error(`${row.model}: invalid assembly cost`);
}
const assemblyCostByModel = new Map(assemblyData.rows.map((row) => [row.model, row]));

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

const paperImageScoreCostTotals = new Map([
  ["GPT-5.5", [67.5, 1141.5]],
  ["Gemini 3.1 Pro", [66.7, 279.7448]],
  ["Claude Opus 4.6", [62.0, 640.4595]],
  ["Kimi K2.6", [59.2, 102.379205]],
  ["GLM 5V Turbo", [49.1, 29.19464]],
  ["Qwen3.6-Plus", [47.5, 39.178717]],
  ["MiMo v2 Omni", [45.2, 2.582888]],
  ["Doubao Seed 2.0 Pro", [43.7, 17.190236]],
]);

const paperAssemblyScoreCostTotals = new Map([
  ["GPT-5.5", [68.1, 450.962]],
  ["Gemini 3.1 Pro", [65.9, 110.5444]],
  ["Claude Opus 4.6", [60.0, 322.044]],
  ["Kimi K2.6", [55.2, 77.405749]],
  ["MiMo v2 Omni", [37.9, 1.525888]],
  ["Qwen3.6-Plus", [36.6, 22.10299]],
  ["GLM 5V Turbo", [34.2, 20.932]],
  ["Doubao Seed 2.0 Pro", [32.7, 8.26677]],
]);

function appendPaperScoreCost(table, rows, caseCount, task) {
  for (const [model, [score, totalCost]] of rows) {
    const escapedModel = model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rowPattern = new RegExp(`(\\{model:"${escapedModel}",family:"[^"]+",cells:")([^"]+)("\\})`);
    if (!rowPattern.test(table)) throw new Error(`paper ${task} row missing: ${model}`);
    table = table.replace(
      rowPattern,
      (_, prefix, cells, suffix) => `${prefix}${cells} ${score.toFixed(1)} $${(totalCost / caseCount).toFixed(3)}${suffix}`,
    );
  }
  if ((table.match(/\$\d/g) || []).length !== rows.size) throw new Error(`paper ${task} score/cost patch incomplete`);
  return table;
}

const paperTextStart = input.indexOf('{key:"text",title:"Text-to-3D"');
const paperImageStart = input.indexOf('{key:"image",title:"Image-to-3D"', paperTextStart);
const paperAssemblyStart = input.indexOf('{key:"assembly",title:"Assembly-3D"', paperImageStart);
const liveStart = input.indexOf(",p2=[", paperAssemblyStart);
if ([paperTextStart, paperImageStart, paperAssemblyStart, liveStart].some((value) => value < 0)) {
  throw new Error("paper leaderboard anchors not found");
}

const paperTextSource = input.slice(paperTextStart, paperImageStart);
const paperImageSource = input.slice(paperImageStart, paperAssemblyStart);
const paperAssemblySource = input.slice(paperAssemblyStart, liveStart);
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

paperTextTable = appendPaperScoreCost(paperTextTable, paperTextScoreCostTotals, 400, "Text-to-3D");
if (paperTextTable.includes('model:"Text2CAD"')) throw new Error("incomplete Text2CAD paper row was not removed");

let paperImageTable = paperImageSource
  .replace(
    'groups:[{label:"CadQuery",span:4},{label:"OpenSCAD",span:4},{label:"Three.js",span:4},{label:"Average",span:4}]',
    'groups:[{label:"CadQuery",span:4},{label:"OpenSCAD",span:4},{label:"Three.js",span:4},{label:"Average",span:4},{label:"Score / Cost",span:2}]',
  )
  .replace(
    'metrics:["Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid"]',
    'metrics:["Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Geo","Topo","Judge","Valid","Score","USD / case"]',
  )
  .replace(/,domainRows:\[\{model:"Cadrille"[^\]]*\]/, "");
paperImageTable = appendPaperScoreCost(paperImageTable, paperImageScoreCostTotals, 400, "Image-to-3D");
if (paperImageTable.includes('model:"Cadrille"') || paperImageTable.includes('model:"CAD-Coder"')) {
  throw new Error("incomplete Image-to-3D baseline rows were not removed");
}

let paperAssemblyTable = paperAssemblySource
  .replace(
    'groups:[{label:"CadQuery",span:5},{label:"OpenSCAD",span:5},{label:"Average",span:5}]',
    'groups:[{label:"CadQuery",span:5},{label:"OpenSCAD",span:5},{label:"Average",span:5},{label:"Score / Cost",span:2}]',
  )
  .replace(
    'metrics:["Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid"]',
    'metrics:["Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Score","USD / case"]',
  );
paperAssemblyTable = appendPaperScoreCost(paperAssemblyTable, paperAssemblyScoreCostTotals, 203, "Assembly-3D");

const rendererStart = input.indexOf("function m2(", liveStart);
const rendererEnd = input.indexOf("function Ws(", rendererStart);
const assemblyStart = input.indexOf('{key:"assembly",title:"Assembly-3D"', liveStart);
if ([liveStart, rendererStart, rendererEnd, assemblyStart].some((value) => value < 0)) {
  throw new Error("leaderboard bundle anchors not found");
}

let assemblyTable = input.slice(assemblyStart, rendererStart - 2);

// Inject the Score / Cost column into the live Assembly-3D table (parallel to the
// live Text-to-3D table): Score is the mean of the displayed Average Geo/Topo/Judge/Part,
// cost is the estimated per-case USD (stored x100 in the summary, displayed /100).
assemblyTable = assemblyTable.replace(
  'groups:[{label:"CadQuery",span:5},{label:"OpenSCAD",span:5},{label:"Average",span:5}]',
  'groups:[{label:"CadQuery",span:5},{label:"OpenSCAD",span:5},{label:"Average",span:5},{label:"Score / Cost",span:2}]',
);
assemblyTable = assemblyTable.replace(
  'metrics:["Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid"]',
  'metrics:["Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Geo","Topo","Judge","Part","Valid","Score","USD / case"]',
);
if (!assemblyTable.includes('{label:"Score / Cost",span:2}') || !assemblyTable.includes('"Score","USD / case"')) {
  throw new Error("live Assembly-3D header was not patched");
}
let assemblyPatchedRows = 0;
for (const [model, summaryRow] of assemblyCostByModel) {
  const escapedModel = model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rowPattern = new RegExp(`(\\{model:"${escapedModel}",family:"[^"]+",cells:")([^"]+)("\\})`);
  if (!rowPattern.test(assemblyTable)) throw new Error(`live assembly row missing: ${model}`);
  assemblyTable = assemblyTable.replace(rowPattern, (_, prefix, cells, suffix) => {
    const values = cells.trim().split(/\s+/).map((token) => token.replace(/[!^]$/, ""));
    if (values.length !== 15) throw new Error(`${model}: expected 15 assembly metric cells`);
    const avg = [10, 11, 12, 13].map((i) => Number(values[i]));
    if (avg.some((value) => !Number.isFinite(value))) throw new Error(`${model}: unreadable assembly average cells`);
    const cellScore = (avg[0] + avg[1] + avg[2] + avg[3]) / 4 * 100;
    if (Math.abs(cellScore - summaryRow.score) > 0.05) {
      throw new Error(`${model}: summary score ${summaryRow.score} != cells ${cellScore.toFixed(4)}`);
    }
    assemblyPatchedRows += 1;
    return `${prefix}${cells} ${summaryRow.score.toFixed(1)} $${(summaryRow.cost_usd / 100).toFixed(3)}${suffix}`;
  });
}
if (assemblyPatchedRows !== assemblyData.rows.length) throw new Error("live Assembly-3D score/cost patch incomplete");

const assemblyNote = "Assembly-3D scores use a fixed 100-assembly subset evaluated identically across all models, so they differ from the paper's 203-assembly results. Score is the mean of the Average Geo / Topo / Judge / Part; cost is the estimated USD per case. Updated as evaluations complete.";
assemblyTable = assemblyTable.replace(/,note:"[^"]*"}$/, `,note:${JSON.stringify(assemblyNote)}}`);
if (!assemblyTable.endsWith("}")) throw new Error("failed to preserve the Assembly-3D table");

const renderer = readFileSync(rendererPath, "utf8").trim();
const beforeLive = input.slice(0, liveStart)
  .replace(paperTextSource, paperTextTable)
  .replace(paperImageSource, paperImageTable)
  .replace(paperAssemblySource, paperAssemblyTable);
if (beforeLive === input.slice(0, liveStart)) throw new Error("paper leaderboard tables were not patched");

const patched = beforeLive
  + `,p2=[${JSON.stringify(textTable)},${assemblyTable}];`
  + renderer
  + input.slice(rendererEnd);

if (!patched.includes("Generated assembly and parts") || !patched.includes("P3D-Dataset")) {
  throw new Error("restored Dataset/assembly components were not preserved");
}
if (!data.rows.some((row) => row.model === "GPT-5.6 Sol") || !data.rows.some((row) => row.model === "Kimi K3") || !assemblyTable.includes("Kimi K3")) {
  throw new Error("expected live leaderboard rows missing");
}

const outputHash = createHash("sha256").update(patched).digest("hex").slice(0, 8);
const outputName = `index-live-${outputHash}.js`;
writeFileSync(join(root, "assets", outputName), patched);
writeFileSync(indexPath, indexHtml.replace(scriptMatch[1], outputName));
console.log(`patched ${inputName} -> ${outputName}`);
