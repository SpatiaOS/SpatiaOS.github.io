// Text-only fixed100 validation; no Assembly data or renderer changes.
export const TEXT_MODELS = ["gpt6_probe", "gemini38_flash", "qwen38max", "grok46", "kimi_k3",
  "claude_opus5", "glm53_official", "deepseek_v41flash", "doubao21", "glm53flash"];

export const TEXT_MODEL_LABELS = {
  gpt6_probe: "GPT-6 Astra",
  gemini38_flash: "Gemini 3.8 Flash",
  qwen38max: "Qwen3.8-Max",
  grok46: "Grok 4.6",
  kimi_k3: "Kimi K3",
  claude_opus5: "Claude Opus 5",
  glm53_official: "GLM-5.3",
  deepseek_v41flash: "DeepSeek V4.1 Flash",
  doubao21: "Doubao Seed 2.1 Pro",
  glm53flash: "GLM-5.3-Flash",
};

function close(a, b, label) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a - b) > 1e-10) {
    throw new Error(`${label}: source metrics differ`);
  }
}

export function validateTextSummary(summary) {
  if (summary.score_revision !== "text_geo4_score3_iou_omit_v2" || summary.topology_in_headline !== false
      || summary.geometry_terms?.join() !== "chamfer_distance_score,iou_csg,f_score_001,normal_consistency"
      || summary.headline_terms?.join() !== "desc_judge,geometry,param_judge"
      || summary.iou_policy !== "omit_unavailable_valid_iou_retain_invalid_zero"
      || summary.geometry_aggregation !== "case_first_available_terms_fixed100") {
    throw new Error("expected four-term Geometry, unavailable-IoU omission and three-bucket Text score");
  }
  if (summary.schema_version !== "p3d-live-text-summary-v2" || summary.fixed_denominator !== 100) {
    throw new Error("expected fixed100 Text v2 summary");
  }
  if (summary.cost_revision !== "text_generation_cost_v1" || summary.cost_unit !== "USD/generation"
      || summary.cost_denominator_selected_responses !== 400) {
    throw new Error("expected cost per single generation over 400 selected responses");
  }
  if (!Array.isArray(summary.rows) || summary.rows.length !== TEXT_MODELS.length) {
    throw new Error("expected exactly 10 current Text rows");
  }
  const seen = new Set();
  for (const [index, row] of summary.rows.entries()) {
    if (!TEXT_MODELS.includes(row.model_id) || seen.has(row.model_id)) throw new Error("unexpected or duplicate Text model");
    if (row.model !== TEXT_MODEL_LABELS[row.model_id]) throw new Error("Text model labels must omit reasoning settings");
    seen.add(row.model_id);
    const tokens = row.metrics.trim().split(/\s+/);
    if (tokens.length !== 18 || tokens.some((v) => !Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > 1)) {
      throw new Error(`${row.model}: expected 18 normalized metric cells`);
    }
    let offset = 0;
    for (const [task, keys] of [["descriptive", ["judge", "valid"]], ["parametric", ["geometry", "topology", "judge", "valid"]]]) {
      const formats = row.formats[task];
      for (const format of ["json", "openscad", "average"]) {
        for (const key of keys) {
          const value = formats[format][key];
          if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error("invalid source metric");
          if (format === "average") close(value, (formats.json[key] + formats.openscad[key]) / 2, "equal format weighting");
          if (Math.abs(Number(tokens[offset++]) - value) > 0.000500000001) throw new Error("formatted metric differs");
        }
      }
    }
    const p = row.formats.parametric.average;
    close(row.score, (row.formats.descriptive.average.judge + p.geometry + p.judge) * 100 / 3, "total score");
    if (index && summary.rows[index-1].score < row.score) throw new Error("Text rows must be score-descending");
    for (const field of ["cost_usd", "estimated_cost_usd"]) {
      if (row[field] !== null && (!Number.isFinite(row[field]) || row[field] <= 0)) throw new Error("invalid cost");
    }
    if (row.cost_usd !== null && row.estimated_cost_usd !== null) throw new Error("ambiguous estimated cost");
    const cost = row.cost_usd ?? row.estimated_cost_usd;
    if (cost === null) {
      throw new Error("current Text leaderboard requires a supported numeric cost for every model");
    } else close(cost / 400, row.usd_per_generation, "USD per generation units");
    if ("usd_per_case" in row || row.selected_generation_responses !== 400) throw new Error("legacy or ambiguous cost units");
    if (row.estimated_cost_usd !== null && row.usage_kind !== "official_tokenizer_estimate") throw new Error("missing estimate provenance");
  }
  if (summary.model_ids?.join() !== summary.rows.map((r) => r.model_id).join()) throw new Error("model order differs");
  textBaselineRows(summary);
}

// The native JSON baseline uses the same fixed100 per-case aggregation.
export function textBaselineRows(summary) {
  const rows = summary.native_baselines ?? [];
  if (rows.length !== 1) throw new Error("expected the Text2CAD JSON baseline");
  return rows.map((row) => {
    if (row.model_id !== "text2cad" || row.model !== "Text2CAD" || row.scope !== "native_json_only"
        || row.cost_kind !== "local_checkpoint_not_api_priced"
        || row.score_revision !== summary.score_revision
        || row.metric_policy !== summary.metric_policy
        || row.aggregation_policy !== "shared_fixed100_casewise_v1"
        || row.geometry_aggregation !== undefined
        || row.judge_aggregation !== undefined) throw new Error("Text2CAD baseline contract differs");
    const d = row.formats.descriptive.json;
    const p = row.formats.parametric.json;
    if (Object.keys(row.formats.descriptive).join() !== "json"
        || Object.keys(row.formats.parametric).join() !== "json") throw new Error("unsupported Text2CAD format");
    const values = [d.judge, d.valid, p.geometry, p.topology, p.judge, p.valid];
    if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) throw new Error("invalid Text2CAD metric");
    close(row.score, (d.judge + p.geometry + p.judge) * 100 / 3, "Text2CAD total score");
    const sourceMetrics = [d.judge.toFixed(3), d.valid.toFixed(3), "-", "-", "-", "-",
      ...[p.geometry, p.topology, p.judge, p.valid].map((value) => value.toFixed(3)), ...Array(8).fill("-")].join(" ");
    if (sourceMetrics !== row.metrics) throw new Error("Text2CAD formatted cells differ");
    const displayMetrics = [(d.judge * 100).toFixed(1), (d.valid * 100).toFixed(1), "-", "-", "-", "-",
      ...[p.geometry, p.judge, p.topology, p.valid].map((value) => (value * 100).toFixed(1)), ...Array(8).fill("-")].join(" ");
    return { model: row.model, model_id: row.model_id, family: row.family,
      cells: `${row.score.toFixed(2)} - ${displayMetrics}` };
  });
}

export function textMetricsForDisplay(row) {
  const values = [];
  for (const format of ["json", "openscad", "average"]) {
    values.push(...["judge", "valid"].map(metric => (row.formats.descriptive[format][metric] * 100).toFixed(1)));
  }
  for (const format of ["json", "openscad", "average"]) {
    values.push(...["geometry", "judge", "topology", "valid"].map(metric => (row.formats.parametric[format][metric] * 100).toFixed(1)));
  }
  return values.join(" ");
}

export function textCost(row) {
  const cost = row.cost_usd ?? row.estimated_cost_usd;
  if (!Number.isFinite(cost) || cost <= 0) throw new Error("Text cost must be supported and numeric");
  close(cost / 400, row.usd_per_generation, "USD per generation units");
  return `$${row.usd_per_generation.toFixed(4)}`;
}
