#!/usr/bin/env python3
"""Build a sanitized static demo bundle for the project page."""

from __future__ import annotations

import json
import math
import os
import shutil
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "public" / "demo"
PARAM_OPENSCAD_ROOT = Path(
    os.environ.get(
        "P3D_TEXT_PARAM_OPENSCAD_ROOT",
        REPO / "local/text_parametric_openscad",
    )
).expanduser()
DETAILED_JSON_ROOT = Path(
    os.environ.get(
        "P3D_TEXT_DESC_JSON_ROOT",
        REPO / "local/text_descriptive_json",
    )
).expanduser()
ARTICRAFT_ALL_MODELS_ROOT = Path(
    os.environ.get("P3D_ARTICRAFT_ALL_MODELS_ROOT", REPO / "local/articraft_all_models")
).expanduser()
TEXTIMAGE2CAD_ALL_MODELS_ROOT = Path(
    os.environ.get("P3D_TEXTIMAGE2CAD_ALL_MODELS_ROOT", REPO / "local/textimage2cad_all_models")
).expanduser()

TEXT_MODELS = [
    "gpt55-reason",
    "gemini-reason",
    "claude-reason",
    "kimi_k26-reason",
    "glm-reason",
    "doubao-reason",
    "deepseek_v4pro-reason",
    "qwen-reason",
    "mimo_v25-reason",
]

MODEL_INFO: dict[str, dict[str, str]] = {
    "gpt55-reason": {"label": "GPT-5.5", "family": "openai"},
    "gpt": {"label": "GPT-4.1", "family": "openai"},
    "gemini-reason": {"label": "Gemini 3.1 Pro", "family": "gemini"},
    "claude-reason": {"label": "Claude Opus 4.6", "family": "claude"},
    "kimi_k26-reason": {"label": "Kimi K2.6", "family": "kimi"},
    "glm-reason": {"label": "GLM-5.1", "family": "zai"},
    "glm_5v_turbo-reason": {"label": "GLM 5V Turbo", "family": "zai"},
    "doubao-reason": {"label": "Doubao Seed 2.0 Pro", "family": "doubao"},
    "deepseek_v4pro-reason": {"label": "DeepSeek V4 Pro", "family": "deepseek"},
    "qwen-reason": {"label": "Qwen3.6-Plus", "family": "qwen"},
    "mimo_v25-reason": {"label": "MiMo v2.5 Pro", "family": "mimo"},
    "mimo_omni-reason": {"label": "MiMo v2 Omni", "family": "mimo"},
}

MODEL_ALIASES = {
    "gpt55": "gpt55-reason",
    "gemini": "gemini-reason",
    "kimi_k26": "kimi_k26-reason",
    "doubao": "doubao-reason",
    "qwen": "qwen-reason",
    "mimo_omni": "mimo_omni-reason",
}

PREFERRED_TEXT_CASES = [
    "0001/00017063",
    "0004/00040376",
    "0009/00099014",
    "0013/00134405",
    "0013/00135378",
    "0024/00249966",
    "0053/00531353",
    "0081/00817410",
    "0085/00852511",
]

TEXT_CASE_TARGET = 24

VISIBLE_METRICS = [
    "chamfer_distance",
    "hausdorff_distance",
    "f_score_005",
    "f_score_001",
    "normal_consistency",
    "iou_csg",
    "iou_voxel",
    "pred_open_edge_ratio",
    "acc_cmd",
    "acc_param",
]

AUDIT: dict[str, Any] = {
    "schema_version": 1,
    "notes": [
        "This file reports source-data coverage for the public static demo.",
        "It intentionally omits private absolute paths and raw production logs.",
    ],
}


def main() -> None:
    validate_text_demo_sources()
    reset_public_demo()
    manifest = make_manifest()

    text_runs, text_cases = build_text_runs()
    assembly_runs, assembly_cases = build_textimage2cad_runs()
    articraft_runs, articraft_cases = build_articraft_runs()

    all_runs = add_json_view_runs(text_runs + assembly_runs + articraft_runs)
    all_cases = normalize_case_titles(dedupe_cases(text_cases + assembly_cases + articraft_cases))
    used_models = sorted({run["model"] for run in all_runs}, key=model_sort_key)

    manifest["models"] = [
        {"id": model_id, **MODEL_INFO.get(model_id, {"label": model_id, "family": "openai"})}
        for model_id in used_models
    ]
    manifest["cases"] = all_cases
    manifest["runs"] = all_runs
    update_task_formats(manifest, all_runs)

    with (OUT / "manifest.json").open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    with (OUT / "data_audit.json").open("w", encoding="utf-8") as fh:
        json.dump(AUDIT, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"wrote {len(all_cases)} cases, {len(all_runs)} runs, {len(used_models)} model ids")
    print(f"text2cad: {len(text_cases)} cases, {sum(1 for r in text_runs if r['task'] == 'text2cad')} runs")
    print(f"image2cad: {sum(1 for c in all_cases if c['task'] == 'image2cad')} cases")
    print(f"text_image2cad: {sum(1 for c in all_cases if c['task'] == 'text_image2cad')} cases")
    print("wrote public/demo/data_audit.json")


