// Text-only data projection. No plotting, rendering, or asset substitution.
export function validateLiveTextDemo(overlay) {
  const expected = ["gpt6_probe", "gemini38_flash", "qwen38max", "grok46", "kimi_k3",
    "claude_opus5", "glm53_official", "deepseek_v41flash", "doubao21", "glm53flash"];
  const fail = (message) => { throw new Error(`Text demo: ${message}`); };
  if (overlay.schema !== "p3d-text-demo-fixed100-v1" || overlay.model_ids?.join() !== expected.join()) fail("unexpected model scope");
  if (overlay.models?.length !== 10 || overlay.models.map(x => x.id).join() !== expected.join()) fail("model registry differs");
  if (overlay.cases?.length !== 4 || new Set(overlay.cases.map(x => x.id)).size !== 4
      || overlay.cases.some(x => x.task !== "text2cad")) fail("case scope differs");
  if (overlay.runs?.length !== 160) fail("expected 160 preserved task/format cases");
  const cases = new Set(overlay.cases.map(x => x.id)), ids = new Set(), cells = new Set();
  for (const row of overlay.runs) {
    if (row.task !== "text2cad" || !expected.includes(row.model) || !cases.has(row.case_id)
        || !["descriptive", "parametric"].includes(row.spec) || !["json", "openscad"].includes(row.format)
        || typeof row.valid !== "boolean" || !row.condition?.trim()) fail("invalid run identity/input");
    const key = [row.model, row.case_id, row.spec, row.format].join("|");
    if (ids.has(row.id) || cells.has(key)) fail("duplicate run");
    ids.add(row.id); cells.add(key);
    for (const role of row.valid ? ["generated", "gt_mesh", "mesh", "gt_render", "pred_render"] : ["generated"]) {
      if (!/^text_live_fixed100_v1\/assets\/[0-9a-f]{64}\.(json|scad|stl|png|jpg|jpeg)$/.test(row.assets?.[role])) fail("missing or external asset");
    }
  }
  const show = overlay.text_showcase;
  if (show?.task !== "text2cad" || show.variants?.length !== 10
      || show.variants.map(x => x.model).join() !== expected.join()) fail("showcase model scope differs");
  const selected = show.variants.map(v => {
    const row = overlay.runs.find(x => x.id === v.id);
    if (!row?.valid || row.spec !== "parametric" || row.format !== "openscad"
        || v.model !== row.model || v.src !== row.assets.pred_render || v.mesh !== row.assets.mesh) fail("showcase borrows another run");
    return row;
  });
  if (new Set(selected.map(x => x.case_id)).size !== 1 || new Set(selected.map(x => x.condition)).size !== 1
      || show.input !== selected[0].condition || show.gtMesh !== selected[0].assets.gt_mesh
      || show.gtRender !== selected[0].assets.gt_render) fail("inconsistent showcase reference");
}

export function mergeLiveTextManifest(base, overlay) {
  validateLiveTextDemo(overlay);
  const foreignRuns = base.runs.filter(x => x.task !== "text2cad");
  const foreignModels = base.models.filter(x => foreignRuns.some(r => r.model === x.id));
  if (foreignModels.some(x => overlay.model_ids.includes(x.id))) throw new Error("Text model id collides with another task");
  return {...base,
    models: [...foreignModels, ...overlay.models],
    cases: [...base.cases.filter(x => x.task !== "text2cad"), ...overlay.cases],
    runs: [...foreignRuns, ...overlay.runs],
    text_showcase: overlay.text_showcase,
    text_live_source_sha256: overlay.source_selection_sha256,
  };
}
