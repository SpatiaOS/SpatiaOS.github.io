# P3D-Bench Project Page

This repository contains only the public project page for P3D-Bench.

It intentionally excludes benchmark runner code, model API configuration,
production screening, annotation tools, full result trees, and paper plotting
scripts. The checked-in assets under `public/demo/` are sanitized static
artifacts used by the page.

## Local Preview

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

`npm run build` is a development build. It never treats the historical
TypeScript table as paper truth. A paper release must use the versioned snapshot
flow below.

## Paper Release

The canonical paper input is
`p3d-aaai27-paper-current-v1.json`. Build it with:

```bash
npm run build:release -- \
  --snapshot local/p3d-aaai27-paper-current-v1.json \
  --profile public \
  --output dist-release/public
```

Use `--sync-gh-pages` only after reviewing the build; it replaces generated
files in the sibling `p3d-gh-pages` checkout while preserving its `.git`
directory. The `gh-pages` checkout is a build artifact and must not become a
second hand-edited results source.

Release profiles are deliberately separate:

- `public` shows snapshot-backed paper results and the independently maintained
  live leaderboard while preserving the complete checked-in demo and showcase.
- `paper` contains snapshot-backed paper results, the same complete checked-in
  demo and showcase, and no live leaderboard.
- `anonymous` is a deterministic transform of the same source: anonymous
  metadata, no live leaderboard, no Render Showcase, a size-bounded GPT-only
  demo, and no Paper/Code links.

The builder fails closed unless the snapshot has the exact release and protocol
IDs, a valid canonical content hash, ordered Text/Image/Assembly result tables,
a global canonical model-ID set plus a fixed order for each task table,
`model_id` on every evaluated row, source commits, hashed assets, and pinned
task provenance. Text
must name `paper_current`; Image and Assembly must identify explicit pinned
sources. Workbench and evaluator SHAs are exact inputs. Because the paper and
project page consume the snapshot, their entries are explicitly
`role: consumer_base` plus `input_base_git_sha`; final output commits do not
belong in `content_sha256`. The project-page base SHA must match the clean `p3d`
source HEAD. The builder writes that base, the snapshot hashes, build-tree hash,
essential-file hashes, and applied profile to `release-manifest.json`; the
eventual `gh-pages` output commit is recorded only after committing that
generated checkout.

The snapshot must hash both project-page variants of the grouped task figure
(`figures/fig_tasks_grouped_bars.svg` and `.pdf`). The builder verifies and
overlays them from `--asset-root`, preventing an old checked-in figure from
surviving a result update.

For a local synthetic-fixture review only, `--allow-source-mismatch` and
`--allow-dirty-source` make those two checkout gates explicit.
`--allow-legacy-model-labels` exists only for migrating an old fixture. Do not
use any of these flags for a formal page or submission build.

`content_sha256` covers the snapshot after removing only that top-level field,
serialized as UTF-8 JSON with sorted keys, no insignificant whitespace,
preserved Unicode, and no non-finite numbers. The exact implementation and
tests live in `scripts/release_snapshot.py`.

```bash
npm run test:release
```

Preview an offline build without any network dependency:

```bash
python -m http.server --bind 127.0.0.1 --directory dist-release/anonymous 8000
```

## Demo Asset Bundle

The page reads `public/demo/manifest.json` plus the static assets under
`public/demo/`. To rebuild that sanitized bundle from local evaluation outputs:

```bash
python scripts/build_demo_bundle.py
npm run build
```

Optional local inputs can be provided through environment variables:

| Variable | Purpose |
| --- | --- |
| `P3D_TEXT_PARAM_OPENSCAD_ROOT` | Approved complete Text-to-3D parametric/OpenSCAD export. |
| `P3D_TEXT_DESC_JSON_ROOT` | Approved complete Text-to-3D descriptive/JSON export. |
| `P3D_ARTICRAFT_ALL_MODELS_ROOT` | Extracted Image-to-3D all-model result bundle. |
| `P3D_TEXTIMAGE2CAD_ALL_MODELS_ROOT` | Extracted Assembly-3D all-model result bundle. |

If those variables are not set, the script looks for ignored local symlinks at
`local/text_parametric_openscad`, `local/text_descriptive_json`,
`local/articraft_all_models`, and `local/textimage2cad_all_models`.

Text demo sources must each be a complete approved export containing every
listed model. The builder no longer splices a one-off canary directory into an
otherwise frozen result tree.

The bundle intentionally keeps only page-facing artifacts: generated CAD
programs, STL meshes, thumbnails, input images, and compact public metrics. It
does not include request configs, response logs, token usage, screening or
annotation artifacts, full result trees, or paper plotting outputs.
The rebuild also writes `public/demo/data_audit.json`, which records source
coverage and any case/model subsets used for the lightweight public demo without
including private absolute paths.

The anonymous profile excludes the retired `mimo-reason` demo as part of its
GPT-only transform. Public and paper profiles preserve the complete checked-in
demo manifest and all referenced showcase assets.

Every bundled run includes the native generated program in `assets.generated`.
For auditability, non-JSON outputs also include `assets.generated_json`, a
sanitized JSON envelope that records the task, case, model, input spec, output
format, metrics, and generated program text when that source is present.
Text-to-3D exposes JSON and OpenSCAD. Image-to-3D uses only the provided
Articraft all-model bundle for the public demo. The page exposes whichever
native formats are present in that bundle, including CadQuery, OpenSCAD, and
Three.js when complete runs are available. JSON is not treated as an
Image-to-3D native format. Assembly-3D uses only the provided text-image CAD
all-model bundle and exposes the native formats with complete runs.
