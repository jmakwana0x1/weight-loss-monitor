"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteEntry } from "@/app/actions";
import type { WeightEntry } from "@/types/database";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function DeltaBadge({ delta }: { delta: number }) {
  const loss = delta < 0;
  const color = loss ? "#22c55e" : "#ef4444";
  const bg = loss ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)";
  return (
    <span
      className="rounded-lg px-2 py-0.5 text-xs font-mono font-semibold tabular-nums"
      style={{ background: bg, color }}
    >
      {delta > 0 ? "+" : ""}
      {delta.toFixed(1)}
    </span>
  );
}

function EntryRow({
  entry,
  delta,
}: {
  entry: WeightEntry;
  delta: number | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-opacity"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        opacity: pending ? 0.4 : 1,
      }}
    >
      {/* date */}
      <div className="flex-1">
        <p className="text-sm" style={{ color: "var(--foreground)" }}>
          {formatDate(entry.logged_at)}
        </p>
        {entry.note && (
          <p className="mt-0.5 text-xs truncate" style={{ color: "var(--muted)" }}>
            {entry.note}
          </p>
        )}
      </div>

      {/* weight */}
      <span className="font-mono text-xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
        {entry.weight.toFixed(1)}
        <span className="ml-1 text-xs font-normal" style={{ color: "var(--muted)" }}>
          kg
        </span>
      </span>

      {/* delta */}
      <div className="w-14 text-right">
        {delta !== null && <DeltaBadge delta={delta} />}
      </div>

      {/* delete */}
      <button
        onClick={() =>
          startTransition(() => deleteEntry(entry.id))
        }
        disabled={pending}
        className="ml-1 rounded-lg p-1.5 transition-all active:scale-90"
        style={{ color: "var(--muted)" }}
        aria-label="Delete entry"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function EntriesList({ entries }: { entries: WeightEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-sm py-8" style={{ color: "var(--muted)" }}>
        No entries yet — log your first weight above.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <p
        className="text-xs font-medium uppercase tracking-widest mb-2"
        style={{ color: "var(--muted)" }}
      >
        History
      </p>
      {entries.map((entry, i) => {
        const prev = entries[i + 1];
        const delta = prev ? entry.weight - prev.weight : null;
        return <EntryRow key={entry.id} entry={entry} delta={delta} />;
      })}
    </section>
  );
}
