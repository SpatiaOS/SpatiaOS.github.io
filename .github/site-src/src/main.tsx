import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, ChevronDown, ChevronUp, Code2, Github, Image as ImageIcon, Layers3, Play } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import "./styles.css";
import type { ResultSubtable, ResultTableRow } from "./resultsData";
import { loadPaperResultTables } from "./paperSnapshot";

const RELEASE_PROFILE = import.meta.env.VITE_P3D_RELEASE_PROFILE || "development";
const IS_ANONYMOUS = RELEASE_PROFILE === "anonymous";
const INCLUDE_LIVE = RELEASE_PROFILE === "development"
  ? true
  : import.meta.env.VITE_P3D_INCLUDE_LIVE === "true";
const HAS_PAPER_SNAPSHOT = Boolean(import.meta.env.VITE_P3D_SNAPSHOT_SHA256);

type AssetMap = {
  gt_render?: string;
  gt_mesh?: string;
  pred_render?: string;
  generated?: string;
  generated_json?: string;
  mesh?: string;
  input_image?: string;
};

type Run = {
  id: string;
  task: string;
  case_id: string;
  spec: string;
  format: string;
  model: string;
  valid: boolean | null;
  condition: string;
  assets: AssetMap;
  metrics: Record<string, number | string | null>;
};

type Manifest = {
  schema_version: number;
  paper: {
    title: string;
    authors: string[];
    affiliations?: string[];
    abstract: string;
    links?: Record<string, string>;
  };
  tasks: Array<{ id: string; label: string; formats: string[]; status?: string }>;
  models: Array<{ id: string; label: string; family?: string }>;
  cases: Array<{ id: string; title: string; task: string; thumbnail?: string }>;
  runs: Run[];
  figures?: Array<{ id: string; title: string; src?: string; placeholder?: boolean }>;
  gallery?: Array<{ id: string; title: string; src: string; caption?: string }>;
};

type ShowcaseVariant = {
  id: string;
  task: string;
  model: string;
  modelLabel: string;
  family: string;
  formatLabel: string;
  specLabel: string;
  src: string;
  mesh: string;
};

type ShowcaseComparison = {
  id: string;
  task: string;
  taskLabel: string;
  title: string;
  input: string;
  inputImage?: string;
  gtRender: string;
  gtMesh: string;
  formatLabel: string;
  specLabel: string;
  variants: ShowcaseVariant[];
};

type CadViewItem = { id: string; task: string; title: string; subtitle: string; src?: string; mesh: string };
type InputModalItem = {
  task: string;
  title: string;
  taskLabel: string;
  specLabel: string;
  input: string;
  inputImage?: string;
  subtitle: string;
};
type ModelFamilyStyle = { color: string; icon: string; tile?: string; filter?: string };
type AvailabilitySummary = { invalidCount: number; caseCount: number; modelCount: number; formatCount: number };
type ComplexAssemblyPart = {
  index: number;
  label: string;
  name: string;
  semantic: string;
  mesh: string;
  size_kb?: number;
};
type DisplayPart = ComplexAssemblyPart & {
  count: number;
  displayName: string;
};
type ComplexAssemblyItem = {
  id: string;
  case_id: string;
  short_case_id: string;
  title: string;
  model: string;
  model_label: string;
  format: string;
  format_label: string;
  condition: string;
  assets: { gt_render?: string; pred_render?: string; mesh?: string; stage2_mesh?: string };
  metrics: Record<string, number | string | null>;
  judge_reason?: string;
  parts: ComplexAssemblyPart[];
};
type ComplexAssemblyData = { schema_version: number; items: ComplexAssemblyItem[] };

const fallbackManifest: Manifest = {
  schema_version: 1,
  paper: {
    title: "P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning",
    authors: IS_ANONYMOUS
      ? ["Anonymous authors"]
      : ["Yikang Yang¹,*", "Zhanpeng Hu¹,*", "Youtian Lin¹", "Mengqi Zhou¹", "Jingxi Xu²", "Feihu Zhang²", "Jiaheng Liu¹", "Yao Yao¹"],
    affiliations: IS_ANONYMOUS
      ? ["Anonymous submission"]
      : ["¹Nanjing University", "²Envision", "*Equal contribution."],
    abstract:
      "P3D-Bench evaluates parametric 3D generation and structural reasoning across text, image, and assembly conditions."
  },
  tasks: [
    { id: "text2cad", label: "Text-to-3D", formats: ["JSON", "OpenSCAD"], status: "interactive" },
    { id: "image2cad", label: "Image-to-3D", formats: ["CadQuery", "OpenSCAD", "Three.js"], status: "interactive" },
    { id: "text_image2cad", label: "Assembly-3D", formats: ["CadQuery", "OpenSCAD"], status: "interactive" }
  ],
  models: [],
  cases: [],
  runs: [],
  figures: [
    { id: "pipeline", title: "Pipeline", placeholder: true },
    { id: "leaderboard", title: "Leaderboard", placeholder: true }
  ],
  gallery: []
};

function asset(path?: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}demo/${path}`;
}

function releaseAsset(path: string) {
  const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}release/${path}`;
}

