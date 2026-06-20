import type { WeightEntry } from "@/types/database";

export type ChartPoint = {
  label: string;
  raw: number | null;
  ma7: number | null;
};

export function buildChartData(entries: WeightEntry[]): ChartPoint[] {
  if (entries.length === 0) return [];

  const sorted = [...entries].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  // One entry per day — take latest reading per day
  const byDay = new Map<string, number>();
  for (const e of sorted) {
    byDay.set(e.logged_at.slice(0, 10), e.weight);
  }

  const days = Array.from(byDay.keys()).sort();

  return days.map((day, i) => {
    const window = days.slice(Math.max(0, i - 6), i + 1);
    const ma7 =
      parseFloat(
        (window.reduce((s, d) => s + byDay.get(d)!, 0) / window.length).toFixed(2)
      );

    const date = new Date(day + "T00:00:00");
    const label = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    return { label, raw: byDay.get(day) ?? null, ma7 };
  });
}
