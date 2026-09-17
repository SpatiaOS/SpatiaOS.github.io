import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {checkPublication} from "./check-publication.mjs";

test("publication accepts site assets and rejects research-only material", () => {
  const root = mkdtempSync(join(tmpdir(), "p3d-publication-test-"));
  try {
    mkdirSync(join(root, "demo"));
    writeFileSync(join(root, "demo", "mesh.stl"), "fixture");
    assert.equal(checkPublication(root), true);
    for (const name of ["collaboration", "history", "archive", "intake", "results_raw", "consumer_before"]) {
      const path = join(root, name);
      mkdirSync(path);
      assert.throws(() => checkPublication(root), /not publishable/);
      rmSync(path, {recursive: true});
    }
    const path = join(root, "demo", "request.private.json");
    writeFileSync(path, "{}");
    assert.throws(() => checkPublication(root), /not publishable/);
  } finally { rmSync(root, {recursive: true}); }
});
