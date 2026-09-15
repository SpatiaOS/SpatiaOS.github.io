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
const manifestRaw = readFileSync(join(root, "demo/manifest.json"), "utf8");
const manifestVersion = createHash("sha256").update(manifestRaw).digest("hex").slice(0, 12);
const original = readActiveBundle(root);
const beforeFetch = 'fetch(Vn("manifest.json?v=textcomplete0046")).then(K=>K.ok?K.json():vd).then(K=>e(K)).catch(()=>e(vd))';
const afterFetch = `fetch(Vn("manifest.json?v=${manifestVersion}")).then(K=>K.ok?K.json():vd).then(async K=>{try{const R=await fetch(Vn("text-live-fixed100.json?v=${version}"));if(!R.ok)throw new Error("Text live data unavailable");e(mergeLiveTextManifest(K,await R.json()))}catch{e(K)}}).catch(()=>e(vd))`;
const beforeAbstract = "We evaluate frontier MLLMs and text-only LLMs on 400 text cases, 400 image cases and 203 annotated assemblies, with domain-specific models as reference points.";
const afterAbstract = "We evaluate frontier MLLMs and text-only LLMs on a fixed 100-case subset of the 400-case text dataset, 400 image cases and 203 annotated assemblies, with domain-specific models as reference points on their evaluated tasks.";
const beforeShow = 'return e.map(p=>{const m=s.cases.filter(M=>M.task===p),d=i[p]||[],_=r2[p]??9;';
const afterShow = 'return e.map(p=>{if(p==="text2cad"&&s.text_showcase)return s.text_showcase;const m=s.cases.filter(M=>M.task===p),d=i[p]||[],_=r2[p]??9;';
const beforeProtocol = 'onChange:we=>se(Un(O.filter(Ke=>Ke.model===z&&Ke.spec===we)))';
const afterProtocol = 'onChange:we=>se((l==="text2cad"?Un(B.filter(Ke=>Ke.model===z&&Ke.spec===we)):void 0)||Un(O.filter(Ke=>Ke.model===z&&Ke.spec===we)))';
const prefix = `/* text-fixed100-data-adapter-v1 */\n${validateLiveTextDemo.toString()}\n${mergeLiveTextManifest.toString()}\n`;
const withSpatial = afterFetch.replace('e(mergeLiveTextManifest(K,await R.json()))}catch{e(K)}}',
  'e(await loadSpatialDemo(mergeLiveTextManifest(K,await R.json())))}catch{e(await loadSpatialDemo(K))}}');
const withSpatialShow = afterShow.replace('return s.text_showcase;', 'return s.text_showcase;if(s.spatial_showcases?.[p])return s.spatial_showcases[p];');
if (original.input.includes(prefix) && (original.input.includes(afterFetch) || original.input.includes(withSpatial)) && (original.input.includes(afterShow) || original.input.includes(withSpatialShow)) && original.input.includes(afterAbstract) && original.input.includes(afterProtocol)) {
  console.log(`Text demo already current: ${original.name}`);
  process.exit(0);
}
if (original.input.split(beforeFetch).length !== 2 || original.input.split(beforeShow).length !== 2
    || original.input.split(beforeAbstract).length !== 2
    || original.input.split(beforeProtocol).length !== 2
    || original.input.includes('text-fixed100-data-adapter-v1')) throw new Error("runtime boundaries changed; do not overwrite");
const patched = prefix + original.input.replace(beforeFetch, afterFetch).replace(beforeShow, afterShow).replace(beforeAbstract, afterAbstract).replace(beforeProtocol, afterProtocol);
if (patched.slice(prefix.length).replace(afterFetch, beforeFetch).replace(afterShow, beforeShow).replace(afterAbstract, beforeAbstract).replace(afterProtocol, beforeProtocol) !== original.input) throw new Error("unrelated runtime bytes changed");
const a = readLiveTables(original.input), b = readLiveTables(patched);
if (JSON.stringify(a.entries) !== JSON.stringify(b.entries)) throw new Error("leaderboard data changed");
const name = writeActiveBundle(root, original, patched, "text-demo");
writeFileSync(join(root, "../../.github/site-src/src/textLiveDemo.json"), raw);
const sourcePath = join(root, "../../.github/site-src/src/main.tsx");
const source = readFileSync(sourcePath, "utf8")
  .replace(/fetch\(asset\("manifest\.json(?:\?v=[^"]+)?"\)\)/, `fetch(asset("manifest.json?v=${manifestVersion}"))`)
  .replace(/fetch\(asset\("text-live-fixed100\.json\?v=[^"]+"\)\)/, `fetch(asset("text-live-fixed100.json?v=${version}"))`)
  .replace(beforeAbstract, afterAbstract);
writeFileSync(sourcePath, source);
console.log(`updated Text demo data only: ${original.name} -> ${name}`);
