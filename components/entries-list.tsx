"use client";

import { useTransition } from "react";
import { Trash2, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteEntry } from "@/app/actions";
import type { WeightEntry } from "@/types/database";

const DAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function EntryRow({ entry, delta, index }: { entry: WeightEntry; delta: number | null; index: number }) {
  const [pending, startTransition] = useTransition();
  const d = new Date(entry.logged_at);

  const arrow = delta === null ? "" : delta < 0 ? "▼" : delta > 0 ? "▲" : "·";
  const deltaColor = delta === null || delta === 0 ? "var(--muted-2)" : delta < 0 ? "var(--accent)" : "var(--danger)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: pending ? 0.35 : 1, x: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.28, delay: index * 0.03, ease: "easeOut" }}
      className="flex items-center gap-3"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "12px 14px" }}
    >
      <div style={{ width: 38, flex: "none", textAlign: "center" }}>
        <div className="font-mono" style={{ fontSize: 9, color: "var(--muted-3)", letterSpacing: ".06em" }}>{DAY[d.getDay()]}</div>
        <div className="font-extrabold" style={{ fontSize: 16, letterSpacing: "-.02em", marginTop: 1 }}>{d.getDate()}</div>
      </div>

      <div style={{ width: 1, height: 26, background: "var(--border-soft)", flex: "none" }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold tabular-nums" style={{ fontSize: 19, letterSpacing: "-.02em" }}>{entry.weight.toFixed(1)}</span>
          {delta !== null && (
            <span className="font-mono" style={{ fontSize: 11, color: deltaColor }}>
              {arrow} {Math.abs(delta).toFixed(1)}
            </span>
          )}
          {entry.body_fat != null && (
            <span className="font-mono" style={{ fontSize: 10, color: "var(--muted-3)" }}>· {entry.body_fat}% BF</span>
          )}
        </div>
        {entry.note && (
          <div className="truncate" style={{ fontSize: 12, color: "#6b7361", marginTop: 2 }}>{entry.note}</div>
        )}
      </div>

      <span className="font-mono" style={{ fontSize: 11, color: "var(--muted-3)", flex: "none" }}>kg</span>

      <button
        onClick={() => startTransition(() => deleteEntry(entry.id))}
        disabled={pending}
        aria-label="Delete entry"
        className="transition-all active:scale-90"
        style={{ color: "var(--muted-3)", flex: "none" }}
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  );
}

export function EntriesList({ entries }: { entries: WeightEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="font-mono text-center" style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: ".1em", padding: "32px 0" }}>
        NO ENTRIES YET — LOG YOUR FIRST WEIGH-IN ABOVE
      </p>
    );
  }

  return (
    <section style={{ marginTop: 18 }}>
      <div className="flex items-center justify-between" style={{ padding: "0 2px 10px" }}>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--muted)" }}>RECENT WEIGH-INS</span>
        <a
          href="/api/export"
          className="flex items-center gap-1.5 font-mono transition-all active:scale-95"
          style={{ fontSize: 10, color: "var(--muted-3)", letterSpacing: ".04em" }}
        >
          <Download size={11} />
          EXPORT CSV
        </a>
      </div>
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {entries.map((entry, i) => {
            const prev = entries[i + 1];
            const delta = prev ? entry.weight - prev.weight : null;
            return <EntryRow key={entry.id} entry={entry} delta={delta} index={i} />;
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
