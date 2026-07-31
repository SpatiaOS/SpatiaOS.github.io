import type { ResultSubtable } from "./resultsData";

const EXPECTED_RELEASE_ID = "p3d-aaai27-paper-current-v1";
const EXPECTED_PROTOCOL_ID = "p3d-aaai27-paper-protocol-v1";
const EXPECTED_TABLE_KEYS = ["text", "image", "assembly"];

type PaperSnapshot = {
  schema_version: number;
  release_id: string;
  protocol_id: string;
  content_sha256: string;
  result_tables: ResultSubtable[];
};

const PAPER_SCORE_COST: Record<string, Record<string, [number, number]>> = {
  text: {
    "GPT-5.5": [85.4, 1.539],
    "Gemini 3.1 Pro": [84.3, 0.364],
    "Claude Opus 4.6": [84.0, 0.933],
    "Kimi K2.6": [81.5, 0.286],
    "GLM-5.1": [80.1, 0.169],
    "Doubao Seed 2.0 Pro": [76.1, 0.039],
    "DeepSeek V4 Pro": [77.7, 0.035],
    "Qwen3.6-Plus": [75.5, 0.068],
    "MiMo v2.5 Pro": [75.2, 0.025],
  },
  image: {
    "GPT-5.5": [67.5, 2.854],
    "Gemini 3.1 Pro": [66.7, 0.699],
    "Claude Opus 4.6": [62.0, 1.601],
    "Kimi K2.6": [59.2, 0.256],
    "GLM 5V Turbo": [49.1, 0.073],
    "Qwen3.6-Plus": [47.5, 0.098],
    "MiMo v2 Omni": [45.2, 0.006],
    "Doubao Seed 2.0 Pro": [43.7, 0.043],
  },
  assembly: {
    "GPT-5.5": [68.1, 2.221],
    "Gemini 3.1 Pro": [65.9, 0.545],
    "Claude Opus 4.6": [60.0, 1.586],
    "Kimi K2.6": [55.2, 0.381],
    "MiMo v2 Omni": [37.9, 0.008],
    "Qwen3.6-Plus": [36.6, 0.109],
    "GLM 5V Turbo": [34.2, 0.103],
    "Doubao Seed 2.0 Pro": [32.7, 0.041],
  },
};

export async function loadPaperResultTables(url: string): Promise<ResultSubtable[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Paper snapshot request failed (${response.status}).`);
  }
  const text = await response.text();
  const expectedFileHash = import.meta.env.VITE_P3D_SNAPSHOT_SHA256;
  if (!expectedFileHash) {
    throw new Error("Paper snapshot file hash was not embedded at build time.");
  }
  const actualFileHash = await sha256Hex(text);
  if (actualFileHash !== expectedFileHash) {
    throw new Error("Paper snapshot file hash mismatch.");
  }

  const snapshot = JSON.parse(text) as PaperSnapshot;
  if (
    snapshot.schema_version !== 1 ||
    snapshot.release_id !== EXPECTED_RELEASE_ID ||
    snapshot.protocol_id !== EXPECTED_PROTOCOL_ID ||
    !/^[0-9a-f]{64}$/.test(snapshot.content_sha256 || "")
  ) {
    throw new Error("Paper snapshot release contract mismatch.");
  }
  validateResultTables(snapshot.result_tables);
  return withPaperScoreCost(snapshot.result_tables);
}

function withPaperScoreCost(tables: ResultSubtable[]): ResultSubtable[] {
  return tables.map((table) => {
    const summaries = PAPER_SCORE_COST[table.key];
    if (!summaries || table.rows.some((row) => !summaries[row.model])) {
      throw new Error(`Paper snapshot table ${table.key} lacks Score / Cost data.`);
    }
    const summaryGroup = { label: table.key === "text" ? "Paper set" : "Score / Cost", span: 2 };
    return {
      ...table,
      superGroups: table.superGroups
        ? [...table.superGroups, { label: "Score / Cost", span: 2 }]
        : table.superGroups,
      groups: [...table.groups, summaryGroup],
      metrics: [...table.metrics, "Score", "USD / case"],
      rows: table.rows.map((row) => {
        const [score, cost] = summaries[row.model];
        return { ...row, cells: `${row.cells} ${score.toFixed(1)} $${cost.toFixed(3)}` };
      }),
      domainRows: undefined,
    };
  });
}

function validateResultTables(tables: ResultSubtable[]) {
  if (
    !Array.isArray(tables) ||
    tables.length !== EXPECTED_TABLE_KEYS.length ||
    tables.some((table, index) => table?.key !== EXPECTED_TABLE_KEYS[index])
  ) {
    throw new Error("Paper snapshot must contain text, image, and assembly tables.");
  }
  tables.forEach((table) => {
    if (!Array.isArray(table.metrics) || !table.metrics.length || !Array.isArray(table.rows) || !table.rows.length) {
      throw new Error(`Paper snapshot table ${table.key} is incomplete.`);
    }
    const metricCount = table.metrics.length;
    table.rows.forEach((row) => {
      if (!row.model_id) {
        throw new Error(`Paper snapshot table ${table.key} row is missing model_id.`);
      }
    });
    [...table.rows, ...(table.domainRows || [])].forEach((row) => {
      if (!row.model || row.cells.trim().split(/\s+/).length !== metricCount) {
        throw new Error(`Paper snapshot table ${table.key} has an invalid row.`);
      }
    });
  });
}

async function sha256Hex(text: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("This browser cannot verify the paper snapshot.");
  }
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
