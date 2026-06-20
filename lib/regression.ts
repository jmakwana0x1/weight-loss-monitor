import type { WeightEntry } from "@/types/database";

export type Projection = {
  slope: number;           // kg/day (negative = losing)
  goalDate: Date | null;   // null if no goal, gaining, or already at goal
  daysToGoal: number | null;
  projectedWeightIn30Days: number;
  r2: number;              // 0–1 goodness of fit
};

export function linearRegression(
  entries: WeightEntry[],
  goalWeight: number | null
): Projection | null {
  if (entries.length < 2) return null;

  // Sort ascending by date
  const sorted = [...entries].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  // Deduplicate to one entry per day (latest reading) — same-day entries with
  // tiny time differences would otherwise distort the regression slope wildly.
  const byDay = new Map<string, WeightEntry>();
  for (const e of sorted) {
    byDay.set(e.logged_at.slice(0, 10), e); // ascending → last overwrites = latest
  }
  const daily = Array.from(byDay.values());

  if (daily.length < 2) return null;

  // x = days since first entry, y = weight
  const t0 = new Date(daily[0].logged_at).getTime();
  const points = daily.map((e) => ({
    x: (new Date(e.logged_at).getTime() - t0) / (1000 * 60 * 60 * 24),
    y: e.weight,
  }));

  const n = points.length;
  const sumX  = points.reduce((s: number, p) => s + p.x, 0);
  const sumY  = points.reduce((s: number, p) => s + p.y, 0);
  const sumXY = points.reduce((s: number, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s: number, p) => s + p.x * p.x, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;

  const slope     = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  // R² — how well the line fits
  const yMean = sumY / n;
  const ssTot = points.reduce((s, p) => s + Math.pow(p.y - yMean, 2), 0);
  const ssRes = points.reduce((s, p) => s + Math.pow(p.y - (slope * p.x + intercept), 2), 0);
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  // Current x = days since t0 to today
  const todayX = (Date.now() - t0) / (1000 * 60 * 60 * 24);
  const projectedWeightIn30Days = slope * (todayX + 30) + intercept;

  // Project goal date
  let goalDate: Date | null = null;
  let daysToGoal: number | null = null;

  if (goalWeight !== null && slope < 0) {
    const currentProjected = slope * todayX + intercept;
    if (currentProjected > goalWeight) {
      // days from today until line crosses goal
      const daysFromT0 = (goalWeight - intercept) / slope;
      const daysLeft = Math.round(daysFromT0 - todayX);
      if (daysLeft > 0) {
        daysToGoal = daysLeft;
        goalDate = new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000);
      }
    }
  }

  return {
    slope,
    goalDate,
    daysToGoal,
    projectedWeightIn30Days: parseFloat(projectedWeightIn30Days.toFixed(1)),
    r2: parseFloat(r2.toFixed(2)),
  };
}
