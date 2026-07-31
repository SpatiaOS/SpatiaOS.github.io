#!/usr/bin/env python3
"""Unit tests for the paper-release contract and all release profiles."""

from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from build_release import (
    _make_release_manifest,
    _profile_contract,
    _validate_output_target,
)
from release_snapshot import (
    EXPECTED_PROTOCOL_ID,
    EXPECTED_RELEASE_ID,
    SnapshotError,
    computed_content_sha256,
    prepare_demo,
    validate_snapshot,
)


def synthetic_snapshot() -> dict:
    digest = "1" * 64
    rows = [
        {
            "model": "Model A",
            "model_id": "model-a",
            "family": "openai",
            "cells": "0.500",
        }
    ]
    tables = [
        {
            "key": key,
            "title": title,
            "accent": "var(--blue)",
            "groups": [{"label": "Average", "span": 1}],
            "metrics": ["Score"],
            "rows": [dict(rows[0])],
        }
        for key, title in (
            ("text", "Text-to-3D"),
            ("image", "Image-to-3D"),
            ("assembly", "Assembly-3D"),
        )
    ]
    source = {
        "pinned": True,
        "source_id": "fixture",
        "git_sha": "1" * 40,
        "artifact_sha256": digest,
    }
    snapshot = {
        "schema_version": 1,
        "release_id": EXPECTED_RELEASE_ID,
        "protocol_id": EXPECTED_PROTOCOL_ID,
        "generated_at": "2026-07-28T00:00:00Z",
        "model_order": ["model-a"],
        "model_orders": {
            "text": ["model-a"],
            "image": ["model-a"],
            "assembly": ["model-a"],
        },
        "source_commits": {
            "workbench": "1" * 40,
            "evaluator": "2" * 40,
            "paper": {
                "role": "consumer_base",
                "input_base_git_sha": "3" * 40,
            },
            "project_page": {
                "role": "consumer_base",
                "input_base_git_sha": "4" * 40,
            },
        },
        "profiles": {
            "paper": {
                "task_sources": {
                    "text": {**source, "profile": "paper_current"},
                    "image": dict(source),
                    "assembly": dict(source),
                }
            }
        },
        "assets": {
            "figures/fig_tasks_grouped_bars.pdf": digest,
            "figures/fig_tasks_grouped_bars.svg": digest,
        },
        "result_tables": tables,
    }
    snapshot["content_sha256"] = computed_content_sha256(snapshot)
    return snapshot


class SnapshotValidationTests(unittest.TestCase):
    def test_accepts_complete_canonical_snapshot(self) -> None:
        validate_snapshot(synthetic_snapshot())

    def test_rejects_tampered_snapshot(self) -> None:
        snapshot = synthetic_snapshot()
        snapshot["result_tables"][0]["rows"][0]["cells"] = "0.700"
        with self.assertRaisesRegex(SnapshotError, "content_sha256 mismatch"):
            validate_snapshot(snapshot)

    def test_rejects_unpinned_image_source(self) -> None:
        snapshot = synthetic_snapshot()
        snapshot["profiles"]["paper"]["task_sources"]["image"]["pinned"] = False
        snapshot["content_sha256"] = computed_content_sha256(snapshot)
        with self.assertRaisesRegex(SnapshotError, "image task source must set pinned=true"):
            validate_snapshot(snapshot)

    def test_formal_snapshot_requires_canonical_model_ids(self) -> None:
        snapshot = synthetic_snapshot()
        for table in snapshot["result_tables"]:
            table["rows"][0].pop("model_id", None)
        snapshot["model_order"] = ["Model A"]
        snapshot["model_orders"] = {
            "text": ["Model A"],
            "image": ["Model A"],
            "assembly": ["Model A"],
        }
        snapshot["content_sha256"] = computed_content_sha256(snapshot)
        with self.assertRaisesRegex(SnapshotError, "canonical model_id"):
            validate_snapshot(snapshot)
        validate_snapshot(snapshot, allow_legacy_model_labels=True)

    def test_each_table_has_its_own_fixed_model_order(self) -> None:
        snapshot = synthetic_snapshot()
        snapshot["model_order"] = ["model-a", "model-b"]
        snapshot["model_orders"]["image"] = ["model-b", "model-a"]
        image = snapshot["result_tables"][1]
        image["rows"] = [
            {
                "model": "Model B",
                "model_id": "model-b",
                "family": "other",
                "cells": "0.400",
            },
            image["rows"][0],
        ]
        snapshot["content_sha256"] = computed_content_sha256(snapshot)
        validate_snapshot(snapshot)

        image["rows"].reverse()
        snapshot["content_sha256"] = computed_content_sha256(snapshot)
        with self.assertRaisesRegex(SnapshotError, "model_orders.image"):
            validate_snapshot(snapshot)

    def test_rejects_final_commit_semantics_for_consumers(self) -> None:
        snapshot = synthetic_snapshot()
        snapshot["source_commits"]["project_page"] = {
            "role": "final_output",
            "git_sha": "4" * 40,
        }
        snapshot["content_sha256"] = computed_content_sha256(snapshot)
        with self.assertRaisesRegex(
            SnapshotError,
            "final output commits do not belong in the snapshot",
        ):
            validate_snapshot(snapshot)

    def test_rejects_private_path(self) -> None:
        snapshot = synthetic_snapshot()
        snapshot["note"] = "/home/researcher/private/result.json"
        snapshot["content_sha256"] = computed_content_sha256(snapshot)
        with self.assertRaisesRegex(SnapshotError, "private or host-local"):
            validate_snapshot(snapshot)


