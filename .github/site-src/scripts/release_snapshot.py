#!/usr/bin/env python3
"""Validation and deterministic transforms for P3D paper releases."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path
from typing import Any, Iterable

EXPECTED_SCHEMA_VERSION = 1
EXPECTED_RELEASE_ID = "p3d-aaai27-paper-current-v1"
EXPECTED_PROTOCOL_ID = "p3d-aaai27-paper-protocol-v1"
EXPECTED_TABLE_KEYS = ("text", "image", "assembly")
EXACT_INPUT_COMMITS = ("workbench", "evaluator")
CONSUMER_BASE_COMMITS = ("paper", "project_page")
REQUIRED_PROJECT_PAGE_ASSETS = frozenset(
    {
        "figures/fig_tasks_grouped_bars.pdf",
        "figures/fig_tasks_grouped_bars.svg",
    }
)
RELEASE_PROFILES = frozenset({"public", "paper", "anonymous"})
RETIRED_MODEL_IDS = frozenset({"mimo-reason"})
GPT_MODEL_IDS = frozenset({"gpt55-reason"})
MODEL_FAMILY_ICONS = {
    "openai": "openai.svg",
    "gemini": "gemini-color.svg",
    "claude": "claude-color.svg",
    "fable": "claude-color.svg",
    "kimi": "kimi-color.svg",
    "zai": "zai.svg",
    "doubao": "bytedance-color.svg",
    "deepseek": "deepseek-color.svg",
    "qwen": "qwen-color.svg",
    "mimo": "xiaomimimo.svg",
}
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
GIT_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
EXTERNAL_URL_RE = re.compile(r"https?://", re.IGNORECASE)
PRIVATE_TEXT_RE = re.compile(
    r"(?:file://|/(?:home|data\d*|mnt|share|tmp)/[^/\s]+/|"
    r"[A-Za-z]:[\\/](?:Users|Documents and Settings)[\\/]|"
    r"localhost|127\.0\.0\.1)",
    re.IGNORECASE,
)

# These are the same representative cases used by the reviewed anonymous page.
# Additional GPT runs are selected deterministically by incremental asset cost.
# These task budgets are calibrated against the complete 50 MB review archive,
# whose fixed evaluator/data contents are not represented by the values below.
ANONYMOUS_SEED_RUN_IDS = frozenset(
    {
        "text2cad_0084_00847302_descriptive_json_gpt55-reason",
        "text2cad_0084_00847302_parametric_openscad_gpt55-reason",
        "image2cad_articraft_clock_21133_image_cadquery_gpt55-reason",
        "image2cad_articraft_clock_21133_image_openscad_gpt55-reason",
        "image2cad_articraft_clock_21133_image_threejs_gpt55-reason",
        "text_image2cad_textimage2cad_111151_7c7f89f6_image_text_cadquery_gpt55-reason",
        "text_image2cad_textimage2cad_117698_aca36590_image_text_openscad_gpt55-reason",
    }
)
ANONYMOUS_TASK_BUDGETS = {
    "text2cad": 17_000_000,
    "image2cad": 45_000_000,
    "text_image2cad": 28_000_000,
}


class SnapshotError(ValueError):
    """Raised when a paper snapshot is not safe to release."""


def canonical_snapshot_bytes(snapshot: dict[str, Any]) -> bytes:
    """Return bytes covered by ``content_sha256``.

    Canonicalization removes only the top-level ``content_sha256`` field and
    serializes the remaining JSON as UTF-8 with sorted keys, no insignificant
    whitespace, Unicode preserved, and non-finite numbers rejected.
    """

    payload = dict(snapshot)
    payload.pop("content_sha256", None)
    try:
        text = json.dumps(
            payload,
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=False,
            allow_nan=False,
        )
    except (TypeError, ValueError) as exc:
        raise SnapshotError(f"snapshot is not canonical JSON: {exc}") from exc
    return text.encode("utf-8")


def computed_content_sha256(snapshot: dict[str, Any]) -> str:
    return hashlib.sha256(canonical_snapshot_bytes(snapshot)).hexdigest()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_and_validate_snapshot(
    path: Path,
    *,
    asset_root: Path | None = None,
    allow_legacy_result_tables: bool = False,
    allow_legacy_model_labels: bool = False,
) -> dict[str, Any]:
    try:
        snapshot = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SnapshotError(f"cannot read snapshot {path}: {exc}") from exc
    if not isinstance(snapshot, dict):
        raise SnapshotError("snapshot root must be an object")
    validate_snapshot(
        snapshot,
        asset_root=asset_root,
        allow_legacy_result_tables=allow_legacy_result_tables,
        allow_legacy_model_labels=allow_legacy_model_labels,
    )
    return snapshot


def validate_snapshot(
    snapshot: dict[str, Any],
    *,
    asset_root: Path | None = None,
    allow_legacy_result_tables: bool = False,
    allow_legacy_model_labels: bool = False,
) -> None:
    _expect_equal(snapshot, "schema_version", EXPECTED_SCHEMA_VERSION)
    _expect_equal(snapshot, "release_id", EXPECTED_RELEASE_ID)
    _expect_equal(snapshot, "protocol_id", EXPECTED_PROTOCOL_ID)

    generated_at = snapshot.get("generated_at")
    if not isinstance(generated_at, str) or not generated_at.strip():
        raise SnapshotError("generated_at must be a non-empty string")

    recorded_hash = snapshot.get("content_sha256")
    if not isinstance(recorded_hash, str) or not SHA256_RE.fullmatch(recorded_hash):
        raise SnapshotError("content_sha256 must be a lowercase SHA-256 hex digest")
    actual_hash = computed_content_sha256(snapshot)
    if recorded_hash != actual_hash:
        raise SnapshotError(
            f"content_sha256 mismatch: recorded {recorded_hash}, computed {actual_hash}"
        )

    model_order = snapshot.get("model_order")
    if (
        not isinstance(model_order, list)
        or not model_order
        or not all(isinstance(item, str) and item for item in model_order)
        or len(model_order) != len(set(model_order))
    ):
        raise SnapshotError("model_order must be a non-empty list of unique strings")
    model_orders = snapshot.get("model_orders")
    if (
        not isinstance(model_orders, dict)
        or set(model_orders) != set(EXPECTED_TABLE_KEYS)
    ):
        raise SnapshotError(
            f"model_orders keys must be exactly {EXPECTED_TABLE_KEYS}"
        )
    for table_key in EXPECTED_TABLE_KEYS:
        order = model_orders[table_key]
        if (
            not isinstance(order, list)
            or not order
            or not all(isinstance(item, str) and item for item in order)
            or len(order) != len(set(order))
            or any(item not in model_order for item in order)
        ):
            raise SnapshotError(
                f"model_orders.{table_key} must be a non-empty unique "
                "subset of model_order"
            )

    commits = snapshot.get("source_commits")
    if not isinstance(commits, dict):
        raise SnapshotError("source_commits must be an object")
    missing_commits = [
        key
        for key in (*EXACT_INPUT_COMMITS, *CONSUMER_BASE_COMMITS)
        if key not in commits
    ]
    if missing_commits:
        raise SnapshotError(f"source_commits missing: {', '.join(missing_commits)}")
    for key in EXACT_INPUT_COMMITS:
        value = commits[key]
        if not isinstance(value, str) or not GIT_SHA_RE.fullmatch(value):
            raise SnapshotError(
                f"source_commits.{key} must be an exact input Git SHA"
            )
    for key in CONSUMER_BASE_COMMITS:
        value = commits[key]
        if (
            not isinstance(value, dict)
            or value.get("role") != "consumer_base"
            or not isinstance(value.get("input_base_git_sha"), str)
            or not GIT_SHA_RE.fullmatch(value["input_base_git_sha"])
        ):
            raise SnapshotError(
                f"source_commits.{key} must declare role=consumer_base and "
                "input_base_git_sha; final output commits do not belong in the snapshot"
            )

    _validate_paper_profile(snapshot.get("profiles"))
    assets = normalize_assets(snapshot.get("assets"))
    if not assets:
        raise SnapshotError("assets must contain at least one path/hash pair")
    missing_page_assets = REQUIRED_PROJECT_PAGE_ASSETS - assets.keys()
    if missing_page_assets:
        raise SnapshotError(
            f"assets missing project-page figures: {sorted(missing_page_assets)}"
        )
    if asset_root is not None:
        _verify_assets(assets, asset_root)

    result_tables = snapshot.get("result_tables")
    if result_tables is None and allow_legacy_result_tables:
        paper = snapshot.get("paper")
        if isinstance(paper, dict):
            result_tables = paper.get("result_tables")
    if result_tables is None:
        raise SnapshotError("top-level result_tables is required")
    _validate_result_tables(
        result_tables,
        model_order,
        model_orders,
        require_model_ids=not allow_legacy_model_labels,
    )
    _validate_no_private_text(snapshot)


def normalize_assets(raw_assets: Any) -> dict[str, str]:
    normalized: dict[str, str] = {}
    if isinstance(raw_assets, dict):
        entries: Iterable[tuple[Any, Any]] = raw_assets.items()
        for raw_path, value in entries:
            digest = value.get("sha256") if isinstance(value, dict) else value
            _add_asset(normalized, raw_path, digest)
    elif isinstance(raw_assets, list):
        for entry in raw_assets:
            if not isinstance(entry, dict):
                raise SnapshotError("each assets entry must be an object")
            _add_asset(normalized, entry.get("path"), entry.get("sha256"))
    else:
        raise SnapshotError("assets must be an object or list")
    return normalized


def _add_asset(normalized: dict[str, str], raw_path: Any, digest: Any) -> None:
    if not isinstance(raw_path, str) or not raw_path:
        raise SnapshotError("asset path must be a non-empty string")
    path = Path(raw_path)
    if path.is_absolute() or ".." in path.parts:
        raise SnapshotError(f"asset path must be release-relative: {raw_path}")
    if not isinstance(digest, str) or not SHA256_RE.fullmatch(digest):
        raise SnapshotError(f"asset {raw_path} must have a lowercase SHA-256 digest")
    if raw_path in normalized:
        raise SnapshotError(f"duplicate asset path: {raw_path}")
    normalized[raw_path] = digest


def _verify_assets(assets: dict[str, str], asset_root: Path) -> None:
    root = asset_root.resolve()
    for relative, expected_hash in assets.items():
        candidate = (root / relative).resolve()
        if root not in candidate.parents and candidate != root:
            raise SnapshotError(f"asset escapes asset root: {relative}")
        if not candidate.is_file():
            raise SnapshotError(f"missing release asset: {relative}")
        actual_hash = file_sha256(candidate)
        if actual_hash != expected_hash:
            raise SnapshotError(
                f"asset hash mismatch for {relative}: expected {expected_hash}, got {actual_hash}"
            )


def _validate_paper_profile(raw_profiles: Any) -> None:
    if not isinstance(raw_profiles, dict) or not isinstance(raw_profiles.get("paper"), dict):
        raise SnapshotError("profiles.paper must be an object")
    paper = raw_profiles["paper"]
    sources = paper.get("task_sources")
    if not isinstance(sources, dict):
        raise SnapshotError("profiles.paper.task_sources must be an object")

    text_source = _task_source(sources, ("text", "text2cad", "text_to_3d"))
    image_source = _task_source(sources, ("image", "image2cad", "image_to_3d"))
    assembly_source = _task_source(
        sources, ("assembly", "text_image2cad", "assembly3d", "assembly_3d")
    )
    _validate_task_source("text", text_source, expected_profile="paper_current")
    _validate_task_source("image", image_source)
    _validate_task_source("assembly", assembly_source)


def _task_source(sources: dict[str, Any], aliases: tuple[str, ...]) -> Any:
    for alias in aliases:
        if alias in sources:
            return sources[alias]
    raise SnapshotError(f"profiles.paper.task_sources missing {aliases[0]}")


def _validate_task_source(
    task: str, source: Any, *, expected_profile: str | None = None
) -> None:
    if not isinstance(source, dict):
        raise SnapshotError(f"{task} task source must be an object")
    if source.get("pinned") is not True:
        raise SnapshotError(f"{task} task source must set pinned=true")
    source_id = source.get("source_id")
    if not isinstance(source_id, str) or not source_id:
        raise SnapshotError(f"{task} task source must provide source_id")
    git_sha = source.get("git_sha")
    if not isinstance(git_sha, str) or not GIT_SHA_RE.fullmatch(git_sha):
        raise SnapshotError(f"{task} task source must provide git_sha")
    artifact_hash = source.get("artifact_sha256")
    if not isinstance(artifact_hash, str) or not SHA256_RE.fullmatch(artifact_hash):
        raise SnapshotError(f"{task} task source must provide artifact_sha256")
    if expected_profile is not None and source.get("profile") != expected_profile:
        raise SnapshotError(
            f"{task} task source profile must be {expected_profile!r}"
        )


def _validate_result_tables(
    raw_tables: Any,
    model_order: list[str],
    model_orders: dict[str, list[str]],
    *,
    require_model_ids: bool,
) -> None:
    if not isinstance(raw_tables, list):
        raise SnapshotError("result_tables must be a list")
    keys = [table.get("key") for table in raw_tables if isinstance(table, dict)]
    if tuple(keys) != EXPECTED_TABLE_KEYS:
        raise SnapshotError(
            f"result_tables keys must be exactly {EXPECTED_TABLE_KEYS}, got {tuple(keys)}"
        )
    known_models = set(model_order)
    for table in raw_tables:
        _validate_result_table(
            table,
            known_models,
            model_orders[table["key"]],
            require_model_ids=require_model_ids,
        )


def _validate_result_table(
    table: dict[str, Any],
    known_models: set[str],
    expected_order: list[str],
    *,
    require_model_ids: bool,
) -> None:
    key = table["key"]
    for field in ("title", "accent"):
        if not isinstance(table.get(field), str) or not table[field]:
            raise SnapshotError(f"result table {key} missing {field}")
    metrics = table.get("metrics")
    groups = table.get("groups")
    rows = table.get("rows")
    if not isinstance(metrics, list) or not metrics or not all(
        isinstance(metric, str) and metric for metric in metrics
    ):
        raise SnapshotError(f"result table {key} has invalid metrics")
    _validate_groups(key, "groups", groups, len(metrics))
    if "superGroups" in table:
        _validate_groups(key, "superGroups", table["superGroups"], len(metrics))
    if not isinstance(rows, list) or not rows:
        raise SnapshotError(f"result table {key} must contain rows")

    seen_models: set[str] = set()
    actual_order: list[str] = []
    for row in rows:
        model = _validate_result_row(key, row, len(metrics))
        model_id = row.get("model_id")
        if require_model_ids and (not isinstance(model_id, str) or not model_id):
            raise SnapshotError(
                f"result table {key} row {model} must provide canonical model_id"
            )
        identity = model_id if isinstance(model_id, str) and model_id else model
        if not isinstance(identity, str) or not identity:
            raise SnapshotError(f"result table {key} row {model} has invalid model_id")
        if identity in seen_models:
            raise SnapshotError(f"result table {key} repeats model {identity}")
        if identity not in known_models:
            raise SnapshotError(
                f"result table {key} model absent from model_order: {identity}"
            )
        seen_models.add(identity)
        actual_order.append(identity)
    if actual_order != expected_order:
        raise SnapshotError(
            f"result table {key} rows do not follow model_orders.{key}"
        )

    for row in table.get("domainRows", []):
        _validate_result_row(key, row, len(metrics))


def _validate_groups(
    table_key: str, field: str, raw_groups: Any, metric_count: int
) -> None:
    if not isinstance(raw_groups, list) or not raw_groups:
        raise SnapshotError(f"result table {table_key} has invalid {field}")
    span = 0
    for group in raw_groups:
        if (
            not isinstance(group, dict)
            or not isinstance(group.get("label"), str)
            or not group["label"]
            or not isinstance(group.get("span"), int)
            or group["span"] <= 0
        ):
            raise SnapshotError(f"result table {table_key} has invalid {field} entry")
        span += group["span"]
    if span != metric_count:
        raise SnapshotError(
            f"result table {table_key} {field} span {span} != {metric_count} metrics"
        )


def _validate_result_row(table_key: str, row: Any, metric_count: int) -> str:
    if not isinstance(row, dict):
        raise SnapshotError(f"result table {table_key} row must be an object")
    model = row.get("model")
    cells = row.get("cells")
    if not isinstance(model, str) or not model:
        raise SnapshotError(f"result table {table_key} row missing model")
    if not isinstance(cells, str) or len(cells.split()) != metric_count:
        count = len(cells.split()) if isinstance(cells, str) else 0
        raise SnapshotError(
            f"result table {table_key} row {model} has {count} cells; expected {metric_count}"
        )
    return model


def _validate_no_private_text(value: Any, path: str = "$") -> None:
    if isinstance(value, dict):
        for key, item in value.items():
            _validate_no_private_text(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _validate_no_private_text(item, f"{path}[{index}]")
    elif isinstance(value, str) and PRIVATE_TEXT_RE.search(value):
        raise SnapshotError(f"private or host-local text in snapshot at {path}")


def _expect_equal(snapshot: dict[str, Any], key: str, expected: Any) -> None:
    if snapshot.get(key) != expected:
        raise SnapshotError(
            f"{key} must be {expected!r}, got {snapshot.get(key)!r}"
        )


def prepare_demo(
    source_demo: Path,
    target_demo: Path,
    *,
    profile: str,
) -> dict[str, Any]:
    """Copy only manifest-referenced demo files and apply the release profile."""

    if profile not in RELEASE_PROFILES:
        raise SnapshotError(f"unknown release profile: {profile}")
    source = json.loads((source_demo / "manifest.json").read_text(encoding="utf-8"))
    source_runs = list(source.get("runs", []))
    runs = source_runs
    if profile == "anonymous":
        runs = [
            run
            for run in runs
            if run.get("model") not in RETIRED_MODEL_IDS
        ]
        runs = _select_anonymous_runs(source_demo, runs)
    selected_run_ids = {run["id"] for run in runs}
    run_model_ids = {run["model"] for run in runs}
    case_ids = {run["case_id"] for run in runs}
    if profile == "anonymous":
        models = [
            model
            for model in source.get("models", [])
            if model.get("id") in run_model_ids
        ]
        cases = [
            case
            for case in source.get("cases", [])
            if case.get("id") in case_ids
        ]
    else:
        models = list(source.get("models", []))
        cases = list(source.get("cases", []))
    model_ids = {
        model.get("id")
        for model in models
        if isinstance(model.get("id"), str)
    }

    paper = dict(source.get("paper", {}))
    if profile == "anonymous":
        paper["authors"] = ["Anonymous authors"]
        paper["affiliations"] = ["Anonymous submission"]
        paper.pop("links", None)
        abstract = paper.get("abstract")
        if isinstance(abstract, str):
            paper["abstract"] = abstract.split(" Project page:")[0]

    output = dict(source)
    output.update(
        {
            "paper": paper,
            "models": models,
            "cases": cases,
            "runs": runs,
            "gallery": [] if profile == "anonymous" else source.get("gallery", []),
        }
    )
    if profile == "anonymous":
        output["review_subset_note"] = (
            "The original page source and styling are preserved. Only anonymous "
            "metadata and a deterministic, size-bounded GPT demo subset are used."
        )
        _validate_no_private_text(output)
        _validate_no_external_urls(output)

    target_demo.mkdir(parents=True, exist_ok=True)
    _copy_manifest_assets(source_demo, target_demo, runs, cases)
    # The interactive anonymous demo is GPT-only, but the paper leaderboard
    # still renders every paper model. Keep those tiny local UI dependencies
    # without retaining non-GPT runs or model metadata in the demo manifest.
    icon_models = source.get("models", []) if profile == "anonymous" else models
    _copy_model_icons(source_demo, target_demo, icon_models)
    source_complex_assembly_count = _complex_assembly_count(source_demo)
    complex_assembly_count = 0
    if profile != "anonymous":
        complex_assembly_count = _copy_complex_assemblies(
            source_demo,
            target_demo,
        )
    (target_demo / "manifest.json").write_text(
        json.dumps(output, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    source_model_ids = {
        model.get("id")
        for model in source.get("models", [])
        if isinstance(model.get("id"), str)
    }
    retired_model_ids_excluded = sorted(
        (source_model_ids - model_ids) & RETIRED_MODEL_IDS
    )
    audit = {
        "schema_version": 1,
        "release_profile": profile,
        "model_ids": sorted(model_ids),
        "source_model_count": len(source.get("models", [])),
        "source_case_count": len(source.get("cases", [])),
        "source_run_count": len(source_runs),
        "source_complex_assembly_count": source_complex_assembly_count,
        "model_count": len(models),
        "case_count": len(cases),
        "run_count": len(runs),
        "complex_assembly_count": complex_assembly_count,
        "retired_model_ids_excluded": retired_model_ids_excluded,
        "retired_model_count_excluded": len(retired_model_ids_excluded),
        "selected_run_ids_sha256": hashlib.sha256(
            "\n".join(sorted(selected_run_ids)).encode("utf-8")
        ).hexdigest(),
    }
    (target_demo / "data_audit.json").write_text(
        json.dumps(audit, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return {
        "source_models": len(source.get("models", [])),
        "source_cases": len(source.get("cases", [])),
        "source_runs": len(source_runs),
        "source_complex_assemblies": source_complex_assembly_count,
        "models": len(models),
        "cases": len(cases),
        "runs": len(runs),
        "complex_assemblies": complex_assembly_count,
        "retired_model_ids_excluded": retired_model_ids_excluded,
        "selected_run_ids_sha256": audit["selected_run_ids_sha256"],
    }


def _select_anonymous_runs(
    source_demo: Path, runs: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    candidates: list[tuple[dict[str, Any], set[str]]] = []
    for run in runs:
        if run.get("model") not in GPT_MODEL_IDS or run.get("valid") is False:
            continue
        paths = {
            value
            for value in run.get("assets", {}).values()
            if isinstance(value, str) and value
        }
        if paths and all((source_demo / path).is_file() for path in paths):
            candidates.append((run, paths))

    by_id = {run["id"]: (run, paths) for run, paths in candidates}
    missing_seeds = ANONYMOUS_SEED_RUN_IDS - by_id.keys()
    if missing_seeds:
        raise SnapshotError(
            f"anonymous demo missing seed runs: {sorted(missing_seeds)}"
        )
    selected_ids = set(ANONYMOUS_SEED_RUN_IDS)

    for task, budget in ANONYMOUS_TASK_BUDGETS.items():
        task_candidates = [
            (run, paths) for run, paths in candidates if run.get("task") == task
        ]
        task_assets: set[str] = set()
        for run_id in sorted(selected_ids):
            pair = by_id.get(run_id)
            if pair and pair[0].get("task") == task:
                task_assets.update(pair[1])
        used = _asset_size(source_demo, task_assets)
        represented_cases = {
            by_id[run_id][0]["case_id"]
            for run_id in selected_ids
            if run_id in by_id and by_id[run_id][0].get("task") == task
        }

        cheapest_by_case: dict[str, tuple[int, dict[str, Any], set[str]]] = {}
        for run, paths in task_candidates:
            if run["case_id"] in represented_cases:
                continue
            cost = _asset_size(source_demo, paths - task_assets)
            previous = cheapest_by_case.get(run["case_id"])
            if previous is None or (cost, run["id"]) < (previous[0], previous[1]["id"]):
                cheapest_by_case[run["case_id"]] = (cost, run, paths)
        for _, run, paths in sorted(
            cheapest_by_case.values(), key=lambda item: (item[0], item[1]["id"])
        ):
            cost = _asset_size(source_demo, paths - task_assets)
            if used + cost <= budget:
                selected_ids.add(run["id"])
                represented_cases.add(run["case_id"])
                task_assets.update(paths)
                used += cost

        remaining = sorted(
            (
                (run, paths)
                for run, paths in task_candidates
                if run["id"] not in selected_ids
                and run["case_id"] in represented_cases
            ),
            key=lambda pair: pair[0]["id"],
        )
        while remaining:
            run, paths = min(
                remaining,
                key=lambda pair: (
                    _asset_size(source_demo, pair[1] - task_assets),
                    pair[0]["id"],
                ),
            )
            remaining.remove((run, paths))
            cost = _asset_size(source_demo, paths - task_assets)
            if used + cost <= budget:
                selected_ids.add(run["id"])
                task_assets.update(paths)
                used += cost

    return [run for run in runs if run.get("id") in selected_ids]


def _asset_size(source_demo: Path, paths: Iterable[str]) -> int:
    return sum((source_demo / path).stat().st_size for path in paths)


def _copy_manifest_assets(
    source_demo: Path,
    target_demo: Path,
    runs: list[dict[str, Any]],
    cases: list[dict[str, Any]],
) -> None:
    paths: set[str] = set()
    for run in runs:
        paths.update(
            value
            for value in run.get("assets", {}).values()
            if isinstance(value, str) and value
        )
    for case in cases:
        thumbnail = case.get("thumbnail")
        if isinstance(thumbnail, str) and thumbnail:
            paths.add(thumbnail)
    for relative in sorted(paths):
        _copy_relative_file(source_demo, target_demo, relative)


def _copy_model_icons(
    source_demo: Path,
    target_demo: Path,
    models: list[dict[str, Any]],
) -> None:
    for model in models:
        icon = MODEL_FAMILY_ICONS.get(model.get("family"))
        if icon:
            _copy_relative_file(
                source_demo,
                target_demo,
                f"icons/src/{icon}",
            )


def _copy_complex_assemblies(
    source_demo: Path,
    target_demo: Path,
    *,
    allowed_models: set[str] | None = None,
) -> int:
    source_path = source_demo / "complex_assemblies.json"
    if not source_path.is_file():
        return 0
    payload = json.loads(source_path.read_text(encoding="utf-8"))
    items = [
        item
        for item in payload.get("items", [])
        if allowed_models is None or item.get("model") in allowed_models
    ]
    paths: set[str] = set()
    for item in items:
        paths.update(_nested_asset_paths(item.get("assets")))
        for part in item.get("parts", []):
            paths.update(_nested_asset_paths(part))
    for relative in sorted(paths):
        _copy_relative_file(source_demo, target_demo, relative)
    output = dict(payload)
    output["items"] = items
    (target_demo / "complex_assemblies.json").write_text(
        json.dumps(output, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return len(items)


def _complex_assembly_count(source_demo: Path) -> int:
    source_path = source_demo / "complex_assemblies.json"
    if not source_path.is_file():
        return 0
    payload = json.loads(source_path.read_text(encoding="utf-8"))
    return len(payload.get("items", []))


def _validate_no_external_urls(value: Any, path: str = "$") -> None:
    if isinstance(value, dict):
        for key, item in value.items():
            _validate_no_external_urls(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _validate_no_external_urls(item, f"{path}[{index}]")
    elif isinstance(value, str) and EXTERNAL_URL_RE.search(value):
        raise SnapshotError(f"external URL in anonymous demo metadata at {path}")


def _nested_asset_paths(value: Any) -> set[str]:
    paths: set[str] = set()
    if isinstance(value, dict):
        for item in value.values():
            paths.update(_nested_asset_paths(item))
    elif isinstance(value, list):
        for item in value:
            paths.update(_nested_asset_paths(item))
    elif isinstance(value, str) and value and not value.startswith(("http://", "https://")):
        suffix = Path(value).suffix.lower()
        if suffix in {".png", ".jpg", ".jpeg", ".webp", ".stl", ".json", ".scad", ".py", ".js"}:
            paths.add(value)
    return paths


def _copy_relative_file(source_root: Path, target_root: Path, relative: str) -> None:
    relative_path = Path(relative)
    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise SnapshotError(f"demo asset path is not relative: {relative}")
    source = source_root / relative_path
    if not source.is_file():
        raise SnapshotError(f"missing demo asset: {relative}")
    target = target_root / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
