export function validateSpatialDemo(data) {
  const models = ["gpt6_astra_local", "claude_opus5", "gemini38_flash", "grok46", "kimi_k3",
    "qwen38max", "glm53_flash", "deepseek41_flash", "doubao_seed21"].map(m => `${m}-reason`);
  const formats = { image2cad: ["cadquery", "openscad", "threejs"], text_image2cad: ["cadquery", "openscad"] };
  const fail = message => { throw new Error(`Spatial demo: ${message}`); };
  if (data.schema !== "p3d-spatial-demo-v1" || data.model_ids?.join() !== models.join()
      || data.models?.map(m => m.id).join() !== models.join()) fail("unexpected model registry");
  if (data.cases?.length !== 8 || data.runs?.length !== 180) fail("unexpected case/run scope");
  const cases = new Map(data.cases.map(c => [c.id, c]));
  if (cases.size !== 8 || Object.keys(formats).some(task => data.cases.filter(c => c.task === task).length !== 4)) fail("duplicate or missing cases");
  const ids = new Set(), combinations = new Set();
  for (const run of data.runs) {
    if (!models.includes(run.model) || !formats[run.task]?.includes(run.format)
        || cases.get(run.case_id)?.task !== run.task || !run.condition?.trim() || run.valid !== true
        || run.spec !== (run.task === "image2cad" ? "image" : "image_text")) fail("invalid run identity/input");
    const key = [run.task, run.case_id, run.model, run.format].join("|");
    if (ids.has(run.id) || combinations.has(key)) fail("duplicate run");
    ids.add(run.id); combinations.add(key);
    for (const role of ["generated", "mesh", "pred_render", "gt_mesh", "gt_render", "input_image"]) {
      if (!/^spatial_live_v1\/assets\/[a-f0-9]{64}\.(py|scad|js|json|stl|png|jpg|jpeg)$/.test(run.assets?.[role])) fail("missing or external asset");
    }
    if (!["judge_geometry", "judge_semantic", "chamfer_distance"].every(k => Number.isFinite(run.metrics?.[k]))) fail("missing evaluated metric");
  }
  for (const item of data.cases) {
    const runs = data.runs.filter(r => r.case_id === item.id);
    if (runs.length !== models.length * formats[item.task].length
        || new Set(runs.map(r => r.assets.input_image)).size !== 1
        || new Set(runs.map(r => r.assets.gt_mesh)).size !== 1
        || new Set(runs.map(r => r.condition)).size !== 1
        || item.thumbnail !== runs[0].assets.input_image) fail("mixed case inputs or missing combinations");
  }
  for (const task of Object.keys(formats)) {
    const show = data.spatial_showcases?.[task];
    if (show?.task !== task || show.variants?.map(v => v.model).join() !== models.join()) fail("showcase model scope differs");
    const selected = show.variants.map(variant => {
      const run = data.runs.find(r => r.id === variant.id);
      if (!run || run.task !== task || run.model !== variant.model || run.assets.mesh !== variant.mesh
          || run.assets.pred_render !== variant.src) fail("showcase borrows another run");
      return run;
    });
    if (new Set(selected.map(r => r.case_id)).size !== 1 || new Set(selected.map(r => r.format)).size !== 1
        || selected[0].format !== "cadquery" || selected[0].condition !== show.input
        || selected[0].assets.gt_mesh !== show.gtMesh || selected[0].assets.gt_render !== show.gtRender
        || selected[0].assets.input_image !== show.inputImage) fail("inconsistent showcase comparison");
  }
}

export function mergeSpatialManifest(base, data) {
  validateSpatialDemo(data);
  const tasks = new Set(["image2cad", "text_image2cad"]);
  const retained = base.runs.filter(r => !tasks.has(r.task));
  const retainedModels = base.models.filter(m => retained.some(r => r.model === m.id));
  if (retainedModels.some(m => data.model_ids.includes(m.id))) throw new Error("Spatial model ID collides with Text");
  return { ...base, models: [...retainedModels, ...data.models],
    cases: [...base.cases.filter(c => !tasks.has(c.task)), ...data.cases],
    runs: [...retained, ...data.runs], spatial_showcases: data.spatial_showcases,
    spatial_source_sha256: data.source_selection_sha256 };
}
