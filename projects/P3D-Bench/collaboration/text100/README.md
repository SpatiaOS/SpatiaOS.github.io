# Text fixed-100 figure handoff

This collaboration material replaces the previous **Text experiment** only.
The complete Text dataset remains 400 cases; current results use the same 100
UIDs for all ten models. Image and Assembly results are outside this handoff.

- [Original-case qualitative materials](qualitative_materials_v1/README.md):
  60 model-specific records, 286 original assets and 20 complete Judge QA sets.
- [Selected invalid-output evidence](invalid_materials_v1/README.md): 54 saved
  programs and error records (17 main-format and 37 Gemini supplemental-format).
- [Numerical plot inputs](numerical/definitions.json) match the paper
  repository's `data/text100/`; `TEXT_RESULTS_UPDATE.md` lists figure work.

Use the current paper data export, whose definitions identify
`text_geo4_score3_iou_omit_v2`. Geometry averages CD score, available IoU, F@.01 and NC within each valid case, then averages all 100 cases;
the Text score averages descriptive Judge, parametric Geometry and parametric
Judge (0–100). Topology is reported separately. Unavailable valid IoU is omitted,
not worst-filled. Measured zeros remain zero, and invalid outputs retain zero
Geometry contributions. Separately reported IoU omits unavailable valid entries.
Saved primitive case measurements are unchanged; Geometry and aggregate IoU are rederived;
programs, images, Judge evidence and costs are unchanged.
Use aggregate CSVs for rankings and cost/radar plots, and per-case values for
distributions. Native Text2CAD has a separate preserved contract. The paper's original figures and their
full typesetting are restored; pending Text figure updates remain with the
original maintainers.

Both packages include file hashes, clickable case-level indexes and scope
limitations. They contain saved evidence, not new experiments or new figures.
Use only the confirmed original figure workflow; do not redraw with a similar
script, relabel old predictions, reuse old class percentages, or invent missing
cases. Two old qualitative cases are outside the fixed 100; another case has
two retained GT versions, documented in `comparison_compatibility.json`.

The preview temporarily withholds the old Text overview panel using CSS only.
Original SVG, PNG and PDF assets remain unchanged. This branch is not deployed.
