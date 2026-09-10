# P3D-Bench static release tools

Run the updater for the leaderboard being changed:

```bash
node projects/P3D-Bench/tools/update-live-assembly.mjs
node projects/P3D-Bench/tools/update-live-text.mjs
node --test projects/P3D-Bench/tools/live-tables.test.mjs
```

Assembly uses `../live-assembly-summary.json`: seven measured models, both formats,
equal-weight averages, and scores computed from unrounded metrics. API failures
are excluded from tested cases; invalid outputs remain in the score denominator.
Costs use actual generation tokens at official API rates checked September 10,
2026. Initial and correction attempts are summed, including reasoning once and
separately priced cache reads/writes. Invalid cases remain included; API-unrun
cases are excluded. Each format's total cost is divided by its tested count, then
the two format means are averaged equally. This is an API-equivalent generation
cost, excluding evaluator calls, superseded runs, transport failures, subscription
payments, and taxes. Kimi's original 240 generation responses have empty usage,
so its cost remains `null` (an em dash). Assembly is displayed first.

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

Text uses `../live-text-summary.json`. Updating it preserves Assembly's data and
position. Both updaters locate tables by key, guard the surrounding bundle bytes,
write a content-hashed asset, and synchronize their source JSON mirrors under
`.github/site-src/src/`. Paper results, demo data, and styles are preserved.
The Assembly updater also registers the Grok model icon and keeps missing costs
last for both ascending and descending sorting.

Structural source development uses `.github/site-src/`. A development build is
not a replacement for the deployed Paper results; compare every page section
before a full release.

The Grok SVG is from [Lobe Icons](https://github.com/lobehub/lobe-icons), with its
license alongside the icon at `demo/icons/src/grok.LICENSE`.
