# Text-to-3D Four-Class Invalid Breakdown

This directory reclassifies Text-to-3D model-invalid records into the four execute-stage classes used for appendix-style breakdowns: `Syntax`, `Undefined Reference`, `Parameter`, and `Geometry`. Non-model GT/cache/render/local-prep gaps are excluded before class aggregation.

Scope: 9 main models only; descriptive/parametric specifications and JSON/OpenSCAD outputs are kept separate.

Mapping policy:

- `Syntax`: malformed JSON, OpenSCAD parser errors, missing/empty final program text, or absent local-evaluation records when the absence is model-output related.
- `Undefined Reference`: explicit undefined-name, reference, or unknown-module errors. No such execute-stage records occur in the current Text-to-3D model-invalid set.
- `Parameter`: missing/wrong JSON schema fields, missing required sequence/parts fields, invalid OpenSCAD operation parameters, or analogous argument/schema failures.
- `Geometry`: solid/B-rep construction failure, non-closed or empty geometry, STEP/mesh export failure, local export timeout, or uncategorized evaluator-side construction failure after a model output exists.

Files:

- `textp3d_invalid_cases_fourclass.csv/json/jsonl`: per model-invalid record with `failure_class`.
- `textp3d_fourclass_by_model_long.csv`: one row per specification, format, model and failure class.
- `textp3d_fourclass_by_model_wide.csv`: model-level counts and percentages in one row.
- `textp3d_fourclass_by_task_format.csv`: total class counts for each specification-format group.
- `textp3d_fourclass_total_check.csv`: class-count reconciliation and non-model eval/prep skip counts.
- `textp3d_fourclass_*.png/pdf`: four separate plots, one per specification-format group.
