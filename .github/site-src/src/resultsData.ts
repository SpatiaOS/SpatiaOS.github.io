import liveTextSummary from "./liveTextSummary.json";
import liveAssemblySummary from "./liveAssemblySummary.json";
import liveImageSummary from "./liveImageSummary.json";
import { buildImageTable } from "../../../projects/P3D-Bench/tools/image-table.mjs";
import { buildAssemblyTable } from "../../../projects/P3D-Bench/tools/live-tables.mjs";
import { textBaselineRows, textCost, textMetricsForDisplay } from "../../../projects/P3D-Bench/tools/text-table.mjs";

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


const textTable: ResultSubtable = {
  "key": "text",
  "title": "Text-to-3D",
  "accent": "var(--blue)",
  "superGroups": [
    {
      "label": "Score / Cost",
      "span": 2
    },
    {
      "label": "Descriptive",
      "span": 6
    },
    {
      "label": "Parametric",
      "span": 12
    }
  ],
  "groups": [
    {
      "label": "Fixed 100",
      "span": 2
    },
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
    }
  ],
  "metrics": [
    "Score",
    "USD/gen.",
    "Judge",
    "Valid",
    "Judge",
    "Valid",
    "Judge",
    "Valid",
    "Geo",
    "Judge",
    "Topo",
    "Valid",
    "Geo",
    "Judge",
    "Topo",
    "Valid",
    "Geo",
    "Judge",
    "Topo",
    "Valid"
  ],
  "rows": [],
  "note": ""
};

const textModelIds = ["gpt6_probe", "gemini38_flash", "qwen38max", "grok46", "kimi_k3",
  "claude_opus5", "glm53_official", "deepseek_v41flash", "doubao21", "glm53flash"];
if (liveTextSummary.schema_version !== "p3d-live-text-summary-v2" || liveTextSummary.fixed_denominator !== 100
    || liveTextSummary.rows.length !== 10
    || new Set(liveTextSummary.rows.map(row => row.model_id)).size !== 10
    || liveTextSummary.rows.some(row => !textModelIds.includes(row.model_id))) {
  throw new Error("Invalid Text-to-3D live leaderboard summary");
}
if (liveAssemblySummary.schema_version !== "p3d-live-assembly-summary-v1"
    || liveAssemblySummary.rows.length < 7 || liveAssemblySummary.rows.length > 10) {
  throw new Error("Invalid Assembly-3D live leaderboard summary");
}

export const liveResultTables: ResultSubtable[] = [
  buildAssemblyTable(liveAssemblySummary),
  {
    ...textTable,
    rows: [
      ...liveTextSummary.rows.map((row) => ({
        model: row.model,
        model_id: row.model_id,
        family: row.family,
        cells: `${row.score.toFixed(2)} ${textCost(row)} ${textMetricsForDisplay(row)}`,
      })),
      ...textBaselineRows(liveTextSummary),
    ],
  },
  buildImageTable(liveImageSummary),
];
