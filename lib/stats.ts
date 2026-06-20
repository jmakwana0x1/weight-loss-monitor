import type { WeightEntry } from "@/types/database";

export type Stats = {
  currentWeight: number | null;
  weeklyRate: number | null;    // kg/week, negative = loss
  bmi: number | null;
  streak: number;               // consecutive days with an entry
  daysToGoal: number | null;   // positive = future, null if no goal or wrong direction
};

function toDateKey(iso: string) {
  return iso.slice(0, 10);
}

export function computeStats(
  entries: WeightEntry[],
  heightCm: number | null,
  goalWeight: number | null
): Stats {
  if (entries.length === 0) {
    return { currentWeight: null, weeklyRate: null, bmi: null, streak: 0, daysToGoal: null };
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
  );

  const currentWeight = sorted[0].weight;

  // Deduplicate to one entry per day (latest reading) to avoid same-day
  // entries producing artificially tiny time deltas and massive rate numbers.
  const dayMap = new Map<string, WeightEntry>();
  for (const e of sorted) {
    const day = toDateKey(e.logged_at);
    if (!dayMap.has(day)) dayMap.set(day, e); // sorted desc → first = latest
  }
  const daily = Array.from(dayMap.values()); // still sorted desc

  // Weekly rate: slope over last 28 days (or all data if < 28 days)
  const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000;
  const recent = daily.filter((e) => new Date(e.logged_at).getTime() >= cutoff);
  const window = recent.length >= 2 ? recent : daily.length >= 2 ? daily : [];

  let weeklyRate: number | null = null;
  if (window.length >= 2) {
    const newest = window[0];
    const oldest = window[window.length - 1];
    const days =
      (new Date(newest.logged_at).getTime() - new Date(oldest.logged_at).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days > 0) {
      weeklyRate = parseFloat((((newest.weight - oldest.weight) / days) * 7).toFixed(2));
    }
  }

  // BMI
  const bmi =
    heightCm && heightCm > 0
      ? parseFloat((currentWeight / Math.pow(heightCm / 100, 2)).toFixed(1))
      : null;

  // Streak: consecutive days ending today (or yesterday)
  const daySet = new Set(sorted.map((e) => toDateKey(e.logged_at)));
  let streak = 0;
  const today = new Date();
  const d = new Date(today);
  // allow missing today — start from today or yesterday
  if (!daySet.has(toDateKey(d.toISOString()))) d.setDate(d.getDate() - 1);
  while (daySet.has(toDateKey(d.toISOString()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  // Days to goal
  let daysToGoal: number | null = null;
  if (goalWeight && weeklyRate && weeklyRate < 0 && currentWeight > goalWeight) {
    const kgLeft = currentWeight - goalWeight;
    const kgPerDay = Math.abs(weeklyRate) / 7;
    daysToGoal = Math.round(kgLeft / kgPerDay);
  }

  return { currentWeight, weeklyRate, bmi, streak, daysToGoal };
}

export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" };
  if (bmi < 25)   return { label: "Healthy",     color: "#22c55e" };
  if (bmi < 30)   return { label: "Overweight",  color: "#f59e0b" };
  return              { label: "Obese",       color: "#ef4444" };
}
