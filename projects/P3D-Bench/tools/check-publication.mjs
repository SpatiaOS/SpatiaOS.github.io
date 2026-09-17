// Site payloads only. Research evidence and paper handoffs belong to the workbench.
import {readdirSync} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";

export function checkPublication(root) {
  const forbidden = new Set(["collaboration", "history", "archive", "intake", "results_raw", "consumer_before"]);
  const violations = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      const path = join(directory, entry.name);
      if (forbidden.has(entry.name) || /(?:^|\.)private(?:\.|$)/i.test(entry.name)) {
        violations.push(relative(root, path));
      } else if (entry.isDirectory()) walk(path);
      else if (entry.isSymbolicLink()) violations.push(relative(root, path));
    }
  }
  walk(root);
  if (violations.length) throw new Error(`Non-site payloads are not publishable: ${violations.join(", ")}`);
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkPublication(dirname(dirname(fileURLToPath(import.meta.url))));
  console.log("Publication boundary checked: no research handoffs, private files or local history.");
}
