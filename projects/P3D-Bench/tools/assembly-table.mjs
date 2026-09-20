export function assemblyCostPerCase(row) {
  const estimated = row.cost_usd === null;
  const source = estimated ? row.cost_estimate : row.generation_cost;
  if (!source) return null;
  const values = ["cadquery", "openscad"].map(format => source.formats[format]);
  const total = values.reduce((sum, value) => sum + value[estimated ? "total_usd_estimated" : "total_usd"], 0);
  const tested = values.reduce((sum, value) => sum + value.tested_cases, 0);
  if (!Number.isFinite(total) || total < 0 || !tested) throw new Error("invalid pooled Assembly cost");
  const pooled = total / tested;
  if (row.cost_usd_per_case != null && Math.abs(row.cost_usd_per_case - pooled) > 1e-10) {
    throw new Error("pooled Assembly cost differs from actual tested-case totals");
  }
  return pooled;
}

export function buildAssemblyTable(summary) {
  if (summary.scoring_revision?.geometry_aggregation_revision !== "per-case-20260918") {
    throw new Error("Assembly requires the accepted per-case Geometry export");
  }
  const expected = new Set(["gpt6_astra_local", "claude_opus5", "gemini38_flash", "grok46", "kimi_k3", "qwen38max", "glm53_flash"]);
  const additions = new Set(["doubao_seed21", "mimo25", "deepseek41_flash"]);
  const seen = new Set();
  if (summary.schema_version !== "p3d-live-assembly-summary-v1" || !Array.isArray(summary.rows)
      || summary.rows.length < expected.size || summary.rows.length > expected.size + additions.size) {
    throw new Error("expected the measured Assembly cohort with completed additions");
  }
  if (summary.table?.key !== "assembly" || summary.table.metrics?.length !== 17
      || summary.table.groups?.reduce((sum, group) => sum + group.span, 0) !== 17) {
    throw new Error("unexpected Assembly table layout");
  }
  for (const row of summary.rows) {
    if (seen.has(row.model_id) || (!expected.has(row.model_id) && !additions.has(row.model_id))) {
      throw new Error("unexpected or duplicate Assembly model");
    }
    seen.add(row.model_id);
    if (additions.has(row.model_id) && (row.evaluation?.model_id !== "google/gemini-3.8-flash"
        || row.evaluation?.reasoning_effort !== "high" || !row.score_source_sha256)) {
      throw new Error("new Assembly rows require the shared evaluator and frozen score provenance");
    }
    const cells = row.metrics.trim().split(/\s+/).map(Number);
    if (cells.length !== 15 || cells.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
      throw new Error(`${row.model}: expected 15 normalized metric cells`);
    }
    const average = row.average;
    const metricNames = ["geom", "topo", "judge", "part", "valid"];
    for (const [index, format] of ["cadquery", "openscad"].entries()) {
      const { metrics, coverage } = row.formats[format];
      if (Math.abs(metrics.geom - row.formats[format].casewise_geometry.geom) > 1e-10) {
        throw new Error("Assembly Geometry differs from the case-wise export");
      }
      if (coverage.total !== 100 || coverage.tested !== 100 - coverage.api_unrun
          || coverage.tested !== coverage.valid + coverage.invalid || coverage.tested <= 0
          || Math.abs(metrics.valid - coverage.valid / coverage.tested) > 1e-8) {
        throw new Error(`${row.model}: invalid tested-case coverage`);
      }
      metricNames.forEach((metric, column) => {
        if (!Number.isFinite(metrics[metric]) || Math.abs(cells[index * 5 + column] - metrics[metric]) > 0.00050001) {
          throw new Error(`${row.model}: formatted metric differs from source`);
        }
      });
    }
    metricNames.forEach((metric, column) => {
      const mean = (row.formats.cadquery.metrics[metric] + row.formats.openscad.metrics[metric]) / 2;
      if (Math.abs(average[metric] - mean) > 1e-8 || Math.abs(cells[10 + column] - mean) > 0.00050001) {
        throw new Error(`${row.model}: formats must have equal weight`);
      }
    });
    const score = ["geom", "judge", "part"].reduce((sum, metric) => sum + average[metric], 0) * 100 / 3;
    if (!Number.isFinite(score) || Math.abs(score - row.score) > 1e-8) throw new Error(`${row.model}: score does not match unrounded metrics`);
    if (row.cost_usd !== null && (!Number.isFinite(row.cost_usd) || row.cost_usd < 0)) throw new Error("invalid Assembly cost");
    if (row.cost_usd !== null) {
      if (row.usage_kind !== "actual_tokens_official_api_rates" || !row.generation_cost) throw new Error("Assembly cost needs audited token usage");
      const costs = ["cadquery", "openscad"].map((format) => {
        const cost = row.generation_cost.formats[format];
        if (cost.cases_with_complete_usage !== row.formats[format].coverage.tested
            || cost.tested_cases !== row.formats[format].coverage.tested
            || !Number.isFinite(cost.total_usd) || cost.total_usd < 0
            || !Number.isFinite(cost.usd_per_case) || cost.usd_per_case < 0
            || Math.abs(cost.usd_per_case - cost.total_usd / cost.tested_cases) > 1e-10) {
          throw new Error("Assembly cost usage coverage or denominator is incorrect");
        }
        return cost.usd_per_case;
      });
      if (Math.abs(row.cost_usd / 100 - (costs[0] + costs[1]) / 2) > 1e-10) throw new Error("Assembly cost formats must have equal weight");
    }
    if (row.estimated_cost_usd != null) {
      const estimate = row.cost_estimate;
      if (row.model_id !== "kimi_k3" || row.cost_usd !== null || row.usage_kind !== "estimated_official_tokenizer"
          || !Number.isFinite(row.estimated_cost_usd) || row.estimated_cost_usd < 0
          || !estimate?.official_tokenizer_revision) throw new Error("estimated cost needs distinct provenance");
      const means = ["cadquery", "openscad"].map((format) => {
        const cost = estimate.formats[format];
        if (cost.tested_cases !== row.formats[format].coverage.tested
            || !Number.isFinite(cost.total_usd_estimated) || cost.total_usd_estimated < 0
            || !Number.isFinite(cost.usd_per_case_estimated)
            || Math.abs(cost.usd_per_case_estimated - cost.total_usd_estimated / cost.tested_cases) > 1e-10) {
          throw new Error("estimated cost denominator is incorrect");
        }
        const tokens = cost.token_totals_estimated;
        const rates = estimate.official_pricing;
        const tokenCost = (tokens.input_tokens_estimated * rates.input_usd_per_million + tokens.output_tokens_estimated * rates.output_usd_per_million) / 1e6;
        if (!Number.isFinite(tokenCost) || Math.abs(tokenCost - cost.total_usd_estimated) > 1e-8) throw new Error("estimated cost differs from token counts and rates");
        return cost.usd_per_case_estimated;
      });
      if (Math.abs(row.estimated_cost_usd / 100 - (means[0] + means[1]) / 2) > 1e-10) throw new Error("estimated cost formats must have equal weight");
    }
  }
  if ([...expected].some((model) => !seen.has(model))) throw new Error("missing original Assembly model");
  const metricGroups = summary.table.groups.filter((group) => group.label !== "Score / Cost");
  const displayMetrics = ["Geo", "Judge", "Part", "Topo", "Valid (%)"];
  const displayAxes = ["geom", "judge", "part", "topo", "valid"];
  return {
    ...summary.table,
    groups: [{ label: "Score / Cost", span: 2 }, ...metricGroups],
    metrics: ["Score", "USD / generation", ...Array.from({ length: 3 }, () => displayMetrics).flat()],
    // The live Assembly table has no methodology footer; audits stay in JSON.
    note: "",
    rows: [...summary.rows].sort((a, b) => b.score - a.score).map((row) => {
      const cost = assemblyCostPerCase(row);
      const metrics = [row.formats.cadquery.metrics, row.formats.openscad.metrics, row.average]
        .flatMap(values => displayAxes.map(metric => (values[metric] * 100).toFixed(1)))
        .join(" ");
      return { model: row.model, model_id: row.model_id, family: row.family,
        cells: `${row.score.toFixed(2)} ${cost === null ? "-" : `$${cost.toFixed(3)}`} ${metrics}` };
    }),
  };
}