function App() {
  const [manifest, setManifest] = useState<Manifest>(fallbackManifest);
  const [complexAssemblies, setComplexAssemblies] = useState<ComplexAssemblyItem[]>([]);
  const [task, setTask] = useState("text2cad");
  const [caseId, setCaseId] = useState("");
  const [model, setModel] = useState("");
  const [spec, setSpec] = useState("descriptive");
  const [format, setFormat] = useState("openscad");
  const [code, setCode] = useState("");

  useEffect(() => {
    fetch(asset("manifest.json"))
      .then((res) => (res.ok ? res.json() : fallbackManifest))
      .then((data) => setManifest(data))
      .catch(() => setManifest(fallbackManifest));
  }, []);

  useEffect(() => {
    if (IS_ANONYMOUS) {
      setComplexAssemblies([]);
      return;
    }
    fetch(asset("complex_assemblies.json"))
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: ComplexAssemblyData) => setComplexAssemblies(Array.isArray(data.items) ? data.items : []))
      .catch(() => setComplexAssemblies([]));
  }, []);

  const completeTaskRuns = useMemo(() => manifest.runs.filter((run) => run.task === task && isCompleteDemoRun(run)), [manifest, task]);
  const interactiveCaseIds = useMemo(() => getInteractiveCaseIds(completeTaskRuns), [completeTaskRuns]);
  const taskRuns = useMemo(() => completeTaskRuns.filter((run) => interactiveCaseIds.has(run.case_id)), [completeTaskRuns, interactiveCaseIds]);
  const cases = useMemo(() => manifest.cases.filter((item) => item.task === task && interactiveCaseIds.has(item.id)), [interactiveCaseIds, manifest, task]);
  const exactRun = useMemo(
    () => taskRuns.find((run) => run.case_id === caseId && run.model === model && run.format === format),
    [caseId, format, model, taskRuns]
  );
  const selectedRun = useMemo(
    () => exactRun || pickDefaultRun(taskRuns.filter((run) => run.case_id === caseId && run.model === model)) || pickDefaultRun(taskRuns.filter((run) => run.case_id === caseId)) || pickDefaultRun(taskRuns),
    [caseId, exactRun, model, taskRuns]
  );
  const activeCaseId = selectedRun?.case_id || caseId;
  const activeModel = selectedRun?.model || model;
  const activeSpec = selectedRun?.spec || spec;
  const activeFormat = selectedRun?.format || format;
  const caseRuns = useMemo(() => taskRuns.filter((run) => run.case_id === activeCaseId), [activeCaseId, taskRuns]);
  const models = useMemo(() => manifest.models.filter((item) => caseRuns.some((run) => run.model === item.id)), [caseRuns, manifest.models]);
  const modelRuns = useMemo(() => caseRuns.filter((run) => run.model === activeModel), [activeModel, caseRuns]);
  const taskFormats = useMemo(() => Array.from(new Set(taskRuns.map((run) => run.format))).sort((a, b) => formatPriority(a) - formatPriority(b)), [taskRuns]);
  const formats = taskFormats.length ? taskFormats : modelRuns.map((run) => run.format);
  const availabilitySummary = useMemo(() => buildAvailabilitySummary(cases, taskRuns), [cases, taskRuns]);

  useEffect(() => {
    if (!selectedRun) return;
    if (caseId !== selectedRun.case_id) setCaseId(selectedRun.case_id);
    if (model !== selectedRun.model) setModel(selectedRun.model);
    if (spec !== selectedRun.spec) setSpec(selectedRun.spec);
    if (format !== selectedRun.format) setFormat(selectedRun.format);
  }, [caseId, format, model, selectedRun, spec]);

  const selectedCase = manifest.cases.find((item) => item.id === activeCaseId);
  const selectedModel = manifest.models.find((item) => item.id === activeModel);
  const selectedTask = manifest.tasks.find((item) => item.id === selectedRun?.task);
  const showcaseComparisons = useMemo(() => buildShowcaseComparisons(manifest), [manifest]);
  const visibleTasks = useMemo(() => manifest.tasks.filter((item) => item.status === "interactive"), [manifest]);
  const caseUsesImagePicker = cases.some((item) => item.thumbnail);
  const selectedInput = selectedRun?.condition || selectedCase?.title || "No input.";
  const selectedInputItem = selectedRun ? {
    title: selectedCase?.title || `Case ${selectedRun.case_id}`,
    task: selectedRun.task,
    taskLabel: selectedTask?.label || selectedRun.task,
    specLabel: inputSpecLabel(selectedRun.spec),
    input: selectedInput,
    inputImage: caseUsesImagePicker ? undefined : selectedRun.assets.input_image,
    subtitle: `${selectedModel?.label || selectedRun.model} / ${outputFormatLabel(selectedRun.format)}`
  } : null;

  const applyRunSelection = (run?: Run) => {
    if (!run) return;
    setCaseId(run.case_id);
    setModel(run.model);
    setSpec(run.spec);
    setFormat(run.format);
  };

  const pickRunForFormat = (nextFormat: string) =>
    pickDefaultRun(taskRuns.filter((run) => run.case_id === activeCaseId && run.model === activeModel && run.format === nextFormat)) ||
    pickDefaultRun(taskRuns.filter((run) => run.case_id === activeCaseId && run.format === nextFormat)) ||
    pickDefaultRun(taskRuns.filter((run) => run.model === activeModel && run.format === nextFormat)) ||
    pickDefaultRun(taskRuns.filter((run) => run.format === nextFormat));

  useEffect(() => {
    const path = selectedRun?.assets.generated || selectedRun?.assets.generated_json;
    if (!path) {
      setCode("");
      return;
    }
    fetch(asset(path))
      .then((res) => (res.ok ? res.text() : ""))
      .then(setCode)
      .catch(() => setCode(""));
  }, [selectedRun]);

  const paper = manifest.paper;

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top">P3D-Bench</a>
        <div>
          <a href="#results">Results</a>
          {!IS_ANONYMOUS ? <a href="#gallery">Viewer</a> : null}
        </div>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span>P3D-Bench</span>
            <small>Benchmarking MLLMs for <em>Parametric 3D</em> Generation and <em>Structural Reasoning</em></small>
          </h1>
          <div className="authors">
            {paper.authors.map((author) => <span className="author-name" key={author}>{renderAuthor(author)}</span>)}
          </div>
          <div className="affiliations">
            {paper.affiliations?.map((affiliation) => <span className="affiliation-item" key={affiliation}>{renderAffiliation(affiliation)}</span>)}
          </div>
          <div className="actions">
            {!IS_ANONYMOUS && paper.links?.paper ? <a href={paper.links.paper}><BookOpen size={17} /> Paper</a> : null}
            {!IS_ANONYMOUS && paper.links?.code ? <a href={paper.links.code}><Github size={17} /> Code</a> : null}
            <a href="#results"><Play size={17} /> Demo</a>
            {!IS_ANONYMOUS ? <a href="#citation">Citation</a> : null}
          </div>
        </div>
        <MainFigures />
        <div className="abstract-panel">
          <p className="eyebrow">Abstract</p>
          <p className="abstract" dangerouslySetInnerHTML={{ __html: paper.abstract }} />
        </div>
      </section>

      <section id="leaderboard" className="section leaderboard-section">
        <div className="section-heading">
          <h2>Leaderboard</h2>
          <p>Per-task results by output format</p>
        </div>
        <ResultsTables />
      </section>

      <section className="task-strip">
        {visibleTasks.map((item) => (
          <button key={item.id} className={task === item.id ? "task-card active" : "task-card"} onClick={() => setTask(item.id)}>
            <span>{item.label}</span>
            <strong>{item.formats.join(" / ")}</strong>
          </button>
        ))}
      </section>

      <section id="results" className="section">
        <div className="section-heading">
          <h2>Interactive Results</h2>
        </div>
        {taskRuns.length ? (
          <div className="workbench">
            <aside className="controls">
              <Select label="Case" value={activeCaseId} options={cases.map((item) => [item.id, item.title])} onChange={(nextCase) => applyRunSelection(pickDefaultRun(taskRuns.filter((run) => run.case_id === nextCase)))} />
              {caseUsesImagePicker ? (
                <CaseImagePicker
                  cases={cases}
                  activeCaseId={activeCaseId}
                  onSelect={(nextCase) => applyRunSelection(pickDefaultRun(taskRuns.filter((run) => run.case_id === nextCase)))}
                />
              ) : null}
              <Select label="Model" value={activeModel} options={models.map((item) => [item.id, item.label])} onChange={(nextModel) => applyRunSelection(pickDefaultRun(caseRuns.filter((run) => run.model === nextModel)))} />
              <Select label="Format" value={activeFormat} options={formats.map((item) => [item, outputFormatLabel(item)])} onChange={(nextFormat) => applyRunSelection(pickRunForFormat(nextFormat))} />
              {(() => {
                const specOptions = Array.from(new Set(caseRuns.filter((run) => run.model === activeModel).map((run) => run.spec))).sort((a, b) => specPriority(a) - specPriority(b)).map((s) => [s, inputSpecLabel(s)]);
                return specOptions.length > 1 ? (
                  <Select label="Input protocol" value={activeSpec} options={specOptions} onChange={(nextSpec) => applyRunSelection(pickDefaultRun(caseRuns.filter((run) => run.model === activeModel && run.spec === nextSpec)))} />
                ) : null;
              })()}
              {task !== "image2cad" ? (
                <Collapsible title="Input" icon={<ImageIcon size={16} />}>
                  <div className="condition-body">
                    {selectedRun?.assets.input_image && !caseUsesImagePicker ? <img className="condition-image" src={asset(selectedRun.assets.input_image)} alt="Input reference" /> : null}
                    <InputAnnotation task={selectedRun?.task} text={selectedInput} />
                  </div>
                </Collapsible>
              ) : null}
              <Collapsible title="Metrics" icon={<Layers3 size={16} />}>
                <MetricStrip run={selectedRun} />
              </Collapsible>
              <Collapsible title={`Generated ${outputFormatLabel(activeFormat)}`} icon={<Code2 size={16} />}>
                <div className="code-panel">
                  <pre><code>{code || "No generated output."}</code></pre>
                </div>
              </Collapsible>
            </aside>
            <div className="result-stage">
              <div className="render-pair">
                <GroundTruthFigure
                  run={selectedRun}
                  title={selectedCase?.title || "Ground Truth"}
                  subtitle="Reference geometry"
                />
                <PredictionFigure
                  run={selectedRun}
                  title={selectedCase?.title || "Prediction"}
                  subtitle={`${selectedModel?.label || selectedRun?.model || ""}${selectedRun ? ` / ${outputFormatLabel(selectedRun.format)}` : ""}`}
                />
              </div>
            </div>
          </div>
        ) : (
          <Placeholder title="Results" />
        )}
      </section>

      {!IS_ANONYMOUS ? (
        <section id="gallery" className="section">
          <div className="section-heading">
            <h2>Render Showcase</h2>
          </div>
          <RenderShowcase comparisons={showcaseComparisons} />
          <GalleryPartShowcase items={complexAssemblies} />
        </section>
      ) : null}

      {!IS_ANONYMOUS ? (
        <section id="citation" className="section citation">
          <div className="citation-heading">
            <h2>Citation</h2>
          </div>
          <pre><code>{`@article{p3dbench2026,
  title={P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning},
  author={Yang, Yikang and Hu, Zhanpeng and Lin, Youtian and Zhou, Mengqi and Xu, Jingxi and Zhang, Feihu and Liu, Jiaheng and Yao, Yao},
  year={2026}
}`}</code></pre>
        </section>
      ) : null}
    </main>
  );
}

