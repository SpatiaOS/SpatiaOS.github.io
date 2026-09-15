import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const close = (a, b) => assert(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
const axes = ["geometry", "aesthetics", "semantic"];

for (const task of ["image", "assembly"]) {
  const summary = JSON.parse(readFileSync(new URL(`../live-${task}-summary.json`, import.meta.url)));
  test(`${task}: every Judge includes all three saved axes, including extra formats`, () => {
    assert.deepEqual(summary.judge_axes, axes);
    let differsFromTwoAxes = false;
    const check = (metrics, detail) => {
      const sub = detail.judge_submetrics;
      assert.deepEqual(Object.keys(sub), axes);
      for (const axis of axes) {
        close(sub[axis].normalized, (sub[axis].raw_mean - 1) / 9);
        assert(sub[axis].measured > 0);
      }
      close(metrics.judge, axes.reduce((sum, a) => sum + sub[a].normalized, 0) / 3);
      differsFromTwoAxes ||= Math.abs(metrics.judge - (sub.geometry.normalized + sub.semantic.normalized) / 2) > 1e-4;
    };
    for (const row of summary.rows) {
      for (const [fmt, data] of Object.entries(row.formats)) {
        check(task === "image" ? data : data.metrics, task === "image" ? row.format_detail[fmt] : data);
      }
    }
    for (const row of summary.additional_formats) check(row.metrics, row);
    assert(differsFromTwoAxes, "the aesthetics correction must affect the released scores");
  });
}
