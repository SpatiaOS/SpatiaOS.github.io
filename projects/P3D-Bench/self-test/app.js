const API_ROOT = "https://spatiaos-eval.2565851683.workers.dev";
const SESSION_KEY = "spatiaos-public-self-test-v1";

const state = {
  catalog: null,
  suite: null,
  requestId: null,
  recoveryKey: null,
  submissionId: null,
  selfTest: null,
  activeCase: 0,
  pollTimer: null,
  imageUrl: null,
};

const byId = (id) => document.getElementById(id);
const createForm = byId("create-form");
const uploadForm = byId("upload-form");

function setMessage(id, text, error = false) {
  const target = byId(id);
  target.textContent = text || "";
  target.classList.toggle("error", error);
}

function setStep(step) {
  document.querySelectorAll(".stepbar li").forEach((item) => item.classList.toggle("active", Number(item.dataset.step) <= step));
}

function saveSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    requestId: state.requestId,
    recoveryKey: state.recoveryKey,
    submissionId: state.submissionId,
  }));
}

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (saved?.requestId && saved?.recoveryKey) Object.assign(state, saved);
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

async function api(path, options = {}, recovery = false) {
  const headers = new Headers(options.headers || {});
  if (recovery && state.recoveryKey) headers.set("X-SpatiaOS-Recovery-Key", state.recoveryKey);
  const response = await fetch(`${API_ROOT}${path}`, { ...options, headers, credentials: "omit" });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.blob();
  if (!response.ok) {
    const message = payload?.error || payload?.detail?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function statusText(value) {
  const labels = {
    pending: "等待 bridge",
    uploaded: "已上传",
    queued: "排队中",
    running: "评测中",
    complete: "已完成",
    completed: "已完成",
    failed: "失败",
    bridge_error: "传输异常",
  };
  return labels[value] || value || "等待中";
}

async function loadService() {
  const indicator = byId("service-state");
  try {
    const [health, catalog, capacity] = await Promise.all([
      api("/api/health"),
      api("/api/catalog"),
      api("/api/capacity"),
    ]);
    state.catalog = catalog;
    indicator.dataset.state = health.status === "ok" ? "ok" : "error";
    indicator.lastElementChild.textContent = health.status === "ok" ? "服务可用" : "服务预热中";
    byId("capacity-note").textContent = capacity.accepting_requests
      ? `当前可提交 · 单次 ${Math.round((capacity.max_submission_bytes || 8388608) / 1048576)} MiB · 交换保留 ${capacity.retention_hours || 24} h`
      : "当前暂停新任务";
    populateCatalog();
    byId("create-button").disabled = !capacity.accepting_requests;
  } catch (error) {
    indicator.dataset.state = "error";
    indicator.lastElementChild.textContent = "服务不可用";
    byId("capacity-note").textContent = error.message;
    byId("create-button").disabled = true;
  }
}

function option(value, label, disabled = false) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  node.disabled = disabled;
  return node;
}

function suites() {
  return Array.isArray(state.catalog?.suites) ? state.catalog.suites : [];
}

function populateCatalog() {
  const benchmark = byId("benchmark");
  benchmark.replaceChildren();
  [...new Set(suites().map((item) => item.benchmark))].forEach((name) => benchmark.append(option(name, name.toUpperCase())));
  populateSuites();
}

function populateSuites() {
  const selectedBenchmark = byId("benchmark").value;
  const suiteSelect = byId("suite");
  suiteSelect.replaceChildren();
  suites().filter((item) => item.benchmark === selectedBenchmark).forEach((item) => {
    suiteSelect.append(option(`${item.suite_id}@${item.version}`, `${item.suite_id} · ${item.version}`));
  });
  selectSuite();
}

function selectSuite() {
  const [suiteId, version] = byId("suite").value.split("@");
  state.suite = suites().find((item) => item.benchmark === byId("benchmark").value && item.suite_id === suiteId && item.version === version) || null;
  const taskSelect = byId("task");
  taskSelect.replaceChildren();
  (state.suite?.tasks || []).forEach((task) => taskSelect.append(option(task, task)));
  populateFormats();
  renderMatrix();
}

function populateFormats() {
  const task = byId("task").value;
  const formatSelect = byId("format");
  formatSelect.replaceChildren();
  const capabilities = (state.suite?.capabilities || []).filter((item) => item.task === task);
  capabilities
    .sort((left, right) => Number(right.status === "available") - Number(left.status === "available"))
    .forEach((capability) => formatSelect.append(option(
      capability.format,
      capability.status === "available" ? capability.format : `${capability.format}（适配中）`,
      capability.status !== "available",
    )));
}

function renderMatrix() {
  const root = byId("capability-matrix");
  root.replaceChildren();
  const capabilities = state.suite?.capabilities || [];
  capabilities.forEach((capability) => {
    const row = document.createElement("div");
    row.className = "capability-row";
    const task = document.createElement("strong");
    task.textContent = capability.task;
    const format = document.createElement("code");
    format.textContent = capability.format;
    const status = document.createElement("span");
    status.className = `status-label ${capability.status === "available" ? "available" : ""}`;
    status.textContent = capability.status === "available" ? "可用" : "适配中";
    row.append(task, format, status);
    root.append(row);
  });
  byId("matrix-count").textContent = `${capabilities.filter((item) => item.status === "available").length} / ${capabilities.length} 可用`;
}

async function createRequest(event) {
  event.preventDefault();
  const button = byId("create-button");
  button.disabled = true;
  setMessage("create-message", "正在创建任务…");
  try {
    const scale = Number(new FormData(createForm).get("scale") || 1);
    const index = Number(byId("case-index").value || 0);
    const payload = {
      benchmark: byId("benchmark").value,
      suite: state.suite.suite_id,
      suite_version: state.suite.version,
      tasks: [byId("task").value],
      n_cases: scale,
      ...(index ? { case_indices: Array.from({ length: scale }, (_, offset) => index + offset) } : {}),
      format: byId("format").value,
      method: byId("method").value.trim(),
      model: byId("model").value.trim(),
    };
    const created = await api("/api/self-tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SpatiaOS-Pilot-Key": byId("pilot-key").value,
      },
      body: JSON.stringify(payload),
    });
    state.requestId = created.request_id;
    state.recoveryKey = created.recovery_key;
    state.submissionId = null;
    saveSession();
    setMessage("create-message", "任务已创建，正在准备可见输入。");
    await pollSelfTest();
  } catch (error) {
    setMessage("create-message", error.message, true);
    button.disabled = false;
  }
}

