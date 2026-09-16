# Text2CAD native fixed100 figure handoff

The native JSON-only baseline scores **17.85**; descriptive and parametric
validity are **91%** and **98%**. All 280 valid-case Judge phases are complete.
The original 400-case dataset and the same selected 100 UIDs are unchanged.

- `numerical/`: 200 case records, two aggregate rows, headline score and the
  three existing-paper table rows. Follow `definitions.json` for native
  aggregation; model-level values are not a mean of diagnostic score columns.
- `qualitative/`: six existing figure cases with original programs, meshes,
  renders and new QA answers; all 11 invalid programs and saved errors.
- The existing `../text100/` package remains the source for the ten
  general-purpose models, with the same four-term Geometry and three-bucket headline revision.

Geometry averages CD score, IoU, F@.01 and NC. The headline averages
descriptive Judge, parametric Geometry and parametric Judge on the 0–100 scale.
Topology remains separately reported. Primitive statistics and Judge phases
are unchanged; only derived Geometry and headline scores have been revised.

Use these inputs with the corresponding original plotters for rankings,
distributions, bucket plots, Judge examples and native qualitative panels.
No image was redrawn, cropped or replaced. Do not invent API generation cost,
OpenSCAD results, replacement cases or failure-category labels.
Follow each case's own GT hash, especially UID0093/00934405.
