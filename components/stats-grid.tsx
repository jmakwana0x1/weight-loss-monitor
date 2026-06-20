"use client";

import { CountUp } from "./count-up";
import { bmiCategory, type Stats } from "@/lib/stats";
import Link from "next/link";

function StatCard({
  label,
  children,
  accent,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-4 ${className}`}
      style={{
        background: "var(--glass-bg)",
        borderColor: accent
          ? `color-mix(in srgb, ${accent} 30%, transparent)`
          : "var(--glass-border)",
      }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Empty() {
  return <span className="text-2xl font-bold" style={{ color: "var(--muted)" }}>—</span>;
}

function ProfileHint({ text }: { text: string }) {
  return (
    <Link href="/profile">
      <span className="text-xs underline-offset-2 hover:underline" style={{ color: "var(--muted)" }}>
        {text} →
      </span>
    </Link>
  );
}

interface StatsGridProps {
  stats: Stats;
  goalWeight?: number | null;
  heightCm?: number | null;
}

export function StatsGrid({ stats, goalWeight, heightCm }: StatsGridProps) {
  const { currentWeight, weeklyRate, bmi, streak, daysToGoal } = stats;
  const rateColor = weeklyRate === null ? undefined : weeklyRate <= 0 ? "#22c55e" : "#ef4444";
  const bmiInfo = bmi ? bmiCategory(bmi) : null;

  const goalDate = daysToGoal
    ? new Date(Date.now() + daysToGoal * 86400000).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <section className="mb-6">
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
        Stats
      </p>

      <div className="grid grid-cols-2 gap-2">
        {/* Current weight */}
        <StatCard label="Current weight" accent="var(--accent)" className="col-span-2">
          <div className="flex items-end gap-1">
            {currentWeight !== null ? (
              <>
                <span className="text-5xl font-bold font-mono tabular-nums leading-none" style={{ color: "var(--accent)" }}>
                  <CountUp to={currentWeight} decimals={1} duration={900} />
                </span>
                <span className="text-base mb-1" style={{ color: "var(--muted)" }}>kg</span>
              </>
            ) : (
              <Empty />
            )}
          </div>
        </StatCard>

        {/* Weekly rate */}
        <StatCard label="Weekly rate" accent={rateColor}>
          {weeklyRate !== null ? (
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold font-mono tabular-nums leading-none" style={{ color: rateColor }}>
                {weeklyRate > 0 ? "+" : ""}
                <CountUp to={weeklyRate} decimals={2} duration={800} />
              </span>
              <span className="text-xs mb-1" style={{ color: "var(--muted)" }}>kg/wk</span>
            </div>
          ) : (
            <div>
              <Empty />
              <span className="text-xs mt-1 block" style={{ color: "var(--muted)" }}>
                Log on 2+ days
              </span>
            </div>
          )}
        </StatCard>

        {/* BMI */}
        <StatCard label="BMI" accent={bmiInfo?.color}>
          {bmi !== null && bmiInfo ? (
            <div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold font-mono tabular-nums leading-none" style={{ color: bmiInfo.color }}>
                  <CountUp to={bmi} decimals={1} duration={800} />
                </span>
              </div>
              <span className="text-xs mt-1 block" style={{ color: bmiInfo.color }}>
                {bmiInfo.label}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Empty />
              <ProfileHint text={!heightCm ? "Add your height" : "Set up profile"} />
            </div>
          )}
        </StatCard>

        {/* Streak */}
        <StatCard label="Streak">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold font-mono tabular-nums leading-none" style={{ color: streak > 0 ? "var(--accent)" : "var(--muted)" }}>
              <CountUp to={streak} decimals={0} duration={600} />
            </span>
            <span className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              {streak === 1 ? "day" : "days"}
            </span>
          </div>
          {streak > 2 && (
            <span className="text-xs mt-1" style={{ color: "var(--muted)" }}>🔥 keep it up</span>
          )}
        </StatCard>

        {/* Goal date */}
        <StatCard label="Goal date" className="col-span-2" accent={goalDate ? "#22c55e" : undefined}>
          {goalDate && daysToGoal ? (
            <div className="flex items-center justify-between">
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold font-mono tabular-nums leading-none" style={{ color: "#22c55e" }}>
                  <CountUp to={daysToGoal} decimals={0} duration={1000} />
                </span>
                <span className="text-xs mb-1" style={{ color: "var(--muted)" }}>days left</span>
              </div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                {goalDate}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Empty />
              {!goalWeight ? (
                <ProfileHint text="Add your goal weight" />
              ) : (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  Log on 2+ different days to see projection
                </span>
              )}
            </div>
          )}
        </StatCard>
      </div>
    </section>
  );
}
