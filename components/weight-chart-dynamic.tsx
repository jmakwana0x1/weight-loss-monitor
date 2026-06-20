"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { ChartPoint } from "@/lib/chart-data";

const WeightChart = dynamic(
  () => import("./weight-chart").then((m) => m.WeightChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border mb-6 animate-pulse"
        style={{ height: 280, background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
      />
    ),
  }
);

export function WeightChartDynamic(props: { data: ChartPoint[]; goalWeight?: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
    >
      <WeightChart {...props} />
    </motion.div>
  );
}
