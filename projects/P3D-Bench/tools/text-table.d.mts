export const TEXT_MODELS: string[];
export function validateTextSummary(summary: unknown): void;
export function textCost(row: { cost_usd: number | null; estimated_cost_usd: number | null }): string;