class ReleaseProfileTransformTests(unittest.TestCase):
    def _write_demo_fixture(self, root: Path) -> tuple[Path, list[str]]:
        source = root / "source"
        source.mkdir()
        run_ids = [
            "text2cad_0084_00847302_descriptive_json_gpt55-reason",
            "text2cad_0084_00847302_parametric_openscad_gpt55-reason",
            "image2cad_articraft_clock_21133_image_cadquery_gpt55-reason",
            "image2cad_articraft_clock_21133_image_openscad_gpt55-reason",
            "image2cad_articraft_clock_21133_image_threejs_gpt55-reason",
            "text_image2cad_textimage2cad_111151_7c7f89f6_image_text_cadquery_gpt55-reason",
            "text_image2cad_textimage2cad_117698_aca36590_image_text_openscad_gpt55-reason",
        ]
        runs = []
        task_by_prefix = {
            "text2cad_": "text2cad",
            "image2cad_": "image2cad",
            "text_image2cad_": "text_image2cad",
        }
        for index, run_id in enumerate(run_ids):
            task = next(
                task
                for prefix, task in task_by_prefix.items()
                if run_id.startswith(prefix)
            )
            relative = f"runs/{index}/generated.json"
            path = source / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("{}\n", encoding="utf-8")
            runs.append(
                {
                    "id": run_id,
                    "task": task,
                    "case_id": f"case-{index}",
                    "model": "gpt55-reason",
                    "valid": True,
                    "assets": {"generated": relative},
                }
            )
        retired_path = source / "runs/retired/generated.json"
        retired_path.parent.mkdir(parents=True)
        retired_path.write_text("{}\n", encoding="utf-8")
        runs.append(
            {
                "id": "retired",
                "task": "text2cad",
                "case_id": "retired-case",
                "model": "mimo-reason",
                "valid": True,
                "assets": {"generated": "runs/retired/generated.json"},
            }
        )
        for relative in (
            "icons/src/openai.svg",
            "icons/src/xiaomimimo.svg",
            "complex/pred.png",
            "complex/model.stl",
            "complex/part.stl",
        ):
            path = source / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f"fixture {relative}\n", encoding="utf-8")
        manifest = {
            "schema_version": 2,
            "paper": {
                "authors": ["Named Author"],
                "affiliations": ["Named Lab"],
                "abstract": "Abstract. Project page: https://example.invalid/.",
                "links": {
                    "paper": "https://example.invalid/paper",
                    "code": "https://example.invalid/code",
                },
            },
            "tasks": [],
            "models": [
                {"id": "gpt55-reason", "family": "openai"},
                {"id": "mimo-reason", "family": "mimo"},
            ],
            "cases": [
                {"id": run["case_id"], "task": run["task"]}
                for run in runs
            ],
            "runs": runs,
            "figures": [],
            "gallery": [{"id": "showcase"}],
        }
        (source / "manifest.json").write_text(
            json.dumps(manifest),
            encoding="utf-8",
        )
        complex_assemblies = {
            "schema_version": 1,
            "items": [
                {
                    "id": "complex-outside-model-list",
                    "model": "gpt55_ctok-reason",
                    "assets": {
                        "pred_render": "complex/pred.png",
                        "mesh": "complex/model.stl",
                    },
                    "parts": [{"mesh": "complex/part.stl"}],
                }
            ],
        }
        (source / "complex_assemblies.json").write_text(
            json.dumps(complex_assemblies),
            encoding="utf-8",
        )
        return source, run_ids

    def test_public_and_paper_preserve_complete_source_demo(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            root = Path(temp_name)
            source, _ = self._write_demo_fixture(root)
            source_manifest = json.loads(
                (source / "manifest.json").read_text(encoding="utf-8")
            )

            for profile in ("public", "paper"):
                with self.subTest(profile=profile):
                    target = root / profile
                    summary = prepare_demo(source, target, profile=profile)
                    output = json.loads(
                        (target / "manifest.json").read_text(encoding="utf-8")
                    )
                    audit = json.loads(
                        (target / "data_audit.json").read_text(encoding="utf-8")
                    )
                    complex_output = json.loads(
                        (target / "complex_assemblies.json").read_text(
                            encoding="utf-8"
                        )
                    )
                    source_complex = json.loads(
                        (source / "complex_assemblies.json").read_text(
                            encoding="utf-8"
                        )
                    )

                    self.assertEqual(output, source_manifest)
                    self.assertEqual(
                        (summary["models"], summary["cases"], summary["runs"]),
                        (2, 8, 8),
                    )
                    self.assertEqual(summary["complex_assemblies"], 1)
                    self.assertEqual(
                        summary["source_complex_assemblies"],
                        summary["complex_assemblies"],
                    )
                    self.assertEqual(summary["retired_model_ids_excluded"], [])
                    self.assertEqual(audit["retired_model_count_excluded"], 0)
                    self.assertEqual(complex_output, source_complex)
                    self.assertTrue(
                        (target / "runs/retired/generated.json").is_file()
                    )
                    self.assertTrue((target / "complex/pred.png").is_file())
                    self.assertTrue((target / "complex/model.stl").is_file())
                    self.assertTrue((target / "complex/part.stl").is_file())

    def test_anonymous_transform_keeps_only_gpt_and_scrubs_links(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            root = Path(temp_name)
            source, run_ids = self._write_demo_fixture(root)
            target = root / "anonymous"

            summary = prepare_demo(source, target, profile="anonymous")
            output = json.loads(
                (target / "manifest.json").read_text(encoding="utf-8")
            )
            audit = json.loads(
                (target / "data_audit.json").read_text(encoding="utf-8")
            )

            self.assertEqual(summary["models"], 1)
            self.assertEqual(
                {model["id"] for model in output["models"]},
                {"gpt55-reason"},
            )
            self.assertEqual(
                {run["model"] for run in output["runs"]},
                {"gpt55-reason"},
            )
            self.assertEqual(output["paper"]["authors"], ["Anonymous authors"])
            self.assertNotIn("links", output["paper"])
            self.assertEqual(output["gallery"], [])
            self.assertFalse((target / "runs/retired/generated.json").exists())
            self.assertFalse((target / "complex_assemblies.json").exists())
            self.assertEqual(summary["complex_assemblies"], 0)
            self.assertEqual(summary["source_complex_assemblies"], 1)
            self.assertEqual(
                summary["retired_model_ids_excluded"],
                ["mimo-reason"],
            )
            self.assertEqual(audit["retired_model_count_excluded"], 1)
            self.assertTrue((target / "icons/src/openai.svg").is_file())
            self.assertTrue((target / "icons/src/xiaomimimo.svg").is_file())
            self.assertEqual(
                hashlib.sha256(
                    "\n".join(sorted(run_ids)).encode("utf-8")
                ).hexdigest(),
                summary["selected_run_ids_sha256"],
            )

    def test_rejects_unknown_profile_and_anonymous_metadata_leaks(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            root = Path(temp_name)
            source, _ = self._write_demo_fixture(root)
            with self.assertRaisesRegex(SnapshotError, "unknown release profile"):
                prepare_demo(source, root / "invalid", profile="invalid")
            manifest_path = source / "manifest.json"
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            manifest["paper"]["abstract"] = "Leaked https://example.invalid/page"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
            with self.assertRaisesRegex(SnapshotError, "external URL"):
                prepare_demo(source, root / "external", profile="anonymous")
            manifest["paper"]["abstract"] = "Leaked /home/researcher/private/data"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
            with self.assertRaisesRegex(SnapshotError, "private or host-local"):
                prepare_demo(source, root / "private", profile="anonymous")


class ReleaseManifestTests(unittest.TestCase):
    def test_tree_hash_and_contract_cover_all_profiles(self) -> None:
        snapshot = synthetic_snapshot()
        tree_hashes: set[str] = set()
        with tempfile.TemporaryDirectory() as temp_name:
            root = Path(temp_name)
            for profile in ("public", "paper", "anonymous"):
                with self.subTest(profile=profile):
                    release = root / profile
                    (release / "demo").mkdir(parents=True)
                    (release / "release").mkdir()
                    (release / "index.html").write_text(
                        f"<html>{profile}</html>\n",
                        encoding="utf-8",
                    )
                    (release / "demo" / "manifest.json").write_text(
                        "{}\n",
                        encoding="utf-8",
                    )
                    (release / "demo" / "data_audit.json").write_text(
                        "{}\n",
                        encoding="utf-8",
                    )
                    (release / "release" / "paper-snapshot.json").write_text(
                        "{}\n",
                        encoding="utf-8",
                    )
                    (release / "release" / "profile.json").write_text(
                        json.dumps({"profile": profile}) + "\n",
                        encoding="utf-8",
                    )
                    summary = {
                        "source_models": 2,
                        "source_cases": 8,
                        "source_runs": 8,
                        "source_complex_assemblies": 1,
                        "models": 1 if profile == "anonymous" else 2,
                        "cases": 7 if profile == "anonymous" else 8,
                        "runs": 7 if profile == "anonymous" else 8,
                        "complex_assemblies": 0 if profile == "anonymous" else 1,
                        "retired_model_ids_excluded": (
                            ["mimo-reason"] if profile == "anonymous" else []
                        ),
                    }
                    manifest = _make_release_manifest(
                        release,
                        snapshot=snapshot,
                        snapshot_file_hash="2" * 64,
                        profile=profile,
                        demo_summary=summary,
                    )
                    expected_entries = []
                    for path in sorted(
                        item for item in release.rglob("*") if item.is_file()
                    ):
                        relative = path.relative_to(release).as_posix()
                        digest = hashlib.sha256(path.read_bytes()).hexdigest()
                        expected_entries.append(
                            (relative, digest, path.stat().st_size)
                        )
                    digest = hashlib.sha256()
                    for relative, file_digest, size in expected_entries:
                        digest.update(
                            f"{relative}\0{file_digest}\0{size}\n".encode(
                                "utf-8"
                            )
                        )

                    self.assertEqual(manifest["profile"], profile)
                    self.assertEqual(
                        manifest["includes_live"],
                        profile == "public",
                    )
                    self.assertEqual(
                        manifest["profile_contract"],
                        _profile_contract(profile),
                    )
                    self.assertEqual(manifest["tree_sha256"], digest.hexdigest())
                    self.assertEqual(manifest["file_count"], len(expected_entries))
                    self.assertEqual(
                        manifest["total_bytes"],
                        sum(size for _, _, size in expected_entries),
                    )
                    tree_hashes.add(manifest["tree_sha256"])
        self.assertEqual(len(tree_hashes), 3)


class OutputTargetSafetyTests(unittest.TestCase):
    def test_rejects_nonempty_foreign_output(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            output = Path(temp_name) / "foreign"
            output.mkdir()
            (output / "keep.txt").write_text("user data\n", encoding="utf-8")
            with self.assertRaisesRegex(SystemExit, "non-empty non-release"):
                _validate_output_target(output, syncing_gh_pages=False)
            self.assertEqual(
                (output / "keep.txt").read_text(encoding="utf-8"),
                "user data\n",
            )

    def test_accepts_matching_release_output(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            output = Path(temp_name) / "release"
            output.mkdir()
            (output / "release-manifest.json").write_text(
                json.dumps(
                    {
                        "release_id": EXPECTED_RELEASE_ID,
                        "protocol_id": EXPECTED_PROTOCOL_ID,
                    }
                ),
                encoding="utf-8",
            )
            _validate_output_target(output, syncing_gh_pages=False)


if __name__ == "__main__":
    unittest.main()
