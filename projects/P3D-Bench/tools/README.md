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
Unverified costs are `null` and render as an em dash. Assembly is displayed first.

Text uses `../live-text-summary.json`. Updating it preserves Assembly's data and
position. Both updaters locate tables by key, guard the surrounding bundle bytes,
write a content-hashed asset, and synchronize their source JSON mirrors under
`.github/site-src/src/`. Paper results, demo data, and styles are preserved.
The Assembly updater also registers the Grok model icon.

Structural source development uses `.github/site-src/`. A development build is
not a replacement for the deployed Paper results; compare every page section
before a full release.

The Grok SVG is from [Lobe Icons](https://github.com/lobehub/lobe-icons), with its
license alongside the icon at `demo/icons/src/grok.LICENSE`.
