#!/usr/bin/env python3
"""Build a deterministic public, paper-only, or anonymous P3D site release."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

from release_snapshot import (
    EXTERNAL_URL_RE,
    EXPECTED_PROTOCOL_ID,
    EXPECTED_RELEASE_ID,
    GPT_MODEL_IDS,
    MODEL_FAMILY_ICONS,
    PRIVATE_TEXT_RE,
    SnapshotError,
    file_sha256,
    load_and_validate_snapshot,
    normalize_assets,
    prepare_demo,
)

REPO = Path(__file__).resolve().parents[1]
DEFAULT_GH_PAGES = REPO.parent / "p3d-gh-pages"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--snapshot",
        type=Path,
        default=Path(os.environ["P3D_PAPER_SNAPSHOT"])
        if os.environ.get("P3D_PAPER_SNAPSHOT")
        else None,
        help="Canonical p3d-aaai27-paper-current-v1.json (or P3D_PAPER_SNAPSHOT).",
    )
    parser.add_argument(
        "--profile",
        choices=("public", "paper", "anonymous"),
        default="public",
        help="public keeps the independent live tab; paper and anonymous exclude it.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Output directory. Use the p3d-gh-pages checkout for deployment staging.",
    )
    parser.add_argument(
        "--asset-root",
        type=Path,
        help="Root containing snapshot-declared release assets; defaults to p3d/public.",
    )
    parser.add_argument(
        "--allow-legacy-result-tables",
        action="store_true",
        help="Temporary migration only: accept paper.result_tables instead of top-level result_tables.",
    )
    parser.add_argument(
        "--allow-legacy-model-labels",
        action="store_true",
        help="Temporary fixture migration only: permit result rows without canonical model_id.",
    )
    parser.add_argument(
        "--sync-gh-pages",
        action="store_true",
        help=f"Synchronize the verified build into {DEFAULT_GH_PAGES}.",
    )
    parser.add_argument(
        "--allow-source-mismatch",
        action="store_true",
        help="Local fixture/testing only: do not require snapshot project_page SHA to match HEAD.",
    )
    parser.add_argument(
        "--allow-dirty-source",
        action="store_true",
        help="Local review only: allow a build from uncommitted p3d source changes.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.snapshot is None:
        raise SystemExit(
            "release build requires --snapshot or P3D_PAPER_SNAPSHOT; "
            "there is no hand-coded paper-results fallback"
        )
    snapshot_path = args.snapshot.expanduser().resolve()
    asset_root = (args.asset_root or REPO / "public").expanduser().resolve()
    snapshot = load_and_validate_snapshot(
        snapshot_path,
        asset_root=asset_root,
        allow_legacy_result_tables=args.allow_legacy_result_tables,
        allow_legacy_model_labels=args.allow_legacy_model_labels,
    )
    _verify_source_checkout(
        snapshot,
        allow_source_mismatch=args.allow_source_mismatch,
        allow_dirty_source=args.allow_dirty_source,
    )

    if args.sync_gh_pages and args.output:
        raise SystemExit("use either --output or --sync-gh-pages, not both")
    output = (
        DEFAULT_GH_PAGES
        if args.sync_gh_pages
        else args.output.expanduser().resolve()
        if args.output
        else REPO / "dist-release" / args.profile
    )
    _validate_output_target(output, syncing_gh_pages=args.sync_gh_pages)

    with tempfile.TemporaryDirectory(prefix="p3d-release-") as temp_name:
        temp = Path(temp_name)
        staged_public = temp / "public"
        staged_dist = temp / "dist"
        _prepare_public_tree(
            staged_public,
            snapshot=snapshot,
            snapshot_path=snapshot_path,
            asset_root=asset_root,
            profile=args.profile,
        )
        demo_summary = prepare_demo(
            REPO / "public" / "demo",
            staged_public / "demo",
            profile=args.profile,
        )
        snapshot_file_hash = file_sha256(snapshot_path)
        _run_vite(
            staged_public=staged_public,
            staged_dist=staged_dist,
            profile=args.profile,
            snapshot_file_hash=snapshot_file_hash,
        )
        (staged_dist / ".nojekyll").touch()
        release_manifest = _make_release_manifest(
            staged_dist,
            snapshot=snapshot,
            snapshot_file_hash=snapshot_file_hash,
            profile=args.profile,
            demo_summary=demo_summary,
        )
        (staged_dist / "release-manifest.json").write_text(
            json.dumps(release_manifest, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        _verify_built_profile(staged_dist, args.profile)
        _sync_tree(staged_dist, output)

    print(
        f"built {args.profile} release {EXPECTED_RELEASE_ID} "
        f"({EXPECTED_PROTOCOL_ID}) -> {output}"
    )
    return 0


def _prepare_public_tree(
    staged_public: Path,
    *,
    snapshot: dict[str, Any],
    snapshot_path: Path,
    asset_root: Path,
    profile: str,
) -> None:
    staged_public.mkdir(parents=True)
    for child in sorted((REPO / "public").iterdir(), key=lambda path: path.name):
        if child.name == "demo":
            continue
        target = staged_public / child.name
        if child.is_dir():
            shutil.copytree(child, target)
        else:
            shutil.copy2(child, target)

    for relative in sorted(normalize_assets(snapshot["assets"])):
        source = asset_root / relative
        target = staged_public / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

    release_dir = staged_public / "release"
    release_dir.mkdir()
    shutil.copy2(snapshot_path, release_dir / "paper-snapshot.json")
    (release_dir / "profile.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "release_id": EXPECTED_RELEASE_ID,
                "protocol_id": EXPECTED_PROTOCOL_ID,
                "profile": profile,
                "includes_live": profile == "public",
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )


def _run_vite(
    *,
    staged_public: Path,
    staged_dist: Path,
    profile: str,
    snapshot_file_hash: str,
) -> None:
    env = dict(os.environ)
    env.update(
        {
            "P3D_PUBLIC_DIR": str(staged_public),
            "VITE_P3D_RELEASE_PROFILE": profile,
            "VITE_P3D_INCLUDE_LIVE": "true" if profile == "public" else "false",
            "VITE_P3D_SNAPSHOT_SHA256": snapshot_file_hash,
        }
    )
    subprocess.run(
        [
            "npm",
            "run",
            "build",
            "--",
            "--outDir",
            str(staged_dist),
            "--emptyOutDir",
        ],
        cwd=REPO,
        env=env,
        check=True,
    )


def _make_release_manifest(
    root: Path,
    *,
    snapshot: dict[str, Any],
    snapshot_file_hash: str,
    profile: str,
    demo_summary: dict[str, Any],
) -> dict[str, Any]:
    entries = _release_tree_entries(root)

    essential_names = {
        ".nojekyll",
        "index.html",
        "demo/manifest.json",
        "demo/data_audit.json",
        "release/paper-snapshot.json",
        "release/profile.json",
    }
    essential = {
        relative: {"sha256": digest, "bytes": size}
        for relative, digest, size in entries
        if relative in essential_names
        or (relative.startswith("assets/") and relative.endswith((".js", ".css")))
    }
    source_commit = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=REPO,
        text=True,
        capture_output=True,
        check=True,
    ).stdout.strip()
    return {
        "schema_version": 1,
        "release_id": EXPECTED_RELEASE_ID,
        "protocol_id": EXPECTED_PROTOCOL_ID,
        "generated_at": snapshot["generated_at"],
        "profile": profile,
        "includes_live": profile == "public",
        "source_base_git_sha": source_commit,
        "source_commit_role": "consumer_base",
        "snapshot_file_sha256": snapshot_file_hash,
        "snapshot_content_sha256": snapshot["content_sha256"],
        "file_count": len(entries),
        "total_bytes": sum(size for _, _, size in entries),
        "tree_sha256": _release_tree_sha256(entries),
        "essential_files": essential,
        "demo": demo_summary,
        "profile_contract": _profile_contract(profile),
        "anonymous_transform": {
            "enabled": profile == "anonymous",
            "allowlisted_differences": [
                "anonymous paper metadata",
                "no live leaderboard",
                "no Render Showcase",
                "GPT-only size-bounded demo",
                "no Paper or Code external links",
            ]
            if profile == "anonymous"
            else [],
        },
    }


def _release_tree_entries(root: Path) -> list[tuple[str, str, int]]:
    entries: list[tuple[str, str, int]] = []
    for path in sorted(item for item in root.rglob("*") if item.is_file()):
        relative = path.relative_to(root).as_posix()
        if relative == "release-manifest.json":
            continue
        entries.append((relative, file_sha256(path), path.stat().st_size))
    return entries


def _release_tree_sha256(entries: list[tuple[str, str, int]]) -> str:
    tree_digest = hashlib.sha256()
    for relative, digest, size in entries:
        tree_digest.update(f"{relative}\0{digest}\0{size}\n".encode("utf-8"))
    return tree_digest.hexdigest()


def _profile_contract(profile: str) -> dict[str, bool]:
    return {
        "includes_live": profile == "public",
        "preserves_source_demo": profile in {"public", "paper"},
        "includes_render_showcase": profile in {"public", "paper"},
        "includes_paper_code_links": profile in {"public", "paper"},
        "anonymous_metadata": profile == "anonymous",
        "gpt_only_demo": profile == "anonymous",
        "size_bounded_media": profile == "anonymous",
    }


def _verify_built_profile(root: Path, profile: str) -> None:
    release_manifest = json.loads(
        (root / "release-manifest.json").read_text(encoding="utf-8")
    )
    release_profile = json.loads(
        (root / "release" / "profile.json").read_text(encoding="utf-8")
    )
    manifest = json.loads(
        (root / "demo" / "manifest.json").read_text(encoding="utf-8")
    )
    audit = json.loads(
        (root / "demo" / "data_audit.json").read_text(encoding="utf-8")
    )
    source_manifest = json.loads(
        (REPO / "public" / "demo" / "manifest.json").read_text(encoding="utf-8")
    )
    icon_models = (
        source_manifest.get("models", [])
        if profile == "anonymous"
        else manifest.get("models", [])
    )
    expected_icons = {
        icon
        for model in icon_models
        if isinstance(model, dict)
        for icon in [MODEL_FAMILY_ICONS.get(model.get("family"))]
        if icon
    }
    missing_icons = sorted(
        icon
        for icon in expected_icons
        if not (root / "demo" / "icons" / "src" / icon).is_file()
    )
    if missing_icons:
        raise SnapshotError(
            f"{profile} release lacks model UI icons: {missing_icons}"
        )
    expected_live = profile == "public"
    if release_manifest.get("profile") != profile:
        raise SnapshotError("release manifest profile does not match build profile")
    if release_manifest.get("includes_live") is not expected_live:
        raise SnapshotError("release manifest live flag does not match build profile")
    if release_manifest.get("profile_contract") != _profile_contract(profile):
        raise SnapshotError("release manifest profile contract is inconsistent")
    if release_profile.get("profile") != profile:
        raise SnapshotError("release/profile.json does not match build profile")
    if release_profile.get("includes_live") is not expected_live:
        raise SnapshotError("release/profile.json live flag does not match build profile")

    entries = _release_tree_entries(root)
    if release_manifest.get("file_count") != len(entries):
        raise SnapshotError("release manifest file count does not match build tree")
    if release_manifest.get("total_bytes") != sum(
        size for _, _, size in entries
    ):
        raise SnapshotError("release manifest byte count does not match build tree")
    if release_manifest.get("tree_sha256") != _release_tree_sha256(entries):
        raise SnapshotError("release manifest tree hash does not match build tree")
    entry_by_path = {
        relative: {"sha256": digest, "bytes": size}
        for relative, digest, size in entries
    }
    expected_essential = {
        relative: metadata
        for relative, metadata in entry_by_path.items()
        if relative
        in {
            ".nojekyll",
            "index.html",
            "demo/manifest.json",
            "demo/data_audit.json",
            "release/paper-snapshot.json",
            "release/profile.json",
        }
        or (
            relative.startswith("assets/")
            and relative.endswith((".js", ".css"))
        )
    }
    if release_manifest.get("essential_files") != expected_essential:
        raise SnapshotError("release manifest essential file hashes do not match build tree")

    complex_path = root / "demo" / "complex_assemblies.json"
    complex_count = 0
    if complex_path.is_file():
        complex_payload = json.loads(complex_path.read_text(encoding="utf-8"))
        complex_count = len(complex_payload.get("items", []))
    actual_demo_counts = {
        "models": len(manifest.get("models", [])),
        "cases": len(manifest.get("cases", [])),
        "runs": len(manifest.get("runs", [])),
        "complex_assemblies": complex_count,
    }
    demo_summary = release_manifest.get("demo", {})
    for key, count in actual_demo_counts.items():
        if demo_summary.get(key) != count:
            raise SnapshotError(f"release demo {key} count does not match files")
    for key, count in (
        ("model_count", actual_demo_counts["models"]),
        ("case_count", actual_demo_counts["cases"]),
        ("run_count", actual_demo_counts["runs"]),
        ("complex_assembly_count", actual_demo_counts["complex_assemblies"]),
    ):
        if audit.get(key) != count:
            raise SnapshotError(f"release demo audit {key} does not match files")
    for summary_key, audit_key in (
        ("source_models", "source_model_count"),
        ("source_cases", "source_case_count"),
        ("source_runs", "source_run_count"),
        ("source_complex_assemblies", "source_complex_assembly_count"),
    ):
        if demo_summary.get(summary_key) != audit.get(audit_key):
            raise SnapshotError(
                f"release demo source count {summary_key} does not match audit"
            )

    index = (root / "index.html").read_text(encoding="utf-8")
    if "http://" in index or "https://" in index:
        raise SnapshotError("built index.html contains an external URL")
    bundles = [
        path
        for path in (root / "assets").glob("*.js")
        if path.is_file()
    ]
    bundle_text = "\n".join(
        path.read_text(encoding="utf-8", errors="replace") for path in bundles
    )
    if PRIVATE_TEXT_RE.search(index) or PRIVATE_TEXT_RE.search(bundle_text):
        raise SnapshotError("built page contains a private or host-local path")
    if profile == "public" and "Live leaderboard" not in bundle_text:
        raise SnapshotError("public bundle does not contain the live leaderboard")
    if profile != "public" and any(
        token in bundle_text
        for token in (
            "Live leaderboard",
            "GPT-5.6 Sol",
            "fixed 100-case subset",
        )
    ):
        raise SnapshotError(f"{profile} bundle contains live leaderboard data")

    if profile in {"public", "paper"}:
        if manifest != source_manifest:
            raise SnapshotError(
                f"{profile} release does not preserve the complete source demo manifest"
            )
        for selected_key, source_key in (
            ("models", "source_models"),
            ("cases", "source_cases"),
            ("runs", "source_runs"),
            ("complex_assemblies", "source_complex_assemblies"),
        ):
            if demo_summary.get(selected_key) != demo_summary.get(source_key):
                raise SnapshotError(
                    f"{profile} release does not preserve source demo {selected_key}"
                )
        if demo_summary.get("retired_model_ids_excluded"):
            raise SnapshotError(f"{profile} release excludes a source demo model")
        if manifest.get("paper", {}).get("authors") == ["Anonymous authors"]:
            raise SnapshotError(f"{profile} release contains anonymous metadata")

    if profile == "anonymous":
        model_ids = {model.get("id") for model in manifest.get("models", [])}
        run_model_ids = {run.get("model") for run in manifest.get("runs", [])}
        if (
            len(manifest.get("models", [])) != 1
            or model_ids != GPT_MODEL_IDS
            or run_model_ids != GPT_MODEL_IDS
        ):
            raise SnapshotError("anonymous demo must contain exactly one GPT model")
        paper = manifest.get("paper", {})
        if paper.get("authors") != ["Anonymous authors"]:
            raise SnapshotError("anonymous demo contains named author metadata")
        if "links" in paper:
            raise SnapshotError("anonymous demo contains Paper or Code links")
        if manifest.get("gallery"):
            raise SnapshotError("anonymous demo contains Render Showcase metadata")
        if complex_path.exists():
            raise SnapshotError("anonymous demo contains complex showcase media")
        _verify_anonymous_demo_text(root / "demo")
        source_authors = [
            re.sub(r"[¹²³⁴⁵⁶⁷⁸⁹⁰,*†‡]+", "", author).strip()
            for author in source_manifest.get("paper", {}).get("authors", [])
            if isinstance(author, str)
        ]
        forbidden_ui = (
            "Render Showcase",
            "> Paper<",
            "> Code<",
            "Yang, Yikang",
            *source_authors,
        )
        if any(token in bundle_text for token in forbidden_ui):
            raise SnapshotError("anonymous bundle contains forbidden release UI")


def _verify_anonymous_demo_text(demo_root: Path) -> None:
    text_suffixes = {".html", ".js", ".json", ".md", ".py", ".scad", ".txt"}
    for path in sorted(item for item in demo_root.rglob("*") if item.is_file()):
        if path.suffix.lower() not in text_suffixes:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        relative = path.relative_to(demo_root).as_posix()
        if PRIVATE_TEXT_RE.search(text):
            raise SnapshotError(
                f"anonymous demo contains private or host-local text: {relative}"
            )
        if EXTERNAL_URL_RE.search(text):
            raise SnapshotError(f"anonymous demo contains an external URL: {relative}")


def _validate_output_target(path: Path, *, syncing_gh_pages: bool) -> None:
    resolved = path.resolve()
    forbidden = {Path("/"), Path.home().resolve(), REPO.resolve(), REPO.parent.resolve()}
    if resolved in forbidden:
        raise SystemExit(f"refusing unsafe release output: {resolved}")
    if syncing_gh_pages:
        expected = DEFAULT_GH_PAGES.resolve()
        if resolved != expected:
            raise SystemExit(f"unexpected gh-pages target: {resolved}")
        git_dir = resolved / ".git"
        if not git_dir.exists():
            raise SystemExit(f"gh-pages target is not a Git checkout: {resolved}")
        branch = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=resolved,
            text=True,
            capture_output=True,
            check=True,
        ).stdout.strip()
        if branch != "gh-pages":
            raise SystemExit(f"expected gh-pages branch, got {branch!r}")
        status = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=resolved,
            text=True,
            capture_output=True,
            check=True,
        ).stdout.strip()
        if status:
            raise SystemExit(
                "refusing to replace a dirty gh-pages checkout; commit or "
                "otherwise preserve its changes first"
            )
        return

    if not resolved.exists():
        return
    if not resolved.is_dir():
        raise SystemExit(f"release output is not a directory: {resolved}")
    if not any(resolved.iterdir()):
        return
    manifest_path = resolved / "release-manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(
            f"refusing to replace non-empty non-release output {resolved}: {exc}"
        ) from exc
    if (
        manifest.get("release_id") != EXPECTED_RELEASE_ID
        or manifest.get("protocol_id") != EXPECTED_PROTOCOL_ID
    ):
        raise SystemExit(
            f"refusing to replace output with a foreign release manifest: {resolved}"
        )


def _verify_source_checkout(
    snapshot: dict[str, Any],
    *,
    allow_source_mismatch: bool,
    allow_dirty_source: bool,
) -> None:
    head = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=REPO,
        text=True,
        capture_output=True,
        check=True,
    ).stdout.strip()
    expected = snapshot["source_commits"]["project_page"]["input_base_git_sha"]
    if not allow_source_mismatch and head != expected:
        raise SnapshotError(
            f"snapshot project_page input_base_git_sha {expected} "
            f"does not match p3d source HEAD {head}"
        )
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=REPO,
        text=True,
        capture_output=True,
        check=True,
    ).stdout.strip()
    if status and not allow_dirty_source:
        raise SnapshotError(
            "p3d tracked source is dirty; commit it before a formal release build"
        )


def _sync_tree(source: Path, target: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    for child in sorted(target.iterdir(), key=lambda path: path.name):
        if child.name == ".git":
            continue
        if child.is_dir() and not child.is_symlink():
            shutil.rmtree(child)
        else:
            child.unlink()
    for child in sorted(source.iterdir(), key=lambda path: path.name):
        destination = target / child.name
        if child.is_dir():
            shutil.copytree(child, destination)
        else:
            shutil.copy2(child, destination)


if __name__ == "__main__":
    raise SystemExit(main())
