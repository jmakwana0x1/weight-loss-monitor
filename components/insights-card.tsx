"use client";

import type { Projection } from "@/lib/regression";
import { TrendingDown, TrendingUp, Target, BarChart2 } from "lucide-react";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatSlope(slope: number) {
  const abs = Math.abs(slope * 7).toFixed(2);
  return `${abs} kg/week`;
}

interface InsightsCardProps {
  projection: Projection;
  goalWeight: number | null;
  currentWeight: number | null;
}

export function InsightsCard({ projection, goalWeight, currentWeight }: InsightsCardProps) {
  const { slope, goalDate, daysToGoal, projectedWeightIn30Days, r2 } = projection;
  const losing = slope < 0;
  const weakFit = r2 < 0.4;

  return (
    <section
      className="rounded-2xl border p-5 mb-6"
      style={{
        background: losing
          ? "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, var(--glass-bg) 60%)"
          : "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, var(--glass-bg) 60%)",
        borderColor: losing ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={14} style={{ color: "var(--muted)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Insights
        </p>
        {weakFit && (
          <span
            className="ml-auto text-xs rounded-full px-2 py-0.5"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}
          >
            low confidence
          </span>
        )}
      </div>

      {/* Main headline */}
      {goalDate && daysToGoal && goalWeight ? (
        <div className="flex items-start gap-3 mb-4">
          <Target size={20} className="mt-0.5 shrink-0" style={{ color: "#22c55e" }} />
          <div>
            <p className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
              On pace to reach{" "}
              <span style={{ color: "#22c55e" }}>{goalWeight} kg</span> by{" "}
              <span style={{ color: "#22c55e" }}>{formatDate(goalDate)}</span>
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              {daysToGoal} days away · losing {formatSlope(slope)}
            </p>
          </div>
        </div>
      ) : losing ? (
        <div className="flex items-start gap-3 mb-4">
          <TrendingDown size={20} className="mt-0.5 shrink-0" style={{ color: "#22c55e" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--foreground)" }}>
              Trending down at {formatSlope(slope)}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              {goalWeight
                ? "You've already reached your goal — set a new one!"
                : "Set a goal weight to see your target date."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp size={20} className="mt-0.5 shrink-0" style={{ color: "#ef4444" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--foreground)" }}>
              Trending up at {formatSlope(slope)}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              Reverse the trend to see a goal projection.
            </p>
          </div>
        </div>
      )}

      {/* 30-day projection pill */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-2.5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}
      >
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          Projected weight in 30 days
        </span>
        <span
          className="font-mono font-bold tabular-nums text-sm"
          style={{
            color:
              currentWeight !== null && projectedWeightIn30Days < currentWeight
                ? "#22c55e"
                : "#ef4444",
          }}
        >
          {projectedWeightIn30Days} kg
        </span>
      </div>
    </section>
  );
}