function buildShowcaseComparisons(manifest: Manifest): ShowcaseComparison[] {
  const taskOrder = ["text2cad", "image2cad"];
  const formatPreference: Record<string, string[]> = {
    text2cad: ["openscad", "json"],
    image2cad: ["cadquery", "openscad", "threejs"],
    text_image2cad: ["cadquery", "openscad"],
  };
  const taskLabel = new Map(manifest.tasks.map((task) => [task.id, task.label]));
  const modelById = new Map(manifest.models.map((model) => [model.id, model]));
  const caseById = new Map(manifest.cases.map((item) => [item.id, item]));
  const completeRuns = manifest.runs.filter((run) => isCompleteDemoRun(run) && run.valid !== false);

  return taskOrder
    .map((task) => {
      const cases = manifest.cases.filter((item) => item.task === task);
      const availableFormats = Array.from(new Set(completeRuns.filter((run) => run.task === task).map((run) => run.format)));
      const formats = Array.from(new Set([...(formatPreference[task] || []), ...availableFormats])).filter((formatName) => availableFormats.includes(formatName));
      let best: { score: number; caseId: string; format: string; runs: Run[] } | null = null;

      cases.forEach((item, caseIndex) => {
        formats.forEach((formatName, formatIndex) => {
          const runs = pickComparisonRuns(completeRuns.filter((run) => run.task === task && run.case_id === item.id && run.format === formatName));
          if (runs.length < 3) return;
          const preferredCoverage = runs.reduce((sum, run) => sum + Math.max(0, 16 - modelPreferenceIndex(run.model)), 0);
          const curatedCaseIndex = (showcaseCasePreference[task] || []).indexOf(item.id);
          const curatedCaseBonus = curatedCaseIndex >= 0 ? 1600 - curatedCaseIndex * 160 : Math.max(0, 80 - caseIndex);
          const score = (formats.length - formatIndex) * 1000 + runs.length * 120 + curatedCaseBonus + preferredCoverage * 2 + runs.reduce((sum, run) => sum + runQuality(run) * 0.04, 0);
          if (!best || score > best.score) {
            best = { score, caseId: item.id, format: formatName, runs };
          }
        });
      });

      if (!best) return null;
      const referenceRun = best.runs[0];
      const caseItem = caseById.get(best.caseId);
      return {
        id: `${task}-${best.caseId}-${best.format}`,
        task,
        taskLabel: taskLabel.get(task) || task,
        title: displayShowcaseTitle(task, best.caseId, caseItem?.title),
        input: referenceRun.condition || caseItem?.title || `Case ${best.caseId}`,
        inputImage: referenceRun.assets.input_image || caseItem?.thumbnail,
        gtRender: referenceRun.assets.gt_render || "",
        gtMesh: referenceRun.assets.gt_mesh || "",
        formatLabel: outputFormatLabel(best.format),
        specLabel: inputSpecLabel(referenceRun.spec),
        variants: best.runs.map((run) => {
          const model = modelById.get(run.model);
          return {
            id: run.id,
            task: run.task,
            model: run.model,
            modelLabel: model?.label || run.model,
            family: model?.family || "",
            formatLabel: outputFormatLabel(run.format),
            specLabel: inputSpecLabel(run.spec),
            src: run.assets.pred_render || "",
            mesh: run.assets.mesh || "",
          };
        }),
      };
    })
    .filter((item): item is ShowcaseComparison => Boolean(item));
}

function displayShowcaseTitle(task: string, caseId: string, title?: string) {
  if (task === "text2cad") return `Text Case · ${caseId.split("/").pop() || caseId}`;
  return title || `Case ${caseId.split("/").pop() || caseId}`;
}

const modelComparisonPreference = [
  "gpt55-reason",
  "gemini-reason",
  "kimi_k26-reason",
  "claude-reason",
  "deepseek_v4pro-reason",
  "qwen-reason",
  "mimo_omni-reason",
  "doubao-reason",
  "glm_5v_turbo-reason",
  "glm-reason",
  "mimo_v25-reason",
];

const showcaseCasePreference: Record<string, string[]> = {
  text2cad: ["0075/00758810", "0013/00134405", "0053/00531353"],
  image2cad: ["articraft/wall_fan_20745"],
  text_image2cad: ["textimage2cad/144940_885193da"],
};

function pickComparisonRuns(runs: Run[]) {
  const byModel = new Map<string, Run>();
  [...runs]
    .sort((a, b) => runQuality(b) - runQuality(a) || specPriority(a.spec) - specPriority(b.spec) || a.id.localeCompare(b.id))
    .forEach((run) => {
      if (!byModel.has(run.model)) byModel.set(run.model, run);
    });

  return Array.from(byModel.values())
    .sort((a, b) => {
      const modelDelta = modelPreferenceIndex(a.model) - modelPreferenceIndex(b.model);
      if (modelDelta) return modelDelta;
      return runQuality(b) - runQuality(a) || a.id.localeCompare(b.id);
    })
    .slice(0, 3);
}

function modelPreferenceIndex(model: string) {
  const index = modelComparisonPreference.indexOf(model);
  return index === -1 ? modelComparisonPreference.length : index;
}

