#!/usr/bin/env node
// Publish the verified Assembly cohort first, preserving every other table.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAssemblyTable, readActiveBundle, replaceLiveTable, writeActiveBundle } from "./live-tables.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const raw = readFileSync(join(root, "live-assembly-summary.json"), "utf8");
const table = buildAssemblyTable(JSON.parse(raw));
const original = readActiveBundle(root);
let patched = replaceLiveTable(original.input, table, { first: true });
// The existing family registry needs one additional icon for the new cohort.
const family = 'grok:{color:"#202123",icon:"icons/src/grok.svg"},';
if (!patched.includes(family)) {
  const anchor = "const Dx={openai:";
  if (patched.split(anchor).length !== 2) throw new Error("model-family registry anchor changed");
  patched = patched.replace(anchor, `const Dx={${family}openai:`);
}
const name = writeActiveBundle(root, original, patched, "assembly");
writeFileSync(join(root, "../../.github/site-src/src/liveAssemblySummary.json"), raw);
console.log(`updated Assembly first: ${original.name} -> ${name}`);
