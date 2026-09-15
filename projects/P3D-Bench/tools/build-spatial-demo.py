#!/usr/bin/env python3
"""Package selected current Image/Assembly runs without generation or judging."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import sys

PREFIX = "spatial_live_v1/assets/"
FORMATS = {"image2cad": ("cadquery", "openscad", "threejs"), "text_image2cad": ("cadquery", "openscad")}
LABELS = {"gpt6_astra_local": ("GPT-6 Astra", "openai"), "claude_opus5": ("Claude Opus 5", "claude"),
          "gemini38_flash": ("Gemini 3.8 Flash", "gemini"), "grok46": ("Grok 4.6", "grok"),
          "kimi_k3": ("Kimi K3", "kimi"), "qwen38max": ("Qwen 3.8 Max", "qwen"),
          "glm53_flash": ("GLM 5.3 Flash", "zai"), "deepseek41_flash": ("DeepSeek V4.1 Flash", "deepseek"),
          "doubao_seed21": ("Doubao Seed 2.1 Pro", "doubao")}


def read(path):
    return json.loads(path.read_text())


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False) + "\n")


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def resolve(value):
    if not value:
        raise ValueError("missing source asset")
    def remap(p):
        return Path(str(p).replace("/mnt/CFS/yangyikang/cad_dataset/", "/share/yyk/3dagent/cad_dataset/"))
    path = remap(value)
    for _ in range(8):
        if not path.is_symlink():
            break
        target = path.readlink()
        path = remap(target if target.is_absolute() else path.parent / target)
    if not path.is_file():
        raise FileNotFoundError(path)
    return path


def metric_projection(case):
    # Only public numeric evaluation fields; never publish request metadata.
    names = ("chamfer_distance", "hausdorff_distance", "f_score_005", "f_score_001", "normal_consistency",
             "iou_csg", "iou_voxel", "pred_open_edge_ratio", "pred_inverted_normal_ratio", "pred_non_manifold_edge_ratio")
    values = {k: (case.get("metrics") or {}).get(k) for k in names}
    values.update({"judge_" + k: (case.get("judge") or {}).get(k) for k in ("geometry", "aesthetics", "semantic")})
    part = case.get("assembly_part_eval") or {}
    values.update(part_match_f1=part.get("alignment", {}).get("match_f1"),
                  part_fscore_mean=part.get("per_part_mean", {}).get("f_score"))
    return {k: v for k, v in values.items() if isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)}


def main(args):
    root = Path(__file__).resolve().parents[1]
    demo = root / "demo"
    selection = read(args.audit / "selection.json")
    ledger = []

    def publish(raw, suffix, provenance):
        assert suffix in (".stl", ".png", ".jpg", ".jpeg", ".py", ".scad", ".js", ".json")
        assert raw and len(raw) < 50_000_000, "asset exceeds the browser demo budget"
        rel = PREFIX + sha(raw) + suffix
        dest = demo / rel
        if not dest.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(raw)
        assert dest.read_bytes() == raw
        ledger.append(dict(asset=rel, sha256=sha(raw), bytes=len(raw), **provenance))
        return rel

    def asset(value, **context):
        path = resolve(value)
        return publish(path.read_bytes(), path.suffix.lower(), dict(source=str(path), **context))

    full = read(args.audit / "assembly/full_results.json")
    docs = {}
    for task, formats in FORMATS.items():
        for model in selection["models"]:
            for fmt in formats:
                doc = full[f"text_image2cad/{model}-reason/{fmt}"] if task == "text_image2cad" else read(args.audit / "image/source_checkpoints" / model / fmt / "checkpoint.json")
                docs[task, model, fmt] = {c["case_id"]: c for c in doc["cases"]}

    cases, runs, run_sources = [], [], []
    for task, selected in selection["cases"].items():
        prefix = "image2cad" if task == "image2cad" else "textimage2cad"
        for item in selected:
            uid = item["uid"]
            cid = f"{prefix}/{uid}"
            title = ("Image Case · " if task == "image2cad" else "Assembly Case · ") + item["title"]
            input_hashes, conditions, gt_hashes = set(), set(), set()
            for model in selection["models"]:
                for fmt in FORMATS[task]:
                    c = docs[task, model, fmt][uid]
                    assert c.get("valid") and not c.get("llm_failed"), (task, model, fmt, uid)
                    assert not (c.get("judge") or {}).get("error")
                    assert all(isinstance(c["judge"].get(k), (int, float)) for k in ("geometry", "semantic"))
                    context = dict(task=task, model=model, format=fmt, uid=uid)
                    source_mesh = resolve(c["stl_path"])
                    aligned = source_mesh.with_name("model_aligned.stl")
                    assert aligned.is_file(), "display requires the saved aligned prediction"
                    files = dict(generated=asset(c["generated_code_path"], role="generated", **context),
                        mesh=asset(aligned, role="mesh", **context),
                        pred_render=asset(c["pred_render_path"], role="pred_render", **context),
                        gt_mesh=asset(c["gt_stl_path"], role="gt_mesh", **context),
                        gt_render=asset(c["gt_render_path"], role="gt_render", **context),
                        input_image=asset(c["input_image_path"], role="input_image", **context))
                    condition = f"Reference image: {item['title']}." if task == "image2cad" else c["condition_text"]
                    assert condition.strip()
                    input_hashes.add(files["input_image"])
                    gt_hashes.add(files["gt_mesh"])
                    conditions.add(condition)
                    rid = f"{task}_{uid}_{fmt}_{model}"
                    runs.append(dict(id=rid, task=task, case_id=cid, spec="image" if task == "image2cad" else "image_text",
                                     format=fmt, model=model+"-reason", valid=True, condition=condition,
                                     assets=files, metrics=metric_projection(c)))
                    run_sources.append(dict(id=rid, checkpoint_case_sha256=sha(json.dumps(c, sort_keys=True).encode())))
            assert len(input_hashes) == len(gt_hashes) == len(conditions) == 1, f"mixed inputs: {task}/{uid}"
            cases.append(dict(id=cid, task=task, title=title, thumbnail=next(iter(input_hashes))))

    models = [dict(id=m+"-reason", label=LABELS[m][0], family=LABELS[m][1]) for m in selection["models"]]
    shows = {}
    for task, chosen in selection["showcases"].items():
        selected = [r for r in runs if r["task"] == task and r["case_id"].endswith("/"+chosen["uid"]) and r["format"] == chosen["format"]]
        assert len(selected) == len(models)
        first = selected[0]
        shows[task] = dict(id=task+"-"+chosen["uid"], task=task,
            taskLabel="Image-to-3D" if task == "image2cad" else "Assembly-3D",
            title=next(c["title"] for c in cases if c["id"] == first["case_id"]), input=first["condition"],
            inputImage=first["assets"]["input_image"], gtRender=first["assets"]["gt_render"], gtMesh=first["assets"]["gt_mesh"],
            formatLabel="CadQuery", specLabel="Image input" if task == "image2cad" else "Text + image input",
            variants=[dict(id=r["id"], task=task, model=r["model"], modelLabel=LABELS[r["model"].removesuffix("-reason")][0],
                           family=LABELS[r["model"].removesuffix("-reason")][1], formatLabel="CadQuery", specLabel="Image input" if task == "image2cad" else "Text + image input",
                           src=r["assets"]["pred_render"], mesh=r["assets"]["mesh"]) for r in selected])

    # Preserve the stored Hungarian pair identities and evaluation scores.
    # For display, apply the saved assembly frame and a rigid per-pair rotation.
    sys.path.insert(0, str(args.benchmark_repo))
    from metrics.assembly_part_eval import _build_normalize_4x4, _get_24_rotations
    import numpy as np
    import trimesh
    from scipy.spatial import cKDTree
    part_items = []
    for choice in selection["part_showcases"]:
        uid, model, fmt = (choice[k] for k in ("uid", "model", "format"))
        c = docs["text_image2cad", model, fmt][uid]
        part = c["assembly_part_eval"]
        assert c["stage2"]["success"] and not part.get("fidelity_excluded")
        row = next(r for r in runs if r["task"] == "text_image2cad" and r["case_id"].endswith("/"+uid) and r["model"] == model+"-reason" and r["format"] == fmt)
        pred_parts, gt_parts = part["pred_dedupe"]["unique"], part["gt_dedupe"]["unique"]
        pairs, parts = [], []
        Tgt = _build_normalize_4x4(str(resolve(c["gt_stl_path"])))
        Tpred = np.array(c["align_transform_4x4"])
        for j, entry in enumerate(pred_parts):
            parts.append(dict(index=j, label=f"Part {j+1:02d}", name=entry["name"].replace("_", " "),
                              semantic=entry.get("semantic", ""), mesh=asset(entry["stl"], role="part", uid=uid, model=model)))
        for j, pair in enumerate(part["per_part"]):
            g, p = gt_parts[pair["gt_idx"]], pred_parts[pair["pred_idx"]]
            gm = trimesh.load(str(resolve(g["stl_path"])), force="mesh", process=False)
            pm = trimesh.load(str(resolve(p["stl"])), force="mesh", process=False)
            gm.apply_transform(Tgt); pm.apply_transform(Tpred)
            gs = trimesh.sample.sample_surface(gm, 1024, seed=42)[0]
            ps = trimesh.sample.sample_surface(pm, 1024, seed=42)[0]
            tree = cKDTree(gs)
            candidates = []
            for rotation in _get_24_rotations():
                rotated = ps @ rotation.T
                translation = gs.mean(axis=0) - rotated.mean(axis=0)
                transformed = rotated + translation
                value = (np.square(tree.query(transformed)[0]).mean() + np.square(cKDTree(transformed).query(gs)[0]).mean()) / 2
                candidates.append((value, rotation, translation))
            _, rotation, translation = min(candidates, key=lambda v: v[0])
            display = np.eye(4); display[:3,:3] = rotation; display[:3,3] = translation
            pm.apply_transform(display)
            paths = []
            for role, mesh, source, matrix in [("gt", gm, g["stl_path"], Tgt), ("pred", pm, p["stl"], display @ Tpred)]:
                paths.append(publish(mesh.export(file_type="stl"), ".stl", dict(source=str(resolve(source)), role="pair_"+role,
                    uid=uid, model=model, source_sha256=sha(resolve(source).read_bytes()), display_transform=np.asarray(matrix).tolist())))
            pairs.append(dict(slot=j, f_score=pair["f_score"], accepted=pair["accepted"],
                gt=dict(name=g.get("role_name", "part").replace("_", " "), semantic=g.get("semantic", ""), mesh=paths[0]),
                pred=dict(name=p["name"].replace("_", " "), semantic=p.get("semantic", ""), mesh=paths[1])))
        part_items.append(dict(id=row["id"]+"_parts", case_id=row["case_id"], short_case_id=uid,
            title=next(x["title"] for x in cases if x["id"] == row["case_id"]).replace("Assembly Case ·", "Assembly Parts ·"), model=row["model"], model_label=LABELS[model][0],
            format=fmt, format_label="CadQuery", condition=row["condition"], assets=row["assets"], metrics=row["metrics"],
            judge_reason=c["judge"].get("reason", ""), parts=parts, aligned_pairs=pairs))

    overlay = dict(schema="p3d-spatial-demo-v1", model_ids=[m["id"] for m in models], models=models, cases=cases, runs=runs,
                   spatial_showcases=shows, source_selection_sha256=sha((args.audit/"selection.json").read_bytes()))
    write(demo / "spatial-live.json", overlay)
    write(demo / "spatial-assemblies.json", dict(schema_version=1, items=part_items))
    write(args.audit / "asset-ledger.private.json", dict(selection=selection, sources=run_sources, assets=ledger))
    write(demo / "spatial-live-audit.json", dict(schema="p3d-spatial-demo-audit-v1", selection=selection,
        selection_basis="New cases with complete saved outputs from all nine models; varied shapes and bounded download size. Examples are curated, not aggregate benchmark estimates.",
        source_selection_sha256=overlay["source_selection_sha256"], runs=run_sources,
        assets={r["asset"]: dict(sha256=r["sha256"], bytes=r["bytes"]) for r in ledger},
        part_policy="Stored pair matches and scores; saved assembly transforms plus deterministic rigid visual alignment. No model calls or score recomputation."))
    unique = {r["asset"]:r["bytes"] for r in ledger}
    print(json.dumps(dict(cases=len(cases), runs=len(runs), models=len(models), assets=len(unique), bytes=sum(unique.values()), part_examples=len(part_items))))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audit", type=Path, required=True)
    parser.add_argument("--benchmark-repo", type=Path, required=True)
    main(parser.parse_args())