async function pollSelfTest() {
  if (!state.requestId || !state.recoveryKey) return;
  try {
    const response = await api(`/api/self-tests/${encodeURIComponent(state.requestId)}`, {}, true);
    if (response.status === "ready") {
      state.selfTest = response.self_test;
      renderTaskPack();
      return;
    }
    setMessage("create-message", `${statusText(response.status)}，约 15 秒刷新。`);
    clearTimeout(state.pollTimer);
    state.pollTimer = setTimeout(pollSelfTest, 5000);
  } catch (error) {
    setMessage("create-message", error.message, true);
    byId("create-button").disabled = false;
  }
}

function renderTaskPack() {
  const cases = state.selfTest?.cases || [];
  syncFormFromSelfTest();
  byId("task-pack").hidden = false;
  byId("submission").hidden = false;
  byId("request-label").textContent = state.requestId;
  byId("expected-files").textContent = cases.map((item) => item.submission_filename).join(" · ");
  byId("artifact-files").accept = [...new Set(cases.map((item) => `.${item.submission_filename.split(".").pop()}`))].join(",");
  const list = byId("case-list");
  list.replaceChildren();
  cases.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-button";
    const count = document.createElement("span");
    count.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("strong");
    name.textContent = item.case_id;
    button.append(count, name);
    button.addEventListener("click", () => showCase(index));
    list.append(button);
  });
  showCase(Math.min(state.activeCase, Math.max(0, cases.length - 1)));
  setStep(state.submissionId ? 4 : 3);
  setMessage("create-message", "Task pack 已就绪。");
  byId("task-pack").scrollIntoView({ behavior: "smooth", block: "start" });
  if (state.submissionId) pollSubmission();
}

function syncFormFromSelfTest() {
  if (!state.selfTest || !state.catalog) return;
  byId("benchmark").value = state.selfTest.benchmark;
  populateSuites();
  byId("suite").value = `${state.selfTest.suite}@${state.selfTest.suite_version}`;
  selectSuite();
  byId("task").value = state.selfTest.tasks?.[0] || "";
  populateFormats();
  byId("format").value = state.selfTest.format;
  byId("method").value = state.selfTest.method || "external-method";
  byId("model").value = state.selfTest.model || "user-supplied";
  const caseCount = state.selfTest.cases?.length || 1;
  const scale = document.querySelector(`input[name="scale"][value="${caseCount === 5 ? 5 : 1}"]`);
  if (scale) scale.checked = true;
  byId("case-index").value = state.selfTest.cases?.[0]?.case_index || "";
}

