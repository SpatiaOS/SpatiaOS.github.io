#!/usr/bin/env python3
"""Import frozen benchmark results; keep checkpoints and request data private.

Requires the benchmark's snapshot_image2cad_current_metrics and
snapshot_assembly_scores outputs in AUDIT/image and AUDIT/assembly. Additional
Gemini checkpoints are frozen on the first import and reused on subsequent runs.
This script performs local aggregation only; it never calls a model.
"""
import argparse
from collections import Counter
import copy
from datetime import datetime
import hashlib
import json
from pathlib import Path
import sys

FORMATS = ("cadquery", "openscad", "threejs")
AXES = ("geom", "topo", "judge")
FAMILIES = dict(gpt6_astra_local="openai", claude_opus5="claude", gemini38_flash="gemini",
                grok46="grok", kimi_k3="kimi", qwen38max="qwen", glm53_flash="zai",
                deepseek41_flash="deepseek", doubao_seed21="doubao")


def read(path):
    return json.loads(path.read_text())


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False) + "\n")


def extra_formats(args, task, formats, expected_uids):
    from runner.batch_runner import compute_combo_aggregate
    from aggregate_metric.aggregate import compute_buckets_absolute
    from tools.snapshot_image2cad_scores import token_cost

    bucket = args.image_bucket if task == "image" else args.assembly_bucket
    task_name = "image2cad" if task == "image" else "text_image2cad"
    axes = AXES if task == "image" else (*AXES, "part")
    price = read(args.audit / "image/pricing_snapshot.json")["models"]["gemini38_flash"]
    rows = []
    for fmt in formats:
        source = bucket / task_name / "gemini38_flash-reason" / fmt / "checkpoint.json"
        saved = args.audit / "additional_formats" / task / fmt / "checkpoint.json"
        if not saved.exists():
            saved.parent.mkdir(parents=True, exist_ok=True)
            saved.write_bytes(source.read_bytes())
        doc = read(saved)
        cases = doc["cases"]
        assert len(cases) == 100 and {c["case_id"] for c in cases} == expected_uids
        tested = [c for c in cases if not c.get("llm_failed")]
        valid = [c for c in tested if c.get("valid")]
        judged = [c for c in valid if not (c.get("judge") or {}).get("error") and all(
            isinstance((c.get("judge") or {}).get(k), (int, float)) for k in ("geometry", "semantic"))]
        aggregate = compute_combo_aggregate(cases, task_name=task_name, metadata=doc["metadata"])
        scoring = copy.deepcopy(aggregate)
        scoring.pop("judge_aesthetics_mean_filled", None)
        buckets = compute_buckets_absolute(scoring, list(axes))
        assert set(buckets["scores"]) == set(axes)
        metrics = {**buckets["scores"], "valid": len(valid) / len(tested)}
        # Saved usage includes retained corrections. Incomplete usage stays null.
        usage_count = sum(bool(c.get("usage")) for c in tested)
        cost = sum(token_cost(c["usage"], price) for c in tested if c.get("usage"))
        coverage = dict(total=100, tested=len(tested), api_failed=100-len(tested),
                        valid=len(valid), invalid=len(tested)-len(valid),
                        judge_ok=len(judged), judge_missing=len(valid)-len(judged), cost_covered=usage_count)
        row = dict(model="Gemini 3.8 Flash", model_id="gemini38_flash", family="gemini", format=fmt,
                   metrics=metrics, score=100*sum(metrics[k] for k in axes)/len(axes),
                   coverage=coverage, cost_usd_per_case=cost/len(tested) if usage_count == len(tested) else None,
                   aggregate=aggregate, bucket_coverage=buckets["n_real_per_bucket"],
                   source_sha256=digest(saved), judge_model_counts=dict(Counter(c.get("judge_model_id", "unspecified") for c in judged)),
                   provisional=bool(coverage["api_failed"] or coverage["judge_missing"]))
        rows.append(row)
    return rows


