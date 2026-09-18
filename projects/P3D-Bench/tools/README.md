# P3D-Bench static release tools

## Current aggregation revision — September 18

The active Image/Assembly leaderboards and all source mirrors use the accepted
paper export. Geo normalizes each prediction's metrics, averages CD score,
F@0.01, NC and available IoU within that prediction, then averages cases and
finally formats. Unavailable IoU is omitted, never worst-filled. Invalid
predictions retain zero Geo; recorded API and evaluation gaps are preserved.
Standalone IoU uses measured values from valid outputs, including measured zeros.
Headline Score excludes Topo and Valid. Image's Cadrille and CAD-Coder rows use
native CadQuery only; unsupported format and average cells remain empty.

Assembly's displayed cost now pools total recorded generation cost over the
actual tested output count, matching the paper's per-case cost figure. Historical
cost_usd and estimated_cost_usd keep their audited equal-format values for
provenance; cost_usd_per_case is the current display field. Kimi remains an
estimate and its actual-cost field remains null.

All 180 spatial examples expose case-wise Geo in their bucket data. The 70
available Assembly Part evaluations and both part-pair examples use the frozen
3% / 2048-point results; two unmeasured Part entries stay unmeasured. The two
showcase assignments are unchanged, so their existing meshes and renders are
preserved. The source audit records the new score hashes separately from the
original generation and asset hashes. Text data and its current display assets
are unchanged by this release.

Import current data with the research workspace's scripts/sync_site_casewise.py,
then run update-live-image-assembly.mjs and update-spatial-demo.mjs. Sync Figure 1
SVG/PDF/PNG and its data copy together, and bump their content-based URLs. Sync
paper abstract, manifest and source/bundle fallbacks together. Historical tools
and dated release notes below describe their original snapshots; do not use
metric-wise historical aggregates to overwrite this case-wise revision.

The public page has one leaderboard, showing current Assembly, Text and Image
results in that order. There is no Paper/Live switch.
Keep `leaderboard-renderer.fragment.js` and the source `ResultsTables`
component aligned with that presentation when patching the active bundle.
The score figure is synchronized with Figure 1 of the ICLR 2027 paper.
Its panels use separate score axes and the same Assembly model order. The
figure uses the paper-reaggregated Text scores; the live Text table retains
its independently published fixed-denominator scores. SVG, PDF and PNG copies must be synchronized together, and the SVG
and PDF URLs versioned whenever that figure changes. Use the Doubao icon
(`demo/icons/src/doubao-color.svg`) for the Doubao family.

The evaluation overview uses Figure 2 from the ICLR 2027 paper's
`figures/fig2_leaderboard.pdf` (SHA256 `5410596bd1448b4b0f28db1cc7c7958a98de3d3e22eb9fcdb76bbef738154207`).
Render the PDF with `pdftoppm -scale-to 2800 -png -singlefile` and use
`figures/fig2_leaderboard-5410596bd144.png` in both the source overview and active bundle.
Version the image and bundle filenames when the paper figure changes.

Run the updater for the leaderboard being changed:

```bash
node projects/P3D-Bench/tools/update-live-assembly.mjs
node projects/P3D-Bench/tools/update-live-text.mjs
node --test projects/P3D-Bench/tools/live-tables.test.mjs
node --test projects/P3D-Bench/tools/text-table.test.mjs
node projects/P3D-Bench/tools/update-live-image-assembly.mjs
node --test projects/P3D-Bench/tools/image-table.test.mjs
```

Assembly uses `../live-assembly-summary.json`: the original seven models plus
completed Doubao Seed 2.1 Pro, MiMo-V2.5 and DeepSeek V4.1 Flash rows when available, both formats,
equal-weight averages, and scores computed from unrounded metrics. API failures
are excluded from tested cases; invalid outputs remain in the score denominator.
Costs use actual generation tokens at official API rates checked September 10,
2026. Initial and correction attempts are summed, including reasoning once and
separately priced cache reads/writes. Invalid cases remain included; API-unrun
cases are excluded. Each format's total cost is divided by its tested count, then
the two format means are averaged equally. This is an API-equivalent generation
cost, excluding evaluator calls, superseded runs, transport failures, subscription
payments, and taxes. Kimi's original 240 generation responses have empty usage.
Its actual cost remains `null`, but the separate `estimated_cost_usd` field
publishes **$0.575/case**, with its estimated basis explained in the table footnote.
Assembly is displayed first.

