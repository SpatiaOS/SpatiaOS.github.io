"""Restore the three-axis Judge from the release's saved aggregate metrics.

No evaluator calls or population changes. The public audit retains each axis
and its denominator so the displayed Judge can be checked independently.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from statistics import mean

AXES = ("geometry", "aesthetics", "semantic")
DEFINITION = "Equal-weight mean of geometry, aesthetics and semantic ratings, each normalized by (s - 1) / 9; existing per-metric denominators are retained."


def components(aggregate):
    result = {}
    for axis in AXES:
        prefix = "judge_" + axis
        raw = aggregate[prefix + "_mean_filled"]
        assert isinstance(raw, (int, float)) and math.isfinite(raw) and 1 <= raw <= 10
        result[axis] = dict(raw_mean=raw, normalized=(raw - 1) / 9,
                            measured=aggregate[prefix + "_n_real"],
                            worst_filled=aggregate[prefix + "_n_filled"])
    return result


def update_metrics(metrics, aggregate):
    axes = components(aggregate)
    old_two = mean(axes[k]["normalized"] for k in ("geometry", "semantic"))
    three = mean(v["normalized"] for v in axes.values())
    assert min(abs(metrics["judge"] - old_two), abs(metrics["judge"] - three)) < 1e-10
    metrics["judge"] = three
    return axes


def restore(assembly, image, assembly_full, source_sha256):
    changes = []
    for task, summary in (("assembly", assembly), ("image", image)):
        buckets = ("geom", "topo", "judge", "part") if task == "assembly" else ("geom", "topo", "judge")
        formats = ("cadquery", "openscad") if task == "assembly" else ("cadquery", "openscad", "threejs")
        for row in summary["rows"]:
            old_score = row["score"]
            for fmt in formats:
                if task == "assembly":
                    aggregate = assembly_full[f"text_image2cad/{row['model_id']}-reason/{fmt}"]["aggregate"]
                    detail = row["formats"][fmt]
                    values = detail["metrics"]
                else:
                    detail = row["format_detail"][fmt]
                    aggregate = detail["aggregate"]
                    values = row["formats"][fmt]
                detail["judge_submetrics"] = update_metrics(values, aggregate)
                if task == "image":
                    detail["bucket_coverage"]["judge"] = min(v["measured"] for v in detail["judge_submetrics"].values())
            values = [row["formats"][fmt]["metrics"] if task == "assembly" else row["formats"][fmt] for fmt in formats]
            row["average"]["judge"] = mean(v["judge"] for v in values)
            row["score"] = 100 * mean(row["average"][k] for k in buckets)
            row["metrics"] = " ".join(f"{v[k]:.3f}" for v in [*values, row["average"]] for k in (*buckets, "valid"))
            changes.append(dict(task=task, model=row["model"], previous_score=old_score, score=row["score"]))
        for row in summary.get("additional_formats", []):
            row["judge_submetrics"] = update_metrics(row["metrics"], row["aggregate"])
            row["bucket_coverage"]["judge"] = min(v["measured"] for v in row["judge_submetrics"].values())
            row["score"] = 100 * mean(row["metrics"][k] for k in buckets)
        summary["judge_definition"] = DEFINITION
        summary["judge_axes"] = list(AXES)
        summary["judge_reaggregation"] = dict(
            method="Equal mean of all three normalized saved Judge axes; no model calls.",
            assembly_aggregate_source_sha256=source_sha256,
            population="Same release snapshot; coverage, non-Judge buckets and costs retained.")
    assembly["score_definition"] = "100 × mean of unrounded Average Geo, Topo, Judge and Part; formats are equally weighted; Judge uses geometry, aesthetics and semantic axes."
    return changes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--assembly-results", type=Path, required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    assembly = json.loads((root / "live-assembly-summary.json").read_text())
    image = json.loads((root / "live-image-summary.json").read_text())
    raw = args.assembly_results.read_bytes()
    changes = restore(assembly, image, json.loads(raw), hashlib.sha256(raw).hexdigest())
    for task, data in (("assembly", assembly), ("image", image)):
        (root / f"live-{task}-summary.json").write_text(json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False) + "\n")
    for row in changes:
        print(f"{row['task']} {row['model']}: {row['previous_score']:.2f} -> {row['score']:.2f}")


if __name__ == "__main__":
    main()
