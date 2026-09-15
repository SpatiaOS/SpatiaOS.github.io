# Selected Text invalid-output evidence

Current selection: **17 main-format invalid records** (10 descriptive / 2000 and
7 parametric / 2000), plus **37 Gemini supplementary-format invalid records**.
All 54 records are listed, with their selected saved programs and native error
fields; no API, CAD, mesh export, render or Judge was rerun.

Use `selected_invalid_evidence.csv` and each linked `cases/*.json`. Local-evaluator
errors are separate from historical generation-attempt errors. A stale generation
message such as “OpenSCAD not found” does not replace a later local parser error.
`strict_json_parseable` is only a read-only JSON syntax check, not CAD validity.

The original four classes and examples are in `legacy_taxonomy_policy.md` and
`legacy_taxonomy_examples.csv`. They are **historical**, not measurements of this
cohort. The selected sources have no preserved four-class assignments, and the
original classifier was not found in the checked source inventory. Blank classes
mean unassigned, not zero failures. Some legacy category/subcategory pairs map to
more than one class, so those pairs alone cannot safely infer the new labels.

`coverage_by_cell.csv` reconciles all 44 cells and fixed denominators. It includes
zero-invalid cells. Do not draw current four-class percentages from the old
labels, infer classes by new keyword rules, conflate model parsing with CAD
construction, or silently treat GT/render/preparation failures as model errors.
The original maintainer can review the supplied per-case errors under the same
taxonomy; no one needs to rediscover which outputs or attempts were selected.

The complete datasets and original figure remain unchanged. Figure target:
`invalid_error_types_bars.png` (Text panels only). This is an evidence handoff,
not a finished failure-classification figure.