Additional rows require frozen score provenance and Gemini 3.8 Flash `high`
for decomposition and judging. Each format must contain the same 100-case scope;
generation API failures remain excluded. New rows display `-` for cost until
their generation usage is audited. Adding rows preserves the original seven
rows and their existing cost audits.

Per the maintainer's September 11 display preference, the live Assembly table
has no methodology footer. Keep explanations and source details in the audit
JSON and maintenance documentation; do not add them back below the table.

DeepSeek V4.1 Flash has complete recorded usage for 193 tested outputs (94
CadQuery, 99 OpenSCAD), comprising 237 successful initial/correction requests.
Seven API-unrun outputs are excluded consistently from score and cost. The
published **$0.072/case** is the official standard peak API-equivalent cost:
$0.30/M cache-miss input, $0.006/M cache-hit input and $1.20/M output. Off-peak
discounts are not applied, so this comparable cost does not depend on run timing.
The audit independently verifies DeepSeek's native cache-hit/miss counters,
includes reasoning once, and records its own frozen score source.

Doubao Seed 2.1 Pro now has complete recorded usage for all 200 tested outputs:
254 CadQuery requests and 115 OpenSCAD requests, including corrections and
invalid outputs. Its API-equivalent generation cost is **$0.285/case** (unrounded
$0.2850802774252575), with the two formats weighted equally. Official Volcengine
rates are CNY 6/M uncached input, CNY 1.2/M cached input and CNY 30/M output;
thinking is already included in output tokens. The largest request input was
13,944 tokens, within the quoted 256k tier. Currency conversion uses the official
September 10, 2026 central parity rate of CNY 6.7766/USD. The pricing catalog
includes both original CNY rates and the FX source; the cost audit records this
row's own frozen score source while preserving the prior seven-model audit.

Kimi's estimate recounts saved reasoning and code with its own official K3
tokenizer, reconstructs initial/refine prompts from saved captions, previous
code and errors, and uses the benchmark's historical system prompts. It includes
196 initial calls and 44 correction calls. Images are assumed to be 1024×1024
and input is priced with zero cache hits, because original image files and
cache counters are unavailable. It is not API-reported usage or an invoice.
`../kimi-cost-estimate.json` includes the pinned vocabulary hashes, assumptions,
per-format counters and sensitivity to cache/image assumptions. It does not
replace the actual-usage audit's missing fields.

To reproduce this separate estimate, install `tiktoken` and download only the
tokenizer/formatter files listed in `kimi-cost-estimate.json` from the pinned
revision of [moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3).
Also save the model metadata as `model-info.json` (with its `sha` revision).
Run:

```bash
python projects/P3D-Bench/tools/estimate-kimi-cost.py \
  --tokenizer-dir /absolute/path/to/tokenizer-files \
  --benchmark-repo /absolute/path/to/cadbenchmark \
  --snapshot-directory /absolute/private/path/to/frozen-snapshot \
  --output projects/P3D-Bench/kimi-cost-estimate.json \
  --private-ledger /absolute/private/path/to/kimi-estimate-ledger.json
```

Per the maintainer's display preference, the cost cell uses the same currency
format as the other models, without an approximation marker. The table footnote
and separate estimated-value fields retain its provenance. Estimated values
cannot be written into the audited actual-cost field.

Official rates and source links live in `../assembly-api-pricing.json`; aggregate
token counts and costs live in `../assembly-cost-audit.json`. The historical
`cost_usd` field in the leaderboard stores **USD/case × 100**, while the audit's
`usd_per_case` field uses ordinary USD. To reproduce the audit:

