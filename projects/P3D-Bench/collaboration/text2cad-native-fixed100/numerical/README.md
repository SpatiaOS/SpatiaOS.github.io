# Text2CAD native baseline: fixed100

The same 100 UIDs are evaluated under descriptive and parametric specifications. Text2CAD supports native JSON only. There is no OpenSCAD cell or duplicated format average.

All 280 valid-case Judge phases are complete. The original AAAI native-baseline statistics are retained: QA and J-Sem use successful cases; geometric/topological failures are penalized, and valid inapplicable IoU entries are omitted from that metric. CD is averaged before normalizing the aggregate score. Existing local metrics, programs and four-view renders are reused. Per-case scores are diagnostic: Judge averages only valid cases, and Geometry is metric-first. Use the per-format table for model comparisons rather than averaging the diagnostic score columns.

Geometry averages CD score, IoU, F@.01 and NC. Text-P3D is 100 times the mean of descriptive Judge, parametric Geometry and parametric Judge; Topology is reported separately. This membership-only revision makes no new model calls. F@.05 remains in the saved diagnostic fields, not in Geometry.

Use per_format_metrics.csv and model_summary.csv for aggregate plots, per_case_metrics.csv for distributions, and the three LaTeX rows for the existing paper tables. Hosted API-equivalent generation cost does not apply to this local checkpoint baseline. Private provenance is retained separately and must not be exported to the public site.