def main(args):
    sys.path.insert(0, str(args.benchmark_repo))
    root = Path(__file__).resolve().parents[1]
    image = read(args.audit / "image/leaderboard.json")
    assembly = read(args.audit / "assembly/comparison.json")
    summary = read(root / "live-assembly-summary.json")
    score_rows = {r["combo_key"]: r for r in read(args.audit / "assembly/aggregate_metric_website/scores.json")}
    # Existing costs remain tied to the same tested population and unchanged rows.
    assert {r["model_id"] for r in summary["rows"]} == {r["model"] for r in assembly["rankings"]}
    for row in summary["rows"]:
        current = next(r for r in assembly["rankings"] if r["model"] == row["model_id"])
        assert abs(row["score"]-current["score"]) < 1e-10, "Assembly score changed: review cost audit before import"
        for fmt, values in row["formats"].items():
            key = f"text_image2cad/{row['model_id']}-reason/{fmt}"
            assert values["coverage"] == assembly["coverage"][key]
            for axis in (*AXES, "part"):
                assert abs(values["metrics"][axis]-score_rows[key]["buckets_abs"][axis]) < 1e-10
    summary["verified_at"] = image["snapshot_at"]
    summary["latest_verification"] = dict(source_sha256=digest(args.audit / "assembly/comparison.json"),
        model_count=len(summary["rows"]), all_metrics_and_coverage_match=True,
        checkpoint_sources=[{k: s[k] for k in ("model", "format", "sha256")} for s in assembly["source_checkpoints"]])
    assembly_uids = {c["case_id"] for c in read(args.audit / "assembly/source_checkpoints/gemini38_flash/cadquery/checkpoint.json")["cases"]}
    summary["additional_formats"] = extra_formats(args, "assembly", ("json", "threejs"), assembly_uids)
    image_uids = {c["case_id"] for c in read(args.audit / "image/source_checkpoints/gemini38_flash/cadquery/checkpoint.json")["cases"]}
    rows = []
    for source in image["rankings"]:
        row = {k: source[k] for k in ("label", "formats", "average", "score", "counts", "cost_usd_per_case", "provisional")}
        row.update(model_id=source["model"], model=source["label"], family=FAMILIES[source["model"]])
        row.pop("label")
        row["format_detail"] = {fmt: image["format_detail"][source["model"] + "/" + fmt] for fmt in FORMATS}
        row["metrics"] = " ".join(f"{values[k]:.3f}" for values in [*(row["formats"][f] for f in FORMATS), row["average"]] for k in (*AXES, "valid"))
        rows.append(row)
    public = dict(schema_version="p3d-live-image-summary-v1", snapshot_at=image["snapshot_at"],
        scope=image["cohort"], format_order=list(FORMATS), score_definition=image["formula"],
        judge_definition=image["judge_definition"], valid_definition=image["valid_definition"],
        missing_policy=image["missing_policy"], cost_policy=image["cost_policy"],
        score_source=dict(id=args.audit.name, sha256=digest(args.audit / "image/leaderboard.json")),
        pricing_source=dict(path="image-api-pricing.json", sha256=digest(args.audit / "image/pricing_snapshot.json")),
        checkpoint_sources=[{k: s[k] for k in ("model", "format", "sha256")} for s in image["sources"]],
        uniform_evaluator_claim=False, rows=rows,
        additional_formats=extra_formats(args, "image", ("json",), image_uids))
    write(root / "live-image-summary.json", public)
    write(root / "live-assembly-summary.json", summary)
    write(root / "image-api-pricing.json", read(args.audit / "image/pricing_snapshot.json"))
    print(json.dumps({"image": [(r["model"], round(r["score"], 2)) for r in rows],
        "additional_formats": {k: [(r["format"], round(r["score"], 2), r["coverage"]) for r in v]
                               for k, v in [("image", public["additional_formats"]), ("assembly", summary["additional_formats"])]}}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audit", type=Path, required=True)
    parser.add_argument("--benchmark-repo", type=Path, required=True)
    parser.add_argument("--image-bucket", type=Path, required=True)
    parser.add_argument("--assembly-bucket", type=Path, required=True)
    main(parser.parse_args())
