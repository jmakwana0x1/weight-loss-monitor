"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type { ChartPoint } from "@/lib/chart-data";

const ACCENT = "#c2f23d";

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ChartPoint;

  return (
    <div
      className="font-mono"
      style={{
        background: "#1a1e14",
        border: "1px solid #313829",
        borderRadius: 8,
        padding: "7px 10px",
        boxShadow: "0 8px 20px rgba(0,0,0,.5)",
      }}
    >
      <div style={{ fontSize: 9, color: "var(--muted-2)", letterSpacing: ".1em" }}>{label}</div>
      <div className="flex items-baseline gap-2" style={{ marginTop: 2 }}>
        {point.ma7 !== null && (
          <span className="font-extrabold tabular-nums" style={{ fontSize: 17, letterSpacing: "-.02em", color: "var(--foreground)" }}>
            {point.ma7.toFixed(1)}
          </span>
        )}
        {point.raw !== null && (
          <span style={{ fontSize: 11, color: ACCENT }}>· {point.raw.toFixed(1)} raw</span>
        )}
      </div>
    </div>
  );
}

interface WeightChartProps {
  data: ChartPoint[];
  goalWeight?: number | null;
}

export function WeightChart({ data, goalWeight }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ background: "#0e110a", border: "1px solid var(--border)", borderRadius: 14, padding: "64px 0", marginTop: 10 }}
      >
        <p className="font-mono" style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: ".1em" }}>
          LOG YOUR FIRST WEIGHT TO SEE THE CHART
        </p>
      </div>
    );
  }

  const weights = data.map((d) => d.raw ?? d.ma7 ?? 0).filter(Boolean);
  const goalInRange = goalWeight && goalWeight > 0;
  const allValues = goalInRange ? [...weights, goalWeight!] : weights;
  const minW = Math.min(...allValues);
  const maxW = Math.max(...allValues);
  const pad = Math.max((maxW - minW) * 0.2, 1);
  const yDomain = [Math.floor(minW - pad), Math.ceil(maxW + pad)];
  const tickCount = Math.min(data.length, 4);

  return (
    <section
      className="relative"
      style={{ background: "#0e110a", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 14px 12px", marginTop: 10 }}
    >
      <div className="flex items-center justify-between" style={{ padding: "0 2px" }}>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--muted)" }}>
          WEIGHT · {data.length} DAYS
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span style={{ width: 14, height: 2.5, background: ACCENT, borderRadius: 2 }} />
            <span className="font-mono" style={{ fontSize: 9, color: "var(--muted-2)" }}>7-DAY AVG</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(194,242,61,0.4)" }} />
            <span className="font-mono" style={{ fontSize: 9, color: "var(--muted-2)" }}>DAILY</span>
          </span>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="ma7fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.34} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#4a5043", fontFamily: "var(--font-space-mono)" }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(data.length / tickCount)}
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 9, fill: "#4a5043", fontFamily: "var(--font-space-mono)" }}
              axisLine={false}
              tickLine={false}
              width={34}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(243,245,236,0.22)", strokeWidth: 1, strokeDasharray: "3 3" }} />

            {goalInRange && (
              <ReferenceLine
                y={goalWeight}
                stroke={ACCENT}
                strokeOpacity={0.45}
                strokeDasharray="5 5"
                strokeWidth={1.5}
                label={{
                  value: `${goalWeight} kg`,
                  position: "right",
                  fill: ACCENT,
                  fontSize: 10,
                  fontFamily: "var(--font-space-mono)",
                  fontWeight: 700,
                }}
              />
            )}

            {/* faint raw daily dots */}
            <Line
              dataKey="raw"
              stroke="transparent"
              strokeWidth={0}
              dot={{ r: 2, fill: ACCENT, fillOpacity: 0.34, strokeWidth: 0 }}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* gradient fill */}
            <Area dataKey="ma7" fill="url(#ma7fill)" stroke="transparent" strokeWidth={0} type="monotone" isAnimationActive={false} />

            {/* bold MA7 line */}
            <Line
              dataKey="ma7"
              stroke={ACCENT}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4, fill: ACCENT, stroke: "#0e110a", strokeWidth: 2 }}
              type="monotone"
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
              style={{ filter: "drop-shadow(0 1px 7px var(--accent-soft))" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
