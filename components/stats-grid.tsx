"use client";

import { motion } from "framer-motion";
import { CountUp } from "./count-up";
import { type Stats } from "@/lib/stats";
import Link from "next/link";

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const CARD: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
};

function Label({ children, color = "var(--muted-2)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="font-mono" style={{ fontSize: 9, letterSpacing: ".14em", color }}>
      {children}
    </span>
  );
}

function Empty() {
  return <span className="font-extrabold" style={{ fontSize: 30, color: "var(--muted-2)" }}>—</span>;
}

function ProfileHint({ text }: { text: string }) {
  return (
    <Link href="/profile" className="font-mono hover:underline" style={{ fontSize: 9, color: "var(--muted)" }}>
      {text} →
    </Link>
  );
}

function bmiInfo(bmi: number) {
  if (bmi < 18.5) return { cat: "UNDER", color: "#60a5fa" };
  if (bmi < 25) return { cat: "HEALTHY", color: "var(--accent)" };
  if (bmi < 30) return { cat: "ELEVATED", color: "var(--amber)" };
  return { cat: "HIGH", color: "var(--danger)" };
}

interface StatsGridProps {
  stats: Stats;
  goalWeight?: number | null;
  heightCm?: number | null;
  targetDate?: string | null;
  startWeight?: number | null;
}

export function StatsGrid({ stats, goalWeight, heightCm, targetDate, startWeight }: StatsGridProps) {
  const { currentWeight, weeklyRate, bmi, streak, daysToGoal } = stats;
  const gaining = weeklyRate !== null && weeklyRate > 0.02;
  const rateColor = weeklyRate === null ? "var(--muted)" : gaining ? "var(--danger)" : "var(--accent)";
  const bi = bmi !== null ? bmiInfo(bmi) : null;

  const totalLost =
    currentWeight !== null && startWeight != null ? startWeight - currentWeight : null;

  const displayDays =
    daysToGoal ??
    (targetDate ? Math.round((new Date(targetDate).getTime() - Date.now()) / 86400000) : null);

  return (
    <motion.section
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      initial="hidden"
      animate="show"
    >
      {/* row 1 — current + rate */}
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "1.6fr 1fr", marginTop: 10 }}>
        <motion.div variants={cardVariant} className="relative overflow-hidden" style={{ ...CARD, padding: "15px 16px" }}>
          <Label>CURRENT</Label>
          <div className="flex items-end gap-1.5" style={{ marginTop: 6 }}>
            {currentWeight !== null ? (
              <>
                <span
                  className="font-black tabular-nums"
                  style={{ fontSize: 54, lineHeight: 0.85, letterSpacing: "-.04em", color: "var(--accent)", animation: "pulseGlow 3.4s ease-in-out infinite" }}
                >
                  <CountUp to={currentWeight} decimals={1} duration={900} />
                </span>
                <span className="font-mono" style={{ fontSize: 13, color: "var(--muted-2)", marginBottom: 7 }}>kg</span>
              </>
            ) : (
              <Empty />
            )}
          </div>
          <div className="font-mono" style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 9, letterSpacing: ".05em" }}>
            {totalLost !== null && totalLost > 0
              ? `−${totalLost.toFixed(1)} KG SINCE START`
              : "TRACKING STARTED"}
          </div>
        </motion.div>

        <motion.div variants={cardVariant} style={{ ...CARD, padding: "15px 16px" }}>
          <Label>RATE / WK</Label>
          {weeklyRate !== null ? (
            <>
              <div className="flex items-center gap-1" style={{ marginTop: 8 }}>
                <span style={{ fontSize: 18, color: rateColor }}>{gaining ? "▲" : "▼"}</span>
                <span className="font-extrabold tabular-nums" style={{ fontSize: 30, letterSpacing: "-.03em", color: rateColor }}>
                  {gaining ? "+" : "−"}
                  <CountUp to={Math.abs(weeklyRate)} decimals={2} duration={800} />
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 7 }}>KG / WEEK</div>
            </>
          ) : (
            <div className="flex flex-col gap-1" style={{ marginTop: 8 }}>
              <Empty />
              <span className="font-mono" style={{ fontSize: 9, color: "var(--muted-2)" }}>LOG 2+ DAYS</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* row 2 — bmi / streak / to goal */}
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginTop: 10 }}>
        <motion.div variants={cardVariant} style={{ ...CARD, padding: 14 }}>
          <Label>BMI</Label>
          {bmi !== null && bi ? (
            <>
              <div className="font-extrabold" style={{ fontSize: 30, letterSpacing: "-.03em", marginTop: 7 }}>
                <CountUp to={bmi} decimals={1} duration={800} />
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: bi.color, marginTop: 4, letterSpacing: ".08em" }}>{bi.cat}</div>
            </>
          ) : (
            <div className="flex flex-col gap-1" style={{ marginTop: 7 }}>
              <Empty />
              <ProfileHint text={!heightCm ? "Add height" : "Set up"} />
            </div>
          )}
        </motion.div>

        <motion.div variants={cardVariant} style={{ ...CARD, padding: 14 }}>
          <Label>STREAK</Label>
          <div className="flex items-center gap-1.5" style={{ marginTop: 7 }}>
            <span className="font-extrabold tabular-nums" style={{ fontSize: 30, letterSpacing: "-.03em" }}>
              <CountUp to={streak} decimals={0} duration={600} />
            </span>
            {streak > 0 && (
              <svg width="15" height="20" viewBox="0 0 15 20" style={{ transformOrigin: "50% 90%", animation: "flicker 1.4s ease-in-out infinite" }}>
                <path d="M7.5 0C8 4 11 5 11 9c0 1-.4 2-1 2.6.2-1.4-.4-2.6-1.4-3.3.3 2-1 3-2.2 4C5 13.5 4 12.4 4.2 11 2.8 11.8 2 13.3 2 15c0 2.8 2.5 5 5.5 5S13 17.8 13 15c0-3-1.4-4.5-1.4-4.5C13 12 14 11 14 9c0-5-4.5-6.5-6.5-9z" fill="#FFB23E" />
                <path d="M7.5 20C5.6 20 4 18.6 4 16.8c0-1.6 1-2.8 1.8-3.6.1 1 .8 1.8 1.7 2.2 1-.7 1.6-1.6 1.5-2.9.9.7 1.5 1.8 1.5 3.2C10.5 18.6 9.2 20 7.5 20z" fill="var(--accent)" />
              </svg>
            )}
          </div>
          <div className="font-mono" style={{ fontSize: 9, color: "var(--muted-2)", marginTop: 4, letterSpacing: ".08em" }}>DAYS</div>
        </motion.div>

        <motion.div variants={cardVariant} style={{ ...CARD, padding: 14 }}>
          <Label>TO GOAL</Label>
          {displayDays !== null && displayDays > 0 ? (
            <>
              <div className="font-extrabold tabular-nums" style={{ fontSize: 30, letterSpacing: "-.03em", marginTop: 7 }}>
                <CountUp to={displayDays} decimals={0} duration={1000} />
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: "var(--muted-2)", marginTop: 4, letterSpacing: ".08em" }}>DAYS LEFT</div>
            </>
          ) : (
            <div className="flex flex-col gap-1" style={{ marginTop: 7 }}>
              <Empty />
              {!goalWeight ? <ProfileHint text="Add goal" /> : <span className="font-mono" style={{ fontSize: 9, color: "var(--muted-2)" }}>LOG 2+ DAYS</span>}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
