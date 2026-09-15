export const IMAGE_MODELS = ["gpt6_astra_local", "claude_opus5", "gemini38_flash", "qwen38max",
  "kimi_k3", "glm53_flash", "grok46", "deepseek41_flash", "doubao_seed21"];
const FORMATS = ["cadquery", "openscad", "threejs"];
const AXES = ["geom", "topo", "judge"];

function close(actual, expected, label, tolerance = 1e-10) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: values disagree`);
  }
}

function normalized(value) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error("invalid normalized metric");
}

function coverage(c, total) {
  for (const key of ["total", "tested", "api_failed", "valid", "invalid", "judge_ok", "judge_missing", "cost_covered"]) {
    if (!Number.isInteger(c[key]) || c[key] < 0) throw new Error("invalid coverage counter");
  }
  if (c.total !== total || !c.tested || c.tested + c.api_failed !== total
      || c.valid + c.invalid !== c.tested || c.judge_ok + c.judge_missing !== c.valid
      || c.cost_covered > c.tested) throw new Error("inconsistent coverage");
}

function cost(value, counts) {
  if (value === null) return "-";
  if (!Number.isFinite(value) || value < 0 || counts.cost_covered !== counts.tested) throw new Error("cost needs complete usage coverage");
  return `$${value.toFixed(3)}`;
}

export function buildAdditionalFormatTables(rows = [], task) {
  if (!rows.length) return [];
  const axes = task === "assembly" ? [...AXES, "part"] : AXES;
  const names = task === "assembly" ? ["Geo", "Topo", "Judge", "Part", "Valid"] : ["Geo", "Topo", "Judge", "Valid"];
  const seen = new Set();
  for (const row of rows) {
    const key = `${row.model_id}/${row.format}`;
    if (seen.has(key) || row.model_id !== "gemini38_flash"
        || !(task === "assembly" ? ["json", "threejs"] : ["json"]).includes(row.format)
        || !/^[a-f0-9]{64}$/.test(row.source_sha256)) throw new Error("invalid additional format source");
    seen.add(key);
    coverage(row.coverage, 100);
    for (const axis of [...axes, "valid"]) normalized(row.metrics[axis]);
    close(row.metrics.valid, row.coverage.valid / row.coverage.tested, "format validity");
    close(row.score, axes.reduce((sum, axis) => sum + row.metrics[axis], 0) * 100 / axes.length, "format score");
  }
  return [{
    key: `${task}formats`, title: "Gemini 3.8 Flash · Additional formats",
    accent: task === "assembly" ? "var(--coral)" : "var(--teal)",
    groups: [{ label: "Per-format metrics", span: names.length }, { label: "Coverage", span: 2 }, { label: "Score / Cost", span: 2 }],
    metrics: [...names, "Tested", "Judged", "Score", "USD / case"],
    rows: rows.map(row => ({ model: `${row.model} · ${row.format === "json" ? "JSON" : "Three.js"}`,
      model_id: `${row.model_id}/${row.format}`, family: row.family,
      cells: [...axes, "valid"].map(k => row.metrics[k].toFixed(3)).join(" ")
        + ` ${row.coverage.tested}/100 ${row.coverage.judge_ok}/${row.coverage.valid} ${row.score.toFixed(2)} ${cost(row.cost_usd_per_case, row.coverage)}` })),
    note: "Each row reports one output format on the same 100 cases. These formats do not enter the main leaderboard average. Tested excludes API failures; Judged counts scored valid outputs. Scores with incomplete coverage are provisional. Costs use saved generation tokens at the frozen September 10/11 API rates.",
  }];
}

export function buildImageTable(summary) {
  if (summary.schema_version !== "p3d-live-image-summary-v1"
      || summary.format_order?.join() !== FORMATS.join()
      || summary.rows?.length !== IMAGE_MODELS.length) throw new Error("expected Image Hard100 summary");
  const seen = new Set();
  for (const row of summary.rows) {
    if (!IMAGE_MODELS.includes(row.model_id) || seen.has(row.model_id)) throw new Error("unexpected or duplicate Image model");
    seen.add(row.model_id);
    const cells = row.metrics.trim().split(/\s+/).map(Number);
    if (cells.length !== 16) throw new Error("expected 16 Image metric cells");
    let offset = 0;
    for (const fmt of [...FORMATS, "average"]) {
      const values = fmt === "average" ? row.average : row.formats[fmt];
      for (const axis of [...AXES, "valid"]) {
        normalized(values[axis]);
        close(cells[offset++], values[axis], "formatted metric", 0.00050000001);
        if (fmt === "average") close(values[axis], FORMATS.reduce((sum, f) => sum + row.formats[f][axis], 0) / 3, "equal format weighting");
      }
      if (fmt !== "average") {
        const counts = row.format_detail[fmt].counts;
        coverage(counts, 100);
        close(values.valid, counts.valid / counts.tested, "export validity", 0.00005000001);
      }
    }
    coverage(row.counts, 300);
    for (const key of Object.keys(row.counts)) close(row.counts[key], FORMATS.reduce((sum, f) => sum + row.format_detail[f].counts[key], 0), "coverage total");
    close(row.score, AXES.reduce((sum, axis) => sum + row.average[axis], 0) * 100 / 3, "Image score");
    if (row.provisional !== Boolean(row.counts.api_failed || row.counts.judge_missing || row.counts.local_evaluation_gap)) throw new Error("missing provisional status");
    cost(row.cost_usd_per_case, row.counts);
  }
  return {
    key: "image", title: "Image-to-3D · Hard100", accent: "var(--teal)",
    groups: ["CadQuery", "OpenSCAD", "Three.js", "Average"].map(label => ({ label, span: 4 }))
      .concat([{ label: "Coverage", span: 2 }, { label: "Score / Cost", span: 2 }]),
    metrics: Array.from({ length: 4 }, () => ["Geo", "Topo", "Judge", "Valid"]).flat().concat(["Tested", "Judged", "Score", "USD / case"]),
    rows: [...summary.rows].sort((a, b) => b.score - a.score).map(row => ({ model: row.model,
      model_id: row.model_id, family: row.family,
      cells: `${row.metrics} ${row.counts.tested}/300 ${row.counts.judge_ok}/${row.counts.valid} ${row.score.toFixed(2)} ${cost(row.cost_usd_per_case, row.counts)}` })),
    note: `Snapshot ${summary.snapshot_at.replace("T", " ")}. Scores are provisional where coverage is incomplete. Tested excludes API failures; Judged counts scored valid outputs. Valid measures successful exports; missing evaluations are excluded from metric means. Score averages Geo, Topo and Judge equally across three formats. Costs use saved generation tokens at the frozen September 10/11 API rates.`,
    extraTables: buildAdditionalFormatTables(summary.additional_formats, "image"),
  };
}
