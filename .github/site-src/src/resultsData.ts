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
        "label": "Cost",
        "span": 1
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
        "label": "100 cases",
        "span": 1
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
      "USD"
    ],
    "rows": [
      {
        "model": "GPT-5.6 Sol",
        "family": "openai",
        "cells": "0.846 0.990 0.928 1.000 0.887 0.995 0.674 0.973 0.753 0.980 0.703 1.000 0.829 1.000 0.688 0.987 0.791 0.990 $83.98"
      },
      {
        "model": "Kimi K3",
        "family": "kimi",
        "cells": "0.833 1.000 0.939 1.000 0.886 1.000 0.676 0.986 0.743 1.000 0.695 1.000 0.822 1.000 0.685 0.993 0.782 1.000 $48.60"
      },
      {
        "model": "GPT-5.5",
        "family": "openai",
        "cells": "0.853 1.000 0.922 0.990 0.887 0.995 0.676 0.963 0.713 1.000 0.691 0.990 0.863 1.000 0.683 0.977 0.788 1.000 $163.61"
      },
      {
        "model": "Gemini 3.1 Pro",
        "family": "gemini",
        "cells": "0.836 1.000 0.949 0.990 0.892 0.995 0.660 0.976 0.668 1.000 0.684 0.990 0.820 1.000 0.672 0.983 0.744 1.000 $37.48"
      },
      {
        "model": "Claude Opus 4.6",
        "family": "claude",
        "cells": "0.821 0.990 0.915 0.980 0.868 0.985 0.634 0.936 0.747 0.970 0.663 0.990 0.838 1.000 0.649 0.963 0.792 0.985 $108.21"
      },
      {
        "model": "GLM-5.2",
        "family": "zai",
        "cells": "0.795 1.000 0.882 1.000 0.839 1.000 0.646 0.956 0.728 0.960 0.683 1.000 0.813 1.000 0.664 0.978 0.771 0.980 $14.29"
      },
      {
        "model": "Kimi K2.6",
        "family": "kimi",
        "cells": "0.737 0.900 0.898 0.980 0.817 0.940 0.646 0.966 0.742 0.990 0.670 0.990 0.803 1.000 0.658 0.978 0.772 0.995 $29.23"
      },
      {
        "model": "GLM-5.1",
        "family": "zai",
        "cells": "0.777 0.940 0.825 0.930 0.801 0.935 0.666 0.983 0.771 1.000 0.632 0.940 0.797 0.950 0.649 0.961 0.784 0.975 $18.57"
      },
      {
        "model": "Doubao Seed 2.1 Pro",
        "family": "doubao",
        "cells": "0.747 1.000 0.772 1.000 0.759 1.000 0.647 0.976 0.706 0.990 0.667 1.000 0.778 1.000 0.657 0.988 0.742 0.995 $77.68"
      },
      {
        "model": "Qwen3.7-Plus",
        "family": "qwen",
        "cells": "0.737 1.000 0.807 1.000 0.772 1.000 0.654 0.986 0.696 1.000 0.675 1.000 0.780 1.000 0.665 0.993 0.738 1.000 $8.92"
      },
      {
        "model": "DeepSeek V4 Pro",
        "family": "deepseek",
        "cells": "0.743 0.980 0.753 0.930 0.748 0.955 0.624 0.959 0.714 0.980 0.611 0.940 0.777 0.950 0.617 0.949 0.746 0.965 $3.71"
      },
      {
        "model": "Doubao Seed 2.0 Pro",
        "family": "doubao",
        "cells": "0.731 0.980 0.730 0.990 0.731 0.985 0.592 0.986 0.719 1.000 0.606 0.980 0.760 0.990 0.599 0.983 0.740 0.995 $4.19"
      },
      {
        "model": "MiMo v2.5 Pro",
        "family": "mimo",
        "cells": "0.670 1.000 0.728 0.970 0.699 0.985 0.605 0.962 0.657 0.990 0.621 0.990 0.764 1.000 0.613 0.976 0.710 0.995 $2.68"
      },
      {
        "model": "Qwen3.6-Plus",
        "family": "qwen",
        "cells": "0.541 0.970 0.785 0.990 0.663 0.980 0.622 0.979 0.558 1.000 0.642 0.990 0.802 1.000 0.632 0.985 0.680 1.000 $6.92"
      },
      {
        "model": "MiMo v2 Pro",
        "family": "mimo",
        "cells": "0.652 0.990 0.734 0.970 0.693 0.980 0.593 0.955 0.657 0.990 0.582 0.990 0.752 1.000 0.588 0.972 0.704 0.995 $7.24"
      }
    ],
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
