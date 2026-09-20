export function demoBucketScore(run: { task: string; spec: string; valid: boolean | null; metrics: Record<string, unknown>; buckets?: Record<string, number | null> }, key: string): number | null;