```bash
python projects/P3D-Bench/tools/calculate-assembly-costs.py \
  --results /absolute/private/path/to/frozen/full_results.json \
  --summary projects/P3D-Bench/live-assembly-summary.json \
  --pricing projects/P3D-Bench/assembly-api-pricing.json \
  --audit-dir /absolute/private/path/to/cost-audit \
  --output projects/P3D-Bench/assembly-cost-audit.json
python -m unittest discover -s projects/P3D-Bench/tools -p 'test_assembly_costs.py' -v
```

The calculator verifies every retained attempt against the checkpoint aggregate,
checks response identities for duplicate charges, and recovers the nine missing
history lists from their existing attempt files. It does not issue model calls
or modify experimental results. Keep `request-ledger.private.json` outside the
public repository. Copy the audited per-format values into each leaderboard
row's `generation_cost`, set `cost_usd` from `usd_per_case × 100`, then run the
Assembly updater. The updater rejects missing usage or inconsistent denominators.

Text uses `../live-text-summary.json` (`p3d-live-text-summary-v2`): ten current
models, the same fixed first-100 UIDs, and JSON/OpenSCAD in the main table.
The full Text dataset remains 400 cases. The selected subset has 98 D4 and 2 D5
cases and is not a random or balanced sample. Scores preserve the existing
failure denominators. Unavailable IoU is omitted from the valid case's geometry
mean, and F@0.05 is excluded from Geo. Scores exclude Topo while keeping it as
a separate reported column, and display two decimals after sorting unrounded
values. `text-table.mjs` checks all eighteen
metric cells, equal format means, scores, model identities and numeric costs.

The ten general-purpose models use the common fixed-100 aggregation. The JSON-only
Text2CAD baseline retains the accepted paper aggregate and **17.85** headline score:
its native Judge averages valid predictions, CD is averaged before normalization,
and IoU omits valid cases where unavailable while retaining invalid penalties.
Its unsupported OpenSCAD and average cells remain empty. Import accepted values;
do not recompute a different baseline policy in the frontend.
Reasoning settings are provenance rather than model-name suffixes.

Text costs are displayed per single generation across the 400 selected responses
(100 UIDs × two specifications × two formats) and exclude retries; they are
standard-rate equivalents, not invoices or Assembly's cost convention.
Detailed token accounting, conversions and estimates stay in the workbench.
`cost_usd` and `estimated_cost_usd` retain the
full selected-response total; `usd_per_generation` is that total divided by 400.
Source hashes and cost bases remain in the summary; private audits stay outside
this repository. Publishing display assets does not constitute reevaluation.
The old seventeen-row table remains in Git history.

Updating Text preserves Assembly's data and position. Both updaters locate
tables by key, guard the surrounding bundle bytes,
write a content-hashed asset, and synchronize their source JSON mirrors under
`.github/site-src/src/`. Paper results, demo data, and styles are preserved.
The Assembly updater also registers the Grok model icon and keeps missing costs
last for both ascending and descending sorting.

## Text demo

`../demo/text-live-fixed100.json` overlays only Text records at runtime. It
contains ten models, four original cases within fixed-100, both specifications
and both formats: 160 records, of which 159 are complete valid outputs. The
original invalid JSON record remains saved and is excluded by the completeness
filter. Never replace its output with another model's mesh. The mounting-bracket
showcase uses each model's own parametric OpenSCAD output with the same input.
The 481 original files in `../demo/text_live_fixed100_v1/assets/` remain unchanged.
An additional 244 content-addressed display files serve 79 valid descriptive cases:
GT and prediction meshes are scale-normalized and aligned, with matching cameras.
Only the four display references change; programs, scores, 80 parametric records,
the invalid record and the parametric showcase are unchanged. These images are
presentation derivatives, not replacement evidence for historical Judge inputs.
All Image/Assembly records and metadata are preserved by `text-demo.mjs`.
Displayed Geometry excludes F@0.05, and all task demo metric cards omit F@0.05
while retaining the raw value in saved evidence. Every main leaderboard places
Score and Cost immediately after Model. Best/second styling applies only to Geo,
Judge and, where present, Part; Topo, Valid and coverage columns remain unmarked.

```bash
node projects/P3D-Bench/tools/update-live-text-demo.mjs
node --test projects/P3D-Bench/tools/text-demo.test.mjs
```

