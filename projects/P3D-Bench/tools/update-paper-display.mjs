#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readActiveBundle, writeActiveBundle } from './live-tables.mjs';
import { demoBucketScore } from './demo-metrics.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sha = path => createHash('sha256').update(readFileSync(join(root, path))).digest('hex').slice(0, 12);
const assets = JSON.parse(readFileSync(join(root, 'figures/paper-assets.json'), 'utf8'));
const original = readActiveBundle(root);
let code = original.input;
const marker = '/* paper-demo-metrics */';
const start = code.includes(marker) ? code.indexOf(marker) : code.indexOf('function F2(');
const end = code.indexOf('function B2(', start);
if (start < 0 || end < start) throw new Error('Demo metric boundaries changed');
code = code.slice(0, start) + `${marker}\n${demoBucketScore.toString()}\nfunction F2(run,bucket){return demoBucketScore(run,bucket.key)}\n` + code.slice(end);
code = code.replace('l.score.toFixed(3)', '(l.score*100).toFixed(1)')
  .replace('["pred_open_edge_ratio","NoOE"]', '["pred_open_edge_ratio","NoOE (%)"]')
  .replace('(e===0?1:0).toFixed(3)', '(e===0?100:0).toFixed(1)')
  .replace('||s==="qa_parametric"&&typeof e=="number"&&e<=0', '');
if (!code.includes('["iou_csg","IoU"]')) code = code.replace('["iou_voxel","IoU"]', '["iou_csg","IoU"],["iou_voxel","IoU"]');
function refresh(text) {
  text = text.replace(/fig2_leaderboard-[a-f0-9]+\.png/g, assets.overview.png.split('/').at(-1))
    .replace(/fig_tasks_grouped_bars\.(svg|pdf)\?v=[^"'\s]+/g, (_, ext) => `fig_tasks_grouped_bars.${ext}?v=${sha('figures/fig_tasks_grouped_bars.svg')}`);
  for (const name of ['manifest.json', 'text-live-fixed100.json', 'spatial-live.json', 'spatial-assemblies.json']) {
    text = text.replace(new RegExp(name.replaceAll('.', '\\.') + '\\?v=[^"\\s]+', 'g'), `${name}?v=${sha('demo/' + name)}`);
  }
  for (const [oldName, newName] of [['GPT-6', 'GPT-6 Astra'], ['Qwen 3.8 Max', 'Qwen3.8-Max'], ['GLM 5.3 Flash', 'GLM-5.3-Flash']]) {
    text = text.replaceAll(JSON.stringify(oldName), JSON.stringify(newName));
  }
  return text;
}
code = refresh(code);
const name = code === original.input ? original.name : writeActiveBundle(root, original, code, 'paper');
const sourcePath = join(root, '../../.github/site-src/src/main.tsx');
writeFileSync(sourcePath, refresh(readFileSync(sourcePath, 'utf8')));
const htmlPath = join(root, 'index.html');
writeFileSync(htmlPath, readFileSync(htmlPath, 'utf8').replace(/leaderboard-overrides\.css\?v=[^"\s]+/, `leaderboard-overrides.css?v=${sha('assets/leaderboard-overrides.css')}`));
console.log(`Paper figures, demo scoring, labels and cache versions: ${name}`);