async function showCase(index) {
  const cases = state.selfTest?.cases || [];
  const item = cases[index];
  if (!item) return;
  state.activeCase = index;
  document.querySelectorAll(".case-button").forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
  byId("case-task").textContent = item.task;
  byId("case-id").textContent = item.case_id;
  byId("case-prompt").textContent = item.annotated_prompt || "该任务只提供可见图像输入。";
  byId("case-filename").textContent = item.submission_filename;
  const image = byId("case-image");
  if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
  state.imageUrl = null;
  image.hidden = true;
  image.removeAttribute("src");
  if (item.visible_image_url) {
    try {
      const blob = await api(item.visible_image_url, {}, true);
      state.imageUrl = URL.createObjectURL(blob);
      image.src = state.imageUrl;
      image.hidden = false;
    } catch {
      image.hidden = true;
    }
  }
}

async function downloadPack() {
  try {
    const blob = await api(`/api/self-tests/${encodeURIComponent(state.requestId)}/task-pack`, {}, true);
    downloadBlob(blob, `${state.requestId}-task-pack.zip`);
  } catch (error) {
    setMessage("create-message", error.message, true);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyRecovery() {
  const value = JSON.stringify({ request_id: state.requestId, recovery_key: state.recoveryKey, submission_id: state.submissionId }, null, 2);
  await navigator.clipboard.writeText(value);
  byId("copy-recovery").textContent = "已复制";
  setTimeout(() => { byId("copy-recovery").textContent = "复制恢复信息"; }, 1400);
}

function renderSelectedFiles() {
  const root = byId("selected-files");
  root.replaceChildren();
  [...byId("artifact-files").files].forEach((file) => {
    const row = document.createElement("div");
    row.className = "selected-file";
    const name = document.createElement("code");
    name.textContent = file.name;
    const size = document.createElement("span");
    size.textContent = `${Math.max(1, Math.round(file.size / 1024))} KiB`;
    row.append(name, size);
    root.append(row);
  });
}

async function upload(event) {
  event.preventDefault();
  const expected = new Set((state.selfTest?.cases || []).map((item) => item.submission_filename));
  const files = [...byId("artifact-files").files];
  const actual = new Set(files.map((file) => file.name));
  if (expected.size !== actual.size || [...expected].some((name) => !actual.has(name))) {
    setMessage("upload-message", "文件数量或文件名与 task pack 不一致。", true);
    return;
  }
  byId("upload-button").disabled = true;
  setMessage("upload-message", "正在上传…");
  const form = new FormData();
  files.forEach((file) => form.append("files", file, file.name));
  try {
    const created = await api(`/api/self-tests/${encodeURIComponent(state.requestId)}/submissions`, { method: "POST", body: form }, true);
    state.submissionId = created.submission_id;
    saveSession();
    byId("results").hidden = false;
    setStep(4);
    setMessage("upload-message", "上传完成，评测任务已进入队列。");
    byId("results").scrollIntoView({ behavior: "smooth", block: "start" });
    await pollSubmission();
  } catch (error) {
    setMessage("upload-message", error.message, true);
    byId("upload-button").disabled = false;
  }
}

function flattenNumbers(value, prefix = "", output = {}) {
  if (Object.keys(output).length >= 24) return output;
  if (typeof value === "number" && Number.isFinite(value)) output[prefix || "value"] = value;
  else if (value && typeof value === "object" && !Array.isArray(value)) {
    Object.entries(value).forEach(([key, item]) => flattenNumbers(item, prefix ? `${prefix}.${key}` : key, output));
  }
  return output;
}

function resultMetrics(result) {
  if (result?.metrics && typeof result.metrics === "object") return result.metrics;
  const cases = Array.isArray(result?.result_summary?.cases) ? result.result_summary.cases : [];
  const caseMetrics = cases.map((item) => item?.metrics).filter((item) => item && typeof item === "object");
  if (caseMetrics.length === 1) return caseMetrics[0];
  if (caseMetrics.length > 1) {
    const names = [...new Set(caseMetrics.flatMap((metrics) => Object.keys(metrics)))];
    return Object.fromEntries(names.flatMap((name) => {
      const values = caseMetrics.map((metrics) => metrics[name]).filter((value) => typeof value === "number" && Number.isFinite(value));
      return values.length ? [[`mean.${name}`, values.reduce((sum, value) => sum + value, 0) / values.length]] : [];
    }));
  }
  return result?.result_summary || result?.summary || {};
}

async function pollSubmission() {
  if (!state.submissionId) return;
  byId("results").hidden = false;
  try {
    const response = await api(`/api/submissions/${encodeURIComponent(state.submissionId)}`, {}, true);
    const evaluation = response.evaluation || {};
    renderResult(evaluation);
    const status = evaluation.submission?.status || response.status;
    if (!["complete", "completed", "failed"].includes(status)) {
      clearTimeout(state.pollTimer);
      state.pollTimer = setTimeout(pollSubmission, 7000);
    }
  } catch (error) {
    const runState = byId("run-state");
    runState.dataset.state = "failed";
    runState.lastElementChild.textContent = error.message;
  }
}

function renderResult(evaluation) {
  const submission = evaluation.submission || {};
  const status = submission.status || "pending";
  const runState = byId("run-state");
  runState.dataset.state = ["complete", "completed"].includes(status) ? "complete" : status === "failed" ? "failed" : "running";
  runState.lastElementChild.textContent = statusText(status);
  const identifiers = byId("run-identifiers");
  identifiers.replaceChildren();
  [
    ["Submission", state.submissionId],
    ["Task", submission.task_id],
    ["Run", submission.run_id],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value || "pending";
    row.append(term, detail);
    identifiers.append(row);
  });
  const metrics = flattenNumbers(resultMetrics(evaluation.result));
  const metricRoot = byId("metrics");
  metricRoot.replaceChildren();
  if (!Object.keys(metrics).length) {
    const empty = document.createElement("div");
    empty.className = "metric empty";
    empty.textContent = status === "failed" ? submission.failure_reason || "评测未产生 metrics" : "等待 evaluator 写入 metrics";
    metricRoot.append(empty);
  } else {
    Object.entries(metrics).forEach(([name, value]) => {
      const cell = document.createElement("div");
      cell.className = "metric";
      const label = document.createElement("span");
      label.textContent = name;
      const number = document.createElement("strong");
      number.textContent = Number.isInteger(value) ? String(value) : Number(value).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
      cell.append(label, number);
      metricRoot.append(cell);
    });
  }
  renderArtifacts(evaluation.result?.artifacts || []);
  byId("raw-result").textContent = JSON.stringify(evaluation, null, 2);
}

function renderArtifacts(artifacts) {
  const root = byId("artifact-list");
  root.replaceChildren();
  if (!artifacts.length) {
    root.textContent = "暂无可下载结果";
    return;
  }
  artifacts.forEach((artifact) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "artifact-link";
    const name = document.createElement("span");
    name.textContent = artifact.filename || artifact.artifact_id;
    const size = document.createElement("small");
    size.textContent = artifact.bytes ? `${Math.ceil(artifact.bytes / 1024)} KiB` : "下载";
    button.append(name, size);
    button.addEventListener("click", async () => {
      const blob = await api(artifact.download_url, {}, true);
      downloadBlob(blob, artifact.filename || artifact.artifact_id);
    });
    root.append(button);
  });
}

async function restore(event) {
  event.preventDefault();
  state.requestId = byId("restore-request").value.trim();
  state.recoveryKey = byId("restore-key").value.trim();
  state.submissionId = byId("restore-submission").value.trim() || null;
  saveSession();
  await pollSelfTest();
}

byId("benchmark").addEventListener("change", populateSuites);
byId("suite").addEventListener("change", selectSuite);
byId("task").addEventListener("change", populateFormats);
createForm.addEventListener("submit", createRequest);
byId("restore-form").addEventListener("submit", restore);
byId("download-pack").addEventListener("click", downloadPack);
byId("copy-recovery").addEventListener("click", copyRecovery);
byId("artifact-files").addEventListener("change", renderSelectedFiles);
uploadForm.addEventListener("submit", upload);

loadSession();
await loadService();
if (state.requestId && state.recoveryKey) await pollSelfTest();
