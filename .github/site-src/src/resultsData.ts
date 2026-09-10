import liveTextSummary from "./liveTextSummary.json";
import liveAssemblySummary from "./liveAssemblySummary.json";

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
  "note": "Scores use the fixed 100-case subset; costs are normalized per case across the four evaluation settings. Updated as evaluations complete."
};

if (liveTextSummary.schema_version !== "p3d-live-text-summary-v1" || liveTextSummary.rows.length !== 17) {
  throw new Error("Invalid Text-to-3D live leaderboard summary");
}
if (liveAssemblySummary.schema_version !== "p3d-live-assembly-summary-v1" || liveAssemblySummary.rows.length !== 7) {
  throw new Error("Invalid Assembly-3D live leaderboard summary");
}

export const liveResultTables: ResultSubtable[] = [
  {
    ...liveAssemblySummary.table,
    rows: [...liveAssemblySummary.rows].sort((a, b) => b.score - a.score).map((row) => ({
      model: row.model,
      model_id: row.model_id,
      family: row.family,
      cells: `${row.metrics} ${row.score.toFixed(2)} ${row.cost_usd !== null ? "$" + (row.cost_usd / 100).toFixed(3) : row.estimated_cost_usd != null ? "≈$" + (row.estimated_cost_usd / 100).toFixed(3) : "-"}`,
    })),
  },
  {
    ...textTable,
    rows: liveTextSummary.rows.map((row) => ({
      model: row.model,
      family: row.family,
      cells: `${row.metrics} ${row.score.toFixed(1)} $${(row.cost_usd / 100).toFixed(3)}`,
    })),
  },
];
