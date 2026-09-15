#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAssemblyTable, readActiveBundle, replaceLiveTable, writeActiveBundle } from "./live-tables.mjs";
import { buildImageTable } from "./image-table.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const imageRaw = readFileSync(join(root, "live-image-summary.json"), "utf8");
const assemblyRaw = readFileSync(join(root, "live-assembly-summary.json"), "utf8");
const original = readActiveBundle(root);
let patched = replaceLiveTable(original.input, buildAssemblyTable(JSON.parse(assemblyRaw)), { first: true });
patched = replaceLiveTable(patched, buildImageTable(JSON.parse(imageRaw)), { append: true });
// Retire the previous expandable format tables from existing release bundles.
const extension = `
      sub.extraTables?.length ? D.jsxs("details", {
        className: "rt-extra-formats",
        children: [
          D.jsx("summary", { children: "Additional formats · Gemini 3.8 Flash" }),
          sub.extraTables.map((table) => D.jsx(x2, { sub: table }, table.key)),
        ],
      }) : null,`;
if (patched.includes(extension)) {
  if (patched.split(extension).length !== 2) throw new Error("leaderboard renderer anchor changed");
  patched = patched.replace(extension, "");
}
const name = writeActiveBundle(root, original, patched, "image-assembly");
writeFileSync(join(root, "../../.github/site-src/src/liveImageSummary.json"), imageRaw);
writeFileSync(join(root, "../../.github/site-src/src/liveAssemblySummary.json"), assemblyRaw);
console.log(`updated Image/Assembly: ${original.name} -> ${name}`);
