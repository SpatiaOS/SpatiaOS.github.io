# P3D-Bench static release tools

The public page has one leaderboard, showing the current Assembly results
first and the current Text results second. There is no Paper/Live switch.
Keep `leaderboard-renderer.fragment.js` and the source `ResultsTables`
component aligned with that presentation when patching the active bundle.
The overview figure is the ICLR 2027 teaser: updated Assembly models, with
the original Text/Image models retained as a transition and labeled in the
figure. SVG, PDF and PNG copies must be synchronized together, and the SVG
and PDF URLs versioned whenever that figure changes. Use the Doubao icon
(`demo/icons/src/doubao-color.svg`) for the Doubao family.

Run the updater for the leaderboard being changed:

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

Text uses `../live-text-summary.json` (`p3d-live-text-summary-v2`): ten current
models, the same fixed first-100 UIDs, and JSON/OpenSCAD in the main table.
The full Text dataset remains 400 cases. The selected subset has 98 D4 and 2 D5
cases and is not a random or balanced sample. Scores preserve the existing
aggregation, including zero contribution for inapplicable IoU, and display two
decimals after sorting unrounded values. `text-table.mjs` checks all eighteen
metric cells, equal format means, scores, model identities and numeric costs.

Text costs cover four selected generation responses per UID and exclude retries;
they are standard-rate equivalents, not invoices or Assembly's cost convention.
Kimi displays `$0.486` from its official-tokenizer estimate, stored separately
from actual cost. Qwen `$0.410` and Doubao `$0.638` use saved official-price
equivalents for 400 selected responses. Doubao keeps the comparison conversion
of 7 CNY/USD. GLM-5.3 and GLM-5.3-Flash also use selected responses, not all saved
attempts. `cost_usd` and `estimated_cost_usd` store USD/UID multiplied by 100.
Source hashes and cost bases remain in the summary; private audits stay outside
this repository. The imported results retain their historical evaluator routes;
publishing the page does not imply a new uniform reevaluation or verified
upstream Judge identity. The old seventeen-row table remains in Git history.

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
The 481 files in `../demo/text_live_fixed100_v1/assets/` are original saved assets
named by SHA256; this update does not rerun generation, CAD evaluation or renders.
All Image/Assembly records and metadata are preserved by `text-demo.mjs`.

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

Only project-page data and display assets are published. Paper-figure handoff
packages under `collaboration/text100/`, collaboration banners and chart masks
are excluded from main. Existing figure assets and links remain unchanged.

Structural source development uses `.github/site-src/`. A development build is
not a replacement for the deployed Paper results; compare every page section
before a full release.

The Grok SVG is from [Lobe Icons](https://github.com/lobehub/lobe-icons), with its
license alongside the icon at `demo/icons/src/grok.LICENSE`.