def validate_text_demo_sources() -> None:
    text_sources = [
        ("parametric", "openscad", PARAM_OPENSCAD_ROOT),
        ("descriptive", "json", DETAILED_JSON_ROOT),
    ]
    errors: list[str] = []
    for spec, fmt, root in text_sources:
        if not root.exists():
            errors.append(f"missing {spec}/{fmt} root: {root}")
            continue
        full_results = root / "full_results.json"
        if full_results.is_file():
            try:
                payload = json.loads(full_results.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                errors.append(f"invalid {full_results}: {exc}")
                continue
            missing_keys = [
                f"text2cad/{model}/{fmt}"
                for model in TEXT_MODELS
                if f"text2cad/{model}/{fmt}" not in payload
            ]
            if missing_keys:
                errors.append(
                    f"{full_results} missing combinations: {', '.join(missing_keys)}"
                )
            continue
        missing_files = [
            root / "text2cad" / model / fmt / "results.json"
            for model in TEXT_MODELS
            if not (root / "text2cad" / model / fmt / "results.json").is_file()
        ]
        if missing_files:
            errors.append(
                f"{root} missing per-model results: "
                + ", ".join(str(path.relative_to(root)) for path in missing_files)
            )
    if errors:
        raise RuntimeError(
            "Text demo preflight failed before changing public/demo. Set "
            "P3D_TEXT_PARAM_OPENSCAD_ROOT and P3D_TEXT_DESC_JSON_ROOT to "
            "approved, complete exports.\n- "
            + "\n- ".join(errors)
        )


def reset_public_demo() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ["runs", "gt_meshes", "gt_renders", "inputs", "articraft"]:
        path = OUT / name
        if path.exists():
            shutil.rmtree(path)
        path.mkdir(parents=True, exist_ok=True)


def make_manifest() -> dict[str, Any]:
    return {
        "schema_version": 2,
        "paper": {
            "title": "P3D-Bench: Benchmarking MLLMs for Parametric 3D Generation and Structural Reasoning",
            "authors": [
                "Yikang Yang¹,²,*",
                "Zhanpeng Hu¹,*",
                "Youtian Lin¹",
                "Mengqi Zhou¹,²",
                "Jingxi Xu²",
                "Feihu Zhang²",
                "Jiaheng Liu¹",
                "Yao Yao¹",
            ],
            "affiliations": ["¹Nanjing University", "²DreamTech", "*Equal contribution."],
            "abstract": (
                "Multimodal large language models can write code to produce complex programs as well as use "
                "programs to do 3D modeling, which opens up a new avenue for 3D generation powered by their "
                "priors, world knowledge and reasoning. Yet existing benchmarks rarely evaluate 3D modeling "
                "through code. Such modeling demands more than runnable code: from a text or visual specification, "
                "a model must generate a parametric 3D program that is geometrically precise, semantically "
                "aligned and assembly-consistent. We introduce P3D-Bench, a benchmark for parametric 3D "
                "generation. Unlike a 3D mesh, a parametric 3D program exposes explicit dimensions, construction "
                "operations and part relations, revealing whether a model recovers a design's structure, not "
                "just its appearance. Under a unified protocol, P3D-Bench covers three task families (Text-to-3D, "
                "Image-to-3D and Assembly-3D) and scores each output for executability, geometric fidelity, "
                "topology, text-grounded constraints, multiview semantic alignment and part-level structure. "
                "We evaluate frontier MLLMs and text-only LLMs on 400 text cases, 400 image cases and 203 "
                "annotated assemblies, with domain-specific models as reference points. Our extensive evaluation "
                "yields three findings. First, assemblies are the hardest setting, where models still fail to "
                "compose multiple parts into a coherent structure. Second, models capture the overall shape of a "
                "semantically correct object, yet the parametric geometry they produce does not align precisely "
                "with the input specification. Third, part-level modeling remains weak on assemblies, where models "
                "recover neither the geometry of each part nor the right number of parts. These results establish "
                "P3D-Bench as a benchmark for measuring whether models produce correct parametric 3D and recover "
                "how an object is built from its parts, not just how it looks."
            ),
            "links": {"paper": "#top", "code": "https://github.com/LucasQAQ/p3d"},
        },
        "tasks": [
            {"id": "text2cad", "label": "Text-to-3D", "formats": ["JSON", "OpenSCAD"], "status": "interactive"},
            {"id": "image2cad", "label": "Image-to-3D", "formats": ["CadQuery", "OpenSCAD", "Three.js"], "status": "interactive"},
            {"id": "text_image2cad", "label": "Assembly-3D", "formats": ["CadQuery", "OpenSCAD"], "status": "interactive"},
        ],
        "models": [],
        "cases": [],
        "runs": [],
        "figures": [
            {"id": "pipeline", "title": "Pipeline", "placeholder": True},
            {"id": "leaderboard", "title": "Leaderboard figure", "src": "figures/fig_tasks_grouped_bars.pdf"},
        ],
        "gallery": [],
    }


def build_text_runs() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    text_sources = [
        ("parametric", "openscad", PARAM_OPENSCAD_ROOT),
        ("descriptive", "json", DETAILED_JSON_ROOT),
    ]
    combos: dict[tuple[str, str, str], dict[str, dict[str, Any]]] = {}
    roots: dict[tuple[str, str, str], Path] = {}

    for spec, fmt, root in text_sources:
        for model in TEXT_MODELS:
            combos[(spec, model, fmt)] = load_combo_cases(root, "text2cad", model, fmt)
            roots[(spec, model, fmt)] = root

    common_cases = None
    for (spec, model, fmt), combo_cases in combos.items():
        root = roots[(spec, model, fmt)]
        valid_cases = {
            case_id
            for case_id, case in combo_cases.items()
            if case.get("valid") is True and case.get("local_eval_complete", True) and case_is_exportable(case, root, "text2cad", model, fmt)
        }
        common_cases = valid_cases if common_cases is None else common_cases & valid_cases
    assert common_cases is not None

    preferred = [case_id for case_id in PREFERRED_TEXT_CASES if case_id in common_cases]
    remaining = sorted(common_cases - set(preferred))
    selected_case_ids = preferred + spread_pick(remaining, TEXT_CASE_TARGET - len(preferred))

    runs: list[dict[str, Any]] = []
    cases: list[dict[str, Any]] = []
    for case_id in selected_case_ids:
        reference = combos[("descriptive", TEXT_MODELS[0], "json")][case_id]
        title = summarize_condition(reference.get("condition_text") or case_id)
        cases.append({"id": case_id, "title": title, "task": "text2cad"})

        for model in TEXT_MODELS:
            for spec, fmt, _ in text_sources:
                root = roots[(spec, model, fmt)]
                case = combos[(spec, model, fmt)][case_id]
                run = make_run_from_case(
                    task="text2cad",
                    model=model,
                    spec=spec,
                    fmt=fmt,
                    case=case,
                    source_root=root,
                    condition=case.get("condition_text") or reference.get("condition_text") or title,
                )
                runs.append(run)

    return runs, cases


def build_textimage2cad_runs() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if not TEXTIMAGE2CAD_ALL_MODELS_ROOT.exists():
        AUDIT["text_image2cad_source"] = {"available": False}
        return [], []

    runs: list[dict[str, Any]] = []
    cases_by_id: dict[str, dict[str, Any]] = {}
    reports_by_case: dict[str, dict[str, Any]] = {}
    source_formats: set[str] = set()
    source_models: set[str] = set()
    source_run_count = 0

    for fmt_dir in sorted((path for path in TEXTIMAGE2CAD_ALL_MODELS_ROOT.iterdir() if path.is_dir()), key=lambda path: format_sort_key(safe_format(path.name))):
        fmt = safe_format(fmt_dir.name)
        source_formats.add(fmt)
        for case_dir in sorted((path for path in fmt_dir.iterdir() if path.is_dir()), key=lambda path: path.name):
            case_id = f"textimage2cad/{case_dir.name}"
            input_dir = case_dir / "input"
            condition = read_text_asset(input_dir / "condition.txt") or default_condition_for_task("text_image2cad")
            title = summarize_condition(condition)
            report = reports_by_case.setdefault(
                case_id,
                {
                    "case_id": case_id,
                    "selected": False,
                    "source_formats": set(),
                    "source_models": set(),
                    "models": set(),
                    "formats": {},
                    "incomplete_runs": [],
                    "input_reference": (input_dir / "gt_render.png").exists(),
                },
            )
            report["source_formats"].add(fmt)

            case_runs: list[dict[str, Any]] = []
            for model_dir in sorted((path for path in case_dir.iterdir() if path.is_dir() and path.name != "input"), key=lambda path: model_sort_key(normalize_model(path.name))):
                metrics_path = model_dir / "metrics.json"
                if not metrics_path.exists():
                    continue
                payload = json.loads(metrics_path.read_text(encoding="utf-8"))
                model = normalize_model(payload.get("model") or model_dir.name)
                source_models.add(model)
                report["source_models"].add(model)
                source_run_count += 1
                source = generated_source_for_format(model_dir, fmt)
                missing = missing_textimage_run_assets(case_dir, model_dir, fmt, source)
                if missing:
                    report["incomplete_runs"].append({"model": model, "format": fmt, "missing": missing})
                    continue

                report["selected"] = True
                report["models"].add(model)
                report["formats"][fmt] = report["formats"].get(fmt, 0) + 1
                source_case = {
                    "case_id": case_id,
                    "valid": payload.get("valid") is True,
                    "metrics": payload.get("metrics") or {},
                    "generated_code_path": str(source),
                    "stl_path": str(model_dir / "model_aligned.stl"),
                    "pred_render_path": str(model_dir / "pred_render_aligned.png"),
                    "gt_stl_path": str(input_dir / "gt_mesh.stl"),
                    "gt_render_path": str(input_dir / "gt_render.png"),
                    "input_image_path": str(input_dir / "gt_render.png"),
                }
                case_runs.append(
                    make_run_from_case(
                        task="text_image2cad",
                        model=model,
                        spec="image_text",
                        fmt=fmt,
                        case=source_case,
                        source_root=TEXTIMAGE2CAD_ALL_MODELS_ROOT,
                        condition=condition,
                    )
                )

            if case_runs and case_id not in cases_by_id:
                thumbnail = copy_asset(input_dir / "gt_render.png", OUT / "inputs" / f"{safe_slug('text_image2cad_' + case_id)}.png")
                cases_by_id[case_id] = {
                    "id": case_id,
                    "title": title or case_id,
                    "task": "text_image2cad",
                    **({"thumbnail": rel(thumbnail)} if thumbnail else {}),
                }
            runs.extend(case_runs)

    serializable_reports = [
        {
            "case_id": report["case_id"],
            "selected": report["selected"],
            "source_formats": sorted(report["source_formats"], key=format_sort_key),
            "source_model_count": len(report["source_models"]),
            "source_models": sorted(report["source_models"], key=model_sort_key),
            "complete_run_count": sum(report["formats"].values()),
            "model_count": len(report["models"]),
            "models": sorted(report["models"], key=model_sort_key),
            "formats": report["formats"],
            "input_reference": report["input_reference"],
            "incomplete_runs": report["incomplete_runs"],
        }
        for report in sorted(reports_by_case.values(), key=lambda item: item["case_id"])
    ]

    AUDIT["text_image2cad_source"] = {
        "available": True,
        "external_sources_used": False,
        "source_formats": sorted(source_formats, key=format_sort_key),
        "source_model_count": len(source_models),
        "source_models": sorted(source_models, key=model_sort_key),
        "source_case_count": len(reports_by_case),
        "source_run_count": source_run_count,
        "selected_case_count": len(cases_by_id),
        "selected_run_count": len(runs),
        "complete_run_summary": {
            fmt: sum(report["formats"].get(fmt, 0) for report in serializable_reports)
            for fmt in sorted(source_formats, key=format_sort_key)
        },
        "incomplete_run_count": sum(len(report["incomplete_runs"]) for report in serializable_reports),
        "cases": serializable_reports,
    }

    return runs, list(cases_by_id.values())


def build_articraft_runs() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if not ARTICRAFT_ALL_MODELS_ROOT.exists():
        AUDIT["image2cad_articraft_source"] = {"available": False}
        return [], []

    runs: list[dict[str, Any]] = []
    cases: list[dict[str, Any]] = []
    case_reports: list[dict[str, Any]] = []

    for case_dir in sorted((path for path in ARTICRAFT_ALL_MODELS_ROOT.iterdir() if path.is_dir()), key=articraft_case_sort_key):
        label, _numeric_id = split_articraft_case_name(case_dir.name)
        case_id = f"articraft/{case_dir.name}"
        title = title_case_words(label.replace("_", " "))
        condition = f"Reference image: {label.replace('_', ' ')}."
        input_image = case_dir / "gt_render.png"
        case_report: dict[str, Any] = {
            "case_id": case_id,
            "input_image": input_image.exists(),
            "models": set(),
            "formats": {},
            "model_formats": {},
            "incomplete_runs": [],
        }
        case_runs: list[dict[str, Any]] = []

        for model_dir in sorted((path for path in case_dir.iterdir() if path.is_dir()), key=lambda path: model_sort_key(normalize_model(path.name))):
            for fmt_dir, fmt_hint in iter_articraft_format_dirs(model_dir):
                metrics_path = fmt_dir / "metrics.json"
                if not metrics_path.exists():
                    continue
                payload = json.loads(metrics_path.read_text(encoding="utf-8"))
                fmt = safe_format(payload.get("fmt") or fmt_hint or source_format_for_model_dir(fmt_dir))
                model = normalize_model(payload.get("model") or model_dir.name)
                source = generated_source_for_format(fmt_dir, fmt)
                missing = missing_articraft_run_assets(case_dir, fmt_dir, fmt, source, input_image)
                if missing:
                    case_report["incomplete_runs"].append({"model": model, "format": fmt, "missing": missing})
                    continue
                case_report["models"].add(model)
                case_report["formats"][fmt] = case_report["formats"].get(fmt, 0) + 1
                case_report["model_formats"].setdefault(model, set()).add(fmt)
                case = {
                    "case_id": case_id,
                    "valid": payload.get("valid") is True,
                    "metrics": payload.get("metrics") or {},
                    "generated_code_path": str(source),
                    "stl_path": str(fmt_dir / "model_aligned.stl"),
                    "pred_render_path": str(fmt_dir / "pred_render_aligned.png"),
                    "gt_stl_path": str(case_dir / "gt_mesh.stl"),
                    "gt_render_path": str(case_dir / "gt_render.png"),
                    "input_image_path": str(input_image),
                }
                case_runs.append(
                    make_run_from_case(
                        task="image2cad",
                        model=model,
                        spec="image",
                        fmt=fmt,
                        case=case,
                        source_root=ARTICRAFT_ALL_MODELS_ROOT,
                        condition=condition,
                    )
                )

        if case_runs:
            thumbnail = copy_asset(input_image, OUT / "inputs" / f"{safe_slug('image2cad_' + case_id)}.png") if input_image else None
            cases.append(
                {
                    "id": case_id,
                    "title": title,
                    "task": "image2cad",
                    **({"thumbnail": rel(thumbnail)} if thumbnail else {}),
                }
            )
            runs.extend(case_runs)
        case_reports.append(case_report)

    image_models = sorted({model for report in case_reports for model in report["models"]}, key=model_sort_key)
    native_formats = ["cadquery", "openscad", "threejs"]
    serializable_reports = [
        {
            "case_id": report["case_id"],
            "selected": bool(report["model_formats"]),
            "complete_run_count": sum(len(formats) for formats in report["model_formats"].values()),
            "model_count": len(report["models"]),
            "models": sorted(report["models"]),
            "formats": report["formats"],
            "missing_native_formats": [fmt for fmt in native_formats if not report["formats"].get(fmt)],
            "missing_model_format_pairs": [
                {"model": model, "format": fmt}
                for model in image_models
                for fmt in native_formats
                if fmt not in report["model_formats"].get(model, set())
            ],
            "input_image": report["input_image"],
            "incomplete_runs": report["incomplete_runs"],
        }
        for report in case_reports
    ]

    AUDIT["image2cad_articraft_source"] = {
        "available": True,
        "external_sources_used": False,
        "input_thumbnail_source": "provided_bundle_gt_render",
        "paper_native_formats": ["cadquery", "openscad", "threejs"],
        "source_model_count": len(image_models),
        "source_models": image_models,
        "source_case_count": len([path for path in ARTICRAFT_ALL_MODELS_ROOT.iterdir() if path.is_dir()]),
        "selected_case_count": len(cases),
        "selected_run_count": len(runs),
        "native_format_summary": {
            fmt: sum(1 for report in serializable_reports if report["formats"].get(fmt))
            for fmt in ["cadquery", "openscad", "threejs"]
        },
        "complete_run_summary": {
            fmt: sum(report["formats"].get(fmt, 0) for report in serializable_reports)
            for fmt in ["cadquery", "openscad", "threejs"]
        },
        "missing_native_formats": [
            fmt
            for fmt in ["cadquery", "openscad", "threejs"]
            if not any(report["formats"].get(fmt) for report in serializable_reports)
        ],
        "incomplete_run_count": sum(len(report["incomplete_runs"]) for report in serializable_reports),
        "cases": serializable_reports,
    }

    return runs, cases


def iter_articraft_format_dirs(model_dir: Path) -> list[tuple[Path, str | None]]:
    nested = [(model_dir / fmt, fmt) for fmt in ["cadquery", "openscad", "threejs"] if (model_dir / fmt).is_dir()]
    if nested:
        return nested
    return [(model_dir, None)]


def missing_articraft_run_assets(case_dir: Path, fmt_dir: Path, fmt: str, source: Path | None, input_image: Path | None) -> list[str]:
    source_ext = {"cadquery": "py", "openscad": "scad", "threejs": "js"}.get(fmt, "txt")
    checks = [
        (f"generated.{source_ext}", source),
        ("model_aligned.stl", fmt_dir / "model_aligned.stl"),
        ("pred_render_aligned.png", fmt_dir / "pred_render_aligned.png"),
        ("gt_mesh.stl", case_dir / "gt_mesh.stl"),
        ("gt_render.png", case_dir / "gt_render.png"),
        ("input_image", input_image),
    ]
    return [label for label, path in checks if not path or not path.exists()]


def missing_textimage_run_assets(case_dir: Path, model_dir: Path, fmt: str, source: Path | None) -> list[str]:
    source_ext = {"cadquery": "py", "openscad": "scad", "threejs": "js"}.get(fmt, "txt")
    input_dir = case_dir / "input"
    checks = [
        (f"generated.{source_ext}", source),
        ("model_aligned.stl", model_dir / "model_aligned.stl"),
        ("pred_render_aligned.png", model_dir / "pred_render_aligned.png"),
        ("input/gt_mesh.stl", input_dir / "gt_mesh.stl"),
        ("input/gt_render.png", input_dir / "gt_render.png"),
        ("input/condition.txt", input_dir / "condition.txt"),
    ]
    return [label for label, path in checks if not path or not path.exists()]


def articraft_case_sort_key(path: Path) -> tuple[int, str]:
    label, numeric_id = split_articraft_case_name(path.name)
    try:
        return (int(numeric_id), label)
    except ValueError:
        return (999999, label)


def split_articraft_case_name(name: str) -> tuple[str, str]:
    label, _, numeric_id = name.rpartition("_")
    return (label or name, numeric_id or name)


def source_format_for_model_dir(model_dir: Path) -> str:
    if (model_dir / "generated.js").exists():
        return "threejs"
    if (model_dir / "generated.scad").exists():
        return "openscad"
    if (model_dir / "generated.py").exists():
        return "cadquery"
    return "json"


def generated_source_for_format(model_dir: Path, fmt: str) -> Path | None:
    candidates = {
        "openscad": ["generated.scad"],
        "threejs": ["generated.js"],
        "cadquery": ["generated.py"],
        "json": ["generated.json"],
    }.get(fmt, ["generated.txt"])
    for name in candidates:
        path = model_dir / name
        if path.exists():
            return path
    return None


def make_run_from_case(
    *,
    task: str,
    model: str,
    spec: str,
    fmt: str,
    case: dict[str, Any],
    source_root: Path,
    condition: str,
) -> dict[str, Any]:
    case_id = case["case_id"]
    rid = run_id(task, case_id, spec, fmt, model)
    run_dir = OUT / "runs" / rid
    run_dir.mkdir(parents=True, exist_ok=True)

    ext = {"json": "json", "openscad": "scad", "cadquery": "py", "threejs": "js"}.get(fmt, "txt")
    source_generated = resolve_generated(case, source_root, task, model, fmt)
    generated = copy_asset(source_generated, run_dir / f"generated.{ext}")
    generated_json = generated
    if fmt != "json":
        generated_json = run_dir / "generated.json"
        write_public_json_output(
            generated_json,
            task=task,
            case_id=case_id,
            model=model,
            spec=spec,
            fmt=fmt,
            condition=condition,
            valid=bool(case.get("valid")),
            metrics=sanitize_metrics(case),
            original_source=read_text_asset(source_generated),
            note="Non-JSON CAD source wrapped as JSON.",
        )
    mesh = copy_asset(resolve_case_asset(case, "stl_path", source_root, task, model, fmt, ["model_aligned.stl", "model.stl"]), run_dir / "model.stl")
    pred_render = copy_asset(
        resolve_case_asset(case, "pred_render_path", source_root, task, model, fmt, ["pred_render_aligned.png", "pred_render.png", "preview.png"]),
        run_dir / "pred_render.png",
    )
    gt_mesh = copy_asset(
        resolve_case_asset(case, "gt_stl_path", source_root, task, model, fmt, ["gt_model.stl"], shared=True),
        OUT / "gt_meshes" / f"{safe_slug(task + '_' + case_id)}.stl",
    )
    gt_render = copy_asset(
        resolve_case_asset(case, "gt_render_path", source_root, task, model, fmt, ["gt_render.png"]),
        OUT / "gt_renders" / f"{safe_slug(task + '_' + case_id)}.png",
    )
    input_image = None
    if case.get("input_image_path"):
        input_image = copy_asset(resolve_existing(case.get("input_image_path")), OUT / "inputs" / f"{safe_slug(task + '_' + case_id)}.png")

    assets = {
        "generated": rel(generated),
        "generated_json": rel(generated_json),
        "mesh": rel(mesh),
        "pred_render": rel(pred_render),
        "gt_mesh": rel(gt_mesh),
        "gt_render": rel(gt_render),
    }
    if input_image:
        assets["input_image"] = rel(input_image)

    return {
        "id": rid,
        "task": task,
        "case_id": case_id,
        "spec": spec,
        "format": fmt,
        "model": model,
        "valid": bool(case.get("valid")),
        "condition": condition,
        "assets": assets,
        "metrics": sanitize_metrics(case),
    }


def load_combo_cases(root: Path, task: str, model: str, fmt: str) -> dict[str, dict[str, Any]]:
    combo_results = root / task / model / fmt / "results.json"
    if combo_results.exists():
        payload = json.loads(combo_results.read_text(encoding="utf-8"))
        cases = payload["cases"]
    else:
        payload = json.loads((root / "full_results.json").read_text(encoding="utf-8"))
        cases = payload[f"{task}/{model}/{fmt}"]["cases"]
    return {case["case_id"]: case for case in cases}


def resolve_existing(path: str | None) -> Path | None:
    if not path:
        return None
    candidate = Path(path)
    try:
        return candidate if candidate.exists() else None
    except OSError:
        return None


def resolve_generated(case: dict[str, Any], root: Path, task: str, model: str, fmt: str) -> Path | None:
    existing = resolve_existing(case.get("generated_code_path"))
    if existing:
        return existing
    case_dir = root / task / model / fmt / case["case_id"].replace("/", "_")
    for name in ["generated.json", "generated.scad", "generated.py", "generated.js", "pred.json"]:
        path = case_dir / name
        if path.exists():
            return path
    return None


def resolve_case_asset(
    case: dict[str, Any],
    key: str,
    root: Path,
    task: str,
    model: str,
    fmt: str,
    fallback_names: list[str],
    shared: bool = False,
) -> Path | None:
    existing = resolve_existing(case.get(key))
    if existing:
        return existing

    case_slug = case["case_id"].replace("/", "_")
    if shared:
        shared_dir = root / "_shared_cache" / case["case_id"].replace("/", "__")
        for name in fallback_names:
            path = shared_dir / name
            if path.exists():
                return path

    case_dir = root / task / model / fmt / case_slug
    for name in fallback_names:
        path = case_dir / name
        if path.exists():
            return path

    if key == "gt_stl_path":
        shared_dir = root / "_shared_cache" / case["case_id"].replace("/", "__")
        path = shared_dir / "gt_model.stl"
        if path.exists():
            return path
    return None


def copy_asset(src: Path | None, dst: Path) -> Path | None:
    if not src or not src.exists():
        return None
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not dst.exists():
        shutil.copy2(src, dst)
    return dst


def read_text_asset(path: Path | None) -> str | None:
    if not path or not path.exists():
        return None
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")


def write_public_json_output(
    dst: Path,
    *,
    task: str,
    case_id: str,
    model: str,
    spec: str,
    fmt: str,
    condition: str,
    valid: bool,
    metrics: dict[str, Any],
    original_source: str | None,
    note: str,
) -> Path:
    payload: dict[str, Any] = {
        "schema": "p3d.demo.generated_output.v1",
        "task": task,
        "case_id": case_id,
        "model": model,
        "input_spec": spec,
        "output_format": fmt,
        "valid": valid,
        "condition": condition,
        "metrics": metrics,
        "program": {
            "language": fmt,
            "source": original_source,
        },
        "note": note,
    }
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return dst


def case_is_exportable(case: dict[str, Any], root: Path, task: str, model: str, fmt: str) -> bool:
    return all(
        [
            resolve_generated(case, root, task, model, fmt),
            resolve_case_asset(case, "stl_path", root, task, model, fmt, ["model_aligned.stl", "model.stl"]),
            resolve_case_asset(case, "pred_render_path", root, task, model, fmt, ["pred_render_aligned.png", "pred_render.png", "preview.png"]),
            resolve_case_asset(case, "gt_stl_path", root, task, model, fmt, ["gt_model.stl"], shared=True),
            resolve_case_asset(case, "gt_render_path", root, task, model, fmt, ["gt_render.png"]),
        ]
    )


def sanitize_metrics(case: dict[str, Any]) -> dict[str, Any]:
    raw = case.get("metrics") or {}
    metrics: dict[str, Any] = {}
    for key in VISIBLE_METRICS:
        value = raw.get(key)
        if isinstance(value, (int, float)) and math.isfinite(float(value)):
            metrics[key] = value

    qa = case.get("qa") or {}
    qa_map = {
        "qa_overall": qa.get("overall_accuracy"),
        "qa_semantic": qa.get("semantic_accuracy"),
        "qa_parametric": qa.get("param_accuracy"),
    }
    for key, value in qa_map.items():
        if isinstance(value, (int, float)) and value > 0:
            metrics[key] = value
    return metrics


def spread_pick(items: list[str], count: int) -> list[str]:
    if count <= 0 or not items:
        return []
    if count >= len(items):
        return list(items)
    picks = []
    for i in range(count):
        index = round(i * (len(items) - 1) / max(1, count - 1))
        picks.append(items[index])
    return picks


def dedupe_cases(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen = set()
    output = []
    for case in cases:
        key = (case["task"], case["id"])
        if key in seen:
            continue
        seen.add(key)
        output.append(case)
    return output


def normalize_case_titles(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    counters = {"image2cad": 0, "text_image2cad": 0}
    prefixes = {"image2cad": "Image Case", "text_image2cad": "Assembly Case"}
    output = []
    for case in cases:
        normalized = dict(case)
        task = normalized["task"]
        if task in counters:
            counters[task] += 1
            descriptor = compact_case_descriptor(normalized)
            normalized["title"] = f"{prefixes[task]} {counters[task]:02d} · {descriptor}" if descriptor else f"{prefixes[task]} {counters[task]:02d}"
        output.append(normalized)
    return output


def compact_case_descriptor(case: dict[str, Any]) -> str:
    title = " ".join(str(case.get("title") or "").split()).strip(" .")
    if title.lower().startswith("image reference for "):
        return short_case_id(case["id"])
    if title.startswith("Abstract:"):
        title = title[len("Abstract:") :].strip()
        title = title.split("Detailed CAD", 1)[0].strip(" .")
    if title.lower().startswith("a "):
        title = title[2:]
    if title.lower().startswith("an "):
        title = title[3:]
    if title.lower().startswith("the "):
        title = title[4:]
    return title_case_words(truncate_words(title, 5)) or short_case_id(case["id"])


def title_case_words(text: str) -> str:
    keep_upper = {"CAD", "3D", "TV", "PC"}
    words = []
    for word in text.replace("-", " - ").split():
        if word == "-":
            continue
        clean = word.strip(".,:;")
        upper = clean.upper()
        words.append(upper if upper in keep_upper else clean[:1].upper() + clean[1:].lower())
    return " ".join(words)


def truncate_words(text: str, limit: int) -> str:
    words = text.split()
    return " ".join(words[:limit])


def short_case_id(case_id: str) -> str:
    return case_id.split("/")[-1] if "/" in case_id else case_id


def add_json_view_runs(runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for run in runs:
        output.append(run)
        seen_ids.add(run["id"])
    return output


def update_task_formats(manifest: dict[str, Any], runs: list[dict[str, Any]]) -> None:
    labels = {"json": "JSON", "cadquery": "CadQuery", "openscad": "OpenSCAD", "threejs": "Three.js"}
    by_task: dict[str, set[str]] = {}
    for run in runs:
        by_task.setdefault(run["task"], set()).add(run["format"])
    for task in manifest["tasks"]:
        formats = by_task.get(task["id"])
        if formats:
            task["formats"] = [labels.get(fmt, fmt) for fmt in sorted(formats, key=format_sort_key)]


def format_sort_key(fmt: str) -> tuple[int, str]:
    order = {"json": 0, "cadquery": 1, "openscad": 2, "threejs": 3}
    return (order.get(fmt, 99), fmt)


def summarize_condition(text: str) -> str:
    clean = " ".join(text.split())
    if len(clean) <= 94:
        return clean
    cut = clean[:94].rsplit(" ", 1)[0]
    return f"{cut}..."


def normalize_model(model: str) -> str:
    if model in MODEL_INFO:
        return model
    if model.endswith("-reason") and model in MODEL_INFO:
        return model
    return MODEL_ALIASES.get(model, model)


def model_sort_key(model: str) -> tuple[int, str]:
    order = list(MODEL_INFO)
    return (order.index(model) if model in order else 999, model)


def safe_format(fmt: str) -> str:
    normalized = fmt.lower().replace(".js", "threejs")
    return "threejs" if normalized == "js" else normalized


def safe_slug(value: str) -> str:
    keep = []
    for char in value:
        if char.isalnum() or char in "-_":
            keep.append(char)
        else:
            keep.append("_")
    return "".join(keep).strip("_")


def run_id(task: str, case_id: str, spec: str, fmt: str, model: str) -> str:
    return safe_slug(f"{task}_{case_id}_{spec}_{fmt}_{model}")


def rel(path: Path | None) -> str:
    if path is None:
        return ""
    return path.relative_to(OUT).as_posix()


def default_condition_for_task(task: str) -> str:
    if task == "image2cad":
        return "Reconstruct the parametric CAD model from the provided input image."
    return "Generate an executable CAD assembly from the provided image and annotation prompt."


def task_label(task: str) -> str:
    return {
        "image2cad": "Image-to-3D",
        "text_image2cad": "Assembly-3D",
        "text2cad": "Text-to-3D",
    }.get(task, task)


if __name__ == "__main__":
    main()
