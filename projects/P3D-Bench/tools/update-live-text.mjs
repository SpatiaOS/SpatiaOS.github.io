#!/usr/bin/env node
// Update only the active Live Text-to-3D table. Paper, Assembly, demos,
// navigation, sections, styles, and media remain byte-identical.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const summaryPath = join(root, "live-text-summary.json");
const indexPath = join(root, "index.html");
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));

if (summary.schema_version !== "p3d-live-text-summary-v1") {
  throw new Error("unexpected live Text summary schema");
}
if (!Array.isArray(summary.rows) || summary.rows.length !== 16) {
  throw new Error("expected exactly 16 live Text rows");
}
for (const [index, row] of summary.rows.entries()) {
  const values = row.metrics.trim().split(/\s+/);
  if (values.length !== 18 || values.some((value) => !Number.isFinite(Number(value)))) {
    throw new Error(`${row.model}: expected 18 numeric metric cells`);
  }
  if (index && summary.rows[index - 1].score < row.score) {
    throw new Error("live Text rows must be score-descending");
  }
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
  rows: summary.rows.map((row) => ({
    model: row.model,
    family: row.family,
    cells: `${row.metrics} ${row.score.toFixed(1)} $${(row.cost_usd / 100).toFixed(3)}`,
  })),
  note: "Scores use the fixed 100-case subset; costs are normalized per case across the four evaluation settings. Updated as evaluations complete.",
};

const indexHtml = readFileSync(indexPath, "utf8");
const scriptMatch = indexHtml.match(/assets\/(index[^"']+\.js)/);
if (!scriptMatch) throw new Error("active application bundle not found");
const inputName = scriptMatch[1];
const inputPath = join(root, "assets", inputName);
const input = readFileSync(inputPath, "utf8");
const liveStart = input.indexOf(",p2=[");
const textStart = liveStart + ",p2=[".length;
const assemblyStart = input.indexOf('{key:"assembly",title:"Assembly-3D"', textStart);
if (liveStart < 0 || assemblyStart < 0 || input[assemblyStart - 1] !== ",") {
  throw new Error("live leaderboard anchors not found");
}

const patched = input.slice(0, textStart) + JSON.stringify(textTable) + "," + input.slice(assemblyStart);
if (patched.slice(0, textStart) !== input.slice(0, textStart)) throw new Error("prefix drift");
const patchedAssemblyStart = patched.indexOf(
  '{key:"assembly",title:"Assembly-3D"',
  textStart,
);
if (patchedAssemblyStart < 0 || patched.slice(patchedAssemblyStart) !== input.slice(assemblyStart)) {
  throw new Error("Assembly or later bundle content drift");
}
const outputHash = createHash("sha256").update(patched).digest("hex").slice(0, 8);
const outputName = `index-live-text-${outputHash}.js`;
writeFileSync(join(root, "assets", outputName), patched);
writeFileSync(indexPath, indexHtml.replace(scriptMatch[1], outputName));
console.log(`updated Live Text only: ${inputName} -> ${outputName}`);
