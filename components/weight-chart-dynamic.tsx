"use client";

import dynamic from "next/dynamic";
import type { ChartPoint } from "@/lib/chart-data";

const WeightChart = dynamic(
  () => import("./weight-chart").then((m) => m.WeightChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border mb-6 animate-pulse"
        style={{
          height: 280,
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
        }}
      />
    ),
  }
);

export function WeightChartDynamic(props: { data: ChartPoint[]; goalWeight?: number | null }) {
  return <WeightChart {...props} />;
}