function isCompleteDemoRun(run: Run) {
  return Boolean((run.condition || "").trim() && (run.assets.generated || run.assets.generated_json) && run.assets.gt_mesh && run.assets.gt_render && run.assets.mesh && run.assets.pred_render);
}

function getInteractiveCaseIds(runs: Run[]) {
  return new Set(runs.map((run) => run.case_id));
}

function buildAvailabilitySummary(cases: Manifest["cases"], runs: Run[]): AvailabilitySummary {
  const caseIds = new Set(cases.map((item) => item.id));
  const modelIds = new Set(runs.map((run) => run.model));
  const formatIds = new Set(runs.map((run) => run.format));
  const completeRunKeys = new Set(runs.map((run) => `${run.case_id}/${run.model}/${run.format}`));
  const expectedCount = caseIds.size * modelIds.size * formatIds.size;
  return {
    invalidCount: Math.max(0, expectedCount - completeRunKeys.size),
    caseCount: caseIds.size,
    modelCount: modelIds.size,
    formatCount: formatIds.size,
  };
}

function AvailabilityNote({ summary }: { summary: AvailabilitySummary }) {
  if (!summary.invalidCount) return null;
  return (
    <p className="availability-note" title={`${summary.caseCount} cases, ${summary.modelCount} models, ${summary.formatCount} formats`}>
      <span aria-hidden="true" />
      Invalid or non-renderable outputs are omitted from these selectors ({summary.invalidCount} combinations).
    </p>
  );
}

function pickDefaultRun(runs: Run[]) {
  return [...runs].sort((a, b) => {
    const validityDelta = Number(b.valid !== false) - Number(a.valid !== false);
    if (validityDelta) return validityDelta;
    const formatDelta = formatPriority(a.format) - formatPriority(b.format);
    if (formatDelta) return formatDelta;
    const qualityDelta = runQuality(b) - runQuality(a);
    if (qualityDelta) return qualityDelta;
    const specDelta = specPriority(a.spec) - specPriority(b.spec);
    if (specDelta) return specDelta;
    return a.id.localeCompare(b.id);
  })[0];
}

function inputSpecLabel(spec: string) {
  if (spec === "image") return "Image input";
  if (spec === "image_text") return "Image + text input";
  return spec === "parametric" ? "Parametric input" : "Descriptive input";
}

function outputFormatLabel(formatName: string) {
  if (formatName === "json") return "JSON";
  if (formatName === "openscad") return "OpenSCAD";
  if (formatName === "cadquery") return "CadQuery";
  if (formatName === "threejs") return "Three.js";
  return formatName;
}

function outputFormatSummary(formatNames: string[]) {
  const unique = Array.from(new Set(formatNames)).sort((a, b) => formatPriority(a) - formatPriority(b));
  return unique.map(outputFormatLabel).join(" + ");
}

function pickGalleryPartItems(items: ComplexAssemblyItem[]) {
  const preferred = ["textimage2cad/113856_e7484fa7", "textimage2cad/20260_4a01a99d"];
  const selected = preferred
    .map((caseId) => items.find((item) => item.case_id === caseId))
    .filter((item): item is ComplexAssemblyItem => Boolean(item));
  if (selected.length >= 2) return selected.slice(0, 2);
  return [...selected, ...items.filter((item) => !selected.some((picked) => picked.id === item.id))].slice(0, 2);
}

function dedupeParts(parts: ComplexAssemblyPart[]): DisplayPart[] {
  const groups = new Map<string, DisplayPart>();
  for (const part of parts) {
    const displayName = normalizePartName(part.name);
    const current = groups.get(displayName);
    if (current) {
      current.count += 1;
    } else {
      groups.set(displayName, { ...part, count: 1, displayName });
    }
  }
  return Array.from(groups.values()).sort((a, b) => a.index - b.index);
}

function normalizePartName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/\b\d+\b/g, " ")
    .replace(/\b(left|right|upper|lower|top|bottom|front|back|center)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.startsWith("barrel stave")) return "barrel stave";
  if (normalized.startsWith("washer")) return "washer";
  if (normalized.startsWith("large button cap")) return "large button cap";
  if (normalized.startsWith("medium button cap")) return "medium button cap";
  if (normalized.startsWith("small button cap")) return "small button cap";
  if (normalized.startsWith("hex nut")) return "hex nut";
  if (normalized.startsWith("grooved pin")) return "grooved pin";
  return normalized || name;
}

function specPriority(spec: string) {
  if (spec === "parametric") return 0;
  if (spec === "image_text" || spec === "image") return 1;
  if (spec === "descriptive") return 2;
  return 3;
}

function formatPriority(formatName: string) {
  if (formatName === "json") return 0;
  if (formatName === "cadquery") return 1;
  if (formatName === "openscad") return 2;
  if (formatName === "threejs") return 3;
  return 4;
}

const modelFamilies: Record<string, ModelFamilyStyle> = {
  openai: { color: "#202123", icon: "icons/src/openai.svg" },
  gemini: { color: "#14B86A", icon: "icons/src/gemini-color.svg" },
  claude: { color: "#D97757", icon: "icons/src/claude-color.svg" },
  fable: { color: "#D97757", icon: "icons/src/claude-color.svg" },
  kimi: { color: "#1783FF", icon: "icons/src/kimi-color.svg", tile: "#111619" },
  zai: { color: "#8E5CFB", icon: "icons/src/zai.svg" },
  doubao: { color: "#00A6B8", icon: "icons/src/bytedance-color.svg" },
  deepseek: { color: "#4D6BFE", icon: "icons/src/deepseek-color.svg" },
  qwen: { color: "#FF6003", icon: "icons/src/qwen-color.svg" },
  mimo: { color: "#FF6900", icon: "icons/src/xiaomimimo.svg", tile: "#111619", filter: "invert(1)" },
};

function MainFigures() {
  return (
    <div className="main-figures">
      <figure className="leaderboard-figure">
        <a href="./figures/fig_tasks_grouped_bars.pdf" aria-label="Open leaderboard figure PDF">
          <img src="./figures/fig_tasks_grouped_bars.svg" alt="Task overview: grouped bar scores across text, image and assembly tasks" />
        </a>
      </figure>
    </div>
  );
}

function metricGroupStarts(groups: ResultSubtable["groups"]) {
  const starts = new Set<number>();
  let offset = 0;
  groups.forEach((group, index) => {
    if (index > 0) starts.add(offset);
    offset += group.span;
  });
  return starts;
}

function rankMetricRows(rows: ResultTableRow[], metricCount: number) {
  const tokens = rows.map((row) => row.cells.trim().split(/\s+/).map((token) => token.replace(/[!^]$/, "")));
  const ranks = Array.from({ length: metricCount }, (_, column) => {
    const values = Array.from(new Set(tokens.map((row) => Number(row[column])).filter(Number.isFinite))).sort((a, b) => b - a);
    return { best: values[0], second: values[1] };
  });
  return rows.map((row, rowIndex) => ({
    ...row,
    cells: tokens[rowIndex].map((token, column) => {
      if (column >= metricCount) return token;
      const value = Number(token);
      if (!Number.isFinite(value)) return token;
      if (value === ranks[column].best) return `${token}!`;
      if (value === ranks[column].second) return `${token}^`;
      return token;
    }).join(" "),
  }));
}

