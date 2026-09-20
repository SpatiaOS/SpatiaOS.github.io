// Shared by the source app and the deployed static bundle. Scores stay in [0, 1].
export function demoBucketScore(run, key) {
  const m = run.metrics || {};
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const clamp = value => finite(value) ? Math.max(0, Math.min(1, value)) : null;
  const mean = values => {
    const measured = values.filter(finite);
    return measured.length ? measured.reduce((a, b) => a + b, 0) / measured.length : null;
  };
  const names = {geometry: 'geo', topology: 'topo', judge: 'judge', part: 'part'};
  const stored = run.buckets?.[names[key]];
  if (Object.prototype.hasOwnProperty.call(run.buckets || {}, names[key])) {
    return stored === null ? null : run.valid === false ? 0 : clamp(stored);
  }
  let score = null;
  if (key === 'geometry') {
    score = mean([
      finite(m.chamfer_distance) ? clamp(1 - m.chamfer_distance / 0.01) : null,
      clamp(m.f_score_001), clamp(m.normal_consistency),
      clamp(finite(m.iou_csg) ? m.iou_csg : m.iou_voxel),
    ]);
  } else if (key === 'topology') {
    score = finite(m.topology) ? clamp(m.topology) : mean([
      finite(m.no_open_edge_score) ? clamp(m.no_open_edge_score)
        : finite(m.no_open_edge_ratio) ? clamp(m.no_open_edge_ratio)
        : finite(m.pred_open_edge_ratio) ? (m.pred_open_edge_ratio === 0 ? 1 : 0) : null,
      finite(m.pred_inverted_normal_ratio) ? clamp(1 - m.pred_inverted_normal_ratio) : null,
      finite(m.pred_non_manifold_edge_ratio) ? clamp(1 - m.pred_non_manifold_edge_ratio) : null,
    ]);
  } else if (key === 'judge') {
    const visual = value => finite(value) ? clamp((value - 1) / 9) : null;
    if (run.task === 'text2cad' && run.spec === 'parametric') {
      score = finite(m.qa_semantic) && finite(m.qa_parametric)
        ? (clamp(m.qa_semantic) + 2 * clamp(m.qa_parametric)) / 3 : clamp(m.qa_overall);
    } else if (run.task === 'text2cad') {
      score = mean([clamp(m.qa_semantic), visual(m.judge_semantic)]);
    } else {
      score = mean([visual(m.judge_geometry), visual(m.judge_aesthetics), visual(m.judge_semantic)]);
    }
  } else if (key === 'part') {
    score = mean([clamp(m.part_match_f1), clamp(m.part_fscore_mean)]);
  }
  return score === null ? null : run.valid === false ? 0 : score;
}
