#!/usr/bin/env node
// Update only the active Live Text-to-3D table. Paper, Assembly, demos,
// navigation, sections, styles, and media remain byte-identical.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readActiveBundle, replaceLiveTable, writeActiveBundle } from "./live-tables.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const summaryPath = join(root, "live-text-summary.json");
const indexPath = join(root, "index.html");
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));

if (summary.schema_version !== "p3d-live-text-summary-v1") {
  throw new Error("unexpected live Text summary schema");
}
if (!Array.isArray(summary.rows) || summary.rows.length !== 17) {
  throw new Error("expected exactly 17 live Text rows");
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

const original = readActiveBundle(root);
const patched = replaceLiveTable(original.input, textTable);
const outputName = writeActiveBundle(root, original, patched, "text");
writeFileSync(join(root, "../../.github/site-src/src/liveTextSummary.json"), readFileSync(summaryPath, "utf8"));
console.log(`updated Live Text only: ${original.name} -> ${outputName}`);
