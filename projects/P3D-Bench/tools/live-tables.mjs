import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Find complete data literals without interpreting or executing bundle code.
function literalEnd(input, start) {
  const stack = [];
  let quote = null;
  let escaped = false;
  for (let i = start; i < input.length; i++) {
    const char = input[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === "[" || char === "{") stack.push(char);
    else if (char === "]" || char === "}") {
      const open = stack.pop();
      if ((char === "]" && open !== "[") || (char === "}" && open !== "{")) {
        throw new Error("unbalanced live leaderboard data");
      }
      if (!stack.length) return i + 1;
    }
  }
  throw new Error("unterminated live leaderboard data");
}

export function readLiveTables(input) {
  const marker = ",p2=[";
  const at = input.indexOf(marker);
  if (at < 0 || input.indexOf(marker, at + marker.length) >= 0) {
    throw new Error("expected one active live leaderboard array");
  }
  const start = at + marker.length - 1;
  const end = literalEnd(input, start);
  const entries = [];
  let cursor = start + 1;
  while (cursor < end - 1) {
    while (/\s|,/.test(input[cursor])) cursor++;
    if (cursor === end - 1) break;
    if (input[cursor] !== "{") throw new Error("expected a literal live table");
    const next = literalEnd(input, cursor);
    const raw = input.slice(cursor, next);
    const key = raw.match(/^\{\s*(?:key|"key")\s*:\s*"([a-z]+)"/);
    if (!key || entries.some((entry) => entry.key === key[1])) {
      throw new Error("missing or duplicate live table key");
    }
    entries.push({ key: key[1], raw });
    cursor = next;
  }
  if (!entries.some((entry) => entry.key === "text") || !entries.some((entry) => entry.key === "assembly")) {
    throw new Error("live Text and Assembly tables are required");
  }
  return { start, end, entries };
}

export function replaceLiveTable(input, table, { first = false } = {}) {
  const original = readLiveTables(input);
  if (!original.entries.some((entry) => entry.key === table.key)) {
    throw new Error(`live table ${table.key} not found`);
  }
  let entries = original.entries.map((entry) => entry.key === table.key
    ? { key: table.key, raw: JSON.stringify(table) }
    : entry);
  if (first) entries = [entries.find((entry) => entry.key === table.key), ...entries.filter((entry) => entry.key !== table.key)];
  const patched = input.slice(0, original.start) + `[${entries.map((entry) => entry.raw).join(",")}]` + input.slice(original.end);
  const next = readLiveTables(patched);
  if (patched.slice(0, next.start) !== input.slice(0, original.start)
      || patched.slice(next.end) !== input.slice(original.end)) throw new Error("non-live bundle content changed");
  for (const entry of original.entries.filter((entry) => entry.key !== table.key)) {
    if (next.entries.find((candidate) => candidate.key === entry.key)?.raw !== entry.raw) {
      throw new Error(`unrelated live ${entry.key} table changed`);
    }
  }
  return patched;
}

export function readActiveBundle(root) {
  const html = readFileSync(join(root, "index.html"), "utf8");
  const match = html.match(/assets\/(index[^"']+\.js)/);
  if (!match) throw new Error("active application bundle not found");
  return { html, name: match[1], input: readFileSync(join(root, "assets", match[1]), "utf8") };
}

export function writeActiveBundle(root, original, patched, label) {
  const hash = createHash("sha256").update(patched).digest("hex").slice(0, 8);
  const name = `index-live-${label}-${hash}.js`;
  writeFileSync(join(root, "assets", name), patched);
  writeFileSync(join(root, "index.html"), original.html.replace(original.name, name));
  return name;
}

export function keepMissingCostsLast(input) {
  const anchor = '      const difference = sort.endsWith("asc") ? leftValue - rightValue : rightValue - leftValue;';
  const guard = '      if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) return Number.isFinite(leftValue) ? -1 : Number.isFinite(rightValue) ? 1 : left.index - right.index;\n';
  if (input.includes(guard + anchor)) return input;
  if (input.split(anchor).length !== 2) throw new Error("cost sort comparator anchor changed");
  return input.replace(anchor, guard + anchor);
}

export function supportEstimatedCosts(input) {
  const before = 'Number(token.replace(/[$,!^]/g, ""))';
  const after = 'Number(token.replace(/[$,!^≈]/g, ""))';
  if (input.includes(after)) return input;
  if (input.split(before).length !== 2) throw new Error("cost value parser anchor changed");
  return input.replace(before, after);
}

export function buildAssemblyTable(summary) {
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
    const score = ["geom", "topo", "judge", "part"].reduce((sum, metric) => sum + average[metric], 0) * 25;
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
  return {
    ...summary.table,
    // The live Assembly table has no methodology footer; audits stay in JSON.
    note: "",
    rows: [...summary.rows].sort((a, b) => b.score - a.score).map((row) => ({
      model: row.model,
      model_id: row.model_id,
      family: row.family,
      cells: `${row.metrics} ${row.score.toFixed(2)} ${row.cost_usd !== null ? `$${(row.cost_usd / 100).toFixed(3)}` : row.estimated_cost_usd != null ? `$${(row.estimated_cost_usd / 100).toFixed(3)}` : "-"}`,
    })),
  };
}
