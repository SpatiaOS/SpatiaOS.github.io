#!/usr/bin/env node
// Restricted runtime data adapter: preserve the existing renderer and other tasks.
import {readFileSync, writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {readActiveBundle, readLiveTables, writeActiveBundle} from "./live-tables.mjs";
import {validateLiveTextDemo, mergeLiveTextManifest} from "./text-demo.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const raw = readFileSync(join(root, "demo/text-live-fixed100.json"), "utf8");
const overlay = JSON.parse(raw);
validateLiveTextDemo(overlay);
const version = createHash("sha256").update(raw).digest("hex").slice(0, 12);
const original = readActiveBundle(root);
const beforeFetch = 'fetch(Vn("manifest.json?v=textcomplete0046")).then(K=>K.ok?K.json():vd).then(K=>e(K)).catch(()=>e(vd))';
const afterFetch = `fetch(Vn("manifest.json?v=textcomplete0046")).then(K=>K.ok?K.json():vd).then(async K=>{const R=await fetch(Vn("text-live-fixed100.json?v=${version}"));if(!R.ok)throw new Error("Text live data unavailable");e(mergeLiveTextManifest(K,await R.json()))}).catch(()=>e(vd))`;
const beforeShow = 'return e.map(p=>{const m=s.cases.filter(M=>M.task===p),d=i[p]||[],_=r2[p]??9;';
const afterShow = 'return e.map(p=>{if(p==="text2cad"&&s.text_showcase)return s.text_showcase;const m=s.cases.filter(M=>M.task===p),d=i[p]||[],_=r2[p]??9;';
const prefix = `/* text-fixed100-data-adapter-v1 */\n${validateLiveTextDemo.toString()}\n${mergeLiveTextManifest.toString()}\n`;
if (original.input.startsWith(prefix) && original.input.includes(afterFetch) && original.input.includes(afterShow)) {
  console.log(`Text demo already current: ${original.name}`);
  process.exit(0);
}
if (original.input.startsWith(prefix) && original.input.includes(afterShow)) {
  const pattern = /text-live-fixed100\.json\?v=[0-9a-f]{12}/g;
  const matches = [...original.input.matchAll(pattern)];
  if (matches.length !== 1) throw new Error("ambiguous Text demo cache key");
  const patched = original.input.replace(pattern, `text-live-fixed100.json?v=${version}`);
  if (!patched.includes(afterFetch)) throw new Error("Text demo fetch adapter changed");
  const name = writeActiveBundle(root, original, patched, "text-demo");
  writeFileSync(join(root, "../../.github/site-src/src/textLiveDemo.json"), raw);
  console.log(`refreshed Text demo data version only: ${original.name} -> ${name}`);
  process.exit(0);
}
if (original.input.split(beforeFetch).length !== 2 || original.input.split(beforeShow).length !== 2
    || original.input.includes('text-fixed100-data-adapter-v1')) throw new Error("runtime boundaries changed; do not overwrite");
const patched = prefix + original.input.replace(beforeFetch, afterFetch).replace(beforeShow, afterShow);
if (patched.slice(prefix.length).replace(afterFetch, beforeFetch).replace(afterShow, beforeShow) !== original.input) throw new Error("unrelated runtime bytes changed");
const a = readLiveTables(original.input), b = readLiveTables(patched);
if (JSON.stringify(a.entries) !== JSON.stringify(b.entries)) throw new Error("leaderboard data changed");
const name = writeActiveBundle(root, original, patched, "text-demo");
writeFileSync(join(root, "../../.github/site-src/src/textLiveDemo.json"), raw);
console.log(`updated Text demo data only: ${original.name} -> ${name}`);
