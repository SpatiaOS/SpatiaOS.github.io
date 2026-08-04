# P3D-Bench static release tools

`update-live-text.mjs` is the supported updater for the maintained public page.
It consumes `../live-text-summary.json` and replaces only the active Live
Text-to-3D table in the compiled application bundle. It fails closed if the
17-row schema, metric count, score order, or bundle anchors differ.

Run from the repository root:

```bash
node projects/P3D-Bench/tools/update-live-text.mjs
```

The updater intentionally preserves Paper tables, Live Assembly, demos,
navigation, sections, styles, and media. The maintained source snapshot and
release utilities live under `.github/site-src/`; they are not required for
routine Live Text updates.
