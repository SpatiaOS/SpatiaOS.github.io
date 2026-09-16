# P3D-Bench static release tools

The public page has one leaderboard, showing the current Assembly results
first and the current Text results second. There is no Paper/Live switch.
Keep `leaderboard-renderer.fragment.js` and the source `ResultsTables`
component aligned with that presentation when patching the active bundle.
The overview asset is the ICLR 2027 teaser. The collaboration preview displays
its Assembly/Image content but clips the previous Text panel with CSS until
the original maintainer supplies its replacement. The original SVG, PDF and
PNG bytes are unchanged; the preview does not link to the old full PDF.
When the maintainer replaces the figure, synchronize all three asset copies
and version the SVG/PDF URLs. Use the Doubao icon
(`demo/icons/src/doubao-color.svg`) for the Doubao family.

Run the updater for the leaderboard being changed:

Text keeps its ten general-purpose rows and accepts one separate native
Text2CAD row in `native_baselines`. `textNativeRows()` validates JSON-only
metrics and the native headline; the existing `domainRows` renderer keeps it
separate during sorting. Unsupported formats and hosted API cost are displayed
as dashes, not invented values. Numerical and original-case handoff materials
are in `../collaboration/text2cad-native-fixed100/`.

The current Text contract is `text_geo4_score3_v1`: Geometry averages CD score,
IoU, F@.01 and NC, and the headline averages descriptive Judge, parametric
Geometry and parametric Judge. Topology is still displayed, not aggregated
into the headline. Score and USD/case are the first two columns after Model;
Topo and Valid receive no best/second styling. The updater synchronizes the
scoped renderer fragment as well as the Text table; other task data is unchanged.
Text demo metric cards no longer display F@0.05; the raw diagnostic remains
in the saved source, and non-Text metric visibility is unchanged.

```bash
node projects/P3D-Bench/tools/update-live-assembly.mjs
node projects/P3D-Bench/tools/update-live-text.mjs
node --test projects/P3D-Bench/tools/live-tables.test.mjs
node --test projects/P3D-Bench/tools/text-table.test.mjs
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

Text uses `../live-text-summary.json` (`p3d-live-text-summary-v2`): exactly ten
current models, fixed-100, JSON/OpenSCAD only in the main table. Scores follow
the owner-specified AAAI table implementation: valid measured IoU mean weighted
by common metric-success count / 100. Inapplicable IoU is not a measured zero.
Scores are sorted before rounding and displayed to two decimals. The eighteen
metric cells are checked against the per-format values and equal-weight means.
All ten current Text rows require a supported numeric dollar value; do not show
`N/A`, an approximation marker, or substitute a zero. Kimi retains its separate
tokenizer-estimate fields but displays `$0.486`. Qwen `$0.410` and Doubao `$0.638`
reuse their saved official-price equivalents with exactly 400 selected responses
per model, excluding retries. Doubao retains the fixed 7 CNY/USD comparison
conversion, not today's FX. The earlier `$0.751` included 50 unselected responses
and must not be used for the selected-response comparison. GLM-5.3 and
GLM-5.3-Flash likewise use their 400 selected responses, not all saved attempts.
Text costs cover four generation cells per UID and are not Assembly's cost
convention or actual invoices. The private v3 audit records the source hashes.
`cost_usd` and `estimated_cost_usd` store USD/UID multiplied by 100. Historical
seventeen-row input is retained exactly in
`../history/live-text-summary-35f95f8.json`, not in the current table.

This September 15 change is a collaboration-branch preview, not a publication or a uniformly
re-evaluated protocol claim. Selected historical results and real Judge route
differences remain in the private provenance; no experiments were repeated.
The statistical overview asset is unchanged; its historical Text panel is
withheld, with a visible replacement notice. Dataset figures remain valid descriptions of the
complete 400-case datasets; do not replace them with 100-subset counts. Plot updates require the
verified original script; do not create, modify, or substitute plotting code.

Updating Text preserves Assembly's data and position. Both updaters locate
tables by key, guard the surrounding bundle bytes,
write a content-hashed asset, and synchronize their source JSON mirrors under
`.github/site-src/src/`. Paper results, demo data, and styles are preserved.
The Assembly updater also registers the Grok model icon and keeps missing costs
last for both ascending and descending sorting.

## Current local Text demo overlay

`../demo/text-live-fixed100.json` supplies the same ten current models and the
four-case intersection of the old Text demo/showcase with the fixed-100 UIDs.
It retains 160 original records (159 complete valid outputs and one original
invalid JSON output). The existing completeness filter exposes only the 159
complete outputs; never replace the invalid case with another model's mesh.
The mounting-bracket showcase keeps its original case, comparing each model's
own parametric OpenSCAD result with the same input and verified equivalent GT.

The 481 assets in `../demo/text_live_fixed100_v1/assets/` are byte-for-byte copies
of saved programs, meshes and images, named by SHA256. There was no new CAD
evaluation, model call or benchmark rendering. Private source paths and audit
files remain outside this repository. The original `demo/manifest.json` is kept
in `history/demo-manifest-before-text100-35f95f8.json`; only its Text evaluation
sentence in the paper abstract is corrected in the active manifest. All original
case, run, model and figure data are untouched. `text-demo.mjs` merges only Text records,
preserving the complete Image/Assembly records and metadata.

```bash
node projects/P3D-Bench/tools/update-live-text-demo.mjs
node --test projects/P3D-Bench/tools/text-demo.test.mjs
```

This is a restricted local-review runtime adapter, not a whole-site release
build. It guards the original fetch and Text-showcase boundaries and preserves
all remaining runtime bytes and leaderboard entries. Repeating it with the
same payload is a no-op; a different payload/version must pass a reviewed
boundary migration, not a blind replacement. Source mirrors are in
`.github/site-src/src/textLiveDemo.json` and `main.tsx`. The separate
`assets/text-demo-overrides.css` is scoped to Text comparison cards to prevent
narrow-screen label overflow without changing Image/Assembly styling.

Local browser acceptance covers every complete selector combination, the ten
showcase models, generated-program identity, other-task tabs, and widths
1600/820/390. Statistical-figure completion is a separate gate: the grouped
overview still requires its original script; the complete-dataset panels stay
unchanged. The fixed100 subset retains original difficulty labels (98 D4 and 2 D5)
and must not be described as a balanced or random sample of the full dataset.
The manuscript collaboration snapshot contains numerical inputs in data/text100
and a Text figure handoff in TEXT_RESULTS_UPDATE.md. No figure has been redrawn here.

This snapshot is pushed to `text-fixed100-review-20260915`, not `main`, because
the repository deploys Pages automatically on pushes to `main`. The visible
collaboration notice distinguishes current numerical results from the pending
Text overview. Merging or deploying is a separate maintainer action.

Structural source development uses `.github/site-src/`. A development build is
not a replacement for the deployed Paper results; compare every page section
before a full release.

The Grok SVG is from [Lobe Icons](https://github.com/lobehub/lobe-icons), with its
license alongside the icon at `demo/icons/src/grok.LICENSE`.
