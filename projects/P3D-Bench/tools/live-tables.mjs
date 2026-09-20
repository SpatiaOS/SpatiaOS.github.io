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

export function replaceLiveTable(input, table, { first = false, append = false } = {}) {
  const original = readLiveTables(input);
  const exists = original.entries.some((entry) => entry.key === table.key);
  if (!exists && !append) {
    throw new Error(`live table ${table.key} not found`);
  }
  let entries = original.entries.map((entry) => entry.key === table.key
    ? { key: table.key, raw: JSON.stringify(table) }
    : entry);
  if (!exists) entries.push({ key: table.key, raw: JSON.stringify(table) });
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

export { assemblyCostPerCase, buildAssemblyTable } from "./assembly-table.mjs";
