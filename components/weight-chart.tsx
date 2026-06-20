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

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ChartPoint;
  const ma = point.ma7;
  const raw = point.raw;

  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-xl"
      style={{
        background: "rgba(10,10,10,0.9)",
        borderColor: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="font-medium mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}
      </p>
      {raw !== null && (
        <p className="font-mono tabular-nums" style={{ color: "rgba(255,255,255,0.7)" }}>
          Logged: <span className="font-bold text-white">{raw.toFixed(1)}</span> kg
        </p>
      )}
      {ma !== null && (
        <p className="font-mono tabular-nums mt-0.5" style={{ color: "#a3e635" }}>
          7-day avg: <span className="font-bold">{ma.toFixed(1)}</span> kg
        </p>
      )}
    </div>
  );
}

interface WeightChartProps {
  data: ChartPoint[];
  goalWeight?: number | null;
}

export function WeightChart({ data, goalWeight }: WeightChartProps) {
  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border py-16 mb-6"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
        }}
      >
        <p className="text-sm" style={{ color: "#71717a" }}>
          Log entries on at least 2 different days to see your chart.
        </p>
      </div>
    );
  }

  const weights = data.map((d) => d.raw ?? d.ma7 ?? 0).filter(Boolean);
  const goalInRange = goalWeight && goalWeight > 0;
  const allValues = goalInRange ? [...weights, goalWeight!] : weights;
  const minW = Math.min(...allValues);
  const maxW = Math.max(...allValues);
  const pad = Math.max((maxW - minW) * 0.25, 3);
  const yDomain = [Math.floor(minW - pad), Math.ceil(maxW + pad)];

  const tickCount = Math.min(data.length, 6);

  return (
    <section
      className="rounded-2xl border p-4 pb-2 mb-6"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(20px)",
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-widest mb-4 px-2"
        style={{ color: "#71717a" }}
      >
        Progress
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ma7fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a3e635" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#71717a" }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / tickCount)}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 11, fill: "#71717a" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
          />

          {/* goal line */}
          {goalInRange && (
            <ReferenceLine
              y={goalWeight}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="6 4"
              label={{
                value: `Goal ${goalWeight} kg`,
                position: "insideTopRight",
                fill: "rgba(255,255,255,0.35)",
                fontSize: 10,
              }}
            />
          )}

          {/* raw dots — rendered first so MA line sits on top */}
          <Line
            dataKey="raw"
            stroke="transparent"
            strokeWidth={0}
            dot={{ r: 3, fill: "rgba(255,255,255,0.18)", strokeWidth: 0 }}
            activeDot={false}
            isAnimationActive={false}
          />

          {/* gradient fill under MA line */}
          <Area
            dataKey="ma7"
            fill="url(#ma7fill)"
            stroke="transparent"
            strokeWidth={0}
            type="monotone"
            isAnimationActive={false}
          />

          {/* MA7 bold line — animated draw-in */}
          <Line
            dataKey="ma7"
            stroke="#a3e635"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#a3e635", strokeWidth: 0 }}
            type="monotone"
            isAnimationActive={true}
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}
