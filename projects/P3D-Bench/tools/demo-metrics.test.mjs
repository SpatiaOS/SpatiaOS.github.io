import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { demoBucketScore } from './demo-metrics.mjs';
const read = name => JSON.parse(readFileSync(new URL(`../demo/${name}`, import.meta.url)));
const near = (a, b) => assert(Math.abs(a-b) < 1e-10, `${a} != ${b}`);

test('all 180 spatial cases reproduce the frozen paper Geo and Judge buckets', () => {
  for (const run of read('spatial-live.json').runs) {
    const raw = {...run, buckets: undefined};
    near(demoBucketScore(raw, 'geometry'), run.buckets.geo);
    near(demoBucketScore(raw, 'judge'), run.buckets.judge);
    if (run.buckets.part !== undefined && run.buckets.part !== null) near(demoBucketScore(raw, 'part'), run.buckets.part);
  }
});
test('robotic arm metrics use fine F-score and 1–10 Judge normalization', () => {
  const run = read('spatial-live.json').runs.find(r => r.id === 'image2cad_33970_c040ca8f_cadquery_gpt6_astra_local');
  const raw = {...run, buckets: undefined};
  near(demoBucketScore(raw, 'geometry'), .58375);
  near(demoBucketScore(raw, 'judge'), 17/27);
  raw.metrics = {...raw.metrics, f_score_005: 0};
  near(demoBucketScore(raw, 'geometry'), .58375);
});
test('Text parametric questions have a 1:2 weight, including a measured zero', () => {
  const run = {task:'text2cad',spec:'parametric',valid:true,metrics:{qa_semantic:1,qa_parametric:.875}};
  near(demoBucketScore(run,'judge'), 11/12);
  run.metrics.qa_parametric=0;
  near(demoBucketScore(run,'judge'), 1/3);
});
test('Judge raw rating one maps to zero and unavailable IoU is omitted', () => {
  const run = {task:'image2cad',spec:'image',valid:true,metrics:{judge_geometry:1,judge_aesthetics:1,judge_semantic:1,chamfer_distance:.02,f_score_001:.3,normal_consistency:.9,iou_voxel:null}};
  assert.equal(demoBucketScore(run,'judge'),0);
  near(demoBucketScore(run,'geometry'),.4);
  run.metrics.iou_voxel=0;
  near(demoBucketScore(run,'geometry'),.3);
  run.valid=false;
  assert.equal(demoBucketScore(run,'geometry'),0);
});
test('failed Part fidelity gate stays unmeasured even with diagnostic part values', () => {
  assert.equal(demoBucketScore({task:'text_image2cad',spec:'image_text',valid:true,buckets:{part:null},metrics:{part_match_f1:1,part_fscore_mean:1}},'part'),null);
});
