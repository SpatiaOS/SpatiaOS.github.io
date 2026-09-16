#!/usr/bin/env node
// Update the active Text table and its scoped renderer behavior.
// Other task data, demos, navigation, sections, styles and media stay identical.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readActiveBundle, replaceLiveTable, writeActiveBundle } from "./live-tables.mjs";
import { validateTextSummary, textCost, textNativeRows } from "./text-table.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const summaryPath = join(root, "live-text-summary.json");
const indexPath = join(root, "index.html");
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));

validateTextSummary(summary);

const textTable = {
  key: "text",
  title: "Text-to-3D",
  accent: "var(--blue)",
  superGroups: [
    { label: "Score / Cost", span: 2 },
    { label: "Descriptive", span: 6 },
    { label: "Parametric", span: 12 },
  ],
  groups: [
    { label: "Fixed 100", span: 2 },
    { label: "JSON", span: 2 },
    { label: "OpenSCAD", span: 2 },
    { label: "Average", span: 2 },
    { label: "JSON", span: 4 },
    { label: "OpenSCAD", span: 4 },
    { label: "Average", span: 4 },
  ],
  metrics: [
    "Score", "USD/gen.",
    "Judge", "Valid", "Judge", "Valid", "Judge", "Valid",
    "Geo", "Topo", "Judge", "Valid", "Geo", "Topo", "Judge", "Valid",
    "Geo", "Topo", "Judge", "Valid",
  ],
  rows: summary.rows.map((row) => ({
    model: row.model,
    model_id: row.model_id,
    family: row.family,
    cells: `${row.score.toFixed(2)} ${textCost(row)} ${row.metrics}`,
  })),
  domainRows: textNativeRows(summary),
  note: "",
};

const original = readActiveBundle(root);
let patched = replaceLiveTable(original.input, textTable);
const start = patched.indexOf("function m2(");
const end = patched.indexOf("function Ws(", start);
if (start < 0 || end < start || patched.indexOf("function m2(", start + 1) >= 0
    || !patched.slice(start, end).includes("function x2({ sub })")) {
  throw new Error("active leaderboard renderer boundary changed; inspect before updating");
}
const renderer = readFileSync(join(root, "leaderboard-renderer.fragment.js"), "utf8").trimEnd();
patched = patched.slice(0, start) + renderer + patched.slice(end);
// Retain F@.05 in raw evidence, but retire it from Text demo metric cards.
const oldMetricFilter = 'function Ox(s,e,i){return!(!jr(e)||s==="qa_parametric"';
const newMetricFilter = 'function Ox(s,e,i){return!(!jr(e)||i.task==="text2cad"&&s==="f_score_005"||s==="qa_parametric"';
if (!patched.includes(newMetricFilter)) {
  if (patched.split(oldMetricFilter).length !== 2) throw new Error("demo metric filter changed; inspect first");
  patched = patched.replace(oldMetricFilter, newMetricFilter);
}
const outputName = writeActiveBundle(root, original, patched, "text");
writeFileSync(join(root, "../../.github/site-src/src/liveTextSummary.json"), readFileSync(summaryPath, "utf8"));
console.log(`updated Live Text only: ${original.name} -> ${outputName}`);
