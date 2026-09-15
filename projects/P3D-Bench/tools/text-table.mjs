// Text-only fixed100 validation; no Assembly data or renderer changes.
export const TEXT_MODELS = ["gpt6_probe", "gemini38_flash", "qwen38max", "grok46", "kimi_k3",
  "claude_opus5", "glm53_official", "deepseek_v41flash", "doubao21", "glm53flash"];

function close(a, b, label) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a - b) > 1e-10) {
    throw new Error(`${label}: source metrics differ`);
  }
}

export function validateTextSummary(summary) {
  if (summary.schema_version !== "p3d-live-text-summary-v2" || summary.fixed_denominator !== 100) {
    throw new Error("expected fixed100 Text v2 summary");
  }
  if (!Array.isArray(summary.rows) || summary.rows.length !== TEXT_MODELS.length) {
    throw new Error("expected exactly 10 current Text rows");
  }
  const seen = new Set();
  for (const [index, row] of summary.rows.entries()) {
    if (!TEXT_MODELS.includes(row.model_id) || seen.has(row.model_id)) throw new Error("unexpected or duplicate Text model");
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
    close(row.score, (row.formats.descriptive.average.judge + p.geometry + p.topology + p.judge) * 25, "total score");
    if (index && summary.rows[index-1].score < row.score) throw new Error("Text rows must be score-descending");
    for (const field of ["cost_usd", "estimated_cost_usd"]) {
      if (row[field] !== null && (!Number.isFinite(row[field]) || row[field] <= 0)) throw new Error("invalid cost");
    }
    if (row.cost_usd !== null && row.estimated_cost_usd !== null) throw new Error("ambiguous estimated cost");
    const cost = row.cost_usd ?? row.estimated_cost_usd;
    if (cost === null) {
      throw new Error("current Text leaderboard requires a supported numeric cost for every model");
    } else close(cost / 100, row.usd_per_case, "USD per case units");
    if (row.estimated_cost_usd !== null && row.usage_kind !== "official_tokenizer_estimate") throw new Error("missing estimate provenance");
  }
  if (summary.model_ids?.join() !== summary.rows.map((r) => r.model_id).join()) throw new Error("model order differs");
}

export function textCost(row) {
  const cost = row.cost_usd ?? row.estimated_cost_usd;
  if (!Number.isFinite(cost) || cost <= 0) throw new Error("Text cost must be supported and numeric");
  return `$${(cost / 100).toFixed(3)}`;
}
