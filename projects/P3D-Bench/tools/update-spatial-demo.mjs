#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readActiveBundle, readLiveTables, writeActiveBundle } from "./live-tables.mjs";
import { validateSpatialDemo, mergeSpatialManifest } from "./spatial-demo.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const raw = readFileSync(join(root, "demo/spatial-live.json"), "utf8");
validateSpatialDemo(JSON.parse(raw));
const hash = value => createHash("sha256").update(value).digest("hex").slice(0, 12);
const version = hash(raw);
const partsVersion = hash(readFileSync(join(root, "demo/spatial-assemblies.json")));
const original = readActiveBundle(root);
const prefix = `/* spatial-demo-data-adapter-v1 */\n${validateSpatialDemo.toString()}\n${mergeSpatialManifest.toString()}\n`;
const loader = `async function loadSpatialDemo(base){try{const response=await fetch(Vn("spatial-live.json?v=${version}"));if(!response.ok)throw new Error("Spatial demo unavailable");return mergeSpatialManifest(base,await response.json())}catch{return base}}\n`;
const swaps = [
  ['e(mergeLiveTextManifest(K,await R.json()))}catch{e(K)}}', 'e(await loadSpatialDemo(mergeLiveTextManifest(K,await R.json())))}catch{e(await loadSpatialDemo(K))}}'],
  ['fetch(Vn("complex_assemblies.json"))', `fetch(Vn("spatial-assemblies.json?v=${partsVersion}"))`],
  ['function i2(s){const e=["text2cad","image2cad"]', 'function i2(s){const e=["text_image2cad","text2cad","image2cad"]'],
  ['if(p==="text2cad"&&s.text_showcase)return s.text_showcase;', 'if(p==="text2cad"&&s.text_showcase)return s.text_showcase;if(s.spatial_showcases?.[p])return s.spatial_showcases[p];'],
];
if (original.input.startsWith(prefix + loader) && swaps.every(([, after]) => original.input.includes(after))) {
  console.log(`Spatial demo already current: ${original.name}`);
  process.exit(0);
}
let input = original.input;
if (input.includes("spatial-demo-data-adapter-v1")) {
  if (!input.startsWith(prefix)) throw new Error("existing adapter changed; review update boundaries");
  input = input.slice(prefix.length);
  const oldLoader = input.match(/^async function loadSpatialDemo\(base\)\{[^\n]+\}\n/);
  if (!oldLoader) throw new Error("existing loader boundary changed");
  input = input.slice(oldLoader[0].length);
  input = input.replace(/fetch\(Vn\("spatial-assemblies\.json\?v=[a-f0-9]+"\)\)/, swaps[1][0]);
  for (const [before, after] of swaps.filter((_, i) => i !== 1)) {
    if (input.split(after).length !== 2) throw new Error("existing runtime boundary changed");
    input = input.replace(after, before);
  }
}
let patched = input;
for (const [before, after] of swaps) {
  if (patched.split(before).length !== 2) throw new Error(`runtime boundary changed: ${before}`);
  patched = patched.replace(before, after);
}
let restored = patched;
for (const [before, after] of swaps) restored = restored.replace(after, before);
if (restored !== input) throw new Error("unrelated application bytes changed");
patched = prefix + loader + patched;
if (JSON.stringify(readLiveTables(original.input).entries) !== JSON.stringify(readLiveTables(patched).entries)) throw new Error("leaderboard changed");
const name = writeActiveBundle(root, original, patched, "spatial-demo");
const sourcePath = join(root, "../../.github/site-src/src/main.tsx");
let source = readFileSync(sourcePath, "utf8");
source = source.replace(/spatial-live\.json\?v=[a-f0-9]+/, `spatial-live.json?v=${version}`)
  .replace(/spatial-assemblies\.json\?v=[a-f0-9]+/, `spatial-assemblies.json?v=${partsVersion}`);
writeFileSync(sourcePath, source);
writeFileSync(join(root, "../../.github/site-src/src/spatialLiveDemo.json"), raw);
console.log(`updated current Image/Assembly demos: ${original.name} -> ${name}`);
