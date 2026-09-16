export const TEXT_MODELS: string[];
export function validateTextSummary(summary: unknown): void;
export function textCost(row: { cost_usd: number | null; estimated_cost_usd: number | null; usd_per_generation: number }): string;
export function textNativeRows(summary: unknown): Array<{ model: string; model_id: string; family: string; cells: string }>;