The runtime updater guards the manifest fetch, Text showcase, input selector and abstract
boundaries and preserves unrelated bundle bytes and leaderboard entries.
Manifest and overlay requests use content hashes for cache versioning. If the
overlay cannot load, the existing base manifest remains available. Source
mirrors live in `.github/site-src/src/`; responsive overrides are scoped to the
Text comparison cards. Repeating the same update is a no-op; changing the
payload requires a reviewed update to the runtime matching boundaries.
Switching the Text input protocol retains the current output format whenever
that model has a complete result for it; other tasks keep their existing behavior.

Only project-page data and referenced display assets are published. Research
evidence, paper-figure handoffs, local history, private records and preview-only
materials belong to the research workbench, not this repository. The workbench
owns score aggregation and exports; site tools validate and display the selected
values. Source mirrors and active bundles must be updated together. Keep obsolete
local builds outside the site; do not copy a legacy worktree over main.

Run `node projects/P3D-Bench/tools/check-publication.mjs` before committing.
The Pages workflow also rejects research-only directories and private files.
Existing figure assets and links remain unchanged.

Structural source development uses `.github/site-src/`. A development build is
not a replacement for the deployed Paper results; compare every page section
before a full release.

The Grok SVG is from [Lobe Icons](https://github.com/lobehub/lobe-icons), with its
license alongside the icon at `demo/icons/src/grok.LICENSE`.

## Image Hard100 and additional Assembly formats (September 15)

`live-image-summary.json` contains nine current models on the same 100 Image
UIDs in CadQuery, OpenSCAD and Three.js, frozen at **2026-09-16 12:18:48 +08:00**.
The score is the equal-format average of Geo, Topo and Judge, multiplied by 100.
Judge uses the equal mean of geometry, aesthetics and semantic axes, normalized by `(s - 1) / 9`. Valid is reported separately. The current
Image result is provisional in the source metadata: GPT has 257/300 tested cases, Opus 277/300, and
Doubao 299/300. The other six models have all 300 tested, with 66 successful
exports collectively awaiting local evaluation. Doubao has all 253 valid
outputs judged; one API failure and 46 invalid outputs remain. Tested and Judged coverage appear in the table.

The importer uses the existing `snapshot_image2cad_current_metrics.py` result:
API failures are excluded, genuine generation/export failures retain the
benchmark's worst-fill penalties, and missing evaluations remain unmeasured.
Successful exports backed by their saved attempt and mesh are counted as valid
even if later local evaluation failed. The public summary retains raw/export
validity counters, aggregate metric denominators and checkpoint hashes.
Publishing does not rerun evaluation or claim a uniform evaluator route.

Image costs are saved-generation API equivalents at the frozen September 10/11
rates in `image-api-pricing.json`, including recorded corrections. They use total
cost divided by tested cases across the three formats, following the source
report. This differs from Assembly's equal-format cost weighting and Text's
four selected responses per UID. Evaluator calls, superseded attempts, unrecorded
transport failures and subscription payments are excluded. These are historical
comparison estimates, not current price quotations or account expenditure.

Assembly's nine existing rows, coverage and audited costs exactly match a fresh
snapshot; `latest_verification` records its source hashes. The two-format score
remains intact. Gemini's imported JSON and Three.js results are retained
in the summary JSON: **61.96** (100/100 tested) and
**63.82** (97/100 tested, 96/97 judged). Image's additional Gemini JSON result is
**61.80** with all 100 tested and judged. Each extra row has a single-format
score and does not enter the main leaderboard average. Per the maintainer's
display preference, the page uses the title “Image-to-3D”, with no snapshot
footer, Hard100 suffix or Additional formats section. MiMo remains paused and
is not included. Figure assets are unchanged; the subsequent demo refresh is
documented below.

To reproduce, use the benchmark environment to freeze Image and Assembly reports
under a private `AUDIT/image` and `AUDIT/assembly` directory. Then run:

```bash
python projects/P3D-Bench/tools/import-live-image-assembly.py \
  --audit /absolute/private/path/to/AUDIT \
  --benchmark-repo /absolute/path/to/cadbenchmark \
  --image-bucket /absolute/path/to/image2cad_hard100_reason_20260908 \
  --assembly-bucket /absolute/path/to/textimage2cad_ppapi_reason_new
node projects/P3D-Bench/tools/update-live-image-assembly.mjs
node --test projects/P3D-Bench/tools/*.test.mjs
```

The importer verifies every existing Assembly bucket and coverage denominator
before retaining its cost audit. Additional-format checkpoints are frozen on
first import and reused, so later running jobs cannot silently alter a repeat
import. Only aggregate summaries, source hashes and historical pricing enter
the public repo. Full checkpoints stay in the private audit directory.

### Three-axis Judge correction

Both Image and Assembly now include aesthetics in Judge. The release keeps the same frozen cases, coverage, non-Judge buckets and costs. `judge_submetrics` records the raw means, normalized axes and denominators. To reapply the correction from the private release audit, run:

```bash
python projects/P3D-Bench/tools/judge_three_axis.py --assembly-results /absolute/private/path/to/AUDIT/assembly/full_results.json
node projects/P3D-Bench/tools/update-live-image-assembly.mjs
```

The importer also restores all three axes, including additional Gemini formats, before writing future summaries. No evaluator calls are made.

## Current Image and Assembly examples

`demo/spatial-live.json` replaces the Image and Assembly portions of the runtime
manifest after the current Text overlay is applied. It contains nine current
models and eight new cases: robotic arm, planetary gear train, toy tank and
high-rise building for Image; piston/connecting rods, seven-segment display,
universal joint shaft and scissors for Assembly. All nine models have complete
saved outputs, renders and judge scores in all three Image or both Assembly
formats: 180 runs in total. Each case uses identical input image bytes, input
text (Assembly), and GT mesh bytes across models. These are curated examples,
not the sample used to estimate leaderboard performance. No leaderboard rows,
Text examples, or page methodology labels are changed by this update.

The showcase uses one fixed CadQuery case per task and includes all nine models
in its existing carousel. `demo/spatial-assemblies.json` supplies two new part
examples: GPT-6 Astra on piston/connecting rods and Claude Opus 5 on the universal
joint shaft. Part identities, Hungarian assignments, acceptance flags and scores
come from saved evaluation records. Only part display meshes are transformed:
the saved assembly alignment, followed by a deterministic rigid 24-rotation
alignment (1,024 surface points, seed 42). The private ledger records the source
hashes and matrices; scores are never recomputed or substituted.

`demo/spatial_live_v1/assets/` contains 587 content-addressed files (309 MB, largest
file 22.4 MB). Full predictions and code are each model's own saved output; meshes
are not decimated. Render images are copied unchanged. `spatial-live-audit.json`
provides the selected scope, source-record hashes and public asset hashes without
private paths or request metadata. Images and meshes are fetched only as needed
by the existing viewers and carousel.

Use frozen benchmark Image and Assembly snapshots plus a reviewed `selection.json`
under a private audit directory to reproduce:

```bash
python projects/P3D-Bench/tools/build-spatial-demo.py \
  --audit /absolute/private/path/to/demo-audit \
  --benchmark-repo /absolute/path/to/cadbenchmark
node projects/P3D-Bench/tools/update-spatial-demo.mjs
node --test projects/P3D-Bench/tools/*.test.mjs
```

The updater guards the manifest adapter and showcase selection boundaries,
preserves unrelated bundle bytes and every leaderboard entry, versions both
data URLs, and updates the source mirror. Repeat updates with the same payload
are a no-op. The Text updater recognizes this composed loader and preserves it.
The display retains the existing task tabs, model carousel, input dialogs and
part-pair carousel; spatial-only responsive CSS handles narrow screens.

### September 16 completed Image queues

The final saved Image snapshot updates Doubao from 53.08 to 52.68, with 299/300
tested and 253/253 successful exports judged. All eight other displayed rows
remain unchanged. The summary retains 67 API failures and 66 historical local
evaluation gaps; this is not a claim of complete fixed-denominator coverage.
Figure 1 SVG/PDF/PNG and its data mirror use the same updated Image score,
preserving the paper's Assembly and Text scores, styling, axes and model order.
No generation or evaluator calls were made by this publication.
