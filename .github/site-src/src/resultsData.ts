import liveTextSummary from "./liveTextSummary.json";

export type ResultTableRow = { model: string; model_id?: string; family?: string; cells: string };

export type ResultSubtable = {
  key: string;
  title: string;
  accent: string;
  superGroups?: Array<{ label: string; span: number }>;
  groups: Array<{ label: string; span: number }>;
  metrics: string[];
  rows: ResultTableRow[];
  domainRows?: ResultTableRow[];
  note?: string;
};

export const liveResultTables: ResultSubtable[] = [
  {
    "key": "text",
    "title": "Text-to-3D",
    "accent": "var(--blue)",
    "superGroups": [
      {
        "label": "Descriptive",
        "span": 6
      },
      {
        "label": "Parametric",
        "span": 12
      },
      {
        "label": "Score / Cost",
        "span": 2
      }
    ],
    "groups": [
      {
        "label": "JSON",
        "span": 2
      },
      {
        "label": "OpenSCAD",
        "span": 2
      },
      {
        "label": "Average",
        "span": 2
      },
      {
        "label": "JSON",
        "span": 4
      },
      {
        "label": "OpenSCAD",
        "span": 4
      },
      {
        "label": "Average",
        "span": 4
      },
      {
        "label": "Fixed 100",
        "span": 2
      }
    ],
    "metrics": [
      "Judge",
      "Valid",
      "Judge",
      "Valid",
      "Judge",
      "Valid",
      "Geo",
      "Topo",
      "Judge",
      "Valid",
      "Geo",
      "Topo",
      "Judge",
      "Valid",
      "Geo",
      "Topo",
      "Judge",
      "Valid",
      "Score",
      "USD / case"
    ],
    "rows": [],
    "note": "Text-to-3D scores in the live leaderboard are computed on a fixed 100-case subset evaluated identically across all models, so they differ from the figures in the paper. The leaderboard is continuously updated as new evaluations are completed. Cost is estimated for the same four 100-case runs from saved usage and published rate cards."
  },
  {
    "key": "assembly",
    "title": "Assembly-3D",
    "accent": "var(--coral)",
    "groups": [
      {
        "label": "CadQuery",
        "span": 5
      },
      {
        "label": "OpenSCAD",
        "span": 5
      },
      {
        "label": "Average",
        "span": 5
      }
    ],
    "metrics": [
      "Geo",
      "Topo",
      "Judge",
      "Part",
      "Valid",
      "Geo",
      "Topo",
      "Judge",
      "Part",
      "Valid",
      "Geo",
      "Topo",
      "Judge",
      "Part",
      "Valid"
    ],
    "rows": [
      {
        "model": "GPT-5.6 (sol)",
        "family": "openai",
        "cells": "0.594! 0.909 0.531! 0.669! 0.975 0.634! 0.997 0.611! 0.646^ 1.000! 0.614! 0.953 0.571! 0.658! 0.988^"
      },
      {
        "model": "GPT-5.5",
        "family": "openai",
        "cells": "0.565 0.942^ 0.523^ 0.617 0.990^ 0.585 0.980 0.537 0.650! 0.980 0.575^ 0.961^ 0.530 0.633^ 0.985"
      },
      {
        "model": "Fable 5",
        "family": "fable",
        "cells": "0.571^ 0.962! 0.501 0.625^ 1.000! 0.575 0.977 0.561^ 0.609 0.978 0.573 0.970! 0.531^ 0.617 0.989!"
      },
      {
        "model": "Gemini 3.1 Pro",
        "family": "gemini",
        "cells": "0.528 0.907 0.453 0.593 0.940 0.605^ 0.989 0.542 0.641 0.989 0.567 0.948 0.497 0.617 0.964"
      },
      {
        "model": "Claude Opus 4.6",
        "family": "claude",
        "cells": "0.497 0.880 0.297 0.558 0.919 0.536 0.967 0.402 0.580 0.967 0.516 0.923 0.349 0.569 0.943"
      },
      {
        "model": "Kimi K2.7 Code",
        "family": "kimi",
        "cells": "0.444 0.877 0.271 0.535 0.920 0.530 1.000! 0.401 0.558 1.000! 0.487 0.938 0.336 0.547 0.960"
      },
      {
        "model": "Kimi K2.6",
        "family": "kimi",
        "cells": "0.422 0.810 0.258 0.489 0.850 0.521 0.980 0.311 0.589 0.980 0.472 0.895 0.285 0.539 0.915"
      },
      {
        "model": "Qwen3.7-Plus",
        "family": "qwen",
        "cells": "0.335 0.734 0.197 0.401 0.780 0.489 1.000^ 0.291 0.544 1.000! 0.412 0.867 0.244 0.472 0.890"
      },
      {
        "model": "Doubao Seed 2.1 Pro",
        "family": "doubao",
        "cells": "0.206 0.393 0.139 0.220 0.410 0.499 0.980 0.289 0.517 0.980 0.353 0.687 0.214 0.369 0.695"
      },
      {
        "model": "MiMo v2 Omni",
        "family": "mimo",
        "cells": "0.160 0.396 0.057 0.217 0.408 0.440 0.990 0.176 0.528 0.990 0.300 0.693 0.116 0.372 0.699"
      },
      {
        "model": "Qwen3.6-Plus",
        "family": "qwen",
        "cells": "0.160 0.309 0.081 0.166 0.333 0.473 0.979 0.208 0.513 0.980 0.317 0.644 0.144 0.340 0.657"
      },
      {
        "model": "GLM 5V Turbo",
        "family": "zai",
        "cells": "0.149 0.290 0.061 0.169 0.293 0.435 0.940 0.204 0.523 0.940 0.292 0.615 0.133 0.346 0.616"
      },
      {
        "model": "Doubao Seed 2.0 Pro",
        "family": "doubao",
        "cells": "0.076 0.166 0.038 0.101 0.174 0.439 0.968 0.194 0.534 0.968 0.257 0.567 0.116 0.317 0.571"
      }
    ],
    "note": "Assembly-3D scores in the live leaderboard are computed on a fixed 100-assembly subset evaluated identically across all models, so they differ from the 203-assembly figures in the paper. The leaderboard is continuously updated as new evaluations are completed."
  }
];

if (
  liveTextSummary.schema_version !== "p3d-live-text-summary-v1" ||
  liveTextSummary.rows.length !== 15
) {
  throw new Error("Invalid Text-to-3D live leaderboard summary");
}

liveResultTables[0] = {
  ...liveResultTables[0],
  rows: liveTextSummary.rows.map((row) => ({
    model: row.model,
    family: row.family,
    cells: `${row.metrics} ${row.score.toFixed(1)} $${(row.cost_usd / 100).toFixed(3)}`,
  })),
  note:
    "Scores use the fixed 100-case subset; costs are normalized per case across the four evaluation settings. Updated as evaluations complete.",
};
