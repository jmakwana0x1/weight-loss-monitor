"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { ChartPoint } from "@/lib/chart-data";

const shimmer: React.CSSProperties = {
  background: "linear-gradient(90deg,#121511,#191d14,#121511)",
  backgroundSize: "360px 100%",
  animation: "shimmer 1.3s infinite linear",
};

const WeightChart = dynamic(
  () => import("./weight-chart").then((m) => m.WeightChart),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 248, borderRadius: 14, marginTop: 10, ...shimmer }} />
    ),
  }
);

export function WeightChartDynamic(props: { data: ChartPoint[]; goalWeight?: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      <WeightChart {...props} />
    </motion.div>
  );
}
