"use client";

import { motion } from "framer-motion";
import { CountUp } from "./count-up";
import type { Projection } from "@/lib/regression";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(d: Date) {
  return `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

interface InsightsCardProps {
  projection: Projection;
  goalWeight: number | null;
  currentWeight: number | null;
  startWeight?: number | null;
}

export function InsightsCard({ projection, goalWeight, currentWeight, startWeight }: InsightsCardProps) {
  const { slope, goalDate } = projection;
  const onPace = slope < 0 && goalDate !== null && goalWeight !== null;

  const progress =
    currentWeight !== null && startWeight != null && goalWeight !== null
      ? Math.max(0, Math.min(1, (startWeight - currentWeight) / ((startWeight - goalWeight) || 1)))
      : 0;
  const progressPct = Math.round(progress * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      style={{
        background: "linear-gradient(180deg,#101309,#0d0f08)",
        border: "1px solid #2b3122",
        borderRadius: 14,
        padding: "16px 17px",
        marginTop: 10,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--accent)" }}>
          PROJECTION · {onPace ? "ON PACE" : "TREND FLAT"}
        </span>
        <span className="font-mono" style={{ fontSize: 10, color: "var(--muted-2)" }}>LINEAR FIT</span>
      </div>

      <div className="font-bold" style={{ fontSize: 21, lineHeight: 1.25, letterSpacing: "-.02em", marginTop: 10 }}>
        {onPace ? (
          <>
            On pace to hit your goal by{" "}
            <span style={{ color: "var(--accent)" }}>{formatDate(goalDate!)}</span>.
          </>
        ) : slope < 0 ? (
          <>You&apos;re trending down — keep logging to project a date.</>
        ) : (
          <>Keep logging to project a date — trend is flat right now.</>
        )}
      </div>

      {currentWeight !== null && goalWeight !== null && (
        <div className="flex items-center gap-3" style={{ marginTop: 14 }}>
          <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>
            {currentWeight.toFixed(1)}&nbsp;&nbsp;→&nbsp;&nbsp;{goalWeight.toFixed(1)}
          </span>
          <div className="flex-1 overflow-hidden" style={{ height: 6, background: "#1c2117", borderRadius: 999 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg,var(--accent-deep),var(--accent))",
                borderRadius: 999,
                boxShadow: "0 0 12px var(--accent-soft)",
              }}
            />
          </div>
          <span className="font-extrabold" style={{ fontSize: 14, color: "var(--accent)" }}>
            <CountUp to={progressPct} decimals={0} duration={1000} />%
          </span>
        </div>
      )}
    </motion.section>
  );
}