function parseSortableValue(token: string) {
  const value = Number(token.replace(/[$,!^]/g, ""));
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function ResultCell({ token, groupStart, summary }: { token: string; groupStart: boolean; summary?: "score" | "cost" }) {
  const className = ["rt-cell", groupStart ? "group-start" : "", summary ? `rt-summary-${summary}` : ""].filter(Boolean).join(" ");
  if (token === "-") return <td className={`${className} na`}>—</td>;
  if (token.endsWith("!")) return <td className={`${className} best`}>{token.slice(0, -1)}</td>;
  if (token.endsWith("^")) return <td className={`${className} second`}>{token.slice(0, -1)}</td>;
  return <td className={className}>{token}</td>;
}

function ResultsTables() {
  const [view, setView] = useState<"paper" | "live">(HAS_PAPER_SNAPSHOT ? "paper" : "live");
  const [paperTables, setPaperTables] = useState<ResultSubtable[] | null>(null);
  const [liveTables, setLiveTables] = useState<ResultSubtable[] | null>(null);
  const [paperError, setPaperError] = useState("");

  useEffect(() => {
    if (INCLUDE_LIVE) {
      import("./resultsData").then((module) => setLiveTables(module.liveResultTables));
    }
    if (!HAS_PAPER_SNAPSHOT) {
      setPaperError("This build does not contain a verified paper snapshot.");
      return;
    }
    loadPaperResultTables(releaseAsset("paper-snapshot.json"))
      .then((tables) => {
        setPaperTables(tables);
        setPaperError("");
      })
      .catch((error: unknown) => {
        setPaperTables(null);
        setPaperError(error instanceof Error ? error.message : "Paper snapshot validation failed.");
      });
  }, []);

  const subtables = view === "paper" ? paperTables : liveTables;
  return (
    <div className="results-tables">
      {INCLUDE_LIVE ? (
        <div className="results-view-toggle" role="tablist" aria-label="Leaderboard version">
          <button type="button" role="tab" aria-selected={view === "paper"} className={view === "paper" ? "rv-tab active" : "rv-tab"} onClick={() => setView("paper")}>Paper results</button>
          <button type="button" role="tab" aria-selected={view === "live"} className={view === "live" ? "rv-tab active" : "rv-tab"} onClick={() => setView("live")}>Live leaderboard</button>
        </div>
      ) : null}
      {subtables
        ? subtables.map((subtable) => <ResultsSubtableTable subtable={subtable} key={`${view}-${subtable.key}`} />)
        : <Placeholder title="Paper results unavailable" text={paperError || "Verifying the paper snapshot…"} />}
    </div>
  );
}

function ResultsSubtableTable({ subtable }: { subtable: ResultSubtable }) {
  const groupStarts = metricGroupStarts(subtable.groups);
  const headerRows = subtable.superGroups ? 3 : 2;
  const scoreIndex = subtable.metrics.indexOf("Score");
  const costIndex = subtable.metrics.findIndex((metric) => metric.startsWith("USD"));
  const rankedRows = scoreIndex >= 0 ? rankMetricRows(subtable.rows, scoreIndex) : subtable.rows;
  const [sort, setSort] = useState(scoreIndex >= 0 ? "score-desc" : "default");
  const sortIndex = sort.startsWith("score") ? scoreIndex : sort.startsWith("cost") ? costIndex : -1;
  const rows = sortIndex < 0 ? rankedRows : [...rankedRows]
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const leftValue = parseSortableValue(left.row.cells.trim().split(/\s+/)[sortIndex]);
      const rightValue = parseSortableValue(right.row.cells.trim().split(/\s+/)[sortIndex]);
      const difference = sort.endsWith("asc") ? leftValue - rightValue : rightValue - leftValue;
      return difference || left.index - right.index;
    })
    .map((item) => item.row);
  const sortState = (index: number): React.AriaAttributes["aria-sort"] => {
    if (index === scoreIndex) return sort.startsWith("score") ? sort.endsWith("asc") ? "ascending" : "descending" : "none";
    if (index === costIndex) return sort.startsWith("cost") ? sort.endsWith("asc") ? "ascending" : "descending" : "none";
    return undefined;
  };
  const toggleSort = (index: number) => {
    const kind = index === scoreIndex ? "score" : "cost";
    if (!sort.startsWith(kind)) {
      setSort(kind === "score" ? "score-desc" : "cost-asc");
      return;
    }
    setSort(sort.endsWith("asc") ? `${kind}-desc` : `${kind}-asc`);
  };
  const sortLabel = (index: number) => {
    const label = index === scoreIndex ? "overall score" : "cost";
    const state = sortState(index);
    const direction = state === "ascending" ? "high to low" : state === "descending" ? "low to high" : index === scoreIndex ? "high to low" : "low to high";
    return `Sort ${label} ${direction}`;
  };
  const sortIndicator = (index: number) => sortState(index) === "ascending" ? "↑" : sortState(index) === "descending" ? "↓" : "↕";
  const renderRow = (row: ResultTableRow, domain: boolean) => {
    const family = row.family ? modelFamilies[row.family] : undefined;
    const tokens = row.cells.trim().split(/\s+/);
    return (
      <tr className={domain ? "rt-row rt-domain" : "rt-row"} key={row.model}>
        <th scope="row" className="rt-model-col">
          <span className="rt-model">
            {family ? (
              <span className="model-mark" style={{ "--model-tile": family.tile || "#fffdfa", "--icon-filter": family.filter || "none" } as React.CSSProperties}>
                <img src={asset(family.icon)} alt="" aria-hidden="true" />
              </span>
            ) : <span className="model-mark rt-mark-empty" aria-hidden="true" />}
            <strong>{row.model}</strong>
          </span>
        </th>
        {tokens.map((token, column) => (
          <ResultCell
            token={token}
            groupStart={groupStarts.has(column)}
            summary={column === scoreIndex ? "score" : column === costIndex ? "cost" : undefined}
            key={column}
          />
        ))}
      </tr>
    );
  };
  return (
    <div className="rt-block" style={{ "--rt-accent": subtable.accent } as React.CSSProperties}>
      <div className="rt-block-head"><span className="rt-tag">{subtable.title}</span></div>
      <div className={`rt-scroll ${scoreIndex >= 0 ? "has-summary" : ""}`}>
        <table className={`results-table ${scoreIndex >= 0 ? "has-summary" : ""}`}>
          <thead>
            {subtable.superGroups ? (
              <tr className="rt-superrow">
                <th rowSpan={headerRows} className="rt-model-col rt-corner">Model</th>
                {subtable.superGroups.map((group, index) => (
                  <th
                    colSpan={group.span}
                    className={["rt-super", index > 0 ? "group-start" : "", scoreIndex >= 0 && index === subtable.superGroups!.length - 1 ? "rt-summary-group" : ""].filter(Boolean).join(" ")}
                    key={group.label}
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
            ) : null}
            <tr className="rt-grouprow">
              {subtable.superGroups ? null : <th rowSpan={2} className="rt-model-col rt-corner">Model</th>}
              {subtable.groups.map((group, index) => (
                <th
                  colSpan={group.span}
                  className={["rt-group", index > 0 ? "group-start" : "", scoreIndex >= 0 && index === subtable.groups.length - 1 ? "rt-summary-group" : ""].filter(Boolean).join(" ")}
                  key={`${group.label}-${index}`}
                >
                  {group.label}
                </th>
              ))}
            </tr>
            <tr className="rt-metricrow">
              {subtable.metrics.map((metric, index) => {
                const summary = index === scoreIndex ? "score" : index === costIndex ? "cost" : undefined;
                return (
                  <th
                    className={["rt-metric", groupStarts.has(index) ? "group-start" : "", summary ? `rt-summary-${summary}` : ""].filter(Boolean).join(" ")}
                    aria-sort={sortState(index)}
                    key={`${metric}-${index}`}
                  >
                    {summary ? (
                      <button
                        type="button"
                        className="rt-summary-sort"
                        aria-label={sortLabel(index)}
                        title={sortLabel(index)}
                        onClick={() => toggleSort(index)}
                      >
                        <span>{metric}</span>
                        <span className="rt-sort-indicator" aria-hidden="true">{sortIndicator(index)}</span>
                      </button>
                    ) : metric}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => renderRow(row, false))}
            {subtable.domainRows?.map((row) => renderRow(row, true))}
          </tbody>
        </table>
      </div>
      {subtable.note ? <p className="rt-note">{subtable.note}</p> : null}
    </div>
  );
}

function runQuality(run: Run) {
  const metrics = run.metrics || {};
  let score = run.valid === false ? -200 : 20;
  const visibleMetricCount = countVisibleMetricValues(run);
  score += visibleMetricCount * 35;
  if (!visibleMetricCount) score -= 90;
  score += numberMetric(metrics.qa_overall ?? metrics.qa_overall_accuracy) * 120;
  score += numberMetric(metrics.qa_semantic) * 28;
  score += numberMetric(metrics.qa_parametric) * 16;
  score += numberMetric(metrics.judge_geometry) * 3;
  score += numberMetric(metrics.judge_semantic) * 3;
  score += numberMetric(metrics.judge_aesthetics) * 3;
  if (typeof metrics.chamfer_distance === "number" && metrics.chamfer_distance > 0) {
    score += Math.max(0, 18 - Math.log10(metrics.chamfer_distance * 10000 + 1) * 5);
  }
  return score;
}

function numberMetric(value: number | string | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function countVisibleMetricValues(run: Run) {
  return Object.entries(run.metrics || {}).filter(([key, value]) => isVisibleMetric(key, value, run)).length;
}

function RenderShowcase({ comparisons }: { comparisons: ShowcaseComparison[] }) {
  const [expandedItem, setExpandedItem] = useState<InputModalItem | null>(null);

  if (!comparisons.length) {
    return <Placeholder title="Render Showcase" />;
  }

  return (
    <div className="render-showcase">
      {comparisons.map((comparison, index) => {
        const inputItem = {
          title: comparison.title,
          task: comparison.task,
          taskLabel: comparison.taskLabel,
          specLabel: comparison.specLabel,
          input: comparison.input,
          inputImage: comparison.inputImage,
          subtitle: `${comparison.formatLabel} comparison`,
        };

        return (
          <article
            className="comparison-panel"
            key={comparison.id}
            style={{ "--task-accent": tileColors[index % tileColors.length] } as React.CSSProperties}
          >
            <div className="comparison-head">
              <div>
                <span>{comparison.taskLabel}</span>
                <h3>{comparison.title}</h3>
              </div>
              <strong>{comparison.formatLabel}</strong>
            </div>

            <div className="comparison-body">
              <aside className="comparison-reference">
                <div className="compare-card-head">
                  <div>
                    <span>Reference</span>
                    <strong>Ground Truth</strong>
                  </div>
                </div>
                <div className="compare-viewer gt-viewer">
                  <CadViewer
                    item={{
                      id: `${comparison.id}-ground-truth`,
                      task: comparison.task,
                      title: comparison.title,
                      subtitle: "Ground Truth",
                      src: comparison.gtRender,
                      mesh: comparison.gtMesh,
                    }}
                  />
                </div>
                <div className="comparison-input">
                  {comparison.inputImage ? <img src={asset(comparison.inputImage)} alt="Input reference" /> : null}
                  {comparison.task === "text_image2cad" ? (
                    <button className="viewer-full-input" type="button" onClick={() => setExpandedItem(inputItem)}>View assembly annotation</button>
                  ) : (
                    <>
                      <InputAnnotation task={comparison.task} text={comparison.input} compact />
                      {hasExpandableInput(inputItem) ? <button className="viewer-full-input" type="button" onClick={() => setExpandedItem(inputItem)}>View full input</button> : null}
                    </>
                  )}
                </div>
              </aside>

              <div className="model-comparison-grid">
                {comparison.variants.map((variant) => {
                  const family = modelFamilies[variant.family] || { color: "#337665", icon: "icons/src/openai.svg" };
                  return (
                    <section
                      className="model-comparison-card"
                      key={variant.id}
                      style={{
                        "--model-color": family.color,
                        "--model-tile": family.tile || "#fffdfa",
                        "--icon-filter": family.filter || "none",
                      } as React.CSSProperties}
                    >
                      <div className="compare-card-head">
                        <span className="model-mark compare-model-mark">
                          <img src={asset(family.icon)} alt="" aria-hidden="true" />
                        </span>
                        <div>
                          <span>{variant.formatLabel}</span>
                          <strong>{variant.modelLabel}</strong>
                        </div>
                      </div>
                      <div className="compare-viewer">
                        <CadViewer
                          item={{
                            id: variant.id,
                            task: variant.task,
                            title: variant.modelLabel,
                            subtitle: variant.formatLabel,
                            src: variant.src,
                            mesh: variant.mesh,
                          }}
                        />
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
      {expandedItem ? <InputModal item={expandedItem} onClose={() => setExpandedItem(null)} /> : null}
    </div>
  );
}

function GalleryPartShowcase({ items }: { items: ComplexAssemblyItem[] }) {
  const selected = pickGalleryPartItems(items);
  if (!selected.length) return null;

  return (
    <>
      {selected.map((item) => (
        <section className="gallery-part-showcase complex-assembly-showcase" key={item.id}>
          <div className="complex-head">
            <div>
              <span>Assembly-3D</span>
              <h3>Generated assembly and parts</h3>
            </div>
            <div className="complex-linked-case">
              <span>{item.format_label}</span>
              <strong>{item.model_label} / {item.short_case_id}</strong>
            </div>
          </div>
          <PartDecompositionPanel item={item} />
        </section>
      ))}
    </>
  );
}

function PartDecompositionPanel({
  item,
}: {
  item: ComplexAssemblyItem;
}) {
  const [localPartIndex, setLocalPartIndex] = useState(0);
  const parts = useMemo(() => dedupeParts(item.parts), [item.parts]);
  const activePart = parts.find((part) => part.index === localPartIndex) || parts[0];

  useEffect(() => {
    setLocalPartIndex(parts[0]?.index ?? 0);
  }, [item.id]);

  return (
    <>
      <div className="assembly-part-layout">
        <div className="complex-viewer-card">
          <div className="complex-card-head">
            <span>Reference assembly</span>
            <strong>Ground truth</strong>
          </div>
          <div className="complex-viewer">
            {item.assets.gt_render ? <img className="complex-reference-image" src={asset(item.assets.gt_render)} alt="Ground truth assembly" /> : null}
          </div>
        </div>

        <div className="complex-viewer-card">
          <div className="complex-card-head">
            <span>Predicted assembly</span>
            <strong>{item.model_label}</strong>
          </div>
          <div className="complex-viewer">
            <CadViewer
              item={{
                id: `${item.id}-stage2-assembly`,
                task: "text_image2cad",
                title: item.short_case_id,
                subtitle: item.model_label,
                src: item.assets.pred_render || "",
                mesh: item.assets.mesh || item.assets.stage2_mesh || "",
              }}
              variant="result"
            />
          </div>
        </div>

        <div className="part-inspector">
          <div className="complex-card-head">
            <span>Selected part</span>
            <strong>{activePart?.displayName || activePart?.name || "Part"}</strong>
          </div>
          <div className="part-viewer">
            {activePart?.mesh ? (
              <CadViewer
                item={{
                  id: `${item.id}-${activePart.index}`,
                  task: "text_image2cad",
                  title: activePart.displayName || activePart.name,
                  subtitle: activePart.count > 1 ? `x${activePart.count}` : activePart.label,
                  mesh: activePart.mesh,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="part-tile-grid" aria-label="Generated assembly parts">
        {parts.map((part) => (
          <button
            type="button"
            className={part.index === activePart?.index ? "part-tile active" : "part-tile"}
            key={`${item.id}-${part.index}`}
            onClick={() => setLocalPartIndex(part.index)}
          >
            <span>{part.count > 1 ? `x${part.count}` : part.label.replace("Part ", "")}</span>
            <strong>{part.displayName || part.name}</strong>
          </button>
        ))}
      </div>
    </>
  );
}

function InputModal({ item, onClose }: { item: InputModalItem; onClose: () => void }) {
  return (
    <div className="input-modal" role="dialog" aria-modal="true" aria-labelledby="input-modal-title" onClick={onClose}>
      <div className="input-modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="input-modal-head">
          <span>{item.taskLabel} · {item.specLabel}</span>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <h3 id="input-modal-title">{item.title}</h3>
        {item.inputImage ? <img className="input-modal-image" src={asset(item.inputImage)} alt="Input reference" /> : null}
        <InputAnnotation task={item.task} text={item.input} />
        <em>{item.subtitle}</em>
      </div>
    </div>
  );
}

function InputAnnotation({ task, text, compact = false }: { task?: string; text: string; compact?: boolean }) {
  if (task !== "text_image2cad") {
    return <p>{text}</p>;
  }

  const annotation = parseAssemblyAnnotation(text);
  return (
    <div className={compact ? "assembly-annotation compact" : "assembly-annotation"}>
      {annotation.assembly ? (
        <section>
          <h4>assembly-level annotation</h4>
          <p>{annotation.assembly}</p>
        </section>
      ) : null}
      {annotation.parts.length ? (
        <section>
          <h4>part-level annotation</h4>
          <ol>
            {annotation.parts.map((part, index) => (
              <li key={`${part.name}-${index}`}>
                <strong>part {index + 1}</strong>
                <span>{part.short || "No part-level annotation available; see annotation caveats."}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {annotation.caveats ? (
        <section>
          <h4>annotation caveats</h4>
          <p>{annotation.caveats}</p>
        </section>
      ) : null}
    </div>
  );
}

function parseAssemblyAnnotation(text: string) {
  const normalized = (text || "").trim();
  const partsMarker = "\nParts:";
  const caveatMarker = "\nAnnotation Caveats:";
  const partsIndex = normalized.indexOf(partsMarker);
  const caveatIndex = normalized.indexOf(caveatMarker);
  const assemblyEnd = [partsIndex, caveatIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? normalized.length;
  const assembly = normalized.slice(0, assemblyEnd).trim();
  const partsStart = partsIndex >= 0 ? partsIndex + partsMarker.length : -1;
  const partsEnd = caveatIndex >= 0 ? caveatIndex : normalized.length;
  const partsText = partsStart >= 0 ? normalized.slice(partsStart, partsEnd).trim() : "";
  const caveats = caveatIndex >= 0 ? normalized.slice(caveatIndex + caveatMarker.length).trim() : "";
  const parts = partsText
    .split(/\n(?=-\s+)/)
    .map((line) => line.replace(/^-\s+/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":");
      if (separator < 0) return { name: "", short: line };
      return {
        name: line.slice(0, separator).trim(),
        short: line.slice(separator + 1).trim(),
      };
    });

  return { assembly, parts, caveats };
}

const tileColors = ["#337665", "#2f7a86", "#4f88a8", "#7aa08f"];

const renderTaskStyles: Record<string, { body: number; edge: number; shadow: number; rim: number }> = {
  text2cad: { body: 0xbfd9ec, edge: 0x316c92, shadow: 0x5a7382, rim: 0xd9efff },
  image2cad: { body: 0xb5ddcf, edge: 0x2e7564, shadow: 0x4f786c, rim: 0xd9f4ea },
  text_image2cad: { body: 0xbfdddf, edge: 0x4b7580, shadow: 0x5b747b, rim: 0xe1f5f6 },
};

function renderStyleForTask(task?: string) {
  return renderTaskStyles[task || ""] || renderTaskStyles.text2cad;
}

function GroundTruthFigure({ run, title, subtitle }: { run?: Run; title: string; subtitle: string }) {
  if (!run?.assets.gt_mesh) {
    return <Figure title="Ground Truth" src={run?.assets.gt_render} />;
  }

  return (
    <figure className="render-card result-viewer-card">
      <span>Ground Truth</span>
      <div className="result-viewer">
        <CadViewer
          item={{
            id: `${run.case_id}-${run.spec}-ground-truth`,
            task: run.task,
            title,
            subtitle,
            src: run.assets.gt_render || "",
            mesh: run.assets.gt_mesh,
          }}
          variant="result"
        />
      </div>
    </figure>
  );
}

function PredictionFigure({ run, title, subtitle }: { run?: Run; title: string; subtitle: string }) {
  if (!run?.assets.mesh) {
    return <Figure title="Prediction" src={run?.assets.pred_render} />;
  }

  return (
    <figure className="render-card result-viewer-card">
      <span>Prediction</span>
      <div className="result-viewer">
        <CadViewer
          item={{
            id: run.id,
            task: run.task,
            title,
            subtitle,
            src: run.assets.pred_render || "",
            mesh: run.assets.mesh,
          }}
          variant="result"
        />
      </div>
    </figure>
  );
}

function CadViewer({ item, variant = "showcase" }: { item: CadViewItem; variant?: "showcase" | "result" }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !item.mesh) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 6.8, 12.2);
    const taskStyle = renderStyleForTask(item.task);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    camera.position.set(3.6, 2.35, variant === "result" ? 4.35 : 4.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 7.5;

    scene.add(new THREE.HemisphereLight(0xfafffc, 0xb9cac2, 1.95));

    const key = new THREE.DirectionalLight(0xffffff, 2.65);
    key.position.set(3.8, 4.8, 3.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xb7eadf, 0.86);
    fill.position.set(-3.2, 2.2, -2.6);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc6e5ff, 0.62);
    rim.position.set(-2.4, 3.4, 3.4);
    scene.add(rim);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4),
      new THREE.ShadowMaterial({ color: taskStyle.shadow, opacity: 0.09 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.06;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const group = new THREE.Group();
    group.rotation.x = -Math.PI / 2;
    scene.add(group);

    let disposed = false;
    let frame = 0;
    let loadedGeometry: THREE.BufferGeometry | null = null;
    let loadedMaterial: THREE.Material | null = null;
    let edgeGeometry: THREE.BufferGeometry | null = null;
    let edgeMaterial: THREE.Material | null = null;

    const loader = new STLLoader();
    loader.load(asset(item.mesh), (geometry) => {
      if (disposed) {
        geometry.dispose();
        return;
      }
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.center();
      const box = geometry.boundingBox;
      const size = new THREE.Vector3();
      box?.getSize(size);
      const maxAxis = Math.max(size.x, size.y, size.z) || 1;
      const targetScale = variant === "result" ? 2.32 : 2.08;
      geometry.scale(targetScale / maxAxis, targetScale / maxAxis, targetScale / maxAxis);
      geometry.computeBoundingBox();
      loadedGeometry = geometry;

      const material = new THREE.MeshPhysicalMaterial({
        color: taskStyle.body,
        roughness: 0.58,
        metalness: 0.02,
        clearcoat: 0.1,
        clearcoatRoughness: 0.68,
        emissive: taskStyle.rim,
        emissiveIntensity: 0.006,
      });
      loadedMaterial = material;

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      edgeGeometry = new THREE.EdgesGeometry(geometry, 28);
      edgeMaterial = new THREE.LineBasicMaterial({ color: taskStyle.edge, transparent: true, opacity: variant === "result" ? 0.24 : 0.28 });
      group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
    });

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      const width = Math.max(320, clientWidth);
      const height = Math.max(360, clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      loadedGeometry?.dispose();
      loadedMaterial?.dispose();
      edgeGeometry?.dispose();
      edgeMaterial?.dispose();
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [item.id, item.mesh, variant]);

  return <div className="cad-viewer" ref={mountRef} />;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <label className="select-label">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, text]) => <option value={id} key={id}>{text}</option>)}
      </select>
    </label>
  );
}

function CaseImagePicker({ cases, activeCaseId, onSelect }: { cases: Manifest["cases"]; activeCaseId: string; onSelect: (caseId: string) => void }) {
  const imageCases = cases.filter((item) => item.thumbnail);
  if (!imageCases.length) return null;

  return (
    <div className="case-image-picker" aria-label="Image case picker">
      {imageCases.map((item) => (
        <button
          key={item.id}
          type="button"
          className={item.id === activeCaseId ? "case-image-tile active" : "case-image-tile"}
          onClick={() => onSelect(item.id)}
          title={item.title}
        >
          <img src={asset(item.thumbnail)} alt="" aria-hidden="true" />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function hasExpandableInput(item: Pick<InputModalItem, "input" | "inputImage">) {
  const input = item.input || "";
  return Boolean(item.inputImage || input.length > 180 || input.includes("\n"));
}

const superscriptDigits: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

function normalizeSuperscript(text: string) {
  return text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (char) => superscriptDigits[char] || char);
}

function renderAuthor(author: string) {
  const match = author.match(/^(.+?)([⁰¹²³⁴⁵⁶⁷⁸⁹,\*]+)$/);
  if (!match) return author;
  return <>{match[1]}<sup>{normalizeSuperscript(match[2])}</sup></>;
}

function renderAffiliation(affiliation: string) {
  const match = affiliation.match(/^([⁰¹²³⁴⁵⁶⁷⁸⁹]+)(.+)$/);
  if (!match) return affiliation;
  return <><sup>{normalizeSuperscript(match[1])}</sup>{match[2]}</>;
}

function Figure({ title, src }: { title: string; src?: string }) {
  return (
    <figure className="render-card">
      <span>{title}</span>
      {src ? <img src={asset(src)} alt={title} /> : <div className="render-missing"><ImageIcon />No render</div>}
    </figure>
  );
}

function Collapsible({ title, icon, defaultOpen = false, children }: { title: string; icon?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`collapsible ${open ? "open" : "closed"}`}>
      <button className="collapsible-header" type="button" onClick={() => setOpen(!open)}>
        {icon ? <span className="collapsible-icon">{icon}</span> : null}
        <span className="collapsible-title">{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open ? <div className="collapsible-body">{children}</div> : null}
    </div>
  );
}

function MetricStrip({ run }: { run?: Run }) {
  const entries = getMetricEntries(run);
  if (!entries.length) return null;
  return (
    <div className="metrics">
      {entries.length ? entries.map((entry) => (
        <div className="metric" key={entry.key}>
          <span>{entry.label}</span>
          <strong>{entry.value}</strong>
        </div>
      )) : null}
    </div>
  );
}

const metricOrder = [
  "chamfer_distance",
  "hausdorff_distance",
  "f_score_005",
  "f_score_001",
  "normal_consistency",
  "iou_csg",
  "iou_voxel",
  "pred_open_edge_ratio",
  "qa_overall",
  "qa_overall_accuracy",
  "qa_semantic",
  "qa_parametric",
  "judge_geometry",
  "judge_semantic",
  "judge_aesthetics",
];

const metricLabels: Record<string, string> = {
  chamfer_distance: "Chamfer",
  hausdorff_distance: "Hausdorff",
  f_score_005: "F@0.05",
  f_score_001: "F@0.01",
  normal_consistency: "Normal",
  iou_csg: "IoU CSG",
  iou_voxel: "IoU voxel",
  pred_open_edge_ratio: "Open edge",
  qa_overall: "Overall QA",
  qa_overall_accuracy: "Overall QA",
  qa_semantic: "Semantic QA",
  qa_parametric: "Parametric QA",
  judge_geometry: "Geometry score",
  judge_semantic: "Semantic score",
  judge_aesthetics: "Aesthetic score",
  acc_cmd: "Command acc.",
  acc_param: "Parameter acc.",
};

function getMetricEntries(run?: Run) {
  if (!run) return [];
  const metrics = run.metrics || {};
  const keys = [
    ...metricOrder.filter((key) => isVisibleMetric(key, metrics[key], run)),
    ...Object.keys(metrics)
      .filter((key) => !metricOrder.includes(key) && isVisibleMetric(key, metrics[key], run))
      .sort(),
  ];
  const entries = keys.map((key) => ({
    key,
    label: metricLabels[key] || key.replace(/_/g, " "),
    value: formatMetricValue(key, metrics[key]),
  }));
  if (entries.length && run.valid !== null && run.valid !== undefined) {
    entries.unshift({ key: "valid", label: "Executable", value: run.valid ? "yes" : "no" });
  }
  return entries;
}

function isVisibleMetric(key: string, value: unknown, run: Run) {
  if (!hasMetricValue(value)) return false;
  if (key === "qa_parametric" && run.spec !== "parametric") return false;
  if (key === "qa_parametric" && typeof value === "number" && value <= 0) return false;
  return true;
}

function hasMetricValue(value: unknown) {
  return value !== null && value !== undefined && value !== "" && !(typeof value === "number" && Number.isNaN(value));
}

function formatMetricValue(key: string, value: number | string | null) {
  if (typeof value !== "number") return String(value);
  if (key.startsWith("judge_") && Number.isInteger(value)) return String(value);
  if (key === "pred_open_edge_ratio") return value.toFixed(3);
  if (key.includes("chamfer") || key.includes("hausdorff")) {
    if (value === 0) return "0";
    return value < 0.01 ? value.toFixed(4) : value.toFixed(3);
  }
  return value < 1 ? value.toFixed(3) : value.toFixed(2);
}

function Placeholder({ title, text }: { title: string; text?: string }) {
  return (
    <div className="placeholder">
      <Layers3 size={32} />
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
