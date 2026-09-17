export const TEXT_MODELS: string[];
export const TEXT_MODEL_LABELS: Record<string, string>;
export function validateTextSummary(summary: unknown): void;
export function textBaselineRows(summary: unknown): Array<{ model: string; model_id: string; family: string; cells: string }>;
export function textCost(row: { cost_usd: number | null; estimated_cost_usd: number | null; usd_per_generation: number }): string;
